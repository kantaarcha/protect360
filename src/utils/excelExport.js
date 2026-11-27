// Pure JavaScript Zero-Dependency OpenXML (.xlsx) Workbook Exporter for PROTECT360 SmartLog
// Produces a native 2-sheet Excel workbook (Ledger + Summary) with live SUM formulas,
// frozen header row, AutoFilter, styled Navy headers, currency formatting, and full Thai UTF-8 support.

const textEncoder = new TextEncoder();

// Precompute IEEE 802.3 CRC-32 lookup table
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function stripXmlControlChars(str) {
  let out = '';
  for (let i = 0; i < str.length; i += 1) {
    const code = str.charCodeAt(i);
    if (code === 9 || code === 10 || code === 13 || code >= 32) {
      out += str[i];
    }
  }
  return out;
}

function escapeXml(value) {
  return stripXmlControlChars(String(value ?? ''))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function colIndexToLetter(index) {
  let n = index + 1;
  let letters = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

/**
 * Assemble an uncompressed PKZIP archive (STORE method 0) with UTF-8 flag.
 * Fully compatible with Microsoft Excel, Google Sheets, Apple Numbers, and LibreOffice Calc.
 */
function buildZipBlob(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  const now = new Date();
  const dosTime =
    ((now.getHours() & 0x1f) << 11) |
    ((now.getMinutes() & 0x3f) << 5) |
    ((now.getSeconds() >> 1) & 0x1f);
  const dosDate =
    (((Math.max(1980, now.getFullYear()) - 1980) & 0x7f) << 9) |
    (((now.getMonth() + 1) & 0x0f) << 5) |
    (now.getDate() & 0x1f);

  for (const file of files) {
    const nameBytes = textEncoder.encode(file.name);
    const dataBytes = textEncoder.encode(file.content);
    const checksum = crc32(dataBytes);
    const size = dataBytes.length;

    // Local File Header (30 bytes + filename)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // signature
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0x0800, true); // UTF-8 filename flag
    lv.setUint16(8, 0, true); // compression: STORE
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, checksum, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true); // extra length
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    // Central Directory Header (46 bytes + filename)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0x0800, true); // UTF-8 flag
    cv.setUint16(10, 0, true); // STORE
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, checksum, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true); // extra length
    cv.setUint16(32, 0, true); // comment length
    cv.setUint16(34, 0, true); // disk start
    cv.setUint16(36, 0, true); // internal attrs
    cv.setUint32(38, 0, true); // external attrs
    cv.setUint32(42, offset, true); // relative offset
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((acc, part) => acc + part.length, 0);

  // End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return new Blob([...localParts, ...centralParts, eocd], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// Style indices matching xl/styles.xml:
// 0 = default text
// 1 = table header (Deep Navy fill, bold white text, centered)
// 2 = currency number (#,##0.00)
// 3 = signed currency (+#,##0.00;-#,##0.00;0.00)
// 4 = integer centered (#,##0)
// 5 = totals label (soft blue-gray fill, bold navy)
// 6 = totals currency (soft blue-gray fill, bold navy, #,##0.00)
// 7 = totals signed currency (soft blue-gray fill, bold navy, +#,##0.00;-#,##0.00;0.00)
// 8 = section title (bold large navy)
// 9 = muted label
// 10 = decimal 2-digit (0.00)

function renderCell(colIdx, rowNum, cell) {
  const ref = `${colIndexToLetter(colIdx)}${rowNum}`;
  if (cell === null || cell === undefined || cell === '') {
    return `<c r="${ref}" s="0"/>`;
  }

  if (typeof cell === 'object' && cell.formula) {
    const s = cell.style ?? 6;
    const cached = Number.isFinite(cell.value) ? `<v>${cell.value}</v>` : '';
    return `<c r="${ref}" s="${s}"><f>${escapeXml(cell.formula)}</f>${cached}</c>`;
  }

  if (typeof cell === 'object') {
    const s = cell.style ?? 0;
    if (cell.type === 'number') {
      const n = Number(cell.value);
      return `<c r="${ref}" s="${s}"><v>${Number.isFinite(n) ? n : 0}</v></c>`;
    }
    return `<c r="${ref}" t="inlineStr" s="${s}"><is><t xml:space="preserve">${escapeXml(cell.value)}</t></is></c>`;
  }

  if (typeof cell === 'number') {
    return `<c r="${ref}" s="2"><v>${Number.isFinite(cell) ? cell : 0}</v></c>`;
  }

  return `<c r="${ref}" t="inlineStr" s="0"><is><t xml:space="preserve">${escapeXml(cell)}</t></is></c>`;
}

function buildWorksheetXml({ rows, colWidths, freezeTopRow = false, autoFilterRef = null }) {
  const colsXml = colWidths
    .map(
      (w, idx) =>
        `<col min="${idx + 1}" max="${idx + 1}" width="${w}" customWidth="1"/>`
    )
    .join('');

  const sheetViewsXml = freezeTopRow
    ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
    : `<sheetViews><sheetView workbookViewId="0"/></sheetViews>`;

  const sheetDataXml = rows
    .map((rowObj, rIdx) => {
      const rowNum = rIdx + 1;
      const cells = Array.isArray(rowObj) ? rowObj : rowObj.cells;
      const htAttr = !Array.isArray(rowObj) && rowObj.height ? ` ht="${rowObj.height}" customHeight="1"` : '';
      const cellsXml = cells.map((c, cIdx) => renderCell(cIdx, rowNum, c)).join('');
      return `<row r="${rowNum}"${htAttr}>${cellsXml}</row>`;
    })
    .join('');

  const autoFilterXml = autoFilterRef ? `<autoFilter ref="${autoFilterRef}"/>` : '';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  ${sheetViewsXml}
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>${colsXml}</cols>
  <sheetData>${sheetDataXml}</sheetData>
  ${autoFilterXml}
</worksheet>`;
}

function buildStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="3">
    <numFmt numFmtId="164" formatCode="#,##0.00"/>
    <numFmt numFmtId="165" formatCode="+#,##0.00;-#,##0.00;0.00"/>
    <numFmt numFmtId="166" formatCode="#,##0"/>
  </numFmts>
  <fonts count="4">
    <font><sz val="11"/><color rgb="FF142B4A"/><name val="Sarabun"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Sarabun"/></font>
    <font><b/><sz val="11"/><color rgb="FF142B4A"/><name val="Sarabun"/></font>
    <font><b/><sz val="14"/><color rgb="FF142B4A"/><name val="Sarabun"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF142B4A"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFEBF2FC"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="3">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFD8E2F0"/></left>
      <right style="thin"><color rgb="FFD8E2F0"/></right>
      <top style="thin"><color rgb="FFD8E2F0"/></top>
      <bottom style="thin"><color rgb="FFD8E2F0"/></bottom>
      <diagonal/>
    </border>
    <border>
      <left style="thin"><color rgb="FFB9CAE2"/></left>
      <right style="thin"><color rgb="FFB9CAE2"/></right>
      <top style="medium"><color rgb="FF142B4A"/></top>
      <bottom style="double"><color rgb="FF142B4A"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="11">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="164" fontId="2" fillId="3" borderId="2" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="165" fontId="2" fillId="3" borderId="2" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="2" fontId="2" fillId="3" borderId="2" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
  </cellXfs>
</styleSheet>`;
}

/**
 * Generate a Google-Forms-style multi-sheet Excel (.xlsx) Blob for PROTECT360 SmartLog.
 */
export function buildSmartLogExcelBlob({
  transactions = [],
  userProfile = {},
  monthlyIncome = 0,
  monthlyExpenses = 0,
  emergencyFund = 0,
  emergencyRunway = 0,
  lang = 'TH',
  exportDateIso = new Date().toISOString().slice(0, 10),
}) {
  const typeMap = {
    income: lang === 'TH' ? 'รายรับ' : 'Income',
    expense: lang === 'TH' ? 'รายจ่าย' : 'Expense',
    saving: lang === 'TH' ? 'เงินสำรองฉุกเฉิน' : 'Emergency Fund',
  };

  // ---------------- SHEET 1: LEDGER TABLE (Google Forms Spreadsheet Style) ----------------
  const ledgerHeaders = [
    { value: lang === 'TH' ? 'ลำดับ' : 'No.', style: 1 },
    { value: lang === 'TH' ? 'วันที่ (ไทย)' : 'Date (TH)', style: 1 },
    { value: lang === 'TH' ? 'วันที่ (ISO)' : 'ISO Date', style: 1 },
    { value: lang === 'TH' ? 'ประเภท' : 'Type', style: 1 },
    { value: lang === 'TH' ? 'หมวดหมู่' : 'Category', style: 1 },
    { value: lang === 'TH' ? 'รายการ' : 'Description', style: 1 },
    { value: lang === 'TH' ? 'รายรับ (บาท)' : 'Income (THB)', style: 1 },
    { value: lang === 'TH' ? 'รายจ่าย (บาท)' : 'Expense (THB)', style: 1 },
    { value: lang === 'TH' ? 'เงินออมฉุกเฉิน (บาท)' : 'Emergency Savings (THB)', style: 1 },
    { value: lang === 'TH' ? 'กระแสเงินสดสุทธิ (บาท)' : 'Net Cashflow (THB)', style: 1 },
    { value: lang === 'TH' ? 'หมายเหตุ' : 'Note', style: 1 },
  ];

  let sumIncome = 0;
  let sumExpense = 0;
  let sumSaving = 0;
  let sumNet = 0;
  const categoryTotals = new Map();

  const dataRows = transactions.map((tx, idx) => {
    const rawAmt = Number(tx.amount) || 0;
    const absAmt = Math.abs(rawAmt);
    const incVal = tx.category === 'income' ? absAmt : 0;
    const expVal = tx.category === 'expense' ? absAmt : 0;
    const savVal = tx.category === 'saving' ? absAmt : 0;
    const netVal = tx.category === 'income' ? absAmt : -absAmt;

    sumIncome += incVal;
    sumExpense += expVal;
    sumSaving += savVal;
    sumNet += netVal;

    const catLabel =
      (lang === 'TH' ? tx.categoryLabel?.th : tx.categoryLabel?.en) ||
      tx.categoryLabel?.th ||
      tx.categoryLabel?.en ||
      typeMap[tx.category] ||
      tx.category;

    const catKey = `${typeMap[tx.category] || tx.category} • ${catLabel}`;
    const prevCat = categoryTotals.get(catKey) || { count: 0, total: 0 };
    categoryTotals.set(catKey, { count: prevCat.count + 1, total: prevCat.total + absAmt });

    return [
      { type: 'number', value: idx + 1, style: 4 },
      { value: tx.date?.th || tx.date?.en || tx.isoDate || '', style: 0 },
      { value: tx.isoDate || exportDateIso, style: 0 },
      { value: typeMap[tx.category] || tx.category, style: 0 },
      { value: catLabel, style: 0 },
      { value: (lang === 'TH' ? tx.title?.th : tx.title?.en) || tx.title?.th || tx.title?.en || '', style: 0 },
      { type: 'number', value: incVal, style: 2 },
      { type: 'number', value: expVal, style: 2 },
      { type: 'number', value: savVal, style: 2 },
      { type: 'number', value: netVal, style: 3 },
      { value: (lang === 'TH' ? tx.note?.th : tx.note?.en) || tx.note?.th || tx.note?.en || '', style: 0 },
    ];
  });

  const lastDataRowNum = dataRows.length + 1;
  const hasData = dataRows.length > 0;
  const totalRow = {
    height: 24,
    cells: [
      { value: '', style: 5 },
      { value: '', style: 5 },
      { value: '', style: 5 },
      { value: '', style: 5 },
      { value: '', style: 5 },
      { value: lang === 'TH' ? `รวมทั้งหมด (${transactions.length} รายการ)` : `Total (${transactions.length} entries)`, style: 5 },
      hasData ? { formula: `SUM(G2:G${lastDataRowNum})`, value: sumIncome, style: 6 } : { type: 'number', value: 0, style: 6 },
      hasData ? { formula: `SUM(H2:H${lastDataRowNum})`, value: sumExpense, style: 6 } : { type: 'number', value: 0, style: 6 },
      hasData ? { formula: `SUM(I2:I${lastDataRowNum})`, value: sumSaving, style: 6 } : { type: 'number', value: 0, style: 6 },
      hasData ? { formula: `SUM(J2:J${lastDataRowNum})`, value: sumNet, style: 7 } : { type: 'number', value: 0, style: 7 },
      { value: '', style: 5 },
    ],
  };

  const sheet1Xml = buildWorksheetXml({
    rows: [{ height: 26, cells: ledgerHeaders }, ...dataRows, totalRow],
    colWidths: [8, 16, 13, 18, 22, 34, 16, 16, 20, 20, 32],
    freezeTopRow: true,
    autoFilterRef: `A1:K${Math.max(1, lastDataRowNum)}`,
  });

  // ---------------- SHEET 2: SUMMARY OVERVIEW ----------------
  const ownerName =
    [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ').trim() || 'First Jobber';

  const summaryRows = [
    {
      height: 28,
      cells: [
        {
          value:
            lang === 'TH'
              ? 'PROTECT360 — สรุปบัญชีรายรับ-รายจ่าย (รูปแบบตาราง Excel)'
              : 'PROTECT360 — Cashflow & Reserve Summary Report',
          style: 8,
        },
      ],
    },
    [
      { value: lang === 'TH' ? 'ชื่อผู้ใช้' : 'Owner', style: 9 },
      { value: ownerName, style: 0 },
      { value: lang === 'TH' ? 'วันที่ส่งออก' : 'Export Date', style: 9 },
      { value: exportDateIso, style: 0 },
    ],
    [],
    {
      height: 24,
      cells: [
        { value: lang === 'TH' ? 'ตัวชี้วัดภาพรวม' : 'Summary Metric', style: 1 },
        { value: lang === 'TH' ? 'จำนวนเงิน / ค่า' : 'Amount / Value', style: 1 },
        { value: lang === 'TH' ? 'หน่วย' : 'Unit', style: 1 },
      ],
    },
    [
      { value: lang === 'TH' ? 'รายรับรวม (จากรายการที่ส่งออก)' : 'Total Income (Exported Rows)', style: 9 },
      { type: 'number', value: sumIncome, style: 2 },
      { value: 'THB', style: 0 },
    ],
    [
      { value: lang === 'TH' ? 'รายจ่ายรวม (จากรายการที่ส่งออก)' : 'Total Expenses (Exported Rows)', style: 9 },
      { type: 'number', value: sumExpense, style: 2 },
      { value: 'THB', style: 0 },
    ],
    [
      { value: lang === 'TH' ? 'ยอดโอนออมเงินสำรองฉุกเฉิน (จากรายการที่ส่งออก)' : 'Emergency Savings Logged', style: 9 },
      { type: 'number', value: sumSaving, style: 2 },
      { value: 'THB', style: 0 },
    ],
    [
      { value: lang === 'TH' ? 'กระแสเงินสดสุทธิ (รายรับ - รายจ่าย - ออม)' : 'Net Cashflow', style: 5 },
      { type: 'number', value: sumNet, style: 7 },
      { value: 'THB', style: 5 },
    ],
    [
      { value: lang === 'TH' ? 'รายรับต่อเดือน (โปรไฟล์ปัจจุบัน)' : 'Current Monthly Income', style: 9 },
      { type: 'number', value: Number(monthlyIncome) || 0, style: 2 },
      { value: 'THB / mo', style: 0 },
    ],
    [
      { value: lang === 'TH' ? 'รายจ่ายต่อเดือน (โปรไฟล์ปัจจุบัน)' : 'Current Monthly Expenses', style: 9 },
      { type: 'number', value: Number(monthlyExpenses) || 0, style: 2 },
      { value: 'THB / mo', style: 0 },
    ],
    [
      { value: lang === 'TH' ? 'เงินสำรองฉุกเฉินสะสมทั้งหมด' : 'Total Liquid Emergency Fund', style: 9 },
      { type: 'number', value: Number(emergencyFund) || 0, style: 2 },
      { value: 'THB', style: 0 },
    ],
    [
      { value: lang === 'TH' ? 'ระยะเวลารอดชีวิต (Emergency Runway)' : 'Emergency Runway', style: 5 },
      { type: 'number', value: Number(emergencyRunway) || 0, style: 10 },
      { value: lang === 'TH' ? 'เดือน' : 'months', style: 5 },
    ],
    [],
    {
      height: 24,
      cells: [
        { value: lang === 'TH' ? 'สรุปแยกตามหมวดหมู่' : 'Breakdown by Category', style: 1 },
        { value: lang === 'TH' ? 'จำนวนรายการ' : 'Entries', style: 1 },
        { value: lang === 'TH' ? 'ยอดรวม (บาท)' : 'Total (THB)', style: 1 },
      ],
    },
    ...Array.from(categoryTotals.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .map(([label, stat]) => [
        { value: label, style: 0 },
        { type: 'number', value: stat.count, style: 4 },
        { type: 'number', value: stat.total, style: 2 },
      ]),
  ];

  const sheet2Xml = buildWorksheetXml({
    rows: summaryRows,
    colWidths: [42, 20, 18, 16],
    freezeTopRow: false,
  });

  const sheet1Name = lang === 'TH' ? 'บัญชีรับ-จ่าย 360Flow' : '360Flow Ledger';
  const sheet2Name = lang === 'TH' ? 'สรุปภาพรวม' : 'Summary';

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sheet1Name)}" sheetId="1" r:id="rId1"/>
    <sheet name="${escapeXml(sheet2Name)}" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  return buildZipBlob([
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: rootRelsXml },
    { name: 'xl/workbook.xml', content: workbookXml },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRelsXml },
    { name: 'xl/styles.xml', content: buildStylesXml() },
    { name: 'xl/worksheets/sheet1.xml', content: sheet1Xml },
    { name: 'xl/worksheets/sheet2.xml', content: sheet2Xml },
  ]);
}

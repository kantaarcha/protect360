let workerPromise = null;
let progressCallback = null;
let recognizeChain = Promise.resolve();

function toArabicDigits(text) {
  const thaiDigits = '๐๑๒๓๔๕๖๗๘๙';
  return String(text || '').replace(/[๐-๙]/g, (d) => String(thaiDigits.indexOf(d)));
}

function isLikelyYearOrTime(rawToken, line) {
  const trimmed = rawToken.trim();
  // Exclude Buddhist / Gregorian years like 2568, 2569, 2025, 2026 when no decimal
  if (!trimmed.includes('.')) {
    const num = Number(trimmed.replace(/,/g, ''));
    if ((num >= 2555 && num <= 2585) || (num >= 2015 && num <= 2040)) {
      return true;
    }
  }
  // Exclude clock time like 14:32 or 14.32 followed by น.
  if (new RegExp(`${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*น\\.`).test(line)) {
    return true;
  }
  return false;
}

function parseNumericToken(token) {
  if (!token) return null;
  let cleaned = token.replace(/\s+/g, '').replace(/[฿,]/g, '');
  const val = Number(cleaned);
  if (!Number.isFinite(val) || val <= 0 || val > 50000000) return null;
  return val;
}

function extractNumbersFromLine(line, { requireDecimals = false } = {}) {
  // Normalize OCR spaces around decimal point: "343 . 00" -> "343.00"
  const normalized = toArabicDigits(line)
    .replace(/(\d)\s*\.\s*(\d{2})(?!\d)/g, '$1.$2')
    .replace(/(\d),(\d{2})(?:\s*(?:บาท|baht|thb)|$)/gi, '$1.$2');

  // Remove obvious time strings (14:32, 08:15) and masked account numbers (xxx-x-x1234-x)
  const sanitized = normalized
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, ' ')
    .replace(/[xX*]{2,}[-0-9xX*]+/g, ' ')
    .replace(/\b\d{3}-\d-\d{5}-\d\b/g, ' ')
    .replace(/\b\d{10,}\b/g, ' ');

  const pattern = requireDecimals
    ? /(?:^|[^\d.])(\d{1,3}(?:,\d{3})*\.\d{2}|\d+\.\d{2})(?!\d)/g
    : /(?:^|[^\d.])(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)(?!\d)/g;

  const matches = [];
  let m;
  while ((m = pattern.exec(sanitized)) !== null) {
    const token = m[1];
    if (isLikelyYearOrTime(token, sanitized)) continue;
    const val = parseNumericToken(token);
    if (val !== null) {
      matches.push({ token, val, hasDecimal: token.includes('.') });
    }
  }
  return matches;
}

function detectBankName(text) {
  const lower = text.toLowerCase();
  if (/k\s*plus|kbank|กสิกร|k\+/i.test(text)) return 'K PLUS';
  if (/make\s*by\s*kbank/i.test(lower)) return 'MAKE by KBank';
  if (/scb|ไทยพาณิชย์/i.test(text)) return 'SCB EASY';
  if (/krungthai|กรุงไทย|ktb/i.test(text)) return 'Krungthai NEXT';
  if (/bangkok\s*bank|บัวหลวง|กรุงเทพ/i.test(text)) return 'Bualuang';
  if (/ttb|ทหารไทย|ธนชาต/i.test(text)) return 'ttb touch';
  if (/krungsri|กรุงศรี/i.test(text)) return 'Krungsri';
  if (/mymo|ออมสิน|gsb/i.test(text)) return 'GSB MyMo';
  if (/truemoney|ทรูมันนี่/i.test(text)) return 'TrueMoney';
  if (/promptpay|พร้อมเพย์/i.test(text)) return 'PromptPay';
  return 'Bank Slip';
}

function detectCategoryAndTitle(text, bankName) {
  const lower = text.toLowerCase();

  // Income clues
  if (/เงินเดือน|salary|payroll|โบนัส|bonus|รับเงินเข้า/i.test(text)) {
    return {
      category: 'income',
      iconKey: 'salary',
      title: { th: `รายรับจากสลิป (${bankName})`, en: `Income Slip (${bankName})` },
      matchedKeyword: true,
    };
  }

  // Emergency saving clues
  if (/ออมฉุกเฉิน|เงินสำรอง|เงินออม|kept|saving|emergency\s*fund|ฝากประจำ/i.test(text)) {
    return {
      category: 'saving',
      iconKey: 'saving',
      title: { th: `โอนออมฉุกเฉิน (${bankName})`, en: `Emergency Saving (${bankName})` },
      matchedKeyword: true,
    };
  }

  // Housing & utilities clues
  if (/ค่าเช่า|หอพัก|คอนโด|การไฟฟ้า|กฟน|กฟภ|การประปา|ค่าน้ำ|ค่าไฟ|rent|electric|water\s*bill|mea|pea/i.test(text)) {
    return {
      category: 'housing',
      categoryType: 'expense',
      iconKey: 'housing',
      title: { th: `ค่าที่พัก / บิล (${bankName})`, en: `Housing / Utility Bill (${bankName})` },
      matchedKeyword: true,
    };
  }

  // Transport clues
  if (/bts|mrt|grab|bolt|ปตท|ptt|bangchak|บางจาก|shell|น้ำมัน|ทางด่วน|easy\s*pass|รถไฟฟ้า/i.test(text)) {
    return {
      category: 'expense',
      iconKey: 'transport',
      title: { th: `ค่าเดินทาง (${bankName})`, en: `Transport (${bankName})` },
      matchedKeyword: true,
    };
  }

  // Food & coffee clues
  if (/กาแฟ|coffee|cafe|amazon|starbucks|อาหาร|ก๋วยเตี๋ยว|ข้าว|grabfood|lineman|foodpanda|7-eleven|cp\s*all|เซเว่น|mk|kfc|mcdonald|suki|bakery|ชาไข่มุก/i.test(lower)) {
    return {
      category: 'expense',
      iconKey: 'food',
      title: { th: `อาหาร & เครื่องดื่ม (${bankName})`, en: `Food & Dining (${bankName})` },
      matchedKeyword: true,
    };
  }

  // Lifestyle / shopping / telecom clues
  if (/shopee|lazada|tiktok|ais|dtac|true\s*corp|netflix|spotify|apple|uniqlo|watsons|boots|major|cinema/i.test(lower)) {
    return {
      category: 'expense',
      iconKey: 'lifestyle',
      title: { th: `ช้อปปิ้ง & ไลฟ์สไตล์ (${bankName})`, en: `Shopping & Lifestyle (${bankName})` },
      matchedKeyword: true,
    };
  }

  // Neutral fallback — never falsely claim "Food & Coffee" when unknown!
  return {
    category: 'expense',
    iconKey: 'lifestyle',
    title: {
      th: bankName === 'Bank Slip' ? 'รายการโอนเงินจากสลิป' : `โอนเงินผ่าน ${bankName}`,
      en: bankName === 'Bank Slip' ? 'Scanned Bank Transfer' : `${bankName} Transfer`,
    },
    matchedKeyword: false,
  };
}

/**
 * Pure parser for Thai/English bank slip OCR text.
 * Extracts real amount (including small amounts like 7 / 7.00 or 343 / 343.00),
 * bank tag, and best-fit category without fabricating fake fallback numbers.
 */
export function parseThaiSlipText(rawText) {
  const text = toArabicDigits(rawText || '');
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const bankName = detectBankName(text);
  const detected = detectCategoryAndTitle(text, bankName);
  const category = detected.category === 'housing' ? 'expense' : detected.category;

  const isFeeOrNoiseLine = (line) =>
    /ค่าธรรมเนียม|ธรรมเนียม|fee|รหัสอ้างอิง|เลขที่รายการ|เลขที่อ้างอิง|ref\.?\s*(?:no|id|code)?|transaction\s*id/i.test(
      line
    );

  const isAmountKeywordLine = (line) =>
    /จำนวน|จํานวน|จานวน|ยอดโอน|ยอดเงิน|ยอดชำระ|ยอดสุทธิ|amount|total|บาท|บาก|baht|thb|฿/i.test(
      line
    );

  let amount = null;

  // Priority 1: Keyword-anchored amount (same line or immediate next line)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (isFeeOrNoiseLine(line)) continue;
    if (!isAmountKeywordLine(line)) continue;

    // Prefer decimal match on the same line first
    const sameLineDec = extractNumbersFromLine(line, { requireDecimals: true });
    if (sameLineDec.length > 0) {
      amount = sameLineDec[0].val;
      break;
    }

    // Then any clean number on same line (e.g. "จำนวน 343 บาท" or "฿7")
    const sameLineAny = extractNumbersFromLine(line, { requireDecimals: false });
    if (sameLineAny.length > 0) {
      amount = sameLineAny[0].val;
      break;
    }

    // Or number on the immediately following line (common on K+ / SCB two-line layout)
    if (i + 1 < lines.length && !isFeeOrNoiseLine(lines[i + 1])) {
      const nextLineDec = extractNumbersFromLine(lines[i + 1], { requireDecimals: true });
      if (nextLineDec.length > 0) {
        amount = nextLineDec[0].val;
        break;
      }
      const nextLineAny = extractNumbersFromLine(lines[i + 1], { requireDecimals: false });
      if (nextLineAny.length > 0) {
        amount = nextLineAny[0].val;
        break;
      }
    }
  }

  // Priority 2: First non-zero 2-decimal currency amount anywhere (e.g., "343.00", "7.00")
  if (amount === null) {
    for (const line of lines) {
      if (isFeeOrNoiseLine(line)) continue;
      const decimals = extractNumbersFromLine(line, { requireDecimals: true });
      if (decimals.length > 0) {
        amount = decimals[0].val;
        break;
      }
    }
  }

  // Priority 3: Standalone number immediately adjacent to บาท / THB / ฿ anywhere in full text
  if (amount === null) {
    const currencyRegex =
      /(?:฿|THB|thb)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)|(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)\s*(?:บาท|baht|THB|thb)/g;
    let m;
    while ((m = currencyRegex.exec(text)) !== null) {
      const val = parseNumericToken(m[1] || m[2]);
      if (val !== null) {
        amount = val;
        break;
      }
    }
  }

  // Format clean string (keep decimals only if non-integer like 343.50, else clean "343" or "7")
  const formattedAmount =
    amount !== null
      ? Number.isInteger(amount)
        ? String(amount)
        : amount.toFixed(2)
      : '';

  return {
    amount: formattedAmount,
    amountDetected: amount !== null,
    bankTag: bankName,
    category,
    iconKey: detected.iconKey,
    title: detected.title,
    rawText: lines.join('\n'),
  };
}

/**
 * Preprocesses a bank slip image on an offscreen canvas:
 * - Scales to optimal OCR width (900–1250px)
 * - Converts to grayscale and lifts light watermark backgrounds to crisp white
 */
async function preprocessSlipImage(file) {
  const objectUrl = window.URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = objectUrl;
    });

    const targetW = Math.min(1250, Math.max(900, img.naturalWidth || 1000));
    const scale = targetW / (img.naturalWidth || targetW);
    const width = Math.round((img.naturalWidth || targetW) * scale);
    const height = Math.round((img.naturalHeight || targetW) * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return file;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const d = imageData.data;

    // Detect Dark Mode slip screenshots (e.g., dark K+ / SCB / TrueMoney) by average luminance
    let lumSum = 0;
    const pixelCount = d.length / 4;
    for (let i = 0; i < d.length; i += 16) {
      lumSum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }
    const avgLum = lumSum / (pixelCount / 4);
    const isDarkSlip = avgLum < 118;

    // Gentle contrast stretch + light watermark suppression (always outputs dark text on white)
    for (let i = 0; i < d.length; i += 4) {
      let lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      if (isDarkSlip) {
        lum = 255 - lum;
      }
      let out;
      if (lum > 214) {
        out = 255;
      } else {
        out = Math.max(0, Math.min(255, (lum - 32) * 1.35));
      }
      d[i] = out;
      d[i + 1] = out;
      d[i + 2] = out;
    }
    ctx.putImageData(imageData, 0, 0);

    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob || file), 'image/png');
    });
  } catch {
    return file;
  } finally {
    window.URL.revokeObjectURL(objectUrl);
  }
}

async function getOcrWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker, OEM } = await import('tesseract.js');
      const logger = (msg) => {
        if (progressCallback && msg && typeof msg.progress === 'number') {
          progressCallback({
            status: msg.status || 'recognizing',
            progress: Math.round(msg.progress * 100),
          });
        }
      };
      try {
        return await createWorker(['tha', 'eng'], OEM.LSTM_ONLY, { logger });
      } catch {
        // Fallback to English-only worker if Thai model fails to fetch
        return await createWorker('eng', OEM.LSTM_ONLY, { logger });
      }
    })().catch((err) => {
      workerPromise = null;
      throw err;
    });
  }
  return workerPromise;
}

/**
 * Runs 100% on-device OCR (no server upload) on a Thai bank slip image.
 */
export async function scanBankSlipOnDevice(file, onProgress) {
  const runTask = async () => {
    progressCallback = onProgress || null;
    try {
      onProgress?.({ status: 'preprocessing', progress: 10 });
      const processed = await preprocessSlipImage(file);

      onProgress?.({ status: 'loading', progress: 25 });
      const worker = await getOcrWorker();

      const { data } = await worker.recognize(processed);
      let parsed = parseThaiSlipText(data?.text || '');

      // Fallback pass on raw image if preprocessing suppressed a colored/gradient amount banner
      if (!parsed.amountDetected && processed !== file) {
        onProgress?.({ status: 'recognizing', progress: 85 });
        const rawResult = await worker.recognize(file);
        const rawParsed = parseThaiSlipText(rawResult?.data?.text || '');
        if (rawParsed.amountDetected) {
          parsed = {
            ...rawParsed,
            bankTag: rawParsed.bankTag !== 'Bank Slip' ? rawParsed.bankTag : parsed.bankTag,
          };
        }
      }

      return parsed;
    } finally {
      progressCallback = null;
    }
  };

  const resultPromise = recognizeChain.then(runTask, runTask);
  recognizeChain = resultPromise.catch(() => {});
  return resultPromise;
}

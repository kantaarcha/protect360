import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Coffee,
  ImagePlus,
  PenLine,
  PiggyBank,
  ScanLine,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrainFront,
  Trash2,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import { scanBankSlipOnDevice } from '../utils/slipOcr';
import LiquidTabs from '../components/LiquidTabs';

const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const EN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatBilingualDate(isoStr) {
  const parts = String(isoStr || getTodayIso()).split('-').map(Number);
  const year = parts[0] || 2026;
  const monthIdx = Math.min(11, Math.max(0, (parts[1] || 1) - 1));
  const day = parts[2] || 1;
  return {
    th: `${day} ${THAI_MONTHS_SHORT[monthIdx]} ${year + 543}`,
    en: `${day} ${EN_MONTHS_SHORT[monthIdx]} ${year}`,
  };
}

const CATEGORIES = [
  {
    key: 'food',
    type: 'expense',
    icon: Coffee,
    label: { th: 'อาหาร & เครื่องดื่ม', en: 'Food & Dining' },
    barColor: '#2878C8',
  },
  {
    key: 'housing',
    type: 'expense',
    icon: Building2,
    label: { th: 'ที่พัก & สาธารณูปโภค', en: 'Housing & Bills' },
    barColor: '#142B4A',
  },
  {
    key: 'transport',
    type: 'expense',
    icon: TrainFront,
    label: { th: 'เดินทาง / BTS', en: 'Transport / BTS' },
    barColor: '#22B8A7',
  },
  {
    key: 'lifestyle',
    type: 'expense',
    icon: ShoppingBag,
    label: { th: 'ไลฟ์สไตล์', en: 'Lifestyle' },
    barColor: '#6388C6',
  },
  {
    key: 'saving',
    type: 'saving',
    icon: PiggyBank,
    label: { th: 'เงินออมฉุกเฉิน', en: 'Emergency Fund' },
    barColor: '#22B8A7',
  },
  {
    key: 'salary',
    type: 'income',
    icon: Wallet,
    label: { th: 'เงินเดือน / รายได้เสริม', en: 'Salary & Income' },
    barColor: '#31A879',
  },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

const SLIP_PRESETS = [
  {
    id: 'preset-salary',
    title: { th: 'เงินเดือนเข้าบัญชี', en: 'Monthly Payroll Deposit' },
    note: { th: 'สลิปเงินเดือนเข้า • Payroll Direct', en: 'Payroll Slip • Direct Deposit' },
    bankTag: 'K+ Payroll',
    category: 'income',
    iconKey: 'salary',
    amount: 25000,
    pillLabel: { th: 'รายรับ', en: 'Income' },
    chipTitle: { th: 'สลิปเงินเดือนเข้า', en: 'Salary Slip' },
  },
  {
    id: 'preset-emergency',
    title: { th: 'โอนออมเงินสำรองฉุกเฉิน', en: 'Emergency Fund Transfer' },
    note: { th: 'โอนเข้าบัญชีออมฉุกเฉินอัตโนมัติ', en: 'PromptPay to Emergency Savings' },
    bankTag: 'Kept / PromptPay',
    category: 'saving',
    iconKey: 'saving',
    amount: 2500,
    pillLabel: { th: 'เงินสำรองฉุกเฉิน', en: 'Emergency Fund' },
    chipTitle: { th: 'สลิปโอนออมฉุกเฉิน', en: 'Emergency Saving Slip' },
  },
  {
    id: 'preset-food',
    title: { th: 'ค่าอาหาร & กาแฟ', en: 'Food & Coffee' },
    note: { th: 'สแกนจ่าย PromptPay ร้านอาหาร/คาเฟ่', en: 'PromptPay QR • Cafe & Meal' },
    bankTag: 'SCB EASY',
    category: 'expense',
    iconKey: 'food',
    amount: 180,
    pillLabel: { th: 'รายจ่าย', en: 'Expense' },
    chipTitle: { th: 'สลิปค่าอาหาร & กาแฟ', en: 'Food & Coffee Slip' },
  },
  {
    id: 'preset-rent',
    title: { th: 'ค่าที่พัก / บิลรายเดือน', en: 'Rent & Monthly Bills' },
    note: { th: 'โอนชำระค่าเช่าห้องและค่าน้ำไฟ', en: 'Monthly Rent & Utilities Transfer' },
    bankTag: 'K+ Mobile',
    category: 'expense',
    iconKey: 'housing',
    amount: 6500,
    pillLabel: { th: 'รายจ่าย', en: 'Expense' },
    chipTitle: { th: 'สลิปค่าที่พัก/บิลรายเดือน', en: 'Rent & Bills Slip' },
  },
];

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

export default function AutoKey({ onNavigate }) {
  const { lang, t } = useLanguage();
  const {
    userProfile,
    monthlyIncome,
    monthlyExpenses,
    emergencyFund,
    emergencyTarget,
    emergencyRunway,
    emergencyProgress,
    selfPaidPremium,
    transactions,
    addTransaction,
    removeTransaction,
  } = useFinance();

  // Input studio tabs: 'slip' | 'manual'
  const [inputMode, setInputMode] = useState('slip');

  // Smart Slip Reader state (Real On-Device OCR + 1-Click Presets)
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLabel, setScanLabel] = useState('');
  const [extractedSlip, setExtractedSlip] = useState(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState(null);
  const slipFileInputRef = useRef(null);
  const scanTimerRef = useRef(null);
  const previewUrlRef = useRef(null);
  const scanRunIdRef = useRef(0);

  // Manual Entry state
  const [manualType, setManualType] = useState('expense');
  const [manualCatKey, setManualCatKey] = useState('food');
  const [manualAmount, setManualAmount] = useState('');
  const [manualNote, setManualNote] = useState('');
  const [manualDate, setManualDate] = useState(getTodayIso);

  // Ledger state
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState('all');
  const [confirmDeleteTxId, setConfirmDeleteTxId] = useState(null);

  // Clean up scan timer and preview object URL ONLY on unmount (never cancel active scan on state update!)
  useEffect(() => {
    return () => {
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
      if (previewUrlRef.current) window.URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // Derived KPI metrics
  const targetMonths = userProfile.emergencyTargetMonths || 3;
  const netSavings = monthlyIncome - monthlyExpenses;
  const netSavingsRate =
    monthlyIncome > 0 ? Math.round((netSavings / monthlyIncome) * 100) : 0;
  const expenseRatio =
    monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0;

  const safeBudgetMin = Math.round(monthlyIncome * 0.1);
  const safeBudgetMax = Math.round(monthlyIncome * 0.15);
  const remainingEmergency = Math.max(0, emergencyTarget - emergencyFund);
  const isEmergencyReady = emergencyRunway >= targetMonths;

  // Spending Breakdown by category (live from expense transactions)
  const spendingBreakdown = useMemo(() => {
    const totals = {};
    let totalTrackedExpenses = 0;

    for (const tx of transactions) {
      if (tx.category !== 'expense') continue;
      const key = CATEGORY_MAP[tx.iconKey] ? tx.iconKey : 'lifestyle';
      const amt = Math.abs(Number(tx.amount) || 0);
      totals[key] = (totals[key] || 0) + amt;
      totalTrackedExpenses += amt;
    }

    const expenseCategories = CATEGORIES.filter((c) => c.type === 'expense');
    const items = expenseCategories
      .map((cat) => {
        const amount = totals[cat.key] || 0;
        const pct =
          totalTrackedExpenses > 0
            ? Math.round((amount / totalTrackedExpenses) * 100)
            : 0;
        return {
          ...cat,
          amount,
          pct,
        };
      })
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    return { items, totalTrackedExpenses };
  }, [transactions]);

  // Filtered ledger transactions
  const filteredTransactions = useMemo(() => {
    const q = ledgerSearch.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (ledgerFilter !== 'all' && tx.category !== ledgerFilter) return false;
      if (!q) return true;
      const hay = [
        tx.title?.th,
        tx.title?.en,
        tx.note?.th,
        tx.note?.en,
        tx.categoryLabel?.th,
        tx.categoryLabel?.en,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [transactions, ledgerSearch, ledgerFilter]);

  // Ledger counts for badges
  const ledgerCounts = useMemo(() => {
    let income = 0;
    let expense = 0;
    let saving = 0;
    for (const tx of transactions) {
      if (tx.category === 'income') income += 1;
      else if (tx.category === 'saving') saving += 1;
      else expense += 1;
    }
    return { all: transactions.length, income, expense, saving };
  }, [transactions]);

  // Trigger quick preset preview
  const startSlipScan = (preset, sourceLabel = '') => {
    scanRunIdRef.current += 1;
    const runId = scanRunIdRef.current;
    if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    if (previewUrlRef.current) {
      window.URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setUploadedPreviewUrl(null);
    setScanLabel(sourceLabel);
    setScanProgress(60);
    setExtractedSlip(null);
    setIsScanning(true);

    scanTimerRef.current = window.setTimeout(() => {
      if (scanRunIdRef.current !== runId) return;
      scanTimerRef.current = null;
      const todayIso = getTodayIso();
      setScanProgress(100);
      setIsScanning(false);
      setExtractedSlip({
        titleText: lang === 'TH' ? preset.title.th : preset.title.en,
        titleObj: preset.title,
        noteObj: preset.note,
        bankTag: preset.bankTag,
        category: preset.category,
        iconKey: preset.iconKey,
        amount: String(preset.amount),
        amountDetected: true,
        isoDate: todayIso,
        refCode: `REF ${String(Math.floor(1000 + Math.random() * 9000))}`,
      });
    }, 520);
  };

  // Real 100% On-Device OCR for uploaded bank slip images (reads real THB amounts like 343 or 7)
  const handleSlipFile = async (file) => {
    if (!file) return;
    const isImage =
      (file.type && file.type.startsWith('image/')) ||
      /\.(png|jpe?g|webp|gif|heic|heif)$/i.test(file.name || '');
    if (!isImage) return;

    scanRunIdRef.current += 1;
    const runId = scanRunIdRef.current;
    if (scanTimerRef.current) {
      window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }

    const objectUrl = window.URL.createObjectURL(file);
    if (previewUrlRef.current && previewUrlRef.current !== objectUrl) {
      window.URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = objectUrl;

    setUploadedPreviewUrl(objectUrl);
    setExtractedSlip(null);
    setIsScanning(true);
    setScanProgress(10);
    setScanLabel(
      lang === 'TH'
        ? `กำลังประมวลผลภาพสลิป (${file.name})...`
        : `Preprocessing slip image (${file.name})...`
    );

    try {
      const parsed = await scanBankSlipOnDevice(file, ({ status, progress }) => {
        if (scanRunIdRef.current !== runId) return;
        const pct = Math.max(10, Math.min(99, progress || 15));
        setScanProgress(pct);
        if (status === 'loading' || status.includes('loading')) {
          setScanLabel(
            lang === 'TH'
              ? `กำลังเตรียมตัวอ่านภาษาไทย/ตัวเลขในเครื่อง (${pct}%)...`
              : `Loading on-device OCR engine (${pct}%)...`
          );
        } else {
          setScanLabel(
            lang === 'TH'
              ? `กำลังอ่านยอดเงินจากสลิป (${pct}%)...`
              : `Reading amount from slip (${pct}%)...`
          );
        }
      });

      if (scanRunIdRef.current !== runId) return;

      const todayIso = getTodayIso();
      setScanProgress(100);
      setIsScanning(false);
      setExtractedSlip({
        titleText: lang === 'TH' ? parsed.title.th : parsed.title.en,
        titleObj: parsed.title,
        noteObj: {
          th: `อ่านจากสลิปในเครื่อง (${parsed.bankTag})`,
          en: `Read on-device from ${parsed.bankTag}`,
        },
        bankTag: parsed.bankTag,
        category: parsed.category,
        iconKey: parsed.iconKey,
        amount: parsed.amount,
        amountDetected: parsed.amountDetected,
        isoDate: todayIso,
        refCode: 'OCR • Local',
      });
    } catch {
      if (scanRunIdRef.current !== runId) return;
      const todayIso = getTodayIso();
      setIsScanning(false);
      setExtractedSlip({
        titleText: lang === 'TH' ? 'รายการโอนเงินจากสลิป' : 'Scanned Bank Transfer',
        titleObj: { th: 'รายการโอนเงินจากสลิป', en: 'Scanned Bank Transfer' },
        noteObj: { th: 'กรอกยอดจากสลิปที่อัปโหลด', en: 'Entered from uploaded slip' },
        bankTag: 'Bank Slip',
        category: 'expense',
        iconKey: 'lifestyle',
        amount: '',
        amountDetected: false,
        isoDate: todayIso,
        refCode: 'Manual Check',
      });
    }
  };

  const handleSlipFileInput = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) handleSlipFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleSlipFile(file);
  };

  const handleConfirmSlip = (e) => {
    e.preventDefault();
    if (!extractedSlip) return;
    const numericAmount = Math.max(0, Number(extractedSlip.amount) || 0);
    if (numericAmount <= 0) return;

    const catMeta = CATEGORY_MAP[extractedSlip.iconKey] || CATEGORY_MAP.lifestyle;
    const trimmedTitle = extractedSlip.titleText.trim();
    const titleObj = trimmedTitle
      ? { th: trimmedTitle, en: trimmedTitle }
      : extractedSlip.titleObj;

    addTransaction({
      title: titleObj,
      note: extractedSlip.noteObj || {
        th: `ยืนยันจากสลิป (${extractedSlip.bankTag})`,
        en: `Confirmed from slip (${extractedSlip.bankTag})`,
      },
      category: extractedSlip.category,
      categoryLabel: catMeta.label,
      iconKey: extractedSlip.iconKey,
      date: formatBilingualDate(extractedSlip.isoDate),
      isoDate: extractedSlip.isoDate,
      amount: extractedSlip.category === 'expense' ? -numericAmount : numericAmount,
    });

    setExtractedSlip(null);
    if (previewUrlRef.current) {
      window.URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setUploadedPreviewUrl(null);
  };

  const handleClearSlip = () => {
    scanRunIdRef.current += 1;
    if (scanTimerRef.current) {
      window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    setIsScanning(false);
    setScanProgress(0);
    setExtractedSlip(null);
    if (previewUrlRef.current) {
      window.URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setUploadedPreviewUrl(null);
  };

  // Manual Entry helpers
  const handleManualTypeChange = (nextType) => {
    setManualType(nextType);
    if (nextType === 'income') {
      setManualCatKey('salary');
    } else if (nextType === 'saving') {
      setManualCatKey('saving');
    } else if (manualCatKey === 'salary' || manualCatKey === 'saving') {
      setManualCatKey('food');
    }
  };

  const handleCategorySelect = (cat) => {
    setManualCatKey(cat.key);
    setManualType(cat.type);
  };

  const handleQuickAmountAdd = (delta) => {
    const current = Number(manualAmount) || 0;
    setManualAmount(String(current + delta));
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Math.max(0, Number(manualAmount) || 0);
    if (numericAmount <= 0) return;

    const catMeta = CATEGORY_MAP[manualCatKey] || CATEGORY_MAP.food;
    const cleanNote = manualNote.trim();
    const titleObj = cleanNote
      ? { th: cleanNote, en: cleanNote }
      : catMeta.label;
    const noteObj =
      manualType === 'saving'
        ? { th: 'เติมเงินเข้ากองทุนสำรองฉุกเฉิน', en: 'Added to Liquid Emergency Fund' }
        : manualType === 'income'
          ? { th: 'บันทึกรายรับผ่าน AutoKey', en: 'Logged income via AutoKey' }
          : { th: `รายจ่ายหมวด${catMeta.label.th}`, en: `${catMeta.label.en} expense` };

    addTransaction({
      title: titleObj,
      note: noteObj,
      category: manualType,
      categoryLabel: catMeta.label,
      iconKey: catMeta.key,
      date: formatBilingualDate(manualDate),
      isoDate: manualDate,
      amount: manualType === 'expense' ? -numericAmount : numericAmount,
    });

    setManualAmount('');
    setManualNote('');
  };

  const inputModeTabs = [
    {
      id: 'slip',
      label: lang === 'TH' ? 'สแกนสลิปอัตโนมัติ' : 'Smart Slip Reader',
      icon: ScanLine,
    },
    {
      id: 'manual',
      label: lang === 'TH' ? 'กรอกรายการด่วน' : 'Quick Manual Entry',
      icon: PenLine,
    },
  ];

  const manualTypeTabs = [
    { id: 'income', label: lang === 'TH' ? 'รายรับ' : 'Income' },
    { id: 'expense', label: lang === 'TH' ? 'รายจ่าย' : 'Expense' },
    { id: 'saving', label: lang === 'TH' ? 'เติมเงินสำรอง' : 'Emergency Fund' },
  ];

  const ledgerFilterTabs = [
    { id: 'all', label: lang === 'TH' ? 'ทั้งหมด' : 'All', badge: ledgerCounts.all },
    { id: 'income', label: lang === 'TH' ? 'รายรับ' : 'Income', badge: ledgerCounts.income },
    { id: 'expense', label: lang === 'TH' ? 'รายจ่าย' : 'Expenses', badge: ledgerCounts.expense },
    {
      id: 'saving',
      label: lang === 'TH' ? 'เงินออมฉุกเฉิน' : 'Emergency Savings',
      badge: ledgerCounts.saving,
    },
  ];

  // Cashflow comparison widths
  const cashflowBase = Math.max(monthlyIncome, monthlyExpenses, 1);
  const expenseBarWidth = Math.min(100, Math.round((monthlyExpenses / cashflowBase) * 100));
  const incomeBarWidth = Math.min(100, Math.round((monthlyIncome / cashflowBase) * 100));

  const savingsBadgeClass =
    netSavingsRate >= 20 ? 'positive' : netSavingsRate >= 10 ? 'warn' : 'danger';

  return (
    <div className="autokey-stack">
      {/* ================= 1) TOP 4 BENTO KPI CARDS ================= */}
      <section className="autokey-kpi-grid" aria-label="Cashflow and Emergency KPIs">
        {/* Card 1: Monthly Income */}
        <article className="bento-card ak-kpi-card">
          <div className="ak-kpi-top">
            <span className="metric-icon-badge income" aria-hidden="true">
              <ArrowDownLeft size={18} strokeWidth={2.2} />
            </span>
            <span className="ak-kpi-pill green tabular-nums">
              {lang === 'TH' ? 'รายรับรวม' : 'Total Inflow'}
            </span>
          </div>
          <div className="ak-kpi-body">
            <div className="ak-kpi-label">
              {lang === 'TH' ? 'รายรับเดือนนี้' : 'Monthly Income'}
            </div>
            <div className="ak-kpi-value tabular-nums">{formatTHB(monthlyIncome)}</div>
          </div>
        </article>

        {/* Card 2: Monthly Expenses */}
        <article className="bento-card ak-kpi-card">
          <div className="ak-kpi-top">
            <span className="metric-icon-badge expense" aria-hidden="true">
              <ArrowUpRight size={18} strokeWidth={2.2} />
            </span>
            <span className="ak-kpi-pill red tabular-nums">
              {expenseRatio}% {lang === 'TH' ? 'ของรายรับ' : 'of income'}
            </span>
          </div>
          <div className="ak-kpi-body">
            <div className="ak-kpi-label">
              {lang === 'TH' ? 'รายจ่ายเดือนนี้' : 'Monthly Expenses'}
            </div>
            <div className="ak-kpi-value tabular-nums">{formatTHB(monthlyExpenses)}</div>
          </div>
        </article>

        {/* Card 3: Net Monthly Savings */}
        <article className="bento-card ak-kpi-card">
          <div className="ak-kpi-top">
            <span className="metric-icon-badge saving" aria-hidden="true">
              <PiggyBank size={18} strokeWidth={2.1} />
            </span>
            <span className={`ak-kpi-pill ${savingsBadgeClass} tabular-nums`}>
              {netSavingsRate}% {lang === 'TH' ? '(เป้า 20%)' : '(20% target)'}
            </span>
          </div>
          <div className="ak-kpi-body">
            <div className="ak-kpi-label">
              {lang === 'TH' ? 'เงินออมสุทธิ' : 'Net Monthly Savings'}
            </div>
            <div className={`ak-kpi-value tabular-nums ${netSavings < 0 ? 'negative' : ''}`}>
              {formatTHB(netSavings, { showSign: netSavings < 0 })}
            </div>
          </div>
        </article>

        {/* Card 4: Liquid Emergency Fund */}
        <article className="bento-card ak-kpi-card ak-kpi-emergency">
          <div className="ak-kpi-top">
            <span className="metric-icon-badge premium" aria-hidden="true">
              <ShieldCheck size={18} strokeWidth={2.1} />
            </span>
            <span className={`warning-pill tabular-nums ${isEmergencyReady ? 'safe' : ''}`}>
              <span
                className={`status-dot ${isEmergencyReady ? 'green' : 'amber'}`}
                aria-hidden="true"
              />
              {lang === 'TH'
                ? `รองรับได้ ${emergencyRunway.toFixed(2)} เดือน`
                : `${emergencyRunway.toFixed(2)} mo. runway`}
            </span>
          </div>
          <div className="ak-kpi-body">
            <div className="ak-kpi-label">
              {lang === 'TH' ? 'เงินสำรองฉุกเฉินพร้อมใช้' : 'Liquid Emergency Fund'}
            </div>
            <div className="ak-kpi-value tabular-nums">{formatTHB(emergencyFund)}</div>
          </div>
          <div className="ak-kpi-progress">
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={emergencyProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={lang === 'TH' ? 'ความคืบหน้าเงินสำรองฉุกเฉิน' : 'Emergency fund progress'}
            >
              <div className="progress-fill" style={{ width: `${emergencyProgress}%` }} />
            </div>
            <div className="ak-kpi-progress-meta tabular-nums">
              <span>{emergencyProgress}%</span>
              <span>
                {lang === 'TH'
                  ? `เป้า ${targetMonths} ด. (${formatTHB(emergencyTarget)})`
                  : `${targetMonths}-mo goal (${formatTHB(emergencyTarget)})`}
              </span>
            </div>
          </div>
        </article>
      </section>

      {/* ================= 2) MAIN 2-COLUMN WORKSPACE ================= */}
      <div className="autokey-main-grid">
        {/* LEFT CARD: Interactive Input & Smart Slip Reader Studio */}
        <section className="bento-card ak-input-card" aria-labelledby="ak-input-heading">
          <div className="ak-card-head">
            <div>
              <h2 id="ak-input-heading" className="card-title">
                {lang === 'TH' ? 'บันทึกรายการอัจฉริยะ' : 'Smart Cashflow Entry'}
              </h2>
              <p className="card-subtitle">
                {lang === 'TH'
                  ? 'เลือกสแกนสลิปโอนเงินหรือกรอกด่วน ระบบคำนวณและอัปเดตหน้าภาพรวมทันที'
                  : 'Scan a transfer slip or log manually — totals sync live across PROTECT360'}
              </p>
            </div>
          </div>

          <LiquidTabs
            tabs={inputModeTabs}
            activeId={inputMode}
            onChange={setInputMode}
            variant="surface"
            idPrefix="autokey-mode"
            ariaLabel={lang === 'TH' ? 'โหมดการบันทึกรายการ' : 'Entry mode'}
          />

          {/* ---------- TAB 1: SMART SLIP READER DEMO ---------- */}
          {inputMode === 'slip' && (
            <div className="ak-slip-panel">
              {/* Drag-and-Drop / Upload Box */}
              <div
                className={`ak-dropzone ${isDragging ? 'dragging' : ''} ${isScanning ? 'scanning' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => !isScanning && slipFileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isScanning) {
                    e.preventDefault();
                    slipFileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={slipFileInputRef}
                  id="autokey-slip-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only-input"
                  onChange={handleSlipFileInput}
                />

                {isScanning ? (
                  <div className="ak-scan-state" role="status" aria-live="polite">
                    <div className="ak-scan-laser-box">
                      <ScanLine size={28} strokeWidth={2} className="ak-scan-icon" />
                      <span className="ak-scan-beam" aria-hidden="true" />
                    </div>
                    <div className="ak-scan-title">
                      {lang === 'TH'
                        ? 'กำลังอ่านข้อมูลสลิปในเครื่อง (OCR)...'
                        : 'Reading Slip On-Device (OCR)...'}
                    </div>
                    <p className="ak-scan-sub tabular-nums">
                      {scanLabel ||
                        (lang === 'TH'
                          ? 'กำลังแยกยอดเงิน วันที่ และหมวดหมู่รายการ'
                          : 'Extracting amount, timestamp, and category')}
                    </p>
                    <div className="ak-scan-progress-track">
                      <div
                        className="ak-scan-progress-fill"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="ak-dropzone-idle">
                    <span className="ak-dropzone-icon" aria-hidden="true">
                      <ImagePlus size={22} strokeWidth={2} />
                    </span>
                    <div className="ak-dropzone-title">
                      {lang === 'TH'
                        ? 'วางรูปสลิปโอนเงินที่นี่ หรือคลิกเพื่ออัปโหลด'
                        : 'Drop a bank slip image here, or click to upload'}
                    </div>
                    <p className="ak-dropzone-sub">
                      {lang === 'TH'
                        ? 'อ่านยอดเงินจริงจากสลิปธนาคารไทยด้วย On-Device OCR (ไม่ส่งภาพขึ้นเซิร์ฟเวอร์)'
                        : 'Reads real amounts on-device via OCR — 100% private, zero server upload'}
                    </p>
                  </div>
                )}
              </div>

              {/* 4 One-Click Realistic Thai Slip Presets */}
              <div className="ak-presets-block">
                <div className="ak-section-micro-label">
                  <Sparkles size={13} strokeWidth={2.2} aria-hidden="true" />
                  <span>
                    {lang === 'TH'
                      ? 'ทดลองสลิปจำลอง 1 คลิก (Demo Presets)'
                      : '1-Click Realistic Thai Slip Presets'}
                  </span>
                </div>

                <div className="ak-presets-grid">
                  {SLIP_PRESETS.map((preset) => {
                    const CatIcon = CATEGORY_MAP[preset.iconKey]?.icon || Wallet;
                    const amountSign = preset.category === 'expense' ? '-' : '+';
                    const toneClass =
                      preset.category === 'income'
                        ? 'income'
                        : preset.category === 'saving'
                          ? 'saving'
                          : 'expense';

                    return (
                      <button
                        key={preset.id}
                        id={preset.id}
                        type="button"
                        className="ak-preset-btn"
                        disabled={isScanning}
                        onClick={() => startSlipScan(preset, t(preset.chipTitle))}
                      >
                        <span className={`ak-preset-icon ${toneClass}`} aria-hidden="true">
                          <CatIcon size={16} strokeWidth={2.2} />
                        </span>
                        <div className="ak-preset-info">
                          <span className="ak-preset-title">{t(preset.chipTitle)}</span>
                          <span className="ak-preset-meta tabular-nums">
                            <strong className={`ak-preset-amt ${toneClass}`}>
                              {amountSign}
                              {formatTHB(preset.amount)}
                            </strong>
                            {' • '}
                            {t(preset.pillLabel)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Extracted Slip Preview Card */}
              {extractedSlip && !isScanning && (
                <form className="ak-extracted-card" onSubmit={handleConfirmSlip}>
                  <div className="ak-extracted-head">
                    <div
                      className={`ak-extracted-badge ${
                        extractedSlip.amountDetected === false ? 'warn' : ''
                      }`}
                    >
                      {extractedSlip.amountDetected === false ? (
                        <AlertCircle size={15} strokeWidth={2.3} />
                      ) : (
                        <CheckCircle2 size={15} strokeWidth={2.3} />
                      )}
                      <span>
                        {extractedSlip.amountDetected === false
                          ? lang === 'TH'
                            ? 'กรุณาตรวจสอบและกรอกยอดเงิน'
                            : 'Please verify & enter amount'
                          : lang === 'TH'
                            ? 'อ่านข้อมูลสลิปสำเร็จ'
                            : 'Slip Data Extracted'}
                      </span>
                    </div>
                    <div className="ak-extracted-head-right">
                      <span className="ak-bank-chip tabular-nums">
                        {extractedSlip.bankTag} • {extractedSlip.refCode}
                      </span>
                      <button
                        type="button"
                        className="ak-icon-close"
                        onClick={handleClearSlip}
                        aria-label="Clear preview"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {extractedSlip.amountDetected === false && (
                    <div className="ak-ocr-warn-note" role="status">
                      {lang === 'TH'
                        ? 'ไม่พบตัวเลขยอดเงินชัดเจนในภาพนี้ สามารถพิมพ์ยอดเงินและเลือกหมวดหมู่ด้านล่างได้เลย'
                        : 'Could not detect a clear amount in this image — enter the amount and choose a category below.'}
                    </div>
                  )}

                  <div className="ak-extracted-body">
                    {uploadedPreviewUrl && (
                      <img
                        src={uploadedPreviewUrl}
                        alt="Uploaded slip preview"
                        className="ak-slip-thumb"
                      />
                    )}

                    <div className="ak-extracted-fields">
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label htmlFor="slip-title-edit" className="form-label">
                            {lang === 'TH' ? 'รายการ / บันทึก' : 'Title / Note'}
                          </label>
                          <input
                            id="slip-title-edit"
                            type="text"
                            className="form-input"
                            value={extractedSlip.titleText}
                            onChange={(e) =>
                              setExtractedSlip((prev) => ({
                                ...prev,
                                titleText: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>

                        <div className="form-field">
                          <label htmlFor="slip-amount-edit" className="form-label">
                            {lang === 'TH' ? 'จำนวนเงิน (บาท)' : 'Amount (THB)'}
                          </label>
                          <input
                            id="slip-amount-edit"
                            type="number"
                            min="0.01"
                            step="0.01"
                            className="form-input tabular-nums"
                            value={extractedSlip.amount}
                            onChange={(e) =>
                              setExtractedSlip((prev) => ({
                                ...prev,
                                amount: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label htmlFor="slip-type-select" className="form-label">
                            {lang === 'TH' ? 'ประเภท' : 'Type'}
                          </label>
                          <select
                            id="slip-type-select"
                            className="form-select"
                            value={extractedSlip.category}
                            onChange={(e) => {
                              const nextType = e.target.value;
                              const nextIcon =
                                nextType === 'income'
                                  ? 'salary'
                                  : nextType === 'saving'
                                    ? 'saving'
                                    : extractedSlip.iconKey === 'salary' ||
                                        extractedSlip.iconKey === 'saving'
                                      ? 'lifestyle'
                                      : extractedSlip.iconKey;
                              setExtractedSlip((prev) => ({
                                ...prev,
                                category: nextType,
                                iconKey: nextIcon,
                              }));
                            }}
                          >
                            <option value="expense">{lang === 'TH' ? 'รายจ่าย' : 'Expense'}</option>
                            <option value="income">{lang === 'TH' ? 'รายรับ' : 'Income'}</option>
                            <option value="saving">
                              {lang === 'TH' ? 'เติมเงินสำรองฉุกเฉิน' : 'Emergency Fund'}
                            </option>
                          </select>
                        </div>

                        <div className="form-field">
                          <label htmlFor="slip-cat-select" className="form-label">
                            {lang === 'TH' ? 'หมวดหมู่' : 'Category'}
                          </label>
                          <select
                            id="slip-cat-select"
                            className="form-select"
                            value={extractedSlip.iconKey}
                            onChange={(e) => {
                              const nextKey = e.target.value;
                              const matched = CATEGORY_MAP[nextKey];
                              setExtractedSlip((prev) => ({
                                ...prev,
                                iconKey: nextKey,
                                category: matched ? matched.type : prev.category,
                              }));
                            }}
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat.key} value={cat.key}>
                                {t(cat.label)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="ak-extracted-meta-row">
                        <span className={`ak-detected-cat ${extractedSlip.category}`}>
                          {lang === 'TH' ? 'หมวดที่เลือก:' : 'Category:'}{' '}
                          <strong>
                            {t(CATEGORY_MAP[extractedSlip.iconKey]?.label || { th: 'ทั่วไป', en: 'General' })}
                          </strong>
                        </span>
                        <span className="ak-detected-date tabular-nums">
                          <Calendar size={13} aria-hidden="true" />
                          {t(formatBilingualDate(extractedSlip.isoDate))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ak-extracted-actions">
                    <button
                      type="button"
                      className="btn-soft-gray"
                      onClick={handleClearSlip}
                    >
                      {lang === 'TH' ? 'ยกเลิก' : 'Cancel'}
                    </button>
                    <button
                      id="confirm-slip-save-btn"
                      type="submit"
                      className="btn-primary-gradient"
                    >
                      <CheckCircle2 size={16} strokeWidth={2.2} />
                      <span>
                        {lang === 'TH' ? 'ยืนยันบันทึกรายการ' : 'Confirm & Save'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ---------- TAB 2: QUICK MANUAL ENTRY ---------- */}
          {inputMode === 'manual' && (
            <form className="ak-manual-form" onSubmit={handleManualSubmit}>
              <div className="form-field">
                <span className="form-label">
                  {lang === 'TH' ? 'ประเภทรายการ' : 'Transaction Type'}
                </span>
                <LiquidTabs
                  tabs={manualTypeTabs}
                  activeId={manualType}
                  onChange={handleManualTypeChange}
                  variant="segmented"
                  idPrefix="manual-type"
                  ariaLabel={lang === 'TH' ? 'ประเภทรายการ' : 'Transaction Type'}
                />
              </div>

              <div className="form-field">
                <span className="form-label">
                  {lang === 'TH' ? 'หมวดหมู่' : 'Category'}
                </span>
                <div className="ak-cat-pills-grid">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = manualCatKey === cat.key;
                    return (
                      <button
                        key={cat.key}
                        id={`manual-cat-${cat.key}`}
                        type="button"
                        className={`ak-cat-pill ${isSelected ? 'active' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                        <span>{t(cat.label)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="manual-amount-input" className="form-label">
                    {lang === 'TH' ? 'จำนวนเงิน (บาท)' : 'Amount (THB)'}
                  </label>
                  <input
                    id="manual-amount-input"
                    type="number"
                    min="1"
                    step="1"
                    className="form-input tabular-nums"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    required
                  />
                  <div className="ak-quick-amt-row">
                    {QUICK_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className="ak-quick-amt-chip tabular-nums"
                        onClick={() => handleQuickAmountAdd(amt)}
                      >
                        +{amt.toLocaleString('en-US')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="manual-date-input" className="form-label">
                    {lang === 'TH' ? 'วันที่' : 'Date'}
                  </label>
                  <input
                    id="manual-date-input"
                    type="date"
                    className="form-input tabular-nums"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="manual-note-input" className="form-label">
                  {lang === 'TH' ? 'รายละเอียดเพิ่มเติม (ไม่บังคับ)' : 'Note / Description (Optional)'}
                </label>
                <input
                  id="manual-note-input"
                  type="text"
                  maxLength={80}
                  className="form-input"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                />
              </div>

              <div className="ak-manual-actions">
                <button
                  id="manual-submit-btn"
                  type="submit"
                  className="btn-primary-gradient ak-submit-full"
                >
                  <Upload size={16} strokeWidth={2.2} style={{ transform: 'rotate(180deg)' }} />
                  <span>
                    {lang === 'TH' ? 'บันทึกรายการลงสมุดบัญชี' : 'Save Transaction'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </section>

        {/* RIGHT COLUMN: Cashflow Analytics & Safe Protection Budget Coach */}
        <div className="autokey-analytics-col">
          {/* Card A: Spending Breakdown & Cashflow Comparison */}
          <section className="bento-card ak-breakdown-card" aria-labelledby="ak-breakdown-heading">
            <div className="ak-card-head">
              <div>
                <h2 id="ak-breakdown-heading" className="card-title">
                  {lang === 'TH'
                    ? 'สัดส่วนรายจ่าย & เปรียบเทียบกระแสเงินสด'
                    : 'Spending Breakdown & Cashflow'}
                </h2>
                <p className="card-subtitle">
                  {lang === 'TH'
                    ? 'เห็นภาพชัดว่าเงินไหลออกหมวดไหนมากที่สุด'
                    : 'Track where your money goes against monthly income'}
                </p>
              </div>
            </div>

            {/* Income vs Expenses Horizontal Comparison */}
            <div className="ak-cashflow-bars">
              <div className="ak-cf-row">
                <div className="ak-cf-label-row">
                  <span className="ak-cf-name">
                    <span className="ak-dot teal" aria-hidden="true" />
                    {lang === 'TH' ? 'รายรับรวม' : 'Income'}
                  </span>
                  <span className="ak-cf-val tabular-nums">{formatTHB(monthlyIncome)}</span>
                </div>
                <div className="ak-bar-track">
                  <div
                    className="ak-bar-fill income"
                    style={{ width: `${incomeBarWidth}%` }}
                  />
                </div>
              </div>

              <div className="ak-cf-row">
                <div className="ak-cf-label-row">
                  <span className="ak-cf-name">
                    <span className="ak-dot navy" aria-hidden="true" />
                    {lang === 'TH' ? 'รายจ่ายรวม' : 'Expenses'}
                  </span>
                  <span className="ak-cf-val tabular-nums">
                    {formatTHB(monthlyExpenses)} ({expenseRatio}%)
                  </span>
                </div>
                <div className="ak-bar-track">
                  <div
                    className="ak-bar-fill expense"
                    style={{ width: `${expenseBarWidth}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="ak-divider" />

            {/* Category Breakdown Bars */}
            <div className="ak-cat-breakdown-list">
              {spendingBreakdown.items.length === 0 ? (
                <div className="ak-empty-mini">
                  {lang === 'TH' ? 'ยังไม่มีรายการรายจ่ายในเดือนนี้' : 'No expense items logged yet'}
                </div>
              ) : (
                spendingBreakdown.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="ak-cat-bar-item">
                      <div className="ak-cat-bar-top">
                        <span className="ak-cat-bar-name">
                          <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
                          <span>{t(item.label)}</span>
                        </span>
                        <span className="ak-cat-bar-val tabular-nums">
                          {formatTHB(item.amount)}
                          <span className="ak-cat-bar-pct"> ({item.pct}%)</span>
                        </span>
                      </div>
                      <div className="ak-bar-track sm">
                        <div
                          className="ak-bar-fill"
                          style={{
                            width: `${item.pct}%`,
                            backgroundColor: item.barColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Card B: Safe Protection Budget Coach (Bridge to Round 3 Risk Analysis) */}
          <section className="bento-card ak-coach-card" aria-labelledby="ak-coach-heading">
            <div className="ak-coach-head">
              <span className="ak-coach-icon" aria-hidden="true">
                <ShieldAlert size={19} strokeWidth={2.2} />
              </span>
              <div>
                <h2 id="ak-coach-heading" className="card-title">
                  {lang === 'TH'
                    ? 'กรอบงบจัดการความเสี่ยงที่ปลอดภัย'
                    : 'Safe Protection Budget Coach'}
                </h2>
                <p className="card-subtitle">
                  {lang === 'TH'
                    ? 'เกณฑ์วางแผนการเงินส่วนบุคคล 10%–15% ของรายได้ (ไม่ขายประกัน)'
                    : 'Neutral financial guardrail: 10%–15% of monthly income'}
                </p>
              </div>
            </div>

            <div className="ak-budget-cap-box tabular-nums">
              <div className="ak-budget-cap-col">
                <span className="ak-budget-cap-label">
                  {lang === 'TH' ? 'งบที่เหมาะสม (10%–15%)' : 'Safe Budget Range (10%–15%)'}
                </span>
                <span className="ak-budget-cap-val">
                  {formatTHB(safeBudgetMin)} – {formatTHB(safeBudgetMax)}
                  <small>{lang === 'TH' ? ' / เดือน' : ' / mo'}</small>
                </span>
              </div>
              <div className="ak-budget-cap-col right">
                <span className="ak-budget-cap-label">
                  {lang === 'TH' ? 'เบี้ยส่วนตัวปัจจุบัน' : 'Current Self-Paid'}
                </span>
                <span className="ak-budget-cap-sub">
                  {formatTHB(selfPaidPremium)}
                  {lang === 'TH' ? ' / เดือน' : ' / mo'}
                </span>
              </div>
            </div>

            <div className={`ak-coach-insight ${isEmergencyReady ? 'ready' : 'caution'}`}>
              <span
                className={`status-dot ${isEmergencyReady ? 'green' : 'amber'}`}
                aria-hidden="true"
              />
              <p>
                {isEmergencyReady
                  ? lang === 'TH'
                    ? `เงินสำรองฉุกเฉินของคุณครบเกณฑ์ ${targetMonths} เดือนแล้ว สามารถจัดสรรงบจัดการความเสี่ยงได้ไม่เกิน ${formatTHB(safeBudgetMax)}/เดือน (15% ของรายได้) โดยไม่กระทบสภาพคล่อง`
                    : `Your ${targetMonths}-month emergency buffer is complete. You can safely allocate up to ${formatTHB(safeBudgetMax)}/mo (15% of income) toward protection gaps.`
                  : lang === 'TH'
                    ? `งบประมาณจัดการความเสี่ยงที่ปลอดภัยของคุณคือไม่เกิน ${formatTHB(safeBudgetMax)}/เดือน (15% ของรายได้) แต่แนะนำให้เติมเงินสำรองฉุกเฉินให้ครบ ${targetMonths} เดือนก่อน (ยังขาดอีก ${formatTHB(remainingEmergency)})`
                    : `Your safe protection budget ceiling is up to ${formatTHB(safeBudgetMax)}/mo (15% of income), though we recommend completing your ${targetMonths}-month emergency fund first (${formatTHB(remainingEmergency)} remaining).`}
              </p>
            </div>

            <button
              id="autokey-goto-risk-btn"
              type="button"
              className="btn-primary-gradient ak-bridge-cta"
              onClick={() => onNavigate('risk-analysis')}
            >
              <span>
                {lang === 'TH'
                  ? 'ไปประเมินความเสี่ยงต่อ (Risk Analysis)'
                  : 'Continue to Risk Analysis'}
              </span>
              <ChevronRight size={17} strokeWidth={2.4} className="cta-chevron" aria-hidden="true" />
            </button>
          </section>
        </div>
      </div>

      {/* ================= 3) FULL-WIDTH INTERACTIVE TRANSACTION LEDGER ================= */}
      <section className="bento-card ak-ledger-card" aria-labelledby="ak-ledger-heading">
        <div className="activities-toolbar">
          <div>
            <h2 id="ak-ledger-heading" className="card-title">
              {lang === 'TH' ? 'สมุดบันทึกรายรับ-รายจ่ายทั้งหมด' : 'Interactive Cashflow Ledger'}
            </h2>
            <p className="card-subtitle">
              {lang === 'TH'
                ? 'ค้นหา กรอง หรือลบรายการได้ทันที ยอดทั้งหมดจะคำนวณใหม่และบันทึกในเครื่องอัตโนมัติ'
                : 'Search, filter, or delete entries — all KPIs recalculate and persist locally'}
            </p>
          </div>

          <div className="activities-controls">
            <div className="search-input-wrap">
              <Search size={15} className="search-input-icon" aria-hidden="true" />
              <input
                id="autokey-ledger-search"
                type="search"
                className="search-input"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder={t('overview.searchPlaceholder')}
                aria-label={t('overview.searchPlaceholder')}
              />
            </div>

            <LiquidTabs
              tabs={ledgerFilterTabs}
              activeId={ledgerFilter}
              onChange={setLedgerFilter}
              variant="compact"
              idPrefix="ledger-filter"
              ariaLabel="Filter ledger"
            />
          </div>
        </div>

        {/* Desktop Ledger Table */}
        <div className="table-scroll desktop-activities-table ak-ledger-scroll">
          <table className="activities-table">
            <thead>
              <tr>
                <th>{t('overview.colDate')}</th>
                <th>{t('overview.colCategory')}</th>
                <th>{t('overview.colItem')}</th>
                <th className="align-right">{t('overview.colAmount')}</th>
                <th className="align-right">{lang === 'TH' ? 'จัดการ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-table-state">
                    {t('overview.emptySearch')}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const Icon = CATEGORY_MAP[tx.iconKey]?.icon || Wallet;
                  const amountClass =
                    tx.category === 'income'
                      ? 'income'
                      : tx.category === 'saving'
                        ? 'saving'
                        : 'expense';
                  const displayAmount =
                    tx.category === 'saving'
                      ? `+${formatTHB(Math.abs(tx.amount))}`
                      : formatTHB(tx.amount, { showSign: true });
                  const isConfirming = confirmDeleteTxId === tx.id;

                  return (
                    <tr key={tx.id}>
                      <td className="tx-date tabular-nums">{t(tx.date)}</td>
                      <td>
                        <div className="ak-ledger-cat-cell">
                          <span
                            className={`tx-icon-circle ${tx.iconKey || 'food'}`}
                            aria-hidden="true"
                          >
                            <Icon size={16} strokeWidth={2.1} />
                          </span>
                          <span className="tx-cat-badge">{t(tx.categoryLabel)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="tx-name">{t(tx.title)}</div>
                        <div className="tx-note">{t(tx.note)}</div>
                      </td>
                      <td className={`align-right tx-amount tabular-nums ${amountClass}`}>
                        {displayAmount}
                      </td>
                      <td className="align-right">
                        {isConfirming ? (
                          <div className="ak-tx-confirm-group">
                            <button
                              type="button"
                              className="ak-tx-cancel-btn"
                              onClick={() => setConfirmDeleteTxId(null)}
                            >
                              {lang === 'TH' ? 'ยกเลิก' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              className="ak-tx-delete-confirm"
                              onClick={() => {
                                removeTransaction(tx.id);
                                setConfirmDeleteTxId(null);
                              }}
                            >
                              {lang === 'TH' ? 'ยืนยันลบ' : 'Confirm'}
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`delete-tx-${tx.id}`}
                            type="button"
                            className="ak-tx-delete-btn"
                            onClick={() => setConfirmDeleteTxId(tx.id)}
                            title={lang === 'TH' ? 'ลบรายการ' : 'Delete entry'}
                          >
                            <Trash2 size={14} strokeWidth={2.1} />
                            <span>{lang === 'TH' ? 'ลบรายการ' : 'Delete'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Ledger Card List */}
        <div className="mobile-activities-list ak-mobile-ledger">
          {filteredTransactions.length === 0 ? (
            <div className="empty-table-state">{t('overview.emptySearch')}</div>
          ) : (
            filteredTransactions.map((tx) => {
              const Icon = CATEGORY_MAP[tx.iconKey]?.icon || Wallet;
              const amountClass =
                tx.category === 'income'
                  ? 'income'
                  : tx.category === 'saving'
                    ? 'saving'
                    : 'expense';
              const displayAmount =
                tx.category === 'saving'
                  ? `+${formatTHB(Math.abs(tx.amount))}`
                  : formatTHB(tx.amount, { showSign: true });
              const isConfirming = confirmDeleteTxId === tx.id;

              return (
                <div key={tx.id} className="mobile-tx-card ak-mobile-tx-card">
                  <div className="mobile-tx-left">
                    <span
                      className={`tx-icon-circle ${tx.iconKey || 'food'}`}
                      aria-hidden="true"
                    >
                      <Icon size={17} strokeWidth={2.1} />
                    </span>
                    <div className="mobile-tx-info">
                      <div className="tx-name">{t(tx.title)}</div>
                      <div className="mobile-tx-meta">
                        <span className="tx-cat-badge">{t(tx.categoryLabel)}</span>
                        <span className="tx-date tabular-nums">{t(tx.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mobile-tx-right">
                    <div className={`tx-amount tabular-nums ${amountClass}`}>
                      {displayAmount}
                    </div>
                    {isConfirming ? (
                      <div className="ak-tx-confirm-group">
                        <button
                          type="button"
                          className="ak-tx-cancel-btn"
                          onClick={() => setConfirmDeleteTxId(null)}
                        >
                          {lang === 'TH' ? 'ยกเลิก' : 'No'}
                        </button>
                        <button
                          type="button"
                          className="ak-tx-delete-confirm"
                          onClick={() => {
                            removeTransaction(tx.id);
                            setConfirmDeleteTxId(null);
                          }}
                        >
                          {lang === 'TH' ? 'ลบ' : 'Yes'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="ak-tx-delete-icon-only"
                        onClick={() => setConfirmDeleteTxId(tx.id)}
                        aria-label={lang === 'TH' ? 'ลบรายการ' : 'Delete entry'}
                      >
                        <Trash2 size={14} strokeWidth={2.1} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

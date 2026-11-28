import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FolderPlus,
  ImagePlus,
  List,
  MoreHorizontal,
  PenLine,
  Pencil,
  PieChart,
  PiggyBank,
  ScanLine,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import { scanBankSlipOnDevice } from '../utils/slipOcr';
import { buildSmartLogExcelBlob } from '../utils/excelExport';
import {
  CORE_CATEGORIES,
  CORE_CATEGORY_MAP,
  CUSTOM_ICON_MAP,
  getCategoryIconComponent,
  getTypeColorMeta,
} from '../utils/categoryRegistry';
import LiquidTabs from '../components/LiquidTabs';
import MerchantCalculator from '../components/MerchantCalculator';
import CustomCategoryModal from '../components/CustomCategoryModal';
import KpiDetailModal from '../components/KpiDetailModal';
import CashflowDonutChart from '../components/CashflowDonutChart';
import CashflowCalendarView from '../components/CashflowCalendarView';

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

function getIsoDateOffset(daysOffset = 0) {
  const now = new Date();
  now.setDate(now.getDate() + daysOffset);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTodayIso() {
  return getIsoDateOffset(0);
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

function escapeCsvCell(val) {
  const str = String(val ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

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
    customCategories,
    addTransaction,
    updateTransaction,
    removeTransaction,
    showToast,
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
  const [slipCalcOpen, setSlipCalcOpen] = useState(false);
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
  const [manualCalcOpen, setManualCalcOpen] = useState(false);

  // Custom Category Modal target: null | 'manual' | 'slip'
  const [catModalTarget, setCatModalTarget] = useState(null);

  // Interactive KPI Drill-Down modal: null | 'income' | 'expense' | 'saving'
  const [kpiDetailMode, setKpiDetailMode] = useState(null);

  // Cashflow Category Breakdown filter & chart style ('bar' | 'donut')
  const [breakdownFilter, setBreakdownFilter] = useState('all');
  const [breakdownChartType, setBreakdownChartType] = useState('bar');

  // Ledger state (view mode: 'list' | 'calendar', search, filter, delete confirm, inline edit)
  const [ledgerViewMode, setLedgerViewMode] = useState('list');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState('all');
  const [confirmDeleteTxId, setConfirmDeleteTxId] = useState(null);
  const [editingTxId, setEditingTxId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    title: '',
    amount: '',
    category: 'expense',
    iconKey: 'food',
  });

  // Clean up scan timer and preview object URL ONLY on unmount
  useEffect(() => {
    return () => {
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
      if (previewUrlRef.current) window.URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // Build unified category lookup (6 core + user custom categories, strict 3-color semantic palette)
  const allCategories = useMemo(() => {
    const mappedCustom = (customCategories || []).map((c) => {
      const colorMeta = getTypeColorMeta(c.type);
      return {
        key: c.id,
        type: c.type,
        iconName: c.iconName,
        icon: CUSTOM_ICON_MAP[c.iconName] || CORE_CATEGORY_MAP.lifestyle.icon,
        label: c.label || { th: c.name, en: c.name },
        barColor: colorMeta.hex,
        barColorDark: colorMeta.darkHex,
        isCustom: true,
      };
    });
    return [...CORE_CATEGORIES, ...mappedCustom];
  }, [customCategories]);

  const allCategoryMap = useMemo(
    () => Object.fromEntries(allCategories.map((c) => [c.key, c])),
    [allCategories]
  );

  // If the currently selected manual custom category was deleted, fall back cleanly
  const activeManualCat = allCategoryMap[manualCatKey] || CORE_CATEGORY_MAP.food;
  const activeCustomForManual = activeManualCat.isCustom ? activeManualCat : null;

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

  // 50 / 30 / 20 Peer & Realistic Budget Benchmark Comparison (Needs ≤50%, Wants ≤30%, Savings ≥20%)
  const budgetBenchmark = useMemo(() => {
    const NEEDS_KEYS = new Set([
      'food',
      'housing',
      'transport',
      'ccat-demo-util',
      'ccat-demo-protect',
    ]);
    const NEEDS_ICONS = new Set([
      'utensils',
      'coffee',
      'home',
      'zap',
      'wifi',
      'car',
      'train',
      'heart-pulse',
      'graduation-cap',
    ]);

    let needsAmt = 0;
    let wantsAmt = 0;
    for (const tx of transactions) {
      if (tx.category !== 'expense') continue;
      const amt = Math.abs(Number(tx.amount) || 0);
      if (amt <= 0) continue;
      const meta = allCategoryMap[tx.iconKey];
      const iconName = tx.customIcon || meta?.iconName || '';
      if (NEEDS_KEYS.has(tx.iconKey) || NEEDS_ICONS.has(iconName)) {
        needsAmt += amt;
      } else {
        wantsAmt += amt;
      }
    }

    const totalExpenseTracked = needsAmt + wantsAmt;
    // Scale proportionally if manual balance edit differs from ledger expense sum
    if (monthlyExpenses > 0 && totalExpenseTracked > 0 && totalExpenseTracked !== monthlyExpenses) {
      const ratio = monthlyExpenses / totalExpenseTracked;
      needsAmt = Math.round(needsAmt * ratio);
      wantsAmt = Math.max(0, monthlyExpenses - needsAmt);
    } else if (monthlyExpenses > 0 && totalExpenseTracked === 0) {
      needsAmt = Math.round(monthlyExpenses * 0.72);
      wantsAmt = Math.max(0, monthlyExpenses - needsAmt);
    }

    const baseIncome = Math.max(monthlyIncome, 0);
    const needsPct = baseIncome > 0 ? Math.round((needsAmt / baseIncome) * 100) : 0;
    const wantsPct = baseIncome > 0 ? Math.round((wantsAmt / baseIncome) * 100) : 0;
    const savePct = baseIncome > 0 ? Math.max(0, Math.round((netSavings / baseIncome) * 100)) : 0;

    return {
      hasData: baseIncome > 0 || monthlyExpenses > 0,
      needsAmt,
      wantsAmt,
      savingsAmt: Math.max(0, netSavings),
      needsPct,
      wantsPct,
      savePct,
    };
  }, [transactions, allCategoryMap, monthlyIncome, monthlyExpenses, netSavings]);

  // Unified Cashflow Breakdown by category across ALL 3 streams: Income (Green), Expense (Red), Saving (Blue)
  const cashflowBreakdown = useMemo(() => {
    const totals = new Map();
    const streamTotals = { income: 0, expense: 0, saving: 0 };

    for (const tx of transactions) {
      const txType =
        tx.category === 'income'
          ? 'income'
          : tx.category === 'saving'
            ? 'saving'
            : 'expense';
      const amt = Math.abs(Number(tx.amount) || 0);
      if (amt <= 0) continue;

      streamTotals[txType] += amt;

      const rawKey = allCategoryMap[tx.iconKey]
        ? tx.iconKey
        : tx.iconKey && tx.iconKey.startsWith('ccat-')
          ? tx.iconKey
          : txType === 'income'
            ? 'salary'
            : txType === 'saving'
              ? 'saving'
              : 'lifestyle';
      const compositeKey = `${txType}:${rawKey}`;

      const existing = totals.get(compositeKey);
      if (existing) {
        existing.amount += amt;
      } else {
        const meta = allCategoryMap[rawKey];
        totals.set(compositeKey, {
          key: compositeKey,
          type: txType,
          label: meta?.label || tx.categoryLabel || CORE_CATEGORY_MAP.lifestyle.label,
          icon:
            meta?.icon ||
            getCategoryIconComponent(tx.iconKey, tx.customIcon, customCategories),
          amount: amt,
        });
      }
    }

    const typeOrder = { income: 0, expense: 1, saving: 2 };
    const allItems = Array.from(totals.values())
      .map((item) => {
        const denom =
          breakdownFilter === 'all'
            ? Math.max(monthlyIncome, streamTotals.income, streamTotals.expense, streamTotals.saving, 1)
            : Math.max(streamTotals[item.type], 1);
        const pct = Math.min(100, Math.round((item.amount / denom) * 100));
        const shareOfStream =
          streamTotals[item.type] > 0
            ? Math.round((item.amount / streamTotals[item.type]) * 100)
            : 0;
        return {
          ...item,
          pct,
          shareOfStream,
        };
      })
      .filter((item) => breakdownFilter === 'all' || item.type === breakdownFilter)
      .sort((a, b) => {
        if (breakdownFilter === 'all' && a.type !== b.type) {
          return typeOrder[a.type] - typeOrder[b.type];
        }
        return b.amount - a.amount;
      });

    return { items: allItems, streamTotals };
  }, [transactions, allCategoryMap, customCategories, breakdownFilter, monthlyIncome]);

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
    setSlipCalcOpen(false);
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

  // Real 100% On-Device OCR for uploaded bank slip images
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
    setSlipCalcOpen(false);
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

    const catMeta = allCategoryMap[extractedSlip.iconKey] || CORE_CATEGORY_MAP.lifestyle;
    const trimmedTitle = extractedSlip.titleText.trim();
    const isUnchangedPresetTitle =
      extractedSlip.titleObj &&
      (trimmedTitle === extractedSlip.titleObj.th || trimmedTitle === extractedSlip.titleObj.en);
    const titleObj =
      !trimmedTitle || isUnchangedPresetTitle
        ? extractedSlip.titleObj
        : { th: trimmedTitle, en: trimmedTitle };

    addTransaction({
      title: titleObj,
      note: extractedSlip.noteObj || {
        th: `ยืนยันจากสลิป (${extractedSlip.bankTag})`,
        en: `Confirmed from slip (${extractedSlip.bankTag})`,
      },
      category: extractedSlip.category,
      categoryLabel: catMeta.label,
      iconKey: catMeta.key,
      ...(catMeta.isCustom
        ? { customIcon: catMeta.iconName, customColor: catMeta.barColor }
        : {}),
      date: formatBilingualDate(extractedSlip.isoDate),
      isoDate: extractedSlip.isoDate,
      amount: extractedSlip.category === 'expense' ? -numericAmount : numericAmount,
    });

    setExtractedSlip(null);
    setSlipCalcOpen(false);
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
    setSlipCalcOpen(false);
    if (previewUrlRef.current) {
      window.URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setUploadedPreviewUrl(null);
  };

  // Manual Entry helpers
  const handleManualTypeChange = (nextType) => {
    setManualType(nextType);
    const currentCat = allCategoryMap[manualCatKey];
    if (currentCat && currentCat.type === nextType) return;
    if (nextType === 'income') {
      setManualCatKey('salary');
    } else if (nextType === 'saving') {
      setManualCatKey('saving');
    } else {
      setManualCatKey('food');
    }
  };

  const handleCategorySelect = (cat) => {
    setManualCatKey(cat.key);
    setManualType(cat.type);
  };

  const handleQuickAmountAdjust = (delta) => {
    const current = Number(manualAmount) || 0;
    const next = Math.max(0, Math.round((current + delta) * 100) / 100);
    setManualAmount(next === 0 ? '' : String(next));
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Math.max(0, Number(manualAmount) || 0);
    if (numericAmount <= 0) return;

    const catMeta = activeManualCat || CORE_CATEGORY_MAP.food;
    const cleanNote = manualNote.trim();
    const titleObj = cleanNote ? { th: cleanNote, en: cleanNote } : catMeta.label;
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
      ...(catMeta.isCustom
        ? { customIcon: catMeta.iconName, customColor: catMeta.barColor }
        : {}),
      date: formatBilingualDate(manualDate),
      isoDate: manualDate,
      amount: manualType === 'expense' ? -numericAmount : numericAmount,
    });

    setManualAmount('');
    setManualNote('');
    setManualCalcOpen(false);
  };

  // Ledger inline edit helpers
  const startEditTx = (tx) => {
    setConfirmDeleteTxId(null);
    setEditingTxId(tx.id);
    setEditDraft({
      title: t(tx.title),
      amount: String(Math.abs(Number(tx.amount) || 0)),
      category: tx.category || 'expense',
      iconKey: tx.iconKey || 'lifestyle',
    });
  };

  const cancelEditTx = () => {
    setEditingTxId(null);
  };

  const saveEditTx = (tx) => {
    const numericAmount = Math.max(0, Number(editDraft.amount) || 0);
    if (numericAmount <= 0) return;
    const catMeta = allCategoryMap[editDraft.iconKey];
    const trimmedTitle = editDraft.title.trim();

    updateTransaction(tx.id, {
      title: trimmedTitle ? { th: trimmedTitle, en: trimmedTitle } : tx.title,
      amount: editDraft.category === 'expense' ? -numericAmount : numericAmount,
      category: editDraft.category,
      iconKey: catMeta ? catMeta.key : tx.iconKey,
      categoryLabel: catMeta ? catMeta.label : tx.categoryLabel,
      customIcon: catMeta?.isCustom ? catMeta.iconName : undefined,
      customColor: catMeta?.isCustom ? catMeta.barColor : undefined,
    });
    setEditingTxId(null);
  };

  // Export currently filtered ledger to UTF-8 BOM CSV with both TH & EN columns
  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) return;
    const headers = [
      'วันที่ (TH)',
      'Date (EN)',
      'ประเภท / Type',
      'หมวดหมู่ (TH)',
      'Category (EN)',
      'รายการ (TH)',
      'Title (EN)',
      'จำนวนเงิน (THB)',
    ];

    const typeMap = {
      income: 'รายรับ / Income',
      expense: 'รายจ่าย / Expense',
      saving: 'เงินออมฉุกเฉิน / Emergency Fund',
    };

    const rows = filteredTransactions.map((tx) => [
      tx.date?.th || t(tx.date),
      tx.date?.en || t(tx.date),
      typeMap[tx.category] || tx.category,
      tx.categoryLabel?.th || t(tx.categoryLabel),
      tx.categoryLabel?.en || t(tx.categoryLabel),
      tx.title?.th || t(tx.title),
      tx.title?.en || t(tx.title),
      tx.category === 'saving' ? Math.abs(Number(tx.amount) || 0) : Number(tx.amount) || 0,
    ]);

    const csvLines = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${csvLines}`], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protect360-autokey-${getTodayIso()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    showToast('success', {
      th: `ส่งออกไฟล์ CSV 2 ภาษา (${filteredTransactions.length} รายการ) เรียบร้อยแล้ว`,
      en: `Exported bilingual CSV (${filteredTransactions.length} entries)`,
    });
  };

  // Export ledger as a native 2-sheet Excel (.xlsx) workbook (Google Forms spreadsheet style)
  const handleExportExcel = () => {
    const todayIso = getTodayIso();
    const blob = buildSmartLogExcelBlob({
      transactions: filteredTransactions,
      userProfile,
      monthlyIncome,
      monthlyExpenses,
      emergencyFund,
      emergencyRunway,
      lang,
      exportDateIso: todayIso,
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protect360-autokey-${todayIso}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    showToast('success', {
      th: `ส่งออกไฟล์ Excel (.xlsx) รูปแบบตาราง 2 ชีต (${filteredTransactions.length} รายการ) เรียบร้อยแล้ว`,
      en: `Exported 2-sheet Excel (.xlsx) table (${filteredTransactions.length} entries)`,
    });
  };

  const inputModeTabs = [
    {
      id: 'slip',
      label: lang === 'TH' ? 'สแกนสลิป' : 'Scan Slip',
      icon: ScanLine,
    },
    {
      id: 'manual',
      label: lang === 'TH' ? 'กรอกด่วน' : 'Quick Entry',
      icon: PenLine,
    },
  ];

  const manualTypeTabs = [
    { id: 'income', label: lang === 'TH' ? 'รายรับ' : 'Income' },
    { id: 'expense', label: lang === 'TH' ? 'รายจ่าย' : 'Expense' },
    { id: 'saving', label: lang === 'TH' ? 'เงินสำรอง' : 'Reserve' },
  ];

  const ledgerFilterTabs = [
    { id: 'all', label: lang === 'TH' ? 'ทั้งหมด' : 'All', badge: ledgerCounts.all },
    { id: 'income', label: lang === 'TH' ? 'รายรับ' : 'Income', badge: ledgerCounts.income },
    { id: 'expense', label: lang === 'TH' ? 'รายจ่าย' : 'Expenses', badge: ledgerCounts.expense },
    {
      id: 'saving',
      label: lang === 'TH' ? 'เงินสำรอง' : 'Reserve',
      badge: ledgerCounts.saving,
    },
  ];

  const breakdownFilterTabs = [
    { id: 'all', label: lang === 'TH' ? 'ทั้งหมด' : 'All' },
    { id: 'income', label: lang === 'TH' ? 'รายรับ' : 'Income' },
    { id: 'expense', label: lang === 'TH' ? 'รายจ่าย' : 'Expense' },
    { id: 'saving', label: lang === 'TH' ? 'เงินออม' : 'Savings' },
  ];

  const chartTypeTabs = [
    { id: 'bar', label: lang === 'TH' ? 'แท่ง' : 'Bar', icon: BarChart3 },
    { id: 'donut', label: lang === 'TH' ? 'วงกลม' : 'Donut', icon: PieChart },
  ];

  const ledgerViewTabs = [
    { id: 'list', label: lang === 'TH' ? 'รายการ' : 'List', icon: List },
    { id: 'calendar', label: lang === 'TH' ? 'ปฏิทิน' : 'Calendar', icon: Calendar },
  ];

  const handleQuickAddDate = (isoDate) => {
    setManualDate(isoDate);
    setInputMode('manual');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const todayIso = getTodayIso();
  const yesterdayIso = getIsoDateOffset(-1);

  // Cashflow comparison widths (Income Green, Expenses Red, Net Savings Blue)
  const positiveNetSavings = Math.max(0, netSavings);
  const cashflowBase = Math.max(monthlyIncome, monthlyExpenses, positiveNetSavings, 1);
  const incomeBarWidth = Math.min(100, Math.round((monthlyIncome / cashflowBase) * 100));
  const expenseBarWidth = Math.min(100, Math.round((monthlyExpenses / cashflowBase) * 100));
  const savingsBarWidth = Math.min(100, Math.round((positiveNetSavings / cashflowBase) * 100));

  // Net Savings pill stays strictly in Blue family (or Red if deficit) — never Green like Income
  const savingsBadgeClass = netSavings < 0 ? 'danger' : 'blue';

  const ActiveCustomIcon = activeCustomForManual?.icon || MoreHorizontal;

  const handleQuickLogFromModal = (mode) => {
    setInputMode('manual');
    handleManualTypeChange(mode);
  };

  return (
    <div className="autokey-stack">
      {/* ================= 1) TOP 4 BENTO KPI CARDS ================= */}
      <section className="autokey-kpi-grid" aria-label="Cashflow and Emergency KPIs">
        {/* Card 1: Monthly Income (Clickable Drill-Down) */}
        <article
          id="kpi-card-income"
          className="bento-card ak-kpi-card clickable"
          role="button"
          tabIndex={0}
          onClick={() => setKpiDetailMode('income')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setKpiDetailMode('income');
            }
          }}
        >
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
            <div className="ak-kpi-value income tabular-nums">{formatTHB(monthlyIncome)}</div>
          </div>
          <div className="ak-kpi-drill-hint">
            <span>{lang === 'TH' ? 'ดูที่มา & ความเคลื่อนไหว' : 'View breakdown'}</span>
            <ChevronRight size={13} strokeWidth={2.4} aria-hidden="true" />
          </div>
        </article>

        {/* Card 2: Monthly Expenses (Red + Clickable Drill-Down) */}
        <article
          id="kpi-card-expense"
          className="bento-card ak-kpi-card clickable"
          role="button"
          tabIndex={0}
          onClick={() => setKpiDetailMode('expense')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setKpiDetailMode('expense');
            }
          }}
        >
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
            <div className="ak-kpi-value expense tabular-nums">{formatTHB(monthlyExpenses)}</div>
          </div>
          <div className="ak-kpi-drill-hint">
            <span>{lang === 'TH' ? 'ดูที่มา & ความเคลื่อนไหว' : 'View breakdown'}</span>
            <ChevronRight size={13} strokeWidth={2.4} aria-hidden="true" />
          </div>
        </article>

        {/* Card 3: Net Monthly Savings (Blue like Emergency Fund + Clickable Drill-Down) */}
        <article
          id="kpi-card-saving"
          className="bento-card ak-kpi-card clickable"
          role="button"
          tabIndex={0}
          onClick={() => setKpiDetailMode('saving')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setKpiDetailMode('saving');
            }
          }}
        >
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
            <div className={`ak-kpi-value tabular-nums ${netSavings < 0 ? 'negative' : 'saving'}`}>
              {formatTHB(netSavings, { showSign: netSavings < 0 })}
            </div>
          </div>
          <div className="ak-kpi-drill-hint">
            <span>{lang === 'TH' ? 'ดูที่มา & ความเคลื่อนไหว' : 'View breakdown'}</span>
            <ChevronRight size={13} strokeWidth={2.4} aria-hidden="true" />
          </div>
        </article>

        {/* Card 4: Liquid Emergency Fund (Blue Family) */}
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
            <div className="ak-kpi-value saving tabular-nums">{formatTHB(emergencyFund)}</div>
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
            idPrefix="smartlog-mode"
            ariaLabel={lang === 'TH' ? 'โหมดการบันทึกรายการ' : 'Entry mode'}
          />

          {/* ---------- TAB 1: SMART SLIP READER (REAL ON-DEVICE OCR) ---------- */}
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
                  id="smartlog-slip-upload"
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
                    const CatIcon = CORE_CATEGORY_MAP[preset.iconKey]?.icon || Wallet;
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
                          <div className="ak-label-with-tool">
                            <label htmlFor="slip-amount-edit" className="form-label">
                              {lang === 'TH' ? 'จำนวนเงิน (บาท)' : 'Amount (THB)'}
                            </label>
                            <button
                              type="button"
                              className={`ak-mini-tool-btn ${slipCalcOpen ? 'active' : ''}`}
                              onClick={() => setSlipCalcOpen((v) => !v)}
                            >
                              <Calculator size={12} strokeWidth={2.2} aria-hidden="true" />
                              <span>{lang === 'TH' ? 'คิดเลข' : 'Calc'}</span>
                            </button>
                          </div>
                          <input
                            id="slip-amount-edit"
                            type="number"
                            min="0.01"
                            step="0.01"
                            className={`form-input tabular-nums ak-amount-input ${extractedSlip.category}`}
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

                      {slipCalcOpen && (
                        <MerchantCalculator
                          initialValue={extractedSlip.amount}
                          onApply={(val) =>
                            setExtractedSlip((prev) => ({
                              ...prev,
                              amount: val,
                            }))
                          }
                          onClose={() => setSlipCalcOpen(false)}
                        />
                      )}

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
                          <div className="ak-label-with-tool">
                            <label htmlFor="slip-cat-select" className="form-label">
                              {lang === 'TH' ? 'หมวดหมู่' : 'Category'}
                            </label>
                            <button
                              type="button"
                              className="ak-mini-tool-btn"
                              onClick={() => setCatModalTarget('slip')}
                            >
                              <FolderPlus size={12} strokeWidth={2.2} aria-hidden="true" />
                              <span>{lang === 'TH' ? 'อื่น ๆ / สร้างเอง' : 'Custom'}</span>
                            </button>
                          </div>
                          <select
                            id="slip-cat-select"
                            className="form-select"
                            value={extractedSlip.iconKey}
                            onChange={(e) => {
                              const nextKey = e.target.value;
                              const matched = allCategoryMap[nextKey];
                              setExtractedSlip((prev) => ({
                                ...prev,
                                iconKey: nextKey,
                                category: matched ? matched.type : prev.category,
                              }));
                            }}
                          >
                            <optgroup label={lang === 'TH' ? 'หมวดหมู่หลัก' : 'Core Categories'}>
                              {CORE_CATEGORIES.map((cat) => (
                                <option key={cat.key} value={cat.key}>
                                  {t(cat.label)}
                                </option>
                              ))}
                            </optgroup>
                            {customCategories.length > 0 && (
                              <optgroup
                                label={
                                  lang === 'TH' ? 'หมวดหมู่ที่สร้างเอง' : 'My Custom Categories'
                                }
                              >
                                {customCategories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {t(cat.label || { th: cat.name, en: cat.name })}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="ak-extracted-meta-row">
                        <span className={`ak-detected-cat ${extractedSlip.category}`}>
                          {lang === 'TH' ? 'หมวดที่เลือก:' : 'Category:'}{' '}
                          <strong>
                            {t(
                              allCategoryMap[extractedSlip.iconKey]?.label || {
                                th: 'ทั่วไป',
                                en: 'General',
                              }
                            )}
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

              {/* Compact 6 Core Categories + 1 "อื่น ๆ (หมวดของฉัน)" drawer button */}
              <div className="form-field">
                <div className="ak-label-with-tool">
                  <span className="form-label">
                    {lang === 'TH' ? 'หมวดหมู่' : 'Category'}
                  </span>
                  <button
                    type="button"
                    className="ak-mini-tool-btn"
                    onClick={() => setCatModalTarget('manual')}
                  >
                    <FolderPlus size={12} strokeWidth={2.2} aria-hidden="true" />
                    <span>
                      {lang === 'TH' ? 'จัดการหมวดของฉัน' : 'Manage Custom'}
                      {customCategories.length > 0 ? ` (${customCategories.length})` : ''}
                    </span>
                  </button>
                </div>

                <div className="ak-cat-pills-grid">
                  {CORE_CATEGORIES.map((cat) => {
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

                  {/* 7th Pill: "อื่น ๆ / หมวดของฉัน" — keeps outer UI clean even with many custom categories */}
                  <button
                    id="manual-cat-other-btn"
                    type="button"
                    className={`ak-cat-pill ak-cat-pill-other ${
                      activeCustomForManual ? `active custom-active type-${activeCustomForManual.type}` : ''
                    }`}
                    onClick={() => setCatModalTarget('manual')}
                  >
                    <ActiveCustomIcon size={15} strokeWidth={2.2} aria-hidden="true" />
                    <span>
                      {activeCustomForManual
                        ? t(activeCustomForManual.label)
                        : lang === 'TH'
                          ? 'อื่น ๆ (หมวดของฉัน)'
                          : 'Other / Custom'}
                    </span>
                    {customCategories.length > 0 && !activeCustomForManual && (
                      <span className="ak-cat-count-dot tabular-nums">
                        {customCategories.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <div className="ak-label-with-tool">
                    <label htmlFor="manual-amount-input" className="form-label">
                      {lang === 'TH' ? 'จำนวนเงิน (บาท)' : 'Amount (THB)'}
                    </label>
                    <button
                      id="manual-calc-toggle-btn"
                      type="button"
                      className={`ak-mini-tool-btn ${manualCalcOpen ? 'active' : ''}`}
                      onClick={() => setManualCalcOpen((v) => !v)}
                    >
                      <Calculator size={12} strokeWidth={2.2} aria-hidden="true" />
                      <span>{lang === 'TH' ? 'เครื่องคิดเลข' : 'Calculator'}</span>
                    </button>
                  </div>
                  <input
                    id="manual-amount-input"
                    type="number"
                    min="0.01"
                    step="0.01"
                    className={`form-input tabular-nums ak-amount-input ${manualType}`}
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    required
                  />
                  {/* Quick + and - adjustment chips (context-aware: Income +G/-R, Expense +R/-G, Saving +B/-R) */}
                  <div className="ak-quick-amt-stack">
                    <div className="ak-quick-amt-row">
                      {QUICK_AMOUNTS.map((amt) => {
                        const plusTone =
                          manualType === 'income'
                            ? 'tone-green'
                            : manualType === 'expense'
                              ? 'tone-red'
                              : 'tone-blue';
                        return (
                          <button
                            key={`plus-${amt}`}
                            type="button"
                            className={`ak-quick-amt-chip ${plusTone} tabular-nums`}
                            onClick={() => handleQuickAmountAdjust(amt)}
                          >
                            +{amt.toLocaleString('en-US')}
                          </button>
                        );
                      })}
                    </div>
                    <div className="ak-quick-amt-row">
                      {QUICK_AMOUNTS.map((amt) => {
                        const minusTone =
                          manualType === 'expense' ? 'tone-green' : 'tone-red';
                        return (
                          <button
                            key={`minus-${amt}`}
                            type="button"
                            className={`ak-quick-amt-chip ${minusTone} tabular-nums`}
                            disabled={!manualAmount || Number(manualAmount) <= 0}
                            onClick={() => handleQuickAmountAdjust(-amt)}
                          >
                            -{amt.toLocaleString('en-US')}
                          </button>
                        );
                      })}
                      {manualAmount && Number(manualAmount) > 0 && (
                        <button
                          type="button"
                          className="ak-quick-amt-chip clear"
                          onClick={() => setManualAmount('')}
                        >
                          {lang === 'TH' ? 'ล้าง' : 'Clear'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-field">
                  <div className="ak-label-with-tool">
                    <label htmlFor="manual-date-input" className="form-label">
                      {lang === 'TH' ? 'วันที่' : 'Date'}
                    </label>
                    <div className="ak-date-shortcuts">
                      <button
                        type="button"
                        className={`ak-mini-tool-btn ${manualDate === todayIso ? 'active' : ''}`}
                        onClick={() => setManualDate(todayIso)}
                      >
                        {lang === 'TH' ? 'วันนี้' : 'Today'}
                      </button>
                      <button
                        type="button"
                        className={`ak-mini-tool-btn ${
                          manualDate === yesterdayIso ? 'active' : ''
                        }`}
                        onClick={() => setManualDate(yesterdayIso)}
                      >
                        {lang === 'TH' ? 'เมื่อวาน' : 'Yesterday'}
                      </button>
                    </div>
                  </div>
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

              {/* Inline Merchant Calculator ("เครื่องคิดเลขแม่ค้า") */}
              {manualCalcOpen && (
                <MerchantCalculator
                  initialValue={manualAmount}
                  onApply={(val) => setManualAmount(val)}
                  onClose={() => setManualCalcOpen(false)}
                />
              )}

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
          {/* Card A: Cashflow & Category Breakdown (Income Green, Expense Red, Savings Blue) */}
          <section className="bento-card ak-breakdown-card" aria-labelledby="ak-breakdown-heading">
            <div className="ak-card-head">
              <div>
                <h2 id="ak-breakdown-heading" className="card-title">
                  {lang === 'TH'
                    ? 'สัดส่วนรายรับ รายจ่าย & เงินออม'
                    : 'Income, Expenses & Savings Breakdown'}
                </h2>
                <p className="card-subtitle">
                  {lang === 'TH'
                    ? 'เปรียบเทียบกระแสเงินสดทั้ง 3 ด้าน (เขียว = รายรับ • แดง = รายจ่าย • ฟ้า = เงินออม)'
                    : '3-color cashflow overview (Green = Income • Red = Expense • Blue = Savings)'}
                </p>
              </div>
            </div>

            {/* Macro Comparison: Income (Green), Expenses (Red), Net Savings (Blue) */}
            <div className="ak-cashflow-bars">
              <div className="ak-cf-row">
                <div className="ak-cf-label-row">
                  <span className="ak-cf-name">
                    <span className="ak-dot green" aria-hidden="true" />
                    {lang === 'TH' ? 'รายรับรวม' : 'Income'}
                  </span>
                  <span className="ak-cf-val income tabular-nums">{formatTHB(monthlyIncome)}</span>
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
                    <span className="ak-dot red" aria-hidden="true" />
                    {lang === 'TH' ? 'รายจ่ายรวม' : 'Expenses'}
                  </span>
                  <span className="ak-cf-val expense tabular-nums">
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

              <div className="ak-cf-row">
                <div className="ak-cf-label-row">
                  <span className="ak-cf-name">
                    <span className="ak-dot blue" aria-hidden="true" />
                    {lang === 'TH' ? 'เงินออมสุทธิ' : 'Net Savings'}
                  </span>
                  <span
                    className={`ak-cf-val tabular-nums ${netSavings < 0 ? 'expense' : 'saving'}`}
                  >
                    {formatTHB(netSavings, { showSign: netSavings < 0 })} ({netSavingsRate}%)
                  </span>
                </div>
                <div className="ak-bar-track">
                  <div
                    className="ak-bar-fill saving"
                    style={{ width: `${savingsBarWidth}%` }}
                  />
                </div>
              </div>
            </div>

            {budgetBenchmark.hasData && (
              <div id="ak-benchmark-strip" className="ak-benchmark-strip">
                <div className="ak-benchmark-head">
                  <span className="ak-section-micro-label">
                    {lang === 'TH'
                      ? 'เทียบกับเกณฑ์มาตรฐาน 50 / 30 / 20 ของคนวัยทำงาน'
                      : 'Compare vs. Working-Adult 50 / 30 / 20 Benchmark'}
                  </span>
                </div>
                <div className="ak-benchmark-grid tabular-nums">
                  <div className="ak-bm-cell">
                    <span className="ak-bm-label">
                      {lang === 'TH' ? 'จำเป็น (Needs)' : 'Needs'}
                    </span>
                    <strong className="ak-bm-val">
                      {budgetBenchmark.needsPct}%{' '}
                      <small className={budgetBenchmark.needsPct > 55 ? 'warn' : 'ok'}>
                        {lang === 'TH' ? 'เป้า ≤50%' : 'vs ≤50%'}
                      </small>
                    </strong>
                    <span className="ak-bm-sub">{formatTHB(budgetBenchmark.needsAmt)}</span>
                  </div>

                  <div className="ak-bm-cell">
                    <span className="ak-bm-label">
                      {lang === 'TH' ? 'ส่วนตัว/สังคม (Wants)' : 'Wants'}
                    </span>
                    <strong className="ak-bm-val">
                      {budgetBenchmark.wantsPct}%{' '}
                      <small className={budgetBenchmark.wantsPct > 30 ? 'warn' : 'ok'}>
                        {lang === 'TH' ? 'เป้า ≤30%' : 'vs ≤30%'}
                      </small>
                    </strong>
                    <span className="ak-bm-sub">{formatTHB(budgetBenchmark.wantsAmt)}</span>
                  </div>

                  <div className="ak-bm-cell">
                    <span className="ak-bm-label">
                      {lang === 'TH' ? 'ออม/สำรอง (Save)' : 'Savings'}
                    </span>
                    <strong className="ak-bm-val">
                      {budgetBenchmark.savePct}%{' '}
                      <small className={budgetBenchmark.savePct >= 20 ? 'ok' : 'warn'}>
                        {lang === 'TH' ? 'เป้า ≥20%' : 'vs ≥20%'}
                      </small>
                    </strong>
                    <span className="ak-bm-sub">{formatTHB(budgetBenchmark.savingsAmt)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="ak-divider" />

            {/* Category Breakdown Filter (All / Income / Expense / Savings) + Bar/Donut Switcher */}
            <div className="ak-breakdown-filter-row">
              <div className="ak-breakdown-head-left">
                <span className="ak-section-micro-label">
                  {lang === 'TH' ? 'แยกตามหมวดหมู่' : 'By Category'}
                </span>
                <LiquidTabs
                  tabs={chartTypeTabs}
                  activeId={breakdownChartType}
                  onChange={setBreakdownChartType}
                  variant="compact"
                  idPrefix="breakdown-chart-type"
                  ariaLabel={lang === 'TH' ? 'รูปแบบกราฟ' : 'Chart style'}
                />
              </div>
              <LiquidTabs
                tabs={breakdownFilterTabs}
                activeId={breakdownFilter}
                onChange={setBreakdownFilter}
                variant="compact"
                idPrefix="breakdown-filter"
                ariaLabel={lang === 'TH' ? 'กรองสัดส่วนตามประเภท' : 'Filter breakdown'}
              />
            </div>

            {/* Category Breakdown Visualization (Bar or Donut) */}
            {breakdownChartType === 'donut' ? (
              <CashflowDonutChart
                items={cashflowBreakdown.items}
                breakdownFilter={breakdownFilter}
                totalLabel={
                  breakdownFilter === 'income'
                    ? lang === 'TH'
                      ? 'รวมรายรับ'
                      : 'Total Income'
                    : breakdownFilter === 'expense'
                      ? lang === 'TH'
                        ? 'รวมรายจ่าย'
                        : 'Total Expense'
                      : breakdownFilter === 'saving'
                        ? lang === 'TH'
                          ? 'รวมเงินสำรอง'
                          : 'Total Reserve'
                        : lang === 'TH'
                          ? 'รวมทุกหมวด'
                          : 'All Streams'
                }
              />
            ) : (
              <div className="ak-cat-breakdown-list">
                {cashflowBreakdown.items.length === 0 ? (
                  <div className="ak-empty-mini">
                    {lang === 'TH' ? 'ยังไม่มีรายการในหมวดนี้' : 'No items logged in this stream yet'}
                  </div>
                ) : (
                  cashflowBreakdown.items.map((item) => {
                    const Icon = item.icon;
                    const valSign = item.type === 'expense' ? '-' : '+';
                    return (
                      <div
                        key={item.key}
                        className={`ak-cat-bar-item type-${item.type}`}
                      >
                        <div className="ak-cat-bar-top">
                          <span className="ak-cat-bar-name">
                            <span className="ak-cat-bar-icon" aria-hidden="true">
                              <Icon size={14} strokeWidth={2.2} />
                            </span>
                            <span>{t(item.label)}</span>
                          </span>
                          <span className={`ak-cat-bar-val ${item.type} tabular-nums`}>
                            {valSign}
                            {formatTHB(item.amount)}
                            <span className="ak-cat-bar-pct">
                              {' '}
                              ({breakdownFilter === 'all' ? item.pct : item.shareOfStream}%)
                            </span>
                          </span>
                        </div>
                        <div className="ak-bar-track sm">
                          <div
                            className="ak-bar-fill ak-bar-fill-cat"
                            style={{ width: `${breakdownFilter === 'all' ? item.pct : item.shareOfStream}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
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
              id="smartlog-goto-risk-btn"
              type="button"
              className="btn-primary-gradient ak-bridge-cta"
              onClick={() => onNavigate('risk-analysis')}
            >
              <span>
                {lang === 'TH'
                  ? 'ไปวิเคราะห์ความเสี่ยงต่อ (Risk Analysis)'
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
                ? 'ค้นหา กรอง แก้ไข หรือส่งออกเป็นตาราง Excel (.xlsx) และ CSV ได้ทันที ยอดทั้งหมดอัปเดตและบันทึกในเครื่องอัตโนมัติ'
                : 'Search, filter, inline-edit, or export as a formatted Excel (.xlsx) table or CSV — all KPIs recalculate locally'}
            </p>
          </div>

          <div className="activities-controls">
            <LiquidTabs
              tabs={ledgerViewTabs}
              activeId={ledgerViewMode}
              onChange={setLedgerViewMode}
              variant="compact"
              idPrefix="ledger-view-mode"
              ariaLabel={lang === 'TH' ? 'มุมมองสมุดบัญชี' : 'Ledger view mode'}
            />

            {ledgerViewMode === 'list' && (
              <div className="search-input-wrap">
                <Search size={15} className="search-input-icon" aria-hidden="true" />
                <input
                  id="smartlog-ledger-search"
                  type="search"
                  className="search-input"
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  placeholder={t('overview.searchPlaceholder')}
                  aria-label={t('overview.searchPlaceholder')}
                />
              </div>
            )}

            <LiquidTabs
              tabs={ledgerFilterTabs}
              activeId={ledgerFilter}
              onChange={setLedgerFilter}
              variant="compact"
              idPrefix="ledger-filter"
              ariaLabel="Filter ledger"
            />

            <div
              className="ak-export-pair"
              role="group"
              aria-label={lang === 'TH' ? 'ส่งออกไฟล์ตาราง' : 'Export spreadsheets'}
            >
              <button
                id="smartlog-export-excel-btn"
                type="button"
                className="ak-csv-btn ak-export-btn ak-excel-green"
                onClick={handleExportExcel}
                title={
                  lang === 'TH'
                    ? 'ส่งออกเป็นไฟล์ Excel (.xlsx) รูปแบบตาราง 2 ชีต (สมุดบัญชี + สรุปภาพรวม พร้อมสูตร SUM)'
                    : 'Export as a 2-sheet Excel (.xlsx) spreadsheet with live SUM formulas & Summary'
                }
              >
                <FileSpreadsheet size={14} strokeWidth={2.2} aria-hidden="true" />
                <span>{lang === 'TH' ? 'ส่งออก Excel (.xlsx)' : 'Export Excel (.xlsx)'}</span>
              </button>

              <button
                id="smartlog-export-csv-btn"
                type="button"
                className="ak-csv-btn ak-export-btn"
                disabled={filteredTransactions.length === 0}
                onClick={handleExportCsv}
                title={lang === 'TH' ? 'ดาวน์โหลดรายการที่แสดงเป็นไฟล์ CSV' : 'Export visible rows to CSV'}
              >
                <Download size={14} strokeWidth={2.2} aria-hidden="true" />
                <span>{lang === 'TH' ? 'ส่งออก CSV' : 'Export CSV'}</span>
              </button>
            </div>
          </div>
        </div>

        {ledgerViewMode === 'calendar' ? (
          <CashflowCalendarView
            transactions={filteredTransactions}
            customCategories={customCategories}
            onQuickAddDate={handleQuickAddDate}
          />
        ) : (
          <>
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
                  const Icon = getCategoryIconComponent(
                    tx.iconKey,
                    tx.customIcon,
                    customCategories
                  );
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
                  const isEditing = editingTxId === tx.id;

                  if (isEditing) {
                    return (
                      <tr key={tx.id} className="ak-edit-row">
                        <td className="tx-date tabular-nums">{t(tx.date)}</td>
                        <td>
                          <select
                            className="ak-inline-select"
                            value={editDraft.iconKey}
                            onChange={(e) => {
                              const nextKey = e.target.value;
                              const matched = allCategoryMap[nextKey];
                              setEditDraft((prev) => ({
                                ...prev,
                                iconKey: nextKey,
                                category: matched ? matched.type : prev.category,
                              }));
                            }}
                          >
                            {CORE_CATEGORIES.map((c) => (
                              <option key={c.key} value={c.key}>
                                {t(c.label)}
                              </option>
                            ))}
                            {customCategories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {t(c.label || { th: c.name, en: c.name })}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="ak-inline-input"
                            value={editDraft.title}
                            onChange={(e) =>
                              setEditDraft((prev) => ({ ...prev, title: e.target.value }))
                            }
                            maxLength={80}
                          />
                        </td>
                        <td className="align-right">
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            className="ak-inline-input num tabular-nums"
                            value={editDraft.amount}
                            onChange={(e) =>
                              setEditDraft((prev) => ({ ...prev, amount: e.target.value }))
                            }
                          />
                        </td>
                        <td className="align-right">
                          <div className="ak-tx-confirm-group">
                            <button
                              type="button"
                              className="ak-tx-cancel-btn"
                              onClick={cancelEditTx}
                            >
                              {lang === 'TH' ? 'ยกเลิก' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              className="ak-tx-save-confirm"
                              onClick={() => saveEditTx(tx)}
                            >
                              <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                              <span>{lang === 'TH' ? 'บันทึก' : 'Save'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={tx.id}>
                      <td className="tx-date tabular-nums">{t(tx.date)}</td>
                      <td>
                        <div className="ak-ledger-cat-cell">
                          <span
                            className={`tx-icon-circle type-${amountClass}`}
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
                          <div className="ak-tx-row-actions">
                            <button
                              type="button"
                              className="ak-tx-edit-btn"
                              onClick={() => startEditTx(tx)}
                              title={lang === 'TH' ? 'แก้ไขรายการ' : 'Edit entry'}
                              aria-label={lang === 'TH' ? 'แก้ไขรายการ' : 'Edit entry'}
                            >
                              <Pencil size={13} strokeWidth={2.1} />
                            </button>
                            <button
                              id={`delete-tx-${tx.id}`}
                              type="button"
                              className="ak-tx-delete-btn"
                              onClick={() => setConfirmDeleteTxId(tx.id)}
                              title={lang === 'TH' ? 'ลบรายการ' : 'Delete entry'}
                            >
                              <Trash2 size={14} strokeWidth={2.1} />
                              <span>{lang === 'TH' ? 'ลบ' : 'Delete'}</span>
                            </button>
                          </div>
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
              const Icon = getCategoryIconComponent(
                tx.iconKey,
                tx.customIcon,
                customCategories
              );
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
              const isEditing = editingTxId === tx.id;

              if (isEditing) {
                return (
                  <div key={tx.id} className="mobile-tx-card ak-mobile-edit-card">
                    <div className="ak-mobile-edit-grid">
                      <input
                        type="text"
                        className="ak-inline-input"
                        value={editDraft.title}
                        onChange={(e) =>
                          setEditDraft((prev) => ({ ...prev, title: e.target.value }))
                        }
                        maxLength={80}
                      />
                      <div className="form-grid-2">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          className="ak-inline-input tabular-nums"
                          value={editDraft.amount}
                          onChange={(e) =>
                            setEditDraft((prev) => ({ ...prev, amount: e.target.value }))
                          }
                        />
                        <select
                          className="ak-inline-select"
                          value={editDraft.iconKey}
                          onChange={(e) => {
                            const nextKey = e.target.value;
                            const matched = allCategoryMap[nextKey];
                            setEditDraft((prev) => ({
                              ...prev,
                              iconKey: nextKey,
                              category: matched ? matched.type : prev.category,
                            }));
                          }}
                        >
                          {CORE_CATEGORIES.map((c) => (
                            <option key={c.key} value={c.key}>
                              {t(c.label)}
                            </option>
                          ))}
                          {customCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {t(c.label || { th: c.name, en: c.name })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="ak-tx-confirm-group">
                        <button
                          type="button"
                          className="ak-tx-cancel-btn"
                          onClick={cancelEditTx}
                        >
                          {lang === 'TH' ? 'ยกเลิก' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          className="ak-tx-save-confirm"
                          onClick={() => saveEditTx(tx)}
                        >
                          <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                          <span>{lang === 'TH' ? 'บันทึก' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={tx.id} className="mobile-tx-card ak-mobile-tx-card">
                  <div className="mobile-tx-left">
                    <span
                      className={`tx-icon-circle type-${amountClass}`}
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
                      <div className="ak-tx-row-actions">
                        <button
                          type="button"
                          className="ak-tx-edit-btn"
                          onClick={() => startEditTx(tx)}
                          aria-label={lang === 'TH' ? 'แก้ไขรายการ' : 'Edit entry'}
                        >
                          <Pencil size={13} strokeWidth={2.1} />
                        </button>
                        <button
                          type="button"
                          className="ak-tx-delete-icon-only"
                          onClick={() => setConfirmDeleteTxId(tx.id)}
                          aria-label={lang === 'TH' ? 'ลบรายการ' : 'Delete entry'}
                        >
                          <Trash2 size={14} strokeWidth={2.1} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
          </>
        )}
      </section>

      {/* Interactive KPI Drill-Down Modal (Income / Expenses / Net Savings) */}
      {kpiDetailMode && (
        <KpiDetailModal
          mode={kpiDetailMode}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          netSavings={netSavings}
          netSavingsRate={netSavingsRate}
          expenseRatio={expenseRatio}
          transactions={transactions}
          customCategories={customCategories}
          onQuickLog={handleQuickLogFromModal}
          onClose={() => setKpiDetailMode(null)}
        />
      )}

      {/* Custom Category Modal ("อื่น ๆ / หมวดของฉัน") */}
      {catModalTarget && (
        <CustomCategoryModal
          activeCatKey={
            catModalTarget === 'slip' ? extractedSlip?.iconKey : manualCatKey
          }
          defaultType={
            catModalTarget === 'slip'
              ? extractedSlip?.category || 'expense'
              : manualType
          }
          onSelectCategory={(cat) => {
            if (catModalTarget === 'slip') {
              setExtractedSlip((prev) =>
                prev
                  ? {
                      ...prev,
                      iconKey: cat.id,
                      category: cat.type,
                    }
                  : prev
              );
            } else {
              setManualCatKey(cat.id);
              setManualType(cat.type);
            }
          }}
          onClose={() => setCatModalTarget(null)}
        />
      )}
    </div>
  );
}

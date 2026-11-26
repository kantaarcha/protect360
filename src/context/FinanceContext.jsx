import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_OCCUPATION_TH, normalizeOccupation, normalizeTitle } from '../utils/userHelpers';

const STORAGE_KEY = 'protect360_data_v1';

const INITIAL_USER_PROFILE = {
  title: '',
  firstName: '',
  lastName: '',
  age: 25,
  occupation: DEFAULT_OCCUPATION_TH,
  dependents: 0,
  emergencyTargetMonths: 3,
};

const INITIAL_FINANCIALS = {
  personaName: { th: 'First Jobber', en: 'First Jobber' },
  monthlyIncome: 25000,
  monthlyExpenses: 20000,
  monthlySavings: 5000,
  liquidEmergencyFund: 15000,
};

const INITIAL_RISK_PROFILE = {
  riskTolerance: 'moderate',
  assessmentCompleted: false,
  lastAssessedAt: null,
};

const INITIAL_COVERAGES = [
  {
    id: 'sso-33',
    type: 'statutory',
    name: { th: 'ประกันสังคม ม.33', en: 'Social Security Sec. 33' },
    providerTag: { th: 'สิทธิภาครัฐ', en: 'Statutory' },
    cardNumberMask: 'SSO •••• 3301',
    subtitle: {
      th: 'รพ.ตามสิทธิ • คุ้มครองพื้นฐาน',
      en: 'Registered Hospital • Basic Care',
    },
    status: 'active',
    limitKnown: true,
    monthlyPremium: 0, // Statutory payroll contribution tracked separately from personal self-paid insurance
    theme: 'navy',
    benefits: {
      medical: 100000,
      accident: 50000,
      criticalIllness: 0,
      disability: 180000,
      incomeComp: 30000,
      family: 50000,
    },
  },
  {
    id: 'group-ins',
    type: 'employer',
    name: { th: 'ประกันกลุ่มบริษัท', en: 'Employer Group Insurance' },
    providerTag: { th: 'สวัสดิการบริษัท', en: 'Employer' },
    cardNumberMask: 'GRP •••• 0000',
    subtitle: {
      th: 'ไม่ทราบวงเงิน → นับเป็น ฿0',
      en: 'Unknown Limit → Counted as ฿0',
    },
    status: 'unknown_limit',
    limitKnown: false,
    monthlyPremium: 0,
    theme: 'royal',
    benefits: {
      medical: 0,
      accident: 0,
      criticalIllness: 0,
      disability: 0,
      incomeComp: 0,
      family: 0,
    },
  },
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: { th: 'เงินเดือนประจำ', en: 'Monthly Salary' },
    note: { th: 'โอนเข้าบัญชีเงินเดือน', en: 'Payroll Direct Deposit' },
    category: 'income',
    categoryLabel: { th: 'รายรับประจำ', en: 'Salary' },
    iconKey: 'salary',
    date: { th: '25 พ.ย. 2569', en: '25 Nov 2026' },
    amount: 25000,
    status: 'completed',
  },
  {
    id: 'tx-2',
    title: { th: 'ค่าเช่าหอพัก', en: 'Apartment Rent' },
    note: { th: 'ค่าเช่ารายเดือน + ค่าน้ำไฟ', en: 'Monthly rent & utilities' },
    category: 'expense',
    categoryLabel: { th: 'ที่อยู่อาศัย', en: 'Housing' },
    iconKey: 'housing',
    date: { th: '26 พ.ย. 2569', en: '26 Nov 2026' },
    amount: -6500,
    status: 'completed',
  },
  {
    id: 'tx-3',
    title: { th: 'อาหารและกาแฟ', en: 'Food & Coffee' },
    note: { th: 'ค่าอาหารประจำวัน & คาเฟ่', en: 'Daily meals & coffee' },
    category: 'expense',
    categoryLabel: { th: 'อาหาร & เครื่องดื่ม', en: 'Food & Dining' },
    iconKey: 'food',
    date: { th: '26 พ.ย. 2569', en: '26 Nov 2026' },
    amount: -5800,
    status: 'completed',
  },
  {
    id: 'tx-4',
    title: { th: 'ค่าเดินทาง BTS / รถไฟฟ้า', en: 'BTS / Transport' },
    note: { th: 'บัตรโดยสาร BTS & วินมอเตอร์ไซค์', en: 'BTS pass & local commute' },
    category: 'expense',
    categoryLabel: { th: 'การเดินทาง', en: 'Transport' },
    iconKey: 'transport',
    date: { th: '26 พ.ย. 2569', en: '26 Nov 2026' },
    amount: -2700,
    status: 'completed',
  },
  {
    id: 'tx-5',
    title: { th: 'โอนเข้าบัญชีเงินสำรองฉุกเฉิน', en: 'Emergency Saving Transfer' },
    note: { th: 'ออมอัตโนมัติ 20% ของรายได้', en: 'Auto-save 20% of income' },
    category: 'saving',
    categoryLabel: { th: 'เงินออมฉุกเฉิน', en: 'Emergency Fund' },
    iconKey: 'saving',
    date: { th: '26 พ.ย. 2569', en: '26 Nov 2026' },
    amount: -5000,
    status: 'completed',
  },
];

// Needed coverage benchmarks for a First Jobber (transparent actuarial assumptions)
const BASE_RISK_BENCHMARKS = [
  {
    id: 'medical',
    label: { th: 'ค่ารักษาพยาบาล', en: 'Medical' },
    shortLabel: { th: 'รักษาพยาบาล', en: 'Medical' },
    needed: 500000,
    rationale: {
      th: 'ค่ารักษาผู้ป่วยในเอกชนเฉลี่ยต่อครั้งและโรคทั่วไป',
      en: 'Private IPD hospitalization benchmark in Thailand',
    },
  },
  {
    id: 'accident',
    label: { th: 'อุบัติเหตุ', en: 'Accident' },
    shortLabel: { th: 'อุบัติเหตุ', en: 'Accident' },
    needed: 300000,
    rationale: {
      th: 'วงเงินคุ้มครองอุบัติเหตุและการสูญเสียอวัยวะ (1× รายได้ต่อปี)',
      en: 'Personal accident & dismemberment buffer (1× annual income)',
    },
  },
  {
    id: 'criticalIllness',
    label: { th: 'โรคร้ายแรง', en: 'Critical Illness' },
    shortLabel: { th: 'โรคร้ายแรง', en: 'Critical Ill.' },
    needed: 600000,
    rationale: {
      th: 'งบรักษาและพักฟื้นโรคร้ายแรง (2× รายได้ต่อปี)',
      en: 'Targeted care & recovery reserve (2× annual income)',
    },
  },
  {
    id: 'disability',
    label: { th: 'ทุพพลภาพ', en: 'Disability' },
    shortLabel: { th: 'ทุพพลภาพ', en: 'Disability' },
    needed: 900000,
    rationale: {
      th: 'เงินทดแทนกรณีสูญเสียความสามารถในการทำงาน (3× รายได้ต่อปี)',
      en: 'Long-term loss-of-earning cushion (3× annual income)',
    },
  },
  {
    id: 'incomeComp',
    label: { th: 'ชดเชยรายได้', en: 'Income Comp.' },
    shortLabel: { th: 'ชดเชยรายได้', en: 'Income' },
    needed: 180000,
    rationale: {
      th: 'ชดเชยรายได้ช่วงพักรักษาตัวหรือว่างงาน 6 เดือน',
      en: '6-month income continuity during recovery',
    },
  },
  {
    id: 'family',
    label: { th: 'ภาระครอบครัว', en: 'Family Support' },
    shortLabel: { th: 'ครอบครัว', en: 'Family' },
    needed: 400000,
    rationale: {
      th: 'เงินสำรองดูแลพ่อแม่และค่าใช้จ่ายฉุกเฉินสุดท้าย',
      en: 'Parental support & final expense reserve',
    },
  },
];

// Strictly whitelist non-sensitive PDPA-safe userProfile fields (never accept email/phone/ID/password)
function sanitizeNameText(value) {
  if (typeof value !== 'string') return '';
  // Accept both Thai and English letters plus spaces, periods, hyphens, and apostrophes
  return value
    .replace(/[^\u0E00-\u0E7FA-Za-z\s.'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}

function sanitizeUserProfile(raw) {
  if (!raw || typeof raw !== 'object') return { ...INITIAL_USER_PROFILE };
  const rawAge = Number(raw.age);
  const rawDeps = Number(raw.dependents);
  const rawTarget = Number(raw.emergencyTargetMonths);

  return {
    title: normalizeTitle(raw.title),
    firstName: sanitizeNameText(raw.firstName),
    lastName: sanitizeNameText(raw.lastName),
    age: Number.isFinite(rawAge) ? Math.min(99, Math.max(15, Math.round(rawAge))) : 25,
    occupation: normalizeOccupation(raw.occupation),
    dependents: Number.isFinite(rawDeps) ? Math.min(10, Math.max(0, Math.round(rawDeps))) : 0,
    emergencyTargetMonths: rawTarget === 6 ? 6 : 3,
  };
}

function sanitizeNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : fallback;
}

function sanitizeCoverages(raw) {
  if (!Array.isArray(raw)) return INITIAL_COVERAGES;
  const valid = raw.filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      item.name &&
      typeof item.benefits === 'object'
  );
  return valid.length > 0 ? valid : INITIAL_COVERAGES;
}

function sanitizeTransactions(raw) {
  if (!Array.isArray(raw)) return INITIAL_TRANSACTIONS;
  const valid = raw.filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      item.title &&
      Number.isFinite(Number(item.amount))
  );
  return valid;
}

function sanitizeRiskProfile(raw) {
  if (!raw || typeof raw !== 'object') return { ...INITIAL_RISK_PROFILE };
  const allowedTolerance = ['low', 'moderate', 'high'];
  return {
    riskTolerance: allowedTolerance.includes(raw.riskTolerance) ? raw.riskTolerance : 'moderate',
    assessmentCompleted: Boolean(raw.assessmentCompleted),
    lastAssessedAt: typeof raw.lastAssessedAt === 'string' ? raw.lastAssessedAt : null,
  };
}

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        userProfile: { ...INITIAL_USER_PROFILE },
        financials: { ...INITIAL_FINANCIALS },
        coverages: INITIAL_COVERAGES,
        transactions: INITIAL_TRANSACTIONS,
        riskProfile: { ...INITIAL_RISK_PROFILE },
      };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid stored structure');
    }

    const userProfile = sanitizeUserProfile(parsed.userProfile);
    const monthlyIncome = sanitizeNumber(parsed.monthlyIncome, INITIAL_FINANCIALS.monthlyIncome);
    const monthlyExpenses = sanitizeNumber(parsed.monthlyExpenses, INITIAL_FINANCIALS.monthlyExpenses);
    const monthlySavings = sanitizeNumber(
      parsed.monthlySavings,
      Math.max(0, monthlyIncome - monthlyExpenses)
    );
    const liquidEmergencyFund = sanitizeNumber(
      parsed.emergencyFund ?? parsed.liquidEmergencyFund,
      INITIAL_FINANCIALS.liquidEmergencyFund
    );

    return {
      userProfile,
      financials: {
        ...INITIAL_FINANCIALS,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        liquidEmergencyFund,
      },
      coverages: sanitizeCoverages(parsed.coverageItems ?? parsed.coverages),
      transactions: sanitizeTransactions(parsed.transactions),
      riskProfile: sanitizeRiskProfile(parsed.riskProfile),
    };
  } catch {
    return {
      userProfile: { ...INITIAL_USER_PROFILE },
      financials: { ...INITIAL_FINANCIALS },
      coverages: INITIAL_COVERAGES,
      transactions: INITIAL_TRANSACTIONS,
      riskProfile: { ...INITIAL_RISK_PROFILE },
    };
  }
}

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [store, setStore] = useState(loadInitialState);
  const { userProfile, financials, coverages, transactions, riskProfile } = store;
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((type, messageObj) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ id: Date.now(), type, message: messageObj });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3600);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Automatically persist all state to localStorage under 'protect360_data_v1'
  useEffect(() => {
    const payload = {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      userProfile,
      monthlyIncome: financials.monthlyIncome,
      monthlyExpenses: financials.monthlyExpenses,
      monthlySavings: financials.monthlySavings,
      emergencyFund: financials.liquidEmergencyFund,
      coverageItems: coverages,
      transactions,
      riskProfile,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }, [userProfile, financials, coverages, transactions, riskProfile]);

  // Backward-compatible merged profile object for Round 1 & future modules
  const profile = useMemo(
    () => ({
      ...financials,
      emergencyTargetMonths: userProfile.emergencyTargetMonths,
    }),
    [financials, userProfile.emergencyTargetMonths]
  );

  const derived = useMemo(() => {
    const savingsRatio =
      profile.monthlyIncome > 0
        ? Math.round((profile.monthlySavings / profile.monthlyIncome) * 100)
        : 0;

    const targetMonths = userProfile.emergencyTargetMonths || 3;
    const emergencyTarget = profile.monthlyExpenses * targetMonths;
    const emergencyRunway =
      profile.monthlyExpenses > 0
        ? Number((profile.liquidEmergencyFund / profile.monthlyExpenses).toFixed(2))
        : 0;
    const emergencyProgress =
      emergencyTarget > 0
        ? Math.min(100, Math.round((profile.liquidEmergencyFund / emergencyTarget) * 100))
        : 0;

    const selfPaidPremium = coverages.reduce(
      (sum, item) => sum + (Number(item.monthlyPremium) || 0),
      0
    );

    const personalPoliciesCount = coverages.filter((c) => c.type === 'personal').length;
    const hasUnknownCoverage = coverages.some((c) => !c.limitKnown);

    // Adjust family benchmark smoothly if user has dependents (+200,000 THB per dependent)
    const dependentsCount = Number(userProfile.dependents) || 0;
    const activeBenchmarks = BASE_RISK_BENCHMARKS.map((cat) => {
      if (cat.id === 'family' && dependentsCount > 0) {
        return {
          ...cat,
          needed: cat.needed + dependentsCount * 200000,
          rationale: {
            th: `เงินสำรองดูแลคนในความดูแล ${dependentsCount} คน และค่าใช้จ่ายฉุกเฉินครอบครัว`,
            en: `Family reserve tailored for ${dependentsCount} dependent${dependentsCount > 1 ? 's' : ''} & final expenses`,
          },
        };
      }
      return cat;
    });

    // Conservative Estimation: any coverage with limitKnown === false contributes 0 THB
    const protectionComparison = activeBenchmarks.map((cat) => {
      const fromPolicies = coverages.reduce((sum, cov) => {
        if (!cov.limitKnown) return sum;
        return sum + (Number(cov.benefits?.[cat.id]) || 0);
      }, 0);

      // For income compensation, liquid emergency fund also helps cushion short-term income stop
      const effectiveAvailable =
        cat.id === 'incomeComp'
          ? fromPolicies + profile.liquidEmergencyFund
          : fromPolicies;

      const gap = Math.max(0, cat.needed - effectiveAvailable);
      const coveragePct =
        cat.needed > 0
          ? Math.min(100, Math.round((effectiveAvailable / cat.needed) * 100))
          : 100;

      return {
        ...cat,
        effectiveAvailable,
        gap,
        coveragePct,
      };
    });

    const totalNeededCoverage = protectionComparison.reduce((s, c) => s + c.needed, 0);
    const totalEffectiveCoverage = protectionComparison.reduce(
      (s, c) => s + Math.min(c.effectiveAvailable, c.needed),
      0
    );
    const totalProtectionGap = protectionComparison.reduce((s, c) => s + c.gap, 0);

    // Dynamic Risk Status Indicators for Card 6
    const medicalCat = protectionComparison.find((c) => c.id === 'medical');
    const healthLevel =
      hasUnknownCoverage || (medicalCat && medicalCat.coveragePct < 50)
        ? 'high'
        : medicalCat && medicalCat.coveragePct < 80
          ? 'moderate'
          : 'low';

    const incomeLevel =
      emergencyRunway < targetMonths * 0.5
        ? 'high'
        : emergencyRunway < targetMonths
          ? 'moderate'
          : 'low';

    const assetsLevel = 'moderate';

    const riskStatuses = [
      {
        id: 'health-accident',
        level: healthLevel,
        titleKey: 'overview.riskHealthTitle',
        descKey: 'overview.riskHealthDesc',
        metric: `${medicalCat ? medicalCat.coveragePct : 0}%`,
      },
      {
        id: 'income-emergency',
        level: incomeLevel,
        titleKey: 'overview.riskIncomeTitle',
        descObj:
          emergencyRunway >= targetMonths
            ? {
                th: `เงินสำรองครบเกณฑ์ ${targetMonths} เดือนแล้ว (${emergencyRunway.toFixed(2)} เดือน)`,
                en: `Emergency runway meets ${targetMonths}-month target (${emergencyRunway.toFixed(2)} mo.)`,
              }
            : {
                th: `เงินสำรองต่ำกว่าเกณฑ์ ${targetMonths} เดือน (${emergencyRunway.toFixed(2)} เดือน)`,
                en: `Runway below ${targetMonths}-month benchmark (${emergencyRunway.toFixed(2)} mo.)`,
              },
        metric: `${emergencyRunway.toFixed(2)} mo`,
      },
      {
        id: 'assets-auto',
        level: assetsLevel,
        titleKey: 'overview.riskAssetsTitle',
        descKey: 'overview.riskAssetsDesc',
        metric: '50%',
      },
    ];

    return {
      savingsRatio,
      emergencyTarget,
      emergencyRunway,
      emergencyProgress,
      selfPaidPremium,
      personalPoliciesCount,
      hasUnknownCoverage,
      protectionComparison,
      totalNeededCoverage,
      totalEffectiveCoverage,
      totalProtectionGap,
      riskStatuses,
    };
  }, [profile, coverages, userProfile.emergencyTargetMonths, userProfile.dependents]);

  const updateUserProfile = useCallback(
    (patch, { silent = false } = {}) => {
      setStore((prev) => ({
        ...prev,
        userProfile: sanitizeUserProfile({ ...prev.userProfile, ...patch }),
      }));
      if (!silent) {
        showToast('success', {
          th: 'บันทึกข้อมูลส่วนตัวในอุปกรณ์เรียบร้อยแล้ว',
          en: 'Profile saved locally on your device',
        });
      }
    },
    [showToast]
  );

  const updateProfile = useCallback((patch) => {
    if (!patch || typeof patch !== 'object') return;
    setStore((prev) => {
      const nextUserProfile =
        'emergencyTargetMonths' in patch
          ? {
              ...prev.userProfile,
              emergencyTargetMonths: Number(patch.emergencyTargetMonths) === 6 ? 6 : 3,
            }
          : prev.userProfile;
      const { emergencyTargetMonths: _ignored, ...financialPatch } = patch;
      const nextFinancials =
        Object.keys(financialPatch).length > 0
          ? { ...prev.financials, ...financialPatch }
          : prev.financials;
      return {
        ...prev,
        userProfile: nextUserProfile,
        financials: nextFinancials,
      };
    });
  }, []);

  const updateRiskProfile = useCallback((patch) => {
    setStore((prev) => ({
      ...prev,
      riskProfile: sanitizeRiskProfile({ ...prev.riskProfile, ...patch }),
    }));
  }, []);

  const addTransaction = useCallback((tx) => {
    setStore((prev) => ({
      ...prev,
      transactions: [{ ...tx, id: `tx-${Date.now()}` }, ...prev.transactions],
    }));
  }, []);

  const addCoverage = useCallback((newCoverage) => {
    setStore((prev) => ({
      ...prev,
      coverages: [
        ...prev.coverages,
        {
          ...newCoverage,
          id: `cov-${Date.now()}`,
        },
      ],
    }));
  }, []);

  const updateCoverage = useCallback((id, patch) => {
    setStore((prev) => ({
      ...prev,
      coverages: prev.coverages.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  }, []);

  const exportUserData = useCallback(() => {
    const cleanFirstName = (userProfile.firstName || '')
      .trim()
      .replace(/[^\w\u0E00-\u0E7F-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const fileName = `protect360-${cleanFirstName || 'first-jobber'}.json`;

    const backupPayload = {
      app: 'PROTECT360',
      schemaVersion: 1,
      privacy: 'PDPA-Safe / Zero-Login Local Backup (No PII)',
      exportedAt: new Date().toISOString(),
      userProfile,
      monthlyIncome: financials.monthlyIncome,
      monthlyExpenses: financials.monthlyExpenses,
      monthlySavings: financials.monthlySavings,
      emergencyFund: financials.liquidEmergencyFund,
      coverageItems: coverages,
      transactions,
      riskProfile,
    };

    try {
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('success', {
        th: `ดาวน์โหลดไฟล์สำรอง ${fileName} เรียบร้อยแล้ว`,
        en: `Downloaded backup file ${fileName}`,
      });
      return { ok: true, fileName };
    } catch {
      showToast('error', {
        th: 'ไม่สามารถสร้างไฟล์สำรองได้ กรุณาลองใหม่อีกครั้ง',
        en: 'Could not export backup file. Please try again.',
      });
      return { ok: false };
    }
  }, [userProfile, financials, coverages, transactions, riskProfile, showToast]);

  const importUserData = useCallback(
    async (file) => {
      if (!file) {
        return { ok: false };
      }

      try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Root JSON must be an object');
        }

        const hasExpectedShape =
          (parsed.userProfile && typeof parsed.userProfile === 'object') ||
          Array.isArray(parsed.coverageItems) ||
          Array.isArray(parsed.coverages) ||
          Array.isArray(parsed.transactions) ||
          typeof parsed.monthlyIncome === 'number';

        if (!hasExpectedShape) {
          throw new Error('Unrecognized PROTECT360 schema');
        }

        const nextUserProfile = sanitizeUserProfile(parsed.userProfile);
        const nextIncome = sanitizeNumber(parsed.monthlyIncome, INITIAL_FINANCIALS.monthlyIncome);
        const nextExpenses = sanitizeNumber(
          parsed.monthlyExpenses,
          INITIAL_FINANCIALS.monthlyExpenses
        );
        const nextSavings = sanitizeNumber(
          parsed.monthlySavings,
          Math.max(0, nextIncome - nextExpenses)
        );
        const nextEmergencyFund = sanitizeNumber(
          parsed.emergencyFund ?? parsed.liquidEmergencyFund,
          INITIAL_FINANCIALS.liquidEmergencyFund
        );
        const nextCoverages = sanitizeCoverages(parsed.coverageItems ?? parsed.coverages);
        const nextTransactions = sanitizeTransactions(parsed.transactions);
        const nextRiskProfile = sanitizeRiskProfile(parsed.riskProfile);

        setStore({
          userProfile: nextUserProfile,
          financials: {
            ...INITIAL_FINANCIALS,
            monthlyIncome: nextIncome,
            monthlyExpenses: nextExpenses,
            monthlySavings: nextSavings,
            liquidEmergencyFund: nextEmergencyFund,
          },
          coverages: nextCoverages,
          transactions: nextTransactions,
          riskProfile: nextRiskProfile,
        });

        const message = {
          th: 'กู้คืนข้อมูลจากไฟล์สำรองเรียบร้อยแล้ว',
          en: 'Backup restored successfully',
        };
        showToast('success', message);
        return { ok: true, message, userProfile: nextUserProfile };
      } catch {
        const message = {
          th: 'ไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์สำรองข้อมูล PROTECT360 (.json)',
          en: 'Invalid backup file. Please upload a valid PROTECT360 .json file.',
        };
        showToast('error', message);
        return { ok: false, message };
      }
    },
    [showToast]
  );

  const resetDemoData = useCallback(() => {
    setStore({
      userProfile: { ...INITIAL_USER_PROFILE },
      financials: { ...INITIAL_FINANCIALS },
      coverages: INITIAL_COVERAGES,
      transactions: INITIAL_TRANSACTIONS,
      riskProfile: { ...INITIAL_RISK_PROFILE },
    });
    showToast('info', {
      th: 'รีเซ็ตกลับเป็นโปรไฟล์ตัวอย่าง First Jobber เรียบร้อยแล้ว',
      en: 'Reset to default First Jobber demo profile',
    });
  }, [showToast]);

  const value = {
    userProfile,
    profile,
    monthlyIncome: financials.monthlyIncome,
    monthlyExpenses: financials.monthlyExpenses,
    emergencyFund: financials.liquidEmergencyFund,
    coverages,
    coverageItems: coverages,
    transactions,
    riskProfile,
    toast,
    ...derived,
    updateUserProfile,
    updateProfile,
    updateRiskProfile,
    addTransaction,
    addCoverage,
    updateCoverage,
    exportUserData,
    importUserData,
    resetDemoData,
    showToast,
    dismissToast,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return ctx;
}

export function formatTHB(amount, { showSign = false } = {}) {
  const num = Number(amount) || 0;
  const absFormatted = Math.abs(num).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });
  if (showSign) {
    if (num > 0) return `+฿${absFormatted}`;
    if (num < 0) return `-฿${absFormatted}`;
  }
  return num < 0 ? `-฿${absFormatted}` : `฿${absFormatted}`;
}

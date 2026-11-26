import { createContext, useContext, useMemo, useState } from 'react';

const INITIAL_PROFILE = {
  personaName: { th: 'First Jobber', en: 'First Jobber' },
  monthlyIncome: 25000,
  monthlyExpenses: 20000,
  monthlySavings: 5000,
  liquidEmergencyFund: 15000,
  emergencyTargetMonths: 3,
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
const RISK_BENCHMARKS = [
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

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [coverages, setCoverages] = useState(INITIAL_COVERAGES);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  const derived = useMemo(() => {
    const savingsRatio =
      profile.monthlyIncome > 0
        ? Math.round((profile.monthlySavings / profile.monthlyIncome) * 100)
        : 0;

    const emergencyTarget = profile.monthlyExpenses * profile.emergencyTargetMonths;
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

    // Conservative Estimation: any coverage with limitKnown === false contributes 0 THB
    const protectionComparison = RISK_BENCHMARKS.map((cat) => {
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
      emergencyRunway < 1.5 ? 'high' : emergencyRunway < 3 ? 'moderate' : 'low';

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
        descKey: 'overview.riskIncomeDesc',
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
  }, [profile, coverages]);

  const updateProfile = (patch) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const addTransaction = (tx) => {
    setTransactions((prev) => [{ ...tx, id: `tx-${Date.now()}` }, ...prev]);
  };

  const addCoverage = (newCoverage) => {
    setCoverages((prev) => [
      ...prev,
      {
        ...newCoverage,
        id: `cov-${Date.now()}`,
      },
    ]);
  };

  const updateCoverage = (id, patch) => {
    setCoverages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const resetDemoData = () => {
    setProfile(INITIAL_PROFILE);
    setCoverages(INITIAL_COVERAGES);
    setTransactions(INITIAL_TRANSACTIONS);
  };

  const value = {
    profile,
    coverages,
    transactions,
    ...derived,
    updateProfile,
    addTransaction,
    addCoverage,
    updateCoverage,
    resetDemoData,
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

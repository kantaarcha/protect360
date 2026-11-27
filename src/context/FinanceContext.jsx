import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_OCCUPATION_TH, normalizeOccupation, normalizeTitle } from '../utils/userHelpers';
import {
  buildInstantBilingualText,
  translateBilingualAsync,
} from '../utils/bilingualTranslate';
import {
  INITIAL_RISK_PROFILE_DATA,
  computeActuarialRiskAssessment,
  getGovSchemeMeta,
  sanitizeRiskProfileData,
} from '../utils/riskActuarial';

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

const INITIAL_RISK_PROFILE = INITIAL_RISK_PROFILE_DATA;

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
    isoDate: '2026-11-26',
    amount: 5000,
    status: 'completed',
  },
  {
    id: 'tx-6',
    title: { th: 'ค่าโทรศัพท์ เน็ต & ไลฟ์สไตล์', en: 'Mobile, Internet & Lifestyle' },
    note: { th: 'แพ็กเกจเน็ตมือถือ + ของใช้ส่วนตัว', en: 'Mobile plan, streaming & personal care' },
    category: 'expense',
    categoryLabel: { th: 'ไลฟ์สไตล์', en: 'Lifestyle' },
    iconKey: 'lifestyle',
    date: { th: '26 พ.ย. 2569', en: '26 Nov 2026' },
    isoDate: '2026-11-26',
    amount: -5000,
    status: 'completed',
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
  return raw.filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      item.name &&
      typeof item.benefits === 'object'
  );
}

function sanitizeTransactions(raw) {
  if (!Array.isArray(raw)) return INITIAL_TRANSACTIONS;
  const valid = raw
    .filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        item.title &&
        Number.isFinite(Number(item.amount))
    )
    .map((item) => {
      if (
        item.title &&
        typeof item.title === 'object' &&
        item.title.th &&
        item.title.th === item.title.en
      ) {
        const instant = buildInstantBilingualText(item.title.th);
        return { ...item, title: instant.obj };
      }
      return item;
    });
  return valid;
}

function sanitizeRiskProfile(raw) {
  return sanitizeRiskProfileData(raw);
}

// Synchronize Overview virtual coverage cards when RiskAnalysis inputs change
function syncCoveragesWithRiskProfile(prevCoverages, nextRisk) {
  const govMeta = getGovSchemeMeta(nextRisk.govScheme);
  const baseList = Array.isArray(prevCoverages) ? [...prevCoverages] : [];

  const upsert = (list, item) => {
    const idx = list.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      const next = [...list];
      next[idx] = { ...next[idx], ...item };
      return next;
    }
    return [...list, item];
  };

  let updated = upsert(baseList, {
    id: 'sso-33',
    type: 'statutory',
    name: govMeta.label,
    providerTag: { th: 'สิทธิภาครัฐ', en: 'Statutory' },
    cardNumberMask:
      nextRisk.govScheme === 'uc'
        ? 'UC •••• 3000'
        : nextRisk.govScheme === 'civil'
          ? 'GOV •••• 0100'
          : 'SSO •••• 3301',
    subtitle: govMeta.desc,
    status: 'active',
    limitKnown: true,
    monthlyPremium: 0,
    theme: 'navy',
    benefits: { ...govMeta.benefits },
  });

  // Sync Employer Group Insurance card
  if (nextRisk.groupInsurance.active) {
    const isUnknown = nextRisk.groupInsurance.unknownLimit;
    const grpLimit = isUnknown ? 0 : Number(nextRisk.groupInsurance.limit) || 0;
    updated = upsert(updated, {
      id: 'group-ins',
      type: 'employer',
      name: { th: 'ประกันกลุ่มบริษัท', en: 'Employer Group Insurance' },
      providerTag: { th: 'สวัสดิการบริษัท', en: 'Employer' },
      cardNumberMask: 'GRP •••• 0000',
      subtitle: isUnknown
        ? { th: 'ไม่ทราบวงเงิน → นับเป็น ฿0', en: 'Unknown Limit → Counted as ฿0' }
        : {
            th: `วงเงินค่ารักษา ฿${grpLimit.toLocaleString('en-US')}`,
            en: `Medical Limit ฿${grpLimit.toLocaleString('en-US')}`,
          },
      status: isUnknown ? 'unknown_limit' : 'active',
      limitKnown: !isUnknown,
      monthlyPremium: 0,
      theme: 'royal',
      benefits: {
        medical: grpLimit,
        accident: 0,
        criticalIllness: 0,
        disability: 0,
        incomeComp: 0,
        family: 0,
      },
    });
  } else {
    updated = updated.filter((c) => c.id !== 'group-ins');
  }

  // Sync 4 structured personal policy rows from RiskAnalysis
  const personalSpecs = [
    {
      key: 'health',
      id: 'ra-personal-health',
      name: { th: 'ประกันสุขภาพส่วนตัว', en: 'Personal Health Insurance' },
      mask: 'HLT •••• 1001',
      benefitKey: 'medical',
    },
    {
      key: 'accident',
      id: 'ra-personal-accident',
      name: { th: 'ประกันอุบัติเหตุ (PA)', en: 'Personal Accident (PA)' },
      mask: 'PA •••• 2002',
      benefitKey: 'accident',
    },
    {
      key: 'criticalIllness',
      id: 'ra-personal-ci',
      name: { th: 'ประกันโรคร้ายแรง (CI)', en: 'Critical Illness (CI)' },
      mask: 'CI •••• 3003',
      benefitKey: 'criticalIllness',
    },
    {
      key: 'lifeDisability',
      id: 'ra-personal-life',
      name: { th: 'ประกันชีวิต & ทุพพลภาพ', en: 'Life & Disability Policy' },
      mask: 'LIF •••• 4004',
      benefitKey: 'lifeDisability',
    },
  ];

  for (const spec of personalSpecs) {
    const row = nextRisk.personalPolicies?.[spec.key];
    if (row?.active) {
      const isUnknown = row.unknownLimit;
      const amt = isUnknown ? 0 : Number(row.limit) || 0;
      const benefits = {
        medical: 0,
        accident: 0,
        criticalIllness: 0,
        disability: 0,
        incomeComp: 0,
        family: 0,
      };
      if (spec.benefitKey === 'lifeDisability') {
        benefits.disability = amt;
        benefits.family = amt;
      } else {
        benefits[spec.benefitKey] = amt;
      }
      updated = upsert(updated, {
        id: spec.id,
        type: 'personal',
        name: spec.name,
        providerTag: { th: 'ประกันส่วนตัว', en: 'Personal' },
        cardNumberMask: spec.mask,
        subtitle: isUnknown
          ? { th: 'ไม่ทราบวงเงิน → นับเป็น ฿0', en: 'Unknown Limit → Counted as ฿0' }
          : {
              th: `ทุนคุ้มครอง ฿${amt.toLocaleString('en-US')}`,
              en: `Coverage ฿${amt.toLocaleString('en-US')}`,
            },
        status: isUnknown ? 'unknown_limit' : 'active',
        limitKnown: !isUnknown,
        monthlyPremium: 0,
        theme: 'teal',
        benefits,
      });
    } else {
      updated = updated.filter((c) => c.id !== spec.id);
    }
  }

  return updated;
}

function sanitizeCustomCategories(raw) {
  if (!Array.isArray(raw)) return [];
  const allowedTypes = ['expense', 'income', 'saving'];
  return raw
    .filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        item.name.trim().length > 0
    )
    .slice(0, 40)
    .map((item) => {
      const cleanName = item.name.trim().slice(0, 28);
      const hasBilingualLabel =
        item.label &&
        typeof item.label === 'object' &&
        typeof item.label.th === 'string' &&
        typeof item.label.en === 'string' &&
        item.label.th.trim() &&
        item.label.en.trim();
      const label = hasBilingualLabel
        ? item.label.th === item.label.en
          ? buildInstantBilingualText(item.label.th).obj
          : { th: item.label.th.trim(), en: item.label.en.trim() }
        : buildInstantBilingualText(cleanName).obj;
      return {
        id: item.id,
        name: cleanName,
        label,
        type: allowedTypes.includes(item.type) ? item.type : 'expense',
        iconName: typeof item.iconName === 'string' ? item.iconName : 'tag',
        color: typeof item.color === 'string' ? item.color : '#2878C8',
      };
    });
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
        customCategories: [],
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
      customCategories: sanitizeCustomCategories(parsed.customCategories),
    };
  } catch {
    return {
      userProfile: { ...INITIAL_USER_PROFILE },
      financials: { ...INITIAL_FINANCIALS },
      coverages: INITIAL_COVERAGES,
      transactions: INITIAL_TRANSACTIONS,
      riskProfile: { ...INITIAL_RISK_PROFILE },
      customCategories: [],
    };
  }
}

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [store, setStore] = useState(loadInitialState);
  const { userProfile, financials, coverages, transactions, riskProfile, customCategories } = store;
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
      customCategories,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }, [userProfile, financials, coverages, transactions, riskProfile, customCategories]);

  // Backward-compatible merged profile object for Round 1 & future modules
  const profile = useMemo(
    () => ({
      ...financials,
      emergencyTargetMonths: userProfile.emergencyTargetMonths,
    }),
    [financials, userProfile.emergencyTargetMonths]
  );

  const derived = useMemo(() => {
    const netMonthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
    const savingsRatio =
      profile.monthlyIncome > 0
        ? Math.round((netMonthlySavings / profile.monthlyIncome) * 100)
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

    const riskAssessment = computeActuarialRiskAssessment({
      monthlyIncome: profile.monthlyIncome,
      monthlyExpenses: profile.monthlyExpenses,
      emergencyFund: profile.liquidEmergencyFund,
      dependents: userProfile.dependents,
      riskProfile,
      coverages,
    });

    const protectionComparison = riskAssessment.categories;
    const hasUnknownCoverage = riskAssessment.hasAnyUnknownLimit;
    const totalNeededCoverage = riskAssessment.totalNeededCoverage;
    const totalEffectiveCoverage = riskAssessment.totalEffectiveCoverage;
    const totalProtectionGap = riskAssessment.totalProtectionGap;

    // Dynamic Risk Status Indicators for Overview Card 6
    const medicalCat = protectionComparison.find((c) => c.id === 'medical');
    const medicalPct = medicalCat ? medicalCat.coveragePct : 0;
    const healthLevel = medicalCat ? medicalCat.level : 'high';

    const incomeLevel =
      emergencyRunway < targetMonths * 0.5
        ? 'high'
        : emergencyRunway < targetMonths
          ? 'moderate'
          : 'low';

    const familyCat = protectionComparison.find((c) => c.id === 'family');
    const assetsLevel = familyCat ? familyCat.level : 'moderate';

    const riskStatuses = [
      {
        id: 'health-accident',
        level: healthLevel,
        titleKey: 'overview.riskHealthTitle',
        descObj: hasUnknownCoverage
          ? {
              th: 'มีสิทธิที่ยังไม่ทราบวงเงิน (นับเป็น ฿0) ควรตรวจสอบสิทธิจริง',
              en: 'Contains unknown-limit coverage (counted as ฿0) — verify actual limit',
            }
          : healthLevel === 'low'
            ? {
                th: `วงเงินค่ารักษาครอบคลุม ${medicalPct}% ของเกณฑ์อ้างอิงแล้ว`,
                en: `Medical protection covers ${medicalPct}% of benchmark`,
              }
            : {
                th: `วงเงินค่ารักษาครอบคลุม ${medicalPct}% ยังมีช่องว่างควรพิจารณาเพิ่ม`,
                en: `Medical coverage at ${medicalPct}% — residual gap remains`,
              },
        metric: `${medicalPct}%`,
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
        metric: `${familyCat ? familyCat.coveragePct : 50}%`,
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
      riskAssessment,
      riskStatuses,
    };
  }, [profile, coverages, riskProfile, userProfile.emergencyTargetMonths, userProfile.dependents]);

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
      const mergedFinancials =
        Object.keys(financialPatch).length > 0
          ? { ...prev.financials, ...financialPatch }
          : prev.financials;
      const nextFinancials = {
        ...mergedFinancials,
        monthlySavings: Math.max(
          0,
          (Number(mergedFinancials.monthlyIncome) || 0) -
            (Number(mergedFinancials.monthlyExpenses) || 0)
        ),
      };
      return {
        ...prev,
        userProfile: nextUserProfile,
        financials: nextFinancials,
      };
    });
  }, []);

  const updateRiskProfile = useCallback((patch) => {
    if (!patch || typeof patch !== 'object') return;
    setStore((prev) => {
      const merged = {
        ...prev.riskProfile,
        ...patch,
        groupInsurance: patch.groupInsurance
          ? { ...prev.riskProfile.groupInsurance, ...patch.groupInsurance }
          : prev.riskProfile.groupInsurance,
        personalPolicies: patch.personalPolicies
          ? {
              ...prev.riskProfile.personalPolicies,
              ...Object.fromEntries(
                Object.entries(patch.personalPolicies).map(([k, v]) => [
                  k,
                  { ...(prev.riskProfile.personalPolicies?.[k] || {}), ...v },
                ])
              ),
            }
          : prev.riskProfile.personalPolicies,
      };
      const nextRisk = sanitizeRiskProfile(merged);
      const shouldSyncCards =
        'govScheme' in patch || 'groupInsurance' in patch || 'personalPolicies' in patch;
      return {
        ...prev,
        riskProfile: nextRisk,
        coverages: shouldSyncCards
          ? syncCoveragesWithRiskProfile(prev.coverages, nextRisk)
          : prev.coverages,
      };
    });
  }, []);

  const applyTransactionDelta = (prevFinancials, tx, direction) => {
    const absAmount = Math.abs(Number(tx?.amount) || 0);
    if (absAmount === 0) return prevFinancials;

    let nextIncome = prevFinancials.monthlyIncome;
    let nextExpenses = prevFinancials.monthlyExpenses;
    let nextEmergency = prevFinancials.liquidEmergencyFund;

    if (tx.category === 'income') {
      nextIncome = Math.max(0, nextIncome + direction * absAmount);
    } else if (tx.category === 'expense') {
      nextExpenses = Math.max(0, nextExpenses + direction * absAmount);
    } else if (tx.category === 'saving') {
      nextEmergency = Math.max(0, nextEmergency + direction * absAmount);
    }

    const nextSavings = Math.max(0, nextIncome - nextExpenses);

    return {
      ...prevFinancials,
      monthlyIncome: nextIncome,
      monthlyExpenses: nextExpenses,
      monthlySavings: nextSavings,
      liquidEmergencyFund: nextEmergency,
    };
  };

  const addTransaction = useCallback(
    (tx, { silent = false } = {}) => {
      const normalizedAmount =
        tx.category === 'expense'
          ? -Math.abs(Number(tx.amount) || 0)
          : Math.abs(Number(tx.amount) || 0);

      // Check if user entered single-language text (th === en) that needs bilingual translation
      let resolvedTitle = tx.title;
      let asyncSourceText = null;
      if (typeof tx.title === 'string') {
        const instant = buildInstantBilingualText(tx.title);
        resolvedTitle = instant.obj;
        if (instant.needsAsync) asyncSourceText = tx.title.trim();
      } else if (
        tx.title &&
        typeof tx.title === 'object' &&
        tx.title.th &&
        tx.title.th === tx.title.en
      ) {
        const instant = buildInstantBilingualText(tx.title.th);
        resolvedTitle = instant.obj;
        if (instant.needsAsync) asyncSourceText = tx.title.th.trim();
      }

      const newTx = {
        ...tx,
        title: resolvedTitle,
        amount: normalizedAmount,
        status: tx.status || 'completed',
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };
      setStore((prev) => ({
        ...prev,
        financials: applyTransactionDelta(prev.financials, newTx, 1),
        transactions: [newTx, ...prev.transactions],
      }));
      if (!silent) {
        showToast('success', {
          th: 'บันทึกรายการและอัปเดตภาพรวมการเงินเรียบร้อยแล้ว',
          en: 'Transaction saved and financial dashboard updated',
        });
      }

      // Non-blocking background TH <-> EN translation for free-form user input
      if (asyncSourceText) {
        const txId = newTx.id;
        translateBilingualAsync(asyncSourceText).then((bilingualTitle) => {
          if (!bilingualTitle || bilingualTitle.th === bilingualTitle.en) return;
          setStore((prev) => ({
            ...prev,
            transactions: prev.transactions.map((item) =>
              item.id === txId &&
              item.title?.th === asyncSourceText &&
              item.title?.en === asyncSourceText
                ? { ...item, title: bilingualTitle }
                : item
            ),
          }));
        });
      }

      return newTx;
    },
    [showToast]
  );

  const updateTransaction = useCallback(
    (id, patch, { silent = false } = {}) => {
      let resolvedPatch = patch;
      let asyncSourceText = null;

      if (
        !silent &&
        patch?.title &&
        typeof patch.title === 'object' &&
        patch.title.th &&
        patch.title.th === patch.title.en
      ) {
        const instant = buildInstantBilingualText(patch.title.th);
        resolvedPatch = { ...patch, title: instant.obj };
        if (instant.needsAsync) asyncSourceText = patch.title.th.trim();
      }

      setStore((prev) => {
        const existing = prev.transactions.find((t) => t.id === id);
        if (!existing) return prev;
        const reverted = applyTransactionDelta(prev.financials, existing, -1);
        const nextCategory = resolvedPatch.category || existing.category;
        const rawAmount =
          resolvedPatch.amount !== undefined ? resolvedPatch.amount : existing.amount;
        const normalizedAmount =
          nextCategory === 'expense'
            ? -Math.abs(Number(rawAmount) || 0)
            : Math.abs(Number(rawAmount) || 0);
        const updatedTx = {
          ...existing,
          ...resolvedPatch,
          category: nextCategory,
          amount: normalizedAmount,
        };
        const applied = applyTransactionDelta(reverted, updatedTx, 1);
        return {
          ...prev,
          financials: applied,
          transactions: prev.transactions.map((t) => (t.id === id ? updatedTx : t)),
        };
      });

      if (!silent) {
        showToast('success', {
          th: 'อัปเดตรายการเรียบร้อยแล้ว',
          en: 'Transaction updated',
        });
      }

      if (asyncSourceText) {
        translateBilingualAsync(asyncSourceText).then((bilingualTitle) => {
          if (!bilingualTitle || bilingualTitle.th === bilingualTitle.en) return;
          setStore((prev) => ({
            ...prev,
            transactions: prev.transactions.map((item) =>
              item.id === id &&
              item.title?.th === asyncSourceText &&
              item.title?.en === asyncSourceText
                ? { ...item, title: bilingualTitle }
                : item
            ),
          }));
        });
      }
    },
    [showToast]
  );

  const removeTransaction = useCallback(
    (id) => {
      setStore((prev) => {
        const target = prev.transactions.find((t) => t.id === id);
        if (!target) return prev;
        return {
          ...prev,
          financials: applyTransactionDelta(prev.financials, target, -1),
          transactions: prev.transactions.filter((t) => t.id !== id),
        };
      });
      showToast('info', {
        th: 'ลบรายการและคำนวณยอดใหม่เรียบร้อยแล้ว',
        en: 'Transaction deleted and totals recalculated',
      });
    },
    [showToast]
  );

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
    setStore((prev) => {
      const nextCoverages = prev.coverages.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      );
      let nextRisk = prev.riskProfile;
      if (id === 'group-ins') {
        const updatedItem = nextCoverages.find((c) => c.id === 'group-ins');
        if (updatedItem) {
          nextRisk = {
            ...prev.riskProfile,
            groupInsurance: {
              active: true,
              unknownLimit: !updatedItem.limitKnown,
              limit: Number(updatedItem.benefits?.medical) || 0,
            },
          };
        }
      }
      return {
        ...prev,
        coverages: nextCoverages,
        riskProfile: nextRisk,
      };
    });
  }, []);

  const removeCoverage = useCallback(
    (id) => {
      setStore((prev) => {
        let nextRisk = prev.riskProfile;
        if (id === 'group-ins') {
          nextRisk = {
            ...prev.riskProfile,
            groupInsurance: {
              ...prev.riskProfile.groupInsurance,
              active: false,
            },
          };
        } else if (id === 'ra-personal-health') {
          nextRisk = {
            ...prev.riskProfile,
            personalPolicies: {
              ...prev.riskProfile.personalPolicies,
              health: { ...prev.riskProfile.personalPolicies.health, active: false },
            },
          };
        } else if (id === 'ra-personal-accident') {
          nextRisk = {
            ...prev.riskProfile,
            personalPolicies: {
              ...prev.riskProfile.personalPolicies,
              accident: { ...prev.riskProfile.personalPolicies.accident, active: false },
            },
          };
        } else if (id === 'ra-personal-ci') {
          nextRisk = {
            ...prev.riskProfile,
            personalPolicies: {
              ...prev.riskProfile.personalPolicies,
              criticalIllness: {
                ...prev.riskProfile.personalPolicies.criticalIllness,
                active: false,
              },
            },
          };
        } else if (id === 'ra-personal-life') {
          nextRisk = {
            ...prev.riskProfile,
            personalPolicies: {
              ...prev.riskProfile.personalPolicies,
              lifeDisability: {
                ...prev.riskProfile.personalPolicies.lifeDisability,
                active: false,
              },
            },
          };
        }
        return {
          ...prev,
          coverages: prev.coverages.filter((item) => item.id !== id),
          riskProfile: nextRisk,
        };
      });
      showToast('info', {
        th: 'ลบสิทธิความคุ้มครองเรียบร้อยแล้ว',
        en: 'Coverage item removed',
      });
    },
    [showToast]
  );

  const addCustomCategory = useCallback(
    ({ name, type = 'expense', iconName = 'tag', color = '#2878C8' }) => {
      const trimmed = String(name || '').trim().slice(0, 28);
      if (!trimmed) return null;

      const instant = buildInstantBilingualText(trimmed);
      const newCat = {
        id: `ccat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: trimmed,
        label: instant.obj,
        type: ['expense', 'income', 'saving'].includes(type) ? type : 'expense',
        iconName: iconName || 'tag',
        color: color || '#2878C8',
      };
      setStore((prev) => ({
        ...prev,
        customCategories: [newCat, ...(prev.customCategories || [])].slice(0, 40),
      }));
      showToast('success', {
        th: `สร้างหมวดหมู่ "${instant.obj.th}" เรียบร้อยแล้ว`,
        en: `Created custom category "${instant.obj.en}"`,
      });

      if (instant.needsAsync) {
        const catId = newCat.id;
        translateBilingualAsync(trimmed).then((bilingualLabel) => {
          if (!bilingualLabel || bilingualLabel.th === bilingualLabel.en) return;
          setStore((prev) => ({
            ...prev,
            customCategories: (prev.customCategories || []).map((c) =>
              c.id === catId ? { ...c, label: bilingualLabel } : c
            ),
            transactions: prev.transactions.map((tx) =>
              tx.iconKey === catId ? { ...tx, categoryLabel: bilingualLabel } : tx
            ),
          }));
        });
      }

      return newCat;
    },
    [showToast]
  );

  const removeCustomCategory = useCallback(
    (id) => {
      setStore((prev) => ({
        ...prev,
        customCategories: (prev.customCategories || []).filter((item) => item.id !== id),
      }));
      showToast('info', {
        th: 'ลบหมวดหมู่ที่สร้างเองเรียบร้อยแล้ว',
        en: 'Custom category deleted',
      });
    },
    [showToast]
  );

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
      customCategories,
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
  }, [userProfile, financials, coverages, transactions, riskProfile, customCategories, showToast]);

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
        const nextCustomCategories = sanitizeCustomCategories(parsed.customCategories);

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
          customCategories: nextCustomCategories,
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
      customCategories: [],
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
    customCategories: customCategories || [],
    toast,
    ...derived,
    updateUserProfile,
    updateProfile,
    updateRiskProfile,
    addTransaction,
    updateTransaction,
    removeTransaction,
    addCustomCategory,
    removeCustomCategory,
    addCoverage,
    updateCoverage,
    removeCoverage,
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
  const raw = Number(amount) || 0;
  const rounded = Math.round(raw * 100) / 100;
  const hasDecimals = !Number.isInteger(rounded);
  const absFormatted = Math.abs(rounded).toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  });
  if (showSign) {
    if (rounded > 0) return `+฿${absFormatted}`;
    if (rounded < 0) return `-฿${absFormatted}`;
  }
  return rounded < 0 ? `-฿${absFormatted}` : `฿${absFormatted}`;
}

// Pure transparent actuarial engine for PROTECT360 Risk & Protection Gap Analysis (Round 3)
// Strictly neutral educational formulas — zero brand promotion or insurance sales.

export const GOV_SCHEMES = [
  {
    id: 'sso',
    label: { th: 'ประกันสังคม ม.33', en: 'Social Security (Sec. 33)' },
    shortLabel: { th: 'ประกันสังคม ม.33', en: 'Social Security' },
    desc: {
      th: 'ฐานคุ้มครองค่ารักษาพยาบาลฉุกเฉินเบื้องต้น ~฿100,000',
      en: 'Emergency medical baseline estimated at ~฿100,000',
    },
    benefits: {
      medical: 100000,
      accident: 0,
      criticalIllness: 0,
      disability: 0,
      incomeComp: 0,
      family: 0,
    },
  },
  {
    id: 'uc',
    label: { th: 'บัตรทอง (30 บาท)', en: 'Universal Coverage (Gold Card)' },
    shortLabel: { th: 'บัตรทอง', en: 'Universal Coverage' },
    desc: {
      th: 'รักษาตามสิทธิโรงพยาบาลรัฐ (ประเมินฐานฉุกเฉิน ~฿80,000)',
      en: 'Public hospital baseline (estimated ~฿80,000)',
    },
    benefits: {
      medical: 80000,
      accident: 0,
      criticalIllness: 0,
      disability: 0,
      incomeComp: 0,
      family: 0,
    },
  },
  {
    id: 'civil',
    label: { th: 'สวัสดิการข้าราชการ', en: 'Civil Servant Medical Benefit' },
    shortLabel: { th: 'ข้าราชการ', en: 'Civil Servant' },
    desc: {
      th: 'สิทธิเบิกจ่ายตรงโรงพยาบาลรัฐ (ประเมินฐาน ~฿350,000)',
      en: 'Direct public-hospital reimbursement baseline (~฿350,000)',
    },
    benefits: {
      medical: 350000,
      accident: 50000,
      criticalIllness: 0,
      disability: 100000,
      incomeComp: 0,
      family: 0,
    },
  },
];

export const INITIAL_RISK_PROFILE_DATA = {
  riskTolerance: 'moderate',
  assessmentCompleted: false,
  lastAssessedAt: null,
  monthlyDebt: 0,
  totalDebt: 0,
  govScheme: 'sso',
  groupInsurance: {
    active: true,
    unknownLimit: true,
    limit: 0,
  },
  personalPolicies: {
    health: { active: false, unknownLimit: false, limit: 0 },
    accident: { active: false, unknownLimit: false, limit: 0 },
    criticalIllness: { active: false, unknownLimit: false, limit: 0 },
    lifeDisability: { active: false, unknownLimit: false, limit: 0 },
  },
};

export function getGovSchemeMeta(schemeId) {
  return GOV_SCHEMES.find((s) => s.id === schemeId) || GOV_SCHEMES[0];
}

function safeNonNegative(val, fallback = 0) {
  const num = Number(val);
  return Number.isFinite(num) && num >= 0 ? num : fallback;
}

export function sanitizeRiskPolicyRow(raw, fallback) {
  if (!raw || typeof raw !== 'object') return { ...fallback };
  return {
    active: Boolean(raw.active),
    unknownLimit: Boolean(raw.unknownLimit),
    limit: safeNonNegative(raw.limit, 0),
  };
}

export function sanitizeRiskProfileData(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      ...INITIAL_RISK_PROFILE_DATA,
      groupInsurance: { ...INITIAL_RISK_PROFILE_DATA.groupInsurance },
      personalPolicies: {
        health: { ...INITIAL_RISK_PROFILE_DATA.personalPolicies.health },
        accident: { ...INITIAL_RISK_PROFILE_DATA.personalPolicies.accident },
        criticalIllness: { ...INITIAL_RISK_PROFILE_DATA.personalPolicies.criticalIllness },
        lifeDisability: { ...INITIAL_RISK_PROFILE_DATA.personalPolicies.lifeDisability },
      },
    };
  }
  const allowedTolerance = ['low', 'moderate', 'high'];
  const allowedSchemes = ['sso', 'uc', 'civil'];
  const rawPersonal = raw.personalPolicies || {};

  return {
    riskTolerance: allowedTolerance.includes(raw.riskTolerance) ? raw.riskTolerance : 'moderate',
    assessmentCompleted: Boolean(raw.assessmentCompleted),
    lastAssessedAt: typeof raw.lastAssessedAt === 'string' ? raw.lastAssessedAt : null,
    monthlyDebt: safeNonNegative(raw.monthlyDebt, 0),
    totalDebt: safeNonNegative(raw.totalDebt, 0),
    govScheme: allowedSchemes.includes(raw.govScheme) ? raw.govScheme : 'sso',
    groupInsurance: sanitizeRiskPolicyRow(
      raw.groupInsurance,
      INITIAL_RISK_PROFILE_DATA.groupInsurance
    ),
    personalPolicies: {
      health: sanitizeRiskPolicyRow(
        rawPersonal.health,
        INITIAL_RISK_PROFILE_DATA.personalPolicies.health
      ),
      accident: sanitizeRiskPolicyRow(
        rawPersonal.accident,
        INITIAL_RISK_PROFILE_DATA.personalPolicies.accident
      ),
      criticalIllness: sanitizeRiskPolicyRow(
        rawPersonal.criticalIllness,
        INITIAL_RISK_PROFILE_DATA.personalPolicies.criticalIllness
      ),
      lifeDisability: sanitizeRiskPolicyRow(
        rawPersonal.lifeDisability,
        INITIAL_RISK_PROFILE_DATA.personalPolicies.lifeDisability
      ),
    },
  };
}

/**
 * Computes the 6 actuarial risk categories under Conservative Estimation:
 * Any active coverage marked "unknownLimit" strictly contributes 0 THB.
 */
export function computeActuarialRiskAssessment({
  monthlyIncome = 25000,
  monthlyExpenses = 20000,
  emergencyFund = 15000,
  dependents = 0,
  riskProfile = INITIAL_RISK_PROFILE_DATA,
  coverages = [],
}) {
  const income = safeNonNegative(monthlyIncome, 0);
  const expenses = safeNonNegative(monthlyExpenses, 0);
  const liquidCash = safeNonNegative(emergencyFund, 0);
  const depCount = Math.max(0, Math.round(Number(dependents) || 0));
  const rp = sanitizeRiskProfileData(riskProfile);

  const govMeta = getGovSchemeMeta(rp.govScheme);

  // Additional known personal policies added manually via Overview's CoverageModal (exclude synced ids)
  const SYNCED_IDS = new Set([
    'sso-33',
    'group-ins',
    'ra-personal-health',
    'ra-personal-accident',
    'ra-personal-ci',
    'ra-personal-life',
  ]);
  const extraCoverages = Array.isArray(coverages)
    ? coverages.filter((c) => c && !SYNCED_IDS.has(c.id))
    : [];

  const sumExtra = (benefitKey) =>
    extraCoverages.reduce((acc, cov) => {
      if (!cov.limitKnown) return acc;
      return acc + safeNonNegative(cov.benefits?.[benefitKey], 0);
    }, 0);

  const hasExtraUnknown = extraCoverages.some((c) => !c.limitKnown);
  const hasGroupUnknown = rp.groupInsurance.active && rp.groupInsurance.unknownLimit;
  const hasPersonalUnknown = Object.values(rp.personalPolicies).some(
    (p) => p.active && p.unknownLimit
  );
  const hasAnyUnknownLimit = hasGroupUnknown || hasPersonalUnknown || hasExtraUnknown;

  // Conservative Effective Available amounts (Unknown limit = 0 THB strictly!)
  const effGroupMedical =
    rp.groupInsurance.active && !rp.groupInsurance.unknownLimit
      ? rp.groupInsurance.limit
      : 0;
  const effPersonalHealth =
    rp.personalPolicies.health.active && !rp.personalPolicies.health.unknownLimit
      ? rp.personalPolicies.health.limit
      : 0;
  const effPersonalAccident =
    rp.personalPolicies.accident.active && !rp.personalPolicies.accident.unknownLimit
      ? rp.personalPolicies.accident.limit
      : 0;
  const effPersonalCI =
    rp.personalPolicies.criticalIllness.active &&
    !rp.personalPolicies.criticalIllness.unknownLimit
      ? rp.personalPolicies.criticalIllness.limit
      : 0;
  const effPersonalLifeDisability =
    rp.personalPolicies.lifeDisability.active &&
    !rp.personalPolicies.lifeDisability.unknownLimit
      ? rp.personalPolicies.lifeDisability.limit
      : 0;

  // 1) Medical Risk: Needed = 500,000 THB
  const medicalNeeded = 500000;
  const medicalEffective =
    govMeta.benefits.medical + effGroupMedical + effPersonalHealth + sumExtra('medical');

  // 2) Accident Risk: Needed = 300,000 THB
  const accidentNeeded = 300000;
  const accidentEffective =
    govMeta.benefits.accident + effPersonalAccident + sumExtra('accident');

  // 3) Critical Illness Risk: Needed = monthlyExpenses * 24 months
  const ciNeeded = Math.max(120000, Math.round(expenses * 24));
  const ciEffective =
    govMeta.benefits.criticalIllness + effPersonalCI + sumExtra('criticalIllness');

  // 4) Disability Risk: Needed = monthlyIncome * 12 * 3 years
  const disabilityNeeded = Math.max(180000, Math.round(income * 12 * 3));
  const disabilityEffective =
    govMeta.benefits.disability + effPersonalLifeDisability + sumExtra('disability');

  // 5) Income Interruption Risk: Needed = monthlyExpenses * 6 months vs liquid emergencyFund
  const incomeNeeded = Math.max(60000, Math.round(expenses * 6));
  const incomeEffective = liquidCash;

  // 6) Family & Debt Responsibility: (monthlyExpenses * 36 * dependents) + totalDebt, min 100,000 THB
  const familyNeeded =
    depCount === 0 && rp.totalDebt === 0
      ? 100000
      : Math.max(100000, Math.round(expenses * 36 * depCount + rp.totalDebt));
  const familyEffective =
    govMeta.benefits.family + effPersonalLifeDisability + sumExtra('family');

  const classifyLevel = (coveragePct, hasDirectUnknown = false) => {
    if (coveragePct >= 80 && !hasDirectUnknown) return 'low'; // Covered / เพียงพอ
    if (coveragePct >= 40) return 'moderate'; // Moderate / ปานกลาง
    return 'high'; // High Risk / เสี่ยงสูง
  };

  const buildCategory = ({
    id,
    label,
    shortLabel,
    needed,
    effectiveAvailable,
    hasDirectUnknown = false,
    rationale,
    formulaText,
    whyItMatters,
    mechanism,
  }) => {
    const gap = Math.max(0, needed - effectiveAvailable);
    const coveragePct =
      needed > 0 ? Math.min(100, Math.round((effectiveAvailable / needed) * 100)) : 100;
    const level = classifyLevel(coveragePct, hasDirectUnknown);

    return {
      id,
      label,
      shortLabel,
      needed,
      effectiveAvailable,
      gap,
      coveragePct,
      level,
      hasDirectUnknown,
      rationale,
      formulaText,
      whyItMatters,
      mechanism,
    };
  };

  const categories = [
    buildCategory({
      id: 'medical',
      label: { th: 'ค่ารักษาพยาบาล', en: 'Medical Risk' },
      shortLabel: { th: 'รักษาพยาบาล', en: 'Medical' },
      needed: medicalNeeded,
      effectiveAvailable: medicalEffective,
      hasDirectUnknown:
        hasGroupUnknown ||
        (rp.personalPolicies.health.active && rp.personalPolicies.health.unknownLimit),
      rationale: {
        th: 'วงเงินสำรองค่ารักษาผู้ป่วยในเอกชน (฿500,000) เทียบสิทธิภาครัฐและสวัสดิการที่ทราบวงเงิน',
        en: 'Private IPD hospitalization buffer (฿500,000) vs. statutory & known medical limits',
      },
      formulaText: {
        th: `เกณฑ์อ้างอิง ฿500,000 • ฐาน${govMeta.shortLabel.th} + สิทธิที่ทราบวงเงินชัดเจน`,
        en: `Benchmark ฿500,000 • ${govMeta.shortLabel.en} baseline + known medical limits`,
      },
      whyItMatters: {
        th: 'ค่ารักษาพยาบาลในโรงพยาบาลเอกชนสำหรับการผ่าตัดหรือพักรักษาตัวหลายคืนอาจสูงถึงหลักแสน หากวงเงินไม่พอจะต้องดึงเงินออมหรือก่อหนี้ฉุกเฉินทันที',
        en: 'Unexpected hospitalization or surgery at a private hospital can quickly reach hundreds of thousands of baht, wiping out years of early-career savings.',
      },
      mechanism: {
        th: 'ใช้สิทธิภาครัฐและประกันกลุ่มเป็นฐานแรก หากยังมีช่องว่างและต้องการความคล่องตัวใน รพ.เอกชน กลไกการโอนย้ายความเสี่ยงแบบเหมาจ่าย (หรือแบบมีความรับผิดส่วนแรก Deductible ที่ประหยัดเบี้ยกว่า) จะช่วยรับภาระส่วนเกินได้',
        en: 'Layer your statutory scheme and employer group plan first. To cover residual private-hospital exposure without overpaying, a deductible-based medical buffer can absorb large shocks above your existing limits.',
      },
    }),
    buildCategory({
      id: 'accident',
      label: { th: 'ความเสี่ยงอุบัติเหตุ', en: 'Accident Risk' },
      shortLabel: { th: 'อุบัติเหตุ', en: 'Accident' },
      needed: accidentNeeded,
      effectiveAvailable: accidentEffective,
      hasDirectUnknown:
        rp.personalPolicies.accident.active && rp.personalPolicies.accident.unknownLimit,
      rationale: {
        th: 'วงเงินคุ้มครองอุบัติเหตุและการบาดเจ็บฉุกเฉิน (฿300,000)',
        en: 'Emergency injury & accidental dismemberment buffer (฿300,000)',
      },
      formulaText: {
        th: 'เกณฑ์อ้างอิง ฿300,000 เทียบวงเงินอุบัติเหตุที่ทราบแน่ชัด',
        en: 'Benchmark ฿300,000 vs. known accident coverage limits',
      },
      whyItMatters: {
        th: 'อุบัติเหตุจากการเดินทางหรือชีวิตประจำวันเกิดขึ้นได้ทันทีแม้ในวัยหนุ่มสาวที่สุขภาพแข็งแรง และมักต้องการการรักษาฉุกเฉินเร่งด่วนนอกเวลาทำการ',
        en: 'Commuting and everyday accidents occur regardless of age or health status, often requiring immediate ER care and follow-up treatment.',
      },
      mechanism: {
        th: 'กลไกคุ้มครองอุบัติเหตุส่วนบุคคล (PA) มีต้นทุนต่ำที่สุดเมื่อเทียบกับความเสี่ยงอื่น เพราะเบี้ยคงที่และคุ้มครองทั้งค่ารักษาต่อครั้งและกรณีสูญเสียอวัยวะ เหมาะเป็นชั้นป้องกันแรกหลังเงินสำรองฉุกเฉิน',
        en: 'Personal Accident (PA) risk transfer has the lowest cost-per-baht of protection, covering both per-incident ER bills and severe injury on a simple annual structure.',
      },
    }),
    buildCategory({
      id: 'criticalIllness',
      label: { th: 'โรคร้ายแรง', en: 'Critical Illness Risk' },
      shortLabel: { th: 'โรคร้ายแรง', en: 'Critical Ill.' },
      needed: ciNeeded,
      effectiveAvailable: ciEffective,
      hasDirectUnknown:
        rp.personalPolicies.criticalIllness.active &&
        rp.personalPolicies.criticalIllness.unknownLimit,
      rationale: {
        th: `เงินสำรองพักฟื้นและค่าใช้จ่ายต่อเนื่อง 24 เดือน (รายจ่าย × 24 เดือน)`,
        en: '24-month recovery & non-medical living reserve (monthly expenses × 24)',
      },
      formulaText: {
        th: `รายจ่าย ฿${expenses.toLocaleString('en-US')} × 24 เดือน = ฿${ciNeeded.toLocaleString('en-US')}`,
        en: `Expenses ฿${expenses.toLocaleString('en-US')} × 24 months = ฿${ciNeeded.toLocaleString('en-US')}`,
      },
      whyItMatters: {
        th: 'เมื่อตรวจพบโรคร้ายแรง นอกจากค่ารักษาแล้วยังมีค่าเดินทาง ค่าอาหารเฉพาะโรค และช่วงที่ต้องหยุดทำงานยาวนาน 1–2 ปี ทำให้ขาดรายได้ต่อเนื่อง',
        en: 'Beyond hospital bills, serious illnesses trigger 1–2 years of recovery costs, specialized care, and reduced earning capacity.',
      },
      mechanism: {
        th: 'กลไกคุ้มครองโรคร้ายแรงแบบ "เจอ-จ่าย-จบ" จะจ่ายเงินก้อนตามเงื่อนไขการวินิจฉัย ช่วยเติมสภาพคล่องให้ใช้จ่ายดำรงชีวิตและพักฟื้นควบคู่กับการรักษาตามสิทธิหลัก',
        en: 'A lump-sum critical illness benefit pays cash directly upon confirmed diagnosis, funding living costs and recovery alongside your core hospital coverage.',
      },
    }),
    buildCategory({
      id: 'disability',
      label: { th: 'ทุพพลภาพ', en: 'Disability Risk' },
      shortLabel: { th: 'ทุพพลภาพ', en: 'Disability' },
      needed: disabilityNeeded,
      effectiveAvailable: disabilityEffective,
      hasDirectUnknown:
        rp.personalPolicies.lifeDisability.active &&
        rp.personalPolicies.lifeDisability.unknownLimit,
      rationale: {
        th: 'เงินทดแทนความสามารถในการหารายได้ 3 ปี (รายได้ต่อปี × 3)',
        en: '3-year loss-of-earning-power cushion (annual income × 3)',
      },
      formulaText: {
        th: `รายรับ ฿${income.toLocaleString('en-US')} × 12 × 3 ปี = ฿${disabilityNeeded.toLocaleString('en-US')}`,
        en: `Income ฿${income.toLocaleString('en-US')} × 12 × 3 yrs = ฿${disabilityNeeded.toLocaleString('en-US')}`,
      },
      whyItMatters: {
        th: 'สำหรับวัยเริ่มทำงาน "ความสามารถในการทำงานหาเงิน" คือสินทรัพย์ที่มีมูลค่าสูงที่สุด หากสูญเสียความสามารถในการทำงานถาวร รายได้จะหยุดลงทันทีแต่ค่าครองชีพยังคงอยู่',
        en: 'For early-career earners, human capital—your ability to earn income—is your largest asset. Permanent disability stops cashflow while living costs continue.',
      },
      mechanism: {
        th: 'การป้องกันความเสี่ยงทุพพลภาพมักผูกอยู่ในความคุ้มครองชีวิตหรืออุบัติเหตุระดับสูง ช่วยจ่ายเงินก้อนหรือเงินงวดทดแทนรายได้ เพื่อให้มีเวลาปรับตัวและไม่กลายเป็นภาระครอบครัว',
        en: 'Total Permanent Disability (TPD) protection replaces lost future earnings with a lump sum or income stream so you can adapt without burdening loved ones.',
      },
    }),
    buildCategory({
      id: 'incomeComp',
      label: { th: 'การขาดรายได้ฉุกเฉิน', en: 'Income Interruption' },
      shortLabel: { th: 'ขาดรายได้', en: 'Income Stop' },
      needed: incomeNeeded,
      effectiveAvailable: incomeEffective,
      hasDirectUnknown: false,
      rationale: {
        th: 'เงินสดสำรองฉุกเฉิน 6 เดือน (รายจ่าย × 6 เดือน) เทียบเงินสำรองพร้อมใช้จริง',
        en: '6-month emergency cash buffer (monthly expenses × 6) vs. liquid emergency fund',
      },
      formulaText: {
        th: `รายจ่าย ฿${expenses.toLocaleString('en-US')} × 6 เดือน = ฿${incomeNeeded.toLocaleString('en-US')} เทียบเงินสดพร้อมใช้`,
        en: `Expenses ฿${expenses.toLocaleString('en-US')} × 6 mo. = ฿${incomeNeeded.toLocaleString('en-US')} vs. liquid cash`,
      },
      whyItMatters: {
        th: 'ภาวะว่างงาน เปลี่ยนงาน หรือหยุดพักรักษาตัวระยะสั้นไม่สามารถโอนความเสี่ยงทั้งหมดให้บริษัทประกันได้ ต้องอาศัย "เงินสดสภาพคล่องสูง" ที่ถอนใช้ได้ทันทีโดยไม่ขาดทุน',
        en: 'Job transitions, layoffs, or short unpaid breaks cannot be fully insured—they require immediate, penalty-free liquid cash.',
      },
      mechanism: {
        th: 'รับความเสี่ยงไว้เอง (Risk Retention) ด้วยบัญชีออมทรัพย์ดอกเบี้ยสูงหรือกองทุนตลาดเงินแยกต่างหากจากบัญชีใช้จ่ายประจำ ตั้งเป้า 3 เดือนเป็นขั้นต่ำ และขยายสู่ 6 เดือนเพื่อความมั่นคงสูงสุด',
        en: 'Use Risk Retention: build a dedicated high-yield savings account or money-market fund separate from daily spending—start with 3 months and grow toward 6 months.',
      },
    }),
    buildCategory({
      id: 'family',
      label: { th: 'ภาระครอบครัวและหนี้สิน', en: 'Family & Debt Responsibility' },
      shortLabel: { th: 'ครอบครัว/หนี้', en: 'Family & Debt' },
      needed: familyNeeded,
      effectiveAvailable: familyEffective,
      hasDirectUnknown:
        rp.personalPolicies.lifeDisability.active &&
        rp.personalPolicies.lifeDisability.unknownLimit,
      rationale:
        depCount === 0 && rp.totalDebt === 0
          ? {
              th: 'เงินสำรองจัดการภาระสุดท้ายขั้นต่ำ ฿100,000 (ไม่มีผู้อยู่ในอุปการะและไม่มีหนี้สิน)',
              en: 'Minimum ฿100,000 final-expense reserve (0 dependents & ฿0 debt)',
            }
          : {
              th: `ดูแลผู้อยู่ในอุปการะ ${depCount} คน (3 ปี) + ปิดหนี้คงค้างรวม ฿${rp.totalDebt.toLocaleString('en-US')}`,
              en: `3-year support for ${depCount} dependent(s) + ฿${rp.totalDebt.toLocaleString('en-US')} outstanding debt`,
            },
      formulaText:
        depCount === 0 && rp.totalDebt === 0
          ? {
              th: 'ขั้นต่ำ ฿100,000 (ไม่มีคนในความดูแลและยอดหนี้ ฿0)',
              en: 'Minimum ฿100,000 floor (0 dependents & ฿0 debt)',
            }
          : {
              th: `(฿${expenses.toLocaleString('en-US')} × 36 × ${depCount} คน) + หนี้ ฿${rp.totalDebt.toLocaleString('en-US')}`,
              en: `(฿${expenses.toLocaleString('en-US')} × 36 × ${depCount} dep.) + ฿${rp.totalDebt.toLocaleString('en-US')} debt`,
            },
      whyItMatters: {
        th: 'หากมีพ่อแม่ ครอบครัวที่ต้องดูแล หรือมีหนี้ก้อนใหญ่ (เช่น รถ บ้าน) ความสูญเสียที่ไม่คาดคิดจะส่งต่อภาระทางการเงินไปยังคนข้างหลังทันที',
        en: 'If family members rely on your income or you carry major debt, an unexpected loss transfers immediate financial liability to loved ones.',
      },
      mechanism: {
        th: 'หากยังไม่มีคนในความดูแลและไม่มีหนี้ เน้นเก็บเงินสำรองฉุกเฉินก่อน แต่เมื่อเริ่มมีภาระครอบครัวหรือหนี้สิน การป้องกันแบบคุ้มครองชั่วระยะเวลา (Term Life) จะให้ทุนคุ้มครองสูงด้วยเบี้ยที่ต่ำที่สุด',
        en: 'With zero dependents and no debt, focus on liquid cash first. Once dependents or large debts enter the picture, pure Term protection offers high death-benefit efficiency at minimal cost.',
      },
    }),
  ];

  const totalNeededCoverage = categories.reduce((s, c) => s + c.needed, 0);
  const totalEffectiveCoverage = categories.reduce(
    (s, c) => s + Math.min(c.effectiveAvailable, c.needed),
    0
  );
  const totalProtectionGap = categories.reduce((s, c) => s + c.gap, 0);
  const overallCoveragePct =
    totalNeededCoverage > 0
      ? Math.round((totalEffectiveCoverage / totalNeededCoverage) * 100)
      : 100;

  const highRiskCount = categories.filter((c) => c.level === 'high').length;
  const moderateRiskCount = categories.filter((c) => c.level === 'moderate').length;
  const coveredCount = categories.filter((c) => c.level === 'low').length;

  let overallRiskLevel = 'low';
  if (highRiskCount >= 3 || overallCoveragePct < 35) {
    overallRiskLevel = 'high';
  } else if (highRiskCount >= 1 || moderateRiskCount >= 2 || overallCoveragePct < 75) {
    overallRiskLevel = 'moderate';
  }

  const debtToIncomeRatio =
    income > 0 ? Math.round((rp.monthlyDebt / income) * 100) : 0;

  return {
    categories,
    totalNeededCoverage,
    totalEffectiveCoverage,
    totalProtectionGap,
    overallCoveragePct,
    overallRiskLevel,
    highRiskCount,
    moderateRiskCount,
    coveredCount,
    hasAnyUnknownLimit,
    hasGroupUnknown,
    hasPersonalUnknown,
    debtToIncomeRatio,
    govMeta,
  };
}

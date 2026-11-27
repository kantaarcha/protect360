// Pure JavaScript Financial Survival Simulation Engine for PROTECT360 Survival Lab
// Neutral actuarial education only — zero brand/product recommendations.

export const EMERGENCY_DEBT_APR = 0.2; // 20% annual interest on emergency cash advance
export const HR_GROUP_INSURANCE_BONUS = 50000; // +50,000 THB hidden coverage unlocked by asking HR
export const PROTECTION_LEVERAGE_RATIO = 120; // 1,000 THB/mo basic protection pool ≈ 120,000 THB shock capacity

export const MIN_EVENTS_PER_MONTH = 3;
export const MAX_EVENTS_PER_MONTH = 6;

export const DURATION_PRESETS = [
  {
    id: 'express',
    days: 30,
    months: 1,
    minTurns: 3,
    maxTurns: 6,
    tag: { th: '~45 วิ – 1.5 นาที', en: '~45s – 1.5m' },
    labelDays: { th: '30 วัน', en: '30 Days' },
    labelMonths: { th: '1 เดือน', en: '1 Month' },
    desc: {
      th: 'สุ่ม 3–6 เหตุการณ์ (3–6/เดือน) • เริ่มต้นลองเล่นเร็ว',
      en: 'Random 3–6 events (3–6/mo) • Quick starter run',
    },
  },
  {
    id: 'standard',
    days: 90,
    months: 3,
    minTurns: 9,
    maxTurns: 18,
    tag: { th: '~2 – 4 นาที', en: '~2 – 4 min' },
    labelDays: { th: '90 วัน', en: '90 Days' },
    labelMonths: { th: '3 เดือน', en: '3 Months' },
    desc: {
      th: 'สุ่ม 9–18 เหตุการณ์ (3–6/เดือน) • ทดสอบกันชนมาตรฐาน',
      en: 'Random 9–18 events (3–6/mo) • Classic 3-mo test',
    },
  },
  {
    id: 'extended',
    days: 180,
    months: 6,
    minTurns: 18,
    maxTurns: 36,
    tag: { th: '~4 – 8 นาที', en: '~4 – 8 min' },
    labelDays: { th: '180 วัน', en: '180 Days' },
    labelMonths: { th: '6 เดือน', en: '6 Months' },
    desc: {
      th: 'สุ่ม 18–36 เหตุการณ์ (3–6/เดือน) • ทดสอบความอึดระยะกลาง',
      en: 'Random 18–36 events (3–6/mo) • Mid-term endurance',
    },
  },
  {
    id: 'full-year',
    days: 365,
    months: 12,
    minTurns: 36,
    maxTurns: 72,
    tag: { th: '~8 – 15 นาที', en: '~8 – 15 min' },
    labelDays: { th: '365 วัน', en: '365 Days' },
    labelMonths: { th: '12 เดือน', en: '12 Months' },
    desc: {
      th: 'สุ่ม 36–72 เหตุการณ์ (สูงสุด 72) • จำลองครบ 1 ปีเต็ม',
      en: 'Random 36–72 events (max 72) • Full-year stress test',
    },
  },
];

export const DEFAULT_CHALLENGE_PERSONA = {
  id: 'default',
  displayName: 'First Jobber',
  monthlyIncome: 25000,
  monthlyExpenses: 20000,
  emergencyFund: 15000,
  existingProtectionLimit: 0,
  hasUnknownGroupLimit: true,
  hasStatutory: true,
  coverageSummary: {
    th: 'ประกันสังคม ม.33 + ประกันกลุ่มบริษัท (ไม่ทราบวงเงิน → นับเป็น ฿0)',
    en: 'SSO Sec. 33 + Employer Group Insurance (Unknown Limit → ฿0)',
  },
};

export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/**
 * Auto-round user-typed custom days upward to multiples of 5:
 * 1-4 -> 5, 6-9 -> 10, 11-14 -> 15, ..., capped at 365.
 */
export function roundCustomDays(rawValue) {
  const num = Number(rawValue);
  if (!Number.isFinite(num) || num <= 0) return 5;
  const ceiled = Math.ceil(num / 5) * 5;
  return clamp(ceiled, 5, 365);
}

export function getMonthCountForDuration(unit, durationValue) {
  if (unit === 'months') {
    return clamp(Math.round(Number(durationValue) || 1), 1, 12);
  }
  const days = Math.max(5, Number(durationValue) || 30);
  return clamp(Math.round(days / 30), 1, 12);
}

export function getTurnRangeForDuration(unit, durationValue) {
  const monthsCount = getMonthCountForDuration(unit, durationValue);
  return {
    monthsCount,
    minTurns: monthsCount * MIN_EVENTS_PER_MONTH,
    maxTurns: monthsCount * MAX_EVENTS_PER_MONTH,
  };
}

/**
 * Independently rolls 3, 4, 5, or 6 events for each simulated month.
 * 1 month (30 days) => 3–6 events; 12 months (365 days) => 36–72 events.
 */
export function rollMonthlyEventPlan(unit, durationValue) {
  const { monthsCount, minTurns, maxTurns } = getTurnRangeForDuration(unit, durationValue);
  const monthlyCounts = [];
  let totalTurns = 0;
  for (let m = 0; m < monthsCount; m += 1) {
    const count =
      MIN_EVENTS_PER_MONTH +
      Math.floor(Math.random() * (MAX_EVENTS_PER_MONTH - MIN_EVENTS_PER_MONTH + 1));
    monthlyCounts.push(count);
    totalTurns += count;
  }
  return {
    monthsCount,
    monthlyCounts,
    totalTurns,
    minTurns,
    maxTurns,
  };
}

export function getTurnCountForDuration(unit, durationValue) {
  const { minTurns, maxTurns } = getTurnRangeForDuration(unit, durationValue);
  return Math.round((minTurns + maxTurns) / 2);
}

function formatDurationSegment(seconds, lang) {
  if (seconds < 60) {
    const roundedSec = Math.max(30, Math.round(seconds / 15) * 15);
    return lang === 'TH' ? `${roundedSec} วิ` : `${roundedSec}s`;
  }
  const mins = seconds / 60;
  if (mins < 2) {
    const halfStep = Math.round(mins * 2) / 2;
    return lang === 'TH' ? `${halfStep} นาที` : `${halfStep} min`;
  }
  const wholeMin = Math.round(mins);
  return lang === 'TH' ? `${wholeMin} นาที` : `${wholeMin} min`;
}

export function getEstimatedPlayTimeRange(minTurns, maxTurns) {
  // ~13 sec/event minimum pace, ~14.5 sec/event thoughtful reading pace
  const minSec = Math.max(45, Math.round(minTurns * 13));
  const maxSec = Math.max(90, Math.round(maxTurns * 14.5));
  if (minTurns === 3 && maxTurns === 6) {
    return { th: '~45 วิ – 1.5 นาที', en: '~45s – 1.5 min' };
  }
  if (minTurns === 9 && maxTurns === 18) {
    return { th: '~2 – 4 นาที', en: '~2 – 4 min' };
  }
  if (minTurns === 18 && maxTurns === 36) {
    return { th: '~4 – 8 นาที', en: '~4 – 8 min' };
  }
  if (minTurns === 36 && maxTurns === 72) {
    return { th: '~8 – 15 นาที', en: '~8 – 15 min' };
  }
  const thMin = formatDurationSegment(minSec, 'TH');
  const thMax = formatDurationSegment(maxSec, 'TH');
  const enMin = formatDurationSegment(minSec, 'EN');
  const enMax = formatDurationSegment(maxSec, 'EN');
  if (thMin === thMax) {
    return { th: `~${thMin}`, en: `~${enMin}` };
  }
  return {
    th: `~${thMin} – ${thMax}`,
    en: `~${enMin} – ${enMax}`,
  };
}

export function getEstimatedPlayTime(turns) {
  const sec = Math.max(45, Math.round(turns * 13.5));
  return {
    th: `~${formatDurationSegment(sec, 'TH')}`,
    en: `~${formatDurationSegment(sec, 'EN')}`,
  };
}

export function getTotalMonthsForDuration(unit, durationValue) {
  if (unit === 'months') return Math.max(1, Number(durationValue) || 1);
  return Math.max(5 / 30, (Number(durationValue) || 30) / 30);
}

/**
 * Extract effective medical/accident protection from FinanceContext coverageItems
 * using strict Conservative Estimation (unknown limits count as 0 THB).
 */
export function buildUserPersona({
  userProfile,
  monthlyIncome,
  monthlyExpenses,
  emergencyFund,
  coverageItems,
}) {
  const safeIncome = Math.max(0, Math.round(Number(monthlyIncome) || 0));
  const safeExpenses = Math.max(0, Math.round(Number(monthlyExpenses) || 0));
  const safeEmergency = Math.max(0, Math.round(Number(emergencyFund) || 0));

  const items = Array.isArray(coverageItems) ? coverageItems : [];
  let knownProtectionLimit = 0;
  let hasUnknownGroupLimit = false;
  let hasStatutory = false;

  items.forEach((item) => {
    if (!item) return;
    if (item.type === 'statutory') {
      hasStatutory = true;
      return;
    }
    const isUnknown = item.limitKnown === false || item.status === 'unknown_limit';
    if (item.type === 'employer' && isUnknown) {
      hasUnknownGroupLimit = true;
      return;
    }
    if (isUnknown) return;

    const b = item.benefits || {};
    const med = Number(b.medical) || 0;
    const acc = Number(b.accident) || 0;
    const ci = Number(b.criticalIllness) || 0;
    knownProtectionLimit += Math.max(med, acc) + Math.min(med, acc) * 0.5 + (med === 0 && acc === 0 ? ci * 0.25 : 0);
  });

  const roundedLimit = Math.round(knownProtectionLimit);
  const firstName = (userProfile?.firstName || '').trim();
  const displayName = firstName || 'First Jobber';

  let coverageSummary;
  if (roundedLimit > 0) {
    coverageSummary = {
      th: `วงเงินคุ้มครองที่ยืนยันแล้ว ฿${roundedLimit.toLocaleString('en-US')}${hasUnknownGroupLimit ? ' (ยังมีสวัสดิการที่ไม่ทราบวงเงิน)' : ''}`,
      en: `Confirmed Protection Limit ฿${roundedLimit.toLocaleString('en-US')}${hasUnknownGroupLimit ? ' (plus unknown employer limit)' : ''}`,
    };
  } else if (hasUnknownGroupLimit) {
    coverageSummary = {
      th: 'มีประกันกลุ่มแต่ยังไม่ทราบวงเงิน (นับเป็น ฿0 ตามหลักประเมินแบบรอบคอบ)',
      en: 'Employer group insurance limit unknown (counted as ฿0 conservatively)',
    };
  } else if (hasStatutory) {
    coverageSummary = {
      th: 'มีเฉพาะสิทธิพื้นฐานภาครัฐ ยังไม่มีวงเงินคุ้มครองค่ารักษาเอกชน',
      en: 'Statutory rights only — no private medical/accident transfer limit yet',
    };
  } else {
    coverageSummary = {
      th: 'ยังไม่มีข้อมูลความคุ้มครองเพิ่มเติมในระบบ',
      en: 'No confirmed supplemental protection recorded yet',
    };
  }

  return {
    id: 'profile',
    displayName,
    monthlyIncome: safeIncome,
    monthlyExpenses: safeExpenses,
    emergencyFund: safeEmergency,
    existingProtectionLimit: roundedLimit,
    hasUnknownGroupLimit,
    hasStatutory,
    coverageSummary,
  };
}

export function computeProtectionPool({
  existingProtectionLimit = 0,
  monthlyProtectionBudget = 0,
  askedHr = false,
}) {
  const fromBudget = Math.round((Number(monthlyProtectionBudget) || 0) * PROTECTION_LEVERAGE_RATIO);
  const fromHr = askedHr ? HR_GROUP_INSURANCE_BONUS : 0;
  return Math.max(0, Math.round(existingProtectionLimit) + fromBudget + fromHr);
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build randomized month-by-month event deck (3–6 events per month, up to 72 events for 12 months).
 * Prioritizes unseen events, avoids back-to-back repeats, and guarantees major ~฿100,000 shocks.
 */
export function buildEventDeck(totalTurns, persona, previousEventIds = []) {
  const monthlyIncome = Math.max(10000, Number(persona?.monthlyIncome) || 25000);
  const incomeDropAmount = Math.round(monthlyIncome * 0.2);

  const CRITICAL_POOL = [
    {
      id: 'accident-100k',
      category: 'accident',
      severity: 'critical',
      billAmount: 100000,
      badge: { th: 'วิกฤตอุบัติเหตุใหญ่', en: 'Major Accident Shock' },
      title: {
        th: 'อุบัติเหตุรถเฉี่ยวชน / กระดูกหัก ต้องผ่าตัดและพักฟื้น',
        en: 'Road Traffic Accident / Fracture Requiring Surgery',
      },
      story: {
        th: 'เหตุไม่คาดฝันระหว่างเดินทางกลับบ้านทำให้กระดูกข้อมือและไหปลาร้าหัก ต้องผ่าตัดเร่งด่วน บิลค่ารักษาและค่าผ่าตัดรวม ฿100,000',
        en: 'An unexpected commute collision causes a fracture requiring urgent surgery and recovery care. The total hospital bill is ฿100,000.',
      },
    },
    {
      id: 'appendicitis-95k',
      category: 'medical',
      severity: 'critical',
      billAmount: 95000,
      badge: { th: 'ผ่าตัดฉุกเฉิน', en: 'Emergency Surgery' },
      title: {
        th: 'ไส้ติ่งอักเสบเฉียบพลัน ต้องผ่าตัดส่องกล้องกลางดึก',
        en: 'Acute Appendicitis — Late-Night Emergency Surgery',
      },
      story: {
        th: 'ปวดท้องรุนแรงกะทันหันกลางดึก แพทย์วินิจฉัยไส้ติ่งอักเสบใกล้แตกต้องผ่าตัดส่องกล้องทันที ค่ารักษาและห้องพักฟื้นรวม ฿95,000',
        en: 'Sudden severe abdominal pain at midnight turns out to be acute appendicitis needing immediate surgery. Total bill: ฿95,000.',
      },
    },
    {
      id: 'slip-fracture-110k',
      category: 'accident',
      severity: 'critical',
      billAmount: 110000,
      badge: { th: 'อุบัติเหตุหนัก', en: 'Severe Injury Shock' },
      title: {
        th: 'ลื่นล้มรุนแรง / เอ็นหัวเข่าฉีกขาด ต้องผ่าตัดและกายภาพ',
        en: 'Severe Fall / Torn Knee Ligament Surgery & Rehab',
      },
      story: {
        th: 'พื้นเปียกช่วงฝนตกทำให้ลื่นล้มเข่าบิดรุนแรง เอ็นไขว้หน้าขาดต้องผ่าตัดส่องกล้องและทำกายภาพต่อ รวมค่ารักษา ฿110,000',
        en: 'A bad slip on wet pavement tears your knee ligament, requiring surgical reconstruction and follow-up rehab totaling ฿110,000.',
      },
    },
  ];

  const MEDICAL_POOL = [
    {
      id: 'medical-45k',
      category: 'medical',
      severity: 'high',
      billAmount: 45000,
      badge: { th: 'เหตุฉุกเฉินสุขภาพ', en: 'Medical Shock' },
      title: {
        th: 'อาหารเป็นพิษรุนแรง / ไข้เลือดออก ต้องแอดมิตด่วน',
        en: 'Severe Food Poisoning / Dengue — Urgent Hospital Admission',
      },
      story: {
        th: 'คุณไข้สูงเฉียบพลันตอนตี 2 ต้องเข้าโรงพยาบาลเอกชนใกล้บ้านและนอนพักรักษาตัว 3 คืน บิลค่ารักษาและค่าห้องรวมทั้งสิ้น ฿45,000',
        en: 'A sudden high fever at 2 AM sends you to the nearest private hospital for 3 nights. Total medical and room charges come to ฿45,000.',
      },
    },
    {
      id: 'flu-pneumonia-38k',
      category: 'medical',
      severity: 'high',
      billAmount: 38000,
      badge: { th: 'เจ็บป่วยเฉียบพลัน', en: 'Acute Illness' },
      title: {
        th: 'ไข้หวัดใหญ่สายพันธุ์ใหม่แทรกซ้อน นอน รพ. 2 คืน',
        en: 'Severe Influenza Complication — 2-Night Hospital Stay',
      },
      story: {
        th: 'พักผ่อนน้อยสะสมจนติดไข้หวัดใหญ่และมีภาวะหลอดลมอักเสบ ต้องพ่นยาและให้น้ำเกลือที่ รพ. 2 คืน ค่าใช้จ่ายรวม ฿38,000',
        en: 'Exhaustion leads to severe influenza with bronchitis requiring IV fluids and 2 nights of inpatient care totaling ฿38,000.',
      },
    },
    {
      id: 'allergy-er-32k',
      category: 'medical',
      severity: 'high',
      billAmount: 32000,
      badge: { th: 'เข้าห้องฉุกเฉิน', en: 'ER Admission' },
      title: {
        th: 'แพ้อาหารเฉียบพลัน หายใจติดขัด ต้องเข้าห้องฉุกเฉิน',
        en: 'Severe Allergic Reaction — Emergency Room Overnight',
      },
      story: {
        th: 'เกิดอาการแพ้รุนแรงหลังมื้อเย็นจนผื่นขึ้นและหายใจติดขัด ต้องรีบเข้าห้องฉุกเฉินฉีดยาและนอนดูอาการ 1 คืน บิลรวม ฿32,000',
        en: 'An unexpected allergic reaction triggers breathing difficulty, requiring urgent ER treatment and overnight monitoring for ฿32,000.',
      },
    },
    {
      id: 'seasonal-22k',
      category: 'medical',
      severity: 'medium',
      billAmount: 22000,
      badge: { th: 'เจ็บป่วยตามฤดูกาล', en: 'Seasonal Illness' },
      title: {
        th: 'ติดเชื้อทางเดินอาหาร / ให้น้ำเกลือพักฟื้น (฿22,000)',
        en: 'Acute Gastroenteritis — Short Hospital Recovery (฿22,000)',
      },
      story: {
        th: 'อาการปวดท้องและขาดน้ำรุนแรงทำให้ต้องแอดมิตให้น้ำเกลือและยาฆ่าเชื้อ 1 คืน รวมค่ารักษา ฿22,000',
        en: 'Severe dehydration from gastroenteritis requires an overnight IV drip and medication totaling ฿22,000.',
      },
    },
    {
      id: 'opd-clinic-4500',
      category: 'medical',
      severity: 'medium',
      billAmount: 4500,
      badge: { th: 'ค่ารักษาผู้ป่วยนอก (OPD)', en: 'Outpatient Clinic (OPD)' },
      title: {
        th: 'ออฟฟิศซินโดรม & ไมเกรนกำเริบ ต้องพบแพทย์เฉพาะทาง (฿4,500)',
        en: 'Severe Migraine & Office Syndrome Specialist Visit (฿4,500)',
      },
      story: {
        th: 'ทำงานหนักติดกันหลายสัปดาห์จนปวดหัวไมเกรนและคอบ่าไหล่รุนแรง ต้องตรวจและรับยาจากแผนกผู้ป่วยนอก รวมค่าใช้จ่าย ฿4,500',
        en: 'Weeks of overtime trigger severe migraine and neck strain, requiring an outpatient specialist visit and medication for ฿4,500.',
      },
    },
    {
      id: 'dental-wisdom-8500',
      category: 'medical',
      severity: 'medium',
      billAmount: 8500,
      badge: { th: 'ทันตกรรมฉุกเฉิน', en: 'Urgent Dental Care' },
      title: {
        th: 'ฟันคุดอักเสบเฉียบพลัน ต้องผ่าฟันคุดด่วน (฿8,500)',
        en: 'Impacted Wisdom Tooth — Urgent Dental Surgery (฿8,500)',
      },
      story: {
        th: 'ปวดฟันกรามรุนแรงจนแก้มบวม เอกซเรย์พบฟันคุดแนวนอนต้องผ่าออกทันที เกินวงเงินประกันสังคม 900 บาท เหลือจ่ายเอง ฿8,500',
        en: 'A swollen jaw turns out to be an impacted wisdom tooth needing immediate surgery — beyond basic dental allowance, costing ฿8,500.',
      },
    },
    {
      id: 'minor-sprain-6500',
      category: 'accident',
      severity: 'medium',
      billAmount: 6500,
      badge: { th: 'อุบัติเหตุเล็กน้อย', en: 'Minor Accident' },
      title: {
        th: 'ข้อเท้าพลิกตกบันได BTS ต้องเอกซเรย์และใส่เฝือกอ่อน (฿6,500)',
        en: 'Sprained Ankle on Commute Stairs — X-Ray & Brace (฿6,500)',
      },
      story: {
        th: 'รีบวิ่งต่อรถไฟฟ้าช่วงเช้าจนข้อเท้าพลิกบวมแดง ต้องเข้าห้องฉุกเฉินเอกซเรย์ตรวจกระดูกและรับเฝือกอ่อน บิลรวม ฿6,500',
        en: 'Rushing down commute stairs leads to a nasty ankle sprain needing an urgent X-ray and support brace costing ฿6,500.',
      },
    },
  ];

  const INCOME_POOL = [
    {
      id: 'income-drop',
      category: 'income',
      severity: 'medium',
      billAmount: incomeDropAmount,
      badge: { th: 'รายได้ผันผวน', en: 'Income Disruption' },
      title: {
        th: 'บริษัทปรับลดโอที / รายได้หดหาย 20% ชั่วคราว',
        en: 'Overtime Cut — Temporary 20% Income Drop',
      },
      story: {
        th: `เศรษฐกิจชะลอตัวทำให้บริษัทงดโอทีและปรับลดเบี้ยขยันชั่วคราว กระแสเงินสดรับของคุณหายไป ฿${incomeDropAmount.toLocaleString('en-US')} ในช่วงนี้`,
        en: `A temporary slowdown cuts overtime and shift allowances, reducing your cash inflow by ฿${incomeDropAmount.toLocaleString('en-US')} this period.`,
      },
    },
    {
      id: 'commission-delay',
      category: 'income',
      severity: 'medium',
      billAmount: incomeDropAmount,
      badge: { th: 'รายได้สะดุด', en: 'Cashflow Delay' },
      title: {
        th: 'ค่าคอมมิชชัน / งานเสริมถูกเลื่อนจ่ายออกไป 20%',
        en: 'Bonus / Side-Income Payout Delayed (-20% Cashflow)',
      },
      story: {
        th: `โปรเจกต์ของทีมถูกเลื่อนปิดงบ ทำให้เงินส่วนเพิ่มที่คาดว่าจะได้รับช่วงนี้หายไป ฿${incomeDropAmount.toLocaleString('en-US')}`,
        en: `A delayed project sign-off pushes back your expected payout, creating a ฿${incomeDropAmount.toLocaleString('en-US')} cashflow gap this period.`,
      },
    },
    {
      id: 'unpaid-leave-gap',
      category: 'income',
      severity: 'medium',
      billAmount: Math.round(incomeDropAmount * 0.65),
      badge: { th: 'ลางานไม่รับค่าจ้าง', en: 'Unpaid Leave Gap' },
      title: {
        th: 'ต้องลากิจด่วนดูแลครอบครัว ถูกหักรายได้บางส่วน',
        en: 'Urgent Family Leave — Partial Income Deduction',
      },
      story: {
        th: `มีธุระด่วนที่บ้านทำให้ต้องลางานเกินโควตาวันลา กระแสเงินสดเดือนนี้ลดลง ฿${Math.round(incomeDropAmount * 0.65).toLocaleString('en-US')}`,
        en: `An unexpected family errand exceeds your paid leave quota, trimming your cash inflow by ฿${Math.round(incomeDropAmount * 0.65).toLocaleString('en-US')}.`,
      },
    },
  ];

  const LIFESTYLE_POOL = [
    {
      id: 'lifestyle-18k',
      category: 'lifestyle',
      severity: 'medium',
      billAmount: 18000,
      badge: { th: 'บททดสอบไลฟ์สไตล์', en: 'Lifestyle Temptation' },
      title: {
        th: 'มือถือจอแตกใช้งานไม่ได้ / ทริปเที่ยวแก๊งเพื่อน (฿18,000)',
        en: 'Cracked Phone Screen or Friends Getaway Trip (฿18,000)',
      },
      story: {
        th: 'มือถือเครื่องหลักหน้าจอแตกพร้อมกับกลุ่มเพื่อนชวนทริปพักใจพอดี ค่าใช้จ่ายรวมอยู่ที่ ฿18,000 คุณจะจัดการเงินก้อนนี้อย่างไร?',
        en: 'Your main smartphone screen shatters right as friends invite you on a recharge trip. Total cost is ฿18,000 — how do you handle it?',
      },
    },
    {
      id: 'concert-gadget-15k',
      category: 'lifestyle',
      severity: 'medium',
      billAmount: 15000,
      badge: { th: 'สิ่งล่อใจรายทาง', en: 'Impulse Temptation' },
      title: {
        th: 'บัตรคอนเสิร์ตวงโปรด + โปรลดแรงแก็ดเจ็ต (฿15,000)',
        en: 'Dream Concert Tickets + Flash Gadget Sale (฿15,000)',
      },
      story: {
        th: 'ศิลปินที่ชอบมาไทยรอบพิเศษ แถมโปรลดราคาหูฟัง/แท็บเล็ตวันสุดท้ายพอดี รวมงบ ฿15,000 คุณจะตัดสินใจอย่างไร?',
        en: 'Your favorite artist announces a one-night Bangkok show alongside a flash gadget deal totaling ฿15,000. What is your move?',
      },
    },
    {
      id: 'social-wedding-6k',
      category: 'lifestyle',
      severity: 'medium',
      billAmount: 6000,
      badge: { th: 'ค่าสังคมรายเดือน', en: 'Social Commitments' },
      title: {
        th: 'ซองงานแต่งเพื่อนสนิท 2 งาน + เลี้ยงส่งทีม (฿6,000)',
        en: 'Two Friends’ Weddings & Team Farewell Dinner (฿6,000)',
      },
      story: {
        th: 'เดือนนี้มีทั้งงานแต่งเพื่อนสมัยเรียน ชุดไปงาน และงานเลี้ยงส่งรุ่นพี่ในแผนก รวมงบประมาณ ฿6,000 คุณจะจัดสรรอย่างไร?',
        en: 'Two college weddings, outfit costs, and a team farewell dinner collide in the same month for ฿6,000. How do you manage it?',
      },
    },
    {
      id: 'flash-sale-9k',
      category: 'lifestyle',
      severity: 'medium',
      billAmount: 9000,
      badge: { th: 'โปรแรงกลางเดือน', en: 'Mid-Month Mega Sale' },
      title: {
        th: 'มหกรรมลดราคา 11.11 / รองเท้าและอุปกรณ์ทำงาน (฿9,000)',
        en: 'Mega Flash Sale — Shoes & Desk Upgrade Bundle (฿9,000)',
      },
      story: {
        th: 'โค้ดส่วนลดและโปรผ่อน 0% ล่อใจให้กดของที่เล็งไว้นานแล้วรวม ฿9,000 คุณจะยับยั้งใจหรือจัดเต็ม?',
        en: 'Limited-time vouchers and 0% offers tempt you to clear your ฿9,000 wishlist today. Hold back or go for it?',
      },
    },
  ];

  const EXPENSE_POOL = [
    {
      id: 'commute-14k',
      category: 'expense',
      severity: 'medium',
      billAmount: 14000,
      badge: { th: 'รายจ่ายก้อนฉุกเฉิน', en: 'Unexpected Repair' },
      title: {
        th: 'ค่าซ่อมรถ / โน้ตบุ๊กทำงานเสียกะทันหัน (฿14,000)',
        en: 'Sudden Commute Vehicle / Work Laptop Repair (฿14,000)',
      },
      story: {
        th: 'อุปกรณ์หลักที่ใช้เดินทางและทำงานเกิดเสียกะทันหัน ต้องซ่อมด่วนเพื่อให้ทำงานต่อได้ไม่สะดุด ค่าใช้จ่าย ฿14,000',
        en: 'Essential work/commute gear breaks down suddenly and needs an immediate ฿14,000 repair so your work stays on track.',
      },
    },
    {
      id: 'home-appliance-12k',
      category: 'expense',
      severity: 'medium',
      billAmount: 12000,
      badge: { th: 'ค่าซ่อมฉุกเฉิน', en: 'Urgent Home Bill' },
      title: {
        th: 'แอร์ห้องพักเสีย + ช่วยค่าซ่อมฉุกเฉินที่บ้าน (฿12,000)',
        en: 'Broken A/C Unit & Urgent Family Home Repair (฿12,000)',
      },
      story: {
        th: 'หน้าร้อนจัดแอร์เสียพร้อมกับที่บ้านมีค่าซ่อมหลังคารั่วกะทันหัน ต้องช่วยออกค่าใช้จ่ายรวม ฿12,000',
        en: 'Peak summer heat breaks your A/C just as a leak at home needs fixing, requiring ฿12,000 in sudden repair cash.',
      },
    },
    {
      id: 'vehicle-prb-5500',
      category: 'expense',
      severity: 'medium',
      billAmount: 5500,
      badge: { th: 'ค่าบำรุงรักษารายปี', en: 'Annual Vehicle Upkeep' },
      title: {
        th: 'เปลี่ยนยางรถ + ต่อภาษีและ พ.ร.บ. ครบกำหนด (฿5,500)',
        en: 'Worn Tires Replacement + Annual Tax & Compulsory Motor Cover (฿5,500)',
      },
      story: {
        th: 'ถึงรอบเปลี่ยนยางและต่อภาษี/พ.ร.บ. ประจำปีพอดี ซึ่งเป็นค่าใช้จ่ายจำเป็นเพื่อความปลอดภัยในการเดินทาง รวม ฿5,500',
        en: 'Your commute vehicle hits its annual tax, compulsory cover, and worn tire replacement milestone for ฿5,500.',
      },
    },
    {
      id: 'utility-surge-4200',
      category: 'expense',
      severity: 'medium',
      billAmount: 4200,
      badge: { th: 'บิลพุ่งผิดปกติ', en: 'Utility Bill Spike' },
      title: {
        th: 'ค่าไฟฟ้าหน้าร้อนพุ่งสูง + ค่าซ่อมประปาห้องพัก (฿4,200)',
        en: 'Heatwave Electricity Surge & Plumbing Fix (฿4,200)',
      },
      story: {
        th: 'อากาศร้อนจัดบวกกับท่อน้ำซึมโดยไม่รู้ตัวทำให้บิลค่าน้ำไฟและค่าช่างเดือนนี้พุ่งเกินงบมา ฿4,200',
        en: 'A heatwave and hidden pipe leak push your monthly utility and plumber bill ฿4,200 above normal.',
      },
    },
    {
      id: 'pet-vet-7500',
      category: 'expense',
      severity: 'medium',
      billAmount: 7500,
      badge: { th: 'เหตุฉุกเฉินสัตว์เลี้ยง/ครอบครัว', en: 'Urgent Family / Pet Bill' },
      title: {
        th: 'สัตว์เลี้ยงป่วยด่วน / ช่วยค่ายาผู้ใหญ่ที่บ้าน (฿7,500)',
        en: 'Emergency Vet Visit / Parents’ Extra Medical Bill (฿7,500)',
      },
      story: {
        th: 'มีค่าใช้จ่ายฉุกเฉินนอกแผนเพื่อดูแลคนสำคัญหรือสัตว์เลี้ยงที่บ้านรวม ฿7,500 ต้องรีบโอนช่วยทันที',
        en: 'An unplanned ฿7,500 care expense hits home for a loved one or pet and needs immediate payment.',
      },
    },
  ];

  const WINDFALL_POOL = [
    {
      id: 'windfall-8k',
      category: 'windfall',
      severity: 'positive',
      billAmount: 8000,
      badge: { th: 'ข่าวดีทางการเงิน', en: 'Positive Windfall' },
      title: {
        th: 'ได้รับเงินคืนภาษี / โบนัสพิเศษ +฿8,000',
        en: 'Tax Refund / Spot Performance Bonus +฿8,000',
      },
      story: {
        th: 'การยื่นภาษีตรงเวลาและผลงานที่โดดเด่นทำให้คุณได้รับเงินพิเศษเข้าบัญชี ฿8,000 คุณจะนำเงินก้อนนี้ไปเสริมจุดไหน?',
        en: 'Filing taxes cleanly and solid work performance earns you an unexpected ฿8,000 cash inflow. Where will you direct it?',
      },
    },
    {
      id: 'windfall-12k',
      category: 'windfall',
      severity: 'positive',
      billAmount: 12000,
      badge: { th: 'โบนัสพิเศษ', en: 'Extra Windfall' },
      title: {
        th: 'รับเงินปันผล / ค่าตอบแทนงานเสริมพิเศษ +฿12,000',
        en: 'Dividend / Freelance Project Payout +฿12,000',
      },
      story: {
        th: 'งานเสริมที่ตั้งใจทำและเงินคืนสะสมโอนเข้าบัญชีเพิ่ม ฿12,000 เป็นจังหวะดีในการเสริมเกราะทางการเงินของคุณ',
        en: 'A completed side project and annual rebate land ฿12,000 in your account — a great chance to strengthen your safety net.',
      },
    },
    {
      id: 'windfall-4500',
      category: 'windfall',
      severity: 'positive',
      billAmount: 4500,
      badge: { th: 'รายได้เสริมเข้ามือ', en: 'Side Gig Bonus' },
      title: {
        th: 'ขายของมือสอง + เงินคืนบัตรเครดิตสะสม +฿4,500',
        en: 'Declutter Resale + Cashback Rebate +฿4,500',
      },
      story: {
        th: 'คุณเคลียร์ของใช้ไม่ได้ใช้ขายต่อได้เงินก้อนเล็กบวกกับเงินคืนสะสมรวม +฿4,500 จะเก็บไว้ตรงไหนดี?',
        en: 'Selling unused items and redeeming cashback adds +฿4,500 to your hands. Where will you put it?',
      },
    },
    {
      id: 'windfall-6000',
      category: 'windfall',
      severity: 'positive',
      billAmount: 6000,
      badge: { th: 'เบี้ยขยัน & โอทีพิเศษ', en: 'Extra OT Payout' },
      title: {
        th: 'ปิดโปรเจกต์สำคัญสำเร็จ รับเงินพิเศษ +฿6,000',
        en: 'Milestone Project Delivery Bonus +฿6,000',
      },
      story: {
        th: 'ทีมปิดงานใหญ่ทันกำหนดและได้รับโบนัสพิเศษเข้าบัญชี +฿6,000 เป็นจังหวะทองในการเติมกันชนหรือโปะหนี้',
        en: 'Delivering a key project on schedule unlocks a +฿6,000 spot bonus — ideal for boosting reserves or cutting debt.',
      },
    },
  ];

  // Normalize monthlyCounts array (supports either passing monthlyCounts[] or a legacy totalTurns number)
  let monthlyCounts;
  if (Array.isArray(totalTurns) && totalTurns.length > 0) {
    monthlyCounts = totalTurns;
  } else {
    const count = Math.max(3, Number(totalTurns) || 3);
    monthlyCounts = [count];
  }

  const totalEventCount = monthlyCounts.reduce((sum, n) => sum + n, 0);
  const monthsCount = monthlyCounts.length;
  const avoidIds = new Set(Array.isArray(previousEventIds) ? previousEventIds : []);

  const pickNextFrom = (pool, recentIds, lastId) => {
    const notLast = pool.filter((item) => item.id !== lastId);
    const candidates = notLast.length > 0 ? notLast : pool;
    const fresh = shuffleArray(
      candidates.filter((item) => !recentIds.has(item.id) && !avoidIds.has(item.id))
    );
    if (fresh.length > 0) return fresh[0];
    const notRecent = shuffleArray(candidates.filter((item) => !recentIds.has(item.id)));
    if (notRecent.length > 0) return notRecent[0];
    return shuffleArray(candidates)[0];
  };

  // Decide which global turn indices carry a major ~฿100k shock:
  // 1-7 months => 1 major shock; 8-12 months => 2 major shocks spaced across H1 and H2
  const criticalIndices = new Set();
  const firstCriticalIdx =
    totalEventCount <= 6
      ? Math.max(1, totalEventCount - 1 - (Math.random() < 0.35 ? 1 : 0))
      : Math.floor(totalEventCount * (monthsCount >= 8 ? 0.32 : 0.55)) +
        Math.floor(Math.random() * Math.max(1, Math.floor(totalEventCount * 0.12)));
  criticalIndices.add(clamp(firstCriticalIdx, 1, totalEventCount - 1));

  if (monthsCount >= 8) {
    const secondCriticalIdx =
      Math.floor(totalEventCount * 0.74) +
      Math.floor(Math.random() * Math.max(1, Math.floor(totalEventCount * 0.14)));
    criticalIndices.add(clamp(secondCriticalIdx, Math.min(totalEventCount - 1, firstCriticalIdx + 4), totalEventCount - 1));
  }

  const routinePools = [
    MEDICAL_POOL,
    EXPENSE_POOL,
    LIFESTYLE_POOL,
    WINDFALL_POOL,
    INCOME_POOL,
  ];
  const minorMedicalPool = MEDICAL_POOL.filter((e) => e.billAmount <= 22000);
  const majorMedicalPool = MEDICAL_POOL.filter((e) => e.billAmount > 22000);

  const deck = [];
  const recentIds = new Set();
  let lastId = null;
  let globalIdx = 0;

  for (let m = 0; m < monthsCount; m += 1) {
    const countInMonth = monthlyCounts[m];
    const monthNumber = m + 1;

    // Build a balanced monthly category plan so every month (3-6 events) feels varied and fair
    const monthSlots = [];
    if (countInMonth === 3) {
      monthSlots.push('medical-or-expense', 'lifestyle-or-income', 'windfall-or-expense');
    } else if (countInMonth === 4) {
      monthSlots.push('medical', 'expense', 'lifestyle', 'windfall-or-income');
    } else if (countInMonth === 5) {
      monthSlots.push('medical', 'expense', 'lifestyle', 'income', 'windfall');
    } else {
      monthSlots.push('medical', 'expense', 'expense', 'lifestyle', 'income', 'windfall');
    }
    const shuffledSlots = shuffleArray(monthSlots);

    for (let eIdx = 0; eIdx < countInMonth; eIdx += 1) {
      let chosen;
      if (criticalIndices.has(globalIdx)) {
        chosen = pickNextFrom(CRITICAL_POOL, recentIds, lastId);
      } else {
        const slot = shuffledSlots[eIdx];
        if (slot === 'medical') {
          const pool =
            Math.random() < 0.65 && minorMedicalPool.length > 0
              ? minorMedicalPool
              : majorMedicalPool.length > 0
                ? majorMedicalPool
                : MEDICAL_POOL;
          chosen = pickNextFrom(pool, recentIds, lastId);
        } else if (slot === 'medical-or-expense') {
          chosen = pickNextFrom(
            Math.random() < 0.5 ? minorMedicalPool : EXPENSE_POOL,
            recentIds,
            lastId
          );
        } else if (slot === 'expense') {
          chosen = pickNextFrom(EXPENSE_POOL, recentIds, lastId);
        } else if (slot === 'lifestyle') {
          chosen = pickNextFrom(LIFESTYLE_POOL, recentIds, lastId);
        } else if (slot === 'lifestyle-or-income') {
          chosen = pickNextFrom(
            Math.random() < 0.55 ? LIFESTYLE_POOL : INCOME_POOL,
            recentIds,
            lastId
          );
        } else if (slot === 'income') {
          chosen = pickNextFrom(INCOME_POOL, recentIds, lastId);
        } else if (slot === 'windfall') {
          chosen = pickNextFrom(WINDFALL_POOL, recentIds, lastId);
        } else if (slot === 'windfall-or-income') {
          chosen = pickNextFrom(
            Math.random() < 0.6 ? WINDFALL_POOL : INCOME_POOL,
            recentIds,
            lastId
          );
        } else if (slot === 'windfall-or-expense') {
          chosen = pickNextFrom(
            Math.random() < 0.55 ? WINDFALL_POOL : EXPENSE_POOL,
            recentIds,
            lastId
          );
        } else {
          chosen = pickNextFrom(
            routinePools[Math.floor(Math.random() * routinePools.length)],
            recentIds,
            lastId
          );
        }
      }

      recentIds.add(chosen.id);
      if (recentIds.size > 10) {
        const oldest = recentIds.values().next().value;
        recentIds.delete(oldest);
      }
      lastId = chosen.id;

      deck.push({
        ...chosen,
        deckKey: `${chosen.id}-m${monthNumber}-e${eIdx + 1}`,
        monthNumber,
        eventInMonth: eIdx + 1,
        eventsInMonth: countInMonth,
      });
      globalIdx += 1;
    }
  }

  return deck;
}

/**
 * Generate 2-3 clear tactical action choices for the current event,
 * pre-calculating exact cash, protection, debt, and peace-of-mind trade-offs.
 */
export function getChoicesForEvent(event, state) {
  const { cash, protectionRemaining, debt } = state;

  if (event.category === 'medical' || event.category === 'accident') {
    const bill = event.billAmount;
    const absorbed = Math.min(bill, Math.max(0, protectionRemaining));
    const afterProtection = Math.max(0, bill - absorbed);
    const cashPaidWithProt = Math.min(cash, afterProtection);
    const debtWithProt = Math.max(0, afterProtection - cashPaidWithProt);

    const cashPaidDirect = Math.min(cash, bill);
    const debtDirect = Math.max(0, bill - cashPaidDirect);

    return [
      {
        id: 'use-protection-buffer',
        recommended: absorbed > 0,
        tone: absorbed > 0 ? 'blue' : 'neutral',
        title: {
          th: 'ใช้สิทธิความคุ้มครอง + เงินสำรองฉุกเฉิน',
          en: 'Use Protection Coverage + Emergency Cash',
        },
        subtitle:
          absorbed > 0
            ? {
                th: `ความคุ้มครองช่วยจ่าย ฿${absorbed.toLocaleString('en-US')} • จ่ายเงินสด ฿${cashPaidWithProt.toLocaleString('en-US')}${debtWithProt > 0 ? ` • กู้ฉุกเฉิน ฿${debtWithProt.toLocaleString('en-US')}` : ''}`,
                en: `Protection absorbs ฿${absorbed.toLocaleString('en-US')} • Cash ฿${cashPaidWithProt.toLocaleString('en-US')}${debtWithProt > 0 ? ` • Borrow ฿${debtWithProt.toLocaleString('en-US')}` : ''}`,
              }
            : {
                th: `ยังไม่มีวงเงินคุ้มครอง (฿0) → ต้องควักเงินสด ฿${cashPaidWithProt.toLocaleString('en-US')}${debtWithProt > 0 ? ` และกู้เพิ่ม ฿${debtWithProt.toLocaleString('en-US')}` : ''}`,
                en: `No active limit (฿0) → Pays ฿${cashPaidWithProt.toLocaleString('en-US')} cash${debtWithProt > 0 ? ` & borrows ฿${debtWithProt.toLocaleString('en-US')}` : ''}`,
              },
        tag:
          absorbed >= bill
            ? { th: 'คุ้มครองเต็มบิล', en: 'Fully Covered' }
            : absorbed > 0
              ? { th: 'ช่วยแบ่งเบาหนัก', en: 'Shared Risk' }
              : { th: 'ไม่มีวงเงินรองรับ', en: 'No Limit' },
        effects: {
          cashDelta: -cashPaidWithProt,
          debtDelta: debtWithProt,
          protectionUsed: absorbed,
          peaceDelta: debtWithProt > 0 ? -16 : absorbed > 0 ? +4 : -10,
          installmentAdd: 0,
        },
        feedback:
          absorbed > 0 && debtWithProt === 0
            ? {
                th: `การโอนย้ายความเสี่ยงช่วยรับบิลแทนถึง ฿${absorbed.toLocaleString('en-US')} ทำให้คุณผ่านวิกฤตนี้ได้โดยไม่เป็นหนี้ดอกเบี้ยสูงเลย!`,
                en: `Risk transfer absorbed ฿${absorbed.toLocaleString('en-US')} of the shock, letting you survive without high-interest debt!`,
              }
            : absorbed > 0 && debtWithProt > 0
              ? {
                  th: `ความคุ้มครองช่วยลดภาระไปได้ ฿${absorbed.toLocaleString('en-US')} แต่ส่วนต่าง ฿${debtWithProt.toLocaleString('en-US')} เกินเงินสำรองที่มี จึงต้องกู้ฉุกเฉิน 20%/ปี`,
                  en: `Coverage reduced the bill by ฿${absorbed.toLocaleString('en-US')}, but the remaining ฿${debtWithProt.toLocaleString('en-US')} exceeded your cash buffer and triggered 20% APR debt.`,
                }
              : debtWithProt > 0
                ? {
                    th: `เพราะไม่มีวงเงินโอนย้ายความเสี่ยง บิล ฿${bill.toLocaleString('en-US')} จึงกวาดเงินสำรองจนหมดและบังคับให้ต้องกู้ฉุกเฉิน ฿${debtWithProt.toLocaleString('en-US')} (ดอกเบี้ย 20%/ปี)`,
                    en: `Without risk transfer, the ฿${bill.toLocaleString('en-US')} shock wiped out your emergency fund and forced ฿${debtWithProt.toLocaleString('en-US')} of 20% APR debt.`,
                  }
                : {
                    th: `เงินสำรองฉุกเฉินช่วยจ่ายบิล ฿${bill.toLocaleString('en-US')} ได้ครบโดยไม่ก่อหนี้ แต่สภาพคล่องของคุณลดลงอย่างหนัก`,
                    en: `Your emergency fund covered the full ฿${bill.toLocaleString('en-US')} bill debt-free, though your liquid buffer took a heavy hit.`,
                  },
      },
      {
        id: 'pay-cash-self',
        tone: 'neutral',
        title: {
          th: 'ควักเงินสดจ่ายเองทั้งหมด (ไม่ใช้สิทธิ)',
          en: 'Pay 100% Out of Pocket (Self-Insure)',
        },
        subtitle: {
          th: `หักเงินสำรอง ฿${cashPaidDirect.toLocaleString('en-US')}${debtDirect > 0 ? ` • ส่วนขาดเป็นหนี้ 20% อีก ฿${debtDirect.toLocaleString('en-US')}` : ' • ไม่เป็นหนี้แต่เงินเก็บลดฮวบ'}`,
          en: `Cash -฿${cashPaidDirect.toLocaleString('en-US')}${debtDirect > 0 ? ` • Shortfall ฿${debtDirect.toLocaleString('en-US')} at 20% APR` : ' • Debt-free but cash drops sharply'}`,
        },
        tag: { th: 'รับความเสี่ยงเอง', en: 'Self-Insure' },
        effects: {
          cashDelta: -cashPaidDirect,
          debtDelta: debtDirect,
          protectionUsed: 0,
          peaceDelta: debtDirect > 0 ? -18 : -11,
          installmentAdd: 0,
        },
        feedback:
          debtDirect > 0
            ? {
                th: `การรับบิลใหญ่ ฿${bill.toLocaleString('en-US')} ด้วยเงินสดทั้งหมดทำให้เงินสำรองหมดเกลี้ยงและเกิดหนี้ดอกเบี้ย 20% ทันที ฿${debtDirect.toLocaleString('en-US')}`,
                en: `Self-insuring a ฿${bill.toLocaleString('en-US')} shock drained your entire reserve and created ฿${debtDirect.toLocaleString('en-US')} in 20% APR debt.`,
              }
            : {
                th: `คุณรอดพ้นโดยไม่เป็นหนี้ แต่การจ่ายเองทั้งหมด ฿${bill.toLocaleString('en-US')} ทำให้กันชนฉุกเฉินบางลงมากหากมีเหตุซ้ำ`,
                en: `You avoided debt, but paying ฿${bill.toLocaleString('en-US')} out of pocket leaves your safety buffer thin for the next shock.`,
              },
      },
      {
        id: 'borrow-cash-advance',
        tone: 'danger',
        title: {
          th: 'กดบัตรเงินสดดอกเบี้ย 20% (เก็บเงินสดไว้ก่อน)',
          en: 'Use 20% APR Cash Advance (Keep Cash)',
        },
        subtitle: {
          th: `เงินสำรองคงเดิม • เพิ่มหนี้ดอกเบี้ยสูง +฿${bill.toLocaleString('en-US')} (20%/ปี)`,
          en: `Keep liquid cash • Adds +฿${bill.toLocaleString('en-US')} high-interest debt (20% APR)`,
        },
        tag: { th: 'ดอกเบี้ย 20%/ปี', en: '20% APR Debt' },
        effects: {
          cashDelta: 0,
          debtDelta: bill,
          protectionUsed: 0,
          peaceDelta: -20,
          installmentAdd: 0,
        },
        feedback: {
          th: `การเก็บเงินสดไว้แล้วกู้บัตรเงินสด 20% ทำให้ดอกเบี้ยทบต้นกัดกินความสบายใจและกระแสเงินสดทุกเทิร์นถัดไป`,
          en: `Keeping cash while borrowing at 20% APR creates compounding interest drag that erodes both net worth and peace of mind.`,
        },
      },
    ];
  }

  if (event.category === 'income') {
    const gap = event.billAmount;
    const trimmedGap = Math.round(gap * 0.45);
    const cashTrimmed = Math.min(cash, trimmedGap);
    const debtTrimmed = Math.max(0, trimmedGap - cashTrimmed);

    const cashFull = Math.min(cash, gap);
    const debtFull = Math.max(0, gap - cashFull);

    return [
      {
        id: 'trim-lifestyle',
        recommended: true,
        tone: 'blue',
        title: {
          th: 'รัดเข็มขัดลดไลฟ์สไตล์ + ใช้เงินสำรองอุดส่วนต่าง',
          en: 'Trim Discretionary Spending + Use Small Cash Buffer',
        },
        subtitle: {
          th: `ลดช่องว่างเหลือ ฿${trimmedGap.toLocaleString('en-US')} • จ่ายเงินสำรอง ฿${cashTrimmed.toLocaleString('en-US')}${debtTrimmed > 0 ? ` • กู้ ฿${debtTrimmed.toLocaleString('en-US')}` : ''}`,
          en: `Cuts shortfall to ฿${trimmedGap.toLocaleString('en-US')} • Cash -฿${cashTrimmed.toLocaleString('en-US')}${debtTrimmed > 0 ? ` • Debt +฿${debtTrimmed.toLocaleString('en-US')}` : ''}`,
        },
        tag: { th: 'ปรับตัวไว', en: 'Agile Cutback' },
        effects: {
          cashDelta: -cashTrimmed,
          debtDelta: debtTrimmed,
          protectionUsed: 0,
          peaceDelta: debtTrimmed > 0 ? -8 : -2,
          installmentAdd: 0,
        },
        feedback: {
          th: `การปรับลดรายจ่ายไม่จำเป็นทันทีช่วยรักษาเงินสำรองไว้ได้กว่า 55% — นี่คือบทบาทที่แท้จริงของงบกระแสเงินสดที่ยืดหยุ่น`,
          en: `Cutting non-essential spending immediately preserved over 55% of your cash buffer — showing the power of flexible budgeting.`,
        },
      },
      {
        id: 'draw-buffer-full',
        tone: 'neutral',
        title: {
          th: 'ใช้ชีวิตเท่าเดิม แล้วดึงเงินสำรองจ่ายเต็ม 100%',
          en: 'Maintain Lifestyle & Cover 100% from Reserve',
        },
        subtitle: {
          th: `หักเงินสำรอง ฿${cashFull.toLocaleString('en-US')}${debtFull > 0 ? ` • ส่วนขาดเป็นหนี้ ฿${debtFull.toLocaleString('en-US')}` : ' • รักษาความสบายใจได้แต่เงินเก็บลด'}`,
          en: `Cash -฿${cashFull.toLocaleString('en-US')}${debtFull > 0 ? ` • Debt +฿${debtFull.toLocaleString('en-US')}` : ' • Keeps comfort, drains cash'}`,
        },
        tag: { th: 'ใช้กันชนเต็มจำนวน', en: 'Full Buffer Draw' },
        effects: {
          cashDelta: -cashFull,
          debtDelta: debtFull,
          protectionUsed: 0,
          peaceDelta: debtFull > 0 ? -12 : +2,
          installmentAdd: 0,
        },
        feedback: {
          th: `เงินสำรองฉุกเฉินถูกสร้างมาเพื่อรับมือรายได้ที่สะดุดโดยเฉพาะ แต่หากไม่ลดรายจ่ายควบคู่ เงินสำรองจะหมดเร็วกว่าแผน`,
          en: `Emergency cash is built for income dips, though pairing it with temporary spending trim keeps your runway intact longer.`,
        },
      },
      {
        id: 'borrow-income-gap',
        tone: 'danger',
        title: {
          th: 'กดเงินสดดอกเบี้ย 20% มาหมุนใช้แทนรายได้',
          en: 'Borrow at 20% APR to Replace Lost Income',
        },
        subtitle: {
          th: `เงินสำรองคงเดิม • เพิ่มหนี้ดอกเบี้ยสูง +฿${gap.toLocaleString('en-US')}`,
          en: `Cash unchanged • Adds +฿${gap.toLocaleString('en-US')} at 20% APR`,
        },
        tag: { th: 'เสี่ยงหนี้พอก', en: 'Debt Trap Risk' },
        effects: {
          cashDelta: 0,
          debtDelta: gap,
          protectionUsed: 0,
          peaceDelta: -15,
          installmentAdd: 0,
        },
        feedback: {
          th: `การกู้ดอกเบี้ยสูงมาชดเชยรายได้ที่ลดลงจะสร้างภาระผูกพันต่อเนื่อง แม้รายได้จะกลับมาปกติในเดือนหน้า`,
          en: `Replacing lost income with 20% APR debt leaves a lingering burden even after your income recovers next month.`,
        },
      },
    ];
  }

  if (event.category === 'lifestyle') {
    const cost = event.billAmount;
    const frugalFix = 2500;
    const savedCash = Math.max(0, cost - frugalFix);
    const cashFrugal = Math.min(cash, frugalFix);
    const debtFrugal = Math.max(0, frugalFix - cashFrugal);

    const cashBuy = Math.min(cash, cost);
    const debtBuy = Math.max(0, cost - cashBuy);
    const installmentStep = Math.min(3000, cost);
    const installmentRemainder = Math.max(0, cost - installmentStep);

    return [
      {
        id: 'skip-or-repair',
        recommended: true,
        tone: 'blue',
        title: {
          th: `อดใจข้ามไปก่อน / แก้ขัดแบบประหยัด (฿${frugalFix.toLocaleString('en-US')})`,
          en: `Skip & Choose Low-Cost Alternative (฿${frugalFix.toLocaleString('en-US')})`,
        },
        subtitle: {
          th: `ประหยัดเงินสดได้ถึง ฿${savedCash.toLocaleString('en-US')} • ความสบายใจลดเล็กน้อย (-4%)`,
          en: `Saves ฿${savedCash.toLocaleString('en-US')} cash • Small mood dip (-4%)`,
        },
        tag: { th: 'รักษากันชน', en: 'Protect Cash' },
        effects: {
          cashDelta: -cashFrugal,
          debtDelta: debtFrugal,
          protectionUsed: 0,
          peaceDelta: -4,
          installmentAdd: 0,
        },
        feedback: {
          th: `การแยก "ของจำเป็น" ออกจาก "ของอยากได้" ช่วยเก็บเงินสด ฿${savedCash.toLocaleString('en-US')} ไว้เป็นเกราะป้องกันเหตุไม่คาดฝันที่ใหญ่กว่า`,
          en: `Separating needs from wants preserved ฿${savedCash.toLocaleString('en-US')} in liquid cash — crucial armor for bigger financial shocks ahead.`,
        },
      },
      {
        id: 'pay-lifestyle-cash',
        tone: 'neutral',
        title: {
          th: `จ่ายเงินสดเต็ม ฿${cost.toLocaleString('en-US')} เพื่อความสุขเต็มที่`,
          en: `Pay Full ฿${cost.toLocaleString('en-US')} in Cash`,
        },
        subtitle: {
          th: `หักเงินสด ฿${cashBuy.toLocaleString('en-US')}${debtBuy > 0 ? ` • ส่วนขาดเป็นหนี้ ฿${debtBuy.toLocaleString('en-US')}` : ' • ความสบายใจพุ่ง +10%'}`,
          en: `Cash -฿${cashBuy.toLocaleString('en-US')}${debtBuy > 0 ? ` • Debt +฿${debtBuy.toLocaleString('en-US')}` : ' • Peace of Mind +10%'}`,
        },
        tag: { th: 'ความสุข +10%', en: 'Mood +10%' },
        effects: {
          cashDelta: -cashBuy,
          debtDelta: debtBuy,
          protectionUsed: 0,
          peaceDelta: debtBuy > 0 ? -8 : +10,
          installmentAdd: 0,
        },
        feedback:
          debtBuy > 0
            ? {
                th: `เงินสำรองมีไม่พอสำหรับรายจ่ายไลฟ์สไตล์ ฿${cost.toLocaleString('en-US')} ทำให้เกิดหนี้ดอกเบี้ยสูงโดยไม่จำเป็น`,
                en: `Your cash buffer couldn't absorb the ฿${cost.toLocaleString('en-US')} lifestyle spend, unintentionally creating high-interest debt.`,
              }
            : {
                th: `คุณได้พักใจเต็มที่โดยไม่เป็นหนี้ แต่เงินสำรองลดลง ฿${cost.toLocaleString('en-US')} ต้องลุ้นว่าเทิร์นถัดไปจะไม่มีเหตุฉุกเฉินใหญ่`,
                en: `You enjoyed the recharge debt-free, though spending ฿${cost.toLocaleString('en-US')} in cash lowers your buffer if a major emergency hits next.`,
              },
      },
      {
        id: 'zero-pct-installment',
        tone: 'neutral',
        title: {
          th: `เลือกผ่อน 0% (ตัด ฿${installmentStep.toLocaleString('en-US')}/เทิร์น จนครบ ฿${cost.toLocaleString('en-US')})`,
          en: `Use 0% Installment (฿${installmentStep.toLocaleString('en-US')}/turn up to ฿${cost.toLocaleString('en-US')})`,
        },
        subtitle: {
          th: `ยังไม่ดึงเงินสดก้อนใหญ่ตอนนี้ • ผูกภาระผ่อนเทิร์นละ ฿${installmentStep.toLocaleString('en-US')} • ความสบายใจ +5%`,
          en: `Preserves cash now • Adds ฿${installmentStep.toLocaleString('en-US')}/turn installment • Mood +5%`,
        },
        tag: { th: 'ผ่อน 0%', en: '0% Plan' },
        effects: {
          cashDelta: -installmentStep,
          debtDelta: cash < installmentStep ? installmentStep - cash : 0,
          protectionUsed: 0,
          peaceDelta: +5,
          installmentAdd: installmentRemainder,
        },
        feedback: {
          th: `ผ่อน 0% ช่วยรักษาสภาพคล่องระยะสั้นได้ดี แต่จะเป็นรายจ่ายคงที่ที่ลดความคล่องตัวในเทิร์นถัดไป`,
          en: `A 0% installment preserves cash right now, but adds fixed obligations that tighten cashflow in upcoming turns.`,
        },
      },
    ];
  }

  if (event.category === 'expense') {
    const cost = event.billAmount;
    const cashPay = Math.min(cash, cost);
    const debtPay = Math.max(0, cost - cashPay);
    const diyCost = Math.round(cost * 0.55);
    const cashDiy = Math.min(cash, diyCost);
    const debtDiy = Math.max(0, diyCost - cashDiy);

    return [
      {
        id: 'pay-repair-buffer',
        recommended: true,
        tone: 'blue',
        title: {
          th: `ใช้เงินสำรองซ่อมมาตรฐานทันที (฿${cost.toLocaleString('en-US')})`,
          en: `Pay Standard Repair from Reserve (฿${cost.toLocaleString('en-US')})`,
        },
        subtitle: {
          th: `เงินสำรอง -฿${cashPay.toLocaleString('en-US')}${debtPay > 0 ? ` • กู้เพิ่ม ฿${debtPay.toLocaleString('en-US')}` : ' • จบปัญหาขาด ไม่กระทบงาน'}`,
          en: `Cash -฿${cashPay.toLocaleString('en-US')}${debtPay > 0 ? ` • Debt +฿${debtPay.toLocaleString('en-US')}` : ' • Clean fix, zero work disruption'}`,
        },
        tag: { th: 'กันชนทำงาน', en: 'Buffer Works' },
        effects: {
          cashDelta: -cashPay,
          debtDelta: debtPay,
          protectionUsed: 0,
          peaceDelta: debtPay > 0 ? -10 : +1,
          installmentAdd: 0,
        },
        feedback: {
          th: `รายจ่ายซ่อมแซมขนาดกลางคือหน้าที่ของ "เงินสำรองฉุกเฉิน" ไม่จำเป็นต้องใช้ประกัน แต่ต้องมีเงินสดสภาพคล่องรองรับ`,
          en: `Medium repair bills are exactly what an Emergency Cash Fund is built for — liquid cash handles high-frequency surprises cleanly.`,
        },
      },
      {
        id: 'repair-budget-shop',
        tone: 'neutral',
        title: {
          th: `เลือกซ่อมทางเลือกประหยัดงบ (฿${diyCost.toLocaleString('en-US')})`,
          en: `Budget Local Repair Option (฿${diyCost.toLocaleString('en-US')})`,
        },
        subtitle: {
          th: `จ่ายเพียง ฿${cashDiy.toLocaleString('en-US')}${debtDiy > 0 ? ` • กู้ ฿${debtDiy.toLocaleString('en-US')}` : ''} • ความสบายใจลดเล็กน้อย (-3%)`,
          en: `Pays ฿${cashDiy.toLocaleString('en-US')}${debtDiy > 0 ? ` • Debt +฿${debtDiy.toLocaleString('en-US')}` : ''} • Slight worry (-3%)`,
        },
        tag: { th: 'ประหยัด 45%', en: 'Save 45%' },
        effects: {
          cashDelta: -cashDiy,
          debtDelta: debtDiy,
          protectionUsed: 0,
          peaceDelta: -3,
          installmentAdd: 0,
        },
        feedback: {
          th: `การเปรียบเทียบทางเลือกที่คุ้มค่าช่วยลดแรงกระแทกต่อเงินสำรองได้เกือบครึ่งหนึ่ง`,
          en: `Shopping around for a cost-effective repair cut the shock to your reserve nearly in half.`,
        },
      },
    ];
  }

  // Windfall event (+8,000 or +12,000)
  const bonus = event.billAmount;
  const half = Math.round(bonus / 2);
  const debtRepay = Math.min(debt, bonus);
  const leftoverCash = bonus - debtRepay;

  const choices = [
    {
      id: 'save-windfall-100',
      recommended: debt === 0,
      tone: 'green',
      title: {
        th: `เติมเงินสำรองฉุกเฉินเต็ม 100% (+฿${bonus.toLocaleString('en-US')})`,
        en: `Save 100% to Emergency Fund (+฿${bonus.toLocaleString('en-US')})`,
      },
      subtitle: {
        th: 'เสริมเกราะสภาพคล่องทันที • ความสบายใจ +6%',
        en: 'Strengthens liquid runway immediately • Peace of Mind +6%',
      },
      tag: { th: 'เสริมกันชน', en: 'Boost Buffer' },
      effects: {
        cashDelta: +bonus,
        debtDelta: 0,
        protectionUsed: 0,
        peaceDelta: +6,
        installmentAdd: 0,
      },
      feedback: {
        th: `การนำเงินพิเศษเติมเงินสำรองฉุกเฉินช่วยยืดระยะเวลารอดชีวิต (Runway) โดยไม่ต้องเบียดเบียนค่าใช้จ่ายประจำเดือน`,
        en: `Directing windfalls straight into your emergency reserve accelerates your safety runway without squeezing daily life.`,
      },
    },
    {
      id: 'split-windfall-50-50',
      tone: 'neutral',
      title: {
        th: `แบ่ง 50% ออม (+฿${half.toLocaleString('en-US')}) + 50% ให้รางวัลตัวเอง`,
        en: `Split 50% Save (+฿${half.toLocaleString('en-US')}) + 50% Reward`,
      },
      subtitle: {
        th: 'ได้ทั้งเงินเก็บและพลังใจ • ความสบายใจ +10%',
        en: 'Balances savings & well-being • Peace of Mind +10%',
      },
      tag: { th: 'สมดุลชีวิต', en: 'Balanced' },
      effects: {
        cashDelta: +half,
        debtDelta: 0,
        protectionUsed: 0,
        peaceDelta: +10,
        installmentAdd: 0,
      },
      feedback: {
        th: `แนวทาง 50/50 ช่วยสร้างวินัยการเงินที่ยั่งยืน — มีทั้งเงินสำรองเพิ่มขึ้นและไม่ตึงเครียดจนหมดกำลังใจ`,
        en: `The 50/50 split builds sustainable financial habits — growing your safety net while keeping morale high.`,
      },
    },
  ];

  if (debt > 0) {
    choices.unshift({
      id: 'crush-debt-windfall',
      recommended: true,
      tone: 'blue',
      title: {
        th: `นำเงินพิเศษโปะหนี้ดอกเบี้ย 20% ทันที (-฿${debtRepay.toLocaleString('en-US')})`,
        en: `Pay Down 20% APR Debt First (-฿${debtRepay.toLocaleString('en-US')})`,
      },
      subtitle: {
        th:
          leftoverCash > 0
            ? `ปิดหนี้ได้หมด! และเก็บส่วนเหลือ +฿${leftoverCash.toLocaleString('en-US')} เข้าเงินสำรอง`
            : `ลดหนี้ดอกเบี้ยสูงทันที ฿${debtRepay.toLocaleString('en-US')} • หยุดดอกเบี้ย 20%/ปี`,
        en:
          leftoverCash > 0
            ? `Clears all debt and saves +฿${leftoverCash.toLocaleString('en-US')} to cash!`
            : `Cuts high-interest debt by ฿${debtRepay.toLocaleString('en-US')} • Stops 20% APR bleed`,
      },
      tag: { th: 'คุ้มสุด (ลดดอก 20%)', en: 'Best ROI (20%)' },
      effects: {
        cashDelta: +leftoverCash,
        debtDelta: -debtRepay,
        protectionUsed: 0,
        peaceDelta: +12,
        installmentAdd: 0,
      },
      feedback: {
        th: `การโปะหนี้ดอกเบี้ย 20% เทียบเท่ากับการได้ผลตอบแทนการันตี 20% ต่อปีแบบปลอดความเสี่ยง!`,
        en: `Paying down 20% APR debt is mathematically equivalent to earning a guaranteed, risk-free 20% annual return!`,
      },
    });
  }

  return choices;
}

/**
 * Apply recurring cashflow + player's chosen event action for a single turn.
 */
export function resolveTurn({ state, event, choice, config }) {
  const { monthsPerTurn, allocEmergency, allocLifestyle, totalTurns = 6 } = config;

  // 1. Recurring cashflow accumulation for this turn
  const recurringEmergencyAdded = Math.round(allocEmergency * monthsPerTurn);
  const isLongRun = totalTurns > 10;
  const lifestyleBoost = isLongRun
    ? allocLifestyle >= 1000
      ? 1
      : 0
    : allocLifestyle >= 1000
      ? 3
      : allocLifestyle > 0
        ? 1
        : -1;

  // 2. Debt interest accrued during this turn (20% APR)
  const interestAccrued =
    state.debt > 0 ? Math.round(state.debt * (EMERGENCY_DEBT_APR / 12) * monthsPerTurn) : 0;

  // 3. Existing 0% installment payment due this turn (scaled per fraction of a month)
  const perTurnInstallmentCap = Math.max(500, Math.round(3000 * Math.min(1, monthsPerTurn)));
  const installmentDue = Math.min(state.installmentBalance, perTurnInstallmentCap);
  let cashAfterRecurring = state.cash + recurringEmergencyAdded;
  let extraDebtFromInstallment = 0;
  if (installmentDue > 0) {
    if (cashAfterRecurring >= installmentDue) {
      cashAfterRecurring -= installmentDue;
    } else {
      extraDebtFromInstallment = installmentDue - cashAfterRecurring;
      cashAfterRecurring = 0;
    }
  }
  const nextInstallmentBalance =
    Math.max(0, state.installmentBalance - installmentDue) + (choice.effects.installmentAdd || 0);

  // 4. Event choice effects (re-evaluated against post-recurring cash if cashDelta is negative)
  let eventCashDelta = choice.effects.cashDelta;
  let eventDebtDelta = choice.effects.debtDelta;

  if (eventCashDelta < 0) {
    const neededCash = Math.abs(eventCashDelta);
    if (cashAfterRecurring >= neededCash) {
      cashAfterRecurring -= neededCash;
    } else {
      const extraShortfall = neededCash - cashAfterRecurring;
      eventCashDelta = -cashAfterRecurring;
      eventDebtDelta += extraShortfall;
      cashAfterRecurring = 0;
    }
  } else {
    cashAfterRecurring += eventCashDelta;
  }

  const nextCash = Math.max(0, Math.round(cashAfterRecurring));
  const nextDebt = Math.max(
    0,
    Math.round(state.debt + interestAccrued + extraDebtFromInstallment + eventDebtDelta)
  );
  const protectionUsed = Math.max(0, Math.round(choice.effects.protectionUsed || 0));
  const nextProtectionRemaining = Math.max(0, state.protectionRemaining - protectionUsed);

  const debtDragPeace = nextDebt > 0 ? (isLongRun ? -1 : -3) : 0;
  const nextPeace = clamp(
    Math.round(state.peace + (choice.effects.peaceDelta || 0) + lifestyleBoost + debtDragPeace),
    0,
    100
  );

  const netCashChange = nextCash - state.cash;
  const netDebtChange = nextDebt - state.debt;

  const logEntry = {
    turnNumber: state.turnIndex + 1,
    monthNumber: event.monthNumber || 1,
    eventInMonth: event.eventInMonth || 1,
    eventsInMonth: event.eventsInMonth || 1,
    eventId: event.id,
    eventTitle: event.title,
    eventBadge: event.badge,
    choiceTitle: choice.title,
    feedback: choice.feedback,
    recurringEmergencyAdded,
    interestAccrued,
    installmentDue,
    protectionUsed,
    netCashChange,
    netDebtChange,
    endingCash: nextCash,
    endingDebt: nextDebt,
    endingPeace: nextPeace,
  };

  return {
    nextState: {
      turnIndex: state.turnIndex + 1,
      cash: nextCash,
      debt: nextDebt,
      peace: nextPeace,
      protectionRemaining: nextProtectionRemaining,
      totalProtectionAbsorbed: state.totalProtectionAbsorbed + protectionUsed,
      totalInterestPaid: state.totalInterestPaid + interestAccrued,
      installmentBalance: nextInstallmentBalance,
      history: [...state.history, logEntry],
    },
    logEntry,
  };
}

/**
 * Compute final Resilience Score (0-100) and Neutral Actuarial Debrief.
 */
export function computeFinalScorecard({ state, config }) {
  const { cash, debt, peace, totalProtectionAbsorbed, totalInterestPaid } = state;
  const monthlyExpenses = Math.max(5000, config.persona.monthlyExpenses || 20000);
  const monthlyIncome = Math.max(10000, config.persona.monthlyIncome || 25000);

  // 1. Debt-free score (0..40)
  const debtScore =
    debt === 0
      ? 40
      : Math.max(0, Math.round(40 - (debt / (monthlyIncome * 2.5)) * 40));

  // 2. Emergency runway score (0..30) — full marks at >= 2.5 months of expenses
  const finalRunwayMonths = cash / monthlyExpenses;
  const runwayScore = Math.min(30, Math.round((finalRunwayMonths / 2.5) * 30));

  // 3. Peace of mind score (0..20)
  const peaceScore = Math.round((clamp(peace, 0, 100) / 100) * 20);

  // 4. Smart risk strategy score (0..10)
  let strategyScore = 0;
  if (config.askedHr) strategyScore += 4;
  if (totalProtectionAbsorbed > 0) strategyScore += 4;
  if (config.allocEmergency > 0) strategyScore += 2;
  strategyScore = Math.min(10, strategyScore);

  const resilienceScore = clamp(debtScore + runwayScore + peaceScore + strategyScore, 0, 100);
  const isResilient = debt === 0 && cash > 0;

  // Dynamic Neutral Actuarial Lessons
  const takeaways = [];

  if (totalProtectionAbsorbed > 0) {
    takeaways.push({
      tone: 'positive',
      text: {
        th: `การโอนย้ายความเสี่ยงช่วยดูดซับค่ารักษา/เหตุฉุกเฉินแทนคุณรวม ฿${totalProtectionAbsorbed.toLocaleString('en-US')} ทำให้บิลก้อนใหญ่ ฿100,000 ไม่ทำลายเงินเก็บทั้งชีวิต`,
        en: `Risk transfer absorbed ฿${totalProtectionAbsorbed.toLocaleString('en-US')} in shock costs, preventing a ฿100,000 emergency from wiping out your savings.`,
      },
    });
  } else {
    takeaways.push({
      tone: 'caution',
      text: {
        th: 'คุณผ่านเกมโดยไม่มีวงเงินโอนย้ายความเสี่ยงช่วยรับบิลใหญ่ (฿45,000–฿100,000) ทำให้เงินสำรองฉุกเฉินต้องรับแรงกระแทกหนักเพียงลำพัง',
        en: 'You went through the simulation with ฿0 shock transfer, forcing your emergency fund to absorb ฿45,000–฿100,000 bills alone.',
      },
    });
  }

  if (config.askedHr) {
    takeaways.push({
      tone: 'info',
      text: {
        th: 'นิสัยที่ยอดเยี่ยม: การทักถาม HR เรื่องวงเงินประกันกลุ่มก่อนเริ่มช่วยปลดล็อกเกราะคุ้มครอง +฿50,000 โดยไม่ต้องจ่ายเบี้ยเพิ่มแม้แต่บาทเดียว',
        en: 'Great real-world habit: checking Employer Group Insurance limits with HR unlocked +฿50,000 in hidden coverage at zero extra cost.',
      },
    });
  } else {
    takeaways.push({
      tone: 'info',
      text: {
        th: 'เคล็ดลับในชีวิตจริง: ก่อนตัดสินใจวางแผนป้องกันความเสี่ยง ลองสอบถามฝ่ายบุคคล (HR) เรื่องวงเงินประกันกลุ่มที่มีอยู่แล้ว เพื่อไม่ให้จ่ายซ้ำซ้อน',
        en: 'Real-world tip: always confirm your Employer Group Insurance limits with HR first so you know your true baseline before spending a baht.',
      },
    });
  }

  if (debt > 0) {
    takeaways.push({
      tone: 'danger',
      text: {
        th: `คุณจบเกมพร้อมหนี้ฉุกเฉินดอกเบี้ยสูง ฿${debt.toLocaleString('en-US')} (เสียดอกเบี้ยสะสมไปแล้ว ฿${totalInterestPaid.toLocaleString('en-US')}) — ในชีวิตจริง ดอกเบี้ย 20%/ปี จะกัดกินความสามารถในการออมระยะยาว`,
        en: `You finished with ฿${debt.toLocaleString('en-US')} in high-interest debt (฿${totalInterestPaid.toLocaleString('en-US')} interest already accrued) — 20% APR debt severely slows wealth building.`,
      },
    });
  } else {
    takeaways.push({
      tone: 'positive',
      text: {
        th: `คุณจบเกมแบบปลอดหนี้ฉุกเฉิน 100% และยังมีเงินสำรองคงเหลือ ฿${cash.toLocaleString('en-US')} (${finalRunwayMonths.toFixed(1)} เดือนของรายจ่าย)`,
        en: `You finished 100% free of emergency debt with ฿${cash.toLocaleString('en-US')} remaining (${finalRunwayMonths.toFixed(1)} months of expenses).`,
      },
    });
  }

  const headlineSummary = isResilient
    ? totalProtectionAbsorbed > 0
      ? {
          th: 'เงินสำรองฉุกเฉินช่วยรับมือเหตุเล็กได้ทันท่วงที ขณะที่การโอนย้ายความเสี่ยงช่วยกันไม่ให้บิลก้อนใหญ่ ฿100,000 ทำลายเงินเก็บทั้งหมด',
          en: 'Your emergency fund handled routine bumps smoothly while planned risk transfer stopped the ฿100,000 shock from wiping out your savings.',
        }
      : {
          th: 'คุณประคองตัวรอดพ้นวิกฤตแบบปลอดหนี้ได้สำเร็จ แต่การไม่มีเกราะโอนย้ายความเสี่ยงทำให้เงินสำรองต้องแบกรับแรงกระแทกหนักมาก',
          en: 'You survived debt-free, though carrying zero risk transfer forced your liquid reserve to take the full impact of major shocks.',
        }
    : {
        th: 'เหตุไม่คาดฝันก้อนใหญ่ ฿100,000 เกินกว่าเงินสำรองที่เก็บไว้เพียงอย่างเดียว จึงบังคับให้ต้องพึ่งหนี้ดอกเบี้ย 20% — ลองปรับสัดส่วนออม + โอนย้ายความเสี่ยงแล้วเล่นใหม่อีกครั้ง',
        en: 'A ฿100,000 shock outpaced cash savings alone and triggered 20% APR emergency debt — try rebalancing cash reserve + basic risk transfer in your next run.',
      };

  return {
    isResilient,
    resilienceScore,
    finalRunwayMonths,
    headlineSummary,
    takeaways,
    breakdown: {
      debtScore,
      runwayScore,
      peaceScore,
      strategyScore,
    },
  };
}

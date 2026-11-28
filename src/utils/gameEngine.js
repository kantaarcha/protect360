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
  const incomeDrop15 = Math.round(monthlyIncome * 0.15);
  const incomeDrop10 = Math.round(monthlyIncome * 0.1);

  // 1) Critical Catastrophic Shocks (~฿85k–฿100k) — max 1 per run (tests Risk Transfer!)
  const CRITICAL_POOL = [
    {
      id: 'accident-100k',
      category: 'accident',
      severity: 'critical',
      billAmount: 95000,
      badge: { th: 'วิกฤตอุบัติเหตุใหญ่', en: 'Major Accident Shock' },
      title: {
        th: 'อุบัติเหตุรถเฉี่ยวชน / กระดูกหัก ต้องผ่าตัดและพักฟื้น',
        en: 'Road Traffic Accident / Fracture Requiring Surgery',
      },
      story: {
        th: 'เหตุไม่คาดฝันระหว่างเดินทางกลับบ้านทำให้กระดูกข้อมือและไหปลาร้าหัก ต้องผ่าตัดเร่งด่วน บิลค่ารักษาและค่าผ่าตัดรวม ฿95,000',
        en: 'An unexpected commute collision causes a fracture requiring urgent surgery and recovery care. The total hospital bill is ฿95,000.',
      },
    },
    {
      id: 'appendicitis-95k',
      category: 'medical',
      severity: 'critical',
      billAmount: 88000,
      badge: { th: 'ผ่าตัดฉุกเฉิน', en: 'Emergency Surgery' },
      title: {
        th: 'ไส้ติ่งอักเสบเฉียบพลัน ต้องผ่าตัดส่องกล้องกลางดึก',
        en: 'Acute Appendicitis — Late-Night Emergency Surgery',
      },
      story: {
        th: 'ปวดท้องรุนแรงกะทันหันกลางดึก แพทย์วินิจฉัยไส้ติ่งอักเสบใกล้แตกต้องผ่าตัดส่องกล้องทันที ค่ารักษาและห้องพักฟื้นรวม ฿88,000',
        en: 'Sudden severe abdominal pain at midnight turns out to be acute appendicitis needing immediate surgery. Total bill: ฿88,000.',
      },
    },
    {
      id: 'slip-fracture-100k',
      category: 'accident',
      severity: 'critical',
      billAmount: 100000,
      badge: { th: 'อุบัติเหตุหนัก', en: 'Severe Injury Shock' },
      title: {
        th: 'ลื่นล้มรุนแรง / เอ็นหัวเข่าฉีกขาด ต้องผ่าตัดและกายภาพ',
        en: 'Severe Fall / Torn Knee Ligament Surgery & Rehab',
      },
      story: {
        th: 'พื้นเปียกช่วงฝนตกทำให้ลื่นล้มเข่าบิดรุนแรง เอ็นไขว้หน้าขาดต้องผ่าตัดส่องกล้องและทำกายภาพต่อ รวมค่ารักษา ฿100,000',
        en: 'A bad slip on wet pavement tears your knee ligament, requiring surgical reconstruction and follow-up rehab totaling ฿100,000.',
      },
    },
  ];

  // 2) Inpatient Hospitalization (฿22k–฿38k) — realistic 0–2 times per year
  const INPATIENT_POOL = [
    {
      id: 'medical-38k',
      category: 'medical',
      severity: 'high',
      billAmount: 38000,
      badge: { th: 'เหตุฉุกเฉินสุขภาพ (IPD)', en: 'Inpatient Medical Shock' },
      title: {
        th: 'ไข้เลือดออก / อาหารเป็นพิษรุนแรง ต้องแอดมิต 3 คืน',
        en: 'Dengue / Severe Food Poisoning — 3-Night Hospital Stay',
      },
      story: {
        th: 'ไข้สูงเฉียบพลันตอนตี 2 ต้องเข้าโรงพยาบาลเอกชนใกล้บ้านและนอนพักรักษาตัว 3 คืน บิลค่ารักษาและค่าห้องรวม ฿38,000',
        en: 'A sudden high fever at 2 AM sends you to a private hospital for 3 nights. Total medical and room charges come to ฿38,000.',
      },
    },
    {
      id: 'flu-pneumonia-30k',
      category: 'medical',
      severity: 'high',
      billAmount: 30000,
      badge: { th: 'เจ็บป่วยเฉียบพลัน (IPD)', en: 'Acute Illness Stay' },
      title: {
        th: 'ไข้หวัดใหญ่สายพันธุ์ใหม่แทรกซ้อน นอน รพ. 2 คืน',
        en: 'Severe Influenza Complication — 2-Night Hospital Stay',
      },
      story: {
        th: 'พักผ่อนน้อยสะสมจนติดไข้หวัดใหญ่และหลอดลมอักเสบ ต้องพ่นยาและให้น้ำเกลือที่ รพ. 2 คืน ค่าใช้จ่ายรวม ฿30,000',
        en: 'Exhaustion leads to severe influenza with bronchitis requiring IV fluids and 2 nights of inpatient care totaling ฿30,000.',
      },
    },
    {
      id: 'allergy-er-22k',
      category: 'medical',
      severity: 'high',
      billAmount: 22000,
      badge: { th: 'เข้าห้องฉุกเฉิน', en: 'ER Overnight' },
      title: {
        th: 'แพ้อาหารเฉียบพลัน หายใจติดขัด นอนดูอาการ 1 คืน',
        en: 'Severe Allergic Reaction — Overnight ER Observation',
      },
      story: {
        th: 'เกิดอาการแพ้รุนแรงหลังมื้อเย็นจนผื่นขึ้นและหายใจติดขัด ต้องเข้าห้องฉุกเฉินฉีดยาและนอนดูอาการ 1 คืน บิลรวม ฿22,000',
        en: 'An unexpected allergic reaction triggers breathing difficulty, requiring urgent ER treatment and overnight monitoring for ฿22,000.',
      },
    },
  ];

  // 3) Everyday / Minor Outpatient & Dental Health (฿1,200–฿4,500)
  const MINOR_MEDICAL_POOL = [
    {
      id: 'opd-flu-1500',
      category: 'medical',
      severity: 'medium',
      billAmount: 1500,
      badge: { th: 'ค่ารักษาผู้ป่วยนอก (OPD)', en: 'Outpatient Clinic (OPD)' },
      title: {
        th: 'ไข้หวัดและไมเกรนกำเริบ ตรวจคลินิกและรับยา (฿1,500)',
        en: 'Fever & Migraine — Outpatient Clinic Visit (฿1,500)',
      },
      story: {
        th: 'ทำงานหนักพักผ่อนน้อยจนเป็นไข้และปวดศีรษะไมเกรน ต้องพบแพทย์แผนกผู้ป่วยนอกและรับยา รวมค่าใช้จ่าย ฿1,500',
        en: 'Overwork triggers fever and migraine, requiring an outpatient doctor visit and prescription totaling ฿1,500.',
      },
    },
    {
      id: 'dental-care-1800',
      category: 'medical',
      severity: 'medium',
      billAmount: 1800,
      badge: { th: 'ทันตกรรมส่วนเกินสิทธิ', en: 'Dental Care Co-Pay' },
      title: {
        th: 'อุดฟันและขูดหินปูนส่วนเกินวงเงินประกันสังคม (฿1,800)',
        en: 'Dental Filling & Scaling Beyond SSO Cap (฿1,800)',
      },
      story: {
        th: 'ตรวจฟันประจำปีพบฟันผุต้องอุดหลายซี่ มีส่วนต่างเกินวงเงินทันตกรรมประกันสังคม 900 บาท เหลือจ่ายเอง ฿1,800',
        en: 'A routine dental check reveals cavities needing fillings beyond the ฿900 SSO cap, leaving ฿1,800 out of pocket.',
      },
    },
    {
      id: 'minor-sprain-2800',
      category: 'accident',
      severity: 'medium',
      billAmount: 2800,
      badge: { th: 'อุบัติเหตุเล็กน้อย', en: 'Minor Accident' },
      title: {
        th: 'ข้อเท้าพลิกตกบันไดรถไฟฟ้า ต้องเอกซเรย์และรับยา (฿2,800)',
        en: 'Sprained Ankle on Commute Stairs — X-Ray & Brace (฿2,800)',
      },
      story: {
        th: 'รีบวิ่งต่อรถไฟฟ้าช่วงเช้าจนข้อเท้าพลิกบวมแดง ต้องตรวจเอกซเรย์และรับเฝือกอ่อนพยุงข้อเท้า บิลรวม ฿2,800',
        en: 'Rushing down commute stairs leads to an ankle sprain needing an X-ray and support brace costing ฿2,800.',
      },
    },
    {
      id: 'dental-wisdom-4500',
      category: 'medical',
      severity: 'medium',
      billAmount: 4500,
      badge: { th: 'ทันตกรรมฉุกเฉิน', en: 'Urgent Dental Care' },
      title: {
        th: 'ฟันคุดอักเสบเฉียบพลัน ต้องผ่าฟันคุดด่วน (฿4,500)',
        en: 'Impacted Wisdom Tooth — Urgent Extraction (฿4,500)',
      },
      story: {
        th: 'ปวดฟันกรามรุนแรงจนแก้มบวม ต้องผ่าฟันคุดด่วนที่คลินิกทันตกรรม หักสิทธิพื้นฐานแล้วเหลือจ่าย ฿4,500',
        en: 'A swollen jaw turns out to be an impacted wisdom tooth needing urgent extraction — ฿4,500 after statutory benefit.',
      },
    },
  ];

  // 4) Temporary Income Dips (10%–15%, realistic 1–3 times per year)
  const INCOME_POOL = [
    {
      id: 'income-drop',
      category: 'income',
      severity: 'medium',
      billAmount: incomeDrop15,
      badge: { th: 'รายได้ผันผวน', en: 'Income Dip' },
      title: {
        th: 'บริษัทปรับลดโอทีชั่วคราว รายได้ลดลง 15%',
        en: 'Temporary Overtime Cut (-15% Income)',
      },
      story: {
        th: `เศรษฐกิจชะลอตัวทำให้บริษัทงดโอทีชั่วคราว กระแสเงินสดรับของคุณเดือนนี้ลดลง ฿${incomeDrop15.toLocaleString('en-US')}`,
        en: `A temporary slowdown cuts overtime allowances, reducing your cash inflow by ฿${incomeDrop15.toLocaleString('en-US')} this month.`,
      },
    },
    {
      id: 'commission-delay',
      category: 'income',
      severity: 'medium',
      billAmount: incomeDrop10,
      badge: { th: 'รายได้สะดุด', en: 'Cashflow Delay' },
      title: {
        th: 'เบี้ยขยัน / งานเสริมถูกเลื่อนจ่ายออกไป 10%',
        en: 'Side-Income / Allowance Delayed (-10%)',
      },
      story: {
        th: `โปรเจกต์ของทีมเลื่อนปิดรอบบัญชี ทำให้เงินส่วนเพิ่มช่วงนี้ช้าออกไป ฿${incomeDrop10.toLocaleString('en-US')}`,
        en: `A delayed project billing pushes back your expected extra payout, creating a ฿${incomeDrop10.toLocaleString('en-US')} gap.`,
      },
    },
  ];

  // 5) Lifestyle Temptations — with TRUE realistic frugalCost (฿0 for skipping impulse buys!)
  const LIFESTYLE_POOL = [
    {
      id: 'flash-sale-4500',
      category: 'lifestyle',
      severity: 'medium',
      billAmount: 4500,
      frugalCost: 0,
      badge: { th: 'โปรแรงกลางเดือน', en: 'Mid-Month Flash Sale' },
      title: {
        th: 'มหกรรมลดราคา 11.11 / รองเท้าและแก็ดเจ็ตในตะกร้า (฿4,500)',
        en: 'Mega Flash Sale — Shoes & Desk Wishlist (฿4,500)',
      },
      story: {
        th: 'โค้ดส่วนลดวันสุดท้ายและโปรผ่อน 0% ล่อใจให้กดของในตะกร้ารวม ฿4,500 คุณจะอดใจข้ามไปหรือจัดเต็ม?',
        en: 'Limited-time vouchers tempt you to clear your ฿4,500 shopping cart today. Skip cleanly or buy now?',
      },
    },
    {
      id: 'concert-6500',
      category: 'lifestyle',
      severity: 'medium',
      billAmount: 6500,
      frugalCost: 0,
      badge: { th: 'สิ่งล่อใจรายทาง', en: 'Impulse Temptation' },
      title: {
        th: 'บัตรคอนเสิร์ตวงโปรด + ปาร์ตี้หลังคอนเสิร์ต (฿6,500)',
        en: 'Favorite Artist Concert Ticket & Afterparty (฿6,500)',
      },
      story: {
        th: 'ศิลปินที่ชอบมาจัดคอนเสิร์ตในไทยรอบพิเศษ รวมค่าบัตรและเดินทางอยู่ที่ ฿6,500 คุณจะตัดสินใจอย่างไร?',
        en: 'Your favorite artist announces a one-night Bangkok show totaling ฿6,500 with travel. What is your move?',
      },
    },
    {
      id: 'social-wedding-3200',
      category: 'lifestyle',
      severity: 'medium',
      billAmount: 3200,
      frugalCost: 800,
      badge: { th: 'ค่าสังคมรายเดือน', en: 'Social Commitments' },
      title: {
        th: 'ซองงานแต่งเพื่อน + ชุดและงานเลี้ยงรุ่น (฿3,200)',
        en: 'Friend’s Wedding Envelope, Outfit & Reunion (฿3,200)',
      },
      story: {
        th: 'เดือนนี้มีงานแต่งเพื่อนและนัดเลี้ยงรุ่น ค่าซอง ค่าชุด และค่าเดินทางรวม ฿3,200 (หรือใส่ซองฝากเพื่อนแบบประหยัด ฿800)',
        en: 'A wedding and reunion dinner add up to ฿3,200 with outfit and travel (or send a modest ฿800 gift instead).',
      },
    },
    {
      id: 'phone-trip-9500',
      category: 'lifestyle',
      severity: 'medium',
      billAmount: 9500,
      frugalCost: 1500,
      badge: { th: 'บททดสอบไลฟ์สไตล์', en: 'Lifestyle Temptation' },
      title: {
        th: 'อัปเกรดมือถือใหม่ / ทริปเที่ยวทะเลกับแก๊งเพื่อน (฿9,500)',
        en: 'Phone Upgrade or Beach Getaway with Friends (฿9,500)',
      },
      story: {
        th: 'มือถือเริ่มแบตเสื่อมพร้อมเพื่อนชวนไปทริปทะเลพอดี ถ้ายกชุดใหม่/ไปทริปอยู่ที่ ฿9,500 หรือเลือกเปลี่ยนแบตใช้ต่อแค่ ฿1,500',
        en: 'A fading battery coincides with a friends’ beach trip totaling ฿9,500 — or just replace the battery for ฿1,500.',
      },
    },
  ];

  // 6) Routine Necessary Expenses (฿1,200–฿2,800) — everyday First Jobber surprises
  const ROUTINE_EXPENSE_POOL = [
    {
      id: 'utility-surge-1600',
      category: 'expense',
      severity: 'medium',
      billAmount: 1600,
      badge: { th: 'บิลรายเดือนพุ่ง', en: 'Utility Bill Spike' },
      title: {
        th: 'ค่าไฟฟ้าหน้าร้อนพุ่งเกินงบ + ค่าซ่อมก๊อกน้ำ (฿1,600)',
        en: 'Heatwave Electricity Surge & Minor Plumbing (฿1,600)',
      },
      story: {
        th: 'อากาศร้อนจัดทำให้เปิดแอร์หนักกว่าปกติ บิลค่าไฟและค่าช่างซ่อมก๊อกน้ำเกินงบประจำมา ฿1,600',
        en: 'Peak heat pushes your monthly electricity bill and a minor faucet fix ฿1,600 above budget.',
      },
    },
    {
      id: 'vehicle-prb-1800',
      category: 'expense',
      severity: 'medium',
      billAmount: 1800,
      badge: { th: 'ค่าเดินทางจำเป็น', en: 'Commute Upkeep' },
      title: {
        th: 'เปลี่ยนยาง/เช็กระยะรถ + ต่อ พ.ร.บ. ประจำปี (฿1,800)',
        en: 'Commute Tire Service + Annual Compulsory Motor Cover (฿1,800)',
      },
      story: {
        th: 'ถึงรอบเช็กระยะเปลี่ยนยางและต่อภาษี/พ.ร.บ. รถที่ใช้เดินทางไปทำงาน รวมค่าใช้จ่ายจำเป็น ฿1,800',
        en: 'Your daily commute vehicle hits its annual service and compulsory insurance renewal for ฿1,800.',
      },
    },
    {
      id: 'gear-fix-2200',
      category: 'expense',
      severity: 'medium',
      billAmount: 2200,
      badge: { th: 'ซ่อมอุปกรณ์ทำงาน', en: 'Work Gear Repair' },
      title: {
        th: 'สายชาร์จและคีย์บอร์ด/แว่นตาทำงานชำรุดกะทันหัน (฿2,200)',
        en: 'Broken Work Charger / Eyeglasses Replacement (฿2,200)',
      },
      story: {
        th: 'อุปกรณ์สำคัญที่ใช้ทำงานประจำวันเกิดชำรุดกะทันหัน ต้องรีบซ่อมหรือเปลี่ยนใหม่ทันที ฿2,200',
        en: 'Essential daily work gear breaks unexpectedly and needs a quick ฿2,200 fix to stay productive.',
      },
    },
    {
      id: 'family-pet-2600',
      category: 'expense',
      severity: 'medium',
      billAmount: 2600,
      badge: { th: 'ช่วยค่าใช้จ่ายที่บ้าน', en: 'Family / Pet Care' },
      title: {
        th: 'ช่วยค่ายาผู้ใหญ่ที่บ้าน / พาสัตว์เลี้ยงหาหมอด่วน (฿2,600)',
        en: 'Parents’ Extra Medicine / Urgent Vet Visit (฿2,600)',
      },
      story: {
        th: 'มีค่าใช้จ่ายจำเป็นนอกแผนเพื่อดูแลคนสำคัญหรือสัตว์เลี้ยงที่บ้านรวม ฿2,600 ต้องรีบโอนช่วยทันที',
        en: 'An unplanned ฿2,600 care bill comes up for family or a pet and needs immediate attention.',
      },
    },
  ];

  // 7) Occasional Medium Repairs (฿4,800–฿6,500) — capped to 1–3 per year
  const MEDIUM_EXPENSE_POOL = [
    {
      id: 'ac-repair-4800',
      category: 'expense',
      severity: 'medium',
      billAmount: 4800,
      badge: { th: 'ค่าซ่อมฉุกเฉิน', en: 'Urgent Home Repair' },
      title: {
        th: 'แอร์ห้องพักเสียกะทันหัน ต้องเปลี่ยนอะไหล่ (฿4,800)',
        en: 'Broken A/C Compressor Repair (฿4,800)',
      },
      story: {
        th: 'แอร์ห้องพักไม่เย็นกลางฤดูร้อน ช่างตรวจพบอะไหล่เสียต้องเปลี่ยนด่วน ค่าซ่อมมาตรฐาน ฿4,800',
        en: 'Your room A/C dies mid-summer and needs an urgent part replacement costing ฿4,800.',
      },
    },
    {
      id: 'laptop-repair-6500',
      category: 'expense',
      severity: 'medium',
      billAmount: 6500,
      badge: { th: 'ซ่อมอุปกรณ์หลัก', en: 'Major Gear Repair' },
      title: {
        th: 'โน้ตบุ๊กทำงานเมนบอร์ด/จอเสีย ต้องซ่อมด่วน (฿6,500)',
        en: 'Work Laptop Screen / Board Urgent Repair (฿6,500)',
      },
      story: {
        th: 'โน้ตบุ๊กที่ใช้ทำงานหลักเกิดเปิดไม่ติดกะทันหัน ต้องส่งซ่อมด่วนเพื่อให้ทำงานต่อได้ ค่าซ่อม ฿6,500',
        en: 'Your primary work laptop suddenly refuses to boot and needs an urgent ฿6,500 repair.',
      },
    },
  ];

  // 8) Positive Windfalls & Smart Financial Wins (+฿1,800 to +฿10,000)
  const WINDFALL_POOL = [
    {
      id: 'windfall-1800',
      category: 'windfall',
      severity: 'positive',
      billAmount: 1800,
      badge: { th: 'เงินคืน & รายได้ย่อย', en: 'Cashback & Resale' },
      title: {
        th: 'ขายของมือสอง + เงินคืนบัตรสะสม +฿1,800',
        en: 'Declutter Resale + Cashback Rebate +฿1,800',
      },
      story: {
        th: 'คุณเคลียร์ของใช้ไม่ได้ใช้ขายต่อบวกกับเงินคืนสะสม ได้เงินพิเศษเข้ามือ +฿1,800 จะนำไปเสริมจุดไหนดี?',
        en: 'Selling unused items and redeeming cashback adds +฿1,800 to your hands. Where will you put it?',
      },
    },
    {
      id: 'windfall-3200',
      category: 'windfall',
      severity: 'positive',
      billAmount: 3200,
      badge: { th: 'รายได้เสริมเข้ามือ', en: 'Side Gig Payout' },
      title: {
        th: 'รับค่าตอบแทนงานเสริมช่วงวันหยุด +฿3,200',
        en: 'Weekend Freelance Side-Project Payout +฿3,200',
      },
      story: {
        th: 'งานเสริมที่รับทำวันเสาร์-อาทิตย์โอนค่าตอบแทนเข้าบัญชี +฿3,200 เป็นจังหวะดีในการเติมเงินสำรองหรือลดหนี้',
        en: 'A weekend side project lands +฿3,200 in your account — a great boost for your safety net.',
      },
    },
    {
      id: 'windfall-4800',
      category: 'windfall',
      severity: 'positive',
      billAmount: 4800,
      badge: { th: 'เบี้ยขยัน & โอทีพิเศษ', en: 'Milestone Bonus' },
      title: {
        th: 'ปิดโปรเจกต์ทีมสำเร็จ รับโบนัสพิเศษ +฿4,800',
        en: 'Project Delivery Spot Bonus +฿4,800',
      },
      story: {
        th: 'ทีมปิดงานใหญ่ทันกำหนดและได้รับโบนัสพิเศษเข้าบัญชี +฿4,800 คุณจะจัดสรรเงินก้อนนี้อย่างไร?',
        en: 'Delivering a key project on time unlocks a +฿4,800 spot bonus — ideal for reserves or debt payoff.',
      },
    },
    {
      id: 'windfall-6500',
      category: 'windfall',
      severity: 'positive',
      billAmount: 6500,
      badge: { th: 'ข่าวดีทางการเงิน', en: 'Tax Refund' },
      title: {
        th: 'ได้รับเงินคืนภาษีเงินได้ประจำปี +฿6,500',
        en: 'Annual Personal Income Tax Refund +฿6,500',
      },
      story: {
        th: 'การวางแผนลดหย่อนและยื่นภาษีตรงเวลาทำให้ได้รับเงินคืนภาษีเข้าบัญชี +฿6,500 จะเก็บไว้เสริมเกราะตรงไหนดี?',
        en: 'Clean tax filing returns +฿6,500 into your bank account. Where will you direct this boost?',
      },
    },
    {
      id: 'windfall-10000',
      category: 'windfall',
      severity: 'positive',
      billAmount: 10000,
      badge: { th: 'โบนัสประจำปี', en: 'Performance Bonus' },
      title: {
        th: 'รับโบนัสผลงาน / เงินปันผลสะสม +฿10,000',
        en: 'Performance Bonus / Annual Dividend +฿10,000',
      },
      story: {
        th: 'ผลงานที่สม่ำเสมอตลอดช่วงที่ผ่านมาทำให้ได้รับโบนัสเข้าบัญชี +฿10,000 เป็นโอกาสทองในการเสริมความมั่นคง',
        en: 'Consistent performance earns a +฿10,000 bonus — a major opportunity to strengthen your financial cushion.',
      },
    },
  ];

  // Compact factory to scale event pools smoothly up to 72-turn zero-repeat runs
  const mkEv = (id, category, severity, billAmount, bTh, bEn, tTh, tEn, sTh, sEn) => ({
    id,
    category,
    severity,
    billAmount,
    badge: { th: bTh, en: bEn },
    title: { th: tTh, en: tEn },
    story: { th: sTh, en: sEn },
  });

  CRITICAL_POOL.push(
    mkEv('moto-crash-98k', 'accident', 'critical', 98000, 'วิกฤตอุบัติเหตุจราจร', 'Traffic Shock',
      'อุบัติเหตุมอเตอร์ไซค์รับจ้างล้ม กระดูกไหปลาร้าหัก', 'Commute Crash — Collarbone Fracture',
      'รถเสียหลักชนฟุตปาธช่วงเย็น ต้องผ่าตัดยึดเหล็กและพักฟื้น บิลโรงพยาบาลรวม ฿98,000',
      'A sudden road spill fractures your collarbone, requiring surgery and inpatient care totaling ฿98,000.'),
    mkEv('kidney-stone-88k', 'medical', 'critical', 88000, 'ผ่าตัดเร่งด่วน', 'Urgent Procedure',
      'นิ่วในท่อไตอุดตันเฉียบพลัน ต้องส่องกล้องด่วน', 'Acute Kidney Stone — Urgent Endoscopy',
      'ปวดบิดรุนแรงจนเข้าห้องฉุกเฉิน แพทย์ต้องส่องกล้องเอานิ่วออกและนอน รพ. ค่าใช้จ่าย ฿88,000',
      'Sudden acute abdominal pain leads to an ER admission and endoscopic procedure costing ฿88,000.'),
    mkEv('dengue-icu-92k', 'medical', 'critical', 92000, 'ป่วยหนักฉุกเฉิน', 'Critical Illness',
      'ไข้เลือดออกเกล็ดเลือดต่ำมาก ต้องเฝ้าระวังใกล้ชิด', 'Severe Dengue — High-Dependency Ward',
      'ไข้สูงหลายวันจนเกล็ดเลือดตก ต้องแอดมิตดูแลพิเศษและให้น้ำเกลือหลายวัน บิลรวม ฿92,000',
      'Severe platelet drop from dengue requires close multi-day hospital monitoring totaling ฿92,000.')
  );

  INPATIENT_POOL.push(
    mkEv('er-poison-24k', 'medical', 'high', 24000, 'เข้า รพ. 2 คืน', '2-Night Admission',
      'อาหารเป็นพิษรุนแรง & ขาดน้ำ ต้องแอดมิตให้น้ำเกลือ (฿24,000)', 'Severe Food Poisoning Admission (฿24,000)',
      'ติดเชื้อในทางเดินอาหารรุนแรงจนอาเจียนไม่หยุด ต้องนอน รพ. 2 คืน ค่ารักษา ฿24,000',
      'Acute dehydration from food poisoning requires a 2-night IV ward stay costing ฿24,000.'),
    mkEv('ankle-op-35k', 'accident', 'high', 35000, 'ผ่าตัดเล็ก & เฝือก', 'Minor Ortho Care',
      'ตกบันไดข้อเท้าแตก ต้องใส่เฝือกและนอนดูอาการ (฿35,000)', 'Stair Fall — Ankle Casting & Ward (฿35,000)',
      'ก้าวพลาดตกบันไดข้อเท้าร้าว แพทย์ให้นอนดูอาการและเข้าเฝือกขา บิลรวม ฿35,000',
      'Missing a wet stair step cracks your ankle bone, requiring casting and short stay costing ฿35,000.'),
    mkEv('viral-pneu-28k', 'medical', 'high', 28000, 'พักฟื้นผู้ป่วยใน', 'Inpatient Care',
      'หลอดลมอักเสบติดเชื้อ & หอบเหนื่อย ต้องพ่นยาแอดมิต (฿28,000)', 'Infectious Bronchitis Stay (฿28,000)',
      'ไอรุนแรงและค่าออกซิเจนตกจนต้องรับการดูแลแบบผู้ป่วยใน 3 วัน ค่าใช้จ่ายรวม ฿28,000',
      'Low oxygen levels from bronchitis require 3 days of inpatient respiratory therapy totaling ฿28,000.'),
    mkEv('burn-er-26k', 'accident', 'high', 26000, 'ทำแผลฉุกเฉิน รพ.', 'ER Wound Care',
      'น้ำร้อนลวกระดับสอง ต้องทำแผลปลอดเชื้อและเฝ้าดู (฿26,000)', 'Severe Scald Burn — ER Care (฿26,000)',
      'อุบัติเหตุหม้อต้มน้ำร้อนหกใส่แขน ต้องทำแผลเฉพาะทางและฉีดยาฆ่าเชื้อ บิลรวม ฿26,000',
      'A boiling water burn requires specialized sterile wound care and monitoring costing ฿26,000.')
  );

  MINOR_MEDICAL_POOL.push(
    mkEv('opd-eye-2400', 'medical', 'low', 2400, 'สุขภาพสายตา', 'Vision Care',
      'ตาแห้งรุนแรง & เปลี่ยนเลนส์แว่นกรองแสง (฿2,400)', 'Computer Eye Strain & Glasses (฿2,400)',
      'จ้องจอนานจนปวดกระบอกตา แพทย์ตรวจสายตาและสั่งตัดเลนส์ใหม่ ค่าใช้จ่ายรวม ฿2,400',
      'Heavy screen fatigue requires an eye exam, drops, and updated prescription lenses for ฿2,400.'),
    mkEv('opd-stomach-2100', 'medical', 'low', 2100, 'คลินิกทั่วไป', 'Clinic Visit',
      'กรดไหลย้อน / กระเพาะอักเสบจากมื้อดึก (฿2,100)', 'Acute Gastritis Clinic Visit (฿2,100)',
      'ทำงานข้ามมื้อจนปวดท้องแสบลิ้นปี่ ต้องพบแพทย์และรับยาต่อเนื่อง ฿2,100',
      'Skipped meals trigger painful gastritis needing a doctor visit and course of meds for ฿2,100.'),
    mkEv('opd-skin-1650', 'medical', 'low', 1650, 'แพทย์ผิวหนัง', 'Dermatology OPD',
      'ผื่นลมพิษแพ้ฝุ่น PM2.5 ต้องฉีดยาและทายา (฿1,650)', 'PM2.5 Allergic Rash Clinic (฿1,650)',
      'ฝุ่นหนาทำให้ผื่นขึ้นทั้งตัวจนนอนไม่หลับ ต้องไปคลินิกฉีดยาแก้แพ้ ค่าบิล ฿1,650',
      'Heavy air pollution triggers widespread hives needing an outpatient clinic shot costing ฿1,650.'),
    mkEv('opd-physio-2200', 'medical', 'low', 2200, 'ออฟฟิศซินโดรม', 'Physio Care',
      'ปวดคอบ่าไหล่เรื้อรัง ต้องทำกายภาพบำบัด (฿2,200)', 'Office Syndrome Physio Session (฿2,200)',
      'นั่งหน้าคอมนานจนปวดร้าวขึ้นศีรษะ ต้องไปคลินิกกายภาพอัลตราซาวด์ 2 ครั้ง ฿2,200',
      'Stiff neck muscles require two targeted physiotherapy sessions totaling ฿2,200.'),
    mkEv('opd-lab-1900', 'medical', 'low', 1900, 'ตรวจแล็บเพิ่ม', 'Lab Panel',
      'เจาะเลือดตรวจไทรอยด์ & วิตามินตามแพทย์นัด (฿1,900)', 'Follow-Up Blood Lab Panel (฿1,900)',
      'อ่อนเพลียผิดปกติ แพทย์แนะนำตรวจเลือดเฉพาะทางเพิ่มเติม ค่าตรวจ ฿1,900',
      'Persistent fatigue leads to a targeted follow-up blood panel costing ฿1,900.'),
    mkEv('opd-rabies-1400', 'accident', 'low', 1400, 'ฉีดวัคซีนด่วน', 'Clinic Shot',
      'โดนแมวจรจัดข่วน ต้องฉีดวัคซีนป้องกันบาดทะยัก/พิษสุนัขบ้า (฿1,400)', 'Stray Cat Scratch Vaccines (฿1,400)',
      'เล่นกับแมวหน้าซอยแล้วโดนข่วนลึก ต้องแวะคลินิกฉีดวัคซีนเข็มแรก ฿1,400',
      'A stray cat scratch requires prompt outpatient tetanus & rabies vaccination for ฿1,400.'),
    mkEv('opd-ear-1300', 'medical', 'low', 1300, 'คลินิกหูคอจมูก', 'ENT Clinic',
      'หูอื้อ & ช่องหูอักเสบหลังว่ายน้ำ (฿1,300)', 'Ear Canal Infection Drops (฿1,300)',
      'ปวดหูอื้อจนฟังประชุมไม่ชัด แพทย์ส่องดูดน้ำและสั่งยาหยอดหู ฿1,300',
      'A painful outer ear infection requires suction cleaning and prescription ear drops for ฿1,300.'),
    mkEv('opd-migraine-1750', 'medical', 'low', 1750, 'ผู้ป่วยนอก', 'OPD Relief',
      'ไมเกรนกำเริบหนัก ต้องฉีดยาแก้ปวดคลินิก (฿1,750)', 'Severe Migraine Clinic Relief (฿1,750)',
      'ปวดหัวข้างเดียวจนคลื่นไส้ทำงานต่อไม่ไหว ต้องแวะคลินิกฉีดยาระงับปวด ฿1,750',
      'An intense migraine forces an afternoon clinic stop for relief medication totaling ฿1,750.'),
    mkEv('opd-uti-1600', 'medical', 'low', 1600, 'ค่ารักษา OPD', 'Outpatient Care',
      'กลั้นปัสสาวะนานจนติดเชื้อ ต้องตรวจและรับยาฆ่าเชื้อ (฿1,600)', 'UTI Lab & Antibiotic Course (฿1,600)',
      'วันประชุมติดกันไม่ได้ลุกเข้าห้องน้ำจนอักเสบ ค่าตรวจและยา ฿1,600',
      'Busy back-to-back meetings lead to a urinary infection needing lab tests & antibiotics for ฿1,600.'),
    mkEv('opd-dental-clean-1200', 'medical', 'low', 1200, 'ทันตกรรม', 'Dental Check',
      'เหงือกบวมอักเสบ & ขูดหินปูนส่วนเกินสิทธิ (฿1,200)', 'Gum Care & Deep Cleaning (฿1,200)',
      'ปวดเหงือกซี่ใน ต้องรีบให้ทันตแพทย์ล้างเหงือกและขูดหินปูน ส่วนต่าง ฿1,200',
      'Swollen gums need urgent dental deep cleaning beyond annual SSO allowance, costing ฿1,200.')
  );

  INCOME_POOL.push(
    mkEv('shift-cut-4500', 'income', 'medium', Math.round(monthlyIncome * 0.18), 'รายได้หดกะทันหัน', 'Shift Cut',
      'บริษัทลดชั่วโมง OT / ปรับลดเบี้ยขยันชั่วคราว (-18%)', 'Temporary Overtime & Allowance Cut (-18%)',
      'ยอดขายไตรมาสชะลอตัว ทำให้งดจ่ายค่า OT และเบี้ยขยัน รายได้เดือนนี้หายไปชั่วคราว',
      'Quarterly slowdown pauses overtime and allowances, trimming this period cash inflow.'),
    mkEv('client-late-3800', 'income', 'medium', incomeDrop15, 'เงินเข้าช้ากว่านัด', 'Late Invoice',
      'ลูกค้างานเสริมเลื่อนจ่ายเงินงวดออกไป 30 วัน', 'Side Client Delays Payment by 30 Days',
      'บิลงานนอกที่หวังมาจ่ายค่าห้องถูกเลื่อนจ่าย ทำให้เงินหมุนเดือนนี้ขาดไปช่วงหนึ่ง',
      'A freelance client delays settlement by a month, creating a temporary liquidity pinch.'),
    mkEv('probation-freeze', 'income', 'medium', incomeDrop10, 'รายรับชะลอ', 'Cash Squeeze',
      'หักปรับภาษีสะสมปลายไตรมาส ทำให้รับสุทธิน้อยลง', 'Quarter-End Tax Withholding Adjustment',
      'บัญชีปรับยอดหัก ณ ที่จ่ายประจำเดือน ทำให้เงินเข้ามือลดลงกว่าปกติราว 10%',
      'Payroll tax reconciliation trims take-home pay by ~10% this cycle.'),
    mkEv('unpaid-leave-3200', 'income', 'medium', Math.round(monthlyIncome * 0.12), 'ลากิจไม่รับค่าจ้าง', 'Unpaid Leave',
      'ต้องลากลับต่างจังหวัดดูแลธุระที่บ้าน 3 วัน (Leave w/o Pay)', 'Unpaid Emergency Family Leave (-12%)',
      'มีเรื่องด่วนทางบ้านทำให้ต้องลางานเกินโควตาและถูกหักเงินตามสัดส่วนวันลา',
      'Urgent family errands exceed paid leave days, deducting proportional daily wages.')
  );

  LIFESTYLE_POOL.push(
    mkEv('life-staycation', 'lifestyle', 'low', 4200, 'ทริปพักใจ', 'Weekend Trip',
      'เพื่อนชวนทริปพักโรงแรมใกล้กรุงเทพฯ สุดสัปดาห์ (฿4,200)', 'Friends Weekend Staycation Invite (฿4,200)',
      'แก๊งชวนไปปล่อยใจพักพูลวิลล่าใกล้กรุง ค่าแชร์ห้อง+อาหารตก ฿4,200',
      'Friends invite you on a weekend getaway villa split — share comes to ฿4,200.'),
    mkEv('life-gym-annual', 'lifestyle', 'low', 3600, 'โปรฟิตเนส', 'Fitness Promo',
      'โปรฟิตเนสเปิดใหม่ลดราคาค่าสมาชิกแรกเข้า (฿3,600)', 'Gym Opening Promo Bundle (฿3,600)',
      'เซลส์ยื่นโปรสมัครฟิตเนสจ่ายก้อนแรกประหยัดกว่าปกติ รวมค่าลงทะเบียน ฿3,600',
      'A nearby gym offers an upfront bundle at ฿3,600 instead of standard monthly dues.'),
    mkEv('life-idol-merch', 'lifestyle', 'low', 2900, 'ของสะสมแฟนคลับ', 'Fan Merch Drop',
      'พรีออเดอร์อัลบั้ม & แท่งไฟศิลปินคนโปรดล็อตสุดท้าย (฿2,900)', 'Limited Artist Merch Preorder (฿2,900)',
      'ของสะสมคอลเลกชันพิเศษเปิดให้จอง 48 ชั่วโมงสุดท้าย ราคา ฿2,900',
      'Your favorite artist drops a 48-hour limited collectible set priced at ฿2,900.'),
    mkEv('life-bday-pool', 'lifestyle', 'low', 1800, 'ซองสังคม', 'Gift Pool',
      'ลงขันซื้อของขวัญวันเกิด & เค้กให้หัวหน้าทีม (฿1,800)', 'Team Birthday Gift Pool (฿1,800)',
      'เพื่อนร่วมทีมชวนร่วมลงขันซื้อของขวัญให้พี่ที่สนิทในออฟฟิศ คนละ ฿1,800',
      'Teammates pool funds for a mentor birthday gift and dinner share of ฿1,800.'),
    mkEv('life-skincare', 'lifestyle', 'low', 3400, 'โปร 11.11 / Mid-Month', 'Beauty Deal',
      'สกินแคร์ตัวประจำหมดพร้อมกันช่วงโปร 1 แถม 1 (฿3,400)', 'Skincare BOGO Stock-Up (฿3,400)',
      'เซรั่มและกันแดดจัดโปรยกชุดถูกกว่าซื้อแยก แต่ต้องจ่ายก้อนเดียว ฿3,400',
      'Favorite skincare items hit a bulk 1-for-1 promo requiring ฿3,400 upfront.'),
    mkEv('life-shoes', 'lifestyle', 'low', 4100, 'แฟชั่น & รองเท้า', 'Footwear Drop',
      'รองเท้าวิ่ง/ทำงานคู่เก่าพื้นเริ่มหลุด เจอโปรลด 30% (฿4,100)', 'Work Sneaker Replacement Deal (฿4,100)',
      'รองเท้าคู่เก่งพื้นเปิด เจอคู่ที่เล็งไว้ลดราคาเหลือ ฿4,100',
      'Your daily sneakers are worn out and your target replacement is 30% off at ฿4,100.'),
    mkEv('life-game-console', 'lifestyle', 'low', 5800, 'เกม & บันเทิง', 'Gaming Bundle',
      'ลดราคาเกมใหญ่แห่งปี + จอยเล่นกับเพื่อน (฿5,800)', 'Annual Game Bundle + Controller (฿5,800)',
      'เพื่อนชวนเล่นเกมออนไลน์ภาคใหม่ช่วงเลิกงาน ต้องจัดชุดเริ่มต้น ฿5,800',
      'A big new multiplayer release tempts your friend group at ฿5,800.'),
    mkEv('life-cafe-pass', 'lifestyle', 'low', 1950, 'กาแฟ & ของหวาน', 'Cafe Hopping',
      'ร้านกาแฟเจ้าประจำออกแพ็กเกจคูปองรายเดือน 20 แก้ว (฿1,950)', '20-Cup Coffee Pass Deal (฿1,950)',
      'ซื้อคูปองกาแฟล่วงหน้าตกแก้วละไม่ถึงร้อย ช่วยลดค่ารายวันแต่ต้องจ่ายก่อน ฿1,950',
      'Pre-buying a 20-drink cafe pass lowers per-cup cost for ฿1,950 upfront.'),
    mkEv('life-buffet', 'lifestyle', 'low', 2400, 'ปาร์ตี้ออฟฟิศ', 'Team Dinner',
      'ฉลองปิดไตรมาสบังคับไปร้านปิ้งย่างพรีเมียม (฿2,400)', 'Department Quarter-End Feast (฿2,400)',
      'รุ่นพี่จองร้านบุฟเฟต์ฉลองปิดงาน หารจ่ายแล้วตกคนละ ฿2,400',
      'Department team dinner celebration comes to ฿2,400 per seat.'),
    mkEv('life-reunion', 'lifestyle', 'low', 2600, 'งานเลี้ยงรุ่น', 'Alumni Meetup',
      'นัดรวมรุ่นมหาวิทยาลัยครั้งแรกในรอบปี ค่าโต๊ะ ฿2,600', 'Annual College Reunion Share (฿2,600)',
      'เพื่อนเก่าชวนเจอร้านอาหารริมน้ำนาน ๆ จัดที ค่าแชร์โต๊ะ ฿2,600',
      'Old college friends gather for an annual dinner share costing ฿2,600.'),
    mkEv('life-luggage', 'lifestyle', 'low', 3100, 'อุปกรณ์เดินทาง', 'Travel Gear',
      'กระเป๋าเดินทางซิปแตกก่อนทริปครอบครัว (฿3,100)', 'Broken Luggage Before Family Trip (฿3,100)',
      'ต้องซื้อกระเป๋าล้อลากใบใหม่แทนใบเก่าที่แตกกลางทาง ราคา ฿3,100',
      'Your suitcase zipper breaks before a family visit, prompting a ฿3,100 replacement.'),
    mkEv('life-course', 'lifestyle', 'low', 4800, 'อัปสกิลตัวเอง', 'Skill Course',
      'คอร์สเรียน AI / Data ออนไลน์พร้อมเวิร์กชอป (฿4,800)', 'Online AI & Career Workshop (฿4,800)',
      'คอร์สอัปสกิลสายงานตรงสายเปิดรับรุ่นสุดท้ายก่อนปรับราคา ค่าเรียน ฿4,800',
      'A practical career workshop opens enrollment before a price hike at ฿4,800.'),
    mkEv('life-chair-upgrade', 'lifestyle', 'low', 5200, 'Work From Home', 'Ergonomic Chair',
      'เก้าอี้ทำงานลดปวดหลังลดราคาจัดหนัก (฿5,200)', 'Ergonomic Desk Chair Deal (฿5,200)',
      'ทำงานจากห้องแล้วเริ่มปวดหลัง เจอเก้าอี้สุขภาพลดเหลือ ฿5,200',
      'An ergonomic chair sale catches your eye to ease back pain at ฿5,200.'),
    mkEv('life-pet-groom', 'lifestyle', 'low', 2100, 'สัตว์เลี้ยงที่บ้าน', 'Pet Treat',
      'ตัดขน อาบน้ำ & ซื้อขนมให้เจ้าหมา/แมวที่บ้าน (฿2,100)', 'Pet Grooming & Treats (฿2,100)',
      'ถึงรอบอาบน้ำตัดขนและซื้อทรายแมว/อาหารเม็ดล็อตใหญ่ รวม ฿2,100',
      'Scheduled pet grooming and bulk pet food restock totals ฿2,100.'),
    mkEv('life-earbuds', 'lifestyle', 'low', 3900, 'แกดเจ็ตหาย', 'Audio Gear',
      'หูฟังตัดเสียงรบกวนข้างซ้ายหายบนรถไฟฟ้า (฿3,900)', 'Lost Noise-Canceling Earbud (฿3,900)',
      'ทำหูฟังไร้สายหล่นหายระหว่างรีบเปลี่ยนสาย ซื้อใหม่ทดแทน ฿3,900',
      'One wireless earbud slips away during a transfer; replacing it costs ฿3,900.'),
    mkEv('life-festival', 'lifestyle', 'low', 2700, 'เทศกาลดนตรี/หนังสือ', 'Festival Pass',
      'สัปดาห์หนังสือ/เทศกาลอาหารกับแก๊งเพื่อน (฿2,700)', 'Book Fair & Street Food Weekend (฿2,700)',
      'เดินงานแฟร์ประจำปีเผลอหิ้วของติดมือกลับมาหลายถุง รวม ฿2,700',
      'Annual book fair and food market weekend adds up to ฿2,700.'),
    mkEv('life-haircut', 'lifestyle', 'low', 2200, 'ดูแลบุคลิก', 'Salon Care',
      'ตัดผม ทำสี & ทรีตเมนต์ก่อนถ่ายรูปติดบัตร/งานใหญ่ (฿2,200)', 'Salon Trim & Styling Before Event (฿2,200)',
      'เตรียมตัวเข้าประชุมใหญ่ประจำปี แวะร้านทำผมครบชุด ฿2,200',
      'Sprucing up at the salon ahead of an annual company event costs ฿2,200.'),
    mkEv('life-housewarm', 'lifestyle', 'low', 2500, 'ของขวัญขึ้นบ้านใหม่', 'Social Gift',
      'งานขึ้นบ้านใหม่เพื่อนสนิท ซื้อเครื่องใช้ไฟฟ้าช่วยหาร (฿2,500)', 'Friend Housewarming Gift Share (฿2,500)',
      'แก๊งเพื่อนซื้อหม้อทอด/เครื่องชงกาแฟให้เพื่อนย้ายเข้าคอนโด หารคนละ ฿2,500',
      'Splitting a housewarming appliance gift with friends costs ฿2,500.'),
    mkEv('life-movie-date', 'lifestyle', 'low', 1650, 'ดูหนัง & ดินเนอร์', 'Weekend Outing',
      'ตั๋วหนัง IMAX + มื้อค่ำฉลองคืนวันศุกร์ (฿1,650)', 'Friday IMAX Movie & Dinner (฿1,650)',
      'ปิดจ๊อบสัปดาห์หนักขอพักใจดูหนังรอบดึกกับมื้อค่ำดี ๆ ฿1,650',
      'Winding down a tough week with IMAX tickets and a nice Friday dinner costs ฿1,650.'),
    mkEv('life-desk-lamp', 'lifestyle', 'low', 2350, 'แต่งห้อง & โคมไฟ', 'Room Decor',
      'แต่งมุมโต๊ะทำงานใหม่: โคมไฟถนอมสายตา & แผ่นรองโต๊ะ (฿2,350)', 'Cozy Desk Setup Upgrade (฿2,350)',
      'จัดโต๊ะอ่านหนังสือ/ทำงานใหม่ให้น่านั่งขึ้น รวมไฟตั้งโต๊ะและอุปกรณ์เสริม ฿2,350',
      'Refreshing your desk setup with an eye-care monitor light bar and desk mat runs ฿2,350.'),
    mkEv('life-baking-hobby', 'lifestyle', 'low', 2050, 'งานอดิเรกวันหยุด', 'Hobby Kit',
      'ซื้ออุปกรณ์ทำขนม/เวิร์กชอปเซรามิกวันอาทิตย์ (฿2,050)', 'Sunday Pottery / Baking Workshop (฿2,050)',
      'หาเวลาพักสมองทำกิจกรรมคลายเครียดช่วงวันหยุด ค่าเวิร์กชอป ฿2,050',
      'Taking a creative Sunday workshop to recharge after work costs ฿2,050.')
  );

  ROUTINE_EXPENSE_POOL.push(
    mkEv('exp-water-leak', 'expense', 'low', 1900, 'ซ่อมบำรุงในห้อง', 'Plumbing Fix',
      'ท่อน้ำใต้อ่างล้างหน้ารั่ว ต้องเรียกช่างเปลี่ยนข้อต่อ (฿1,900)', 'Bathroom Sink Pipe Leak Repair (฿1,900)',
      'น้ำรั่วซึมจนเปียกพื้นห้องน้ำ ต้องจ้างช่างด่วนมาเปลี่ยนวาล์วและซิลิโคน ฿1,900',
      'A dripping sink pipe requires an urgent plumber replacement costing ฿1,900.'),
    mkEv('exp-router', 'expense', 'low', 2100, 'อุปกรณ์เน็ตเสีย', 'Router Replacement',
      'เราเตอร์ Wi-Fi ช็อตช่วงฝนตก ทำงานจากห้องไม่ได้ (฿2,100)', 'Router Short-Circuit Replacement (฿2,100)',
      'ไฟกระชากทำเราเตอร์ดับสนิท ต้องรีบซื้อตัวใหม่มาต่อประชุมงาน ฿2,100',
      'A power surge fries your home Wi-Fi router; buying a new unit costs ฿2,100.'),
    mkEv('exp-phone-bat', 'expense', 'low', 2500, 'แบตมือถือเสื่อม', 'Battery Swap',
      'แบตมือถือบวมจนดันหน้าจอ ต้องเปลี่ยนศูนย์ทันที (฿2,500)', 'Swollen Phone Battery Swap (฿2,500)',
      'แบตเตอรี่โทรศัพท์เสื่อมบวมอันตราย ต้องเปลี่ยนแบตแท้ที่ศูนย์บริการ ฿2,500',
      'A swollen smartphone battery needs immediate authorized replacement for ฿2,500.'),
    mkEv('exp-tire', 'expense', 'low', 2800, 'ดูแลยานพาหนะ', 'Tire Repair',
      'เหยียบตะปูยางรั่วแก้มยางฉีก เปลี่ยนยางเส้นใหม่ (฿2,800)', 'Punctured Tire Replacement (฿2,800)',
      'ขับรถไปทำงานเจอน็อตตำแก้มยางปะไม่ได้ ต้องเปลี่ยนยางฉุกเฉิน ฿2,800',
      'A sidewall puncture cannot be patched and forces a new tire swap for ฿2,800.'),
    mkEv('exp-glasses-break', 'expense', 'low', 2900, 'ของใช้จำเป็น', 'Glasses Fix',
      'ขาแว่นสายตาหักกลางทาง ต้องเปลี่ยนกรอบใหม่ (฿2,900)', 'Snapped Eyeglass Frame Repair (฿2,900)',
      'เผลอนั่งทับแว่นตาขาหัก มองจอไม่ชัดต้องเปลี่ยนกรอบใหม่ ฿2,900',
      'Accidentally sitting on your glasses snaps the hinge, requiring a ฿2,900 frame swap.'),
    mkEv('exp-locksmith', 'expense', 'low', 1500, 'เหตุไม่คาดคิดหน้าห้อง', 'Locksmith Fee',
      'ทำกุญแจหักคาแม่กุญแจห้อง ต้องเรียกช่างสะเดาะกุญแจ (฿1,500)', 'Broken Key Emergency Locksmith (฿1,500)',
      'ดึกแล้วยังเข้าห้องไม่ได้เพราะกุญแจหักคาเบ้า ค่าช่างนอกเวลา ฿1,500',
      'A snapped apartment key late at night requires an after-hours locksmith at ฿1,500.'),
    mkEv('exp-tax-gap', 'expense', 'low', 2300, 'ยื่นภาษีเพิ่มเติม', 'Tax Balance Due',
      'คำนวณภาษีประจำปีจากรายได้เสริม ต้องจ่ายเพิ่ม (฿2,300)', 'Freelance Income Tax Top-Up (฿2,300)',
      'มีรายได้หลายทางทำให้หัก ณ ที่จ่ายไว้ไม่พอ ต้องชำระส่วนต่างภาษี ฿2,300',
      'Combined salary + side gig places your tax slightly above withheld amounts by ฿2,300.'),
    mkEv('exp-pest', 'expense', 'low', 1700, 'ดูแลที่พัก', 'Pest Care',
      'มด/แมลงบุกห้องพัก ต้องซื้ออุปกรณ์ฉีดพ่น & ล้างใหญ่ (฿1,700)', 'Apartment Pest Control Cleanup (฿1,700)',
      'ช่วงหน้าฝนแมลงเข้าห้องต้องจัดการทำความสะอาดและกำจัดแมลง ฿1,700',
      'Rainy season pests require deep cleaning supplies and treatment costing ฿1,700.'),
    mkEv('exp-home-aid', 'expense', 'low', 3000, 'ช่วยเหลือทางบ้าน', 'Parents Help',
      'พ่อแม่ที่ต่างจังหวัดโทรให้ช่วยค่าซ่อมเครื่องซักผ้าที่บ้าน (฿3,000)', 'Help Parents Fix Washing Machine (฿3,000)',
      'เครื่องใช้ไฟฟ้าที่บ้านเสียกะทันหัน คุณโอนช่วยแบ่งเบาค่าซ่อม ฿3,000',
      'Helping parents back home cover an unexpected appliance repair costs ฿3,000.'),
    mkEv('exp-moto-brake', 'expense', 'low', 1850, 'ซ่อมบำรุงเดินทาง', 'Brake Service',
      'ผ้าเบรกและโซ่มอเตอร์ไซค์สึกหมด ต้องเปลี่ยนยกชุด (฿1,850)', 'Bike Brake & Chain Service (฿1,850)',
      'เบรกเริ่มมีเสียงดังอันตราย ช่วงฝนตกต้องเปลี่ยนผ้าเบรกและน้ำมันเครื่อง ฿1,850',
      'Squeaky brakes in rainy traffic need immediate pads and chain servicing for ฿1,850.'),
    mkEv('exp-key-deposit', 'expense', 'low', 1600, 'ค่าธรรมเนียมหอพัก', 'Access Card',
      'คีย์การ์ดคอนโด/ที่จอดรถหาย โดนปรับทำบัตรใหม่ (฿1,600)', 'Lost Building Keycard Fee (฿1,600)',
      'ทำคีย์การ์ดหล่นหาย ต้องจ่ายค่าออกบัตรใหม่และค่าปรับให้นิติบุคคล ฿1,600',
      'Replacing a misplaced residential building & parking keycard costs ฿1,600.'),
    mkEv('exp-scam-fee', 'expense', 'low', 2400, 'ระวังภัยออนไลน์', 'Refund Dispute',
      'โดนตัดบัตรสมาชิกเว็บทดลองใช้ลืมกดยกเลิก (฿2,400)', 'Forgotten Auto-Renewal Subscription (฿2,400)',
      'เผลอลืมยกเลิก Free Trial รายปี โดนตัดบัตรเต็มจำนวนกว่าจะยื่นเรื่องคืน ฿2,400',
      'An overlooked annual free-trial auto-renewal charges ฿2,400 before cancellation.'),
    mkEv('exp-air-filter', 'expense', 'low', 1950, 'สุขภาพในห้อง', 'Air Filter',
      'เปลี่ยนไส้กรองเครื่องฟอกอากาศรับฤดูฝุ่น PM2.5 (฿1,950)', 'HEPA Filter Swap for Dust Season (฿1,950)',
      'ไฟแดงเตือนไส้กรองหมดอายุกลางฤดูฝุ่น ต้องรีบซื้อไส้กรองแท้เปลี่ยน ฿1,950',
      'Dusty PM2.5 alerts flash your purifier filter replacement light costing ฿1,950.'),
    mkEv('exp-work-suit', 'expense', 'low', 2600, 'งานสำคัญบริษัท', 'Formal Attire',
      'ต้องเดินทางพบลูกค้าด่วน ซื้อชุดสูท/รองเท้าสุภาพใหม่ (฿2,600)', 'Urgent Client Visit Business Attire (฿2,600)',
      'ได้รับมอบหมายไปพรีเซนต์นอกสถานที่ ต้องเตรียมเสื้อสูท/รองเท้าให้เรียบร้อย ฿2,600',
      'A sudden external client presentation requires crisp business attire for ฿2,600.'),
    mkEv('exp-shipping-dmg', 'expense', 'low', 2100, 'เคลมของส่งงาน', 'Courier Claim',
      'ส่งเอกสาร/อุปกรณ์งานด่วนพิเศษแบบประกันพัสดุ (฿2,100)', 'Urgent Insured Work Courier (฿2,100)',
      'ต้องตีรถ/ส่งแมสเซนเจอร์ด่วนส่งต้นฉบับงานให้ลูกค้าข้ามจังหวัด ฿2,100',
      'An urgent same-day insured equipment courier for a client deadline costs ฿2,100.'),
    mkEv('exp-annual-checkup', 'expense', 'low', 2200, 'ป้องกันเชิงรุก', 'Wellness Check',
      'ตรวจสุขภาพประจำปีส่วนเสริม (ตรวจตับ/ไขมัน/EKG ฿2,200)', 'Add-On Annual Health Checkup (฿2,200)',
      'ตรวจเพิ่มเติมจากแพ็กเกจพื้นฐานบริษัทเพื่อความชัวร์ รายการเสริมรวม ฿2,200',
      'Adding deeper lipid and ECG screening on top of company checkup costs ฿2,200.'),
    mkEv('exp-laundry-dryer', 'expense', 'low', 1750, 'ซักอบหน้าฝน', 'Laundry Wash',
      'ฝนตกทั้งสัปดาห์ผ้าไม่แห้ง & ซักผ้านวมใหญ่ทั้งหมด (฿1,750)', 'Rainy-Week Comforter & Dryer Bill (฿1,750)',
      'ความชื้นสูงผ้าเหม็นอับ ต้องยกไปร้านซักอบไอน้ำและซักผ้านวมยกห้อง ฿1,750',
      'Nonstop rainy humidity pushes comforters and work shirts to the laundromat for ฿1,750.'),
    mkEv('exp-cloud-doc', 'expense', 'low', 1450, 'ต่ออายุเอกสาร/แอป', 'Doc Renewal',
      'ต่ออายุใบขับขี่ / พาสปอร์ต & ค่าบริการเอกสารด่วน (฿1,450)', 'ID / License Renewal & Stamp Fee (฿1,450)',
      'เอกสารสำคัญหมดอายุพร้อมกัน ต้องลางานไปดำเนินการและชำระค่าธรรมเนียม ฿1,450',
      'Standard license and document renewal fees & transit come to ฿1,450.'),
    mkEv('exp-fan-ac-clean', 'expense', 'low', 1600, 'ดูแลแอร์รายครึ่งปี', 'AC Cleaning',
      'ล้างแอร์ฆ่าเชื้อราย 6 เดือน & เติมน้ำยาทำความเย็น (฿1,600)', '6-Month AC Coil Deep Cleaning (฿1,600)',
      'แอร์เริ่มมีกลิ่นอับและไม่เย็นฉ่ำ เรียกช่างมาล้างใหญ่เพื่อประหยัดไฟ ฿1,600',
      'Regular 6-month aircon deep cleaning restores cooling and lowers power bills for ฿1,600.'),
    mkEv('exp-rain-gear', 'expense', 'low', 1550, 'อุปกรณ์หน้าฝน', 'Rain Protection',
      'รองเท้ากันน้ำ & ร่มพกพาพังกลางพายุ ต้องซื้อใหม่ (฿1,550)', 'Storm Umbrella & Waterproof Shoes (฿1,550)',
      'พายุพัดร่มหักกลางสี่แยกและน้ำท่วมซอย ต้องซื้อร่มทนลมกับรองเท้าลุยน้ำ ฿1,550',
      'Sudden monsoon gusts snap your umbrella, forcing a waterproof gear replacement for ฿1,550.')
  );

  MEDIUM_EXPENSE_POOL.push(
    mkEv('fridge-fix-5200', 'expense', 'medium', 5200, 'เครื่องใช้ไฟฟ้าพัง', 'Fridge Repair',
      'ตู้เย็นในห้องไม่เย็น คอมเพรสเซอร์เสีย (฿5,200)', 'Refrigerator Compressor Breakdown (฿5,200)',
      'กลับห้องมาพบของสดเสียยกตู้ ตู้เย็นพังต้องซ่อมหรือซื้อเครื่องใหม่ ฿5,200',
      'Your apartment fridge stops cooling completely; repair/replacement hits ฿5,200.'),
    mkEv('car-battery-4600', 'expense', 'medium', 4600, 'รถสตาร์ทไม่ติด', 'Car Battery Dead',
      'แบตเตอรี่และไดชาร์จเสื่อม รถดับกลางลานจอด (฿4,600)', 'Dead Battery & Alternator Check (฿4,600)',
      'ตอนเช้าบิดกุญแจเงียบสนิท ต้องเรียกช่างนอกสถานที่มาเปลี่ยนแบต ฿4,600',
      'An early-morning dead battery needs roadside replacement & inspection costing ฿4,600.'),
    mkEv('flood-room-5900', 'expense', 'medium', 5900, 'ภัยธรรมชาติใกล้ตัว', 'Storm Damage',
      'ฝนสาดหน้าต่างรั่ว น้ำซึมโต๊ะทำงาน & พื้นลามิเนต (฿5,900)', 'Storm Water Seepage Cleanup (฿5,900)',
      'พายุฝนถล่มซัดน้ำเข้าขอบหน้าต่าง พังสายไฟและพรมโต๊ะ ต้องซ่อมด่วน ฿5,900',
      'Storm gusts push water through your window frame, soaking desk gear totaling ฿5,900.'),
    mkEv('screen-crack-6200', 'expense', 'medium', 6200, 'มือถือจอแตก', 'Cracked Screen',
      'ทำมือถือหล่นมุมกระแทกพื้น จอเปิดไม่ติด (฿6,200)', 'Shattered Smartphone Display (฿6,200)',
      'รีบวิ่งขึ้นรถไฟฟ้าแล้วมือถือร่วงหน้าจอแตกมืด ต้องซ่อมจอเพื่อใช้สแกนจ่าย ฿6,200',
      'Dropping your phone at the station shatters the display; urgent screen swap is ฿6,200.'),
    mkEv('family-vet-4900', 'expense', 'medium', 4900, 'เคสด่วนครอบครัว', 'Urgent Home Bill',
      'น้องหมาที่บ้านป่วยกะทันหัน พาไปตรวจเลือด/ให้น้ำเกลือ (฿4,900)', 'Emergency Family Pet Vet Bill (฿4,900)',
      'สัตว์เลี้ยงคู่ใจที่บ้านซึมไม่กินอาหาร พาส่งคลินิกฉุกเฉิน ฿4,900',
      'An emergency veterinary clinic trip for blood tests and IV fluids costs ฿4,900.')
  );

  WINDFALL_POOL.push(
    mkEv('win-cashback-1500', 'windfall', 'positive', 1500, 'เงินคืน PromptPay', 'Cashback Credit',
      'ได้เครดิตเงินคืน & แต้มบัตรประจำเดือน +฿1,500', 'Monthly Card & Wallet Cashback +฿1,500',
      'คะแนนสะสมค่าใช้จ่ายรายวันแปลงเป็นเงินคืนเข้าบัญชี +฿1,500',
      'Monthly wallet and card points convert cleanly into +฿1,500 cash credit.'),
    mkEv('win-declutter-2400', 'windfall', 'positive', 2400, 'ปล่อยของมือสอง', 'Resale Income',
      'ขายกล้อง/แกดเจ็ตที่ไม่ได้ใช้ในกลุ่มมือสองได้ +฿2,400', 'Sold Unused Desk Tech +฿2,400',
      'จัดห้องแล้วปล่อยขายอุปกรณ์ที่ไม่ได้ใช้ ได้เงินสดโอนเข้าบัญชี +฿2,400',
      'Decluttering unused desk electronics brings in +฿2,400 in cash.'),
    mkEv('win-ot-2800', 'windfall', 'positive', 2800, 'ช่วยงานล่วงเวลา', 'Extra OT',
      'ช่วยสลับเวร/ทำพรีเซนต์ด่วนวันเสาร์ รับค่าล่วงเวลา +฿2,800', 'Weekend Presentation OT Pay +฿2,800',
      'รับอาสาช่วยปิดงานด่วนให้แผนก ได้เบี้ยล่วงเวลาพิเศษ +฿2,800',
      'Volunteering for a weekend deck delivery earns +฿2,800 in overtime pay.'),
    mkEv('win-mentor-3800', 'windfall', 'positive', 3800, 'สอนพิเศษ/วิทยากร', 'Guest Workshop',
      'ได้รับเชิญเป็นวิทยากร/ติวเตอร์ช่วยรุ่นน้อง รับค่าตอบแทน +฿3,800', 'Guest Mentor Honorarium +฿3,800',
      'แชร์ความรู้สายงานให้รุ่นน้องช่วงเย็นวันศุกร์ ได้ค่าตอบแทน +฿3,800',
      'Hosting an evening skills session for students pays a +฿3,800 honorarium.'),
    mkEv('win-interest-2100', 'windfall', 'positive', 2100, 'ดอกเบี้ยเงินฝาก', 'High-Yield Interest',
      'รับดอกเบี้ยบัญชีออมทรัพย์ดอกเบี้ยสูงรอบครึ่งปี +฿2,100', 'Semi-Annual Savings Interest +฿2,100',
      'วินัยการเก็บเงินสำรองในบัญชีดิจิทัลให้ผลตอบแทนดอกเบี้ยเข้า +฿2,100',
      'Storing emergency cash in a high-yield account credits +฿2,100 interest.'),
    mkEv('win-contest-5500', 'windfall', 'positive', 5500, 'รางวัลผลงานในทีม', 'Team Award',
      'โปรเจกต์ลดขั้นตอนงานชนะรางวัลนวัตกรรมทีม รับ +฿5,500', 'Internal Innovation Award +฿5,500',
      'ไอเดียปรับปรุงเวิร์กโฟลว์ของทีมคว้ารางวัลประจำไตรมาส รับส่วนแบ่ง +฿5,500',
      'Your workflow improvement idea wins an internal award share of +฿5,500.'),
    mkEv('win-dividend-6000', 'windfall', 'positive', 6000, 'ปันผลสหกรณ์/กองทุน', 'Dividend Payout',
      'รับเงินปันผลสหกรณ์ออมทรัพย์ / กองทุนปันผล +฿6,000', 'Cooperative / Fund Dividend +฿6,000',
      'เงินออมระยะกลางออกดอกผลเป็นเงินปันผลประจำปีโอนเข้า +฿6,000',
      'Annual cooperative savings dividends credit +฿6,000 to your account.'),
    mkEv('win-referral-8000', 'windfall', 'positive', 8000, 'โบนัสแนะนำคนเก่ง', 'Referral Bonus',
      'แนะนำเพื่อนฝีมือดีเข้าบริษัทผ่านโปร รับโบนัส +฿8,000', 'Employee Referral Bonus +฿8,000',
      'เพื่อนที่แนะนำมาร่วมงานผ่านทดลองงานเรียบร้อย HR จ่ายโบนัสแนะนำ +฿8,000',
      'A colleague you referred passes probation, unlocking an +฿8,000 referral bonus.'),
    mkEv('win-midyear-7500', 'windfall', 'positive', 7500, 'โบนัสกลางปี', 'Mid-Year Bonus',
      'บริษัทปรับจ่ายเงินตอบแทนพิเศษกลางปี +฿7,500', 'Mid-Year Incentive Payout +฿7,500',
      'ผลประกอบการครึ่งปีแรกทะลุเป้า ได้รับเงินตอบแทนพิเศษเข้าบัญชี +฿7,500',
      'Strong first-half company performance pays out a +฿7,500 incentive.'),
    mkEv('win-survey-1200', 'windfall', 'positive', 1200, 'เงินคืน & แบบสอบถาม', 'Focus Group Bonus',
      'ร่วมทำวิจัยผู้บริโภค/แบบสอบถามออนไลน์ รับค่าตอบแทน +฿1,200', 'Verified Consumer Focus Group +฿1,200',
      'สละเวลาพักเที่ยงทำแบบสอบถามและรีวิวแอปให้บริษัทวิจัย รับเงินโอนเข้า +฿1,200',
      'Participating in a verified 30-minute focus group credits +฿1,200 cash.'),
    mkEv('win-edit-gig-3500', 'windfall', 'positive', 3500, 'รับจ้างแปล/ตรวจงาน', 'Review Side Income',
      'รับตรวจปรู๊ฟ / แปลเอกสารสั้นช่วงวันหยุด ได้ +฿3,500', 'Weekend Proofread & Edit Gig +฿3,500',
      'รุ่นพี่ส่งงานตรวจเอกสารด่วนให้ทำช่วงวันเสาร์ รับค่าจ้างโอนตรง +฿3,500',
      'Helping proofread a weekend bilingual report earns a fast +฿3,500 payout.')
  );

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
  const usedInRunIds = new Set();

  const pickNextFrom = (pool, recentIds, lastId) => {
    const notLast = pool.filter((item) => item.id !== lastId);
    const candidates = notLast.length > 0 ? notLast : pool;
    // Tier 1: Completely unseen in BOTH current run and immediately previous run
    const ultraFresh = shuffleArray(
      candidates.filter(
        (item) => !usedInRunIds.has(item.id) && !avoidIds.has(item.id)
      )
    );
    if (ultraFresh.length > 0) return ultraFresh[0];
    // Tier 2: Never used yet anywhere inside THIS run (guarantees zero repeats across 72 events!)
    const unusedThisRun = shuffleArray(
      candidates.filter((item) => !usedInRunIds.has(item.id))
    );
    if (unusedThisRun.length > 0) return unusedThisRun[0];
    // Tier 3: Fallback if sub-pool exhausted
    const notRecent = shuffleArray(candidates.filter((item) => !recentIds.has(item.id)));
    if (notRecent.length > 0) return notRecent[0];
    return shuffleArray(candidates)[0];
  };

  // Realistic annual shock caps so 1–12 month runs (3–72 events) mirror real First Jobber life:
  // - Critical (~฿88k–฿100k): 1 per run (placed in the second half so player builds buffer first)
  // - Inpatient (~฿22k–฿38k): 0 for 1 mo, 1 for 2–7 mo, 2 for 8–12 mo
  // - Income dip: max 1 for 1–4 mo, 2 for 5–8 mo, 3 for 9–12 mo
  // - Medium repairs (฿4.6k–฿6.5k): max 1 for 1–4 mo, 2 for 5–8 mo, 3 for 9–12 mo
  const criticalIdx =
    totalEventCount <= 6
      ? Math.max(1, totalEventCount - 1)
      : clamp(
          Math.floor(totalEventCount * 0.58) +
            Math.floor(Math.random() * Math.max(1, Math.floor(totalEventCount * 0.2))),
          2,
          totalEventCount - 1
        );

  const inpatientTargetCount = monthsCount <= 1 ? 0 : monthsCount <= 7 ? 1 : 2;
  const inpatientIndices = new Set();
  if (inpatientTargetCount >= 1) {
    const idx1 = clamp(Math.floor(totalEventCount * 0.28), 1, totalEventCount - 2);
    if (idx1 !== criticalIdx) inpatientIndices.add(idx1);
  }
  if (inpatientTargetCount >= 2) {
    const idx2 = clamp(Math.floor(totalEventCount * 0.84), 2, totalEventCount - 1);
    if (idx2 !== criticalIdx && !inpatientIndices.has(idx2)) inpatientIndices.add(idx2);
  }

  let remainingIncomeDips = monthsCount <= 4 ? 1 : monthsCount <= 8 ? 2 : 3;
  let remainingMediumRepairs = monthsCount <= 4 ? 1 : monthsCount <= 8 ? 2 : 3;
  let remainingLargeWindfalls = monthsCount <= 3 ? 1 : monthsCount <= 8 ? 2 : 3;

  const smallWindfallPool = WINDFALL_POOL.filter((w) => w.billAmount <= 4800);
  const largeWindfallPool = WINDFALL_POOL.filter((w) => w.billAmount > 4800);

  const deck = [];
  const recentIds = new Set();
  let lastId = null;
  let globalIdx = 0;

  for (let m = 0; m < monthsCount; m += 1) {
    const countInMonth = monthlyCounts[m];
    const monthNumber = m + 1;

    // Realistic monthly mix of 3–6 events: everyday bills, lifestyle choices, minor health, and positive cash wins
    const monthSlots = [];
    if (countInMonth === 3) {
      monthSlots.push('routine-expense', 'lifestyle', 'windfall-or-opd');
    } else if (countInMonth === 4) {
      monthSlots.push('routine-expense', 'lifestyle', 'opd-or-income', 'windfall');
    } else if (countInMonth === 5) {
      monthSlots.push('routine-expense', 'lifestyle', 'lifestyle', 'opd-or-income', 'windfall');
    } else {
      monthSlots.push('routine-expense', 'routine-expense', 'lifestyle', 'lifestyle', 'opd-or-income', 'windfall');
    }
    const shuffledSlots = shuffleArray(monthSlots);

    for (let eIdx = 0; eIdx < countInMonth; eIdx += 1) {
      let chosen;
      if (globalIdx === criticalIdx) {
        chosen = pickNextFrom(CRITICAL_POOL, recentIds, lastId);
      } else if (inpatientIndices.has(globalIdx)) {
        chosen = pickNextFrom(INPATIENT_POOL, recentIds, lastId);
      } else {
        const slot = shuffledSlots[eIdx];
        if (slot === 'routine-expense') {
          if (remainingMediumRepairs > 0 && Math.random() < 0.22) {
            remainingMediumRepairs -= 1;
            chosen = pickNextFrom(MEDIUM_EXPENSE_POOL, recentIds, lastId);
          } else {
            chosen = pickNextFrom(ROUTINE_EXPENSE_POOL, recentIds, lastId);
          }
        } else if (slot === 'lifestyle') {
          chosen = pickNextFrom(LIFESTYLE_POOL, recentIds, lastId);
        } else if (slot === 'opd-or-income') {
          if (remainingIncomeDips > 0 && Math.random() < 0.35) {
            remainingIncomeDips -= 1;
            chosen = pickNextFrom(INCOME_POOL, recentIds, lastId);
          } else {
            chosen = pickNextFrom(MINOR_MEDICAL_POOL, recentIds, lastId);
          }
        } else if (slot === 'windfall-or-opd') {
          if (Math.random() < 0.6) {
            chosen = pickNextFrom(smallWindfallPool, recentIds, lastId);
          } else {
            chosen = pickNextFrom(MINOR_MEDICAL_POOL, recentIds, lastId);
          }
        } else {
          if (remainingLargeWindfalls > 0 && m >= Math.floor(monthsCount * 0.35) && Math.random() < 0.35) {
            remainingLargeWindfalls -= 1;
            chosen = pickNextFrom(largeWindfallPool, recentIds, lastId);
          } else {
            chosen = pickNextFrom(smallWindfallPool, recentIds, lastId);
          }
        }
      }

      usedInRunIds.add(chosen.id);
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
    const frugalFix = Number.isFinite(event.frugalCost) ? event.frugalCost : 0;
    const savedCash = Math.max(0, cost - frugalFix);
    const cashFrugal = Math.min(cash, frugalFix);
    const debtFrugal = Math.max(0, frugalFix - cashFrugal);

    const cashBuy = Math.min(cash, cost);
    const debtBuy = Math.max(0, cost - cashBuy);
    const installmentStep = Math.min(Math.round(cost / 3), cost);
    const installmentRemainder = Math.max(0, cost - installmentStep);

    return [
      {
        id: 'skip-or-repair',
        recommended: true,
        tone: 'blue',
        title:
          frugalFix === 0
            ? {
                th: 'อดใจข้ามไปก่อน — ไม่ซื้อ (฿0)',
                en: 'Skip Impulse Purchase Completely (฿0)',
              }
            : {
                th: `เลือกทางเลือกประหยัดงบ (฿${frugalFix.toLocaleString('en-US')})`,
                en: `Choose Low-Cost Alternative (฿${frugalFix.toLocaleString('en-US')})`,
              },
        subtitle: {
          th: `ประหยัดเงินสดได้ถึง ฿${savedCash.toLocaleString('en-US')} • ความสบายใจลดเล็กน้อย (-2%)`,
          en: `Saves ฿${savedCash.toLocaleString('en-US')} cash • Small mood dip (-2%)`,
        },
        tag: { th: 'รักษากันชน', en: 'Protect Cash' },
        effects: {
          cashDelta: -cashFrugal,
          debtDelta: debtFrugal,
          protectionUsed: 0,
          peaceDelta: -2,
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

  // Dynamic Neutral Actuarial Lessons (with emphasis segments, risk tags, and action hints)
  const rawTakeaways = [];

  if (totalProtectionAbsorbed > 0) {
    rawTakeaways.push({
      id: 'protection-transfer',
      tone: 'positive',
      priority: 3,
      badge: { th: 'จุดแข็งของรอบนี้', en: 'Strength' },
      metric: {
        th: `กันบิลใหญ่ ฿${totalProtectionAbsorbed.toLocaleString('en-US')}`,
        en: `Shielded ฿${totalProtectionAbsorbed.toLocaleString('en-US')}`,
      },
      title: {
        th: 'เกราะโอนย้ายความเสี่ยงช่วยรับบิลก้อนใหญ่แทนเงินเก็บ',
        en: 'Risk transfer shielded your savings from major shocks',
      },
      segments: {
        th: [
          { text: 'ความคุ้มครองที่วางไว้ช่วยดูดซับค่ารักษา/เหตุฉุกเฉินแทนคุณรวม ' },
          { text: `฿${totalProtectionAbsorbed.toLocaleString('en-US')}`, em: true },
          { text: ' ทำให้เหตุใหญ่ระดับ ' },
          { text: '฿100,000', em: true },
          { text: ' ไม่กัดกินเงินออมทั้งชีวิตจนหมดตัว' },
        ],
        en: [
          { text: 'Planned risk transfer absorbed ' },
          { text: `฿${totalProtectionAbsorbed.toLocaleString('en-US')}`, em: true },
          { text: ' in shock bills, stopping a ' },
          { text: '฿100,000 crisis', em: true },
          { text: ' from draining your long-term savings.' },
        ],
      },
      nextStep: {
        th: 'รักษาวินัยตรวจวงเงินคุ้มครองปีละครั้งให้สอดคล้องกับรายรับที่โตขึ้น',
        en: 'Review your coverage limits once a year as your income and expenses grow.',
      },
      text: {
        th: `การโอนย้ายความเสี่ยงช่วยดูดซับค่ารักษา/เหตุฉุกเฉินแทนคุณรวม ฿${totalProtectionAbsorbed.toLocaleString('en-US')} ทำให้บิลก้อนใหญ่ ฿100,000 ไม่ทำลายเงินเก็บทั้งชีวิต`,
        en: `Risk transfer absorbed ฿${totalProtectionAbsorbed.toLocaleString('en-US')} in shock costs, preventing a ฿100,000 emergency from wiping out your savings.`,
      },
    });
  } else {
    rawTakeaways.push({
      id: 'protection-transfer',
      tone: 'caution',
      priority: 2,
      badge: { th: 'จุดที่ต้องระวัง', en: 'Watch Out' },
      metric: { th: 'เกราะคุ้มครอง ฿0', en: '฿0 Risk Shield' },
      title: {
        th: 'เงินสำรองต้องแบกบิลใหญ่ระดับ ฿45,000–฿100,000 เพียงลำพัง',
        en: 'Liquid cash had to absorb ฿45,000–฿100,000 shocks alone',
      },
      segments: {
        th: [
          { text: 'รอบนี้คุณไม่มีวงเงินโอนย้ายความเสี่ยงช่วยซับแรงกระแทกเลย (' },
          { text: '฿0', em: true },
          { text: ') หากเจอค่ารักษาหรืออุบัติเหตุก้อนใหญ่ ' },
          { text: '฿45,000–฿100,000', em: true },
          { text: ' เงินสำรองที่เก็บมาทั้งปีจะถูกดูดหายไปในครั้งเดียว' },
        ],
        en: [
          { text: 'You went through the run with ' },
          { text: '฿0 shock transfer', em: true },
          { text: '. One ' },
          { text: '฿45,000–฿100,000 emergency', em: true },
          { text: ' directly hits your emergency cash all at once.' },
        ],
      },
      nextStep: {
        th: 'ลองเช็กหน้าวิเคราะห์ความเสี่ยง เพื่อเปรียบเทียบสิทธิพื้นฐานที่มีอยู่แล้วกับความเสี่ยงจริง',
        en: 'Visit Risk Analysis to compare existing baseline benefits against severe bill scenarios.',
      },
      text: {
        th: 'คุณผ่านเกมโดยไม่มีวงเงินโอนย้ายความเสี่ยงช่วยรับบิลใหญ่ (฿45,000–฿100,000) ทำให้เงินสำรองฉุกเฉินต้องรับแรงกระแทกหนักเพียงลำพัง',
        en: 'You went through the simulation with ฿0 shock transfer, forcing your emergency fund to absorb ฿45,000–฿100,000 bills alone.',
      },
    });
  }

  if (config.askedHr) {
    rawTakeaways.push({
      id: 'hr-group-limit',
      tone: 'info',
      priority: 4,
      badge: { th: 'นิสัยการเงินดีมาก', en: 'Smart Move' },
      metric: { th: 'ปลดล็อกฟรี +฿50,000', en: '+฿50,000 Free Cover' },
      title: {
        th: 'เช็กสิทธิประกันกลุ่มกับ HR ช่วยเพิ่มเกราะคุ้มครองฟรี',
        en: 'Checking HR Group Insurance unlocked free protection',
      },
      segments: {
        th: [
          { text: 'การถามฝ่ายบุคคลเรื่องสวัสดิการก่อนตัดสินใจช่วยปลดล็อกวงเงินคุ้มครองเพิ่ม ' },
          { text: '+฿50,000', em: true },
          { text: ' โดย ' },
          { text: 'ไม่ต้องเสียเงินเพิ่มแม้แต่บาทเดียว', em: true },
          { text: ' และลดความเสี่ยงซื้อซ้ำซ้อน' },
        ],
        en: [
          { text: 'Confirming Employer Group Insurance with HR unlocked ' },
          { text: '+฿50,000', em: true },
          { text: ' in baseline coverage at ' },
          { text: 'zero extra cost', em: true },
          { text: ', preventing duplicate spending.' },
        ],
      },
      nextStep: {
        th: 'เก็บตัวเลขสิทธิบัตรทอง/ประกันสังคม และประกันกลุ่มรวมไว้ในหน้าภาพรวมเพื่อดูช่องว่างจริง',
        en: 'Record your state and employer benefits in Overview to track your true remaining gap.',
      },
      text: {
        th: 'นิสัยที่ยอดเยี่ยม: การทักถาม HR เรื่องวงเงินประกันกลุ่มก่อนเริ่มช่วยปลดล็อกเกราะคุ้มครอง +฿50,000 โดยไม่ต้องจ่ายเบี้ยเพิ่มแม้แต่บาทเดียว',
        en: 'Great real-world habit: checking Employer Group Insurance limits with HR unlocked +฿50,000 in hidden coverage at zero extra cost.',
      },
    });
  } else {
    rawTakeaways.push({
      id: 'hr-group-limit',
      tone: 'caution',
      priority: 2,
      badge: { th: 'ระวังพลาดสิทธิฟรี', en: 'Missed Benefit' },
      metric: { th: 'อาจพลาดเกราะ +฿50,000', en: 'Up to +฿50,000 Unclaimed' },
      title: {
        th: 'ยังไม่ควรจ่ายเพิ่มก่อนเช็กสวัสดิการพื้นฐานกับ HR หรือสิทธิรัฐ',
        en: 'Always verify HR & public coverage before paying extra',
      },
      segments: {
        th: [
          { text: 'ก่อนวางแผนป้องกันความเสี่ยงทุกครั้ง ควรเช็กวงเงิน ' },
          { text: 'ประกันกลุ่มบริษัท / ประกันสังคม', em: true },
          { text: ' ที่มีอยู่ก่อน มิฉะนั้นอาจ ' },
          { text: 'พลาดสิทธิฟรีหรือจ่ายเงินซ้ำซ้อน', em: true },
          { text: ' โดยไม่จำเป็น' },
        ],
        en: [
          { text: 'Before allocating extra budget, verify existing ' },
          { text: 'employer group or state benefits', em: true },
          { text: ' so you do not ' },
          { text: 'leave free coverage unused or overpay', em: true },
          { text: '.' },
        ],
      },
      nextStep: {
        th: 'รอบหน้าลองกดปุ่มสอบถาม HR ก่อนเริ่มเล่น หรือทักถามสิทธิ์ OPD/IPD ของที่ทำงานจริง',
        en: 'Try checking HR limits before starting your next run or check your real workplace policy.',
      },
      text: {
        th: 'เคล็ดลับในชีวิตจริง: ก่อนตัดสินใจวางแผนป้องกันความเสี่ยง ลองสอบถามฝ่ายบุคคล (HR) เรื่องวงเงินประกันกลุ่มที่มีอยู่แล้ว เพื่อไม่ให้จ่ายซ้ำซ้อน',
        en: 'Real-world tip: always confirm your Employer Group Insurance limits with HR first so you know your true baseline before spending a baht.',
      },
    });
  }

  if (debt > 0) {
    rawTakeaways.push({
      id: 'debt-outcome',
      tone: 'danger',
      priority: 1,
      badge: { th: 'เตือนเร่งด่วน', en: 'Urgent Warning' },
      metric: {
        th: `หนี้ ฿${debt.toLocaleString('en-US')} · ดอก 20%/ปี`,
        en: `฿${debt.toLocaleString('en-US')} Debt · 20% APR`,
      },
      title: {
        th: 'จบเกมพร้อมหนี้ฉุกเฉินดอกเบี้ยสูง — เงินออมเสี่ยงถูกกัดกินต่อเนื่อง',
        en: 'High-interest emergency debt is compounding against you',
      },
      segments: {
        th: [
          { text: 'คุณปิดรอบด้วยหนี้ฉุกเฉินคงค้าง ' },
          { text: `฿${debt.toLocaleString('en-US')}`, em: true },
          { text: ' (เสียดอกเบี้ยเดินไปแล้ว ' },
          { text: `฿${totalInterestPaid.toLocaleString('en-US')}`, em: true },
          { text: ') ในชีวิตจริง ' },
          { text: 'ดอกเบี้ยระดับ 20%/ปี จะดึงกระแสเงินสดรายเดือนออกเรื่อยๆ', em: true },
          { text: ' จนกลับมาตั้งหลักออมได้ช้ามาก' },
        ],
        en: [
          { text: 'You closed with ' },
          { text: `฿${debt.toLocaleString('en-US')}`, em: true },
          { text: ' in emergency debt (' },
          { text: `฿${totalInterestPaid.toLocaleString('en-US')} interest accrued`, em: true },
          { text: '). At ' },
          { text: '20% APR', em: true },
          { text: ', debt compounds faster than normal savings can recover.' },
        ],
      },
      nextStep: {
        th: 'หากเกิดสถานการณ์จริง ต้องหยุดหนี้ดอกเบี้ยสูงก่อนและกันเงินสำรองขั้นต่ำ 3 เดือนของรายจ่าย',
        en: 'Prioritize clearing high-APR balances first and build at least a 3-month cash buffer.',
      },
      text: {
        th: `คุณจบเกมพร้อมหนี้ฉุกเฉินดอกเบี้ยสูง ฿${debt.toLocaleString('en-US')} (เสียดอกเบี้ยสะสมไปแล้ว ฿${totalInterestPaid.toLocaleString('en-US')}) — ในชีวิตจริง ดอกเบี้ย 20%/ปี จะกัดกินความสามารถในการออมระยะยาว`,
        en: `You finished with ฿${debt.toLocaleString('en-US')} in high-interest debt (฿${totalInterestPaid.toLocaleString('en-US')} interest already accrued) — 20% APR debt severely slows wealth building.`,
      },
    });
  } else {
    const runwayCaution = finalRunwayMonths < 2;
    rawTakeaways.push({
      id: 'debt-outcome',
      tone: runwayCaution ? 'caution' : 'positive',
      priority: runwayCaution ? 2 : 3,
      badge: runwayCaution
        ? { th: 'ปลอดหนี้แต่สำรองบาง', en: 'Thin Buffer' }
        : { th: 'วินัยการเงินเยี่ยม', en: 'Healthy Reserve' },
      metric: {
        th: `ปลอดหนี้ · เหลือ ${finalRunwayMonths.toFixed(1)} เดือน`,
        en: `Debt-Free · ${finalRunwayMonths.toFixed(1)} mo`,
      },
      title: runwayCaution
        ? {
            th: 'แม้จบเกมปลอดหนี้ 100% แต่เงินสำรองเหลือต่ำกว่า 2 เดือน',
            en: 'Debt-free finish, but liquid buffer fell under 2 months',
          }
        : {
            th: 'ปิดเกมปลอดหนี้ 100% พร้อมกันชนเงินสำรองที่อุ่นใจ',
            en: 'Finished 100% debt-free with a solid cash cushion',
          },
      segments: {
        th: [
          { text: 'คุณจบเกมแบบ ' },
          { text: 'ปลอดหนี้ฉุกเฉิน 100%', em: true },
          { text: ' และมีเงินสดสำรองคงเหลือ ' },
          { text: `฿${cash.toLocaleString('en-US')}`, em: true },
          { text: ` (ใช้ได้ ` },
          { text: `${finalRunwayMonths.toFixed(1)} เดือนของรายจ่าย`, em: true },
          { text: runwayCaution ? ') — ยังค่อนข้างเปราะบางหากเกิดเหตุซ้ำติดกัน' : ') — เพียงพอรับมือเหตุสะดุดระยะสั้นได้' },
        ],
        en: [
          { text: 'You finished ' },
          { text: '100% free of emergency debt', em: true },
          { text: ' with ' },
          { text: `฿${cash.toLocaleString('en-US')}`, em: true },
          { text: ' remaining (' },
          { text: `${finalRunwayMonths.toFixed(1)} months of expenses`, em: true },
          { text: runwayCaution ? ') — still thin if back-to-back shocks strike.' : ') — enough to absorb short-term disruptions.' },
        ],
      },
      nextStep: runwayCaution
        ? {
            th: 'ตั้งเป้าเติมเงินสำรองใน AutoKey ให้ถึง 3–6 เดือนของรายจ่ายประจำ',
            en: 'Aim to build your cash buffer toward 3–6 months of core monthly expenses.',
          }
        : {
            th: 'คงสภาพคล่อง 3–6 เดือนไว้ แล้วนำส่วนเกินไปศึกษาเรื่องลงทุนระยะยาวในหน้า IRR',
            en: 'Keep 3–6 months liquid, then explore long-term compounding in Invest (IRR).',
          },
      text: {
        th: `คุณจบเกมแบบปลอดหนี้ฉุกเฉิน 100% และยังมีเงินสำรองคงเหลือ ฿${cash.toLocaleString('en-US')} (${finalRunwayMonths.toFixed(1)} เดือนของรายจ่าย)`,
        en: `You finished 100% free of emergency debt with ฿${cash.toLocaleString('en-US')} remaining (${finalRunwayMonths.toFixed(1)} months of expenses).`,
      },
    });
  }

  const takeaways = rawTakeaways.sort((a, b) => a.priority - b.priority);

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

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  Gamepad2,
  LayoutGrid,
  Lock,
  MessageSquareQuote,
  Scale,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { formatTHB, useFinance } from '../context/FinanceContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateThaiTaxImpact } from '../utils/investMath';
import LiquidTabs from '../components/LiquidTabs';

// =============================================================================
// VERIFIED RESEARCH DATA FROM ACTUAL FIRST JOBBER SURVEY (n = 57, PDPA-Safe)
// Source: แบบสอบถามเกี่ยวกับความมั่นคงทางการเงินและความคุ้มครองสำหรับวัยเริ่มต้นทำงาน
// =============================================================================

const KEY_RESEARCH_FINDINGS = [
  {
    id: 'never-assessed',
    stat: '61.4%',
    count: { th: '35 จาก 57 คน', en: '35 of 57 respondents' },
    tone: 'blue',
    title: {
      th: 'ไม่เคยประเมินความเพียงพอของประกันและสวัสดิการเลย',
      en: 'Have Never Evaluated Their Coverage Sufficiency',
    },
    detail: {
      th: 'และอีก 22.8% ไม่ทราบตัวเลขวงเงินค่ารักษาพยาบาลของตนเอง ขณะที่ 59.6% เข้าใจเงื่อนไขกรมธรรม์เพียงบางส่วนหรือไม่แน่ใจ',
      en: 'Another 22.8% do not know their medical limit at all, while 59.6% only partially understand policy terms and exclusions.',
    },
  },
  {
    id: 'shock-100k',
    stat: '59.6%',
    count: { th: '34 จาก 57 คน', en: '34 of 57 respondents' },
    tone: 'rose',
    title: {
      th: 'ต้องพึ่งบัตรเครดิต/สินเชื่อ หรือครอบครัว เมื่อเจอบิล ฿100,000',
      en: 'Must Rely on Debt or Family for a Sudden ฿100k Bill',
    },
    detail: {
      th: 'แบ่งเป็นใช้บัตรเครดิต/สินเชื่อ 33.3% และขอความช่วยเหลือครอบครัว 26.3% โดยมีเพียง 8.8% เท่านั้นที่รับมือด้วยสิทธิประกันได้',
      en: '33.3% would use credit cards/loans and 26.3% would rely on family; only 8.8% could rely on insurance protection.',
    },
  },
  {
    id: 'runway-gap',
    stat: '59.6%',
    count: { th: '34 จาก 57 คน', en: '34 of 57 respondents' },
    tone: 'amber',
    title: {
      th: 'เงินสำรองต่ำกว่า 3 เดือน และกระทบหนักหากขาดรายได้ 3 เดือน',
      en: 'Emergency Reserve Under 3 Months & High 3-Month Shock Impact',
    },
    detail: {
      th: 'มีเงินสำรองน้อยกว่า 3 เดือนหรือไม่แน่ใจ 59.6% และ 59.6% ประเมินผลกระทบหากขาดรายได้ 3 เดือนไว้ที่ระดับ 4–5 (มาก–มากที่สุด)',
      en: '59.6% hold under 3 months of liquid cash (or are unsure), matching the 59.6% rating a 3-month income loss at 4–5/5 severity.',
    },
  },
  {
    id: 'tool-demand',
    stat: '63.2%',
    count: { th: '36 จาก 57 คน', en: '36 of 57 respondents' },
    tone: 'teal',
    title: {
      th: 'สนใจใช้งานเครื่องมือกลางช่วยประเมินความคุ้มครอง',
      en: 'Interested in Using a Neutral Protection Assessment Tool',
    },
    detail: {
      th: 'สะท้อนความต้องการพื้นที่กลางที่ไม่เร่งขาย แต่ช่วยคำนวณช่องว่างความเสี่ยง งบประมาณ และความคุ้มค่าอย่างโปร่งใส',
      en: 'Confirms strong demand for a zero-sales platform that clarifies protection gaps, safe budgets, and real financial value.',
    },
  },
];

// Question [AV]: 8 Features requested by n = 57 respondents — each with a distinct harmonious color!
const WANTED_FEATURES_CHART = [
  {
    id: 'protection-gap',
    count: 33,
    pct: 57.9,
    group: 'risk',
    colorKey: 'blue',
    targetPage: 'risk-analysis',
    label: { th: 'ประเมินความเสี่ยงและช่องว่างความคุ้มครอง (Protection Gap)', en: 'Evaluate Risk & Protection Gap' },
    solution: { th: 'วิเคราะห์เสี่ยง 6 ด้าน', en: '6-Pillar Risk Analysis' },
  },
  {
    id: 'recommend-coverage',
    count: 31,
    pct: 54.4,
    group: 'risk',
    colorKey: 'indigo',
    targetPage: 'risk-analysis',
    label: { th: 'แนะนำประเภทประกันและวงเงินที่เหมาะสม', en: 'Recommend Suitable Coverage & Limits' },
    solution: { th: 'แผนจัดลำดับความคุ้มครอง', en: 'Priority Coverage Guide' },
  },
  {
    id: 'existing-benefits',
    count: 30,
    pct: 52.6,
    group: 'risk',
    colorKey: 'teal',
    targetPage: 'overview',
    label: { th: 'รวบรวมและตรวจสอบสวัสดิการ / ประกันที่มีอยู่', en: 'Consolidate & Check Existing Benefits' },
    solution: { th: 'บัตรสิทธิภาพรวม', en: 'Overview Coverage Cards' },
  },
  {
    id: 'budget-premium',
    count: 28,
    pct: 49.1,
    group: 'cash',
    colorKey: 'emerald',
    targetPage: 'smartlog',
    label: { th: 'วางแผนรายรับ รายจ่าย และงบประมาณสำหรับเบี้ยประกัน', en: 'Plan Cashflow & Premium Budget' },
    solution: { th: 'AutoKey บันทึกรับ-จ่าย', en: 'AutoKey Cashbook' },
  },
  {
    id: 'compare-value',
    count: 25,
    pct: 43.9,
    group: 'cash',
    colorKey: 'sky',
    targetPage: 'invest',
    label: { th: 'เปรียบเทียบความคุ้มครองและเบี้ยประกัน', en: 'Compare Coverage & Premium Value' },
    solution: { th: 'Invest & IRR Simulator', en: 'Invest & IRR Simulator' },
  },
  {
    id: 'emergency-calc',
    count: 24,
    pct: 42.1,
    group: 'cash',
    colorKey: 'amber',
    targetPage: 'smartlog',
    label: { th: 'คำนวณเงินสำรองฉุกเฉินที่ควรมี', en: 'Calculate Ideal Emergency Reserve' },
    solution: { th: 'ตัววัดเงินสำรอง SmartLog', en: 'SmartLog Reserve Tracker' },
  },
  {
    id: 'plain-language',
    count: 21,
    pct: 36.8,
    group: 'cash',
    colorKey: 'violet',
    targetPage: 'learning',
    label: { th: 'อธิบายข้อยกเว้นและเงื่อนไขด้วยภาษาเข้าใจง่าย', en: 'Plain-Language Policy & Exclusion Guides' },
    solution: { th: 'คลังความรู้ 2 นาที & แปลศัพท์', en: '2-Min Guides & Glossary' },
  },
  {
    id: 'renewal-alert',
    count: 20,
    pct: 35.1,
    group: 'risk',
    colorKey: 'rose',
    targetPage: 'risk-analysis',
    label: { th: 'แจ้งเตือนวันครบกำหนดชำระเบี้ย / ต่ออายุกรมธรรม์', en: 'Premium Due & Renewal Reminders' },
    solution: { th: 'ส่งออกปฏิทินเตือน (.ics)', en: 'Calendar Reminder (.ics)' },
  },
];

// Question [X]: Coping mechanisms for an instant ฿100,000 emergency bill (n = 57)
const SHOCK_100K_COPING = [
  { id: 'credit', count: 19, pct: 33.3, colorKey: 'rose', label: { th: 'ใช้บัตรเครดิตหรือสินเชื่อ', en: 'Credit card or loan' } },
  { id: 'family', count: 15, pct: 26.3, colorKey: 'amber', label: { th: 'ขอความช่วยเหลือจากครอบครัว', en: 'Ask family / close relatives' } },
  { id: 'savings', count: 12, pct: 21.1, colorKey: 'teal', label: { th: 'ใช้เงินออมของตนเอง', en: 'Use personal savings' } },
  { id: 'insurance', count: 5, pct: 8.8, colorKey: 'blue', label: { th: 'ใช้สิทธิหรือความคุ้มครองจากประกัน', en: 'Use insurance protection' } },
  { id: 'other', count: 6, pct: 10.5, colorKey: 'violet', label: { th: 'ขายทรัพย์สิน / ไม่แน่ใจ / ผสมผสาน', en: 'Sell assets / unsure / mixed' } },
];

// Question [Z]: Top 5 financial & life risks feared by respondents (n = 57, multi-select top 3)
const TOP_FEARED_RISKS = [
  { id: 'cost-living', count: 26, pct: 45.6, colorKey: 'amber', label: { th: 'ค่าครองชีพสูงขึ้น', en: 'Rising cost of living' } },
  { id: 'job-loss', count: 26, pct: 45.6, colorKey: 'rose', label: { th: 'การตกงานหรือรายได้หยุดชะงัก', en: 'Job loss or income disruption' } },
  { id: 'accident', count: 25, pct: 43.9, colorKey: 'blue', label: { th: 'ค่าใช้จ่ายจากอุบัติเหตุหรือเหตุฉุกเฉิน', en: 'Accident or emergency bills' } },
  { id: 'debt', count: 20, pct: 35.1, colorKey: 'violet', label: { th: 'ภาระหนี้สิน', en: 'Debt burden' } },
  { id: 'critical', count: 19, pct: 33.3, colorKey: 'teal', label: { th: 'โรคร้ายแรงหรือเจ็บป่วยระยะยาว', en: 'Critical or long-term illness' } },
];

// Real anonymized verbatim voices from Column [AW]
const VERBATIM_VOICES = [
  {
    id: 'no-sales',
    quote: {
      th: '“อยากคุยกับคนที่ไม่เน้นขายบริการ ประกัน สินค้า (มันทำให้ไม่อยากฟัง)”',
      en: '“I want guidance from someone who isn’t pushing insurance or products to sell (sales pitches turn me off).”',
    },
    mappedTo: { th: 'ที่มาของหลักการ ไม่ขายประกัน 100%', en: 'Origin of our 100% Zero-Sales Charter' },
  },
  {
    id: 'real-irr',
    quote: {
      th: '“อยากรู้ว่าเงินที่ตอบแทนเมื่อครบกำหนด เมื่อเทียบกับเงินที่ลงทุนไปคุ้มค่าแค่ไหน โดยพิจารณาจากเงินเฟ้อและ Future Value”',
      en: '“I want to see whether maturity returns are truly worth it compared to investing, factoring in inflation and Future Value.”',
    },
    mappedTo: { th: 'ที่มาของหน้า Invest & IRR Lab', en: 'Origin of our Invest & IRR Lab' },
  },
  {
    id: 'balanced-plan',
    quote: {
      th: '“อยากวางแผนการเงินให้มีเงินเก็บมากขึ้น และทราบว่าควรมีความคุ้มครองด้านไหนที่จำเป็นโดยไม่เป็นภาระค่าใช้จ่ายมากเกินไป”',
      en: '“I want to build savings while knowing which protection is truly necessary without overburdening my budget.”',
    },
    mappedTo: { th: 'ที่มาของ SmartLog + กรอบงบ 10–15%', en: 'Origin of SmartLog + 10–15% Guardrail' },
  },
];

const CORE_PILLARS = [
  {
    id: 'neutral',
    icon: Scale,
    tone: 'blue',
    badge: { th: 'หลักที่ 01 • ความเป็นกลาง', en: 'Pillar 01 • Neutrality' },
    title: { th: 'ไม่ขายประกัน 100%', en: '100% Zero Insurance Sales' },
    desc: {
      th: 'ไม่มีการขายกรมธรรม์ ไม่เก็บข้อมูลติดต่อเพื่อเสนอขาย และไม่จัดอันดับบริษัทประกันใดเป็นพิเศษ เพื่อให้ผู้ใช้เห็นคณิตศาสตร์จริงก่อนตัดสินใจเอง',
      en: 'Zero policy sales, zero lead capture, and zero commercial brand rankings — empowering users with transparent, unbiased math first.',
    },
  },
  {
    id: 'pdpa',
    icon: Lock,
    tone: 'teal',
    badge: { th: 'หลักที่ 02 • ความเป็นส่วนตัว', en: 'Pillar 02 • Privacy-First' },
    title: { th: 'ไม่ต้องล็อกอิน ปลอดภัยตามหลัก PDPA', en: 'Zero-Login & PDPA-Safe Local Data' },
    desc: {
      th: 'ไม่ขออีเมล เบอร์โทรศัพท์ หรือเลขบัตรประชาชน ข้อมูลการเงินทั้งหมดเก็บไว้ในเครื่องผู้ใช้ 100% ผ่าน localStorage พร้อมสำรองด้วยไฟล์ .json ได้เอง',
      en: 'Never collects emails, phone numbers, or national IDs. Every baht stays 100% on your device via localStorage with portable .json backup.',
    },
  },
  {
    id: 'actuarial',
    icon: Calculator,
    tone: 'navy',
    badge: { th: 'หลักที่ 03 • คณิตศาสตร์ประกันภัย', en: 'Pillar 03 • Actuarial Rigor' },
    title: { th: 'ประเมินแบบระมัดระวัง (Conservative)', en: 'Conservative Actuarial Estimation' },
    desc: {
      th: 'จากผลสำรวจพบ 22.8% ไม่ทราบวงเงินประกันของตน ระบบจึงนับวงเงินที่ไม่ทราบเป็น ฿0 ไว้ก่อน เพื่อไม่ให้ประเมินช่องว่างความเสี่ยงต่ำกว่าความจริง',
      en: 'Because 22.8% of respondents do not know their medical limit, unknown coverage is conservatively counted as ฿0 so real gaps are never hidden.',
    },
  },
];

export default function LandingAbout({ onNavigate }) {
  const { lang, t } = useLanguage();
  const {
    userProfile,
    monthlyIncome,
    monthlyExpenses,
    emergencyFund,
    emergencyRunway,
    coverageItems,
    riskAssessment,
  } = useFinance();

  const [researchFilter, setResearchFilter] = useState('all');

  const displayName = (userProfile?.firstName || '').trim() || 'First Jobber';
  const monthlySurplus = Math.max(0, (monthlyIncome || 0) - (monthlyExpenses || 0));
  const taxInfo = useMemo(
    () => calculateThaiTaxImpact({ annualIncome: (monthlyIncome || 0) * 12 }),
    [monthlyIncome]
  );

  const researchTabs = useMemo(
    () => [
      { id: 'all', label: lang === 'TH' ? 'ทั้งหมด (8)' : 'All (8)' },
      { id: 'risk', label: lang === 'TH' ? 'ความเสี่ยง & สิทธิ' : 'Risk & Rights' },
      { id: 'cash', label: lang === 'TH' ? 'เงินสด & ความรู้' : 'Cash & Literacy' },
    ],
    [lang]
  );

  const visibleFindings = useMemo(() => {
    if (researchFilter === 'all') return WANTED_FEATURES_CHART;
    return WANTED_FEATURES_CHART.filter((item) => item.group === researchFilter);
  }, [researchFilter]);

  const ecosystemModules = useMemo(
    () => [
      {
        id: 'overview',
        num: '01',
        icon: LayoutGrid,
        tone: 'blue',
        title: { th: 'ภาพรวม & บัตรสิทธิ', en: 'Overview & Coverage Cards' },
        desc: {
          th: 'ตอบโจทย์ 52.6% ที่ต้องการรวบรวมและเช็กสวัสดิการเดิมทั้งหมดในหน้าเดียว',
          en: 'Solves the 52.6% need to consolidate and inspect all existing benefits in one view.',
        },
        liveStat:
          lang === 'TH'
            ? `${coverageItems.length} บัตรสิทธิ • ครอบคลุม ${riskAssessment?.overallCoveragePct || 0}%`
            : `${coverageItems.length} Cards • ${riskAssessment?.overallCoveragePct || 0}% Covered`,
      },
      {
        id: 'smartlog',
        num: '02',
        icon: Wallet,
        tone: 'teal',
        title: { th: 'AutoKey บันทึกการเงิน', en: 'AutoKey Smart Cashbook' },
        desc: {
          th: 'ตอบโจทย์ 49.1% ด้านวางแผนงบฯ และ 42.1% ที่ต้องการคำนวณเงินสำรองฉุกเฉิน',
          en: 'Solves the 49.1% cashflow budgeting need and 42.1% emergency reserve calculation need.',
        },
        liveStat:
          lang === 'TH'
            ? `สำรอง ${formatTHB(emergencyFund)} (${emergencyRunway.toFixed(1)} ด.)`
            : `Reserve ${formatTHB(emergencyFund)} (${emergencyRunway.toFixed(1)} mo)`,
      },
      {
        id: 'risk-analysis',
        num: '03',
        icon: ShieldAlert,
        tone: 'blue',
        title: { th: 'Risk Analysis ความเสี่ยง 6 ด้าน', en: '6-Pillar Risk Analysis' },
        desc: {
          th: 'ตอบโจทย์อันดับ 1 (57.9%) ประเมิน Protection Gap พร้อมเตือนต่ออายุ .ics (35.1%)',
          en: 'Solves the #1 request (57.9%) for Protection Gap sizing plus .ics renewal alerts (35.1%).',
        },
        liveStat:
          lang === 'TH'
            ? `ช่องว่าง ${formatTHB(riskAssessment?.totalProtectionGap || 0)}`
            : `Gap ${formatTHB(riskAssessment?.totalProtectionGap || 0)}`,
      },
      {
        id: 'invest',
        num: '04',
        icon: TrendingUp,
        tone: 'navy',
        title: { th: 'Invest & IRR คำนวณความคุ้มค่า', en: 'Invest & IRR Value Lab' },
        desc: {
          th: 'ตอบโจทย์ 43.9% ที่ต้องการเทียบความคุ้มค่าเบี้ย พร้อมคำนวณ IRR หลังหักเงินเฟ้อ',
          en: 'Solves the 43.9% need to compare value with inflation-adjusted IRR & Thai tax math.',
        },
        liveStat:
          lang === 'TH'
            ? `ฐานภาษี ${taxInfo.marginalRatePct}% • รายได้ ${formatTHB(monthlyIncome)}/ด.`
            : `Tax ${taxInfo.marginalRatePct}% • ${formatTHB(monthlyIncome)}/mo`,
      },
      {
        id: 'game',
        num: '05',
        icon: Gamepad2,
        tone: 'teal',
        title: { th: 'Game เอาตัวรอดทางการเงิน', en: 'Survival Lab Simulator' },
        desc: {
          th: 'ตอบโจทย์ 56.1% ที่ไม่มั่นใจว่าจะรับมือบิลอุบัติเหตุ ฿100,000 ได้ ให้ลองซ้อมก่อนเกิดจริง',
          en: 'Built for the 56.1% lacking confidence facing a ฿100k shock — practice safely first.',
        },
        liveStat:
          lang === 'TH'
            ? `เหลือออม ${formatTHB(monthlySurplus)}/ด. • 30–365 วัน`
            : `Surplus ${formatTHB(monthlySurplus)}/mo • 30–365d`,
      },
      {
        id: 'learning',
        num: '06',
        icon: BookOpen,
        tone: 'indigo',
        title: { th: 'คลังความรู้ 2 นาที', en: '2-Minute Learning Library' },
        desc: {
          th: 'ตอบโจทย์ 59.6% ที่ยังเข้าใจเงื่อนไขไม่ครบ และ 36.8% ที่อยากให้อธิบายด้วยภาษาเข้าใจง่าย',
          en: 'Built for the 59.6% unsure of policy details and 36.8% wanting plain-language guides.',
        },
        liveStat:
          lang === 'TH'
            ? '10 บทความ • 14 ศัพท์ • ควิซ 20 ข้อ'
            : '10 Guides • 14 Terms • 20-Q Quiz',
      },
    ],
    [
      coverageItems.length,
      emergencyFund,
      emergencyRunway,
      lang,
      monthlyIncome,
      monthlySurplus,
      riskAssessment?.overallCoveragePct,
      riskAssessment?.totalProtectionGap,
      taxInfo.marginalRatePct,
    ]
  );

  return (
    <div className="ab-page">
      {/* ===================================================================== */}
      {/* 1. HERO STORY BANNER — WHY PROTECT360 EXISTS (CLEAN, ZERO DUP BUTTONS) */}
      {/* ===================================================================== */}
      <section className="ab-hero-card" aria-label="About PROTECT360 story">
        <div className="ab-hero-main">
          <div className="ab-hero-brand-row">
            <span className="ab-hero-logo-box" aria-hidden="true">
              <img src="/logo.png" alt="PROTECT360" className="ab-hero-logo-img" />
            </span>
            <div className="ab-hero-brand-meta">
              <div className="ab-hero-wordmark-row">
                <span className="ab-hero-wordmark">PROTECT360</span>
                <span className="ab-hero-oic-pill">OIC Initiative</span>
              </div>
              <span className="ab-hero-initiative-sub">
                {lang === 'TH'
                  ? 'ที่มาของแพลตฟอร์มโค้ชการเงินและจัดการความเสี่ยงที่เป็นกลางสำหรับ First Jobber'
                  : 'Why We Built a Neutral Financial & Risk-Planning Coach for First Jobbers'}
              </span>
            </div>
          </div>

          <h1 className="ab-hero-headline">
            {lang === 'TH'
              ? 'เข้าใจเงิน เข้าใจความเสี่ยง ตัดสินใจอย่างมั่นใจ — โดยไม่ขายประกัน'
              : 'Understand Your Money, Know Your Risks, Decide with Confidence — Zero Insurance Sales'}
          </h1>

          <p className="ab-hero-welcome">
            {lang === 'TH'
              ? `สวัสดีคุณ ${displayName} • PROTECT360 เกิดจากการสำรวจปัญหาจริงของวัยเริ่มต้นทำงานในไทย (n = 57 คน) ที่พบว่ากว่า 61.4% ไม่เคยประเมินช่องว่างความคุ้มครองของตนเอง และเกือบ 6 ใน 10 ต้องพึ่งหนี้สินหรือครอบครัวเมื่อเจอเหตุฉุกเฉิน ฿100,000`
              : `Hello ${displayName} • PROTECT360 was born from real survey evidence of Thai First Jobbers (n = 57), showing 61.4% have never assessed their protection gap and nearly 6 in 10 would fall back on debt or family during a ฿100,000 shock.`}
          </p>

          <div className="ab-hero-source-pill">
            <FileSpreadsheet size={14} aria-hidden="true" />
            <span>
              {lang === 'TH'
                ? 'อ้างอิงชุดข้อมูลจริง: แบบสอบถามความมั่นคงทางการเงินและความคุ้มครองวัยเริ่มต้นทำงาน (n = 57 คน • ไม่ระบุตัวตนตามหลัก PDPA)'
                : 'Primary Dataset: Financial Security & Protection Survey for Early-Career Workers (n = 57 • Anonymous PDPA-Safe)'}
            </span>
          </div>
        </div>

        <aside className="ab-hero-stats tabular-nums" aria-label="Survey headline metrics">
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">n = 57</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'ผู้ตอบแบบสอบถามจริง' : 'Survey Respondents'}
            </span>
          </div>
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">61.4%</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'ไม่เคยประเมินช่องว่างความคุ้มครอง' : 'Never Evaluated Coverage Gap'}
            </span>
          </div>
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">63.2%</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'สนใจใช้เครื่องมือกลางช่วยประเมิน' : 'Want a Neutral Assessment Tool'}
            </span>
          </div>
        </aside>
      </section>

      {/* ===================================================================== */}
      {/* 2. WHY PROTECT360 EXISTS — 4 KEY RESEARCH INSIGHTS (n = 57)           */}
      {/* ===================================================================== */}
      <section className="ab-insights-section" aria-label="Key findings from n=57 survey">
        <div className="ab-eco-header">
          <div>
            <div className="ab-section-kicker">
              <AlertTriangle size={14} aria-hidden="true" />
              <span>
                {lang === 'TH'
                  ? 'WHY THIS APP EXISTS • ตกผลึกจากข้อมูลจริง (n = 57 คน)'
                  : 'WHY THIS APP EXISTS • DISTILLED FROM SURVEY DATA (n = 57)'}
              </span>
            </div>
            <h2 className="ab-section-title">
              {lang === 'TH'
                ? '4 ช่องว่างจริงของวัยเริ่มต้นทำงานที่เป็นจุดตั้งต้นของ PROTECT360'
                : '4 Real-World Gaps Among Early-Career Workers Behind PROTECT360'}
            </h2>
          </div>
        </div>

        <div className="ab-kpi-grid">
          {KEY_RESEARCH_FINDINGS.map((item) => (
            <article key={item.id} className={`bento-card ab-kpi-card tone-${item.tone}`}>
              <div className="ab-kpi-top tabular-nums">
                <strong className={`ab-kpi-value tone-${item.tone}`}>{item.stat}</strong>
                <span className="ab-kpi-count">{t(item.count)}</span>
              </div>
              <h3 className="ab-kpi-title">{t(item.title)}</h3>
              <p className="ab-kpi-desc">{t(item.detail)}</p>
            </article>
          ))}
        </div>

        {/* Deep Dive 2-Column Survey Charts: ฿100k Shock Coping + Top Feared Risks */}
        <div className="ab-deep-grid">
          <article className="bento-card ab-mini-chart-card">
            <h3 className="ab-mini-chart-title">
              {lang === 'TH'
                ? 'หากเจอบิลฉุกเฉิน ฿100,000 ทันที กลุ่มตัวอย่างรับมืออย่างไร?'
                : 'How Respondents Handle an Instant ฿100,000 Emergency Bill'}
            </h3>
            <p className="ab-mini-chart-sub">
              {lang === 'TH'
                ? 'ข้อมูลจากคำถามสถานการณ์จริง (n = 57 คน) — เกือบ 60% ต้องก่อหนี้หรือพึ่งครอบครัว'
                : 'From actual emergency-coping responses (n = 57) — nearly 60% turn to debt or family.'}
            </p>

            <div className="ab-mini-bars">
              {SHOCK_100K_COPING.map((row) => (
                <div key={row.id} className="ab-mini-bar-item">
                  <div className="ab-mini-bar-row tabular-nums">
                    <span className="ab-mini-bar-label">
                      <span className={`ab-color-dot color-${row.colorKey}`} aria-hidden="true" />
                      {t(row.label)}
                    </span>
                    <span className="ab-mini-bar-val">
                      <strong>{row.pct.toFixed(1)}%</strong> ({row.count})
                    </span>
                  </div>
                  <div className="ab-mini-track" aria-hidden="true">
                    <div
                      className={`ab-bar-fill color-${row.colorKey}`}
                      style={{ width: `${Math.min(100, (row.pct / 38) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="bento-card ab-mini-chart-card">
            <h3 className="ab-mini-chart-title">
              {lang === 'TH'
                ? 'ความเสี่ยงทางการเงินที่วัยเริ่มต้นทำงานกังวลสูงสุด 5 อันดับแรก'
                : 'Top 5 Financial & Life Risks Feared Most (Multi-Select)'}
            </h3>
            <p className="ab-mini-chart-sub">
              {lang === 'TH'
                ? 'ผู้ตอบเลือกความเสี่ยงที่กังวลมากที่สุด 3 อันดับแรก (n = 57 คน)'
                : 'Respondents selected their top 3 personal financial worries (n = 57).'}
            </p>

            <div className="ab-mini-bars">
              {TOP_FEARED_RISKS.map((row) => (
                <div key={row.id} className="ab-mini-bar-item">
                  <div className="ab-mini-bar-row tabular-nums">
                    <span className="ab-mini-bar-label">
                      <span className={`ab-color-dot color-${row.colorKey}`} aria-hidden="true" />
                      {t(row.label)}
                    </span>
                    <span className="ab-mini-bar-val">
                      <strong>{row.pct.toFixed(1)}%</strong> ({row.count})
                    </span>
                  </div>
                  <div className="ab-mini-track" aria-hidden="true">
                    <div
                      className={`ab-bar-fill color-${row.colorKey}`}
                      style={{ width: `${Math.min(100, (row.pct / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Real Anonymized Verbatim Quotes from Column [AW] */}
        <div className="ab-voices-grid">
          {VERBATIM_VOICES.map((voice) => (
            <blockquote key={voice.id} className="bento-card ab-voice-card">
              <div className="ab-voice-top">
                <MessageSquareQuote size={16} className="ab-voice-icon" aria-hidden="true" />
                <span className="ab-voice-tag">
                  {lang === 'TH' ? 'เสียงสะท้อนจริงจากแบบสอบถาม' : 'Verbatim Survey Voice'}
                </span>
              </div>
              <p className="ab-voice-quote">{t(voice.quote)}</p>
              <footer className="ab-voice-map">{t(voice.mappedTo)}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. MULTI-COLOR INTERACTIVE CHART: WHAT n = 57 WANT IN PROTECT360      */}
      {/* ===================================================================== */}
      <section
        className="bento-card ab-research-card"
        aria-label="What n=57 respondents want in PROTECT360"
      >
        <div className="ab-section-head">
          <div className="ab-section-head-copy">
            <div className="ab-section-kicker">
              <BarChart3 size={15} aria-hidden="true" />
              <span>
                {lang === 'TH'
                  ? 'FEATURE DEMAND SURVEY • n = 57 คน (เลือกได้มากกว่า 1 ข้อ)'
                  : 'FEATURE DEMAND SURVEY • n = 57 RESPONDENTS (MULTI-SELECT)'}
              </span>
            </div>
            <h2 className="ab-section-title">
              {lang === 'TH'
                ? 'กลุ่มตัวอย่าง (n = 57 คน) อยากให้แอป PROTECT360 มีฟีเจอร์อะไรบ้าง?'
                : 'What Features Do Survey Respondents (n = 57) Want in PROTECT360?'}
            </h2>
            <p className="ab-section-sub">
              {lang === 'TH'
                ? 'แยกโทนสีตามแต่ละความต้องการชัดเจน (เรียงจากมากไปน้อย) — คลิกที่แท่งกราฟเพื่อเปิดดูฟีเจอร์จริงที่สร้างขึ้นรองรับ →'
                : 'Distinct color-coded demand bars sorted from highest to lowest — click any bar to jump to the live feature →'}
            </p>
          </div>

          <div className="ab-research-tabs">
            <LiquidTabs
              tabs={researchTabs}
              activeId={researchFilter}
              onChange={setResearchFilter}
              variant="surface"
              idPrefix="about-research"
              ariaLabel={lang === 'TH' ? 'กรองผลสำรวจ' : 'Filter survey findings'}
            />
          </div>
        </div>

        <div className="ab-bar-list">
          {visibleFindings.map((item, idx) => (
            <button
              key={item.id}
              id={`ab-survey-bar-${item.id}`}
              type="button"
              className={`ab-bar-row color-${item.colorKey}`}
              onClick={() => onNavigate?.(item.targetPage)}
            >
              <div className="ab-bar-top">
                <div className="ab-bar-label-group">
                  <span className={`ab-bar-rank-badge color-${item.colorKey} tabular-nums`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <strong className="ab-bar-label">{t(item.label)}</strong>
                </div>

                <div className="ab-bar-right-meta tabular-nums">
                  <span className={`ab-bar-solution-chip color-${item.colorKey}`}>
                    <span>{t(item.solution)}</span>
                    <ArrowRight size={12} aria-hidden="true" />
                  </span>
                  <span className="ab-bar-count-pill">
                    {lang === 'TH' ? `${item.count}/57 คน` : `${item.count}/57`}
                  </span>
                  <strong className="ab-bar-pct">{item.pct.toFixed(1)}%</strong>
                </div>
              </div>

              <div className="ab-bar-track" aria-hidden="true">
                <div
                  className={`ab-bar-fill color-${item.colorKey}`}
                  style={{ width: `${Math.min(100, (item.pct / 62) * 100)}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. 3 CORE PILLARS OF PROTECT360                                       */}
      {/* ===================================================================== */}
      <section aria-label="Three core pillars of PROTECT360">
        <div className="ab-pillars-grid">
          {CORE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.id} className="bento-card ab-pillar-card">
                <div className="ab-pillar-head">
                  <span className={`ab-pillar-icon tone-${pillar.tone}`} aria-hidden="true">
                    <Icon size={19} strokeWidth={2.1} />
                  </span>
                  <span className="ab-pillar-badge">{t(pillar.badge)}</span>
                </div>
                <h2 className="ab-pillar-title">{t(pillar.title)}</h2>
                <p className="ab-pillar-desc">{t(pillar.desc)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. LIVE 6-MODULE ECOSYSTEM DIRECTORY (MAPPED TO RESEARCH NEEDS)       */}
      {/* ===================================================================== */}
      <section className="ab-eco-section" aria-label="Live 6-module PROTECT360 ecosystem">
        <div className="ab-eco-header">
          <div>
            <h2 className="ab-section-title">
              {lang === 'TH'
                ? 'ระบบนิเวศ 6 โมดูลที่ออกแบบจากผลวิจัย (เชื่อมข้อมูลสดทั้งระบบ)'
                : '6 Research-Driven Modules (Live Synced Across PROTECT360)'}
            </h2>
            <p className="ab-section-sub">
              {lang === 'TH'
                ? 'ทุกโมดูลเชื่อมต่อข้อมูลจริงจากโปรไฟล์ของคุณแบบเรียลไทม์ — กดที่การ์ดเพื่อเปิดดูแต่ละหน้าได้ทันที'
                : 'Every module syncs live with your active profile — select any card to explore that module.'}
            </p>
          </div>
        </div>

        <div className="ab-eco-grid">
          {ecosystemModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                id={`ab-eco-card-${mod.id}`}
                type="button"
                className="bento-card ab-eco-card"
                onClick={() => onNavigate?.(mod.id)}
              >
                <div className="ab-eco-card-top">
                  <span className={`ab-eco-icon tone-${mod.tone}`} aria-hidden="true">
                    <Icon size={18} strokeWidth={2.1} />
                  </span>
                  <span className="ab-eco-num tabular-nums">{mod.num}</span>
                </div>

                <strong className="ab-eco-title">{t(mod.title)}</strong>
                <p className="ab-eco-desc">{t(mod.desc)}</p>

                <div className="ab-eco-footer">
                  <span className="ab-eco-live-pill tabular-nums">
                    <span className="ab-live-dot" aria-hidden="true" />
                    <span>{mod.liveStat}</span>
                  </span>
                  <ArrowRight size={15} className="ab-eco-arrow" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. EDUCATIONAL GOVERNANCE & DATA CITATION FOOTER CARD                 */}
      {/* ===================================================================== */}
      <section
        className="bento-card ab-governance-card"
        aria-label="Educational governance and research source"
      >
        <div className="ab-gov-left">
          <span className="ab-gov-icon" aria-hidden="true">
            <ShieldCheck size={21} strokeWidth={2.1} />
          </span>
          <div className="ab-gov-copy">
            <h2 className="ab-gov-title">
              {lang === 'TH'
                ? 'ธรรมาภิบาลเพื่อการศึกษา & แหล่งอ้างอิงงานวิจัย (Educational Governance)'
                : 'Educational Governance & Survey Source Citation'}
            </h2>
            <p className="ab-gov-desc">
              {lang === 'TH'
                ? 'PROTECT360 เป็นต้นแบบแพลตฟอร์มเสริมสร้างความรู้ทางการเงินและช่วยตัดสินใจจัดการความเสี่ยงเพื่อการศึกษาเท่านั้น (Educational Decision-Support Prototype) อ้างอิงสถิติจาก “แบบสอบถามเกี่ยวกับความมั่นคงทางการเงินและความคุ้มครองสำหรับวัยเริ่มต้นทำงาน” (n = 57 คน, เก็บข้อมูลแบบสมัครใจไม่ระบุตัวตนตามหลัก PDPA) โดยไม่มีการเสนอขายกรมธรรม์หรือรับค่านายหน้าใด ๆ'
                : 'PROTECT360 is an educational decision-support prototype grounded in the anonymous “Financial Security & Protection Survey for Early-Career Workers” (n = 57, PDPA-compliant), built purely for consumer risk literacy with zero brokerage or policy sales.'}
            </p>
            <div className="ab-gov-checks">
              <span>
                <CheckCircle2 size={14} aria-hidden="true" />
                {lang === 'TH' ? 'สถิติจริงจากกลุ่มตัวอย่าง n = 57 คน' : 'Primary Survey Data (n = 57)'}
              </span>
              <span>
                <CheckCircle2 size={14} aria-hidden="true" />
                {lang === 'TH' ? 'ไม่ขายประกัน / ไม่มีค่านายหน้า' : 'Zero Sales / Zero Commission'}
              </span>
              <span>
                <CheckCircle2 size={14} aria-hidden="true" />
                {lang === 'TH' ? 'ข้อมูลเก็บในเครื่องผู้ใช้ 100% (PDPA-Safe)' : '100% Local-First Storage'}
              </span>
            </div>
          </div>
        </div>

        <a
          href="https://www.oic.or.th/th"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-soft-gray ab-gov-oic-link"
        >
          <span>{lang === 'TH' ? 'สำนักงาน คปภ. (สายด่วน 1186)' : 'OIC Thailand (Hotline 1186)'}</span>
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}

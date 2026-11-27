import { useMemo, useState } from 'react';
import { ArrowUpRight, Maximize2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LiquidTabs from '../components/LiquidTabs';

// =============================================================================
// MACRO RESEARCH ORIGINS — NATIONAL REPORTS BEHIND PROTECT360
// 1) Krungsri Research: Gen Z Finance Survey 2025 (12 June 2025, n = 426)
// 2) Bank of Thailand (BOT) & NSO: Financial Literacy Survey 2567 (Pages 5 & 17)
// =============================================================================

const BOT_2567_PDF_URL =
  'https://www.bot.or.th/content/dam/bot/documents/th/research-and-publications/reports/financial-access-survey-of-thai-household/fl-fi-hh-survey-report-2024-th.pdf';

const KRUNGSRI_ORIGIN = {
  id: 'krungsri-genz-2025',
  sourceTag: {
    th: 'วิจัยกรุงศรี (Krungsri Research)',
    en: 'Krungsri Research (Bank of Ayudhya)',
  },
  dateLabel: { th: '12 มิถุนายน 2568 • n = 426 คน', en: 'June 12, 2025 • n = 426' },
  title: {
    th: 'Gen Z Finance Survey: เจาะพฤติกรรมการเงินคนรุ่นใหม่ (2568)',
    en: 'Gen Z Finance Survey: Inside Gen Z’s Money Mindset (2025)',
  },
  citation: {
    th: 'ที่มา: วิจัยกรุงศรี, ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน) — สำรวจคนรุ่นใหม่ Gen Z อายุ 18–30 ปี จำนวน 426 คน (ก.พ.–มี.ค. 2568)',
    en: 'Source: Krungsri Research, Bank of Ayudhya PCL — Online survey of 426 Thai Gen Z participants aged 18–30 (Feb–Mar 2025).',
  },
  whatInside: [
    {
      th: 'โครงสร้างรายได้ของวัยเริ่มทำงาน (อายุ 23–26 ปี รายได้เฉลี่ย ฿25,826/เดือน และกว่า 9 ใน 10 รายได้ต่ำกว่า ฿50,000/เดือน)',
      en: 'Early-career income profile (ages 23–26 average ฿25,826/mo; over 9 in 10 earn under ฿50,000/mo).',
    },
    {
      th: 'ความกังวลหลัก: ค่าครองชีพสูง (69%), เงินเก็บไม่พอยามฉุกเฉิน (~50%) และค่าใช้จ่ายด้านสุขภาพ/การรักษาพยาบาลติด 5 อันดับแรก',
      en: 'Top concerns: rising living costs (69%), insufficient emergency cash (~50%), and healthcare costs in the top 5.',
    },
    {
      th: 'เป้าหมายการออมอันดับ 1 คือ “ออมเผื่อฉุกเฉิน” (67.6%) โดย 88% อยากเริ่มออมเร็ว และ 86% ไม่อยากแบกหนี้ก้อนใหญ่ระยะยาว',
      en: '#1 savings goal is emergency reserves (67.6%), with 88% wanting to save early and 86% avoiding long-term debt.',
    },
  ],
  whyLedToApp: {
    th: 'นำไปสู่การออกแบบเครื่องมือที่เน้น “กันชนเงินสำรอง + ป้องกันค่ารักษาพยาบาล” สำหรับคนรายได้เริ่มต้น โดยไม่ผลักภาระหนี้หรือเร่งขาย',
    en: 'Shaped our focus on liquid emergency reserves plus practical medical risk protection for entry-level incomes.',
  },
  url: 'https://www.krungsri.com/th/research/research-intelligence/gen-z-finance-survey-2025',
  ctaLabel: {
    th: 'อ่านบทความวิจัยกรุงศรีฉบับเต็ม',
    en: 'Read Krungsri Research Article',
  },
};

const BOT_PLATES = [
  {
    id: 'bot-2567-p05',
    pageLabel: { th: 'เอกสารแนบ — หน้า 5', en: 'Attached Scan — Page 5' },
    sourceTag: {
      th: 'ธนาคารแห่งประเทศไทย (ธปท.) • รายงานปี 2567',
      en: 'Bank of Thailand (BOT) • 2024 Report',
    },
    title: {
      th: 'การใช้บริการเงินฝากและสินเชื่อภาคครัวเรือน',
      en: 'Household Deposit Accounts & Credit Usage',
    },
    citation: {
      th: 'ที่มา: ธนาคารแห่งประเทศไทย (ธปท.) ร่วมกับสำนักงานสถิติแห่งชาติ • รายงานผลสำรวจทักษะทางการเงินของไทย ปี 2567 • หน้า 5',
      en: 'Source: Bank of Thailand (BOT) & National Statistical Office • Thailand Financial Literacy Survey 2024 • Page 5.',
    },
    imageUrl: '/references/bot-2567-p05-deposit-credit.png',
    imageCaption: {
      th: 'หน้า 5: ผลของการแยกบัญชีเพื่อออมโดยเฉพาะ และพฤติกรรมเมื่อเงินไม่พอใช้',
      en: 'Page 5: Impact of dedicated savings accounts and coping behavior during cash shortfalls.',
    },
    whatInside: [
      {
        th: 'คนไทย 96.1% มีบัญชีเงินฝาก แต่มีเพียง 56.1% ที่แยกบัญชีไว้เพื่อการออมโดยเฉพาะ',
        en: '96.1% hold bank accounts, yet only 56.1% keep a dedicated savings account separate from daily spending.',
      },
      {
        th: 'ผู้ที่แยกบัญชีเพื่อออมมีโอกาสสะสมเงินสำรองเกิน 6 เดือนสูงกว่า ~3 เท่า (33% vs 11.7%) และออมเกษียณตามแผนสูงกว่า ~3 เท่า (20.2% vs 6%)',
        en: 'Dedicated savers are ~3x more likely to hold 6+ months of reserves (33% vs 11.7%) and ~3x more likely to meet retirement plans.',
      },
      {
        th: 'แสดงลำดับวิธีรับมือเมื่อเงินไม่พอใช้ (ลดรายจ่าย → ถอนเงินออม → ขอยืมคนใกล้ตัว) และสัดส่วนการใช้สินเชื่อ',
        en: 'Maps household coping steps when cash runs short (cut expenses → tap savings → borrow) and credit sources.',
      },
    ],
    whyLedToApp: {
      th: 'ที่มาของการแยก “เงินสำรองฉุกเฉิน” ออกจากเงินใช้จ่ายรายวันในสมุดบัญชี 360Flow',
      en: 'Directly motivated separating liquid emergency savings from daily cashflow in 360Flow.',
    },
    url: BOT_2567_PDF_URL,
    ctaLabel: { th: 'เปิดรายงาน ธปท. ฉบับเต็ม (PDF)', en: 'Open BOT Report (PDF)' },
  },
  {
    id: 'bot-2567-p17',
    pageLabel: { th: 'เอกสารแนบ — หน้า 17', en: 'Attached Scan — Page 17' },
    sourceTag: {
      th: 'ธนาคารแห่งประเทศไทย (ธปท.) • รายงานปี 2567',
      en: 'Bank of Thailand (BOT) • 2024 Report',
    },
    title: {
      th: 'หัวข้อ 1.3.1 การออมเผื่อฉุกเฉินของคนไทย (ปี 2563–2567)',
      en: 'Section 1.3.1 Emergency Savings in Thailand (2020–2024)',
    },
    citation: {
      th: 'ที่มา: ธนาคารแห่งประเทศไทย (ธปท.) ร่วมกับสำนักงานสถิติแห่งชาติ • รายงานผลสำรวจทักษะทางการเงินของไทย ปี 2567 • หน้า 17',
      en: 'Source: Bank of Thailand (BOT) & National Statistical Office • Thailand Financial Literacy Survey 2024 • Page 17.',
    },
    imageUrl: '/references/bot-2567-p17-emergency-savings.png',
    imageCaption: {
      th: 'หน้า 17: สัดส่วนเงินสำรองฉุกเฉินของคนไทยปี 2563–2567 แยกตามกลุ่มอายุและอาชีพ',
      en: 'Page 17: Thai emergency savings ratios (2020–2024) by age group and occupation.',
    },
    whatInside: [
      {
        th: 'กว่า 75% ของคนไทยมีเงินสำรองฉุกเฉินใช้จ่ายได้ไม่เกิน 6 เดือน (มีเกิน 6 เดือนเพียง 23.7%)',
        en: 'Over 75% of Thai people hold 6 months or less of emergency reserves (only 23.7% hold over 6 months).',
      },
      {
        th: 'ปี 2567 พบว่ามีเงินสำรองน้อยกว่า 1 เดือนถึง 20.8% และไม่ทราบ/ไม่แน่ใจอีก 22.4%',
        en: 'In 2024, 20.8% held under 1 month of cash and 22.4% did not know how long their savings would last.',
      },
      {
        th: 'กลุ่มวัยรุ่น–เด็กจบใหม่ (15–30 ปี), ลูกจ้างเอกชน และอาชีพอิสระ เป็นกลุ่มที่เปราะบางที่สุดหากรายได้หยุดชะงัก',
        en: 'Age & occupation breakdowns pinpoint ages 15–30, private employees, and freelancers as the most vulnerable.',
      },
    ],
    whyLedToApp: {
      th: 'ที่มาของตัววัดระยะเวลารอดชีวิต (Runway 3–6 เดือน) และเกมจำลองขาดรายได้ใน Survival Lab',
      en: 'Shaped our 3–6 month Emergency Runway benchmark and income-shock scenarios in Survival Lab.',
    },
    url: BOT_2567_PDF_URL,
    ctaLabel: { th: 'เปิดรายงาน ธปท. ฉบับเต็ม (PDF)', en: 'Open BOT Report (PDF)' },
  },
];

// =============================================================================
// PRIMARY SURVEY FINDINGS — FIRST JOBBER QUESTIONNAIRE (PDPA-Safe)
// =============================================================================

const KEY_RESEARCH_FINDINGS = [
  {
    id: 'never-assessed',
    stat: '61.4%',
    count: { th: '35 คน', en: '35 respondents' },
    title: {
      th: 'ไม่เคยประเมินความเพียงพอของประกันและสวัสดิการเลย',
      en: 'Never evaluated their coverage sufficiency',
    },
    detail: {
      th: 'อีก 22.8% ไม่ทราบวงเงินค่ารักษาของตนเอง และ 59.6% เข้าใจเงื่อนไขเพียงบางส่วนหรือไม่แน่ใจ',
      en: '22.8% do not know their medical limit, and 59.6% only partially understand policy terms.',
    },
  },
  {
    id: 'shock-100k',
    stat: '59.6%',
    count: { th: '34 คน', en: '34 respondents' },
    title: {
      th: 'ต้องพึ่งบัตรเครดิต/สินเชื่อ หรือครอบครัว เมื่อเจอบิล ฿100,000',
      en: 'Rely on debt or family for a sudden ฿100k bill',
    },
    detail: {
      th: 'ใช้บัตรเครดิต/สินเชื่อ 33.3% และขอช่วยครอบครัว 26.3% — มีเพียง 8.8% ที่ใช้สิทธิประกันรับมือได้',
      en: '33.3% turn to credit/loans and 26.3% to family; only 8.8% can rely on insurance.',
    },
  },
  {
    id: 'runway-gap',
    stat: '59.6%',
    count: { th: '34 คน', en: '34 respondents' },
    title: {
      th: 'เงินสำรองต่ำกว่า 3 เดือน และกระทบหนักหากขาดรายได้ 3 เดือน',
      en: 'Hold under 3 months of cash reserve',
    },
    detail: {
      th: 'มีเงินสำรองน้อยกว่า 3 เดือนหรือไม่แน่ใจ 59.6% และให้ระดับผลกระทบหากขาดรายได้ไว้ที่ 4–5 (มาก–มากที่สุด)',
      en: '59.6% hold under 3 months (or unsure), rating a 3-month income halt at 4–5/5 severity.',
    },
  },
  {
    id: 'tool-demand',
    stat: '63.2%',
    count: { th: '36 คน', en: '36 respondents' },
    title: {
      th: 'สนใจใช้เครื่องมือกลางช่วยประเมินความคุ้มครอง',
      en: 'Want a neutral protection assessment tool',
    },
    detail: {
      th: 'สะท้อนความต้องการพื้นที่กลางที่ไม่เร่งขาย แต่ช่วยคำนวณช่องว่างความเสี่ยงและงบประมาณอย่างตรงไปตรงมา',
      en: 'Shows clear demand for a zero-sales space that calculates protection gaps transparently.',
    },
  },
];

// Question [AV]: 8 Features requested — distinct muted editorial colors
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
    solution: { th: '360Flow บันทึกรับ-จ่าย', en: '360Flow Cashbook' },
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
    solution: { th: 'ตัววัดเงินสำรอง 360Flow', en: '360Flow Reserve Tracker' },
  },
  {
    id: 'plain-language',
    count: 21,
    pct: 36.8,
    group: 'cash',
    colorKey: 'violet',
    targetPage: 'learning',
    label: { th: 'อธิบายข้อยกเว้นและเงื่อนไขด้วยภาษาเข้าใจง่าย', en: 'Plain-Language Policy & Exclusion Guides' },
    solution: { th: 'คลังความรู้ 2 นาที', en: '2-Min Guides & Glossary' },
  },
  {
    id: 'renewal-alert',
    count: 20,
    pct: 35.1,
    group: 'risk',
    colorKey: 'rose',
    targetPage: 'risk-analysis',
    label: { th: 'แจ้งเตือนวันครบกำหนดชำระเบี้ย / ต่ออายุกรมธรรม์', en: 'Premium Due & Renewal Reminders' },
    solution: { th: 'ส่งออกปฏิทิน (.ics)', en: 'Calendar Reminder (.ics)' },
  },
];

const SHOCK_100K_COPING = [
  { id: 'credit', count: 19, pct: 33.3, colorKey: 'rose', label: { th: 'ใช้บัตรเครดิตหรือสินเชื่อ', en: 'Credit card or loan' } },
  { id: 'family', count: 15, pct: 26.3, colorKey: 'amber', label: { th: 'ขอความช่วยเหลือจากครอบครัว', en: 'Ask family / relatives' } },
  { id: 'savings', count: 12, pct: 21.1, colorKey: 'teal', label: { th: 'ใช้เงินออมของตนเอง', en: 'Use personal savings' } },
  { id: 'insurance', count: 5, pct: 8.8, colorKey: 'blue', label: { th: 'ใช้สิทธิหรือความคุ้มครองจากประกัน', en: 'Use insurance coverage' } },
  { id: 'other', count: 6, pct: 10.5, colorKey: 'violet', label: { th: 'ขายทรัพย์สิน / ไม่แน่ใจ / ผสมผสาน', en: 'Sell assets / unsure / mixed' } },
];

const TOP_FEARED_RISKS = [
  { id: 'cost-living', count: 26, pct: 45.6, colorKey: 'amber', label: { th: 'ค่าครองชีพสูงขึ้น', en: 'Rising cost of living' } },
  { id: 'job-loss', count: 26, pct: 45.6, colorKey: 'rose', label: { th: 'การตกงานหรือรายได้หยุดชะงัก', en: 'Job loss or income halt' } },
  { id: 'accident', count: 25, pct: 43.9, colorKey: 'blue', label: { th: 'ค่าใช้จ่ายจากอุบัติเหตุหรือเหตุฉุกเฉิน', en: 'Accident or emergency bills' } },
  { id: 'debt', count: 20, pct: 35.1, colorKey: 'violet', label: { th: 'ภาระหนี้สิน', en: 'Debt burden' } },
  { id: 'critical', count: 19, pct: 33.3, colorKey: 'teal', label: { th: 'โรคร้ายแรงหรือเจ็บป่วยระยะยาว', en: 'Critical or long-term illness' } },
];

const VERBATIM_VOICES = [
  {
    id: 'no-sales',
    quote: {
      th: '“อยากคุยกับคนที่ไม่เน้นขายบริการ ประกัน สินค้า (มันทำให้ไม่อยากฟัง)”',
      en: '“I want guidance from someone who isn’t pushing insurance or products to sell (sales pitches turn me off).”',
    },
    mappedTo: { th: 'ที่มาของหลักการ ไม่ขายประกัน 100%', en: 'Led to our 100% Zero-Sales Charter' },
  },
  {
    id: 'real-irr',
    quote: {
      th: '“อยากรู้ว่าเงินที่ตอบแทนเมื่อครบกำหนด เมื่อเทียบกับเงินที่ลงทุนไปคุ้มค่าแค่ไหน โดยพิจารณาจากเงินเฟ้อและ Future Value”',
      en: '“I want to see whether maturity returns are truly worth it compared to investing, factoring in inflation and Future Value.”',
    },
    mappedTo: { th: 'ที่มาของหน้าคำนวณ Invest & IRR', en: 'Led to our Invest & IRR Lab' },
  },
  {
    id: 'balanced-plan',
    quote: {
      th: '“อยากวางแผนการเงินให้มีเงินเก็บมากขึ้น และทราบว่าควรมีความคุ้มครองด้านไหนที่จำเป็นโดยไม่เป็นภาระค่าใช้จ่ายมากเกินไป”',
      en: '“I want to build savings while knowing which protection is truly necessary without overburdening my budget.”',
    },
    mappedTo: { th: 'ที่มาของ 360Flow และกรอบงบ 10–15%', en: 'Led to 360Flow + 10–15% Guardrail' },
  },
];

const CORE_PRINCIPLES = [
  {
    num: '01',
    id: 'neutral',
    title: { th: 'ไม่ขายประกัน 100%', en: 'Zero Insurance Sales' },
    desc: {
      th: 'ไม่มีการเสนอขายกรมธรรม์ ไม่เก็บเบอร์โทรหรืออีเมลเพื่อติดต่อขาย และไม่จัดอันดับบริษัทใดเป็นพิเศษ เพื่อให้เห็นคณิตศาสตร์จริงก่อนตัดสินใจเอง',
      en: 'No policy sales, no lead capture, and no sponsored brand rankings — just transparent math so you decide on your own terms.',
    },
  },
  {
    num: '02',
    id: 'pdpa',
    title: { th: 'ไม่ต้องล็อกอิน ข้อมูลอยู่ในเครื่องคุณ', en: 'No Login, Local-First Privacy' },
    desc: {
      th: 'ไม่ขอเลขบัตรประชาชน เบอร์โทร หรือบัญชีผู้ใช้ ข้อมูลรายรับ-รายจ่ายและสิทธิทั้งหมดบันทึกอยู่ในเครื่องผ่าน localStorage พร้อมสำรองเป็นไฟล์ .json ได้เอง',
      en: 'Zero accounts or personal IDs required. Every number stays on your own device via localStorage with portable .json export.',
    },
  },
  {
    num: '03',
    id: 'actuarial',
    title: { th: 'ประเมินแบบระมัดระวังตามหลักคณิตศาสตร์', en: 'Conservative Actuarial Math' },
    desc: {
      th: 'เมื่อผู้ตอบถึง 22.8% ไม่ทราบวงเงินค่ารักษาของตน ระบบจึงนับวงเงินที่ยังไม่ทราบเป็น ฿0 ไว้ก่อน เพื่อไม่ให้ประเมินความเสี่ยงต่ำกว่าความเป็นจริง',
      en: 'Because 22.8% of respondents do not know their medical limit, unknown coverage is counted as ฿0 so real gaps are never masked.',
    },
  },
];

export default function LandingAbout() {
  const { lang, t } = useLanguage();

  const [researchFilter, setResearchFilter] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);

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

  return (
    <article className="ab-editorial-sheet" aria-label="About PROTECT360 and Research Basis">
      {/* ===================================================================== */}
      {/* MASTHEAD — CLEAN PUBLICATION OPENING (MENTIONS n = 57 ONCE ONLY)      */}
      {/* ===================================================================== */}
      <header className="ab-ed-masthead">
        <div className="ab-ed-topbar">
          <div className="ab-ed-brand">
            <img src="/logo.png" alt="PROTECT360" className="ab-ed-logo" />
            <span className="ab-ed-wordmark">PROTECT360</span>
          </div>
          <span className="ab-ed-edition tabular-nums">
            {lang === 'TH'
              ? 'บันทึกที่มาและหลักฐานงานวิจัย • 2567–2569'
              : 'Background & Research Dossier • 2024–2026'}
          </span>
        </div>

        <div className="ab-ed-hero-grid">
          <div className="ab-ed-hero-copy">
            <h1 className="ab-ed-headline">
              {lang === 'TH'
                ? 'สร้างขึ้นเพื่อให้วัยเริ่มทำงาน เห็นตัวเลขจริงของความเสี่ยง — โดยไม่มีใครมาขายประกัน'
                : 'Built so First Jobbers can see the real math behind financial risk — with zero sales pressure.'}
            </h1>
            <p className="ab-ed-lead">
              {lang === 'TH'
                ? 'คนเริ่มทำงานจำนวนมากไม่ได้ละเลยเรื่องเงิน แต่ไม่มีพื้นที่กลางที่อธิบายเงินสำรอง สิทธิที่มีอยู่ และช่องว่างความคุ้มครองอย่างตรงไปตรงมา เว็บไซต์นี้จึงออกแบบขึ้นจากข้อมูลจริง 3 แหล่งร่วมกัน ได้แก่ วิจัยกรุงศรี (Gen Z Finance Survey 2568), รายงานทักษะทางการเงินของธนาคารแห่งประเทศไทย (ปี 2567 หน้า 5 และ 17) และแบบสำรวจวัยเริ่มต้นทำงานของทีม (n = 57 คน)'
                : 'Most early-career workers care about financial security, yet lack a neutral place to inspect cash buffers, existing benefits, and real protection gaps without a sales pitch. PROTECT360 synthesizes three empirical sources: Krungsri Research’s Gen Z Finance Survey 2025, the Bank of Thailand’s 2024 Financial Literacy Survey (pp. 5 & 17), and our own First Jobber survey (n = 57).'}
            </p>
          </div>

          <aside className="ab-ed-ledger tabular-nums" aria-label="Headline figures">
            <div className="ab-ed-ledger-row">
              <strong className="ab-ed-ledger-num">&gt; 75%</strong>
              <div className="ab-ed-ledger-meta">
                <span>
                  {lang === 'TH'
                    ? 'คนไทยมีเงินสำรองฉุกเฉินไม่เกิน 6 เดือน'
                    : 'Thais hold 6 months or less in emergency reserves'}
                </span>
                <small>{lang === 'TH' ? 'ธนาคารแห่งประเทศไทย, 2567 (หน้า 17)' : 'Bank of Thailand, 2024 (p. 17)'}</small>
              </div>
            </div>

            <div className="ab-ed-ledger-row">
              <strong className="ab-ed-ledger-num">61.4%</strong>
              <div className="ab-ed-ledger-meta">
                <span>
                  {lang === 'TH'
                    ? 'ไม่เคยประเมินความเพียงพอของประกันและสวัสดิการ'
                    : 'Have never assessed whether their coverage is enough'}
                </span>
                <small>{lang === 'TH' ? 'แบบสำรวจวัยเริ่มต้นทำงาน' : 'First Jobber survey'}</small>
              </div>
            </div>

            <div className="ab-ed-ledger-row">
              <strong className="ab-ed-ledger-num">63.2%</strong>
              <div className="ab-ed-ledger-meta">
                <span>
                  {lang === 'TH'
                    ? 'ต้องการเครื่องมือกลางช่วยประเมินโดยไม่เร่งขาย'
                    : 'Want a neutral tool to evaluate protection gaps'}
                </span>
                <small>{lang === 'TH' ? 'แบบสำรวจวัยเริ่มต้นทำงาน' : 'First Jobber survey'}</small>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 01. NATIONAL RESEARCH SOURCES & ATTACHED BOT PAGES (PAGE 5 -> PAGE 17) */}
      {/* ===================================================================== */}
      <section id="ab-block-origins" className="ab-ed-section" aria-labelledby="ab-sec-origins">
        <div className="ab-ed-section-head">
          <span className="ab-ed-sec-num tabular-nums">01</span>
          <div className="ab-ed-sec-title-wrap">
            <h2 id="ab-sec-origins" className="ab-ed-sec-title">
              {lang === 'TH'
                ? 'รายงานและเอกสารอ้างอิงที่ทำให้เกิดเว็บไซต์นี้'
                : 'National Reports & Attached Reference Documents'}
            </h2>
            <p className="ab-ed-sec-sub">
              {lang === 'TH'
                ? 'ระบุที่มาครบถ้วนพร้อมสรุปเนื้อหาสำคัญในแต่ละเอกสาร และกดขยายดูภาพสแกนต้นฉบับหรือเปิดรายงานฉบับเต็มได้โดยตรง'
                : 'Full citations with concise summaries of what each source contains — click any attached plate to inspect full resolution.'}
            </p>
          </div>
        </div>

        {/* Lead Horizontal Reference: Krungsri Research Gen Z 2025 */}
        <div className="ab-ed-lead-doc">
          <div className="ab-ed-lead-doc-left">
            <div className="ab-ed-doc-meta tabular-nums">
              <span>{t(KRUNGSRI_ORIGIN.sourceTag)}</span>
              <span>·</span>
              <span>{t(KRUNGSRI_ORIGIN.dateLabel)}</span>
            </div>
            <h3 className="ab-ed-doc-title">{t(KRUNGSRI_ORIGIN.title)}</h3>
            <p className="ab-ed-doc-citation">{t(KRUNGSRI_ORIGIN.citation)}</p>
            <a
              href={KRUNGSRI_ORIGIN.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ab-ed-text-link"
            >
              <span>{t(KRUNGSRI_ORIGIN.ctaLabel)}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="ab-ed-lead-doc-right">
            <h4 className="ab-ed-subhead">
              {lang === 'TH' ? 'ในบทความนี้พาไปดูอะไร' : 'What this article covers'}
            </h4>
            <ul className="ab-ed-list">
              {KRUNGSRI_ORIGIN.whatInside.map((pt, i) => (
                <li key={i}>{t(pt)}</li>
              ))}
            </ul>
            <p className="ab-ed-note">{t(KRUNGSRI_ORIGIN.whyLedToApp)}</p>
          </div>
        </div>

        {/* Attached BOT 2567 Plates: Page 5 first, then Page 17 */}
        <div className="ab-ed-plates-grid">
          {BOT_PLATES.map((doc) => (
            <div key={doc.id} className="ab-ed-plate">
              <div className="ab-ed-plate-head">
                <span className="ab-ed-plate-label">{t(doc.pageLabel)}</span>
                <span className="ab-ed-plate-source">{t(doc.sourceTag)}</span>
              </div>

              <button
                type="button"
                id={`ab-preview-${doc.id}`}
                className="ab-ed-plate-frame"
                onClick={() => setPreviewDoc(doc)}
                aria-label={
                  lang === 'TH'
                    ? `ขยายดูภาพเอกสาร ${t(doc.title)}`
                    : `Zoom attached scan: ${t(doc.title)}`
                }
              >
                <img
                  src={doc.imageUrl}
                  alt={t(doc.imageCaption)}
                  className="ab-ed-plate-img"
                  loading="lazy"
                />
                <span className="ab-ed-plate-zoom">
                  <Maximize2 size={13} aria-hidden="true" />
                  <span>{lang === 'TH' ? 'ขยายดูเต็มจอ' : 'Inspect full page'}</span>
                </span>
              </button>

              <div className="ab-ed-plate-body">
                <h3 className="ab-ed-plate-title">{t(doc.title)}</h3>
                <p className="ab-ed-doc-citation">{t(doc.citation)}</p>

                <h4 className="ab-ed-subhead">
                  {lang === 'TH' ? 'ในเอกสารหน้านี้พาไปดูอะไร' : 'What this page shows'}
                </h4>
                <ul className="ab-ed-list">
                  {doc.whatInside.map((pt, i) => (
                    <li key={i}>{t(pt)}</li>
                  ))}
                </ul>

                <p className="ab-ed-note">{t(doc.whyLedToApp)}</p>

                <div className="ab-ed-plate-links">
                  <button
                    type="button"
                    className="ab-ed-inline-btn"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <Maximize2 size={13} aria-hidden="true" />
                    <span>{lang === 'TH' ? 'ดูภาพเอกสารแนบ' : 'View scan'}</span>
                  </button>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ab-ed-text-link"
                  >
                    <span>{t(doc.ctaLabel)}</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 02. PRIMARY SURVEY FINDINGS — CLEAN SEPARATED EDITORIAL BLOCKS        */}
      {/* ===================================================================== */}
      <section id="ab-block-survey" className="ab-ed-section" aria-labelledby="ab-sec-survey">
        <div className="ab-ed-section-head">
          <span className="ab-ed-sec-num tabular-nums">02</span>
          <div className="ab-ed-sec-title-wrap">
            <h2 id="ab-sec-survey" className="ab-ed-sec-title">
              {lang === 'TH'
                ? 'ภาพจริงจากแบบสำรวจวัยเริ่มต้นทำงาน'
                : 'Primary Survey Findings Among First Jobbers'}
            </h2>
            <p className="ab-ed-sec-sub">
              {lang === 'TH'
                ? 'ตัวเลขจริงจากแบบสอบถามความมั่นคงทางการเงินและความคุ้มครอง (ไม่เก็บข้อมูลระบุตัวตน)'
                : 'Direct results from our anonymous early-career financial security and protection survey.'}
            </p>
          </div>
        </div>

        {/* 4-Column Ruled Typographic Stat Strip */}
        <div className="ab-ed-stat-strip tabular-nums">
          {KEY_RESEARCH_FINDINGS.map((item) => (
            <div key={item.id} className="ab-ed-stat-col">
              <div className="ab-ed-stat-top">
                <strong className="ab-ed-stat-num">{item.stat}</strong>
                <span className="ab-ed-stat-count">{t(item.count)}</span>
              </div>
              <h3 className="ab-ed-stat-title">{t(item.title)}</h3>
              <p className="ab-ed-stat-desc">{t(item.detail)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Companion Block 02B: 2-Column Data Charts */}
      <section className="ab-ed-subblock" aria-label="Survey breakdown charts">
        <div className="ab-ed-data-split">
          <div className="ab-ed-chart-block">
            <h3 className="ab-ed-chart-title">
              {lang === 'TH'
                ? 'หากเจอบิลฉุกเฉิน ฿100,000 ทันที กลุ่มตัวอย่างรับมืออย่างไร?'
                : 'How respondents handle an instant ฿100,000 bill'}
            </h3>
            <p className="ab-ed-chart-sub">
              {lang === 'TH'
                ? 'เกือบ 60% ต้องก่อหนี้บัตรเครดิต/สินเชื่อ หรือขอความช่วยเหลือจากครอบครัว'
                : 'Nearly 60% rely on credit/loans or family help; only 8.8% use insurance.'}
            </p>
            <div className="ab-ed-bars">
              {SHOCK_100K_COPING.map((row) => (
                <div key={row.id} className="ab-ed-bar-item">
                  <div className="ab-ed-bar-meta tabular-nums">
                    <span className="ab-ed-bar-label">{t(row.label)}</span>
                    <span className="ab-ed-bar-val">
                      <strong>{row.pct.toFixed(1)}%</strong>
                      <small>({row.count})</small>
                    </span>
                  </div>
                  <div className="ab-ed-track" aria-hidden="true">
                    <div
                      className={`ab-ed-fill tone-${row.colorKey}`}
                      style={{ width: `${Math.min(100, (row.pct / 38) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-ed-chart-block">
            <h3 className="ab-ed-chart-title">
              {lang === 'TH'
                ? '5 ความเสี่ยงทางการเงินที่วัยเริ่มทำงานกังวลมากที่สุด'
                : 'Top 5 financial & life risks feared most (top 3 multi-select)'}
            </h3>
            <p className="ab-ed-chart-sub">
              {lang === 'TH'
                ? 'ค่าครองชีพ การขาดรายได้ และอุบัติเหตุฉุกเฉิน ครองอันดับ 1–3 ใกล้เคียงกัน'
                : 'Living costs, income disruption, and sudden accidents lead nearly tied.'}
            </p>
            <div className="ab-ed-bars">
              {TOP_FEARED_RISKS.map((row) => (
                <div key={row.id} className="ab-ed-bar-item">
                  <div className="ab-ed-bar-meta tabular-nums">
                    <span className="ab-ed-bar-label">{t(row.label)}</span>
                    <span className="ab-ed-bar-val">
                      <strong>{row.pct.toFixed(1)}%</strong>
                      <small>({row.count})</small>
                    </span>
                  </div>
                  <div className="ab-ed-track" aria-hidden="true">
                    <div
                      className={`ab-ed-fill tone-${row.colorKey}`}
                      style={{ width: `${Math.min(100, (row.pct / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Companion Block 02C: Editorial Pull-Quotes Band */}
      <section className="ab-ed-subblock ab-ed-quotes-section" aria-label="Verbatim survey voices">
        <div className="ab-ed-quotes-kicker">
          {lang === 'TH'
            ? 'เสียงสะท้อนตรงจากผู้ตอบแบบสอบถาม (ไม่ระบุตัวตน)'
            : 'Selected verbatim responses (anonymized)'}
        </div>
        <div className="ab-ed-quotes-grid">
          {VERBATIM_VOICES.map((voice) => (
            <blockquote key={voice.id} className="ab-ed-quote">
              <p>{t(voice.quote)}</p>
              <footer>{t(voice.mappedTo)}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 03. FEATURE DEMAND — CLEAN NON-CLICKABLE MULTI-COLOR INFO CHART       */}
      {/* ===================================================================== */}
      <section id="ab-block-features" className="ab-ed-section" aria-labelledby="ab-sec-features">
        <div className="ab-ed-section-head split">
          <div className="ab-ed-section-head-left">
            <span className="ab-ed-sec-num tabular-nums">03</span>
            <div className="ab-ed-sec-title-wrap">
              <h2 id="ab-sec-features" className="ab-ed-sec-title">
                {lang === 'TH'
                  ? 'ฟีเจอร์ที่กลุ่มตัวอย่างอยากให้มีในแอป'
                  : 'What features did respondents ask for?'}
              </h2>
              <p className="ab-ed-sec-sub">
                {lang === 'TH'
                  ? 'จัดอันดับความต้องการจากผู้ตอบแบบสอบถาม (เลือกได้มากกว่า 1 ข้อ) แยกสีตามแต่ละหมวดหมู่เพื่อให้อ่านเปรียบเทียบได้ชัดเจน'
                  : 'Color-coded demand ranking (multi-select) arranged cleanly for quick side-by-side comparison.'}
              </p>
            </div>
          </div>

          <div className="ab-ed-tabs-wrap">
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

        <div className="ab-ed-demand-list" role="list">
          {visibleFindings.map((item, idx) => (
            <div
              key={item.id}
              id={`ab-survey-bar-${item.id}`}
              role="listitem"
              className="ab-ed-demand-row is-static"
            >
              <div className="ab-ed-demand-top">
                <div className="ab-ed-demand-left">
                  <span className="ab-ed-demand-rank tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={`ab-ed-swatch tone-${item.colorKey}`} aria-hidden="true" />
                  <strong className="ab-ed-demand-label">{t(item.label)}</strong>
                </div>

                <div className="ab-ed-demand-right tabular-nums">
                  <span className="ab-ed-demand-count">
                    {lang === 'TH' ? `${item.count} คน` : `${item.count}`}
                  </span>
                  <strong className="ab-ed-demand-pct">{item.pct.toFixed(1)}%</strong>
                </div>
              </div>

              <div className="ab-ed-demand-track" aria-hidden="true">
                <div
                  className={`ab-ed-fill tone-${item.colorKey}`}
                  style={{ width: `${Math.min(100, (item.pct / 62) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 04. THREE DESIGN PRINCIPLES — RULED EDITORIAL INDEX                   */}
      {/* ===================================================================== */}
      <section id="ab-block-principles" className="ab-ed-section" aria-labelledby="ab-sec-principles">
        <div className="ab-ed-section-head">
          <span className="ab-ed-sec-num tabular-nums">04</span>
          <div className="ab-ed-sec-title-wrap">
            <h2 id="ab-sec-principles" className="ab-ed-sec-title">
              {lang === 'TH'
                ? 'หลักการ 3 ข้อที่ PROTECT360 ยึดถือ'
                : 'Three Principles PROTECT360 Follows'}
            </h2>
            <p className="ab-ed-sec-sub">
              {lang === 'TH'
                ? 'กรอบการทำงานที่เป็นกลาง โปร่งใส และเคารพความเป็นส่วนตัวของผู้ใช้ตั้งแต่บรรทัดแรก'
                : 'Our non-negotiable standards for neutrality, local privacy, and honest math.'}
            </p>
          </div>
        </div>

        <div className="ab-ed-principles-grid">
          {CORE_PRINCIPLES.map((item) => (
            <div key={item.id} className="ab-ed-principle">
              <span className="ab-ed-principle-num tabular-nums">{item.num}</span>
              <h3 className="ab-ed-principle-title">{t(item.title)}</h3>
              <p className="ab-ed-principle-desc">{t(item.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* COLOPHON & GOVERNANCE NOTE                                            */}
      {/* ===================================================================== */}
      <footer className="ab-ed-colophon" aria-label="Governance and citations">
        <div className="ab-ed-colophon-copy">
          <strong>
            {lang === 'TH'
              ? 'หมายเหตุด้านการศึกษาและแหล่งอ้างอิง'
              : 'Educational Scope & Source Disclosure'}
          </strong>
          <p>
            {lang === 'TH'
              ? 'PROTECT360 เป็นต้นแบบแพลตฟอร์มเพื่อเสริมสร้างความรู้ทางการเงินและการจัดการความเสี่ยงเท่านั้น ไม่มีการเสนอขายกรมธรรม์หรือรับค่านายหน้า อ้างอิงหลักฐานจาก (1) วิจัยกรุงศรี: Gen Z Finance Survey 2025, (2) รายงานผลสำรวจทักษะทางการเงินของไทย ปี 2567 โดยธนาคารแห่งประเทศไทยและสำนักงานสถิติแห่งชาติ (หน้า 5 และ 17) และ (3) แบบสอบถามวัยเริ่มต้นทำงาน ข้อมูลการเงินของผู้ใช้เก็บในเครื่อง 100% ตามหลัก PDPA'
              : 'PROTECT360 is an educational decision-support prototype with zero brokerage or policy sales. Grounded in (1) Krungsri Research Gen Z Finance Survey 2025, (2) Bank of Thailand & NSO 2024 Financial Literacy Survey (pp. 5 & 17), and (3) our anonymous First Jobber survey. All user inputs stay 100% local on device.'}
          </p>
        </div>

        <a
          href="https://www.oic.or.th/th"
          target="_blank"
          rel="noopener noreferrer"
          className="ab-ed-text-link ab-ed-colophon-link"
        >
          <span>{lang === 'TH' ? 'สำนักงาน คปภ. (สายด่วน 1186)' : 'OIC Thailand (Hotline 1186)'}</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </footer>

      {/* Full-Resolution Attached Document Lightbox */}
      {previewDoc && previewDoc.imageUrl && (
        <div
          className="ab-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={t(previewDoc.title)}
          onClick={() => setPreviewDoc(null)}
        >
          <div className="ab-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ab-lightbox-head">
              <div className="ab-lightbox-title-group">
                <span className="ab-lightbox-source">{t(previewDoc.sourceTag)}</span>
                <h3>{t(previewDoc.title)}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPreviewDoc(null)}
                aria-label="Close document preview"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ab-lightbox-body">
              <img
                src={previewDoc.imageUrl}
                alt={t(previewDoc.imageCaption)}
                className="ab-lightbox-img"
              />
              <p className="ab-lightbox-citation">{t(previewDoc.citation)}</p>
            </div>

            <div className="ab-lightbox-foot">
              <a
                href={previewDoc.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-soft-gray ab-origin-btn"
              >
                <span>{lang === 'TH' ? 'เปิดไฟล์ภาพเต็มจอในแท็บใหม่' : 'Open Raw Image'}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a
                href={previewDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-gradient ab-origin-btn"
              >
                <span>{t(previewDoc.ctaLabel)}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookMarked,
  Calculator,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Landmark,
  Lock,
  Maximize2,
  MessageSquareQuote,
  Scale,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useLanguage } from '../context/LanguageContext';
import LiquidTabs from '../components/LiquidTabs';

// =============================================================================
// MACRO RESEARCH ORIGINS — NATIONAL REPORTS THAT INSPIRED PROTECT360
// 1) Krungsri Research: Gen Z Finance Survey 2025 (12 June 2025, n = 426)
// 2) Bank of Thailand (BOT) & NSO: Financial Literacy & Inclusion Survey 2567
//    - Page 17: Section 1.3.1 Emergency Savings
//    - Page 5: Deposit Services & Credit Usage
// =============================================================================

const BOT_2567_PDF_URL =
  'https://www.bot.or.th/content/dam/bot/documents/th/research-and-publications/reports/financial-access-survey-of-thai-household/fl-fi-hh-survey-report-2024-th.pdf';

const ORIGIN_REFERENCES = [
  {
    id: 'krungsri-genz-2025',
    kind: 'web',
    tone: 'amber',
    sourceTag: {
      th: 'วิจัยกรุงศรี (Krungsri Research)',
      en: 'Krungsri Research (Bank of Ayudhya)',
    },
    title: {
      th: 'Gen Z Finance Survey: เจาะพฤติกรรมการเงินคนรุ่นใหม่ (2568)',
      en: 'Gen Z Finance Survey: Inside Gen Z’s Money Mindset (2025)',
    },
    citation: {
      th: 'ที่มา: วิจัยกรุงศรี, ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน) • เผยแพร่ 12 มิถุนายน 2568 • สำรวจคนรุ่นใหม่ Gen Z อายุ 18–30 ปี จำนวน 426 คน (ช่วง ก.พ.–มี.ค. 2568)',
      en: 'Source: Krungsri Research, Bank of Ayudhya PCL • Published June 12, 2025 • Online survey of 426 Thai Gen Z participants aged 18–30 (Feb–Mar 2025).',
    },
    whatInside: [
      {
        th: 'โครงสร้างรายได้และการออมของวัยเริ่มทำงาน (อายุ 23–26 ปี รายได้เฉลี่ย ฿25,826/ด. • กว่า 9 ใน 10 รายได้ต่ำกว่า ฿50,000/ด.)',
        en: 'Income & saving habits of First Jobbers (ages 23–26 average ฿25,826/mo; over 9 in 10 earn under ฿50,000/mo).',
      },
      {
        th: 'ความกังวลหลักของคนรุ่นใหม่: ค่าครองชีพสูง (69%), เงินเก็บไม่พอยามฉุกเฉิน (~50%) และค่าใช้จ่ายด้านสุขภาพ/การรักษาพยาบาลติด 5 อันดับแรก',
        en: 'Top financial worries: rising living costs (69%), insufficient emergency funds (~50%), and healthcare costs in the top 5.',
      },
      {
        th: 'เป้าหมายการออมอันดับ 1 คือ “ออมเผื่อฉุกเฉิน” (67.6%) โดย 88% อยากเริ่มออมตั้งแต่เนิ่น ๆ และ 86% ไม่อยากแบกหนี้ก้อนใหญ่ระยะยาว',
        en: '#1 savings goal is emergency reserves (67.6%), with 88% wanting to save early and 86% avoiding heavy long-term debt.',
      },
    ],
    whyLedToApp: {
      th: 'จุดประกายให้สร้างพื้นที่กลางที่วางระบบเงินสำรอง + ป้องกันค่ารักษาพยาบาลสำหรับวัยเริ่มทำงานโดยไม่ผลักภาระหนี้หรือเร่งขาย',
      en: 'Inspired a neutral platform helping First Jobbers build emergency reserves and healthcare protection without sales pressure.',
    },
    url: 'https://www.krungsri.com/th/research/research-intelligence/gen-z-finance-survey-2025',
    ctaLabel: {
      th: 'เปิดอ่านบทความวิจัยกรุงศรี (ฉบับเต็ม)',
      en: 'Read Full Krungsri Research Article',
    },
  },
  {
    id: 'bot-2567-p17',
    kind: 'image',
    tone: 'blue',
    sourceTag: {
      th: 'ธนาคารแห่งประเทศไทย (ธปท.) • หน้า 17',
      en: 'Bank of Thailand (BOT) • Page 17',
    },
    title: {
      th: 'รายงานผลสำรวจทักษะทางการเงิน ปี 2567 — หัวข้อ 1.3.1 การออมเผื่อฉุกเฉิน',
      en: 'Thailand Financial Literacy Survey 2024 — Sec. 1.3.1 Emergency Savings',
    },
    citation: {
      th: 'ที่มา: ธนาคารแห่งประเทศไทย (ธปท.) ร่วมกับสำนักงานสถิติแห่งชาติ • รายงานผลสำรวจทักษะทางการเงินของไทย และระดับการเข้าถึงบริการทางการเงินภาคครัวเรือน ปี 2567 • หน้า 17',
      en: 'Source: Bank of Thailand (BOT) & National Statistical Office • Financial Literacy & Household Financial Access Survey 2024 • Page 17.',
    },
    imageUrl: '/references/bot-2567-p17-emergency-savings.jpg',
    imageCaption: {
      th: 'เอกสารแนบหน้า 17: กราฟสัดส่วนการเก็บออมเผื่อฉุกเฉินของคนไทยปี 2563–2567 แยกตามอายุและอาชีพ',
      en: 'Attached Page 17: Thai emergency savings ratios (2020–2024) broken down by age & occupation.',
    },
    whatInside: [
      {
        th: 'กราฟเปรียบเทียบสัดส่วนเงินสำรองฉุกเฉินของคนไทยปี 2563, 2565 และ 2567 — พบว่ากว่า 75% ของคนไทยมีเงินสำรองใช้จ่ายได้ไม่เกิน 6 เดือน',
        en: '2020–2024 emergency savings chart showing over 75% of Thai people hold 6 months or less of emergency reserves.',
      },
      {
        th: 'เจาะตัวเลขปี 2567: มีเงินสำรองน้อยกว่า 1 เดือนถึง 20.8% และไม่ทราบ/ไม่แน่ใจอีก 22.4% (มีเกิน 6 เดือนเพียง 23.7%)',
        en: '2024 breakdown: 20.8% hold under 1 month of cash and 22.4% are unsure (only 23.7% hold more than 6 months).',
      },
      {
        th: 'กราฟแยกตามมิติอายุและอาชีพชี้ชัดว่ากลุ่มวัยรุ่น–เด็กจบใหม่ (15–30 ปี), ลูกจ้างเอกชน และอาชีพอิสระ เปราะบางที่สุดเมื่อขาดรายได้กะทันหัน',
        en: 'Age & occupation breakdown highlighting youth/new grads (15–30), private employees, and freelancers as most vulnerable.',
      },
    ],
    whyLedToApp: {
      th: 'ที่มาของเกณฑ์วัดเงินสำรองฉุกเฉิน 3–6 เดือนใน SmartLog และโหมดจำลองภาวะขาดรายได้ใน Survival Lab',
      en: 'Directly shaped our 3–6 month Emergency Runway gauge in SmartLog and income-shock scenarios in Survival Lab.',
    },
    url: BOT_2567_PDF_URL,
    ctaLabel: {
      th: 'เปิดรายงาน ธปท. ฉบับเต็ม (PDF)',
      en: 'Open Official BOT Report (PDF)',
    },
  },
  {
    id: 'bot-2567-p05',
    kind: 'image',
    tone: 'teal',
    sourceTag: {
      th: 'ธนาคารแห่งประเทศไทย (ธปท.) • หน้า 5',
      en: 'Bank of Thailand (BOT) • Page 5',
    },
    title: {
      th: 'รายงานผลสำรวจทักษะทางการเงิน ปี 2567 — การใช้บริการเงินฝากและสินเชื่อ',
      en: 'Thailand Financial Literacy Survey 2024 — Deposits & Credit Usage',
    },
    citation: {
      th: 'ที่มา: ธนาคารแห่งประเทศไทย (ธปท.) ร่วมกับสำนักงานสถิติแห่งชาติ • รายงานผลสำรวจทักษะทางการเงินของไทย และระดับการเข้าถึงบริการทางการเงินภาคครัวเรือน ปี 2567 • หน้า 5',
      en: 'Source: Bank of Thailand (BOT) & National Statistical Office • Financial Literacy & Household Financial Access Survey 2024 • Page 5.',
    },
    imageUrl: '/references/bot-2567-p05-deposit-credit.jpg',
    imageCaption: {
      th: 'เอกสารแนบหน้า 5: อินโฟกราฟิกผลของการแยกบัญชีเพื่อออม (เพิ่มโอกาสมีเงินสำรอง ~3 เท่า) และพฤติกรรมเมื่อเงินไม่พอใช้',
      en: 'Attached Page 5: Infographic on dedicated savings accounts (~3x higher 6-mo reserves) & coping when cash falls short.',
    },
    whatInside: [
      {
        th: 'ช่องว่างสำคัญ: คนไทย 96.1% มีบัญชีเงินฝาก (91.9% ใช้จ่ายรายวัน) แต่มีเพียง 56.1% เท่านั้นที่ตั้งใจแยกบัญชีไว้เพื่อการออมโดยเฉพาะ',
        en: 'Key gap: 96.1% hold bank accounts (91.9% for daily spending), yet only 56.1% maintain a dedicated savings account.',
      },
      {
        th: 'หลักฐานชี้ชัดว่า “ผู้ที่มีบัญชีเพื่อออมโดยเฉพาะ” มีโอกาสเก็บเงินสำรอง 6 เดือนขึ้นไปสูงกว่า ~3 เท่า (33% vs 11.7%) และออมเกษียณได้ตามแผนสูงกว่า ~3 เท่า (20.2% vs 6%)',
        en: 'Dedicated savers are ~3x more likely to hold 6+ months of reserves (33% vs 11.7%) and ~3x more likely to meet retirement goals (20.2% vs 6%).',
      },
      {
        th: 'สรุปวิธีรับมือเมื่อเงินไม่พอใช้ (ลดรายจ่าย → ถอนเงินออม → ขอยืมคนใกล้ตัว) และบทบาทผู้ให้บริการสินเชื่อ (SFIs 33%, ธนาคารพาณิชย์ 25.9%, Non-bank 25.5%)',
        en: 'Shows how households cope with shortfalls (cut spending → withdraw savings → borrow from family) and credit provider shares.',
      },
    ],
    whyLedToApp: {
      th: 'ที่มาของการออกแบบระบบแยก “เงินสำรองฉุกเฉิน” ออกจากเงินใช้จ่ายรายวันใน AutoKey และสอนการโอนย้ายความเสี่ยงก่อนพึ่งหนี้',
      en: 'Motivated separating liquid emergency buckets from daily cashflow in AutoKey and transferring major risks before taking debt.',
    },
    url: BOT_2567_PDF_URL,
    ctaLabel: {
      th: 'เปิดรายงาน ธปท. ฉบับเต็ม (PDF)',
      en: 'Open Official BOT Report (PDF)',
    },
  },
];

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
  const { userProfile } = useFinance();

  const [researchFilter, setResearchFilter] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);

  const displayName = (userProfile?.firstName || '').trim() || 'First Jobber';

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
              ? `สวัสดีคุณ ${displayName} • การเกิดขึ้นของเว็บไซต์ PROTECT360 เป็นผลมาจากการตกผลึกหลักฐานเชิงประจักษ์ 3 แหล่งร่วมกัน ได้แก่ รายงาน “เจาะพฤติกรรมการเงินคนรุ่นใหม่ (Gen Z Finance Survey 2025)” ของวิจัยกรุงศรี, รายงานผลสำรวจทักษะทางการเงินปี 2567 ของธนาคารแห่งประเทศไทย (ธปท.) และแบบสำรวจวัยเริ่มต้นทำงานจริง (n = 57 คน)`
              : `Hello ${displayName} • PROTECT360 was built from three converging bodies of evidence: Krungsri Research’s “Gen Z Finance Survey 2025,” the Bank of Thailand’s 2024 Financial Literacy Survey, and our primary First Jobber survey (n = 57).`}
          </p>

          <div className="ab-hero-source-pill">
            <FileSpreadsheet size={14} aria-hidden="true" />
            <span>
              {lang === 'TH'
                ? 'ฐานข้อมูลอ้างอิง 3 แหล่ง: รายงาน ธปท. ปี 2567 (หน้า 5 & 17) • วิจัยกรุงศรี 2568 (n = 426) • แบบสำรวจทีม (n = 57)'
                : '3 Evidence Pillars: BOT Survey 2024 (pp. 5 & 17) • Krungsri Gen Z 2025 (n = 426) • Primary Survey (n = 57)'}
            </span>
          </div>
        </div>

        <aside className="ab-hero-stats tabular-nums" aria-label="Survey headline metrics">
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">&gt; 75%</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'คนไทยมีสำรองไม่เกิน 6 ด. (ธปท. 2567)' : 'Thais ≤ 6-Mo Reserve (BOT 2024)'}
            </span>
          </div>
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">61.4%</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'ไม่เคยประเมินช่องว่างคุ้มครอง (n = 57)' : 'Never Assessed Gap (n = 57)'}
            </span>
          </div>
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">63.2%</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'ต้องการเครื่องมือกลางช่วยประเมิน' : 'Want a Neutral Assessment Tool'}
            </span>
          </div>
        </aside>
      </section>

      {/* ===================================================================== */}
      {/* 1.5 MACRO RESEARCH ORIGINS & ATTACHED OFFICIAL REPORTS                */}
      {/* ===================================================================== */}
      <section
        className="ab-origins-section"
        aria-label="National research reports that inspired PROTECT360"
      >
        <div className="ab-eco-header">
          <div>
            <div className="ab-section-kicker">
              <Landmark size={14} aria-hidden="true" />
              <span>
                {lang === 'TH'
                  ? 'RESEARCH ORIGINS • แหล่งข้อมูลและเอกสารอ้างอิงที่ทำให้เกิดเว็บไซต์นี้'
                  : 'RESEARCH ORIGINS • NATIONAL REPORTS BEHIND PROTECT360'}
              </span>
            </div>
            <h2 className="ab-section-title">
              {lang === 'TH'
                ? 'หลักฐานระดับประเทศที่เป็นแรงผลักดันในการสร้าง PROTECT360'
                : 'National Financial Studies & Attached Reference Pages'}
            </h2>
            <p className="ab-section-sub">
              {lang === 'TH'
                ? 'ระบุที่มาครบถ้วนพร้อมสรุปว่าในแต่ละเอกสารจะพาไปดูอะไร และกดเปิดดูไฟล์ภาพต้นฉบับหรือบทความฉบับเต็มได้ทันที'
                : 'Complete citations with clear guides on what each document shows — click to inspect attached BOT pages or open official reports.'}
            </p>
          </div>
        </div>

        <div className="ab-origins-grid">
          {ORIGIN_REFERENCES.map((doc) => (
            <article key={doc.id} className={`bento-card ab-origin-card tone-${doc.tone}`}>
              <div className="ab-origin-head">
                <span className={`ab-origin-tag tone-${doc.tone}`}>
                  {doc.kind === 'web' ? (
                    <BookMarked size={13} aria-hidden="true" />
                  ) : (
                    <FileText size={13} aria-hidden="true" />
                  )}
                  <span>{t(doc.sourceTag)}</span>
                </span>
              </div>

              <h3 className="ab-origin-title">{t(doc.title)}</h3>
              <p className="ab-origin-citation">{t(doc.citation)}</p>

              {doc.imageUrl && (
                <button
                  type="button"
                  id={`ab-preview-${doc.id}`}
                  className="ab-origin-thumb-btn"
                  onClick={() => setPreviewDoc(doc)}
                  aria-label={
                    lang === 'TH'
                      ? `ขยายดูภาพเอกสาร ${t(doc.title)}`
                      : `Zoom attached page: ${t(doc.title)}`
                  }
                >
                  <img
                    src={doc.imageUrl}
                    alt={t(doc.imageCaption)}
                    className="ab-origin-thumb-img"
                    loading="lazy"
                  />
                  <span className="ab-origin-zoom-chip">
                    <Maximize2 size={13} aria-hidden="true" />
                    <span>{lang === 'TH' ? 'คลิกขยายดูไฟล์หน้านี้' : 'Click to Zoom Page'}</span>
                  </span>
                </button>
              )}

              <div className="ab-origin-inside">
                <strong className="ab-origin-inside-label">
                  {lang === 'TH' ? 'ในเอกสารนี้จะพาไปดูอะไร:' : 'What this document shows:'}
                </strong>
                <ul className="ab-origin-list">
                  {doc.whatInside.map((point, idx) => (
                    <li key={idx}>{t(point)}</li>
                  ))}
                </ul>
              </div>

              <div className="ab-origin-why">
                <span>{t(doc.whyLedToApp)}</span>
              </div>

              <div className="ab-origin-actions">
                {doc.imageUrl && (
                  <button
                    type="button"
                    className="btn-soft-gray ab-origin-btn"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <Maximize2 size={14} aria-hidden="true" />
                    <span>{lang === 'TH' ? 'ดูภาพเอกสารแนบ' : 'View Attached Page'}</span>
                  </button>
                )}

                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ab-origin-btn ${doc.imageUrl ? 'btn-soft-gray' : 'btn-primary-gradient'}`}
                >
                  <span>{t(doc.ctaLabel)}</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
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
      {/* 5. EDUCATIONAL GOVERNANCE & DATA CITATION FOOTER CARD                 */}
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
                ? 'PROTECT360 เป็นต้นแบบแพลตฟอร์มเสริมสร้างความรู้ทางการเงินและช่วยตัดสินใจจัดการความเสี่ยงเพื่อการศึกษาเท่านั้น (Educational Decision-Support Prototype) อ้างอิงหลักฐานจาก (1) วิจัยกรุงศรี: Gen Z Finance Survey 2025, (2) รายงานผลสำรวจทักษะทางการเงินของไทย ปี 2567 โดยธนาคารแห่งประเทศไทยร่วมกับสำนักงานสถิติแห่งชาติ (หน้า 5 และ 17) และ (3) แบบสอบถามความมั่นคงทางการเงินวัยเริ่มต้นทำงาน (n = 57 คน, PDPA-Safe) โดยไม่มีการเสนอขายกรมธรรม์หรือรับค่านายหน้าใด ๆ'
                : 'PROTECT360 is an educational decision-support prototype grounded in (1) Krungsri Research’s Gen Z Finance Survey 2025, (2) the Bank of Thailand & NSO 2024 Financial Literacy Survey (pp. 5 & 17), and (3) our anonymous First Jobber survey (n = 57, PDPA-safe), built strictly for risk literacy with zero brokerage or policy sales.'}
            </p>
            <div className="ab-gov-checks">
              <span>
                <CheckCircle2 size={14} aria-hidden="true" />
                {lang === 'TH' ? 'อ้างอิง ธปท. 2567 + วิจัยกรุงศรี 2568 + ผลสำรวจ n = 57' : 'BOT 2024 + Krungsri 2025 + Survey (n = 57)'}
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

      {/* Full-Resolution Attached Document Preview Modal */}
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
                <ExternalLink size={14} aria-hidden="true" />
              </a>
              <a
                href={previewDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-gradient ab-origin-btn"
              >
                <span>{t(previewDoc.ctaLabel)}</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

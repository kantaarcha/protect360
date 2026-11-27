import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Gamepad2,
  LayoutGrid,
  Lock,
  RotateCcw,
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

const SURVEY_FINDINGS = [
  {
    id: 'protection-gap',
    pct: 57.9,
    group: 'risk',
    tone: 'blue',
    targetPage: 'risk-analysis',
    label: { th: 'ประเมิน Protection Gap', en: 'Evaluate Protection Gap' },
    solution: { th: 'วิเคราะห์เสี่ยง 6 ด้าน', en: '6-Pillar Risk Analysis' },
  },
  {
    id: 'recommend-coverage',
    pct: 54.4,
    group: 'risk',
    tone: 'blue',
    targetPage: 'risk-analysis',
    label: { th: 'แนะนำประกันและวงเงิน', en: 'Neutral Coverage & Limit Sizing' },
    solution: { th: 'แผนจัดลำดับความคุ้มครอง', en: 'Priority Coverage Guide' },
  },
  {
    id: 'existing-benefits',
    pct: 52.6,
    group: 'risk',
    tone: 'teal',
    targetPage: 'overview',
    label: { th: 'รวบรวม/เช็กสวัสดิการเดิม', en: 'Consolidate Existing Benefits' },
    solution: { th: 'บัตรสิทธิภาพรวม (My Coverage)', en: 'Overview Coverage Cards' },
  },
  {
    id: 'budget-premium',
    pct: 49.1,
    group: 'cash',
    tone: 'teal',
    targetPage: 'smartlog',
    label: { th: 'วางแผนงบฯ และเบี้ยประกัน', en: 'Plan Budget & Premium Guardrails' },
    solution: { th: 'AutoKey บันทึกรับ-จ่าย', en: 'AutoKey Cashbook' },
  },
  {
    id: 'compare-value',
    pct: 43.9,
    group: 'cash',
    tone: 'blue',
    targetPage: 'invest',
    label: { th: 'เปรียบเทียบเบี้ยและความคุ้มครอง', en: 'Compare Premium vs. Value' },
    solution: { th: 'Invest & IRR Simulator', en: 'Invest & IRR Simulator' },
  },
  {
    id: 'emergency-calc',
    pct: 42.1,
    group: 'cash',
    tone: 'teal',
    targetPage: 'smartlog',
    label: { th: 'คำนวณเงินสำรองฉุกเฉิน', en: 'Calculate Emergency Runway' },
    solution: { th: 'ตัววัดเงินสำรอง SmartLog', en: 'SmartLog Reserve Tracker' },
  },
  {
    id: 'plain-language',
    pct: 36.8,
    group: 'cash',
    tone: 'indigo',
    targetPage: 'learning',
    label: { th: 'อธิบายเงื่อนไขภาษาเข้าใจง่าย', en: 'Plain-Language Policy Guides' },
    solution: { th: 'คลังความรู้ 2 นาที & แปลศัพท์', en: '2-Min Guides & Glossary' },
  },
  {
    id: 'renewal-alert',
    pct: 35.1,
    group: 'risk',
    tone: 'indigo',
    targetPage: 'risk-analysis',
    label: { th: 'แจ้งเตือนชำระเบี้ย/ต่ออายุ', en: 'Premium & Renewal Reminders' },
    solution: { th: 'ส่งออกปฏิทินเตือน (.ics)', en: 'Calendar Reminder (.ics)' },
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
      th: 'ไม่มีการขายกรมธรรม์ ไม่เก็บข้อมูลติดต่อเพื่อเสนอขาย และไม่จัดอันดับบริษัทประกันใดเป็นพิเศษ เพื่อให้ผู้ใช้เห็นตัวเลขตามหลักคณิตศาสตร์จริงก่อนตัดสินใจเอง',
      en: 'Zero policy sales, zero lead capture, and zero commercial brand rankings — empowering users with transparent, unbiased math before deciding.',
    },
  },
  {
    id: 'pdpa',
    icon: Lock,
    tone: 'teal',
    badge: { th: 'หลักที่ 02 • ความเป็นส่วนตัว', en: 'Pillar 02 • Privacy-First' },
    title: { th: 'ไม่ต้องล็อกอิน ปลอดภัยตามหลัก PDPA', en: 'Zero-Login & PDPA-Safe Local Data' },
    desc: {
      th: 'ไม่ขออีเมล เบอร์โทรศัพท์ หรือเลขบัตรประชาชน ข้อมูลการเงินทั้งหมดเก็บไว้ในเครื่องผู้ใช้ 100% ผ่าน localStorage พร้อมสำรองและย้ายเครื่องด้วยไฟล์ .json ได้เอง',
      en: 'Never collects emails, phone numbers, or national IDs. Every baht stays 100% on your device via localStorage with portable .json backup and restore.',
    },
  },
  {
    id: 'actuarial',
    icon: Calculator,
    tone: 'navy',
    badge: { th: 'หลักที่ 03 • คณิตศาสตร์ประกันภัย', en: 'Pillar 03 • Actuarial Rigor' },
    title: { th: 'ประเมินแบบระมัดระวัง (Conservative)', en: 'Conservative Actuarial Estimation' },
    desc: {
      th: 'สิทธิที่ไม่ทราบวงเงินชัดเจน เช่น ไม่ทราบวงเงินประกันกลุ่มบริษัท จะถูกนับเป็น ฿0 ไว้ก่อน เพื่อไม่ให้ประเมินช่องว่างความเสี่ยงต่ำเกินจริงก่อนเกิดเหตุฉุกเฉิน',
      en: 'Any unverified coverage (such as an unknown employer group cap) is conservatively counted as ฿0 so real protection gaps are visible before emergencies hit.',
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
    resetDemoData,
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
    if (researchFilter === 'all') return SURVEY_FINDINGS;
    return SURVEY_FINDINGS.filter((item) => item.group === researchFilter);
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
          th: 'รวมสถานะเงินสำรอง สุขภาพการเงิน และกระเป๋าบัตรสิทธิเดิมไว้ในหน้าเดียว',
          en: 'Unified dashboard of emergency runway, financial health, and existing benefit cards.',
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
          th: 'จดรับ-จ่าย สแกนสลิป ดูกราฟแท่ง/วงกลม และปฏิทินกำไรขาดทุนรายวัน',
          en: 'Daily cashbook, slip scanner, bar/donut breakdown, and daily P&L calendar.',
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
          th: 'คำนวณช่องว่างความคุ้มครองแบบระมัดระวัง พร้อมแผนลำดับและเตือนต่ออายุ .ics',
          en: 'Conservative protection gap sizing with prioritized actions and .ics reminders.',
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
          th: 'เทียบโอนเสี่ยง vs จ่ายเอง คำนวณ IRR หลังหักเงินเฟ้อ และฐานภาษีไทยจริง',
          en: 'Compare Risk Transfer vs. Self-Insure with inflation-adjusted IRR & Thai tax math.',
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
          th: 'จำลองรับมือวิกฤต 30–365 วัน ด้วยข้อมูลจริงของคุณหรือตัวละคร First Jobber',
          en: 'Simulate 30–365 days of financial shocks using your live profile or a preset persona.',
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
          th: 'บทความย่อยศัพท์กรมธรรม์ ลิงก์อ้างอิงหน่วยงานรัฐ และควิซสุ่มเฉลยละเอียด',
          en: 'Plain-language guides with official Thai links, glossary, and randomized quiz.',
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
      {/* 1. HERO BENTO SHOWCASE BANNER                                         */}
      {/* ===================================================================== */}
      <section className="ab-hero-card" aria-label="About PROTECT360 showcase">
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
                  ? 'แพลตฟอร์มโค้ชการเงินและจัดการความเสี่ยงที่เป็นกลางสำหรับ First Jobber'
                  : 'Neutral Financial & Risk-Planning Coach Platform for First Jobbers'}
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
              ? `ยินดีต้อนรับคุณ ${displayName} • สำรวจแนวคิดการออกแบบจากงานวิจัยจริง (n = 57) และระบบนิเวศทั้ง 6 โมดูลที่เชื่อมต่อกับข้อมูลของคุณแบบเรียลไทม์`
              : `Welcome, ${displayName} • Explore our research-backed design (n = 57) and 6 interconnected modules powered live by your profile.`}
          </p>

          <div className="ab-hero-actions">
            <button
              id="ab-start-risk-btn"
              type="button"
              className="ab-hero-primary-btn"
              onClick={() => onNavigate?.('risk-analysis')}
            >
              <span>
                {lang === 'TH'
                  ? 'เริ่มประเมินความเสี่ยง (Risk Analysis)'
                  : 'Start Risk Analysis'}
              </span>
              <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
            </button>

            <button
              id="ab-play-game-btn"
              type="button"
              className="ab-hero-glass-btn"
              onClick={() => onNavigate?.('game')}
            >
              <Gamepad2 size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>
                {lang === 'TH'
                  ? 'ทดลองเล่นเกมเอาตัวรอด (Survival Lab)'
                  : 'Try Survival Lab Game'}
              </span>
            </button>

            <button
              id="ab-reset-demo-btn"
              type="button"
              className="ab-hero-reset-btn"
              onClick={resetDemoData}
            >
              <RotateCcw size={14} strokeWidth={2.2} aria-hidden="true" />
              <span>
                {lang === 'TH'
                  ? 'รีเซ็ตค่าเริ่มต้นสำหรับสาธิต (Reset Demo)'
                  : 'Reset Demo Data'}
              </span>
            </button>
          </div>
        </div>

        <aside className="ab-hero-stats tabular-nums" aria-label="Platform highlights">
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">n = 57</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'เสียงสะท้อนกลุ่มตัวอย่าง' : 'First Jobber Survey'}
            </span>
          </div>
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">6</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'โมดูลเชื่อมข้อมูลสด' : 'Live Synced Modules'}
            </span>
          </div>
          <div className="ab-hero-stat-item">
            <span className="ab-hero-stat-value">0%</span>
            <span className="ab-hero-stat-label">
              {lang === 'TH' ? 'ค่านายหน้า • 100% บนเครื่อง' : 'Commission • Local PDPA'}
            </span>
          </div>
        </aside>
      </section>

      {/* ===================================================================== */}
      {/* 2. 3 CORE PILLARS OF PROTECT360                                       */}
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
      {/* 3. INTERACTIVE RESEARCH-TO-SOLUTION CHART (n = 57 SURVEY)             */}
      {/* ===================================================================== */}
      <section className="bento-card ab-research-card" aria-label="Research-backed survey findings">
        <div className="ab-section-head">
          <div className="ab-section-head-copy">
            <div className="ab-section-kicker">
              <BarChart3 size={15} aria-hidden="true" />
              <span>
                {lang === 'TH'
                  ? 'RESEARCH-TO-SOLUTION MATRIX • n = 57'
                  : 'RESEARCH-TO-SOLUTION MATRIX • n = 57'}
              </span>
            </div>
            <h2 className="ab-section-title">
              {lang === 'TH'
                ? 'ออกแบบจากเสียงสะท้อนจริงของกลุ่มตัวอย่าง (n = 57 คน)'
                : 'Research-Backed Product Design (n = 57 First Jobber Survey)'}
            </h2>
            <p className="ab-section-sub">
              {lang === 'TH'
                ? 'ทุกฟีเจอร์ใน PROTECT360 สร้างขึ้นเพื่อตอบโจทย์ปัญหาจริงจากผลสำรวจ — คลิกที่แท่งกราฟเพื่อเปิดดูฟีเจอร์จริง →'
                : 'Every feature maps directly to a real survey need — click any bar to open the live solution →'}
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
              className="ab-bar-row"
              onClick={() => onNavigate?.(item.targetPage)}
            >
              <div className="ab-bar-top">
                <div className="ab-bar-label-group">
                  <span className="ab-bar-rank tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <strong className="ab-bar-label">{t(item.label)}</strong>
                </div>

                <div className="ab-bar-right-meta tabular-nums">
                  <span className="ab-bar-solution-chip">
                    <span>{t(item.solution)}</span>
                    <ArrowRight size={12} aria-hidden="true" />
                  </span>
                  <strong className="ab-bar-pct">{item.pct.toFixed(1)}%</strong>
                </div>
              </div>

              <div className="ab-bar-track" aria-hidden="true">
                <div
                  className={`ab-bar-fill tone-${item.tone}`}
                  style={{ width: `${Math.min(100, (item.pct / 62) * 100)}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. LIVE 6-MODULE ECOSYSTEM DIRECTORY                                  */}
      {/* ===================================================================== */}
      <section className="ab-eco-section" aria-label="Live 6-module PROTECT360 ecosystem">
        <div className="ab-eco-header">
          <div>
            <h2 className="ab-section-title">
              {lang === 'TH'
                ? 'ระบบนิเวศ 6 โมดูลของ PROTECT360 (เชื่อมข้อมูลสดทั้งระบบ)'
                : 'Live 6-Module PROTECT360 Ecosystem'}
            </h2>
            <p className="ab-section-sub">
              {lang === 'TH'
                ? 'ทุกตัวเลขที่เห็นด้านล่างดึงสดจากโปรไฟล์ปัจจุบันของคุณ — กดที่การ์ดเพื่อสลับไปยังโมดูลนั้นได้ทันที'
                : 'Every status pill below updates live from your active profile — click any module card to jump straight in.'}
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
      {/* 5. EDUCATIONAL GOVERNANCE & DISCLAIMER FOOTER CARD                    */}
      {/* ===================================================================== */}
      <section
        className="bento-card ab-governance-card"
        aria-label="Educational governance and disclaimer"
      >
        <div className="ab-gov-left">
          <span className="ab-gov-icon" aria-hidden="true">
            <ShieldCheck size={21} strokeWidth={2.1} />
          </span>
          <div className="ab-gov-copy">
            <h2 className="ab-gov-title">
              {lang === 'TH'
                ? 'ธรรมาภิบาลเพื่อการศึกษา & ข้อจำกัดความรับผิดชอบ (Educational Governance)'
                : 'Educational Governance & Neutrality Disclaimer'}
            </h2>
            <p className="ab-gov-desc">
              {lang === 'TH'
                ? 'PROTECT360 เป็นต้นแบบแพลตฟอร์มเสริมสร้างความรู้ทางการเงินและช่วยตัดสินใจจัดการความเสี่ยงเพื่อการศึกษาเท่านั้น (Educational Decision-Support Prototype) ออกแบบเพื่อส่งเสริมความโปร่งใสและความเข้าใจด้านการคุ้มครองความเสี่ยงแก่ผู้บริโภคโดยไม่มีการชักชวนเสนอขายกรมธรรม์หรือรับผลประโยชน์ทางการค้าใด ๆ'
                : 'PROTECT360 is an educational financial literacy and risk-planning decision-support prototype built to promote transparent, consumer-first risk literacy with zero commercial solicitation, brokerage, or insurance sales.'}
            </p>
            <div className="ab-gov-checks">
              <span>
                <CheckCircle2 size={14} aria-hidden="true" />
                {lang === 'TH' ? 'ไม่ขายประกัน / ไม่มีค่านายหน้า' : 'Zero Sales / Zero Commission'}
              </span>
              <span>
                <CheckCircle2 size={14} aria-hidden="true" />
                {lang === 'TH' ? 'ข้อมูลเก็บในเครื่องผู้ใช้ 100% (PDPA-Safe)' : '100% Local-First Storage'}
              </span>
              <span>
                <CheckCircle2 size={14} aria-hidden="true" />
                {lang === 'TH' ? 'อ้างอิงหลักการคณิตศาสตร์ประกันภัยที่เป็นกลาง' : 'Neutral Actuarial Formulas'}
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

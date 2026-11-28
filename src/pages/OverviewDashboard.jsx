import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Info,
  Pencil,
  PiggyBank,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import { useLiquidSlider } from '../hooks/useLiquidSlider';
import { getCardHolderDisplay } from '../utils/userHelpers';
import { getCategoryIconComponent } from '../utils/categoryRegistry';
import ProtectionGapChart from '../components/ProtectionGapChart';
import CoverageModal from '../components/CoverageModal';

export default function OverviewDashboard({ onNavigate, onOpenProfile }) {
  const { lang, fontStepIdx, t } = useLanguage();
  const {
    userProfile,
    profile,
    coverages,
    transactions,
    customCategories,
    savingsRatio,
    emergencyTarget,
    emergencyRunway,
    emergencyProgress,
    selfPaidPremium,
    riskStatuses,
    removeCoverage,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [txFilter, setTxFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoverage, setEditingCoverage] = useState(null);
  const [deletingCoverage, setDeletingCoverage] = useState(null);
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoPaused, setPromoPaused] = useState(false);

  const promoSlides = useMemo(
    () => [
      {
        id: 'game',
        target: 'game',
        tone: 'indigo',
        icon: Gamepad2,
        eyebrow: { th: 'ชวนลองเล่น • Survival Lab', en: 'Play Now • Survival Lab' },
        title: {
          th: 'ลองสร้างตัวละคร Pixel แล้วไปฝ่าวิกฤต 72 เหตุการณ์ชีวิตจริง!',
          en: 'Customize Your Pixel Avatar & Survive 72 Real-Life Financial Events!',
        },
        desc: {
          th: 'เลือกเพศ ทรงผม ของแต่งตัว และตกแต่งห้องพักได้ 12 ธีม เพื่อฝึกจัดสมดุลเงินสำรอง vs ความเสี่ยงแบบสนุก ๆ',
          en: 'Pick outfits, multi-wear accessories, and 12 room themes while practicing real emergency cash vs. risk balance.',
        },
        cta: { th: 'ไปลองเล่นเกม', en: 'Play Survival Game' },
      },
      {
        id: 'smartlog',
        target: 'smartlog',
        tone: 'blue',
        icon: Wallet,
        eyebrow: { th: 'ระบบเด่น • AutoKey', en: 'Featured Tool • AutoKey' },
        title: {
          th: 'จดรายรับ-จ่ายใน 3 วินาทีด้วย AutoKey พิมพ์ภาษาคนได้เลย',
          en: 'Log Cashflow in 3 Seconds with AutoKey — Just Type Naturally',
        },
        desc: {
          th: 'พิมพ์ง่าย ๆ เช่น "กาแฟ 65" ระบบแยกหมวด สรุปปฏิทินกำไร-ขาดทุนรายวัน และอัปเดตกราฟความพร้อมให้ทันที',
          en: 'Type simple phrases like "Coffee 65" — AutoKey categorizes, plots your daily P&L calendar, and updates metrics automatically.',
        },
        cta: { th: 'เปิดใช้ AutoKey', en: 'Open AutoKey' },
      },
      {
        id: 'learning',
        target: 'learning',
        tone: 'teal',
        icon: BookOpen,
        eyebrow: { th: 'อ่านฟรี • คลังความรู้เป็นกลาง', en: 'Free Guide • Neutral Library' },
        title: {
          th: 'อ่านจบใน 2 นาที: เงินสำรอง ประกันสังคม & ช่องว่างความคุ้มครอง',
          en: '2-Minute Reads: Emergency Cash, Social Benefits & Protection Gaps',
        },
        desc: {
          th: 'สรุปภาษาคนแบบไม่ง้อศัพท์เทคนิค พร้อมคลังคำศัพท์และควิซทบทวนความรู้ ไม่มีขายประกัน 100%',
          en: 'Plain-language guides, glossary cards, and interactive literacy quizzes with zero product pitches.',
        },
        cta: { th: 'เข้าคลังความรู้', en: 'Explore Library' },
      },
      {
        id: 'about',
        target: 'about',
        tone: 'amber',
        icon: Info,
        eyebrow: { th: 'เบื้องหลังแนวคิด • About Us', en: 'Behind P360 • Our Story' },
        title: {
          th: 'รู้จักที่มาของ PROTECT360 — เว็บนี้ถูกสร้างขึ้นมาได้ยังไง?',
          en: 'How PROTECT360 Began — Built from Real Voices of Young Earners',
        },
        desc: {
          th: 'ดูแรงบันดาลใจ เสียงสะท้อนจากคนทำงานรุ่นใหม่ และหลักความโปร่งใสที่ทำให้เรามุ่งสร้างพื้นที่วางแผนที่ปลอดภัย',
          en: 'Read the real questions, user voices, and strict neutrality principles that shaped PROTECT360.',
        },
        cta: { th: 'อ่านที่มาของเรา', en: 'Read Our Story' },
      },
    ],
    []
  );

  useEffect(() => {
    if (promoPaused) return undefined;
    const timer = window.setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [promoPaused, promoSlides.length]);

  const filterSlider = useLiquidSlider(txFilter, [lang, fontStepIdx]);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (txFilter !== 'all' && tx.category !== txFilter) return false;
      if (!q) return true;
      const hay = [
        tx.title?.th,
        tx.title?.en,
        tx.note?.th,
        tx.note?.en,
        tx.categoryLabel?.th,
        tx.categoryLabel?.en,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [transactions, searchQuery, txFilter]);

  const openAddCoverage = () => {
    setEditingCoverage(null);
    setModalOpen(true);
  };

  const openEditCoverage = (cov) => {
    setEditingCoverage(cov);
    setModalOpen(true);
  };

  const targetMonths = userProfile.emergencyTargetMonths || 3;
  const cardHolderName = getCardHolderDisplay(userProfile, lang);

  const dynamicGoalTitle =
    lang === 'TH'
      ? `เป้าหมายเงินสำรอง ${targetMonths} เดือน`
      : `${targetMonths}-Month Emergency Goal`;
  const dynamicGoalTargetLabel =
    lang === 'TH' ? `เป้าหมาย ${targetMonths} เดือน` : `${targetMonths}-Month Target`;
  const dynamicGoalFormula =
    lang === 'TH'
      ? `อ้างอิงจากรายจ่าย ${formatTHB(profile.monthlyExpenses)} × ${targetMonths} เดือน`
      : `Based on ${formatTHB(profile.monthlyExpenses)} expenses × ${targetMonths} months`;

  const netMonthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
  const remainingToGoal = Math.max(0, emergencyTarget - profile.liquidEmergencyFund);
  const monthsToGoal =
    remainingToGoal === 0
      ? 0
      : netMonthlySavings > 0
        ? Math.ceil(remainingToGoal / netMonthlySavings)
        : null;

  const runwayDisplay =
    lang === 'TH'
      ? `${t('overview.runwayPrefix')} ${emergencyRunway.toFixed(2)} ${t('overview.runwayUnit')}`
      : `${emergencyRunway.toFixed(2)} ${t('overview.runwayUnit')}`;

  const getRiskBadgeText = (level) => {
    if (level === 'high') return t('overview.riskHigh');
    if (level === 'moderate') return t('overview.riskModerate');
    return t('overview.riskLow');
  };

  const getRiskDotColor = (level) => {
    if (level === 'high') return 'red';
    if (level === 'moderate') return 'amber';
    return 'green';
  };

  return (
    <>
      <div className="bento-dashboard-stack">
        {/* ================= ROW 1: FLUSH 3-COLUMN TOP BENTO ================= */}
        <div className="bento-row-top">
          {/* Col 1: Liquid Emergency Fund + 2x2 Summary Metrics */}
          <div className="bento-left-stack">
            {/* CARD 1: Bundled Liquid Emergency Fund + Emergency Goal */}
            <section className="bento-card emergency-card" aria-labelledby="emergency-fund-title">
              <div>
                <h2 id="emergency-fund-title" className="card-title">
                  {t('overview.emergencyTitle')}
                </h2>
                <p className="card-subtitle">{t('overview.emergencySub')}</p>
              </div>

              <div className="emergency-amount-row">
                <div className="hero-amount tabular-nums">
                  {formatTHB(profile.liquidEmergencyFund)}
                </div>
                <span
                  className={`warning-pill tabular-nums ${
                    emergencyRunway >= targetMonths ? 'safe' : ''
                  }`}
                >
                  <span
                    className={`status-dot ${emergencyRunway >= targetMonths ? 'green' : 'amber'}`}
                    aria-hidden="true"
                  />
                  {runwayDisplay}
                </span>
              </div>

              {/* Bundled Emergency Goal Progress (Decoupled from Recent Activities) */}
              <div className="emergency-goal-embedded">
                <div className="goal-embedded-head">
                  <div className="goal-embedded-heading">
                    <span className="goal-embedded-title">{dynamicGoalTitle}</span>
                    <span className="goal-embedded-formula">{dynamicGoalFormula}</span>
                  </div>
                  <span className="goal-pct-badge tabular-nums">{emergencyProgress}%</span>
                </div>

                <div
                  className="progress-track"
                  role="progressbar"
                  aria-valuenow={emergencyProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={dynamicGoalTitle}
                >
                  <div
                    className="progress-fill"
                    style={{ width: `${emergencyProgress}%` }}
                  />
                </div>

                <div className="goal-numbers-row tabular-nums">
                  <span className="goal-limit-text">
                    {dynamicGoalTargetLabel}: {formatTHB(emergencyTarget)}
                  </span>
                  <span className="goal-remaining-inline">
                    {t('overview.goalRemaining')}{' '}
                    <strong>{formatTHB(remainingToGoal)}</strong>
                    {monthsToGoal > 0 && (
                      <>
                        {' • '}
                        {lang === 'TH' ? `~${monthsToGoal} ด.` : `~${monthsToGoal} mo`}
                      </>
                    )}
                  </span>
                </div>

                <div className="goal-milestones-row tabular-nums">
                  {[1, 3, 6].map((mo) => {
                    const reached = emergencyRunway >= mo;
                    const isSelectedTarget = targetMonths === mo;
                    return (
                      <span
                        key={mo}
                        className={`goal-milestone-pill ${reached ? 'reached' : ''} ${
                          isSelectedTarget ? 'target' : ''
                        }`}
                      >
                        {lang === 'TH' ? `${mo} เดือน` : `${mo} mo`}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="cta-button-row">
                <button
                  id="cta-check-gap"
                  type="button"
                  className="btn-primary-gradient"
                  onClick={() => onNavigate('risk-analysis')}
                >
                  <ShieldAlert size={16} strokeWidth={2.2} />
                  <span>{t('overview.ctaGap')}</span>
                </button>
              </div>
            </section>

            {/* CARD 2: 2x2 Summary Metric Mini-Cards */}
            <section className="metrics-grid-2x2" aria-label="Monthly Financial Summary">
              {/* Income */}
              <article className="metric-mini-card">
                <div className="metric-mini-top">
                  <span className="metric-icon-badge income" aria-hidden="true">
                    <ArrowDownLeft size={18} strokeWidth={2.2} />
                  </span>
                  <span className="metric-pill-tag positive tabular-nums">
                    {profile.monthlyIncome > 0 ? '100%' : '0%'}
                  </span>
                </div>
                <div>
                  <div className="metric-mini-label">{t('overview.metricIncome')}</div>
                  <div className="metric-mini-value income tabular-nums">
                    {formatTHB(profile.monthlyIncome)}
                  </div>
                </div>
              </article>

              {/* Expenses */}
              <article className="metric-mini-card">
                <div className="metric-mini-top">
                  <span className="metric-icon-badge expense" aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={2.2} />
                  </span>
                  <span className="metric-pill-tag danger tabular-nums">
                    {profile.monthlyIncome > 0
                      ? `${Math.round((profile.monthlyExpenses / profile.monthlyIncome) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div>
                  <div className="metric-mini-label">{t('overview.metricExpenses')}</div>
                  <div className="metric-mini-value expense tabular-nums">
                    {formatTHB(profile.monthlyExpenses)}
                  </div>
                </div>
              </article>

              {/* Savings */}
              <article className="metric-mini-card">
                <div className="metric-mini-top">
                  <span className="metric-icon-badge saving" aria-hidden="true">
                    <PiggyBank size={18} strokeWidth={2.1} />
                  </span>
                  <span
                    className={`metric-pill-tag ${netMonthlySavings < 0 ? 'danger' : 'blue'} tabular-nums`}
                  >
                    {savingsRatio >= 0 ? `+${savingsRatio}%` : `${savingsRatio}%`}
                  </span>
                </div>
                <div>
                  <div className="metric-mini-label">{t('overview.metricSavings')}</div>
                  <div
                    className={`metric-mini-value ${netMonthlySavings < 0 ? 'expense' : 'saving'} tabular-nums`}
                  >
                    {formatTHB(netMonthlySavings, { showSign: netMonthlySavings < 0 })}
                  </div>
                </div>
              </article>

              {/* Self-Paid Premium */}
              <article className="metric-mini-card">
                <div className="metric-mini-top">
                  <span className="metric-icon-badge premium" aria-hidden="true">
                    <Shield size={18} strokeWidth={2.1} />
                  </span>
                  <span className="metric-pill-tag neutral tabular-nums">
                    {profile.monthlyIncome > 0
                      ? `${Math.round((selfPaidPremium / profile.monthlyIncome) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div>
                  <div className="metric-mini-label">{t('overview.metricPremium')}</div>
                  <div className="metric-mini-value tabular-nums">
                    {formatTHB(selfPaidPremium)}
                  </div>
                </div>
              </article>
            </section>
          </div>

          {/* Col 2: CARD 4 — Protection Gap Dual-Bar Comparison Chart */}
          <ProtectionGapChart />

          {/* Col 3: CARD 5 — My Coverage Cards */}
          <section
            className="bento-card coverage-card-panel"
            aria-labelledby="my-coverage-title"
          >
            <div className="card-header" style={{ marginBottom: 4 }}>
              <div>
                <h2 id="my-coverage-title" className="card-title">
                  {t('overview.cardsTitle')}
                </h2>
                <p className="card-subtitle">
                  {coverages.length} {lang === 'TH' ? 'สิทธิที่บันทึกไว้' : 'active records'}
                </p>
              </div>

              <button
                id="add-coverage-btn"
                type="button"
                className="add-pill-btn"
                onClick={openAddCoverage}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>{t('overview.addCoverage')}</span>
              </button>
            </div>

            <div
              className={`virtual-cards-stack ${coverages.length > 2 ? 'is-scrollable' : ''}`}
              aria-label={t('overview.cardsTitle')}
            >
              {coverages.length === 0 ? (
                <div className="coverage-empty-state">
                  <Shield size={24} strokeWidth={1.8} className="coverage-empty-icon" aria-hidden="true" />
                  <div className="coverage-empty-title">{t('overview.emptyCoveragesTitle')}</div>
                  <p className="coverage-empty-sub">{t('overview.emptyCoveragesSub')}</p>
                </div>
              ) : (
                coverages.map((cov) => {
                  const isUnknown = !cov.limitKnown;
                  return (
                    <div
                      key={cov.id}
                      id={`coverage-card-${cov.id}`}
                      role="button"
                      tabIndex={0}
                      className={`virtual-policy-card ${cov.theme || 'navy'}`}
                      onClick={() => openEditCoverage(cov)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openEditCoverage(cov);
                        }
                      }}
                    >
                      <div className="vcard-top">
                        <div className="vcard-provider">
                          <span className="vcard-provider-label">{t(cov.providerTag)}</span>
                          <span className="vcard-mask-inline tabular-nums">
                            {cov.cardNumberMask}
                          </span>
                        </div>
                        <div className="vcard-top-actions">
                          <span className={`vcard-status-pill ${isUnknown ? 'warn' : ''}`}>
                            <span
                              className={`status-dot ${isUnknown ? 'amber' : 'green'}`}
                              aria-hidden="true"
                            />
                            {isUnknown
                              ? t('overview.unknownLimitStatus')
                              : t('overview.activeStatus')}
                          </span>
                          <button
                            id={`delete-coverage-card-${cov.id}`}
                            type="button"
                            className="vcard-delete-btn"
                            title={t('overview.deleteCoverageBtn')}
                            aria-label={`${t('overview.deleteCoverageBtn')} ${t(cov.name)}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingCoverage(cov);
                            }}
                          >
                            <Trash2 size={13} strokeWidth={2.2} />
                          </button>
                        </div>
                      </div>

                      <div className="vcard-body">
                        <div className="vcard-name">{t(cov.name)}</div>
                        <div className="vcard-sub">{t(cov.subtitle)}</div>
                      </div>

                      <div className="vcard-footer">
                        <button
                          type="button"
                          className="vcard-holder-btn"
                          title={t('overview.editCardHolderHint')}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProfile?.('profile');
                          }}
                        >
                          <span className="vcard-holder-label">
                            {t('overview.cardHolderLabel')}
                          </span>
                          <span className="vcard-holder-name-row">
                            <span className="vcard-holder-name">{cardHolderName}</span>
                            <Pencil size={11} strokeWidth={2.3} className="vcard-holder-edit" aria-hidden="true" />
                          </span>
                        </button>

                        <span className="vcard-action-hint">
                          <span>
                            {isUnknown
                              ? t('overview.editLimitAction')
                              : t('overview.viewDetails')}
                          </span>
                          <ChevronRight size={14} strokeWidth={2.4} className="cta-chevron" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="coverage-footnote">
              <span>
                {selfPaidPremium === 0
                  ? t('overview.personalNoneNote')
                  : `${t('overview.metricPremium')}: ${formatTHB(selfPaidPremium)} ${t(
                      'overview.perMonth'
                    )}`}
              </span>
              {coverages.length > 2 && (
                <span className="coverage-scroll-hint">
                  {lang === 'TH' ? 'เลื่อนลงดูทั้งหมด ↕' : 'Scroll for more ↕'}
                </span>
              )}
            </div>
          </section>
        </div>

        {/* ================= ROW 2: FULL-WIDTH 3-COLUMN RISK STATUS STRIP ================= */}
        <section className="risk-status-strip" aria-label={t('overview.riskSectionTitle')}>
          {riskStatuses.map((risk) => (
            <button
              key={risk.id}
              id={`risk-status-${risk.id}`}
              type="button"
              className="risk-mini-card"
              onClick={() => onNavigate('risk-analysis')}
            >
              <div className="risk-mini-top">
                <span className="risk-mini-title">{t(risk.titleKey)}</span>
                <span className={`risk-badge ${risk.level}`}>
                  <span
                    className={`status-dot ${getRiskDotColor(risk.level)}`}
                    aria-hidden="true"
                  />
                  {getRiskBadgeText(risk.level)}
                </span>
              </div>
              <p className="risk-mini-desc">
                {risk.descObj ? t(risk.descObj) : t(risk.descKey)}
              </p>
              <div className="risk-mini-footer">
                <span className="card-details-link">
                  <span>{t('overview.viewDetails')}</span>
                  <ChevronRight size={13} strokeWidth={2.4} className="cta-chevron" aria-hidden="true" />
                </span>
              </div>
            </button>
          ))}
        </section>

        {/* ================= ROW 3: FULL-WIDTH RECENT ACTIVITIES ================= */}
        <section className="bento-card activities-card" aria-labelledby="recent-activities-title">
            <div className="activities-toolbar">
              <div className="activities-title-group">
                <h2 id="recent-activities-title" className="card-title activities-title-lg">
                  {t('overview.activitiesTitle')}
                </h2>
                <p className="card-subtitle activities-subtitle">
                  {lang === 'TH'
                    ? 'สรุปรายรับ รายจ่าย และเงินออมล่าสุดของคุณ'
                    : 'Your latest income, expenses, and emergency savings movements'}
                </p>
              </div>

              <div className="activities-controls">
                <div className="search-input-wrap">
                  <Search size={15} className="search-input-icon" aria-hidden="true" />
                  <input
                    id="activities-search-input"
                    type="search"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('overview.searchPlaceholder')}
                    aria-label={t('overview.searchPlaceholder')}
                  />
                </div>

                <div
                  className="filter-pills liquid-track"
                  ref={filterSlider.containerRef}
                  role="group"
                  aria-label="Filter activities"
                >
                  <span
                    className="liquid-glass-pill liquid-pill-compact"
                    style={filterSlider.indicatorStyle}
                    aria-hidden="true"
                  />
                  {[
                    { id: 'all', labelKey: 'overview.filterAll' },
                    { id: 'income', labelKey: 'overview.filterIncome' },
                    { id: 'expense', labelKey: 'overview.filterExpense' },
                    { id: 'saving', labelKey: 'overview.filterSaving' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      id={`filter-tx-${f.id}`}
                      type="button"
                      data-liquid-active={txFilter === f.id ? 'true' : undefined}
                      className={`filter-pill-btn ${txFilter === f.id ? 'active' : ''}`}
                      onClick={() => setTxFilter(f.id)}
                    >
                      {t(f.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="table-scroll desktop-activities-table">
              <table className="activities-table">
                <thead>
                  <tr>
                    <th>{t('overview.colItem')}</th>
                    <th>{t('overview.colCategory')}</th>
                    <th>{t('overview.colDate')}</th>
                    <th className="align-right">{t('overview.colAmount')}</th>
                    <th className="align-right">{t('overview.colStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-table-state">
                        {t('overview.emptySearch')}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const Icon = getCategoryIconComponent(
                        tx.iconKey,
                        tx.customIcon,
                        customCategories
                      );
                      const amountClass =
                        tx.category === 'income'
                          ? 'income'
                          : tx.category === 'saving'
                            ? 'saving'
                            : 'expense';

                      return (
                        <tr key={tx.id}>
                          <td>
                            <div className="tx-item-cell">
                              <span
                                className={`tx-icon-circle type-${amountClass}`}
                                aria-hidden="true"
                              >
                                <Icon size={17} strokeWidth={2.1} />
                              </span>
                              <div>
                                <div className="tx-name">{t(tx.title)}</div>
                                <div className="tx-note">{t(tx.note)}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="tx-cat-badge">{t(tx.categoryLabel)}</span>
                          </td>
                          <td className="tx-date tabular-nums">{t(tx.date)}</td>
                          <td className={`align-right tx-amount tabular-nums ${amountClass}`}>
                            {formatTHB(tx.amount, { showSign: true })}
                          </td>
                          <td className="align-right">
                            <span className="tx-status-cell">
                              <span
                                className={`status-dot ${
                                  tx.category === 'saving' ? 'blue' : 'green'
                                }`}
                                aria-hidden="true"
                              />
                              {t('overview.statusCompleted')}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Phone Compact Card List (<= 640px) */}
            <div className="mobile-activities-list">
              {filteredTransactions.length === 0 ? (
                <div className="empty-table-state">{t('overview.emptySearch')}</div>
              ) : (
                filteredTransactions.map((tx) => {
                  const Icon = getCategoryIconComponent(
                    tx.iconKey,
                    tx.customIcon,
                    customCategories
                  );
                  const amountClass =
                    tx.category === 'income'
                      ? 'income'
                      : tx.category === 'saving'
                        ? 'saving'
                        : 'expense';

                  return (
                    <div key={tx.id} className="mobile-tx-card">
                      <div className="mobile-tx-left">
                        <span
                          className={`tx-icon-circle type-${amountClass}`}
                          aria-hidden="true"
                        >
                          <Icon size={17} strokeWidth={2.1} />
                        </span>
                        <div className="mobile-tx-info">
                          <div className="tx-name">{t(tx.title)}</div>
                          <div className="mobile-tx-meta">
                            <span className="tx-cat-badge">{t(tx.categoryLabel)}</span>
                            <span className="tx-date tabular-nums">{t(tx.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mobile-tx-right">
                        <div className={`tx-amount tabular-nums ${amountClass}`}>
                          {formatTHB(tx.amount, { showSign: true })}
                        </div>
                        <span className="tx-status-cell">
                          <span
                            className={`status-dot ${
                              tx.category === 'saving' ? 'blue' : 'green'
                            }`}
                            aria-hidden="true"
                          />
                          {t('overview.statusCompleted')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="activities-footer">
              <span className="activities-count tabular-nums">
                {lang === 'TH'
                  ? `แสดง ${filteredTransactions.length} จาก ${transactions.length} รายการ`
                  : `Showing ${filteredTransactions.length} of ${transactions.length} items`}
              </span>
              <button
                type="button"
                className="activities-more-btn"
                onClick={() => onNavigate('smartlog')}
              >
                <span>{t('overview.viewAllActivities')}</span>
                <ChevronRight size={14} strokeWidth={2.4} className="cta-chevron" aria-hidden="true" />
              </button>
            </div>
          </section>

        {/* ================= BOTTOM: PROMO BANNER CAROUSEL (4 FEATURED MODULES) ================= */}
        {(() => {
          const activeSlide = promoSlides[promoIndex] || promoSlides[0];
          const SlideIcon = activeSlide.icon;
          const handlePrev = () =>
            setPromoIndex((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
          const handleNext = () =>
            setPromoIndex((prev) => (prev + 1) % promoSlides.length);

          return (
            <section
              className={`bento-card ov-promo-carousel tone-${activeSlide.tone}`}
              aria-label={lang === 'TH' ? 'แนะนำฟีเจอร์เด่นของ PROTECT360' : 'PROTECT360 Featured Highlights'}
              onMouseEnter={() => setPromoPaused(true)}
              onMouseLeave={() => setPromoPaused(false)}
              onFocus={() => setPromoPaused(true)}
              onBlur={() => setPromoPaused(false)}
            >
              <div className="ov-promo-main">
                <div className="ov-promo-icon-box" aria-hidden="true">
                  <SlideIcon size={24} strokeWidth={2} />
                </div>

                <div className="ov-promo-copy">
                  <span className="ov-promo-eyebrow">
                    <Sparkles size={12} aria-hidden="true" />
                    <span>{t(activeSlide.eyebrow)}</span>
                  </span>
                  <h2 className="ov-promo-title">{t(activeSlide.title)}</h2>
                  <p className="ov-promo-desc">{t(activeSlide.desc)}</p>
                </div>

                <div className="ov-promo-actions">
                  <button
                    id={`ov-promo-cta-${activeSlide.id}`}
                    type="button"
                    className="btn-primary-gradient ov-promo-cta-btn"
                    onClick={() => onNavigate && onNavigate(activeSlide.target)}
                  >
                    <span>{t(activeSlide.cta)}</span>
                    <ChevronRight size={15} strokeWidth={2.4} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="ov-promo-controls">
                <div className="ov-promo-dots" role="tablist" aria-label="Promo slides">
                  {promoSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      id={`ov-promo-dot-${slide.id}`}
                      type="button"
                      role="tab"
                      aria-selected={idx === promoIndex}
                      aria-label={t(slide.eyebrow)}
                      className={`ov-promo-dot ${idx === promoIndex ? 'active' : ''}`}
                      onClick={() => setPromoIndex(idx)}
                    />
                  ))}
                </div>

                <div className="ov-promo-arrows">
                  <button
                    id="ov-promo-prev-btn"
                    type="button"
                    className="ov-promo-arrow-btn"
                    onClick={handlePrev}
                    aria-label={lang === 'TH' ? 'สไลด์ก่อนหน้า' : 'Previous banner'}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    id="ov-promo-next-btn"
                    type="button"
                    className="ov-promo-arrow-btn"
                    onClick={handleNext}
                    aria-label={lang === 'TH' ? 'สไลด์ถัดไป' : 'Next banner'}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          );
        })()}
      </div>

      {modalOpen && (
        <CoverageModal
          editingCoverage={editingCoverage}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deletingCoverage && (
        <div
          className="modal-backdrop"
          onClick={() => setDeletingCoverage(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-coverage-dialog-title"
        >
          <div
            className="modal-dialog delete-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-dialog-icon" aria-hidden="true">
              <AlertTriangle size={22} strokeWidth={2.2} />
            </div>
            <h3 id="delete-coverage-dialog-title" className="card-title">
              {t('modal.confirmDeleteTitle')}
            </h3>
            <p className="delete-dialog-target">{t(deletingCoverage.name)}</p>
            <p className="card-subtitle" style={{ marginTop: 6 }}>
              {t('modal.confirmDeleteDesc')}
            </p>
            <div className="modal-actions" style={{ marginTop: 18 }}>
              <button
                type="button"
                className="btn-soft-gray"
                onClick={() => setDeletingCoverage(null)}
              >
                {t('modal.cancel')}
              </button>
              <button
                id="confirm-delete-dialog-btn"
                type="button"
                className="data-action-btn btn-danger-confirm"
                onClick={() => {
                  removeCoverage(deletingCoverage.id);
                  setDeletingCoverage(null);
                }}
              >
                <Trash2 size={15} strokeWidth={2.2} />
                <span>{t('modal.confirmDeleteBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

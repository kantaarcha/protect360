import { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Coffee,
  CreditCard,
  PiggyBank,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  TrainFront,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import ProtectionGapChart from '../components/ProtectionGapChart';
import CoverageModal from '../components/CoverageModal';

const TX_ICON_MAP = {
  salary: Wallet,
  housing: Building2,
  food: Coffee,
  transport: TrainFront,
  saving: PiggyBank,
};

export default function OverviewDashboard({ onNavigate }) {
  const { lang, t } = useLanguage();
  const {
    profile,
    coverages,
    transactions,
    savingsRatio,
    emergencyTarget,
    emergencyRunway,
    emergencyProgress,
    selfPaidPremium,
    riskStatuses,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [txFilter, setTxFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoverage, setEditingCoverage] = useState(null);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (txFilter !== 'all' && tx.category !== txFilter) return false;
      if (!q) return true;
      const hay = [
        tx.title.th,
        tx.title.en,
        tx.note.th,
        tx.note.en,
        tx.categoryLabel.th,
        tx.categoryLabel.en,
      ]
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
      <div className="bento-grid-3col">
        {/* ================= LEFT COLUMN (Cards 1, 2, 3) ================= */}
        <div className="bento-col-left">
          {/* CARD 1: Liquid Emergency Fund */}
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
                  emergencyRunway >= 3 ? 'safe' : ''
                }`}
              >
                <span
                  className={`status-dot ${emergencyRunway >= 3 ? 'green' : 'amber'}`}
                  aria-hidden="true"
                />
                {runwayDisplay}
              </span>
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
              <button
                id="cta-log-cashflow"
                type="button"
                className="btn-soft-gray"
                onClick={() => onNavigate('autokey')}
              >
                <Sparkles size={15} strokeWidth={2.2} />
                <span>{t('overview.ctaLog')}</span>
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
                <span className="metric-pill-tag positive tabular-nums">100%</span>
              </div>
              <div>
                <div className="metric-mini-label">{t('overview.metricIncome')}</div>
                <div className="metric-mini-value tabular-nums">
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
                <span className="metric-pill-tag neutral tabular-nums">
                  {profile.monthlyIncome > 0
                    ? `${Math.round((profile.monthlyExpenses / profile.monthlyIncome) * 100)}%`
                    : '0%'}
                </span>
              </div>
              <div>
                <div className="metric-mini-label">{t('overview.metricExpenses')}</div>
                <div className="metric-mini-value tabular-nums">
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
                <span className="metric-pill-tag positive tabular-nums">
                  +{savingsRatio}%
                </span>
              </div>
              <div>
                <div className="metric-mini-label">{t('overview.metricSavings')}</div>
                <div className="metric-mini-value tabular-nums">
                  {formatTHB(profile.monthlySavings)}
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

          {/* CARD 3: 3-Month Emergency Goal Progress */}
          <section className="bento-card goal-card" aria-labelledby="emergency-goal-title">
            <div className="goal-header-row">
              <div>
                <h2 id="emergency-goal-title" className="card-title">
                  {t('overview.goalTitle')}
                </h2>
                <p className="card-subtitle">{t('overview.goalFormula')}</p>
              </div>
              <span className="goal-pct-badge tabular-nums">{emergencyProgress}%</span>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={emergencyProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('overview.goalTitle')}
            >
              <div
                className="progress-fill"
                style={{ width: `${emergencyProgress}%` }}
              />
            </div>

            <div className="goal-numbers-row tabular-nums">
              <span className="goal-saved-text">
                {formatTHB(profile.liquidEmergencyFund)}
              </span>
              <span className="goal-limit-text">
                {t('overview.goalTargetLabel')}: {formatTHB(emergencyTarget)}
              </span>
            </div>

            <div className="goal-footer-note">
              <span>{t('overview.goalRemaining')}</span>
              <span className="goal-remaining-val tabular-nums">
                {formatTHB(Math.max(0, emergencyTarget - profile.liquidEmergencyFund))}
              </span>
            </div>
          </section>
        </div>

        {/* ================= CENTER & RIGHT WORKSPACE (Cards 4, 5, 6, 7) ================= */}
        <div className="bento-col-right-area">
          {/* TOP PAIR: Card 4 (Chart) + Card 5 (Coverage Cards) */}
          <div className="bento-top-pair">
            {/* CARD 4: Effective Available vs Needed Coverage Dual-Bar Chart */}
            <ProtectionGapChart />

            {/* CARD 5: My Coverage Cards */}
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

              <div className="virtual-cards-stack">
                {coverages.map((cov) => {
                  const isUnknown = !cov.limitKnown;
                  return (
                    <button
                      key={cov.id}
                      id={`coverage-card-${cov.id}`}
                      type="button"
                      className={`virtual-policy-card ${cov.theme || 'navy'}`}
                      onClick={() => openEditCoverage(cov)}
                    >
                      <div className="vcard-top">
                        <span className="vcard-provider">{t(cov.providerTag)}</span>
                        <span className={`vcard-status-pill ${isUnknown ? 'warn' : ''}`}>
                          <span
                            className={`status-dot ${isUnknown ? 'amber' : 'green'}`}
                            aria-hidden="true"
                          />
                          {isUnknown
                            ? t('overview.unknownLimitStatus')
                            : t('overview.activeStatus')}
                        </span>
                      </div>

                      <div className="vcard-body">
                        <div className="vcard-name">{t(cov.name)}</div>
                        <div className="vcard-sub">{t(cov.subtitle)}</div>
                      </div>

                      <div className="vcard-footer">
                        <span className="tabular-nums">{cov.cardNumberMask}</span>
                        <span className="vcard-action-hint">
                          <CreditCard size={13} />
                          {isUnknown ? t('overview.tapToUpdate') : t('overview.activeStatus')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="coverage-footnote">
                <span>
                  {selfPaidPremium === 0
                    ? t('overview.personalNoneNote')
                    : `${t('overview.metricPremium')}: ${formatTHB(selfPaidPremium)} ${t(
                        'overview.perMonth'
                      )}`}
                </span>
              </div>
            </section>
          </div>

          {/* CARD 6: 3 Compact Risk Status Mini-Cards */}
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
                <p className="risk-mini-desc">{t(risk.descKey)}</p>
              </button>
            ))}
          </section>

          {/* CARD 7: Recent Activities Table */}
          <section className="bento-card activities-card" aria-labelledby="recent-activities-title">
            <div className="activities-toolbar">
              <div>
                <h2 id="recent-activities-title" className="card-title">
                  {t('overview.activitiesTitle')}
                </h2>
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

                <div className="filter-pills" role="group" aria-label="Filter activities">
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
                      const Icon = TX_ICON_MAP[tx.iconKey] || Wallet;
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
                                className={`tx-icon-circle ${tx.iconKey}`}
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
                                  tx.category === 'saving' ? 'teal' : 'green'
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
                  const Icon = TX_ICON_MAP[tx.iconKey] || Wallet;
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
                          className={`tx-icon-circle ${tx.iconKey}`}
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
                              tx.category === 'saving' ? 'teal' : 'green'
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
          </section>
        </div>
      </div>

      {modalOpen && (
        <CoverageModal
          editingCoverage={editingCoverage}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

import { ArrowLeft, CheckCircle2, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';

export default function ModulePlaceholder({
  icon: Icon,
  roundTag,
  title,
  subtitle,
  plannedFeatures,
  onNavigate,
}) {
  const { t } = useLanguage();
  const {
    profile,
    savingsRatio,
    emergencyRunway,
    totalProtectionGap,
    coverages,
    transactions,
  } = useFinance();

  return (
    <div className="placeholder-layout">
      {/* Main Module Readiness Card */}
      <section className="bento-card placeholder-hero-card">
        <div className="round-badge">
          <Layers size={14} strokeWidth={2.2} />
          <span>
            {t(roundTag)} • {t('placeholder.readyBadge')}
          </span>
        </div>

        <div className="placeholder-module-head">
          <div className="placeholder-icon-box" aria-hidden="true">
            <Icon size={28} strokeWidth={2} />
          </div>
          <div>
            <h2 className="placeholder-heading">{t(title)}</h2>
            <p className="card-subtitle" style={{ marginTop: 4 }}>
              {t(subtitle)}
            </p>
          </div>
        </div>

        <p className="placeholder-desc">{t('placeholder.readySubtitle')}</p>

        <div>
          <h3 className="card-title" style={{ marginBottom: 12, fontSize: '0.92rem' }}>
            {t('placeholder.plannedTitle')}
          </h3>
          <div className="feature-checklist">
            {plannedFeatures.map((feat, idx) => (
              <div key={idx} className="feature-item-box">
                <CheckCircle2 size={17} className="feature-item-icon" />
                <span className="feature-item-text">{t(feat)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, paddingTop: 6 }}>
          <button
            type="button"
            className="btn-primary-gradient"
            onClick={() => onNavigate('overview')}
          >
            <ArrowLeft size={16} />
            <span>{t('placeholder.backToOverview')}</span>
          </button>
        </div>
      </section>

      {/* Right Column: Live Shared FinanceContext Verification Card */}
      <aside className="bento-card">
        <h3 className="card-title">{t('placeholder.liveContextTitle')}</h3>
        <p className="card-subtitle" style={{ marginBottom: 12 }}>
          FinanceContext.jsx • Synced
        </p>

        <div className="context-snapshot-list">
          <div className="context-row">
            <span className="context-row-label">{t('overview.metricIncome')}</span>
            <span className="context-row-val tabular-nums">
              {formatTHB(profile.monthlyIncome)}
            </span>
          </div>
          <div className="context-row">
            <span className="context-row-label">{t('overview.metricExpenses')}</span>
            <span className="context-row-val tabular-nums">
              {formatTHB(profile.monthlyExpenses)}
            </span>
          </div>
          <div className="context-row">
            <span className="context-row-label">{t('overview.metricSavings')}</span>
            <span className="context-row-val tabular-nums" style={{ color: 'var(--success-text)' }}>
              {formatTHB(profile.monthlySavings)} ({savingsRatio}%)
            </span>
          </div>
          <div className="context-row">
            <span className="context-row-label">{t('overview.emergencyTitle')}</span>
            <span className="context-row-val tabular-nums">
              {formatTHB(profile.liquidEmergencyFund)} ({emergencyRunway} mo)
            </span>
          </div>
          <div className="context-row">
            <span className="context-row-label">{t('overview.totalGapLabel')}</span>
            <span className="context-row-val tabular-nums" style={{ color: 'var(--danger-text)' }}>
              {formatTHB(totalProtectionGap)}
            </span>
          </div>
          <div className="context-row">
            <span className="context-row-label">{t('overview.cardsTitle')}</span>
            <span className="context-row-val tabular-nums">{coverages.length}</span>
          </div>
          <div className="context-row">
            <span className="context-row-label">{t('overview.activitiesTitle')}</span>
            <span className="context-row-val tabular-nums">{transactions.length}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';

export default function ProtectionGapChart() {
  const { t } = useLanguage();
  const {
    protectionComparison,
    hasUnknownCoverage,
    totalProtectionGap,
  } = useFinance();

  const [selectedId, setSelectedId] = useState(protectionComparison[0]?.id || 'medical');

  const maxRaw = Math.max(
    900000,
    ...protectionComparison.map((item) => Math.max(item.needed, item.effectiveAvailable))
  );
  // Round ceiling cleanly to nearest 300k for legible actuarial axis ticks
  const yMax = Math.ceil(maxRaw / 300000) * 300000;
  const ticks = [yMax, Math.round((yMax * 2) / 3), Math.round(yMax / 3), 0];

  const activeCategory =
    protectionComparison.find((c) => c.id === selectedId) || protectionComparison[0];

  const formatAxisTick = (val) => {
    if (val === 0) return '฿0';
    if (val >= 1000000) return `฿${(val / 1000000).toFixed(1)}M`;
    return `฿${Math.round(val / 1000)}k`;
  };

  return (
    <section className="bento-card chart-card" aria-labelledby="protection-chart-title">
      <div className="chart-header-top">
        <div>
          <h2 id="protection-chart-title" className="card-title">
            {t('overview.chartTitle')}
          </h2>
          <p className="card-subtitle">{t('overview.chartSubtitle')}</p>
        </div>

        <div className="chart-legend-row">
          <span className="legend-item">
            <span className="legend-swatch navy" aria-hidden="true" />
            {t('overview.legendEffective')}
          </span>
          <span className="legend-item">
            <span className="legend-swatch royal" aria-hidden="true" />
            {t('overview.legendNeeded')}
          </span>
        </div>
      </div>

      {hasUnknownCoverage && (
        <div className="conservative-banner">
          <AlertCircle size={14} strokeWidth={2.2} />
          <span>{t('overview.conservativeTag')}</span>
        </div>
      )}

      {/* Dual-Bar Vertical Chart (scroll-safe on narrow phones) */}
      <div className="dual-bar-scroll">
        <div className="dual-bar-stage" role="img" aria-label={t('overview.chartTitle')}>
          <div className="y-axis-ticks tabular-nums" aria-hidden="true">
            {ticks.map((tick) => (
              <span key={tick}>{formatAxisTick(tick)}</span>
            ))}
          </div>

          <div className="bars-plot-area">
            <div className="plot-gridlines" aria-hidden="true">
              {ticks.map((tick) => (
                <div key={tick} className="plot-gridline" />
              ))}
            </div>

            {protectionComparison.map((item) => {
              const effPct = Math.min(100, (item.effectiveAvailable / yMax) * 100);
              const needPct = Math.min(100, (item.needed / yMax) * 100);
              const isSelected = activeCategory?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`bar-group-col ${isSelected ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedId(item.id)}
                  onClick={() => setSelectedId(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(item.id);
                    }
                  }}
                  aria-label={`${t(item.label)}: ${t('overview.legendEffective')} ${formatTHB(
                    item.effectiveAvailable
                  )}, ${t('overview.legendNeeded')} ${formatTHB(item.needed)}`}
                >
                  <div className="bar-pair">
                    <div
                      className={`bar-column effective ${
                        item.effectiveAvailable === 0 ? 'zero-val' : ''
                      }`}
                      style={{ height: `${Math.max(effPct, item.effectiveAvailable === 0 ? 2 : 4)}%` }}
                      title={`${t('overview.legendEffective')}: ${formatTHB(item.effectiveAvailable)}`}
                    />
                    <div
                      className="bar-column needed"
                      style={{ height: `${Math.max(needPct, 5)}%` }}
                      title={`${t('overview.legendNeeded')}: ${formatTHB(item.needed)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="x-axis-labels">
            {protectionComparison.map((item) => {
              const isSelected = activeCategory?.id === item.id;
              return (
                <span
                  key={item.id}
                  className={`x-axis-label ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  {t(item.shortLabel)}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Actuarial Inspector Bar */}
      {activeCategory && (
        <div className="chart-inspector">
          <div className="inspector-left">
            <span className="inspector-title">
              {t(activeCategory.label)} ({activeCategory.coveragePct}% {t('overview.coverageRatioLabel')})
            </span>
            <span className="inspector-rationale">{t(activeCategory.rationale)}</span>
          </div>

          <div className="inspector-metrics tabular-nums">
            <div className="inspector-stat">
              <span className="inspector-stat-label">{t('overview.legendEffective')}</span>
              <span className="inspector-stat-val">{formatTHB(activeCategory.effectiveAvailable)}</span>
            </div>
            <div className="inspector-stat">
              <span className="inspector-stat-label">{t('overview.legendNeeded')}</span>
              <span className="inspector-stat-val">{formatTHB(activeCategory.needed)}</span>
            </div>
            <div className="inspector-stat">
              <span className="inspector-stat-label">{t('overview.gapLabel')}</span>
              <span className="inspector-stat-val gap">{formatTHB(activeCategory.gap)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="coverage-footnote">
        <span>{t('overview.totalGapLabel')}</span>
        <strong className="tabular-nums" style={{ color: 'var(--danger-text)' }}>
          {formatTHB(totalProtectionGap)}
        </strong>
      </div>
    </section>
  );
}

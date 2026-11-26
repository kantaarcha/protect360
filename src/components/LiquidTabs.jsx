import { useLanguage } from '../context/LanguageContext';
import { useLiquidSlider } from '../hooks/useLiquidSlider';

/**
 * Reusable gliding tab bar with soft translucent Royal-to-Teal gradient indicator.
 * Variants:
 * - 'surface': modal / card section tabs (rounded-xl shell)
 * - 'compact': pill-shaped filter / toggle tabs
 * - 'segmented': form choice controls
 */
export default function LiquidTabs({
  tabs,
  activeId,
  onChange,
  variant = 'surface',
  className = '',
  ariaLabel = 'Tabs',
  idPrefix = 'tab',
}) {
  const { lang, fontStepIdx } = useLanguage();
  const slider = useLiquidSlider(activeId, [lang, fontStepIdx, tabs.length]);

  const shellClass =
    variant === 'compact'
      ? 'liquid-tabs-compact'
      : variant === 'segmented'
        ? 'liquid-tabs-segmented liquid-segmented-shell'
        : 'liquid-tabs-surface';

  const pillClass =
    variant === 'compact'
      ? 'liquid-pill-compact'
      : variant === 'segmented'
        ? 'liquid-pill-choice'
        : 'liquid-pill-surface';

  return (
    <div
      className={`liquid-track ${shellClass} ${className}`.trim()}
      ref={slider.containerRef}
      role="tablist"
      aria-label={ariaLabel}
    >
      <span
        className={`liquid-glass-pill ${pillClass}`}
        style={slider.indicatorStyle}
        aria-hidden="true"
      />
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            id={`${idPrefix}-${tab.id}`}
            type="button"
            role="tab"
            data-liquid-active={isActive ? 'true' : undefined}
            aria-selected={isActive}
            className={`liquid-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {Icon && <Icon size={15} strokeWidth={isActive ? 2.3 : 2} aria-hidden="true" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span className="liquid-tab-badge tabular-nums">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

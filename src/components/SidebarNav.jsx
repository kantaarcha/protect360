import { useState } from 'react';
import {
  BookOpen,
  Gamepad2,
  Info,
  LayoutGrid,
  Menu,
  Settings,
  ShieldAlert,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLiquidSlider } from '../hooks/useLiquidSlider';

export const NAV_ITEMS = [
  { id: 'overview', labelKey: 'nav.overview', icon: LayoutGrid },
  { id: 'smartlog', labelKey: 'nav.smartlog', icon: Wallet },
  { id: 'risk-analysis', labelKey: 'nav.riskAnalysis', icon: ShieldAlert },
  { id: 'invest', labelKey: 'nav.invest', icon: TrendingUp },
  { id: 'game', labelKey: 'nav.game', icon: Gamepad2 },
  { id: 'learning', labelKey: 'nav.learning', icon: BookOpen },
  { id: 'about', labelKey: 'nav.about', icon: Info },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings },
];

export default function SidebarNav({ activePage, onNavigate }) {
  const { lang, fontStepIdx, t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mobilePrimary = NAV_ITEMS.slice(0, 4);
  const isMoreActive = ['game', 'learning', 'about', 'settings'].includes(activePage);
  const mobileActiveKey = isMoreActive ? 'more' : activePage;

  const desktopSlider = useLiquidSlider(activePage, [lang, fontStepIdx]);
  const mobileSlider = useLiquidSlider(mobileActiveKey, [lang, fontStepIdx]);

  const handleSelect = (id) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Desktop Slim Floating Vertical Navigation Rail (Liquid Glass Vertical Glide) */}
      <aside className="sidebar-rail" aria-label={t('nav.menuLabel')}>
        <button
          type="button"
          id="nav-brand-home"
          className="rail-brand"
          onClick={() => handleSelect('overview')}
          title="PROTECT360"
        >
          <span className="rail-brand-mark" aria-hidden="true">
            <img src="/logo.png" alt="PROTECT360" className="brand-logo-img" />
          </span>
          <span className="rail-brand-text">P360</span>
        </button>

        <nav className="rail-nav-list liquid-track" ref={desktopSlider.containerRef}>
          <span
            className="liquid-glass-pill liquid-pill-rail"
            style={desktopSlider.indicatorStyle}
            aria-hidden="true"
          />
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-desktop-${item.id}`}
                type="button"
                data-liquid-active={isActive ? 'true' : undefined}
                className={`rail-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleSelect(item.id)}
              >
                <span className="rail-nav-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={isActive ? 2.3 : 1.9} />
                </span>
                <span className="rail-nav-label">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar (Liquid Glass Horizontal Glide) */}
      <nav
        className="mobile-bottom-nav liquid-track"
        ref={mobileSlider.containerRef}
        aria-label={t('nav.menuLabel')}
      >
        <span
          className="liquid-glass-pill liquid-pill-dock"
          style={mobileSlider.indicatorStyle}
          aria-hidden="true"
        />

        {mobilePrimary.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              type="button"
              data-liquid-active={isActive ? 'true' : undefined}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleSelect(item.id)}
            >
              <Icon size={18} strokeWidth={isActive ? 2.3 : 2} />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}

        <button
          id="nav-mobile-more"
          type="button"
          data-liquid-active={isMoreActive ? 'true' : undefined}
          className={`mobile-nav-btn ${isMoreActive ? 'active' : ''}`}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={18} strokeWidth={isMoreActive ? 2.3 : 2} />
          <span>{t('nav.moreLabel')}</span>
        </button>
      </nav>

      {/* Mobile Slide-Up Full Module Drawer */}
      {drawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menuLabel')}
        >
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head" style={{ marginBottom: 4 }}>
              <div className="drawer-brand-head">
                <span className="mobile-brand-mark" aria-hidden="true">
                  <img src="/logo.png" alt="PROTECT360" className="brand-logo-img" />
                </span>
                <div>
                  <h3 className="card-title">PROTECT360</h3>
                  <p className="card-subtitle">{t('brand.tagline')}</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-drawer-grid">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`mobile-drawer-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelect(item.id)}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

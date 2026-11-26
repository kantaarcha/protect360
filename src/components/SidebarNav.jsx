import { useState } from 'react';
import {
  BookOpen,
  Gamepad2,
  Info,
  LayoutGrid,
  Menu,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NAV_ITEMS = [
  { id: 'overview', labelKey: 'nav.overview', icon: LayoutGrid },
  { id: 'autokey', labelKey: 'nav.autokey', icon: Sparkles },
  { id: 'risk-analysis', labelKey: 'nav.riskAnalysis', icon: ShieldAlert },
  { id: 'invest', labelKey: 'nav.invest', icon: TrendingUp },
  { id: 'game', labelKey: 'nav.game', icon: Gamepad2 },
  { id: 'learning', labelKey: 'nav.learning', icon: BookOpen },
  { id: 'about', labelKey: 'nav.about', icon: Info },
];

export default function SidebarNav({ activePage, onNavigate }) {
  const { t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mobilePrimary = NAV_ITEMS.slice(0, 4);

  const handleSelect = (id) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Desktop Slim Floating Vertical Navigation Rail */}
      <aside className="sidebar-rail" aria-label={t('nav.menuLabel')}>
        <button
          type="button"
          id="nav-brand-home"
          className="rail-brand"
          onClick={() => handleSelect('overview')}
          title="PROTECT360"
        >
          <span className="rail-brand-mark" aria-hidden="true">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </span>
          <span className="rail-brand-text">P360</span>
        </button>

        <nav className="rail-nav-list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-desktop-${item.id}`}
                type="button"
                className={`rail-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleSelect(item.id)}
              >
                <span className="rail-nav-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.9} />
                </span>
                <span className="rail-nav-label">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        <div className="rail-footer-badge">
          <span className="oic-mini-chip">OIC</span>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label={t('nav.menuLabel')}>
        {mobilePrimary.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              type="button"
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelect(item.id)}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}

        <button
          id="nav-mobile-more"
          type="button"
          className={`mobile-nav-btn ${
            ['game', 'learning', 'about'].includes(activePage) ? 'active' : ''
          }`}
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={18} strokeWidth={2} />
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
              <div>
                <h3 className="card-title">PROTECT360</h3>
                <p className="card-subtitle">{t('brand.tagline')}</p>
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

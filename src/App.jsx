import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  Pencil,
  PlusCircle,
  X,
} from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import SidebarNav from './components/SidebarNav';
import TopControlBar from './components/TopControlBar';
import UserProfileModal from './components/UserProfileModal';
import OverviewDashboard from './pages/OverviewDashboard';
import AutoKey from './pages/AutoKey';
import RiskAnalysis from './pages/RiskAnalysis';
import Invest from './pages/Invest';
import Game from './pages/Game';
import LearningCenter from './pages/LearningCenter';
import LandingAbout from './pages/LandingAbout';
import {
  getCardHolderDisplay,
  getGreetingText,
  getOccupationLabel,
  getProfilePillLabel,
  getUserInitials,
} from './utils/userHelpers';

const PAGE_TITLES = {
  overview: null,
  smartlog: {
    th: 'SmartLog — บันทึกรายรับ-รายจ่าย & เงินสำรองฉุกเฉิน',
    en: 'SmartLog — Cashflow & Emergency Tracker',
  },
  'risk-analysis': { th: 'วิเคราะห์ความเสี่ยง (Risk Analysis)', en: 'Risk Analysis' },
  invest: { th: 'วางแผนลงทุน (IRR) — เปรียบเทียบผลตอบแทน', en: 'Invest (IRR)' },
  game: { th: 'เล่นเกมจำลองความเสี่ยง (Risk Game)', en: 'Risk Simulator Game' },
  learning: { th: 'คลังความรู้', en: 'Learning Center' },
  about: { th: 'เกี่ยวกับเรา', en: 'About PROTECT360' },
};

function AppShellContent() {
  const [activePage, setActivePage] = useState('overview');
  const [profileModal, setProfileModal] = useState({ open: false, tab: 'profile' });
  const { lang, t } = useLanguage();
  const { userProfile, toast, dismissToast } = useFinance();

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfile = (tab = 'profile') => {
    setProfileModal({ open: true, tab });
  };

  const handleCloseProfile = () => {
    setProfileModal((prev) => ({ ...prev, open: false }));
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'smartlog':
        return <AutoKey onNavigate={handleNavigate} />;
      case 'risk-analysis':
        return <RiskAnalysis onNavigate={handleNavigate} />;
      case 'invest':
        return <Invest onNavigate={handleNavigate} />;
      case 'game':
        return <Game onNavigate={handleNavigate} />;
      case 'learning':
        return <LearningCenter onNavigate={handleNavigate} />;
      case 'about':
        return <LandingAbout onNavigate={handleNavigate} />;
      case 'overview':
      default:
        return (
          <OverviewDashboard
            onNavigate={handleNavigate}
            onOpenProfile={handleOpenProfile}
          />
        );
    }
  };

  const greetingHeading = getGreetingText(userProfile, lang);
  const cardHolderName = getCardHolderDisplay(userProfile);
  const userInitials = getUserInitials(userProfile.firstName, userProfile.lastName);
  const occupationLabel = getOccupationLabel(userProfile.occupation, lang);
  const userPillLabel = getProfilePillLabel(userProfile, lang);
  const targetMonths = userProfile.emergencyTargetMonths || 3;
  const dependentsLabel =
    lang === 'TH'
      ? `ดูแล ${userProfile.dependents >= 3 ? '3+' : userProfile.dependents} คน`
      : `${userProfile.dependents >= 3 ? '3+' : userProfile.dependents} dep.`;

  return (
    <div className="app-shell">
      <SidebarNav activePage={activePage} onNavigate={handleNavigate} />

      <main className="app-main">
        {/* Row 1: Clean, Symmetrical Utility Strip (Brand on mobile + 2 separated control groups) */}
        <div className="top-utility-row">
          <button
            type="button"
            className="mobile-brand-bar"
            onClick={() => handleNavigate('overview')}
          >
            <span className="mobile-brand-mark" aria-hidden="true">
              <img src="/logo.png" alt="PROTECT360" className="brand-logo-img" />
            </span>
            <span className="mobile-brand-name">PROTECT360</span>
            <span className="oic-mini-chip">OIC</span>
          </button>

          <TopControlBar onOpenProfile={handleOpenProfile} />
        </div>

        {/* Row 2: Elevated PROTECT360 Member Card (Overview) or Compact Subpage Header */}
        {activePage === 'overview' ? (
          <header className="member-hero-card" aria-label="Member profile overview">
            <div className="member-hero-main">
              <h1 className="member-hero-title">{greetingHeading}</h1>
              <p className="member-hero-tagline">{t('header.philosophy')}</p>

              <div className="member-hero-actions">
                <button
                  id="hero-log-cashflow-btn"
                  type="button"
                  className="hero-log-cta"
                  onClick={() => handleNavigate('smartlog')}
                >
                  <PlusCircle size={18} strokeWidth={2.3} aria-hidden="true" />
                  <span>{t('header.logCashflowCta')}</span>
                  <ChevronRight size={16} strokeWidth={2.5} className="cta-chevron" aria-hidden="true" />
                </button>
              </div>
            </div>

            <button
              id="user-profile-pill-btn"
              type="button"
              className="member-id-surface"
              onClick={() => handleOpenProfile('profile')}
              title={t('header.editProfile')}
            >
              <div className="member-id-top">
                <span className="member-id-avatar" aria-hidden="true">
                  {userInitials}
                </span>
                <div className="member-id-identity">
                  <span className="member-id-caption">{t('header.cardHolderCaption')}</span>
                  <span className="member-id-holder">{cardHolderName}</span>
                </div>
              </div>

              <div className="member-id-meta tabular-nums">
                <span className="member-meta-chip">{occupationLabel}</span>
                <span className="member-meta-chip">
                  {lang === 'TH' ? `อายุ ${userProfile.age} ปี` : `Age ${userProfile.age}`}
                </span>
                <span className="member-meta-chip">
                  {lang === 'TH' ? `เป้าสำรอง ${targetMonths} ด.` : `${targetMonths}-Mo Goal`}
                </span>
                {userProfile.dependents > 0 && (
                  <span className="member-meta-chip">{dependentsLabel}</span>
                )}
              </div>

              <div className="member-id-footer">
                <span className="member-edit-cta">
                  <Pencil size={12} strokeWidth={2.3} aria-hidden="true" />
                  <span>{t('header.editProfile')}</span>
                  <ChevronRight size={13} strokeWidth={2.4} className="cta-chevron" aria-hidden="true" />
                </span>
              </div>
            </button>
          </header>
        ) : (
          <header className="subpage-header">
            <div className="header-greeting-group">
              <div className="header-title-row">
                <h1 className="header-title">
                  {t(PAGE_TITLES[activePage] || { th: 'PROTECT360', en: 'PROTECT360' })}
                </h1>
              </div>
              <p className="header-philosophy">
                {activePage === 'smartlog'
                  ? lang === 'TH'
                    ? `${userPillLabel} • ขั้นตอนที่ 1: เข้าใจกระแสเงินสดของคุณ ก่อนวางแผนจัดการความเสี่ยง`
                    : `${userPillLabel} • Step 1: Understand Your Cashflow Before Risk Planning`
                  : t('header.philosophy')}
              </p>
            </div>

            <button
              id="user-profile-pill-btn"
              type="button"
              className="user-profile-pill"
              onClick={() => handleOpenProfile('profile')}
              title={t('header.editProfile')}
            >
              <span className="user-avatar-circle" aria-hidden="true">
                {userInitials}
              </span>
              <span className="user-pill-name">{userPillLabel}</span>
              <Pencil size={12} strokeWidth={2.3} className="user-pill-edit-icon" aria-hidden="true" />
            </button>
          </header>
        )}

        <div key={activePage} className="page-transition-stage">
          {renderActivePage()}
        </div>
      </main>

      {profileModal.open && (
        <UserProfileModal
          initialTab={profileModal.tab}
          onClose={handleCloseProfile}
        />
      )}

      {toast && (
        <div
          className={`app-toast ${toast.type || 'info'}`}
          role="status"
          aria-live="polite"
        >
          <span className="app-toast-icon" aria-hidden="true">
            {toast.type === 'success' ? (
              <CheckCircle2 size={17} strokeWidth={2.3} />
            ) : toast.type === 'error' ? (
              <AlertCircle size={17} strokeWidth={2.3} />
            ) : (
              <Info size={17} strokeWidth={2.3} />
            )}
          </span>
          <span className="app-toast-msg">{t(toast.message)}</span>
          <button
            type="button"
            className="app-toast-close"
            onClick={dismissToast}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FinanceProvider>
          <AppShellContent />
        </FinanceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

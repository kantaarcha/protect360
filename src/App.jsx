import { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  FlaskConical,
  Gamepad2,
  Info,
  Pencil,
  PlusCircle,
  RotateCcw,
  Settings,
  ShieldAlert,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FinanceProvider, formatTHB, useFinance } from './context/FinanceContext';
import SidebarNav from './components/SidebarNav';
import TopControlBar from './components/TopControlBar';
import UserProfileModal from './components/UserProfileModal';
import OnboardingFlow from './components/OnboardingFlow';
import TutorialOverlay from './components/TutorialOverlay';
import DemoVideoModal from './components/DemoVideoModal';
import ChristmasAmbience from './components/ChristmasAmbience';
import OverviewDashboard from './pages/OverviewDashboard';
import AutoKey from './pages/AutoKey';
import RiskAnalysis from './pages/RiskAnalysis';
import Invest from './pages/Invest';
import Game from './pages/Game';
import LearningCenter from './pages/LearningCenter';
import LandingAbout from './pages/LandingAbout';
import SettingsPage from './pages/SettingsPage';
import {
  getCardHolderDisplay,
  getGreetingText,
  getOccupationLabel,
  getProfilePillLabel,
  getUserInitials,
  syncReferenceHour,
} from './utils/userHelpers';
import { calculateThaiTaxImpact } from './utils/investMath';
import { inferButtonSoundKind, playUiSound, setSoundEnabled } from './utils/soundEffects';
import {
  clearAllTabTutorialStatuses,
  FULL_TUTORIAL_STEPS,
  getPageContextualSteps,
  getSavedTabTutorialStatuses,
  getSavedTutorialStatus,
  saveTabTutorialStatus,
  saveTutorialStatus,
  TAB_BANNER_META,
  TUTORIAL_UI_COPY,
} from './data/tutorialSteps';
import {
  JARGON_TERMS,
  LEARNING_ARTICLES,
  LEARNING_STORAGE_KEY,
  LITERACY_QUIZ_BANK,
} from './utils/learningData';

const ONBOARDING_STORAGE_KEY = 'protect360_onboarded_v1';

const PAGE_TITLES = {
  overview: null,
  smartlog: {
    th: 'สมุดบัญชี AutoKey',
    en: 'AutoKey Cashbook',
  },
  'risk-analysis': {
    th: 'วิเคราะห์ความเสี่ยง & ช่องว่างความคุ้มครอง',
    en: 'Risk & Protection Gap Analysis',
  },
  invest: {
    th: 'วางแผนลงทุน & คำนวณ IRR (Value Lab)',
    en: 'Invest & Value Lab (True IRR)',
  },
  game: {
    th: 'PROTECT360 Survival Lab — เกมจำลองเอาตัวรอดทางการเงิน',
    en: 'PROTECT360 Survival Lab — Financial Resilience Simulator',
  },
  learning: {
    th: 'คลังความรู้ PROTECT360 — ย่อยเรื่องเงินและความเสี่ยงใน 2 นาที',
    en: 'PROTECT360 Learning Library — 2-Minute Plain-Language Risk Guides',
  },
  about: { th: 'เกี่ยวกับเรา', en: 'About PROTECT360' },
  settings: {
    th: 'ตั้งค่า & ข้อมูลในเครื่อง',
    en: 'Settings & Local Privacy',
  },
};

function AppShellContent() {
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    try {
      return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [activePage, setActivePage] = useState('overview');
  const [profileModal, setProfileModal] = useState({ open: false, tab: 'profile' });
  const [tutorialStatus, setTutorialStatus] = useState(() => getSavedTutorialStatus());
  const [tabTutorialStatuses, setTabTutorialStatuses] = useState(() =>
    getSavedTabTutorialStatuses()
  );
  const [tutorialPromptOpen, setTutorialPromptOpen] = useState(false);
  const [demoVideoModal, setDemoVideoModal] = useState({ open: false, mode: 'replay' });
  const [tutorialTour, setTutorialTour] = useState({
    active: false,
    mode: 'full',
    targetPage: 'overview',
    steps: FULL_TUTORIAL_STEPS,
    index: 0,
  });
  const [clockState, setClockState] = useState(() => ({
    hour: new Date().getHours(),
    source: 'device',
    offsetHours: 0,
  }));

  const { lang, setLang, t, resetFontSize } = useLanguage();
  const { setTheme } = useTheme();
  const {
    userProfile,
    monthlyIncome,
    monthlyExpenses,
    emergencyFund,
    transactions,
    savingsRatio,
    emergencyRunway,
    riskAssessment,
    isDemoMode,
    resetDemoData,
    toast,
    dismissToast,
  } = useFinance();

  // Synchronize 24-hour clock (checks internet time non-blockingly, falls back cleanly to device clock)
  useEffect(() => {
    let active = true;
    let offsetHours = 0;

    syncReferenceHour().then(({ hour, source }) => {
      if (!active) return;
      const localNowHour = new Date().getHours();
      offsetHours = source === 'internet' ? hour - localNowHour : 0;
      setClockState({ hour, source, offsetHours });
    });

    const intervalId = window.setInterval(() => {
      const localHour = new Date().getHours();
      const computedHour = (((localHour + offsetHours) % 24) + 24) % 24;
      setClockState((prev) =>
        prev.hour === computedHour ? prev : { ...prev, hour: computedHour }
      );
    }, 60000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  // Subtle interactive click sound delegation (tap / chime / action) across all views
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target?.closest?.('button:not(:disabled), [role="tab"]:not([aria-disabled="true"])');
      if (!target) return;
      const kind = inferButtonSoundKind(target);
      if (kind) {
        playUiSound(kind);
      }
    };
    document.addEventListener('click', handleGlobalClick, false);
    return () => document.removeEventListener('click', handleGlobalClick, false);
  }, []);

  const handleCompleteOnboarding = () => {
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
    } catch {
      // Ignore storage access errors
    }
    setHasOnboarded(true);
    setActivePage('overview');
    if (getSavedTutorialStatus() === 'unseen') {
      setDemoVideoModal({ open: true, mode: 'gate' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTutorial = (mode = 'full', explicitPage = null) => {
    const targetPage = explicitPage || activePage;
    const steps = mode === 'page' ? getPageContextualSteps(targetPage) : FULL_TUTORIAL_STEPS;
    setTutorialPromptOpen(false);
    setTutorialTour({
      active: true,
      mode,
      targetPage,
      steps,
      index: 0,
    });
    if (mode === 'full' && steps[0]?.page && activePage !== steps[0].page) {
      setActivePage(steps[0].page);
    }
  };

  const handleDeclineTutorialPrompt = () => {
    saveTutorialStatus('skipped');
    setTutorialStatus('skipped');
    // Avoid immediately showing an overview inline banner right after declining
    setTabTutorialStatuses(saveTabTutorialStatus('overview', 'dismissed'));
    setTutorialPromptOpen(false);
  };

  const handleDismissTabBanner = (tabId) => {
    setTabTutorialStatuses(saveTabTutorialStatus(tabId, 'dismissed'));
  };

  const handleResetTabTutorials = () => {
    setTabTutorialStatuses(clearAllTabTutorialStatuses());
  };

  const handleCloseTour = () => {
    if (tutorialTour.mode === 'page' && tutorialTour.targetPage) {
      setTabTutorialStatuses(saveTabTutorialStatus(tutorialTour.targetPage, 'dismissed'));
    } else if (getSavedTutorialStatus() === 'unseen') {
      saveTutorialStatus('skipped');
      setTutorialStatus('skipped');
    }
    setTutorialTour((prev) => ({ ...prev, active: false }));
  };

  const handleCompleteTour = () => {
    if (tutorialTour.mode === 'full') {
      saveTutorialStatus('completed');
      setTutorialStatus('completed');
      setTabTutorialStatuses(saveTabTutorialStatus('overview', 'seen'));
    } else if (tutorialTour.mode === 'page' && tutorialTour.targetPage) {
      setTabTutorialStatuses(saveTabTutorialStatus(tutorialTour.targetPage, 'seen'));
    } else if (getSavedTutorialStatus() === 'unseen') {
      saveTutorialStatus('skipped');
      setTutorialStatus('skipped');
    }
    setTutorialTour((prev) => ({ ...prev, active: false }));
  };

  const handleReplayOnboarding = () => {
    setHasOnboarded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFactoryResetAll = () => {
    resetDemoData({ silent: true });
    dismissToast?.();
    setLang('TH');
    setTheme('light');
    resetFontSize();
    setSoundEnabled(true);
    clearAllTabTutorialStatuses();
    try {
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && (key.startsWith('protect360') || key === LEARNING_STORAGE_KEY)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // Ignore storage access errors
    }
    setTutorialStatus('unseen');
    setTabTutorialStatuses({});
    setTutorialPromptOpen(false);
    setDemoVideoModal({ open: false, mode: 'replay' });
    setProfileModal({ open: false, tab: 'profile' });
    setTutorialTour({
      active: false,
      mode: 'full',
      targetPage: 'overview',
      steps: FULL_TUTORIAL_STEPS,
      index: 0,
    });
    setActivePage('overview');
    setHasOnboarded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  if (!hasOnboarded) {
    return (
      <OnboardingFlow
        referenceHour={clockState.hour}
        onComplete={handleCompleteOnboarding}
      />
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'smartlog':
        return <AutoKey onNavigate={handleNavigate} />;
      case 'risk-analysis':
        return <RiskAnalysis onNavigate={handleNavigate} />;
      case 'invest':
        return <Invest key={isDemoMode ? 'demo' : 'clean'} onNavigate={handleNavigate} />;
      case 'game':
        return <Game onNavigate={handleNavigate} />;
      case 'learning':
        return <LearningCenter onNavigate={handleNavigate} />;
      case 'about':
        return <LandingAbout />;
      case 'settings':
        return (
          <SettingsPage
            referenceHour={clockState.hour}
            clockSource={clockState.source}
            onOpenProfile={handleOpenProfile}
            onReplayOnboarding={handleReplayOnboarding}
            tutorialStatus={tutorialStatus}
            onStartTutorial={handleStartTutorial}
            onResetTabTutorials={handleResetTabTutorials}
            onOpenDemoVideo={() => setDemoVideoModal({ open: true, mode: 'replay' })}
            onFactoryReset={handleFactoryResetAll}
          />
        );
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

  const greetingHeading = getGreetingText(userProfile, lang, clockState.hour);
  const cardHolderName = getCardHolderDisplay(userProfile, lang);
  const userInitials = getUserInitials(userProfile.firstName, userProfile.lastName, lang);
  const occupationLabel = getOccupationLabel(userProfile.occupation, lang);
  const userPillLabel = getProfilePillLabel(userProfile, lang);
  const targetMonths = userProfile.emergencyTargetMonths || 3;
  const dependentsLabel =
    lang === 'TH'
      ? `ดูแล ${userProfile.dependents >= 3 ? '3+' : userProfile.dependents} คน`
      : `${userProfile.dependents >= 3 ? '3+' : userProfile.dependents} dep.`;

  return (
    <div className="app-shell">
      <ChristmasAmbience />
      <SidebarNav
        activePage={activePage}
        onNavigate={handleNavigate}
        onGoWelcome={handleReplayOnboarding}
      />

      <main className="app-main">
        {/* Row 1: Clean, Symmetrical Utility Strip (Brand + Subpage Profile Pill + No Sales & Settings) */}
        <div className={`top-utility-row ${activePage !== 'overview' ? 'has-subpage-profile' : ''}`}>
          <div className="top-utility-left">
            <button
              id="mobile-brand-home-btn"
              type="button"
              className="mobile-brand-bar"
              onClick={handleReplayOnboarding}
              title={lang === 'TH' ? 'PROTECT360 • หน้าเริ่มต้นใช้งาน' : 'PROTECT360 • Welcome Screen'}
            >
              <span className="mobile-brand-mark" aria-hidden="true">
                <img src="/logo.png" alt="PROTECT360" className="brand-logo-img" />
              </span>
              <span className="mobile-brand-name">PROTECT360</span>
            </button>

            {activePage !== 'overview' && (
              <button
                id="user-profile-pill-btn"
                type="button"
                className="user-profile-pill subpage-top-profile-pill"
                onClick={() => handleOpenProfile('profile')}
                title={t('header.editProfile')}
              >
                <span className="user-avatar-circle" aria-hidden="true">
                  {userInitials}
                </span>
                <span className="user-pill-name">{userPillLabel}</span>
                <Pencil size={12} strokeWidth={2.3} className="user-pill-edit-icon" aria-hidden="true" />
              </button>
            )}
          </div>

          <TopControlBar
            activePage={activePage}
            onNavigate={handleNavigate}
            onStartTutorial={handleStartTutorial}
            onOpenDemoVideo={() => setDemoVideoModal({ open: true, mode: 'replay' })}
          />
        </div>

        {/* Active Hypothetical Sample Mode Banner — clearly labels simulated figures */}
        {isDemoMode && (
          <div
            id="demo-sample-banner"
            className="demo-sample-banner"
            role="status"
            aria-live="polite"
          >
            <div className="demo-sample-banner-copy">
              <FlaskConical size={16} strokeWidth={2.3} aria-hidden="true" />
              <span>
                <strong>
                  {lang === 'TH'
                    ? 'โหมดตัวอย่างคำนวณ:'
                    : 'Sample Preview Mode:'}
                </strong>{' '}
                {lang === 'TH'
                  ? 'ตัวเลขที่แสดงเป็นเงินและสถานการณ์สมมติเพื่อทดลองคำนวณเท่านั้น (ไม่ใช่ข้อมูลจริงของคุณ)'
                  : 'All figures shown are hypothetical money & scenario values for calculation preview only (not your real data).'}
              </span>
            </div>
            <button
              id="demo-sample-clear-btn"
              type="button"
              className="demo-sample-clear-btn"
              onClick={resetDemoData}
            >
              <RotateCcw size={13} strokeWidth={2.3} aria-hidden="true" />
              <span>
                {lang === 'TH'
                  ? 'ล้างกลับเป็น 0 เพื่อกรอกเอง'
                  : 'Clear back to 0'}
              </span>
            </button>
          </div>
        )}

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
                  {lang === 'TH'
                    ? `อายุ ${userProfile.age} ปี`
                    : `Age ${userProfile.age}`}
                </span>
                <span className="member-meta-chip">
                  {lang === 'TH'
                    ? `เป้าสำรอง ${targetMonths} ด.`
                    : `${targetMonths}-Mo Goal`}
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
        ) : activePage === 'smartlog' ? (
          <header className="bento-card smartlog-header-card" aria-label="AutoKey Cashbook">
            <div className="smartlog-header-left">
              <span className="smartlog-header-icon" aria-hidden="true">
                <Wallet size={22} strokeWidth={2.1} />
              </span>
              <div className="smartlog-header-copy">
                <h1 className="smartlog-header-title">
                  {t(PAGE_TITLES.smartlog)}
                </h1>
                <p className="smartlog-header-sub">
                  {lang === 'TH'
                    ? 'จดรับ-จ่าย สแกนสลิป และติดตามยอดเงินสำรองฉุกเฉินได้ครบในหน้าเดียว'
                    : 'Log daily cashflow, scan bank slips, and track your emergency reserve in one place.'}
                </p>
              </div>
            </div>

            <div className="smartlog-header-chips tabular-nums">
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH'
                  ? `${transactions.length} รายการในสมุดบัญชี`
                  : `${transactions.length} entries logged`}
              </span>
              <span
                className={`smartlog-stat-chip ${savingsRatio < 0 ? 'danger' : 'blue'}`}
              >
                {lang === 'TH'
                  ? `ออมสุทธิ ${savingsRatio}%`
                  : `Net Savings ${savingsRatio}%`}
              </span>
              <span className="smartlog-stat-chip neutral">
                <span
                  className={`status-dot ${emergencyRunway >= targetMonths ? 'green' : 'amber'}`}
                  aria-hidden="true"
                />
                {lang === 'TH'
                  ? `สำรอง ${emergencyRunway.toFixed(2)} / ${targetMonths} ด.`
                  : `Reserve ${emergencyRunway.toFixed(2)} / ${targetMonths} mo.`}
              </span>
            </div>
          </header>
        ) : activePage === 'risk-analysis' ? (
          <header
            className="bento-card smartlog-header-card"
            aria-label="Risk and Protection Gap Analysis"
          >
            <div className="smartlog-header-left">
              <span className="smartlog-header-icon" aria-hidden="true">
                <ShieldAlert size={22} strokeWidth={2.1} />
              </span>
              <div className="smartlog-header-copy">
                <h1 className="smartlog-header-title">
                  {t(PAGE_TITLES['risk-analysis'])}
                </h1>
                <p className="smartlog-header-sub">
                  {lang === 'TH'
                    ? 'ตรวจเช็กสวัสดิการ ประเมินช่องว่างความคุ้มครอง 6 ด้าน และวางแผนจัดการความเสี่ยงอย่างเป็นกลาง'
                    : 'Audit existing benefits, quantify 6-pillar protection gaps, and plan neutrally with zero sales bias.'}
                </p>
              </div>
            </div>

            <div className="smartlog-header-chips tabular-nums">
              <span
                className={`smartlog-stat-chip ${
                  riskAssessment?.overallRiskLevel === 'high'
                    ? 'danger'
                    : riskAssessment?.overallRiskLevel === 'low'
                      ? 'blue'
                      : 'neutral'
                }`}
              >
                {lang === 'TH'
                  ? `ความเสี่ยงรวม: ${
                      riskAssessment?.overallRiskLevel === 'high'
                        ? 'สูง'
                        : riskAssessment?.overallRiskLevel === 'moderate'
                          ? 'ปานกลาง'
                          : 'ต่ำ'
                    }`
                  : `Risk: ${
                      riskAssessment?.overallRiskLevel === 'high'
                        ? 'High'
                        : riskAssessment?.overallRiskLevel === 'moderate'
                          ? 'Moderate'
                          : 'Low'
                    }`}
              </span>
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH'
                  ? `ช่องว่างรวม ${formatTHB(riskAssessment?.totalProtectionGap || 0)}`
                  : `Gap ${formatTHB(riskAssessment?.totalProtectionGap || 0)}`}
              </span>
              <span className="smartlog-stat-chip blue">
                {lang === 'TH' ? 'ครอบคลุมแล้ว' : 'Covered'}{' '}
                {riskAssessment?.overallCoveragePct || 0}%
              </span>
            </div>
          </header>
        ) : activePage === 'invest' ? (
          <header
            className="bento-card smartlog-header-card"
            aria-label="Invest and Value Lab"
          >
            <div className="smartlog-header-left">
              <span className="smartlog-header-icon" aria-hidden="true">
                <TrendingUp size={22} strokeWidth={2.1} />
              </span>
              <div className="smartlog-header-copy">
                <h1 className="smartlog-header-title">
                  {t(PAGE_TITLES.invest)}
                </h1>
                <p className="smartlog-header-sub">
                  {lang === 'TH'
                    ? 'เครื่องคำนวณความคุ้มค่าการโอนย้ายความเสี่ยง ผลตอบแทนแท้จริง (IRR) เงินเฟ้อ และภาษี'
                    : 'Protection value simulator & true annualized IRR calculator after inflation and Thai tax.'}
                </p>
              </div>
            </div>

            <div className="smartlog-header-chips tabular-nums">
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH'
                  ? `รายได้ทั้งปี ${formatTHB(monthlyIncome * 12)}`
                  : `Annual Income ${formatTHB(monthlyIncome * 12)}`}
              </span>
              <span className="smartlog-stat-chip blue">
                {lang === 'TH'
                  ? `ฐานภาษี ${
                      calculateThaiTaxImpact({ annualIncome: monthlyIncome * 12 }).marginalRatePct
                    }%`
                  : `Tax Bracket ${
                      calculateThaiTaxImpact({ annualIncome: monthlyIncome * 12 }).marginalRatePct
                    }%`}
              </span>
              <span className="smartlog-stat-chip neutral">
                <span
                  className={`status-dot ${emergencyRunway >= targetMonths ? 'green' : 'amber'}`}
                  aria-hidden="true"
                />
                {lang === 'TH'
                  ? `สำรอง ${emergencyRunway.toFixed(2)} ด.`
                  : `Reserve ${emergencyRunway.toFixed(2)} mo.`}
              </span>
            </div>
          </header>
        ) : activePage === 'game' ? (
          <header
            className="bento-card smartlog-header-card"
            aria-label="PROTECT360 Survival Lab"
          >
            <div className="smartlog-header-left">
              <span className="smartlog-header-icon" aria-hidden="true">
                <Gamepad2 size={22} strokeWidth={2.1} />
              </span>
              <div className="smartlog-header-copy">
                <h1 className="smartlog-header-title">
                  {t(PAGE_TITLES.game)}
                </h1>
                <p className="smartlog-header-sub">
                  {lang === 'TH'
                    ? 'จำลองรับมือเหตุไม่คาดฝันตั้งแต่โหมดด่วน 30 วัน จนถึงเต็มปี 365 วัน เพื่อฝึกวางแผนความเสี่ยงอย่างเป็นกลาง'
                    : 'Test your financial resilience from a 30-day express demo to a full 365-day year with zero sales bias.'}
                </p>
              </div>
            </div>

            <div className="smartlog-header-chips tabular-nums">
              <span className="smartlog-stat-chip blue">
                {lang === 'TH'
                  ? `เงินสำรองจริง ${formatTHB(emergencyFund)}`
                  : `Live Reserve ${formatTHB(emergencyFund)}`}
              </span>
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH'
                  ? `เงินเหลือออม ${formatTHB(Math.max(0, monthlyIncome - monthlyExpenses))}/ด.`
                  : `Surplus ${formatTHB(Math.max(0, monthlyIncome - monthlyExpenses))}/mo`}
              </span>
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH' ? 'โหมด 30–365 วัน' : '30–365 Day Modes'}
              </span>
            </div>
          </header>
        ) : activePage === 'learning' ? (
          <header
            className="bento-card smartlog-header-card"
            aria-label="PROTECT360 Learning Center"
          >
            <div className="smartlog-header-left">
              <span className="smartlog-header-icon" aria-hidden="true">
                <BookOpen size={22} strokeWidth={2.1} />
              </span>
              <div className="smartlog-header-copy">
                <h1 className="smartlog-header-title">
                  {t(PAGE_TITLES.learning)}
                </h1>
                <p className="smartlog-header-sub">
                  {lang === 'TH'
                    ? `สำหรับ ${(userProfile?.firstName || '').trim() || 'First Jobber'} • เรียนรู้กติกาสำคัญก่อนตัดสินใจ ไม่ต้องง้อศัพท์เทคนิค`
                    : `For ${(userProfile?.firstName || '').trim() || 'First Jobber'} • Master key financial & protection rules in plain language.`}
                </p>
              </div>
            </div>

            <div className="smartlog-header-chips tabular-nums">
              <span className="smartlog-stat-chip blue">
                {lang === 'TH'
                  ? `${LEARNING_ARTICLES.length} บทความ + แหล่งอ้างอิง`
                  : `${LEARNING_ARTICLES.length} Guides & Sources`}
              </span>
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH'
                  ? `${JARGON_TERMS.length} ศัพท์สำคัญ`
                  : `${JARGON_TERMS.length} Key Terms`}
              </span>
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH'
                  ? `ควิซสุ่มคลัง ${LITERACY_QUIZ_BANK.length} ข้อ`
                  : `${LITERACY_QUIZ_BANK.length}-Q Random Quiz`}
              </span>
            </div>
          </header>
        ) : activePage === 'about' ? null : activePage === 'settings' ? (
          <header
            className="bento-card smartlog-header-card"
            aria-label="PROTECT360 Settings and Local Data"
          >
            <div className="smartlog-header-left">
              <span className="smartlog-header-icon" aria-hidden="true">
                <Settings size={22} strokeWidth={2.1} />
              </span>
              <div className="smartlog-header-copy">
                <h1 className="smartlog-header-title">
                  {t(PAGE_TITLES.settings)}
                </h1>
                <p className="smartlog-header-sub">
                  {lang === 'TH'
                    ? 'รวมการตั้งค่าภาษา ธีมสี ขนาดตัวอักษร และการจัดการข้อมูลที่บันทึกในเครื่อง (PDPA-Safe) ไว้ในหน้าเดียว'
                    : 'Manage language, light/dark theme, text scale, and all local PDPA-safe data controls in one place.'}
                </p>
              </div>
            </div>

            <div className="smartlog-header-chips tabular-nums">
              <span className="smartlog-stat-chip blue">
                {t('header.savedLocally')}
              </span>
              <span className="smartlog-stat-chip neutral">
                {lang} · PDPA-Safe
              </span>
            </div>
          </header>
        ) : (
          <header className="subpage-header">
            <div className="header-greeting-group">
              <div className="header-title-row">
                <h1 className="header-title">
                  {t(PAGE_TITLES[activePage] || { th: 'PROTECT360', en: 'PROTECT360' })}
                </h1>
              </div>
              <p className="header-philosophy">{t('header.philosophy')}</p>
            </div>
          </header>
        )}

        {!demoVideoModal.open &&
          !tutorialPromptOpen &&
          !tutorialTour.active &&
          TAB_BANNER_META[activePage] &&
          !tabTutorialStatuses[activePage] && (
            <div
              id="tab-tutorial-banner"
              className="tab-tutorial-banner"
              role="region"
              aria-label="Tab interactive guide invite"
            >
              <div className="tab-tutorial-copy">
                <span className="tab-tutorial-icon" aria-hidden="true">
                  <Compass size={16} strokeWidth={2.2} />
                </span>
                <span className="tab-tutorial-text">
                  {t(TAB_BANNER_META[activePage])}
                </span>
              </div>

              <div className="tab-tutorial-actions">
                <button
                  id="tab-tutorial-start-btn"
                  type="button"
                  className="btn-primary-gradient tab-tutorial-start-btn"
                  data-sound="action"
                  onClick={() => handleStartTutorial('page', activePage)}
                >
                  <span>
                    {(TUTORIAL_UI_COPY[lang] || TUTORIAL_UI_COPY.TH).bannerStartBtn} (
                    {getPageContextualSteps(activePage).length}{' '}
                    {(TUTORIAL_UI_COPY[lang] || TUTORIAL_UI_COPY.TH).stepsUnit})
                  </span>
                </button>
                <button
                  id="tab-tutorial-dismiss-btn"
                  type="button"
                  className="btn-soft-gray tab-tutorial-dismiss-btn"
                  onClick={() => handleDismissTabBanner(activePage)}
                >
                  <span>
                    {(TUTORIAL_UI_COPY[lang] || TUTORIAL_UI_COPY.TH).bannerDismissBtn}
                  </span>
                </button>
              </div>
            </div>
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

      <TutorialOverlay
        promptOpen={tutorialPromptOpen}
        tourActive={tutorialTour.active}
        tourMode={tutorialTour.mode}
        steps={tutorialTour.steps}
        stepIndex={tutorialTour.index}
        activePage={activePage}
        onNavigate={handleNavigate}
        onAcceptPrompt={() => handleStartTutorial('full')}
        onDeclinePrompt={handleDeclineTutorialPrompt}
        onStepChange={(nextIdx) =>
          setTutorialTour((prev) => ({
            ...prev,
            index: Math.max(0, Math.min(prev.steps.length - 1, nextIdx)),
          }))
        }
        onCloseTour={handleCloseTour}
        onCompleteTour={handleCompleteTour}
      />

      {demoVideoModal.open && (
        <DemoVideoModal
          mode={demoVideoModal.mode}
          onClose={() => setDemoVideoModal({ open: false, mode: 'replay' })}
          onContinueToPrompt={() => {
            setDemoVideoModal({ open: false, mode: 'replay' });
            setTutorialPromptOpen(true);
          }}
          onStartTutorial={handleStartTutorial}
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

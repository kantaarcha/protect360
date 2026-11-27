import { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Gamepad2,
  Info,
  Pencil,
  PlusCircle,
  RotateCcw,
  ShieldAlert,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FinanceProvider, formatTHB, useFinance } from './context/FinanceContext';
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
import { calculateThaiTaxImpact } from './utils/investMath';

const PAGE_TITLES = {
  overview: null,
  smartlog: {
    th: 'สมุดบัญชี SmartLog',
    en: 'SmartLog Cashbook',
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
};

function AppShellContent() {
  const [activePage, setActivePage] = useState('overview');
  const [profileModal, setProfileModal] = useState({ open: false, tab: 'profile' });
  const { lang, t } = useLanguage();
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
        return <Invest key={isDemoMode ? 'demo' : 'clean'} onNavigate={handleNavigate} />;
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
        {/* Row 1: Clean, Symmetrical Utility Strip (Brand + Subpage Profile Pill + Control Groups) */}
        <div className={`top-utility-row ${activePage !== 'overview' ? 'has-subpage-profile' : ''}`}>
          <div className="top-utility-left">
            <button
              type="button"
              className="mobile-brand-bar"
              onClick={() => handleNavigate('overview')}
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

          <TopControlBar onOpenProfile={handleOpenProfile} />
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
                  {lang === 'TH' ? 'โหมดตัวอย่างคำนวณ:' : 'Sample Preview Mode:'}
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
                {lang === 'TH' ? 'ล้างกลับเป็น 0 เพื่อกรอกเอง' : 'Clear back to 0'}
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
        ) : activePage === 'smartlog' ? (
          <header className="bento-card smartlog-header-card" aria-label="SmartLog Cashbook">
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
                {lang === 'TH' ? '10 บทความ + แหล่งอ้างอิง' : '10 Guides & Sources'}
              </span>
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH' ? '14 ศัพท์สำคัญ' : '14 Key Terms'}
              </span>
              <span className="smartlog-stat-chip neutral">
                {lang === 'TH' ? 'ควิซสุ่มคลัง 20 ข้อ' : '20-Q Random Quiz'}
              </span>
            </div>
          </header>
        ) : activePage === 'about' ? null : (
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

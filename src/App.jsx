import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FinanceProvider } from './context/FinanceContext';
import SidebarNav from './components/SidebarNav';
import TopControlBar from './components/TopControlBar';
import OverviewDashboard from './pages/OverviewDashboard';
import AutoKey from './pages/AutoKey';
import RiskAnalysis from './pages/RiskAnalysis';
import Invest from './pages/Invest';
import Game from './pages/Game';
import LearningCenter from './pages/LearningCenter';
import LandingAbout from './pages/LandingAbout';

const PAGE_TITLES = {
  overview: null,
  autokey: { th: 'AutoKey — บันทึกรายรับ-จ่าย', en: 'AutoKey — Smart Cashflow' },
  'risk-analysis': { th: 'Risk Analysis — วิเคราะห์ความเสี่ยง', en: 'Risk Analysis' },
  invest: { th: 'Invest (IRR) — เปรียบเทียบผลตอบแทน', en: 'Invest (IRR)' },
  game: { th: 'Game — เกมจำลองการบริหารความเสี่ยง', en: 'Game — Risk Simulator' },
  learning: { th: 'คลังความรู้', en: 'Learning Center' },
  about: { th: 'หน้าหลัก & เกี่ยวกับเรา', en: 'Landing & About' },
};

function AppShellContent() {
  const [activePage, setActivePage] = useState('overview');
  const { t } = useLanguage();

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'autokey':
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
        return <OverviewDashboard onNavigate={handleNavigate} />;
    }
  };

  const pageHeading =
    activePage === 'overview'
      ? t('header.greeting')
      : t(PAGE_TITLES[activePage] || { th: 'PROTECT360', en: 'PROTECT360' });

  return (
    <div className="app-shell">
      <SidebarNav activePage={activePage} onNavigate={handleNavigate} />

      <main className="app-main">
        <header className="top-header">
          <div className="header-greeting-group">
            {/* Compact Brand Identity shown on Mobile & Portrait iPad when left rail is docked */}
            <button
              type="button"
              className="mobile-brand-bar"
              onClick={() => handleNavigate('overview')}
            >
              <span className="mobile-brand-mark" aria-hidden="true">
                <ShieldCheck size={17} strokeWidth={2.3} />
              </span>
              <span className="mobile-brand-name">PROTECT360</span>
              <span className="oic-mini-chip">OIC</span>
            </button>

            <div className="header-title-row">
              <h1 className="header-title">{pageHeading}</h1>
            </div>
            <p className="header-philosophy">{t('header.philosophy')}</p>
          </div>

          <TopControlBar />
        </header>

        {renderActivePage()}
      </main>
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

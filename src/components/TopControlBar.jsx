import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Moon, Pencil, ShieldCheck, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { getProfilePillLabel, getUserInitials } from '../utils/userHelpers';

export default function TopControlBar({ onOpenProfile }) {
  const {
    lang,
    setLang,
    t,
    fontScaleLabel,
    canDecreaseFont,
    canIncreaseFont,
    decreaseFontSize,
    increaseFontSize,
    resetFontSize,
  } = useLanguage();

  const { isDark, toggleTheme } = useTheme();
  const { userProfile } = useFinance();

  const [showCharter, setShowCharter] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!showCharter) return;
    const handleOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowCharter(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showCharter]);

  const userInitials = getUserInitials(userProfile.firstName, userProfile.lastName);
  const userPillLabel = getProfilePillLabel(userProfile, lang);

  return (
    <div
      className="top-pill-bar"
      role="region"
      aria-label="Accessibility, theme, language, and user profile controls"
    >
      {/* 1) Language Toggle Pill: TH | EN */}
      <div className="lang-toggle" role="group" aria-label={t('controls.switchLang')}>
        <button
          id="lang-btn-th"
          type="button"
          className={`lang-btn ${lang === 'TH' ? 'active' : ''}`}
          aria-pressed={lang === 'TH'}
          onClick={() => setLang('TH')}
        >
          TH
        </button>
        <button
          id="lang-btn-en"
          type="button"
          className={`lang-btn ${lang === 'EN' ? 'active' : ''}`}
          aria-pressed={lang === 'EN'}
          onClick={() => setLang('EN')}
        >
          EN
        </button>
      </div>

      {/* 2) Font Size Scaler Pill: A- / 100% / A+ */}
      <div className="font-scaler" role="group" aria-label="Font size controls">
        <button
          id="font-decrease-btn"
          type="button"
          className="font-btn"
          onClick={decreaseFontSize}
          disabled={!canDecreaseFont}
          title={t('controls.decreaseFont')}
          aria-label={t('controls.decreaseFont')}
        >
          A-
        </button>
        <button
          id="font-reset-btn"
          type="button"
          className="font-scale-readout tabular-nums"
          onClick={resetFontSize}
          title={t('controls.resetFont')}
        >
          {fontScaleLabel}
        </button>
        <button
          id="font-increase-btn"
          type="button"
          className="font-btn"
          onClick={increaseFontSize}
          disabled={!canIncreaseFont}
          title={t('controls.increaseFont')}
          aria-label={t('controls.increaseFont')}
        >
          A+
        </button>
      </div>

      {/* 3) Light / Dark Theme Toggle Pill */}
      <button
        id="theme-toggle-btn"
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-pressed={isDark}
        title={t('controls.switchTheme')}
        aria-label={isDark ? t('controls.lightMode') : t('controls.darkMode')}
      >
        {isDark ? (
          <Sun size={16} strokeWidth={2.2} className="theme-icon sun" />
        ) : (
          <Moon size={16} strokeWidth={2.2} className="theme-icon moon" />
        )}
        <span className="theme-toggle-label">
          {isDark ? t('controls.lightMode') : t('controls.darkMode')}
        </span>
      </button>

      {/* 4) Subtle Green/Teal Saved Locally Status Pill */}
      <button
        id="saved-locally-pill"
        type="button"
        className="saved-locally-pill"
        onClick={() => onOpenProfile?.('privacy')}
        title={t('header.savedLocallyTitle')}
      >
        <CheckCircle2 size={14} strokeWidth={2.3} className="saved-locally-icon" />
        <span>{t('header.savedLocally')}</span>
      </button>

      {/* 5) Neutral Badge: ไม่ขายประกัน / No Sales */}
      <div className="neutral-badge-wrap" ref={popoverRef}>
        <button
          id="neutral-charter-btn"
          type="button"
          className="neutral-badge"
          aria-expanded={showCharter}
          onClick={() => setShowCharter((prev) => !prev)}
        >
          <ShieldCheck size={15} className="neutral-badge-icon" strokeWidth={2.3} />
          <span>{t('brand.noSalesBadge')}</span>
        </button>

        {showCharter && (
          <div className="neutral-popover" role="tooltip">
            <h4>
              <ShieldCheck size={16} color="var(--teal)" />
              {t('brand.noSalesTitle')}
            </h4>
            <p>{t('brand.noSalesDesc')}</p>
            <div className="neutral-popover-foot">{t('brand.oicNote')}</div>
          </div>
        )}
      </div>

      {/* 6) Top-Right User Profile Pill */}
      <button
        id="user-profile-pill-btn"
        type="button"
        className="user-profile-pill"
        onClick={() => onOpenProfile?.('profile')}
        title={t('header.editProfile')}
        aria-label={`${userPillLabel} — ${t('header.editProfile')}`}
      >
        <span className="user-avatar-circle" aria-hidden="true">
          {userInitials}
        </span>
        <span className="user-pill-name">{userPillLabel}</span>
        <Pencil size={12} strokeWidth={2.3} className="user-pill-edit-icon" aria-hidden="true" />
      </button>
    </div>
  );
}

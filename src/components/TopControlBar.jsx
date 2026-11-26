import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CheckCircle2, Moon, Pencil, ShieldCheck, Sun, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { useLiquidSlider } from '../hooks/useLiquidSlider';
import { getProfilePillLabel, getUserInitials } from '../utils/userHelpers';

export default function TopControlBar({ onOpenProfile }) {
  const {
    lang,
    setLang,
    t,
    fontStepIdx,
    fontScaleLabel,
    canDecreaseFont,
    canIncreaseFont,
    decreaseFontSize,
    increaseFontSize,
    resetFontSize,
  } = useLanguage();

  const { isDark, toggleTheme } = useTheme();
  const { userProfile } = useFinance();

  const langSlider = useLiquidSlider(lang, [fontStepIdx]);

  const [showCharter, setShowCharter] = useState(false);
  const [popoverCoords, setPopoverCoords] = useState({ top: 72, left: 12, width: 310 });
  const charterBtnRef = useRef(null);
  const popoverBoxRef = useRef(null);

  // Viewport-clamped positioning for "ไม่ขายประกัน" popover — never clips off-screen even at 125% font scale on mobile
  useLayoutEffect(() => {
    if (!showCharter) return;

    const updatePosition = () => {
      const btn = charterBtnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 12;

      const isNarrow = vw <= 640;
      const maxAllowedWidth = Math.max(220, vw - margin * 2);
      const popWidth = isNarrow ? maxAllowedWidth : Math.min(340, maxAllowedWidth);

      const left = isNarrow
        ? margin
        : Math.min(Math.max(margin, rect.right - popWidth), vw - popWidth - margin);

      const estimatedHeight = popoverBoxRef.current?.offsetHeight || 220;
      let top = rect.bottom + 10;
      if (top + estimatedHeight > vh - margin && rect.top - estimatedHeight - 10 > margin) {
        top = rect.top - estimatedHeight - 10;
      } else {
        top = Math.min(top, Math.max(margin, vh - estimatedHeight - margin));
      }

      setPopoverCoords({ top, left, width: popWidth });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [showCharter, lang, fontStepIdx]);

  useEffect(() => {
    if (!showCharter) return;
    const handleOutside = (e) => {
      const clickedBtn = charterBtnRef.current?.contains(e.target);
      const clickedBox = popoverBoxRef.current?.contains(e.target);
      if (!clickedBtn && !clickedBox) {
        setShowCharter(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowCharter(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showCharter]);

  const userInitials = getUserInitials(userProfile.firstName, userProfile.lastName);
  const userPillLabel = getProfilePillLabel(userProfile, lang);

  return (
    <div
      className="top-pill-bar"
      role="region"
      aria-label="Accessibility, theme, language, and user profile controls"
    >
      {/* 1) Language Toggle Pill: TH | EN (Liquid Glass Horizontal Glide) */}
      <div
        className="lang-toggle liquid-track"
        ref={langSlider.containerRef}
        role="group"
        aria-label={t('controls.switchLang')}
      >
        <span
          className="liquid-glass-pill liquid-pill-compact"
          style={langSlider.indicatorStyle}
          aria-hidden="true"
        />
        <button
          id="lang-btn-th"
          type="button"
          data-liquid-active={lang === 'TH' ? 'true' : undefined}
          className={`lang-btn ${lang === 'TH' ? 'active' : ''}`}
          aria-pressed={lang === 'TH'}
          onClick={() => setLang('TH')}
        >
          TH
        </button>
        <button
          id="lang-btn-en"
          type="button"
          data-liquid-active={lang === 'EN' ? 'true' : undefined}
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
      <div className="neutral-badge-wrap">
        <button
          ref={charterBtnRef}
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
          <div
            ref={popoverBoxRef}
            className="neutral-popover neutral-popover-fixed"
            role="dialog"
            aria-label={t('brand.noSalesTitle')}
            style={{
              top: `${popoverCoords.top}px`,
              left: `${popoverCoords.left}px`,
              width: `${popoverCoords.width}px`,
            }}
          >
            <div className="neutral-popover-head">
              <h4>
                <ShieldCheck size={16} color="var(--teal)" style={{ flexShrink: 0 }} />
                <span>{t('brand.noSalesTitle')}</span>
              </h4>
              <button
                type="button"
                className="neutral-popover-close"
                onClick={() => setShowCharter(false)}
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
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

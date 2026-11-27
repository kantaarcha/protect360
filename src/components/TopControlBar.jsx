import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Compass, HelpCircle, Lightbulb, Settings, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPageContextualSteps, TUTORIAL_UI_COPY } from '../data/tutorialSteps';

export default function TopControlBar({ activePage, onNavigate, onStartTutorial }) {
  const { lang, t, fontStepIdx } = useLanguage();
  const helpCopy = TUTORIAL_UI_COPY[lang] || TUTORIAL_UI_COPY.TH;
  const pageStepCount = getPageContextualSteps(activePage).length;

  const [showCharter, setShowCharter] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [popoverCoords, setPopoverCoords] = useState({ top: 72, left: 12, width: 310 });
  const [helpCoords, setHelpCoords] = useState({ top: 72, left: 12, width: 248 });
  const charterBtnRef = useRef(null);
  const popoverBoxRef = useRef(null);
  const helpBtnRef = useRef(null);
  const helpBoxRef = useRef(null);

  // Viewport-clamped positioning for "ไม่ขายประกัน" popover — never clips off-screen even at 125% font scale on mobile
  useLayoutEffect(() => {
    if (!showCharter) return undefined;

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

  // Viewport-clamped positioning for Tutorial "?" quick menu
  useLayoutEffect(() => {
    if (!showHelpMenu) return undefined;

    const updateHelpPosition = () => {
      const btn = helpBtnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 12;
      const popWidth = Math.min(265, Math.max(210, vw - margin * 2));
      const left = Math.min(Math.max(margin, rect.right - popWidth), vw - popWidth - margin);
      const estimatedHeight = helpBoxRef.current?.offsetHeight || 160;
      const top = Math.min(rect.bottom + 10, Math.max(margin, vh - estimatedHeight - margin));
      setHelpCoords({ top, left, width: popWidth });
    };

    updateHelpPosition();
    window.addEventListener('resize', updateHelpPosition);
    window.addEventListener('scroll', updateHelpPosition, true);
    return () => {
      window.removeEventListener('resize', updateHelpPosition);
      window.removeEventListener('scroll', updateHelpPosition, true);
    };
  }, [showHelpMenu, lang, fontStepIdx]);

  useEffect(() => {
    if (!showCharter && !showHelpMenu) return undefined;
    const handleOutside = (e) => {
      if (
        showCharter &&
        !charterBtnRef.current?.contains(e.target) &&
        !popoverBoxRef.current?.contains(e.target)
      ) {
        setShowCharter(false);
      }
      if (
        showHelpMenu &&
        !helpBtnRef.current?.contains(e.target) &&
        !helpBoxRef.current?.contains(e.target)
      ) {
        setShowHelpMenu(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setShowCharter(false);
        setShowHelpMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showCharter, showHelpMenu]);

  const isSettingsActive = activePage === 'settings';

  return (
    <div
      className="top-controls-groups top-controls-compact"
      role="region"
      aria-label="Trust charter, tutorial help, and settings shortcut"
    >
      <div className="control-pill-group control-group-compact">
        <div className="neutral-badge-wrap">
          <button
            ref={charterBtnRef}
            id="neutral-charter-btn"
            type="button"
            className="neutral-badge"
            aria-expanded={showCharter}
            onClick={() => {
              setShowHelpMenu(false);
              setShowCharter((prev) => !prev);
            }}
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

        {/* Tutorial Quick Help Button (?) */}
        <div className="neutral-badge-wrap">
          <button
            ref={helpBtnRef}
            id="top-tutorial-btn"
            type="button"
            className={`top-help-btn ${showHelpMenu ? 'active' : ''}`}
            aria-expanded={showHelpMenu}
            aria-label={helpCopy.helpMenuTitle}
            title={helpCopy.helpMenuTitle}
            onClick={() => {
              setShowCharter(false);
              setShowHelpMenu((prev) => !prev);
            }}
          >
            <HelpCircle size={15} strokeWidth={2.2} aria-hidden="true" />
          </button>

          {showHelpMenu && (
            <div
              ref={helpBoxRef}
              className="neutral-popover neutral-popover-fixed top-help-popover"
              role="dialog"
              aria-label={helpCopy.helpMenuTitle}
              style={{
                top: `${helpCoords.top}px`,
                left: `${helpCoords.left}px`,
                width: `${helpCoords.width}px`,
              }}
            >
              <div className="neutral-popover-head">
                <h4>
                  <HelpCircle size={15} color="var(--royal)" style={{ flexShrink: 0 }} />
                  <span>{helpCopy.helpMenuTitle}</span>
                </h4>
                <button
                  type="button"
                  className="neutral-popover-close"
                  onClick={() => setShowHelpMenu(false)}
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="top-help-actions">
                <button
                  id="top-help-page-btn"
                  type="button"
                  className="top-help-menu-item"
                  onClick={() => {
                    setShowHelpMenu(false);
                    onStartTutorial?.('page');
                  }}
                >
                  <Lightbulb size={15} strokeWidth={2.2} aria-hidden="true" />
                  <span>
                    {helpCopy.helpThisPage} ({pageStepCount} {helpCopy.stepsUnit})
                  </span>
                </button>
                <button
                  id="top-help-full-btn"
                  type="button"
                  className="top-help-menu-item"
                  onClick={() => {
                    setShowHelpMenu(false);
                    onStartTutorial?.('full');
                  }}
                >
                  <Compass size={15} strokeWidth={2.2} aria-hidden="true" />
                  <span>{helpCopy.helpFullTour}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          id="top-settings-btn"
          type="button"
          className={`top-settings-btn ${isSettingsActive ? 'active' : ''}`}
          aria-current={isSettingsActive ? 'page' : undefined}
          onClick={() => {
            setShowHelpMenu(false);
            setShowCharter(false);
            onNavigate?.('settings');
          }}
          title={t('nav.settings')}
        >
          <Settings size={15} strokeWidth={2.2} aria-hidden="true" />
          <span>{t('nav.settings')}</span>
        </button>
      </div>
    </div>
  );
}

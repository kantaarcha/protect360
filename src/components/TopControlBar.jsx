import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Settings, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TopControlBar({ activePage, onNavigate }) {
  const { lang, t, fontStepIdx } = useLanguage();

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

  const isSettingsActive = activePage === 'settings';

  return (
    <div
      className="top-controls-groups top-controls-compact"
      role="region"
      aria-label="Trust charter and settings shortcut"
    >
      <div className="control-pill-group control-group-compact">
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

        <button
          id="top-settings-btn"
          type="button"
          className={`top-settings-btn ${isSettingsActive ? 'active' : ''}`}
          aria-current={isSettingsActive ? 'page' : undefined}
          onClick={() => onNavigate?.('settings')}
          title={t('nav.settings')}
        >
          <Settings size={15} strokeWidth={2.2} aria-hidden="true" />
          <span>{t('nav.settings')}</span>
        </button>
      </div>
    </div>
  );
}

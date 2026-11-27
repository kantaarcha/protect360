import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  HelpCircle,
  Lightbulb,
  Sparkles,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TUTORIAL_UI_COPY } from '../data/tutorialSteps';
import { playUiSound } from '../utils/soundEffects';

function findVisibleTarget(step) {
  if (!step) return null;
  const candidates = [
    ...(step.spotlightSelector ? [step.spotlightSelector] : []),
    ...(Array.isArray(step.selectors) ? step.selectors : []),
  ];
  for (const sel of candidates) {
    const el = document.querySelector(sel);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        return el;
      }
    }
  }
  return null;
}

export default function TutorialOverlay({
  promptOpen,
  tourActive,
  tourMode,
  steps,
  stepIndex,
  activePage,
  onNavigate,
  onAcceptPrompt,
  onDeclinePrompt,
  onStepChange,
  onCloseTour,
  onCompleteTour,
}) {
  const { lang } = useLanguage();
  const copy = TUTORIAL_UI_COPY[lang] || TUTORIAL_UI_COPY.TH;
  const currentStep = tourActive && steps.length > 0 ? steps[stepIndex] : null;

  const [targetRect, setTargetRect] = useState(null);
  const [cardStyle, setCardStyle] = useState({ opacity: 0 });
  const cardRef = useRef(null);
  const lastPreparedKeyRef = useRef('');

  // Sync active page and optionally switch UI sub-tabs cleanly (read-only on financial data)
  useEffect(() => {
    if (!tourActive || !currentStep) {
      lastPreparedKeyRef.current = '';
      return;
    }
    if (currentStep.page && activePage !== currentStep.page) {
      onNavigate?.(currentStep.page);
      return;
    }

    const prepKey = `${currentStep.id}:${activePage}`;
    if (lastPreparedKeyRef.current !== prepKey) {
      lastPreparedKeyRef.current = prepKey;
      if (typeof currentStep.prepareDom === 'function') {
        const timer = window.setTimeout(() => {
          try {
            currentStep.prepareDom();
          } catch {
            // Ignore non-critical tab switch failure
          }
        }, 70);
        return () => window.clearTimeout(timer);
      }
    }
    return undefined;
  }, [tourActive, currentStep, activePage, onNavigate]);

  const measureAndPosition = useCallback(() => {
    if (!tourActive || !currentStep || activePage !== currentStep.page) {
      setTargetRect(null);
      return;
    }

    const el = findVisibleTarget(currentStep);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw <= 680;
    const margin = isMobile ? 12 : 18;
    const cardEl = cardRef.current;
    const cardW = Math.min(isMobile ? vw - 24 : 390, vw - 24);
    const cardH = cardEl?.offsetHeight || 260;

    if (!el) {
      setTargetRect(null);
      setCardStyle({
        width: `${cardW}px`,
        top: `${Math.max(margin, Math.round((vh - cardH) / 2))}px`,
        left: `${Math.max(margin, Math.round((vw - cardW) / 2))}px`,
        opacity: 1,
      });
      return;
    }

    const raw = el.getBoundingClientRect();
    const pad = isMobile ? 6 : 10;
    const spotlightTop = Math.max(8, raw.top - pad);
    const spotlightLeft = Math.max(8, raw.left - pad);
    const spotlightRight = Math.min(vw - 8, raw.right + pad);
    const spotlightBottom = Math.min(vh - 8, raw.bottom + pad);
    const sW = Math.max(40, spotlightRight - spotlightLeft);
    const sH = Math.max(36, spotlightBottom - spotlightTop);

    setTargetRect({
      top: spotlightTop,
      left: spotlightLeft,
      width: sW,
      height: sH,
    });

    if (isMobile) {
      // Anchor at top if spotlight is in lower half, or bottom if spotlight is in upper half
      const targetCenterY = spotlightTop + sH / 2;
      const placeTop = targetCenterY > vh * 0.54;
      const topPos = placeTop
        ? Math.max(12, Math.min(18, spotlightTop - cardH - 12))
        : Math.max(12, vh - cardH - 14);
      setCardStyle({
        width: `${cardW}px`,
        left: `${Math.round((vw - cardW) / 2)}px`,
        top: `${Math.round(topPos)}px`,
        opacity: 1,
      });
      return;
    }

    // Desktop intelligent placement: prefer below -> above -> right/left -> safe bottom corner
    const spaceBelow = vh - spotlightBottom - margin;
    const spaceAbove = spotlightTop - margin;
    let topPos = margin;
    let leftPos = Math.min(
      Math.max(margin, spotlightLeft + sW / 2 - cardW / 2),
      vw - cardW - margin
    );

    if (spaceBelow >= cardH + 12) {
      topPos = spotlightBottom + 14;
    } else if (spaceAbove >= cardH + 12) {
      topPos = spotlightTop - cardH - 14;
    } else {
      // Side placement if tall card spans vertically
      const spaceRight = vw - spotlightRight - margin;
      const spaceLeft = spotlightLeft - margin;
      if (spaceRight >= cardW + 14) {
        leftPos = spotlightRight + 14;
        topPos = Math.min(Math.max(margin, spotlightTop), vh - cardH - margin);
      } else if (spaceLeft >= cardW + 14) {
        leftPos = spotlightLeft - cardW - 14;
        topPos = Math.min(Math.max(margin, spotlightTop), vh - cardH - margin);
      } else {
        topPos = Math.max(margin, vh - cardH - margin);
        leftPos = vw - cardW - margin;
      }
    }

    setCardStyle({
      width: `${cardW}px`,
      top: `${Math.round(Math.max(margin, Math.min(topPos, vh - cardH - margin)))}px`,
      left: `${Math.round(Math.max(margin, Math.min(leftPos, vw - cardW - margin)))}px`,
      opacity: 1,
    });
  }, [tourActive, currentStep, activePage]);

  // Auto-scroll target into view when switching steps cleanly, then measure
  useEffect(() => {
    if (!tourActive || !currentStep || activePage !== currentStep.page) return undefined;

    const scrollTimer = window.setTimeout(() => {
      const el = findVisibleTarget(currentStep);
      if (el) {
        const r = el.getBoundingClientRect();
        const needsScroll = r.top < 72 || r.bottom > window.innerHeight - 110;
        if (needsScroll) {
          el.scrollIntoView({ block: 'center', behavior: 'auto' });
        }
      }
      measureAndPosition();
    }, 150);

    const followTimer = window.setTimeout(measureAndPosition, 340);

    const handleScroll = (e) => {
      if (e?.target && cardRef.current?.contains(e.target)) return;
      measureAndPosition();
    };

    window.addEventListener('resize', measureAndPosition);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(followTimer);
      window.removeEventListener('resize', measureAndPosition);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [tourActive, currentStep, activePage, stepIndex, lang, measureAndPosition]);

  // Keyboard shortcuts (Esc / Left / Right)
  useEffect(() => {
    if (!promptOpen && !tourActive) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (promptOpen) onDeclinePrompt?.();
        else if (tourActive) onCloseTour?.();
      } else if (tourActive) {
        if (e.key === 'ArrowRight') {
          if (stepIndex + 1 >= steps.length) {
            playUiSound('chime');
            onCompleteTour?.();
          } else {
            onStepChange?.(stepIndex + 1);
          }
        } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
          onStepChange?.(stepIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [
    promptOpen,
    tourActive,
    stepIndex,
    steps.length,
    onDeclinePrompt,
    onCloseTour,
    onCompleteTour,
    onStepChange,
  ]);

  // 1) Opt-in / Opt-out Welcome Prompt
  if (promptOpen) {
    return (
      <div
        className="tutorial-prompt-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-prompt-title"
      >
        <div className="tutorial-prompt-card">
          <div className="tutorial-prompt-top">
            <span className="tutorial-prompt-badge">
              <Compass size={14} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.promptBadge}</span>
            </span>
            <button
              id="tutorial-prompt-close-x"
              type="button"
              className="modal-close-btn tutorial-close-x"
              onClick={onDeclinePrompt}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="tutorial-prompt-hero">
            <span className="tutorial-prompt-icon" aria-hidden="true">
              <Sparkles size={22} strokeWidth={2.1} />
            </span>
            <div>
              <h2 id="tutorial-prompt-title" className="tutorial-prompt-title">
                {copy.promptTitle}
              </h2>
              <p className="tutorial-prompt-sub">{copy.promptSubtitle}</p>
            </div>
          </div>

          <ul className="tutorial-prompt-points">
            {copy.promptPoints.map((pt, idx) => (
              <li key={idx}>
                <CheckCircle2 size={15} strokeWidth={2.3} aria-hidden="true" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          <div className="tutorial-prompt-actions">
            <button
              id="tutorial-opt-out-btn"
              type="button"
              className="btn-soft-gray tutorial-opt-btn"
              onClick={onDeclinePrompt}
            >
              <span>{copy.promptDecline}</span>
            </button>
            <button
              id="tutorial-opt-in-btn"
              type="button"
              className="btn-primary-gradient tutorial-opt-btn"
              data-sound="action"
              onClick={onAcceptPrompt}
            >
              <HelpCircle size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.promptAccept}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2) Active Interactive Spotlight Tour
  if (!tourActive || !currentStep) {
    return null;
  }

  const isFirst = stepIndex === 0;
  const isLast = stepIndex + 1 >= steps.length;
  const badgeText =
    tourMode === 'page'
      ? copy.pageBadgeLabel
      : copy.badges[currentStep.badgeType] || copy.badges.core;
  const titleText = lang === 'EN' ? currentStep.title.en : currentStep.title.th;
  const bodyText = lang === 'EN' ? currentStep.body.en : currentStep.body.th;
  const plainTipText = lang === 'EN' ? currentStep.plainTip.en : currentStep.plainTip.th;

  const handleNext = () => {
    if (isLast) {
      playUiSound('chime');
      onCompleteTour?.();
    } else {
      onStepChange?.(stepIndex + 1);
    }
  };

  return (
    <div
      className="tutorial-tour-layer"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-labelledby="tutorial-coach-title"
    >
      {/* Dimmed click shield (when target missing, provides full backdrop; when spotlight active, shadow creates cutout) */}
      {!targetRect && <div className="tutorial-full-dim" onClick={onCloseTour} />}

      {targetRect && (
        <>
          <div className="tutorial-click-blocker" onClick={onCloseTour} />
          <div
            className="tutorial-spotlight-cutout"
            style={{
              top: `${targetRect.top}px`,
              left: `${targetRect.left}px`,
              width: `${targetRect.width}px`,
              height: `${targetRect.height}px`,
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Floating Coachmark Explanation Card */}
      <div
        ref={cardRef}
        className="tutorial-coach-card"
        style={cardStyle}
      >
        <div className="tutorial-coach-head">
          <div className="tutorial-coach-badges">
            <span className={`tutorial-type-pill ${currentStep.badgeType || 'core'}`}>
              {badgeText}
            </span>
            <span className="tutorial-step-counter tabular-nums">
              {copy.stepCounterPrefix} {stepIndex + 1} {copy.stepOf} {steps.length}
            </span>
          </div>

          <button
            id="tutorial-coach-close-btn"
            type="button"
            className="tutorial-coach-close"
            onClick={onCloseTour}
            aria-label={copy.skipBtn}
          >
            <X size={15} />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="tutorial-progress-dots" aria-hidden="true">
          {steps.map((s, idx) => (
            <span
              key={s.id}
              className={`tutorial-dot ${
                idx === stepIndex ? 'active' : idx < stepIndex ? 'done' : ''
              }`}
            />
          ))}
        </div>

        <h3 id="tutorial-coach-title" className="tutorial-coach-title">
          {titleText}
        </h3>
        <p className="tutorial-coach-body">{bodyText}</p>

        <div className="tutorial-plain-tip">
          <Lightbulb size={15} strokeWidth={2.2} className="tutorial-tip-icon" aria-hidden="true" />
          <span>{plainTipText}</span>
        </div>

        <div className="tutorial-coach-footer">
          <button
            id="tutorial-skip-btn"
            type="button"
            className="tutorial-text-skip"
            onClick={onCloseTour}
          >
            {copy.skipBtn}
          </button>

          <div className="tutorial-nav-btns">
            {!isFirst && (
              <button
                id="tutorial-prev-btn"
                type="button"
                className="btn-soft-gray tutorial-nav-btn"
                onClick={() => onStepChange?.(stepIndex - 1)}
              >
                <ArrowLeft size={14} aria-hidden="true" />
                <span>{copy.prevBtn}</span>
              </button>
            )}
            <button
              id="tutorial-next-btn"
              type="button"
              className="btn-primary-gradient tutorial-nav-btn"
              data-sound={isLast ? 'chime' : 'tap'}
              onClick={handleNext}
            >
              <span>{isLast ? copy.finishBtn : copy.nextBtn}</span>
              {!isLast ? (
                <ArrowRight size={14} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={14} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

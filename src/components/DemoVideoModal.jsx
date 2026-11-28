import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Compass, Film, Volume2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TUTORIAL_UI_COPY } from '../data/tutorialSteps';

export default function DemoVideoModal({
  mode = 'replay', // 'gate' (before tutorial opt-in prompt) | 'replay' (on-demand via ? or Settings)
  onClose,
  onContinueToPrompt,
  onStartTutorial,
}) {
  const { lang } = useLanguage();
  const copy = TUTORIAL_UI_COPY[lang] || TUTORIAL_UI_COPY.TH;
  const videoRef = useRef(null);
  const [needsUnmuteTap, setNeedsUnmuteTap] = useState(false);

  const isGate = mode === 'gate';
  const handleDismissAction = isGate ? onContinueToPrompt : onClose;

  // Initialize video at 50% volume and attempt playback (fallback cleanly to muted + unmute pill if browser policy restricts audio)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return undefined;

    let cancelled = false;
    vid.volume = 0.5;
    vid.muted = false;

    const playPromise = vid.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        if (cancelled) return;
        vid.muted = true;
        vid.volume = 0.5;
        setNeedsUnmuteTap(true);
        vid.play()?.catch?.(() => {});
      });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        handleDismissAction?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleDismissAction]);

  const handleEnableSound50 = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = 0.5;
    vid.muted = false;
    setNeedsUnmuteTap(false);
    if (vid.paused) {
      vid.play()?.catch?.(() => {});
    }
  };

  return (
    <div
      className="tutorial-prompt-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-video-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismissAction?.();
      }}
    >
      <div id="demo-video-modal" className="modal-dialog demo-video-modal">
        <div className="tutorial-prompt-top">
          <span className="tutorial-prompt-badge">
            <Film size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{copy.demoModalBadge}</span>
          </span>
          <button
            id="demo-video-close-x"
            type="button"
            className="modal-close-btn"
            onClick={handleDismissAction}
            aria-label={isGate ? copy.gateSkipBtn : copy.demoModalClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="demo-video-head">
          <h2 id="demo-video-modal-title" className="tutorial-prompt-title">
            {copy.demoModalTitle}
          </h2>
          <p className="tutorial-prompt-sub">
            {isGate ? copy.demoModalSub : copy.demoModalReplaySub}
          </p>
        </div>

        <div className="demo-video-stage">
          <div className="demo-video-frame">
            <video
              ref={videoRef}
              id="demo-video-player"
              className="demo-video-player"
              src="/demo.mp4"
              controls
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => {
                e.currentTarget.volume = 0.5;
              }}
              onVolumeChange={(e) => {
                if (!e.currentTarget.muted && e.currentTarget.volume > 0) {
                  setNeedsUnmuteTap(false);
                }
              }}
              onEnded={() => {
                if (isGate) {
                  onContinueToPrompt?.();
                }
              }}
            />
          </div>

          {needsUnmuteTap && (
            <button
              id="demo-unmute-btn"
              type="button"
              className="demo-unmute-pill"
              onClick={handleEnableSound50}
            >
              <Volume2 size={14} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.unmuteAudioBtn}</span>
            </button>
          )}
        </div>

        {isGate ? (
          <div className="demo-gate-actions">
            <button
              id="demo-gate-continue-btn"
              type="button"
              className="btn-primary-gradient tutorial-opt-btn demo-gate-primary"
              data-sound="action"
              onClick={onContinueToPrompt}
            >
              <span>{copy.gateContinueBtn}</span>
              <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="tutorial-prompt-actions">
            <button
              id="demo-modal-close-btn"
              type="button"
              className="btn-soft-gray tutorial-opt-btn"
              onClick={onClose}
            >
              <span>{copy.demoModalClose}</span>
            </button>
            <button
              id="demo-modal-start-tour-btn"
              type="button"
              className="btn-primary-gradient tutorial-opt-btn"
              data-sound="action"
              onClick={() => {
                onClose?.();
                onStartTutorial?.('full');
              }}
            >
              <Compass size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.demoModalStartTour}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

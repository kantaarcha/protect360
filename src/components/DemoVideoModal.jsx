import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Compass, FastForward, Volume2, X } from 'lucide-react';
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
  const [videoEnded, setVideoEnded] = useState(false);

  const isGate = mode === 'gate';

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
      className="tutorial-prompt-backdrop demo-video-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={copy.demoModalTitle}
    >
      <div id="demo-video-modal" className="demo-video-modal">
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
              onPlay={() => {
                setVideoEnded(false);
              }}
              onEnded={() => {
                setVideoEnded(true);
              }}
            />
          </div>

          {needsUnmuteTap && (
            <button
              id="demo-unmute-btn"
              type="button"
              className="demo-unmute-pill demo-unmute-pill--floating"
              onClick={handleEnableSound50}
            >
              <Volume2 size={14} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.unmuteAudioBtn}</span>
            </button>
          )}
        </div>

        <div className="demo-floating-actions">
          {isGate ? (
            videoEnded ? (
              <button
                id="demo-gate-continue-btn"
                type="button"
                className="btn-primary-gradient demo-tutorial-cta-btn"
                data-sound="action"
                onClick={onContinueToPrompt}
              >
                <Compass size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>{copy.gateEndedToTutorialBtn}</span>
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            ) : (
              <button
                id="demo-gate-skip-btn"
                type="button"
                className="demo-skip-btn"
                onClick={onContinueToPrompt}
              >
                <FastForward size={14} strokeWidth={2.2} aria-hidden="true" />
                <span>{copy.gateSkipBtn}</span>
              </button>
            )
          ) : videoEnded ? (
            <>
              <button
                id="demo-modal-close-btn"
                type="button"
                className="demo-skip-btn"
                onClick={onClose}
              >
                <X size={14} strokeWidth={2.2} aria-hidden="true" />
                <span>{copy.demoModalClose}</span>
              </button>
              <button
                id="demo-modal-start-tour-btn"
                type="button"
                className="btn-primary-gradient demo-tutorial-cta-btn"
                data-sound="action"
                onClick={() => {
                  onClose?.();
                  onStartTutorial?.('full');
                }}
              >
                <Compass size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>{copy.replayEndedToTutorialBtn}</span>
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </>
          ) : (
            <button
              id="demo-modal-close-btn"
              type="button"
              className="demo-skip-btn"
              onClick={onClose}
            >
              <X size={14} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.demoModalClose}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

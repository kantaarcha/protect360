import { useEffect } from 'react';
import { Compass, Film, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TUTORIAL_UI_COPY } from '../data/tutorialSteps';

export default function DemoVideoModal({ onClose, onStartTutorial }) {
  const { lang } = useLanguage();
  const copy = TUTORIAL_UI_COPY[lang] || TUTORIAL_UI_COPY.TH;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="tutorial-prompt-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-video-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
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
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="demo-video-head">
          <h2 id="demo-video-modal-title" className="tutorial-prompt-title">
            {copy.demoModalTitle}
          </h2>
          <p className="tutorial-prompt-sub">{copy.demoModalSub}</p>
        </div>

        <div className="demo-video-frame">
          <video
            id="demo-video-player"
            className="demo-video-player"
            src="/demo.mp4"
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
          />
        </div>

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
      </div>
    </div>
  );
}

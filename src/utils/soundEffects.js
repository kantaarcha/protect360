/**
 * Subtle, zero-dependency Web Audio API sound effects for PROTECT360.
 * Features 3 distinct FinTech / playful tones:
 *  - 'tap'   : soft glassy marimba tick for navigation, tabs, and standard buttons
 *  - 'chime' : uplifting two-note save/export/success shimmer
 *  - 'action': crisp playful upward pop for game decisions, slips, and key CTAs
 */

const SOUND_STORAGE_KEY = 'protect360_sound_enabled';

let audioCtx = null;

export function isSoundEnabled() {
  try {
    const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
    if (saved === '0') return false;
  } catch {
    // Ignore storage access errors
  }
  return true;
}

export function setSoundEnabled(enabled) {
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? '1' : '0');
  } catch {
    // Ignore storage access errors
  }
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playUiSound(kind = 'tap', { force = false } = {}) {
  if (!force && !isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (kind === 'chime') {
      // Cozy ascending two-note bell (C6 -> G6) for saving, exporting, and success confirmations
      const notes = [
        { freq: 523.25, delay: 0, duration: 0.14, peak: 0.06 },
        { freq: 783.99, delay: 0.065, duration: 0.19, peak: 0.075 },
      ];
      for (const n of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.delay);
        gain.gain.setValueAtTime(0.0001, now + n.delay);
        gain.gain.exponentialRampToValueAtTime(n.peak, now + n.delay + 0.014);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + n.duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.delay);
        osc.stop(now + n.delay + n.duration + 0.01);
      }
      return;
    }

    if (kind === 'action') {
      // Crisp elastic pop + sparkle for Survival Lab actions, slip presets, and primary starts
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.065);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.075, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.105);
      return;
    }

    // Default 'tap': gentle glassy marimba click for tabs and standard controls
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.032);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  } catch {
    // Gracefully ignore audio errors in headless or restricted contexts
  }
}

export function inferButtonSoundKind(buttonEl) {
  if (!buttonEl) return null;
  const explicit = buttonEl.getAttribute('data-sound');
  if (explicit === 'none') return null;
  if (explicit === 'tap' || explicit === 'chime' || explicit === 'action') return explicit;

  const id = buttonEl.id || '';
  if (
    buttonEl.classList.contains('ak-excel-green') ||
    buttonEl.classList.contains('ak-csv-btn') ||
    buttonEl.classList.contains('btn-primary-gradient') ||
    id === 'save-profile-btn' ||
    id === 'onboarding-finish-btn' ||
    id === 'export-json-btn' ||
    id === 'settings-export-excel-btn' ||
    id === 'load-sample-scenario-btn' ||
    id === 'save-custom-cat-btn'
  ) {
    return 'chime';
  }

  if (
    id === 'onboarding-start-btn' ||
    buttonEl.classList.contains('hero-log-cta') ||
    buttonEl.classList.contains('gm-choice-btn') ||
    buttonEl.classList.contains('gm-start-btn') ||
    buttonEl.classList.contains('ak-slip-preset-btn') ||
    buttonEl.classList.contains('ak-cat-pill') ||
    id === 'manual-add-submit-btn' ||
    id === 'add-coverage-btn'
  ) {
    return 'action';
  }

  return 'tap';
}

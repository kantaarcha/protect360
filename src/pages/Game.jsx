import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FastForward,
  HeartPulse,
  Info,
  Lock,
  MessageSquareCheck,
  Minus,
  Play,
  Plus,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import LiquidTabs from '../components/LiquidTabs';
import PixelAvatarStage from '../components/PixelAvatarStage';
import {
  ACCESSORY_BY_ID,
  ACCESSORY_OPTIONS,
  ACCESSORY_SLOTS,
  deriveAvatarSceneAndState,
  GENDER_OPTIONS,
  getAccessoryConflict,
  HAIR_PALETTES,
  HAIR_STYLE_OPTIONS,
  loadSavedAvatarConfig,
  OUTFIT_PALETTES,
  ROOM_THEMES,
  sanitizeAccessories,
  saveAvatarConfig,
  SKIN_PALETTES,
} from '../utils/pixelAvatar';
import {
  DEFAULT_CHALLENGE_PERSONA,
  DURATION_PRESETS,
  HR_GROUP_INSURANCE_BONUS,
  buildEventDeck,
  buildUserPersona,
  clamp,
  computeFinalScorecard,
  computeProtectionPool,
  getChoicesForEvent,
  getEstimatedPlayTimeRange,
  getTotalMonthsForDuration,
  getTurnRangeForDuration,
  resolveTurn,
  rollMonthlyEventPlan,
  roundCustomDays,
} from '../utils/gameEngine';

function getRangePct(value, min, max) {
  if (max <= min) return 0;
  return clamp(Math.round(((value - min) / (max - min)) * 100), 0, 100);
}

function getInitialAllocations(persona) {
  const surplus = Math.max(0, persona.monthlyIncome - persona.monthlyExpenses);
  const maxProt = Math.min(surplus, Math.round(persona.monthlyIncome * 0.15));
  const defaultProt = Math.min(maxProt, Math.round((surplus * 0.2) / 100) * 100);
  const defaultEmerg = Math.min(
    surplus - defaultProt,
    Math.round((surplus * 0.5) / 100) * 100
  );
  const defaultLife = Math.max(0, surplus - defaultProt - defaultEmerg);
  return {
    emergency: defaultEmerg,
    protection: defaultProt,
    lifestyle: defaultLife,
  };
}

export default function Game({ onNavigate }) {
  const { lang, t } = useLanguage();
  const {
    userProfile,
    monthlyIncome,
    monthlyExpenses,
    emergencyFund,
    coverageItems,
  } = useFinance();

  // Build Option A (Actual PROTECT360 Profile) dynamically from FinanceContext
  const userPersona = useMemo(
    () =>
      buildUserPersona({
        userProfile,
        monthlyIncome,
        monthlyExpenses,
        emergencyFund,
        coverageItems,
      }),
    [userProfile, monthlyIncome, monthlyExpenses, emergencyFund, coverageItems]
  );

  // Phase: 'lobby' | 'playing' | 'results'
  const [phase, setPhase] = useState('lobby');

  // Lobby Setup State
  const [durationUnit, setDurationUnit] = useState('days'); // 'days' | 'months'
  const [durationValue, setDurationValue] = useState(30); // default Express 30 days
  const [durationInput, setDurationInput] = useState('30');
  const [roundedNotice, setRoundedNotice] = useState(null);
  const [personaMode, setPersonaMode] = useState('default'); // 'profile' | 'default'
  const [askedHr, setAskedHr] = useState(false);

  // Stardew-style Paper-Doll Pixel Character state (persisted locally under protect360_avatar_v1)
  const [avatarConfig, setAvatarConfig] = useState(() => loadSavedAvatarConfig());
  const [avatarPreviewMood, setAvatarPreviewMood] = useState('steady'); // 'steady' | 'struggling' | 'cast' | 'prosperous'
  const [openStudioMenu, setOpenStudioMenu] = useState(null); // null | 'hair' | 'accessories' | 'theme'
  const studioRef = useRef(null);

  useEffect(() => {
    if (!openStudioMenu) return undefined;
    const handleOutside = (e) => {
      if (studioRef.current && !studioRef.current.contains(e.target)) {
        setOpenStudioMenu(null);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpenStudioMenu(null);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [openStudioMenu]);

  const updateAvatarConfig = (patch) => {
    setAvatarConfig((prev) => {
      const next = { ...prev, ...patch };
      saveAvatarConfig(next);
      return next;
    });
  };

  const toggleAvatarAccessory = (accId) => {
    setAvatarConfig((prev) => {
      const current = sanitizeAccessories(prev.accessories || []);
      let nextAcc;
      if (current.includes(accId)) {
        nextAcc = current.filter((id) => id !== accId);
      } else {
        if (getAccessoryConflict(current, accId)) return prev;
        nextAcc = [...current, accId];
      }
      const next = { ...prev, accessories: nextAcc };
      saveAvatarConfig(next);
      return next;
    });
  };

  const activePersona = personaMode === 'profile' ? userPersona : DEFAULT_CHALLENGE_PERSONA;
  const monthlySurplus = Math.max(0, activePersona.monthlyIncome - activePersona.monthlyExpenses);
  const safeProtectionCap = Math.min(
    monthlySurplus,
    Math.round(activePersona.monthlyIncome * 0.15)
  );
  const recommendedProtMin = Math.round(activePersona.monthlyIncome * 0.04);
  const recommendedProtMax = Math.round(activePersona.monthlyIncome * 0.15);

  const [allocations, setAllocations] = useState(() =>
    getInitialAllocations(DEFAULT_CHALLENGE_PERSONA)
  );

  // Active Game Run State
  const [runConfig, setRunConfig] = useState(null);
  const [deck, setDeck] = useState([]);
  const [lastRunEventIds, setLastRunEventIds] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [lastTurnResult, setLastTurnResult] = useState(null);
  const [hudPulseKey, setHudPulseKey] = useState(0);

  const turnRange = useMemo(
    () => getTurnRangeForDuration(durationUnit, durationValue),
    [durationUnit, durationValue]
  );

  const estimatedPlayTime = useMemo(
    () => getEstimatedPlayTimeRange(turnRange.minTurns, turnRange.maxTurns),
    [turnRange.minTurns, turnRange.maxTurns]
  );

  const previewProtectionPool = useMemo(
    () =>
      computeProtectionPool({
        existingProtectionLimit: activePersona.existingProtectionLimit,
        monthlyProtectionBudget: allocations.protection,
        askedHr,
      }),
    [activePersona.existingProtectionLimit, allocations.protection, askedHr]
  );

  const syncDuration = (nextVal) => {
    setDurationValue(nextVal);
    setDurationInput(String(nextVal));
    setRoundedNotice(null);
  };

  // Switch between Days and Months cleanly
  const handleUnitChange = (nextUnit) => {
    if (nextUnit === durationUnit) return;
    setDurationUnit(nextUnit);
    if (nextUnit === 'months') {
      const approxMonths = clamp(Math.round(durationValue / 30), 1, 12);
      syncDuration(approxMonths);
    } else {
      const mapDays = { 1: 30, 3: 90, 6: 180, 12: 365 };
      const nextDays = mapDays[durationValue] || roundCustomDays(durationValue * 30);
      syncDuration(nextDays);
    }
  };

  const handleSelectPreset = (preset) => {
    syncDuration(durationUnit === 'days' ? preset.days : preset.months);
  };

  const handleStepDuration = (delta) => {
    if (durationUnit === 'days') {
      syncDuration(clamp(durationValue + delta, 5, 365));
    } else {
      syncDuration(clamp(durationValue + delta, 1, 12));
    }
  };

  const handleDurationTextChange = (raw) => {
    const digitsOnly = String(raw || '').replace(/[^\d]/g, '').slice(0, 3);
    setDurationInput(digitsOnly);
    setRoundedNotice(null);
  };

  const commitDurationInput = () => {
    const parsed = parseInt(durationInput, 10);
    if (durationUnit === 'days') {
      if (!Number.isFinite(parsed) || parsed <= 0) {
        syncDuration(5);
        return;
      }
      const rounded = roundCustomDays(parsed);
      setDurationValue(rounded);
      setDurationInput(String(rounded));
      if (rounded !== parsed) {
        setRoundedNotice({ from: parsed, to: rounded });
      } else {
        setRoundedNotice(null);
      }
    } else {
      const clampedMo = clamp(Number.isFinite(parsed) && parsed > 0 ? parsed : 1, 1, 12);
      syncDuration(clampedMo);
    }
  };

  const handleSelectPersona = (nextMode) => {
    setPersonaMode(nextMode);
    const nextP = nextMode === 'profile' ? userPersona : DEFAULT_CHALLENGE_PERSONA;
    setAllocations(getInitialAllocations(nextP));
  };

  // Linked 3-bucket slider allocation that always stays within monthlySurplus
  const handleAllocationChange = (bucket, rawVal) => {
    if (monthlySurplus <= 0) {
      setAllocations({ emergency: 0, protection: 0, lifestyle: 0 });
      return;
    }

    const maxForBucket = bucket === 'protection' ? safeProtectionCap : monthlySurplus;
    const nextVal = clamp(Math.round(Number(rawVal) || 0), 0, maxForBucket);

    setAllocations((prev) => {
      const next = { ...prev, [bucket]: nextVal };
      const otherKeys = ['emergency', 'protection', 'lifestyle'].filter((k) => k !== bucket);
      const remaining = monthlySurplus - nextVal;
      const otherSum = prev[otherKeys[0]] + prev[otherKeys[1]];

      if (otherSum <= 0) {
        // Put remainder into emergency first (or lifestyle if editing emergency)
        const primaryOther = bucket === 'emergency' ? 'lifestyle' : 'emergency';
        const secondaryOther = otherKeys.find((k) => k !== primaryOther);
        next[primaryOther] = remaining;
        next[secondaryOther] = 0;
      } else {
        // Scale the other two proportionally, respecting protection cap
        let a = Math.round((prev[otherKeys[0]] / otherSum) * remaining);
        let b = remaining - a;

        if (otherKeys[0] === 'protection' && a > safeProtectionCap) {
          a = safeProtectionCap;
          b = remaining - a;
        } else if (otherKeys[1] === 'protection' && b > safeProtectionCap) {
          b = safeProtectionCap;
          a = remaining - b;
        }

        next[otherKeys[0]] = Math.max(0, a);
        next[otherKeys[1]] = Math.max(0, b);
      }

      return next;
    });
  };

  // Start Simulation — rolls 3, 4, 5, or 6 events independently for each simulated month
  const handleStartGame = () => {
    const parsedDraft = parseInt(durationInput, 10);
    const effectiveDuration =
      durationUnit === 'days'
        ? Number.isFinite(parsedDraft) && parsedDraft > 0
          ? roundCustomDays(parsedDraft)
          : durationValue
        : Number.isFinite(parsedDraft) && parsedDraft > 0
          ? clamp(parsedDraft, 1, 12)
          : durationValue;
    if (effectiveDuration !== durationValue) {
      setDurationValue(effectiveDuration);
      setDurationInput(String(effectiveDuration));
    }

    const eventPlan = rollMonthlyEventPlan(durationUnit, effectiveDuration);
    const turns = eventPlan.totalTurns;
    const totalMonths = getTotalMonthsForDuration(durationUnit, effectiveDuration);
    const monthsPerTurn = totalMonths / turns;

    const playerFirstName = (userProfile?.firstName || '').trim() || 'First Jobber';

    const config = {
      unit: durationUnit,
      durationValue: effectiveDuration,
      monthsCount: eventPlan.monthsCount,
      monthlyCounts: eventPlan.monthlyCounts,
      totalTurns: turns,
      totalMonths,
      monthsPerTurn,
      persona: { ...activePersona, displayName: playerFirstName },
      allocEmergency: allocations.emergency,
      allocProtection: allocations.protection,
      allocLifestyle: allocations.lifestyle,
      askedHr,
      startingProtectionPool: previewProtectionPool,
    };

    const eventDeck = buildEventDeck(eventPlan.monthlyCounts, activePersona, lastRunEventIds);
    const initialPeace = clamp(
      70 + (activePersona.emergencyFund >= activePersona.monthlyExpenses ? 8 : 0) + (askedHr ? 5 : 0),
      55,
      90
    );

    setRunConfig(config);
    setDeck(eventDeck);
    setLastRunEventIds(eventDeck.map((ev) => ev.id));
    setGameState({
      turnIndex: 0,
      cash: activePersona.emergencyFund,
      debt: 0,
      peace: initialPeace,
      protectionRemaining: previewProtectionPool,
      totalProtectionAbsorbed: 0,
      totalInterestPaid: 0,
      installmentBalance: 0,
      injuryType: 'none',
      injuryTurnsLeft: 0,
      history: [],
    });
    setLastTurnResult(null);
    setHudPulseKey((k) => k + 1);
    setPhase('playing');
  };

  // Player picks an action on the current event
  const handlePickChoice = (choice) => {
    if (!gameState || !runConfig || lastTurnResult) return;
    const currentEvent = deck[gameState.turnIndex];
    if (!currentEvent) return;

    const { nextState, logEntry } = resolveTurn({
      state: gameState,
      event: currentEvent,
      choice,
      config: runConfig,
    });

    // Derive multi-turn pixel status effect (e.g. leg/arm cast lasts 2–3 turns after accident)
    let nextInjuryType = gameState.injuryType || 'none';
    let nextInjuryTurns = Math.max(0, (gameState.injuryTurnsLeft || 0) - 1);
    if (nextInjuryTurns === 0) nextInjuryType = 'none';

    if (currentEvent.id?.includes('fracture') || currentEvent.id?.includes('sprain')) {
      nextInjuryType = 'leg_cast';
      nextInjuryTurns = 3;
    } else if (currentEvent.category === 'accident') {
      nextInjuryType = 'arm_cast';
      nextInjuryTurns = 3;
    } else if (currentEvent.category === 'medical') {
      nextInjuryType = 'medical_mask';
      nextInjuryTurns = 2;
    } else if (currentEvent.category === 'windfall') {
      nextInjuryType = 'windfall';
      nextInjuryTurns = 1;
    }

    setGameState({
      ...nextState,
      injuryType: nextInjuryType,
      injuryTurnsLeft: nextInjuryTurns,
    });
    setLastTurnResult({
      ...logEntry,
      eventId: currentEvent.id,
      eventCategory: currentEvent.category,
    });
    setHudPulseKey((k) => k + 1);
  };

  // Advance after reading the 1-sentence actuarial feedback
  const handleNextTurn = () => {
    if (!gameState || !runConfig) return;
    setLastTurnResult(null);
    if (gameState.turnIndex >= runConfig.totalTurns) {
      setPhase('results');
    }
  };

  // Fast-Forward remaining turns automatically (ideal for judges / timed demos)
  const handleFastForward = () => {
    if (!gameState || !runConfig) return;
    let simState = gameState;
    while (simState.turnIndex < runConfig.totalTurns) {
      const ev = deck[simState.turnIndex];
      const choices = getChoicesForEvent(ev, simState);
      const bestChoice = choices.find((c) => c.recommended) || choices[0];
      const { nextState } = resolveTurn({
        state: simState,
        event: ev,
        choice: bestChoice,
        config: runConfig,
      });
      simState = nextState;
    }
    setGameState(simState);
    setLastTurnResult(null);
    setPhase('results');
  };

  const handleBackToLobby = () => {
    setLastTurnResult(null);
    setPhase('lobby');
  };

  const unitTabItems = useMemo(
    () => [
      { id: 'days', label: lang === 'TH' ? 'รายวัน' : 'Days' },
      { id: 'months', label: lang === 'TH' ? 'รายเดือน' : 'Months' },
    ],
    [lang]
  );

  // Current playing turn derived display
  const currentEvent =
    phase === 'playing' && gameState && !lastTurnResult
      ? deck[gameState.turnIndex]
      : null;

  const currentChoices = useMemo(() => {
    if (!currentEvent || !gameState) return [];
    return getChoicesForEvent(currentEvent, gameState);
  }, [currentEvent, gameState]);

  const timelineProgress = useMemo(() => {
    if (!runConfig || !gameState) return { currentLabel: '', pct: 0, turnLabel: '' };
    const completedTurns = gameState.turnIndex;
    const displayStep = lastTurnResult
      ? completedTurns
      : Math.min(runConfig.totalTurns, completedTurns + 1);
    const activeIdx = Math.min(deck.length - 1, Math.max(0, displayStep - 1));
    const activeCard = deck[activeIdx];
    const ratio = displayStep / runConfig.totalTurns;
    const elapsedVal = Math.max(1, Math.round(runConfig.durationValue * ratio));

    const currentLabel =
      runConfig.unit === 'days'
        ? lang === 'TH'
          ? `วันที่ ${elapsedVal}/${runConfig.durationValue} • เดือน ${activeCard?.monthNumber || 1} (${activeCard?.eventInMonth || 1}/${activeCard?.eventsInMonth || runConfig.totalTurns})`
          : `Day ${elapsedVal}/${runConfig.durationValue} • Mo ${activeCard?.monthNumber || 1} (${activeCard?.eventInMonth || 1}/${activeCard?.eventsInMonth || runConfig.totalTurns})`
        : lang === 'TH'
          ? `เดือนที่ ${activeCard?.monthNumber || 1}/${runConfig.monthsCount || runConfig.durationValue} • เหตุการณ์ในเดือน ${activeCard?.eventInMonth || 1}/${activeCard?.eventsInMonth || 3}`
          : `Month ${activeCard?.monthNumber || 1}/${runConfig.monthsCount || runConfig.durationValue} • Event ${activeCard?.eventInMonth || 1}/${activeCard?.eventsInMonth || 3}`;

    return {
      currentLabel,
      pct: Math.round((completedTurns / runConfig.totalTurns) * 100),
      turnLabel:
        lang === 'TH'
          ? `เหตุการณ์รวม ${Math.min(runConfig.totalTurns, displayStep)} / ${runConfig.totalTurns}`
          : `Event ${Math.min(runConfig.totalTurns, displayStep)} / ${runConfig.totalTurns}`,
    };
  }, [runConfig, gameState, lastTurnResult, deck, lang]);

  const scorecard = useMemo(() => {
    if (phase !== 'results' || !gameState || !runConfig) return null;
    return computeFinalScorecard({ state: gameState, config: runConfig });
  }, [phase, gameState, runConfig]);

  const liveAvatarVisuals = useMemo(() => {
    if (phase === 'lobby') {
      if (avatarPreviewMood === 'struggling') {
        return { wealthTier: 'struggling', sceneType: 'rainy_street', injury: 'none' };
      }
      if (avatarPreviewMood === 'cast') {
        return { wealthTier: 'steady', sceneType: 'hospital', injury: 'leg_cast' };
      }
      if (avatarPreviewMood === 'prosperous') {
        return { wealthTier: 'prosperous', sceneType: 'celebration', injury: 'windfall' };
      }
      return { wealthTier: 'steady', sceneType: 'office_room', injury: 'none' };
    }
    return deriveAvatarSceneAndState({
      event: currentEvent,
      lastTurnResult,
      cash: gameState?.cash ?? activePersona.emergencyFund,
      debt: gameState?.debt ?? 0,
      peace: gameState?.peace ?? 70,
      monthlyExpenses: runConfig?.persona?.monthlyExpenses ?? activePersona.monthlyExpenses,
      injuryType: gameState?.injuryType ?? 'none',
      injuryTurnsLeft: gameState?.injuryTurnsLeft ?? 0,
      phase,
      isResilient: Boolean(scorecard?.isResilient),
    });
  }, [
    phase,
    avatarPreviewMood,
    currentEvent,
    lastTurnResult,
    gameState,
    runConfig,
    activePersona,
    scorecard,
  ]);

  // Stacked allocation percentages for Lobby visual bar
  const allocPcts = useMemo(() => {
    if (monthlySurplus <= 0) return { emergency: 0, protection: 0, lifestyle: 0 };
    const e = Math.round((allocations.emergency / monthlySurplus) * 100);
    const p = Math.round((allocations.protection / monthlySurplus) * 100);
    const l = Math.max(0, 100 - e - p);
    return { emergency: e, protection: p, lifestyle: l };
  }, [allocations, monthlySurplus]);

  return (
    <div className="gm-page">
      {/* Compact 3-Step Phase Bar */}
      <section className="bento-card gm-top-strip" aria-label="Simulation stage">
        <p className="gm-stage-hint">
          {lang === 'TH'
            ? 'เลือกระยะเวลาและแบ่งงบให้พร้อม แล้วลองรับมือเหตุการณ์สุ่มจริง'
            : 'Set your duration and budget split, then navigate randomized life events.'}
        </p>

        <div className="gm-phase-stepper" role="list" aria-label="Game phases">
          {[
            { id: 'lobby', num: 1, th: 'ตั้งค่าเกม', en: 'Setup' },
            { id: 'playing', num: 2, th: 'เผชิญเหตุการณ์', en: 'Play' },
            { id: 'results', num: 3, th: 'สรุปคะแนน', en: 'Results' },
          ].map((step) => {
            const isActive = phase === step.id;
            const isDone =
              (phase === 'playing' && step.id === 'lobby') ||
              (phase === 'results' && step.id !== 'results');
            return (
              <span
                key={step.id}
                role="listitem"
                className={`gm-phase-pill ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              >
                <span className="gm-phase-num">{step.num}</span>
                <span>{lang === 'TH' ? step.th : step.en}</span>
              </span>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* PHASE 1: CUSTOMIZABLE GAME SETUP (BENTO LOBBY)                        */}
      {/* ===================================================================== */}
      {phase === 'lobby' && (
        <div className="gm-lobby-stack">
          <div className="gm-lobby-top-grid">
            {/* 1. Duration Selector Card */}
            <section className="bento-card gm-card">
              <div className="gm-card-head">
                <div className="gm-card-title-row">
                  <span className="gm-icon-badge blue">
                    <Clock size={18} strokeWidth={2.1} />
                  </span>
                  <div>
                    <h2 className="gm-card-title">
                      {lang === 'TH' ? '1. เลือกระยะเวลาจำลอง' : '1. Choose Simulation Duration'}
                    </h2>
                    <p className="gm-card-sub">
                      {lang === 'TH'
                        ? 'เลือกโหมดด่วนสำหรับเดโม่เร็ว หรือโหมดยาวเพื่อทดสอบความอึดทางการเงิน'
                        : 'Pick Express for a 45-sec demo or Full Year for a deep stress test.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="gm-unit-tabs-wrap">
                <LiquidTabs
                  tabs={unitTabItems}
                  activeId={durationUnit}
                  onChange={handleUnitChange}
                  variant="compact"
                  idPrefix="gm-duration-unit"
                  ariaLabel={lang === 'TH' ? 'หน่วยระยะเวลาเกม' : 'Duration unit'}
                />
              </div>

              {/* 4 Quick-Pick Presets */}
              <div className="gm-preset-grid">
                {DURATION_PRESETS.map((preset) => {
                  const targetVal = durationUnit === 'days' ? preset.days : preset.months;
                  const isSelected = durationValue === targetVal;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`gm-preset-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      <div className="gm-preset-top">
                        <strong className="gm-preset-val tabular-nums">
                          {t(durationUnit === 'days' ? preset.labelDays : preset.labelMonths)}
                        </strong>
                        <span className="gm-preset-tag">{t(preset.tag)}</span>
                      </div>
                      <span className="gm-preset-desc">{t(preset.desc)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Slider & Direct Number Input */}
              <div className="gm-custom-duration-box">
                <div className="gm-custom-dur-head">
                  <span className="gm-label-muted">
                    {lang === 'TH' ? 'พิมพ์หรือเลื่อนปรับระยะเวลาเอง' : 'Type or Slide Custom Duration'}
                  </span>
                  <div className="gm-stepper-group tabular-nums">
                    <button
                      type="button"
                      className="gm-step-btn"
                      onClick={() => handleStepDuration(durationUnit === 'days' ? -5 : -1)}
                      aria-label="Decrease duration"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="gm-dur-input-wrap">
                      <input
                        id="gm-custom-duration-input"
                        type="text"
                        inputMode="numeric"
                        className="gm-dur-input tabular-nums"
                        value={durationInput}
                        onChange={(e) => handleDurationTextChange(e.target.value)}
                        onBlur={commitDurationInput}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                        aria-label={
                          durationUnit === 'days'
                            ? lang === 'TH'
                              ? 'ระบุจำนวนวัน'
                              : 'Enter number of days'
                            : lang === 'TH'
                              ? 'ระบุจำนวนเดือน'
                              : 'Enter number of months'
                        }
                      />
                      <span className="gm-dur-unit-lbl">
                        {durationUnit === 'days'
                          ? lang === 'TH'
                            ? 'วัน'
                            : 'days'
                          : lang === 'TH'
                            ? 'เดือน'
                            : 'mo.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="gm-step-btn"
                      onClick={() => handleStepDuration(durationUnit === 'days' ? 5 : 1)}
                      aria-label="Increase duration"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  className="inv-range gm-range tone-blue"
                  min={durationUnit === 'days' ? 5 : 1}
                  max={durationUnit === 'days' ? 365 : 12}
                  step={durationUnit === 'days' ? 5 : 1}
                  value={durationValue}
                  style={{
                    '--range-pct': `${getRangePct(
                      durationValue,
                      durationUnit === 'days' ? 5 : 1,
                      durationUnit === 'days' ? 365 : 12
                    )}%`,
                  }}
                  onChange={(e) => syncDuration(Number(e.target.value))}
                  aria-label="Custom simulation duration"
                />

                <div className="gm-dur-meta-row tabular-nums">
                  <span>
                    <Calendar size={13} aria-hidden="true" />{' '}
                    {lang === 'TH'
                      ? `สุ่ม ${turnRange.minTurns}–${turnRange.maxTurns} เหตุการณ์ (3–6/เดือน) • เล่นประมาณ ${t(estimatedPlayTime)}`
                      : `Random ${turnRange.minTurns}–${turnRange.maxTurns} events (3–6/mo) • Est. ${t(estimatedPlayTime)}`}
                  </span>
                  {roundedNotice ? (
                    <span className="gm-rounded-pill">
                      {lang === 'TH'
                        ? `ปัด ${roundedNotice.from} → ${roundedNotice.to} วันอัตโนมัติ`
                        : `Auto-rounded ${roundedNotice.from} → ${roundedNotice.to} days`}
                    </span>
                  ) : durationUnit === 'days' ? (
                    <span className="gm-shock-guarantee">
                      {lang === 'TH'
                        ? 'พิมพ์วันได้ (ปัดขึ้นทีละ 5 วัน)'
                        : 'Type any day (rounds up to 5s)'}
                    </span>
                  ) : (
                    <span className="gm-shock-guarantee">
                      {lang === 'TH' ? 'พิมพ์ได้ 1–12 เดือน' : 'Type 1–12 months'}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* 2. Starting Persona Selector Card */}
            <section className="bento-card gm-card">
              <div className="gm-card-head">
                <div className="gm-card-title-row">
                  <span className="gm-icon-badge navy">
                    <User size={18} strokeWidth={2.1} />
                  </span>
                  <div>
                    <h2 className="gm-card-title">
                      {lang === 'TH' ? '2. เลือกข้อมูลตั้งต้นของผู้เล่น' : '2. Choose Starting Persona'}
                    </h2>
                    <p className="gm-card-sub">
                      {lang === 'TH'
                        ? 'ใช้ตัวเลขจริงจากบัญชี PROTECT360 ของคุณ หรือลองบทบาท First Jobber มาตรฐาน'
                        : 'Play with your real PROTECT360 numbers or try the classic First Jobber challenge.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="gm-persona-grid">
                {/* Option A: Real Profile */}
                <button
                  type="button"
                  className={`gm-persona-card ${personaMode === 'profile' ? 'active' : ''}`}
                  onClick={() => handleSelectPersona('profile')}
                >
                  <div className="gm-persona-head">
                    <span className="gm-persona-badge blue">
                      {lang === 'TH' ? 'ตัวเลือก A • ข้อมูลจริง' : 'Option A • Live Data'}
                    </span>
                    {personaMode === 'profile' && (
                      <CheckCircle2 size={17} className="gm-persona-check" />
                    )}
                  </div>
                  <h3 className="gm-persona-name">
                    {lang === 'TH'
                      ? `ใช้ข้อมูลจริงของ ${userPersona.displayName}`
                      : `Use ${userPersona.displayName}'s Profile`}
                  </h3>
                  <div className="gm-persona-stats tabular-nums">
                    <div>
                      <span>{lang === 'TH' ? 'รายรับ/ด.' : 'Income/mo'}</span>
                      <strong className="text-green">{formatTHB(userPersona.monthlyIncome)}</strong>
                    </div>
                    <div>
                      <span>{lang === 'TH' ? 'รายจ่าย/ด.' : 'Expense/mo'}</span>
                      <strong className="text-red">{formatTHB(userPersona.monthlyExpenses)}</strong>
                    </div>
                    <div>
                      <span>{lang === 'TH' ? 'เงินสำรอง' : 'Reserve'}</span>
                      <strong className="text-blue">{formatTHB(userPersona.emergencyFund)}</strong>
                    </div>
                  </div>
                  <p className="gm-persona-cov">{t(userPersona.coverageSummary)}</p>
                </button>

                {/* Option B: Default First Jobber Challenge */}
                <button
                  id="gm-persona-default-btn"
                  type="button"
                  className={`gm-persona-card ${personaMode === 'default' ? 'active' : ''}`}
                  onClick={() => handleSelectPersona('default')}
                >
                  <div className="gm-persona-head">
                    <span className="gm-persona-badge neutral">
                      {lang === 'TH' ? 'ตัวเลือก B • โจทย์มาตรฐาน' : 'Option B • Challenge'}
                    </span>
                    {personaMode === 'default' && (
                      <CheckCircle2 size={17} className="gm-persona-check" />
                    )}
                  </div>
                  <h3 className="gm-persona-name">
                    {lang === 'TH'
                      ? 'บทบาท First Jobber เริ่มต้น'
                      : 'Default First Jobber Challenge'}
                  </h3>
                  <div className="gm-persona-stats tabular-nums">
                    <div>
                      <span>{lang === 'TH' ? 'รายรับ/ด.' : 'Income/mo'}</span>
                      <strong className="text-green">
                        {formatTHB(DEFAULT_CHALLENGE_PERSONA.monthlyIncome)}
                      </strong>
                    </div>
                    <div>
                      <span>{lang === 'TH' ? 'รายจ่าย/ด.' : 'Expense/mo'}</span>
                      <strong className="text-red">
                        {formatTHB(DEFAULT_CHALLENGE_PERSONA.monthlyExpenses)}
                      </strong>
                    </div>
                    <div>
                      <span>{lang === 'TH' ? 'เงินสำรอง' : 'Reserve'}</span>
                      <strong className="text-blue">
                        {formatTHB(DEFAULT_CHALLENGE_PERSONA.emergencyFund)}
                      </strong>
                    </div>
                  </div>
                  <p className="gm-persona-cov">{t(DEFAULT_CHALLENGE_PERSONA.coverageSummary)}</p>
                </button>
              </div>
            </section>
          </div>

          {/* Pixel Character Creator Studio (Stardew-style Layering matching PROTECT360 aesthetic) */}
          <section id="gm-avatar-studio" className="bento-card gm-card gm-avatar-studio-card">
            <div className="gm-card-head">
              <div className="gm-card-title-row">
                <span className="gm-icon-badge blue">
                  <Sparkles size={18} strokeWidth={2.1} />
                </span>
                <div>
                  <h2 className="gm-card-title">
                    {lang === 'TH'
                      ? 'ปรับแต่งตัวละคร Pixel ของคุณ (เปลี่ยนชุดและฉากตามสถานการณ์จริง)'
                      : 'Customize Your Pixel Character (Reacts Live to Wealth & Events)'}
                  </h2>
                  <p className="gm-card-sub">
                    {lang === 'TH'
                      ? 'เลือกเพศ สีผิว และทรงผม — ระหว่างเล่นตัวละครจะเปลี่ยนเสื้อผ้าตามฐานะ (เสื้อขาด / ปกติ / สูท) และใส่เฝือกหรือหน้ากากตามเหตุการณ์จริง'
                      : 'Choose silhouette, skin tone & hair — your character changes outfits by financial health and wears casts or recovery gear when events hit.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="gm-avatar-studio-grid">
              <div className="gm-avatar-preview-col">
                <PixelAvatarStage
                  avatarConfig={avatarConfig}
                  sceneType={liveAvatarVisuals.sceneType}
                  wealthTier={liveAvatarVisuals.wealthTier}
                  injury={liveAvatarVisuals.injury}
                />

                <div className="gm-mood-preview-row" role="group" aria-label="Preview condition">
                  {[
                    { id: 'steady', th: 'ชุดปกติ', en: 'Normal' },
                    { id: 'struggling', th: 'จน·เสื้อขาด', en: 'Tight/Torn' },
                    { id: 'cast', th: 'อุบัติเหตุ·เฝือก', en: 'Injury Cast' },
                    { id: 'prosperous', th: 'มั่งคั่ง·สูท', en: 'Wealthy Suit' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      id={`gm-avatar-mood-${m.id}`}
                      type="button"
                      className={`gm-mood-chip ${avatarPreviewMood === m.id ? 'active' : ''}`}
                      onClick={() => setAvatarPreviewMood(m.id)}
                    >
                      {lang === 'TH' ? m.th : m.en}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={studioRef} className="gm-avatar-controls-split">
                <div className="gm-avatar-subcol">
                  {/* Gender / Silhouette */}
                  <div className="gm-avatar-ctrl-row">
                    <span className="gm-avatar-ctrl-label">
                      {lang === 'TH' ? 'โครงร่าง / เพศ' : 'Silhouette'}
                    </span>
                    <div className="gm-avatar-pill-group">
                      {GENDER_OPTIONS.map((g) => (
                        <button
                          key={g.id}
                          id={`gm-avatar-gender-${g.id}`}
                          type="button"
                          className={`gm-avatar-opt-pill ${avatarConfig.gender === g.id ? 'active' : ''}`}
                          onClick={() => updateAvatarConfig({ gender: g.id })}
                        >
                          {lang === 'TH' ? g.th : g.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skin Tone */}
                  <div className="gm-avatar-ctrl-row">
                    <span className="gm-avatar-ctrl-label">
                      {lang === 'TH' ? 'สีผิว' : 'Skin Tone'}
                    </span>
                    <div className="gm-swatch-group">
                      {Object.values(SKIN_PALETTES).map((s) => (
                        <button
                          key={s.id}
                          id={`gm-avatar-skin-${s.id}`}
                          type="button"
                          className={`gm-color-swatch ${avatarConfig.skinTone === s.id ? 'active' : ''}`}
                          style={{ backgroundColor: s.base }}
                          title={lang === 'TH' ? s.th : s.en}
                          aria-label={lang === 'TH' ? s.th : s.en}
                          onClick={() => updateAvatarConfig({ skinTone: s.id })}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hair Style Dropdown (9 Styles) */}
                  <div className="gm-avatar-ctrl-row gm-dd-wrap">
                    <span className="gm-avatar-ctrl-label">
                      {lang === 'TH' ? `ทรงผม (${HAIR_STYLE_OPTIONS.length} ทรง)` : `Hairstyle (${HAIR_STYLE_OPTIONS.length})`}
                    </span>
                    {(() => {
                      const activeHair =
                        HAIR_STYLE_OPTIONS.find((h) => h.id === avatarConfig.hairStyle) ||
                        HAIR_STYLE_OPTIONS[0];
                      const isOpen = openStudioMenu === 'hair';
                      return (
                        <>
                          <button
                            id="gm-dd-hair-btn"
                            type="button"
                            className={`gm-dd-trigger ${isOpen ? 'open' : ''}`}
                            aria-expanded={isOpen}
                            onClick={() => setOpenStudioMenu(isOpen ? null : 'hair')}
                          >
                            <span className="gm-dd-trigger-text">
                              {lang === 'TH' ? activeHair.th : activeHair.en}
                            </span>
                            <ChevronDown size={15} className="gm-dd-chevron" aria-hidden="true" />
                          </button>
                          {isOpen && (
                            <div className="gm-dd-menu" role="listbox" aria-label="Hairstyle options">
                              {HAIR_STYLE_OPTIONS.map((h) => {
                                const selected = avatarConfig.hairStyle === h.id;
                                return (
                                  <button
                                    key={h.id}
                                    id={`gm-avatar-hair-${h.id}`}
                                    type="button"
                                    className={`gm-dd-item ${selected ? 'selected' : ''}`}
                                    onClick={() => {
                                      updateAvatarConfig({ hairStyle: h.id });
                                      setOpenStudioMenu(null);
                                    }}
                                  >
                                    <span>{lang === 'TH' ? h.th : h.en}</span>
                                    {selected && <Check size={14} className="gm-dd-check" aria-hidden="true" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Hair Color (7 Swatches) */}
                  <div className="gm-avatar-ctrl-row">
                    <span className="gm-avatar-ctrl-label">
                      {lang === 'TH' ? 'สีผม' : 'Hair Color'}
                    </span>
                    <div className="gm-swatch-group">
                      {Object.values(HAIR_PALETTES).map((hc) => (
                        <button
                          key={hc.id}
                          id={`gm-avatar-haircolor-${hc.id}`}
                          type="button"
                          className={`gm-color-swatch ${avatarConfig.hairColor === hc.id ? 'active' : ''}`}
                          style={{ backgroundColor: hc.base }}
                          title={lang === 'TH' ? hc.th : hc.en}
                          aria-label={lang === 'TH' ? hc.th : hc.en}
                          onClick={() => updateAvatarConfig({ hairColor: hc.id })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="gm-avatar-subcol">
                  {/* Outfit & Suit Color */}
                  <div className="gm-avatar-ctrl-row">
                    <span className="gm-avatar-ctrl-label">
                      {lang === 'TH' ? 'สีชุด & สูทประจำตัว' : 'Outfit & Suit Color'}
                    </span>
                    <div className="gm-swatch-group">
                      {Object.values(OUTFIT_PALETTES).map((op) => (
                        <button
                          key={op.id}
                          id={`gm-avatar-outfit-${op.id}`}
                          type="button"
                          className={`gm-color-swatch ${avatarConfig.outfitColor === op.id ? 'active' : ''}`}
                          style={{ backgroundColor: op.swatch }}
                          title={lang === 'TH' ? op.th : op.en}
                          aria-label={lang === 'TH' ? op.th : op.en}
                          onClick={() => updateAvatarConfig({ outfitColor: op.id })}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Multi-Select Accessories Dropdown with Overlap Slot Guard */}
                  <div className="gm-avatar-ctrl-row gm-dd-wrap">
                    <span className="gm-avatar-ctrl-label">
                      {lang === 'TH'
                        ? `ของแต่งตัว (${ACCESSORY_OPTIONS.length} ชิ้น • ใส่พร้อมกันได้)`
                        : `Accessories (${ACCESSORY_OPTIONS.length} • Multi-Wear)`}
                    </span>
                    {(() => {
                      const equipped = sanitizeAccessories(avatarConfig.accessories || []);
                      const isOpen = openStudioMenu === 'accessories';
                      const triggerLabel =
                        equipped.length === 0
                          ? lang === 'TH'
                            ? 'เลือกของแต่งตัว (ใส่ได้หลายชิ้น)'
                            : 'Select accessories (multi-wear)'
                          : equipped
                              .map((id) => {
                                const item = ACCESSORY_BY_ID[id];
                                return lang === 'TH' ? item?.th : item?.en;
                              })
                              .filter(Boolean)
                              .join(', ');
                      return (
                        <>
                          <button
                            id="gm-dd-acc-btn"
                            type="button"
                            className={`gm-dd-trigger ${isOpen ? 'open' : ''}`}
                            aria-expanded={isOpen}
                            onClick={() => setOpenStudioMenu(isOpen ? null : 'accessories')}
                          >
                            <span className="gm-dd-trigger-text">{triggerLabel}</span>
                            {equipped.length > 0 && (
                              <span className="gm-dd-count">{equipped.length}</span>
                            )}
                            <ChevronDown size={15} className="gm-dd-chevron" aria-hidden="true" />
                          </button>

                          {equipped.length > 0 && (
                            <div className="gm-acc-active-chips">
                              {equipped.map((id) => {
                                const item = ACCESSORY_BY_ID[id];
                                if (!item) return null;
                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    className="gm-acc-tag"
                                    onClick={() => toggleAvatarAccessory(id)}
                                    title={lang === 'TH' ? 'คลิกเพื่อถอดออก' : 'Click to remove'}
                                  >
                                    <span>{lang === 'TH' ? item.th : item.en}</span>
                                    <X size={11} aria-hidden="true" />
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {isOpen && (
                            <div className="gm-dd-menu gm-dd-menu-tall" role="group" aria-label="Accessories menu">
                              {Object.entries(ACCESSORY_SLOTS).map(([slotKey, slotMeta]) => {
                                const itemsInSlot = ACCESSORY_OPTIONS.filter((a) => a.slot === slotKey);
                                return (
                                  <div key={slotKey} className="gm-dd-group">
                                    <div className="gm-dd-group-title">
                                      {lang === 'TH' ? slotMeta.th : slotMeta.en}
                                    </div>
                                    {itemsInSlot.map((acc) => {
                                      const selected = equipped.includes(acc.id);
                                      const conflict = selected
                                        ? null
                                        : getAccessoryConflict(equipped, acc.id);
                                      return (
                                        <button
                                          key={acc.id}
                                          id={`gm-avatar-acc-${acc.id}`}
                                          type="button"
                                          disabled={Boolean(conflict)}
                                          className={`gm-dd-item ${selected ? 'selected' : ''} ${conflict ? 'locked' : ''}`}
                                          title={
                                            conflict
                                              ? lang === 'TH'
                                                ? conflict.reasonTh
                                                : conflict.reasonEn
                                              : undefined
                                          }
                                          onClick={() => toggleAvatarAccessory(acc.id)}
                                        >
                                          <span>{lang === 'TH' ? acc.th : acc.en}</span>
                                          {selected ? (
                                            <Check size={14} className="gm-dd-check" aria-hidden="true" />
                                          ) : conflict ? (
                                            <Lock size={13} className="gm-dd-lock" aria-hidden="true" />
                                          ) : null}
                                        </button>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Festive & Studio Room Themes Dropdown (12 Themes) */}
                  <div className="gm-avatar-ctrl-row gm-dd-wrap">
                    <span className="gm-avatar-ctrl-label">
                      {lang === 'TH'
                        ? `ธีมห้องพัก & เทศกาล (${Object.keys(ROOM_THEMES).length} ธีม)`
                        : `Room & Festive Themes (${Object.keys(ROOM_THEMES).length})`}
                    </span>
                    {(() => {
                      const activeRoom = ROOM_THEMES[avatarConfig.roomTheme] || ROOM_THEMES.sky;
                      const isOpen = openStudioMenu === 'theme';
                      return (
                        <>
                          <button
                            id="gm-dd-theme-btn"
                            type="button"
                            className={`gm-dd-trigger ${isOpen ? 'open' : ''}`}
                            aria-expanded={isOpen}
                            onClick={() => setOpenStudioMenu(isOpen ? null : 'theme')}
                          >
                            <span className="gm-dd-trigger-inner">
                              <span
                                className="gm-room-dot"
                                style={{ backgroundColor: activeRoom.swatch }}
                                aria-hidden="true"
                              />
                              <span className="gm-dd-trigger-text">
                                {lang === 'TH' ? activeRoom.th : activeRoom.en}
                              </span>
                            </span>
                            <ChevronDown size={15} className="gm-dd-chevron" aria-hidden="true" />
                          </button>
                          {isOpen && (
                            <div className="gm-dd-menu gm-dd-menu-tall" role="listbox" aria-label="Room themes">
                              {Object.values(ROOM_THEMES).map((rt) => {
                                const selected = avatarConfig.roomTheme === rt.id;
                                return (
                                  <button
                                    key={rt.id}
                                    id={`gm-avatar-room-${rt.id}`}
                                    type="button"
                                    className={`gm-dd-item ${selected ? 'selected' : ''}`}
                                    onClick={() => {
                                      updateAvatarConfig({ roomTheme: rt.id });
                                      setOpenStudioMenu(null);
                                    }}
                                  >
                                    <span className="gm-dd-trigger-inner">
                                      <span
                                        className="gm-room-dot"
                                        style={{ backgroundColor: rt.swatch }}
                                        aria-hidden="true"
                                      />
                                      <span>{lang === 'TH' ? rt.th : rt.en}</span>
                                    </span>
                                    {selected && <Check size={14} className="gm-dd-check" aria-hidden="true" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Pre-Game Strategy Allocation */}
          <section className="bento-card gm-card gm-strategy-card">
            <div className="gm-strategy-header">
              <div className="gm-card-title-row">
                <span className="gm-icon-badge teal">
                  <Briefcase size={18} strokeWidth={2.1} />
                </span>
                <div>
                  <h2 className="gm-card-title">
                    {lang === 'TH'
                      ? '3. จัดสรรกลยุทธ์ก่อนเริ่มเกม'
                      : '3. Pre-Game Strategy Allocation'}
                  </h2>
                  <p className="gm-card-sub">
                    {lang === 'TH'
                      ? 'แบ่งเงินเหลือสุทธิต่อเดือนลง 3 ตะกร้าอย่างเป็นกลาง เพื่อเตรียมรับแรงกระแทกก่อนกดเริ่ม'
                      : 'Split your monthly net surplus across 3 neutral buckets before shocks arrive.'}
                  </p>
                </div>
              </div>

              <div className="gm-surplus-pill tabular-nums">
                <span>{lang === 'TH' ? 'เงินเหลือจัดสรร/เดือน' : 'Monthly Surplus'}</span>
                <strong>{formatTHB(monthlySurplus)}</strong>
              </div>
            </div>

            {/* Visual Stacked Split Bar */}
            {monthlySurplus > 0 ? (
              <div className="gm-split-bar-wrap">
                <div className="gm-split-bar" aria-label="Monthly surplus allocation split">
                  {allocPcts.emergency > 0 && (
                    <div
                      className="gm-split-seg blue"
                      style={{ width: `${allocPcts.emergency}%` }}
                      title={`Emergency ${allocPcts.emergency}%`}
                    />
                  )}
                  {allocPcts.protection > 0 && (
                    <div
                      className="gm-split-seg navy"
                      style={{ width: `${allocPcts.protection}%` }}
                      title={`Protection ${allocPcts.protection}%`}
                    />
                  )}
                  {allocPcts.lifestyle > 0 && (
                    <div
                      className="gm-split-seg teal"
                      style={{ width: `${allocPcts.lifestyle}%` }}
                      title={`Lifestyle ${allocPcts.lifestyle}%`}
                    />
                  )}
                </div>
                <div className="gm-split-legend tabular-nums">
                  <span>
                    <i className="gm-dot blue" />
                    {lang === 'TH' ? 'เงินสำรองฉุกเฉิน' : 'Emergency Cash'} ({allocPcts.emergency}%)
                  </span>
                  <span>
                    <i className="gm-dot navy" />
                    {lang === 'TH' ? 'โอนย้ายความเสี่ยง' : 'Risk Transfer'} ({allocPcts.protection}%)
                  </span>
                  <span>
                    <i className="gm-dot teal" />
                    {lang === 'TH' ? 'ไลฟ์สไตล์วันนี้' : 'Lifestyle'} ({allocPcts.lifestyle}%)
                  </span>
                </div>
              </div>
            ) : (
              <div className="gm-zero-surplus-note">
                <Info size={16} aria-hidden="true" />
                <span>
                  {lang === 'TH'
                    ? 'โปรไฟล์จริงของคุณมีรายรับเท่ากับหรือน้อยกว่ารายจ่าย (เงินเหลือ ฿0/ด.) — คุณยังสามารถกดเล่นเพื่อทดสอบความเสี่ยงจริง หรือลองเปิดโบนัสถาม HR ด้านล่างได้'
                    : 'Your real profile currently has ฿0 monthly surplus — you can still play to stress-test your real reserve, or toggle the free HR benefit check below.'}
                </span>
              </div>
            )}

            {/* 3 Strategy Sliders (All aligned to exact same monthlySurplus scale) */}
            <div className="gm-sliders-grid">
              {/* Bucket 1: Emergency Fund */}
              <div className="gm-slider-box">
                <div className="gm-slider-top">
                  <label htmlFor="gm-alloc-emergency" className="gm-slider-label">
                    {lang === 'TH' ? '1. เงินสำรองฉุกเฉิน' : '1. Emergency Cash'}
                  </label>
                  <strong className="gm-slider-val text-blue tabular-nums">
                    {formatTHB(allocations.emergency)}
                    <small>{lang === 'TH' ? '/ด.' : '/mo'}</small>
                  </strong>
                </div>
                <input
                  id="gm-alloc-emergency"
                  type="range"
                  className="inv-range gm-range tone-blue"
                  min={0}
                  max={monthlySurplus}
                  step={100}
                  disabled={monthlySurplus <= 0}
                  value={allocations.emergency}
                  style={{ '--range-pct': `${getRangePct(allocations.emergency, 0, monthlySurplus)}%` }}
                  onChange={(e) => handleAllocationChange('emergency', e.target.value)}
                />
                <p className="gm-slider-hint">
                  {lang === 'TH'
                    ? 'ใช้รับมือเหตุเล็ก-กลาง (เช่น ซ่อมของ รายได้ลด) โดยไม่ต้องเป็นหนี้'
                    : 'Handles frequent small-to-medium bumps without borrowing.'}
                </p>
              </div>

              {/* Bucket 2: Basic Risk Transfer */}
              <div className="gm-slider-box">
                <div className="gm-slider-top">
                  <label htmlFor="gm-alloc-protection" className="gm-slider-label">
                    {lang === 'TH' ? '2. โอนย้ายความเสี่ยง' : '2. Risk Transfer'}
                  </label>
                  <strong className="gm-slider-val text-navy tabular-nums">
                    {formatTHB(allocations.protection)}
                    <small>{lang === 'TH' ? '/ด.' : '/mo'}</small>
                  </strong>
                </div>
                <input
                  id="gm-alloc-protection"
                  type="range"
                  className="inv-range gm-range tone-navy"
                  min={0}
                  max={monthlySurplus}
                  step={100}
                  disabled={safeProtectionCap <= 0}
                  value={allocations.protection}
                  style={{ '--range-pct': `${getRangePct(allocations.protection, 0, monthlySurplus)}%` }}
                  onChange={(e) => handleAllocationChange('protection', e.target.value)}
                />
                <p className="gm-slider-hint tabular-nums">
                  {lang === 'TH'
                    ? `จำกัดปลอดภัยไม่เกิน ${formatTHB(safeProtectionCap)}/ด. (15% ของรายได้ • แนะนำ ${formatTHB(recommendedProtMin)}–${formatTHB(recommendedProtMax)}) • เกราะ ≈ ${formatTHB(allocations.protection * 120)}`
                    : `Capped safely at ${formatTHB(safeProtectionCap)}/mo (15% of income) • Shield ≈ ${formatTHB(allocations.protection * 120)}`}
                </p>
              </div>

              {/* Bucket 3: Lifestyle */}
              <div className="gm-slider-box">
                <div className="gm-slider-top">
                  <label htmlFor="gm-alloc-lifestyle" className="gm-slider-label">
                    {lang === 'TH' ? '3. ไลฟ์สไตล์วันนี้' : '3. Lifestyle Today'}
                  </label>
                  <strong className="gm-slider-val text-green tabular-nums">
                    {formatTHB(allocations.lifestyle)}
                    <small>{lang === 'TH' ? '/ด.' : '/mo'}</small>
                  </strong>
                </div>
                <input
                  id="gm-alloc-lifestyle"
                  type="range"
                  className="inv-range gm-range tone-green"
                  min={0}
                  max={monthlySurplus}
                  step={100}
                  disabled={monthlySurplus <= 0}
                  value={allocations.lifestyle}
                  style={{ '--range-pct': `${getRangePct(allocations.lifestyle, 0, monthlySurplus)}%` }}
                  onChange={(e) => handleAllocationChange('lifestyle', e.target.value)}
                />
                <p className="gm-slider-hint">
                  {lang === 'TH'
                    ? 'ช่วยเติมความสบายใจ (Peace of Mind) ระหว่างเกม แต่ไม่เพิ่มเงินสำรอง'
                    : 'Lifts Peace of Mind each turn, but does not build emergency savings.'}
                </p>
              </div>
            </div>

            {/* One-Click Bonus Prep Toggle: Ask HR about Group Insurance */}
            <div className="gm-prep-footer">
              <button
                type="button"
                id="gm-hr-bonus-toggle"
                className={`gm-hr-toggle ${askedHr ? 'active' : ''}`}
                onClick={() => setAskedHr((prev) => !prev)}
                aria-pressed={askedHr}
              >
                <span className="gm-hr-icon" aria-hidden="true">
                  <MessageSquareCheck size={20} strokeWidth={2.1} />
                </span>
                <div className="gm-hr-copy">
                  <div className="gm-hr-title-row">
                    <strong>
                      {lang === 'TH'
                        ? `ทักแชตถามวงเงินประกันกลุ่มกับ HR (+${formatTHB(HR_GROUP_INSURANCE_BONUS)} ความคุ้มครองแฝง)`
                        : `Message HR to Confirm Group Insurance Limit (+${formatTHB(HR_GROUP_INSURANCE_BONUS)} Hidden Coverage)`}
                    </strong>
                    <span className="gm-hr-pill">
                      {askedHr
                        ? lang === 'TH'
                          ? 'ปลดล็อกแล้ว ✓'
                          : 'Unlocked ✓'
                        : lang === 'TH'
                          ? 'ฟรี ฿0 • กดเพื่อปลดล็อก'
                          : 'Free ฿0 • Click to Unlock'}
                    </span>
                  </div>
                  <p>
                    {lang === 'TH'
                      ? 'นิสัยจริงที่คุ้มที่สุดก่อนซื้ออะไรเพิ่ม: แค่รู้สิทธิสวัสดิการที่มีอยู่แล้ว ก็ช่วยลดช่องว่างความเสี่ยงได้ทันที'
                      : 'Best real-world habit: confirming existing employer coverage unlocks hidden protection before spending a single baht.'}
                  </p>
                </div>
              </button>

              <div className="gm-start-bar">
                <div className="gm-readiness-summary tabular-nums">
                  <span>
                    {lang === 'TH' ? 'เงินสำรองตั้งต้น:' : 'Starting Cash:'}{' '}
                    <strong className="text-blue">{formatTHB(activePersona.emergencyFund)}</strong>
                  </span>
                  <span className="gm-sep">•</span>
                  <span>
                    {lang === 'TH' ? 'วงเงินเกราะคุ้มครองรวม:' : 'Total Protection Shield:'}{' '}
                    <strong>{formatTHB(previewProtectionPool)}</strong>
                  </span>
                  <span className="gm-sep">•</span>
                  <span>
                    {durationValue}{' '}
                    {durationUnit === 'days'
                      ? lang === 'TH'
                        ? 'วัน'
                        : 'days'
                      : lang === 'TH'
                        ? 'เดือน'
                        : 'mo.'}{' '}
                    ({lang === 'TH'
                      ? `สุ่ม ${turnRange.minTurns}–${turnRange.maxTurns} เหตุการณ์`
                      : `${turnRange.minTurns}–${turnRange.maxTurns} random events`})
                  </span>
                </div>

                <button
                  type="button"
                  id="gm-start-simulation-btn"
                  className="btn-primary-gradient gm-start-btn"
                  onClick={handleStartGame}
                >
                  <Play size={17} strokeWidth={2.3} />
                  <span>
                    {lang === 'TH' ? 'เริ่มจำลองเอาตัวรอดเลย!' : 'Start Survival Simulation'}
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PHASE 2: INTERACTIVE TURN-BY-TURN GAMEPLAY ARENA                      */}
      {/* ===================================================================== */}
      {phase === 'playing' && runConfig && gameState && (
        <div className="gm-arena-stack">
          {/* Top Live HUD Bar (4 Compact Bento Pills, tabular-nums) */}
          <section className="gm-hud-grid" aria-label="Live game status">
            {/* HUD 1: Timeline Progress */}
            <div className="bento-card gm-hud-pill">
              <div className="gm-hud-top">
                <span className="gm-hud-label">
                  <Clock size={14} aria-hidden="true" />
                  {lang === 'TH' ? 'เวลาที่ผ่านไป' : 'Timeline Progress'}
                </span>
                <span className="gm-hud-subtag tabular-nums">{timelineProgress.turnLabel}</span>
              </div>
              <div className="gm-hud-value tabular-nums">{timelineProgress.currentLabel}</div>
              <div className="gm-hud-bar-track">
                <div
                  className="gm-hud-bar-fill blue"
                  style={{ width: `${timelineProgress.pct}%` }}
                />
              </div>
            </div>

            {/* HUD 2: Liquid Emergency Cash */}
            <div key={`cash-${hudPulseKey}`} className="bento-card gm-hud-pill gm-pulse-card">
              <div className="gm-hud-top">
                <span className="gm-hud-label">
                  <Wallet size={14} aria-hidden="true" />
                  {lang === 'TH' ? 'เงินสำรองฉุกเฉินคงเหลือ' : 'Liquid Emergency Cash'}
                </span>
                {lastTurnResult && lastTurnResult.netCashChange !== 0 && (
                  <span
                    className={`gm-delta-chip tabular-nums ${
                      lastTurnResult.netCashChange > 0 ? 'pos' : 'neg'
                    }`}
                  >
                    {lastTurnResult.netCashChange > 0 ? '+' : ''}
                    {formatTHB(lastTurnResult.netCashChange)}
                  </span>
                )}
              </div>
              <div className="gm-hud-value text-blue tabular-nums">
                {formatTHB(gameState.cash)}
              </div>
              <span className="gm-hud-footnote tabular-nums">
                {lang === 'TH'
                  ? `เกราะคุ้มครองเหลือ ${formatTHB(gameState.protectionRemaining)}`
                  : `Shield left ${formatTHB(gameState.protectionRemaining)}`}
              </span>
            </div>

            {/* HUD 3: High-Interest Debt (20% APR) */}
            <div
              key={`debt-${hudPulseKey}`}
              className={`bento-card gm-hud-pill gm-pulse-card ${
                gameState.debt > 0 ? 'debt-alert' : ''
              }`}
            >
              <div className="gm-hud-top">
                <span className="gm-hud-label">
                  <TrendingDown size={14} aria-hidden="true" />
                  {lang === 'TH' ? 'หนี้ฉุกเฉิน (20%/ปี)' : 'Emergency Debt (20%)'}
                </span>
                {lastTurnResult && lastTurnResult.netDebtChange !== 0 && (
                  <span
                    className={`gm-delta-chip tabular-nums ${
                      lastTurnResult.netDebtChange < 0 ? 'pos' : 'neg'
                    }`}
                  >
                    {lastTurnResult.netDebtChange > 0 ? '+' : ''}
                    {formatTHB(lastTurnResult.netDebtChange)}
                  </span>
                )}
              </div>
              <div
                className={`gm-hud-value tabular-nums ${
                  gameState.debt > 0 ? 'text-red' : 'text-green'
                }`}
              >
                {formatTHB(gameState.debt)}
              </div>
              <span className="gm-hud-footnote">
                {gameState.debt > 0
                  ? lang === 'TH'
                    ? 'ดอกเบี้ย 20%/ปี เดินทุกเทิร์น'
                    : 'Accruing 20% APR each turn'
                  : lang === 'TH'
                    ? 'ปลอดหนี้ดอกเบี้ยสูง ✓'
                    : 'High-interest debt free ✓'}
              </span>
            </div>

            {/* HUD 4: Peace of Mind Meter (0-100%) */}
            <div key={`peace-${hudPulseKey}`} className="bento-card gm-hud-pill gm-pulse-card">
              <div className="gm-hud-top">
                <span className="gm-hud-label">
                  <HeartPulse size={14} aria-hidden="true" />
                  {lang === 'TH' ? 'ระดับความสบายใจ' : 'Peace of Mind'}
                </span>
                <span className="gm-hud-subtag tabular-nums">{gameState.peace}%</span>
              </div>
              <div className="gm-hud-value tabular-nums">
                {gameState.peace >= 70
                  ? lang === 'TH'
                    ? 'อุ่นใจดี'
                    : 'Calm & Steady'
                  : gameState.peace >= 45
                    ? lang === 'TH'
                      ? 'เริ่มตึงเครียด'
                      : 'Under Pressure'
                    : lang === 'TH'
                      ? 'เครียดหนัก'
                      : 'High Stress'}
              </div>
              <div className="gm-hud-bar-track">
                <div
                  className={`gm-hud-bar-fill ${
                    gameState.peace >= 70 ? 'teal' : gameState.peace >= 45 ? 'amber' : 'red'
                  }`}
                  style={{ width: `${gameState.peace}%` }}
                />
              </div>
            </div>
          </section>

          {/* Centerpiece Event / Instant Feedback Stage */}
          {currentEvent && !lastTurnResult ? (
            <section
              className={`bento-card gm-event-card severity-${currentEvent.severity}`}
              aria-live="polite"
            >
              <div className="gm-event-top">
                <div className="gm-event-badges">
                  <span className={`gm-severity-pill ${currentEvent.severity}`}>
                    {currentEvent.severity === 'positive' ? (
                      <Sparkles size={13} aria-hidden="true" />
                    ) : (
                      <ShieldAlert size={13} aria-hidden="true" />
                    )}
                    {t(currentEvent.badge)}
                  </span>
                  <span className="gm-turn-chip tabular-nums">
                    {lang === 'TH'
                      ? `เหตุการณ์ที่ ${gameState.turnIndex + 1} จาก ${runConfig.totalTurns}`
                      : `Event ${gameState.turnIndex + 1} of ${runConfig.totalTurns}`}
                  </span>
                </div>

                <div
                  className={`gm-impact-pill tabular-nums ${
                    currentEvent.severity === 'positive' ? 'pos' : 'neg'
                  }`}
                >
                  {currentEvent.severity === 'positive' ? '+' : '-'}
                  {formatTHB(currentEvent.billAmount)}
                </div>
              </div>

              <div className="gm-arena-pixel-wrap">
                <PixelAvatarStage
                  avatarConfig={avatarConfig}
                  sceneType={liveAvatarVisuals.sceneType}
                  wealthTier={liveAvatarVisuals.wealthTier}
                  injury={liveAvatarVisuals.injury}
                  compact
                />
              </div>

              <h2 className="gm-event-title">{t(currentEvent.title)}</h2>
              <p className="gm-event-story">{t(currentEvent.story)}</p>

              {/* Context strip showing recurring saving + available shield */}
              <div className="gm-event-context-strip tabular-nums">
                <span>
                  {lang === 'TH' ? 'ออมเติมรอบนี้:' : 'Turn Reserve Added:'}{' '}
                  <strong className="text-blue">
                    +{formatTHB(Math.round(runConfig.allocEmergency * runConfig.monthsPerTurn))}
                  </strong>
                </span>
                <span className="gm-sep">•</span>
                <span>
                  {lang === 'TH' ? 'วงเงินความคุ้มครองพร้อมใช้:' : 'Available Protection Limit:'}{' '}
                  <strong>{formatTHB(gameState.protectionRemaining)}</strong>
                </span>
                {gameState.installmentBalance > 0 && (
                  <>
                    <span className="gm-sep">•</span>
                    <span>
                      {lang === 'TH' ? 'ผ่อน 0% คงเหลือ:' : '0% Plan Left:'}{' '}
                      <strong>{formatTHB(gameState.installmentBalance)}</strong>
                    </span>
                  </>
                )}
              </div>

              {/* Tactical Action Choices */}
              <div className="gm-choices-list">
                {currentChoices.map((choice, idx) => (
                  <button
                    key={choice.id}
                    type="button"
                    className={`gm-choice-btn tone-${choice.tone} ${
                      choice.recommended ? 'is-recommended' : ''
                    }`}
                    onClick={() => handlePickChoice(choice)}
                  >
                    <span className="gm-choice-index">{String.fromCharCode(65 + idx)}</span>
                    <div className="gm-choice-body">
                      <div className="gm-choice-head">
                        <strong className="gm-choice-title">{t(choice.title)}</strong>
                        <span className={`gm-choice-tag tone-${choice.tone}`}>
                          {t(choice.tag)}
                        </span>
                      </div>
                      <p className="gm-choice-sub tabular-nums">{t(choice.subtitle)}</p>
                    </div>
                    <ArrowRight size={17} className="gm-choice-arrow" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          ) : lastTurnResult ? (
            /* Instant 1-Sentence Actuarial Feedback Banner */
            <section className="bento-card gm-feedback-card" aria-live="polite">
              <div className="gm-feedback-head">
                <span
                  className={`gm-feedback-icon ${
                    lastTurnResult.netDebtChange > 0 ? 'warn' : 'ok'
                  }`}
                >
                  {lastTurnResult.netDebtChange > 0 ? (
                    <AlertTriangle size={22} />
                  ) : (
                    <CheckCircle2 size={22} />
                  )}
                </span>
                <div>
                  <span className="gm-feedback-kicker tabular-nums">
                    {lang === 'TH'
                      ? `ผลลัพธ์เทิร์นที่ ${lastTurnResult.turnNumber} • บทเรียนคณิตศาสตร์ประกันภัย`
                      : `Turn ${lastTurnResult.turnNumber} Outcome • Actuarial Feedback`}
                  </span>
                  <h3 className="gm-feedback-event-name">{t(lastTurnResult.eventTitle)}</h3>
                </div>
              </div>

              <div className="gm-arena-pixel-wrap">
                <PixelAvatarStage
                  avatarConfig={avatarConfig}
                  sceneType={liveAvatarVisuals.sceneType}
                  wealthTier={liveAvatarVisuals.wealthTier}
                  injury={liveAvatarVisuals.injury}
                  compact
                />
              </div>

              <div className="gm-feedback-banner">
                <p>{t(lastTurnResult.feedback)}</p>
              </div>

              <div className="gm-turn-receipt tabular-nums">
                {lastTurnResult.recurringEmergencyAdded > 0 && (
                  <span className="gm-receipt-chip blue">
                    {lang === 'TH' ? 'ออมประจำรอบ' : 'Recurring Saved'}: +
                    {formatTHB(lastTurnResult.recurringEmergencyAdded)}
                  </span>
                )}
                {lastTurnResult.protectionUsed > 0 && (
                  <span className="gm-receipt-chip green">
                    {lang === 'TH' ? 'ความคุ้มครองจ่ายแทน' : 'Protection Absorbed'}:{' '}
                    {formatTHB(lastTurnResult.protectionUsed)}
                  </span>
                )}
                {lastTurnResult.interestAccrued > 0 && (
                  <span className="gm-receipt-chip red">
                    {lang === 'TH' ? 'ดอกเบี้ยหนี้ 20%' : '20% Debt Interest'}: +
                    {formatTHB(lastTurnResult.interestAccrued)}
                  </span>
                )}
                {lastTurnResult.installmentDue > 0 && (
                  <span className="gm-receipt-chip neutral">
                    {lang === 'TH' ? 'ตัดยอดผ่อน 0%' : '0% Installment Paid'}: -
                    {formatTHB(lastTurnResult.installmentDue)}
                  </span>
                )}
              </div>

              <div className="gm-feedback-actions">
                <button
                  type="button"
                  id="gm-next-turn-btn"
                  className="btn-primary-gradient gm-next-btn"
                  onClick={handleNextTurn}
                >
                  <span>
                    {gameState.turnIndex >= runConfig.totalTurns
                      ? lang === 'TH'
                        ? 'ดูสรุปคะแนนและบทเรียนทั้งหมด'
                        : 'View Final Resilience Scorecard'
                      : lang === 'TH'
                        ? `ไปต่อเทิร์นที่ ${gameState.turnIndex + 1}`
                        : `Continue to Turn ${gameState.turnIndex + 1}`}
                  </span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </section>
          ) : null}

          {/* Arena Utility Footer (Reset + Fast-Forward for Live Demos) */}
          <div className="gm-arena-footer">
            <button type="button" className="btn-soft-gray gm-util-btn" onClick={handleBackToLobby}>
              <RotateCcw size={15} />
              <span>{lang === 'TH' ? 'กลับไปปรับตั้งค่าเกม' : 'Back to Setup Lobby'}</span>
            </button>

            <button
              type="button"
              id="gm-fast-forward-btn"
              className="btn-soft-gray gm-ff-btn"
              onClick={handleFastForward}
            >
              <FastForward size={15} />
              <span>
                {lang === 'TH' ? 'ข้ามไปดูผลสรุปทันที' : 'Fast-Forward to Results'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PHASE 3: END-OF-GAME BENTO SCORECARD & NEUTRAL COACH DEBRIEF          */}
      {/* ===================================================================== */}
      {phase === 'results' && scorecard && gameState && runConfig && (
        <div className="gm-results-stack">
          {/* Outcome Banner */}
          <section
            className={`bento-card gm-outcome-banner ${
              scorecard.isResilient ? 'resilient' : 'debt-trap'
            }`}
          >
            <div className="gm-outcome-left">
              <span className="gm-outcome-badge">
                {scorecard.isResilient ? (
                  <Award size={16} aria-hidden="true" />
                ) : (
                  <AlertTriangle size={16} aria-hidden="true" />
                )}
                {scorecard.isResilient
                  ? lang === 'TH'
                    ? 'รอดพ้นวิกฤตการเงิน! • Financially Resilient'
                    : 'Financially Resilient!'
                  : lang === 'TH'
                    ? 'ติดกับดักหนี้ฉุกเฉิน • Caught in Emergency Debt'
                    : 'Caught in Emergency Debt'}
              </span>

              <h2 className="gm-outcome-title">
                {(() => {
                  const playerFirstName =
                    (userProfile?.firstName || '').trim() ||
                    runConfig.persona.displayName ||
                    'First Jobber';
                  if (scorecard.isResilient) {
                    return lang === 'TH'
                      ? `ยินดีด้วย ${playerFirstName}! คุณผ่านครบ ${runConfig.durationValue} ${runConfig.unit === 'days' ? 'วัน' : 'เดือน'} แบบปลอดหนี้ฉุกเฉิน`
                      : `Well done, ${playerFirstName}! You survived ${runConfig.durationValue} ${runConfig.unit} completely debt-free.`;
                  }
                  return lang === 'TH'
                    ? `เอาใจช่วย ${playerFirstName}! จบรอบ ${runConfig.durationValue} ${runConfig.unit === 'days' ? 'วัน' : 'เดือน'} พร้อมบทเรียนสำคัญเรื่องช่องว่างความคุ้มครอง`
                    : `Keep going, ${playerFirstName}! Completed ${runConfig.durationValue} ${runConfig.unit} with a critical risk-gap lesson.`;
                })()}
              </h2>

              <p className="gm-outcome-sub">{t(scorecard.headlineSummary)}</p>
            </div>

            <div className="gm-results-avatar-wrap">
              <PixelAvatarStage
                avatarConfig={avatarConfig}
                sceneType={liveAvatarVisuals.sceneType}
                wealthTier={liveAvatarVisuals.wealthTier}
                injury={liveAvatarVisuals.injury}
                compact
              />
            </div>

            <div className="gm-score-dial tabular-nums">
              <span className="gm-score-caption">
                {lang === 'TH' ? 'คะแนนความพร้อม' : 'Resilience Score'}
              </span>
              <strong className="gm-score-big">{scorecard.resilienceScore}</strong>
              <span className="gm-score-max">/ 100</span>
            </div>
          </section>

          {/* 4 Final Stat Cards */}
          <section className="gm-final-stats-grid" aria-label="Final simulation metrics">
            <div className="bento-card gm-stat-card">
              <span className="gm-stat-label">
                {lang === 'TH' ? 'เงินสำรองฉุกเฉินคงเหลือ' : 'Final Emergency Fund'}
              </span>
              <strong className="gm-stat-val text-blue tabular-nums">
                {formatTHB(gameState.cash)}
              </strong>
              <span className="gm-stat-sub tabular-nums">
                {lang === 'TH'
                  ? `รองรับรายจ่ายได้ ${scorecard.finalRunwayMonths.toFixed(1)} เดือน`
                  : `${scorecard.finalRunwayMonths.toFixed(1)} months expense runway`}
              </span>
            </div>

            <div className="bento-card gm-stat-card">
              <span className="gm-stat-label">
                {lang === 'TH'
                  ? 'ความเสียหายที่ความคุ้มครองช่วยรับไว้'
                  : 'Total Shock Absorbed by Protection'}
              </span>
              <strong className="gm-stat-val text-green tabular-nums">
                {formatTHB(gameState.totalProtectionAbsorbed)}
              </strong>
              <span className="gm-stat-sub tabular-nums">
                {lang === 'TH'
                  ? `จากวงเงินเกราะตั้งต้น ${formatTHB(runConfig.startingProtectionPool)}`
                  : `From ${formatTHB(runConfig.startingProtectionPool)} protection shield`}
              </span>
            </div>

            <div className="bento-card gm-stat-card">
              <span className="gm-stat-label">
                {lang === 'TH' ? 'หนี้ฉุกเฉินดอกเบี้ยสูงสะสม' : 'High-Interest Debt Created'}
              </span>
              <strong
                className={`gm-stat-val tabular-nums ${
                  gameState.debt > 0 ? 'text-red' : 'text-green'
                }`}
              >
                {formatTHB(gameState.debt)}
              </strong>
              <span className="gm-stat-sub tabular-nums">
                {gameState.totalInterestPaid > 0
                  ? lang === 'TH'
                    ? `ดอกเบี้ย 20% ที่เดินไปแล้ว ${formatTHB(gameState.totalInterestPaid)}`
                    : `20% APR interest accrued: ${formatTHB(gameState.totalInterestPaid)}`
                  : lang === 'TH'
                    ? 'ไม่เสียดอกเบี้ยฉุกเฉินเลย (฿0)'
                    : 'Zero emergency interest paid (฿0)'}
              </span>
            </div>

            <div className="bento-card gm-stat-card">
              <span className="gm-stat-label">
                {lang === 'TH'
                  ? 'คะแนนความยืดหยุ่นทางการเงิน'
                  : 'Overall Resilience Score'}
              </span>
              <strong className="gm-stat-val tabular-nums">
                {scorecard.resilienceScore} / 100
              </strong>
              <div className="gm-hud-bar-track">
                <div
                  className={`gm-hud-bar-fill ${
                    scorecard.resilienceScore >= 70
                      ? 'teal'
                      : scorecard.resilienceScore >= 45
                        ? 'amber'
                        : 'red'
                  }`}
                  style={{ width: `${scorecard.resilienceScore}%` }}
                />
              </div>
            </div>
          </section>

          {/* Actuarial Lesson Debrief Card (Neutral & Non-Sales) */}
          <section className="bento-card gm-debrief-card">
            <div className="gm-card-head">
              <div className="gm-card-title-row">
                <span className="gm-icon-badge teal">
                  <ShieldCheck size={18} strokeWidth={2.1} />
                </span>
                <div>
                  <h3 className="gm-card-title">
                    {lang === 'TH'
                      ? 'บทสรุปจากโค้ชการเงินที่เป็นกลาง (Actuarial Lesson Debrief)'
                      : 'Neutral Financial Coach Debrief'}
                  </h3>
                  <p className="gm-card-sub">
                    {lang === 'TH'
                      ? 'วิเคราะห์ตรงไปตรงมาตามหลักคณิตศาสตร์ประกันภัย — ไม่แนะนำบริษัทหรือผลิตภัณฑ์ใด'
                      : 'Objective actuarial diagnosis of what protected or hurt your cashflow — zero sales.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="gm-takeaways-list">
              {scorecard.takeaways.map((item, i) => (
                <div key={i} className={`gm-takeaway-item tone-${item.tone}`}>
                  <span className="gm-takeaway-dot" aria-hidden="true" />
                  <p>{t(item.text)}</p>
                </div>
              ))}
            </div>

            {/* Compact Turn-by-Turn Decision Log */}
            <details className="gm-history-details">
              <summary className="gm-history-summary">
                <span>
                  {lang === 'TH'
                    ? `ดูประวัติการตัดสินใจครบทั้ง ${gameState.history.length} เทิร์น`
                    : `Review All ${gameState.history.length} Turn Decisions`}
                </span>
                <TrendingUp size={14} aria-hidden="true" />
              </summary>
              <div className="gm-history-list">
                {gameState.history.map((entry) => (
                  <div key={entry.turnNumber} className="gm-history-row tabular-nums">
                    <span className="gm-history-num">T{entry.turnNumber}</span>
                    <div className="gm-history-copy">
                      <strong>{t(entry.eventTitle)}</strong>
                      <span>{t(entry.choiceTitle)}</span>
                    </div>
                    <div className="gm-history-nums">
                      <span className={entry.netCashChange >= 0 ? 'text-green' : 'text-red'}>
                        {lang === 'TH' ? 'เงินสด' : 'Cash'}{' '}
                        {entry.netCashChange >= 0 ? '+' : ''}
                        {formatTHB(entry.netCashChange)}
                      </span>
                      {entry.protectionUsed > 0 && (
                        <span className="text-blue">
                          {lang === 'TH' ? 'คุ้มครอง' : 'Shield'} {formatTHB(entry.protectionUsed)}
                        </span>
                      )}
                      {entry.endingDebt > 0 && (
                        <span className="text-red">
                          {lang === 'TH' ? 'หนี้' : 'Debt'} {formatTHB(entry.endingDebt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </details>

            {/* Post-Game CTA Buttons */}
            <div className="gm-debrief-actions">
              <button
                type="button"
                id="gm-play-again-btn"
                className="btn-soft-gray gm-action-btn"
                onClick={handleBackToLobby}
              >
                <RotateCcw size={16} />
                <span>
                  {lang === 'TH'
                    ? 'เล่นอีกครั้ง (สุ่มเหตุการณ์ใหม่)'
                    : 'Play Again (New Random Run)'}
                </span>
              </button>

              <button
                type="button"
                id="gm-apply-risk-btn"
                className="btn-primary-gradient gm-action-btn"
                onClick={() => onNavigate && onNavigate('risk-analysis')}
              >
                <span>
                  {lang === 'TH'
                    ? 'นำแผนนี้ไปคำนวณจริงใน Risk Analysis'
                    : 'Apply This Plan in Risk Analysis'}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

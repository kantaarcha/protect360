import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Lock,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import WelcomeFinancialCanvas from './WelcomeFinancialCanvas';
import {
  OCCUPATION_OPTIONS,
  TITLE_OPTIONS,
  getGreetingText,
  getUserInitials,
} from '../utils/userHelpers';

const OB_COPY = {
  TH: {
    kicker: 'พื้นที่กลางให้ความรู้ทางการเงิน · ไม่ขายประกัน 100%',
    headline: 'เห็นตัวเลขจริงของเงินสำรองและความคุ้มครอง — โดยไม่มีใครมาขายประกัน',
    subhead:
      'ออกแบบมาเพื่อวัยเริ่มต้นทำงาน ช่วยจัดระเบียบรายรับ-จ่ายใน 360Flow ประเมินช่องว่างความคุ้มครอง คำนวณผลตอบแทน IRR และซ้อมรับมือวิกฤตการเงินได้ด้วยตัวคุณเอง',
    startBtn: 'เริ่มต้นใช้งาน',
    skipWelcome: 'เข้าสู่หน้าภาพรวมทันที',
    trust1Title: 'ไม่ขายประกัน 100%',
    trust1Desc: 'เป็นกลาง โปร่งใส ไม่มีตัวแทนติดต่อขาย',
    trust2Title: 'ข้อมูลอยู่ในเครื่องคุณ',
    trust2Desc: 'ไม่ต้องล็อกอิน ไม่เก็บเบอร์โทรหรืออีเมล (PDPA-Safe)',
    trust3Title: 'เริ่มจาก 0 กรอกจริงทันที',
    trust3Desc: 'หรือทดลองใส่สถานการณ์สมมติได้ทุกเมื่อในหน้าตั้งค่า',
    stepLabel: 'ขั้นตอนที่ 2 จาก 2',
    step2Title: 'แนะนำตัวสั้น ๆ เพื่อให้ PROTECT360 ทักทายและคำนวณให้เหมาะกับคุณ',
    step2Sub: 'ข้อมูลนี้บันทึกเฉพาะในอุปกรณ์ของคุณเท่านั้น จะกรอกหรือเว้นว่างไว้ก็ได้',
    previewLabel: 'ตัวอย่างคำทักทายตามเวลาจริงของคุณ',
    titleLabel: 'คำนำหน้า',
    firstNameLabel: 'ชื่อ หรือชื่อเล่น',
    lastNameLabel: 'นามสกุล (ไม่บังคับ)',
    occupationLabel: 'อาชีพปัจจุบัน',
    ageLabel: 'อายุ (ปี)',
    ageHint: '15–99 ปี',
    editLaterNote: 'ทุกข้อมูลในหน้านี้ปรับเปลี่ยนได้ภายหลังที่เมนู “ตั้งค่า” → โปรไฟล์',
    goalLabel: 'เป้าหมายเงินสำรองฉุกเฉินเริ่มต้น',
    goal3: '3 เดือน',
    goal3Sub: 'มาตรฐานวัยเริ่มทำงาน',
    goal6: '6 เดือน',
    goal6Sub: 'อุ่นใจพิเศษ / รายได้ไม่คงที่',
    backBtn: 'ย้อนกลับ',
    skipBtn: 'ข้ามไปก่อน',
    finishBtn: 'บันทึกและเข้าสู่หน้าภาพรวม',
  },
  EN: {
    kicker: 'Neutral Financial Education Space · 100% Zero Insurance Sales',
    headline: 'See the real math behind your cash buffer and protection — with zero sales pressure.',
    subhead:
      'Built for First Jobbers to organize daily cashflow in 360Flow, measure real protection gaps, calculate true IRR, and rehearse financial shocks on your own terms.',
    startBtn: 'Get Started',
    skipWelcome: 'Jump straight to Overview',
    trust1Title: '100% Zero Sales',
    trust1Desc: 'Neutral math only — no agents or sponsored pitches',
    trust2Title: 'Private on Your Device',
    trust2Desc: 'No login, no phone number or email required (PDPA-Safe)',
    trust3Title: 'Starts Clean at 0',
    trust3Desc: 'Enter your real numbers or try a sample anytime in Settings',
    stepLabel: 'Step 2 of 2',
    step2Title: 'Tell us what to call you so PROTECT360 can personalize your dashboard',
    step2Sub: 'Saved only on this device. Fill in what you like or leave fields blank.',
    previewLabel: 'Your live time-aware greeting preview',
    titleLabel: 'Title',
    firstNameLabel: 'First name or nickname',
    lastNameLabel: 'Last name (optional)',
    occupationLabel: 'Current occupation',
    ageLabel: 'Age (years)',
    ageHint: '15–99 years',
    editLaterNote: 'Everything here can be changed later in Settings → Profile.',
    goalLabel: 'Starting emergency reserve goal',
    goal3: '3 Months',
    goal3Sub: 'Standard First Jobber buffer',
    goal6: '6 Months',
    goal6Sub: 'Extra cushion / variable income',
    backBtn: 'Back',
    skipBtn: 'Skip for now',
    finishBtn: 'Save & Enter Overview',
  },
};

export default function OnboardingFlow({ referenceHour, onComplete }) {
  const { lang, setLang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { userProfile, updateUserProfile } = useFinance();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(userProfile.title || '');
  const [firstName, setFirstName] = useState(userProfile.firstName || '');
  const [lastName, setLastName] = useState(userProfile.lastName || '');
  const [occupation, setOccupation] = useState(userProfile.occupation || OCCUPATION_OPTIONS[0].th);
  const [age, setAge] = useState('');
  const [emergencyTargetMonths, setEmergencyTargetMonths] = useState(
    userProfile.emergencyTargetMonths === 6 ? 6 : 3
  );

  const firstNameInputRef = useRef(null);
  const copy = OB_COPY[lang] || OB_COPY.TH;

  useEffect(() => {
    if (step === 2) {
      const timer = window.setTimeout(() => {
        firstNameInputRef.current?.focus();
      }, 120);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [step]);

  const parsedAge = Number(age);
  const resolvedAge =
    age.trim() !== '' && Number.isFinite(parsedAge)
      ? Math.min(99, Math.max(15, Math.round(parsedAge)))
      : userProfile.age;

  const draftProfile = {
    ...userProfile,
    title,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    occupation,
    emergencyTargetMonths,
  };

  const liveGreetingPreview = getGreetingText(draftProfile, lang, referenceHour);
  const liveInitials = getUserInitials(firstName, lastName);

  const handleFinish = (e) => {
    e.preventDefault();
    updateUserProfile({
      title,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      occupation,
      age: resolvedAge,
      emergencyTargetMonths,
    });
    onComplete();
  };

  return (
    <div className="ob-screen" role="main" aria-label="PROTECT360 Welcome">
      <WelcomeFinancialCanvas />

      {/* Subtle Top Utility Bar: Brand + Quick Language (TH/EN) + Theme */}
      <header className="ob-topbar">
        <div className="ob-topbar-brand">
          <span className="ob-topbar-logo-wrap" aria-hidden="true">
            <img src="/logo.png" alt="PROTECT360" className="brand-logo-img" />
          </span>
          <span className="ob-topbar-wordmark">PROTECT360</span>
        </div>

        <div className="ob-topbar-actions">
          <div className="ob-lang-switch" role="group" aria-label="Language selector">
            {[
              { code: 'TH', label: 'TH' },
              { code: 'EN', label: 'EN' },
            ].map((item) => (
              <button
                key={item.code}
                id={`ob-lang-${item.code.toLowerCase()}`}
                type="button"
                className={`ob-lang-btn ${lang === item.code ? 'active' : ''}`}
                aria-pressed={lang === item.code}
                onClick={() => setLang(item.code)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            id="ob-theme-btn"
            type="button"
            className="ob-icon-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={16} strokeWidth={2.2} /> : <Moon size={16} strokeWidth={2.2} />}
          </button>
        </div>
      </header>

      <div className="ob-stage">
        {step === 1 ? (
          <section className="ob-card ob-welcome-card" aria-labelledby="ob-welcome-title">
            <div className="ob-hero-emblem">
              <span className="ob-logo-frame">
                <img src="/logo.png" alt="PROTECT360 Logo" className="ob-logo-img" />
              </span>
              <div className="ob-brand-stack">
                <span className="ob-brand-name">PROTECT360</span>
                <span className="ob-kicker">{copy.kicker}</span>
              </div>
            </div>

            <h1 id="ob-welcome-title" className="ob-headline">
              {copy.headline}
            </h1>
            <p className="ob-subhead">{copy.subhead}</p>

            <div className="ob-trust-grid">
              <div className="ob-trust-item">
                <span className="ob-trust-icon" aria-hidden="true">
                  <ShieldCheck size={18} strokeWidth={2.1} />
                </span>
                <div>
                  <strong className="ob-trust-title">{copy.trust1Title}</strong>
                  <p className="ob-trust-desc">{copy.trust1Desc}</p>
                </div>
              </div>

              <div className="ob-trust-item">
                <span className="ob-trust-icon" aria-hidden="true">
                  <Lock size={18} strokeWidth={2.1} />
                </span>
                <div>
                  <strong className="ob-trust-title">{copy.trust2Title}</strong>
                  <p className="ob-trust-desc">{copy.trust2Desc}</p>
                </div>
              </div>

              <div className="ob-trust-item">
                <span className="ob-trust-icon" aria-hidden="true">
                  <Sparkles size={18} strokeWidth={2.1} />
                </span>
                <div>
                  <strong className="ob-trust-title">{copy.trust3Title}</strong>
                  <p className="ob-trust-desc">{copy.trust3Desc}</p>
                </div>
              </div>
            </div>

            <div className="ob-welcome-actions">
              <button
                id="onboarding-start-btn"
                type="button"
                className="btn-primary-gradient ob-primary-btn"
                onClick={() => setStep(2)}
              >
                <span>{copy.startBtn}</span>
                <ArrowRight size={18} strokeWidth={2.3} aria-hidden="true" />
              </button>

              <button
                id="onboarding-quick-skip-btn"
                type="button"
                className="ob-ghost-link"
                onClick={onComplete}
              >
                {copy.skipWelcome}
              </button>
            </div>
          </section>
        ) : (
          <section className="ob-card ob-profile-card" aria-labelledby="ob-profile-title">
            <div className="ob-step-head">
              <button
                id="onboarding-back-btn"
                type="button"
                className="ob-back-btn"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={15} strokeWidth={2.2} aria-hidden="true" />
                <span>{copy.backBtn}</span>
              </button>
              <span className="ob-step-pill tabular-nums">{copy.stepLabel}</span>
            </div>

            <h1 id="ob-profile-title" className="ob-step-title">
              {copy.step2Title}
            </h1>
            <p className="ob-step-sub">{copy.step2Sub}</p>

            {/* Live Greeting Preview */}
            <div className="ob-greeting-preview" aria-live="polite">
              <span className="ob-preview-avatar" aria-hidden="true">
                {liveInitials}
              </span>
              <div className="ob-preview-copy">
                <span className="ob-preview-caption">{copy.previewLabel}</span>
                <strong className="ob-preview-text">{liveGreetingPreview}</strong>
              </div>
            </div>

            <form className="ob-form" onSubmit={handleFinish}>
              {/* Title Prefix */}
              <div className="form-field">
                <span className="form-label">{copy.titleLabel}</span>
                <div className="ob-choice-row" role="group" aria-label={copy.titleLabel}>
                  {TITLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value || 'unspecified'}
                      id={`ob-title-${opt.value || 'unspecified'}`}
                      type="button"
                      className={`ob-choice-pill ${title === opt.value ? 'active' : ''}`}
                      aria-pressed={title === opt.value}
                      onClick={() => setTitle(opt.value)}
                    >
                      {lang === 'EN' ? opt.en : opt.th}
                    </button>
                  ))}
                </div>
              </div>

              {/* First & Last Name */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="onboarding-first-name" className="form-label">
                    {copy.firstNameLabel}
                  </label>
                  <input
                    ref={firstNameInputRef}
                    id="onboarding-first-name"
                    type="text"
                    maxLength={60}
                    autoComplete="given-name"
                    className="form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="onboarding-last-name" className="form-label">
                    {copy.lastNameLabel}
                  </label>
                  <input
                    id="onboarding-last-name"
                    type="text"
                    maxLength={60}
                    autoComplete="family-name"
                    className="form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Age & Occupation */}
              <div className="form-grid-2 ob-age-occ-grid">
                <div className="form-field">
                  <label htmlFor="onboarding-age" className="form-label">
                    {copy.ageLabel}
                  </label>
                  <input
                    id="onboarding-age"
                    type="number"
                    inputMode="numeric"
                    min={15}
                    max={99}
                    step={1}
                    className="form-input tabular-nums"
                    value={age}
                    aria-describedby="onboarding-age-hint"
                    onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                  />
                  <span id="onboarding-age-hint" className="ob-field-hint">
                    {copy.ageHint}
                  </span>
                </div>

                <div className="form-field">
                  <label htmlFor="onboarding-occupation" className="form-label">
                    {copy.occupationLabel}
                  </label>
                  <select
                    id="onboarding-occupation"
                    className="form-select"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  >
                    {OCCUPATION_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.th}>
                        {lang === 'EN' ? opt.en : opt.th}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Emergency Target Choice */}
              <div className="form-field">
                <span className="form-label">{copy.goalLabel}</span>
                <div className="ob-goal-grid" role="group" aria-label={copy.goalLabel}>
                  <button
                    id="ob-goal-3"
                    type="button"
                    className={`ob-goal-btn ${emergencyTargetMonths === 3 ? 'active' : ''}`}
                    aria-pressed={emergencyTargetMonths === 3}
                    onClick={() => setEmergencyTargetMonths(3)}
                  >
                    <strong>{copy.goal3}</strong>
                    <span>{copy.goal3Sub}</span>
                  </button>
                  <button
                    id="ob-goal-6"
                    type="button"
                    className={`ob-goal-btn ${emergencyTargetMonths === 6 ? 'active' : ''}`}
                    aria-pressed={emergencyTargetMonths === 6}
                    onClick={() => setEmergencyTargetMonths(6)}
                  >
                    <strong>{copy.goal6}</strong>
                    <span>{copy.goal6Sub}</span>
                  </button>
                </div>
              </div>

              <p id="onboarding-edit-later-note" className="ob-edit-later-note">
                <Info size={15} strokeWidth={2.2} aria-hidden="true" />
                <span>{copy.editLaterNote}</span>
              </p>

              <div className="ob-form-actions">
                <button
                  id="onboarding-skip-btn"
                  type="button"
                  className="btn-soft-gray"
                  onClick={onComplete}
                >
                  {copy.skipBtn}
                </button>

                <button
                  id="onboarding-finish-btn"
                  type="submit"
                  className="btn-primary-gradient ob-primary-btn"
                >
                  <CheckCircle2 size={17} strokeWidth={2.2} aria-hidden="true" />
                  <span>{copy.finishBtn}</span>
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

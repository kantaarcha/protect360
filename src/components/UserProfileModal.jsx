import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Lock,
  RotateCcw,
  ShieldCheck,
  Upload,
  User,
  Users,
  X,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import {
  OCCUPATION_OPTIONS,
  TITLE_OPTIONS,
  getCardHolderDisplay,
  getOccupationLabel,
  getUserInitials,
} from '../utils/userHelpers';

const DEPENDENT_STEPS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3+' },
];

export default function UserProfileModal({ initialTab = 'profile', onClose }) {
  const { lang, t } = useLanguage();
  const {
    userProfile,
    monthlyExpenses,
    updateUserProfile,
    exportUserData,
    importUserData,
    resetDemoData,
  } = useFinance();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [title, setTitle] = useState(userProfile.title || '');
  const [firstName, setFirstName] = useState(userProfile.firstName || '');
  const [lastName, setLastName] = useState(userProfile.lastName || '');
  const [age, setAge] = useState(String(userProfile.age ?? 25));
  const [occupation, setOccupation] = useState(userProfile.occupation);
  const [dependents, setDependents] = useState(
    Math.min(3, Math.max(0, Number(userProfile.dependents) || 0))
  );
  const [emergencyTargetMonths, setEmergencyTargetMonths] = useState(
    userProfile.emergencyTargetMonths === 6 ? 6 : 3
  );

  // Privacy tab states
  const [confirmReset, setConfirmReset] = useState(false);
  const [importFeedback, setImportFeedback] = useState(null);
  const fileInputRef = useRef(null);
  const resetTimerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Auto-disarm 2-step reset confirmation after 5 seconds
  useEffect(() => {
    if (!confirmReset) return;
    resetTimerRef.current = window.setTimeout(() => {
      setConfirmReset(false);
    }, 5000);
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, [confirmReset]);

  const applyProfileToDraft = (next) => {
    setTitle(next.title || '');
    setFirstName(next.firstName || '');
    setLastName(next.lastName || '');
    setAge(String(next.age ?? 25));
    setOccupation(next.occupation || OCCUPATION_OPTIONS[0].th);
    setDependents(Math.min(3, Math.max(0, Number(next.dependents) || 0)));
    setEmergencyTargetMonths(next.emergencyTargetMonths === 6 ? 6 : 3);
  };

  const draftProfile = {
    title,
    firstName,
    lastName,
    age: Number(age) || 25,
    occupation,
    dependents,
    emergencyTargetMonths,
  };

  const previewCardHolder = getCardHolderDisplay(draftProfile);
  const previewInitials = getUserInitials(firstName, lastName);
  const previewOccupation = getOccupationLabel(occupation, lang);
  const target3Amt = monthlyExpenses * 3;
  const target6Amt = monthlyExpenses * 6;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const parsedAge = Number(age);
    updateUserProfile({
      title,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: Number.isFinite(parsedAge) ? Math.min(99, Math.max(15, Math.round(parsedAge))) : 25,
      occupation,
      dependents,
      emergencyTargetMonths,
    });
    onClose();
  };

  const handleTriggerImport = () => {
    setImportFeedback(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const result = await importUserData(file);
    setImportFeedback(result);
    if (result?.ok && result.userProfile) {
      applyProfileToDraft(result.userProfile);
    }
  };

  const handleResetClick = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetDemoData();
    applyProfileToDraft({
      title: '',
      firstName: '',
      lastName: '',
      age: 25,
      occupation: OCCUPATION_OPTIONS[0].th,
      dependents: 0,
      emergencyTargetMonths: 3,
    });
    setConfirmReset(false);
    setImportFeedback(null);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-modal-title"
    >
      <div
        className="modal-dialog profile-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-head">
          <div>
            <h3 id="user-profile-modal-title" className="card-title">
              {t('profileModal.title')}
            </h3>
            <p className="card-subtitle" style={{ marginTop: 3 }}>
              {t('profileModal.subtitle')}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Two Clear Bento Tabs */}
        <div className="profile-tabs" role="tablist" aria-label={t('profileModal.title')}>
          <button
            id="profile-tab-personal"
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            className={`profile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={15} strokeWidth={2.2} />
            <span>{t('profileModal.tabProfile')}</span>
          </button>
          <button
            id="profile-tab-privacy"
            type="button"
            role="tab"
            aria-selected={activeTab === 'privacy'}
            className={`profile-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <ShieldCheck size={15} strokeWidth={2.2} />
            <span>{t('profileModal.tabPrivacy')}</span>
          </button>
        </div>

        {/* ================= TAB 1: PERSONAL PROFILE ================= */}
        {activeTab === 'profile' && (
          <form className="form-stack" onSubmit={handleSaveProfile}>
            {/* Live Preview Mini-Card */}
            <div className="profile-card-preview-wrap">
              <div className="profile-preview-caption">{t('profileModal.previewHeader')}</div>
              <div className="profile-mini-vcard" aria-live="polite">
                <div className="profile-mini-vcard-top">
                  <span className="profile-mini-vcard-tag">
                    <ShieldCheck size={13} strokeWidth={2.3} />
                    {t('profileModal.previewCardTag')}
                  </span>
                  <span className="profile-mini-vcard-badge tabular-nums">
                    {emergencyTargetMonths} {lang === 'TH' ? 'เดือน' : 'mo.'}
                  </span>
                </div>

                <div className="profile-mini-vcard-mid">
                  <span className="profile-mini-avatar" aria-hidden="true">
                    {previewInitials}
                  </span>
                  <div className="profile-mini-holder-block">
                    <span className="profile-mini-holder-label">
                      {t('profileModal.previewHolderLabel')}
                    </span>
                    <span className="profile-mini-holder-name">{previewCardHolder}</span>
                  </div>
                </div>

                <div className="profile-mini-vcard-foot">
                  <span>{previewOccupation}</span>
                  <span className="tabular-nums">
                    {lang === 'TH'
                      ? `อายุ ${draftProfile.age} ปี • ดูแล ${dependents === 3 ? '3+' : dependents} คน`
                      : `Age ${draftProfile.age} • ${dependents === 3 ? '3+' : dependents} dep.`}
                  </span>
                </div>
              </div>
            </div>

            {/* Title / Prefix Selector: นาย / นาง / นางสาว / ไม่ระบุ */}
            <div className="form-field">
              <span className="form-label">{t('profileModal.titlePrefix')}</span>
              <div className="stepper-choice-4" role="group" aria-label={t('profileModal.titlePrefix')}>
                {TITLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value || 'unspecified'}
                    id={`title-prefix-${opt.value || 'unspecified'}`}
                    type="button"
                    className={`choice-btn ${title === opt.value ? 'active' : ''}`}
                    aria-pressed={title === opt.value}
                    onClick={() => setTitle(opt.value)}
                  >
                    {lang === 'EN' ? opt.en : opt.th}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Inputs (Accepts Thai & English, blank without example placeholders) */}
            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="profile-firstname-input" className="form-label">
                  {t('profileModal.firstName')}
                </label>
                <input
                  id="profile-firstname-input"
                  type="text"
                  maxLength={60}
                  autoComplete="given-name"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-lastname-input" className="form-label">
                  {t('profileModal.lastName')}
                </label>
                <input
                  id="profile-lastname-input"
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
            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="profile-age-input" className="form-label">
                  {t('profileModal.age')}
                </label>
                <input
                  id="profile-age-input"
                  type="number"
                  min={15}
                  max={99}
                  className="form-input tabular-nums"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-occupation-select" className="form-label">
                  {t('profileModal.occupation')}
                </label>
                <select
                  id="profile-occupation-select"
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

            {/* Dependents Stepper: 0, 1, 2, 3+ */}
            <div className="form-field">
              <div className="form-label-row">
                <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Users size={14} strokeWidth={2.2} />
                  {t('profileModal.dependents')}
                </span>
                <span className="form-label-chip tabular-nums">
                  {dependents === 3 ? '3+' : dependents} {t('profileModal.dependentsUnit')}
                </span>
              </div>
              <div className="stepper-choice-4" role="group" aria-label={t('profileModal.dependents')}>
                {DEPENDENT_STEPS.map((step) => (
                  <button
                    key={step.value}
                    id={`dependents-step-${step.value}`}
                    type="button"
                    className={`choice-btn tabular-nums ${dependents === step.value ? 'active' : ''}`}
                    aria-pressed={dependents === step.value}
                    onClick={() => setDependents(step.value)}
                  >
                    {step.label}
                  </button>
                ))}
              </div>
              <span className="form-helper-text">{t('profileModal.dependentsHint')}</span>
            </div>

            {/* Emergency Fund Goal Selector: 3 Months / 6 Months */}
            <div className="form-field">
              <span className="form-label">{t('profileModal.emergencyGoal')}</span>
              <div className="goal-choice-grid" role="group" aria-label={t('profileModal.emergencyGoal')}>
                <button
                  id="emergency-goal-3"
                  type="button"
                  className={`goal-choice-card ${emergencyTargetMonths === 3 ? 'active' : ''}`}
                  aria-pressed={emergencyTargetMonths === 3}
                  onClick={() => setEmergencyTargetMonths(3)}
                >
                  <div className="goal-choice-top">
                    <span className="goal-choice-title">{t('profileModal.goal3Months')}</span>
                    <span className="goal-choice-amount tabular-nums">{formatTHB(target3Amt)}</span>
                  </div>
                  <span className="goal-choice-desc">{t('profileModal.goal3Desc')}</span>
                </button>

                <button
                  id="emergency-goal-6"
                  type="button"
                  className={`goal-choice-card ${emergencyTargetMonths === 6 ? 'active' : ''}`}
                  aria-pressed={emergencyTargetMonths === 6}
                  onClick={() => setEmergencyTargetMonths(6)}
                >
                  <div className="goal-choice-top">
                    <span className="goal-choice-title">{t('profileModal.goal6Months')}</span>
                    <span className="goal-choice-amount tabular-nums">{formatTHB(target6Amt)}</span>
                  </div>
                  <span className="goal-choice-desc">{t('profileModal.goal6Desc')}</span>
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-soft-gray" onClick={onClose}>
                {t('profileModal.cancelBtn')}
              </button>
              <button id="save-profile-btn" type="submit" className="btn-primary-gradient">
                <CheckCircle2 size={16} strokeWidth={2.2} />
                <span>{t('profileModal.saveBtn')}</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= TAB 2: DATA & PDPA PRIVACY ================= */}
        {activeTab === 'privacy' && (
          <div className="privacy-tab-stack">
            {/* PDPA Privacy Notice Banner */}
            <div className="pdpa-notice-card">
              <div className="pdpa-notice-head">
                <span className="pdpa-shield-icon" aria-hidden="true">
                  <Lock size={17} strokeWidth={2.2} />
                </span>
                <div>
                  <div className="pdpa-notice-title">{t('profileModal.pdpaTitle')}</div>
                  <p className="pdpa-notice-text">{t('profileModal.pdpaNotice')}</p>
                </div>
              </div>
              <ul className="pdpa-bullet-list">
                <li>{t('profileModal.pdpaBullet1')}</li>
                <li>{t('profileModal.pdpaBullet2')}</li>
                <li>{t('profileModal.pdpaBullet3')}</li>
              </ul>
            </div>

            {/* Inline Feedback Banner for Import */}
            {importFeedback && (
              <div
                className={`inline-feedback-banner ${importFeedback.ok ? 'success' : 'error'}`}
                role="status"
              >
                {importFeedback.ok ? (
                  <CheckCircle2 size={16} strokeWidth={2.2} />
                ) : (
                  <AlertCircle size={16} strokeWidth={2.2} />
                )}
                <span>{t(importFeedback.message)}</span>
              </div>
            )}

            {/* 3 Clean Bento Action Cards */}
            <div className="data-action-list">
              {/* 1) Export .json */}
              <div className="data-action-card">
                <div className="data-action-info">
                  <span className="data-action-icon export" aria-hidden="true">
                    <Download size={18} strokeWidth={2.1} />
                  </span>
                  <div>
                    <div className="data-action-title">{t('profileModal.exportTitle')}</div>
                    <p className="data-action-desc">{t('profileModal.exportDesc')}</p>
                  </div>
                </div>
                <button
                  id="export-json-btn"
                  type="button"
                  className="btn-primary-gradient data-action-btn"
                  onClick={exportUserData}
                >
                  <Download size={15} strokeWidth={2.2} />
                  <span>{t('profileModal.exportBtn')}</span>
                </button>
              </div>

              {/* 2) Import .json */}
              <div className="data-action-card">
                <div className="data-action-info">
                  <span className="data-action-icon import" aria-hidden="true">
                    <Upload size={18} strokeWidth={2.1} />
                  </span>
                  <div>
                    <div className="data-action-title">{t('profileModal.importTitle')}</div>
                    <p className="data-action-desc">{t('profileModal.importDesc')}</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  id="import-json-file-input"
                  type="file"
                  accept=".json,application/json"
                  className="sr-only-input"
                  onChange={handleFileChange}
                />
                <button
                  id="import-json-btn"
                  type="button"
                  className="btn-soft-gray data-action-btn"
                  onClick={handleTriggerImport}
                >
                  <Upload size={15} strokeWidth={2.2} />
                  <span>{t('profileModal.importBtn')}</span>
                </button>
              </div>

              {/* 3) Two-Step Reset Demo Data */}
              <div className={`data-action-card ${confirmReset ? 'danger-armed' : ''}`}>
                <div className="data-action-info">
                  <span className="data-action-icon reset" aria-hidden="true">
                    <RotateCcw size={18} strokeWidth={2.1} />
                  </span>
                  <div>
                    <div className="data-action-title">{t('profileModal.resetTitle')}</div>
                    <p className="data-action-desc">{t('profileModal.resetDesc')}</p>
                  </div>
                </div>

                <div className="reset-action-group">
                  {confirmReset && (
                    <button
                      type="button"
                      className="btn-reset-cancel"
                      onClick={() => setConfirmReset(false)}
                    >
                      {t('profileModal.resetCancelHint')}
                    </button>
                  )}
                  <button
                    id="reset-demo-btn"
                    type="button"
                    className={`data-action-btn ${confirmReset ? 'btn-danger-confirm' : 'btn-danger-soft'}`}
                    onClick={handleResetClick}
                  >
                    <RotateCcw size={15} strokeWidth={2.2} />
                    <span>
                      {confirmReset
                        ? t('profileModal.resetConfirmBtn')
                        : t('profileModal.resetBtn')}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-soft-gray" onClick={onClose}>
                {t('profileModal.cancelBtn')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

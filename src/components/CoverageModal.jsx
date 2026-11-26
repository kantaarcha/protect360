import { useState } from 'react';
import { AlertTriangle, ShieldCheck, Trash2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFinance } from '../context/FinanceContext';
import { useLiquidSlider } from '../hooks/useLiquidSlider';
import { getCardHolderDisplay } from '../utils/userHelpers';

export default function CoverageModal({ editingCoverage, onClose }) {
  const { lang, fontStepIdx, t } = useLanguage();
  const { userProfile, addCoverage, updateCoverage, removeCoverage } = useFinance();

  const isEditing = Boolean(editingCoverage);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [name, setName] = useState(
    isEditing ? (lang === 'TH' ? editingCoverage.name.th : editingCoverage.name.en) : ''
  );
  const [type, setType] = useState(isEditing ? editingCoverage.type : 'personal');
  const [limitKnown, setLimitKnown] = useState(
    isEditing ? editingCoverage.limitKnown : true
  );
  const limitSlider = useLiquidSlider(limitKnown ? 'known' : 'unknown', [lang, fontStepIdx]);
  const [medical, setMedical] = useState(
    isEditing ? String(editingCoverage.benefits?.medical || 200000) : '300000'
  );
  const [accident, setAccident] = useState(
    isEditing ? String(editingCoverage.benefits?.accident || 100000) : '150000'
  );
  const [criticalIllness, setCriticalIllness] = useState(
    isEditing ? String(editingCoverage.benefits?.criticalIllness || 0) : '200000'
  );
  const [monthlyPremium, setMonthlyPremium] = useState(
    isEditing ? String(editingCoverage.monthlyPremium || 0) : '1200'
  );

  const cardHolderName = getCardHolderDisplay(userProfile);
  const previewPolicyTitle =
    name.trim() ||
    (isEditing
      ? t(editingCoverage.name)
      : lang === 'TH'
        ? 'กรมธรรม์ความคุ้มครองใหม่'
        : 'New Coverage Policy');
  const previewTheme = isEditing
    ? editingCoverage.theme || 'royal'
    : type === 'personal'
      ? 'teal'
      : type === 'employer'
        ? 'royal'
        : 'navy';

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName =
      name.trim() ||
      (lang === 'TH' ? 'กรมธรรม์ความคุ้มครองเพิ่มเติม' : 'Additional Coverage Plan');

    const medNum = limitKnown ? Math.max(0, Number(medical) || 0) : 0;
    const accNum = limitKnown ? Math.max(0, Number(accident) || 0) : 0;
    const ciNum = limitKnown ? Math.max(0, Number(criticalIllness) || 0) : 0;
    const premNum = type === 'personal' ? Math.max(0, Number(monthlyPremium) || 0) : 0;

    const subtitle = limitKnown
      ? {
          th: `รักษาพยาบาล ฿${medNum.toLocaleString('en-US')} • อัปเดตแล้ว`,
          en: `Medical ฿${medNum.toLocaleString('en-US')} • Verified`,
        }
      : {
          th: 'ไม่ทราบวงเงิน → นับเป็น ฿0',
          en: 'Unknown Limit → Counted as ฿0',
        };

    if (isEditing) {
      updateCoverage(editingCoverage.id, {
        limitKnown,
        status: limitKnown ? 'active' : 'unknown_limit',
        monthlyPremium: premNum,
        subtitle,
        benefits: {
          ...editingCoverage.benefits,
          medical: medNum,
          accident: accNum,
          criticalIllness: ciNum,
        },
      });
    } else {
      const providerTagMap = {
        personal: { th: 'ประกันส่วนตัว', en: 'Personal' },
        employer: { th: 'สวัสดิการบริษัท', en: 'Employer' },
        statutory: { th: 'สิทธิภาครัฐ', en: 'Statutory' },
      };

      addCoverage({
        type,
        name: { th: cleanName, en: cleanName },
        providerTag: providerTagMap[type] || providerTagMap.personal,
        cardNumberMask:
          type === 'personal'
            ? `POL •••• ${String(Math.floor(1000 + Math.random() * 9000))}`
            : type === 'employer'
              ? 'GRP •••• 2026'
              : 'GOV •••• 1001',
        subtitle,
        status: limitKnown ? 'active' : 'unknown_limit',
        limitKnown,
        monthlyPremium: premNum,
        theme: type === 'personal' ? 'teal' : type === 'employer' ? 'royal' : 'navy',
        benefits: {
          medical: medNum,
          accident: accNum,
          criticalIllness: ciNum,
          disability: 0,
          incomeComp: 0,
          family: 0,
        },
      });
    }

    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coverage-modal-title"
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 id="coverage-modal-title" className="card-title">
            {isEditing ? t('modal.editGroupTitle') : t('modal.addTitle')}
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Card Holder Preview Banner */}
        <div className={`coverage-modal-vcard ${previewTheme}`}>
          <div className="coverage-modal-vcard-top">
            <span className="coverage-modal-vcard-brand">
              <ShieldCheck size={13} strokeWidth={2.3} />
              PROTECT360
            </span>
            <span className="coverage-modal-vcard-status">
              {limitKnown ? t('overview.activeStatus') : t('overview.unknownLimitStatus')}
            </span>
          </div>
          <div className="coverage-modal-vcard-name">{previewPolicyTitle}</div>
          <div className="coverage-modal-vcard-foot">
            <div className="coverage-modal-holder">
              <span className="coverage-modal-holder-label">{t('modal.cardHolderPreview')}</span>
              <span className="coverage-modal-holder-val">{cardHolderName}</span>
            </div>
            <span className="tabular-nums coverage-modal-mask">
              {isEditing ? editingCoverage.cardNumberMask : 'POL •••• NEW'}
            </span>
          </div>
        </div>

        <div className="modal-info-box">{t('modal.subtitle')}</div>

        <form className="form-stack" onSubmit={handleSubmit}>
          {!isEditing && (
            <>
              <div className="form-field">
                <label htmlFor="cov-name-input" className="form-label">
                  {t('modal.policyName')}
                </label>
                <input
                  id="cov-name-input"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('modal.policyNamePlaceholder')}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="cov-type-select" className="form-label">
                  {t('modal.providerType')}
                </label>
                <select
                  id="cov-type-select"
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="personal">{t('modal.typePersonal')}</option>
                  <option value="employer">{t('modal.typeEmployer')}</option>
                  <option value="statutory">{t('modal.typeStatutory')}</option>
                </select>
              </div>
            </>
          )}

          <div className="form-field">
            <span className="form-label">{t('modal.limitKnownLabel')}</span>
            <div
              className="segmented-choice liquid-track liquid-segmented-shell"
              ref={limitSlider.containerRef}
            >
              <span
                className="liquid-glass-pill liquid-pill-choice"
                style={limitSlider.indicatorStyle}
                aria-hidden="true"
              />
              <button
                type="button"
                data-liquid-active={limitKnown ? 'true' : undefined}
                className={`choice-btn ${limitKnown ? 'active' : ''}`}
                onClick={() => setLimitKnown(true)}
              >
                {t('modal.knownYes')}
              </button>
              <button
                type="button"
                data-liquid-active={!limitKnown ? 'true' : undefined}
                className={`choice-btn ${!limitKnown ? 'active' : ''}`}
                onClick={() => setLimitKnown(false)}
              >
                {t('modal.knownNo')}
              </button>
            </div>
          </div>

          {limitKnown && (
            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="cov-med-input" className="form-label">
                  {t('modal.medicalLimit')}
                </label>
                <input
                  id="cov-med-input"
                  type="number"
                  min="0"
                  step="10000"
                  className="form-input tabular-nums"
                  value={medical}
                  onChange={(e) => setMedical(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="cov-acc-input" className="form-label">
                  {t('modal.accidentLimit')}
                </label>
                <input
                  id="cov-acc-input"
                  type="number"
                  min="0"
                  step="10000"
                  className="form-input tabular-nums"
                  value={accident}
                  onChange={(e) => setAccident(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="cov-ci-input" className="form-label">
                  {t('modal.ciLimit')}
                </label>
                <input
                  id="cov-ci-input"
                  type="number"
                  min="0"
                  step="10000"
                  className="form-input tabular-nums"
                  value={criticalIllness}
                  onChange={(e) => setCriticalIllness(e.target.value)}
                />
              </div>
              {type === 'personal' && (
                <div className="form-field">
                  <label htmlFor="cov-prem-input" className="form-label">
                    {t('modal.monthlyPremium')}
                  </label>
                  <input
                    id="cov-prem-input"
                    type="number"
                    min="0"
                    step="100"
                    className="form-input tabular-nums"
                    value={monthlyPremium}
                    onChange={(e) => setMonthlyPremium(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {isEditing && confirmDelete && (
            <div className="delete-confirm-box" role="alert">
              <div className="delete-confirm-head">
                <AlertTriangle size={16} strokeWidth={2.3} aria-hidden="true" />
                <strong>{t('modal.confirmDeleteTitle')}</strong>
              </div>
              <p className="delete-confirm-desc">{t('modal.confirmDeleteDesc')}</p>
              <div className="delete-confirm-actions">
                <button
                  type="button"
                  className="btn-reset-cancel"
                  onClick={() => setConfirmDelete(false)}
                >
                  {t('modal.cancel')}
                </button>
                <button
                  id="confirm-delete-coverage-btn"
                  type="button"
                  className="data-action-btn btn-danger-confirm"
                  onClick={() => {
                    removeCoverage(editingCoverage.id);
                    onClose();
                  }}
                >
                  <Trash2 size={14} strokeWidth={2.2} />
                  <span>{t('modal.confirmDeleteBtn')}</span>
                </button>
              </div>
            </div>
          )}

          <div className={`modal-actions ${isEditing ? 'has-delete' : ''}`}>
            {isEditing && !confirmDelete && (
              <button
                id="delete-coverage-modal-btn"
                type="button"
                className="btn-danger-outline"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={15} strokeWidth={2.2} />
                <span>{t('modal.deletePolicy')}</span>
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-soft-gray" onClick={onClose}>
                {t('modal.cancel')}
              </button>
              <button type="submit" className="btn-primary-gradient">
                {t('modal.save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

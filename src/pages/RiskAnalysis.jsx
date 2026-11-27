import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  HeartPulse,
  HelpCircle,
  Info,
  PiggyBank,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import { OCCUPATION_OPTIONS } from '../utils/userHelpers';
import { GOV_SCHEMES } from '../utils/riskActuarial';
import { downloadCalendarReminderIcs } from '../utils/calendarIcs';
import LiquidTabs from '../components/LiquidTabs';
import ProtectionGapChart from '../components/ProtectionGapChart';

function getFutureIsoDate(daysAhead = 7) {
  const dt = new Date();
  dt.setDate(dt.getDate() + daysAhead);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const PERSONAL_POLICY_ROWS = [
  {
    key: 'health',
    icon: HeartPulse,
    label: { th: 'ประกันสุขภาพ (Health)', en: 'Personal Health' },
    hint: { th: 'วงเงินค่ารักษาพยาบาลผู้ป่วยใน (IPD)', en: 'Inpatient medical limit (IPD)' },
  },
  {
    key: 'accident',
    icon: ShieldAlert,
    label: { th: 'ประกันอุบัติเหตุ (Accident / PA)', en: 'Personal Accident (PA)' },
    hint: { th: 'วงเงินคุ้มครองอุบัติเหตุและการบาดเจ็บ', en: 'Emergency injury & accident limit' },
  },
  {
    key: 'criticalIllness',
    icon: Activity,
    label: { th: 'ประกันโรคร้ายแรง (Critical Illness)', en: 'Critical Illness (CI)' },
    hint: { th: 'ทุนเงินก้อนเมื่อตรวจพบโรคร้ายแรง', en: 'Lump-sum CI recovery benefit' },
  },
  {
    key: 'lifeDisability',
    icon: Users,
    label: { th: 'ประกันชีวิต / ทุพพลภาพ (Life & TPD)', en: 'Life & Disability (TPD)' },
    hint: { th: 'ทุนคุ้มครองครอบครัว หนี้สิน และทุพพลภาพ', en: 'Family, debt & disability protection' },
  },
];

const RISK_CATEGORY_ICONS = {
  medical: HeartPulse,
  accident: ShieldAlert,
  criticalIllness: Activity,
  disability: Shield,
  incomeComp: PiggyBank,
  family: Users,
};

const REMINDER_PRESETS = [
  {
    id: 'hr-group',
    title: { th: 'เช็กวงเงินประกันกลุ่มกับ HR', en: 'Check Employer Group Insurance Limit with HR' },
    desc: {
      th: 'สอบถามตารางวงเงินค่ารักษาผู้ป่วยใน (IPD), ผู้ป่วยนอก (OPD) และอุบัติเหตุของประกันกลุ่มบริษัท เพื่อนำมาอัปเดตใน PROTECT360',
      en: 'Request your employer group insurance benefit schedule (IPD, OPD, accident limits) to update your PROTECT360 gap analysis.',
    },
  },
  {
    id: 'annual-review',
    title: { th: 'ทบทวนความคุ้มครองประจำปี', en: 'Annual Protection & Risk Review' },
    desc: {
      th: 'ทบทวนเงินสำรองฉุกเฉิน 3–6 เดือน รายได้ ภาระหนี้สิน และช่องว่างความคุ้มครองทั้ง 6 ด้านประจำปีใน PROTECT360',
      en: 'Review your 3–6 month emergency fund, income, debts, and 6-pillar protection gaps in PROTECT360.',
    },
  },
  {
    id: 'policy-renewal',
    title: { th: 'วันครบกำหนดต่ออายุกรมธรรม์', en: 'Policy Renewal & Benefit Check' },
    desc: {
      th: 'ตรวจสอบเงื่อนไข ความคุ้มครอง และงบเบี้ยประกันรวมให้อยู่ในกรอบปลอดภัยไม่เกิน 10%–15% ของรายได้',
      en: 'Review policy renewal terms and verify total premiums remain within your safe 10%–15% income cap.',
    },
  },
];

export default function RiskAnalysis({ onNavigate }) {
  const { lang, t } = useLanguage();
  const {
    userProfile,
    monthlyIncome,
    monthlyExpenses,
    emergencyFund,
    emergencyRunway,
    riskProfile,
    riskAssessment,
    updateUserProfile,
    updateProfile,
    updateRiskProfile,
    showToast,
  } = useFinance();

  // Main workspace tabs: 'input' | 'results'
  const [activeTab, setActiveTab] = useState('input');

  // Expandable 6 plain-language risk cards (default expand first high-risk card)
  const [expandedCardId, setExpandedCardId] = useState(() => {
    const firstHigh = riskAssessment?.categories?.find((c) => c.level === 'high');
    return firstHigh?.id || 'medical';
  });

  // Client-side .ics Calendar Reminder state
  const [selectedPresetId, setSelectedPresetId] = useState(REMINDER_PRESETS[0].id);
  const [reminderTitle, setReminderTitle] = useState(() =>
    lang === 'TH' ? REMINDER_PRESETS[0].title.th : REMINDER_PRESETS[0].title.en
  );
  const [reminderDate, setReminderDate] = useState(() => getFutureIsoDate(7));

  const safeBudgetMin = Math.round(monthlyIncome * 0.1);
  const safeBudgetMax = Math.round(monthlyIncome * 0.15);
  const sixMonthTarget = Math.max(60000, Math.round(monthlyExpenses * 6));
  const runwaySixPct =
    sixMonthTarget > 0
      ? Math.min(100, Math.round((emergencyFund / sixMonthTarget) * 100))
      : 0;
  const remainingForThreeMonths = Math.max(0, monthlyExpenses * 3 - emergencyFund);
  const remainingForSixMonths = Math.max(0, sixMonthTarget - emergencyFund);

  const mainTabs = [
    {
      id: 'input',
      label: lang === 'TH' ? 'ข้อมูล & สิทธิ' : 'Profile & Rights',
      icon: SlidersHorizontal,
    },
    {
      id: 'results',
      label: lang === 'TH' ? 'ผลวิเคราะห์' : 'Gap & Plan',
      icon: ClipboardCheck,
      badge: riskAssessment.highRiskCount > 0 ? riskAssessment.highRiskCount : undefined,
    },
  ];

  const workflowStages = [
    {
      num: 1,
      tab: 'input',
      label: { th: 'ข้อมูลพื้นฐาน', en: 'Profile' },
    },
    {
      num: 2,
      tab: 'input',
      label: { th: 'สวัสดิการที่มี', en: 'Existing Coverage' },
    },
    {
      num: 3,
      tab: 'results',
      label: { th: 'ช่องว่างความคุ้มครอง', en: 'Protection Gap' },
    },
    {
      num: 4,
      tab: 'results',
      label: { th: 'แผนจัดการความเสี่ยง', en: 'Action Plan' },
    },
  ];

  const getRiskStatusLabel = (level) => {
    if (level === 'high') return lang === 'TH' ? 'เสี่ยงสูง' : 'High Risk';
    if (level === 'moderate') return lang === 'TH' ? 'ปานกลาง' : 'Moderate';
    return lang === 'TH' ? 'เพียงพอ' : 'Covered';
  };

  const getOverallRiskText = (level) => {
    if (level === 'high') return lang === 'TH' ? 'สูง (High)' : 'High';
    if (level === 'moderate') return lang === 'TH' ? 'ปานกลาง (Moderate)' : 'Moderate';
    return lang === 'TH' ? 'ต่ำ (Low)' : 'Low';
  };

  const handleNumberInput = (raw) => {
    const cleaned = String(raw || '').replace(/[^\d.]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const handleGoToResults = () => {
    updateRiskProfile({
      assessmentCompleted: true,
      lastAssessedAt: new Date().toISOString(),
    });
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReminderPresetSelect = (preset) => {
    setSelectedPresetId(preset.id);
    setReminderTitle(t(preset.title));
  };

  const handleDownloadIcs = (e) => {
    e.preventDefault();
    const cleanTitle = reminderTitle.trim();
    if (!cleanTitle || !reminderDate) return;

    const matchedPreset = REMINDER_PRESETS.find((p) => p.id === selectedPresetId);
    const description = matchedPreset
      ? t(matchedPreset.desc)
      : lang === 'TH'
        ? 'แจ้งเตือนทบทวนความคุ้มครองและแผนจัดการความเสี่ยงจาก PROTECT360 (ไม่ขายประกัน)'
        : 'Protection & risk review reminder generated locally by PROTECT360.';

    const fileName = downloadCalendarReminderIcs({
      title: cleanTitle,
      isoDate: reminderDate,
      description,
    });

    showToast('success', {
      th: `ดาวน์โหลดไฟล์ปฏิทิน ${fileName} เรียบร้อยแล้ว`,
      en: `Downloaded calendar reminder ${fileName}`,
    });
  };

  const groupIns = riskProfile.groupInsurance || { active: true, unknownLimit: true, limit: 0 };
  const personalPolicies = riskProfile.personalPolicies || {};

  return (
    <div className="ra-stack">
      {/* ================= 1) 4-STAGE VISUAL WORKFLOW & MODE SWITCHER ================= */}
      <section className="bento-card ra-workflow-card" aria-label="Risk analysis workflow">
        <div className="ra-workflow-top">
          <div className="ra-stepper" role="list">
            {workflowStages.map((stage, idx) => {
              const isCompleted = activeTab === 'results' && stage.num <= 2;
              const isCurrent =
                (activeTab === 'input' && stage.num <= 2) ||
                (activeTab === 'results' && stage.num >= 3);
              return (
                <div key={stage.num} className="ra-step-wrap" role="listitem">
                  <button
                    type="button"
                    className={`ra-step-btn ${isCurrent ? 'current' : ''} ${
                      isCompleted ? 'done' : ''
                    }`}
                    onClick={() => setActiveTab(stage.tab)}
                  >
                    <span className="ra-step-num tabular-nums">
                      {isCompleted ? <CheckCircle2 size={13} strokeWidth={2.6} /> : stage.num}
                    </span>
                    <span className="ra-step-label">{t(stage.label)}</span>
                  </button>
                  {idx < workflowStages.length - 1 && (
                    <ChevronRight
                      size={14}
                      strokeWidth={2.2}
                      className="ra-step-arrow"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <span className="ra-actuarial-pill">
            <ShieldCheck size={14} strokeWidth={2.3} aria-hidden="true" />
            <span>
              {lang === 'TH'
                ? 'ประเมินตามหลักคณิตศาสตร์ประกันภัย • ไม่ขายประกัน'
                : 'Neutral Actuarial Engine • Zero Insurance Sales'}
            </span>
          </span>
        </div>

        <LiquidTabs
          tabs={mainTabs}
          activeId={activeTab}
          onChange={setActiveTab}
          variant="surface"
          idPrefix="risk-analysis-mode"
          ariaLabel={lang === 'TH' ? 'สลับหน้ากรอกข้อมูลและผลวิเคราะห์' : 'Switch input and results'}
        />
      </section>

      {/* ================= TAB 1: PROFILE & EXISTING COVERAGE INPUT ================= */}
      {activeTab === 'input' && (
        <div className="ra-input-stage">
          <div className="ra-input-grid">
            {/* CARD A: Personal & Cashflow Sync */}
            <section className="bento-card ra-card" aria-labelledby="ra-profile-heading">
              <div className="ra-card-head">
                <span className="ra-card-icon blue" aria-hidden="true">
                  <Briefcase size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <h2 id="ra-profile-heading" className="card-title">
                    {lang === 'TH'
                      ? '1. ข้อมูลส่วนตัวและการเงิน'
                      : '1. Personal & Cashflow Sync'}
                  </h2>
                  <p className="card-subtitle">
                    {lang === 'TH'
                      ? 'เชื่อมต่อสดกับโปรไฟล์และสมุดบัญชี 360Flow แก้ไขตรงนี้แล้วซิงก์ทั้งระบบทันที'
                      : 'Synced live with your profile & 360Flow — edits update across PROTECT360'}
                  </p>
                </div>
              </div>

              <div className="ra-form-section">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="ra-age-input" className="form-label">
                      {lang === 'TH' ? 'อายุ (ปี)' : 'Age (Years)'}
                    </label>
                    <input
                      id="ra-age-input"
                      type="number"
                      min="15"
                      max="99"
                      className="form-input tabular-nums"
                      value={userProfile.age}
                      onChange={(e) =>
                        updateUserProfile(
                          { age: handleNumberInput(e.target.value) },
                          { silent: true }
                        )
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="ra-occ-select" className="form-label">
                      {lang === 'TH' ? 'อาชีพปัจจุบัน' : 'Occupation'}
                    </label>
                    <select
                      id="ra-occ-select"
                      className="form-select"
                      value={userProfile.occupation}
                      onChange={(e) =>
                        updateUserProfile({ occupation: e.target.value }, { silent: true })
                      }
                    >
                      {OCCUPATION_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.th}>
                          {lang === 'TH' ? opt.th : opt.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dependents Quick Selector */}
                <div className="form-field">
                  <span className="form-label">
                    {lang === 'TH'
                      ? 'จำนวนผู้อยู่ในอุปการะ (พ่อแม่ / บุตร / ครอบครัว)'
                      : 'Number of Dependents'}
                  </span>
                  <div className="ra-dep-pills">
                    {[0, 1, 2, 3, 4].map((count) => {
                      const isActive = userProfile.dependents === count;
                      return (
                        <button
                          key={count}
                          type="button"
                          className={`ra-dep-btn tabular-nums ${isActive ? 'active' : ''}`}
                          aria-pressed={isActive}
                          onClick={() =>
                            updateUserProfile({ dependents: count }, { silent: true })
                          }
                        >
                          {count === 4 ? '4+' : count}{' '}
                          {lang === 'TH' ? 'คน' : count === 1 ? 'person' : 'people'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="ak-divider" />

                {/* Cashflow Sync Inputs */}
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="ra-income-input" className="form-label">
                      {lang === 'TH' ? 'รายรับต่อเดือน (บาท)' : 'Monthly Income (THB)'}
                    </label>
                    <input
                      id="ra-income-input"
                      type="number"
                      min="0"
                      step="500"
                      className="form-input tabular-nums ak-amount-input income"
                      value={monthlyIncome}
                      onChange={(e) =>
                        updateProfile({ monthlyIncome: handleNumberInput(e.target.value) })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="ra-expenses-input" className="form-label">
                      {lang === 'TH' ? 'รายจ่ายต่อเดือน (บาท)' : 'Monthly Expenses (THB)'}
                    </label>
                    <input
                      id="ra-expenses-input"
                      type="number"
                      min="0"
                      step="500"
                      className="form-input tabular-nums ak-amount-input expense"
                      value={monthlyExpenses}
                      onChange={(e) =>
                        updateProfile({ monthlyExpenses: handleNumberInput(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="ra-emergency-input" className="form-label">
                    {lang === 'TH'
                      ? 'เงินสำรองฉุกเฉินพร้อมใช้ปัจจุบัน (บาท)'
                      : 'Current Liquid Emergency Fund (THB)'}
                  </label>
                  <input
                    id="ra-emergency-input"
                    type="number"
                    min="0"
                    step="500"
                    className="form-input tabular-nums ak-amount-input saving"
                    value={emergencyFund}
                    onChange={(e) =>
                      updateProfile({ liquidEmergencyFund: handleNumberInput(e.target.value) })
                    }
                  />
                </div>

                <div className="ak-divider" />

                {/* Debt Obligations */}
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="ra-monthly-debt" className="form-label">
                      {lang === 'TH'
                        ? 'หนี้สินผ่อนชำระต่อเดือน (บาท)'
                        : 'Monthly Debt Payments (THB)'}
                    </label>
                    <input
                      id="ra-monthly-debt"
                      type="number"
                      min="0"
                      step="500"
                      className="form-input tabular-nums"
                      value={riskProfile.monthlyDebt || 0}
                      onChange={(e) =>
                        updateRiskProfile({ monthlyDebt: handleNumberInput(e.target.value) })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="ra-total-debt" className="form-label">
                      {lang === 'TH'
                        ? 'ยอดหนี้คงค้างรวมทั้งหมด (บาท)'
                        : 'Total Outstanding Debt (THB)'}
                    </label>
                    <input
                      id="ra-total-debt"
                      type="number"
                      min="0"
                      step="1000"
                      className="form-input tabular-nums"
                      value={riskProfile.totalDebt || 0}
                      onChange={(e) =>
                        updateRiskProfile({ totalDebt: handleNumberInput(e.target.value) })
                      }
                    />
                  </div>
                </div>

                {/* Live Financial Health Mini Strip */}
                <div className="ra-sync-summary tabular-nums">
                  <div className="ra-sync-stat">
                    <span>{lang === 'TH' ? 'ภาระหนี้ต่อรายได้ (DTI)' : 'Debt-to-Income (DTI)'}</span>
                    <strong
                      className={
                        riskAssessment.debtToIncomeRatio > 40
                          ? 'text-red'
                          : riskAssessment.debtToIncomeRatio > 25
                            ? 'text-amber'
                            : 'text-green'
                      }
                    >
                      {riskAssessment.debtToIncomeRatio}%
                    </strong>
                  </div>
                  <div className="ra-sync-stat">
                    <span>{lang === 'TH' ? 'งบป้องกันความเสี่ยงที่ปลอดภัย (10%–15%)' : 'Safe Risk Budget (10%–15%)'}</span>
                    <strong className="text-blue">
                      {formatTHB(safeBudgetMin)} – {formatTHB(safeBudgetMax)}
                      {lang === 'TH' ? '/ด.' : '/mo'}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* CARD B: Existing Protection & Conservative Estimation Check */}
            <section className="bento-card ra-card" aria-labelledby="ra-coverage-heading">
              <div className="ra-card-head">
                <span className="ra-card-icon navy" aria-hidden="true">
                  <Building2 size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <h2 id="ra-coverage-heading" className="card-title">
                    {lang === 'TH'
                      ? '2. ตรวจสอบสวัสดิการและความคุ้มครองที่มีอยู่'
                      : '2. Existing Protection Check'}
                  </h2>
                  <p className="card-subtitle">
                    {lang === 'TH'
                      ? 'เลือกสิทธิพื้นฐานและระบุวงเงินที่มีจริง หากไม่แน่ใจให้กด "ไม่ทราบวงเงิน"'
                      : 'Select your statutory scheme and enter known limits — mark unknown limits honestly'}
                  </p>
                </div>
              </div>

              <div className="ra-form-section">
                {/* Government Baseline Selector */}
                <div className="form-field">
                  <span className="form-label">
                    {lang === 'TH' ? 'สิทธิรักษาพยาบาลพื้นฐานภาครัฐ' : 'Government Baseline Scheme'}
                  </span>
                  <div className="ra-gov-grid">
                    {GOV_SCHEMES.map((scheme) => {
                      const isSelected = riskProfile.govScheme === scheme.id;
                      return (
                        <button
                          key={scheme.id}
                          id={`ra-gov-${scheme.id}`}
                          type="button"
                          className={`ra-gov-card ${isSelected ? 'active' : ''}`}
                          aria-pressed={isSelected}
                          onClick={() => updateRiskProfile({ govScheme: scheme.id })}
                        >
                          <div className="ra-gov-title">{t(scheme.label)}</div>
                          <div className="ra-gov-desc">{t(scheme.desc)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="ak-divider" />

                {/* Employer Group Insurance Row */}
                <div className="ra-policy-block">
                  <div className="ra-policy-block-label">
                    {lang === 'TH' ? 'สวัสดิการนายจ้าง' : 'Employer Benefit'}
                  </div>

                  <div className={`ra-policy-row ${groupIns.active ? 'active' : ''}`}>
                    <div className="ra-policy-row-top">
                      <label className="ra-toggle-label">
                        <input
                          id="ra-group-active"
                          type="checkbox"
                          className="ra-switch-input"
                          checked={groupIns.active}
                          onChange={(e) =>
                            updateRiskProfile({
                              groupInsurance: { active: e.target.checked },
                            })
                          }
                        />
                        <span className="ra-switch-track" aria-hidden="true" />
                        <span className="ra-policy-name">
                          {lang === 'TH' ? 'ประกันกลุ่มบริษัท' : 'Employer Group Insurance'}
                        </span>
                      </label>

                      {groupIns.active && (
                        <button
                          id="ra-group-unknown-btn"
                          type="button"
                          className={`ra-unknown-pill ${groupIns.unknownLimit ? 'active' : ''}`}
                          aria-pressed={groupIns.unknownLimit}
                          onClick={() =>
                            updateRiskProfile({
                              groupInsurance: { unknownLimit: !groupIns.unknownLimit },
                            })
                          }
                        >
                          <HelpCircle size={13} strokeWidth={2.2} aria-hidden="true" />
                          <span>{lang === 'TH' ? 'ไม่ทราบวงเงิน' : "I don't know"}</span>
                        </button>
                      )}
                    </div>

                    {groupIns.active && (
                      <div className="ra-policy-row-controls">
                        {groupIns.unknownLimit ? (
                          <div className="ra-unknown-zero-chip tabular-nums">
                            {lang === 'TH'
                              ? 'ประเมินแบบระมัดระวัง: นับวงเงินที่ใช้ได้จริง = ฿0'
                              : 'Conservative rule: Effective Available Coverage = ฿0'}
                          </div>
                        ) : (
                          <div className="ra-limit-input-wrap">
                            <span className="ra-limit-prefix">฿</span>
                            <input
                              id="ra-group-limit"
                              type="number"
                              min="0"
                              step="10000"
                              className="form-input ra-limit-input tabular-nums"
                              value={groupIns.limit}
                              onChange={(e) =>
                                updateRiskProfile({
                                  groupInsurance: { limit: handleNumberInput(e.target.value) },
                                })
                              }
                              aria-label={
                                lang === 'TH'
                                  ? 'วงเงินประกันกลุ่มบริษัท (บาท)'
                                  : 'Employer Group Insurance Limit (THB)'
                              }
                            />
                            <span className="ra-limit-suffix">
                              {lang === 'TH' ? 'บาท' : 'THB'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Policies (4 Rows) */}
                <div className="ra-policy-block">
                  <div className="ra-policy-block-label">
                    {lang === 'TH' ? 'ประกันส่วนตัวที่มีอยู่ (ถ้ามี)' : 'Personal Policies (If Any)'}
                  </div>

                  <div className="ra-personal-list">
                    {PERSONAL_POLICY_ROWS.map((spec) => {
                      const row = personalPolicies[spec.key] || {
                        active: false,
                        unknownLimit: false,
                        limit: 0,
                      };
                      const Icon = spec.icon;

                      return (
                        <div
                          key={spec.key}
                          className={`ra-policy-row compact ${row.active ? 'active' : ''}`}
                        >
                          <div className="ra-policy-row-top">
                            <label className="ra-toggle-label">
                              <input
                                id={`ra-personal-${spec.key}-active`}
                                type="checkbox"
                                className="ra-switch-input"
                                checked={row.active}
                                onChange={(e) =>
                                  updateRiskProfile({
                                    personalPolicies: {
                                      [spec.key]: { active: e.target.checked },
                                    },
                                  })
                                }
                              />
                              <span className="ra-switch-track" aria-hidden="true" />
                              <span className="ra-policy-title-group">
                                <span className="ra-policy-name">
                                  <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
                                  <span>{t(spec.label)}</span>
                                </span>
                                <span className="ra-policy-hint">{t(spec.hint)}</span>
                              </span>
                            </label>

                            {row.active && (
                              <button
                                id={`ra-personal-${spec.key}-unknown`}
                                type="button"
                                className={`ra-unknown-pill ${row.unknownLimit ? 'active' : ''}`}
                                aria-pressed={row.unknownLimit}
                                onClick={() =>
                                  updateRiskProfile({
                                    personalPolicies: {
                                      [spec.key]: { unknownLimit: !row.unknownLimit },
                                    },
                                  })
                                }
                              >
                                <HelpCircle size={13} strokeWidth={2.2} aria-hidden="true" />
                                <span>{lang === 'TH' ? 'ไม่ทราบวงเงิน' : "I don't know"}</span>
                              </button>
                            )}
                          </div>

                          {row.active && (
                            <div className="ra-policy-row-controls">
                              {row.unknownLimit ? (
                                <div className="ra-unknown-zero-chip tabular-nums">
                                  {lang === 'TH'
                                    ? 'ไม่ทราบวงเงิน → ประเมินเป็น ฿0'
                                    : 'Unknown Limit → Counted as ฿0'}
                                </div>
                              ) : (
                                <div className="ra-limit-input-wrap">
                                  <span className="ra-limit-prefix">฿</span>
                                  <input
                                    id={`ra-personal-${spec.key}-limit`}
                                    type="number"
                                    min="0"
                                    step="10000"
                                    className="form-input ra-limit-input tabular-nums"
                                    value={row.limit}
                                    onChange={(e) =>
                                      updateRiskProfile({
                                        personalPolicies: {
                                          [spec.key]: {
                                            limit: handleNumberInput(e.target.value),
                                          },
                                        },
                                      })
                                    }
                                    aria-label={t(spec.label)}
                                  />
                                  <span className="ra-limit-suffix">
                                    {lang === 'TH' ? 'บาท' : 'THB'}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conservative Actuarial Estimation Educational Callout */}
                {riskAssessment.hasAnyUnknownLimit && (
                  <div className="ra-conservative-callout" role="note">
                    <AlertTriangle size={17} strokeWidth={2.2} className="ra-callout-icon" />
                    <p>
                      {lang === 'TH'
                        ? 'หลักการประเมินแบบระมัดระวัง: สิทธิที่ไม่ทราบวงเงินชัดเจนจะถูกประเมินเป็น 0 บาท เพื่อป้องกันความเสี่ยงเงินไม่พอจ่ายจริงในวันเกิดเหตุ (แนะนำให้สอบถามวงเงินที่แน่นอนกับฝ่ายบุคคล HR)'
                        : 'Conservative Actuarial Estimation: Any coverage marked "I don\'t know" is strictly counted as ฿0 so your protection gap is never underestimated. We recommend verifying exact limits with HR.'}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Seamless CTA Bar to Results */}
          <div className="ra-bottom-cta-bar">
            <div className="ra-bottom-cta-meta tabular-nums">
              <span>
                {lang === 'TH' ? 'ช่องว่างความคุ้มครองรวมที่คำนวณได้ตอนนี้:' : 'Live Calculated Total Protection Gap:'}
              </span>
              <strong className={riskAssessment.totalProtectionGap > 0 ? 'text-red' : 'text-green'}>
                {formatTHB(riskAssessment.totalProtectionGap)}
              </strong>
            </div>
            <button
              id="ra-view-results-btn"
              type="button"
              className="btn-primary-gradient ra-view-results-btn"
              onClick={handleGoToResults}
            >
              <span>
                {lang === 'TH'
                  ? 'ดูผลวิเคราะห์ & แผนจัดการความเสี่ยง'
                  : 'View Gap Analysis & Action Plan'}
              </span>
              <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RESULTS DASHBOARD, ACTION PLAN & .ICS REMINDER ================= */}
      {activeTab === 'results' && (
        <div className="ra-results-stage">
          {/* 1) Top 3 Bento Summary KPI Cards */}
          <section className="ra-kpi-grid" aria-label="Risk assessment summary">
            {/* KPI 1: Overall Risk Score */}
            <article className="bento-card ra-kpi-card">
              <div className="ak-kpi-top">
                <span
                  className={`metric-icon-badge ${
                    riskAssessment.overallRiskLevel === 'high'
                      ? 'expense'
                      : riskAssessment.overallRiskLevel === 'moderate'
                        ? 'warn'
                        : 'income'
                  }`}
                  aria-hidden="true"
                >
                  <ShieldAlert size={18} strokeWidth={2.2} />
                </span>
                <span
                  className={`ra-risk-badge ${riskAssessment.overallRiskLevel}`}
                >
                  {getOverallRiskText(riskAssessment.overallRiskLevel)}
                </span>
              </div>
              <div className="ak-kpi-body">
                <div className="ak-kpi-label">
                  {lang === 'TH' ? 'ระดับความเสี่ยงรวม' : 'Overall Risk Level'}
                </div>
                <div className={`ak-kpi-value ra-risk-text-${riskAssessment.overallRiskLevel}`}>
                  {lang === 'TH'
                    ? `เสี่ยง${
                        riskAssessment.overallRiskLevel === 'high'
                          ? 'สูง'
                          : riskAssessment.overallRiskLevel === 'moderate'
                            ? 'ปานกลาง'
                            : 'ต่ำ'
                      }`
                    : `${getOverallRiskText(riskAssessment.overallRiskLevel)} Risk`}
                </div>
              </div>
              <div className="ra-kpi-footnote tabular-nums">
                {lang === 'TH'
                  ? `เสี่ยงสูง ${riskAssessment.highRiskCount} • ปานกลาง ${riskAssessment.moderateRiskCount} • เพียงพอ ${riskAssessment.coveredCount} ด้าน`
                  : `${riskAssessment.highRiskCount} High • ${riskAssessment.moderateRiskCount} Moderate • ${riskAssessment.coveredCount} Covered`}
              </div>
            </article>

            {/* KPI 2: Total Protection Gap */}
            <article className="bento-card ra-kpi-card">
              <div className="ak-kpi-top">
                <span className="metric-icon-badge expense" aria-hidden="true">
                  <AlertCircle size={18} strokeWidth={2.2} />
                </span>
                <span className="ak-kpi-pill blue tabular-nums">
                  {lang === 'TH'
                    ? `ครอบคลุมแล้ว ${riskAssessment.overallCoveragePct}%`
                    : `${riskAssessment.overallCoveragePct}% covered`}
                </span>
              </div>
              <div className="ak-kpi-body">
                <div className="ak-kpi-label">
                  {lang === 'TH' ? 'ช่องว่างความคุ้มครองรวม' : 'Total Protection Gap'}
                </div>
                <div
                  className={`ak-kpi-value tabular-nums ${
                    riskAssessment.totalProtectionGap > 0 ? 'expense' : 'income'
                  }`}
                >
                  {formatTHB(riskAssessment.totalProtectionGap)}
                </div>
              </div>
              <div className="ra-kpi-footnote tabular-nums">
                {lang === 'TH'
                  ? `ที่มีจริง ${formatTHB(riskAssessment.totalEffectiveCoverage)} / ที่ควรมี ${formatTHB(riskAssessment.totalNeededCoverage)}`
                  : `Effective ${formatTHB(riskAssessment.totalEffectiveCoverage)} / Needed ${formatTHB(riskAssessment.totalNeededCoverage)}`}
              </div>
            </article>

            {/* KPI 3: Emergency Runway vs 6-Month Risk Target */}
            <article className="bento-card ra-kpi-card">
              <div className="ak-kpi-top">
                <span className="metric-icon-badge saving" aria-hidden="true">
                  <PiggyBank size={18} strokeWidth={2.1} />
                </span>
                <span
                  className={`warning-pill tabular-nums ${
                    emergencyRunway >= 6 ? 'safe' : ''
                  }`}
                >
                  <span
                    className={`status-dot ${emergencyRunway >= 6 ? 'green' : 'amber'}`}
                    aria-hidden="true"
                  />
                  {lang === 'TH' ? 'เป้า 6 เดือน' : '6-mo target'}
                </span>
              </div>
              <div className="ak-kpi-body">
                <div className="ak-kpi-label">
                  {lang === 'TH' ? 'เงินสำรองฉุกเฉินอยู่ได้' : 'Emergency Runway'}
                </div>
                <div className="ak-kpi-value saving tabular-nums">
                  {emergencyRunway.toFixed(2)}{' '}
                  <small className="ra-unit-sm">{lang === 'TH' ? 'เดือน' : 'mo.'}</small>
                </div>
              </div>
              <div className="ak-kpi-progress">
                <div
                  className="progress-track"
                  role="progressbar"
                  aria-valuenow={runwaySixPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="progress-fill" style={{ width: `${runwaySixPct}%` }} />
                </div>
                <div className="ak-kpi-progress-meta tabular-nums">
                  <span>{formatTHB(emergencyFund)}</span>
                  <span>
                    {lang === 'TH'
                      ? `เป้า 6 ด. (${formatTHB(sixMonthTarget)})`
                      : `6-mo (${formatTHB(sixMonthTarget)})`}
                  </span>
                </div>
              </div>
            </article>
          </section>

          {/* 2) Grouped Comparison Bar Chart (Effective Available vs Needed) */}
          <ProtectionGapChart />

          {/* 3) 6 Expandable Plain-Language Risk Cards */}
          <section className="ra-pillars-section" aria-labelledby="ra-pillars-heading">
            <div className="ra-section-head">
              <div>
                <h2 id="ra-pillars-heading" className="card-title ra-section-title">
                  {lang === 'TH'
                    ? 'เจาะลึกความเสี่ยงทั้ง 6 ด้าน (คลิกเพื่ออ่านคำอธิบายแบบเข้าใจง่าย)'
                    : '6-Pillar Risk Breakdown (Click Any Card for Plain-Language Details)'}
                </h2>
                <p className="card-subtitle">
                  {lang === 'TH'
                    ? 'อธิบายสูตรคำนวณ ช่องว่างจริง และกลไกการจัดการความเสี่ยงอย่างเป็นกลาง ไม่ระบุชื่อบริษัทประกัน'
                    : 'Transparent formulas, live gaps, and neutral risk mechanisms — zero brand promotions'}
                </p>
              </div>
              <button
                type="button"
                className="btn-soft-gray ra-edit-inputs-btn"
                onClick={() => setActiveTab('input')}
              >
                <SlidersHorizontal size={14} strokeWidth={2.2} aria-hidden="true" />
                <span>{lang === 'TH' ? 'ปรับข้อมูล / วงเงิน' : 'Edit Inputs'}</span>
              </button>
            </div>

            <div className="ra-pillars-grid">
              {riskAssessment.categories.map((cat) => {
                const Icon = RISK_CATEGORY_ICONS[cat.id] || Shield;
                const isExpanded = expandedCardId === cat.id;

                return (
                  <article
                    key={cat.id}
                    className={`bento-card ra-pillar-card ${isExpanded ? 'expanded' : ''}`}
                  >
                    <button
                      id={`ra-pillar-toggle-${cat.id}`}
                      type="button"
                      className="ra-pillar-trigger"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedCardId((prev) => (prev === cat.id ? null : cat.id))
                      }
                    >
                      <div className="ra-pillar-top">
                        <div className="ra-pillar-title-row">
                          <span className={`ra-pillar-icon ${cat.level}`} aria-hidden="true">
                            <Icon size={17} strokeWidth={2.2} />
                          </span>
                          <div className="ra-pillar-heading-copy">
                            <h3 className="ra-pillar-title">{t(cat.label)}</h3>
                            <span className="ra-pillar-formula">{t(cat.formulaText)}</span>
                          </div>
                        </div>

                        <div className="ra-pillar-right-badges">
                          <span className={`ra-risk-badge ${cat.level}`}>
                            {getRiskStatusLabel(cat.level)}
                          </span>
                          <ChevronDown
                            size={16}
                            strokeWidth={2.3}
                            className={`ra-chevron ${isExpanded ? 'open' : ''}`}
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      {/* Numbers Summary Row */}
                      <div className="ra-pillar-metrics tabular-nums">
                        <div className="ra-pillar-metric">
                          <span>{lang === 'TH' ? 'ที่มีจริง' : 'Effective'}</span>
                          <strong>{formatTHB(cat.effectiveAvailable)}</strong>
                        </div>
                        <div className="ra-pillar-metric">
                          <span>{lang === 'TH' ? 'ที่ควรมี' : 'Needed'}</span>
                          <strong>{formatTHB(cat.needed)}</strong>
                        </div>
                        <div className="ra-pillar-metric">
                          <span>{lang === 'TH' ? 'ช่องว่าง (Gap)' : 'Gap'}</span>
                          <strong className={cat.gap > 0 ? 'text-red' : 'text-green'}>
                            {formatTHB(cat.gap)}
                          </strong>
                        </div>
                      </div>

                      {/* Coverage Progress Bar */}
                      <div className="ra-pillar-bar-row tabular-nums">
                        <div className="ak-bar-track sm">
                          <div
                            className={`ak-bar-fill ra-level-bar-${cat.level}`}
                            style={{ width: `${cat.coveragePct}%` }}
                          />
                        </div>
                        <span className="ra-pillar-pct">{cat.coveragePct}%</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="ra-pillar-detail">
                        <div className="ra-detail-block">
                          <div className="ra-detail-label">
                            <Info size={14} strokeWidth={2.2} aria-hidden="true" />
                            <span>
                              {lang === 'TH' ? 'ทำไมเรื่องนี้ถึงสำคัญ' : 'Why It Matters'}
                            </span>
                          </div>
                          <p>{t(cat.whyItMatters)}</p>
                        </div>

                        <div className="ra-detail-block">
                          <div className="ra-detail-label">
                            <ShieldCheck size={14} strokeWidth={2.2} aria-hidden="true" />
                            <span>
                              {lang === 'TH'
                                ? 'ตัวเลขของคุณตอนนี้'
                                : 'Your Current Coverage vs. Gap'}
                            </span>
                          </div>
                          <p className="tabular-nums">
                            {lang === 'TH'
                              ? `ปัจจุบันคุณมีความคุ้มครองที่ใช้ได้จริง ${formatTHB(cat.effectiveAvailable)} จากเกณฑ์ที่ควรมี ${formatTHB(cat.needed)} (${cat.coveragePct}%)${
                                  cat.gap > 0
                                    ? ` ยังมีช่องว่างอีก ${formatTHB(cat.gap)}`
                                    : ' ครอบคลุมตามเกณฑ์อ้างอิงแล้ว'
                                }${
                                  cat.hasDirectUnknown
                                    ? ' • หมายเหตุ: มีสวัสดิการที่ระบุว่า "ไม่ทราบวงเงิน" จึงประเมินเป็น ฿0 ตามหลักความระมัดระวัง'
                                    : ''
                                }`
                              : `Effective coverage is ${formatTHB(cat.effectiveAvailable)} out of ${formatTHB(cat.needed)} (${cat.coveragePct}%)${
                                  cat.gap > 0
                                    ? `, leaving a ${formatTHB(cat.gap)} protection gap.`
                                    : ', meeting the actuarial benchmark.'
                                }${
                                  cat.hasDirectUnknown
                                    ? ' Note: Active coverage marked "I don\'t know" is conservatively valued at ฿0.'
                                    : ''
                                }`}
                          </p>
                        </div>

                        <div className="ra-detail-block mechanism">
                          <div className="ra-detail-label">
                            <CheckCircle2 size={14} strokeWidth={2.2} aria-hidden="true" />
                            <span>
                              {lang === 'TH'
                                ? 'กลไกความคุ้มครองแบบเข้าใจง่าย'
                                : 'Plain-Language Protection Mechanism'}
                            </span>
                          </div>
                          <p>{t(cat.mechanism)}</p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* 4) Bottom 2-Column Row: Prioritized 3-Step Neutral Action Plan + .ics Calendar Reminder */}
          <div className="ra-bottom-grid">
            {/* Prioritized 3-Step Neutral Action Plan */}
            <section className="bento-card ra-action-card" aria-labelledby="ra-action-heading">
              <div className="ra-card-head">
                <span className="ra-card-icon blue" aria-hidden="true">
                  <ClipboardCheck size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <h2 id="ra-action-heading" className="card-title">
                    {lang === 'TH'
                      ? 'แผนจัดการความเสี่ยง 3 ขั้นตอนตามลำดับความสำคัญ'
                      : 'Prioritized 3-Step Neutral Action Plan'}
                  </h2>
                  <p className="card-subtitle">
                    {lang === 'TH'
                      ? 'ลำดับขั้นการสร้างเกราะป้องกันทางการเงินอย่างเป็นกลาง โดยไม่กระทบสภาพคล่อง'
                      : 'Step-by-step financial resilience roadmap without overcommitting cashflow'}
                  </p>
                </div>
              </div>

              <ol className="ra-action-steps">
                {/* Step 1 */}
                <li className={`ra-action-step ${remainingForThreeMonths === 0 ? 'done' : ''}`}>
                  <span className="ra-action-num tabular-nums">1</span>
                  <div className="ra-action-body">
                    <div className="ra-action-title">
                      {lang === 'TH'
                        ? 'เติมเงินสำรองฉุกเฉินให้ครบ 3–6 เดือนก่อนเป็นอันดับแรก'
                        : 'Build a 3–6 Month Liquid Emergency Fund First'}
                    </div>
                    <p className="ra-action-desc tabular-nums">
                      {remainingForThreeMonths > 0
                        ? lang === 'TH'
                          ? `ปัจจุบันเงินสำรองของคุณอยู่ได้ ${emergencyRunway.toFixed(2)} เดือน แนะนำให้ทยอยเติมอีก ${formatTHB(remainingForThreeMonths)} (เป้าขั้นต่ำ 3 เดือน) และขยายสู่ 6 เดือน (${formatTHB(remainingForSixMonths)} เพิ่มเติม) ก่อนผูกพันเบี้ยประกันระยะยาว`
                          : `Current runway is ${emergencyRunway.toFixed(2)} months. Add ${formatTHB(remainingForThreeMonths)} to hit the 3-month floor (and ${formatTHB(remainingForSixMonths)} total for 6 months) before committing to long-term premiums.`
                        : lang === 'TH'
                          ? `ยอดเยี่ยม! เงินสำรองของคุณครบเกณฑ์ขั้นต่ำ 3 เดือนแล้ว (${emergencyRunway.toFixed(2)} เดือน) สามารถทยอยสะสมเพิ่มสู่เป้า 6 เดือนเพื่อความอุ่นใจสูงสุด`
                          : `Great work! Your emergency cash already passes the 3-month milestone (${emergencyRunway.toFixed(2)} mo.). Continue building steadily toward 6 months.`}
                    </p>
                    <button
                      type="button"
                      className="ra-inline-link-btn"
                      onClick={() => onNavigate('smartlog')}
                    >
                      <Wallet size={13} strokeWidth={2.2} aria-hidden="true" />
                      <span>
                        {lang === 'TH'
                          ? 'ไปบันทึกเติมเงินสำรองใน 360Flow'
                          : 'Log Emergency Savings in 360Flow'}
                      </span>
                      <ChevronRight size={13} strokeWidth={2.4} aria-hidden="true" />
                    </button>
                  </div>
                </li>

                {/* Step 2 */}
                <li className={`ra-action-step ${!riskAssessment.hasAnyUnknownLimit ? 'done' : ''}`}>
                  <span className="ra-action-num tabular-nums">2</span>
                  <div className="ra-action-body">
                    <div className="ra-action-title">
                      {lang === 'TH'
                        ? 'ตรวจสอบวงเงินประกันกลุ่มกับฝ่ายบุคคล (HR)'
                        : 'Verify Employer Group Insurance Limits with HR'}
                    </div>
                    <p className="ra-action-desc">
                      {riskAssessment.hasAnyUnknownLimit
                        ? lang === 'TH'
                          ? 'ตอนนี้ยังมีสิทธิที่ระบุว่า "ไม่ทราบวงเงิน" ซึ่งถูกนับเป็น ฿0 แนะนำให้ขอตารางสิทธิประโยชน์จาก HR แล้วนำตัวเลขจริงมากรอก จะช่วยลดช่องว่างส่วนเกินและไม่ซื้อความคุ้มครองซ้ำซ้อน'
                          : 'You currently have active coverage marked "I don\'t know" (counted as ฿0). Request your benefit table from HR to see your real gap and avoid paying for duplicate coverage.'
                        : lang === 'TH'
                          ? 'คุณระบุวงเงินความคุ้มครองที่ชัดเจนครบทุกสิทธิแล้ว ช่วยให้การคำนวณช่องว่างความคุ้มครองแม่นยำตามความเป็นจริง'
                          : 'All active coverages have known limits entered—your protection gap calculation reflects your real entitlements.'}
                    </p>
                    {riskAssessment.hasAnyUnknownLimit && (
                      <button
                        type="button"
                        className="ra-inline-link-btn"
                        onClick={() => setActiveTab('input')}
                      >
                        <SlidersHorizontal size={13} strokeWidth={2.2} aria-hidden="true" />
                        <span>
                          {lang === 'TH' ? 'กลับไปอัปเดตวงเงินสวัสดิการ' : 'Update Coverage Limits'}
                        </span>
                        <ChevronRight size={13} strokeWidth={2.4} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </li>

                {/* Step 3 */}
                <li className="ra-action-step">
                  <span className="ra-action-num tabular-nums">3</span>
                  <div className="ra-action-body">
                    <div className="ra-action-title">
                      {lang === 'TH'
                        ? 'ปิดช่องว่างความเสี่ยงสำคัญภายใต้งบที่ปลอดภัย (10%–15% ของรายได้)'
                        : 'Close Critical Gaps Within Your Safe 10%–15% Budget Cap'}
                    </div>
                    <p className="ra-action-desc tabular-nums">
                      {lang === 'TH'
                        ? `เมื่อมีเงินสำรองมั่นคงแล้ว ให้จัดลำดับปิดความเสี่ยงที่กระทบเงินก้อนใหญ่ก่อน (ค่ารักษาพยาบาล และอุบัติเหตุ) โดยคุมงบเบี้ยรวมไม่เกิน ${formatTHB(safeBudgetMin)} – ${formatTHB(safeBudgetMax)} / เดือน เพื่อไม่ให้ตึงมือ`
                        : `Once your cash buffer is on track, prioritize high-severity shocks first (Medical & Accident) while capping total premiums strictly within ${formatTHB(safeBudgetMin)} – ${formatTHB(safeBudgetMax)} / month.`}
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* Policy & HR Benefit Review Reminder Card (Client-Side .ics Export) */}
            <section className="bento-card ra-calendar-card" aria-labelledby="ra-calendar-heading">
              <div className="ra-card-head">
                <span className="ra-card-icon teal" aria-hidden="true">
                  <CalendarPlus size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <h2 id="ra-calendar-heading" className="card-title">
                    {lang === 'TH'
                      ? 'ตั้งแจ้งเตือนทบทวนสิทธิลงปฏิทิน (.ics)'
                      : 'Policy & HR Benefit Review Reminder (.ics)'}
                  </h2>
                  <p className="card-subtitle">
                    {lang === 'TH'
                      ? 'สร้างไฟล์นัดหมายลง Apple / Google / Outlook Calendar จากเบราว์เซอร์ทันที ไม่ต้องกรอกอีเมล'
                      : 'Download a standard .ics calendar event directly on your device — zero email or server required'}
                  </p>
                </div>
              </div>

              <form className="ra-calendar-form" onSubmit={handleDownloadIcs}>
                <div className="form-field">
                  <span className="form-label">
                    {lang === 'TH' ? 'เลือกหัวข้อแจ้งเตือนด่วน' : 'Quick Reminder Presets'}
                  </span>
                  <div className="ra-reminder-presets">
                    {REMINDER_PRESETS.map((preset) => {
                      const isSelected = selectedPresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          className={`ra-reminder-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => handleReminderPresetSelect(preset)}
                        >
                          {t(preset.title)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="ra-reminder-title" className="form-label">
                    {lang === 'TH' ? 'ชื่อรายการแจ้งเตือน' : 'Reminder Title'}
                  </label>
                  <input
                    id="ra-reminder-title"
                    type="text"
                    maxLength={90}
                    className="form-input"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="ra-reminder-date" className="form-label">
                    {lang === 'TH' ? 'วันที่ต้องการให้แจ้งเตือน (เวลา 09:00 น.)' : 'Reminder Date (09:00 AM)'}
                  </label>
                  <input
                    id="ra-reminder-date"
                    type="date"
                    className="form-input tabular-nums"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    required
                  />
                </div>

                <button
                  id="ra-download-ics-btn"
                  type="submit"
                  className="btn-primary-gradient ra-ics-btn"
                >
                  <CalendarPlus size={16} strokeWidth={2.2} aria-hidden="true" />
                  <span>
                    {lang === 'TH' ? 'เพิ่มลงปฏิทิน (.ics)' : 'Add to Calendar (.ics)'}
                  </span>
                </button>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

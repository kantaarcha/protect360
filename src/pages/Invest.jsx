import { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Coins,
  Flame,
  Info,
  Percent,
  ReceiptText,
  Scale,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import {
  INSURANCE_TAX_DEDUCTION_CAP,
  computeLongTermIrrAnalysis,
  computeRiskTransferComparison,
} from '../utils/investMath';
import LiquidTabs from '../components/LiquidTabs';

const SHOCK_PRESETS = [50000, 150000, 300000];

const PLAN_PRESETS = [
  {
    id: 'endow-10-20',
    label: { th: 'สะสมทรัพย์ 10/20 (มาตรฐาน)', en: '10/20 Savings Plan (Typical)' },
    annualContribution: 30000,
    paymentYears: 10,
    planDuration: 20,
    annualCashback: 3000,
    maturityLumpSum: 330000,
  },
  {
    id: 'endow-5-10',
    label: { th: 'สะสมทรัพย์ 5/10 (ระยะกลาง)', en: '5/10 Medium-Term Plan' },
    annualContribution: 50000,
    paymentYears: 5,
    planDuration: 10,
    annualCashback: 2500,
    maturityLumpSum: 265000,
  },
];

function formatSignedPct(decimalRate) {
  if (decimalRate === null || !Number.isFinite(decimalRate)) return '0.00%';
  const pct = decimalRate * 100;
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

function formatPlainPct(decimalRate) {
  if (decimalRate === null || !Number.isFinite(decimalRate)) return '0.00%';
  return `${(decimalRate * 100).toFixed(2)}%`;
}

export default function Invest({ onNavigate }) {
  const { lang, t } = useLanguage();
  const {
    monthlyIncome,
    monthlyExpenses,
    emergencyFund,
    emergencyRunway,
    userProfile,
    isDemoMode,
  } = useFinance();

  // Core calculator tabs: 'transfer' | 'irr'
  const [activeTab, setActiveTab] = useState('transfer');

  // --- TAB 1: Risk Transfer vs. Self-Insure state (0 clean slate by default; hypothetical values only in demo mode) ---
  const [annualBudget, setAnnualBudget] = useState(() => (isDemoMode ? 12000 : 0));
  const [emergencyBill, setEmergencyBill] = useState(() => (isDemoMode ? 150000 : 0));
  const [loanAprPct, setLoanAprPct] = useState(() => (isDemoMode ? 20 : 0));

  // --- TAB 2: True IRR, Inflation & Tax state (0 clean slate by default) ---
  const [annualContribution, setAnnualContribution] = useState(() => (isDemoMode ? 30000 : 0));
  const [paymentYears, setPaymentYears] = useState(() => (isDemoMode ? 10 : 0));
  const [planDuration, setPlanDuration] = useState(() => (isDemoMode ? 20 : 0));
  const [annualCashback, setAnnualCashback] = useState(() => (isDemoMode ? 3000 : 0));
  const [maturityLumpSum, setMaturityLumpSum] = useState(() => (isDemoMode ? 330000 : 0));
  const [inflationRatePct, setInflationRatePct] = useState(() => (isDemoMode ? 2.5 : 0));
  const [annualIncomeOverride, setAnnualIncomeOverride] = useState(null);
  const [selectedTimelineYear, setSelectedTimelineYear] = useState(null);

  const effectiveAnnualIncome =
    annualIncomeOverride !== null ? annualIncomeOverride : monthlyIncome * 12;

  const parseNonNegative = (raw) => {
    const cleaned = String(raw || '').replace(/[^\d.]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) && num >= 0 ? num : 0;
  };

  // Tab 1 Live Calculation
  const transferResult = useMemo(
    () =>
      computeRiskTransferComparison({
        annualProtectionBudget: annualBudget,
        emergencyBill,
        emergencyFund,
        monthlyExpenses,
        monthlyIncome,
        loanAprPct,
        repaymentMonths: 24,
      }),
    [annualBudget, emergencyBill, emergencyFund, monthlyExpenses, monthlyIncome, loanAprPct]
  );

  // Tab 2 Live Calculation
  const irrResult = useMemo(
    () =>
      computeLongTermIrrAnalysis({
        annualContribution,
        paymentYears,
        planDuration,
        annualCashback,
        maturityLumpSum,
        inflationRatePct,
        annualIncome: effectiveAnnualIncome,
      }),
    [
      annualContribution,
      paymentYears,
      planDuration,
      annualCashback,
      maturityLumpSum,
      inflationRatePct,
      effectiveAnnualIncome,
    ]
  );

  const calculatorTabs = [
    {
      id: 'transfer',
      label: lang === 'TH' ? 'โอนเสี่ยง vs จ่ายเอง' : 'Transfer vs Self',
      icon: Scale,
    },
    {
      id: 'irr',
      label: lang === 'TH' ? 'คำนวณ IRR & ภาษี' : 'True IRR & Tax',
      icon: Calculator,
    },
  ];

  // Tab 1 Bar widths
  const maxOutflow = Math.max(
    transferResult.scenarioA.totalCashOutflow,
    transferResult.scenarioB.totalCashOutflow,
    1
  );
  const outflowPctA = Math.min(
    100,
    Math.round((transferResult.scenarioA.totalCashOutflow / maxOutflow) * 100)
  );
  const outflowPctB = Math.min(
    100,
    Math.round((transferResult.scenarioB.totalCashOutflow / maxOutflow) * 100)
  );

  const maxRunway = Math.max(
    transferResult.scenarioA.remainingRunway,
    transferResult.scenarioB.remainingRunway,
    3
  );
  const runwayBarPctA = Math.min(
    100,
    Math.round((transferResult.scenarioA.remainingRunway / maxRunway) * 100)
  );
  const runwayBarPctB = Math.min(
    100,
    Math.round((transferResult.scenarioB.remainingRunway / maxRunway) * 100)
  );

  // Tab 2 Timeline Bar scaling
  const maxTimelineAbs = useMemo(() => {
    let maxVal = 1;
    for (const row of irrResult.timeline) {
      maxVal = Math.max(maxVal, row.outflow, row.totalInflow);
    }
    return maxVal;
  }, [irrResult.timeline]);

  const activeTimelineRow =
    irrResult.timeline.find((r) => r.year === selectedTimelineYear) ||
    irrResult.timeline[irrResult.timeline.length - 1] ||
    irrResult.timeline[0];

  const applyPlanPreset = (preset) => {
    setAnnualContribution(preset.annualContribution);
    setPaymentYears(preset.paymentYears);
    setPlanDuration(preset.planDuration);
    setAnnualCashback(preset.annualCashback);
    setMaturityLumpSum(preset.maturityLumpSum);
    setSelectedTimelineYear(preset.planDuration);
  };

  // Dynamic Neutral Coach Verdict Logic for Tab 2
  const taxPct = irrResult.taxInfo.marginalRatePct;
  const targetMonths = userProfile.emergencyTargetMonths || 3;
  const isEmergencyEnough = emergencyRunway >= targetMonths;
  const verdictTone =
    taxPct <= 5
      ? 'caution'
      : isEmergencyEnough
        ? 'positive'
        : 'info';

  return (
    <div className="inv-stack">
      {/* ================= 1) STEP 3 PHILOSOPHY & CALCULATOR SWITCHER ================= */}
      <section className="bento-card inv-switcher-card" aria-label="Invest and Value Lab controls">
        <div className="inv-switcher-top">
          <div className="inv-step-note">
            <span className="inv-step-tag">
              {lang === 'TH' ? 'ขั้นตอนที่ 3' : 'Step 3'}
            </span>
            <p className="inv-step-text">
              {lang === 'TH'
                ? 'เปรียบเทียบต้นทุนความเสี่ยง ผลตอบแทนที่แท้จริง (IRR) เงินเฟ้อ และภาษี ก่อนตัดสินใจ'
                : 'Compare risk transfer cost, true IRR, inflation, and tax impact before committing.'}
            </p>
          </div>

          <span className="ra-actuarial-pill">
            <ShieldCheck size={14} strokeWidth={2.3} aria-hidden="true" />
            <span>
              {lang === 'TH'
                ? 'คณิตศาสตร์การเงินที่เป็นกลาง • ไม่แนะนำรายบริษัท'
                : 'Neutral Financial Math • Zero Brand Recommendations'}
            </span>
          </span>
        </div>

        <LiquidTabs
          tabs={calculatorTabs}
          activeId={activeTab}
          onChange={setActiveTab}
          variant="surface"
          idPrefix="invest-calc-mode"
          ariaLabel={lang === 'TH' ? 'เลือกเครื่องคำนวณ' : 'Select calculator'}
        />
      </section>

      {/* ================= TAB 1: RISK TRANSFER VS. SELF-INSURE SIMULATOR ================= */}
      {activeTab === 'transfer' && (
        <div className="inv-stage">
          <div className="inv-transfer-grid">
            {/* LEFT: Interactive Scenario Sliders / Inputs */}
            <section className="bento-card inv-input-card" aria-labelledby="inv-t1-heading">
              <div className="ra-card-head">
                <span className="ra-card-icon blue" aria-hidden="true">
                  <Scale size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <h2 id="inv-t1-heading" className="card-title">
                    {lang === 'TH'
                      ? 'จำลองสถานการณ์เหตุฉุกเฉิน'
                      : 'Emergency Shock Simulator'}
                  </h2>
                  <p className="card-subtitle">
                    {lang === 'TH'
                      ? 'ปรับงบโอนย้ายความเสี่ยงและมูลค่าเหตุไม่คาดฝัน เพื่อเทียบผลกระทบต่อเงินสดในมือ'
                      : 'Adjust your annual risk budget and shock size to compare real cash impact'}
                  </p>
                </div>
              </div>

              <div className="inv-form-body">
                {/* Annual Protection Budget */}
                <div className="inv-slider-field">
                  <div className="inv-slider-head">
                    <label htmlFor="inv-annual-budget" className="form-label">
                      {lang === 'TH'
                        ? 'งบโอนย้ายความเสี่ยงต่อปี (บาท)'
                        : 'Annual Protection Budget (THB)'}
                    </label>
                    <span
                      className={`inv-inline-badge tabular-nums ${
                        transferResult.isWithinSafeBudget ? 'blue' : 'warn'
                      }`}
                    >
                      {transferResult.budgetPctOfIncome}%{' '}
                      {lang === 'TH' ? 'ของรายได้ทั้งปี' : 'of annual income'}
                    </span>
                  </div>
                  <div className="inv-input-slider-row">
                    <input
                      id="inv-annual-budget"
                      type="number"
                      min="0"
                      max="200000"
                      step="1000"
                      className="form-input tabular-nums inv-num-box"
                      value={annualBudget}
                      onChange={(e) => setAnnualBudget(parseNonNegative(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max={Math.max(45000, transferResult.safeAnnualMax || 45000)}
                      step="1000"
                      className="inv-range tone-blue"
                      value={Math.min(
                        annualBudget,
                        Math.max(45000, transferResult.safeAnnualMax || 45000)
                      )}
                      style={{
                        '--range-pct': `${Math.min(
                          100,
                          Math.max(
                            0,
                            Math.round(
                              (Math.min(
                                annualBudget,
                                Math.max(45000, transferResult.safeAnnualMax || 45000)
                              ) /
                                Math.max(45000, transferResult.safeAnnualMax || 45000)) *
                                100
                            )
                          )
                        )}%`,
                      }}
                      onChange={(e) => setAnnualBudget(Number(e.target.value))}
                      aria-label={lang === 'TH' ? 'ปรับงบต่อปี' : 'Adjust annual budget'}
                    />
                  </div>
                  <span className="inv-field-hint tabular-nums">
                    {lang === 'TH'
                      ? `กรอบปลอดภัย 10%–15% ของรายได้คุณคือ ${formatTHB(transferResult.safeAnnualMin)} – ${formatTHB(transferResult.safeAnnualMax)} / ปี`
                      : `Your safe 10%–15% annual cap: ${formatTHB(transferResult.safeAnnualMin)} – ${formatTHB(transferResult.safeAnnualMax)} / yr`}
                  </span>
                </div>

                {/* Unexpected Medical / Accident Bill */}
                <div className="inv-slider-field">
                  <div className="inv-slider-head">
                    <label htmlFor="inv-emergency-bill" className="form-label">
                      {lang === 'TH'
                        ? 'ค่ารักษา / เหตุฉุกเฉินไม่คาดฝัน (บาท)'
                        : 'Unexpected Medical / Accident Bill (THB)'}
                    </label>
                    <div className="inv-preset-chips">
                      {SHOCK_PRESETS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className={`inv-preset-chip tabular-nums ${
                            emergencyBill === amt ? 'active' : ''
                          }`}
                          onClick={() => setEmergencyBill(amt)}
                        >
                          {formatTHB(amt)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="inv-input-slider-row">
                    <input
                      id="inv-emergency-bill"
                      type="number"
                      min="0"
                      max="2000000"
                      step="5000"
                      className="form-input tabular-nums inv-num-box ak-amount-input expense"
                      value={emergencyBill}
                      onChange={(e) => setEmergencyBill(parseNonNegative(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      className="inv-range expense tone-red"
                      value={Math.min(emergencyBill, 500000)}
                      style={{
                        '--range-pct': `${Math.min(
                          100,
                          Math.max(
                            0,
                            Math.round((Math.min(emergencyBill, 500000) / 500000) * 100)
                          )
                        )}%`,
                      }}
                      onChange={(e) => setEmergencyBill(Number(e.target.value))}
                      aria-label={lang === 'TH' ? 'ปรับค่ารักษาฉุกเฉิน' : 'Adjust shock bill'}
                    />
                  </div>
                </div>

                {/* Emergency Loan APR */}
                <div className="inv-slider-field">
                  <div className="inv-slider-head">
                    <label htmlFor="inv-loan-apr" className="form-label">
                      {lang === 'TH'
                        ? 'ดอกเบี้ยหากต้องกู้ฉุกเฉิน / บัตรกดเงินสด (% ต่อปี)'
                        : 'Emergency Borrowing Rate (% APR, 24-mo)'}
                    </label>
                    <span className="inv-inline-badge red tabular-nums">
                      {loanAprPct}% {lang === 'TH' ? 'ต่อปี • ผ่อน 24 ด.' : 'p.a. • 24 mo.'}
                    </span>
                  </div>
                  <div className="inv-input-slider-row">
                    <input
                      id="inv-loan-apr"
                      type="number"
                      min="0"
                      max="36"
                      step="1"
                      className="form-input tabular-nums inv-num-box"
                      value={loanAprPct}
                      onChange={(e) =>
                        setLoanAprPct(Math.min(36, parseNonNegative(e.target.value)))
                      }
                    />
                    <input
                      type="range"
                      min="0"
                      max="28"
                      step="1"
                      className="inv-range tone-amber"
                      value={Math.min(loanAprPct, 28)}
                      style={{
                        '--range-pct': `${Math.min(
                          100,
                          Math.max(0, Math.round((Math.min(loanAprPct, 28) / 28) * 100))
                        )}%`,
                      }}
                      onChange={(e) => setLoanAprPct(Number(e.target.value))}
                      aria-label={lang === 'TH' ? 'ปรับอัตราดอกเบี้ย' : 'Adjust APR'}
                    />
                  </div>
                </div>

                {/* Synced Cash Context Pill */}
                <div className="ra-sync-summary tabular-nums">
                  <div className="ra-sync-stat">
                    <span>
                      {lang === 'TH' ? 'เงินสำรองฉุกเฉินปัจจุบันของคุณ' : 'Your Current Emergency Fund'}
                    </span>
                    <strong className="text-blue">{formatTHB(emergencyFund)}</strong>
                  </div>
                  <div className="ra-sync-stat">
                    <span>
                      {lang === 'TH' ? 'รายจ่ายประจำต่อเดือน' : 'Monthly Expenses'}
                    </span>
                    <strong className="text-red">{formatTHB(monthlyExpenses)}</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT: Side-by-Side Scenario Comparison Cards */}
            <div className="inv-scenarios-col">
              <div className="inv-scenarios-grid">
                {/* Scenario A: Self-Insure */}
                <article className="bento-card inv-scenario-card danger">
                  <div className="inv-scenario-head">
                    <span className="inv-scenario-tag red">
                      {lang === 'TH' ? 'ทางเลือก A • รับความเสี่ยงเอง' : 'Scenario A • Self-Insure'}
                    </span>
                    <h3 className="inv-scenario-title">
                      {lang === 'TH' ? 'จ่ายเองทั้งหมด (ไม่มีคุ้มครองเพิ่ม)' : 'Pay Out-of-Pocket'}
                    </h3>
                  </div>

                  <div className="inv-scenario-hero tabular-nums">
                    <span className="inv-scenario-hero-lbl">
                      {lang === 'TH' ? 'เงินที่เสียไปทั้งหมด (รวมดอกเบี้ย)' : 'Total Cash Outflow'}
                    </span>
                    <strong className="text-red">
                      -{formatTHB(transferResult.scenarioA.totalCashOutflow)}
                    </strong>
                  </div>

                  <div className="inv-scenario-rows tabular-nums">
                    <div className="inv-s-row">
                      <span>{lang === 'TH' ? 'เงินสำรองฉุกเฉินคงเหลือ' : 'Remaining Emergency Fund'}</span>
                      <strong
                        className={
                          transferResult.scenarioA.remainingEmergency === 0 ? 'text-red' : 'text-blue'
                        }
                      >
                        {formatTHB(transferResult.scenarioA.remainingEmergency)}
                      </strong>
                    </div>
                    <div className="inv-s-row">
                      <span>{lang === 'TH' ? 'ส่วนที่ต้องกู้ฉุกเฉิน' : 'Emergency Debt Needed'}</span>
                      <strong
                        className={transferResult.scenarioA.loanPrincipal > 0 ? 'text-red' : ''}
                      >
                        {formatTHB(transferResult.scenarioA.loanPrincipal)}
                      </strong>
                    </div>
                    <div className="inv-s-row">
                      <span>
                        {lang === 'TH'
                          ? `ดอกเบี้ยเงินกู้จ่ายเพิ่ม (${transferResult.repaymentMonths} ด.)`
                          : `Extra Loan Interest (${transferResult.repaymentMonths} mo.)`}
                      </span>
                      <strong
                        className={
                          transferResult.scenarioA.totalLoanInterest > 0 ? 'text-red' : ''
                        }
                      >
                        {formatTHB(transferResult.scenarioA.totalLoanInterest)}
                      </strong>
                    </div>
                    {transferResult.scenarioA.loanPrincipal > 0 && (
                      <div className="inv-s-row muted">
                        <span>{lang === 'TH' ? 'ค่างวดผ่อนหนี้ต่อเดือน' : 'Est. Monthly Repayment'}</span>
                        <span>
                          {formatTHB(transferResult.scenarioA.monthlyLoanPayment)}
                          {lang === 'TH' ? '/ด.' : '/mo'}
                        </span>
                      </div>
                    )}
                  </div>
                </article>

                {/* Scenario B: Planned Risk Transfer */}
                <article className="bento-card inv-scenario-card safe">
                  <div className="inv-scenario-head">
                    <span className="inv-scenario-tag blue">
                      {lang === 'TH'
                        ? 'ทางเลือก B • โอนย้ายความเสี่ยงตามงบ'
                        : 'Scenario B • Risk Transfer'}
                    </span>
                    <h3 className="inv-scenario-title">
                      {lang === 'TH' ? 'กันงบปลอดภัยไว้ล่วงหน้า' : 'Planned Protection Budget'}
                    </h3>
                  </div>

                  <div className="inv-scenario-hero tabular-nums">
                    <span className="inv-scenario-hero-lbl">
                      {lang === 'TH'
                        ? 'มูลค่าความคุ้มครองสุทธิที่ประหยัดได้'
                        : 'Net Financial Protection Value'}
                    </span>
                    <strong
                      className={
                        transferResult.netProtectionValue >= 0 ? 'text-green' : 'text-red'
                      }
                    >
                      {formatTHB(transferResult.netProtectionValue, { showSign: true })}
                    </strong>
                  </div>

                  <div className="inv-scenario-rows tabular-nums">
                    <div className="inv-s-row">
                      <span>{lang === 'TH' ? 'งบโอนย้ายความเสี่ยงต่อปี' : 'Annual Budget Paid'}</span>
                      <strong className="text-blue">
                        {formatTHB(transferResult.scenarioB.annualBudget)}
                      </strong>
                    </div>
                    <div className="inv-s-row">
                      <span>{lang === 'TH' ? 'เหตุฉุกเฉินที่ได้รับความคุ้มครอง' : 'Covered Shock Bill'}</span>
                      <strong className="text-green">
                        {formatTHB(transferResult.scenarioB.coveredShock)}
                      </strong>
                    </div>
                    <div className="inv-s-row">
                      <span>{lang === 'TH' ? 'เงินสำรองฉุกเฉินที่รักษาไว้ได้' : 'Preserved Emergency Fund'}</span>
                      <strong className="text-blue">
                        {formatTHB(transferResult.scenarioB.remainingEmergency)}
                      </strong>
                    </div>
                    <div className="inv-s-row muted">
                      <span>{lang === 'TH' ? 'ระยะเวลาเงินสำรองคงเหลือ' : 'Preserved Runway'}</span>
                      <span>
                        {transferResult.scenarioB.remainingRunway.toFixed(2)}{' '}
                        {lang === 'TH' ? 'เดือน' : 'mo.'}
                      </span>
                    </div>
                  </div>
                </article>
              </div>

              {/* Visual Bar Chart Comparison */}
              <section className="bento-card inv-compare-chart-card">
                <h3 className="card-title" style={{ fontSize: '0.96rem' }}>
                  {lang === 'TH'
                    ? 'เปรียบเทียบผลกระทบทางการเงิน (Visual Comparison)'
                    : 'Visual Cashflow Impact Comparison'}
                </h3>

                <div className="inv-bar-groups tabular-nums">
                  <div className="inv-bar-group">
                    <div className="inv-bar-group-title">
                      {lang === 'TH' ? '1) เงินที่เสียไปทั้งหมดเมื่อเกิดเหตุ' : '1) Total Cash Lost on Shock'}
                    </div>
                    <div className="ak-cf-row">
                      <div className="ak-cf-label-row">
                        <span className="ak-cf-name">
                          <span className="ak-dot red" aria-hidden="true" />
                          {lang === 'TH' ? 'รับความเสี่ยงเอง (จ่ายเอง + ดอกเบี้ย)' : 'Self-Insure (Bill + Interest)'}
                        </span>
                        <span className="ak-cf-val expense">
                          {formatTHB(transferResult.scenarioA.totalCashOutflow)}
                        </span>
                      </div>
                      <div className="ak-bar-track">
                        <div className="ak-bar-fill expense" style={{ width: `${outflowPctA}%` }} />
                      </div>
                    </div>

                    <div className="ak-cf-row">
                      <div className="ak-cf-label-row">
                        <span className="ak-cf-name">
                          <span className="ak-dot blue" aria-hidden="true" />
                          {lang === 'TH' ? 'โอนย้ายความเสี่ยงตามงบ (คงที่)' : 'Planned Risk Transfer (Capped)'}
                        </span>
                        <span className="ak-cf-val saving">
                          {formatTHB(transferResult.scenarioB.totalCashOutflow)}
                        </span>
                      </div>
                      <div className="ak-bar-track">
                        <div
                          className="ak-bar-fill saving"
                          style={{ width: `${Math.max(4, outflowPctB)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="inv-bar-group">
                    <div className="inv-bar-group-title">
                      {lang === 'TH'
                        ? '2) เงินสำรองฉุกเฉินคงเหลือ (เดือน)'
                        : '2) Remaining Emergency Runway (Months)'}
                    </div>
                    <div className="ak-cf-row">
                      <div className="ak-cf-label-row">
                        <span className="ak-cf-name">
                          <span className="ak-dot red" aria-hidden="true" />
                          {lang === 'TH' ? 'หลังจ่ายเอง' : 'After Self-Insuring'}
                        </span>
                        <span className="ak-cf-val expense">
                          {transferResult.scenarioA.remainingRunway.toFixed(2)}{' '}
                          {lang === 'TH' ? 'เดือน' : 'mo.'}
                        </span>
                      </div>
                      <div className="ak-bar-track">
                        <div
                          className="ak-bar-fill expense"
                          style={{ width: `${runwayBarPctA}%` }}
                        />
                      </div>
                    </div>

                    <div className="ak-cf-row">
                      <div className="ak-cf-label-row">
                        <span className="ak-cf-name">
                          <span className="ak-dot green" aria-hidden="true" />
                          {lang === 'TH' ? 'หลังโอนย้ายความเสี่ยง' : 'With Risk Transfer'}
                        </span>
                        <span className="ak-cf-val income">
                          {transferResult.scenarioB.remainingRunway.toFixed(2)}{' '}
                          {lang === 'TH' ? 'เดือน' : 'mo.'}
                        </span>
                      </div>
                      <div className="ak-bar-track">
                        <div
                          className="ak-bar-fill income"
                          style={{ width: `${Math.max(4, runwayBarPctB)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Neutral Actuarial Takeaway */}
                <div className="inv-actuarial-takeaway">
                  <Info size={17} strokeWidth={2.2} className="inv-takeaway-icon" />
                  <div>
                    <strong>
                      {lang === 'TH'
                        ? 'หลักคิดสำคัญ: เหตุเกิดไม่บ่อย แต่ถ้าเกิดแล้วจ่ายหนัก'
                        : 'Key Principle: Rare Events, Heavy Bills (Low Frequency, High Severity)'}
                    </strong>
                    <p>
                      {lang === 'TH'
                        ? 'ค่าใช้จ่ายเล็กน้อยที่เกิดบ่อยควรใช้ "เงินสำรองฉุกเฉิน" รับความเสี่ยงไว้เอง แต่เหตุไม่คาดฝันก้อนใหญ่ที่อาจทำให้เงินเก็บหมดและต้องก่อหนี้ดอกเบี้ยสูง ควรโอนย้ายความเสี่ยงออกไปด้วยงบคงที่ที่ไม่เกิน 10%–15% ของรายได้'
                        : 'Use your liquid emergency fund to self-insure small, frequent expenses—and transfer rare, catastrophic bills that could wipe out savings or force high-APR debt, while keeping total budget within 10%–15% of income.'}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TRUE IRR, INFLATION & TAX DEDUCTION CALCULATOR ================= */}
      {activeTab === 'irr' && (
        <div className="inv-stage">
          {/* Plain-Language IRR Explainer Card */}
          <div className="bento-card inv-irr-explainer" role="note" aria-label="What is IRR">
            <span className="inv-irr-explainer-icon" aria-hidden="true">
              <Info size={18} strokeWidth={2.2} />
            </span>
            <div className="inv-irr-explainer-copy">
              <strong>
                {lang === 'TH'
                  ? 'IRR คืออะไร? (อัตราผลตอบแทนทบต้นที่แท้จริงต่อปี)'
                  : 'What is IRR? (Internal Rate of Return)'}
              </strong>
              <p>
                {lang === 'TH'
                  ? 'IRR คือ "อัตราดอกเบี้ยที่แท้จริงต่อปี" ที่คำนวณจากเงินที่เราทยอยจ่ายออกและรับคืนจริงตลอดสัญญา ใช้เปรียบเทียบกับดอกเบี้ยเงินฝากหรือการลงทุนอื่นได้ตรง ๆ โดยไม่สับสนกับตัวเลขการตลาดอย่าง "เงินคืน 5% ของทุนประกัน"'
                  : 'IRR is your true annualized compound interest rate across every baht paid in and returned over the full contract — letting you compare plans directly against bank deposits or investments instead of headline cashback percentages.'}
              </p>
            </div>
          </div>

          {/* 1) Top 4 Bento Result KPI Cards */}
          <section className="inv-kpi-grid" aria-label="IRR and Tax Return KPIs">
            {/* Card 1: Nominal IRR */}
            <article className="bento-card inv-kpi-card">
              <div className="ak-kpi-top">
                <span className="metric-icon-badge saving" aria-hidden="true">
                  <TrendingUp size={18} strokeWidth={2.2} />
                </span>
                <span className="ak-kpi-pill blue">
                  {lang === 'TH' ? 'ก่อนหักเงินเฟ้อ' : 'Pre-Inflation'}
                </span>
              </div>
              <div className="ak-kpi-body">
                <div className="ak-kpi-label">
                  {lang === 'TH' ? 'IRR ตามหน้าสัญญา' : 'Nominal IRR'}
                </div>
                <div className="ak-kpi-value saving tabular-nums">
                  {formatPlainPct(irrResult.nominalIrr)}
                  <small className="ra-unit-sm">{lang === 'TH' ? ' / ปี' : ' p.a.'}</small>
                </div>
              </div>
              <div className="ra-kpi-footnote tabular-nums">
                {lang === 'TH'
                  ? `จ่ายรวม ${formatTHB(irrResult.totalPaid)} → รับรวม ${formatTHB(irrResult.totalNominalReturn)}`
                  : `Paid ${formatTHB(irrResult.totalPaid)} → Total ${formatTHB(irrResult.totalNominalReturn)}`}
              </div>
            </article>

            {/* Card 2: Real IRR after Inflation */}
            <article className="bento-card inv-kpi-card">
              <div className="ak-kpi-top">
                <span
                  className={`metric-icon-badge ${
                    irrResult.realIrr !== null && irrResult.realIrr < 0 ? 'expense' : 'income'
                  }`}
                  aria-hidden="true"
                >
                  <Flame size={18} strokeWidth={2.2} />
                </span>
                <span
                  className={`ak-kpi-pill ${
                    irrResult.realIrr !== null && irrResult.realIrr < 0 ? 'red' : 'green'
                  } tabular-nums`}
                >
                  {lang === 'TH'
                    ? `เงินเฟ้อ ${inflationRatePct}%`
                    : `${inflationRatePct}% Inflation`}
                </span>
              </div>
              <div className="ak-kpi-body">
                <div className="ak-kpi-label">
                  {lang === 'TH' ? 'ผลตอบแทนแท้จริงหลังหักเงินเฟ้อ' : 'Real IRR (After Inflation)'}
                </div>
                <div
                  className={`ak-kpi-value tabular-nums ${
                    irrResult.realIrr !== null && irrResult.realIrr < 0 ? 'expense' : 'income'
                  }`}
                >
                  {formatSignedPct(irrResult.realIrr)}
                  <small className="ra-unit-sm">{lang === 'TH' ? ' / ปี' : ' p.a.'}</small>
                </div>
              </div>
              <div className="ra-kpi-footnote">
                {irrResult.realIrr === null
                  ? lang === 'TH'
                    ? 'กรอกตัวเลขแผนออมเพื่อคำนวณผลตอบแทนจริง'
                    : 'Enter plan numbers to compute real return'
                  : irrResult.realIrr < 0
                    ? lang === 'TH'
                      ? 'ต่ำกว่าเงินเฟ้อ (อำนาจซื้อลดลง)'
                      : 'Below inflation (purchasing power erodes)'
                    : lang === 'TH'
                      ? 'ชนะอัตราเงินเฟ้อคาดการณ์'
                      : 'Beats expected inflation'}
              </div>
            </article>

            {/* Card 3: Annual Tax Saving */}
            <article className="bento-card inv-kpi-card">
              <div className="ak-kpi-top">
                <span
                  className={`metric-icon-badge ${
                    irrResult.taxInfo.annualTaxSaving > 0 ? 'income' : 'warn'
                  }`}
                  aria-hidden="true"
                >
                  <ReceiptText size={18} strokeWidth={2.2} />
                </span>
                <span
                  className={`ak-kpi-pill ${
                    irrResult.taxInfo.marginalRatePct === 0 ? 'warn' : 'green'
                  } tabular-nums`}
                >
                  {lang === 'TH'
                    ? `ฐานภาษี ${irrResult.taxInfo.marginalRatePct}%`
                    : `${irrResult.taxInfo.marginalRatePct}% Tax Bracket`}
                </span>
              </div>
              <div className="ak-kpi-body">
                <div className="ak-kpi-label">
                  {lang === 'TH' ? 'ภาษีที่ประหยัดได้ต่อปี' : 'Annual Tax Saving'}
                </div>
                <div
                  className={`ak-kpi-value tabular-nums ${
                    irrResult.taxInfo.annualTaxSaving > 0 ? 'income' : ''
                  }`}
                >
                  {formatTHB(irrResult.taxInfo.annualTaxSaving)}
                  <small className="ra-unit-sm">{lang === 'TH' ? ' / ปี' : ' / yr'}</small>
                </div>
              </div>
              <div className="ra-kpi-footnote tabular-nums">
                {irrResult.taxInfo.marginalRatePct === 0
                  ? lang === 'TH'
                    ? 'รายได้สุทธิอยู่ในเกณฑ์ยกเว้นภาษี (0%)'
                    : 'Net income falls in 0% tax-exempt bracket'
                  : !irrResult.taxInfo.isDurationEligible
                    ? lang === 'TH'
                      ? 'สัญญา < 10 ปี ไม่เข้าเกณฑ์ลดหย่อนภาษี'
                      : 'Duration < 10 yrs: not tax-deductible'
                    : lang === 'TH'
                      ? `ลดหย่อนใช้สิทธิ ${formatTHB(irrResult.taxInfo.eligibleDeduction)} (เพดาน ฿100k)`
                      : `Deductible ${formatTHB(irrResult.taxInfo.eligibleDeduction)} (฿100k cap)`}
              </div>
            </article>

            {/* Card 4: Effective IRR with Tax Benefit + Purchasing Power */}
            <article className="bento-card inv-kpi-card">
              <div className="ak-kpi-top">
                <span className="metric-icon-badge income" aria-hidden="true">
                  <Coins size={18} strokeWidth={2.2} />
                </span>
                <span className="ak-kpi-pill blue tabular-nums">
                  {lang === 'TH'
                    ? `รวมคืนภาษี ${formatTHB(irrResult.totalTaxSavings)}`
                    : `Total Tax Saved ${formatTHB(irrResult.totalTaxSavings)}`}
                </span>
              </div>
              <div className="ak-kpi-body">
                <div className="ak-kpi-label">
                  {lang === 'TH' ? 'IRR รวมสิทธิลดหย่อนภาษี' : 'Effective IRR (With Tax)'}
                </div>
                <div className="ak-kpi-value income tabular-nums">
                  {formatPlainPct(irrResult.effectiveIrrWithTax)}
                  <small className="ra-unit-sm">{lang === 'TH' ? ' / ปี' : ' p.a.'}</small>
                </div>
              </div>
              <div className="ra-kpi-footnote tabular-nums">
                {lang === 'TH'
                  ? `อำนาจซื้อจริงวันครบสัญญา: ${formatTHB(irrResult.maturityRealPurchasingPower)}`
                  : `Today's purchasing power: ${formatTHB(irrResult.maturityRealPurchasingPower)}`}
              </div>
            </article>
          </section>

          {/* 2) Main 2-Column IRR Workspace: Inputs (Left) + Timeline Chart & Coach Verdict (Right) */}
          <div className="inv-irr-grid">
            {/* LEFT: Policy & Tax Inputs */}
            <section className="bento-card inv-input-card" aria-labelledby="inv-t2-heading">
              <div className="ra-card-head">
                <span className="ra-card-icon blue" aria-hidden="true">
                  <Percent size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <h2 id="inv-t2-heading" className="card-title">
                    {lang === 'TH'
                      ? 'ข้อมูลแผนออมระยะยาว / ประกันสะสมทรัพย์'
                      : 'Long-Term Savings / Policy Inputs'}
                  </h2>
                  <p className="card-subtitle">
                    {lang === 'TH'
                      ? 'กรอกตัวเลขตามใบเสนอเพื่อคำนวณ IRR แท้จริง ไม่ถูกหลอกด้วยตัวเลข % เงินคืนตามทุนประกัน'
                      : 'Calculate true annualized IRR instead of headline % of sum assured'}
                  </p>
                </div>
              </div>

              {/* Quick Realistic Plan Presets */}
              <div className="inv-plan-presets">
                {PLAN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="inv-plan-preset-btn"
                    onClick={() => applyPlanPreset(preset)}
                  >
                    {t(preset.label)}
                  </button>
                ))}
              </div>

              <div className="inv-form-body">
                <div className="form-field">
                  <label htmlFor="irr-annual-contrib" className="form-label">
                    {lang === 'TH'
                      ? 'เงินออม / เบี้ยสะสมทรัพย์ต่อปี (บาท)'
                      : 'Annual Contribution / Premium (THB)'}
                  </label>
                  <input
                    id="irr-annual-contrib"
                    type="number"
                    min="1000"
                    step="1000"
                    className="form-input tabular-nums"
                    value={annualContribution}
                    onChange={(e) => setAnnualContribution(parseNonNegative(e.target.value))}
                  />
                  {irrResult.taxInfo.exceedsCap && (
                    <span className="inv-warn-micro">
                      {lang === 'TH'
                        ? `เกินเพดานลดหย่อนประกันชีวิตทั่วไป ฿${INSURANCE_TAX_DEDUCTION_CAP.toLocaleString('en-US')}/ปี (ระบบคำนวณลดหย่อนสูงสุดที่ ฿100,000)`
                        : 'Exceeds standard ฿100,000 life/savings tax deduction cap (capped at ฿100,000).'}
                    </span>
                  )}
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="irr-pay-years" className="form-label">
                      {lang === 'TH' ? 'จำนวนปีที่ส่ง (ปี)' : 'Payment Years'}
                    </label>
                    <input
                      id="irr-pay-years"
                      type="number"
                      min="1"
                      max={planDuration}
                      className="form-input tabular-nums"
                      value={paymentYears}
                      onChange={(e) => {
                        const v = Math.max(1, Math.round(parseNonNegative(e.target.value)));
                        setPaymentYears(Math.min(v, planDuration));
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="irr-duration" className="form-label">
                      {lang === 'TH' ? 'ระยะเวลาสัญญาทั้งหมด (ปี)' : 'Total Plan Duration (Yrs)'}
                    </label>
                    <input
                      id="irr-duration"
                      type="number"
                      min="2"
                      max="40"
                      className="form-input tabular-nums"
                      value={planDuration}
                      onChange={(e) => {
                        const v = Math.max(2, Math.min(40, Math.round(parseNonNegative(e.target.value))));
                        setPlanDuration(v);
                        if (paymentYears > v) setPaymentYears(v);
                      }}
                    />
                  </div>
                </div>

                {!irrResult.taxInfo.isDurationEligible && (
                  <div className="ra-conservative-callout" role="note">
                    <AlertTriangle size={15} strokeWidth={2.2} className="ra-callout-icon" />
                    <p>
                      {lang === 'TH'
                        ? 'เงื่อนไขกรมสรรพากร: กรมธรรม์ประกันชีวิต/สะสมทรัพย์ต้องมีระยะเวลาคุ้มครองตั้งแต่ 10 ปีขึ้นไปจึงจะใช้สิทธิลดหย่อนภาษีได้'
                        : 'Thai Revenue Dept rule: Policy duration must be at least 10 years to qualify for tax deduction.'}
                    </p>
                  </div>
                )}

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="irr-cashback" className="form-label">
                      {lang === 'TH' ? 'เงินคืนระหว่างสัญญาต่อปี (บาท)' : 'Annual Cashback (THB)'}
                    </label>
                    <input
                      id="irr-cashback"
                      type="number"
                      min="0"
                      step="500"
                      className="form-input tabular-nums"
                      value={annualCashback}
                      onChange={(e) => setAnnualCashback(parseNonNegative(e.target.value))}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="irr-maturity" className="form-label">
                      {lang === 'TH' ? 'เงินก้อนเมื่อครบกำหนดสัญญา (บาท)' : 'Maturity Lump Sum (THB)'}
                    </label>
                    <input
                      id="irr-maturity"
                      type="number"
                      min="0"
                      step="5000"
                      className="form-input tabular-nums"
                      value={maturityLumpSum}
                      onChange={(e) => setMaturityLumpSum(parseNonNegative(e.target.value))}
                    />
                  </div>
                </div>

                <div className="ak-divider" />

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="irr-inflation" className="form-label">
                      {lang === 'TH' ? 'เงินเฟ้อคาดการณ์ (% ต่อปี)' : 'Expected Inflation (% p.a.)'}
                    </label>
                    <input
                      id="irr-inflation"
                      type="number"
                      min="0"
                      max="15"
                      step="0.5"
                      className="form-input tabular-nums"
                      value={inflationRatePct}
                      onChange={(e) =>
                        setInflationRatePct(Math.min(15, parseNonNegative(e.target.value)))
                      }
                    />
                  </div>

                  <div className="form-field">
                    <div className="ak-label-with-tool">
                      <label htmlFor="irr-annual-income" className="form-label">
                        {lang === 'TH' ? 'รายได้ประเมินทั้งปี (บาท)' : 'Annual Income (THB)'}
                      </label>
                      {annualIncomeOverride !== null && (
                        <button
                          type="button"
                          className="ak-mini-tool-btn"
                          onClick={() => setAnnualIncomeOverride(null)}
                        >
                          {lang === 'TH' ? 'ซิงก์จาก SmartLog' : 'Sync'}
                        </button>
                      )}
                    </div>
                    <input
                      id="irr-annual-income"
                      type="number"
                      min="0"
                      step="10000"
                      className="form-input tabular-nums"
                      value={effectiveAnnualIncome}
                      onChange={(e) => setAnnualIncomeOverride(parseNonNegative(e.target.value))}
                    />
                  </div>
                </div>

                {/* Transparent Thai Tax Calculation Mini Breakdown */}
                <div className="inv-tax-breakdown tabular-nums">
                  <div className="inv-tax-row">
                    <span>
                      {lang === 'TH'
                        ? 'เงินได้สุทธิประเมิน (หลังหักค่าใช้จ่าย ฿100k + ส่วนตัว ฿60k)'
                        : 'Est. Net Taxable Income (after ฿100k exp. + ฿60k personal)'}
                    </span>
                    <strong>{formatTHB(irrResult.taxInfo.netTaxableBefore)}</strong>
                  </div>
                  <div className="inv-tax-row">
                    <span>{lang === 'TH' ? 'ฐานภาษีเงินได้บุคคลธรรมดา (ไทย)' : 'Thai Marginal Tax Rate'}</span>
                    <strong className={taxPct === 0 ? 'text-amber' : 'text-green'}>
                      {taxPct}%
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT: Multi-Year Cashflow Timeline Chart + Neutral First-Jobber Coach Verdict */}
            <div className="inv-irr-right-col">
              {/* Cashflow Timeline Chart */}
              <section className="bento-card inv-timeline-card" aria-labelledby="inv-timeline-heading">
                <div className="chart-header-top">
                  <div>
                    <h2 id="inv-timeline-heading" className="card-title">
                      {lang === 'TH'
                        ? `ไทม์ไลน์กระแสเงินสดตลอด ${irrResult.duration} ปี`
                        : `${irrResult.duration}-Year Cashflow Timeline`}
                    </h2>
                    <p className="card-subtitle">
                      {lang === 'TH'
                        ? 'แตะหรือวางเมาส์ที่แต่ละปีเพื่อดูเงินออก เงินคืน ภาษีที่ประหยัด และเงินครบกำหนด'
                        : 'Hover or tap any year to inspect outflows, cashbacks, tax savings, and maturity'}
                    </p>
                  </div>

                  <div className="inv-legend-row">
                    <span className="legend-item">
                      <span className="ak-dot red" aria-hidden="true" />
                      {lang === 'TH' ? 'เงินส่ง/ปี' : 'Outflow'}
                    </span>
                    <span className="legend-item">
                      <span className="ak-dot blue" aria-hidden="true" />
                      {lang === 'TH' ? 'เงินคืน/ครบสัญญา' : 'Payout'}
                    </span>
                    <span className="legend-item">
                      <span className="ak-dot green" aria-hidden="true" />
                      {lang === 'TH' ? 'คืนภาษี' : 'Tax Saved'}
                    </span>
                  </div>
                </div>

                {/* Refined Diverging Multi-Year Bar Chart (strictly contained inside frame at 2–40 years) */}
                <div className="inv-timeline-frame">
                  {irrResult.timeline.length === 0 ? (
                    <div className="inv-timeline-empty">
                      {lang === 'TH'
                        ? 'กรอกข้อมูลแผนออมทางด้านซ้าย หรือเลือกแผนตัวอย่าง เพื่อแสดงกราฟกระแสเงินสดรายปี'
                        : 'Enter savings plan inputs or choose a preset to preview the yearly cashflow timeline.'}
                    </div>
                  ) : (
                    <>
                      <div className="inv-timeline-scroll">
                        <div className="inv-timeline-plot">
                          {irrResult.timeline.map((row) => {
                            const outPct =
                              row.outflow > 0
                                ? Math.max(8, Math.round((row.outflow / maxTimelineAbs) * 100))
                                : 0;
                            const payoutTotal = row.cashback + row.maturity;
                            const payoutPct =
                              payoutTotal > 0
                                ? Math.max(8, Math.round((payoutTotal / maxTimelineAbs) * 100))
                                : 0;
                            const taxPctH =
                              row.taxSaving > 0
                                ? Math.max(6, Math.round((row.taxSaving / maxTimelineAbs) * 100))
                                : 0;
                            const isSelected = activeTimelineRow?.year === row.year;

                            return (
                              <button
                                key={row.year}
                                type="button"
                                className={`inv-tl-col ${isSelected ? 'selected' : ''}`}
                                onMouseEnter={() => setSelectedTimelineYear(row.year)}
                                onClick={() => setSelectedTimelineYear(row.year)}
                                aria-label={`${lang === 'TH' ? 'ปีที่' : 'Year'} ${row.year}`}
                              >
                                <div className="inv-tl-inflow-lane">
                                  {taxPctH > 0 && (
                                    <span
                                      className="inv-tl-bar tax"
                                      style={{ height: `${Math.min(100, taxPctH)}%` }}
                                    />
                                  )}
                                  {payoutPct > 0 && (
                                    <span
                                      className="inv-tl-bar payout"
                                      style={{ height: `${Math.min(100, payoutPct)}%` }}
                                    />
                                  )}
                                </div>
                                <div className="inv-tl-axis-line" />
                                <div className="inv-tl-outflow-lane">
                                  {outPct > 0 && (
                                    <span
                                      className="inv-tl-bar outflow"
                                      style={{ height: `${Math.min(100, outPct)}%` }}
                                    />
                                  )}
                                </div>
                                <span className="inv-tl-year tabular-nums">Y{row.year}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {irrResult.timeline.length > 10 && (
                        <div className="inv-timeline-scroll-cue tabular-nums">
                          <span>
                            {lang === 'TH'
                              ? `แสดงครบ ${irrResult.duration + 1} จุดเวลา (ปีที่ 0 – ${irrResult.duration})`
                              : `${irrResult.duration + 1} timeline points (Y0 – Y${irrResult.duration})`}
                          </span>
                          <span>
                            {lang === 'TH' ? '← เลื่อนซ้าย-ขวาได้ →' : '← Scroll horizontally →'}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Selected Year Inspector with Prev / Next Year Steppers */}
                {activeTimelineRow && (
                  <div className="inv-tl-inspector tabular-nums">
                    <div className="inv-tl-inspector-head">
                      <div className="inv-tl-inspector-yr">
                        {lang === 'TH'
                          ? `ปีที่ ${activeTimelineRow.year}`
                          : `Year ${activeTimelineRow.year}`}
                      </div>
                      <div className="inv-tl-yr-nav">
                        <button
                          type="button"
                          className="inv-tl-yr-btn"
                          disabled={activeTimelineRow.year <= 0}
                          onClick={() =>
                            setSelectedTimelineYear(Math.max(0, activeTimelineRow.year - 1))
                          }
                          aria-label={lang === 'TH' ? 'ปีก่อนหน้า' : 'Previous year'}
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          className="inv-tl-yr-btn"
                          disabled={activeTimelineRow.year >= irrResult.duration}
                          onClick={() =>
                            setSelectedTimelineYear(
                              Math.min(irrResult.duration, activeTimelineRow.year + 1)
                            )
                          }
                          aria-label={lang === 'TH' ? 'ปีถัดไป' : 'Next year'}
                        >
                          ›
                        </button>
                      </div>
                    </div>
                    <div className="inv-tl-inspector-stats">
                      <span>
                        {lang === 'TH' ? 'เงินส่ง:' : 'Outflow:'}{' '}
                        <strong className="text-red">
                          {activeTimelineRow.outflow > 0
                            ? `-${formatTHB(activeTimelineRow.outflow)}`
                            : '฿0'}
                        </strong>
                      </span>
                      <span>
                        {lang === 'TH' ? 'เงินคืน/ครบสัญญา:' : 'Payout:'}{' '}
                        <strong className="text-blue">
                          {formatTHB(activeTimelineRow.cashback + activeTimelineRow.maturity)}
                        </strong>
                      </span>
                      <span>
                        {lang === 'TH' ? 'ประหยัดภาษี:' : 'Tax Saved:'}{' '}
                        <strong className="text-green">
                          {formatTHB(activeTimelineRow.taxSaving)}
                        </strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Purchasing Power Reality Bar */}
                <div className="inv-purchasing-box tabular-nums">
                  <div className="inv-purchasing-row">
                    <span>
                      {lang === 'TH'
                        ? `เงินครบกำหนดตามหน้าสัญญา (ปีที่ ${irrResult.duration})`
                        : `Nominal Maturity Value (Year ${irrResult.duration})`}
                    </span>
                    <strong>{formatTHB(maturityLumpSum)}</strong>
                  </div>
                  <div className="inv-purchasing-row highlight">
                    <span>
                      {lang === 'TH'
                        ? `มูลค่าตามอำนาจซื้อจริงในวันนี้ (หลังเงินเฟ้อ ${inflationRatePct}%/ปี)`
                        : `Today's Real Purchasing Power (at ${inflationRatePct}%/yr inflation)`}
                    </span>
                    <strong className="text-blue">
                      {formatTHB(irrResult.maturityRealPurchasingPower)}
                    </strong>
                  </div>
                </div>
              </section>

              {/* Dynamic Neutral First-Jobber Coach Verdict Card */}
              <section
                className={`bento-card inv-verdict-card ${verdictTone}`}
                aria-labelledby="inv-verdict-heading"
              >
                <div className="inv-verdict-head">
                  <span className={`inv-verdict-icon ${verdictTone}`} aria-hidden="true">
                    {verdictTone === 'positive' ? (
                      <CheckCircle2 size={19} strokeWidth={2.2} />
                    ) : verdictTone === 'caution' ? (
                      <AlertCircle size={19} strokeWidth={2.2} />
                    ) : (
                      <Info size={19} strokeWidth={2.2} />
                    )}
                  </span>
                  <div>
                    <h2 id="inv-verdict-heading" className="card-title">
                      {lang === 'TH'
                        ? 'มุมมองโค้ชการเงินที่เป็นกลาง (Neutral Verdict)'
                        : 'Neutral Financial Coach Verdict'}
                    </h2>
                    <p className="card-subtitle">
                      {lang === 'TH'
                        ? 'ประเมินจากฐานภาษีและเงินสำรองฉุกเฉินของคุณ โดยไม่ขายผลิตภัณฑ์ใด ๆ'
                        : 'Based on your real tax bracket & emergency buffer — zero product bias'}
                    </p>
                  </div>
                </div>

                <p className="inv-verdict-text tabular-nums">
                  {taxPct <= 5
                    ? lang === 'TH'
                      ? `ปัจจุบันฐานภาษีของคุณอยู่ที่ ${taxPct}% (ประหยัดภาษีได้ ${formatTHB(irrResult.taxInfo.annualTaxSaving)}/ปี) ทำให้ผลตอบแทนแท้จริงหลังหักเงินเฟ้ออยู่ที่ ${formatSignedPct(irrResult.realIrr)} ต่อปี การล็อกเงินสดไว้ในสัญญาระยะยาว ${irrResult.duration} ปีอาจทำให้เสียโอกาสและขาดสภาพคล่อง แนะนำให้เติมเงินสำรองฉุกเฉินให้ครบ 3–6 เดือน และปิดความเสี่ยงสุขภาพ/อุบัติเหตุพื้นฐานก่อน`
                      : `At your current ${taxPct}% tax bracket (${formatTHB(irrResult.taxInfo.annualTaxSaving)}/yr tax saved), real return after inflation is ${formatSignedPct(irrResult.realIrr)} p.a. Locking liquidity for ${irrResult.duration} years yields limited benefit right now—prioritize a 3–6 month emergency fund and core health/accident protection first.`
                    : isEmergencyEnough
                      ? lang === 'TH'
                        ? `เงินสำรองฉุกเฉินของคุณครบเกณฑ์ ${targetMonths} เดือนแล้ว (${emergencyRunway.toFixed(2)} เดือน) และฐานภาษี ${taxPct}% ช่วยเพิ่มผลตอบแทนรวมจาก ${formatPlainPct(irrResult.nominalIrr)} เป็น ${formatPlainPct(irrResult.effectiveIrrWithTax)} ต่อปี (ประหยัดภาษี ${formatTHB(irrResult.taxInfo.annualTaxSaving)}/ปี) หากรับเงื่อนไขการถือครองยาว ${irrResult.duration} ปีได้ ถือเป็นเครื่องมือช่วยลดภาษีที่น่าสนใจควบคู่การลงทุนหลัก`
                        : `Your ${targetMonths}-month emergency buffer is complete (${emergencyRunway.toFixed(2)} mo.) and your ${taxPct}% tax bracket lifts Effective IRR from ${formatPlainPct(irrResult.nominalIrr)} to ${formatPlainPct(irrResult.effectiveIrrWithTax)} p.a. (${formatTHB(irrResult.taxInfo.annualTaxSaving)}/yr saved). Ensure you can comfortably lock this cash for ${irrResult.duration} years.`
                      : lang === 'TH'
                        ? `ฐานภาษี ${taxPct}% ช่วยดันผลตอบแทนรวมขึ้นเป็น ${formatPlainPct(irrResult.effectiveIrrWithTax)} ต่อปีได้จริง แต่ตอนนี้เงินสำรองฉุกเฉินของคุณยังอยู่ได้ ${emergencyRunway.toFixed(2)} เดือน (ต่ำกว่าเป้า ${targetMonths} เดือน) แนะนำให้เติมเงินสำรองฉุกเฉินให้ครบก่อน เพื่อไม่ให้ต้องเวนคืนสัญญาก่อนกำหนดจนขาดทุนเงินต้น`
                        : `Your ${taxPct}% tax bracket meaningfully boosts Effective IRR to ${formatPlainPct(irrResult.effectiveIrrWithTax)} p.a., but your emergency runway is currently ${emergencyRunway.toFixed(2)} mo. (below your ${targetMonths}-mo. target). Complete your liquid buffer first to avoid early surrender losses.`}
                </p>

                <div className="inv-verdict-actions">
                  <button
                    type="button"
                    className="btn-soft-gray inv-bridge-btn"
                    onClick={() => onNavigate('smartlog')}
                  >
                    <Wallet size={14} strokeWidth={2.2} aria-hidden="true" />
                    <span>{lang === 'TH' ? 'เติมเงินสำรอง (SmartLog)' : 'Build Reserve'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-soft-gray inv-bridge-btn"
                    onClick={() => onNavigate('risk-analysis')}
                  >
                    <ShieldAlert size={14} strokeWidth={2.2} aria-hidden="true" />
                    <span>{lang === 'TH' ? 'ตรวจช่องว่างความเสี่ยง' : 'Review Risk Gaps'}</span>
                    <ArrowRight size={13} strokeWidth={2.3} aria-hidden="true" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

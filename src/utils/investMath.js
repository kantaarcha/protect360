// Pure JavaScript Financial & Actuarial Math Helpers for PROTECT360 Round 4 (Invest & Value Lab)
// Zero external math libraries — transparent, auditable formulas.

export const THAI_TAX_BRACKETS = [
  { upTo: 150000, rate: 0 },
  { upTo: 300000, rate: 0.05 },
  { upTo: 500000, rate: 0.1 },
  { upTo: 750000, rate: 0.15 },
  { upTo: 1000000, rate: 0.2 },
  { upTo: 2000000, rate: 0.25 },
  { upTo: 5000000, rate: 0.3 },
  { upTo: Infinity, rate: 0.35 },
];

export const INSURANCE_TAX_DEDUCTION_CAP = 100000;
export const STANDARD_EXPENSE_CAP = 100000;
export const PERSONAL_ALLOWANCE = 60000;

/**
 * Exact progressive Thai Personal Income Tax on net taxable income.
 */
export function computeThaiTaxFromNetIncome(netTaxableIncome) {
  const taxable = Math.max(0, Number(netTaxableIncome) || 0);
  let tax = 0;
  let prevCap = 0;

  for (const bracket of THAI_TAX_BRACKETS) {
    if (taxable <= prevCap) break;
    const bandAmount = Math.min(taxable, bracket.upTo) - prevCap;
    tax += bandAmount * bracket.rate;
    prevCap = bracket.upTo;
  }

  return Math.round(tax);
}

/**
 * Returns the marginal Thai tax rate (0 to 0.35) for a given net taxable income.
 */
export function getThaiMarginalTaxRate(netTaxableIncome) {
  const taxable = Math.max(0, Number(netTaxableIncome) || 0);
  for (const bracket of THAI_TAX_BRACKETS) {
    if (taxable <= bracket.upTo) return bracket.rate;
  }
  return 0.35;
}

/**
 * Computes net taxable income, marginal tax bracket, eligible deduction (100k cap + >=10 yr contract),
 * and exact THB tax saved per year.
 */
export function calculateThaiTaxImpact({
  annualIncome = 300000,
  annualContribution = 30000,
  planDurationYears = 20,
}) {
  const income = Math.max(0, Number(annualIncome) || 0);
  const contribution = Math.max(0, Number(annualContribution) || 0);
  const duration = Math.max(1, Math.round(Number(planDurationYears) || 1));

  const standardExpense = Math.min(income * 0.5, STANDARD_EXPENSE_CAP);
  const netTaxableBefore = Math.max(0, income - standardExpense - PERSONAL_ALLOWANCE);
  const marginalRate = getThaiMarginalTaxRate(netTaxableBefore);

  // Thai Revenue Dept rule: Life/savings insurance tax deduction requires policy duration >= 10 years, capped at 100,000 THB
  const isDurationEligible = duration >= 10;
  const eligibleDeduction = isDurationEligible
    ? Math.min(contribution, INSURANCE_TAX_DEDUCTION_CAP)
    : 0;
  const exceedsCap = isDurationEligible && contribution > INSURANCE_TAX_DEDUCTION_CAP;

  const netTaxableAfter = Math.max(0, netTaxableBefore - eligibleDeduction);
  const taxBefore = computeThaiTaxFromNetIncome(netTaxableBefore);
  const taxAfter = computeThaiTaxFromNetIncome(netTaxableAfter);
  const annualTaxSaving = Math.max(0, taxBefore - taxAfter);

  return {
    annualIncome: income,
    standardExpense,
    personalAllowance: PERSONAL_ALLOWANCE,
    netTaxableBefore,
    netTaxableAfter,
    marginalRate,
    marginalRatePct: Math.round(marginalRate * 100),
    isDurationEligible,
    eligibleDeduction,
    exceedsCap,
    taxBefore,
    taxAfter,
    annualTaxSaving,
  };
}

function npv(cashFlows, rate) {
  let sum = 0;
  for (let t = 0; t < cashFlows.length; t += 1) {
    sum += cashFlows[t] / Math.pow(1 + rate, t);
  }
  return sum;
}

function npvDerivative(cashFlows, rate) {
  let sum = 0;
  for (let t = 1; t < cashFlows.length; t += 1) {
    sum -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
  }
  return sum;
}

/**
 * Pure Bisection + Newton-Raphson IRR solver.
 * Handles negative, zero, and positive IRR reliably without external libraries.
 * Returns annualized decimal rate (e.g. 0.0215 for 2.15%) or null if unsolvable.
 */
export function solveIRR(cashFlows) {
  if (!Array.isArray(cashFlows) || cashFlows.length < 2) return null;
  const hasNeg = cashFlows.some((cf) => cf < 0);
  const hasPos = cashFlows.some((cf) => cf > 0);
  if (!hasNeg || !hasPos) return null;

  // Scan for a sign-change bracket around realistic financial rates (-85% to +300%)
  const grid = [
    -0.85, -0.6, -0.4, -0.25, -0.15, -0.08, -0.04, -0.02, -0.01, 0,
    0.005, 0.01, 0.02, 0.03, 0.05, 0.08, 0.12, 0.2, 0.35, 0.6, 1.0, 2.0, 3.0,
  ];

  let low = null;
  let high = null;
  let prevR = grid[0];
  let prevVal = npv(cashFlows, prevR);

  if (Math.abs(prevVal) < 1e-7) return prevR;

  for (let i = 1; i < grid.length; i += 1) {
    const r = grid[i];
    const val = npv(cashFlows, r);
    if (Math.abs(val) < 1e-7) return r;
    if ((prevVal > 0 && val < 0) || (prevVal < 0 && val > 0)) {
      low = prevR;
      high = r;
      break;
    }
    prevR = r;
    prevVal = val;
  }

  if (low === null || high === null) return null;

  // 80 iterations of Bisection for rock-solid convergence
  let fLow = npv(cashFlows, low);
  let mid = (low + high) / 2;
  for (let iter = 0; iter < 80; iter += 1) {
    mid = (low + high) / 2;
    const fMid = npv(cashFlows, mid);
    if (Math.abs(fMid) < 1e-9 || high - low < 1e-11) break;
    if ((fLow > 0 && fMid > 0) || (fLow < 0 && fMid < 0)) {
      low = mid;
      fLow = fMid;
    } else {
      high = mid;
    }
  }

  // Optional 3-step Newton polish within bracket
  let r = mid;
  for (let k = 0; k < 3; k += 1) {
    const f = npv(cashFlows, r);
    const df = npvDerivative(cashFlows, r);
    if (!Number.isFinite(df) || Math.abs(df) < 1e-12) break;
    const next = r - f / df;
    if (next > low && next < high) r = next;
  }

  return Number.isFinite(r) ? r : null;
}

/**
 * Full Tab 2 IRR, Real Inflation Return, Tax Benefit & Multi-Year Timeline Computation.
 */
export function computeLongTermIrrAnalysis({
  annualContribution = 0,
  paymentYears = 0,
  planDuration = 0,
  annualCashback = 0,
  maturityLumpSum = 0,
  inflationRatePct = 0,
  annualIncome = 0,
}) {
  const contrib = Math.max(0, Number(annualContribution) || 0);
  const rawDuration = Math.max(0, Math.min(40, Math.round(Number(planDuration) || 0)));
  const rawPayYears = Math.max(0, Math.min(rawDuration || 40, Math.round(Number(paymentYears) || 0)));
  const cashback = Math.max(0, Number(annualCashback) || 0);
  const maturity = Math.max(0, Number(maturityLumpSum) || 0);
  const inflation = Math.max(0, Number(inflationRatePct) || 0) / 100;

  if (contrib === 0 && cashback === 0 && maturity === 0) {
    const taxInfo = calculateThaiTaxImpact({
      annualIncome,
      annualContribution: 0,
      planDurationYears: rawDuration || 0,
    });
    return {
      timeline: [],
      nominalIrr: null,
      realIrr: null,
      effectiveIrrWithTax: null,
      realIrrWithTax: null,
      totalPaid: 0,
      totalCashback: 0,
      totalTaxSavings: 0,
      totalNominalReturn: 0,
      netNominalProfit: 0,
      maturityRealPurchasingPower: 0,
      taxInfo,
      payYears: rawPayYears,
      duration: rawDuration,
    };
  }

  const duration = Math.max(2, rawDuration || 2);
  const payYears = Math.max(1, Math.min(duration, rawPayYears || 1));

  const taxInfo = calculateThaiTaxImpact({
    annualIncome,
    annualContribution: contrib,
    planDurationYears: duration,
  });

  // Build year-by-year timeline (t = 0 .. duration)
  // t = 0 .. payYears-1: annual contribution outflow (-contrib)
  // t = 1 .. duration-1: annual cashback inflow (+cashback)
  // t = 1 .. payYears: annual tax refund inflow (+taxInfo.annualTaxSaving)
  // t = duration: maturity lump sum (+maturity)
  const nominalCashFlows = new Array(duration + 1).fill(0);
  const taxAdjustedCashFlows = new Array(duration + 1).fill(0);
  const timeline = [];

  for (let t = 0; t <= duration; t += 1) {
    const outflow = t < payYears ? contrib : 0;
    const cbInflow = t >= 1 && t < duration ? cashback : 0;
    const matInflow = t === duration ? maturity : 0;
    const taxInflow = t >= 1 && t <= payYears ? taxInfo.annualTaxSaving : 0;

    const netNominal = cbInflow + matInflow - outflow;
    const netWithTax = netNominal + taxInflow;

    nominalCashFlows[t] = netNominal;
    taxAdjustedCashFlows[t] = netWithTax;

    timeline.push({
      year: t,
      outflow,
      cashback: cbInflow,
      taxSaving: taxInflow,
      maturity: matInflow,
      totalInflow: cbInflow + matInflow + taxInflow,
      netNominal,
      netWithTax,
    });
  }

  const nominalIrr = solveIRR(nominalCashFlows);
  const effectiveIrrWithTax = solveIRR(taxAdjustedCashFlows);

  // Fisher exact real return after inflation: ((1 + NominalIRR) / (1 + Inflation)) - 1
  const realIrr =
    nominalIrr !== null ? (1 + nominalIrr) / (1 + inflation) - 1 : null;
  const realIrrWithTax =
    effectiveIrrWithTax !== null ? (1 + effectiveIrrWithTax) / (1 + inflation) - 1 : null;

  const totalPaid = contrib * payYears;
  const totalCashback = cashback * Math.max(0, duration - 1);
  const totalTaxSavings = taxInfo.annualTaxSaving * payYears;
  const totalNominalReturn = totalCashback + maturity;
  const netNominalProfit = totalNominalReturn - totalPaid;

  // Purchasing power of maturity lump sum expressed in today's Baht
  const maturityRealPurchasingPower =
    inflation > 0 ? Math.round(maturity / Math.pow(1 + inflation, duration)) : maturity;

  return {
    timeline,
    nominalIrr,
    realIrr,
    effectiveIrrWithTax,
    realIrrWithTax,
    totalPaid,
    totalCashback,
    totalTaxSavings,
    totalNominalReturn,
    netNominalProfit,
    maturityRealPurchasingPower,
    taxInfo,
    payYears,
    duration,
  };
}

/**
 * Full Tab 1 Risk Transfer vs. Self-Insure Simulator (24-month emergency loan amortization).
 */
export function computeRiskTransferComparison({
  annualProtectionBudget = 0,
  emergencyBill = 0,
  emergencyFund = 0,
  monthlyExpenses = 0,
  monthlyIncome = 0,
  loanAprPct = 0,
  repaymentMonths = 24,
}) {
  const budget = Math.max(0, Number(annualProtectionBudget) || 0);
  const bill = Math.max(0, Number(emergencyBill) || 0);
  const cash = Math.max(0, Number(emergencyFund) || 0);
  const expenses = Math.max(0, Number(monthlyExpenses) || 0);
  const income = Math.max(0, Number(monthlyIncome) || 0);
  const apr = Math.max(0, Number(loanAprPct) || 0);
  const months = Math.max(1, Math.round(Number(repaymentMonths) || 24));

  // Scenario A: Self-Insure (deplete emergency fund first, borrow shortfall at APR over 24 mo.)
  const cashUsedA = Math.min(cash, bill);
  const remainingEmergencyA = Math.max(0, cash - bill);
  const loanPrincipalA = Math.max(0, bill - cash);

  let monthlyLoanPaymentA = 0;
  let totalLoanInterestA = 0;

  if (loanPrincipalA > 0) {
    const monthlyRate = apr / 100 / 12;
    if (monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, months);
      monthlyLoanPaymentA = (loanPrincipalA * monthlyRate * factor) / (factor - 1);
      totalLoanInterestA = Math.max(0, Math.round(monthlyLoanPaymentA * months - loanPrincipalA));
    } else {
      monthlyLoanPaymentA = loanPrincipalA / months;
      totalLoanInterestA = 0;
    }
  }

  const totalCashOutflowA = Math.round(bill + totalLoanInterestA);
  const remainingRunwayA = expenses > 0 ? Number((remainingEmergencyA / expenses).toFixed(2)) : 0;

  // Scenario B: Planned Risk Transfer (pay annual budget, preserve emergency cash)
  const totalCashOutflowB = Math.round(budget);
  const remainingEmergencyB = cash;
  const remainingRunwayB = expenses > 0 ? Number((remainingEmergencyB / expenses).toFixed(2)) : 0;

  // Net Financial Protection Value (savings in shock year)
  const netProtectionValue = totalCashOutflowA - totalCashOutflowB;

  const annualIncome = income * 12;
  const budgetPctOfIncome =
    annualIncome > 0 ? Number(((budget / annualIncome) * 100).toFixed(1)) : 0;
  const safeAnnualMin = Math.round(annualIncome * 0.1);
  const safeAnnualMax = Math.round(annualIncome * 0.15);
  const isWithinSafeBudget = annualIncome === 0 || budget <= safeAnnualMax;

  return {
    scenarioA: {
      cashUsed: cashUsedA,
      remainingEmergency: remainingEmergencyA,
      loanPrincipal: loanPrincipalA,
      monthlyLoanPayment: Math.round(monthlyLoanPaymentA),
      totalLoanInterest: totalLoanInterestA,
      totalCashOutflow: totalCashOutflowA,
      remainingRunway: remainingRunwayA,
    },
    scenarioB: {
      annualBudget: budget,
      coveredShock: bill,
      remainingEmergency: remainingEmergencyB,
      totalCashOutflow: totalCashOutflowB,
      remainingRunway: remainingRunwayB,
    },
    netProtectionValue,
    budgetPctOfIncome,
    safeAnnualMin,
    safeAnnualMax,
    isWithinSafeBudget,
    repaymentMonths: months,
  };
}

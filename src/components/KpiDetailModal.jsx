import { useEffect, useMemo } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  PlusCircle,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB } from '../context/FinanceContext';
import { getCategoryIconComponent } from '../utils/categoryRegistry';

export default function KpiDetailModal({
  mode, // 'income' | 'expense' | 'saving'
  monthlyIncome,
  monthlyExpenses,
  netSavings,
  netSavingsRate,
  expenseRatio,
  transactions,
  customCategories,
  onQuickLog,
  onClose,
}) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const detailData = useMemo(() => {
    const incomeTxs = [];
    const expenseTxs = [];
    const savingTxs = [];
    let savingTransfersTotal = 0;

    for (const tx of transactions) {
      if (tx.category === 'income') {
        incomeTxs.push(tx);
      } else if (tx.category === 'saving') {
        savingTxs.push(tx);
        savingTransfersTotal += Math.abs(Number(tx.amount) || 0);
      } else {
        expenseTxs.push(tx);
      }
    }

    const activeList =
      mode === 'income' ? incomeTxs : mode === 'expense' ? expenseTxs : transactions;

    // Group category subtotals for income or expense
    const groupBase = mode === 'income' ? incomeTxs : mode === 'expense' ? expenseTxs : savingTxs;
    const totalBase = groupBase.reduce((acc, tx) => acc + Math.abs(Number(tx.amount) || 0), 0);
    const groupMap = new Map();

    for (const tx of groupBase) {
      const key = tx.iconKey || 'other';
      const amt = Math.abs(Number(tx.amount) || 0);
      const prev = groupMap.get(key);
      if (prev) {
        prev.amount += amt;
        prev.count += 1;
      } else {
        groupMap.set(key, {
          key,
          label: tx.categoryLabel || { th: 'ทั่วไป', en: 'General' },
          icon: getCategoryIconComponent(tx.iconKey, tx.customIcon, customCategories),
          amount: amt,
          count: 1,
        });
      }
    }

    const grouped = Array.from(groupMap.values())
      .map((item) => ({
        ...item,
        pct: totalBase > 0 ? Math.round((item.amount / totalBase) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      activeList,
      grouped,
      totalBase,
      savingTransfersTotal,
      savingCount: savingTxs.length,
    };
  }, [mode, transactions, customCategories]);

  const headerConfig = {
    income: {
      icon: ArrowDownLeft,
      tone: 'income',
      title: lang === 'TH' ? 'รายละเอียดรายรับเดือนนี้' : 'Monthly Income Breakdown',
      subtitle:
        lang === 'TH'
          ? 'ที่มาของรายได้ทั้งหมดและการเคลื่อนไหวในรอบเดือนนี้'
          : 'All income sources and inflows recorded this month',
      heroValue: formatTHB(monthlyIncome),
      badge:
        lang === 'TH'
          ? `${detailData.activeList.length} รายการ`
          : `${detailData.activeList.length} entries`,
      ctaLabel: lang === 'TH' ? 'บันทึกรายรับเพิ่ม' : 'Log Income',
    },
    expense: {
      icon: ArrowUpRight,
      tone: 'expense',
      title: lang === 'TH' ? 'รายละเอียดรายจ่ายเดือนนี้' : 'Monthly Expenses Breakdown',
      subtitle:
        lang === 'TH'
          ? 'แยกตามหมวดหมู่และรายการเคลื่อนไหวเพื่อเห็นจุดที่เงินไหลออก'
          : 'Category subtotals and every expense outflow this month',
      heroValue: formatTHB(monthlyExpenses),
      badge:
        lang === 'TH'
          ? `${expenseRatio}% ของรายรับ`
          : `${expenseRatio}% of income`,
      ctaLabel: lang === 'TH' ? 'บันทึกรายจ่ายเพิ่ม' : 'Log Expense',
    },
    saving: {
      icon: PiggyBank,
      tone: 'saving',
      title: lang === 'TH' ? 'ที่มาของเงินออมสุทธิ & ความเคลื่อนไหว' : 'Net Savings & Cashflow Movement',
      subtitle:
        lang === 'TH'
          ? 'คำนวณจากรายรับหักรายจ่าย พร้อมสรุปการโอนออมฉุกเฉินในเดือนนี้'
          : 'Calculated from Income minus Expenses, plus emergency fund transfers',
      heroValue: formatTHB(netSavings, { showSign: netSavings < 0 }),
      badge:
        lang === 'TH'
          ? `อัตราการออม ${netSavingsRate}% (เป้า 20%)`
          : `${netSavingsRate}% savings rate (20% goal)`,
      ctaLabel: lang === 'TH' ? 'เติมเงินสำรองฉุกเฉิน' : 'Add Emergency Saving',
    },
  }[mode];

  if (!headerConfig) return null;
  const HeaderIcon = headerConfig.icon;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kpi-detail-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog kpi-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div className="kpi-detail-head-left">
            <span className={`metric-icon-badge ${headerConfig.tone}`} aria-hidden="true">
              <HeaderIcon size={18} strokeWidth={2.2} />
            </span>
            <div>
              <h2 id="kpi-detail-modal-title" className="card-title">
                {headerConfig.title}
              </h2>
              <p className="card-subtitle">{headerConfig.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={lang === 'TH' ? 'ปิดหน้าต่าง' : 'Close'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Total Strip */}
        <div className={`kpi-detail-hero ${headerConfig.tone}`}>
          <div className="kpi-detail-hero-val tabular-nums">
            {headerConfig.heroValue}
          </div>
          <span className={`ak-kpi-pill ${headerConfig.tone === 'income' ? 'green' : headerConfig.tone === 'expense' ? 'red' : 'blue'} tabular-nums`}>
            {headerConfig.badge}
          </span>
        </div>

        {/* Formula Breakdown when inspecting Net Monthly Savings */}
        {mode === 'saving' && (
          <div className="kpi-formula-section">
            <div className="kpi-formula-grid tabular-nums">
              <div className="kpi-formula-box income">
                <span className="kpi-formula-lbl">
                  {lang === 'TH' ? 'รายรับเดือนนี้' : 'Income'}
                </span>
                <strong className="kpi-formula-val income">
                  +{formatTHB(monthlyIncome)}
                </strong>
              </div>
              <div className="kpi-formula-box expense">
                <span className="kpi-formula-lbl">
                  {lang === 'TH' ? 'หักรายจ่ายเดือนนี้' : 'Minus Expenses'}
                </span>
                <strong className="kpi-formula-val expense">
                  -{formatTHB(monthlyExpenses)}
                </strong>
              </div>
              <div className="kpi-formula-box saving">
                <span className="kpi-formula-lbl">
                  {lang === 'TH' ? 'โอนเข้าเงินสำรองแล้ว' : 'Emergency Transfers'}
                </span>
                <strong className="kpi-formula-val saving">
                  {formatTHB(detailData.savingTransfersTotal)}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Category Subtotals (for Income / Expense) */}
        {mode !== 'saving' && detailData.grouped.length > 0 && (
          <div className="kpi-detail-section">
            <div className="kpi-detail-section-title">
              {lang === 'TH' ? 'สรุปแยกตามหมวดหมู่' : 'Summary by Category'}
            </div>
            <div className="kpi-group-bars">
              {detailData.grouped.map((g) => {
                const Icon = g.icon;
                return (
                  <div key={g.key} className={`ak-cat-bar-item type-${mode}`}>
                    <div className="ak-cat-bar-top">
                      <span className="ak-cat-bar-name">
                        <span className="ak-cat-bar-icon" aria-hidden="true">
                          <Icon size={14} strokeWidth={2.2} />
                        </span>
                        <span>
                          {t(g.label)} ({g.count})
                        </span>
                      </span>
                      <span className={`ak-cat-bar-val ${mode} tabular-nums`}>
                        {formatTHB(g.amount)}
                        <span className="ak-cat-bar-pct"> ({g.pct}%)</span>
                      </span>
                    </div>
                    <div className="ak-bar-track sm">
                      <div
                        className="ak-bar-fill ak-bar-fill-cat"
                        style={{ width: `${g.pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chronological Movement List */}
        <div className="kpi-detail-section">
          <div className="kpi-detail-section-title">
            {mode === 'saving'
              ? lang === 'TH'
                ? 'ความเคลื่อนไหวทั้งหมดที่ส่งผลต่อเงินออม'
                : 'All Cashflow Movements Affecting Net Savings'
              : lang === 'TH'
                ? 'รายการเคลื่อนไหวล่าสุด'
                : 'Transaction Movements'}
          </div>

          {detailData.activeList.length === 0 ? (
            <div className="ak-empty-mini">
              {lang === 'TH' ? 'ยังไม่มีรายการเคลื่อนไหวในหมวดนี้' : 'No transactions recorded yet'}
            </div>
          ) : (
            <div className="kpi-detail-list">
              {detailData.activeList.map((tx) => {
                const Icon = getCategoryIconComponent(
                  tx.iconKey,
                  tx.customIcon,
                  customCategories
                );
                const txType =
                  tx.category === 'income'
                    ? 'income'
                    : tx.category === 'saving'
                      ? 'saving'
                      : 'expense';
                const absAmt = Math.abs(Number(tx.amount) || 0);
                const sharePct =
                  mode !== 'saving' && detailData.totalBase > 0
                    ? Math.round((absAmt / detailData.totalBase) * 100)
                    : null;
                const displayAmt =
                  txType === 'saving'
                    ? `+${formatTHB(absAmt)}`
                    : formatTHB(tx.amount, { showSign: true });

                return (
                  <div key={tx.id} className="kpi-detail-row">
                    <span className={`tx-icon-circle type-${txType}`} aria-hidden="true">
                      <Icon size={16} strokeWidth={2.1} />
                    </span>
                    <div className="kpi-detail-row-info">
                      <div className="tx-name">{t(tx.title)}</div>
                      <div className="kpi-detail-row-meta">
                        <span className="tx-cat-badge">{t(tx.categoryLabel)}</span>
                        <span className="tx-date tabular-nums">{t(tx.date)}</span>
                      </div>
                    </div>
                    <div className="kpi-detail-row-right tabular-nums">
                      <div className={`tx-amount ${txType}`}>{displayAmt}</div>
                      {sharePct !== null && (
                        <span className="kpi-detail-share">{sharePct}%</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cc-browse-footer">
          <button type="button" className="btn-soft-gray" onClick={onClose}>
            {lang === 'TH' ? 'ปิด' : 'Close'}
          </button>
          <button
            type="button"
            className="btn-primary-gradient"
            onClick={() => {
              onQuickLog(mode);
              onClose();
            }}
          >
            <PlusCircle size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>{headerConfig.ctaLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

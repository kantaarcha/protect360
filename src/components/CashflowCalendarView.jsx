import { useMemo, useState } from 'react';
import { Calendar, Check, ChevronLeft, ChevronRight, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB } from '../context/FinanceContext';
import { getCategoryIconComponent } from '../utils/categoryRegistry';

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EN_MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const TH_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const TH_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const WEEKDAYS_TH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toIsoKey(year, monthIndex, day) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

/**
 * Resolve any PROTECT360 transaction's calendar ISO date ('YYYY-MM-DD')
 * supporting tx.isoDate, tx.date.en ('25 Nov 2026'), and tx.date.th ('25 พ.ย. 2569').
 */
function resolveTxIsoDate(tx) {
  if (!tx) return null;
  if (typeof tx.isoDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(tx.isoDate)) {
    return tx.isoDate;
  }

  const enStr = typeof tx.date === 'string' ? tx.date : tx.date?.en || '';
  const enMatch = enStr.match(/(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
  if (enMatch) {
    const day = parseInt(enMatch[1], 10);
    const monPrefix = enMatch[2].slice(0, 3).toLowerCase();
    const monIdx = EN_MONTHS.findIndex((m) => m.toLowerCase() === monPrefix);
    const year = parseInt(enMatch[3], 10);
    if (monIdx >= 0 && day >= 1 && day <= 31) {
      return toIsoKey(year, monIdx, day);
    }
  }

  const thStr = tx.date?.th || '';
  const thMatch = thStr.match(/(\d{1,2})\s+([^\s]+)\s+(\d{4})/);
  if (thMatch) {
    const day = parseInt(thMatch[1], 10);
    const monIdx = TH_MONTHS_SHORT.indexOf(thMatch[2]);
    let year = parseInt(thMatch[3], 10);
    if (year > 2400) year -= 543;
    if (monIdx >= 0 && day >= 1 && day <= 31) {
      return toIsoKey(year, monIdx, day);
    }
  }

  return null;
}

function getInitialCalendarState(transactions) {
  for (const tx of transactions) {
    const iso = resolveTxIsoDate(tx);
    if (iso) {
      const [y, m] = iso.split('-').map(Number);
      return { year: y, monthIndex: m - 1, selectedIso: iso };
    }
  }
  const now = new Date();
  return {
    year: now.getFullYear(),
    monthIndex: now.getMonth(),
    selectedIso: toIsoKey(now.getFullYear(), now.getMonth(), now.getDate()),
  };
}

function formatCompactAmount(amount) {
  const abs = Math.round(Math.abs(amount));
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
  return `${sign}${abs.toLocaleString('en-US')}`;
}

export default function CashflowCalendarView({
  transactions = [],
  customCategories = [],
  coreCategories = [],
  allCategoryMap = {},
  onQuickAddDate,
  onUpdateTransaction,
  onRemoveTransaction,
}) {
  const { lang, t } = useLanguage();

  const [calCursor, setCalCursor] = useState(() => getInitialCalendarState(transactions));
  const [editingTxId, setEditingTxId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    title: '',
    amount: '',
    category: 'expense',
    iconKey: 'food',
  });
  const viewYear = calCursor.year;
  const viewMonth = calCursor.monthIndex;
  const selectedIso = calCursor.selectedIso;

  const setViewYear = (y) => setCalCursor((prev) => ({ ...prev, year: y }));
  const setViewMonth = (m) => setCalCursor((prev) => ({ ...prev, monthIndex: m }));
  const setSelectedIso = (iso) => setCalCursor((prev) => ({ ...prev, selectedIso: iso }));

  // Group all transactions by YYYY-MM-DD
  const dailyMap = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const iso = resolveTxIsoDate(tx);
      if (!iso) return;
      if (!map[iso]) {
        map[iso] = { income: 0, expense: 0, saving: 0, items: [] };
      }
      const absAmt = Math.abs(Number(tx.amount) || 0);
      if (tx.category === 'income') {
        map[iso].income += absAmt;
      } else if (tx.category === 'saving') {
        map[iso].saving += absAmt;
      } else {
        map[iso].expense += absAmt;
      }
      map[iso].items.push(tx);
    });
    return map;
  }, [transactions]);

  // Exact calendar grid for viewed month (28, 29, 30, or 31 day cells!)
  const calendarData = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun..6=Sat
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate(); // 28, 29, 30, or 31

    let monthIncome = 0;
    let monthExpense = 0;
    let monthSaving = 0;
    let activeDays = 0;

    const cells = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ kind: 'blank', key: `blank-${i}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const iso = toIsoKey(viewYear, viewMonth, day);
      const bucket = dailyMap[iso] || null;
      const income = bucket?.income || 0;
      const expense = bucket?.expense || 0;
      const saving = bucket?.saving || 0;
      const net = income - expense;

      if (bucket) {
        monthIncome += income;
        monthExpense += expense;
        monthSaving += saving;
        activeDays += 1;
      }

      let tone = 'empty';
      if (bucket) {
        if (income === 0 && expense === 0 && saving > 0) {
          tone = 'saving';
        } else if (net >= 0) {
          tone = 'profit';
        } else {
          tone = 'loss';
        }
      }

      cells.push({
        kind: 'day',
        key: iso,
        iso,
        day,
        income,
        expense,
        saving,
        net,
        tone,
        count: bucket?.items.length || 0,
      });
    }

    return {
      daysInMonth,
      cells,
      monthIncome,
      monthExpense,
      monthSaving,
      monthNet: monthIncome - monthExpense,
      activeDays,
    };
  }, [viewYear, viewMonth, dailyMap]);

  const handleShiftMonth = (delta) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handleJumpToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const day = now.getDate();
    setViewYear(y);
    setViewMonth(m);
    setSelectedIso(toIsoKey(y, m, day));
  };

  const selectedBucket = selectedIso ? dailyMap[selectedIso] || null : null;
  const monthTitle =
    lang === 'TH'
      ? `${TH_MONTHS_FULL[viewMonth]} ${viewYear + 543}`
      : `${EN_MONTHS_FULL[viewMonth]} ${viewYear}`;

  const weekdays = lang === 'TH' ? WEEKDAYS_TH : WEEKDAYS_EN;

  const formatSelectedDateLabel = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    if (lang === 'TH') {
      return `${d} ${TH_MONTHS_FULL[m - 1]} ${y + 543}`;
    }
    return `${d} ${EN_MONTHS_FULL[m - 1]} ${y}`;
  };

  return (
    <div className="ak-cal-wrap">
      {/* Month Navigator & Monthly P&L Summary */}
      <div className="ak-cal-toolbar">
        <div className="ak-cal-nav">
          <button
            type="button"
            className="ak-cal-nav-btn"
            onClick={() => handleShiftMonth(-1)}
            aria-label={lang === 'TH' ? 'เดือนก่อนหน้า' : 'Previous month'}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="ak-cal-month-title">
            <Calendar size={15} aria-hidden="true" />
            <strong>{monthTitle}</strong>
            <span className="ak-cal-days-badge tabular-nums">
              {calendarData.daysInMonth} {lang === 'TH' ? 'วัน' : 'days'}
            </span>
          </div>
          <button
            type="button"
            className="ak-cal-nav-btn"
            onClick={() => handleShiftMonth(1)}
            aria-label={lang === 'TH' ? 'เดือนถัดไป' : 'Next month'}
          >
            <ChevronRight size={16} />
          </button>
          <button type="button" className="ak-cal-today-btn" onClick={handleJumpToday}>
            {lang === 'TH' ? 'วันนี้' : 'Today'}
          </button>
        </div>

        <div className="ak-cal-summary-pills tabular-nums">
          <span className="ak-cal-sum-pill income">
            {lang === 'TH' ? 'รับ' : 'In'} +{formatTHB(calendarData.monthIncome)}
          </span>
          <span className="ak-cal-sum-pill expense">
            {lang === 'TH' ? 'จ่าย' : 'Out'} -{formatTHB(calendarData.monthExpense)}
          </span>
          <span className="ak-cal-sum-pill saving">
            {lang === 'TH' ? 'สำรอง' : 'Save'} +{formatTHB(calendarData.monthSaving)}
          </span>
          <span
            className={`ak-cal-sum-pill net ${calendarData.monthNet >= 0 ? 'profit' : 'loss'}`}
          >
            {lang === 'TH' ? 'สุทธิ' : 'Net'}{' '}
            {calendarData.monthNet >= 0 ? '+' : ''}
            {formatTHB(calendarData.monthNet)}
          </span>
        </div>
      </div>

      {/* 7-Column Weekday Header + Exact 28/29/30/31 Day Grid */}
      <div className="ak-cal-grid-shell">
        <div className="ak-cal-weekdays">
          {weekdays.map((wd) => (
            <div key={wd} className="ak-cal-weekday">
              {wd}
            </div>
          ))}
        </div>

        <div className="ak-cal-days-grid">
          {calendarData.cells.map((cell) => {
            if (cell.kind === 'blank') {
              return <div key={cell.key} className="ak-cal-cell blank" aria-hidden="true" />;
            }

            const isSelected = selectedIso === cell.iso;
            const displayAmount =
              cell.tone === 'saving'
                ? formatCompactAmount(cell.saving)
                : cell.tone !== 'empty'
                  ? formatCompactAmount(cell.net)
                  : '';

            return (
              <button
                key={cell.key}
                type="button"
                className={`ak-cal-cell day tone-${cell.tone} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedIso(cell.iso)}
              >
                <div className="ak-cal-cell-top">
                  <span className="ak-cal-day-num tabular-nums">{cell.day}</span>
                  {cell.count > 0 && (
                    <span className="ak-cal-dots" aria-hidden="true">
                      {cell.income > 0 && <i className="dot-in" />}
                      {cell.expense > 0 && <i className="dot-out" />}
                      {cell.saving > 0 && <i className="dot-save" />}
                    </span>
                  )}
                </div>

                {displayAmount ? (
                  <span className={`ak-cal-day-pnl tabular-nums tone-${cell.tone}`}>
                    {displayAmount}
                  </span>
                ) : (
                  <span className="ak-cal-day-empty">—</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail Panel */}
      {selectedIso && (
        <div className="ak-cal-day-detail">
          <div className="ak-cal-detail-head">
            <div>
              <h3 className="ak-cal-detail-title">
                {formatSelectedDateLabel(selectedIso)}
              </h3>
              <p className="ak-cal-detail-sub tabular-nums">
                {selectedBucket
                  ? lang === 'TH'
                    ? `${selectedBucket.items.length} รายการ • กำไร/ขาดทุนวันนั้น ${
                        selectedBucket.income - selectedBucket.expense >= 0 ? '+' : ''
                      }${formatTHB(selectedBucket.income - selectedBucket.expense)}`
                    : `${selectedBucket.items.length} entries • Daily P&L ${
                        selectedBucket.income - selectedBucket.expense >= 0 ? '+' : ''
                      }${formatTHB(selectedBucket.income - selectedBucket.expense)}`
                  : lang === 'TH'
                    ? 'ยังไม่มีรายการบันทึกในวันนี้'
                    : 'No entries logged on this day yet'}
              </p>
            </div>

            {onQuickAddDate && (
              <button
                type="button"
                className="ak-cal-add-btn"
                onClick={() => onQuickAddDate(selectedIso)}
              >
                <PlusCircle size={14} strokeWidth={2.2} />
                <span>{lang === 'TH' ? 'เพิ่มรายการวันนี้' : 'Add on this day'}</span>
              </button>
            )}
          </div>

          {selectedBucket && selectedBucket.items.length > 0 && (
            <div className="ak-cal-tx-list">
              {selectedBucket.items.map((tx) => {
                const Icon = getCategoryIconComponent(
                  tx.iconKey,
                  tx.customIcon,
                  customCategories
                );
                const stream =
                  tx.category === 'income'
                    ? 'income'
                    : tx.category === 'saving'
                      ? 'saving'
                      : 'expense';
                const isEditing = editingTxId === tx.id;
                const isConfirming = confirmDeleteId === tx.id;

                if (isEditing) {
                  return (
                    <div key={tx.id} className="ak-cal-tx-edit-card">
                      <input
                        id={`ak-cal-edit-title-${tx.id}`}
                        type="text"
                        className="ak-inline-input"
                        value={editDraft.title}
                        onChange={(e) =>
                          setEditDraft((prev) => ({ ...prev, title: e.target.value }))
                        }
                        maxLength={80}
                        aria-label={lang === 'TH' ? 'ชื่อรายการ' : 'Item title'}
                      />
                      <div className="form-grid-2">
                        <input
                          id={`ak-cal-edit-amt-${tx.id}`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          className="ak-inline-input tabular-nums"
                          value={editDraft.amount}
                          onChange={(e) =>
                            setEditDraft((prev) => ({ ...prev, amount: e.target.value }))
                          }
                          aria-label={lang === 'TH' ? 'จำนวนเงิน' : 'Amount'}
                        />
                        <select
                          id={`ak-cal-edit-cat-${tx.id}`}
                          className="ak-inline-select"
                          value={editDraft.iconKey}
                          onChange={(e) => {
                            const nextKey = e.target.value;
                            const matched = allCategoryMap[nextKey];
                            setEditDraft((prev) => ({
                              ...prev,
                              iconKey: nextKey,
                              category: matched ? matched.type : prev.category,
                            }));
                          }}
                          aria-label={lang === 'TH' ? 'หมวดหมู่' : 'Category'}
                        >
                          {coreCategories.map((c) => (
                            <option key={c.key} value={c.key}>
                              {t(c.label)}
                            </option>
                          ))}
                          {customCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {t(c.label || { th: c.name, en: c.name })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="ak-tx-confirm-group">
                        <button
                          type="button"
                          className="ak-tx-cancel-btn"
                          onClick={() => setEditingTxId(null)}
                        >
                          {lang === 'TH' ? 'ยกเลิก' : 'Cancel'}
                        </button>
                        <button
                          id={`ak-cal-save-${tx.id}`}
                          type="button"
                          className="ak-tx-save-confirm"
                          onClick={() => {
                            const numericAmount = Math.max(0, Number(editDraft.amount) || 0);
                            if (numericAmount <= 0 || !onUpdateTransaction) return;
                            const catMeta = allCategoryMap[editDraft.iconKey];
                            const trimmedTitle = editDraft.title.trim();
                            onUpdateTransaction(tx.id, {
                              title: trimmedTitle ? { th: trimmedTitle, en: trimmedTitle } : tx.title,
                              amount:
                                editDraft.category === 'expense' ? -numericAmount : numericAmount,
                              category: editDraft.category,
                              iconKey: catMeta ? catMeta.key : tx.iconKey,
                              categoryLabel: catMeta ? catMeta.label : tx.categoryLabel,
                              customIcon: catMeta?.isCustom ? catMeta.iconName : undefined,
                              customColor: catMeta?.isCustom ? catMeta.barColor : undefined,
                            });
                            setEditingTxId(null);
                          }}
                        >
                          <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                          <span>{lang === 'TH' ? 'บันทึก' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={tx.id} className="ak-cal-tx-row">
                    <span className={`tx-icon-circle ${tx.iconKey || 'food'}`} aria-hidden="true">
                      <Icon size={14} strokeWidth={2.1} />
                    </span>
                    <div className="ak-cal-tx-copy">
                      <strong>{t(tx.title)}</strong>
                      <span>{t(tx.categoryLabel)}</span>
                    </div>
                    <strong className={`tx-amount ${stream} tabular-nums`}>
                      {formatTHB(tx.amount, { showSign: true })}
                    </strong>

                    {(onUpdateTransaction || onRemoveTransaction) && (
                      <div className="ak-cal-tx-actions">
                        {onUpdateTransaction && (
                          <button
                            id={`ak-cal-edit-btn-${tx.id}`}
                            type="button"
                            className="ak-cal-icon-btn"
                            title={lang === 'TH' ? 'แก้ไขรายการ' : 'Edit entry'}
                            aria-label={lang === 'TH' ? 'แก้ไขรายการ' : 'Edit entry'}
                            onClick={() => {
                              setConfirmDeleteId(null);
                              setEditingTxId(tx.id);
                              setEditDraft({
                                title: t(tx.title),
                                amount: String(Math.abs(Number(tx.amount) || 0)),
                                category: tx.category || 'expense',
                                iconKey: tx.iconKey || 'food',
                              });
                            }}
                          >
                            <Pencil size={13} strokeWidth={2.2} />
                          </button>
                        )}
                        {onRemoveTransaction &&
                          (isConfirming ? (
                            <button
                              id={`ak-cal-del-confirm-${tx.id}`}
                              type="button"
                              className="ak-tx-delete-confirm"
                              onClick={() => {
                                onRemoveTransaction(tx.id);
                                setConfirmDeleteId(null);
                              }}
                            >
                              {lang === 'TH' ? 'ยืนยัน' : 'Delete'}
                            </button>
                          ) : (
                            <button
                              id={`ak-cal-del-btn-${tx.id}`}
                              type="button"
                              className="ak-cal-icon-btn danger"
                              title={lang === 'TH' ? 'ลบรายการ' : 'Delete entry'}
                              aria-label={lang === 'TH' ? 'ลบรายการ' : 'Delete entry'}
                              onClick={() => setConfirmDeleteId(tx.id)}
                            >
                              <Trash2 size={13} strokeWidth={2.2} />
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

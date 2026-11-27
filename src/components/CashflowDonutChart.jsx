import { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB } from '../context/FinanceContext';

// Soft, eye-friendly semantic shade ramps (Income Green, Expense Red, Saving Blue)
const SHADE_PALETTES = {
  income: ['#1b9662', '#2cb077', '#4bc791', '#73d9ab'],
  expense: ['#cf4646', '#dd5d5d', '#e87979', '#f09595', '#b93b3b', '#e26a5a'],
  saving: ['#2563eb', '#3f7ff2', '#5f9af7', '#84b4fb'],
};

const RADIUS = 68;
const STROKE_WIDTH = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CashflowDonutChart({
  items = [],
  breakdownFilter = 'all',
  totalLabel,
}) {
  const { lang, t } = useLanguage();
  const [hoveredKey, setHoveredKey] = useState(null);

  const slices = useMemo(() => {
    const valid = items.filter((item) => Number(item.amount) > 0);
    const grandTotal = valid.reduce((sum, item) => sum + Number(item.amount), 0);
    if (grandTotal <= 0) return { grandTotal: 0, list: [] };

    const typeCounts = { income: 0, expense: 0, saving: 0 };
    let cumulativeFraction = 0;
    const list = [];

    for (const item of valid) {
      const stream = item.type === 'income' ? 'income' : item.type === 'saving' ? 'saving' : 'expense';
      const palette = SHADE_PALETTES[stream];
      const shadeIdx = typeCounts[stream] % palette.length;
      typeCounts[stream] += 1;

      const fraction = Number(item.amount) / grandTotal;
      const pct = Math.round(fraction * 100);
      const dashLength = Math.max(0, fraction * CIRCUMFERENCE - (valid.length > 1 ? 2.5 : 0));
      const dashOffset = -cumulativeFraction * CIRCUMFERENCE;
      cumulativeFraction += fraction;

      list.push({
        ...item,
        color: palette[shadeIdx],
        fraction,
        displayPct: breakdownFilter === 'all' ? item.pct : item.shareOfStream || pct,
        dashLength,
        dashOffset,
      });
    }

    return { grandTotal, list };
  }, [items, breakdownFilter]);

  const activeSlice =
    slices.list.find((s) => s.key === hoveredKey) || null;

  if (slices.list.length === 0) {
    return (
      <div className="ak-empty-mini">
        {lang === 'TH' ? 'ยังไม่มีรายการในหมวดนี้' : 'No items logged in this stream yet'}
      </div>
    );
  }

  return (
    <div className="ak-donut-layout">
      {/* Interactive SVG Donut Ring */}
      <div className="ak-donut-stage">
        <svg
          className="ak-donut-svg"
          viewBox="0 0 200 200"
          role="img"
          aria-label={lang === 'TH' ? 'กราฟวงกลมสัดส่วนรายรับรายจ่าย' : 'Cashflow breakdown donut chart'}
        >
          {/* Base Subtle Ring Track */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            className="ak-donut-track"
            strokeWidth={STROKE_WIDTH}
          />

          {/* Data Arc Slices */}
          <g transform="rotate(-90 100 100)">
            {slices.list.map((slice) => {
              const isActive = hoveredKey === slice.key;
              const isDimmed = hoveredKey !== null && !isActive;
              return (
                <circle
                  key={slice.key}
                  cx="100"
                  cy="100"
                  r={RADIUS}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={isActive ? STROKE_WIDTH + 4 : STROKE_WIDTH}
                  strokeDasharray={`${slice.dashLength} ${CIRCUMFERENCE}`}
                  strokeDashoffset={slice.dashOffset}
                  strokeLinecap="butt"
                  className={`ak-donut-slice ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                  onMouseEnter={() => setHoveredKey(slice.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() =>
                    setHoveredKey((prev) => (prev === slice.key ? null : slice.key))
                  }
                />
              );
            })}
          </g>
        </svg>

        {/* Center Live Readout */}
        <div className="ak-donut-center tabular-nums">
          {activeSlice ? (
            <>
              <span className="ak-donut-center-lbl">{t(activeSlice.label)}</span>
              <strong className={`ak-donut-center-val ${activeSlice.type}`}>
                {activeSlice.type === 'expense' ? '-' : '+'}
                {formatTHB(activeSlice.amount)}
              </strong>
              <span className="ak-donut-center-pct">{activeSlice.displayPct}%</span>
            </>
          ) : (
            <>
              <span className="ak-donut-center-lbl">
                {totalLabel || (lang === 'TH' ? 'ยอดรวมที่แสดง' : 'Visible Total')}
              </span>
              <strong className="ak-donut-center-val">
                {formatTHB(slices.grandTotal)}
              </strong>
              <span className="ak-donut-center-pct">
                {slices.list.length} {lang === 'TH' ? 'หมวด' : 'groups'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Interactive Category Legend */}
      <div className="ak-donut-legend">
        {slices.list.map((slice) => {
          const Icon = slice.icon;
          const isActive = hoveredKey === slice.key;
          const sign = slice.type === 'expense' ? '-' : '+';
          return (
            <button
              key={slice.key}
              type="button"
              className={`ak-donut-legend-row ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHoveredKey(slice.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() =>
                setHoveredKey((prev) => (prev === slice.key ? null : slice.key))
              }
            >
              <span
                className="ak-donut-swatch"
                style={{ backgroundColor: slice.color }}
                aria-hidden="true"
              />
              <span className="ak-donut-legend-name">
                {Icon && <Icon size={13} strokeWidth={2.2} aria-hidden="true" />}
                <span>{t(slice.label)}</span>
              </span>
              <span className={`ak-donut-legend-val ${slice.type} tabular-nums`}>
                {sign}
                {formatTHB(slice.amount)}{' '}
                <small>({slice.displayPct}%)</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Calculator, Check, Delete, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { evaluateCalcExpression } from '../utils/categoryRegistry';

function formatResult(num) {
  if (num === null || !Number.isFinite(num)) return '';
  const clamped = Math.max(0, num);
  return Number.isInteger(clamped) ? String(clamped) : clamped.toFixed(2);
}

export default function MerchantCalculator({ initialValue = '', onApply, onClose }) {
  const { lang } = useLanguage();
  const [expr, setExpr] = useState(() => {
    const num = Number(initialValue);
    return Number.isFinite(num) && num > 0 ? String(num) : '';
  });

  const liveResult = evaluateCalcExpression(expr);
  const formattedPreview = liveResult !== null ? formatResult(liveResult) : '';
  const hasOperator = /[+\-×÷]/.test(expr.slice(1));

  const appendDigit = (digit) => {
    setExpr((prev) => {
      if (prev.length >= 28) return prev;
      if (digit === '.') {
        // Prevent double dot in the current numeric segment
        const lastSegment = prev.split(/[+\-×÷]/).pop() || '';
        if (lastSegment.includes('.')) return prev;
        return prev === '' || /[+\-×÷]$/.test(prev) ? `${prev}0.` : `${prev}.`;
      }
      if (digit === '00') {
        if (prev === '' || /[+\-×÷]$/.test(prev)) return `${prev}0`;
        return `${prev}00`;
      }
      if (prev === '0') return digit;
      return `${prev}${digit}`;
    });
  };

  const appendOperator = (op) => {
    setExpr((prev) => {
      if (!prev) return '';
      if (/[+\-×÷]$/.test(prev)) {
        return `${prev.slice(0, -1)}${op}`;
      }
      if (prev.endsWith('.')) {
        return `${prev.slice(0, -1)}${op}`;
      }
      return `${prev}${op}`;
    });
  };

  const handleBackspace = () => {
    setExpr((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setExpr('');
  };

  const handleEquals = () => {
    if (liveResult === null) return;
    const nextVal = formatResult(liveResult);
    setExpr(nextVal);
  };

  const handleApply = () => {
    if (liveResult === null || liveResult <= 0) return;
    onApply(formatResult(liveResult));
    onClose?.();
  };

  return (
    <div className="ak-calc-panel" role="region" aria-label={lang === 'TH' ? 'เครื่องคิดเลขแม่ค้า' : 'Quick Calculator'}>
      <div className="ak-calc-header">
        <span className="ak-calc-title">
          <Calculator size={14} strokeWidth={2.2} aria-hidden="true" />
          <span>{lang === 'TH' ? 'เครื่องคิดเลขแม่ค้า' : 'Quick Calculator'}</span>
        </span>
        {onClose && (
          <button
            type="button"
            className="ak-calc-close"
            onClick={onClose}
            aria-label={lang === 'TH' ? 'ปิดเครื่องคิดเลข' : 'Close calculator'}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="ak-calc-screen tabular-nums">
        <div className="ak-calc-tape">{expr || '0'}</div>
        <div className="ak-calc-live">
          {hasOperator && formattedPreview
            ? `= ฿${Number(formattedPreview).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
            : formattedPreview
              ? `฿${Number(formattedPreview).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
              : '฿0'}
        </div>
      </div>

      <div className="ak-calc-grid tabular-nums">
        <button type="button" className="ak-calc-key util" onClick={handleClear}>
          C
        </button>
        <button
          type="button"
          className="ak-calc-key util"
          onClick={handleBackspace}
          aria-label="Backspace"
        >
          <Delete size={16} strokeWidth={2.1} />
        </button>
        <button type="button" className="ak-calc-key op" onClick={() => appendOperator('÷')}>
          ÷
        </button>
        <button type="button" className="ak-calc-key op" onClick={() => appendOperator('×')}>
          ×
        </button>

        <button type="button" className="ak-calc-key" onClick={() => appendDigit('7')}>7</button>
        <button type="button" className="ak-calc-key" onClick={() => appendDigit('8')}>8</button>
        <button type="button" className="ak-calc-key" onClick={() => appendDigit('9')}>9</button>
        <button type="button" className="ak-calc-key op" onClick={() => appendOperator('-')}>
          −
        </button>

        <button type="button" className="ak-calc-key" onClick={() => appendDigit('4')}>4</button>
        <button type="button" className="ak-calc-key" onClick={() => appendDigit('5')}>5</button>
        <button type="button" className="ak-calc-key" onClick={() => appendDigit('6')}>6</button>
        <button type="button" className="ak-calc-key op" onClick={() => appendOperator('+')}>
          +
        </button>

        <button type="button" className="ak-calc-key" onClick={() => appendDigit('1')}>1</button>
        <button type="button" className="ak-calc-key" onClick={() => appendDigit('2')}>2</button>
        <button type="button" className="ak-calc-key" onClick={() => appendDigit('3')}>3</button>
        <button type="button" className="ak-calc-key eq" onClick={handleEquals}>
          =
        </button>

        <button type="button" className="ak-calc-key" onClick={() => appendDigit('0')}>0</button>
        <button type="button" className="ak-calc-key" onClick={() => appendDigit('00')}>00</button>
        <button type="button" className="ak-calc-key" onClick={() => appendDigit('.')}>.</button>
        <button
          type="button"
          className="ak-calc-key apply"
          disabled={!liveResult || liveResult <= 0}
          onClick={handleApply}
        >
          <Check size={15} strokeWidth={2.5} aria-hidden="true" />
          <span>{lang === 'TH' ? 'ใช้ยอด' : 'Use'}</span>
        </button>
      </div>
    </div>
  );
}

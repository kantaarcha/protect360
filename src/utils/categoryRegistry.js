import {
  BookOpen,
  Briefcase,
  Building2,
  Car,
  Coffee,
  Dumbbell,
  Film,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Music,
  PawPrint,
  PiggyBank,
  Plane,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  TrainFront,
  Utensils,
  Wallet,
  Wifi,
  Zap,
} from 'lucide-react';

export const CORE_CATEGORIES = [
  {
    key: 'food',
    type: 'expense',
    iconName: 'coffee',
    icon: Coffee,
    label: { th: 'อาหาร & เครื่องดื่ม', en: 'Food & Dining' },
    barColor: '#EA8C1E',
    barColorDark: '#FFB04A',
  },
  {
    key: 'housing',
    type: 'expense',
    iconName: 'building',
    icon: Building2,
    label: { th: 'ที่พัก & สาธารณูปโภค', en: 'Housing & Bills' },
    barColor: '#3B6CE8',
    barColorDark: '#6B96FF',
  },
  {
    key: 'transport',
    type: 'expense',
    iconName: 'train',
    icon: TrainFront,
    label: { th: 'เดินทาง / BTS', en: 'Transport / BTS' },
    barColor: '#0EA5A0',
    barColorDark: '#2DD4BF',
  },
  {
    key: 'lifestyle',
    type: 'expense',
    iconName: 'shopping-bag',
    icon: ShoppingBag,
    label: { th: 'ไลฟ์สไตล์', en: 'Lifestyle' },
    barColor: '#8B5CF6',
    barColorDark: '#B08BFF',
  },
  {
    key: 'saving',
    type: 'saving',
    iconName: 'piggy-bank',
    icon: PiggyBank,
    label: { th: 'เงินออมฉุกเฉิน', en: 'Emergency Fund' },
    barColor: '#0284C7',
    barColorDark: '#38BDF8',
  },
  {
    key: 'salary',
    type: 'income',
    iconName: 'wallet',
    icon: Wallet,
    label: { th: 'เงินเดือน / รายได้เสริม', en: 'Salary & Income' },
    barColor: '#1FA86B',
    barColorDark: '#34D399',
  },
];

export const CORE_CATEGORY_MAP = Object.fromEntries(CORE_CATEGORIES.map((c) => [c.key, c]));

// 25 curated vector icons for user-created custom categories
export const CUSTOM_ICON_OPTIONS = [
  { id: 'utensils', icon: Utensils, label: { th: 'อาหาร', en: 'Meals' } },
  { id: 'coffee', icon: Coffee, label: { th: 'กาแฟ / เครื่องดื่ม', en: 'Coffee & Drinks' } },
  { id: 'shopping-bag', icon: ShoppingBag, label: { th: 'ช้อปปิ้ง', en: 'Shopping' } },
  { id: 'shopping-cart', icon: ShoppingCart, label: { th: 'ของใช้ / ซูเปอร์', en: 'Groceries' } },
  { id: 'home', icon: Home, label: { th: 'บ้าน / ที่พัก', en: 'Home' } },
  { id: 'zap', icon: Zap, label: { th: 'ค่าน้ำ / ค่าไฟ', en: 'Utilities' } },
  { id: 'wifi', icon: Wifi, label: { th: 'เน็ต / มือถือ', en: 'Internet & Phone' } },
  { id: 'car', icon: Car, label: { th: 'รถยนต์ / น้ำมัน', en: 'Car & Fuel' } },
  { id: 'train', icon: TrainFront, label: { th: 'รถไฟฟ้า / เดินทาง', en: 'Transit' } },
  { id: 'plane', icon: Plane, label: { th: 'ท่องเที่ยว', en: 'Travel' } },
  { id: 'heart-pulse', icon: HeartPulse, label: { th: 'สุขภาพ / ยา', en: 'Health' } },
  { id: 'dumbbell', icon: Dumbbell, label: { th: 'ฟิตเนส / กีฬา', en: 'Fitness' } },
  { id: 'graduation-cap', icon: GraduationCap, label: { th: 'เรียน / คอร์ส', en: 'Education' } },
  { id: 'book-open', icon: BookOpen, label: { th: 'หนังสือ', en: 'Books' } },
  { id: 'gamepad', icon: Gamepad2, label: { th: 'เกม / บันเทิง', en: 'Gaming' } },
  { id: 'music', icon: Music, label: { th: 'เพลง / สตรีมมิ่ง', en: 'Music' } },
  { id: 'film', icon: Film, label: { th: 'ดูหนัง', en: 'Movies' } },
  { id: 'paw-print', icon: PawPrint, label: { th: 'สัตว์เลี้ยง', en: 'Pets' } },
  { id: 'gift', icon: Gift, label: { th: 'ของขวัญ / ครอบครัว', en: 'Gifts & Family' } },
  { id: 'shirt', icon: Shirt, label: { th: 'เสื้อผ้า / แฟชั่น', en: 'Fashion' } },
  { id: 'sparkles', icon: Sparkles, label: { th: 'ความงาม / ดูแลตัวเอง', en: 'Personal Care' } },
  { id: 'smartphone', icon: Smartphone, label: { th: 'แกดเจ็ต / ไอที', en: 'Tech & Gadgets' } },
  { id: 'briefcase', icon: Briefcase, label: { th: 'ฟรีแลนซ์ / งานเสริม', en: 'Side Income' } },
  { id: 'piggy-bank', icon: PiggyBank, label: { th: 'ออม / ลงทุน', en: 'Savings' } },
  { id: 'tag', icon: Tag, label: { th: 'อื่น ๆ ทั่วไป', en: 'General' } },
];

export const CUSTOM_ICON_MAP = {
  ...Object.fromEntries(CUSTOM_ICON_OPTIONS.map((item) => [item.id, item.icon])),
  building: Building2,
  wallet: Wallet,
  food: Coffee,
  housing: Building2,
  transport: TrainFront,
  lifestyle: ShoppingBag,
  saving: PiggyBank,
  salary: Wallet,
};

// 6 high-contrast, dark-mode-safe accent colors with distinct hues
export const CUSTOM_COLOR_OPTIONS = [
  {
    id: 'indigo',
    hex: '#3B6CE8',
    darkHex: '#6B96FF',
    bg: 'rgba(59, 108, 232, 0.14)',
    label: { th: 'น้ำเงินอินดิโก้', en: 'Royal Indigo' },
  },
  {
    id: 'teal',
    hex: '#0EA5A0',
    darkHex: '#2DD4BF',
    bg: 'rgba(14, 165, 160, 0.14)',
    label: { th: 'เขียวมิ้นต์', en: 'Bright Teal' },
  },
  {
    id: 'rose',
    hex: '#E0487E',
    darkHex: '#FF75A6',
    bg: 'rgba(224, 72, 126, 0.14)',
    label: { th: 'ชมพูโรส', en: 'Rose Pink' },
  },
  {
    id: 'amber',
    hex: '#EA8C1E',
    darkHex: '#FFB04A',
    bg: 'rgba(234, 140, 30, 0.15)',
    label: { th: 'ส้มอำพัน', en: 'Warm Amber' },
  },
  {
    id: 'violet',
    hex: '#8B5CF6',
    darkHex: '#B08BFF',
    bg: 'rgba(139, 92, 246, 0.15)',
    label: { th: 'ม่วงไวโอเล็ต', en: 'Vivid Violet' },
  },
  {
    id: 'sky',
    hex: '#0284C7',
    darkHex: '#38BDF8',
    bg: 'rgba(2, 132, 199, 0.14)',
    label: { th: 'ฟ้าสกาย', en: 'Sky Cyan' },
  },
];

// Map any legacy stored hex values from earlier rounds to bright dark-mode-safe equivalents
const LEGACY_COLOR_FALLBACKS = {
  '#2878C8': CUSTOM_COLOR_OPTIONS[0],
  '#3B5984': CUSTOM_COLOR_OPTIONS[5],
  '#142B4A': CUSTOM_COLOR_OPTIONS[0],
  '#22B8A7': CUSTOM_COLOR_OPTIONS[1],
  '#D95353': CUSTOM_COLOR_OPTIONS[2],
  '#D98A16': CUSTOM_COLOR_OPTIONS[3],
  '#7C5CE0': CUSTOM_COLOR_OPTIONS[4],
};

export function getCustomColorMeta(hex) {
  return (
    CUSTOM_COLOR_OPTIONS.find((c) => c.hex.toLowerCase() === String(hex || '').toLowerCase()) ||
    LEGACY_COLOR_FALLBACKS[String(hex || '').toUpperCase()] ||
    CUSTOM_COLOR_OPTIONS[0]
  );
}

export function getCategoryIconComponent(iconKey, customIcon = null, customCategories = []) {
  if (customIcon && CUSTOM_ICON_MAP[customIcon]) {
    return CUSTOM_ICON_MAP[customIcon];
  }
  if (CORE_CATEGORY_MAP[iconKey]) {
    return CORE_CATEGORY_MAP[iconKey].icon;
  }
  const foundCustom = Array.isArray(customCategories)
    ? customCategories.find((c) => c.id === iconKey)
    : null;
  if (foundCustom && CUSTOM_ICON_MAP[foundCustom.iconName]) {
    return CUSTOM_ICON_MAP[foundCustom.iconName];
  }
  if (CUSTOM_ICON_MAP[iconKey]) {
    return CUSTOM_ICON_MAP[iconKey];
  }
  return Tag;
}

export function resolveTransactionBadgeStyle(tx, customCategories = []) {
  if (CORE_CATEGORY_MAP[tx.iconKey]) {
    return undefined;
  }
  const foundCustom = Array.isArray(customCategories)
    ? customCategories.find((c) => c.id === tx.iconKey)
    : null;
  const colorHex = tx.customColor || foundCustom?.color;
  if (!colorHex) return undefined;
  const meta = getCustomColorMeta(colorHex);
  return {
    backgroundColor: meta.bg,
    color: meta.hex,
  };
}

/**
 * Pure, safe arithmetic expression evaluator for Merchant Calculator ("เครื่องคิดเลขแม่ค้า").
 * Supports +, -, *, / with standard precedence. Never uses eval().
 */
export function evaluateCalcExpression(rawExpr) {
  const cleaned = String(rawExpr || '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s+/g, '');

  if (!cleaned || !/^[0-9+\-*/.]+$/.test(cleaned)) {
    return null;
  }

  // Strip trailing operators so live preview works while typing (e.g., "120+")
  const trimmed = cleaned.replace(/[+\-*/.]+$/, '');
  if (!trimmed) return null;

  // Tokenize numbers and operators
  const tokens = [];
  let i = 0;
  while (i < trimmed.length) {
    const ch = trimmed[i];
    if ('+-*/'.includes(ch)) {
      // Handle leading unary minus
      if (ch === '-' && (tokens.length === 0 || typeof tokens[tokens.length - 1] === 'string')) {
        let numStr = '-';
        i += 1;
        while (i < trimmed.length && /[0-9.]/.test(trimmed[i])) {
          numStr += trimmed[i];
          i += 1;
        }
        const val = Number(numStr);
        if (!Number.isFinite(val)) return null;
        tokens.push(val);
      } else {
        tokens.push(ch);
        i += 1;
      }
    } else {
      let numStr = '';
      while (i < trimmed.length && /[0-9.]/.test(trimmed[i])) {
        numStr += trimmed[i];
        i += 1;
      }
      const val = Number(numStr);
      if (!Number.isFinite(val)) return null;
      tokens.push(val);
    }
  }

  if (tokens.length === 0 || typeof tokens[0] !== 'number') return null;

  // Pass 1: * and /
  const pass1 = [tokens[0]];
  for (let idx = 1; idx < tokens.length; idx += 2) {
    const op = tokens[idx];
    const rhs = tokens[idx + 1];
    if (typeof rhs !== 'number') break;
    if (op === '*') {
      pass1[pass1.length - 1] = pass1[pass1.length - 1] * rhs;
    } else if (op === '/') {
      if (rhs === 0) return null;
      pass1[pass1.length - 1] = pass1[pass1.length - 1] / rhs;
    } else {
      pass1.push(op, rhs);
    }
  }

  // Pass 2: + and -
  let total = pass1[0];
  for (let idx = 1; idx < pass1.length; idx += 2) {
    const op = pass1[idx];
    const rhs = pass1[idx + 1];
    if (typeof rhs !== 'number') break;
    if (op === '+') total += rhs;
    else if (op === '-') total -= rhs;
  }

  if (!Number.isFinite(total)) return null;
  return Math.round(total * 100) / 100;
}

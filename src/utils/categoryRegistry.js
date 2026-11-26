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
    barColor: '#2878C8',
  },
  {
    key: 'housing',
    type: 'expense',
    iconName: 'building',
    icon: Building2,
    label: { th: 'ที่พัก & สาธารณูปโภค', en: 'Housing & Bills' },
    barColor: '#142B4A',
  },
  {
    key: 'transport',
    type: 'expense',
    iconName: 'train',
    icon: TrainFront,
    label: { th: 'เดินทาง / BTS', en: 'Transport / BTS' },
    barColor: '#22B8A7',
  },
  {
    key: 'lifestyle',
    type: 'expense',
    iconName: 'shopping-bag',
    icon: ShoppingBag,
    label: { th: 'ไลฟ์สไตล์', en: 'Lifestyle' },
    barColor: '#6388C6',
  },
  {
    key: 'saving',
    type: 'saving',
    iconName: 'piggy-bank',
    icon: PiggyBank,
    label: { th: 'เงินออมฉุกเฉิน', en: 'Emergency Fund' },
    barColor: '#22B8A7',
  },
  {
    key: 'salary',
    type: 'income',
    iconName: 'wallet',
    icon: Wallet,
    label: { th: 'เงินเดือน / รายได้เสริม', en: 'Salary & Income' },
    barColor: '#31A879',
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

export const CUSTOM_COLOR_OPTIONS = [
  { id: 'royal', hex: '#2878C8', bg: 'rgba(40, 120, 200, 0.13)', label: { th: 'น้ำเงิน', en: 'Royal Blue' } },
  { id: 'teal', hex: '#22B8A7', bg: 'rgba(34, 184, 167, 0.14)', label: { th: 'เขียวมิ้นต์', en: 'Teal' } },
  { id: 'coral', hex: '#D95353', bg: 'rgba(217, 83, 83, 0.13)', label: { th: 'แดงคอรัล', en: 'Coral Red' } },
  { id: 'amber', hex: '#D98A16', bg: 'rgba(217, 138, 22, 0.14)', label: { th: 'เหลืองอำพัน', en: 'Amber' } },
  { id: 'violet', hex: '#7C5CE0', bg: 'rgba(124, 92, 224, 0.14)', label: { th: 'ม่วง', en: 'Violet' } },
  { id: 'navy', hex: '#3B5984', bg: 'rgba(59, 89, 132, 0.14)', label: { th: 'กรมท่า', en: 'Slate Navy' } },
];

export function getCustomColorMeta(hex) {
  return CUSTOM_COLOR_OPTIONS.find((c) => c.hex === hex) || CUSTOM_COLOR_OPTIONS[0];
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

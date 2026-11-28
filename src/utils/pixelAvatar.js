export const AVATAR_STORAGE_KEY = 'protect360_avatar_v1';

export const DEFAULT_AVATAR_CONFIG = {
  gender: 'neutral', // 'neutral' | 'masculine' | 'feminine'
  skinTone: 'warm', // 'fair' | 'warm' | 'honey' | 'tan' | 'deep'
  hairStyle: 'short', // 'short' | 'bob' | 'ponytail' | 'curly'
  hairColor: 'espresso', // 'espresso' | 'chestnut' | 'navy' | 'caramel' | 'ash'
};

export const GENDER_OPTIONS = [
  { id: 'neutral', th: 'กลาง', en: 'Neutral' },
  { id: 'masculine', th: 'ชาย', en: 'Male' },
  { id: 'feminine', th: 'หญิง', en: 'Female' },
];

export const SKIN_PALETTES = {
  fair: { id: 'fair', base: '#FFE0C8', shade: '#F2BFA0', blush: '#F4978E', th: 'สว่างอมชมพู', en: 'Fair' },
  warm: { id: 'warm', base: '#FAD2AE', shade: '#E4AF84', blush: '#EE8F7E', th: 'ขาวเหลือง', en: 'Warm' },
  honey: { id: 'honey', base: '#EEB986', shade: '#D29460', blush: '#DC7B6A', th: 'น้ำผึ้ง', en: 'Honey' },
  tan: { id: 'tan', base: '#CE8F5D', shade: '#AA6C3F', blush: '#BE6455', th: 'แทน', en: 'Tan' },
  deep: { id: 'deep', base: '#9A623C', shade: '#784727', blush: '#9C4D46', th: 'เข้ม', en: 'Deep' },
};

export const HAIR_STYLE_OPTIONS = [
  { id: 'short', th: 'สั้น', en: 'Short' },
  { id: 'bob', th: 'บ็อบ', en: 'Bob' },
  { id: 'ponytail', th: 'หางม้า', en: 'Ponytail' },
  { id: 'curly', th: 'ลอนฟู', en: 'Curly' },
];

export const HAIR_PALETTES = {
  espresso: { id: 'espresso', base: '#2D2424', shine: '#4A3C3C', th: 'ดำน้ำตาล', en: 'Espresso' },
  chestnut: { id: 'chestnut', base: '#6B3E26', shine: '#8F5738', th: 'น้ำตาลเข้ม', en: 'Chestnut' },
  navy: { id: 'navy', base: '#1E3A5F', shine: '#356099', th: 'กรมท่า P360', en: 'P360 Navy' },
  caramel: { id: 'caramel', base: '#B57B45', shine: '#D49A60', th: 'คาราเมล', en: 'Caramel' },
  ash: { id: 'ash', base: '#64748B', shine: '#94A3B8', th: 'เทาหม่น', en: 'Ash Slate' },
};

export function loadSavedAvatarConfig() {
  if (typeof window === 'undefined') return { ...DEFAULT_AVATAR_CONFIG };
  try {
    const raw = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_AVATAR_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      gender: ['neutral', 'masculine', 'feminine'].includes(parsed?.gender)
        ? parsed.gender
        : DEFAULT_AVATAR_CONFIG.gender,
      skinTone: SKIN_PALETTES[parsed?.skinTone] ? parsed.skinTone : DEFAULT_AVATAR_CONFIG.skinTone,
      hairStyle: HAIR_STYLE_OPTIONS.some((h) => h.id === parsed?.hairStyle)
        ? parsed.hairStyle
        : DEFAULT_AVATAR_CONFIG.hairStyle,
      hairColor: HAIR_PALETTES[parsed?.hairColor] ? parsed.hairColor : DEFAULT_AVATAR_CONFIG.hairColor,
    };
  } catch {
    return { ...DEFAULT_AVATAR_CONFIG };
  }
}

export function saveAvatarConfig(cfg) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // Ignore storage quota errors
  }
}

export function deriveAvatarSceneAndState({
  event = null,
  lastTurnResult = null,
  cash = 15000,
  debt = 0,
  peace = 70,
  monthlyExpenses = 20000,
  injuryType = 'none',
  injuryTurnsLeft = 0,
  phase = 'playing',
  isResilient = true,
}) {
  let wealthTier = 'steady';
  if (phase === 'results') {
    wealthTier = isResilient && cash >= monthlyExpenses ? 'prosperous' : debt > 0 ? 'struggling' : 'steady';
  } else if (debt > 0 || cash < Math.max(2000, monthlyExpenses * 0.35) || peace < 42) {
    wealthTier = 'struggling';
  } else if (debt === 0 && cash >= monthlyExpenses * 3) {
    wealthTier = 'prosperous';
  }

  let sceneType = 'office_room';
  const cat = event?.category || lastTurnResult?.eventCategory || '';
  if (phase === 'results') {
    sceneType = isResilient ? 'celebration' : 'rainy_street';
  } else if (cat === 'medical' || cat === 'accident') {
    sceneType = 'hospital';
  } else if (cat === 'income' || (debt > 0 && cat !== 'windfall' && cat !== 'lifestyle')) {
    sceneType = 'rainy_street';
  } else if (cat === 'lifestyle') {
    sceneType = 'cafe_mall';
  } else if (cat === 'windfall') {
    sceneType = 'celebration';
  }

  let activeInjury = injuryTurnsLeft > 0 ? injuryType : 'none';
  if (phase === 'playing' && activeInjury === 'none') {
    if (event?.id?.includes('fracture') || event?.id?.includes('sprain')) {
      activeInjury = 'leg_cast';
    } else if (event?.id?.includes('accident')) {
      activeInjury = 'arm_cast';
    } else if (cat === 'medical') {
      activeInjury = 'medical_mask';
    } else if (cat === 'windfall') {
      activeInjury = 'windfall';
    }
  } else if (phase === 'results' && isResilient) {
    activeInjury = 'windfall';
  }

  return { wealthTier, sceneType, injury: activeInjury };
}

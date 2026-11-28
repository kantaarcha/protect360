export const AVATAR_STORAGE_KEY = 'protect360_avatar_v1';

export const DEFAULT_AVATAR_CONFIG = {
  gender: 'neutral', // 'neutral' | 'masculine' | 'feminine'
  skinTone: 'warm', // 'fair' | 'warm' | 'honey' | 'tan' | 'deep'
  hairStyle: 'short', // 'short' | 'bob' | 'ponytail' | 'curly'
  hairColor: 'espresso', // 'espresso' | 'chestnut' | 'navy' | 'caramel' | 'ash'
  outfitColor: 'royal', // 'royal' | 'teal' | 'plum' | 'graphite' | 'sand'
  accessory: 'none', // 'none' | 'glasses' | 'headphones' | 'cap'
  roomTheme: 'sky', // 'sky' | 'midnight' | 'christmas' | 'halloween' | 'songkran' | 'valentine' | 'chinese_new_year'
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

export const ACCESSORY_OPTIONS = [
  { id: 'none', th: 'ไม่ใส่เพิ่ม', en: 'None' },
  { id: 'glasses', th: 'แว่นตา', en: 'Glasses' },
  { id: 'headphones', th: 'หูฟัง', en: 'Headset' },
  { id: 'cap', th: 'หมวกแก๊ป', en: 'Cap' },
];

export const OUTFIT_PALETTES = {
  royal: {
    id: 'royal',
    swatch: '#2563EB',
    shirt: '#2563EB',
    shirtShade: '#1D4ED8',
    collar: '#DBEAFE',
    suit: '#142B4A',
    suitShade: '#0C1C33',
    tie: '#14B8A6',
    pants: '#1E3A5F',
    th: 'น้ำเงิน P360',
    en: 'P360 Royal',
  },
  teal: {
    id: 'teal',
    swatch: '#0D9488',
    shirt: '#0D9488',
    shirtShade: '#0F766E',
    collar: '#CCFBF1',
    suit: '#134E4A',
    suitShade: '#0B3532',
    tie: '#FACC15',
    pants: '#1E3A5F',
    th: 'เขียวมรกต',
    en: 'Emerald Teal',
  },
  plum: {
    id: 'plum',
    swatch: '#4F46E5',
    shirt: '#6366F1',
    shirtShade: '#4F46E5',
    collar: '#E0E7FF',
    suit: '#312E81',
    suitShade: '#1E1B4B',
    tie: '#38BDF8',
    pants: '#1E293B',
    th: 'คราม Indigo',
    en: 'Indigo Plum',
  },
  graphite: {
    id: 'graphite',
    swatch: '#334155',
    shirt: '#475569',
    shirtShade: '#334155',
    collar: '#E2E8F0',
    suit: '#1E293B',
    suitShade: '#0F172A',
    tie: '#22D3EE',
    pants: '#0F172A',
    th: 'กราไฟต์',
    en: 'Graphite',
  },
  sand: {
    id: 'sand',
    swatch: '#A16207',
    shirt: '#B45309',
    shirtShade: '#92400E',
    collar: '#FEF3C7',
    suit: '#5C4033',
    suitShade: '#3E2A21',
    tie: '#FDE047',
    pants: '#292524',
    th: 'เอิร์ธโทน',
    en: 'Warm Earth',
  },
};

export const ROOM_THEMES = {
  sky: {
    id: 'sky',
    swatch: '#93C5FD',
    wall: '#F1F6FC',
    floor: '#E2EBF6',
    trim: '#CBD8EA',
    windowBg: '#CFE6FF',
    desk: '#8B6240',
    deskTop: '#6A472B',
    plant: '#10B981',
    lamp: false,
    th: 'ฟ้าโปร่ง P360',
    en: 'Sky Studio',
  },
  midnight: {
    id: 'midnight',
    swatch: '#1E293B',
    wall: '#1E293B',
    floor: '#0F172A',
    trim: '#334155',
    windowBg: '#0B1324',
    desk: '#475569',
    deskTop: '#334155',
    plant: '#34D399',
    lamp: true,
    th: 'เนวีกลางคืน',
    en: 'Midnight Desk',
  },
  christmas: {
    id: 'christmas',
    swatch: '#16A34A',
    wall: '#F0FDF4',
    floor: '#E2E8F0',
    trim: '#BBF7D0',
    windowBg: '#1E3A8A',
    desk: '#7C4D2B',
    deskTop: '#5B371E',
    plant: '#16A34A',
    lamp: false,
    th: 'คริสต์มาส',
    en: 'Christmas',
  },
  halloween: {
    id: 'halloween',
    swatch: '#7C3AED',
    wall: '#2E1A47',
    floor: '#1E1B3A',
    trim: '#4C1D95',
    windowBg: '#140B29',
    desk: '#58315A',
    deskTop: '#3B1D3D',
    plant: '#F97316',
    lamp: true,
    th: 'ฮาโลวีน',
    en: 'Halloween',
  },
  songkran: {
    id: 'songkran',
    swatch: '#06B6D4',
    wall: '#ECFEFF',
    floor: '#E0F2FE',
    trim: '#A5F3FC',
    windowBg: '#38BDF8',
    desk: '#9A6B42',
    deskTop: '#78502E',
    plant: '#14B8A6',
    lamp: false,
    th: 'สงกรานต์',
    en: 'Songkran',
  },
  valentine: {
    id: 'valentine',
    swatch: '#F472B6',
    wall: '#FFF1F2',
    floor: '#FFE4E6',
    trim: '#FECDD3',
    windowBg: '#FBCFE8',
    desk: '#9D6B6E',
    deskTop: '#7F5053',
    plant: '#EC4899',
    lamp: false,
    th: 'วาเลนไทน์',
    en: 'Valentine',
  },
  chinese_new_year: {
    id: 'chinese_new_year',
    swatch: '#DC2626',
    wall: '#FEF2F2',
    floor: '#FEE2E2',
    trim: '#FCA5A5',
    windowBg: '#991B1B',
    desk: '#7F1D1D',
    deskTop: '#5C1212',
    plant: '#F59E0B',
    lamp: false,
    th: 'ตรุษจีน',
    en: 'Chinese NY',
  },
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
      outfitColor: OUTFIT_PALETTES[parsed?.outfitColor]
        ? parsed.outfitColor
        : DEFAULT_AVATAR_CONFIG.outfitColor,
      accessory: ACCESSORY_OPTIONS.some((a) => a.id === parsed?.accessory)
        ? parsed.accessory
        : DEFAULT_AVATAR_CONFIG.accessory,
      roomTheme: ROOM_THEMES[parsed?.roomTheme] ? parsed.roomTheme : DEFAULT_AVATAR_CONFIG.roomTheme,
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

  // Expressive scene backdrop selector across 9 scenes matching specific events
  let sceneType = 'office_room';
  const cat = event?.category || lastTurnResult?.eventCategory || '';
  const evId = event?.id || lastTurnResult?.eventId || '';

  if (phase === 'results') {
    sceneType = isResilient ? 'celebration' : 'rainy_street';
  } else if (
    evId.includes('vehicle') ||
    evId.includes('tire') ||
    evId.includes('car-battery') ||
    evId.includes('moto-') ||
    evId === 'accident-100k'
  ) {
    sceneType = 'road_car';
  } else if (cat === 'medical' || cat === 'accident') {
    sceneType = 'hospital';
  } else if (
    evId.includes('concert') ||
    evId.includes('wedding') ||
    evId.includes('staycation') ||
    evId.includes('idol') ||
    evId.includes('bday') ||
    evId.includes('buffet') ||
    evId.includes('reunion') ||
    evId.includes('movie') ||
    evId.includes('festival') ||
    evId.includes('housewarm')
  ) {
    sceneType = 'party';
  } else if (
    evId.includes('laptop') ||
    evId.includes('screen-crack') ||
    evId.includes('gear-fix') ||
    evId.includes('game-console') ||
    evId.includes('course') ||
    evId.includes('earbuds') ||
    evId.includes('scam') ||
    evId.includes('router')
  ) {
    sceneType = 'cyber_desk';
  } else if (
    evId.includes('ac-repair') ||
    evId.includes('fridge') ||
    evId.includes('water-leak') ||
    evId.includes('fan-ac') ||
    evId.includes('locksmith') ||
    evId.includes('flood') ||
    evId.includes('utility')
  ) {
    sceneType = 'home_repair';
  } else if (cat === 'income' || (debt > 0 && cat !== 'windfall' && cat !== 'lifestyle')) {
    sceneType = 'rainy_street';
  } else if (cat === 'lifestyle') {
    sceneType = 'cafe_mall';
  } else if (cat === 'windfall') {
    sceneType = 'celebration';
  }

  let activeInjury = injuryTurnsLeft > 0 ? injuryType : 'none';
  if (phase === 'playing' && activeInjury === 'none') {
    if (evId.includes('fracture') || evId.includes('sprain') || evId.includes('ankle')) {
      activeInjury = 'leg_cast';
    } else if (cat === 'accident') {
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

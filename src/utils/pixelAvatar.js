export const AVATAR_STORAGE_KEY = 'protect360_avatar_v1';

export const DEFAULT_AVATAR_CONFIG = {
  gender: 'neutral', // 'neutral' | 'masculine' | 'feminine'
  skinTone: 'warm', // 'fair' | 'warm' | 'honey' | 'tan' | 'deep'
  hairStyle: 'short',
  hairColor: 'espresso',
  outfitColor: 'royal',
  accessories: [], // Multi-select array with overlap slot protection
  roomTheme: 'sky',
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
  { id: 'short', th: 'ผมสั้นคลาสสิก', en: 'Classic Short' },
  { id: 'bob', th: 'ผมบ็อบประบ่า', en: 'Cozy Bob' },
  { id: 'ponytail', th: 'มัดหางม้า', en: 'Ponytail' },
  { id: 'curly', th: 'ลอนฟูสไตล์อาร์ต', en: 'Fluffy Curly' },
  { id: 'spiky', th: 'ผมตั้งอนิเมะ', en: 'Anime Spiky' },
  { id: 'side_part', th: 'แสกข้างเนี้ยบ', en: 'Clean Side Part' },
  { id: 'twin_tails', th: 'มัดแกละคู่สุดคิวต์', en: 'Twin Tails' },
  { id: 'long_straight', th: 'ผมยาวตรงสลวย', en: 'Long Straight' },
  { id: 'bun', th: 'มวยผมดังโงะ', en: 'Top Bun' },
];

export const HAIR_PALETTES = {
  espresso: { id: 'espresso', base: '#2D2424', shine: '#4A3C3C', th: 'ดำน้ำตาล', en: 'Espresso' },
  chestnut: { id: 'chestnut', base: '#6B3E26', shine: '#8F5738', th: 'น้ำตาลเข้ม', en: 'Chestnut' },
  navy: { id: 'navy', base: '#1E3A5F', shine: '#356099', th: 'กรมท่า P360', en: 'P360 Navy' },
  caramel: { id: 'caramel', base: '#B57B45', shine: '#D49A60', th: 'คาราเมล', en: 'Caramel' },
  ash: { id: 'ash', base: '#64748B', shine: '#94A3B8', th: 'เทาหม่น', en: 'Ash Slate' },
  blossom: { id: 'blossom', base: '#C02674', shine: '#F472B6', th: 'ชมพูพาสเทล', en: 'Blossom Pink' },
  blonde: { id: 'blonde', base: '#D99B26', shine: '#FDE047', th: 'บลอนด์สว่าง', en: 'Warm Blonde' },
};

export const ACCESSORY_SLOTS = {
  eyes: { th: 'ดวงตา', en: 'Eyes' },
  ears: { th: 'หู & ศีรษะ', en: 'Ears & Band' },
  head: { th: 'หมวก & ศีรษะ', en: 'Headwear' },
  neck: { th: 'รอบคอ', en: 'Neck' },
  companion: { th: 'พกพา & คู่หู', en: 'Carry & Buddy' },
};

export const ACCESSORY_OPTIONS = [
  { id: 'glasses', slot: 'eyes', conflicts: [], th: 'แว่นตาใส', en: 'Classic Glasses' },
  { id: 'sunglasses', slot: 'eyes', conflicts: [], th: 'แว่นกันแดดเท่ ๆ', en: 'Cool Shades' },
  { id: 'cyber_visor', slot: 'eyes', conflicts: [], th: 'แว่นไซเบอร์นีออน', en: 'Cyber Visor' },

  {
    id: 'headphones',
    slot: 'ears',
    conflicts: ['cap', 'beanie', 'santa_hat', 'crown'],
    th: 'หูฟังเกมมิง',
    en: 'Gaming Headset',
  },
  { id: 'earrings', slot: 'ears', conflicts: [], th: 'ต่างหูเพชรวิบวับ', en: 'Sparkle Studs' },

  { id: 'cap', slot: 'head', conflicts: ['headphones'], th: 'หมวกแก๊ปสตรีท', en: 'Street Cap' },
  { id: 'beanie', slot: 'head', conflicts: ['headphones'], th: 'หมวกไหมพรม', en: 'Cozy Beanie' },
  { id: 'santa_hat', slot: 'head', conflicts: ['headphones'], th: 'หมวกซานต้า / ปาร์ตี้', en: 'Festive Hat' },
  { id: 'crown', slot: 'head', conflicts: ['headphones'], th: 'มงกุฎทอง', en: 'Golden Crown' },

  { id: 'scarf', slot: 'neck', conflicts: [], th: 'ผ้าพันคออบอุ่น', en: 'Warm Scarf' },
  { id: 'bowtie', slot: 'neck', conflicts: [], th: 'โบว์หูกระต่าย', en: 'Dapper Bowtie' },

  { id: 'backpack', slot: 'companion', conflicts: [], th: 'กระเป๋าเป้', en: 'Daypack' },
  { id: 'boba_tea', slot: 'companion', conflicts: [], th: 'ชานมไข่มุก', en: 'Boba Tea' },
  { id: 'mini_shiba', slot: 'companion', conflicts: [], th: 'น้องหมาชิบะคู่ใจ', en: 'Pocket Shiba' },
];

export const ACCESSORY_BY_ID = Object.fromEntries(ACCESSORY_OPTIONS.map((a) => [a.id, a]));

export function getAccessoryConflict(selectedList, candidateId) {
  const active = Array.isArray(selectedList) ? selectedList : [];
  if (active.includes(candidateId)) return null;
  const candidate = ACCESSORY_BY_ID[candidateId];
  if (!candidate) return { reasonTh: 'ไม่พบไอเทมนี้', reasonEn: 'Unavailable' };

  for (const equippedId of active) {
    const equipped = ACCESSORY_BY_ID[equippedId];
    if (!equipped) continue;
    if (equipped.slot === candidate.slot) {
      const slotMeta = ACCESSORY_SLOTS[candidate.slot];
      return {
        blockerId: equippedId,
        reasonTh: `ใส่ได้ 1 ชิ้นในช่อง${slotMeta?.th || candidate.slot} (ใส่${equipped.th}อยู่)`,
        reasonEn: `Slot ${slotMeta?.en || candidate.slot} occupied by ${equipped.en}`,
      };
    }
    if (
      (candidate.conflicts && candidate.conflicts.includes(equippedId)) ||
      (equipped.conflicts && equipped.conflicts.includes(candidateId))
    ) {
      return {
        blockerId: equippedId,
        reasonTh: `ใส่ทับกับ "${equipped.th}" ไม่ได้`,
        reasonEn: `Overlaps with "${equipped.en}"`,
      };
    }
  }
  return null;
}

export function sanitizeAccessories(list) {
  if (!Array.isArray(list)) return [];
  const next = [];
  for (const id of list) {
    if (!ACCESSORY_BY_ID[id] || next.includes(id)) continue;
    if (!getAccessoryConflict(next, id)) {
      next.push(id);
    }
  }
  return next;
}

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
    swatch: '#60A5FA',
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
  gaming_rgb: {
    id: 'gaming_rgb',
    swatch: '#A855F7',
    wall: '#18102D',
    floor: '#110A21',
    trim: '#3B1E6E',
    windowBg: '#0B0618',
    desk: '#312E81',
    deskTop: '#1E1B4B',
    plant: '#22D3EE',
    lamp: true,
    th: 'เกมมิ่ง RGB นีออน',
    en: 'Neon Gaming RGB',
  },
  sakura_spring: {
    id: 'sakura_spring',
    swatch: '#F9A8D4',
    wall: '#FFF5F9',
    floor: '#FCE7F3',
    trim: '#FBCFE8',
    windowBg: '#E0F2FE',
    desk: '#A47551',
    deskTop: '#7D5436',
    plant: '#EC4899',
    lamp: false,
    th: 'ฤดูใบไม้ผลิซากุระ',
    en: 'Sakura Spring',
  },
  cozy_cafe: {
    id: 'cozy_cafe',
    swatch: '#B45309',
    wall: '#FAF3E6',
    floor: '#EADBC8',
    trim: '#D6C0A1',
    windowBg: '#DBEAFE',
    desk: '#784E2C',
    deskTop: '#56361C',
    plant: '#15803D',
    lamp: true,
    th: 'มุมคาเฟ่ไม้มินิมอล',
    en: 'Warm Cozy Cafe',
  },
  beach_summer: {
    id: 'beach_summer',
    swatch: '#06B6D4',
    wall: '#ECFEFF',
    floor: '#FEF3C7',
    trim: '#A5F3FC',
    windowBg: '#38BDF8',
    desk: '#C28B56',
    deskTop: '#9A6838',
    plant: '#16A34A',
    lamp: false,
    th: 'บ้านพักริมทะเล',
    en: 'Beach Getaway',
  },
  space_observatory: {
    id: 'space_observatory',
    swatch: '#38BDF8',
    wall: '#0B1120',
    floor: '#111827',
    trim: '#1E3A8A',
    windowBg: '#030712',
    desk: '#334155',
    deskTop: '#1E293B',
    plant: '#38BDF8',
    lamp: true,
    th: 'หอดูดาวอวกาศ',
    en: 'Space Observatory',
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
    swatch: '#0EA5E9',
    wall: '#E0F7FF',
    floor: '#BAE6FD',
    trim: '#7DD3FC',
    windowBg: '#38BDF8',
    desk: '#9C6B3B',
    deskTop: '#784E28',
    plant: '#10B981',
    lamp: false,
    th: 'สงกรานต์',
    en: 'Songkran Festival',
  },
  valentine: {
    id: 'valentine',
    swatch: '#EC4899',
    wall: '#FFF1F5',
    floor: '#FFE4EC',
    trim: '#FBCFE8',
    windowBg: '#FDE8F0',
    desk: '#A86472',
    deskTop: '#824653',
    plant: '#F43F5E',
    lamp: false,
    th: 'วาเลนไทน์',
    en: 'Valentine',
  },
  chinese_new_year: {
    id: 'chinese_new_year',
    swatch: '#DC2626',
    wall: '#FEF2F2',
    floor: '#FECACA',
    trim: '#FCA5A5',
    windowBg: '#7F1D1D',
    desk: '#7F1D1D',
    deskTop: '#5C1111',
    plant: '#F59E0B',
    lamp: false,
    th: 'ตรุษจีน',
    en: 'Chinese New Year',
  },
};

export function loadSavedAvatarConfig() {
  try {
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return DEFAULT_AVATAR_CONFIG;
    const parsed = JSON.parse(raw);
    const mergedAcc = Array.isArray(parsed.accessories)
      ? parsed.accessories
      : parsed.accessory && parsed.accessory !== 'none'
        ? [parsed.accessory]
        : [];
    return {
      gender: GENDER_OPTIONS.some((g) => g.id === parsed.gender) ? parsed.gender : DEFAULT_AVATAR_CONFIG.gender,
      skinTone: SKIN_PALETTES[parsed.skinTone] ? parsed.skinTone : DEFAULT_AVATAR_CONFIG.skinTone,
      hairStyle: HAIR_STYLE_OPTIONS.some((h) => h.id === parsed.hairStyle)
        ? parsed.hairStyle
        : DEFAULT_AVATAR_CONFIG.hairStyle,
      hairColor: HAIR_PALETTES[parsed.hairColor] ? parsed.hairColor : DEFAULT_AVATAR_CONFIG.hairColor,
      outfitColor: OUTFIT_PALETTES[parsed.outfitColor] ? parsed.outfitColor : DEFAULT_AVATAR_CONFIG.outfitColor,
      accessories: sanitizeAccessories(mergedAcc),
      roomTheme: ROOM_THEMES[parsed.roomTheme] ? parsed.roomTheme : DEFAULT_AVATAR_CONFIG.roomTheme,
    };
  } catch {
    return DEFAULT_AVATAR_CONFIG;
  }
}

export function saveAvatarConfig(config) {
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

/**
 * Derive rich visual state (wealthTier, injury, and dynamic event sceneType across 14 bespoke backdrops).
 */
export function deriveAvatarSceneAndState({
  event,
  activeEvent,
  lastTurnResult,
  gameState,
  cash,
  debt,
  peace = 70,
  monthlyExpenses = 20000,
  injuryType,
  injuryTurnsLeft,
  phase,
  isResilient,
}) {
  const effectiveCash = Number(cash ?? gameState?.cash ?? 0);
  const effectiveDebt = Number(debt ?? gameState?.debt ?? 0);
  const effectiveMonthlyExp = Math.max(10000, Number(monthlyExpenses) || 20000);
  const effectiveInjType = injuryType ?? gameState?.injuryType ?? 'none';
  const effectiveInjTurns = Number(injuryTurnsLeft ?? gameState?.injuryTurnsLeft ?? 0);
  const ev = event || activeEvent || null;

  let wealthTier = 'steady';
  if (effectiveDebt > 0 || effectiveCash < 3000 || (phase === 'results' && !isResilient)) {
    wealthTier = 'struggling';
  } else if (
    (effectiveCash >= Math.max(30000, effectiveMonthlyExp * 2) && effectiveDebt === 0 && peace >= 65) ||
    (phase === 'results' && isResilient)
  ) {
    wealthTier = 'prosperous';
  }

  let injury = 'none';
  if (effectiveInjTurns > 0 && effectiveInjType && effectiveInjType !== 'none') {
    injury = effectiveInjType;
  }

  const eventCategory = ev?.category || lastTurnResult?.eventCategory || '';
  const eventId = ev?.id || lastTurnResult?.eventId || '';

  if (injury === 'none') {
    if (/accident|moto|ankle|burn|fracture|sprain/.test(eventId)) {
      injury = /ankle|slip|fracture|sprain/.test(eventId) ? 'leg_cast' : 'arm_cast';
    } else if (/medical|flu|dengue|appendic|kidney|pneu|allergy|poison|stomach|migraine|uti/.test(eventId)) {
      injury = 'medical_mask';
    } else if (eventCategory === 'windfall' || (lastTurnResult && lastTurnResult.netCashChange > 0 && lastTurnResult.netDebtChange <= 0)) {
      injury = 'windfall';
    }
  }

  let sceneType = 'office_room';

  if (phase === 'results') {
    sceneType = isResilient ? 'celebration' : 'rainy_street';
  } else if (lastTurnResult && lastTurnResult.netCashChange > 0 && lastTurnResult.netDebtChange <= 0) {
    sceneType = 'celebration';
  } else if (eventCategory === 'windfall') {
    sceneType = 'celebration';
  } else if (
    eventId === 'family-pet-2600' ||
    eventId === 'life-pet-groom' ||
    eventId === 'family-vet-4900' ||
    eventId === 'opd-rabies-1400'
  ) {
    sceneType = 'pet_care';
  } else if (eventId === 'life-game-console') {
    sceneType = 'gaming_room';
  } else if (
    eventId === 'phone-trip-9500' ||
    eventId === 'life-staycation' ||
    eventId === 'life-luggage' ||
    eventId === 'unpaid-leave-3200'
  ) {
    sceneType = 'beach_travel';
  } else if (
    eventId === 'life-gym-annual' ||
    eventId === 'life-shoes' ||
    eventId === 'opd-ear-1300' ||
    eventId === 'opd-physio-2200'
  ) {
    sceneType = 'gym_sport';
  } else if (
    eventId === 'life-buffet' ||
    eventId === 'life-reunion' ||
    eventId === 'life-movie-date'
  ) {
    sceneType = 'restaurant_feast';
  } else if (
    eventId === 'accident-100k' ||
    eventId === 'moto-crash-98k' ||
    eventId === 'vehicle-prb-1800' ||
    eventId === 'exp-tire' ||
    eventId === 'exp-moto-brake' ||
    eventId === 'car-battery-4600' ||
    eventId === 'exp-shipping-dmg' ||
    eventId === 'exp-cloud-doc'
  ) {
    sceneType = 'road_car';
  } else if (
    eventId === 'concert-6500' ||
    eventId === 'social-wedding-3200' ||
    eventId === 'life-idol-merch' ||
    eventId === 'life-bday-pool' ||
    eventId === 'life-festival'
  ) {
    sceneType = 'party';
  } else if (
    eventId === 'gear-fix-2200' ||
    eventId === 'laptop-repair-6500' ||
    eventId === 'opd-eye-2400' ||
    eventId === 'exp-router' ||
    eventId === 'exp-phone-bat' ||
    eventId === 'exp-scam-fee' ||
    eventId === 'screen-crack-6200' ||
    eventId === 'exp-tax-gap' ||
    eventId === 'life-earbuds' ||
    eventId === 'life-course'
  ) {
    sceneType = 'cyber_desk';
  } else if (
    eventId === 'utility-surge-1600' ||
    eventId === 'ac-repair-4800' ||
    eventId === 'exp-water-leak' ||
    eventId === 'exp-locksmith' ||
    eventId === 'exp-pest' ||
    eventId === 'exp-home-aid' ||
    eventId === 'exp-key-deposit' ||
    eventId === 'exp-air-filter' ||
    eventId === 'exp-fan-ac-clean' ||
    eventId === 'fridge-fix-5200' ||
    eventId === 'flood-room-5900' ||
    eventId === 'life-housewarm' ||
    eventId === 'life-desk-lamp' ||
    eventId === 'life-chair-upgrade' ||
    eventId === 'life-baking-hobby'
  ) {
    sceneType = 'home_repair';
  } else if (
    eventId === 'slip-fracture-100k' ||
    eventId === 'minor-sprain-2800' ||
    eventId === 'exp-rain-gear' ||
    eventId === 'exp-laundry-dryer' ||
    eventCategory === 'income'
  ) {
    sceneType = 'rainy_street';
  } else if (eventCategory === 'medical' || eventCategory === 'accident') {
    sceneType = 'hospital';
  } else if (eventCategory === 'lifestyle') {
    sceneType = 'cafe_mall';
  } else if (eventCategory === 'expense') {
    sceneType = 'home_repair';
  } else if (wealthTier === 'struggling') {
    sceneType = 'rainy_street';
  }

  return { sceneType, wealthTier, injury };
}

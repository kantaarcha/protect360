export const TITLE_OPTIONS = [
  { value: 'นาย', th: 'นาย', en: 'Mr.', zh: '先生' },
  { value: 'นาง', th: 'นาง', en: 'Mrs.', zh: '女士' },
  { value: 'นางสาว', th: 'นางสาว', en: 'Ms.', zh: '小姐' },
  { value: '', th: 'ไม่ระบุ', en: 'Unspecified', zh: '不指定' },
];

export const OCCUPATION_OPTIONS = [
  { id: 'office_worker', th: 'พนักงานออฟฟิศ', en: 'Office Worker', zh: '上班族' },
  { id: 'freelancer', th: 'ฟรีแลนซ์', en: 'Freelancer', zh: '自由职业' },
  { id: 'business_owner', th: 'เจ้าของกิจการ', en: 'Business Owner', zh: '企业主' },
  { id: 'fresh_grad', th: 'นักศึกษาจบใหม่', en: 'Fresh Graduate', zh: '应届毕业生' },
];

export const DEFAULT_OCCUPATION_TH = 'พนักงานออฟฟิศ';

export function normalizeTitle(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const match = TITLE_OPTIONS.find(
    (opt) =>
      opt.value === trimmed ||
      opt.th === trimmed ||
      opt.en.toLowerCase() === trimmed.toLowerCase() ||
      opt.zh === trimmed
  );
  return match ? match.value : '';
}

export function getTitleLabel(title, lang = 'TH') {
  const normalized = normalizeTitle(title);
  if (!normalized) return '';
  const match = TITLE_OPTIONS.find((opt) => opt.value === normalized);
  if (!match) return '';
  if (lang === 'EN') return match.en;
  if (lang === 'ZH') return match.zh;
  return match.th;
}

export function normalizeOccupation(value) {
  if (typeof value !== 'string') return DEFAULT_OCCUPATION_TH;
  const trimmed = value.trim();
  const match = OCCUPATION_OPTIONS.find(
    (opt) =>
      opt.th === trimmed ||
      opt.en.toLowerCase() === trimmed.toLowerCase() ||
      opt.zh === trimmed ||
      opt.id === trimmed.toLowerCase()
  );
  return match ? match.th : DEFAULT_OCCUPATION_TH;
}

export function getOccupationLabel(occupation, lang = 'TH') {
  const normalized = normalizeOccupation(occupation);
  const match = OCCUPATION_OPTIONS.find((opt) => opt.th === normalized);
  if (!match) {
    if (lang === 'EN') return 'Office Worker';
    if (lang === 'ZH') return '上班族';
    return DEFAULT_OCCUPATION_TH;
  }
  if (lang === 'EN') return match.en;
  if (lang === 'ZH') return match.zh;
  return match.th;
}

function isLatinName(text) {
  return /^[A-Za-z0-9\s.'-]+$/.test(String(text || '').trim());
}

function extractLeadingInitial(text) {
  const cleaned = String(text || '').trim();
  if (!cleaned) return '';

  // For Thai text, prefer the first base consonant (ก-ฮ) so leading vowels like เ/แ/โ don't sit alone in an avatar
  const thaiConsonant = cleaned.match(/[ก-ฮ]/);
  if (thaiConsonant && /[\u0E00-\u0E7F]/.test(cleaned[0])) {
    return thaiConsonant[0];
  }

  // Otherwise take first visible character (uppercased for Latin)
  const chars = Array.from(cleaned);
  return (chars[0] || '').toUpperCase();
}

export function getUserInitials(firstName, lastName) {
  const f = String(firstName || '').trim();
  const l = String(lastName || '').trim();
  if (!f && !l) return 'FJ';

  const firstInit = extractLeadingInitial(f);
  const lastInit = extractLeadingInitial(l);

  // If Thai or CJK name, a single crisp character looks cleanest inside a compact circle
  if (firstInit && (/[\u0E00-\u0E7F]/.test(firstInit) || /[\u4E00-\u9FFF]/.test(firstInit))) {
    return firstInit;
  }

  return `${firstInit}${lastInit}`.slice(0, 2) || 'FJ';
}

export function getFullName(userProfile) {
  const first = String(userProfile?.firstName || '').trim();
  const last = String(userProfile?.lastName || '').trim();
  return [first, last].filter(Boolean).join(' ');
}

export function formatNameWithTitle(userProfile, lang = 'TH') {
  const fullName = getFullName(userProfile);
  if (!fullName) return '';

  const normalizedTitle = normalizeTitle(userProfile?.title);
  if (!normalizedTitle) return fullName;

  if (lang === 'ZH') {
    const zhSuffix = getTitleLabel(normalizedTitle, 'ZH');
    return zhSuffix ? `${fullName}${zhSuffix}` : fullName;
  }

  // Match prefix script naturally to language / name script
  const useEnglishPrefix = lang === 'EN' || isLatinName(fullName);
  const prefix = getTitleLabel(normalizedTitle, useEnglishPrefix ? 'EN' : 'TH');
  if (!prefix) return fullName;

  // Thai prefixes attach directly to Thai names (e.g. นายกันต์ อาชา); English prefixes use a space
  return useEnglishPrefix ? `${prefix} ${fullName}` : `${prefix}${fullName}`;
}

/**
 * Resolve 24-hour time-of-day salutation:
 * - 05:00–11:59 => เช้า (Morning)
 * - 12:00–15:59 => บ่าย (Afternoon)
 * - 16:00–18:59 => เย็น (Late Afternoon / Early Evening)
 * - 19:00–04:59 => ค่ำ (Night / Evening)
 */
export function getTimeOfDayGreeting(lang = 'TH', dateOrHour = new Date()) {
  const hour =
    typeof dateOrHour === 'number' && Number.isFinite(dateOrHour)
      ? ((Math.floor(dateOrHour) % 24) + 24) % 24
      : (dateOrHour instanceof Date ? dateOrHour : new Date()).getHours();

  let bucket = 'night';
  if (hour >= 5 && hour < 12) {
    bucket = 'morning';
  } else if (hour >= 12 && hour < 16) {
    bucket = 'afternoon';
  } else if (hour >= 16 && hour < 19) {
    bucket = 'evening';
  }

  if (lang === 'EN') {
    if (bucket === 'morning') return 'Good morning';
    if (bucket === 'afternoon') return 'Good afternoon';
    return 'Good evening';
  }

  if (lang === 'ZH') {
    if (bucket === 'morning') return '早上好';
    if (bucket === 'afternoon') return '下午好';
    if (bucket === 'evening') return '傍晚好';
    return '晚上好';
  }

  if (bucket === 'morning') return 'สวัสดีตอนเช้า';
  if (bucket === 'afternoon') return 'สวัสดีตอนบ่าย';
  if (bucket === 'evening') return 'สวัสดีตอนเย็น';
  return 'สวัสดีตอนค่ำ';
}

/**
 * Optionally cross-checks current local hour from a public internet time service
 * (WorldTimeAPI) with a strict short timeout; gracefully falls back to the user's
 * local device 24-hour clock when offline or restricted.
 */
export async function syncReferenceHour() {
  const localNow = new Date();
  const localHour = localNow.getHours();
  if (typeof fetch !== 'function' || typeof AbortController === 'undefined') {
    return { hour: localHour, source: 'device' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2200);
  try {
    const res = await fetch('https://worldtimeapi.org/api/ip', {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return { hour: localHour, source: 'device' };
    const data = await res.json();
    const match = typeof data?.datetime === 'string' ? data.datetime.match(/T(\d{2}):/) : null;
    if (match) {
      const internetHour = Number(match[1]);
      if (Number.isInteger(internetHour) && internetHour >= 0 && internetHour <= 23) {
        return { hour: internetHour, source: 'internet' };
      }
    }
    return { hour: localHour, source: 'device' };
  } catch {
    return { hour: localHour, source: 'device' };
  } finally {
    clearTimeout(timer);
  }
}

export function getGreetingText(userProfile, lang = 'TH', dateOrHour = new Date()) {
  const salutation = getTimeOfDayGreeting(lang, dateOrHour);
  const fullName = getFullName(userProfile);

  if (!fullName) {
    if (lang === 'ZH') return `${salutation}，First Jobber`;
    return `${salutation}, First Jobber`;
  }

  const normalizedTitle = normalizeTitle(userProfile?.title);
  if (normalizedTitle) {
    const withTitle = formatNameWithTitle(userProfile, lang);
    if (lang === 'ZH') return `${salutation}，${withTitle}`;
    return `${salutation}, ${withTitle}`;
  }

  if (lang === 'TH') {
    return isLatinName(fullName)
      ? `${salutation}, คุณ ${fullName}`
      : `${salutation}, คุณ${fullName}`;
  }
  if (lang === 'ZH') {
    return `${salutation}，${fullName}`;
  }
  return `${salutation}, ${fullName}`;
}

export function getProfilePillLabel(userProfile, lang = 'TH') {
  const first = String(userProfile?.firstName || '').trim();
  if (!first) return 'First Jobber';

  const normalizedTitle = normalizeTitle(userProfile?.title);
  if (normalizedTitle) {
    if (lang === 'ZH') {
      const suffix = getTitleLabel(normalizedTitle, 'ZH');
      return suffix ? `${first}${suffix}` : first;
    }
    const useEnglishPrefix = lang === 'EN' || isLatinName(first);
    const prefix = getTitleLabel(normalizedTitle, useEnglishPrefix ? 'EN' : 'TH');
    return useEnglishPrefix ? `${prefix} ${first}` : `${prefix}${first}`;
  }

  if (lang === 'TH') {
    return isLatinName(first) ? `คุณ ${first}` : `คุณ${first}`;
  }
  return first;
}

export function getCardHolderDisplay(userProfile) {
  const fullName = getFullName(userProfile);
  if (!fullName) return 'FIRST JOBBER';

  const normalizedTitle = normalizeTitle(userProfile?.title);
  if (isLatinName(fullName)) {
    const enPrefix = getTitleLabel(normalizedTitle, 'EN');
    return (enPrefix ? `${enPrefix} ${fullName}` : fullName).toUpperCase();
  }

  const thPrefix = getTitleLabel(normalizedTitle, 'TH');
  return thPrefix ? `${thPrefix}${fullName}` : fullName;
}

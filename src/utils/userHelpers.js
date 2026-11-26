export const OCCUPATION_OPTIONS = [
  { id: 'office_worker', th: 'พนักงานออฟฟิศ', en: 'Office Worker' },
  { id: 'freelancer', th: 'ฟรีแลนซ์', en: 'Freelancer' },
  { id: 'business_owner', th: 'เจ้าของกิจการ', en: 'Business Owner' },
  { id: 'fresh_grad', th: 'นักศึกษาจบใหม่', en: 'Fresh Graduate' },
];

export const DEFAULT_OCCUPATION_TH = 'พนักงานออฟฟิศ';

export function normalizeOccupation(value) {
  if (typeof value !== 'string') return DEFAULT_OCCUPATION_TH;
  const trimmed = value.trim();
  const match = OCCUPATION_OPTIONS.find(
    (opt) =>
      opt.th === trimmed ||
      opt.en.toLowerCase() === trimmed.toLowerCase() ||
      opt.id === trimmed.toLowerCase()
  );
  return match ? match.th : DEFAULT_OCCUPATION_TH;
}

export function getOccupationLabel(occupation, lang = 'TH') {
  const normalized = normalizeOccupation(occupation);
  const match = OCCUPATION_OPTIONS.find((opt) => opt.th === normalized);
  if (!match) return lang === 'EN' ? 'Office Worker' : DEFAULT_OCCUPATION_TH;
  return lang === 'EN' ? match.en : match.th;
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

  // If Thai name, a single crisp consonant looks cleanest inside a compact circle
  if (firstInit && /[\u0E00-\u0E7F]/.test(firstInit)) {
    return firstInit;
  }

  return `${firstInit}${lastInit}`.slice(0, 2) || 'FJ';
}

export function getFullName(userProfile) {
  const first = String(userProfile?.firstName || '').trim();
  const last = String(userProfile?.lastName || '').trim();
  return [first, last].filter(Boolean).join(' ');
}

export function getGreetingText(userProfile, lang = 'TH') {
  const fullName = getFullName(userProfile);
  if (!fullName) {
    return lang === 'TH' ? 'สวัสดี, First Jobber' : 'Hello, First Jobber';
  }
  return lang === 'TH' ? `สวัสดี, คุณ${fullName}` : `Hello, ${fullName}`;
}

export function getProfilePillLabel(userProfile, lang = 'TH') {
  const first = String(userProfile?.firstName || '').trim();
  if (!first) return 'First Jobber';
  return lang === 'TH' ? `คุณ${first}` : first;
}

export function getCardHolderDisplay(userProfile) {
  const fullName = getFullName(userProfile);
  if (!fullName) return 'FIRST JOBBER';
  // Uppercase Latin names like a bank/insurance card; keep Thai script crisp as entered
  if (/^[A-Za-z0-9\s.'-]+$/.test(fullName)) {
    return fullName.toUpperCase();
  }
  return fullName;
}

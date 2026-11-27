// Instant offline TH <-> EN personal finance dictionary + non-blocking async translation helper

const THAI_CHAR_REGEX = /[\u0E00-\u0E7F]/;
const LATIN_CHAR_REGEX = /[A-Za-z]/;

// Curated TH -> EN dictionary for instant 0ms translation of common Thai daily entries & categories
const TH_TO_EN_PHRASES = [
  // Food & Drinks
  ['ข้าวมันไก่', 'Hainanese Chicken Rice'],
  ['ข้าวขาหมู', 'Braised Pork Leg Rice'],
  ['ข้าวหมูแดง', 'BBQ Pork Rice'],
  ['ข้าวหมูกรอบ', 'Crispy Pork Rice'],
  ['ข้าวผัดกะเพรา', 'Basil Stir-Fry Rice'],
  ['ผัดกะเพรา', 'Basil Stir-Fry'],
  ['กะเพรา', 'Basil Stir-Fry'],
  ['ข้าวผัด', 'Fried Rice'],
  ['ข้าวไข่เจียว', 'Omelette Rice'],
  ['ข้าวต้ม', 'Rice Soup'],
  ['โจ๊ก', 'Congee'],
  ['ก๋วยเตี๋ยว', 'Noodles'],
  ['บะหมี่', 'Egg Noodles'],
  ['ผัดไทย', 'Pad Thai'],
  ['ผัดซีอิ๊ว', 'Pad See Ew'],
  ['ราดหน้า', 'Noodles in Gravy'],
  ['ส้มตำ', 'Papaya Salad'],
  ['ไก่ทอด', 'Fried Chicken'],
  ['ไก่ย่าง', 'Grilled Chicken'],
  ['หมูปิ้ง', 'Grilled Pork Skewers'],
  ['ข้าวเหนียวหมูปิ้ง', 'Sticky Rice & Grilled Pork'],
  ['ชาบู', 'Shabu Hotpot'],
  ['สุกี้', 'Sukiyaki'],
  ['หมูกระทะ', 'Thai BBQ'],
  ['บุฟเฟ่ต์', 'Buffet'],
  ['ซูชิ', 'Sushi'],
  ['ราเมง', 'Ramen'],
  ['พิซซ่า', 'Pizza'],
  ['เบอร์เกอร์', 'Burger'],
  ['สเต็ก', 'Steak'],
  ['สลัด', 'Salad'],
  ['ชานมไข่มุก', 'Bubble Tea'],
  ['ชานม', 'Milk Tea'],
  ['ชาไทย', 'Thai Iced Tea'],
  ['ชาเขียว', 'Matcha / Green Tea'],
  ['กาแฟเย็น', 'Iced Coffee'],
  ['กาแฟร้อน', 'Hot Coffee'],
  ['อเมริกาโน่', 'Americano'],
  ['ลาเต้', 'Latte'],
  ['คาปูชิโน่', 'Cappuccino'],
  ['กาแฟ', 'Coffee'],
  ['น้ำเปล่า', 'Drinking Water'],
  ['น้ำดื่ม', 'Drinking Water'],
  ['น้ำอัดลม', 'Soft Drink'],
  ['น้ำผลไม้', 'Fruit Juice'],
  ['เครื่องดื่ม', 'Drinks'],
  ['เบเกอรี่', 'Bakery'],
  ['ขนมปัง', 'Bread'],
  ['เค้ก', 'Cake'],
  ['ไอศกรีม', 'Ice Cream'],
  ['ขนม', 'Snacks'],
  ['ผลไม้', 'Fruits'],
  ['อาหารเช้า', 'Breakfast'],
  ['ข้าวเช้า', 'Breakfast'],
  ['อาหารกลางวัน', 'Lunch'],
  ['ข้าวเที่ยง', 'Lunch'],
  ['อาหารเย็น', 'Dinner'],
  ['ข้าวเย็น', 'Dinner'],
  ['มื้อเย็น', 'Dinner'],
  ['มื้อเที่ยง', 'Lunch'],
  ['มื้อเช้า', 'Breakfast'],
  ['อาหาร', 'Food'],
  ['กับข้าว', 'Meals'],
  ['เซเว่น', '7-Eleven'],
  ['คาเฟ่', 'Cafe'],

  // Housing & Utilities
  ['ค่าเช่าคอนโด', 'Condo Rent'],
  ['ค่าเช่าหอพัก', 'Dorm Rent'],
  ['ค่าเช่าหอ', 'Dorm Rent'],
  ['ค่าเช่าห้อง', 'Room Rent'],
  ['ค่าเช่าบ้าน', 'House Rent'],
  ['ค่าเช่า', 'Rent'],
  ['ค่าส่วนกลาง', 'Common Area Fee'],
  ['ค่าไฟฟ้า', 'Electricity Bill'],
  ['ค่าไฟ', 'Electricity Bill'],
  ['ค่าน้ำประปา', 'Water Bill'],
  ['ค่าน้ำ', 'Water Bill'],
  ['ค่าน้ำค่าไฟ', 'Water & Electricity Bills'],
  ['ค่าอินเทอร์เน็ต', 'Internet Bill'],
  ['ค่าเน็ตบ้าน', 'Home Internet Bill'],
  ['ค่าเน็ต', 'Internet Bill'],
  ['ค่าโทรศัพท์', 'Mobile Phone Bill'],
  ['ค่ามือถือ', 'Mobile Plan'],
  ['ค่าซักผ้า', 'Laundry'],
  ['ซักผ้า', 'Laundry'],
  ['ของใช้ในบ้าน', 'Household Supplies'],
  ['ของใช้ส่วนตัว', 'Personal Care'],
  ['ของใช้', 'Daily Essentials'],

  // Transport
  ['ค่าเดินทาง', 'Transportation'],
  ['รถไฟฟ้า', 'Skytrain / MRT'],
  ['รถเมล์', 'Bus Fare'],
  ['วินมอเตอร์ไซค์', 'Motorbike Taxi'],
  ['ค่าวิน', 'Motorbike Taxi'],
  ['แท็กซี่', 'Taxi'],
  ['ค่าน้ำมัน', 'Fuel / Gas'],
  ['เติมน้ำมัน', 'Fuel Refill'],
  ['ค่าทางด่วน', 'Toll Fee'],
  ['ค่าที่จอดรถ', 'Parking Fee'],
  ['ค่าซ่อมรถ', 'Car Maintenance'],
  ['ล้างรถ', 'Car Wash'],
  ['ตั๋วเครื่องบิน', 'Flight Ticket'],
  ['ค่ารถ', 'Transit Fare'],

  // Lifestyle, Health, Pets, Family, Education
  ['ช้อปปิ้ง', 'Shopping'],
  ['เสื้อผ้า', 'Clothing'],
  ['รองเท้า', 'Shoes'],
  ['กระเป๋า', 'Bag'],
  ['เครื่องสำอาง', 'Cosmetics'],
  ['สกินแคร์', 'Skincare'],
  ['ตัดผม', 'Haircut'],
  ['ทำผม', 'Hair Salon'],
  ['ดูหนัง', 'Movie Tickets'],
  ['ตั๋วหนัง', 'Movie Tickets'],
  ['เติมเกม', 'Game Top-Up'],
  ['ซื้อเกม', 'Games'],
  ['เกม', 'Gaming'],
  ['คอนเสิร์ต', 'Concert'],
  ['ท่องเที่ยว', 'Travel'],
  ['โรงแรม', 'Hotel'],
  ['ที่พัก', 'Accommodation'],
  ['ฟิตเนส', 'Gym / Fitness'],
  ['ออกกำลังกาย', 'Fitness'],
  ['หาหมอ', 'Doctor Visit'],
  ['โรงพยาบาล', 'Hospital'],
  ['ค่ารักษาพยาบาล', 'Medical Expense'],
  ['ค่ายา', 'Medicine / Pharmacy'],
  ['ซื้อยา', 'Pharmacy'],
  ['ทำฟัน', 'Dental Care'],
  ['อาหารแมว', 'Cat Food'],
  ['อาหารหมา', 'Dog Food'],
  ['สัตว์เลี้ยง', 'Pets'],
  ['ให้พ่อแม่', 'Parents Support'],
  ['โอนให้แม่', 'Transfer to Mom'],
  ['โอนให้พ่อ', 'Transfer to Dad'],
  ['โอนให้ครอบครัว', 'Family Transfer'],
  ['ของขวัญ', 'Gift'],
  ['ทำบุญ', 'Donation / Merit'],
  ['บริจาค', 'Charity Donation'],
  ['หนังสือ', 'Books'],
  ['คอร์สเรียน', 'Online Course'],
  ['ค่าเรียน', 'Tuition / Course'],
  ['อุปกรณ์ไอที', 'Tech & Gadgets'],
  ['ประกันสุขภาพ', 'Health Insurance'],
  ['ประกันอุบัติเหตุ', 'Accident Insurance'],
  ['ประกันชีวิต', 'Life Insurance'],
  ['เบี้ยประกัน', 'Insurance Premium'],
  ['ประกัน', 'Insurance'],

  // Income & Savings
  ['เงินเดือนประจำ', 'Monthly Salary'],
  ['เงินเดือน', 'Monthly Salary'],
  ['โบนัส', 'Bonus'],
  ['โอที', 'Overtime Pay'],
  ['ฟรีแลนซ์', 'Freelance Income'],
  ['รายได้เสริม', 'Side Income'],
  ['งานพิเศษ', 'Part-Time Income'],
  ['ขายของออนไลน์', 'Online Sales'],
  ['ขายของ', 'Sales Income'],
  ['ดอกเบี้ย', 'Interest Income'],
  ['เงินปันผล', 'Dividend'],
  ['ปันผล', 'Dividend'],
  ['เงินคืน', 'Cashback / Refund'],
  ['เงินสำรองฉุกเฉิน', 'Emergency Fund'],
  ['ออมฉุกเฉิน', 'Emergency Savings'],
  ['เงินออมฉุกเฉิน', 'Emergency Savings'],
  ['โอนออมฉุกเฉิน', 'Emergency Saving Transfer'],
  ['โอนออม', 'Savings Transfer'],
  ['ออมเงิน', 'Savings'],
  ['เงินออม', 'Savings'],
  ['ลงทุน', 'Investment'],
  ['กองทุนรวม', 'Mutual Fund'],
  ['หุ้น', 'Stocks'],
  ['ทองคำ', 'Gold'],
  ['สลากออมสิน', 'GSB Savings Lottery'],
];

const TH_TO_EN_MAP = new Map(TH_TO_EN_PHRASES);
const EN_TO_TH_MAP = new Map(
  TH_TO_EN_PHRASES.map(([th, en]) => [en.toLowerCase(), th])
);

const translationCache = new Map();

function capitalizeEnglish(str) {
  const clean = String(str || '').trim();
  if (!clean) return clean;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Instant 0ms offline bilingual lookup for common Thai/English finance entries.
 * Returns { obj: { th, en }, needsAsync: boolean, sourceLang: 'th' | 'en' | null }.
 */
export function buildInstantBilingualText(rawText) {
  const clean = String(rawText || '').trim();
  if (!clean) {
    return { obj: { th: '', en: '' }, needsAsync: false, sourceLang: null };
  }

  const hasThai = THAI_CHAR_REGEX.test(clean);
  const hasLatin = LATIN_CHAR_REGEX.test(clean);

  if (hasThai) {
    // 1) Exact dictionary match
    if (TH_TO_EN_MAP.has(clean)) {
      return {
        obj: { th: clean, en: TH_TO_EN_MAP.get(clean) },
        needsAsync: false,
        sourceLang: 'th',
      };
    }

    // 2) Try stripping common Thai prefixes ("ค่า", "ซื้อ", "จ่าย") for exact noun hit
    const stripped = clean.replace(/^(?:ค่า|ซื้อ|จ่ายค่า|จ่าย)\s*/, '');
    if (stripped && stripped !== clean && TH_TO_EN_MAP.has(stripped)) {
      return {
        obj: { th: clean, en: TH_TO_EN_MAP.get(stripped) },
        needsAsync: false,
        sourceLang: 'th',
      };
    }

    // 3) Check in-memory async cache
    const cacheKey = `th2en:${clean}`;
    if (translationCache.has(cacheKey)) {
      return {
        obj: { th: clean, en: translationCache.get(cacheKey) },
        needsAsync: false,
        sourceLang: 'th',
      };
    }

    return {
      obj: { th: clean, en: clean },
      needsAsync: true,
      sourceLang: 'th',
    };
  }

  if (hasLatin) {
    const lower = clean.toLowerCase();
    if (EN_TO_TH_MAP.has(lower)) {
      return {
        obj: { th: EN_TO_TH_MAP.get(lower), en: clean },
        needsAsync: false,
        sourceLang: 'en',
      };
    }

    const cacheKey = `en2th:${lower}`;
    if (translationCache.has(cacheKey)) {
      return {
        obj: { th: translationCache.get(cacheKey), en: clean },
        needsAsync: false,
        sourceLang: 'en',
      };
    }

    return {
      obj: { th: clean, en: clean },
      needsAsync: true,
      sourceLang: 'en',
    };
  }

  // Numbers / symbols only — identical in both languages
  return { obj: { th: clean, en: clean }, needsAsync: false, sourceLang: null };
}

async function fetchTranslatedString(text, from, to) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);

  try {
    // Primary: fast Google Translate GTX endpoint (CORS-enabled)
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const res = await fetch(gtxUrl, { signal: controller.signal });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && Array.isArray(json[0])) {
        const joined = json[0]
          .map((seg) => (Array.isArray(seg) ? seg[0] : ''))
          .join('')
          .trim();
        if (joined) {
          return to === 'en' ? capitalizeEnglish(joined) : joined;
        }
      }
    }
  } catch {
    // Fall through to MyMemory backup
  } finally {
    window.clearTimeout(timeout);
  }

  const mmController = new AbortController();
  const mmTimeout = window.setTimeout(() => mmController.abort(), 4500);
  try {
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${from}|${to}`;
    const res = await fetch(mmUrl, { signal: mmController.signal });
    if (res.ok) {
      const json = await res.json();
      const translated = String(json?.responseData?.translatedText || '').trim();
      if (translated && !/MYMEMORY WARNING/i.test(translated)) {
        return to === 'en' ? capitalizeEnglish(translated) : translated;
      }
    }
  } catch {
    // Offline or blocked — keep original safely
  } finally {
    window.clearTimeout(mmTimeout);
  }

  return null;
}

/**
 * Non-blocking TH <-> EN automatic translation for user-typed transactions and custom categories.
 * Safe offline: always resolves cleanly without throwing.
 */
export async function translateBilingualAsync(rawText) {
  const instant = buildInstantBilingualText(rawText);
  if (!instant.needsAsync || !instant.sourceLang) {
    return instant.obj;
  }

  const clean = String(rawText || '').trim();
  const from = instant.sourceLang;
  const to = from === 'th' ? 'en' : 'th';
  const cacheKey = `${from}2${to}:${from === 'en' ? clean.toLowerCase() : clean}`;

  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey);
    return from === 'th' ? { th: clean, en: cached } : { th: cached, en: clean };
  }

  const translated = await fetchTranslatedString(clean, from, to);
  if (!translated || translated.toLowerCase() === clean.toLowerCase()) {
    return instant.obj;
  }

  translationCache.set(cacheKey, translated);
  return from === 'th' ? { th: clean, en: translated } : { th: translated, en: clean };
}

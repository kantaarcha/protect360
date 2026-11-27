// Interactive Tutorial definitions tailored for everyday, non-accounting / non-statistics users.
// Covers both the 8-step full walkthrough and contextual per-page quick guides.

export const TUTORIAL_STORAGE_KEY = 'protect360_tutorial_status_v1';

export const TUTORIAL_UI_COPY = {
  TH: {
    promptBadge: 'คู่มือเริ่มต้นฉบับย่อ • ~1 นาที',
    promptTitle: 'ให้ช่วยพาเดินดูวิธีใช้งานสั้น ๆ ไหมครับ?',
    promptSubtitle:
      'ออกแบบสำหรับคนทั่วไปที่ไม่ได้ทำงานสายบัญชีหรือสถิติ จะช่วยแปลศัพท์ยาก ๆ ชี้จุดจดเงินที่ถูกต้อง และบอกส่วนที่กดข้ามได้ให้ครับ',
    promptPoints: [
      'เริ่มแค่ 2 จุด: จดเงินใน 360Flow และติ๊กสิทธิที่มีใน วิเคราะห์ความเสี่ยง',
      'ไม่แตะต้องข้อมูลจริงของคุณ และกดปิดหรือข้ามได้ทุกเมื่อ',
      'เรียกดูซ้ำเฉพาะหน้าได้ตลอดจากปุ่ม ? ด้านบน หรือใน ตั้งค่า',
    ],
    promptAccept: 'เริ่มฝึกสอนแนะนำการใช้งาน',
    promptDecline: 'ไม่ต้องการ / เข้าใช้งานเลย',
    nextBtn: 'ถัดไป',
    prevBtn: 'ย้อนกลับ',
    skipBtn: 'ข้ามทัวร์',
    finishBtn: 'เสร็จสิ้น เริ่มใช้งาน',
    stepCounterPrefix: 'ขั้นที่',
    stepOf: 'จาก',
    pageBadgeLabel: 'คู่มือเฉพาะหน้านี้',
    badges: {
      core: 'จุดเริ่มต้นหลัก',
      tip: 'ทริกป้องกันจดผิด',
      optional: 'เสริม • กดข้ามได้',
    },
    helpMenuTitle: 'ตัวช่วยการใช้งาน',
    helpThisPage: 'แนะนำเฉพาะหน้านี้',
    helpFullTour: 'เริ่มทัวร์ทั้งหมด (8 ขั้น)',
  },
  EN: {
    promptBadge: 'Quick Starter Guide • ~1 min',
    promptTitle: 'Would you like a short interactive walkthrough?',
    promptSubtitle:
      'Designed for everyday users with zero accounting or statistics background — translates jargon into plain language and shows what you can safely skip.',
    promptPoints: [
      'Everything starts in 2 places: track cash in 360Flow & check perks in Risk Analysis',
      'Never alters your personal data — pause, skip, or close anytime',
      'Replay anytime from the ? help button at the top or in Settings',
    ],
    promptAccept: 'Start Interactive Tutorial',
    promptDecline: 'No thanks / Skip for now',
    nextBtn: 'Next',
    prevBtn: 'Back',
    skipBtn: 'Skip Tour',
    finishBtn: 'Finish & Explore',
    stepCounterPrefix: 'Step',
    stepOf: 'of',
    pageBadgeLabel: 'Page Guide',
    badges: {
      core: 'Core Essential',
      tip: 'Pro Tip',
      optional: 'Optional • Skippable',
    },
    helpMenuTitle: 'Interactive Guide',
    helpThisPage: 'Explain this page',
    helpFullTour: 'Full 8-step walkthrough',
  },
};

export const FULL_TUTORIAL_STEPS = [
  {
    id: 'overview-hub',
    page: 'overview',
    badgeType: 'core',
    selectors: ['#emergency-fund-title', '.emergency-card', '#cta-check-gap'],
    spotlightSelector: '.emergency-card',
    title: {
      th: 'หน้าภาพรวม: ศูนย์สรุปผลอัตโนมัติ (ไม่ต้องกรอกซ้ำ)',
      en: 'Overview: Automatic Summary Hub',
    },
    body: {
      th: 'เข้ามาครั้งแรกจะเห็นเลขเป็น ฿0 เป็นเรื่องปกติครับ หน้านี้ทำหน้าที่รวมผลให้อัตโนมัติ แค่คุณจดเงินใน 360Flow และติ๊กสวัสดิการใน วิเคราะห์ความเสี่ยง กราฟเงินสำรองฉุกเฉินและคะแนน 4 ด้านจะอัปเดตตรงนี้เอง',
      en: 'Seeing ฿0 on your first visit is completely normal. Overview updates automatically once you log cash in 360Flow and tick your benefits in Risk Analysis.',
    },
    plainTip: {
      th: 'ศัพท์ง่าย ๆ: "กันชนฉุกเฉิน (Runway)" = จำนวนเดือนที่คุณยังอยู่ได้สบาย ๆ หากรายได้หยุดกะทันหัน (เป้ามาตรฐาน 3 เดือน)',
      en: 'Plain term: "Emergency Runway" = how many months your cash reserve lasts if income pauses unexpectedly (3-month baseline).',
    },
  },
  {
    id: 'flow-modes',
    page: 'smartlog',
    badgeType: 'core',
    selectors: ['#smartlog-mode-manual', '#smartlog-mode-auto', '#ak-input-heading'],
    spotlightSelector: '.ak-input-card .liquid-tabs-surface',
    prepareDom: () => {
      document.querySelector('#smartlog-mode-auto')?.click?.();
    },
    title: {
      th: '360Flow: เลือก "กรอกด่วน" หรือลองกด "สแกนสลิป"',
      en: '360Flow: Pick "Manual Entry" or try "Slip Scan"',
    },
    body: {
      th: 'อยากจดรายรับ-รายจ่ายด้วยตัวเองทันทีให้กดแท็บ "กรอกด่วน" ส่วนแท็บ "สแกนสลิป" มีปุ่มสลิปตัวอย่าง (เช่น เงินเดือนเข้า, ค่ากาแฟ) ให้กดทดสอบดูผลลัพธ์ไว ๆ ได้เลยโดยไม่ต้องอัปโหลดรูปจริง',
      en: 'Tap "Manual Entry" to log your own income or expenses right away. "Slip Scan" includes one-tap sample slips so you can preview how transactions work without uploading real images.',
    },
    plainTip: {
      th: 'มือใหม่เริ่มแค่ 2 รายการก็พอ: รายรับเดือนนี้ + ค่าใช้จ่ายหลัก เพื่อดูยอดเงินคงเหลือรายเดือนทันที',
      en: 'Just 2 entries are enough to start: monthly income + main living expenses.',
    },
  },
  {
    id: 'flow-saving-custom-export',
    page: 'smartlog',
    badgeType: 'tip',
    selectors: ['#manual-type-saving', '#manual-cat-other-btn', '#smartlog-export-excel-btn'],
    spotlightSelector: '#manual-type-saving',
    prepareDom: () => {
      document.querySelector('#smartlog-mode-manual')?.click?.();
    },
    title: {
      th: 'ทริกสำคัญ: แยก "เงินสำรองฉุกเฉิน" ออกจาก "รายจ่าย"',
      en: 'Key Tip: Separate "Emergency Reserve" from "Expenses"',
    },
    body: {
      th: 'เวลาโอนเงินเก็บเข้าบัญชีออมทรัพย์ อย่าลงเป็นรายจ่ายนะครับ ให้เลือกปุ่ม "เงินสำรองฉุกเฉิน" ตรงนี้แทน เพื่อให้นับรวมเข้าเป้า 3 เดือน นอกจากนี้ยังกด "อื่น ๆ" เพื่อสร้างหมวดหมู่ส่วนตัวพร้อมไอคอน หรือส่งออก Excel / CSV ด้านล่างได้ด้วย',
      en: 'When setting savings aside, choose "Emergency Reserve" instead of Expense so it builds your 3-month cushion. You can also tap "Other" to create custom categories or export Excel / CSV below.',
    },
    plainTip: {
      th: 'ระบบจะนำยอดเงินเหลือต่อเดือนไปคำนวณ "กรอบงบปลอดภัย" ให้โดยอัตโนมัติ ไม่ต้องตั้งสูตรเอง',
      en: 'Your monthly surplus automatically calculates a safe protection budget cap — zero math needed.',
    },
  },
  {
    id: 'risk-perks',
    page: 'risk-analysis',
    badgeType: 'core',
    selectors: ['#ra-coverage-heading', '#ra-view-results-btn'],
    spotlightSelector: '.ra-coverage-card',
    prepareDom: () => {
      document.querySelector('#risk-analysis-mode-input')?.click?.();
    },
    title: {
      th: 'วิเคราะห์ความเสี่ยง: ไม่รู้วงเงินเป๊ะ ๆ ก็ประเมินได้',
      en: 'Risk Analysis: No Exact Policy Numbers Needed',
    },
    body: {
      th: 'แค่ติ๊กสวัสดิการที่รู้ว่ามีตอนนี้ (เช่น ประกันสังคม ม.33, บัตรทอง 30 บาท หรือประกันกลุ่มบริษัท) ระบบจะประเมินฐานคุ้มครองให้เบื้องต้น จากนั้นกด "ดูผลวิเคราะห์ & แผนจัดการความเสี่ยง" เพื่อดูว่ายังขาดตรงไหนบ้าง',
      en: 'Simply tick the benefits you already have (like Social Security Sec. 33, Gold Card, or Company Group Plan). We estimate baseline coverage first, then show any gaps clearly.',
    },
    plainTip: {
      th: 'ศัพท์ง่าย ๆ: "Protection Gap (ช่องว่างความคุ้มครอง)" = ส่วนต่างค่ารักษา/เหตุฉุกเฉินที่อาจต้องควักเงินส่วนตัวจ่ายเอง',
      en: 'Plain term: "Protection Gap" = potential emergency cost your current benefits do not cover yet.',
    },
  },
  {
    id: 'invest-irr-plain',
    page: 'invest',
    badgeType: 'optional',
    selectors: ['#invest-calc-mode-transfer', '#invest-calc-mode-irr', '#inv-t1-heading'],
    spotlightSelector: '#invest-calc-mode-irr',
    prepareDom: () => {
      document.querySelector('#invest-calc-mode-transfer')?.click?.();
    },
    title: {
      th: 'ลงทุน & IRR: ดูจำลองง่าย ๆ ได้ — ส่วน IRR กดข้ามได้',
      en: 'Invest & IRR: Try the Simple Bill Check — IRR is Optional',
    },
    body: {
      th: 'แท็บแรก ("โอนเสี่ยง vs จ่ายเอง") ใช้เทียบง่าย ๆ ว่าถ้าวันนึงเจอบิลฉุกเฉิน ฿50,000–฿300,000 เงินเก็บจะหายไปแค่ไหน ส่วนแท็บ "คำนวณ IRR & ภาษี" เอาไว้เช็ก % ผลตอบแทนจริงของแผนออมระยะยาว — ถ้าแค่อยากจดเงินและเช็กความเสี่ยงพื้นฐาน ข้ามส่วน IRR ได้เลยครับ',
      en: 'Tab 1 shows how an unexpected ฿50k–฿300k bill affects your savings. Tab 2 ("IRR & Tax") checks long-term savings policy returns — feel free to skip IRR if you only want daily cashflow & risk checks.',
    },
    plainTip: {
      th: 'ศัพท์ง่าย ๆ: "IRR" = อัตราผลตอบแทนที่แท้จริงต่อปีเทียบกับการฝากเงินปกติ ไม่ต้องคำนวณเอง',
      en: 'Plain term: "IRR" = true yearly return rate compared to keeping cash in a regular bank account.',
    },
  },
  {
    id: 'game-safe-start',
    page: 'game',
    badgeType: 'tip',
    selectors: ['#gm-persona-default-btn', '#gm-hr-bonus-toggle', '#gm-start-simulation-btn'],
    spotlightSelector: '#gm-persona-default-btn',
    title: {
      th: 'เกมเอาตัวรอด: ทริกเลือกตัวละครก่อนเริ่มเล่น',
      en: 'Survival Game: Pick the Starter Role Before Playing',
    },
    body: {
      th: 'หากยังไม่เคยกรอกข้อมูลจริงในแอป ให้เลือก "ตัวเลือก B • โจทย์มาตรฐาน" จะได้เริ่มเกมพร้อมเงินเดือนและเงินออมตัวอย่างทันที และอย่าลืมกดปุ่มฟรี "ทักแชตถามวงเงินประกันกลุ่มกับ HR" เพื่อรับสิทธิแฝงก่อนกดเริ่มด่าน',
      en: 'If you haven’t entered real numbers yet, select "Option B • Challenge" for ready-to-play starter stats, and tap the free "Ask HR about Group Insurance" bonus before starting.',
    },
    plainTip: {
      th: 'เกมนี้จำลองเหตุการณ์จริงของวัยเริ่มทำงาน เช่น ป่วยฉุกเฉิน ซ่อมมือถือ หรือรายจ่ายไม่คาดคิด เพื่อฝึกตัดสินใจก่อนเจอของจริง',
      en: 'Simulates real early-career surprises (medical bills, repairs, sudden expenses) with zero real-world risk.',
    },
  },
  {
    id: 'learning-glossary',
    page: 'learning',
    badgeType: 'optional',
    selectors: ['#learning-window-glossary', '#learning-window-quiz', '#learning-window-guides'],
    spotlightSelector: '#learning-window-glossary',
    title: {
      th: 'คลังความรู้: เจอศัพท์ประกันงง ๆ กด "แปลศัพท์" ได้เลย',
      en: 'Learning Library: Plain-English "Glossary" Inside',
    },
    body: {
      th: 'เมื่ออ่านเจอคำอย่าง OPD, IPD, Waiting Period หรือ Co-payment แล้วไม่แน่ใจว่าหมายถึงอะไร ให้กดแท็บ "แปลศัพท์" ตรงนี้เพื่อดูคำแปลภาษาคนแบบสั้น ๆ หรือลองเล่น "ควิซ 5 ข้อ" เช็กความเข้าใจภายใน 2 นาที',
      en: 'Confused by OPD, IPD, Waiting Period, or Co-payment? Open the "Glossary" tab here for 2-minute plain-language definitions, or take the quick 5-question quiz.',
    },
    plainTip: {
      th: 'อ่านจบเฉพาะหัวข้อที่สงสัยก็พอครับ ไม่จำเป็นต้องท่องจำทุกบท',
      en: 'Just read whichever topic you need — no need to study everything at once.',
    },
  },
  {
    id: 'settings-demo-local',
    page: 'settings',
    badgeType: 'core',
    selectors: ['#load-sample-scenario-btn', '#settings-start-tutorial-btn'],
    spotlightSelector: '#load-sample-scenario-btn',
    title: {
      th: 'ตั้งค่า: ข้อมูลเก็บในเครื่อง 100% + ปุ่มทดลองค่าสมมติ',
      en: 'Settings: 100% Local Privacy + One-Tap Sample Data',
    },
    body: {
      th: 'ข้อมูลทุกอย่างถูกบันทึกเฉพาะในเบราว์เซอร์เครื่องของคุณ ไม่มีการส่งขึ้นเซิร์ฟเวอร์ และถ้าอยากเห็นกราฟเต็มรูปแบบทุกหน้าก่อนลงข้อมูลจริง กดปุ่ม "ใส่ค่าสมมติคำนวณ" ตรงนี้ได้เลย (ล้างออกกลับมาเป็นข้อมูลเปล่าได้ทุกเมื่อ)',
      en: 'Everything stays locally in your browser (Zero-Login PDPA-safe). Want to preview full charts across the app first? Tap "Load Sample Values" here — you can clear it back anytime.',
    },
    plainTip: {
      th: 'เปิดดูคู่มือนี้ซ้ำได้ทุกเวลาจากปุ่ม ? ด้านบน หรือปุ่ม "เริ่มฝึกสอนใช้งาน" ในหน้าตั้งค่านี้',
      en: 'Replay this tour anytime via the top ? button or from Settings.',
    },
  },
];

// Contextual quick-help step IDs when user clicks "?" -> "Explain this page"
const PAGE_TO_STEP_IDS = {
  overview: ['overview-hub'],
  smartlog: ['flow-modes', 'flow-saving-custom-export'],
  'risk-analysis': ['risk-perks'],
  invest: ['invest-irr-plain'],
  game: ['game-safe-start'],
  learning: ['learning-glossary'],
  settings: ['settings-demo-local'],
};

const ABOUT_CONTEXTUAL_STEP = {
  id: 'about-overview',
  page: 'about',
  badgeType: 'tip',
  selectors: ['.about-hero-card', '.about-wrap h1', '.bento-card'],
  spotlightSelector: '.about-hero-card',
  title: {
    th: 'เกี่ยวกับเรา: ที่มางานวิจัย & หลักการไม่ขายประกัน',
    en: 'About Us: Research Evidence & Zero-Sales Charter',
  },
  body: {
    th: 'หน้านี้อธิบายที่มาข้อมูลจริงจากแบบสำรวจวัยเริ่มต้นทำงานและเหตุผลที่เราสร้างเครื่องมือกลาง โดยไม่มีตัวแทนหรือป๊อปอัปขายประกันมากวนใจครับ',
    en: 'Explore the First Jobber survey findings behind PROTECT360 and our commitment to staying 100% independent with zero insurance sales pitches.',
  },
  plainTip: {
    th: 'อยากกลับไปจดเงินหรือเช็กความเสี่ยง ใช้เมนูทางซ้าย (หรือแถบด้านล่างบนมือถือ) ได้ตลอดครับ',
    en: 'Jump back anytime using the left menu (or bottom bar on mobile).',
  },
};

export function getPageContextualSteps(pageId) {
  if (pageId === 'about') {
    return [ABOUT_CONTEXTUAL_STEP];
  }
  const ids = PAGE_TO_STEP_IDS[pageId] || ['overview-hub'];
  return ids
    .map((id) => FULL_TUTORIAL_STEPS.find((step) => step.id === id))
    .filter(Boolean);
}

export function getSavedTutorialStatus() {
  try {
    const val = window.localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (val === 'completed' || val === 'skipped' || val === 'unseen') {
      return val;
    }
    return 'unseen';
  } catch {
    return 'unseen';
  }
}

export function saveTutorialStatus(status) {
  try {
    window.localStorage.setItem(TUTORIAL_STORAGE_KEY, status);
  } catch {
    // Ignore storage errors
  }
}

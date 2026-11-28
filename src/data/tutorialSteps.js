// Interactive Tutorial definitions tailored for everyday, non-accounting / non-statistics users.
// Integrates Option A (non-blocking first-visit per-tab banner) + Option B (on-demand ? button & Settings replay),
// featuring both a 8-step cross-page overview tour AND dedicated 3-5 step deep tours for every tab.

export const TUTORIAL_STORAGE_KEY = 'protect360_tutorial_status_v1';
export const TAB_TUTORIALS_STORAGE_KEY = 'protect360_tab_tutorials_v1';

export const TUTORIAL_UI_COPY = {
  TH: {
    promptBadge: 'คู่มือเริ่มต้นฉบับย่อ • ~1 นาที',
    promptTitle: 'ให้ช่วยพาเดินดูภาพรวมวิธีใช้งานสั้น ๆ ไหมครับ?',
    promptSubtitle:
      'ออกแบบสำหรับคนทั่วไปที่ไม่ได้ทำงานสายบัญชีหรือสถิติ จะพาดูภาพรวมทุกแท็บแบบเข้าใจง่าย และแต่ละแท็บยังมีคู่มือเจาะลึกแยกให้อีกทีตอนเข้าไปใช้งานครับ',
    promptPoints: [
      'เริ่มแค่ 2 จุด: จดเงินใน 360Flow และติ๊กสิทธิที่มีใน วิเคราะห์ความเสี่ยง',
      'แต่ละแท็บมีคู่มือแยกเฉพาะหน้านั้น (3–5 ขั้น) และดูวิดีโอซ้ำได้ที่ปุ่ม ? หรือ ตั้งค่า',
    ],
    promptAccept: 'เริ่มทัวร์ภาพรวม (8 ขั้น)',
    promptDecline: 'ไม่ต้องการ / เข้าใช้งานเลย',
    nextBtn: 'ถัดไป',
    prevBtn: 'ย้อนกลับ',
    skipBtn: 'ปิด / ข้าม',
    finishBtn: 'เสร็จสิ้น เริ่มใช้งาน',
    stepCounterPrefix: 'ขั้นที่',
    stepOf: 'จาก',
    pageBadgeLabel: 'สอนเฉพาะแท็บนี้',
    badges: {
      core: 'จุดเริ่มต้นหลัก',
      tip: 'ทริกสำคัญ',
      optional: 'เสริม • กดข้ามได้',
    },
    helpMenuTitle: 'ตัวช่วย & คู่มือการใช้งาน',
    helpThisPage: 'สอนใช้แท็บนี้',
    helpFullTour: 'ทัวร์ภาพรวมทั้งเว็บ (8 ขั้น)',
    helpWatchDemo: 'ดูวิดีโอสาธิต (Demo)',
    demoModalBadge: 'วิดีโอแนะนำก่อนเริ่มใช้งาน • ~1.5 นาที',
    demoModalTitle: 'วิดีโอตัวอย่างการใช้งาน PROTECT360',
    demoModalSub:
      'ดูภาพรวมวิธีใช้งานสั้น ๆ แล้วกดไปต่อเพื่อเลือกว่าต้องการให้ระบบฝึกสอนทีละจุดหรือไม่',
    demoModalReplaySub:
      'ทบทวนวิธีใช้งาน 360Flow เช็กความเสี่ยง และเครื่องมือต่าง ๆ หรือเปิดโหมดฝึกสอนทีละจุดได้ทันที',
    demoModalClose: 'ปิดหน้าต่าง',
    demoModalStartTour: 'ต่อด้วยโหมดฝึกสอน (8 ขั้น)',
    gateSkipBtn: 'ข้ามคลิป → ไปหน้าฝึกสอน',
    gateContinueBtn: 'ไปต่อ (เลือกรับการฝึกสอน)',
    unmuteAudioBtn: 'เปิดเสียงคลิป (50%)',
    stepsUnit: 'ขั้น',
    bannerStartBtn: 'เริ่มสอนหน้านี้',
    bannerDismissBtn: 'ไม่ต้องแสดงอีก',
  },
  EN: {
    promptBadge: 'Quick Starter Tour • ~1 min',
    promptTitle: 'Would you like a quick overview of how PROTECT360 works?',
    promptSubtitle:
      'Built for everyday users with zero accounting or statistics background. Start with a quick overview here — each tab also includes its own focused step-by-step guide when you open it.',
    promptPoints: [
      'Start in 2 places: track cash in 360Flow & check perks in Risk Analysis',
      'Each tab has its own focused 3–5 step guide, and you can replay the video anytime via ? or Settings',
    ],
    promptAccept: 'Start Overview Tour (8 Steps)',
    promptDecline: 'No thanks / Enter App',
    nextBtn: 'Next',
    prevBtn: 'Back',
    skipBtn: 'Close / Skip',
    finishBtn: 'Finish & Continue',
    stepCounterPrefix: 'Step',
    stepOf: 'of',
    pageBadgeLabel: 'Tab Walkthrough',
    badges: {
      core: 'Core Essential',
      tip: 'Key Tip',
      optional: 'Optional • Skippable',
    },
    helpMenuTitle: 'Help & Tutorials',
    helpThisPage: 'Guide for this tab',
    helpFullTour: 'Full App Overview (8 Steps)',
    helpWatchDemo: 'Watch Demo Video',
    demoModalBadge: 'Pre-Tutorial Walkthrough • ~1.5 min',
    demoModalTitle: 'PROTECT360 Demo Video',
    demoModalSub:
      'Watch a quick preview first, then continue to choose whether you’d like the interactive tutorial.',
    demoModalReplaySub:
      'Replay how 360Flow tracking, risk gap checks, and learning tools work anytime.',
    demoModalClose: 'Close Video',
    demoModalStartTour: 'Launch Interactive Tutorial',
    gateSkipBtn: 'Skip Clip → Tutorial Prompt',
    gateContinueBtn: 'Continue to Tutorial Choice',
    unmuteAudioBtn: 'Enable Sound (50%)',
    stepsUnit: 'steps',
    bannerStartBtn: 'Start Tab Guide',
    bannerDismissBtn: 'Don’t show again',
  },
};

// Cross-page high-level overview walkthrough (8 concise steps)
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
      en: 'Plain term: "Emergency Runway" = how many months your reserve lasts if income pauses unexpectedly (3-month baseline).',
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
      th: 'เวลาโอนเงินเก็บเข้าบัญชีออมทรัพย์ อย่าลงเป็นรายจ่ายนะครับ ให้เลือกปุ่ม "เงินสำรอง" ตรงนี้แทน เพื่อให้นับรวมเข้าเป้า 3 เดือน นอกจากนี้ยังกด "อื่น ๆ" เพื่อสร้างหมวดหมู่ส่วนตัว หรือส่งออก Excel ได้ด้วย',
      en: 'When setting savings aside, choose "Emergency Reserve" instead of Expense so it builds your 3-month cushion. Tap "Other" to create custom categories or export Excel below.',
    },
    plainTip: {
      th: 'ในแท็บ 360Flow ยังมีสอนละเอียด 5 ขั้นแยกเฉพาะหน้าให้กดดูเพิ่มได้จากแถบด้านบนหรือปุ่ม ?',
      en: '360Flow also includes its own focused 5-step guide accessible anytime via the top bar or ? button.',
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
      en: 'Simply tick benefits you already have (Social Security Sec. 33, Gold Card, Company Group Plan). We estimate baseline coverage first, then show any gaps clearly.',
    },
    plainTip: {
      th: 'ศัพท์ง่าย ๆ: "Protection Gap" = ส่วนต่างค่ารักษา/เหตุฉุกเฉินที่อาจต้องควักเงินส่วนตัวจ่ายเอง',
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
      th: 'แท็บแรก ("โอนเสี่ยง vs จ่ายเอง") ใช้เทียบง่าย ๆ ว่าถ้าเจอบิลฉุกเฉิน ฿50k–฿300k เงินเก็บจะหายแค่ไหน ส่วนแท็บ "คำนวณ IRR & ภาษี" เอาไว้เช็ก % ผลตอบแทนประกันออมทรัพย์ — กดข้ามได้ถ้าเน้นจดรับ-จ่ายครับ',
      en: 'Tab 1 shows how an unexpected ฿50k–฿300k bill affects savings. Tab 2 ("IRR & Tax") checks long-term policy returns — feel free to skip IRR if you only want daily cashflow & risk checks.',
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
      th: 'หากยังไม่เคยกรอกข้อมูลจริงในแอป ให้เลือก "ตัวเลือก B • โจทย์มาตรฐาน" จะได้เริ่มเกมพร้อมเงินเดือนและเงินออมตัวอย่างทันที และอย่าลืมกดปุ่มฟรี "ทักแชตถามวงเงินประกันกลุ่มกับ HR" เพื่อรับสิทธิแฝงก่อนเริ่มด่าน',
      en: 'If you haven’t entered real numbers yet, select "Option B • Challenge" for ready starter stats, and tap the free "Ask HR about Group Insurance" bonus before starting.',
    },
    plainTip: {
      th: 'เกมนี้จำลองเหตุการณ์จริงของวัยเริ่มทำงาน เพื่อฝึกตัดสินใจทางการเงินโดยไม่เสียเงินจริง',
      en: 'Simulates real early-career financial surprises with zero real-world risk.',
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
      th: 'เมื่ออ่านเจอคำอย่าง OPD, IPD, Waiting Period หรือ Co-payment แล้วไม่แน่ใจว่าหมายถึงอะไร ให้กดแท็บ "แปลศัพท์" ตรงนี้เพื่อดูคำแปลภาษาคนแบบสั้น ๆ หรือลองเล่น "ควิซ 5 หรือ 10 ข้อ" ใน 2 นาที',
      en: 'Confused by OPD, IPD, Waiting Period, or Co-payment? Open the "Glossary" tab here for 2-minute plain-language definitions, or take a 5- or 10-question quiz.',
    },
    plainTip: {
      th: 'อ่านเฉพาะหัวข้อที่สงสัยก็พอครับ ไม่จำเป็นต้องท่องจำทุกบท',
      en: 'Just check whichever term you need — no need to study everything at once.',
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
      th: 'ข้อมูลทุกอย่างถูกบันทึกเฉพาะในเบราว์เซอร์เครื่องของคุณ ไม่มีการส่งขึ้นเซิร์ฟเวอร์ และถ้าอยากเห็นกราฟเต็มรูปแบบทุกหน้าก่อนลงข้อมูลจริง กดปุ่ม "ใส่ค่าสมมติคำนวณ" ตรงนี้ได้เลย',
      en: 'Everything stays locally in your browser (Zero-Login PDPA-safe). Want to preview full charts across the app first? Tap "Load Sample Values" here — you can clear it back anytime.',
    },
    plainTip: {
      th: 'เปิดดูคู่มือเฉพาะแต่ละแท็บได้ทุกเวลาจากปุ่ม ? ด้านบน หรือแถบแนะนำด้านบนของแต่ละแท็บครับ',
      en: 'Open any per-tab tutorial anytime from the top ? button or each tab’s quick guide strip.',
    },
  },
];

// Dedicated per-tab step-by-step tutorials (3 to 5 focused steps per tab)
export const PER_TAB_TUTORIAL_STEPS = {
  overview: [
    {
      id: 'ov-step-1-emergency',
      page: 'overview',
      badgeType: 'core',
      selectors: ['#emergency-fund-title', '.emergency-card'],
      spotlightSelector: '.emergency-card',
      title: {
        th: '1/4 เงินออมฉุกเฉิน & เป้ากันชนชีวิต',
        en: '1/4 Liquid Emergency Reserve & Cushion',
      },
      body: {
        th: 'กล่องนี้บอกว่าตอนนี้คุณมีเงินเย็นพร้อมใช้พออยู่ได้กี่เดือนหากรายได้สะดุด (เป้าหมายวัยเริ่มทำงานคือ 3–6 เดือน) พร้อมตัวเลขบอกชัด ๆ ว่ายังขาดอีกเท่าไร',
        en: 'Shows how many months of expenses your liquid cash reserve currently covers (target 3–6 months for First Jobbers) and the exact remaining gap.',
      },
      plainTip: {
        th: 'ยอดเงินสำรองจะเพิ่มขึ้นเองเมื่อคุณบันทึกรายการประเภท "เงินสำรอง" ในแท็บ 360Flow',
        en: 'This reserve updates automatically whenever you log an "Emergency Reserve" entry in 360Flow.',
      },
    },
    {
      id: 'ov-step-2-metrics',
      page: 'overview',
      badgeType: 'tip',
      selectors: ['.metrics-grid-2x2'],
      spotlightSelector: '.metrics-grid-2x2',
      title: {
        th: '2/4 สรุปรายเดือน 4 ช่อง (กดดูรายละเอียดได้)',
        en: '2/4 Monthly 4-Metric Summary (Tap for Breakdown)',
      },
      body: {
        th: 'สรุปรายรับ รายจ่าย เงินเหลือออมต่อเดือน และเบี้ยประกันส่วนตัวแบบไม่ต้องกดเครื่องคิดเลขเอง แต่ละช่องสามารถคลิกเพื่อเปิดดูที่มาและสูตรคำนวณอย่างง่ายได้',
        en: 'Summarizes monthly income, expenses, savings rate, and self-paid premiums automatically. Click any card to inspect its breakdown formula.',
      },
      plainTip: {
        th: 'เกณฑ์แนะนำแบบง่าย: พยายามให้รายจ่ายรวมไม่เกินรายรับ และมีเงินออมเหลือทุกเดือน',
        en: 'Simple rule: keep monthly expenses below income so positive savings accumulate consistently.',
      },
    },
    {
      id: 'ov-step-3-coverages',
      page: 'overview',
      badgeType: 'core',
      selectors: ['#add-coverage-btn', '.coverage-card-panel'],
      spotlightSelector: '.coverage-card-panel',
      title: {
        th: '3/4 สิทธิและกรมธรรม์ของฉัน (+ เพิ่มสิทธิ)',
        en: '3/4 My Benefits & Policies (+ Add Coverage)',
      },
      body: {
        th: 'รวบรวมสิทธิที่คุณมีทั้งหมดไว้ที่เดียว (เช่น ประกันสังคม ม.33 ประกันกลุ่มบริษัท หรือประกันส่วนตัว) สามารถกด "+ เพิ่มสิทธิ" เพื่อกรอกวงเงินหรือปรับปรุงรายการที่มีอยู่ได้ทันที',
        en: 'Keeps all your active protections in one place (SSO Sec. 33, company group plan, or personal policies). Tap "+ Add Coverage" to record or update limits.',
      },
      plainTip: {
        th: 'ช่อง "ความคุ้มครองที่มีจริง vs ที่ควรมี" ด้านบนของกล่องจะเทียบให้ดูว่าครอบคลุมความเสี่ยงพื้นฐานกี่ % แล้ว',
        en: 'The coverage comparison bar shows what % of baseline risk is currently protected.',
      },
    },
    {
      id: 'ov-step-4-pillars',
      page: 'overview',
      badgeType: 'core',
      selectors: ['.risk-status-strip', '#cta-check-gap'],
      spotlightSelector: '.risk-status-strip',
      title: {
        th: '4/4 แถบเช็กความเสี่ยง 3 มิติ & ปุ่มเจาะลึก',
        en: '4/4 3-Pillar Risk Status Strip',
      },
      body: {
        th: 'แถบด้านล่างแบ่งความเสี่ยงเป็น 3 เรื่องเข้าใจง่าย: สุขภาพและอุบัติเหตุ, รายได้ฉุกเฉิน, และทรัพย์สิน/รถ หากเห็นสีเหลืองหรือแดง กดที่การ์ดเพื่อเข้าไปเช็กแผนแก้ไขในหน้า วิเคราะห์ความเสี่ยง ได้ทันที',
        en: 'Breaks risk into 3 plain pillars: Health & Accident, Income Reserve, and Assets/Auto. Tap any card to review detailed action steps in Risk Analysis.',
      },
      plainTip: {
        th: 'สีเขียว = พร้อมแล้ว · สีเหลือง = ควรเสริมเพิ่ม · สีแดง = จุดที่ควรรีบอุดช่องว่างก่อน',
        en: 'Green = ready · Amber = room to strengthen · Red = top priority gap to address.',
      },
    },
  ],

  smartlog: [
    {
      id: 'sl-step-1-kpi',
      page: 'smartlog',
      badgeType: 'core',
      selectors: ['.ak-kpi-row', '#kpi-card-income'],
      spotlightSelector: '.ak-kpi-row',
      title: {
        th: '1/5 แถบสรุป 4 ยอดหลักด้านบน (คลิกกรองได้)',
        en: '1/5 Top 4 Cashflow KPIs (Clickable Filters)',
      },
      body: {
        th: 'แสดงยอดรายรับรวม รายจ่ายรวม เงินออมสุทธิ และเงินสำรองฉุกเฉินพร้อมใช้ กดที่การ์ดใบใดก็ได้เพื่อดูที่มาของตัวเลขหรือกรองดูเฉพาะรายการประเภทนั้นในสมุดบัญชี',
        en: 'Displays total income, expenses, net savings, and emergency runway. Tap any card to inspect calculation sources or filter the ledger.',
      },
      plainTip: {
        th: 'เลขทุกช่องใน 360Flow เชื่อมตรงกับหน้าภาพรวมและเกมจำลองชีวิตอัตโนมัติ',
        en: 'All figures here sync straight to Overview and the Survival Game.',
      },
    },
    {
      id: 'sl-step-2-modes',
      page: 'smartlog',
      badgeType: 'core',
      selectors: ['.ak-input-card .liquid-tabs-surface', '#smartlog-mode-auto'],
      spotlightSelector: '.ak-input-card .liquid-tabs-surface',
      prepareDom: () => {
        document.querySelector('#smartlog-mode-auto')?.click?.();
      },
      title: {
        th: '2/5 โหมด "สแกนสลิป" vs "กรอกด่วน"',
        en: '2/5 "Slip Scan" vs "Manual Entry" Modes',
      },
      body: {
        th: 'แท็บ "สแกนสลิป" มีปุ่มสลิปจำลอง (เงินเดือน/ออม/อาหาร/ค่าที่พัก) และช่องวางข้อความจากสลิปให้ลองกดบันทึกในคลิกเดียว ส่วนใครอยากพิมพ์ยอดและเลือกหมวดเอง กดสลับไปแท็บ "กรอกด่วน" ได้เลยครับ',
        en: '"Slip Scan" offers one-tap sample slips and smart text parsing, while "Manual Entry" lets you type exact amounts and pick custom categories.',
      },
      plainTip: {
        th: 'ไม่ต้องอัปโหลดรูปจริงก็ทดลองกดปุ่มสลิปตัวอย่างด้านล่างเพื่อดูกราฟขยับได้ทันที',
        en: 'You can click any sample slip button to test how charts react immediately.',
      },
    },
    {
      id: 'sl-step-3-saving-custom',
      page: 'smartlog',
      badgeType: 'tip',
      selectors: ['#manual-type-saving', '#manual-cat-other-btn'],
      spotlightSelector: '#manual-type-saving',
      prepareDom: () => {
        document.querySelector('#smartlog-mode-manual')?.click?.();
      },
      title: {
        th: '3/5 เลือกประเภท "เงินสำรอง" & สร้างหมวดหมู่ของฉัน',
        en: '3/5 "Emergency Reserve" Type & Custom Categories',
      },
      body: {
        th: 'ข้อควรระวังสำหรับมือใหม่: เงินที่โอนเข้าบัญชีออมฉุกเฉิน ให้เลือกปุ่มสีฟ้า "เงินสำรอง" (ไม่ใช่รายจ่าย) และถ้าหมวดหมู่มาตรฐานไม่ตรงใจ กดปุ่ม "อื่น ๆ (หมวดของฉัน)" เพื่อตั้งชื่อและเลือกไอคอน 25 แบบเองได้',
        en: 'Beginner tip: money moved into savings belongs under "Emergency Reserve" (not Expense). Tap "Other (My Categories)" to add your own category with 25 icons.',
      },
      plainTip: {
        th: 'ข้างช่องกรอกจำนวนเงินยังมีปุ่มเครื่องคิดเลขเล็ก ๆ สำหรับแม่ค้า/คนคิดหลายยอดรวมกันด้วย',
        en: 'Notice the mini calculator toggle next to the amount box for quick multi-item sums.',
      },
    },
    {
      id: 'sl-step-4-breakdown',
      page: 'smartlog',
      badgeType: 'tip',
      selectors: ['.ak-breakdown-card', '#ak-breakdown-heading', '#ak-coach-heading'],
      spotlightSelector: '.ak-breakdown-card',
      title: {
        th: '4/5 กราฟเทียบสัดส่วน & กรอบงบจัดการความเสี่ยง',
        en: '4/5 Breakdown Charts & Safe Protection Cap',
      },
      body: {
        th: 'ฝั่งนี้สลับดูกราฟ "แท่ง" หรือ "วงกลม" เพื่อเช็กว่าเงินไหลไปหมวดไหนมากที่สุด ส่วนการ์ดด้านล่าง ("กรอบงบจัดการความเสี่ยง") จะคำนวณเพดานงบ 10–15% ของรายได้เพื่อไม่ให้จ่ายค่าเบี้ยเกินตัว',
        en: 'Switch between Bar and Donut charts to see where cash flows most. Below it, your Safe Protection Cap suggests a comfortable 10–15% limit.',
      },
      plainTip: {
        th: 'กรอบงบนี้คำนวณอัตโนมัติจากตัวเลขที่คุณจดไว้ ไม่ต้องนั่งกดสูตรเทียบเปอร์เซ็นต์เอง',
        en: 'The budget cap updates dynamically from your entries with zero manual formulas.',
      },
    },
    {
      id: 'sl-step-5-ledger-export',
      page: 'smartlog',
      badgeType: 'core',
      selectors: ['#smartlog-export-excel-btn', '#ledger-view-mode-calendar', '.ak-ledger-card'],
      spotlightSelector: '#smartlog-export-excel-btn',
      title: {
        th: '5/5 สมุดบัญชี, ปฏิทินรายวัน และส่งออก Excel / CSV',
        en: '5/5 Ledger List, Calendar View & Excel/CSV Export',
      },
      body: {
        th: 'เลื่อนลงมาด้านล่างจะเจอรายการทั้งหมด สลับดูแบบ "รายการ" หรือ "ปฏิทิน" ค้นหาตามชื่อ และกดปุ่มสีเขียว "ส่งออก .xlsx" (หรือ CSV ข้างกัน) เพื่อดาวน์โหลดไฟล์ตารางภาษาไทยสวย ๆ ไปเปิดต่อใน Excel ได้เลย',
        en: 'Switch between List and Calendar views, filter or search entries, and use the green Excel (.xlsx) or CSV button right here to export clean bilingual reports.',
      },
      plainTip: {
        th: 'ไฟล์ .xlsx มีให้ครบ 2 ชีตทั้งตารางรายการและหน้าสรุปรายรับ-จ่าย พร้อมใช้งานทันที',
        en: 'The exported .xlsx includes 2 organized sheets (Ledger + Summary).',
      },
    },
  ],

  'risk-analysis': [
    {
      id: 'ra-step-1-profile',
      page: 'risk-analysis',
      badgeType: 'core',
      selectors: ['#ra-profile-heading', '#ra-age-input'],
      spotlightSelector: '[aria-labelledby="ra-profile-heading"]',
      prepareDom: () => {
        document.querySelector('#risk-analysis-mode-input')?.click?.();
      },
      title: {
        th: '1/4 ข้อมูลส่วนตัวและภาระการเงินเบื้องต้น',
        en: '1/4 Personal Profile & Financial Obligations',
      },
      body: {
        th: 'ตรวจสอบอายุ (เกณฑ์ First Jobber 21–30 ปี), รายได้-รายจ่าย, เงินสำรอง และจำนวนคนที่ต้องดูแล (พ่อแม่/ครอบครัว) รวมถึงค่างวดหนี้สินต่อเดือน ข้อมูลนี้ช่วยให้ระบบคำนวณความเสี่ยงเฉพาะตัวได้แม่นยำขึ้น',
        en: 'Review your age (First Jobber range 21–30), income/expenses, reserve, dependents, and monthly debt payments so calculations match your real responsibilities.',
      },
      plainTip: {
        th: 'ถ้ายังไม่มีหนี้สินและไม่ได้ส่งเงินให้ใคร ใช้ค่าเริ่มต้น 0 ได้เลยครับ',
        en: 'If you have zero debt or dependents, leaving them at 0 works perfectly.',
      },
    },
    {
      id: 'ra-step-2-coverage',
      page: 'risk-analysis',
      badgeType: 'core',
      selectors: ['#ra-coverage-heading', '#ra-group-unknown-btn'],
      spotlightSelector: '[aria-labelledby="ra-coverage-heading"]',
      title: {
        th: '2/4 ติ๊กสวัสดิการที่มี (จำวงเงินไม่ได้ก็เช็กได้)',
        en: '2/4 Tick Existing Benefits (Even Without Exact Limits)',
      },
      body: {
        th: 'เลือกสิทธิที่มีอยู่ตอนนี้ เช่น ประกันสังคม ม.33, บัตรทอง 30 บาท หรือประกันกลุ่มบริษัท หากจำตัวเลขวงเงินประกันกลุ่มของบริษัทไม่ได้ ให้กดปุ่ม "ยังไม่ทราบวงเงิน" ระบบจะเตือนเป็นจุดที่ควรทักถาม HR ให้แทน',
        en: 'Tick benefits like SSO Sec. 33, Gold Card, or Company Group Cover. Unsure about your company limit? Select "Unknown limit" to flag HR verification cleanly.',
      },
      plainTip: {
        th: 'อย่าเพิ่งคิดซื้ออะไรเพิ่ม จนกว่าจะเช็กสิทธิฟรีที่มีอยู่แล้วในช่องนี้ให้ครบครับ',
        en: 'Always account for free existing benefits before considering extra coverage.',
      },
    },
    {
      id: 'ra-step-3-pillars',
      page: 'risk-analysis',
      badgeType: 'tip',
      selectors: ['#ra-pillars-heading', '.ra-pillars-section'],
      spotlightSelector: '#ra-pillars-heading',
      prepareDom: () => {
        document.querySelector('#risk-analysis-mode-results')?.click?.();
      },
      title: {
        th: '3/4 อ่านผลวิเคราะห์ 4 เสา & ช่องว่างความคุ้มครอง',
        en: '3/4 Read the 4 Risk Pillars & Protection Gaps',
      },
      body: {
        th: 'เมื่อสลับมาที่แท็บ "ผลวิเคราะห์" ระบบจะแยกคะแนนให้ดู 4 เรื่อง (สุขภาพ/อุบัติเหตุ/เงินสำรอง/ความรับผิดชอบ) เพื่อชี้ว่าจุดไหนสิทธิที่มีครอบคลุมแล้ว และจุดไหนยังมี "ช่องว่าง" หากเกิดเหตุฉุกเฉิน',
        en: 'The Results view breaks readiness into 4 clear pillars so you can immediately see where existing benefits suffice and where cash exposure remains.',
      },
      plainTip: {
        th: 'กดที่การ์ดแต่ละเสาเพื่อกางอ่านเหตุผลและวิธีคำนวณแบบภาษาคนได้ครับ',
        en: 'Click any pillar card to expand plain-language reasoning.',
      },
    },
    {
      id: 'ra-step-4-action-ics',
      page: 'risk-analysis',
      badgeType: 'core',
      selectors: ['#ra-action-heading', '#ra-download-ics-btn'],
      spotlightSelector: '[aria-labelledby="ra-action-heading"]',
      title: {
        th: '4/4 ลำดับสิ่งที่ควรทำก่อน-หลัง & ปฏิทินแจ้งเตือน',
        en: '4/4 Prioritized Action Plan & Calendar Reminder',
      },
      body: {
        th: 'ด้านล่างสุดสรุปเป็นลำดับ Action ที่ควรทำก่อน-หลังตามความเร่งด่วน (เช่น เติมเงินสำรองก่อน หรือเช็กวงเงิน HR ก่อนพิจารณาแผนเพิ่ม) พร้อมปุ่มดาวน์โหลดไฟล์ปฏิทิน (.ics) เตือนวันเช็กสิทธิหรือต่ออายุ',
        en: 'Ranks practical next actions by priority (e.g., build cash buffer first, ask HR before buying extra plans) plus an .ics calendar reminder download.',
      },
      plainTip: {
        th: 'ทำตามทีละข้อจากบนลงล่าง จะช่วยให้จัดการความเสี่ยงได้คุ้มงบที่สุด',
        en: 'Working top-to-bottom ensures maximum safety per baht spent.',
      },
    },
  ],

  invest: [
    {
      id: 'inv-step-1-tabs',
      page: 'invest',
      badgeType: 'core',
      selectors: ['.inv-header-card .liquid-tabs-surface', '#invest-calc-mode-transfer'],
      spotlightSelector: '.inv-header-card .liquid-tabs-surface',
      prepareDom: () => {
        document.querySelector('#invest-calc-mode-transfer')?.click?.();
      },
      title: {
        th: '1/4 แยก 2 เครื่องมือ: จำลองเข้าใจง่าย vs IRR ระยะยาว',
        en: '1/4 Two Modes: Simple Bill Check vs Long-Term IRR',
      },
      body: {
        th: 'แท็บแรก ("โอนเสี่ยง vs จ่ายเอง") อ่านเข้าใจง่ายมากสำหรับคนทั่วไป ส่วนแท็บ "คำนวณ IRR & ภาษี" เอาไว้ดูผลตอบแทน % ของแผนประกันออมทรัพย์ระยะยาว — หากแค่อยากจัดการเงินพื้นฐาน กดข้ามแท็บ 2 ได้เลยครับ',
        en: 'Tab 1 ("Transfer vs Self-Insure") is simple and visual for anyone. Tab 2 ("IRR & Tax") evaluates multi-year savings plans — optional if you focus on basics.',
      },
      plainTip: {
        th: 'ไม่ต้องกลัวคำว่า IRR เพราะแท็บ 1 ไม่มีศัพท์สถิติเลย และเห็นผลเป็นตัวเลขบาทตรง ๆ',
        en: 'Tab 1 uses plain Baht amounts with zero statistical jargon.',
      },
    },
    {
      id: 'inv-step-2-transfer',
      page: 'invest',
      badgeType: 'tip',
      selectors: ['#inv-t1-heading', '#inv-emergency-bill'],
      spotlightSelector: '[aria-labelledby="inv-t1-heading"]',
      title: {
        th: '2/4 ลองปรับบิลฉุกเฉิน ฿50k–฿300k ดูผลกระทบเงินสด',
        en: '2/4 Test ฿50k–฿300k Shock Bills Against Cash Reserve',
      },
      body: {
        th: 'ลองกดปุ่มราคาจำลอง (฿50,000 / ฿150,000 / ฿300,000) หรือเลื่อนแถบงบกันเสี่ยงต่อปี แล้วสังเกตฝั่งขวาเทียบกันระหว่าง "ควักเงินเก็บ+กู้ดอกเบี้ยจ่ายเองทั้งหมด" กับ "กันงบดูแลความเสี่ยงไว้ก่อน"',
        en: 'Tap ฿50k / ฿150k / ฿300k preset shock bills or adjust sliders to compare paying entirely out-of-pocket (+ loan interest) vs reserving a predictable budget.',
      },
      plainTip: {
        th: 'ดูตัวเลขบรรทัด "เงินสำรองฉุกเฉินคงเหลือ" เพื่อเช็กว่าหลังจ่ายบิลแล้วเรายังรอดกี่เดือน',
        en: 'Watch "Remaining Runway" on the right to see if your cushion survives the shock.',
      },
    },
    {
      id: 'inv-step-3-irr-inputs',
      page: 'invest',
      badgeType: 'optional',
      selectors: ['#inv-t2-heading', '#irr-annual-contrib'],
      spotlightSelector: '[aria-labelledby="inv-t2-heading"]',
      prepareDom: () => {
        document.querySelector('#invest-calc-mode-irr')?.click?.();
      },
      title: {
        th: '3/4 ช่องกรอกเบี้ย-เงินคืน & ลดหย่อนภาษี (ข้ามได้)',
        en: '3/4 Savings Plan Inputs & Tax Relief (Optional)',
      },
      body: {
        th: 'ในแท็บคำนวณ IRR คุณเลือกปุ่มตัวอย่างด้านบนหรือกรอกเบี้ยต่อปี จำนวนปีที่จ่าย เงินคืนระหว่างสัญญา เงินก้อนเมื่อครบ และรายได้ทั้งปี เพื่อให้เว็บคำนวณทั้ง IRR แท้จริงและเงินภาษีที่ประหยัดได้ให้อัตโนมัติ',
        en: 'Pick a preset or enter yearly premium, pay years, cashback, maturity lump sum, and annual income to compute both true IRR and Thai tax savings automatically.',
      },
      plainTip: {
        th: 'มีปุ่มแผนตัวอย่างด้านบนให้กดลองแทนการนั่งกรอกตัวเลขเองทุกช่องด้วยครับ',
        en: 'Use the quick plan presets at the top instead of typing every field manually.',
      },
    },
    {
      id: 'inv-step-4-timeline',
      page: 'invest',
      badgeType: 'optional',
      selectors: ['#inv-timeline-heading', '#inv-verdict-heading'],
      spotlightSelector: '[aria-labelledby="inv-timeline-heading"]',
      title: {
        th: '4/4 ไทม์ไลน์กระแสเงินสดรายปี & บทสรุปความคุ้มค่า',
        en: '4/4 Yearly Cashflow Timeline & Real Value Verdict',
      },
      body: {
        th: 'เลื่อนดูตารางปีที่ 1 ไปจนครบสัญญา (เลื่อนซ้าย-ขวาได้บนมือถือ) กดเลือกปีที่สนใจเพื่อดูยอดจ่ายและเงินรับคืนของปีนั้น พร้อมกล่องสรุปเปรียบเทียบว่าหลังหักเงินเฟ้อแล้วผลตอบแทนแท้จริงคุ้มไหม',
        en: 'Swipe horizontally across plan years, tap any year to inspect cashflows, and review the inflation-adjusted real return verdict below.',
      },
      plainTip: {
        th: 'บทสรุปจะแปลค่า IRR % เป็นข้อความสั้น ๆ ให้เลยว่าสูงกว่าหรือต่ำกว่าเงินฝาก/เงินเฟ้อ',
        en: 'The verdict translates IRR % into clear comparison notes against inflation.',
      },
    },
  ],

  game: [
    {
      id: 'gm-step-1-duration',
      page: 'game',
      badgeType: 'tip',
      selectors: ['#gm-duration-unit-days', '.gm-preset-grid'],
      spotlightSelector: '.gm-preset-grid',
      title: {
        th: '1/4 เลือกระยะเวลาจำลองสถานการณ์',
        en: '1/4 Choose Simulation Duration',
      },
      body: {
        th: 'มือใหม่แนะนำลองเล่นแบบ "30 วัน" ก่อน (ใช้เวลาแค่ ~1 นาที) เพื่อดูจังหวะการออกเหตุการณ์และผลกระทบต่อเงินสด เสร็จแล้วค่อยท้าทายตัวเองด้วยด่าน 90 หรือ 365 วัน',
        en: 'New players can start with "30 Days" (~1 min) to learn how surprise events impact cash reserves, then challenge 90 or 365 days.',
      },
      plainTip: {
        th: 'สลับหน่วยระหว่าง "รายวัน" และ "รายเดือน" ได้ตามถนัด',
        en: 'Switch cleanly between Daily and Monthly duration units.',
      },
    },
    {
      id: 'gm-step-2-persona',
      page: 'game',
      badgeType: 'tip',
      selectors: ['#gm-persona-default-btn'],
      spotlightSelector: '#gm-persona-default-btn',
      title: {
        th: '2/4 ทริกสำคัญ: เลือกตัวเลือก B หากยังไม่กรอกข้อมูลจริง',
        en: '2/4 Key Trick: Pick Option B If Your Data is Still ฿0',
      },
      body: {
        th: 'ถ้าคุณยังไม่ได้บันทึกรายรับใน 360Flow "ตัวเลือก A" จะเริ่มต้นที่ ฿0 ทุกช่อง ให้กดเลือก "ตัวเลือก B • โจทย์มาตรฐาน" ตรงนี้แทน เพื่อให้มีเงินเดือน ฿25,000 และเงินสำรอง ฿15,000 เริ่มเล่นได้เลย',
        en: 'If you haven’t logged income in 360Flow yet, Option A starts with ฿0. Choose "Option B • Challenge" here for a ready ฿25,000 income & ฿15,000 reserve setup.',
      },
      plainTip: {
        th: 'เมื่อจดข้อมูลจริงครบในภายหลัง ค่อยกลับมาเลือกตัวเลือก A เพื่อจำลองชีวิตจริงของคุณเอง',
        en: 'Come back to Option A later once your real 360Flow entries are filled in.',
      },
    },
    {
      id: 'gm-step-3-hr-strategy',
      page: 'game',
      badgeType: 'core',
      selectors: ['#gm-hr-bonus-toggle', '.gm-strategy-card'],
      spotlightSelector: '#gm-hr-bonus-toggle',
      title: {
        th: '3/4 แบ่งงบ 3 กอง & กดปุ่มฟรี "ทักถาม HR"',
        en: '3/4 Allocate 3 Buckets & Claim Free HR Check Bonus',
      },
      body: {
        th: 'ก่อนเริ่มเกมให้แบ่งเงินเหลือแต่ละเดือนลง 3 กอง (ออมฉุกเฉิน / โอนย้ายความเสี่ยง / ไลฟ์สไตล์) และอย่าลืมกดปุ่มฟรี "ทักแชตถามวงเงินประกันกลุ่มกับ HR" เพื่อปลดล็อกความคุ้มครองแฝง +฿50,000 ทันที',
        en: 'Distribute monthly surplus across Emergency, Protection, and Lifestyle, and tap the free "Ask HR" button to unlock +฿50,000 hidden company coverage.',
      },
      plainTip: {
        th: 'สอนนิสัยจริงที่ใช้ได้ทันทีในชีวิตทำงาน: รู้สิทธิที่มีจากบริษัทก่อนควักเงินซื้อเพิ่ม',
        en: 'Builds the real-world habit of verifying employer benefits before spending extra.',
      },
    },
    {
      id: 'gm-step-4-play',
      page: 'game',
      badgeType: 'core',
      selectors: ['#gm-start-simulation-btn'],
      spotlightSelector: '#gm-start-simulation-btn',
      title: {
        th: '4/4 กดเริ่มจำลอง & อ่านสรุปบทเรียนหลังจบด่าน',
        en: '4/4 Start Simulation & Review Your Debrief',
      },
      body: {
        th: 'ระหว่างเล่นจะสุ่มเจอเหตุการณ์ชีวิตจริง (ป่วย ซ่อมของ ฉุกเฉิน ฯลฯ) ให้เลือกทางรับมือแล้วดูกราฟเงินสด+ความสบายใจ เมื่อจบด่านมีสรุปเหตุการณ์ที่ช่วยเซฟเงินและปุ่มนำค่าไปปรับใน Risk Analysis ต่อ',
        en: 'Respond to surprise life events and watch Cash + Peace of Mind react. Afterward, review your debrief and carry lessons straight to Risk Analysis.',
      },
      plainTip: {
        th: 'เล่นจบ 1 รอบจะเห็นภาพชัดเจนขึ้นมากว่าทำไมต้องมีทั้งเงินสำรองและสิทธิคุ้มครองคู่กัน',
        en: 'One quick run clearly demonstrates why cash buffer and coverage reinforce each other.',
      },
    },
  ],

  learning: [
    {
      id: 'lc-step-1-guides',
      page: 'learning',
      badgeType: 'core',
      selectors: ['#learning-window-guides', '#lc-search-input', '.lc-window-controls-left'],
      spotlightSelector: '.lc-window-bar',
      prepareDom: () => {
        document.querySelector('#learning-window-guides')?.click?.();
      },
      title: {
        th: '1/3 บทความ 2 นาที (ค้นหาและกรองหัวข้อได้)',
        en: '1/3 2-Minute Plain-Language Guides',
      },
      body: {
        th: 'รวม 10 หัวข้อที่คนวัยเริ่มทำงานเจอบ่อยที่สุด เช่น กฎ 3 ขั้น, สิทธิ UCEP 72 ชม., สิทธิ ม.33, ลดหย่อนภาษีสรรพากร ใช้ปุ่มหมวดหมู่หรือช่องค้นหาด้านบนเพื่อเลือกอ่านเฉพาะเรื่องที่สงสัยในตอนนั้น',
        en: '10 bite-sized First Jobber guides (UCEP emergency rights, SSO Sec. 33, tax deductions). Filter by topic or search directly for whatever question came up.',
      },
      plainTip: {
        th: 'แต่ละบทออกแบบให้อ่านจบภายใน ~2 นาที ไม่มีศัพท์กฎหมายยาว ๆ',
        en: 'Every article takes ~2 minutes with zero dense legal jargon.',
      },
    },
    {
      id: 'lc-step-2-glossary',
      page: 'learning',
      badgeType: 'tip',
      selectors: ['#learning-window-glossary', '#lc-glossary-search'],
      spotlightSelector: '#learning-window-glossary',
      prepareDom: () => {
        document.querySelector('#learning-window-glossary')?.click?.();
      },
      title: {
        th: '2/3 แท็บ "แปลศัพท์" — พจนานุกรมภาษาคนธรรมดา',
        en: '2/3 "Glossary" Tab — Insurance Terms Translated',
      },
      body: {
        th: 'เจอกรมธรรม์หรือหน้าอื่นเขียนคำว่า OPD, IPD, Waiting Period, Pre-existing หรือ Co-payment แล้วงง ให้เปิดแท็บ "แปลศัพท์" นี้แล้วพิมพ์ค้นหา จะเห็นคำอธิบายสั้น ๆ พร้อมตัวอย่างจริงทันที',
        en: 'Whenever OPD, IPD, Waiting Period, Pre-existing, or Co-payment sounds confusing, switch to "Glossary" for instant plain-English examples.',
      },
      plainTip: {
        th: 'แนะนำให้เปิดแท็บนี้เวลาเทียบสวัสดิการบริษัทหรืออ่านกรมธรรม์ฉบับจริง',
        en: 'Handy reference anytime you read a company benefit handbook.',
      },
    },
    {
      id: 'lc-step-3-quiz',
      page: 'learning',
      badgeType: 'optional',
      selectors: ['#learning-window-quiz'],
      spotlightSelector: '#learning-window-quiz',
      prepareDom: () => {
        document.querySelector('#learning-window-quiz')?.click?.();
      },
      title: {
        th: '3/3 แท็บ "ควิซความรู้" (เลือกทำ 5 หรือ 10 ข้อได้)',
        en: '3/3 Literacy Quiz (Choose 5 or 10 Questions)',
      },
      body: {
        th: 'อยากเช็กว่าเข้าใจเรื่องความเสี่ยงและสวัสดิการครบไหม เลือกได้เลยว่าจะลองทำชุด 5 ข้อ หรือ 10 ข้อ (สุ่มจากคลัง 30 ข้อ) พร้อมคำอธิบายเหตุผลทุกข้อ',
        en: 'Pick a quick 5-question or 10-question set drawn from our 30-question bank, complete with instant explanations after every choice.',
      },
      plainTip: {
        th: 'ตอบผิดก็มีคำเฉลยอธิบายให้ทันที เพื่อเก็บเป็นทริกใช้จริงได้เลย',
        en: 'Immediate explanations turn every answer into a practical takeaway.',
      },
    },
  ],

  settings: [
    {
      id: 'st-step-1-display',
      page: 'settings',
      badgeType: 'core',
      selectors: ['#settings-sound-on', '[aria-labelledby="st-display-heading"]'],
      spotlightSelector: '[aria-labelledby="st-display-heading"]',
      title: {
        th: '1/3 ปรับภาษา ธีมสี ขนาดอักษร และเสียงกด',
        en: '1/3 Language, Theme, Text Scale & Click Sounds',
      },
      body: {
        th: 'ตั้งค่าความสบายตาและสบายหูได้ครบในกล่องนี้: สลับ ไทย/English, โหมดสว่าง/มืด, ขยายขนาดอักษรทั้งเว็บ 90–125% และเปิด/ปิดเสียงเอฟเฟกต์ตอนกด (พร้อมปุ่มทดลองฟัง 3 โทน)',
        en: 'Customize comfort across every tab: TH/EN language, Light/Dark mode, 90–125% global text scaling, and 3 tactile UI click sound effects.',
      },
      plainTip: {
        th: 'ถ้าตัวหนังสือในมือถือเล็กไป กดเพิ่มขนาดเป็น 112% ตรงนี้แล้วทุกหน้าจะขยายตามทันที',
        en: 'Switching scale to 112% resizes text proportionally across the entire app.',
      },
    },
    {
      id: 'st-step-2-profile',
      page: 'settings',
      badgeType: 'tip',
      selectors: ['#settings-start-tutorial-btn', '#settings-edit-profile-btn'],
      spotlightSelector: '[aria-labelledby="st-profile-heading"]',
      title: {
        th: '2/3 โปรไฟล์ & เรียกดู Tutorial / หน้าต้อนรับซ้ำ',
        en: '2/3 Personal Profile & Replay Tutorials',
      },
      body: {
        th: 'แก้ไขชื่อ อาชีพ เป้าเงินสำรอง หรือกดเปิดหน้าต้อนรับเริ่มต้นใช้งานอีกครั้งได้ที่นี่ รวมถึงปุ่มเปิด "เริ่มฝึกสอนใช้งาน" และรีเซ็ตแถบแนะนำเฉพาะหน้าเมื่อต้องการทบทวนใหม่',
        en: 'Update your name, occupation, reserve goal, replay the Welcome screen, or launch tutorials anytime from here.',
      },
      plainTip: {
        th: 'คำทักทาย เช้า/บ่าย/เย็น/ค่ำ ด้านขวาอ้างอิงเวลาจริงแบบ 24 ชั่วโมงของคุณ',
        en: 'The live 24-hour greeting adjusts automatically across morning, afternoon, evening, and night.',
      },
    },
    {
      id: 'st-step-3-data-demo',
      page: 'settings',
      badgeType: 'core',
      selectors: ['#load-sample-scenario-btn', '[aria-labelledby="st-data-heading"]'],
      spotlightSelector: '#load-sample-scenario-btn',
      title: {
        th: '3/3 ปุ่ม "ใส่ค่าสมมติคำนวณ" & สำรองข้อมูลในเครื่อง',
        en: '3/3 One-Tap "Sample Scenario" & Local Backup',
      },
      body: {
        th: 'ไม่อยากกรอกข้อมูลตั้งแต่ศูนย์? กดปุ่ม "ใส่ค่าสมมติคำนวณ" เพื่อโหลดข้อมูลตัวอย่าง "สมมติ ประกันภัย" ดูกราฟทุกหน้าก่อนได้ (และล้างกลับเป็น 0 ได้ตลอด) ส่วนด้านล่างมีปุ่มส่งออก Excel, สำรอง .json และรีเซ็ตค่า 0',
        en: 'Click "Load Sample" to preview every module with Sam Insure’s simulated numbers before typing your own, or export .xlsx / .json backups and reset anytime.',
      },
      plainTip: {
        th: 'ข้อมูลทุกตัวอยู่ใน localStorage ของเบราว์เซอร์คุณ 100% ไม่มีเซิร์ฟเวอร์ภายนอกเก็บข้อมูลส่วนตัว',
        en: '100% browser localStorage — zero external servers or tracking.',
      },
    },
  ],

  about: [
    {
      id: 'ab-step-1-overview',
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
        en: 'Explore the First Jobber survey findings behind PROTECT360 and our commitment to staying 100% independent with zero sales pitches.',
      },
      plainTip: {
        th: 'อยากกลับไปจดเงินหรือเช็กความเสี่ยง ใช้เมนูทางซ้าย (หรือแถบด้านล่างบนมือถือ) ได้ตลอดครับ',
        en: 'Jump back anytime using the left rail or mobile bottom navigation.',
      },
    },
  ],
};

// First-visit inline invite copy shown once per tab (Option A integration)
export const TAB_BANNER_META = {
  overview: {
    th: 'เพิ่งเข้าหน้าภาพรวมครั้งแรก — ให้ช่วยพาชี้จุดอ่านคะแนนความเสี่ยงและเงินสำรอง 4 ขั้นตอนไหม? (~25 วิ)',
    en: 'First time in Overview — take a 4-step walkthrough of your summary cards? (~25 sec)',
  },
  smartlog: {
    th: 'แท็บ 360Flow มีเครื่องมือเยอะมาก (สแกนสลิป, แยกเงินสำรอง, หมวดหมู่เอง, Excel) — ดูสอนใช้งาน 5 ขั้นไหม?',
    en: '360Flow packs 5 tools (Slip Scan, Reserve vs Expense, Custom Categories, Excel) — view the 5-step guide?',
  },
  'risk-analysis': {
    th: 'เพิ่งเข้าหน้าวิเคราะห์ความเสี่ยง — ให้ช่วยสอนวิธีติ๊กสิทธิและอ่านผล 4 ด้าน (4 ขั้นตอน) ไหม?',
    en: 'First time in Risk Analysis — walk through ticking benefits & reading the 4 pillars (4 steps)?',
  },
  invest: {
    th: 'หน้านี้มีทั้งจำลองบิลง่าย ๆ และ IRR ระยะยาว — ดูคู่มือ 4 ขั้นว่าตรงไหนสำคัญและตรงไหนข้ามได้ไหม?',
    en: 'Invest mixes simple bill checks with IRR math — view a 4-step guide on what’s essential vs optional?',
  },
  game: {
    th: 'ก่อนเริ่มเล่นเกมเอาตัวรอด — ดูทริกเลือกตัวละคร (ป้องกันเริ่มที่ ฿0) และสิทธิ HR ฟรี 4 ขั้นตอนไหม?',
    en: 'Before starting Survival Game — view a 4-step tip on starter persona & the free HR bonus?',
  },
  learning: {
    th: 'คลังความรู้มีทั้งบทความสั้นและ "แปลศัพท์ประกัน" — ดูวิธีใช้ 3 ขั้นตอนไว ๆ ไหม?',
    en: 'Learning Library includes bite-sized guides & a plain-English Glossary — view the 3-step tip?',
  },
  settings: {
    th: 'แท็บตั้งค่ามีปุ่ม "ใส่ค่าสมมติคำนวณ" และตัวปรับธีม/เสียง/ตัวอักษร — ดูแนะนำ 3 ขั้นตอนไหม?',
    en: 'Settings includes one-tap Sample Preview plus theme, sound & text scaling — view the 3-step guide?',
  },
};

export function getPageContextualSteps(pageId) {
  return PER_TAB_TUTORIAL_STEPS[pageId] || PER_TAB_TUTORIAL_STEPS.overview;
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

export function getSavedTabTutorialStatuses() {
  try {
    const raw = window.localStorage.getItem(TAB_TUTORIALS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveTabTutorialStatus(tabId, status) {
  const prev = getSavedTabTutorialStatuses();
  const next = { ...prev, [tabId]: status };
  try {
    window.localStorage.setItem(TAB_TUTORIALS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
  return next;
}

export function clearAllTabTutorialStatuses() {
  try {
    window.localStorage.removeItem(TAB_TUTORIALS_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
  return {};
}

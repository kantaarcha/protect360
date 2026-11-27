import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const FONT_STEPS = [
  { label: '90%', px: 14.4 },
  { label: '100%', px: 16 },
  { label: '112%', px: 18 },
  { label: '125%', px: 20 },
];

const TRANSLATIONS = {
  TH: {
    brand: {
      name: 'PROTECT360',
      tagline: 'พื้นที่กลางให้ความรู้ ไม่ขายประกัน',
      noSalesBadge: 'ไม่ขายประกัน',
      noSalesTitle: 'พื้นที่กลางด้านความรู้ทางการเงิน',
      noSalesDesc:
        'PROTECT360 ออกแบบขึ้นเพื่อการศึกษาและประเมินความเสี่ยงตามหลักคณิตศาสตร์ประกันภัยเท่านั้น ไม่มีการขายประกัน รับค่านายหน้า หรือแนะนำบริษัทใดเป็นพิเศษ',
      oicNote: 'ต้นแบบเพื่อการแข่งขันกรณีศึกษาด้านคณิตศาสตร์ประกันภัย (คปภ. / OIC)',
    },
    nav: {
      overview: 'ภาพรวม',
      smartlog: '360Flow',
      riskAnalysis: 'วิเคราะห์เสี่ยง',
      invest: 'ลงทุน (IRR)',
      game: 'เล่นเกม',
      learning: 'คลังความรู้',
      about: 'เกี่ยวกับเรา',
      settings: 'ตั้งค่า',
      menuLabel: 'เมนูหลัก',
      moreLabel: 'เพิ่มเติม',
    },
    controls: {
      decreaseFont: 'ลดขนาดตัวอักษร',
      increaseFont: 'เพิ่มขนาดตัวอักษร',
      resetFont: 'รีเซ็ตขนาดตัวอักษร',
      switchLang: 'สลับภาษา ไทย / อังกฤษ',
      lightMode: 'โหมดสว่าง',
      darkMode: 'โหมดมืด',
      switchTheme: 'สลับโหมดสว่าง / มืด',
    },
    header: {
      greeting: 'สวัสดี, First Jobber',
      philosophy: 'เห็นภาพเงินและความคุ้มครองของตัวเองชัดขึ้น เพื่อวางแผนชีวิตอย่างอุ่นใจในแบบของคุณ',
      profileChip: 'โปรไฟล์ตัวอย่าง: สมมติ ประกันภัย',
      savedLocally: 'บันทึกในเครื่องแล้ว',
      savedLocallyTitle: 'ข้อมูลทั้งหมดเก็บไว้ในอุปกรณ์นี้เท่านั้น (PDPA-Safe / Zero-Login) คลิกเพื่อจัดการข้อมูล',
      editProfile: 'แก้ไขโปรไฟล์',
      cardHolderCaption: 'โปรไฟล์ของคุณ',
      logCashflowCta: 'บันทึกรายรับ - จ่าย',
      manageData: 'จัดการข้อมูล',
    },
    overview: {
      // Card 1
      emergencyTitle: 'เงินออมฉุกเฉินพร้อมใช้',
      emergencySub: 'สภาพคล่องที่ใช้ได้ทันทีเมื่อเกิดเหตุไม่คาดฝัน',
      runwayPrefix: 'รองรับได้',
      runwayUnit: 'เดือน',
      ctaGap: 'เช็ก Protection Gap',
      ctaLog: 'บันทึกรายรับ-จ่าย',

      // Card 2
      metricIncome: 'รายรับต่อเดือน',
      metricExpenses: 'รายจ่ายต่อเดือน',
      metricSavings: 'เงินออมต่อเดือน',
      metricPremium: 'เบี้ยประกันส่วนตัว',
      perMonth: '/ เดือน',
      noPersonalPolicy: 'ยังไม่มีกรมธรรม์',
      ofIncome: 'ของรายได้',

      // Card 3
      goalTitle: 'เป้าหมายเงินสำรอง 3 เดือน',
      goalTargetLabel: 'เป้าหมาย 3 เดือน',
      goalSaved: 'สะสมแล้ว',
      goalRemaining: 'ยังขาดอีก',
      goalFormula: 'อ้างอิงจากรายจ่าย ฿20,000 × 3 เดือน',

      // Card 4
      chartTitle: 'ความคุ้มครองที่มีจริง vs ที่ควรมี',
      chartSubtitle: 'เปรียบเทียบ 6 หมวดความเสี่ยงสำคัญ (หน่วย: บาท)',
      legendEffective: 'ความคุ้มครองที่มีจริง',
      legendNeeded: 'ความคุ้มครองที่ควรมี',
      conservativeTag: 'ประเมินแบบระมัดระวัง: สิทธิไม่ทราบวงเงิน = ฿0',
      totalGapLabel: 'ช่องว่างความคุ้มครองรวม',
      gapLabel: 'ช่องว่าง (Gap)',
      coverageRatioLabel: 'ครอบคลุมแล้ว',
      hoverHint: 'วางเมาส์หรือแตะแท่งกราฟเพื่อดูรายละเอียด',

      // Card 5
      cardsTitle: 'สิทธิและกรมธรรม์ของฉัน',
      addCoverage: 'เพิ่มสิทธิ',
      activeStatus: 'ใช้งานอยู่',
      unknownLimitStatus: 'ไม่ทราบวงเงิน',
      effectiveZeroNote: 'นับเป็น ฿0 (ประเมินแบบระมัดระวัง)',
      tapToUpdate: 'คลิกเพื่อระบุวงเงิน',
      personalNoneNote: 'เบี้ยประกันส่วนตัว: ฿0 / เดือน (ยังไม่ทำเพิ่มเติม)',
      cardHolderLabel: 'ผู้ถือสิทธิ',
      editCardHolderHint: 'แก้ไขชื่อผู้ถือบัตร',
      viewDetails: 'รายละเอียด',
      editLimitAction: 'ระบุวงเงิน',
      deleteCoverageBtn: 'ลบสิทธิ',
      emptyCoveragesTitle: 'ยังไม่มีสิทธิหรือกรมธรรม์ที่บันทึกไว้',
      emptyCoveragesSub: 'กด "เพิ่มสิทธิ" เพื่อเริ่มคำนวณความคุ้มครองของคุณ',

      // Card 6
      riskSectionTitle: 'สถานะความเสี่ยงรายหมวด',
      riskHigh: 'เสี่ยงสูง',
      riskModerate: 'ปานกลาง',
      riskLow: 'ความเสี่ยงต่ำ',
      riskHealthTitle: 'สุขภาพ & อุบัติเหตุ',
      riskHealthDesc: 'ประกันกลุ่มไม่ทราบวงเงิน ควรตรวจสอบสิทธิจริง',
      riskIncomeTitle: 'รายได้ & ฉุกเฉิน',
      riskIncomeDesc: 'เงินสำรองต่ำกว่าเกณฑ์ 3 เดือน (0.75 เดือน)',
      riskAssetsTitle: 'ทรัพย์สิน & รถ',
      riskAssetsDesc: 'ภาระทรัพย์สินยังต่ำ ควรวางแผนก่อนก่อหนี้ใหญ่',

      // Card 7
      activitiesTitle: 'รายการเคลื่อนไหวล่าสุด',
      searchPlaceholder: 'ค้นหารายการ หรือหมวดหมู่...',
      filterAll: 'ทั้งหมด',
      filterIncome: 'รายรับ',
      filterExpense: 'รายจ่าย',
      filterSaving: 'เงินออม',
      colItem: 'รายการ',
      colCategory: 'หมวดหมู่',
      colDate: 'วันที่',
      colAmount: 'จำนวนเงิน',
      colStatus: 'สถานะ',
      statusCompleted: 'สำเร็จ',
      emptySearch: 'ไม่พบรายการที่ตรงกับคำค้นหา',
      viewAllActivities: 'ดูทั้งหมด & บันทึกเพิ่มใน 360Flow',
    },
    modal: {
      addTitle: 'เพิ่มสิทธิหรืออัปเดตวงเงินความคุ้มครอง',
      editGroupTitle: 'แก้ไขรายละเอียดสิทธิ / กรมธรรม์',
      subtitle:
        'ระบบใช้หลักการประเมินแบบระมัดระวัง (Conservative Estimation): หากไม่ทราบวงเงินจะคำนวณเป็น ฿0 เพื่อไม่ให้ประเมินความเสี่ยงต่ำเกินจริง',
      policyName: 'ชื่อสิทธิ / กรมธรรม์',
      policyNamePlaceholder: 'เช่น ประกันสุขภาพเหมาจ่าย หรือ ประกันอุบัติเหตุ (PA)',
      providerType: 'ประเภทแหล่งความคุ้มครอง',
      typePersonal: 'ประกันส่วนตัว (Personal)',
      typeEmployer: 'สวัสดิการนายจ้าง (Employer)',
      typeStatutory: 'สิทธิภาครัฐ (Statutory)',
      limitKnownLabel: 'ทราบวงเงินคุ้มครองที่ชัดเจนหรือไม่?',
      knownYes: 'ทราบวงเงิน',
      knownNo: 'ไม่ทราบวงเงิน (นับเป็น ฿0)',
      medicalLimit: 'วงเงินค่ารักษาพยาบาล (บาท)',
      accidentLimit: 'วงเงินอุบัติเหตุ (บาท)',
      ciLimit: 'วงเงินโรคร้ายแรง (บาท)',
      monthlyPremium: 'เบี้ยประกันที่จ่ายเองต่อเดือน (บาท)',
      cancel: 'ยกเลิก',
      save: 'บันทึกและอัปเดตกราฟ',
      cardHolderPreview: 'ชื่อผู้ถือสิทธิบนบัตร',
      deletePolicy: 'ลบสิทธินี้',
      confirmDeleteTitle: 'แน่ใจหรือไม่ที่จะลบสิทธินี้?',
      confirmDeleteDesc: 'เมื่อลบแล้ว ระบบจะคำนวณช่องว่างความคุ้มครอง (Protection Gap) ใหม่ทันที',
      confirmDeleteBtn: 'ยืนยันการลบ',
    },
    profileModal: {
      title: 'โปรไฟล์และความเป็นส่วนตัว',
      subtitle: 'ปรับข้อมูลเฉพาะบุคคลเพื่อคำนวณเป้าหมายเงินสำรองและความคุ้มครองแบบเรียลไทม์',
      tabProfile: 'ข้อมูลส่วนตัว',
      tabPrivacy: 'จัดการข้อมูล & ความเป็นส่วนตัว',
      previewHeader: 'ตัวอย่างบัตรความคุ้มครอง PROTECT360',
      previewCardTag: 'PROTECT360 • สิทธิส่วนบุคคล',
      previewHolderLabel: 'ผู้ถือบัตร (CARD HOLDER)',
      titlePrefix: 'คำนำหน้า',
      firstName: 'ชื่อ (ไทย / อังกฤษ)',
      firstNamePlaceholder: '',
      lastName: 'นามสกุล (ไทย / อังกฤษ)',
      lastNamePlaceholder: '',
      age: 'อายุ (ปี)',
      occupation: 'อาชีพ',
      dependents: 'จำนวนคนในความดูแล',
      dependentsHint: 'ใช้ปรับเกณฑ์ความคุ้มครองภาระครอบครัวในกราฟอัตโนมัติ (+฿200,000 ต่อคน)',
      dependentsUnit: 'คน',
      emergencyGoal: 'เป้าหมายเงินสำรองฉุกเฉิน',
      goal3Months: '3 เดือน',
      goal3Desc: 'มาตรฐานวัยเริ่มทำงาน',
      goal6Months: '6 เดือน',
      goal6Desc: 'อุ่นใจพิเศษ / รายได้ไม่แน่นอน',
      saveBtn: 'บันทึกข้อมูล',
      cancelBtn: 'ปิด',
      pdpaTitle: 'Zero-Login & PDPA-Safe',
      pdpaNotice:
        'ข้อมูลทั้งหมดถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น ไม่มีการส่งขึ้นเซิร์ฟเวอร์ (PDPA-Safe / Zero-Login)',
      pdpaBullet1: 'ไม่เก็บอีเมล เบอร์โทรศัพท์ เลขบัตรประชาชน หรือรหัสผ่าน',
      pdpaBullet2: 'บันทึกอัตโนมัติลงเบราว์เซอร์ (localStorage) รีเฟรชหน้าแล้วข้อมูลไม่หาย',
      pdpaBullet3: 'ย้ายเครื่องหรือสำรองแผนการเงินได้ทันทีด้วยไฟล์ .json',
      exportTitle: 'สำรองข้อมูล (Export .json)',
      exportDesc: 'ดาวน์โหลดโปรไฟล์ รายการเงิน และแผนความคุ้มครองปัจจุบันเก็บไว้เป็นไฟล์สำรอง',
      exportBtn: 'ดาวน์โหลด .json',
      importTitle: 'กู้คืนข้อมูล (Import .json)',
      importDesc: 'อัปโหลดไฟล์สำรอง PROTECT360 (.json) เพื่อกู้คืนข้อมูลบนเครื่องอื่นทันที',
      importBtn: 'เลือกไฟล์ .json',
      resetTitle: 'รีเซ็ตค่าเริ่มต้น (Reset Demo Data)',
      resetDesc: 'ล้างค่าที่แก้ไขทั้งหมดให้กลับไปเป็น 0 / 00.00 หรือโหลดโปรไฟล์ตัวอย่างสมมติ ประกันภัย',
      resetBtn: 'รีเซ็ตค่าเริ่มต้น',
      resetConfirmBtn: 'กดยืนยันอีกครั้งเพื่อรีเซ็ต',
      resetCancelHint: 'ยกเลิก',
    },
    placeholder: {
      readyBadge: 'พร้อมเชื่อมต่อใน Round 2–6',
      readyTitle: 'โมดูลนี้พร้อมสำหรับการพัฒนาต่อยอดในรอบถัดไป',
      readySubtitle:
        'โครงสร้าง Layout, ระบบสลับภาษา TH/EN, ตัวปรับขนาดตัวอักษร A-/A+ และศูนย์กลางข้อมูลการเงิน (FinanceContext) เชื่อมต่อไว้เรียบร้อยแล้ว',
      liveContextTitle: 'ข้อมูลที่เชื่อมต่อสดจาก FinanceContext',
      plannedTitle: 'ขอบเขตฟีเจอร์ที่วางแผนไว้ในโมดูลนี้',
      backToOverview: 'กลับไปหน้าภาพรวม',
    },
  },
  EN: {
    brand: {
      name: 'PROTECT360',
      tagline: 'Neutral Financial & Risk Coach — Not an Insurance Sales Site',
      noSalesBadge: 'No Sales',
      noSalesTitle: 'Neutral Financial Education Platform',
      noSalesDesc:
        'PROTECT360 is strictly an educational and actuarial risk assessment prototype. No insurance sales, brokerage commissions, or brand promotions.',
      oicNote: 'Actuarial Case Competition Prototype (OIC Thailand / คปภ.)',
    },
    nav: {
      overview: 'Overview',
      smartlog: '360Flow',
      riskAnalysis: 'Risk Analysis',
      invest: 'Invest (IRR)',
      game: 'Game',
      learning: 'Learning Center',
      about: 'About',
      settings: 'Settings',
      menuLabel: 'Navigation',
      moreLabel: 'More',
    },
    controls: {
      decreaseFont: 'Decrease font size',
      increaseFont: 'Increase font size',
      resetFont: 'Reset font size',
      switchLang: 'Switch language TH / EN',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      switchTheme: 'Switch light / dark theme',
    },
    header: {
      greeting: 'Hello, First Jobber',
      philosophy: 'See your money and protection clearly, so you can plan ahead with quiet confidence.',
      profileChip: 'Sample Profile: Sommut Prakanphai (25k THB/mo)',
      savedLocally: 'Saved locally',
      savedLocallyTitle: 'All data stays 100% on your device (PDPA-Safe / Zero-Login). Click to manage data.',
      editProfile: 'Edit Profile',
      cardHolderCaption: 'Your Profile',
      logCashflowCta: 'Log Income & Expenses',
      manageData: 'Manage Data',
    },
    overview: {
      // Card 1
      emergencyTitle: 'Liquid Emergency Fund',
      emergencySub: 'Immediate cash buffer available for unexpected shocks',
      runwayPrefix: '',
      runwayUnit: 'Mo. Runway',
      ctaGap: 'Check Protection Gap',
      ctaLog: 'Log Cashflow',

      // Card 2
      metricIncome: 'Monthly Income',
      metricExpenses: 'Monthly Expenses',
      metricSavings: 'Monthly Savings',
      metricPremium: 'Self-Paid Premium',
      perMonth: '/ mo',
      noPersonalPolicy: 'No personal policy',
      ofIncome: 'of income',

      // Card 3
      goalTitle: '3-Month Emergency Goal',
      goalTargetLabel: '3-Month Target',
      goalSaved: 'Saved',
      goalRemaining: 'Remaining',
      goalFormula: 'Based on ฿20,000 expenses × 3 months',

      // Card 4
      chartTitle: 'Effective Available vs. Needed Coverage',
      chartSubtitle: 'Protection comparison across 6 key risk categories (THB)',
      legendEffective: 'Effective Available',
      legendNeeded: 'Needed Coverage',
      conservativeTag: 'Conservative Est.: Unknown limit counted as ฿0',
      totalGapLabel: 'Total Protection Gap',
      gapLabel: 'Protection Gap',
      coverageRatioLabel: 'Covered',
      hoverHint: 'Hover or tap bars to inspect actuarial details',

      // Card 5
      cardsTitle: 'My Coverage Cards',
      addCoverage: 'Add',
      activeStatus: 'Active',
      unknownLimitStatus: 'Unknown Limit',
      effectiveZeroNote: 'Counted as ฿0 (Conservative Est.)',
      tapToUpdate: 'Click to enter limit',
      personalNoneNote: 'Personal Insurance: ฿0 / mo (None active)',
      cardHolderLabel: 'Card Holder',
      editCardHolderHint: 'Edit card holder name',
      viewDetails: 'Details',
      editLimitAction: 'Enter limit',
      deleteCoverageBtn: 'Delete',
      emptyCoveragesTitle: 'No coverage records yet',
      emptyCoveragesSub: 'Tap "Add" to start mapping your protection.',

      // Card 6
      riskSectionTitle: 'Risk Status Overview',
      riskHigh: 'High Risk',
      riskModerate: 'Moderate',
      riskLow: 'Low Risk',
      riskHealthTitle: 'Health & Accident',
      riskHealthDesc: 'Group limit unknown — verify actual hospital cap',
      riskIncomeTitle: 'Income & Emergency',
      riskIncomeDesc: 'Runway below 3-month benchmark',
      riskAssetsTitle: 'Assets & Auto',
      riskAssetsDesc: 'Low current exposure — plan ahead of major debt',

      // Card 7
      activitiesTitle: 'Recent Activities',
      searchPlaceholder: 'Search transactions or categories...',
      filterAll: 'All',
      filterIncome: 'Income',
      filterExpense: 'Expenses',
      filterSaving: 'Savings',
      colItem: 'Activity',
      colCategory: 'Category',
      colDate: 'Date',
      colAmount: 'Amount',
      colStatus: 'Status',
      statusCompleted: 'Completed',
      emptySearch: 'No matching activities found',
      viewAllActivities: 'View all & log in 360Flow',
    },
    modal: {
      addTitle: 'Add Coverage or Update Benefit Limit',
      editGroupTitle: 'Edit Coverage Details',
      subtitle:
        'Using Conservative Estimation: any coverage with an unknown limit is valued at ฿0 so your protection gap is never underestimated.',
      policyName: 'Coverage / Policy Name',
      policyNamePlaceholder: 'e.g., Lump-Sum Health Plan or Personal Accident (PA)',
      providerType: 'Coverage Source',
      typePersonal: 'Personal Insurance',
      typeEmployer: 'Employer Benefit',
      typeStatutory: 'Statutory Benefit',
      limitKnownLabel: 'Do you know the exact coverage limit?',
      knownYes: 'Known Limit',
      knownNo: 'Unknown Limit (฿0 Est.)',
      medicalLimit: 'Medical Coverage Limit (THB)',
      accidentLimit: 'Accident Coverage Limit (THB)',
      ciLimit: 'Critical Illness Limit (THB)',
      monthlyPremium: 'Self-Paid Monthly Premium (THB)',
      cancel: 'Cancel',
      save: 'Save & Recalculate',
      cardHolderPreview: 'Card Holder on Policy',
      deletePolicy: 'Delete Policy',
      confirmDeleteTitle: 'Are you sure you want to delete this coverage?',
      confirmDeleteDesc: 'Your Protection Gap chart will recalculate immediately once removed.',
      confirmDeleteBtn: 'Confirm Delete',
    },
    profileModal: {
      title: 'Profile & PDPA Privacy',
      subtitle: 'Personalize your emergency target and protection benchmarks in real time',
      tabProfile: 'Personal Profile',
      tabPrivacy: 'Data & PDPA Privacy',
      previewHeader: 'Live PROTECT360 Coverage Card Preview',
      previewCardTag: 'PROTECT360 • MEMBER CARD',
      previewHolderLabel: 'CARD HOLDER',
      titlePrefix: 'Title',
      firstName: 'First Name (TH / EN)',
      firstNamePlaceholder: '',
      lastName: 'Last Name (TH / EN)',
      lastNamePlaceholder: '',
      age: 'Age',
      occupation: 'Occupation',
      dependents: 'Dependents',
      dependentsHint: 'Automatically adjusts your Family Support benchmark (+฿200,000 per dependent)',
      dependentsUnit: 'dependents',
      emergencyGoal: 'Emergency Fund Goal',
      goal3Months: '3 Months',
      goal3Desc: 'Standard First Jobber buffer',
      goal6Months: '6 Months',
      goal6Desc: 'Extra cushion / variable income',
      saveBtn: 'Save Profile',
      cancelBtn: 'Close',
      pdpaTitle: 'Zero-Login & PDPA-Safe',
      pdpaNotice:
        'All data stays 100% on your device. No server tracking. (PDPA-Safe / Zero-Login)',
      pdpaBullet1: 'No email, phone number, national ID, or password collected',
      pdpaBullet2: 'Automatically saved in local browser storage (localStorage)',
      pdpaBullet3: 'Export & restore your entire plan anytime as a portable .json file',
      exportTitle: 'Backup Data (Export .json)',
      exportDesc: 'Download your current profile, cashflow records, and coverage plan as a JSON file',
      exportBtn: 'Download .json',
      importTitle: 'Restore Data (Import .json)',
      importDesc: 'Upload a PROTECT360 backup (.json) file to restore your plan on another device',
      importBtn: 'Choose .json File',
      resetTitle: 'Reset All Data to 0',
      resetDesc: 'Clear all numbers back to 0 / 00.00 so you can enter your real finances',
      resetBtn: 'Reset to 0',
      resetConfirmBtn: 'Click again to confirm',
      resetCancelHint: 'Cancel',
    },
    placeholder: {
      readyBadge: 'Ready for Integration',
      readyTitle: 'This module shell is ready',
      readySubtitle: 'App shell, instant language switching, font scaling, and shared FinanceContext are fully wired.',
      liveContextTitle: 'Live Data Connected from FinanceContext',
      plannedTitle: 'Planned Capabilities for This Module',
      backToOverview: 'Back to Overview',
    },
  },
};

const LANG_STORAGE_KEY = 'protect360_lang';
const FONT_STORAGE_KEY = 'protect360_font_scale';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'TH' || saved === 'EN') return saved;
    } catch {
      // Ignore storage access errors
    }
    return 'TH';
  });

  const [fontStepIdx, setFontStepIdx] = useState(() => {
    try {
      const saved = window.localStorage.getItem(FONT_STORAGE_KEY);
      if (saved !== null) {
        const parsed = Number(saved);
        if (Number.isInteger(parsed) && parsed >= 0 && parsed < FONT_STEPS.length) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage access errors
    }
    return 1; // default 100% (16px)
  });

  useEffect(() => {
    document.documentElement.lang = lang === 'TH' ? 'th' : 'en';
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage access errors
    }
  }, [lang]);

  useEffect(() => {
    const step = FONT_STEPS[fontStepIdx] || FONT_STEPS[1];
    document.documentElement.style.fontSize = `${step.px}px`;
    try {
      window.localStorage.setItem(FONT_STORAGE_KEY, String(fontStepIdx));
    } catch {
      // Ignore storage access errors
    }
  }, [fontStepIdx]);

  const value = useMemo(() => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.TH;

    // Supports either dot-path key ("overview.emergencyTitle") or inline { th, en } object
    const t = (input) => {
      if (!input) return '';
      if (typeof input === 'object' && ('th' in input || 'en' in input)) {
        return lang === 'TH' ? (input.th ?? input.en ?? '') : (input.en ?? input.th ?? '');
      }
      if (typeof input === 'string') {
        const parts = input.split('.');
        let current = dict;
        for (const p of parts) {
          if (current && p in current) {
            current = current[p];
          } else {
            return input;
          }
        }
        return current;
      }
      return String(input);
    };

    const toggleLang = () => setLang((prev) => (prev === 'TH' ? 'EN' : 'TH'));
    const increaseFontSize = () =>
      setFontStepIdx((prev) => Math.min(FONT_STEPS.length - 1, prev + 1));
    const decreaseFontSize = () =>
      setFontStepIdx((prev) => Math.max(0, prev - 1));
    const resetFontSize = () => setFontStepIdx(1);

    return {
      lang,
      setLang,
      toggleLang,
      t,
      dict,
      fontSteps: FONT_STEPS,
      fontStepIdx,
      setFontStepIdx,
      fontScaleLabel: FONT_STEPS[fontStepIdx].label,
      canDecreaseFont: fontStepIdx > 0,
      canIncreaseFont: fontStepIdx < FONT_STEPS.length - 1,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
    };
  }, [lang, fontStepIdx]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

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
      switchLang: 'สลับภาษา ไทย / อังกฤษ / จีน',
      lightMode: 'โหมดสว่าง',
      darkMode: 'โหมดมืด',
      switchTheme: 'สลับโหมดสว่าง / มืด',
    },
    header: {
      greeting: 'สวัสดี, First Jobber',
      philosophy: 'เห็นภาพเงินและความคุ้มครองของตัวเองชัดขึ้น เพื่อวางแผนชีวิตอย่างอุ่นใจในแบบของคุณ',
      profileChip: 'โปรไฟล์ตัวอย่าง: วัยเริ่มทำงาน (First Jobber)',
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
      resetDesc: 'ล้างค่าที่แก้ไขทั้งหมดและกลับไปเป็นโปรไฟล์ตัวอย่าง First Jobber สำหรับพรีเซนต์',
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
      switchLang: 'Switch language TH / EN / ZH',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      switchTheme: 'Switch light / dark theme',
    },
    header: {
      greeting: 'Hello, First Jobber',
      philosophy: 'See your money and protection clearly, so you can plan ahead with quiet confidence.',
      profileChip: 'Sample Profile: First Jobber (25k THB/mo)',
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
  ZH: {
    brand: {
      name: 'PROTECT360',
      tagline: '中立金融与风险科普平台 • 绝不推销保险',
      noSalesBadge: '零推销',
      noSalesTitle: '中立金融教育与风险评估平台',
      noSalesDesc:
        'PROTECT360 仅用于金融教育和精算风险评估演示，绝不销售保单、不收取佣金，也不推荐任何商业保险公司。',
      oicNote: '精算案例竞赛教育原型（泰国保险委员会 OIC）',
    },
    nav: {
      overview: '总览',
      smartlog: '360Flow',
      riskAnalysis: '风险评估',
      invest: '投资 (IRR)',
      game: '生存模拟',
      learning: '知识库',
      about: '关于我们',
      settings: '设置',
      menuLabel: '主导航',
      moreLabel: '更多',
    },
    controls: {
      decreaseFont: '缩小字号',
      increaseFont: '放大字号',
      resetFont: '重置字号',
      switchLang: '切换语言 泰语 / 英语 / 中文',
      lightMode: '浅色模式',
      darkMode: '深色模式',
      switchTheme: '切换浅色 / 深色主题',
    },
    header: {
      greeting: '你好，First Jobber',
      philosophy: '清晰了解你的现金流与保障缺口，安心规划人生每一步。',
      profileChip: '示例档案：职场新人 (First Jobber)',
      savedLocally: '已本地保存',
      savedLocallyTitle: '所有数据仅保存在本设备 (PDPA 安全 / 无需登录)',
      editProfile: '编辑档案',
      cardHolderCaption: '个人档案',
      logCashflowCta: '记录收支 (360Flow)',
      manageData: '数据管理',
    },
    overview: {
      emergencyTitle: '可用应急储备金',
      emergencySub: '突发事件时可立即动用的流动资金',
      runwayPrefix: '可支撑',
      runwayUnit: '个月',
      ctaGap: '检查保障缺口',
      ctaLog: '记录收支',

      metricIncome: '月收入',
      metricExpenses: '月支出',
      metricSavings: '月结余',
      metricPremium: '自付保费',
      perMonth: '/ 月',
      noPersonalPolicy: '暂无个人保单',
      ofIncome: '占收入',

      goalTitle: '3 个月应急目标',
      goalTargetLabel: '3 个月目标',
      goalSaved: '已储蓄',
      goalRemaining: '还差',
      goalFormula: '按月支出 × 3 个月计算',

      chartTitle: '现有有效保障 vs 建议保障',
      chartSubtitle: '6 大核心风险保障对比（单位：泰铢）',
      legendEffective: '现有有效保障',
      legendNeeded: '建议保障额度',
      conservativeTag: '保守估算：未知额度按 ฿0 计算',
      totalGapLabel: '总保障缺口',
      gapLabel: '保障缺口',
      coverageRatioLabel: '已覆盖',
      hoverHint: '悬停或点击柱状图查看详情',

      cardsTitle: '我的保障与福利卡',
      addCoverage: '添加保障',
      activeStatus: '生效中',
      unknownLimitStatus: '额度未知',
      effectiveZeroNote: '按 ฿0 计入（保守估算）',
      tapToUpdate: '点击填写额度',
      personalNoneNote: '个人商业保险：฿0 / 月',
      cardHolderLabel: '持卡人',
      editCardHolderHint: '编辑持卡人姓名',
      viewDetails: '详情',
      editLimitAction: '填写额度',
      deleteCoverageBtn: '删除',
      emptyCoveragesTitle: '尚未记录任何保障或福利',
      emptyCoveragesSub: '点击“添加保障”开始计算你的保障覆盖率。',

      riskSectionTitle: '分类风险状态',
      riskHigh: '高风险',
      riskModerate: '中等',
      riskLow: '低风险',
      riskHealthTitle: '医疗与意外',
      riskHealthDesc: '建议核实团体险或个人医疗限额',
      riskIncomeTitle: '收入与应急金',
      riskIncomeDesc: '建议建立 3–6 个月应急备用金',
      riskAssetsTitle: '资产与车辆',
      riskAssetsDesc: '当前资产负债较低，提前做好规划',

      activitiesTitle: '最近收支记录',
      searchPlaceholder: '搜索项目或分类...',
      filterAll: '全部',
      filterIncome: '收入',
      filterExpense: '支出',
      filterSaving: '储蓄',
      colItem: '项目',
      colCategory: '分类',
      colDate: '日期',
      colAmount: '金额',
      colStatus: '状态',
      statusCompleted: '已完成',
      emptySearch: '未找到匹配的记录',
      viewAllActivities: '在 360Flow 查看全部并记账',
    },
    modal: {
      addTitle: '添加保障或更新额度',
      editGroupTitle: '编辑保障详情',
      subtitle: '遵循保守精算原则：未知保额按 ฿0 计算，避免低估真实保障缺口。',
      policyName: '保障 / 保单名称',
      policyNamePlaceholder: '例如：住院医疗险或个人意外险 (PA)',
      providerType: '保障来源',
      typePersonal: '个人保险',
      typeEmployer: '公司团体福利',
      typeStatutory: '国家基础社保',
      limitKnownLabel: '是否清楚具体保额？',
      knownYes: '已知额度',
      knownNo: '未知额度（按 ฿0 算）',
      medicalLimit: '医疗保额 (THB)',
      accidentLimit: '意外保额 (THB)',
      ciLimit: '重疾保额 (THB)',
      monthlyPremium: '自付月保费 (THB)',
      cancel: '取消',
      save: '保存并重新计算',
      cardHolderPreview: '保单持有人预览',
      deletePolicy: '删除保障',
      confirmDeleteTitle: '确定要删除这项保障吗？',
      confirmDeleteDesc: '删除后，保障缺口图表将立即重新计算。',
      confirmDeleteBtn: '确认删除',
    },
    profileModal: {
      title: '个人档案与隐私',
      subtitle: '自定义应急储备目标与保障基准，实时同步全站',
      tabProfile: '个人档案',
      tabPrivacy: '数据与隐私',
      previewHeader: 'PROTECT360 保障卡实时预览',
      previewCardTag: 'PROTECT360 • MEMBER CARD',
      previewHolderLabel: 'CARD HOLDER',
      titlePrefix: '称谓',
      firstName: '名字 (泰 / 英 / 中)',
      firstNamePlaceholder: '',
      lastName: '姓氏 (选填)',
      lastNamePlaceholder: '',
      age: '年龄',
      occupation: '职业',
      dependents: '扶养人数',
      dependentsHint: '自动调整家庭责任基准（每人 +฿200,000）',
      dependentsUnit: '人',
      emergencyGoal: '应急储备目标',
      goal3Months: '3 个月',
      goal3Desc: '职场新人标准缓冲',
      goal6Months: '6 个月',
      goal6Desc: '更充足保障 / 弹性收入',
      saveBtn: '保存档案',
      cancelBtn: '关闭',
      pdpaTitle: '无需登录 & PDPA 本地隐私',
      pdpaNotice: '所有数据 100% 仅保存在本设备，不上传服务器。',
      pdpaBullet1: '不收集邮箱、手机号、身份证号或密码',
      pdpaBullet2: '自动保存在浏览器本地存储 (localStorage)',
      pdpaBullet3: '随时导出或导入 .json 备份文件',
      exportTitle: '备份数据 (导出 .json)',
      exportDesc: '将档案、360Flow 账本与保障记录下载为 JSON 文件',
      exportBtn: '下载 .json',
      importTitle: '恢复数据 (导入 .json)',
      importDesc: '上传 PROTECT360 备份文件 (.json) 恢复数据',
      importBtn: '选择 .json 文件',
      resetTitle: '重置所有数值为 0',
      resetDesc: '将全部字段清空归零，方便重新填写真实数据',
      resetBtn: '清空归零',
      resetConfirmBtn: '再次点击确认',
      resetCancelHint: '取消',
    },
    placeholder: {
      readyBadge: '已就绪',
      readyTitle: '模块已就绪',
      readySubtitle: '支持三语切换、字号缩放与本地数据同步。',
      liveContextTitle: '实时连接 FinanceContext 数据',
      plannedTitle: '计划功能',
      backToOverview: '返回总览',
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
      if (saved === 'TH' || saved === 'EN' || saved === 'ZH') return saved;
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
    document.documentElement.lang = lang === 'TH' ? 'th' : lang === 'ZH' ? 'zh-Hans' : 'en';
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

    // Supports either dot-path key ("overview.emergencyTitle") or inline { th, en, zh } object
    const t = (input) => {
      if (!input) return '';
      if (typeof input === 'object' && ('th' in input || 'en' in input || 'zh' in input)) {
        if (lang === 'TH') return input.th ?? input.en ?? input.zh ?? '';
        if (lang === 'ZH') return input.zh ?? input.en ?? input.th ?? '';
        return input.en ?? input.th ?? input.zh ?? '';
      }
      if (typeof input === 'string') {
        const parts = input.split('.');
        let current = dict;
        for (const p of parts) {
          if (current && p in current) {
            current = current[p];
          } else {
            // Fallback gracefully to EN if a key is missing in ZH
            let fallback = TRANSLATIONS.EN;
            for (const fp of parts) {
              if (fallback && fp in fallback) fallback = fallback[fp];
              else return input;
            }
            return fallback;
          }
        }
        return current;
      }
      return String(input);
    };

    const toggleLang = () =>
      setLang((prev) => (prev === 'TH' ? 'EN' : prev === 'EN' ? 'ZH' : 'TH'));
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

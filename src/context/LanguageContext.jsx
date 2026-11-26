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
      autokey: 'AutoKey',
      riskAnalysis: 'Risk Analysis',
      invest: 'Invest (IRR)',
      game: 'Game',
      learning: 'คลังความรู้',
      about: 'หน้าหลัก & เกี่ยวกับเรา',
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
      philosophy: 'เข้าใจเงินของคุณ → เข้าใจความเสี่ยง → ตัดสินใจอย่างมั่นใจ',
      profileChip: 'โปรไฟล์ตัวอย่าง: วัยเริ่มทำงาน (First Jobber)',
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
    },
    modal: {
      addTitle: 'เพิ่มสิทธิหรืออัปเดตวงเงินความคุ้มครอง',
      editGroupTitle: 'อัปเดตวงเงินประกันกลุ่มบริษัท',
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
      autokey: 'AutoKey',
      riskAnalysis: 'Risk Analysis',
      invest: 'Invest (IRR)',
      game: 'Game',
      learning: 'Learning Center',
      about: 'Landing & About',
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
      philosophy: 'Understand Your Money → Understand Your Risks → Make Better Decisions',
      profileChip: 'Sample Profile: First Jobber (25k THB/mo)',
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

      // Card 6
      riskSectionTitle: 'Risk Status Overview',
      riskHigh: 'High Risk',
      riskModerate: 'Moderate',
      riskLow: 'Low Risk',
      riskHealthTitle: 'Health & Accident',
      riskHealthDesc: 'Group limit unknown — verify actual hospital cap',
      riskIncomeTitle: 'Income & Emergency',
      riskIncomeDesc: 'Runway below 3-month benchmark (0.75 mo.)',
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
    },
    modal: {
      addTitle: 'Add Coverage or Update Benefit Limit',
      editGroupTitle: 'Update Employer Group Insurance Limit',
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
    },
    placeholder: {
      readyBadge: 'Ready for Round 2–6 Integration',
      readyTitle: 'This module shell is ready for next-round buildout',
      readySubtitle:
        'Bento App Shell, instant TH/EN bilingual switching, A-/A+ accessibility scaler, and shared FinanceContext are fully wired.',
      liveContextTitle: 'Live Data Connected from FinanceContext',
      plannedTitle: 'Planned Capabilities for This Module',
      backToOverview: 'Back to Overview',
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('TH');
  const [fontStepIdx, setFontStepIdx] = useState(1); // default 100% (16px)

  useEffect(() => {
    document.documentElement.lang = lang === 'TH' ? 'th' : 'en';
  }, [lang]);

  useEffect(() => {
    const step = FONT_STEPS[fontStepIdx] || FONT_STEPS[1];
    document.documentElement.style.fontSize = `${step.px}px`;
  }, [fontStepIdx]);

  const value = useMemo(() => {
    const dict = TRANSLATIONS[lang];

    // Supports either dot-path key ("overview.emergencyTitle") or inline { th, en } object
    const t = (input) => {
      if (!input) return '';
      if (typeof input === 'object' && ('th' in input || 'en' in input)) {
        return lang === 'TH' ? input.th : input.en;
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
      fontStepIdx,
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

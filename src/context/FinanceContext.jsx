import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_OCCUPATION_TH,
  clampFirstJobberAge,
  normalizeOccupation,
  normalizeTitle,
} from '../utils/userHelpers';
import {
  buildInstantBilingualText,
  translateBilingualAsync,
} from '../utils/bilingualTranslate';
import {
  DEMO_RISK_PROFILE_DATA,
  INITIAL_RISK_PROFILE_DATA,
  computeActuarialRiskAssessment,
  getGovSchemeMeta,
  sanitizeRiskProfileData,
} from '../utils/riskActuarial';

const STORAGE_KEY = 'protect360_data_v2';

// Clean zero-slate defaults — real users start at 0 / 00.00 and enter their own numbers
const INITIAL_USER_PROFILE = {
  title: '',
  firstName: '',
  lastName: '',
  age: 25,
  occupation: DEFAULT_OCCUPATION_TH,
  dependents: 0,
  emergencyTargetMonths: 3,
};

const INITIAL_FINANCIALS = {
  personaName: { th: 'โปรไฟล์ของคุณ', en: 'My Profile' },
  monthlyIncome: 0,
  monthlyExpenses: 0,
  monthlySavings: 0,
  liquidEmergencyFund: 0,
};

const INITIAL_RISK_PROFILE = INITIAL_RISK_PROFILE_DATA;
const INITIAL_COVERAGES = [];
const INITIAL_TRANSACTIONS = [];

// Optional hypothetical sample scenario (explicitly labeled as simulated numbers in Local Storage mode)
const DEMO_USER_PROFILE = {
  title: '',
  firstName: 'สมมติ',
  lastName: 'ประกันภัย',
  age: 25,
  occupation: DEFAULT_OCCUPATION_TH,
  dependents: 0,
  emergencyTargetMonths: 3,
};

const DEMO_FINANCIALS = {
  personaName: { th: 'สมมติ ประกันภัย', en: 'Sam Insure' },
  monthlyIncome: 29500,
  monthlyExpenses: 21800,
  monthlySavings: 7700,
  liquidEmergencyFund: 43600,
};

const DEMO_CUSTOM_CATEGORIES = [
  {
    id: 'ccat-demo-side',
    type: 'income',
    iconName: 'briefcase',
    name: 'งานเสริม / OT',
    label: { th: 'งานเสริม / ค่าล่วงเวลา', en: 'Side Income & OT' },
  },
  {
    id: 'ccat-demo-util',
    type: 'expense',
    iconName: 'zap',
    name: 'น้ำ-ไฟ & เน็ตมือถือ',
    label: { th: 'น้ำ-ไฟ & เน็ตมือถือ', en: 'Utilities & Mobile' },
  },
  {
    id: 'ccat-demo-protect',
    type: 'expense',
    iconName: 'heart-pulse',
    name: 'ประกัน & สุขภาพ',
    label: { th: 'ประกัน & สุขภาพ', en: 'Insurance & Health' },
  },
  {
    id: 'ccat-demo-family',
    type: 'expense',
    iconName: 'gift',
    name: 'ให้ครอบครัว / สังคม',
    label: { th: 'ให้ครอบครัว / สังคม', en: 'Family & Social' },
  },
];

const DEMO_COVERAGES = [
  {
    id: 'sso-33',
    type: 'statutory',
    name: { th: 'ประกันสังคม ม.33 (สมมติ)', en: 'Social Security Sec. 33 (Sample)' },
    providerTag: { th: 'สิทธิภาครัฐ', en: 'Statutory' },
    cardNumberMask: 'SSO •••• 3301',
    subtitle: {
      th: 'รพ.ตามสิทธิ • สมทบ ฿750/ด.',
      en: 'Registered Hospital • ฿750/mo',
    },
    status: 'active',
    limitKnown: true,
    monthlyPremium: 0,
    theme: 'navy',
    benefits: {
      medical: 100000,
      accident: 50000,
      criticalIllness: 0,
      disability: 180000,
      incomeComp: 30000,
      family: 50000,
    },
  },
  {
    id: 'group-ins',
    type: 'employer',
    name: { th: 'ประกันกลุ่มบริษัท (สมมติ)', en: 'Employer Group Insurance (Sample)' },
    providerTag: { th: 'สวัสดิการบริษัท', en: 'Employer' },
    cardNumberMask: 'GRP •••• 1500',
    subtitle: {
      th: 'วงเงินค่ารักษา ฿150,000',
      en: 'Medical Limit ฿150,000',
    },
    status: 'active',
    limitKnown: true,
    monthlyPremium: 0,
    theme: 'royal',
    benefits: {
      medical: 150000,
      accident: 0,
      criticalIllness: 0,
      disability: 0,
      incomeComp: 0,
      family: 0,
    },
  },
  {
    id: 'ra-personal-health',
    type: 'personal',
    name: { th: 'ประกันสุขภาพส่วนตัว (สมมติ)', en: 'Personal Health Insurance (Sample)' },
    providerTag: { th: 'ประกันส่วนตัว', en: 'Personal' },
    cardNumberMask: 'HLT •••• 1001',
    subtitle: {
      th: 'ทุนคุ้มครอง ฿500,000 · ฿1,080/ด.',
      en: 'Coverage ฿500,000 · ฿1,080/mo',
    },
    status: 'active',
    limitKnown: true,
    monthlyPremium: 1080,
    theme: 'teal',
    benefits: {
      medical: 500000,
      accident: 0,
      criticalIllness: 0,
      disability: 0,
      incomeComp: 0,
      family: 0,
    },
  },
  {
    id: 'ra-personal-accident',
    type: 'personal',
    name: { th: 'ประกันอุบัติเหตุ PA (สมมติ)', en: 'Personal Accident PA (Sample)' },
    providerTag: { th: 'ประกันส่วนตัว', en: 'Personal' },
    cardNumberMask: 'PA •••• 2002',
    subtitle: {
      th: 'ทุนคุ้มครอง ฿300,000 · ฿200/ด.',
      en: 'Coverage ฿300,000 · ฿200/mo',
    },
    status: 'active',
    limitKnown: true,
    monthlyPremium: 200,
    theme: 'teal',
    benefits: {
      medical: 0,
      accident: 300000,
      criticalIllness: 0,
      disability: 0,
      incomeComp: 0,
      family: 0,
    },
  },
];

// Full 1–31 October 2569 (2026) realistic First Jobber cashflow (24 entries: ฿29,500 in, ฿21,800 out, ฿5,200 reserve transfers)
const DEMO_TRANSACTIONS = [
  {
    id: 'tx-oct-24',
    title: { th: 'ปิดงบ ต.ค.: ข้าวกล่อง & กาแฟทำงาน', en: 'Oct Close: Office Meals & Coffee' },
    note: { th: 'มื้อกลางวัน + กาแฟวันทำงานปลายเดือน', en: 'Final workweek meals & coffee' },
    category: 'expense',
    categoryLabel: { th: 'อาหาร & เครื่องดื่ม', en: 'Food & Dining' },
    iconKey: 'food',
    date: { th: '31 ต.ค. 2569', en: '31 Oct 2026' },
    isoDate: '2026-10-31',
    amount: -1400,
    status: 'completed',
  },
  {
    id: 'tx-oct-23',
    title: { th: 'โอนเก็บเงินสำรองเพิ่มเติมปลายเดือน', en: 'Month-End Extra Reserve Top-Up' },
    note: { th: 'เก็บเงินคงเหลือหลังหักค่าใช้จ่ายเข้าบัญชีสำรอง', en: 'Sweeping leftover monthly cash into buffer' },
    category: 'saving',
    categoryLabel: { th: 'เงินออมฉุกเฉิน', en: 'Emergency Fund' },
    iconKey: 'saving',
    date: { th: '30 ต.ค. 2569', en: '30 Oct 2026' },
    isoDate: '2026-10-30',
    amount: 500,
    status: 'completed',
  },
  {
    id: 'tx-oct-22',
    title: { th: 'ซื้อยาสามัญประจำบ้าน & วิตามิน', en: 'Pharmacy, Medicine & Vitamins' },
    note: { th: 'ชุดปฐมพยาบาล & ยาแก้แพ้/แก้ปวด (เบิกนอกสิทธิ)', en: 'Everyday pharmacy & wellness supplies' },
    category: 'expense',
    categoryLabel: { th: 'ประกัน & สุขภาพ', en: 'Insurance & Health' },
    iconKey: 'ccat-demo-protect',
    customIcon: 'heart-pulse',
    date: { th: '29 ต.ค. 2569', en: '29 Oct 2026' },
    isoDate: '2026-10-29',
    amount: -362,
    status: 'completed',
  },
  {
    id: 'tx-oct-21',
    title: { th: 'เงินคืน Cashback & ดอกเบี้ยออมทรัพย์', en: 'Cashback & Savings Interest' },
    note: { th: 'เครดิตเงินคืนจ่ายบิล PromptPay + ดอกเบี้ยรายเดือน', en: 'PromptPay cashback & bank interest credit' },
    category: 'income',
    categoryLabel: { th: 'เงินเดือน / รายได้เสริม', en: 'Salary & Income' },
    iconKey: 'salary',
    date: { th: '28 ต.ค. 2569', en: '28 Oct 2026' },
    isoDate: '2026-10-28',
    amount: 700,
    status: 'completed',
  },
  {
    id: 'tx-oct-20',
    title: { th: 'ซักอบรีด สกินแคร์ & ของใช้ส่วนตัว', en: 'Laundry, Skincare & Personal Care' },
    note: { th: 'ของใช้ประจำเดือน (สบู่ ยาสีฟัน ซักรีด)', en: 'Monthly toiletries & laundry services' },
    category: 'expense',
    categoryLabel: { th: 'ไลฟ์สไตล์', en: 'Lifestyle' },
    iconKey: 'lifestyle',
    date: { th: '27 ต.ค. 2569', en: '27 Oct 2026' },
    isoDate: '2026-10-27',
    amount: -690,
    status: 'completed',
  },
  {
    id: 'tx-oct-19',
    title: { th: 'โอนช่วยค่าใช้จ่ายที่บ้าน (ครอบครัว)', en: 'Monthly Family Support Transfer' },
    note: { th: 'ให้คุณพ่อคุณแม่ประจำเดือน ต.ค.', en: 'Regular monthly transfer to parents' },
    category: 'expense',
    categoryLabel: { th: 'ให้ครอบครัว / สังคม', en: 'Family & Social' },
    iconKey: 'ccat-demo-family',
    customIcon: 'gift',
    date: { th: '26 ต.ค. 2569', en: '26 Oct 2026' },
    isoDate: '2026-10-26',
    amount: -1500,
    status: 'completed',
  },
  {
    id: 'tx-oct-18',
    title: { th: 'เดินทางรถโดยสาร & รถตู้กลับบ้าน', en: 'Weekend Intercity Bus & Commute' },
    note: { th: 'ค่ารถเดินทางช่วงวันหยุดปลายเดือน', en: 'Weekend transit & home visit travel' },
    category: 'expense',
    categoryLabel: { th: 'เดินทาง / BTS', en: 'Transport / BTS' },
    iconKey: 'transport',
    date: { th: '24 ต.ค. 2569', en: '24 Oct 2026' },
    isoDate: '2026-10-24',
    amount: -760,
    status: 'completed',
  },
  {
    id: 'tx-oct-17',
    title: { th: 'อาหารมื้อกลางวัน & เย็น (สัปดาห์ที่ 3)', en: 'Weekday Meals & Lunch (Week 3)' },
    note: { th: 'ตลาดนัดออฟฟิศ & ร้านอาหารใกล้ที่พัก', en: 'Office canteen & neighborhood dinners' },
    category: 'expense',
    categoryLabel: { th: 'อาหาร & เครื่องดื่ม', en: 'Food & Dining' },
    iconKey: 'food',
    date: { th: '22 ต.ค. 2569', en: '22 Oct 2026' },
    isoDate: '2026-10-22',
    amount: -1380,
    status: 'completed',
  },
  {
    id: 'tx-oct-16',
    title: { th: 'สตรีมมิ่ง เพลง/ซีรีส์ & คลาวด์รายเดือน', en: 'Music/Streaming & Cloud Subscriptions' },
    note: { th: 'ค่าสมาชิกดิจิทัลแพ็กเกจแชร์เพื่อน', en: 'Shared monthly streaming & cloud storage' },
    category: 'expense',
    categoryLabel: { th: 'ไลฟ์สไตล์', en: 'Lifestyle' },
    iconKey: 'lifestyle',
    date: { th: '20 ต.ค. 2569', en: '20 Oct 2026' },
    isoDate: '2026-10-20',
    amount: -349,
    status: 'completed',
  },
  {
    id: 'tx-oct-15',
    title: { th: 'นัดกินข้าวสังสรรค์กับเพื่อนวันหยุด', en: 'Weekend Dinner With Friends' },
    note: { th: 'ชาบู & คาเฟ่สุดสัปดาห์ (คุมงบไม่เกินเป้า)', en: 'Social dining within monthly Wants budget' },
    category: 'expense',
    categoryLabel: { th: 'ให้ครอบครัว / สังคม', en: 'Family & Social' },
    iconKey: 'ccat-demo-family',
    customIcon: 'gift',
    date: { th: '18 ต.ค. 2569', en: '18 Oct 2026' },
    isoDate: '2026-10-18',
    amount: -820,
    status: 'completed',
  },
  {
    id: 'tx-oct-14',
    title: { th: 'แบ่งรายได้เสริมออมเข้าเงินสำรองฉุกเฉิน', en: 'Emergency Reserve Split From Side Income' },
    note: { th: 'ออม ~30% จากงานเสริมสมทบกองทุน 3 เดือน', en: 'Saving ~30% of freelance earnings into buffer' },
    category: 'saving',
    categoryLabel: { th: 'เงินออมฉุกเฉิน', en: 'Emergency Fund' },
    iconKey: 'saving',
    date: { th: '16 ต.ค. 2569', en: '16 Oct 2026' },
    isoDate: '2026-10-16',
    amount: 1200,
    status: 'completed',
  },
  {
    id: 'tx-oct-13',
    title: { th: 'เบี้ยประกันสุขภาพ + อุบัติเหตุ PA รายเดือน', en: 'Health & PA Insurance Monthly Premium' },
    note: { th: 'สุขภาพเหมาจ่าย ฿1,080 + PA ฿200 (อยู่ในกรอบ 10–15%)', en: 'Health ฿1,080 + PA ฿200 (safely under 15% cap)' },
    category: 'expense',
    categoryLabel: { th: 'ประกัน & สุขภาพ', en: 'Insurance & Health' },
    iconKey: 'ccat-demo-protect',
    customIcon: 'heart-pulse',
    date: { th: '16 ต.ค. 2569', en: '16 Oct 2026' },
    isoDate: '2026-10-16',
    amount: -1280,
    status: 'completed',
  },
  {
    id: 'tx-oct-12',
    title: { th: 'งานเสริมออกแบบสไลด์ & ค่าล่วงเวลา OT', en: 'Side Freelance Design & Mid-Month OT' },
    note: { th: 'รายได้นอกเวลางานหลัก ช่วงกลางเดือน ต.ค.', en: 'Weekend presentation design & overtime pay' },
    category: 'income',
    categoryLabel: { th: 'งานเสริม / ค่าล่วงเวลา', en: 'Side Income & OT' },
    iconKey: 'ccat-demo-side',
    customIcon: 'briefcase',
    date: { th: '15 ต.ค. 2569', en: '15 Oct 2026' },
    isoDate: '2026-10-15',
    amount: 3800,
    status: 'completed',
  },
  {
    id: 'tx-oct-11',
    title: { th: 'วินมอเตอร์ไซค์ & Grab เดินทางช่วงฝนตก', en: 'Motorcycle Taxi & Rainy-Day Grab' },
    note: { th: 'เดินทางเสริมจากสถานีรถไฟฟ้าเข้าซอย', en: 'Last-mile commutes during October rains' },
    category: 'expense',
    categoryLabel: { th: 'เดินทาง / BTS', en: 'Transport / BTS' },
    iconKey: 'transport',
    date: { th: '13 ต.ค. 2569', en: '13 Oct 2026' },
    isoDate: '2026-10-13',
    amount: -480,
    status: 'completed',
  },
  {
    id: 'tx-oct-10',
    title: { th: 'อาหารกลางวัน-เย็น & เดลิเวอรี (สัปดาห์ที่ 2)', en: 'Meals & Delivery (Week 2)' },
    note: { th: 'ค่าข้าวประจำวัน + สั่งอาหารเย็นเข้าหอ', en: 'Weekday meals & evening food delivery' },
    category: 'expense',
    categoryLabel: { th: 'อาหาร & เครื่องดื่ม', en: 'Food & Dining' },
    iconKey: 'food',
    date: { th: '11 ต.ค. 2569', en: '11 Oct 2026' },
    isoDate: '2026-10-11',
    amount: -1240,
    status: 'completed',
  },
  {
    id: 'tx-oct-09',
    title: { th: 'ค่าน้ำประปา + ค่าไฟฟ้าประจำเดือน ต.ค.', en: 'Water & Electricity Bills (Oct)' },
    note: { th: 'ค่าไฟแอร์กลางคืน ~฿1,120 + ค่าน้ำ ฿130', en: 'Monthly room electricity & water bill' },
    category: 'expense',
    categoryLabel: { th: 'น้ำ-ไฟ & เน็ตมือถือ', en: 'Utilities & Mobile' },
    iconKey: 'ccat-demo-util',
    customIcon: 'zap',
    date: { th: '10 ต.ค. 2569', en: '10 Oct 2026' },
    isoDate: '2026-10-10',
    amount: -1250,
    status: 'completed',
  },
  {
    id: 'tx-oct-08',
    title: { th: 'ช้อปของใช้เข้าห้อง & ซูเปอร์มาร์เก็ต', en: 'Supermarket & Room Essentials' },
    note: { th: 'น้ำยาซักผ้า กระดาษทิชชู่ น้ำดื่มแพ็ก', en: 'Bulk drinking water, detergent & household items' },
    category: 'expense',
    categoryLabel: { th: 'ไลฟ์สไตล์', en: 'Lifestyle' },
    iconKey: 'lifestyle',
    date: { th: '8 ต.ค. 2569', en: '8 Oct 2026' },
    isoDate: '2026-10-08',
    amount: -890,
    status: 'completed',
  },
  {
    id: 'tx-oct-07',
    title: { th: 'หักส่งสมทบประกันสังคม ม.33 (5%)', en: 'SSO Section 33 Monthly Contribution' },
    note: { th: 'ส่งสมทบรับสิทธิรักษาพยาบาล & ว่างงาน 7 ประการ', en: '5% statutory contribution for SSO healthcare & benefits' },
    category: 'expense',
    categoryLabel: { th: 'ประกัน & สุขภาพ', en: 'Insurance & Health' },
    iconKey: 'ccat-demo-protect',
    customIcon: 'heart-pulse',
    date: { th: '6 ต.ค. 2569', en: '6 Oct 2026' },
    isoDate: '2026-10-06',
    amount: -750,
    status: 'completed',
  },
  {
    id: 'tx-oct-06',
    title: { th: 'ค่าแพ็กเกจเน็ตมือถือ + เน็ตไฟเบอร์ห้อง', en: 'Mobile 5G & Room Fiber Internet' },
    note: { th: 'รายเดือนมือถือ ฿399 + เน็ตหอพัก ฿400', en: 'Unlimited mobile plan ฿399 + fiber internet ฿400' },
    category: 'expense',
    categoryLabel: { th: 'น้ำ-ไฟ & เน็ตมือถือ', en: 'Utilities & Mobile' },
    iconKey: 'ccat-demo-util',
    customIcon: 'zap',
    date: { th: '5 ต.ค. 2569', en: '5 Oct 2026' },
    isoDate: '2026-10-05',
    amount: -799,
    status: 'completed',
  },
  {
    id: 'tx-oct-05',
    title: { th: 'อาหาร 3 มื้อ & กาแฟ (สัปดาห์ที่ 1)', en: 'Daily Meals & Coffee (Week 1)' },
    note: { th: 'ข้าวแกง ก๋วยเตี๋ยว & กาแฟเช้า 5 วันทำงาน', en: 'First week lunches, dinners & morning coffee' },
    category: 'expense',
    categoryLabel: { th: 'อาหาร & เครื่องดื่ม', en: 'Food & Dining' },
    iconKey: 'food',
    date: { th: '3 ต.ค. 2569', en: '3 Oct 2026' },
    isoDate: '2026-10-03',
    amount: -1150,
    status: 'completed',
  },
  {
    id: 'tx-oct-04',
    title: { th: 'เติมเที่ยวบัตรโดยสาร BTS / MRT รายเดือน', en: 'Monthly BTS / MRT Transit Pass' },
    note: { th: 'แพ็กเกจเที่ยวเดินทางไปทำงาน 30 วัน', en: 'Monthly urban rail commuter pass' },
    category: 'expense',
    categoryLabel: { th: 'เดินทาง / BTS', en: 'Transport / BTS' },
    iconKey: 'transport',
    date: { th: '2 ต.ค. 2569', en: '2 Oct 2026' },
    isoDate: '2026-10-02',
    amount: -1200,
    status: 'completed',
  },
  {
    id: 'tx-oct-03',
    title: { th: 'โอนออมเงินสำรองฉุกเฉินอัตโนมัติ (ต้นเดือน)', en: 'Auto Pay-Yourself-First Emergency Transfer' },
    note: { th: 'ตัดเก็บเข้าบัญชีแยก 14% ของเงินเดือนก่อนใช้จ่าย', en: 'Auto-saved into dedicated liquid reserve on Day 2' },
    category: 'saving',
    categoryLabel: { th: 'เงินออมฉุกเฉิน', en: 'Emergency Fund' },
    iconKey: 'saving',
    date: { th: '2 ต.ค. 2569', en: '2 Oct 2026' },
    isoDate: '2026-10-02',
    amount: 3500,
    status: 'completed',
  },
  {
    id: 'tx-oct-02',
    title: { th: 'ค่าเช่าหอพัก / คอนโดรายเดือน (1 ต.ค.)', en: 'Monthly Apartment Rent (Oct 1)' },
    note: { th: 'ค่าเช่าห้องพักใกล้รถไฟฟ้า + ค่าส่วนกลาง', en: 'Monthly rent near BTS station + maintenance' },
    category: 'expense',
    categoryLabel: { th: 'ที่พัก & สาธารณูปโภค', en: 'Housing & Bills' },
    iconKey: 'housing',
    date: { th: '1 ต.ค. 2569', en: '1 Oct 2026' },
    isoDate: '2026-10-01',
    amount: -5500,
    status: 'completed',
  },
  {
    id: 'tx-oct-01',
    title: { th: 'เงินเดือนประจำ ต.ค. + ค่าเดินทางบริษัท', en: 'October Monthly Salary + Allowance' },
    note: { th: 'ฐานเงินเดือน ฿24,000 + ค่าเดินทางจากบริษัท ฿1,000', en: 'Base payroll ฿24,000 + transit allowance ฿1,000' },
    category: 'income',
    categoryLabel: { th: 'เงินเดือน / รายได้เสริม', en: 'Salary & Income' },
    iconKey: 'salary',
    date: { th: '1 ต.ค. 2569', en: '1 Oct 2026' },
    isoDate: '2026-10-01',
    amount: 25000,
    status: 'completed',
  },
];

// Strictly whitelist non-sensitive PDPA-safe userProfile fields (never accept email/phone/ID/password)
function sanitizeNameText(value) {
  if (typeof value !== 'string') return '';
  // Accept both Thai and English letters plus spaces, periods, hyphens, and apostrophes
  return value
    .replace(/[^\u0E00-\u0E7FA-Za-z\s.'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}

function sanitizeUserProfile(raw) {
  if (!raw || typeof raw !== 'object') return { ...INITIAL_USER_PROFILE };
  const rawDeps = Number(raw.dependents);
  const rawTarget = Number(raw.emergencyTargetMonths);

  return {
    title: normalizeTitle(raw.title),
    firstName: sanitizeNameText(raw.firstName),
    lastName: sanitizeNameText(raw.lastName),
    age: clampFirstJobberAge(raw.age, 25),
    occupation: normalizeOccupation(raw.occupation),
    dependents: Number.isFinite(rawDeps) ? Math.min(10, Math.max(0, Math.round(rawDeps))) : 0,
    emergencyTargetMonths: rawTarget === 6 ? 6 : 3,
  };
}

function sanitizeNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : fallback;
}

function sanitizeCoverages(raw) {
  if (!Array.isArray(raw)) return INITIAL_COVERAGES;
  return raw.filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      item.name &&
      typeof item.benefits === 'object'
  );
}

function sanitizeTransactions(raw) {
  if (!Array.isArray(raw)) return INITIAL_TRANSACTIONS;
  const valid = raw
    .filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        item.title &&
        Number.isFinite(Number(item.amount))
    )
    .map((item) => {
      if (
        item.title &&
        typeof item.title === 'object' &&
        item.title.th &&
        item.title.th === item.title.en
      ) {
        const instant = buildInstantBilingualText(item.title.th);
        return { ...item, title: instant.obj };
      }
      return item;
    });
  return valid;
}

function sanitizeRiskProfile(raw) {
  return sanitizeRiskProfileData(raw);
}

// Synchronize Overview virtual coverage cards when RiskAnalysis inputs change
function syncCoveragesWithRiskProfile(prevCoverages, nextRisk) {
  const govMeta = getGovSchemeMeta(nextRisk.govScheme);
  const baseList = Array.isArray(prevCoverages) ? [...prevCoverages] : [];

  const upsert = (list, item) => {
    const idx = list.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      const next = [...list];
      next[idx] = { ...next[idx], ...item };
      return next;
    }
    return [...list, item];
  };

  let updated =
    nextRisk.govScheme === 'none'
      ? baseList.filter((c) => c.id !== 'sso-33')
      : upsert(baseList, {
          id: 'sso-33',
          type: 'statutory',
          name: govMeta.label,
          providerTag: { th: 'สิทธิภาครัฐ', en: 'Statutory' },
          cardNumberMask:
            nextRisk.govScheme === 'uc'
              ? 'UC •••• 3000'
              : nextRisk.govScheme === 'civil'
                ? 'GOV •••• 0100'
                : 'SSO •••• 3301',
          subtitle: govMeta.desc,
          status: 'active',
          limitKnown: true,
          monthlyPremium: 0,
          theme: 'navy',
          benefits: { ...govMeta.benefits },
        });

  // Sync Employer Group Insurance card
  if (nextRisk.groupInsurance.active) {
    const isUnknown = nextRisk.groupInsurance.unknownLimit;
    const grpLimit = isUnknown ? 0 : Number(nextRisk.groupInsurance.limit) || 0;
    updated = upsert(updated, {
      id: 'group-ins',
      type: 'employer',
      name: { th: 'ประกันกลุ่มบริษัท', en: 'Employer Group Insurance' },
      providerTag: { th: 'สวัสดิการบริษัท', en: 'Employer' },
      cardNumberMask: 'GRP •••• 0000',
      subtitle: isUnknown
        ? { th: 'ไม่ทราบวงเงิน → นับเป็น ฿0', en: 'Unknown Limit → Counted as ฿0' }
        : {
            th: `วงเงินค่ารักษา ฿${grpLimit.toLocaleString('en-US')}`,
            en: `Medical Limit ฿${grpLimit.toLocaleString('en-US')}`,
          },
      status: isUnknown ? 'unknown_limit' : 'active',
      limitKnown: !isUnknown,
      monthlyPremium: 0,
      theme: 'royal',
      benefits: {
        medical: grpLimit,
        accident: 0,
        criticalIllness: 0,
        disability: 0,
        incomeComp: 0,
        family: 0,
      },
    });
  } else {
    updated = updated.filter((c) => c.id !== 'group-ins');
  }

  // Sync 4 structured personal policy rows from RiskAnalysis
  const personalSpecs = [
    {
      key: 'health',
      id: 'ra-personal-health',
      name: { th: 'ประกันสุขภาพส่วนตัว', en: 'Personal Health Insurance' },
      mask: 'HLT •••• 1001',
      benefitKey: 'medical',
    },
    {
      key: 'accident',
      id: 'ra-personal-accident',
      name: { th: 'ประกันอุบัติเหตุ (PA)', en: 'Personal Accident (PA)' },
      mask: 'PA •••• 2002',
      benefitKey: 'accident',
    },
    {
      key: 'criticalIllness',
      id: 'ra-personal-ci',
      name: { th: 'ประกันโรคร้ายแรง (CI)', en: 'Critical Illness (CI)' },
      mask: 'CI •••• 3003',
      benefitKey: 'criticalIllness',
    },
    {
      key: 'lifeDisability',
      id: 'ra-personal-life',
      name: { th: 'ประกันชีวิต & ทุพพลภาพ', en: 'Life & Disability Policy' },
      mask: 'LIF •••• 4004',
      benefitKey: 'lifeDisability',
    },
  ];

  for (const spec of personalSpecs) {
    const row = nextRisk.personalPolicies?.[spec.key];
    if (row?.active) {
      const isUnknown = row.unknownLimit;
      const amt = isUnknown ? 0 : Number(row.limit) || 0;
      const benefits = {
        medical: 0,
        accident: 0,
        criticalIllness: 0,
        disability: 0,
        incomeComp: 0,
        family: 0,
      };
      if (spec.benefitKey === 'lifeDisability') {
        benefits.disability = amt;
        benefits.family = amt;
      } else {
        benefits[spec.benefitKey] = amt;
      }
      updated = upsert(updated, {
        id: spec.id,
        type: 'personal',
        name: spec.name,
        providerTag: { th: 'ประกันส่วนตัว', en: 'Personal' },
        cardNumberMask: spec.mask,
        subtitle: isUnknown
          ? { th: 'ไม่ทราบวงเงิน → นับเป็น ฿0', en: 'Unknown Limit → Counted as ฿0' }
          : {
              th: `ทุนคุ้มครอง ฿${amt.toLocaleString('en-US')}`,
              en: `Coverage ฿${amt.toLocaleString('en-US')}`,
            },
        status: isUnknown ? 'unknown_limit' : 'active',
        limitKnown: !isUnknown,
        monthlyPremium: 0,
        theme: 'teal',
        benefits,
      });
    } else {
      updated = updated.filter((c) => c.id !== spec.id);
    }
  }

  return updated;
}

function sanitizeCustomCategories(raw) {
  if (!Array.isArray(raw)) return [];
  const allowedTypes = ['expense', 'income', 'saving'];
  return raw
    .filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        item.name.trim().length > 0
    )
    .slice(0, 40)
    .map((item) => {
      const cleanName = item.name.trim().slice(0, 28);
      const hasBilingualLabel =
        item.label &&
        typeof item.label === 'object' &&
        typeof item.label.th === 'string' &&
        typeof item.label.en === 'string' &&
        item.label.th.trim() &&
        item.label.en.trim();
      const label = hasBilingualLabel
        ? item.label.th === item.label.en
          ? buildInstantBilingualText(item.label.th).obj
          : { th: item.label.th.trim(), en: item.label.en.trim() }
        : buildInstantBilingualText(cleanName).obj;
      return {
        id: item.id,
        name: cleanName,
        label,
        type: allowedTypes.includes(item.type) ? item.type : 'expense',
        iconName: typeof item.iconName === 'string' ? item.iconName : 'tag',
        color: typeof item.color === 'string' ? item.color : '#2878C8',
      };
    });
}

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        userProfile: { ...INITIAL_USER_PROFILE },
        financials: { ...INITIAL_FINANCIALS },
        coverages: INITIAL_COVERAGES,
        transactions: INITIAL_TRANSACTIONS,
        riskProfile: { ...INITIAL_RISK_PROFILE },
        customCategories: [],
        isDemoMode: false,
      };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid stored structure');
    }

    const userProfile = sanitizeUserProfile(parsed.userProfile);
    const monthlyIncome = sanitizeNumber(parsed.monthlyIncome, INITIAL_FINANCIALS.monthlyIncome);
    const monthlyExpenses = sanitizeNumber(parsed.monthlyExpenses, INITIAL_FINANCIALS.monthlyExpenses);
    const monthlySavings = sanitizeNumber(
      parsed.monthlySavings,
      Math.max(0, monthlyIncome - monthlyExpenses)
    );
    const liquidEmergencyFund = sanitizeNumber(
      parsed.emergencyFund ?? parsed.liquidEmergencyFund,
      INITIAL_FINANCIALS.liquidEmergencyFund
    );

    return {
      userProfile,
      financials: {
        ...INITIAL_FINANCIALS,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        liquidEmergencyFund,
      },
      coverages: sanitizeCoverages(parsed.coverageItems ?? parsed.coverages),
      transactions: sanitizeTransactions(parsed.transactions),
      riskProfile: sanitizeRiskProfile(parsed.riskProfile),
      customCategories: sanitizeCustomCategories(parsed.customCategories),
      isDemoMode: Boolean(parsed.isDemoMode),
    };
  } catch {
    return {
      userProfile: { ...INITIAL_USER_PROFILE },
      financials: { ...INITIAL_FINANCIALS },
      coverages: INITIAL_COVERAGES,
      transactions: INITIAL_TRANSACTIONS,
      riskProfile: { ...INITIAL_RISK_PROFILE },
      customCategories: [],
      isDemoMode: false,
    };
  }
}

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [store, setStore] = useState(loadInitialState);
  const {
    userProfile,
    financials,
    coverages,
    transactions,
    riskProfile,
    customCategories,
    isDemoMode,
  } = store;
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((type, messageObj) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ id: Date.now(), type, message: messageObj });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3600);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Automatically persist all state to localStorage under 'protect360_data_v2'
  useEffect(() => {
    const payload = {
      schemaVersion: 2,
      updatedAt: new Date().toISOString(),
      isDemoMode: Boolean(isDemoMode),
      userProfile,
      monthlyIncome: financials.monthlyIncome,
      monthlyExpenses: financials.monthlyExpenses,
      monthlySavings: financials.monthlySavings,
      emergencyFund: financials.liquidEmergencyFund,
      coverageItems: coverages,
      transactions,
      riskProfile,
      customCategories,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }, [isDemoMode, userProfile, financials, coverages, transactions, riskProfile, customCategories]);

  // Backward-compatible merged profile object for Round 1 & future modules
  const profile = useMemo(
    () => ({
      ...financials,
      emergencyTargetMonths: userProfile.emergencyTargetMonths,
    }),
    [financials, userProfile.emergencyTargetMonths]
  );

  const derived = useMemo(() => {
    const netMonthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
    const savingsRatio =
      profile.monthlyIncome > 0
        ? Math.round((netMonthlySavings / profile.monthlyIncome) * 100)
        : 0;

    const targetMonths = userProfile.emergencyTargetMonths || 3;
    const emergencyTarget = profile.monthlyExpenses * targetMonths;
    const emergencyRunway =
      profile.monthlyExpenses > 0
        ? Number((profile.liquidEmergencyFund / profile.monthlyExpenses).toFixed(2))
        : 0;
    const emergencyProgress =
      emergencyTarget > 0
        ? Math.min(100, Math.round((profile.liquidEmergencyFund / emergencyTarget) * 100))
        : 0;

    const selfPaidPremium = coverages.reduce(
      (sum, item) => sum + (Number(item.monthlyPremium) || 0),
      0
    );

    const personalPoliciesCount = coverages.filter((c) => c.type === 'personal').length;

    const riskAssessment = computeActuarialRiskAssessment({
      monthlyIncome: profile.monthlyIncome,
      monthlyExpenses: profile.monthlyExpenses,
      emergencyFund: profile.liquidEmergencyFund,
      dependents: userProfile.dependents,
      riskProfile,
      coverages,
    });

    const protectionComparison = riskAssessment.categories;
    const hasUnknownCoverage = riskAssessment.hasAnyUnknownLimit;
    const totalNeededCoverage = riskAssessment.totalNeededCoverage;
    const totalEffectiveCoverage = riskAssessment.totalEffectiveCoverage;
    const totalProtectionGap = riskAssessment.totalProtectionGap;

    // Dynamic Risk Status Indicators for Overview Card 6
    const medicalCat = protectionComparison.find((c) => c.id === 'medical');
    const medicalPct = medicalCat ? medicalCat.coveragePct : 0;
    const healthLevel = medicalCat ? medicalCat.level : 'high';

    const incomeLevel =
      emergencyRunway < targetMonths * 0.5
        ? 'high'
        : emergencyRunway < targetMonths
          ? 'moderate'
          : 'low';

    const familyCat = protectionComparison.find((c) => c.id === 'family');
    const assetsLevel = familyCat ? familyCat.level : 'moderate';

    const riskStatuses = [
      {
        id: 'health-accident',
        level: healthLevel,
        titleKey: 'overview.riskHealthTitle',
        descObj: hasUnknownCoverage
          ? {
              th: 'มีสิทธิที่ยังไม่ทราบวงเงิน (นับเป็น ฿0) ควรตรวจสอบสิทธิจริง',
              en: 'Contains unknown-limit coverage (counted as ฿0) — verify actual limit',
            }
          : healthLevel === 'low'
            ? {
                th: `วงเงินค่ารักษาครอบคลุม ${medicalPct}% ของเกณฑ์อ้างอิงแล้ว`,
                en: `Medical protection covers ${medicalPct}% of benchmark`,
              }
            : {
                th: `วงเงินค่ารักษาครอบคลุม ${medicalPct}% ยังมีช่องว่างควรพิจารณาเพิ่ม`,
                en: `Medical coverage at ${medicalPct}% — residual gap remains`,
              },
        metric: `${medicalPct}%`,
      },
      {
        id: 'income-emergency',
        level: incomeLevel,
        titleKey: 'overview.riskIncomeTitle',
        descObj:
          emergencyRunway >= targetMonths
            ? {
                th: `เงินสำรองครบเกณฑ์ ${targetMonths} เดือนแล้ว (${emergencyRunway.toFixed(2)} เดือน)`,
                en: `Emergency runway meets ${targetMonths}-month target (${emergencyRunway.toFixed(2)} mo.)`,
              }
            : {
                th: `เงินสำรองต่ำกว่าเกณฑ์ ${targetMonths} เดือน (${emergencyRunway.toFixed(2)} เดือน)`,
                en: `Runway below ${targetMonths}-month benchmark (${emergencyRunway.toFixed(2)} mo.)`,
              },
        metric: `${emergencyRunway.toFixed(2)} mo`,
      },
      {
        id: 'assets-auto',
        level: assetsLevel,
        titleKey: 'overview.riskAssetsTitle',
        descKey: 'overview.riskAssetsDesc',
        metric: `${familyCat ? familyCat.coveragePct : 50}%`,
      },
    ];

    return {
      savingsRatio,
      emergencyTarget,
      emergencyRunway,
      emergencyProgress,
      selfPaidPremium,
      personalPoliciesCount,
      hasUnknownCoverage,
      protectionComparison,
      totalNeededCoverage,
      totalEffectiveCoverage,
      totalProtectionGap,
      riskAssessment,
      riskStatuses,
    };
  }, [profile, coverages, riskProfile, userProfile.emergencyTargetMonths, userProfile.dependents]);

  const updateUserProfile = useCallback(
    (patch, { silent = false } = {}) => {
      setStore((prev) => ({
        ...prev,
        userProfile: sanitizeUserProfile({ ...prev.userProfile, ...patch }),
      }));
      if (!silent) {
        showToast('success', {
          th: 'บันทึกข้อมูลส่วนตัวในอุปกรณ์เรียบร้อยแล้ว',
          en: 'Profile saved locally on your device',
        });
      }
    },
    [showToast]
  );

  const updateProfile = useCallback((patch) => {
    if (!patch || typeof patch !== 'object') return;
    setStore((prev) => {
      const nextUserProfile =
        'emergencyTargetMonths' in patch
          ? {
              ...prev.userProfile,
              emergencyTargetMonths: Number(patch.emergencyTargetMonths) === 6 ? 6 : 3,
            }
          : prev.userProfile;
      const { emergencyTargetMonths: _ignored, ...financialPatch } = patch;
      const mergedFinancials =
        Object.keys(financialPatch).length > 0
          ? { ...prev.financials, ...financialPatch }
          : prev.financials;
      const nextFinancials = {
        ...mergedFinancials,
        monthlySavings: Math.max(
          0,
          (Number(mergedFinancials.monthlyIncome) || 0) -
            (Number(mergedFinancials.monthlyExpenses) || 0)
        ),
      };
      return {
        ...prev,
        userProfile: nextUserProfile,
        financials: nextFinancials,
      };
    });
  }, []);

  const updateRiskProfile = useCallback((patch) => {
    if (!patch || typeof patch !== 'object') return;
    setStore((prev) => {
      const merged = {
        ...prev.riskProfile,
        ...patch,
        groupInsurance: patch.groupInsurance
          ? { ...prev.riskProfile.groupInsurance, ...patch.groupInsurance }
          : prev.riskProfile.groupInsurance,
        personalPolicies: patch.personalPolicies
          ? {
              ...prev.riskProfile.personalPolicies,
              ...Object.fromEntries(
                Object.entries(patch.personalPolicies).map(([k, v]) => [
                  k,
                  { ...(prev.riskProfile.personalPolicies?.[k] || {}), ...v },
                ])
              ),
            }
          : prev.riskProfile.personalPolicies,
      };
      const nextRisk = sanitizeRiskProfile(merged);
      const shouldSyncCards =
        'govScheme' in patch || 'groupInsurance' in patch || 'personalPolicies' in patch;
      return {
        ...prev,
        riskProfile: nextRisk,
        coverages: shouldSyncCards
          ? syncCoveragesWithRiskProfile(prev.coverages, nextRisk)
          : prev.coverages,
      };
    });
  }, []);

  const applyTransactionDelta = (prevFinancials, tx, direction) => {
    const absAmount = Math.abs(Number(tx?.amount) || 0);
    if (absAmount === 0) return prevFinancials;

    let nextIncome = prevFinancials.monthlyIncome;
    let nextExpenses = prevFinancials.monthlyExpenses;
    let nextEmergency = prevFinancials.liquidEmergencyFund;

    if (tx.category === 'income') {
      nextIncome = Math.max(0, nextIncome + direction * absAmount);
    } else if (tx.category === 'expense') {
      nextExpenses = Math.max(0, nextExpenses + direction * absAmount);
    } else if (tx.category === 'saving') {
      nextEmergency = Math.max(0, nextEmergency + direction * absAmount);
    }

    const nextSavings = Math.max(0, nextIncome - nextExpenses);

    return {
      ...prevFinancials,
      monthlyIncome: nextIncome,
      monthlyExpenses: nextExpenses,
      monthlySavings: nextSavings,
      liquidEmergencyFund: nextEmergency,
    };
  };

  const addTransaction = useCallback(
    (tx, { silent = false } = {}) => {
      const normalizedAmount =
        tx.category === 'expense'
          ? -Math.abs(Number(tx.amount) || 0)
          : Math.abs(Number(tx.amount) || 0);

      // Check if user entered single-language text (th === en) that needs bilingual translation
      let resolvedTitle = tx.title;
      let asyncSourceText = null;
      if (typeof tx.title === 'string') {
        const instant = buildInstantBilingualText(tx.title);
        resolvedTitle = instant.obj;
        if (instant.needsAsync) asyncSourceText = tx.title.trim();
      } else if (
        tx.title &&
        typeof tx.title === 'object' &&
        tx.title.th &&
        tx.title.th === tx.title.en
      ) {
        const instant = buildInstantBilingualText(tx.title.th);
        resolvedTitle = instant.obj;
        if (instant.needsAsync) asyncSourceText = tx.title.th.trim();
      }

      const newTx = {
        ...tx,
        title: resolvedTitle,
        amount: normalizedAmount,
        status: tx.status || 'completed',
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };
      setStore((prev) => ({
        ...prev,
        financials: applyTransactionDelta(prev.financials, newTx, 1),
        transactions: [newTx, ...prev.transactions],
      }));
      if (!silent) {
        showToast('success', {
          th: 'บันทึกรายการและอัปเดตภาพรวมการเงินเรียบร้อยแล้ว',
          en: 'Transaction saved and financial dashboard updated',
        });
      }

      // Non-blocking background TH <-> EN translation for free-form user input
      if (asyncSourceText) {
        const txId = newTx.id;
        translateBilingualAsync(asyncSourceText).then((bilingualTitle) => {
          if (!bilingualTitle || bilingualTitle.th === bilingualTitle.en) return;
          setStore((prev) => ({
            ...prev,
            transactions: prev.transactions.map((item) =>
              item.id === txId &&
              item.title?.th === asyncSourceText &&
              item.title?.en === asyncSourceText
                ? { ...item, title: bilingualTitle }
                : item
            ),
          }));
        });
      }

      return newTx;
    },
    [showToast]
  );

  const updateTransaction = useCallback(
    (id, patch, { silent = false } = {}) => {
      let resolvedPatch = patch;
      let asyncSourceText = null;

      if (
        !silent &&
        patch?.title &&
        typeof patch.title === 'object' &&
        patch.title.th &&
        patch.title.th === patch.title.en
      ) {
        const instant = buildInstantBilingualText(patch.title.th);
        resolvedPatch = { ...patch, title: instant.obj };
        if (instant.needsAsync) asyncSourceText = patch.title.th.trim();
      }

      setStore((prev) => {
        const existing = prev.transactions.find((t) => t.id === id);
        if (!existing) return prev;
        const reverted = applyTransactionDelta(prev.financials, existing, -1);
        const nextCategory = resolvedPatch.category || existing.category;
        const rawAmount =
          resolvedPatch.amount !== undefined ? resolvedPatch.amount : existing.amount;
        const normalizedAmount =
          nextCategory === 'expense'
            ? -Math.abs(Number(rawAmount) || 0)
            : Math.abs(Number(rawAmount) || 0);
        const updatedTx = {
          ...existing,
          ...resolvedPatch,
          category: nextCategory,
          amount: normalizedAmount,
        };
        const applied = applyTransactionDelta(reverted, updatedTx, 1);
        return {
          ...prev,
          financials: applied,
          transactions: prev.transactions.map((t) => (t.id === id ? updatedTx : t)),
        };
      });

      if (!silent) {
        showToast('success', {
          th: 'อัปเดตรายการเรียบร้อยแล้ว',
          en: 'Transaction updated',
        });
      }

      if (asyncSourceText) {
        translateBilingualAsync(asyncSourceText).then((bilingualTitle) => {
          if (!bilingualTitle || bilingualTitle.th === bilingualTitle.en) return;
          setStore((prev) => ({
            ...prev,
            transactions: prev.transactions.map((item) =>
              item.id === id &&
              item.title?.th === asyncSourceText &&
              item.title?.en === asyncSourceText
                ? { ...item, title: bilingualTitle }
                : item
            ),
          }));
        });
      }
    },
    [showToast]
  );

  const removeTransaction = useCallback(
    (id) => {
      setStore((prev) => {
        const target = prev.transactions.find((t) => t.id === id);
        if (!target) return prev;
        return {
          ...prev,
          financials: applyTransactionDelta(prev.financials, target, -1),
          transactions: prev.transactions.filter((t) => t.id !== id),
        };
      });
      showToast('info', {
        th: 'ลบรายการและคำนวณยอดใหม่เรียบร้อยแล้ว',
        en: 'Transaction deleted and totals recalculated',
      });
    },
    [showToast]
  );

  const addCoverage = useCallback((newCoverage) => {
    setStore((prev) => ({
      ...prev,
      coverages: [
        ...prev.coverages,
        {
          ...newCoverage,
          id: `cov-${Date.now()}`,
        },
      ],
    }));
  }, []);

  const updateCoverage = useCallback((id, patch) => {
    setStore((prev) => {
      const nextCoverages = prev.coverages.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      );
      let nextRisk = prev.riskProfile;
      if (id === 'group-ins') {
        const updatedItem = nextCoverages.find((c) => c.id === 'group-ins');
        if (updatedItem) {
          nextRisk = {
            ...prev.riskProfile,
            groupInsurance: {
              active: true,
              unknownLimit: !updatedItem.limitKnown,
              limit: Number(updatedItem.benefits?.medical) || 0,
            },
          };
        }
      }
      return {
        ...prev,
        coverages: nextCoverages,
        riskProfile: nextRisk,
      };
    });
  }, []);

  const removeCoverage = useCallback(
    (id) => {
      setStore((prev) => {
        let nextRisk = prev.riskProfile;
        if (id === 'group-ins') {
          nextRisk = {
            ...prev.riskProfile,
            groupInsurance: {
              ...prev.riskProfile.groupInsurance,
              active: false,
            },
          };
        } else if (id === 'ra-personal-health') {
          nextRisk = {
            ...prev.riskProfile,
            personalPolicies: {
              ...prev.riskProfile.personalPolicies,
              health: { ...prev.riskProfile.personalPolicies.health, active: false },
            },
          };
        } else if (id === 'ra-personal-accident') {
          nextRisk = {
            ...prev.riskProfile,
            personalPolicies: {
              ...prev.riskProfile.personalPolicies,
              accident: { ...prev.riskProfile.personalPolicies.accident, active: false },
            },
          };
        } else if (id === 'ra-personal-ci') {
          nextRisk = {
            ...prev.riskProfile,
            personalPolicies: {
              ...prev.riskProfile.personalPolicies,
              criticalIllness: {
                ...prev.riskProfile.personalPolicies.criticalIllness,
                active: false,
              },
            },
          };
        } else if (id === 'ra-personal-life') {
          nextRisk = {
            ...prev.riskProfile,
            personalPolicies: {
              ...prev.riskProfile.personalPolicies,
              lifeDisability: {
                ...prev.riskProfile.personalPolicies.lifeDisability,
                active: false,
              },
            },
          };
        }
        return {
          ...prev,
          coverages: prev.coverages.filter((item) => item.id !== id),
          riskProfile: nextRisk,
        };
      });
      showToast('info', {
        th: 'ลบสิทธิความคุ้มครองเรียบร้อยแล้ว',
        en: 'Coverage item removed',
      });
    },
    [showToast]
  );

  const addCustomCategory = useCallback(
    ({ name, type = 'expense', iconName = 'tag', color = '#2878C8' }) => {
      const trimmed = String(name || '').trim().slice(0, 28);
      if (!trimmed) return null;

      const instant = buildInstantBilingualText(trimmed);
      const newCat = {
        id: `ccat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: trimmed,
        label: instant.obj,
        type: ['expense', 'income', 'saving'].includes(type) ? type : 'expense',
        iconName: iconName || 'tag',
        color: color || '#2878C8',
      };
      setStore((prev) => ({
        ...prev,
        customCategories: [newCat, ...(prev.customCategories || [])].slice(0, 40),
      }));
      showToast('success', {
        th: `สร้างหมวดหมู่ "${instant.obj.th}" เรียบร้อยแล้ว`,
        en: `Created custom category "${instant.obj.en}"`,
      });

      if (instant.needsAsync) {
        const catId = newCat.id;
        translateBilingualAsync(trimmed).then((bilingualLabel) => {
          if (!bilingualLabel || bilingualLabel.th === bilingualLabel.en) return;
          setStore((prev) => ({
            ...prev,
            customCategories: (prev.customCategories || []).map((c) =>
              c.id === catId ? { ...c, label: bilingualLabel } : c
            ),
            transactions: prev.transactions.map((tx) =>
              tx.iconKey === catId ? { ...tx, categoryLabel: bilingualLabel } : tx
            ),
          }));
        });
      }

      return newCat;
    },
    [showToast]
  );

  const removeCustomCategory = useCallback(
    (id) => {
      setStore((prev) => ({
        ...prev,
        customCategories: (prev.customCategories || []).filter((item) => item.id !== id),
      }));
      showToast('info', {
        th: 'ลบหมวดหมู่ที่สร้างเองเรียบร้อยแล้ว',
        en: 'Custom category deleted',
      });
    },
    [showToast]
  );

  const exportUserData = useCallback(() => {
    const cleanFirstName = (userProfile.firstName || '')
      .trim()
      .replace(/[^\w\u0E00-\u0E7F-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const fileName = `protect360-${cleanFirstName || 'first-jobber'}.json`;

    const backupPayload = {
      app: 'PROTECT360',
      schemaVersion: 1,
      privacy: 'PDPA-Safe / Zero-Login Local Backup (No PII)',
      exportedAt: new Date().toISOString(),
      userProfile,
      monthlyIncome: financials.monthlyIncome,
      monthlyExpenses: financials.monthlyExpenses,
      monthlySavings: financials.monthlySavings,
      emergencyFund: financials.liquidEmergencyFund,
      coverageItems: coverages,
      transactions,
      riskProfile,
      customCategories,
    };

    try {
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('success', {
        th: `ดาวน์โหลดไฟล์สำรอง ${fileName} เรียบร้อยแล้ว`,
        en: `Downloaded backup file ${fileName}`,
      });
      return { ok: true, fileName };
    } catch {
      showToast('error', {
        th: 'ไม่สามารถสร้างไฟล์สำรองได้ กรุณาลองใหม่อีกครั้ง',
        en: 'Could not export backup file. Please try again.',
      });
      return { ok: false };
    }
  }, [userProfile, financials, coverages, transactions, riskProfile, customCategories, showToast]);

  const importUserData = useCallback(
    async (file) => {
      if (!file) {
        return { ok: false };
      }

      try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Root JSON must be an object');
        }

        const hasExpectedShape =
          (parsed.userProfile && typeof parsed.userProfile === 'object') ||
          Array.isArray(parsed.coverageItems) ||
          Array.isArray(parsed.coverages) ||
          Array.isArray(parsed.transactions) ||
          typeof parsed.monthlyIncome === 'number';

        if (!hasExpectedShape) {
          throw new Error('Unrecognized PROTECT360 schema');
        }

        const nextUserProfile = sanitizeUserProfile(parsed.userProfile);
        const nextIncome = sanitizeNumber(parsed.monthlyIncome, INITIAL_FINANCIALS.monthlyIncome);
        const nextExpenses = sanitizeNumber(
          parsed.monthlyExpenses,
          INITIAL_FINANCIALS.monthlyExpenses
        );
        const nextSavings = sanitizeNumber(
          parsed.monthlySavings,
          Math.max(0, nextIncome - nextExpenses)
        );
        const nextEmergencyFund = sanitizeNumber(
          parsed.emergencyFund ?? parsed.liquidEmergencyFund,
          INITIAL_FINANCIALS.liquidEmergencyFund
        );
        const nextCoverages = sanitizeCoverages(parsed.coverageItems ?? parsed.coverages);
        const nextTransactions = sanitizeTransactions(parsed.transactions);
        const nextRiskProfile = sanitizeRiskProfile(parsed.riskProfile);
        const nextCustomCategories = sanitizeCustomCategories(parsed.customCategories);

        setStore({
          userProfile: nextUserProfile,
          financials: {
            ...INITIAL_FINANCIALS,
            monthlyIncome: nextIncome,
            monthlyExpenses: nextExpenses,
            monthlySavings: nextSavings,
            liquidEmergencyFund: nextEmergencyFund,
          },
          coverages: nextCoverages,
          transactions: nextTransactions,
          riskProfile: nextRiskProfile,
          customCategories: nextCustomCategories,
          isDemoMode: false,
        });

        const message = {
          th: 'กู้คืนข้อมูลจากไฟล์สำรองเรียบร้อยแล้ว',
          en: 'Backup restored successfully',
        };
        showToast('success', message);
        return { ok: true, message, userProfile: nextUserProfile };
      } catch {
        const message = {
          th: 'ไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์สำรองข้อมูล PROTECT360 (.json)',
          en: 'Invalid backup file. Please upload a valid PROTECT360 .json file.',
        };
        showToast('error', message);
        return { ok: false, message };
      }
    },
    [showToast]
  );

  const resetDemoData = useCallback(
    ({ silent = false } = {}) => {
      setStore({
        userProfile: { ...INITIAL_USER_PROFILE },
        financials: { ...INITIAL_FINANCIALS },
        coverages: INITIAL_COVERAGES,
        transactions: INITIAL_TRANSACTIONS,
        riskProfile: { ...INITIAL_RISK_PROFILE },
        customCategories: [],
        isDemoMode: false,
      });
      if (!silent) {
        showToast('info', {
          th: 'รีเซ็ตข้อมูลทุกช่องกลับเป็น 0 / 00.00 เรียบร้อยแล้ว พร้อมให้คุณกรอกข้อมูลจริง',
          en: 'Reset all fields to 0 / 00.00 — ready for your own numbers.',
        });
      }
    },
    [showToast]
  );

  const loadDemoSample = useCallback(() => {
    setStore({
      userProfile: { ...DEMO_USER_PROFILE },
      financials: { ...DEMO_FINANCIALS },
      coverages: DEMO_COVERAGES.map((c) => ({ ...c, benefits: { ...c.benefits } })),
      transactions: DEMO_TRANSACTIONS.map((tx) => ({ ...tx })),
      riskProfile: {
        ...DEMO_RISK_PROFILE_DATA,
        groupInsurance: { ...DEMO_RISK_PROFILE_DATA.groupInsurance },
        personalPolicies: {
          health: { ...DEMO_RISK_PROFILE_DATA.personalPolicies.health },
          accident: { ...DEMO_RISK_PROFILE_DATA.personalPolicies.accident },
          criticalIllness: { ...DEMO_RISK_PROFILE_DATA.personalPolicies.criticalIllness },
          lifeDisability: { ...DEMO_RISK_PROFILE_DATA.personalPolicies.lifeDisability },
        },
      },
      customCategories: DEMO_CUSTOM_CATEGORIES.map((c) => ({ ...c, label: { ...c.label } })),
      isDemoMode: true,
    });
    showToast('info', {
      th: 'โหลดงบสมมติ 1–31 ตุลาคม 2569 (24 รายการรับ-จ่ายจริง) เพื่อทดลองคำนวณและเปรียบเทียบแล้ว',
      en: 'Loaded full Oct 1–31, 2026 sample budget (24 realistic entries) for calculation & comparison preview.',
    });
  }, [showToast]);

  const value = {
    userProfile,
    profile,
    monthlyIncome: financials.monthlyIncome,
    monthlyExpenses: financials.monthlyExpenses,
    emergencyFund: financials.liquidEmergencyFund,
    coverages,
    coverageItems: coverages,
    transactions,
    riskProfile,
    customCategories: customCategories || [],
    isDemoMode: Boolean(isDemoMode),
    toast,
    ...derived,
    updateUserProfile,
    updateProfile,
    updateRiskProfile,
    addTransaction,
    updateTransaction,
    removeTransaction,
    addCustomCategory,
    removeCustomCategory,
    addCoverage,
    updateCoverage,
    removeCoverage,
    exportUserData,
    importUserData,
    loadDemoSample,
    resetDemoData,
    showToast,
    dismissToast,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return ctx;
}

export function formatTHB(amount, { showSign = false } = {}) {
  const raw = Number(amount) || 0;
  const rounded = Math.round(raw * 100) / 100;
  const hasDecimals = !Number.isInteger(rounded);
  const absFormatted = Math.abs(rounded).toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  });
  if (showSign) {
    if (rounded > 0) return `+฿${absFormatted}`;
    if (rounded < 0) return `-฿${absFormatted}`;
  }
  return rounded < 0 ? `-฿${absFormatted}` : `฿${absFormatted}`;
}

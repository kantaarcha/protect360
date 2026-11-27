// Plain-Language Financial & Risk Education Library for PROTECT360 Learning Center
// Neutral educational content only — zero brand or product recommendations.

export const LEARNING_STORAGE_KEY = 'protect360_learning_v1';

export const LEARNING_CATEGORIES = [
  { id: 'all', label: { th: 'ทั้งหมด', en: 'All' } },
  { id: 'cash', label: { th: 'เงินสำรอง', en: 'Emergency' } },
  { id: 'policy', label: { th: 'อ่านกรมธรรม์', en: 'Policy Rules' } },
  { id: 'benefits', label: { th: 'สวัสดิการ', en: 'Benefits' } },
];

export const LEARNING_ARTICLES = [
  {
    id: 'opd-vs-ipd',
    category: 'policy',
    categoryLabel: { th: 'อ่านกรมธรรม์', en: 'Policy Rules' },
    readMinutes: 2,
    iconName: 'stethoscope',
    keywords: ['opd', 'ipd', 'ผู้ป่วยนอก', 'ผู้ป่วยใน', 'แอดมิต', 'เบี้ย', 'เหมาจ่าย'],
    title: {
      th: 'OPD vs. IPD ต่างกันอย่างไร ทำไมเบี้ยต่างกันหลายเท่า?',
      en: 'OPD vs. IPD: Why Premiums Differ So Much',
    },
    hook: {
      th: 'แยกความต่างระหว่าง "หาหมอรับยากลับบ้าน" กับ "นอนโรงพยาบาล" เพื่อเลือกป้องกันจุดที่เจ็บหนักจริง',
      en: 'See why inpatient emergencies matter most for young earners compared to routine clinic visits.',
    },
    intro: {
      th: 'หลายคนเริ่มต้นด้วยการอยากได้ความคุ้มครอง "หาหมอปุ๊บเบิกได้ปั๊บ (OPD)" แต่พอเห็นเบี้ยต่อปีกลับสูงจนเกินงบ เหตุผลทางคณิตศาสตร์ประกันภัยคือ OPD เกิดขึ้นบ่อยมาก แต่ยอดเงินต่อครั้งเล็ก ส่วน IPD (นอนโรงพยาบาล) เกิดไม่บ่อยแต่ครั้งเดียวอาจสูงหลักแสน',
      en: 'Many first-time earners want OPD coverage for everyday clinic visits, then get surprised by high premiums. Actuarially, OPD happens often at low cost, while IPD happens rarely at catastrophic cost.',
    },
    translations: [
      {
        jargon: { th: 'OPD (Outpatient Department)', en: 'OPD (Outpatient Care)' },
        plain: {
          th: 'หาหมอ ตรวจ รับยา แล้วกลับบ้านในวันเดียวกัน ไม่ได้นอนค้างคืน ค่าใช้จ่ายมักอยู่ที่ ฿800–฿3,000 ต่อครั้ง',
          en: 'Doctor visit, tests, and medication without staying overnight — typically ฿800–฿3,000 per visit.',
        },
      },
      {
        jargon: { th: 'IPD (Inpatient Department)', en: 'IPD (Inpatient Care)' },
        plain: {
          th: 'แพทย์สั่งแอดมิตนอนโรงพยาบาล (มักนับตั้งแต่ 6 ชั่วโมงขึ้นไป) เช่น ไข้เลือดออก ผ่าตัดไส้ติ่ง บิลมักเริ่มที่ ฿30,000–฿150,000+',
          en: 'Doctor-ordered hospital admission (typically 6+ hours) for serious illness or surgery — bills often hit ฿30,000–฿150,000+.',
        },
      },
      {
        jargon: { th: 'ความถี่สูง-เสียหายต่ำ vs ความถี่ต่ำ-เสียหายสูง', en: 'High-Frequency vs. High-Severity' },
        plain: {
          th: 'ค่ารักษาเล็ก ๆ อย่าง OPD ใช้เงินสำรองหรือสิทธิประกันสังคม/กลุ่มจัดการได้ แต่ IPD ก้อนใหญ่คือจุดที่ควรโอนย้ายความเสี่ยง',
          en: 'Small frequent OPD bills fit your cash reserve or workplace rights, whereas rare high-cost IPD shocks are what risk transfer is designed for.',
        },
      },
    ],
    example: {
      title: { th: 'ตัวอย่าง First Jobber เงินเดือน ฿25,000', en: 'First Jobber Example (฿25,000/mo)' },
      body: {
        th: 'หากป่วยไข้หวัดหาหมอ OPD 2 ครั้ง/ปี (รวม ฿3,200) เงินสำรองฉุกเฉินรับได้สบาย แต่ถ้าเกิดอุบัติเหตุหรือไข้เลือดออกต้องแอดมิต IPD 4 คืน บิล ฿65,000 หากไม่มีวงเงิน IPD รองรับอาจต้องควักเงินเก็บทั้งปีหรือกู้บัตรเงินสดดอกเบี้ย 20%',
        en: 'Two annual flu clinic visits (฿3,200 total) are easy for an emergency fund to absorb. One 4-night dengue admission (฿65,000) without IPD coverage can wipe out a full year of savings.',
      },
    },
    takeaway: {
      th: 'หากงบจำกัด ให้จัดลำดับความสำคัญที่ความคุ้มครองผู้ป่วยใน (IPD) ก่อนเสมอ แล้วใช้เงินสำรองหรือสวัสดิการบริษัทดูแลเคสผู้ป่วยนอก (OPD)',
      en: 'On a starter budget, prioritize catastrophic Inpatient (IPD) protection first and cover routine Outpatient (OPD) costs via cash reserves or employer benefits.',
    },
    bridgeAction: {
      page: 'risk-analysis',
      label: { th: 'เช็กช่องว่างค่ารักษาใน Risk Analysis', en: 'Check Medical Gap in Risk Analysis' },
    },
  },
  {
    id: 'waiting-period',
    category: 'policy',
    categoryLabel: { th: 'อ่านกรมธรรม์', en: 'Policy Rules' },
    readMinutes: 2,
    iconName: 'clock',
    keywords: ['waiting period', 'ระยะเวลารอคอย', '30 วัน', '120 วัน', 'เคลมไม่ได้', 'ไข้เลือดออก'],
    title: {
      th: 'ระยะเวลารอคอย (Waiting Period): ทำปุ๊บ ไม่ได้คุ้มครองปั๊บ',
      en: 'Waiting Period: Why Coverage Does Not Start on Day One',
    },
    hook: {
      th: 'เข้าใจกฎ 30 วันสำหรับโรคทั่วไป และ 120 วันสำหรับ 8 กลุ่มโรคเฉพาะ จะได้ไม่เข้าใจผิดตอนยื่นเคลม',
      en: 'Learn the standard 30-day illness and 120-day specific-condition rules before you ever need to claim.',
    },
    intro: {
      th: 'หนึ่งในเรื่องที่คนเข้าใจผิดบ่อยที่สุดคือ "เพิ่งเริ่มมีแผนคุ้มครองวันนี้ แล้วสัปดาห์หน้าป่วยเข้า รพ. ทำไมเบิกไม่ได้?" คำตอบอยู่ที่กติกาสากลที่เรียกว่า ระยะเวลารอคอย (Waiting Period) เพื่อป้องกันการรอให้ป่วยก่อนแล้วค่อยมาสมัคร',
      en: 'One of the biggest claim surprises is getting sick a week after approval and discovering it is not covered yet. Waiting Periods are standard actuarial rules preventing people from signing up only after symptoms begin.',
    },
    translations: [
      {
        jargon: { th: 'ระยะเวลารอคอยทั่วไป 30 วัน', en: '30-Day General Waiting Period' },
        plain: {
          th: 'การเจ็บป่วยทั่วไป (เช่น ไข้หวัดใหญ่ ไข้เลือดออก อาหารเป็นพิษ) ที่เกิดภายใน 30 วันแรกหลังกรมธรรม์อนุมัติ จะยังไม่สามารถเคลมได้',
          en: 'General illnesses (flu, dengue, food poisoning) occurring during the first 30 days after policy approval are not yet covered.',
        },
      },
      {
        jargon: { th: 'ระยะเวลารอคอยพิเศษ 120 วัน', en: '120-Day Specific Condition Period' },
        plain: {
          th: 'กลุ่มโรคเรื้อรังหรือค่อย ๆ ก่อตัว 8 กลุ่ม (เช่น เนื้องอก ซีสต์ ริดสีดวงทวาร ไส้เลื่อน ต้อเนื้อ นิ่ว ต่อมทอนซิล เส้นเลือดขอด) ต้องรอครบ 120 วันก่อน',
          en: '8 slow-developing conditions (tumors/cysts, hemorrhoids, hernia, gallstones, cataracts, tonsillitis, varicose veins, endometriosis) require a 120-day wait.',
        },
      },
      {
        jargon: { th: 'ข้อยกเว้นกรณีอุบัติเหตุ', en: 'Accident Exception' },
        plain: {
          th: 'อุบัติเหตุเฉียบพลัน (เช่น หกล้ม รถเฉี่ยวชน) โดยทั่วไปมักคุ้มครองทันทีหลังกรมธรรม์มีผลบังคับใช้ ไม่ต้องรอ 30 วัน',
          en: 'Sudden external accidents (falls, traffic injuries) typically take effect immediately once the policy is active, with no 30-day wait.',
        },
      },
    ],
    example: {
      title: { th: 'ตัวอย่างจริง: ป่วยวันที่ 12 หลังเริ่มแผน', en: 'Real Example: Hospitalized on Day 12' },
      body: {
        th: 'หากกรมธรรม์สุขภาพเริ่มมีผลวันที่ 1 พ.ย. แล้ววันที่ 12 พ.ย. ป่วยเป็นไข้เลือดออกแอดมิต ฿45,000 เคสนี้จะยังอยู่ในช่วง Waiting Period 30 วัน จึงเคลมไม่ได้ — นี่คือเหตุผลว่าทำไม "เงินสำรองฉุกเฉิน" และ "สิทธิประกันสังคม" ยังจำเป็นเสมอ',
        en: 'If health coverage starts Nov 1 and dengue hits on Nov 12 (฿45,000 bill), it falls inside the 30-day waiting period and will be declined — proving why an emergency fund and SSO rights remain vital.',
      },
    },
    takeaway: {
      th: 'วางแผนป้องกันความเสี่ยงตั้งแต่ตอนสุขภาพแข็งแรง และรักษาเงินสำรองฉุกเฉินไว้เสมอเพื่ออุดช่องว่างช่วงรอคอย',
      en: 'Plan protection while healthy and keep liquid emergency cash ready to bridge any waiting period.',
    },
    bridgeAction: {
      page: 'game',
      label: { th: 'ทดลองรับมือเหตุฉุกเฉินใน Survival Lab', en: 'Test Emergencies in Survival Lab' },
    },
  },
  {
    id: 'pre-existing',
    category: 'policy',
    categoryLabel: { th: 'อ่านกรมธรรม์', en: 'Policy Rules' },
    readMinutes: 2,
    iconName: 'file-warning',
    keywords: ['pre-existing', 'โรคที่เป็นมาก่อน', 'แถลงความจริง', 'ปกปิด', 'ประวัติสุขภาพ', 'บอกล้าง'],
    title: {
      th: 'โรคที่เป็นมาก่อน (Pre-existing) & การแถลงความจริง',
      en: 'Pre-Existing Conditions & Honest Disclosure',
    },
    hook: {
      th: 'ทำไมการ "ไม่บอกประวัติสุขภาพ" จึงเสี่ยงถูกปฏิเสธเคลมทั้งหมด และแถลงตามจริงปกป้องสิทธิเราอย่างไร',
      en: 'Why hiding medical history risks voiding your coverage, and how truthful disclosure safeguards future claims.',
    },
    intro: {
      th: 'หลายคนกังวลว่าถ้าบอกประวัติการรักษาเก่า ๆ ไปแล้วจะสมัครไม่ผ่าน จึงเลือกเว้นว่างไว้ แต่ในความเป็นจริง กฎหมายประกันภัยยึดหลักความสุจริตใจอย่างยิ่ง การปกปิดข้อมูลสำคัญกลับทำให้เสียเงินเบี้ยเปล่าในวันที่ต้องใช้จริง',
      en: 'People sometimes omit past medical visits out of fear of rejection. Under insurance law ("utmost good faith"), concealing material history can void the entire contract right when you need a payout most.',
    },
    translations: [
      {
        jargon: { th: 'Pre-existing Conditions (สภาพที่เป็นมาก่อน)', en: 'Pre-Existing Conditions' },
        plain: {
          th: 'โรคหรืออาการที่คุณเคยตรวจพบ รักษา หรือมีอาการมาก่อนวันที่ทำสัญญา มักไม่คุ้มครองในสัญญาใหม่ (หรืออาจรับโดยมีเงื่อนไข)',
          en: 'Any illness, symptom, or diagnosis you already had before applying — usually excluded or underwritten with specific terms.',
        },
      },
      {
        jargon: { th: 'การแถลงความจริงอันเป็นสาระสำคัญ', en: 'Material Health Disclosure' },
        plain: {
          th: 'การกรอกประวัติตรวจสุขภาพ ผลเลือด หรือการนอน รพ. ย้อนหลังตามความจริงทุกข้อ เพื่อให้เงื่อนไขการคุ้มครองชัดเจนตั้งแต่วันแรก',
          en: 'Answering health questions truthfully (lab results, past hospital stays, medications) so coverage terms are locked and clear from Day 1.',
        },
      },
      {
        jargon: { th: 'สิทธิบอกล้างสัญญา (ภายใน 2 ปี)', en: '2-Year Contestability Window' },
        plain: {
          th: 'หากตรวจพบภายหลังว่ามีการปกปิดประวัติโรคสำคัญ บริษัทมีสิทธิปฏิเสธเคลมและบอกล้างสัญญาได้ภายใน 2 ปีตามกฎหมาย',
          en: 'If undisclosed material history surfaces during a claim within 2 years, the insurer can legally deny the claim and rescind the contract.',
        },
      },
    ],
    example: {
      title: { th: 'ตัวอย่างจริง: เคยตรวจเจอถุงน้ำรังไข่/นิ่วมาก่อน', en: 'Real Example: Undisclosed Prior Diagnosis' },
      body: {
        th: 'หากเคยอัลตราซาวด์พบนิ่วในถุงน้ำดีเมื่อปีที่แล้วแต่ไม่ได้แจ้งตอนสมัคร เมื่อ 8 เดือนต่อมาต้องผ่าตัด ฿90,000 ทางโรงพยาบาลส่งประวัติย้อนหลังให้ตรวจสอบ ทำให้เคลมถูกปฏิเสธ แต่ถ้าแถลงตรง ๆ ตั้งแต่แรก โรคอื่นที่ไม่เกี่ยวกันทั้งหมดจะได้รับความคุ้มครองอย่างสบายใจ',
        en: 'If a prior ultrasound detected gallstones and was omitted, a ฿90,000 surgery 8 months later will likely be rejected after medical-record verification. Disclosing honestly keeps all unrelated conditions cleanly protected.',
      },
    },
    takeaway: {
      th: 'แถลงประวัติสุขภาพตามความจริง 100% เสมอ และเก็บสำเนาใบคำขอไว้ตรวจสอบคู่กับเล่มกรมธรรม์ทุกครั้ง',
      en: 'Always disclose 100% of medical history honestly and keep a copy of your application alongside your policy.',
    },
    bridgeAction: {
      page: 'risk-analysis',
      label: { th: 'ตรวจสอบความคุ้มครองที่มีใน Risk Analysis', en: 'Audit Your Coverage in Risk Analysis' },
    },
  },
  {
    id: 'deductible-copay',
    category: 'policy',
    categoryLabel: { th: 'อ่านกรมธรรม์', en: 'Policy Rules' },
    readMinutes: 2,
    iconName: 'scale',
    keywords: ['deductible', 'co-payment', 'copay', 'ความรับผิดส่วนแรก', 'ส่วนร่วมจ่าย', 'เบี้ยถูกลง', 'ประกันกลุ่ม'],
    title: {
      th: 'Deductible vs. Co-payment: ส่วนร่วมจ่ายที่ช่วยคุมเบี้ยให้อยู่ในงบ',
      en: 'Deductible vs. Co-Payment: Cutting Overlap & Costs',
    },
    hook: {
      th: 'วิธีใช้ "ความรับผิดส่วนแรก" คู่กับประกันกลุ่มบริษัท เพื่อลดเบี้ยที่ซ้ำซ้อนโดยยังกันบิลใหญ่หลักแสนได้',
      en: 'How pairing a deductible with Employer Group Insurance stops you from paying twice for the same coverage.',
    },
    intro: {
      th: 'พนักงานประจำจำนวนมากมีประกันกลุ่มบริษัทวงเงิน ฿30,000–฿50,000 อยู่แล้ว แต่พออยากอุดช่องว่างบิลหลักแสนกลับจ่ายเบี้ยเต็มตั้งแต่บาทแรก ทั้งที่จริงสามารถใช้แนวคิด "Deductible" มารับช่วงต่อจากสวัสดิการบริษัทเพื่อลดเบี้ยลงได้มาก',
      en: 'Many salaried employees already have ฿30,000–฿50,000 in Employer Group Insurance, yet pay full premiums starting from the first baht. Using a deductible lets personal coverage kick in only above your workplace limit.',
    },
    translations: [
      {
        jargon: { th: 'Deductible (ความรับผิดส่วนแรก)', en: 'Deductible (Fixed First-Layer Share)' },
        plain: {
          th: 'ยอดเงินก้อนแรกแบบคงที่ที่คุณรับผิดชอบเองก่อน (หรือใช้ประกันกลุ่ม/ประกันสังคมจ่ายแทนได้) เช่น ฿20,000 แรก ส่วนที่เกินจากนั้นแผนหลักจ่ายให้ทั้งหมด',
          en: 'A fixed initial amount you pay first (often coverable by your employer group plan), e.g. the first ฿20,000; everything above is covered.',
        },
      },
      {
        jargon: { th: 'Co-payment (ส่วนร่วมจ่ายแบบเปอร์เซ็นต์)', en: 'Co-Payment (Percentage Cost Share)' },
        plain: {
          th: 'การช่วยกันจ่ายเป็นสัดส่วน % ของบิลทั้งหมด เช่น คุณจ่าย 20% และแผนคุ้มครองจ่าย 80% ยิ่งบิลใหญ่ ยอดที่คุณต้องร่วมจ่ายก็ยิ่งโตตาม',
          en: 'You share a fixed percentage of every bill (e.g., you pay 20%, plan covers 80%) — so larger hospital bills mean a larger out-of-pocket share.',
        },
      },
      {
        jargon: { th: 'การเคลมร่วม (Coordination of Benefits)', en: 'Coordination of Benefits' },
        plain: {
          th: 'สามารถใช้สิทธิประกันกลุ่มบริษัทเบิกส่วนแรกก่อน แล้วใช้แผนส่วนตัวรับช่วงจ่ายส่วนที่เกิน เพื่อไม่ให้จ่ายเบี้ยซ้ำซ้อนสองเด้ง',
          en: 'Claim the first layer through Employer Group Insurance, then pass any excess bill to your supplemental coverage.',
        },
      },
    ],
    example: {
      title: { th: 'ตัวอย่างจริง: บิลผ่าตัด ฿120,000 เมื่อมีประกันกลุ่ม ฿30,000', en: 'Real Example: ฿120,000 Bill + ฿30,000 Group Plan' },
      body: {
        th: 'หากตั้ง Deductible ฿30,000 ให้ตรงกับวงเงินประกันกลุ่ม เมื่อเกิดบิล ฿120,000 ประกันกลุ่มจ่าย ฿30,000 แรกให้ และแผนส่วนตัวจ่ายส่วนต่าง ฿90,000 ที่เหลือ คุณควักเงินสด ฿0 แถมประหยัดเบี้ยรายปีลงได้ 20%–40%',
        en: 'With a ฿30,000 deductible matching your group limit, a ฿120,000 bill is split cleanly: ฿30,000 from employer group + ฿90,000 from supplemental cover = ฿0 cash lost while cutting annual cost by 20%–40%.',
      },
    },
    takeaway: {
      th: 'เช็กวงเงินประกันกลุ่มจาก HR ก่อนเสมอ แล้วพิจารณา Deductible หากต้องการคุมงบให้อยู่ในกรอบ 10%–15% ของรายได้',
      en: 'Confirm your HR group limit first, then evaluate deductibles to keep total protection spend under 10%–15% of income.',
    },
    bridgeAction: {
      page: 'invest',
      label: { th: 'ลองคำนวณความคุ้มค่าใน Invest & Value Lab', en: 'Simulate Value in Invest & Value Lab' },
    },
  },
  {
    id: 'sso-group-benefits',
    category: 'benefits',
    categoryLabel: { th: 'สวัสดิการ', en: 'Benefits' },
    readMinutes: 2,
    iconName: 'building',
    keywords: ['ประกันสังคม', 'ม.33', 'ประกันกลุ่ม', 'ค่าห้อง', 'ลาออก', 'เปลี่ยนงาน', 'hr', 'สวัสดิการ'],
    title: {
      th: 'ประกันสังคม ม.33 + ประกันกลุ่มบริษัท พอจริงไหมในวันฉุกเฉิน?',
      en: 'SSO Sec. 33 + Employer Group Benefits: Are They Enough?',
    },
    hook: {
      th: 'รู้ทันเพดานค่าห้อง วงเงินต่อครั้ง และจุดบอดสำคัญที่หลายคนลืมคิดเวลา "เปลี่ยนงาน"',
      en: 'Understand room-rate caps, per-visit limits, and the hidden protection gap when switching jobs.',
    },
    intro: {
      th: 'First Jobber ส่วนใหญ่รู้สึกอุ่นใจว่า "มีประกันสังคมกับประกันกลุ่มบริษัทแล้ว น่าจะพอ" ซึ่งช่วยได้มากจริงในหลายกรณี แต่ก็มีเพดานและเงื่อนไข 3 จุดที่ควรตรวจสอบให้รู้ตัวเลขแน่นอนตั้งแต่วันนี้',
      en: 'Most new graduates rely on Social Security (SSO Sec. 33) and Employer Group Insurance. Both are valuable foundations, yet 3 practical limits often surprise people during an emergency.',
    },
    translations: [
      {
        jargon: { th: 'สิทธิประกันสังคม ม.33 (รพ.ตามสิทธิ)', en: 'SSO Section 33 (Designated Hospital)' },
        plain: {
          th: 'รักษาฟรีตามสิทธิที่ รพ.ที่เลือกไว้ และมีเงินทดแทนขาดรายได้ 50% เมื่อลาป่วยเกิน 30 วัน แต่หากเข้า รพ.เอกชนนอกสิทธิที่ไม่เข้าเกณฑ์ฉุกเฉินวิกฤต (UCEP) ต้องสำรองจ่ายเอง',
          en: 'Covers care at your registered hospital plus 50% income replacement after 30 sick days, but non-UCEP private hospital visits require paying out of pocket.',
        },
      },
      {
        jargon: { th: 'เพดานค่าห้อง & วงเงินต่อครั้ง (Sub-limit)', en: 'Room-Rate & Per-Visit Sub-Limits' },
        plain: {
          th: 'ประกันกลุ่มบริษัทมักจำกัดค่าห้องที่ ฿1,500–฿3,500/คืน และค่ารักษาต่อครั้ง ฿20,000–฿50,000 หากเจอผ่าตัดใหญ่ ฿100,000 ส่วนเกินต้องจ่ายเอง',
          en: 'Employer group plans often cap room rates at ฿1,500–฿3,500/night and total bills at ฿20,000–฿50,000 per admission — leaving you to pay any excess.',
        },
      },
      {
        jargon: { th: 'ความเสี่ยงตอนเปลี่ยนงาน (Job Transition Gap)', en: 'Job-Switch Coverage Gap' },
        plain: {
          th: 'ทันทีที่ลาออกหรืออยู่ช่วงทดลองงานที่ใหม่ สิทธิประกันกลุ่มจะสิ้นสุดลงชั่วคราว และหากป่วยเรื้อรังระหว่างทำงานอยู่ อาจเริ่มแผนส่วนตัวใหม่ได้ยากขึ้น',
          en: 'Employer group coverage ends immediately when you resign, leaving a gap during probation — and any illness diagnosed beforehand becomes pre-existing.',
        },
      },
    ],
    example: {
      title: { th: 'เช็กลิสต์ 1 นาที: ทักแชตถาม HR 3 คำถามนี้', en: '1-Minute Checklist: Ask HR These 3 Questions' },
      body: {
        th: '1) ประกันกลุ่มมีวงเงินค่ารักษาผู้ป่วยใน (IPD) ต่อครั้งกี่บาท? 2) ค่าห้องสูงสุดต่อคืนกี่บาท? 3) มีวงเงินอุบัติเหตุ (PA) หรือโรคร้ายแรงแยกต่างหากหรือไม่? — แค่รู้ตัวเลขจริง คุณจะวางแผนได้แม่นยำขึ้นทันที',
        en: '1) What is our IPD limit per admission? 2) What is the nightly room-rate cap? 3) Is Personal Accident (PA) or Critical Illness included? Knowing exact numbers eliminates guesswork.',
      },
    },
    takeaway: {
      th: 'อย่าประเมินความคุ้มครองจากการเดา — หากยังไม่ทราบวงเงินประกันกลุ่ม ให้ถือเป็น ฿0 ไว้ก่อนแล้วสอบถาม HR เพื่อนำตัวเลขจริงมาคำนวณ',
      en: 'Never guess coverage limits — treat unknown employer limits as ฿0 conservatively until confirmed with HR.',
    },
    bridgeAction: {
      page: 'risk-analysis',
      label: { th: 'กรอกสิทธิประกันสังคม & ประกันกลุ่มของคุณ', en: 'Enter Your SSO & Group Benefits' },
    },
  },
  {
    id: 'protect360-3-steps',
    category: 'cash',
    categoryLabel: { th: 'เงินสำรอง', en: 'Emergency' },
    readMinutes: 2,
    iconName: 'layers',
    keywords: ['กฎ 3 ขั้น', 'เงินสำรอง', '3-6 เดือน', '10-15%', 'ลำดับการเงิน', 'protect360', 'first jobber'],
    title: {
      th: 'กฎ 3 ขั้นก่อนโอนย้ายความเสี่ยง (PROTECT360 Order)',
      en: 'The 3-Step Order Before Transferring Risk',
    },
    hook: {
      th: 'ลำดับการจัดเงินที่ถูกต้อง: เงินสำรอง → เช็กสวัสดิการ → คุมงบไม่เกิน 10%–15% ของรายได้',
      en: 'The neutral financial sequence: 1) Emergency Fund → 2) Workplace Audit → 3) Cap Budget at 10%–15%.',
    },
    intro: {
      th: 'ความผิดพลาดที่พบบ่อยที่สุดของวัยเริ่มต้นทำงานคือ "ซื้อแผนความคุ้มครองก่อนจะมีเงินสดสำรอง" ทำให้พอเกิดเหตุเล็ก ๆ หรือช็อตเงินกลางทางต้องยอมเวนคืนสัญญาขาดทุน การวางแผนที่ยั่งยืนจึงต้องเรียงตามลำดับ 3 ขั้นนี้เสมอ',
      en: 'The most common starter mistake is locking cash into long-term plans before having liquid emergency savings, forcing painful cancellations later. Sustainable financial resilience follows a strict 3-step order.',
    },
    translations: [
      {
        jargon: { th: 'ขั้นที่ 1: เงินสำรองฉุกเฉิน 3–6 เดือน', en: 'Step 1: 3–6 Month Emergency Cash' },
        plain: {
          th: 'เก็บเงินสดสภาพคล่องให้พอครอบคลุมรายจ่ายจำเป็นอย่างน้อย 3 เดือน (และค่อย ๆ ขยับเป็น 6 เดือน) เพื่อรับมือเหตุเล็ก-กลางและรายได้สะดุด',
          en: 'Build liquid cash covering at least 3 months of essential expenses (growing toward 6 months) for routine shocks and income dips.',
        },
      },
      {
        jargon: { th: 'ขั้นที่ 2: ตรวจสวัสดิการที่มีอยู่ทั้งหมด', en: 'Step 2: Audit Existing Benefits' },
        plain: {
          th: 'รวบรวมสิทธิภาครัฐ (ม.33 / บัตรทอง / ข้าราชการ) และวงเงินประกันกลุ่มจาก HR ให้ครบ เพื่อเห็นเฉพาะ "ช่องว่างจริง" ที่ยังขาด',
          en: 'List statutory rights (SSO / UC / Civil) and confirmed HR group limits so you only quantify your true remaining protection gap.',
        },
      },
      {
        jargon: { th: 'ขั้นที่ 3: คุมงบโอนย้ายความเสี่ยงไม่เกิน 10%–15%', en: 'Step 3: Cap Protection at 10%–15% of Income' },
        plain: {
          th: 'จัดสรรงบจัดการความเสี่ยงให้พอดีกับรายได้ ไม่เกิน 10%–15% ต่อเดือน เพื่อให้ยังเหลือเงินออมและลงทุนเติบโตในระยะยาวได้',
          en: 'Keep total risk-transfer costs within 10%–15% of income so your cashflow stays healthy and long-term wealth can compound.',
        },
      },
    ],
    example: {
      title: { th: 'สูตรคำนวณเฉพาะตัวสำหรับคุณ', en: 'Your Personalized Rule of Thumb' },
      useDynamicNumbers: true,
      body: {
        th: 'หากรายได้ ฿25,000/เดือน และรายจ่าย ฿20,000/เดือน เป้าเงินสำรอง 3 เดือนคือ ฿60,000 และกรอบงบโอนย้ายความเสี่ยงที่ปลอดภัยไม่ควรเกิน ฿2,500–฿3,750/เดือน',
        en: 'At ฿25,000/mo income and ฿20,000/mo expenses, your 3-month emergency goal is ฿60,000 and your safe protection cap is ฿2,500–฿3,750/mo.',
      },
    },
    takeaway: {
      th: 'ทำตามลำดับ 1 → 2 → 3 เสมอ จะช่วยให้คุณมีทั้งสภาพคล่องในวันนี้ และเกราะป้องกันเหตุไม่คาดฝันที่จ่ายไหวในระยะยาว',
      en: 'Following 1 → 2 → 3 keeps you liquid today and sustainably protected against large shocks over the long run.',
    },
    bridgeAction: {
      page: 'smartlog',
      label: { th: 'กลับไปติดตามเงินสำรองใน SmartLog', en: 'Track Your Reserve in SmartLog' },
    },
  },
];

export const JARGON_TERMS = [
  {
    id: 'sum-insured',
    term: { th: 'ทุนประกัน (Sum Insured)', en: 'Sum Insured' },
    shortTag: { th: 'วงเงินสูงสุด', en: 'Max Payout' },
    plainMeaning: {
      th: 'วงเงินคุ้มครองสูงสุดที่สัญญาจะจ่ายให้เมื่อเกิดเหตุตามเงื่อนไข เช่น ทุนชีวิต ฿500,000 หรือวงเงินค่ารักษา ฿1,000,000 ไม่ใช่จำนวนเงินที่คุณจะได้รับคืนทุกปี',
      en: 'The maximum payout limit covered when a qualifying event occurs (e.g., ฿500,000 life cover or ฿1,000,000 medical cap) — not cash returned to you every year.',
    },
    tip: {
      th: 'เช็กให้ชัดว่าตัวเลขที่เห็นคือ "วงเงินต่อครั้ง" หรือ "วงเงินเหมาจ่ายต่อปี" เพราะมีผลต่อการรับมือบิลใหญ่ต่างกันมาก',
      en: 'Always check whether the figure is a "per-visit cap" or an "annual aggregate limit" — it dramatically changes real protection.',
    },
  },
  {
    id: 'exclusion',
    term: { th: 'ข้อยกเว้น (Exclusion)', en: 'Exclusion' },
    shortTag: { th: 'จุดที่ไม่คุ้มครอง', en: 'Not Covered' },
    plainMeaning: {
      th: 'รายการเงื่อนไขหรือเหตุการณ์ที่สัญญาระบุชัดเจนว่าจะ "ไม่จ่ายเงินชดเชย" เช่น โรคที่เป็นมาก่อน การทำศัลยกรรมเพื่อความงาม หรืออุบัติเหตุขณะเมาสุรา',
      en: 'Specific conditions or events explicitly NOT covered by a policy — such as pre-existing illnesses, cosmetic procedures, or alcohol-related injuries.',
    },
    tip: {
      th: 'ก่อนเซ็นรับเงื่อนไขใด ๆ ให้เปิดอ่านหน้า "ข้อยกเว้นทั่วไป" เป็นหน้าแรกเสมอ ใช้เวลาไม่เกิน 2 นาทีแต่กันดราม่าตอนเคลมได้จริง',
      en: 'Read the "General Exclusions" page first before agreeing to any contract — 2 minutes of reading prevents major claim surprises.',
    },
  },
  {
    id: 'grace-period',
    term: { th: 'ระยะเวลาผ่อนผัน (Grace Period)', en: 'Grace Period' },
    shortTag: { th: 'ช่วงต่ออายุ', en: 'Payment Buffer' },
    plainMeaning: {
      th: 'ช่วงเวลาที่ขยายให้หลังวันครบกำหนดชำระเบี้ย (โดยทั่วไป 31 วัน) ซึ่งความคุ้มครองยังคงเดินต่อปกติระหว่างที่คุณรีบชำระให้เรียบร้อย',
      en: 'A built-in buffer after the payment due date (typically 31 days) during which your coverage stays active while you settle the payment.',
    },
    tip: {
      th: 'ตั้งแจ้งเตือนปฏิทิน (.ics) ล่วงหน้า 7 วันก่อนครบกำหนด เพื่อไม่ให้เผลอปล่อยเลยช่วงผ่อนผันจนสิทธิคุ้มครองขาดอายุ',
      en: 'Set a calendar reminder (.ics) 7 days before your due date so coverage never lapses accidentally past the grace window.',
    },
  },
  {
    id: 'beneficiary',
    term: { th: 'ผู้รับประโยชน์ (Beneficiary)', en: 'Beneficiary' },
    shortTag: { th: 'ผู้รับเงินแทน', en: 'Recipient' },
    plainMeaning: {
      th: 'บุคคลที่คุณระบุชื่อไว้ในสัญญาให้เป็นผู้รับเงินชดเชยหากเกิดเหตุไม่คาดฝันถึงชีวิต เช่น พ่อแม่ คู่สมรส หรือบุตร โดยสามารถระบุหลายคนพร้อมแบ่งสัดส่วน % ได้',
      en: 'The person(s) you legally designate to receive payouts if a fatal event occurs (e.g., parents, spouse, children), customizable by percentage share.',
    },
    tip: {
      th: 'หากสถานะครอบครัวเปลี่ยน (เช่น แต่งงาน มีลูก) ควรอัปเดตชื่อผู้รับประโยชน์ให้เป็นปัจจุบันอยู่เสมอ',
      en: 'Review and update your beneficiary whenever major life events happen (marriage, children, or supporting parents).',
    },
  },
  {
    id: 'rider',
    term: { th: 'สัญญาเพิ่มเติม (Rider)', en: 'Policy Rider' },
    shortTag: { th: 'ส่วนเสริมความคุ้มครอง', en: 'Add-On Layer' },
    plainMeaning: {
      th: 'ความคุ้มครองเสริมที่แนบเพิ่มกับสัญญาหลัก เช่น ค่ารักษาสุขภาพ อุบัติเหตุ หรือโรคร้ายแรง มักเป็นการต่ออายุแบบปีต่อปีและเบี้ยอาจปรับตามช่วงอายุ',
      en: 'Optional add-on coverage attached to a base policy (such as health, accident, or critical illness) — usually renewed annually with age-stepped pricing.',
    },
    tip: {
      th: 'ดูตารางเบี้ยล่วงหน้าตอนอายุ 35, 45, 55 ปีเสมอ จะได้รู้ว่าเบี้ยสัญญาเพิ่มเติมจะขยับขึ้นเท่าไรในอนาคต',
      en: 'Always inspect the future age-band rate table (ages 35, 45, 55) so you know how add-on costs scale over time.',
    },
  },
  {
    id: 'irr',
    term: { th: 'ผลตอบแทนที่แท้จริง (IRR)', en: 'True Annual Return (IRR)' },
    shortTag: { th: 'อัตราผลตอบแทนทบต้น', en: 'Annualized Yield' },
    plainMeaning: {
      th: 'อัตราผลตอบแทนทบต้นต่อปีที่คิดจากกระแสเงินสดจ่ายออกและรับคืนจริงตลอดสัญญา ไม่ใช่ตัวเลข "เงินคืน 5% ของทุนประกัน" ที่มักทำให้เข้าใจผิดว่าเป็นดอกเบี้ยต่อปี',
      en: 'The true annualized compound return calculated from every baht paid out and received back — very different from marketing numbers like "5% cashback of sum insured."',
    },
    tip: {
      th: 'ใช้หน้า Invest & Value Lab คำนวณ IRR หลังหักเงินเฟ้อและเช็กฐานภาษีจริงของคุณก่อนตัดสินใจผูกพันเงินระยะยาวทุกครั้ง',
      en: 'Use our Invest & Value Lab to check real inflation-adjusted IRR and your actual Thai tax bracket before locking money long term.',
    },
  },
];

export const LITERACY_QUIZ = [
  {
    id: 'q1-waiting',
    question: {
      th: 'ทำแผนคุ้มครองสุขภาพอนุมัติวันนี้ พรุ่งนี้เป็นไข้เลือดออกแอดมิตทันที เคลมได้หรือไม่?',
      en: 'Your health coverage is approved today, and tomorrow you are hospitalized for dengue. Can you claim?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'เคลมได้ทันที 100% เพราะสัญญาอนุมัติแล้ว', en: 'Yes, 100% covered since it is already approved' },
      },
      {
        id: 'b',
        label: {
          th: 'ยังเคลมไม่ได้ เพราะโรคทั่วไปมีระยะเวลารอคอย (Waiting Period) 30 วัน',
          en: 'No — general illnesses have a standard 30-day Waiting Period',
        },
      },
      {
        id: 'c',
        label: { th: 'เคลมได้ครึ่งหนึ่งเฉพาะค่าห้อง', en: 'Half is covered for room fees only' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'ถูกต้องครับ! การเจ็บป่วยทั่วไปมีระยะเวลารอคอยมาตรฐาน 30 วัน (และ 120 วันสำหรับ 8 โรคเฉพาะ) ส่วนอุบัติเหตุเฉียบพลันมักคุ้มครองทันที',
      en: 'Spot on! General illnesses have a standard 30-day waiting period (120 days for 8 specific conditions), whereas sudden accidents typically start immediately.',
    },
  },
  {
    id: 'q2-unknown-limit',
    question: {
      th: 'ถ้ามีประกันกลุ่มบริษัทแต่ "ไม่ทราบวงเงินจริง" ตามหลักวางแผนการเงินที่รอบคอบควรนับความคุ้มครองส่วนนี้เป็นเท่าไร?',
      en: 'If you have Employer Group Insurance but do NOT know its coverage limit, how much should you count it as?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'นับเป็น ฿0 ไว้ก่อน แล้วรีบเช็กตัวเลขจริงกับ HR', en: 'Count it as ฿0 conservatively until confirmed with HR' },
      },
      {
        id: 'b',
        label: { th: 'เดาไปก่อนว่าน่าจะคุ้มครอง ฿100,000', en: 'Assume it probably covers ฿100,000' },
      },
      {
        id: 'c',
        label: { th: 'ไม่ต้องสนใจ เพราะบริษัทน่าจะจ่ายให้หมด', en: 'Ignore it since employers usually pay everything' },
      },
    ],
    correctId: 'a',
    explanation: {
      th: 'เยี่ยมมาก! หลัก Conservative Estimation นับวงเงินที่ไม่ทราบค่าเป็น ฿0 เพื่อไม่ให้ประเมินความเสี่ยงต่ำเกินจริง จากนั้นเช็กตัวเลขจริงจาก HR มาอัปเดต',
      en: 'Correct! Conservative Estimation counts unknown limits as ฿0 so you never underestimate your risk gap before confirming the true limit with HR.',
    },
  },
  {
    id: 'q3-deductible',
    question: {
      th: 'มีประกันกลุ่มบริษัทวงเงิน ฿30,000 อยู่แล้ว กลไกใดที่ช่วยลดการจ่ายเบี้ยซ้ำซ้อนเมื่อต้องปิดช่องว่างบิลหลักแสน?',
      en: 'You already have a ฿30,000 employer group limit. Which mechanism avoids double-paying while covering ฿100,000+ bills?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ซื้อความคุ้มครอง OPD สูงสุดเพิ่มอีกฉบับ', en: 'Add maximum OPD outpatient visits' },
      },
      {
        id: 'b',
        label: {
          th: 'เลือกใช้ความรับผิดส่วนแรก (Deductible) ให้รับช่วงต่อจากประกันกลุ่ม',
          en: 'Use a Deductible so supplemental cover kicks in above the group limit',
        },
      },
      {
        id: 'c',
        label: { th: 'ยกเลิกสิทธิประกันสังคม ม.33', en: 'Cancel Social Security Section 33' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'ถูกต้องครับ! Deductible ช่วยให้ประกันกลุ่มรับผิดชอบยอดแรกก่อน แล้วแผนส่วนตัวค่อยจ่ายส่วนเกิน จึงช่วยประหยัดเบี้ยโดยไม่เสียเกราะป้องกันบิลใหญ่',
      en: 'Exactly! A deductible lets your employer group plan handle the initial layer while supplemental cover absorbs excess catastrophic bills.',
    },
  },
  {
    id: 'q4-budget-cap',
    question: {
      th: 'ตามหลักวางแผนการเงินที่เป็นกลาง งบจัดการความเสี่ยงต่อเดือนควรคุมให้อยู่ในกรอบไม่เกินกี่ % ของรายได้?',
      en: 'Under neutral personal finance guardrails, total risk-transfer spending should stay within what % of income?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ไม่เกิน 10%–15% ของรายได้ต่อเดือน', en: 'Within 10%–15% of monthly income' },
      },
      {
        id: 'b',
        label: { th: '30%–40% ของรายได้ เพื่อให้คุ้มครองสูงสุด', en: '30%–40% of income for maximum coverage' },
      },
      {
        id: 'c',
        label: { th: 'ใช้เงินเหลือออมทั้งหมด 100% ไปเลย', en: 'Spend 100% of all monthly surplus' },
      },
    ],
    correctId: 'a',
    explanation: {
      th: 'แม่นยำครับ! กรอบ 10%–15% ช่วยให้คุณป้องกันความเสี่ยงหลักได้จริงโดยไม่เบียดเบียนเงินสำรองฉุกเฉินและการลงทุนเพื่ออนาคต',
      en: 'Right on! The 10%–15% ceiling protects against major shocks without starving your emergency fund or long-term investments.',
    },
  },
  {
    id: 'q5-disclosure',
    question: {
      th: 'หากเคยตรวจพบโรคประจำตัวมาก่อนแต่เลือก "ไม่แถลงประวัติ" ตอนสมัคร จะเกิดผลอย่างไร?',
      en: 'What happens if you conceal a known medical diagnosis when applying for coverage?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ไม่มีผลอะไร บริษัทตรวจสอบย้อนหลังไม่ได้', en: 'Nothing — prior medical records cannot be checked' },
      },
      {
        id: 'b',
        label: { th: 'ได้เบี้ยถูกลงและเคลมโรคนั้นได้ปกติ', en: 'Lower premiums and normal claims for that condition' },
      },
      {
        id: 'c',
        label: {
          th: 'เสี่ยงถูกปฏิเสธเคลมและบอกล้างสัญญาได้ตามกฎหมาย',
          en: 'Risk of claim denial and legal policy rescission',
        },
      },
    ],
    correctId: 'c',
    explanation: {
      th: 'ถูกต้องครับ! การแถลงความจริงตามประวัติสุขภาพ 100% คือเกราะป้องกันสิทธิที่ดีที่สุด เพื่อให้การเคลมในอนาคตโปร่งใสไร้ปัญหา',
      en: 'Correct! 100% truthful disclosure is your strongest protection so future claims for covered events are paid smoothly.',
    },
  },
];

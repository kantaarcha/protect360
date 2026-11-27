// Plain-Language Financial & Risk Education Library for PROTECT360 Learning Center
// Neutral educational content with verified official Thai public references.

export const LEARNING_STORAGE_KEY = 'protect360_learning_v1';

export const LEARNING_CATEGORIES = [
  { id: 'all', label: { th: 'ทั้งหมด', en: 'All' } },
  { id: 'cash', label: { th: 'เงินสำรอง', en: 'Emergency' } },
  { id: 'policy', label: { th: 'อ่านกรมธรรม์', en: 'Policy Rules' } },
  { id: 'benefits', label: { th: 'สวัสดิการ', en: 'Benefits' } },
  { id: 'good-to-know', label: { th: 'รู้ไว้ใช้ว่า?', en: 'Good to Know?' } },
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
        jargon: { th: 'OPD (ผู้ป่วยนอก)', en: 'OPD (Outpatient Care)' },
        plain: {
          th: 'หาหมอ ตรวจ รับยา แล้วกลับบ้านในวันเดียวกัน ไม่ได้นอนค้างคืน ค่าใช้จ่ายมักอยู่ที่ ฿800–฿3,000 ต่อครั้ง',
          en: 'Doctor visit, tests, and medication without staying overnight — typically ฿800–฿3,000 per visit.',
        },
      },
      {
        jargon: { th: 'IPD (ผู้ป่วยใน)', en: 'IPD (Inpatient Care)' },
        plain: {
          th: 'แพทย์สั่งแอดมิตนอนโรงพยาบาล (มักนับตั้งแต่ 6 ชั่วโมงขึ้นไป) เช่น ไข้เลือดออก ผ่าตัดไส้ติ่ง บิลมักเริ่มที่ ฿30,000–฿150,000+',
          en: 'Doctor-ordered hospital admission (typically 6+ hours) for serious illness or surgery — bills often hit ฿30,000–฿150,000+.',
        },
      },
      {
        jargon: { th: 'เหตุบ่อย-จ่ายน้อย vs เหตุนานที-จ่ายหนัก', en: 'Frequent Small vs. Rare Catastrophic' },
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
    references: [
      {
        source: 'คปภ. (OIC)',
        label: { th: 'สำนักงาน คปภ. — ความรู้ประกันสุขภาพมาตรฐาน', en: 'OIC — Health Insurance Standards' },
        url: 'https://www.oic.or.th/th',
      },
    ],
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
    references: [
      {
        source: 'คปภ. (OIC)',
        label: { th: 'คปภ. — มาตรฐานสัญญาประกันสุขภาพไทย', en: 'OIC — Thai Health Policy Standards' },
        url: 'https://www.oic.or.th/th',
      },
    ],
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
    references: [
      {
        source: 'คปภ. (OIC)',
        label: { th: 'คปภ. — สิทธิและหน้าที่ผู้เอาประกันภัย', en: 'OIC — Policyholder Rights & Duties' },
        url: 'https://www.oic.or.th/th',
      },
    ],
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
    references: [
      {
        source: 'คปภ. (OIC)',
        label: { th: 'สำนักงาน คปภ. — ทำความเข้าใจ Deductible & Co-payment', en: 'OIC — Deductible & Co-payment Guide' },
        url: 'https://www.oic.or.th/th',
      },
    ],
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
    references: [
      {
        source: 'ประกันสังคม (SSO)',
        label: { th: 'สำนักงานประกันสังคม — เช็กสิทธิผู้ประกันตน ม.33 (e-Self Service)', en: 'SSO — Check Sec. 33 Benefits (e-Self Service)' },
        url: 'https://eself.sso.go.th/',
      },
    ],
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
    references: [
      {
        source: 'ธปท. (BOT)',
        label: { th: 'ธนาคารแห่งประเทศไทย — ลดเสี่ยง เพิ่มสุข ด้วยเงินออมเผื่อฉุกเฉิน', en: 'Bank of Thailand — Emergency Savings Guide' },
        url: 'https://www.bot.or.th/th/research-and-publications/articles-and-publications/bot-magazine-issues/Phrasiam-63-2/FinancialWisdom-SustainableShopping.html',
      },
    ],
    bridgeAction: {
      page: 'smartlog',
      label: { th: 'กลับไปติดตามเงินสำรองใน SmartLog', en: 'Track Your Reserve in SmartLog' },
    },
  },
  // ==================== NEW PURPLE CATEGORY: รู้ไว้ใช้ว่า? ====================
  {
    id: 'ucep-72h-rights',
    category: 'good-to-know',
    categoryLabel: { th: 'รู้ไว้ใช้ว่า?', en: 'Good to Know?' },
    readMinutes: 2,
    iconName: 'siren',
    keywords: ['ucep', 'ฉุกเฉินวิกฤต', '72 ชั่วโมง', '1669', 'สปสช', 'รักษาฟรี', 'รู้ไว้ใช้ว่า'],
    title: {
      th: 'สิทธิ UCEP เจ็บป่วยฉุกเฉินวิกฤต รักษาฟรี 72 ชม. ทุก รพ. ใกล้ที่สุด',
      en: 'UCEP 72-Hour Right: Free Critical Emergency Care Anywhere',
    },
    hook: {
      th: 'สิทธิพื้นฐานที่คนไทยทุกคนมี (ทั้ง ม.33, บัตรทอง, ข้าราชการ) เข้า รพ.เอกชนใกล้สุดได้ทันทีโดยไม่ต้องสำรองจ่าย',
      en: 'A Thai statutory right for everyone: get critical care at the nearest public or private hospital with ฿0 upfront for 72 hours.',
    },
    intro: {
      th: 'หลายคนไม่รู้ว่าหากเกิดภาวะ "ฉุกเฉินวิกฤตถึงแก่ชีวิต" เราสามารถเข้าโรงพยาบาลเอกชนที่ใกล้ที่สุดได้ทันทีภายใต้สิทธิ UCEP (Universal Coverage for Emergency Patients) โดยไม่ต้องกังวลเรื่องวางมัดจำใน 72 ชั่วโมงแรก',
      en: 'Many people do not realize that during a life-threatening emergency in Thailand, UCEP guarantees free stabilization at the nearest public or private hospital for up to 72 hours until safe transfer.',
    },
    translations: [
      {
        jargon: { th: 'สิทธิ UCEP 72 ชั่วโมงแรก', en: 'UCEP 72-Hour Coverage' },
        plain: {
          th: 'รักษาฟรีไม่เสียค่าใช้จ่ายใน รพ.ที่ใกล้ที่สุด (ทั้งรัฐและเอกชน) จนพ้นวิกฤตและย้ายไป รพ.ตามสิทธิได้อย่างปลอดภัย สูงสุดไม่เกิน 72 ชั่วโมง',
          en: 'Zero-cost emergency care at the nearest hospital (public or private) until stable enough to transfer, capped at 72 hours.',
        },
      },
      {
        jargon: { th: '6 อาการเข้าเกณฑ์ฉุกเฉินวิกฤต (โทร 1669)', en: '6 Qualifying Critical Symptoms (Call 1669)' },
        plain: {
          th: '1) หมดสติ ไม่หายใจ 2) หอบเหนื่อยรุนแรง 3) ซึม เหงื่อแตก ตัวเย็น ชัก 4) เจ็บหน้าอกเฉียบพลัน 5) แขนขาอ่อนแรง พูดไม่ชัดฉับพลัน 6) อาการวิกฤตอื่นที่กระทบชีวิต',
          en: '1) Unconscious/not breathing 2) Severe breathing distress 3) Seizures/cold sweat/shock 4) Sudden chest pain 5) Sudden limb weakness/slurred speech 6) Other life-threatening signs.',
        },
      },
      {
        jargon: { th: 'กรณีไม่เข้าเกณฑ์วิกฤต (สีเขียว/เหลือง)', en: 'Non-Critical Cases (Green / Yellow)' },
        plain: {
          th: 'หากอาการไม่เข้าเกณฑ์วิกฤต (เช่น ไข้หวัด ท้องเสียทั่วไป) จะไม่เข้า UCEP ต้องกลับไปใช้ รพ.ตามสิทธิ หรือจ่ายค่ารักษาเองหากรักษาต่อที่ รพ.เอกชน',
          en: 'Non-life-threatening illnesses (e.g., common fever or mild diarrhea) do not qualify for UCEP and require your registered hospital or personal payment.',
        },
      },
    ],
    example: {
      title: { th: 'รู้ไว้ใช้จริงในนาทีฉุกเฉิน', en: 'What to Do in an Actual Emergency' },
      body: {
        th: 'หากพบคนใกล้ตัวหมดสติหรือเจ็บหน้าอกรุนแรง ให้โทรสายด่วน 1669 หรือพาไป รพ.ใกล้ที่สุดพร้อมแจ้งขอใช้สิทธิ "UCEP" และเตรียมบัตรประชาชนเพื่อให้ รพ.ประเมินคัดกรองสิทธิได้ทันที',
        en: 'If someone collapses or has acute chest pain, call 1669 or go straight to the nearest ER, state you are invoking "UCEP", and present their Thai ID card for immediate triage verification.',
      },
    },
    takeaway: {
      th: 'สิทธิ UCEP คุ้มครองเฉพาะ 72 ชม. แรกในภาวะวิกฤตจริงเท่านั้น จึงควรรู้ไว้เพื่อช่วยชีวิต และยังมีเงินสำรอง/แผนรับมือสำหรับเคสแอดมิตทั่วไป',
      en: 'UCEP saves lives in the first 72 hours of true critical emergencies — know how to invoke it, while keeping reserves for standard hospital stays.',
    },
    references: [
      {
        source: 'สปสช. (NHSO)',
        label: { th: 'สปสช. — UCEP สิทธิรักษาเจ็บป่วยฉุกเฉินวิกฤต 72 ชม.', en: 'NHSO — Official UCEP 72-Hour Guide' },
        url: 'https://www.nhso.go.th/th/communicate-th/thnewsforperson/ucep',
      },
    ],
    bridgeAction: {
      page: 'risk-analysis',
      label: { th: 'ประเมินสิทธิภาครัฐของคุณใน Risk Analysis', en: 'Review State Rights in Risk Analysis' },
    },
  },
  {
    id: 'oic-freelook-license',
    category: 'good-to-know',
    categoryLabel: { th: 'รู้ไว้ใช้ว่า?', en: 'Good to Know?' },
    readMinutes: 2,
    iconName: 'badge-check',
    keywords: ['free look', '15 วัน', 'ยกเลิกกรมธรรม์', 'ใบอนุญาตตัวแทน', 'คปภ', '1186', 'รู้ไว้ใช้ว่า'],
    title: {
      th: 'เช็กใบอนุญาตตัวแทน & สิทธิ Free Look ยกเลิกคืนเงินใน 15 วัน',
      en: 'Verify Agent Licenses & Your 15-Day Free-Look Right',
    },
    hook: {
      th: '3 เกราะคุ้มครองผู้บริโภคจาก คปภ. ที่ควรรู้ก่อนโอนเงินสักบาท: เช็กใบอนุญาต, Free Look 15 วัน และสายด่วน 1186',
      en: '3 OIC consumer protections to know before paying a baht: license verification, 15-day Free Look, and Hotline 1186.',
    },
    intro: {
      th: 'หลายคนไม่กล้าศึกษาเรื่องประกันเพราะกลัวถูกหลอกหรือเผลอตัดสินใจเร็วเกินไป ความจริงแล้วกฎหมายไทยภายใต้ คปภ. มีกลไกคุ้มครองผู้บริโภคที่ชัดเจนและตรวจสอบได้ฟรีทางออนไลน์ภายใน 1 นาที',
      en: 'Many people avoid risk planning out of fear of pushy sales or buyer remorse. Thai OIC regulations provide strong consumer safeguards you can verify online in under a minute.',
    },
    translations: [
      {
        jargon: { th: 'สิทธิ Free Look Period (15 วัน)', en: '15-Day Free Look Period' },
        plain: {
          th: 'หลังได้รับเล่มกรมธรรม์ คุณมีเวลาอ่านทบทวน 15 วัน (หรือ 30 วันกรณีซื้อทางโทรศัพท์) หากเปลี่ยนใจสามารถขอยกเลิกและรับเบี้ยคืนได้ (หักเฉพาะค่าธรรมเนียมออกเล่มตามเกณฑ์)',
          en: 'After receiving your policy, you have 15 days (30 days for telesales) to review and cancel for a refund minus minimal issuance fees.',
        },
      },
      {
        jargon: { th: 'ตรวจสอบใบอนุญาตตัวแทน / นายหน้า', en: 'Agent & Broker License Check' },
        plain: {
          th: 'ก่อนให้ข้อมูลหรือโอนเงิน สามารถนำชื่อ-นามสกุล หรือเลขใบอนุญาต 10 หลักไปตรวจสอบสถานะผ่านระบบออนไลน์ OIC E-Service ได้ฟรี',
          en: 'Before sharing personal details or paying, verify any agent/broker name or 10-digit license number for free on OIC E-Service.',
        },
      },
      {
        jargon: { th: 'สายด่วน คปภ. 1186', en: 'OIC Consumer Hotline 1186' },
        plain: {
          th: 'หากมีข้อสงสัยเรื่องเงื่อนไขกรมธรรม์ เคลมล่าช้า หรือพบการขายที่ไม่เป็นธรรม สามารถปรึกษาและร้องเรียนได้โดยตรงที่สายด่วน คปภ. 1186',
          en: 'For neutral policy clarification, delayed claims, or unfair sales practices, contact the Office of Insurance Commission directly at 1186.',
        },
      },
    ],
    example: {
      title: { th: 'เช็กลิสต์ความปลอดภัย 3 ข้อก่อนโอนเงิน', en: '3-Point Safety Check Before Any Payment' },
      body: {
        th: '1) โอนเงินเข้าบัญชีชื่อ "บริษัทประกันภัย" โดยตรงเท่านั้น ห้ามโอนเข้าบัญชีส่วนตัวตัวแทน 2) เช็กเลขใบอนุญาตบนเว็บ คปภ. 3) เมื่อได้เล่มกรมธรรม์ ให้รีบเช็กความถูกต้องภายในช่วง Free Look 15 วัน',
        en: '1) Pay only to the official insurer corporate account — never an individual bank account 2) Verify license status on OIC E-Service 3) Review your delivered policy within the 15-day Free Look window.',
      },
    },
    takeaway: {
      th: 'ผู้บริโภคมีสิทธิอ่าน คิด และตรวจสอบให้มั่นใจก่อนเสมอ — อย่าเซ็นหรือโอนเงินภายใต้ความกดดัน',
      en: 'You always have the right to verify, pause, and review calmly — never commit under high-pressure tactics.',
    },
    references: [
      {
        source: 'คปภ. E-Service',
        label: { th: 'ระบบตรวจสอบใบอนุญาตตัวแทน / นายหน้า (OIC E-Service)', en: 'OIC E-Service — License Verification Portal' },
        url: 'https://smart.oic.or.th/eservice/Home',
      },
      {
        source: 'คปภ. (OIC)',
        label: { th: 'สำนักงาน คปภ. — ศูนย์คุ้มครองสิทธิประโยชน์ (สายด่วน 1186)', en: 'OIC — Consumer Protection & Hotline 1186' },
        url: 'https://www.oic.or.th/th',
      },
    ],
    bridgeAction: {
      page: 'risk-analysis',
      label: { th: 'ตั้งแจ้งเตือนปฏิทินทบทวนสิทธิใน Risk Analysis', en: 'Set Review Reminder in Risk Analysis' },
    },
  },
  {
    id: 'copayment-2568-rules',
    category: 'good-to-know',
    categoryLabel: { th: 'รู้ไว้ใช้ว่า?', en: 'Good to Know?' },
    readMinutes: 2,
    iconName: 'shield-question',
    keywords: ['co-payment', 'copayment', '2568', 'simple diseases', 'ป่วยเล็กน้อย', 'ร่วมจ่าย 30%', 'รู้ไว้ใช้ว่า'],
    title: {
      th: 'กติกาใหม่ Co-payment สุขภาพ (2568): เคลมแบบไหนไม่โดนร่วมจ่าย?',
      en: 'New 2025 Health Co-Payment Rules: When Does It Trigger?',
    },
    hook: {
      th: 'สรุปข้อเท็จจริงเกณฑ์ Co-payment ที่เริ่มใช้ตั้งแต่ มี.ค. 2568 แยกให้ชัดระหว่างโรคเล็กน้อย vs โรคร้ายแรง/ผ่าตัดใหญ่',
      en: 'Clear facts on Thailand’s March 2025 Co-payment standard — separating minor admissions from major surgeries.',
    },
    intro: {
      th: 'ข่าวเรื่องเกณฑ์ "Co-payment 30%–50%" ทำให้หลายคนตกใจว่าจะต้องร่วมจ่ายทุกครั้งที่เข้า รพ. ความจริงแล้วเกณฑ์ใหม่สำหรับกรมธรรม์ที่เริ่มตั้งแต่ มี.ค. 2568 ถูกออกแบบมาเพื่อคุมการแอดมิตโรคเล็กน้อยที่ไม่จำเป็น และ "ไม่กระทบ" การผ่าตัดใหญ่หรือโรคร้ายแรง',
      en: 'Headlines about 30%–50% Co-payment caused widespread worry. In reality, the March 2025 rule for new policies targets repeated minor admissions and explicitly exempts major surgeries and critical illnesses.',
    },
    translations: [
      {
        jargon: { th: 'มีผลกับกรมธรรม์ใหม่ (มี.ค. 2568 เป็นต้นไป)', en: 'Applies to New Policies (March 2025+)' },
        plain: {
          th: 'ผู้ที่มีกรมธรรม์สุขภาพเดิมก่อน 20 มี.ค. 2568 และต่ออายุต่อเนื่อง รวมถึงประกันกลุ่มบริษัท ยังคงใช้เงื่อนไขเดิมตามสัญญา',
          en: 'Existing policies issued before March 20, 2025 (continuously renewed) and Employer Group Insurance remain on their original terms.',
        },
      },
      {
        jargon: { th: 'กรณีที่ 1: ป่วยเล็กน้อย (Simple Diseases)', en: 'Trigger 1: Minor Illnesses (Simple Diseases)' },
        plain: {
          th: 'แอดมิตโรคเล็กน้อยที่ไม่รุนแรง (เช่น หวัด เวียนหัว ท้องเสีย กรดไหลย้อน) ตั้งแต่ 3 ครั้ง/ปีขึ้นไป และยอดเคลมรวม >= 200% ของเบี้ยสุขภาพ → ปีต่ออายุถัดไปอาจมีร่วมจ่าย 30%',
          en: '3+ inpatient claims/year for minor conditions (cold, dizziness, mild diarrhea, acid reflux) totaling >= 200% of health premium → may trigger 30% co-pay at next renewal.',
        },
      },
      {
        jargon: { th: 'ข้อยกเว้น: โรคร้ายแรง & ผ่าตัดใหญ่', en: 'Exempt: Major Surgery & Critical Illness' },
        plain: {
          th: 'การผ่าตัดใหญ่และโรคร้ายแรงไม่ถูกนับรวมในเกณฑ์กระตุ้น Co-payment และหากปีถัดไปเคลมไม่เข้าเกณฑ์แล้ว สิทธิจะกลับคืนเป็นปกติ',
          en: 'Major surgeries and critical illnesses are excluded from triggering co-pay, and clean claim years restore standard terms.',
        },
      },
    ],
    example: {
      title: { th: 'ตัวอย่างจริง: ป่วยหนักผ่าตัด 1 ครั้ง ฿150,000 โดน Co-pay ไหม?', en: 'Real Example: One ฿150,000 Major Surgery' },
      body: {
        th: 'คำตอบคือ "ไม่โดน" เพราะเป็นเคสผ่าตัดใหญ่และเกิดขึ้นเพียง 1 ครั้ง ไม่ใช่การแอดมิตโรคเล็กน้อยซ้ำ ๆ 3 ครั้งขึ้นไป — ดังนั้นการเจ็บป่วยเล็กน้อยควรรักษาแบบ OPD หรือใช้สิทธิประกันสังคม/กลุ่มให้เหมาะสม',
        en: 'Answer: NO. A single major surgery does not trigger co-payment — showing why routine minor illnesses belong in OPD/SSO care while IPD is reserved for genuine hospitalizations.',
      },
    },
    takeaway: {
      th: 'อย่าตื่นตระหนกกับข่าวลือ — ใช้สิทธิแอดมิต IPD เมื่อแพทย์เห็นว่าจำเป็นจริง และรักษาโรคเล็กน้อยแบบผู้ป่วยนอกเพื่อคงประวัติเคลมที่แข็งแรง',
      en: 'Ignore social-media panic — reserve inpatient admissions for genuine medical necessity and use OPD for minor symptoms.',
    },
    references: [
      {
        source: 'สมาคมประกันชีวิตไทย',
        label: { th: 'คำชี้แจงเงื่อนไข Co-payment ภายใต้ คปภ. (TLAA)', en: 'TLAA / OIC Official Co-Payment Clarification' },
        url: 'https://www.tlaa.org/page_bx.php?cid=23&cname=&cno=1935',
      },
      {
        source: 'สภาผู้บริโภค (TCC)',
        label: { th: 'สภาองค์กรของผู้บริโภค — มุมมองและข้อสังเกต Co-payment', en: 'Thailand Consumers Council — Co-Payment Review' },
        url: 'https://www.tcc.or.th/co-payment/',
      },
    ],
    bridgeAction: {
      page: 'invest',
      label: { th: 'เปรียบเทียบต้นทุนความเสี่ยงใน Value Lab', en: 'Compare Risk Costs in Value Lab' },
    },
  },
  {
    id: 'thai-tax-deduction-facts',
    category: 'good-to-know',
    categoryLabel: { th: 'รู้ไว้ใช้ว่า?', en: 'Good to Know?' },
    readMinutes: 2,
    iconName: 'receipt',
    keywords: ['ลดหย่อนภาษี', 'สรรพากร', '100000', '25000', '10 ปี', 'ฐานภาษี', 'irr', 'รู้ไว้ใช้ว่า'],
    title: {
      th: 'สิทธิลดหย่อนภาษีเบี้ยประกันชีวิต & สุขภาพ (สรรพากร): ใครคุ้มจริง?',
      en: 'Thai Tax Deduction Rules (RD): Who Actually Benefits?',
    },
    hook: {
      th: 'เช็กเพดานลดหย่อนจริง ฿100,000 (สุขภาพ ฿25,000) + กฎ 10 ปี และเหตุผลว่าทำไมฐานภาษี 0%–5% ไม่ควรซื้อเพื่อลดภาษีอย่างเดียว',
      en: 'Exact ฿100k life / ฿25k health caps, the 10-year rule, and why 0%–5% earners should not lock cash just for tax.',
    },
    intro: {
      th: 'ช่วงปลายปีมักมีคำชวนว่า "ซื้อประกันลดหย่อนภาษีสิ คุ้มมาก!" แต่ก่อนจะล็อกเงินสดไว้นาน 10 ปีขึ้นไป คุณควรรู้เพดานจริงของกรมสรรพากร และตรวจสอบก่อนว่าฐานภาษีปีนี้ของคุณเสียภาษีกี่เปอร์เซ็นต์',
      en: 'Year-end tax promos often pitch savings plans as a must-have. Before locking cash for 10+ years, check the exact Revenue Department rules and verify your real marginal tax bracket first.',
    },
    translations: [
      {
        jargon: { th: 'เพดานเบี้ยประกันชีวิต ฿100,000 (สัญญา >= 10 ปี)', en: 'Life Cap ฿100,000 (10+ Year Contract)' },
        plain: {
          th: 'ลดหย่อนได้ตามจ่ายจริงสูงสุด ฿100,000/ปี โดยสัญญาต้องมีระยะเวลาคุ้มครองตั้งแต่ 10 ปีขึ้นไป และเงินคืนระหว่างทางต้องไม่เกิน 20% ของเบี้ยรายปี',
          en: 'Deductible up to ฿100,000/yr if contract duration is at least 10 years and annual cashback does not exceed 20% of annual premium.',
        },
      },
      {
        jargon: { th: 'เพดานเบี้ยสุขภาพตนเอง ฿25,000', en: 'Health Sub-Cap ฿25,000' },
        plain: {
          th: 'เบี้ยประกันสุขภาพตนเองลดหย่อนได้สูงสุด ฿25,000/ปี แต่เมื่อรวมกับเบี้ยประกันชีวิตทั่วไปแล้วต้องไม่เกินเพดานรวม ฿100,000/ปี',
          en: 'Personal health premiums qualify up to ฿25,000/yr, counted inside the combined ฿100,000/yr life + health ceiling.',
        },
      },
      {
        jargon: { th: 'ความคุ้มค่าตามฐานภาษี (0% vs 10%+)', en: 'Tax Bracket Impact (0% vs. 10%+)' },
        plain: {
          th: 'หากรายได้ทั้งปีไม่เกิน ~฿310,000 (ฐานภาษี 0%) คุณประหยัดภาษีได้ ฿0! การลดหย่อนภาษีจะเริ่มเห็นผลชัดตั้งแต่ฐานภาษี 10%–15% ขึ้นไป',
          en: 'If annual income is under ~฿310,000 (0% bracket), tax savings are ฿0! Tax deductions become meaningful starting at the 10%–15%+ brackets.',
        },
      },
    ],
    example: {
      title: { th: 'เทียบชัด ๆ: First Jobber รายได้ ฿25,000/ด. vs ฿50,000/ด.', en: 'Comparison: ฿25k/mo vs. ฿50k/mo Earner' },
      body: {
        th: 'รายได้ ฿25,000/ด. (฿300,000/ปี) หักค่าใช้จ่าย ฿100k + ส่วนตัว ฿60k เหลือเงินได้สุทธิ ฿140,000 → อยู่ในเกณฑ์ยกเว้นภาษี (0%) จึงประหยัดภาษี ฿0 แต่ถ้าเงินเดือน ฿50,000/ด. (ฐานภาษี 10%) เบี้ย ฿30,000 จะได้คืนภาษี ฿3,000/ปี ช่วยดัน IRR เพิ่มได้จริง',
        en: 'At ฿25k/mo (฿300k/yr), taxable income after standard deductions is ฿140k → 0% tax bracket (฿0 saved). At ฿50k/mo (10% bracket), ฿30k saves ฿3,000/yr in taxes and meaningfully lifts effective IRR.',
      },
    },
    takeaway: {
      th: 'อย่าซื้อแผนผูกพัน 10 ปีเพราะคำว่า "ลดหย่อนภาษี" ก่อนเช็กฐานภาษีจริงและ IRR หลังหักเงินเฟ้อของตัวคุณเอง',
      en: 'Never lock cash for 10 years for "tax deductions" without checking your actual Thai tax bracket and real IRR first.',
    },
    references: [
      {
        source: 'กรมสรรพากร (RD)',
        label: { th: 'กรมสรรพากร — เกณฑ์ลดหย่อนเบี้ยประกันชีวิตและสุขภาพ (Clear Cut)', en: 'Revenue Department — Life & Health Tax Deduction Rules' },
        url: 'https://www.rd.go.th/62777.html',
      },
      {
        source: 'กรมสรรพากร (RD)',
        label: { th: 'กรมสรรพากร — รายการค่าลดหย่อนภาษีบุคคลธรรมดาทั้งหมด', en: 'Revenue Department — All Personal Tax Allowances' },
        url: 'https://www.rd.go.th/557.html',
      },
    ],
    bridgeAction: {
      page: 'invest',
      label: { th: 'เช็กฐานภาษีและ IRR จริงใน Invest & Value Lab', en: 'Check Your Tax & IRR in Value Lab' },
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

// =============================================================================
// 15-QUESTION RANDOMIZED LITERACY QUIZ BANK
// All 3 choices per question are strictly balanced in length (anti-guessing!)
// =============================================================================
export const LITERACY_QUIZ_BANK = [
  {
    id: 'q1-waiting',
    question: {
      th: 'แผนคุ้มครองสุขภาพอนุมัติวันนี้ พรุ่งนี้เป็นไข้เลือดออกแอดมิตทันที เคลมได้หรือไม่?',
      en: 'Your health plan is approved today, and dengue hits tomorrow. Can you claim?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'เคลมได้เต็มวงเงินทันที เพราะสัญญาอนุมัติแล้ว', en: 'Fully covered immediately once policy is approved' },
      },
      {
        id: 'b',
        label: { th: 'ยังเคลมไม่ได้ เพราะมีระยะเวลารอคอย 30 วัน', en: 'Not covered yet due to the 30-day waiting period' },
      },
      {
        id: 'c',
        label: { th: 'เคลมได้ครึ่งหนึ่งเฉพาะค่าห้องและค่ายาเบื้องต้น', en: 'Half covered for standard hospital room fees only' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'โรคทั่วไปมีระยะเวลารอคอยมาตรฐาน 30 วัน (และ 120 วันสำหรับ 8 โรคเฉพาะ) ส่วนอุบัติเหตุเฉียบพลันมักคุ้มครองทันที',
      en: 'General illnesses carry a 30-day waiting period (120 days for 8 specific conditions), while sudden accidents usually start immediately.',
    },
  },
  {
    id: 'q2-unknown-limit',
    question: {
      th: 'หากมีประกันกลุ่มบริษัทแต่ "ไม่ทราบวงเงินจริง" ควรประเมินวงเงินที่มีไว้เท่าไร?',
      en: 'If you have Employer Group Insurance with an unknown limit, how much should you count?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'นับเป็น 0 บาทไว้ก่อน แล้วค่อยถามตัวเลขจาก HR', en: 'Count it as ฿0 first until confirmed with HR' },
      },
      {
        id: 'b',
        label: { th: 'เดาไว้ก่อนว่าน่าจะคุ้มครองราว 100,000 บาท', en: 'Estimate it at ฿100,000 as a rough baseline' },
      },
      {
        id: 'c',
        label: { th: 'นับว่าครอบคลุมเต็มบิลได้ทุกโรงพยาบาลเอกชน', en: 'Assume it covers 100% of private hospital bills' },
      },
    ],
    correctId: 'a',
    explanation: {
      th: 'หลักประเมินแบบรอบคอบจะนับวงเงินที่ไม่ทราบค่าเป็น ฿0 เพื่อไม่ให้ประเมินช่องว่างความเสี่ยงต่ำเกินจริง จากนั้นถาม HR เพื่อกรอกตัวเลขจริง',
      en: 'Conservative estimation counts unknown limits as ฿0 so you never underestimate your risk gap before getting exact numbers from HR.',
    },
  },
  {
    id: 'q3-deductible',
    question: {
      th: 'มีประกันกลุ่ม ฿30,000 อยู่แล้ว กลไกใดช่วยลดการจ่ายเบี้ยซ้ำซ้อนเมื่อปิดช่องว่างบิลใหญ่?',
      en: 'With a ฿30,000 group limit already, what avoids double-paying while covering huge bills?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'เพิ่มวงเงินผู้ป่วยนอก (OPD) ให้สูงสุดทุกปี', en: 'Maximize routine OPD clinic visits each year' },
      },
      {
        id: 'b',
        label: { th: 'เลือกใช้ความรับผิดส่วนแรก (Deductible) ต่อยอด', en: 'Use a Deductible layer above your group cap' },
      },
      {
        id: 'c',
        label: { th: 'ยกเลิกสิทธิประกันสังคม ม.33 เพื่อลดความซ้ำ', en: 'Cancel Social Security Sec. 33 to cut overlap' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'Deductible ช่วยให้ประกันกลุ่มจ่ายก้อนแรกก่อน แล้วแผนส่วนตัวค่อยรับช่วงส่วนเกิน จึงลดเบี้ยที่ซ้ำซ้อนได้จริง',
      en: 'A deductible lets your group plan pay the first layer while supplemental cover absorbs catastrophic excess bills.',
    },
  },
  {
    id: 'q4-budget-cap',
    question: {
      th: 'ตามหลักการเงินที่เป็นกลาง งบโอนย้ายความเสี่ยงควรคุมไว้ไม่เกินกี่ % ของรายได้?',
      en: 'Under neutral finance guardrails, risk-transfer spend should stay within what % of income?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ไม่เกิน 10%–15% ของรายได้ต่อเดือนตามเกณฑ์', en: 'Within 10%–15% of monthly income comfortably' },
      },
      {
        id: 'b',
        label: { th: 'ประมาณ 30%–40% ของรายได้เพื่อวงเงินสูงสุด', en: 'Around 30%–40% of income for maximum limits' },
      },
      {
        id: 'c',
        label: { th: 'ใช้เงินเหลือเก็บต่อเดือนทั้งหมด 100% เต็ม', en: 'Use 100% of all leftover monthly cash surplus' },
      },
    ],
    correctId: 'a',
    explanation: {
      th: 'กรอบ 10%–15% ช่วยป้องกันเหตุใหญ่ได้โดยไม่เบียดเบียนเงินสำรองฉุกเฉินและการลงทุนเติบโตระยะยาว',
      en: 'The 10%–15% cap protects against major shocks without starving your emergency reserve or long-term investments.',
    },
  },
  {
    id: 'q5-disclosure',
    question: {
      th: 'หากเคยตรวจพบโรคประจำตัวมาก่อนแต่เลือก "ไม่แถลงประวัติ" จะเกิดผลอย่างไร?',
      en: 'What happens if you omit a prior medical diagnosis on your health application?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ไม่มีผลกระทบ เพราะตรวจสอบประวัติย้อนหลังไม่ได้', en: 'No impact because past records stay private' },
      },
      {
        id: 'b',
        label: { th: 'ได้เบี้ยรายปีถูกลงและเบิกโรคนั้นได้ตามปกติ', en: 'Lower premiums with normal claim approvals' },
      },
      {
        id: 'c',
        label: { th: 'เสี่ยงถูกปฏิเสธเคลมและบอกล้างสัญญาตามกฎหมาย', en: 'Risk of claim denial and contract rescission' },
      },
    ],
    correctId: 'c',
    explanation: {
      th: 'การแถลงความจริง 100% คือเกราะป้องกันสิทธิที่ดีที่สุด เพราะหากปกปิดประวัติสำคัญ บริษัทมีสิทธิบอกล้างสัญญาได้ภายใน 2 ปี',
      en: '100% honest disclosure protects your valid claims; concealing material history allows legal rescission within 2 years.',
    },
  },
  {
    id: 'q6-ucep',
    question: {
      th: 'สิทธิ UCEP คุ้มครองผู้ป่วยฉุกเฉินวิกฤตใน รพ.ใกล้ที่สุดฟรี นานสูงสุดกี่ชั่วโมง?',
      en: 'How long does Thailand’s UCEP free critical emergency care last at the nearest hospital?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'คุ้มครองฟรีสูงสุด 24 ชั่วโมงแรกหลังเกิดเหตุ', en: 'Free emergency care for the first 24 hours' },
      },
      {
        id: 'b',
        label: { th: 'คุ้มครองฟรีสูงสุด 72 ชั่วโมงจนพ้นภาวะวิกฤต', en: 'Free stabilization for up to 72 hours max' },
      },
      {
        id: 'c',
        label: { th: 'คุ้มครองฟรีตลอดการรักษาจนกว่าจะหายขาดดี', en: 'Free unlimited inpatient stay until fully cured' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'สิทธิ UCEP ครอบคลุม 6 อาการฉุกเฉินวิกฤตที่ รพ.ใกล้ที่สุด (รัฐหรือเอกชน) ฟรีไม่เกิน 72 ชั่วโมงจนพ้นวิกฤตและย้ายไป รพ.ตามสิทธิได้',
      en: 'UCEP covers 6 qualifying life-threatening conditions at the nearest hospital for up to 72 hours until safe transfer.',
    },
  },
  {
    id: 'q7-freelook',
    question: {
      th: 'หลังได้รับเล่มกรมธรรม์ สิทธิ Free Look ให้เวลาทบทวนขอยกเลิกคืนเบี้ยได้กี่วัน?',
      en: 'How many days does the standard Free Look period give you to review and cancel a policy?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ภายใน 15 วันนับจากวันที่ได้รับเล่มกรมธรรม์', en: 'Within 15 days after receiving your policy' },
      },
      {
        id: 'b',
        label: { th: 'ภายใน 3 วันนับจากวันที่โอนเงินชำระเบี้ยแรก', en: 'Within 3 days after making your first payment' },
      },
      {
        id: 'c',
        label: { th: 'ไม่สามารถยกเลิกได้ทุกกรณีหลังอนุมัติสัญญา', en: 'Cancellation is never allowed once approved' },
      },
    ],
    correctId: 'a',
    explanation: {
      th: 'สิทธิ Free Look ให้เวลาอ่านเงื่อนไข 15 วันหลังรับเล่ม (หรือ 30 วันกรณีซื้อทางโทรศัพท์) หากไม่ตรงใจสามารถขอยกเลิกคืนเงินได้',
      en: 'The Free Look window gives you 15 days after delivery (30 days for telesales) to cancel for a refund minus minimal fees.',
    },
  },
  {
    id: 'q8-oic-hotline',
    question: {
      th: 'หากมีข้อสงสัยเรื่องกรมธรรม์หรือเคลมไม่เป็นธรรม ควรติดต่อสายด่วนหน่วยงานใด?',
      en: 'Which neutral regulator hotline assists Thai consumers with insurance disputes?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'สายด่วนสำนักงาน คปภ. หมายเลข 1186 โดยตรง', en: 'Office of Insurance Commission Hotline 1186' },
      },
      {
        id: 'b',
        label: { th: 'สายด่วนกรมสรรพากร หมายเลข 1161 โดยตรง', en: 'Thai Revenue Department Hotline 1161 directly' },
      },
      {
        id: 'c',
        label: { th: 'สายด่วนการท่องเที่ยวแห่งประเทศไทย 1672', en: 'Tourism Authority of Thailand Hotline 1672' },
      },
    ],
    correctId: 'a',
    explanation: {
      th: 'สายด่วน คปภ. 1186 คือช่องทางกลางสำหรับปรึกษาเงื่อนไข ตรวจสอบสิทธิ และร้องเรียนข้อพิพาทด้านประกันภัยโดยเฉพาะ',
      en: 'OIC Hotline 1186 is Thailand’s official insurance regulator channel for neutral advice, license checks, and dispute resolution.',
    },
  },
  {
    id: 'q9-opd-ipd',
    question: {
      th: 'สำหรับ First Jobber ที่งบจำกัด ควรให้ความสำคัญกับค่ารักษาแบบใดก่อน?',
      en: 'On a limited starter budget, which hospital coverage layer should come first?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ผู้ป่วยนอก (OPD) เพื่อเบิกค่ายาหวัดได้ทุกครั้ง', en: 'Outpatient (OPD) to claim every minor clinic trip' },
      },
      {
        id: 'b',
        label: { th: 'ผู้ป่วยใน (IPD) เพื่อกันบิลแอดมิตก้อนใหญ่หลักแสน', en: 'Inpatient (IPD) to shield against ฿100k+ hospital bills' },
      },
      {
        id: 'c',
        label: { th: 'ทันตกรรมและตรวจสุขภาพประจำปีแบบพรีเมียม', en: 'Premium dental and annual wellness packages' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'IPD คือเหตุที่เกิดไม่บ่อยแต่ยอดบิลสูงหลักหมื่น-แสน ส่วน OPD ยอดเล็กสามารถใช้เงินสำรองหรือสวัสดิการบริษัทดูแลได้คุ้มกว่า',
      en: 'Inpatient (IPD) stays can wipe out savings in one shock, while small OPD clinic bills are cheaper to handle via reserves or workplace benefits.',
    },
  },
  {
    id: 'q10-irr',
    question: {
      th: 'ข้อใดอธิบายความหมายของค่า IRR ในแผนสะสมทรัพย์ระยะยาวได้ถูกต้องที่สุด?',
      en: 'Which statement accurately describes IRR on a long-term savings plan?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'เปอร์เซ็นต์เงินคืนเทียบกับทุนประกันในแต่ละปี', en: 'Annual headline cashback percent of sum insured' },
      },
      {
        id: 'b',
        label: { th: 'อัตราผลตอบแทนทบต้นต่อปีจริงจากกระแสเงินสด', en: 'True annualized compound return across cashflows' },
      },
      {
        id: 'c',
        label: { th: 'อัตราภาษีที่กรมสรรพากรหัก ณ ที่จ่ายทุกสิ้นปี', en: 'Annual withholding tax rate charged at year-end' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'IRR คืออัตราดอกเบี้ยทบต้นที่แท้จริงต่อปีจากเงินที่จ่ายออกและรับคืนจริงตลอดสัญญา ไม่ใช่ตัวเลข % เงินคืนตามทุนประกัน',
      en: 'IRR measures your true annualized compound interest rate across actual cash outflows and inflows, unlike marketing cashback slogans.',
    },
  },
  {
    id: 'q11-tax-10yr',
    question: {
      th: 'เบี้ยประกันชีวิตทั่วไปต้องมีระยะเวลาคุ้มครองกี่ปีขึ้นไปจึงใช้ลดหย่อนภาษีไทยได้?',
      en: 'What minimum policy duration is required for Thai life insurance tax deductions?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ต้องมีระยะเวลาคุ้มครองตั้งแต่ 3 ปีขึ้นไป', en: 'Contract duration of at least 3 years or more' },
      },
      {
        id: 'b',
        label: { th: 'ต้องมีระยะเวลาคุ้มครองตั้งแต่ 5 ปีขึ้นไป', en: 'Contract duration of at least 5 years or more' },
      },
      {
        id: 'c',
        label: { th: 'ต้องมีระยะเวลาคุ้มครองตั้งแต่ 10 ปีขึ้นไป', en: 'Contract duration of at least 10 years or more' },
      },
    ],
    correctId: 'c',
    explanation: {
      th: 'ตามเกณฑ์กรมสรรพากร กรมธรรม์ประกันชีวิตต้องมีระยะเวลาคุ้มครองตั้งแต่ 10 ปีขึ้นไป และลดหย่อนได้สูงสุด ฿100,000/ปี',
      en: 'Thai Revenue Department rules require at least a 10-year policy term, deductible up to ฿100,000 per year.',
    },
  },
  {
    id: 'q12-tax-bracket',
    question: {
      th: 'พนักงานรายได้ ฿25,000/เดือน (ฐานภาษี 0%) ซื้อแผนลดหย่อนภาษี ฿30,000 จะได้ภาษีคืนกี่บาท?',
      en: 'A ฿25,000/mo earner (0% Thai tax bracket) pays ฿30,000 into a tax plan. How much tax is saved?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ได้ภาษีคืน 0 บาท เพราะยังไม่อยู่ในเกณฑ์เสียภาษี', en: 'Saves ฿0 since taxable income is already at 0%' },
      },
      {
        id: 'b',
        label: { th: 'ได้ภาษีคืน 3,000 บาทเท่ากันทุกคนทุกช่วงรายได้', en: 'Saves ฿3,000 flat regardless of income bracket' },
      },
      {
        id: 'c',
        label: { th: 'ได้ภาษีคืน 6,000 บาทเข้าบัญชีพร้อมเพย์ปลายปี', en: 'Saves ฿6,000 refunded via PromptPay at year-end' },
      },
    ],
    correctId: 'a',
    explanation: {
      th: 'หากรายได้สุทธิอยู่ในเกณฑ์ยกเว้นภาษี (0%) คุณไม่เสียภาษีอยู่แล้ว จึงไม่มีภาษีให้ลดหย่อน ควรเน้นสร้างเงินสำรองฉุกเฉินก่อน',
      en: 'When your marginal tax rate is 0%, tax deductions save ฿0 — focus on building emergency savings and liquid wealth first.',
    },
  },
  {
    id: 'q13-job-switch',
    question: {
      th: 'เมื่อพนักงานประจำลาออกหรือย้ายบริษัท สิทธิ "ประกันกลุ่มบริษัทเดิม" จะเป็นอย่างไร?',
      en: 'What happens to your previous Employer Group Insurance when you resign to switch jobs?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ติดตัวไปใช้ต่อที่บริษัทใหม่ได้โดยอัตโนมัติ', en: 'Automatically transfers over to your new employer' },
      },
      {
        id: 'b',
        label: { th: 'สิ้นสุดความคุ้มครองลงเมื่อพ้นสภาพพนักงานเดิม', en: 'Ends as soon as employment with that company ends' },
      },
      {
        id: 'c',
        label: { th: 'คุ้มครองฟรีต่ออีก 2 ปีเต็มแม้ไม่ได้ทำงานแล้ว', en: 'Stays active free for 2 full years after leaving' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'ประกันกลุ่มเป็นสวัสดิการผูกกับบริษัทเดิม เมื่อลาออกสิทธิจะสิ้นสุดทันที จึงควรวางแผนรับมือช่วงรอยต่อเปลี่ยนงานไว้ด้วย',
      en: 'Group insurance belongs to the employer and terminates upon resignation, creating a transition gap during probation.',
    },
  },
  {
    id: 'q14-grace-period',
    question: {
      th: 'ระยะเวลาผ่อนผัน (Grace Period) ที่ขยายเวลาชำระเบี้ยหลังครบกำหนด มักอยู่ที่กี่วัน?',
      en: 'How long is the typical Grace Period after a policy premium due date?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'ประมาณ 7 วัน และตัดความคุ้มครองทันทีในวันที่ 8', en: 'About 7 days before coverage drops on day 8' },
      },
      {
        id: 'b',
        label: { th: 'ประมาณ 31 วัน โดยความคุ้มครองยังเดินต่อตามปกติ', en: 'About 31 days while coverage remains active' },
      },
      {
        id: 'c',
        label: { th: 'ประมาณ 180 วัน โดยไม่ต้องชำระเบี้ยย้อนหลังเลย', en: 'About 180 days with no back-payments required' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'Grace Period มาตรฐานอยู่ที่ 31 วันหลังครบกำหนด ระหว่างนี้ความคุ้มครองยังคงอยู่ แต่ควรตั้งปฏิทินเตือนล่วงหน้าเพื่อไม่ให้ขาดอายุ',
      en: 'Standard grace periods last 31 days with active protection, though setting a calendar reminder avoids accidental lapses.',
    },
  },
  {
    id: 'q15-copay-2568',
    question: {
      th: 'ตามเกณฑ์ Co-payment สุขภาพปี 2568 การผ่าตัดใหญ่หรือโรคร้ายแรง 1 ครั้งจะโดนร่วมจ่ายไหม?',
      en: 'Under Thailand’s 2025 Co-payment rules, does a single major surgery trigger co-pay?',
    },
    options: [
      {
        id: 'a',
        label: { th: 'โดนร่วมจ่าย 30% ทันทีตั้งแต่วันแรกที่เข้าผ่าตัด', en: 'Triggers 30% co-pay immediately on day one' },
      },
      {
        id: 'b',
        label: { th: 'ไม่โดน เพราะผ่าตัดใหญ่และโรคร้ายแรงได้รับยกเว้น', en: 'No — major surgery & critical illness are exempt' },
      },
      {
        id: 'c',
        label: { th: 'โดนยกเลิกกรมธรรม์ทันทีเมื่อยอดเคลมเกิน 50,000', en: 'Cancels the policy whenever a claim tops ฿50k' },
      },
    ],
    correctId: 'b',
    explanation: {
      th: 'เกณฑ์ Co-payment ปี 2568 มุ่งคุมการแอดมิตโรคเล็กน้อย (Simple Diseases) ซ้ำ ๆ 3 ครั้งขึ้นไป โดยยกเว้นการผ่าตัดใหญ่และโรคร้ายแรง',
      en: 'The 2025 co-payment standard targets repeated minor admissions (3+ times/yr) and explicitly exempts major surgeries and critical illnesses.',
    },
  },
];

// Keep backward-compatible alias if anything references LITERACY_QUIZ
export const LITERACY_QUIZ = LITERACY_QUIZ_BANK;

function shuffleList(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick 5 fresh questions from the 15-question bank (avoiding previous round IDs)
 * and shuffle the A/B/C option order on every question.
 */
export function buildRandomQuizSession(count = 5, previousIds = []) {
  const avoid = new Set(Array.isArray(previousIds) ? previousIds : []);
  const fresh = shuffleList(LITERACY_QUIZ_BANK.filter((q) => !avoid.has(q.id)));
  const seen = shuffleList(LITERACY_QUIZ_BANK.filter((q) => avoid.has(q.id)));
  const picked = [...fresh, ...seen].slice(0, count);

  return picked.map((q) => ({
    ...q,
    options: shuffleList(q.options),
  }));
}

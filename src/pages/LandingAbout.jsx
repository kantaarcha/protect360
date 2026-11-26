import { Info } from 'lucide-react';
import ModulePlaceholder from '../components/ModulePlaceholder';

export default function LandingAbout({ onNavigate }) {
  return (
    <ModulePlaceholder
      icon={Info}
      roundTag={{ th: 'Round 6', en: 'Round 6' }}
      title={{
        th: 'หน้าหลัก & เกี่ยวกับ PROTECT360',
        en: 'Landing & About PROTECT360',
      }}
      subtitle={{
        th: 'พันธกิจพื้นที่กลางให้ความรู้ หลักคณิตศาสตร์ประกันภัยที่โปร่งใส และกรอบการแข่งขัน คปภ.',
        en: 'Our neutral education charter, transparent actuarial methodology & OIC case overview',
      }}
      plannedFeatures={[
        {
          th: 'ปรัชญา 3 ขั้น: เข้าใจเงินของคุณ → เข้าใจความเสี่ยง → ตัดสินใจอย่างมั่นใจ',
          en: '3-step philosophy: Understand Money → Understand Risks → Better Decisions',
        },
        {
          th: 'เอกสารอธิบายสมมติฐานคณิตศาสตร์ประกันภัย (Conservative Estimation) อย่างเปิดเผย',
          en: 'Open actuarial methodology & Conservative Estimation transparency',
        },
        {
          th: 'คำมั่นสัญญาความเป็นกลาง: ไม่มีโฆษณา ไม่มีค่าคอมมิชชัน และไม่ขายกรมธรรม์',
          en: 'Strict neutrality pledge: zero ads, zero commissions, zero sales walls',
        },
        {
          th: 'ออกแบบเพื่อคนไทยทุกช่วงวัย (Inclusive FinTech Design) รองรับสองภาษา',
          en: 'Inclusive bilingual all-ages design built for Thai households',
        },
      ]}
      onNavigate={onNavigate}
    />
  );
}

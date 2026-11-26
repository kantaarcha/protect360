import { BookOpen } from 'lucide-react';
import ModulePlaceholder from '../components/ModulePlaceholder';

export default function LearningCenter({ onNavigate }) {
  return (
    <ModulePlaceholder
      icon={BookOpen}
      roundTag={{ th: 'Round 6', en: 'Round 6' }}
      title={{
        th: 'คลังความรู้ — ศูนย์การเรียนรู้ทางการเงินและประกันภัย',
        en: 'Learning Center — Financial & Insurance Literacy Hub',
      }}
      subtitle={{
        th: 'คู่มืออ่านกรมธรรม์ สิทธิประกันสังคม และวิธีตรวจสอบข้อตกลงคุ้มครองอย่างเป็นกลาง',
        en: 'Plain-language guides on policy reading, statutory rights & OIC standards',
      }}
      plannedFeatures={[
        {
          th: 'คู่มือเช็กสิทธิประกันสังคม ม.33 / บัตรทอง / ประกันกลุ่มบริษัทแบบเข้าใจง่าย',
          en: 'Clear comparison of SSO Sec. 33, UHC & Employer Group coverage',
        },
        {
          th: 'พจนานุกรมคำศัพท์ประกันภัย: Co-pay, Deductible, Waiting Period, Exclusions',
          en: 'Plain-Thai/EN glossary: Co-pay, Deductible, Waiting Period & Exclusions',
        },
        {
          th: 'เช็กลิสต์ 5 คำถามสำคัญที่ควรถามก่อนตัดสินใจซื้อกรมธรรม์ทุกฉบับ',
          en: '5 essential questions checklist before purchasing any insurance policy',
        },
        {
          th: 'ช่องทางตรวจสอบใบอนุญาตตัวแทนและร้องเรียนผ่านสายด่วน คปภ. 1186',
          en: 'Agent license verification & OIC Hotline 1186 consumer guidance',
        },
      ]}
      onNavigate={onNavigate}
    />
  );
}

import { Gamepad2 } from 'lucide-react';
import ModulePlaceholder from '../components/ModulePlaceholder';

export default function Game({ onNavigate }) {
  return (
    <ModulePlaceholder
      icon={Gamepad2}
      roundTag={{ th: 'Round 5', en: 'Round 5' }}
      title={{
        th: 'Game — เกมจำลองชีวิตและการตัดสินใจบริหารความเสี่ยง',
        en: 'Game — Life-Event Risk Management Simulator',
      }}
      subtitle={{
        th: 'เรียนรู้ผ่านสถานการณ์จำลองแบบโต้ตอบเพื่อฝึกจัดสรรเงินออมและรับมือเหตุไม่คาดฝัน',
        en: 'Interactive scenario gameplay teaching resilience and risk trade-offs',
      }}
      plannedFeatures={[
        {
          th: 'จำลองเส้นทางชีวิต 12 เดือนของ First Jobber พร้อมเหตุการณ์สุ่มตามสถิติ',
          en: '12-month First Jobber journey with actuarial probability events',
        },
        {
          th: 'เปรียบเทียบผลลัพธ์ทางการเงินระหว่าง "มีแผนรองรับ" กับ "ไม่ได้เตรียมตัว"',
          en: 'Side-by-side financial resilience impact of prepared vs. unprepared paths',
        },
        {
          th: 'ระบบคะแนน Financial Resilience Score และบทสรุปบทเรียนรายสถานการณ์',
          en: 'Financial Resilience Score with post-round educational debriefs',
        },
        {
          th: 'รองรับทุกช่วงวัยด้วยภาษาเข้าใจง่ายและขนาดตัวอักษรที่ปรับได้',
          en: 'Accessible all-ages UI with instant TH/EN & A-/A+ support',
        },
      ]}
      onNavigate={onNavigate}
    />
  );
}

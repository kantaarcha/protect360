import { Sparkles } from 'lucide-react';
import ModulePlaceholder from '../components/ModulePlaceholder';

export default function AutoKey({ onNavigate }) {
  return (
    <ModulePlaceholder
      icon={Sparkles}
      roundTag={{ th: 'Round 2', en: 'Round 2' }}
      title={{
        th: 'AutoKey — บันทึกรายรับ-รายจ่ายอัตโนมัติ',
        en: 'AutoKey — Smart Cashflow & Slip Logger',
      }}
      subtitle={{
        th: 'คัดแยกหมวดหมู่รายรับ-รายจ่าย สัดส่วนการออม และสภาพคล่องแบบเรียลไทม์',
        en: 'Automated cashflow categorization, savings ratio, and runway tracking',
      }}
      plannedFeatures={[
        {
          th: 'บันทึกข้อความด่วนหรือจำลองอ่านสลิปโอนเงินเข้า FinanceContext',
          en: 'Quick-entry natural text & simulated transfer slip parser',
        },
        {
          th: 'จำแนกค่าใช้จ่ายจำเป็น (Needs) vs ยืดหยุ่น (Wants) vs เงินออม',
          en: 'Automatic Needs vs. Wants vs. Emergency Savings breakdown',
        },
        {
          th: 'คำนวณสัดส่วนเบี้ยประกันที่เหมาะสมไม่เกิน 10–15% ของรายได้',
          en: 'Affordable premium ceiling guardrail (10–15% of income)',
        },
        {
          th: 'อัปเดตกราฟเงินสำรองฉุกเฉินและรายการเคลื่อนไหวหน้าภาพรวมทันที',
          en: 'Live two-way sync with Overview Runway & Recent Activities',
        },
      ]}
      onNavigate={onNavigate}
    />
  );
}

import { ShieldAlert } from 'lucide-react';
import ModulePlaceholder from '../components/ModulePlaceholder';

export default function RiskAnalysis({ onNavigate }) {
  return (
    <ModulePlaceholder
      icon={ShieldAlert}
      roundTag={{ th: 'Round 3', en: 'Round 3' }}
      title={{
        th: 'วิเคราะห์ความเสี่ยง (Risk Analysis) — ช่องว่างความคุ้มครอง',
        en: 'Risk Analysis — Actuarial Protection Gap Engine',
      }}
      subtitle={{
        th: 'ประเมินความเสี่ยง 6 ด้าน พร้อมหลัก Conservative Estimation เมื่อไม่ทราบวงเงิน',
        en: '6-pillar risk diagnostics with transparent Conservative Estimation rules',
      }}
      plannedFeatures={[
        {
          th: 'แบบประเมินความเสี่ยงส่วนบุคคล: อาชีพ สุขภาพ ภาระหนี้ และผู้พึ่งพิง',
          en: 'Personal risk intake: occupation, health, debts & dependents',
        },
        {
          th: 'เปรียบเทียบสิทธิประกันสังคม ประกันกลุ่ม และช่องว่างจริงแบบละเอียด',
          en: 'Deep breakdown of Social Security, Group Plan & true residual gap',
        },
        {
          th: 'จำลองเหตุการณ์วิกฤต (Stress Test) เช่น นอน รพ. 5 คืน หรือพักฟื้น 3 เดือน',
          en: 'Medical & income shock stress-test simulator',
        },
        {
          th: 'จัดลำดับความสำคัญการปิดความเสี่ยงแบบเป็นกลาง ไม่ขายกรมธรรม์',
          en: 'Neutral priority roadmap with zero sales bias',
        },
      ]}
      onNavigate={onNavigate}
    />
  );
}

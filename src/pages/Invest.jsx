import { TrendingUp } from 'lucide-react';
import ModulePlaceholder from '../components/ModulePlaceholder';

export default function Invest({ onNavigate }) {
  return (
    <ModulePlaceholder
      icon={TrendingUp}
      roundTag={{ th: 'Round 4', en: 'Round 4' }}
      title={{
        th: 'วางแผนลงทุน (IRR) — เปรียบเทียบผลตอบแทนและประกันสะสมทรัพย์',
        en: 'Invest (IRR) — Transparent IRR & Wealth Comparator',
      }}
      subtitle={{
        th: 'คำนวณ IRR แท้จริงของประกันสะสมทรัพย์เทียบกับกองทุนรวมและสิทธิลดหย่อนภาษี',
        en: 'True IRR calculator comparing endowment policies, funds, and tax benefits',
      }}
      plannedFeatures={[
        {
          th: 'คำนวณ IRR จริง (Effective Annual Yield) แยกจากตัวเลข % เงินคืนตามทุนประกัน',
          en: 'True IRR computation vs. headline percentage of sum assured',
        },
        {
          th: 'เปรียบเทียบกลยุทธ์ Buy Term & Invest the Difference แบบโปร่งใส',
          en: 'Transparent Buy Term & Invest the Difference comparison',
        },
        {
          th: 'จำลองผลกระทบของอัตราภาษีเงินได้ (0% – 35%) ต่อผลตอบแทนสุทธิ',
          en: 'Marginal tax bracket (0%–35%) net yield simulator',
        },
        {
          th: 'เตือนความเสี่ยงสภาพคล่อง (Surrender Value) หากเวนคืนกรมธรรม์ก่อนกำหนด',
          en: 'Early surrender value & liquidity lock-in warning visualization',
        },
      ]}
      onNavigate={onNavigate}
    />
  );
}

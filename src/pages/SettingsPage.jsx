import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FlaskConical,
  Globe,
  HardDrive,
  Lock,
  Moon,
  Pencil,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Type,
  Upload,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import LiquidTabs from '../components/LiquidTabs';
import { buildSmartLogExcelBlob } from '../utils/excelExport';
import {
  getGreetingText,
  getOccupationLabel,
  getProfilePillLabel,
  getUserInitials,
} from '../utils/userHelpers';

const SETTINGS_COPY = {
  TH: {
    displayTitle: 'การแสดงผลและภาษา',
    displaySub: 'ปรับภาษา ธีมสี และขนาดตัวอักษรให้สบายตาสำหรับทุกอุปกรณ์',
    langLabel: 'ภาษาของระบบ (Language)',
    themeLabel: 'โหมดสีหน้าจอ (Theme)',
    themeLight: 'โหมดสว่าง',
    themeDark: 'โหมดมืด',
    fontLabel: 'ขนาดตัวอักษรทั้งเว็บไซต์',
    fontReset: 'คืนค่า 100%',
    profileTitle: 'โปรไฟล์ & คำทักทายตามเวลาจริง',
    profileSub: 'ปรับชื่อ อาชีพ เป้าหมายเงินสำรอง และตรวจสอบเวลาที่ใช้ทักทาย',
    clockSourceInternet: 'อ้างอิงเวลาอินเทอร์เน็ต (24 ชม.)',
    clockSourceDevice: 'อ้างอิงเวลาในเครื่อง (24 ชม.)',
    greetingSchedule: '05:00–11:59 เช้า · 12:00–15:59 บ่าย · 16:00–18:59 เย็น · 19:00–04:59 ค่ำ',
    editProfileBtn: 'แก้ไขข้อมูลส่วนตัว',
    replayWelcomeBtn: 'เปิดหน้าต้อนรับเริ่มต้นใช้งานอีกครั้ง',
    dataTitle: 'บันทึกในเครื่อง & จัดการข้อมูล (PDPA-Safe)',
    dataSub: 'ข้อมูลทั้งหมดเก็บในอุปกรณ์นี้เท่านั้น (Zero-Login) ไม่มีเซิร์ฟเวอร์ติดตามหรือส่งออกโดยไม่ได้รับอนุญาต',
    localStatusActive: 'บันทึกในเครื่องอัตโนมัติ (localStorage)',
    entriesUnit: 'รายการใน 360Flow',
    coveragesUnit: 'สิทธิ/กรมธรรม์',
    modeReal: 'โหมดข้อมูลจริงของคุณ',
    modeSample: 'โหมดค่าสมมติคำนวณ',
    sampleTitle: 'ทดลองใส่ค่าและสถานการณ์สมมติ',
    sampleBadge: 'เงินและสถานการณ์สมมติคำนวณ',
    sampleDesc:
      'จำลองข้อมูล First Jobber (รายได้สมมติ ฿25,000/ด. · รายจ่าย ฿20,000/ด. · สำรอง ฿15,000 · ประกันสังคม ม.33 + ประกันกลุ่ม · 6 รายการ 360Flow) เพื่อดูผลลัพธ์การคำนวณทุกหน้าก่อนกรอกข้อมูลจริง',
    sampleBtn: 'ใส่ค่าสมมติคำนวณ',
    sampleLoadedMsg: 'ใส่ค่าและสถานการณ์สมมติเรียบร้อยแล้ว (ตัวเลขสมมติเพื่อทดลองคำนวณเท่านั้น)',
    excelTitle: 'ส่งออกบัญชี 360Flow เป็นไฟล์ Excel (.xlsx)',
    excelDesc: 'ดาวน์โหลดตาราง 2 ชีต (บัญชีรับ-จ่าย + สรุปภาพรวม) สไตล์ Google Forms พร้อมเปิดใน Excel / Sheets',
    excelBtn: 'ส่งออก .xlsx',
    excelToast: 'ส่งออกไฟล์ Excel (.xlsx) ของ 360Flow เรียบร้อยแล้ว',
    exportTitle: 'สำรองข้อมูลทั้งหมด (Export .json)',
    exportDesc: 'บันทึกโปรไฟล์ รายการ 360Flow และแผนความคุ้มครองเป็นไฟล์สำรองเพื่อย้ายเครื่องได้ทันที',
    exportBtn: 'ดาวน์โหลด .json',
    importTitle: 'กู้คืนข้อมูลจากไฟล์สำรอง (Import .json)',
    importDesc: 'อัปโหลดไฟล์สำรอง PROTECT360 (.json) เพื่อกู้คืนข้อมูลทั้งหมดลงเครื่องนี้',
    importBtn: 'เลือกไฟล์ .json',
    resetTitle: 'รีเซ็ตข้อมูลทุกค่ากลับเป็น 0 / 00.00',
    resetDesc: 'ล้างรายรับ-รายจ่าย เงินสำรอง รายการบันทึก และบัตรสิทธิทั้งหมดให้เป็น 0 เพื่อเริ่มกรอกข้อมูลจริงใหม่',
    resetBtn: 'ล้างทุกค่าเป็น 0',
    resetConfirmBtn: 'ยืนยันล้างเป็น 0',
    resetCancel: 'ยกเลิก',
    charterTitle: 'คำมั่นสัญญาพื้นที่กลาง (Zero-Sales Charter)',
    charterDesc:
      'PROTECT360 เป็นเครื่องมือให้ความรู้และประเมินความเสี่ยงตามหลักคณิตศาสตร์ประกันภัยเท่านั้น ไม่มีการขายประกัน ไม่เก็บข้อมูลติดต่อเพื่อเสนอขาย และไม่แนะนำบริษัทใดเป็นพิเศษ',
    charterBullet1: 'ไม่เก็บเบอร์โทร อีเมล เลขบัตรประชาชน หรือรหัสผ่าน',
    charterBullet2: 'ทุกการคำนวณทำงานบนเครื่องผู้ใช้ 100% แม้ไม่มีบัญชีผู้ใช้',
    charterBullet3: 'หากต้องการตรวจสอบสิทธิหรือร้องเรียนด้านประกันภัย ติดต่อสายด่วน คปภ. 1186',
  },
  EN: {
    displayTitle: 'Display, Language & Accessibility',
    displaySub: 'Choose language, light or dark theme, and comfortable text scale across all pages.',
    langLabel: 'Interface Language',
    themeLabel: 'Color Theme',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    fontLabel: 'Global Text Scale',
    fontReset: 'Reset 100%',
    profileTitle: 'Profile & 24-Hour Time Greeting',
    profileSub: 'Personalize your name, occupation, reserve goal, and live time-of-day salutation.',
    clockSourceInternet: 'Synced with internet 24h clock',
    clockSourceDevice: 'Using device local 24h clock',
    greetingSchedule: '05:00–11:59 Morning · 12:00–15:59 Afternoon · 16:00–18:59 Evening · 19:00–04:59 Night',
    editProfileBtn: 'Edit Personal Profile',
    replayWelcomeBtn: 'Replay Welcome Screen',
    dataTitle: 'Saved Locally & Data Portability (PDPA-Safe)',
    dataSub: 'Everything stays on your own device via localStorage with zero login and zero server tracking.',
    localStatusActive: 'Auto-saved on this device',
    entriesUnit: '360Flow entries',
    coveragesUnit: 'coverage cards',
    modeReal: 'Your Real Data Mode',
    modeSample: 'Hypothetical Sample Mode',
    sampleTitle: 'Try Hypothetical Sample Scenario',
    sampleBadge: 'Hypothetical Preview Only',
    sampleDesc:
      'Loads simulated First Jobber numbers (฿25,000 income, ฿20,000 expenses, ฿15,000 reserve, SSO Sec. 33 + group cover, 6 sample 360Flow entries) so you can preview how every module calculates.',
    sampleBtn: 'Load Sample',
    sampleLoadedMsg: 'Loaded hypothetical sample scenario (simulated numbers for calculation preview only).',
    excelTitle: 'Export 360Flow Cashbook as Excel (.xlsx)',
    excelDesc: 'Download a clean 2-sheet workbook (Ledger + Summary) ready for Excel or Google Sheets.',
    excelBtn: 'Export .xlsx',
    excelToast: 'Exported 360Flow 2-sheet Excel (.xlsx) file.',
    exportTitle: 'Backup All Data (Export .json)',
    exportDesc: 'Save your profile, 360Flow ledger, and coverage plan as a portable JSON backup.',
    exportBtn: 'Download .json',
    importTitle: 'Restore From Backup (Import .json)',
    importDesc: 'Upload a PROTECT360 backup (.json) file to restore your entire workspace instantly.',
    importBtn: 'Choose .json File',
    resetTitle: 'Reset All Values to 0 / 00.00',
    resetDesc: 'Clear income, expenses, emergency reserve, ledger logs, and coverages back to 0.',
    resetBtn: 'Reset to 0',
    resetConfirmBtn: 'Confirm Reset to 0',
    resetCancel: 'Cancel',
    charterTitle: 'Zero-Sales Neutrality Charter',
    charterDesc:
      'PROTECT360 is strictly an educational and actuarial risk-planning tool. No policy sales, no brokerage commissions, and no sponsored brand rankings.',
    charterBullet1: 'No phone number, email, national ID, or password ever collected',
    charterBullet2: '100% local-first computation on your device without an account',
    charterBullet3: 'For official Thailand insurance inquiries, contact OIC Hotline 1186',
  },
  ZH: {
    displayTitle: '显示、语言与无障碍设置',
    displaySub: '自由切换泰语、英语或中文，调整浅色/深色主题与全站字号。',
    langLabel: '界面语言 (Language)',
    themeLabel: '界面主题 (Theme)',
    themeLight: '浅色模式',
    themeDark: '深色模式',
    fontLabel: '全站字体缩放',
    fontReset: '重置 100%',
    profileTitle: '个人档案与 24 小时实时问候',
    profileSub: '自定义姓名、职业与应急目标，并查看实时时段问候状态。',
    clockSourceInternet: '已同步网络 24 小时时钟',
    clockSourceDevice: '使用本机 24 小时时钟',
    greetingSchedule: '05:00–11:59 早上好 · 12:00–15:59 下午好 · 16:00–18:59 傍晚好 · 19:00–04:59 晚上好',
    editProfileBtn: '编辑个人档案',
    replayWelcomeBtn: '重新打开欢迎引导页',
    dataTitle: '本地保存与数据管理 (PDPA 安全)',
    dataSub: '所有数据仅存于当前设备浏览器 (localStorage)，无需登录，绝不上传服务器。',
    localStatusActive: '已自动保存在本机',
    entriesUnit: '条 360Flow 记录',
    coveragesUnit: '张保障卡',
    modeReal: '真实数据模式',
    modeSample: '假设模拟情景模式',
    sampleTitle: '加载假设模拟情景（体验计算效果）',
    sampleBadge: '仅供模拟计算的假设情景',
    sampleDesc:
      '一键填入职场新人假设数据（月收入 ฿25,000 · 月支出 ฿20,000 · 应急金 ฿15,000 · 社保与团险 · 6 条 360Flow 账目），方便体验各模块计算方式。',
    sampleBtn: '加载模拟数据',
    sampleLoadedMsg: '已加载假设模拟情景（仅作计算演示，非真实个人数据）。',
    excelTitle: '导出 360Flow 收支账本为 Excel (.xlsx)',
    excelDesc: '生成双工作表（明细账本 + 总览汇总），可直接用 Excel 或 Google Sheets 打开。',
    excelBtn: '导出 .xlsx',
    excelToast: '已成功导出 360Flow Excel (.xlsx) 文件。',
    exportTitle: '备份全部数据 (导出 .json)',
    exportDesc: '将个人档案、360Flow 账本及保障计划下载为 JSON 文件保存或迁移。',
    exportBtn: '下载 .json',
    importTitle: '从备份恢复数据 (导入 .json)',
    importDesc: '上传 PROTECT360 备份文件 (.json) 立即恢复全部记录。',
    importBtn: '选择 .json 文件',
    resetTitle: '将所有数据清零重置为 0 / 00.00',
    resetDesc: '清空所有收支、应急储备、账本记录与保障卡片，回归 0 重新填写真实情况。',
    resetBtn: '清空归零',
    resetConfirmBtn: '确认清空归零',
    resetCancel: '取消',
    charterTitle: '零推销中立原则声明',
    charterDesc:
      'PROTECT360 仅用于中立金融科普与精算风险评估，不销售保险、不收佣金，也不偏袒任何商业保险品牌。',
    charterBullet1: '绝不收集手机号、邮箱、身份证号或密码',
    charterBullet2: '无需账号，100% 在本设备完成全部精算计算',
    charterBullet3: '如需泰国官方保险咨询或申诉，可联系 OIC 热线 1186',
  },
};

function formatClock24(hour) {
  const now = new Date();
  const h = Number.isInteger(hour) ? hour : now.getHours();
  const m = now.getMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function SettingsPage({
  referenceHour,
  clockSource = 'device',
  onOpenProfile,
  onReplayOnboarding,
}) {
  const {
    lang,
    setLang,
    t,
    fontSteps,
    fontStepIdx,
    setFontStepIdx,
    fontScaleLabel,
    canDecreaseFont,
    canIncreaseFont,
    decreaseFontSize,
    increaseFontSize,
    resetFontSize,
  } = useLanguage();
  const { isDark, setTheme } = useTheme();
  const {
    userProfile,
    monthlyIncome,
    monthlyExpenses,
    emergencyFund,
    emergencyRunway,
    coverages,
    transactions,
    isDemoMode,
    exportUserData,
    importUserData,
    loadDemoSample,
    resetDemoData,
    showToast,
  } = useFinance();

  const copy = SETTINGS_COPY[lang] || SETTINGS_COPY.TH;
  const [confirmReset, setConfirmReset] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    if (!confirmReset) return undefined;
    resetTimerRef.current = window.setTimeout(() => {
      setConfirmReset(false);
    }, 5000);
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, [confirmReset]);

  const langTabs = useMemo(
    () => [
      { id: 'TH', label: 'ไทย (TH)' },
      { id: 'EN', label: 'English (EN)' },
      { id: 'ZH', label: '中文 (ZH)' },
    ],
    []
  );

  const themeTabs = useMemo(
    () => [
      { id: 'light', label: copy.themeLight, icon: Sun },
      { id: 'dark', label: copy.themeDark, icon: Moon },
    ],
    [copy.themeLight, copy.themeDark]
  );

  const handleLoadSample = () => {
    loadDemoSample();
    setConfirmReset(false);
    setFeedback({
      ok: true,
      message: copy.sampleLoadedMsg,
    });
  };

  const handleExportExcel = () => {
    const todayIso = new Date().toISOString().slice(0, 10);
    const blob = buildSmartLogExcelBlob({
      transactions,
      userProfile,
      monthlyIncome,
      monthlyExpenses,
      emergencyFund,
      emergencyRunway,
      lang,
      exportDateIso: todayIso,
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protect360-360flow-${todayIso}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    showToast('success', { th: copy.excelToast, en: copy.excelToast, zh: copy.excelToast });
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const res = await importUserData(file);
    if (res) {
      setFeedback({ ok: Boolean(res.ok), message: t(res.message) });
    }
  };

  const handleResetClick = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetDemoData();
    setConfirmReset(false);
    setFeedback(null);
  };

  const greetingNow = getGreetingText(userProfile, lang, referenceHour);
  const initials = getUserInitials(userProfile.firstName, userProfile.lastName);
  const profileLabel = getProfilePillLabel(userProfile, lang);
  const occupationLabel = getOccupationLabel(userProfile.occupation, lang);
  const timeText = formatClock24(referenceHour);

  return (
    <div className="st-page" aria-label="Settings and Local Privacy">
      {/* Row 1: 2-Column Balanced Settings Grid (Display & Profile/Clock) */}
      <div className="st-top-grid">
        {/* Card 1: Display, Language & Text Scale */}
        <section className="bento-card st-card" aria-labelledby="st-display-heading">
          <div className="st-card-head">
            <span className="st-card-icon blue" aria-hidden="true">
              <Globe size={18} strokeWidth={2.1} />
            </span>
            <div>
              <h2 id="st-display-heading" className="card-title">
                {copy.displayTitle}
              </h2>
              <p className="card-subtitle">{copy.displaySub}</p>
            </div>
          </div>

          <div className="st-controls-stack">
            {/* Language Switcher: TH / EN / ZH */}
            <div className="st-control-block">
              <div className="st-control-label-row">
                <span className="st-control-label">{copy.langLabel}</span>
                <span className="st-control-value tabular-nums">{lang}</span>
              </div>
              <LiquidTabs
                tabs={langTabs}
                activeId={lang}
                onChange={setLang}
                variant="surface"
                idPrefix="settings-lang"
                ariaLabel={copy.langLabel}
              />
            </div>

            {/* Theme Switcher: Light / Dark */}
            <div className="st-control-block">
              <div className="st-control-label-row">
                <span className="st-control-label">{copy.themeLabel}</span>
                <span className="st-control-value">
                  {isDark ? copy.themeDark : copy.themeLight}
                </span>
              </div>
              <LiquidTabs
                tabs={themeTabs}
                activeId={isDark ? 'dark' : 'light'}
                onChange={(mode) => setTheme(mode)}
                variant="surface"
                idPrefix="settings-theme"
                ariaLabel={copy.themeLabel}
              />
            </div>

            {/* Global Text Scale */}
            <div className="st-control-block">
              <div className="st-control-label-row">
                <span className="st-control-label">
                  <Type size={14} strokeWidth={2.2} aria-hidden="true" />
                  <span>{copy.fontLabel}</span>
                </span>
                <button
                  id="settings-font-reset-btn"
                  type="button"
                  className="st-inline-reset"
                  onClick={resetFontSize}
                  disabled={fontStepIdx === 1}
                >
                  {copy.fontReset}
                </button>
              </div>

              <div className="st-font-row">
                <button
                  id="font-decrease-btn"
                  type="button"
                  className="st-font-step-btn"
                  onClick={decreaseFontSize}
                  disabled={!canDecreaseFont}
                  aria-label={t('controls.decreaseFont')}
                >
                  A-
                </button>

                <div className="st-font-pills tabular-nums" role="group" aria-label={copy.fontLabel}>
                  {fontSteps.map((step, idx) => (
                    <button
                      key={step.label}
                      id={`settings-font-step-${idx}`}
                      type="button"
                      className={`st-font-pill ${fontStepIdx === idx ? 'active' : ''}`}
                      aria-pressed={fontStepIdx === idx}
                      onClick={() => setFontStepIdx(idx)}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>

                <button
                  id="font-increase-btn"
                  type="button"
                  className="st-font-step-btn"
                  onClick={increaseFontSize}
                  disabled={!canIncreaseFont}
                  aria-label={t('controls.increaseFont')}
                >
                  A+
                </button>
              </div>
              <span className="st-font-hint tabular-nums">
                {lang === 'TH'
                  ? `ขนาดปัจจุบัน: ${fontScaleLabel}`
                  : lang === 'ZH'
                    ? `当前字号比例：${fontScaleLabel}`
                    : `Current scale: ${fontScaleLabel}`}
              </span>
            </div>
          </div>
        </section>

        {/* Card 2: Profile, Live 24h Greeting & Welcome Replay */}
        <section className="bento-card st-card" aria-labelledby="st-profile-heading">
          <div className="st-card-head">
            <span className="st-card-icon teal" aria-hidden="true">
              <Clock size={18} strokeWidth={2.1} />
            </span>
            <div>
              <h2 id="st-profile-heading" className="card-title">
                {copy.profileTitle}
              </h2>
              <p className="card-subtitle">{copy.profileSub}</p>
            </div>
          </div>

          {/* Profile Identity Box */}
          <div className="st-profile-summary">
            <span className="st-profile-avatar" aria-hidden="true">
              {initials}
            </span>
            <div className="st-profile-meta">
              <strong className="st-profile-name">{profileLabel}</strong>
              <span className="st-profile-sub tabular-nums">
                {occupationLabel} ·{' '}
                {lang === 'TH'
                  ? `เป้าสำรอง ${userProfile.emergencyTargetMonths || 3} เดือน`
                  : lang === 'ZH'
                    ? `应急目标 ${userProfile.emergencyTargetMonths || 3} 个月`
                    : `${userProfile.emergencyTargetMonths || 3}-mo goal`}
              </span>
            </div>
          </div>

          {/* Live 24h Greeting Preview */}
          <div className="st-clock-box">
            <div className="st-clock-top">
              <span className="st-clock-time tabular-nums">{timeText}</span>
              <span className="st-clock-source">
                {clockSource === 'internet' ? copy.clockSourceInternet : copy.clockSourceDevice}
              </span>
            </div>
            <div className="st-clock-greeting">{greetingNow}</div>
            <p className="st-clock-schedule tabular-nums">{copy.greetingSchedule}</p>
          </div>

          <div className="st-profile-actions">
            <button
              id="settings-edit-profile-btn"
              type="button"
              className="btn-primary-gradient st-action-btn"
              onClick={() => onOpenProfile?.('profile')}
            >
              <Pencil size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.editProfileBtn}</span>
            </button>

            <button
              id="settings-replay-onboarding-btn"
              type="button"
              className="btn-soft-gray st-action-btn"
              onClick={onReplayOnboarding}
            >
              <Sparkles size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.replayWelcomeBtn}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Row 2: Saved Locally & Full Data Portability Hub */}
      <section className="bento-card st-card" aria-labelledby="st-data-heading">
        <div className="st-data-header">
          <div className="st-card-head">
            <span className="st-card-icon emerald" aria-hidden="true">
              <HardDrive size={18} strokeWidth={2.1} />
            </span>
            <div>
              <h2 id="st-data-heading" className="card-title">
                {copy.dataTitle}
              </h2>
              <p className="card-subtitle">{copy.dataSub}</p>
            </div>
          </div>

          <div className="st-local-status-row tabular-nums">
            <span className="st-status-pill ok">
              <CheckCircle2 size={13} strokeWidth={2.3} aria-hidden="true" />
              <span>{copy.localStatusActive}</span>
            </span>
            <span className="st-status-pill neutral">
              {transactions.length} {copy.entriesUnit}
            </span>
            <span className="st-status-pill neutral">
              {coverages.length} {copy.coveragesUnit}
            </span>
            <span className={`st-status-pill ${isDemoMode ? 'sample' : 'neutral'}`}>
              {isDemoMode ? copy.modeSample : copy.modeReal}
            </span>
          </div>
        </div>

        {feedback && (
          <div
            className={`inline-feedback-banner ${feedback.ok ? 'success' : 'error'}`}
            role="status"
          >
            {feedback.ok ? (
              <CheckCircle2 size={16} strokeWidth={2.2} aria-hidden="true" />
            ) : (
              <AlertCircle size={16} strokeWidth={2.2} aria-hidden="true" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="data-action-list">
          {/* 1) Hypothetical Sample Scenario */}
          <div className={`data-action-card sample-preview ${isDemoMode ? 'is-active' : ''}`}>
            <div className="data-action-info">
              <span className="data-action-icon sample" aria-hidden="true">
                <FlaskConical size={18} strokeWidth={2.1} />
              </span>
              <div>
                <div className="data-action-title-row">
                  <span className="data-action-title">{copy.sampleTitle}</span>
                  <span className="sample-disclaimer-badge">{copy.sampleBadge}</span>
                </div>
                <p className="data-action-desc">{copy.sampleDesc}</p>
              </div>
            </div>
            <button
              id="load-sample-scenario-btn"
              type="button"
              className="btn-soft-gray data-action-btn sample-load-btn"
              onClick={handleLoadSample}
            >
              <FlaskConical size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.sampleBtn}</span>
            </button>
          </div>

          {/* 2) Export 360Flow Excel (.xlsx) */}
          <div className="data-action-card">
            <div className="data-action-info">
              <span className="data-action-icon excel" aria-hidden="true">
                <FileSpreadsheet size={18} strokeWidth={2.1} />
              </span>
              <div>
                <div className="data-action-title">{copy.excelTitle}</div>
                <p className="data-action-desc">{copy.excelDesc}</p>
              </div>
            </div>
            <button
              id="settings-export-excel-btn"
              type="button"
              className="btn-soft-gray data-action-btn"
              onClick={handleExportExcel}
            >
              <FileSpreadsheet size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.excelBtn}</span>
            </button>
          </div>

          {/* 3) Export .json */}
          <div className="data-action-card">
            <div className="data-action-info">
              <span className="data-action-icon export" aria-hidden="true">
                <Download size={18} strokeWidth={2.1} />
              </span>
              <div>
                <div className="data-action-title">{copy.exportTitle}</div>
                <p className="data-action-desc">{copy.exportDesc}</p>
              </div>
            </div>
            <button
              id="export-json-btn"
              type="button"
              className="btn-primary-gradient data-action-btn"
              onClick={exportUserData}
            >
              <Download size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.exportBtn}</span>
            </button>
          </div>

          {/* 4) Import .json */}
          <div className="data-action-card">
            <div className="data-action-info">
              <span className="data-action-icon import" aria-hidden="true">
                <Upload size={18} strokeWidth={2.1} />
              </span>
              <div>
                <div className="data-action-title">{copy.importTitle}</div>
                <p className="data-action-desc">{copy.importDesc}</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="import-json-file-input"
              type="file"
              accept=".json,application/json"
              className="sr-only-input"
              onChange={handleImportFile}
            />
            <button
              id="import-json-btn"
              type="button"
              className="btn-soft-gray data-action-btn"
              onClick={() => {
                setFeedback(null);
                fileInputRef.current?.click();
              }}
            >
              <Upload size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.importBtn}</span>
            </button>
          </div>

          {/* 5) Two-Step Reset All to 0 / 00.00 */}
          <div className={`data-action-card ${confirmReset ? 'danger-armed' : ''}`}>
            <div className="data-action-info">
              <span className="data-action-icon reset" aria-hidden="true">
                <RotateCcw size={18} strokeWidth={2.1} />
              </span>
              <div>
                <div className="data-action-title">{copy.resetTitle}</div>
                <p className="data-action-desc">{copy.resetDesc}</p>
              </div>
            </div>
            <div className="reset-action-group">
              {confirmReset && (
                <button
                  type="button"
                  className="btn-reset-cancel"
                  onClick={() => setConfirmReset(false)}
                >
                  {copy.resetCancel}
                </button>
              )}
              <button
                id="reset-demo-btn"
                type="button"
                className={`data-action-btn ${confirmReset ? 'btn-danger-confirm' : 'btn-danger-soft'}`}
                onClick={handleResetClick}
              >
                <RotateCcw size={15} strokeWidth={2.2} aria-hidden="true" />
                <span>{confirmReset ? copy.resetConfirmBtn : copy.resetBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: Compact Neutrality & Privacy Charter */}
      <section className="bento-card st-charter-card" aria-labelledby="st-charter-heading">
        <div className="st-card-head">
          <span className="st-card-icon slate" aria-hidden="true">
            <ShieldCheck size={18} strokeWidth={2.1} />
          </span>
          <div>
            <h2 id="st-charter-heading" className="card-title">
              {copy.charterTitle}
            </h2>
            <p className="card-subtitle">{copy.charterDesc}</p>
          </div>
        </div>

        <ul className="st-charter-list">
          <li>
            <Lock size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{copy.charterBullet1}</span>
          </li>
          <li>
            <CheckCircle2 size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{copy.charterBullet2}</span>
          </li>
          <li>
            <ShieldCheck size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{copy.charterBullet3}</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

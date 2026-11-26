import { useEffect, useState } from 'react';
import { Check, FolderPlus, Layers, Plus, Trash2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFinance } from '../context/FinanceContext';
import {
  CUSTOM_COLOR_OPTIONS,
  CUSTOM_ICON_MAP,
  CUSTOM_ICON_OPTIONS,
  getCustomColorMeta,
} from '../utils/categoryRegistry';
import LiquidTabs from './LiquidTabs';

const TYPE_META = {
  expense: { th: 'รายจ่าย', en: 'Expense' },
  income: { th: 'รายรับ', en: 'Income' },
  saving: { th: 'เติมเงินสำรอง', en: 'Emergency Fund' },
};

export default function CustomCategoryModal({
  activeCatKey,
  defaultType = 'expense',
  onSelectCategory,
  onClose,
}) {
  const { lang, t } = useLanguage();
  const { customCategories, addCustomCategory, removeCustomCategory } = useFinance();

  const [tab, setTab] = useState(() => (customCategories.length > 0 ? 'browse' : 'create'));
  const [name, setName] = useState('');
  const [type, setType] = useState(defaultType);
  const [iconName, setIconName] = useState('utensils');
  const [color, setColor] = useState(CUSTOM_COLOR_OPTIONS[0].hex);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const modalTabs = [
    {
      id: 'browse',
      label: lang === 'TH' ? 'หมวดที่สร้างเอง' : 'My Categories',
      icon: Layers,
      badge: customCategories.length,
    },
    {
      id: 'create',
      label: lang === 'TH' ? 'สร้างหมวดใหม่' : 'Create New',
      icon: FolderPlus,
    },
  ];

  const typeTabs = [
    { id: 'expense', label: t(TYPE_META.expense) },
    { id: 'income', label: t(TYPE_META.income) },
    { id: 'saving', label: t(TYPE_META.saving) },
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const created = addCustomCategory({
      name: trimmed,
      type,
      iconName,
      color,
    });
    if (created) {
      onSelectCategory(created);
      onClose();
    }
  };

  const PreviewIcon = CUSTOM_ICON_MAP[iconName] || CUSTOM_ICON_OPTIONS[0].icon;
  const previewColorMeta = getCustomColorMeta(color);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-cat-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog custom-cat-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2 id="custom-cat-modal-title" className="card-title">
              {lang === 'TH' ? 'หมวดหมู่อื่น ๆ (สร้างเอง)' : 'Other & Custom Categories'}
            </h2>
            <p className="card-subtitle">
              {lang === 'TH'
                ? 'เลือกหมวดที่คุณสร้างไว้ หรือเพิ่มหมวดใหม่พร้อมไอคอนและสีตามสไตล์ของคุณ'
                : 'Pick your custom category or create a new one with 25 curated icons'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={lang === 'TH' ? 'ปิดหน้าต่าง' : 'Close'}
          >
            <X size={18} />
          </button>
        </div>

        <LiquidTabs
          tabs={modalTabs}
          activeId={tab}
          onChange={setTab}
          variant="surface"
          idPrefix="custom-cat-tab"
          ariaLabel="Custom categories tabs"
        />

        {tab === 'browse' ? (
          <div className="cc-browse-body">
            {customCategories.length === 0 ? (
              <div className="cc-empty-state">
                <span className="cc-empty-icon" aria-hidden="true">
                  <FolderPlus size={24} strokeWidth={1.9} />
                </span>
                <p className="cc-empty-title">
                  {lang === 'TH' ? 'ยังไม่มีหมวดหมู่ที่สร้างเอง' : 'No custom categories yet'}
                </p>
                <p className="cc-empty-sub">
                  {lang === 'TH'
                    ? 'สร้างหมวดหมู่เฉพาะของคุณได้ทันที โดยหน้าบันทึกหลักจะยังคงสะอาดไม่รกตา'
                    : 'Create your own categories here while keeping the main entry screen clean'}
                </p>
                <button
                  type="button"
                  className="btn-primary-gradient"
                  onClick={() => setTab('create')}
                >
                  <Plus size={16} strokeWidth={2.3} />
                  <span>{lang === 'TH' ? 'สร้างหมวดหมู่แรกของคุณ' : 'Create First Category'}</span>
                </button>
              </div>
            ) : (
              <>
                <div className="cc-list">
                  {customCategories.map((cat) => {
                    const Icon = CUSTOM_ICON_MAP[cat.iconName] || CUSTOM_ICON_OPTIONS[0].icon;
                    const colorMeta = getCustomColorMeta(cat.color);
                    const isSelected = activeCatKey === cat.id;
                    const isConfirming = confirmDeleteId === cat.id;

                    return (
                      <div
                        key={cat.id}
                        className={`cc-item-row ${isSelected ? 'active' : ''}`}
                      >
                        <button
                          type="button"
                          className="cc-item-select"
                          onClick={() => {
                            onSelectCategory(cat);
                            onClose();
                          }}
                        >
                          <span
                            className="cc-item-icon"
                            style={{ backgroundColor: colorMeta.bg, color: colorMeta.hex }}
                            aria-hidden="true"
                          >
                            <Icon size={17} strokeWidth={2.1} />
                          </span>
                          <div className="cc-item-text">
                            <span className="cc-item-name">{cat.name}</span>
                            <span className={`cc-item-type ${cat.type}`}>
                              {t(TYPE_META[cat.type] || TYPE_META.expense)}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="cc-item-selected-mark" aria-hidden="true">
                              <Check size={15} strokeWidth={2.6} />
                            </span>
                          )}
                        </button>

                        {isConfirming ? (
                          <div className="ak-tx-confirm-group">
                            <button
                              type="button"
                              className="ak-tx-cancel-btn"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              {lang === 'TH' ? 'ยกเลิก' : 'No'}
                            </button>
                            <button
                              type="button"
                              className="ak-tx-delete-confirm"
                              onClick={() => {
                                removeCustomCategory(cat.id);
                                setConfirmDeleteId(null);
                              }}
                            >
                              {lang === 'TH' ? 'ลบ' : 'Delete'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="cc-item-delete"
                            onClick={() => setConfirmDeleteId(cat.id)}
                            aria-label={lang === 'TH' ? `ลบหมวด ${cat.name}` : `Delete ${cat.name}`}
                            title={lang === 'TH' ? 'ลบหมวดหมู่' : 'Delete category'}
                          >
                            <Trash2 size={14} strokeWidth={2.1} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="cc-browse-footer">
                  <button
                    type="button"
                    className="btn-soft-gray"
                    onClick={onClose}
                  >
                    {lang === 'TH' ? 'ปิด' : 'Close'}
                  </button>
                  <button
                    type="button"
                    className="btn-primary-gradient"
                    onClick={() => setTab('create')}
                  >
                    <Plus size={16} strokeWidth={2.3} />
                    <span>{lang === 'TH' ? 'เพิ่มหมวดใหม่อีก' : 'Add Another Category'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <form className="cc-create-form" onSubmit={handleCreate}>
            {/* Live Preview Chip */}
            <div className="cc-preview-bar">
              <span className="cc-preview-label">
                {lang === 'TH' ? 'ตัวอย่างหมวดหมู่' : 'Preview'}
              </span>
              <span className="cc-preview-chip">
                <span
                  className="cc-preview-icon"
                  style={{ backgroundColor: previewColorMeta.bg, color: previewColorMeta.hex }}
                  aria-hidden="true"
                >
                  <PreviewIcon size={15} strokeWidth={2.2} />
                </span>
                <span className="cc-preview-name">
                  {name.trim() || (lang === 'TH' ? 'ชื่อหมวดหมู่ของคุณ' : 'Your category name')}
                </span>
                <span className={`cc-item-type ${type}`}>
                  {t(TYPE_META[type])}
                </span>
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="custom-cat-name" className="form-label">
                {lang === 'TH' ? 'ชื่อหมวดหมู่' : 'Category Name'}
              </label>
              <input
                id="custom-cat-name"
                type="text"
                maxLength={28}
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-field">
              <span className="form-label">
                {lang === 'TH' ? 'ประเภทรายการ' : 'Transaction Type'}
              </span>
              <LiquidTabs
                tabs={typeTabs}
                activeId={type}
                onChange={setType}
                variant="segmented"
                idPrefix="custom-cat-type"
                ariaLabel="Custom category type"
              />
            </div>

            <div className="form-field">
              <span className="form-label">
                {lang === 'TH' ? 'สีประจำหมวด' : 'Accent Color'}
              </span>
              <div className="cc-color-row">
                {CUSTOM_COLOR_OPTIONS.map((opt) => {
                  const isSelected = color === opt.hex;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`cc-color-swatch ${isSelected ? 'active' : ''}`}
                      style={{ '--swatch-color': opt.hex }}
                      onClick={() => setColor(opt.hex)}
                      title={t(opt.label)}
                      aria-label={t(opt.label)}
                      aria-pressed={isSelected}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} color="#ffffff" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-field">
              <div className="cc-icon-label-row">
                <span className="form-label">
                  {lang === 'TH' ? 'เลือกไอคอน (25 แบบ)' : 'Choose Icon (25 options)'}
                </span>
                <span className="cc-icon-selected-hint">
                  {t(
                    CUSTOM_ICON_OPTIONS.find((item) => item.id === iconName)?.label ||
                      CUSTOM_ICON_OPTIONS[0].label
                  )}
                </span>
              </div>
              <div className="cc-icon-grid" role="radiogroup" aria-label="Category icons">
                {CUSTOM_ICON_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = iconName === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`cc-icon-btn ${isSelected ? 'active' : ''}`}
                      style={
                        isSelected
                          ? {
                              borderColor: previewColorMeta.hex,
                              backgroundColor: previewColorMeta.bg,
                              color: previewColorMeta.hex,
                            }
                          : undefined
                      }
                      onClick={() => setIconName(opt.id)}
                      title={t(opt.label)}
                      aria-label={t(opt.label)}
                      aria-checked={isSelected}
                      role="radio"
                    >
                      <Icon size={18} strokeWidth={2.05} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="cc-browse-footer">
              <button type="button" className="btn-soft-gray" onClick={onClose}>
                {lang === 'TH' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                id="save-custom-cat-btn"
                type="submit"
                className="btn-primary-gradient"
                disabled={!name.trim()}
              >
                <Check size={16} strokeWidth={2.4} />
                <span>{lang === 'TH' ? 'สร้างและเลือกหมวดนี้' : 'Create & Select'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

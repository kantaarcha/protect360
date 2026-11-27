import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  FileWarning,
  Gamepad2,
  Layers,
  Lightbulb,
  RotateCcw,
  Scale,
  Search,
  Sparkles,
  Stethoscope,
  X,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatTHB, useFinance } from '../context/FinanceContext';
import LiquidTabs from '../components/LiquidTabs';
import {
  JARGON_TERMS,
  LEARNING_ARTICLES,
  LEARNING_CATEGORIES,
  LEARNING_STORAGE_KEY,
  LITERACY_QUIZ,
} from '../utils/learningData';

const ARTICLE_ICONS = {
  stethoscope: Stethoscope,
  clock: Clock,
  'file-warning': FileWarning,
  scale: Scale,
  building: Building2,
  layers: Layers,
};

function loadLearningProgress() {
  if (typeof window === 'undefined') {
    return { readIds: ['opd-vs-ipd'], quizVerified: false, bestScore: 0 };
  }
  try {
    const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return { readIds: ['opd-vs-ipd'], quizVerified: false, bestScore: 0 };
    const parsed = JSON.parse(raw);
    return {
      readIds: Array.isArray(parsed?.readIds) ? parsed.readIds : ['opd-vs-ipd'],
      quizVerified: Boolean(parsed?.quizVerified),
      bestScore: Number.isFinite(Number(parsed?.bestScore)) ? Number(parsed?.bestScore) : 0,
    };
  } catch {
    return { readIds: ['opd-vs-ipd'], quizVerified: false, bestScore: 0 };
  }
}

export default function LearningCenter({ onNavigate }) {
  const { lang, t } = useLanguage();
  const { userProfile, monthlyIncome, monthlyExpenses, emergencyFund } = useFinance();

  // Main Tab Window switcher: 'guides' | 'glossary' | 'quiz'
  const [activeTab, setActiveTab] = useState('guides');

  // Persistent local progress (read articles + Literacy Verified badge)
  const [progress, setProgress] = useState(loadLearningProgress);

  // Guides tab state (in-tab master-detail reader — zero pop-up modals)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticleId, setSelectedArticleId] = useState(LEARNING_ARTICLES[0].id);

  // Glossary tab state
  const [glossarySearch, setGlossarySearch] = useState('');
  const [selectedJargonId, setSelectedJargonId] = useState(JARGON_TERMS[0].id);

  // 5-Question Literacy Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Persist learning progress safely in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota / private browsing errors
    }
  }, [progress]);

  const displayName = (userProfile?.firstName || '').trim() || 'First Jobber';
  const safeCapMin = Math.round((monthlyIncome || 25000) * 0.1);
  const safeCapMax = Math.round((monthlyIncome || 25000) * 0.15);
  const targetMonths = userProfile?.emergencyTargetMonths || 3;
  const emergencyGoal = Math.max(30000, Math.round((monthlyExpenses || 20000) * targetMonths));

  // Main 3-tab window bar (compact iPhone-safe labels)
  const windowTabs = useMemo(
    () => [
      {
        id: 'guides',
        label: lang === 'TH' ? 'บทความ 2 นาที' : '2-Min Guides',
        icon: BookOpen,
        badge: `${progress.readIds.length}/${LEARNING_ARTICLES.length}`,
      },
      {
        id: 'glossary',
        label: lang === 'TH' ? 'แปลศัพท์' : 'Glossary',
        icon: Sparkles,
      },
      {
        id: 'quiz',
        label: lang === 'TH' ? 'ควิซ 5 ข้อ' : '5-Q Quiz',
        icon: Award,
        badge: progress.quizVerified ? '✓' : undefined,
      },
    ],
    [lang, progress.readIds.length, progress.quizVerified]
  );

  // Filtered articles for the left index
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LEARNING_ARTICLES.filter((article) => {
      if (activeCategory !== 'all' && article.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        article.title.th,
        article.title.en,
        article.hook.th,
        article.hook.en,
        article.intro.th,
        article.intro.en,
        ...(article.keywords || []),
        ...article.translations.flatMap((pair) => [
          pair.jargon.th,
          pair.jargon.en,
          pair.plain.th,
          pair.plain.en,
        ]),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, searchQuery]);

  // Active article shown right inside the Reading Pane
  const activeArticle =
    filteredArticles.find((a) => a.id === selectedArticleId) ||
    filteredArticles[0] ||
    null;

  const activeArticleIdx = activeArticle
    ? filteredArticles.findIndex((a) => a.id === activeArticle.id)
    : -1;

  const handleSelectArticle = (articleId) => {
    setSelectedArticleId(articleId);
    setProgress((prev) => {
      if (prev.readIds.includes(articleId)) return prev;
      return { ...prev, readIds: [...prev.readIds, articleId] };
    });
  };

  // Filtered glossary terms
  const filteredTerms = useMemo(() => {
    const q = glossarySearch.trim().toLowerCase();
    if (!q) return JARGON_TERMS;
    return JARGON_TERMS.filter((item) =>
      `${item.term.th} ${item.term.en} ${item.shortTag.th} ${item.shortTag.en} ${item.plainMeaning.th} ${item.plainMeaning.en}`
        .toLowerCase()
        .includes(q)
    );
  }, [glossarySearch]);

  const activeJargon =
    filteredTerms.find((item) => item.id === selectedJargonId) ||
    filteredTerms[0] ||
    null;

  // Quiz handlers
  const currentQuestion = LITERACY_QUIZ[quizIdx];
  const isAnswered = selectedOptionId !== null;
  const isCorrectAnswer = isAnswered && selectedOptionId === currentQuestion?.correctId;

  const handleSelectQuizOption = (optionId) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOptionId(optionId);
    if (optionId === currentQuestion.correctId) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIdx + 1 >= LITERACY_QUIZ.length) {
      setQuizFinished(true);
      const passed = quizScore >= 4;
      setProgress((prev) => ({
        ...prev,
        quizVerified: prev.quizVerified || passed,
        bestScore: Math.max(prev.bestScore || 0, quizScore),
      }));
    } else {
      setQuizIdx((prev) => prev + 1);
      setSelectedOptionId(null);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIdx(0);
    setSelectedOptionId(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const quizProgressPct = quizFinished
    ? 100
    : Math.round(((quizIdx + (isAnswered ? 1 : 0)) / LITERACY_QUIZ.length) * 100);

  return (
    <div className="lc-page">
      {/* ===================================================================== */}
      {/* UNIFIED TABBED KNOWLEDGE WINDOW                                       */}
      {/* ===================================================================== */}
      <section className="bento-card lc-window-shell" aria-label="Learning Center workspace">
        {/* Window Top Tab Bar */}
        <div className="lc-window-bar">
          <div className="lc-window-tabs">
            <LiquidTabs
              tabs={windowTabs}
              activeId={activeTab}
              onChange={setActiveTab}
              variant="surface"
              idPrefix="learning-window"
              ariaLabel={lang === 'TH' ? 'แท็บคลังความรู้' : 'Learning library tabs'}
            />
          </div>

          <div className="lc-window-status tabular-nums">
            <span className="lc-personal-hint">
              {lang === 'TH'
                ? `กรอบปลอดภัยของ ${displayName}: ไม่เกิน ${formatTHB(safeCapMax)}/ด.`
                : `${displayName}'s cap: max ${formatTHB(safeCapMax)}/mo`}
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: 2-MINUTE GUIDES — IN-TAB SPLIT READER (NO POPUP MODAL)       */}
        {/* =================================================================== */}
        {activeTab === 'guides' && (
          <div className="lc-guides-workspace">
            {/* Left Sidebar Index (Topics + Search + Category Filter) */}
            <aside className="lc-sidebar-index" aria-label="Article topics">
              <div className="lc-search-wrap">
                <Search size={15} className="lc-search-icon" aria-hidden="true" />
                <input
                  id="lc-search-input"
                  type="search"
                  className="lc-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'TH'
                      ? 'ค้นหา เช่น ระยะเวลารอคอย, OPD...'
                      : 'Search: Waiting Period, OPD...'
                  }
                  aria-label={lang === 'TH' ? 'ค้นหาบทความ' : 'Search articles'}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="lc-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Compact Category Pills */}
              <div className="lc-mini-cat-row" role="group" aria-label="Category filter">
                {LEARNING_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`lc-mini-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {t(cat.label)}
                  </button>
                ))}
              </div>

              {/* Topic List (vertical on desktop, compact strip on mobile) */}
              <div className="lc-topic-list" role="tablist" aria-label="Select topic to read">
                {filteredArticles.length === 0 ? (
                  <div className="lc-index-empty">
                    <p>
                      {lang === 'TH'
                        ? `ไม่พบหัวข้อ "${searchQuery}"`
                        : `No topics matching "${searchQuery}"`}
                    </p>
                    <button
                      type="button"
                      className="lc-reset-link"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                    >
                      {lang === 'TH' ? 'ล้างตัวกรอง' : 'Reset filter'}
                    </button>
                  </div>
                ) : (
                  filteredArticles.map((article, idx) => {
                    const Icon = ARTICLE_ICONS[article.iconName] || BookOpen;
                    const isSelected = activeArticle?.id === article.id;
                    const isRead = progress.readIds.includes(article.id);
                    return (
                      <button
                        key={article.id}
                        id={`lc-topic-${article.id}`}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        className={`lc-topic-item ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectArticle(article.id)}
                      >
                        <span className={`lc-topic-icon cat-${article.category}`} aria-hidden="true">
                          <Icon size={15} strokeWidth={2.1} />
                        </span>
                        <div className="lc-topic-copy">
                          <div className="lc-topic-meta tabular-nums">
                            <span>
                              {String(idx + 1).padStart(2, '0')} • {t(article.categoryLabel)}
                            </span>
                            {isRead && (
                              <CheckCircle2 size={13} className="lc-read-check" aria-hidden="true" />
                            )}
                          </div>
                          <strong className="lc-topic-title">{t(article.title)}</strong>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Right Active Reading Pane (Full Content Directly Inside Tab!) */}
            <article className="lc-reading-pane" role="tabpanel">
              {activeArticle ? (
                <>
                  <div className="lc-pane-top">
                    <span className={`lc-cat-pill cat-${activeArticle.category}`}>
                      {t(activeArticle.categoryLabel)}
                    </span>
                    <span className="lc-time-badge tabular-nums">
                      <Clock size={12} aria-hidden="true" />
                      {lang === 'TH'
                        ? `อ่าน ${activeArticle.readMinutes} นาที`
                        : `${activeArticle.readMinutes} min read`}
                    </span>
                  </div>

                  <h2 className="lc-reader-title">{t(activeArticle.title)}</h2>
                  <p className="lc-reader-intro">{t(activeArticle.intro)}</p>

                  {/* Side-by-Side Policy Jargon vs. Plain Translation */}
                  <div className="lc-trans-block">
                    <div className="lc-trans-headers">
                      <span>{lang === 'TH' ? 'ศัพท์ทางการ (Policy Jargon)' : 'Policy Jargon'}</span>
                      <span>
                        {lang === 'TH' ? 'ภาษาคนทั่วไป (Plain Translation)' : 'Plain Translation'}
                      </span>
                    </div>

                    <div className="lc-trans-rows">
                      {activeArticle.translations.map((pair, idx) => (
                        <div key={idx} className="lc-trans-row">
                          <div className="lc-trans-jargon">{t(pair.jargon)}</div>
                          <div className="lc-trans-plain">{t(pair.plain)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real First Jobber Example (Personalized on Article #6) */}
                  <div className="lc-example-box tabular-nums">
                    <strong>{t(activeArticle.example.title)}</strong>
                    <p>
                      {activeArticle.example.useDynamicNumbers
                        ? lang === 'TH'
                          ? `จากข้อมูลปัจจุบันของ ${displayName} (รายได้ ${formatTHB(monthlyIncome)}/ด. • เงินสำรอง ${formatTHB(emergencyFund)}): เป้าเงินสำรอง ${targetMonths} เดือนคือ ${formatTHB(emergencyGoal)} และกรอบงบโอนย้ายความเสี่ยงที่ปลอดภัยคือ ${formatTHB(safeCapMin)}–${formatTHB(safeCapMax)}/เดือน`
                          : `Based on ${displayName}'s live profile (Income ${formatTHB(monthlyIncome)}/mo • Reserve ${formatTHB(emergencyFund)}): your ${targetMonths}-month emergency goal is ${formatTHB(emergencyGoal)}, and your safe risk-transfer cap is ${formatTHB(safeCapMin)}–${formatTHB(safeCapMax)}/mo.`
                        : t(activeArticle.example.body)}
                    </p>
                  </div>

                  {/* Key Takeaway */}
                  <div className="lc-takeaway-box">
                    <Lightbulb size={17} className="lc-tip-icon" aria-hidden="true" />
                    <p>{t(activeArticle.takeaway)}</p>
                  </div>

                  {/* In-Tab Prev / Next Navigation + Tool Bridge */}
                  <div className="lc-pane-footer">
                    <div className="lc-pane-nav-btns">
                      <button
                        type="button"
                        className="btn-soft-gray lc-pane-nav-btn"
                        disabled={activeArticleIdx <= 0}
                        onClick={() => {
                          if (activeArticleIdx > 0) {
                            handleSelectArticle(filteredArticles[activeArticleIdx - 1].id);
                          }
                        }}
                      >
                        <ArrowLeft size={14} />
                        <span>{lang === 'TH' ? 'บทก่อนหน้า' : 'Previous'}</span>
                      </button>

                      <button
                        type="button"
                        className="btn-soft-gray lc-pane-nav-btn"
                        disabled={
                          activeArticleIdx < 0 || activeArticleIdx >= filteredArticles.length - 1
                        }
                        onClick={() => {
                          if (activeArticleIdx < filteredArticles.length - 1) {
                            handleSelectArticle(filteredArticles[activeArticleIdx + 1].id);
                          }
                        }}
                      >
                        <span>{lang === 'TH' ? 'บทถัดไป' : 'Next Guide'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    {activeArticle.bridgeAction && (
                      <button
                        type="button"
                        className="btn-primary-gradient lc-pane-cta"
                        onClick={() => onNavigate?.(activeArticle.bridgeAction.page)}
                      >
                        <span>{t(activeArticle.bridgeAction.label)}</span>
                        <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="lc-empty-state">
                  <BookOpen size={24} aria-hidden="true" />
                  <p>
                    {lang === 'TH'
                      ? 'เลือกบทความจากรายการด้านซ้ายเพื่ออ่านสรุปเข้าใจง่าย'
                      : 'Select any topic from the index to read its plain-language summary.'}
                  </p>
                </div>
              )}
            </article>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: QUICK JARGON DECODER — DEDICATED GLOSSARY WINDOW             */}
        {/* =================================================================== */}
        {activeTab === 'glossary' && (
          <div className="lc-glossary-workspace">
            <div className="lc-glossary-left">
              <div className="lc-search-wrap">
                <Search size={15} className="lc-search-icon" aria-hidden="true" />
                <input
                  id="lc-glossary-search"
                  type="search"
                  className="lc-search-input"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder={
                    lang === 'TH'
                      ? 'ค้นหาคำศัพท์ เช่น ทุนประกัน, ข้อยกเว้น, IRR...'
                      : 'Search term: Sum Insured, Rider, IRR...'
                  }
                  aria-label={lang === 'TH' ? 'ค้นหาคำศัพท์กรมธรรม์' : 'Search policy terms'}
                />
                {glossarySearch && (
                  <button
                    type="button"
                    className="lc-search-clear"
                    onClick={() => setGlossarySearch('')}
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="lc-glossary-list" role="tablist" aria-label="Jargon terms">
                {filteredTerms.length === 0 ? (
                  <div className="lc-index-empty">
                    <p>
                      {lang === 'TH'
                        ? `ไม่พบคำศัพท์ "${glossarySearch}"`
                        : `No terms matching "${glossarySearch}"`}
                    </p>
                  </div>
                ) : (
                  filteredTerms.map((item) => {
                    const isSelected = activeJargon?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        className={`lc-glossary-item ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedJargonId(item.id)}
                      >
                        <strong>{t(item.term)}</strong>
                        <span>{t(item.shortTag)}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lc-glossary-pane" role="tabpanel">
              {activeJargon ? (
                <>
                  <div className="lc-jargon-out-head">
                    <h2 className="lc-reader-title">{t(activeJargon.term)}</h2>
                    <span className="lc-jargon-short-tag">{t(activeJargon.shortTag)}</span>
                  </div>

                  <p className="lc-jargon-meaning">{t(activeJargon.plainMeaning)}</p>

                  <div className="lc-jargon-tip">
                    <Lightbulb size={16} className="lc-tip-icon" aria-hidden="true" />
                    <div>
                      <strong>
                        {lang === 'TH' ? 'ทริคสำหรับ First Jobber' : 'Practical First Jobber Tip'}
                      </strong>
                      <p>{t(activeJargon.tip)}</p>
                    </div>
                  </div>

                  <div className="lc-glossary-all-note">
                    <span>
                      {lang === 'TH'
                        ? 'อยากทดสอบว่าเข้าใจคำศัพท์เหล่านี้จริงไหม?'
                        : 'Ready to check your understanding?'}
                    </span>
                    <button
                      type="button"
                      className="btn-soft-gray lc-pane-nav-btn"
                      onClick={() => setActiveTab('quiz')}
                    >
                      <span>{lang === 'TH' ? 'ไปทำควิซ 5 ข้อ →' : 'Take 5-Q Quiz →'}</span>
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: 5-QUESTION RISK & POLICY LITERACY QUIZ WINDOW                */}
        {/* =================================================================== */}
        {activeTab === 'quiz' && (
          <div className="lc-quiz-workspace">
            <div className="lc-quiz-top-row">
              <div>
                <h2 className="lc-reader-title">
                  {lang === 'TH'
                    ? 'ควิซเช็กภูมิคุ้มกันความรู้ 5 ข้อ'
                    : '5-Question Risk & Policy Literacy Quiz'}
                </h2>
                <p className="lc-card-sub">
                  {lang === 'TH'
                    ? 'ทดสอบกับดักจริงที่มือใหม่มักพลาด ตอบถูก 4/5 ข้อรับป้ายผ่านเกณฑ์โค้ชการเงิน'
                    : 'Test 5 common real-world traps — score 4/5+ to earn your Literacy Verified badge.'}
                </p>
              </div>

              <span className="lc-quiz-step-pill tabular-nums">
                {quizFinished
                  ? `${quizScore} / ${LITERACY_QUIZ.length}`
                  : lang === 'TH'
                    ? `ข้อที่ ${quizIdx + 1}/${LITERACY_QUIZ.length}`
                    : `Q ${quizIdx + 1}/${LITERACY_QUIZ.length}`}
              </span>
            </div>

            <div className="gm-hud-bar-track">
              <div
                className={`gm-hud-bar-fill ${quizFinished && quizScore >= 4 ? 'teal' : 'blue'}`}
                style={{ width: `${quizProgressPct}%` }}
              />
            </div>

            {!quizFinished && currentQuestion ? (
              <div className="lc-quiz-body">
                <h3 className="lc-quiz-question">{t(currentQuestion.question)}</h3>

                <div className="lc-quiz-options">
                  {currentQuestion.options.map((opt, idx) => {
                    const isPicked = selectedOptionId === opt.id;
                    const isRightOpt = opt.id === currentQuestion.correctId;
                    let stateClass = '';
                    if (isAnswered) {
                      if (isRightOpt) stateClass = 'correct';
                      else if (isPicked) stateClass = 'wrong';
                      else stateClass = 'muted';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isAnswered}
                        className={`lc-quiz-opt ${stateClass}`}
                        onClick={() => handleSelectQuizOption(opt.id)}
                      >
                        <span className="lc-opt-letter">{String.fromCharCode(65 + idx)}</span>
                        <span className="lc-opt-text">{t(opt.label)}</span>
                        {isAnswered && isRightOpt && (
                          <CheckCircle2 size={17} className="lc-opt-icon ok" aria-hidden="true" />
                        )}
                        {isAnswered && isPicked && !isRightOpt && (
                          <XCircle size={17} className="lc-opt-icon err" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className={`lc-quiz-feedback ${isCorrectAnswer ? 'ok' : 'warn'}`}>
                    <p>{t(currentQuestion.explanation)}</p>
                    <button
                      type="button"
                      id="lc-quiz-next-btn"
                      className="btn-primary-gradient lc-quiz-next-btn"
                      onClick={handleNextQuestion}
                    >
                      <span>
                        {quizIdx + 1 >= LITERACY_QUIZ.length
                          ? lang === 'TH'
                            ? 'ดูผลคะแนนควิซ'
                            : 'See Quiz Result'
                          : lang === 'TH'
                            ? 'ข้อถัดไป'
                            : 'Next Question'}
                      </span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="lc-quiz-result">
                <div className={`lc-result-badge ${quizScore >= 4 ? 'verified' : 'retry'}`}>
                  <Award size={24} aria-hidden="true" />
                  <div>
                    <strong className="tabular-nums">
                      {quizScore >= 4
                        ? lang === 'TH'
                          ? `ผ่านเกณฑ์โค้ชการเงิน! (${quizScore}/${LITERACY_QUIZ.length})`
                          : `Literacy Verified! (${quizScore}/${LITERACY_QUIZ.length})`
                        : lang === 'TH'
                          ? `ได้คะแนน ${quizScore}/${LITERACY_QUIZ.length} — ลองทบทวนอีกนิด!`
                          : `Scored ${quizScore}/${LITERACY_QUIZ.length} — Almost There!`}
                    </strong>
                    <p>
                      {quizScore >= 4
                        ? lang === 'TH'
                          ? 'คุณเข้าใจกติกาสำคัญทั้งระยะเวลารอคอย สวัสดิการ และกรอบงบปลอดภัยพร้อมลุยสนามจำลองแล้ว'
                          : 'You mastered waiting periods, conservative benefit checks, and safe budgeting — ready for the game!'
                        : lang === 'TH'
                          ? 'ลองสลับไปอ่านแท็บ "บทความ 2 นาที" เพิ่มเติม แล้วกลับมาทำควิซใหม่ได้ตลอดเวลา'
                          : 'Switch to the 2-Min Guides tab to review and retake the quiz anytime.'}
                    </p>
                  </div>
                </div>

                <div className="lc-quiz-result-actions">
                  <button
                    type="button"
                    className="btn-soft-gray lc-quiz-act-btn"
                    onClick={handleRestartQuiz}
                  >
                    <RotateCcw size={15} />
                    <span>{lang === 'TH' ? 'ทำควิซใหม่' : 'Retake Quiz'}</span>
                  </button>

                  <button
                    type="button"
                    id="lc-goto-game-btn"
                    className="btn-primary-gradient lc-quiz-act-btn"
                    onClick={() => onNavigate && onNavigate('game')}
                  >
                    <Gamepad2 size={16} />
                    <span>
                      {lang === 'TH'
                        ? 'นำความรู้ไปทดสอบในเกมเอาตัวรอด'
                        : 'Test in Survival Game'}
                    </span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

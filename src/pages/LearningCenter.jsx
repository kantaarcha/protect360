import { useEffect, useMemo, useState } from 'react';
import {
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
    return { readIds: [], quizVerified: false, bestScore: 0 };
  }
  try {
    const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return { readIds: [], quizVerified: false, bestScore: 0 };
    const parsed = JSON.parse(raw);
    return {
      readIds: Array.isArray(parsed?.readIds) ? parsed.readIds : [],
      quizVerified: Boolean(parsed?.quizVerified),
      bestScore: Number.isFinite(Number(parsed?.bestScore)) ? Number(parsed.bestScore) : 0,
    };
  } catch {
    return { readIds: [], quizVerified: false, bestScore: 0 };
  }
}

export default function LearningCenter({ onNavigate }) {
  const { lang, t } = useLanguage();
  const { userProfile, monthlyIncome, monthlyExpenses, emergencyFund } = useFinance();

  // Persistent local progress (read articles + Literacy Verified badge)
  const [progress, setProgress] = useState(loadLearningProgress);

  // Search & category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Reader modal state
  const [openArticleId, setOpenArticleId] = useState(null);

  // Quick Jargon Decoder selected term
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
      // Ignore quota / private browsing storage restrictions
    }
  }, [progress]);

  // Close Reader Modal on ESC
  useEffect(() => {
    if (!openArticleId || typeof window === 'undefined') return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpenArticleId(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openArticleId]);

  const displayName = (userProfile?.firstName || '').trim() || 'First Jobber';
  const safeCapMin = Math.round((monthlyIncome || 25000) * 0.1);
  const safeCapMax = Math.round((monthlyIncome || 25000) * 0.15);
  const targetMonths = userProfile?.emergencyTargetMonths || 3;
  const emergencyGoal = Math.max(30000, Math.round((monthlyExpenses || 20000) * targetMonths));

  const categoryTabs = useMemo(
    () =>
      LEARNING_CATEGORIES.map((cat) => ({
        id: cat.id,
        label: t(cat.label),
      })),
    [t]
  );

  // Filter 6 articles by category + search query
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

  // Filter jargon pills softly when searching (keep all visible if no match, highlight matches)
  const matchingJargonIds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return new Set();
    return new Set(
      JARGON_TERMS.filter((item) =>
        `${item.term.th} ${item.term.en} ${item.plainMeaning.th} ${item.plainMeaning.en}`
          .toLowerCase()
          .includes(q)
      ).map((item) => item.id)
    );
  }, [searchQuery]);

  const activeJargon =
    JARGON_TERMS.find((item) => item.id === selectedJargonId) || JARGON_TERMS[0];

  const openArticle =
    LEARNING_ARTICLES.find((article) => article.id === openArticleId) || null;

  const handleOpenArticle = (articleId) => {
    setOpenArticleId(articleId);
    setProgress((prev) => {
      if (prev.readIds.includes(articleId)) return prev;
      return { ...prev, readIds: [...prev.readIds, articleId] };
    });
  };

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
      {/* 1. SEARCH & CATEGORY FILTER BAR + PERSONALIZED READING PROGRESS       */}
      {/* ===================================================================== */}
      <section className="bento-card lc-filter-card" aria-label="Search and filter learning library">
        <div className="lc-filter-top">
          <div className="lc-search-wrap">
            <Search size={16} className="lc-search-icon" aria-hidden="true" />
            <input
              id="lc-search-input"
              type="search"
              className="lc-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'TH'
                  ? 'ค้นหาคำศัพท์หรือหัวข้อ เช่น ระยะเวลารอคอย, OPD, ประกันกลุ่ม...'
                  : 'Search terms or topics: Waiting Period, OPD, Deductible...'
              }
              aria-label={lang === 'TH' ? 'ค้นหาบทความและคำศัพท์' : 'Search articles and terms'}
            />
            {searchQuery && (
              <button
                type="button"
                className="lc-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="lc-progress-pills tabular-nums">
            <span className="lc-prog-pill">
              <BookOpen size={13} aria-hidden="true" />
              {lang === 'TH'
                ? `อ่านแล้ว ${progress.readIds.length}/${LEARNING_ARTICLES.length}`
                : `Read ${progress.readIds.length}/${LEARNING_ARTICLES.length}`}
            </span>
            {progress.quizVerified && (
              <span className="lc-prog-pill verified">
                <Award size={13} aria-hidden="true" />
                {lang === 'TH' ? 'ผ่านเกณฑ์โค้ชการเงิน' : 'Literacy Verified'}
              </span>
            )}
          </div>
        </div>

        <div className="lc-filter-bottom">
          <LiquidTabs
            tabs={categoryTabs}
            activeId={activeCategory}
            onChange={setActiveCategory}
            variant="compact"
            idPrefix="learning-cat"
            ariaLabel={lang === 'TH' ? 'กรองหมวดหมู่ความรู้' : 'Filter learning topics'}
          />

          <span className="lc-personal-hint tabular-nums">
            {lang === 'TH'
              ? `กรอบปลอดภัยของ ${displayName}: งบโอนเสี่ยงไม่เกิน ${formatTHB(safeCapMax)}/ด.`
              : `${displayName}'s guardrail: max ${formatTHB(safeCapMax)}/mo protection`}
          </span>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. 6 INTERACTIVE "2-MINUTE MICRO-LEARNING" BENTO CARDS                */}
      {/* ===================================================================== */}
      <section className="lc-articles-section" aria-label="2-minute micro-learning articles">
        {filteredArticles.length === 0 ? (
          <div className="bento-card lc-empty-state">
            <BookOpen size={26} aria-hidden="true" />
            <p>
              {lang === 'TH'
                ? `ไม่พบบทความที่ตรงกับ "${searchQuery}" ลองค้นหาด้วยคำอื่น หรือดูคำแปลศัพท์ด้านล่าง`
                : `No articles match "${searchQuery}". Try another keyword or check the Jargon Decoder below.`}
            </p>
            <button
              type="button"
              className="btn-soft-gray"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              {lang === 'TH' ? 'แสดงทั้งหมด' : 'Show All Topics'}
            </button>
          </div>
        ) : (
          <div className="lc-articles-grid">
            {filteredArticles.map((article) => {
              const Icon = ARTICLE_ICONS[article.iconName] || BookOpen;
              const isRead = progress.readIds.includes(article.id);
              return (
                <article
                  key={article.id}
                  className={`bento-card lc-article-card ${isRead ? 'is-read' : ''}`}
                >
                  <div className="lc-article-top">
                    <span className={`lc-cat-pill cat-${article.category}`}>
                      <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
                      <span>{t(article.categoryLabel)}</span>
                    </span>

                    <span className="lc-time-badge tabular-nums">
                      {isRead ? (
                        <>
                          <CheckCircle2 size={13} className="lc-read-check" aria-hidden="true" />
                          <span>{lang === 'TH' ? 'อ่านแล้ว' : 'Read'}</span>
                        </>
                      ) : (
                        <>
                          <Clock size={12} aria-hidden="true" />
                          <span>
                            {lang === 'TH'
                              ? `อ่าน ${article.readMinutes} นาที`
                              : `${article.readMinutes} min read`}
                          </span>
                        </>
                      )}
                    </span>
                  </div>

                  <h2 className="lc-article-title">{t(article.title)}</h2>
                  <p className="lc-article-hook">{t(article.hook)}</p>

                  <div className="lc-article-footer">
                    <button
                      type="button"
                      id={`lc-read-${article.id}`}
                      className="lc-read-btn"
                      onClick={() => handleOpenArticle(article.id)}
                    >
                      <span>{lang === 'TH' ? 'อ่านสรุปเข้าใจง่าย' : 'Read Summary'}</span>
                      <ArrowRight size={15} strokeWidth={2.3} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ===================================================================== */}
      {/* 3. INTERACTIVE SPLIT: JARGON DECODER (LEFT) & 5-QUESTION QUIZ (RIGHT) */}
      {/* ===================================================================== */}
      <section className="lc-split-grid" aria-label="Jargon decoder and literacy quiz">
        {/* LEFT CARD: Quick Jargon Decoder */}
        <article className="bento-card lc-jargon-card">
          <div className="lc-card-head">
            <span className="gm-icon-badge blue" aria-hidden="true">
              <Sparkles size={18} strokeWidth={2.1} />
            </span>
            <div>
              <h2 className="lc-card-title">
                {lang === 'TH' ? 'ตัวแปลศัพท์กรมธรรม์ทันใจ' : 'Quick Jargon Decoder'}
              </h2>
              <p className="lc-card-sub">
                {lang === 'TH'
                  ? 'กดเลือกคำศัพท์ที่เจอบ่อย เพื่อดูความหมายภาษาคนทั่วไปและทริคใช้งานจริง'
                  : 'Tap any confusing policy term for an instant plain-language translation.'}
              </p>
            </div>
          </div>

          <div className="lc-jargon-pills" role="tablist" aria-label="Jargon terms">
            {JARGON_TERMS.map((item) => {
              const isSelected = activeJargon.id === item.id;
              const isSearchHit = matchingJargonIds.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`lc-jargon-pill ${isSelected ? 'active' : ''} ${
                    isSearchHit ? 'search-hit' : ''
                  }`}
                  onClick={() => setSelectedJargonId(item.id)}
                >
                  {t(item.term)}
                </button>
              );
            })}
          </div>

          <div className="lc-jargon-output" role="tabpanel">
            <div className="lc-jargon-out-head">
              <h3>{t(activeJargon.term)}</h3>
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
          </div>
        </article>

        {/* RIGHT CARD: 5-Question Risk & Policy Literacy Quiz */}
        <article className="bento-card lc-quiz-card">
          <div className="lc-card-head lc-quiz-head">
            <div className="lc-card-head-left">
              <span className="gm-icon-badge teal" aria-hidden="true">
                <Award size={18} strokeWidth={2.1} />
              </span>
              <div>
                <h2 className="lc-card-title">
                  {lang === 'TH'
                    ? 'ควิซเช็กภูมิคุ้มกันความรู้ 5 ข้อ'
                    : '5-Question Literacy Check'}
                </h2>
                <p className="lc-card-sub">
                  {lang === 'TH'
                    ? 'ทดสอบกับดักจริงที่มือใหม่มักพลาด ตอบถูก 4/5 ข้อรับป้ายผ่านเกณฑ์'
                    : 'Test 5 common real-world traps — score 4/5+ to earn Literacy Verified.'}
                </p>
              </div>
            </div>

            <span className="lc-quiz-step-pill tabular-nums">
              {quizFinished
                ? `${quizScore} / ${LITERACY_QUIZ.length}`
                : lang === 'TH'
                  ? `ข้อที่ ${quizIdx + 1}/${LITERACY_QUIZ.length}`
                  : `Q ${quizIdx + 1}/${LITERACY_QUIZ.length}`}
            </span>
          </div>

          {/* Soft Gradient Progress Bar */}
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
            /* Quiz Completion State */
            <div className="lc-quiz-result">
              <div
                className={`lc-result-badge ${quizScore >= 4 ? 'verified' : 'retry'}`}
              >
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
                        ? 'ลองอ่านสรุป 2 นาทีด้านบนเพิ่มเติม แล้วกลับมาลองทำควิซใหม่ได้ตลอดเวลา'
                        : 'Skim the 2-minute summaries above and retake the quiz anytime to earn your badge.'}
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
        </article>
      </section>

      {/* ===================================================================== */}
      {/* BENTO READER MODAL (JARGON vs PLAIN TRANSLATION + FIRST JOBBER CASE)  */}
      {/* ===================================================================== */}
      {openArticle && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lc-reader-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenArticleId(null);
          }}
        >
          <div className="modal-card lc-reader-modal">
            <div className="lc-reader-head">
              <div className="lc-reader-meta">
                <span className={`lc-cat-pill cat-${openArticle.category}`}>
                  {t(openArticle.categoryLabel)}
                </span>
                <span className="lc-time-badge tabular-nums">
                  <Clock size={12} aria-hidden="true" />
                  {lang === 'TH'
                    ? `อ่าน ${openArticle.readMinutes} นาที`
                    : `${openArticle.readMinutes} min read`}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setOpenArticleId(null)}
                aria-label={lang === 'TH' ? 'ปิดหน้าต่างอ่าน' : 'Close reader'}
              >
                <X size={18} />
              </button>
            </div>

            <h2 id="lc-reader-title" className="lc-reader-title">
              {t(openArticle.title)}
            </h2>
            <p className="lc-reader-intro">{t(openArticle.intro)}</p>

            {/* Side-by-Side Policy Jargon vs. Plain Translation */}
            <div className="lc-trans-block">
              <div className="lc-trans-headers">
                <span>{lang === 'TH' ? 'ศัพท์ทางการ (Policy Jargon)' : 'Policy Jargon'}</span>
                <span>{lang === 'TH' ? 'ภาษาคนทั่วไป (Plain Translation)' : 'Plain Translation'}</span>
              </div>

              <div className="lc-trans-rows">
                {openArticle.translations.map((pair, idx) => (
                  <div key={idx} className="lc-trans-row">
                    <div className="lc-trans-jargon">{t(pair.jargon)}</div>
                    <div className="lc-trans-plain">{t(pair.plain)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real First Jobber Example (Personalized on Article #6) */}
            <div className="lc-example-box tabular-nums">
              <strong>{t(openArticle.example.title)}</strong>
              <p>
                {openArticle.example.useDynamicNumbers
                  ? lang === 'TH'
                    ? `จากข้อมูลปัจจุบันของ ${displayName} (รายได้ ${formatTHB(monthlyIncome)}/ด. • เงินสำรอง ${formatTHB(emergencyFund)}): เป้าเงินสำรอง ${targetMonths} เดือนคือ ${formatTHB(emergencyGoal)} และกรอบงบโอนย้ายความเสี่ยงที่ปลอดภัยคือ ${formatTHB(safeCapMin)}–${formatTHB(safeCapMax)}/เดือน`
                    : `Based on ${displayName}'s live profile (Income ${formatTHB(monthlyIncome)}/mo • Reserve ${formatTHB(emergencyFund)}): your ${targetMonths}-month emergency goal is ${formatTHB(emergencyGoal)}, and your safe risk-transfer cap is ${formatTHB(safeCapMin)}–${formatTHB(safeCapMax)}/mo.`
                  : t(openArticle.example.body)}
              </p>
            </div>

            {/* Actionable Takeaway */}
            <div className="lc-takeaway-box">
              <Lightbulb size={17} className="lc-tip-icon" aria-hidden="true" />
              <p>{t(openArticle.takeaway)}</p>
            </div>

            <div className="lc-reader-footer">
              <button
                type="button"
                className="btn-soft-gray"
                onClick={() => setOpenArticleId(null)}
              >
                {lang === 'TH' ? 'ปิดหน้าต่าง' : 'Close'}
              </button>

              {openArticle.bridgeAction && (
                <button
                  type="button"
                  className="btn-primary-gradient"
                  onClick={() => {
                    const targetPage = openArticle.bridgeAction.page;
                    setOpenArticleId(null);
                    onNavigate?.(targetPage);
                  }}
                >
                  <span>{t(openArticle.bridgeAction.label)}</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

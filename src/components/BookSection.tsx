import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Clock, 
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BOOK_INTRO, BOOK_CHAPTERS, INITIAL_LEITNER_CARDS, BookChapter } from '../data/bookContent';
import { LeitnerCard } from '../types';
import { speakPersian, stopPersianSpeech } from '../utils/speechVoice';
import { playHeartbeatPulse, playSuccessChime, playTimerBeep } from '../utils/soundEffects';

interface BookSectionProps {
  onUnlockBadge: (badgeId: string) => void;
}

export const BookSection: React.FC<BookSectionProps> = ({ onUnlockBadge }) => {
  // Tabs: Intro & Audio Summary | Chapters | Leitner Box
  const [activeTab, setActiveTab] = useState<'audio_intro' | 'chapters' | 'leitner'>('audio_intro');

  // Selected Chapter Modal / Reader
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(null);

  // Audio Summary Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Leitner Box State (5 boxes)
  const [leitnerCards, setLeitnerCards] = useState<LeitnerCard[]>(INITIAL_LEITNER_CARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Handle Audio Summary Playback with synced paragraphs & heartbeat foley
  useEffect(() => {
    if (isPlayingAudio) {
      // Periodic heartbeat pulse sound
      const heartBeatInterval = setInterval(() => {
        playHeartbeatPulse();
      }, 3000);

      speakPersian(
        BOOK_INTRO.audioScenario.scriptFa,
        () => {
          setIsPlayingAudio(false);
          clearInterval(heartBeatInterval);
        },
        0.9
      );

      // Synced text paragraph advances
      const paragraphs = BOOK_INTRO.audioScenario.paragraphs;
      let pIdx = 0;
      audioIntervalRef.current = setInterval(() => {
        pIdx = (pIdx + 1) % paragraphs.length;
        setCurrentParagraphIndex(pIdx);
      }, 5000);

      return () => {
        clearInterval(heartBeatInterval);
        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        stopPersianSpeech();
      };
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      stopPersianSpeech();
    }
  }, [isPlayingAudio]);

  const toggleAudioSummary = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  // Leitner Card Handlers
  const currentCard = leitnerCards[currentCardIndex];

  const handleCardResult = (remembered: boolean) => {
    if (!currentCard) return;

    playTimerBeep(true);
    const updatedCards = [...leitnerCards];
    const targetIdx = currentCardIndex;

    if (remembered) {
      // Advance to next box (up to 5)
      updatedCards[targetIdx].box = Math.min(5, updatedCards[targetIdx].box + 1);
      playSuccessChime();
    } else {
      // Return to box 1 for spaced repetition
      updatedCards[targetIdx].box = 1;
    }

    setLeitnerCards(updatedCards);
    setShowAnswer(false);

    // Next card or wrap around
    if (currentCardIndex + 1 < leitnerCards.length) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
      // Check if user has mastered cards in box >= 3
      const mastered = updatedCards.filter(c => c.box >= 3).length;
      if (mastered >= 5) {
        onUnlockBadge('leitner_scholar');
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#ff9800', '#ff5722', '#ffffff'],
          });
        } catch {
          // fallback
        }
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-4 pb-14">
      {/* Header */}
      <div className="border-b border-[#242c3f] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">بخش دوم</span>
          <span aria-hidden="true">·</span>
          <span>کتاب و خلاصه صوتی بیومکانیک</span>
          <span aria-hidden="true">·</span>
          <span>۱۵ سال پژوهش میدانی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          کتاب مرجع و جعبه لایتنر بیومکانیک ایبل‌سیتی
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          جایگزینی روش‌های سنتی و آسیب‌زا با قوانین دقیق فیزیک اهرم‌ها، گشتاور مفاصل و یادگیری با تکرار فاصله‌دار
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121624] border border-[#242c40] rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('audio_intro')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'audio_intro'
              ? 'bg-[#ff5722] text-white shadow-md'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          مقدمه و ویس خلاصه‌صوتی
        </button>
        <button
          onClick={() => setActiveTab('chapters')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'chapters'
              ? 'bg-[#ff5722] text-white shadow-md'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          فصل‌های کتاب ({BOOK_CHAPTERS.length} فصل تخصصی)
        </button>
        <button
          onClick={() => setActiveTab('leitner')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'leitner'
              ? 'bg-[#ff5722] text-white shadow-md'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          جعبه لایتنر اصول تمرین ({leitnerCards.length} فلش‌کارت)
        </button>
      </div>

      {/* TAB 1: INTRO & AUDIO SUMMARY */}
      {activeTab === 'audio_intro' && (
        <div className="space-y-6">
          {/* Official Book Introduction */}
          <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-[#ff5722]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#ff9800] font-semibold">مقدمه رسمی کتاب</span>
                <h2 className="text-lg font-bold text-white">پیام بنیان‌گذاران ایبل‌سیتی</h2>
              </div>
            </div>

            <blockquote className="bg-[#0b0c10]/90 border-r-4 border-[#ff5722] p-5 rounded-xl text-neutral-200 text-base sm:text-lg leading-relaxed font-medium">
              «{BOOK_INTRO.officialIntroductionText}»
            </blockquote>
          </div>

          {/* AUDIO SUMMARY PLAYER (ویس خلاصه‌صوتی) */}
          <div className="bg-gradient-to-br from-[#181520] via-[#13111b] to-[#0f0e15] border-2 border-[#ff5722]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#ff5722]/20 text-[#ff7043]">
                    پادکست خلاصه‌صوتی (Audio Summary)
                  </span>
                  <span className="text-xs text-neutral-400">
                    افکت: موزیک ریتمیک انگیزشی + صدای ضربان قلب
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  خلاصه شنیداری کتاب با نریشن صوتی هوشمند
                </h3>
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                onClick={toggleAudioSummary}
                className={`py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                  isPlayingAudio
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                    : 'bg-[#ff5722] hover:bg-[#ff6d00] text-white shadow-[#ff5722]/30'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-6 h-6" />
                    <span>توقف پخش ویس</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>پخش ویس خلاصه‌صوتی</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated Animated Audio Waveform */}
            <div className="h-16 bg-[#0a0a0f] border border-[#272433] rounded-xl flex items-center justify-center gap-1.5 px-4 mb-6">
              {[12, 28, 45, 60, 35, 75, 90, 50, 65, 80, 40, 25, 70, 85, 30, 55, 70, 40, 20].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: isPlayingAudio ? `${Math.min(100, Math.max(15, (h * Math.sin(Date.now() / 200 + i) + h) / 1.5))}%` : '20%',
                  }}
                  className={`w-1.5 sm:w-2 rounded-full transition-all duration-150 ${
                    isPlayingAudio ? 'bg-gradient-to-t from-[#ff5722] to-amber-400' : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>

            {/* Synchronized Transcript Text */}
            <div className="bg-[#0b0c12]/90 border border-[#242133] rounded-xl p-5 space-y-3">
              <span className="text-xs text-[#ff9800] font-semibold block mb-1">
                متن همگام‌سازی‌شده نریشن گوینده:
              </span>
              {BOOK_INTRO.audioScenario.paragraphs.map((para, idx) => {
                const isCurrent = isPlayingAudio && currentParagraphIndex === idx;
                return (
                  <p
                    key={para.id}
                    className={`text-sm sm:text-base leading-relaxed transition-all duration-300 rounded-lg p-2 ${
                      isCurrent
                        ? 'bg-[#ff5722]/20 text-white font-bold border-r-4 border-[#ff5722]'
                        : 'text-neutral-300'
                    }`}
                  >
                    «{para.text}»
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOK CHAPTERS */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOOK_CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                onClick={() => setSelectedChapter(ch)}
                className="bg-[#121520] border border-[#252c3d] hover:border-[#ff5722]/60 rounded-2xl p-5 transition-all cursor-pointer shadow-lg hover:shadow-[#ff5722]/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="text-[#ff5722] font-semibold">{ch.chapterNumberFa}</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {ch.readTimeMin} دقیقه مطالعه
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {ch.titleFa}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {ch.summaryFa}
                  </p>
                </div>

                <div className="border-t border-[#212739] pt-3 flex items-center justify-between text-xs text-[#ff9800] font-semibold">
                  <span>مطالعه کامل فصل و فرمول‌ها</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Chapter Reading Modal */}
          {selectedChapter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-[#10131d] border border-[#2b334a] rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto text-neutral-200 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#22293c] pb-3">
                  <div>
                    <span className="text-xs text-[#ff5722] font-semibold">
                      {selectedChapter.chapterNumberFa}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">
                      {selectedChapter.titleFa}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="py-1 px-3 rounded-lg bg-[#212738] text-xs font-bold text-neutral-300 hover:text-white"
                  >
                    بستن
                  </button>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-neutral-200">
                  {selectedChapter.contentParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="bg-[#0b0d14] border border-[#262e42] p-4 rounded-xl">
                  <span className="text-xs font-semibold text-[#ff9800] block mb-1">
                    فرمول طلایی بیومکانیک این فصل:
                  </span>
                  <div className="font-mono text-sm text-emerald-400 dir-ltr text-left">
                    {selectedChapter.keyFormula}
                  </div>
                </div>

                <div className="bg-[#141825] border border-[#232a3d] p-4 rounded-xl">
                  <span className="text-xs font-semibold text-white block mb-2">
                    نکات کلیدی کاربردی در باشگاه:
                  </span>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    {selectedChapter.takeawayCues.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#ff5722]">▪</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LEITNER BOX FLASHCARDS (جعبه لایتنر اصول تمرین) */}
      {activeTab === 'leitner' && (
        <div className="space-y-6">
          {/* 5-Box Leitner Overview */}
          <div className="bg-[#121520] border border-[#232a3d] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#ff5722]" />
                <h3 className="text-base font-bold text-white">
                  وضعیت ۵ خانه جعبه لایتنر بیومکانیک
                </h3>
              </div>
              <span className="text-xs text-neutral-400">تکرار فاصله‌دار علمی</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((boxNum) => {
                const count = leitnerCards.filter(c => c.box === boxNum).length;
                return (
                  <div
                    key={boxNum}
                    className="bg-[#171c2b] border border-[#293248] rounded-xl p-3 text-center"
                  >
                    <div className="text-[11px] text-neutral-400">خانه {boxNum}</div>
                    <div className="text-xl font-black font-athletic text-[#ff9800] my-1">
                      {count}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {boxNum === 1 && 'امروز'}
                      {boxNum === 2 && '۲ روز بعد'}
                      {boxNum === 3 && '۴ روز بعد'}
                      {boxNum === 4 && '۱ هفته بعد'}
                      {boxNum === 5 && 'تثبیت دائم'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Leitner Flashcard */}
          {currentCard ? (
            <div className="bg-[#151926] border-2 border-[#2b354c] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                <span className="px-2.5 py-0.5 rounded bg-[#ff5722]/20 text-[#ff7043] font-semibold">
                  دسته‌بندی: {currentCard.biomechanicsCategory}
                </span>
                <span className="font-athletic font-bold text-neutral-300">
                  کارت {currentCardIndex + 1} از {leitnerCards.length} (خانه {currentCard.box})
                </span>
              </div>

              {/* Question */}
              <div className="my-6">
                <h4 className="text-xs text-neutral-400 font-semibold mb-2">پرسش بیومکانیک:</h4>
                <div className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {currentCard.questionFa}
                </div>
              </div>

              {/* Reveal Answer Button / Answer Body */}
              {showAnswer ? (
                <div className="bg-[#0e111a] border border-[#2d3852] p-5 rounded-xl my-6 animate-in fade-in">
                  <h4 className="text-xs text-emerald-400 font-semibold mb-1.5">
                    پاسخ علمی و بیومکانیک:
                  </h4>
                  <div className="text-sm sm:text-base text-neutral-100 leading-relaxed font-medium">
                    {currentCard.answerFa}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 rounded-xl bg-[#21283a] hover:bg-[#2b354e] active:scale-98 text-sm font-bold text-neutral-200 transition-all border border-[#374462] my-6"
                >
                  نمایش پاسخ علمی فلش‌کارت
                </button>
              )}

              {/* Action Buttons: Know it / Need Practice */}
              {showAnswer && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleCardResult(false)}
                    className="py-4 px-4 rounded-xl font-bold text-sm bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800 transition-all active:scale-95"
                  >
                    نیاز به تمرین مجدد (بازگشت به خانه ۱)
                  </button>
                  <button
                    onClick={() => handleCardResult(true)}
                    className="py-4 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 shadow-lg shadow-emerald-600/30"
                  >
                    کاملاً مسلطم (انتقال به خانه بعدی)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 bg-[#121520] rounded-2xl border border-[#252c3d]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">تمام فلش‌کارت‌های امروز مرور شدند!</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

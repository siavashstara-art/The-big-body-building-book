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
  Activity,
  Video,
  FileText,
  Mic,
  Globe,
  Heart,
  Trophy,
  Dumbbell,
  ShieldCheck
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
  // Tabs: Intro & Teaser Preview | Chapters | Leitner Box
  const [activeTab, setActiveTab] = useState<'audio_intro' | 'chapters' | 'leitner'>('audio_intro');

  // Selected Chapter Modal / Reader
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(null);

  // Audio Summary Player State (Interactive Web Speech Engine)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // English Audio Preview Player State
  const [isPlayingEnglishAudio, setIsPlayingEnglishAudio] = useState(false);

  // Leitner Box State (5 boxes)
  const [leitnerCards, setLeitnerCards] = useState<LeitnerCard[]>(INITIAL_LEITNER_CARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Handle Persian Audio Summary Playback with synced paragraphs & heartbeat foley
  useEffect(() => {
    if (isPlayingAudio) {
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
    if (isPlayingEnglishAudio) setIsPlayingEnglishAudio(false);
    setIsPlayingAudio(!isPlayingAudio);
  };

  const toggleEnglishAudioSummary = () => {
    if (isPlayingAudio) setIsPlayingAudio(false);
    setIsPlayingEnglishAudio(!isPlayingEnglishAudio);
  };

  // Leitner Card Handlers
  const currentCard = leitnerCards[currentCardIndex];

  const handleCardResult = (remembered: boolean) => {
    if (!currentCard) return;

    playTimerBeep(true);
    const updatedCards = [...leitnerCards];
    const targetIdx = currentCardIndex;

    if (remembered) {
      updatedCards[targetIdx].box = Math.min(5, updatedCards[targetIdx].box + 1);
      playSuccessChime();
    } else {
      updatedCards[targetIdx].box = 1;
    }

    setLeitnerCards(updatedCards);
    setShowAnswer(false);

    if (currentCardIndex + 1 < leitnerCards.length) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
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
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#131726] via-[#101421] to-[#0a0d16] border border-[#ff5722]/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#ff5722]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#ff9800]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Logo Asset */}
          <div className="w-full md:w-56 shrink-0 rounded-xl overflow-hidden border border-[#ff5722]/40 shadow-xl group">
            <img 
              src="/src/assets/images/afarinab_ablecity_logo_1793745200381.jpg" 
              alt="لوگوی ورزشی اکوسیستم آفرینش آفریناب و ایبل‌سیتی" 
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Header Content */}
          <div className="flex-1 text-right space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-400 font-medium">
              <span className="text-[#ff5722] font-bold">اکوسیستم آفرینش آفریناب</span>
              <span aria-hidden="true">·</span>
              <span>Able City</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-semibold">فناوری FBNew Meta</span>
              <span aria-hidden="true">·</span>
              <span>۱۵ سال پژوهش بیومکانیک</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              کتاب مرجع بیومکانیک زیستی و بدنسازی پیشرفته ایبل‌سیتی
            </h1>

            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              تولیدشده در اکوسیستم آفرینش آفریناب مبتنی بر معماری پیشرفته FBNew Meta؛ جایگزینی روش‌های سنتی و آسیب‌زا با قوانین دقیق فیزیک اهرم‌ها، گشتاور مفاصل و تغذیه دور تمرین.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                معماری آفلاین ۱۰۰٪ بدون نیاز به اینترنت
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Trophy className="w-4 h-4 text-amber-400" />
                همراه با بخش قدردانی از اساتید و قهرمانان جهان
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121624] border border-[#242c40] rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('audio_intro')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'audio_intro'
              ? 'bg-[#ff5722] text-white shadow-md'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>تیزر و پیش‌نمایش صوتی/ویدیویی</span>
        </button>
        <button
          onClick={() => setActiveTab('chapters')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'chapters'
              ? 'bg-[#ff5722] text-white shadow-md'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>فصل‌های کتاب ({BOOK_CHAPTERS.length} فصل تخصصی)</span>
        </button>
        <button
          onClick={() => setActiveTab('leitner')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'leitner'
              ? 'bg-[#ff5722] text-white shadow-md'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>جعبه لایتنر اصول تمرین ({leitnerCards.length} فلش‌کارت)</span>
        </button>
      </div>

      {/* TAB 1: BOOK PREVIEW & TEASER (ویدیو، خلاصه رایگان و فایل‌های صوتی) */}
      {activeTab === 'audio_intro' && (
        <div className="space-y-6 book-preview-container">
          {/* ۱. بخش نمایش تیزر تبلیغاتی استاندارد (مشابه آپارات / کافه‌بازار) */}
          <div className="promo-video-box bg-[#121624] border border-[#232a3e] rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#ff5722]" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  تیزر معرفی کتاب و اکوسیستم ایبل‌سیتی
                </h3>
              </div>
              <span className="text-[10px] bg-[#ff5722]/20 text-[#ff9800] px-2 py-0.5 rounded font-bold">
                نسخه آپارات / کافه‌بازار
              </span>
            </div>

            <div className="relative w-full overflow-hidden rounded-xl bg-black border border-[#2b354d] aspect-video shadow-lg">
              <iframe 
                src="https://www.aparat.com/video/video/embed/videohash/YOUR_VIDEO_HASH/vt/frame" 
                title="تیزر معرفی کتاب ایبل سیتی"
                className="absolute top-0 left-0 w-full h-full border-0" 
                allowFullScreen={true}
              />
              {/* Fallback Overlay graphics if Aparat hash is placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-1">
                  <Play className="w-4 h-4 fill-amber-400" />
                  <span>تیزر موشن گرافیک سینمایی ۴۵ ثانیه‌ای</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-tight">
                  بررسی قوانین فیزیک اهرم‌ها، فیزیولوژی عضلات و پیشگیری از آسیب در اکوسیستم بدنسازی ایبل‌سیتی
                </p>
              </div>
            </div>
          </div>

          {/* ۲. خلاصه متنی رایگان کتاب (بالای صفحه برای آشنایی مخاطب) */}
          <div className="free-summary-section bg-[#141926] border-r-4 border-[#ff5722] p-5 rounded-2xl shadow-xl space-y-2 text-right">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ff9800]">
              <FileText className="w-4 h-4" />
              <h4>خلاصه کتاب (نسخه پیش‌نمایش رایگان)</h4>
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed font-medium">
              این کتاب حاصل ۱۵ سال تلاش، تجربه و پژوهش است که مفاهیم عمیق زندگی، تلاش از رنج و ساختار پایداری بیومکانیکی بدن را روایت می‌کند. در این بخش کوتاه با کلیات اثر، اهداف فیزیولوژیک و متدولوژی علمی ایبل‌سیتی آشنا می‌شوید.
            </p>
          </div>

          {/* ۳. فایل‌های صوتی خلاصه (فارسی و انگلیسی) */}
          <div className="audio-previews bg-[#121522] border border-[#252d42] p-6 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#21283d] pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-black text-white">
                  پادکست و خلاصه صوتی (رایگان برای پیش‌نمایش)
                </h4>
              </div>
              <span className="text-xs text-neutral-400 font-mono">2 Languages Available</span>
            </div>
            
            {/* صوت خلاصه فارسی (Persian Summary Audio) */}
            <div className="space-y-2 text-right">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>خلاصه صوتی فارسی (Persian Summary Audio):</span>
                </label>
                <button
                  onClick={toggleAudioSummary}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isPlayingAudio
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#ff5722] hover:bg-[#ff6d00] text-white shadow-md'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingAudio ? 'توقف پادکست' : 'پخش گوینده صوتی'}</span>
                </button>
              </div>

              {/* Native Audio Player with Fallback */}
              <audio controls className="w-full rounded-xl bg-[#0b0e17] border border-[#262e45] p-1">
                <source src="assets/audio/summary_fa.mp3" type="audio/mpeg" />
                مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
              </audio>
            </div>

            {/* صوت خلاصه انگلیسی (English Summary Audio) */}
            <div className="space-y-2 text-left dir-ltr border-t border-[#1a2133] pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>English Summary Audio (International Edition):</span>
                </label>
                <button
                  onClick={toggleEnglishAudioSummary}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isPlayingEnglishAudio
                      ? 'bg-rose-600 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                  }`}
                >
                  {isPlayingEnglishAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingEnglishAudio ? 'Stop English Audio' : 'Play Voice'}</span>
                </button>
              </div>

              {/* Native Audio Player for English */}
              <audio controls className="w-full rounded-xl bg-[#0b0e17] border border-[#262e45] p-1">
                <source src="assets/audio/summary_en.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>

          {/* Official Book Introduction Text Box */}
          <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-right">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-[#ff5722]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#ff9800] font-semibold">مقدمه رسمی کتاب</span>
                <h2 className="text-lg font-bold text-white">پیام بنیان‌گذاران ایبل‌سیتی</h2>
              </div>
            </div>

            <blockquote className="bg-[#0b0c10]/90 border-r-4 border-[#ff5722] p-5 rounded-xl text-neutral-200 text-base sm:text-lg leading-relaxed font-medium text-right">
              «{BOOK_INTRO.officialIntroductionText}»
            </blockquote>
          </div>

          {/* Mentors & Coaches Tribute Box */}
          <div className="bg-[#121522] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right">
            <div className="flex items-center justify-between border-b border-[#242c40] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">لوح ادای احترام و پاسداشت اساتید</span>
                  <h3 className="text-base sm:text-lg font-black text-white">{BOOK_INTRO.mentorsTribute.titleFa}</h3>
                </div>
              </div>
              <Heart className="w-5 h-5 text-rose-500 animate-pulse hidden sm:block" />
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
              {BOOK_INTRO.mentorsTribute.descriptionFa}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Bodybuilding Mentors */}
              <div className="bg-[#161b2a] p-5 rounded-2xl border border-[#28324a] space-y-3">
                <div className="flex items-center gap-2 text-amber-400 border-b border-[#21293c] pb-2 text-xs font-bold">
                  <Dumbbell className="w-4 h-4 text-[#ff5722]" />
                  <span>اساتید و مربیان گرانقدر بدنسازی:</span>
                </div>
                <div className="space-y-2">
                  {BOOK_INTRO.mentorsTribute.bodybuildingMentors.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#0d101a] p-3 rounded-xl border border-[#212a3f]">
                      <span className="text-xs font-black text-white">{m.name}</span>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/15 px-2.5 py-0.5 rounded-md">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basketball Mentors */}
              <div className="bg-[#161b2a] p-5 rounded-2xl border border-[#28324a] space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 border-b border-[#21293c] pb-2 text-xs font-bold">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span>اساتید و مربیان گرانقدر بسکتبال:</span>
                </div>
                <div className="space-y-2">
                  {BOOK_INTRO.mentorsTribute.basketballMentors.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#0d101a] p-3 rounded-xl border border-[#212a3f]">
                      <span className="text-xs font-black text-white">{m.name}</span>
                      <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/15 px-2.5 py-0.5 rounded-md">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
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

import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  ShieldCheck, 
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MuscleId } from '../types';
import { Anatomy3DViewer } from './Anatomy3DViewer';
import { speakPersian, stopPersianSpeech, parsePersianGymCommand } from '../utils/speechVoice';
import { playSuccessChime, playWeightClang, playTimerBeep } from '../utils/soundEffects';

interface ScriptTwoUpperBodyProps {
  onSelectMuscleDetail: (muscleId: MuscleId) => void;
  onBadgeUnlocked: (badgeId: string) => void;
  isUnlocked: boolean;
}

export const ScriptTwoUpperBody: React.FC<ScriptTwoUpperBodyProps> = ({
  onSelectMuscleDetail,
  onBadgeUnlocked,
  isUnlocked,
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleId>('chest');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeElbowAngle, setActiveElbowAngle] = useState<75 | 90>(75);
  const [activeLatPhase, setActiveLatPhase] = useState<'step1_depression' | 'step2_pull'>('step1_depression');

  // Gym Logger State (Huge Buttons)
  const [todayWeight, setTodayWeight] = useState<number>(75);
  const [todayReps, setTodayReps] = useState<number>(8);
  const [currentSetNumber, setCurrentSetNumber] = useState<number>(1);
  const [loggedSets, setLoggedSets] = useState<Array<{ set: number; weight: number; reps: number }>>([
    { set: 1, weight: 70, reps: 10 },
    { set: 2, weight: 75, reps: 8 },
  ]);

  // Voice Command State
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Badge Status
  const [badgeAwarded, setBadgeAwarded] = useState(isUnlocked);

  const guideText = 'بالاتنه یک سیستم هماهنگ از اهرمهای فشاری و کششی است. در این بخش با فشار هوشمند روی عضلات سینه، پشت، سرشانه و بازو آشنا میشوید؛ بدون اینکه به مفصل شانه و مهرههای گردن آسیب بزنید.';

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopPersianSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakPersian(guideText, () => setIsSpeaking(false));
    }
  };

  // Voice Recognition Handler
  const toggleVoiceListening = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceFeedback(null);
      return;
    }

    const SpeechRecognitionClass = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Simulate voice command for demonstration if browser doesn't expose API
      setIsListening(true);
      setVoiceFeedback('در حال شنود... بگویید: "ثبت ست" یا "اضافه کن ۵ کیلو"');
      setTimeout(() => {
        handleLogSet();
        setVoiceFeedback('فرمان صوتی دریافت شد: «ثبت ست» ✓');
        setIsListening(false);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'fa-IR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback('گوش به زنگ... بگویید: «ثبت ست» یا «وزنه ۸۰»');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        const cmd = parsePersianGymCommand(text);

        if (cmd.action === 'LOG_SET') {
          handleLogSet();
          setVoiceFeedback(`فرمان «ثبت ست» دریافت شد: ${text} ✓`);
        } else if (cmd.action === 'ADD_WEIGHT') {
          setTodayWeight(w => w + (cmd.value || 5));
          playTimerBeep(true);
          setVoiceFeedback(`افزایش وزنه: +${cmd.value || 5} کیلوگرم ✓`);
        } else if (cmd.action === 'SET_WEIGHT') {
          if (cmd.value) setTodayWeight(cmd.value);
          playTimerBeep(true);
          setVoiceFeedback(`تنظیم وزنه به ${cmd.value} کیلوگرم ✓`);
        } else {
          setVoiceFeedback(`عبارت شنیده‌شده: "${text}" (جهت ثبت ست بگویید «ثبت ست»)`);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceFeedback('خطای تشخیص صدا؛ دکمه بزرگ دستی را لمس کنید.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceFeedback('میکروفون فعال نشد؛ از دکمه لمسی بزرگ استفاده کنید.');
    }
  };

  const handleLogSet = () => {
    playWeightClang();
    playSuccessChime();

    const newSet = {
      set: currentSetNumber,
      weight: todayWeight,
      reps: todayReps,
    };

    setLoggedSets(prev => [...prev, newSet]);
    setCurrentSetNumber(s => s + 1);

    // If logged at least 3 sets, award "Upper Body Master" badge!
    if (!badgeAwarded && loggedSets.length >= 2) {
      setBadgeAwarded(true);
      onBadgeUnlocked('upper_body_master');
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff5722', '#ff9800', '#ffd600', '#ffffff'],
        });
      } catch {
        // fallback
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-4 pb-12">
      {/* Title & Metadata */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">اسکریپت شماره ۲</span>
          <span aria-hidden="true">·</span>
          <span>آناتومی کاربردی بالاتنه</span>
          <span aria-hidden="true">·</span>
          <span>تمرکز: اهرم‌های فشاری و کششی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          آناتومی کاربردی و حرکات بیومکانیکی بالاتنه
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          مهندسی اهرم‌های سینه، پشت، سرشانه و بازوها؛ بدون آسیب به کپسول شانه و دیسک‌های گردنی
        </p>
      </div>

      {/* بخش اول: نقشه حرکتی بالاتنه و عضلات هدف */}
      <section className="bg-gradient-to-br from-[#151824] to-[#0f1118] border border-[#2c354a] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5722]/15 border border-[#ff5722]/40 flex items-center justify-center text-[#ff5722]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#ff9800] font-semibold">بخش اول</span>
              <h2 className="text-lg font-bold text-white">نقشه حرکتی بالاتنه و عضلات هدف</h2>
            </div>
          </div>

          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs transition-all shadow-md active:scale-95 ${
              isSpeaking
                ? 'bg-rose-600 text-white'
                : 'bg-[#222838] hover:bg-[#2b3347] text-neutral-200 border border-[#353e54]'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>توقف ویس</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#ff5722]" />
                <span>شنیدن راهنمای صوتی</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="bg-[#0b0c10]/80 border-r-4 border-[#ff5722] p-4 rounded-xl text-neutral-200 text-sm sm:text-base leading-relaxed font-medium mb-6">
          «{guideText}»
        </blockquote>

        {/* 3D Mannequin Visual-First Interactive Experience */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-300">
              مدل سه‌بعدی عضلات بالاتنه (عضله مورد نظر را لمس یا کلیک کنید):
            </span>
          </div>

          <Anatomy3DViewer
            selectedMuscle={selectedMuscle}
            onSelectMuscle={(m) => {
              setSelectedMuscle(m);
              onSelectMuscleDetail(m);
            }}
          />

          {/* Quick Muscle Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
            {(['chest', 'back', 'shoulders', 'biceps', 'triceps'] as MuscleId[]).map((mid) => (
              <button
                key={mid}
                onClick={() => {
                  setSelectedMuscle(mid);
                  onSelectMuscleDetail(mid);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                  selectedMuscle === mid
                    ? 'bg-[#ff5722] text-white border-[#ff7043] shadow-md shadow-[#ff5722]/30'
                    : 'bg-[#181d2a] text-neutral-300 border-[#2b3447] hover:bg-[#242b3d]'
                }`}
              >
                {mid === 'chest' && 'عضلات سینه'}
                {mid === 'back' && 'زیربغل و پشت'}
                {mid === 'shoulders' && 'سرشانه'}
                {mid === 'biceps' && 'جلو بازو'}
                {mid === 'triceps' && 'پشت بازو'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* بخش دوم: تحلیل بیومکانیکی حرکات اصلی بالاتنه (با جعبه لایتنر حرکتی) */}
      <section className="bg-[#121520] border border-[#232a3d] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#ff5722] font-semibold">بخش دوم (تحلیل بیومکانیک دقیق)</span>
            <h2 className="text-lg font-bold text-white">حرکات کلیدی فشاری و کششی بالاتنه</h2>
          </div>
        </div>

        {/* 1. Chest Press (اهرم فشاری) */}
        <div className="bg-[#161a27] border border-[#2c354c] rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252c3e] pb-3 mb-4">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                اهرم فشاری (Push Lever)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                ۱. پرس سینه (Pors-e Sineh / Chest Press)
              </h3>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              زاویه آرنج نسبت به تنه
            </div>
          </div>

          {/* Interactive 75° vs 90° Visual Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div
              onClick={() => setActiveElbowAngle(75)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                activeElbowAngle === 75
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#10121a] border-[#222736] opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  زاویه ایمن ۷۵ درجه (استاندارد ایبل‌سیتی)
                </span>
                <span className="text-xs font-athletic font-bold text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded">
                  75° DEG
                </span>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed">
                آرنج‌ها با زاویه ۷۵ درجه نسبت به بالاتنه قرار می‌گیرند. سر استخوان بازو دقیقاً در مرکز حفره شانه می‌چرخد و حداکثر بار مکانیکی روی پکتورالیس ماژور اعمال می‌شود.
              </p>
            </div>

            <div
              onClick={() => setActiveElbowAngle(90)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                activeElbowAngle === 90
                  ? 'bg-rose-950/30 border-rose-500 shadow-lg shadow-rose-500/10'
                  : 'bg-[#10121a] border-[#222736] opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  خطای خطرناک ۹۰ درجه (پارگی و گیرکردگی)
                </span>
                <span className="text-xs font-athletic font-bold text-rose-300 bg-rose-900/40 px-2 py-0.5 rounded">
                  90° DANGER
                </span>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed">
                باز کردن کامل آرنج‌ها موازی با شانه‌ها (۹۰ درجه) تاندون سرشانه (Rotator Cuff) را بین استخوان‌ها فشرده کرده و منشأ دردهای مزمن شانه است.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Lat Pulldown / Pull-ups (اهرم کششی) */}
        <div className="bg-[#161a27] border border-[#2c354c] rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252c3e] pb-3 mb-4">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                اهرم کششی (Pull Lever)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                ۲. بارفیکس / زیربغل سیم‌کش (Zirbaghal / Lat Pull)
              </h3>
            </div>
            <div className="text-xs text-neutral-400">
              ترتیب انقباض عصبی-عضلانی
            </div>
          </div>

          <div className="bg-[#0d0f17] border border-[#23293a] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#ff5722] text-white text-xs font-bold flex items-center justify-center">
                ۱
              </span>
              <span className="text-sm font-bold text-white">
                گام ۱: پایین کشیدن استخوان کتف (Scapular Depression)
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed pr-8">
              پیش از خم شدن مفصل آرنج، شانه‌ها را به سمت پایین فشار دهید. این فعال‌سازی آغازین عضله لت (Latissimus Dorsi) را به ۱۰۰٪ درگیری می‌رساند و مانع از هدر رفتن نیرو در عضلات بازو می‌شود.
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-[#1c2233]">
              <span className="w-6 h-6 rounded-full bg-neutral-700 text-white text-xs font-bold flex items-center justify-center">
                ۲
              </span>
              <span className="text-sm font-bold text-neutral-200">
                گام ۲: هدایت آرنج‌ها به سمت پایین و جیب‌های پشت شلوار
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* بخش سوم: نکات دسترسی‌پذیری و حالت باشگاهی (Accessibility & Giant Buttons & Voice) */}
      <section className="bg-[#121520] border-2 border-amber-500/40 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-amber-400 font-semibold">بخش سوم (Accessibility)</span>
              <h2 className="text-lg font-bold text-white">حالت باشگاهی و فرمان صوتی بدون لمس</h2>
            </div>
          </div>

          {/* Voice Command Activate Button */}
          <button
            onClick={toggleVoiceListening}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#ff5722] hover:bg-[#ff6d00] text-white shadow-[#ff5722]/30'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>در حال گوش دادن... (بگویید «ثبت ست»)</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>فعال‌سازی فرمان صوتی (دست خیس/تعریق)</span>
              </>
            )}
          </button>
        </div>

        {voiceFeedback && (
          <div className="bg-[#1b2233] border border-[#ff5722] text-neutral-100 text-xs sm:text-sm p-3.5 rounded-xl mb-5 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#ff9800] shrink-0" />
            <span>{voiceFeedback}</span>
          </div>
        )}

        {/* Giant Buttons for Weight and Reps Logging */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Weight Controller */}
          <div className="bg-[#171c2b] border border-[#2b354c] rounded-2xl p-5 text-center">
            <div className="text-xs text-neutral-400 font-semibold mb-1">
              وزنه ست جاری ({selectedMuscle === 'back' ? 'زیربغل' : 'پرس سینه'})
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white font-athletic tracking-wider my-2">
              {todayWeight} <span className="text-lg text-neutral-400 font-sans font-normal">کیلوگرم</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2">
              <button
                onClick={() => setTodayWeight(w => Math.max(10, w - 5))}
                className="py-3 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-lg border border-[#3b4763]"
              >
                -۵
              </button>
              <button
                onClick={() => setTodayWeight(w => Math.max(10, w - 2.5))}
                className="py-3 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-sm border border-[#3b4763]"
              >
                -۲.۵
              </button>
              <button
                onClick={() => setTodayWeight(w => w + 2.5)}
                className="py-3 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-sm border border-[#3b4763]"
              >
                +۲.۵
              </button>
              <button
                onClick={() => setTodayWeight(w => w + 5)}
                className="py-3 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-lg border border-[#3b4763]"
              >
                +۵
              </button>
            </div>
          </div>

          {/* Reps Controller */}
          <div className="bg-[#171c2b] border border-[#2b354c] rounded-2xl p-5 text-center">
            <div className="text-xs text-neutral-400 font-semibold mb-1">
              تعداد تکرار هدف
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white font-athletic tracking-wider my-2">
              {todayReps} <span className="text-lg text-neutral-400 font-sans font-normal">تکرار</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setTodayReps(r => Math.max(1, r - 1))}
                className="py-3 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-2xl border border-[#3b4763]"
              >
                -
              </button>
              <button
                onClick={() => setTodayReps(r => r + 1)}
                className="py-3 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-2xl border border-[#3b4763]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* GIANT LOG SET BUTTON (Optimized for sweaty fingers & instant response) */}
        <button
          onClick={handleLogSet}
          className="w-full py-5 px-6 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-98 transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 border-2 border-emerald-300/40"
        >
          <CheckCircle2 className="w-8 h-8" />
          <span>ثبت ست {currentSetNumber} (لمس بزرگ یا فرمان صوتی)</span>
        </button>
      </section>

      {/* بخش چهارم: گیمیفیکیشن و ثبت رکورد در PWA (نمودار پیشرفت صعودی و نشان استاد بالاتنه) */}
      <section className="bg-[#121520] border border-[#242c3e] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-[#ff5722]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#ff5722] font-semibold">بخش چهارم</span>
              <h2 className="text-lg font-bold text-white">نمودار پیشرفت صعودی (Progressive Overload)</h2>
            </div>
          </div>

          {badgeAwarded && (
            <div className="flex items-center gap-2 bg-[#ff5722]/20 border border-[#ff5722]/60 px-3 py-1.5 rounded-xl text-xs font-bold text-white">
              <Award className="w-4 h-4 text-[#ff9800]" />
              <span>نشان «استاد بالاتنه» آنلاک شد!</span>
            </div>
          )}
        </div>

        {/* Ascending Chart Visual */}
        <div className="bg-[#0d0f17] border border-[#232a3a] rounded-xl p-5 mb-5">
          <div className="flex items-end justify-between gap-3 h-40 pt-6 px-2">
            {loggedSets.map((s, idx) => {
              const heightPercent = Math.min(100, Math.max(30, (s.weight / 110) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-bold font-athletic text-[#ff9800]">
                    {s.weight}kg
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] bg-gradient-to-t from-[#ff5722] to-[#ff9800] rounded-t-lg transition-all duration-500 shadow-lg shadow-[#ff5722]/20"
                  />
                  <span className="text-[11px] text-neutral-400 font-sans">
                    ست {s.set} ({s.reps} تکرار)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-neutral-400 text-center">
          ثبت حداقل ۳ ست بالاتنه به صورت خودکار نشان «استاد بالاتنه» را در پروفایل شما پایدار می‌کند.
        </div>
      </section>
    </div>
  );
};

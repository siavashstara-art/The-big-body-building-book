import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Clock, 
  RotateCcw, 
  ArrowLeft,
  ChevronRight,
  Activity,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakPersian, stopPersianSpeech } from '../utils/speechVoice';
import { playSuccessChime, playTimerBeep } from '../utils/soundEffects';

interface ScriptFourCorrectiveProps {
  onBadgeUnlocked: (badgeId: string) => void;
  isUnlocked: boolean;
  onProceedNext?: () => void;
}

interface PostureIssue {
  id: string;
  nameFa: string;
  nameEn: string;
  biomechProblemFa: string;
  correctionProtocolFa: string;
  exerciseNameFa: string;
  exerciseNameEn: string;
  durationSec: number;
  repsText: string;
  keyCueFa: string;
}

export const ScriptFourCorrective: React.FC<ScriptFourCorrectiveProps> = ({
  onBadgeUnlocked,
  isUnlocked,
  onProceedNext,
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string>('kyphosis');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFixedMode, setShowFixedMode] = useState<boolean>(true); // Compare flawed vs corrected

  // Daily Corrective Routine Tracker
  const [completedExercises, setCompletedExercises] = useState<{ [id: string]: boolean }>({
    kyphosis: true,
  });

  // Routine Timer State
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Badge state
  const [badgeClaimed, setBadgeClaimed] = useState<boolean>(isUnlocked);

  const guideText = 'بسیاری از دردهای مزمن در باشگاه، ریشه در ناهنجاریهای روزمره یا فرمهای غلطِ گذشته دارند. در این بخش، با حرکات اصلاحیِ دقیق آشنا میشوید تا ساختار قامتی خود را تراز کرده و بستر را برای رشد عضلانیِ ایمن فراهم کنید.';

  const POSTURE_ISSUES: PostureIssue[] = [
    {
      id: 'kyphosis',
      nameFa: 'قوز پشتی و انحنای بیش از حد سینه (Kyphosis)',
      nameEn: 'Thoracic Kyphosis & Rounded Shoulders',
      biomechProblemFa: 'کوتاه شدن و سفتی عضلات پکتورالیس مینور همراه با ضعف متوازی‌الاضلاع‌ها و بخش میانی و پایینی ذوزنقه که استخوان کتف را به جلو و بالا می‌کشد.',
      correctionProtocolFa: 'تقویت عضلات میانه کمر (Scapular Retractors) و رهایش فاشیای سینه‌ای (Chest Opening) برای خروج ستون فقرات از حالت خمیده رو به جلو.',
      exerciseNameFa: 'کشش سینه و تقویت میان‌تنه',
      exerciseNameEn: 'Keshish-e Sineh / Upper Back Fix',
      durationSec: 45,
      repsText: '۳ ست × ۱۲ تکرار ایزومتریک ۲ ثانیه‌ای',
      keyCueFa: 'فشردن کتف‌ها به هم و پایین کشیدن شانه‌ها به دور از گوش‌ها'
    },
    {
      id: 'hyperlordosis',
      nameFa: 'گودی بیش از حد کمر (Hyperlordosis)',
      nameEn: 'Excessive Lumbar Lordosis & Anterior Pelvic Tilt',
      biomechProblemFa: 'کوتاهی شدید خم‌کننده‌های ران (Psoas & Rectus Femoris) و ضعف عضلات راست شکمی و سرینی که لگن را به جلو کج کرده و دیسک‌های L4-L5 را تحت فشار برشی قرار می‌دهد.',
      correctionProtocolFa: 'فعال‌سازی عمقی عضلات شکم (Core Activation) و ایجاد تیلت خلفی لگن (Posterior Pelvic Tilt) برای بازگرداندن قوس طبیعی مهره‌های کمری.',
      exerciseNameFa: 'اصلاح لگن و کمر',
      exerciseNameEn: 'Eslah-e Kamar / Core & Pelvic Tilt',
      durationSec: 60,
      repsText: '۳ ست × ۱۵ تکرار با انقباض شکمی',
      keyCueFa: 'چسباندن کامل گودی کمر به زمین حین اجرای پل باسن'
    },
    {
      id: 'forward_head',
      nameFa: 'جلوآمدگی سر و گردن (Forward Head Posture)',
      nameEn: 'Cervical Forward Head Posture',
      biomechProblemFa: 'هر ۲.۵ سانتی‌متر جلو آمدن سر، ۴.۵ کیلوگرم بار اضافی روی مهره‌های گردنی اعمال می‌کند.',
      correctionProtocolFa: 'انجام حرکات چانه به داخل (Chin Tucks) و کشش عضلات استرنوکلیدوماستوئید.',
      exerciseNameFa: 'عقب‌کشی چانه و تراز گردن',
      exerciseNameEn: 'Chin Tucks & Neck Alignment',
      durationSec: 30,
      repsText: '۳ ست × ۱۰ تکرار با ۵ ثانیه مکث',
      keyCueFa: 'فشردن پس سر به دیوار پشتی بدون بالا بردن چانه'
    }
  ];

  const currentIssue = POSTURE_ISSUES.find(i => i.id === selectedIssueId) || POSTURE_ISSUES[0];

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopPersianSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakPersian(guideText, () => setIsSpeaking(false));
    }
  };

  const handleStartTimer = (seconds: number) => {
    setActiveTimerSeconds(seconds);
    setTimerRunning(true);
    playTimerBeep(true);

    const interval = setInterval(() => {
      setActiveTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          playSuccessChime();
          // mark as completed
          setCompletedExercises(c => ({ ...c, [selectedIssueId]: true }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirmDailyRoutine = () => {
    setBadgeClaimed(true);
    onBadgeUnlocked('iron_structure');
    playSuccessChime();

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00e676', '#ff9800', '#ff5722', '#ffffff'],
      });
    } catch {
      // fallback
    }

    if (onProceedNext) {
      setTimeout(() => {
        onProceedNext();
      }, 1200);
    }
  };

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const jointHealthScore = Math.min(100, 75 + completedCount * 8);

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-4 pb-14">
      {/* Title & Metadata */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">اسکریپت شماره ۴</span>
          <span aria-hidden="true">·</span>
          <span>حرکات اصلاحی و رفع ناهنجاری‌های قامتی</span>
          <span aria-hidden="true">·</span>
          <span>ویژه بزرگسالان</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          ارزیابی بیومکانیکی، حرکات اصلاحی و تراز ستون فقرات
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          رفع ریشه‌ای دردهای مفصلی ناشی از فرم‌های غلط، اصلاح قوز پشتی و گودی کمر پیش از وزنه‌های سنگین
        </p>
      </div>

      {/* بخش اول: ارزیابی و نقشه حرکتی اصلاحی */}
      <section className="bg-gradient-to-br from-[#151824] to-[#0f1118] border border-[#2c354a] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-emerald-400 font-semibold">بخش اول</span>
              <h2 className="text-lg font-bold text-white">ارزیابی و نقشه حرکتی اصلاحی</h2>
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
                <span>شنیدن راهنمای صوتی اصلاحی</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="bg-[#0b0c10]/80 border-r-4 border-emerald-500 p-4 rounded-xl text-neutral-200 text-sm sm:text-base leading-relaxed font-medium mb-6">
          «{guideText}»
        </blockquote>

        {/* NORM / FLAW SELECTOR TABS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          {POSTURE_ISSUES.map((issue) => (
            <button
              key={issue.id}
              onClick={() => setSelectedIssueId(issue.id)}
              className={`p-3.5 rounded-xl text-right transition-all border ${
                selectedIssueId === issue.id
                  ? 'bg-[#1e2538] border-[#ff5722] text-white shadow-lg shadow-[#ff5722]/15'
                  : 'bg-[#141724] border-[#293245] text-neutral-300 hover:bg-[#1a1f30]'
              }`}
            >
              <div className="text-xs font-semibold text-[#ff9800] mb-1">
                {issue.id === 'kyphosis' ? 'قوز پشتی' : issue.id === 'hyperlordosis' ? 'گودی کمر' : 'سر به جلو'}
              </div>
              <div className="text-sm font-bold truncate">{issue.nameFa}</div>
            </button>
          ))}
        </div>

        {/* 3D VECTOR SPINE ALIGNMENT SIMULATION (Visual-First Flawed vs Corrected) */}
        <div className="bg-[#0c0e17] border-2 border-[#262f45] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                شبیه‌ساز بیومکانیک ستون فقرات و تراز اسکلت
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {currentIssue.nameFa}
              </h3>
            </div>

            {/* Comparison Toggle */}
            <div className="flex items-center gap-1.5 bg-[#171c2b] p-1 rounded-xl border border-[#2d3852]">
              <button
                onClick={() => setShowFixedMode(false)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  !showFixedMode
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                نمایش عارضه و انحراف غلط
              </button>
              <button
                onClick={() => setShowFixedMode(true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  showFixedMode
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                نمایش حالت تراز و اصلاح‌شده ✓
              </button>
            </div>
          </div>

          {/* Interactive Vector Spine Visual */}
          <div className="h-44 bg-[#121624] rounded-xl flex items-center justify-center relative border border-[#232a3e] p-4">
            <div className="flex items-center gap-8 text-center">
              {/* Spine Graphic Vector */}
              <div className="relative w-16 h-36 flex flex-col items-center justify-between">
                {/* Head */}
                <div className={`w-8 h-8 rounded-full border-2 transition-all duration-500 ${showFixedMode ? 'bg-emerald-500/30 border-emerald-400' : 'bg-rose-500/30 border-rose-400 translate-x-3'}`} />
                {/* Cervical */}
                <div className="w-1.5 h-6 bg-neutral-500 rounded" />
                {/* Thoracic Curve */}
                <div className={`w-3.5 h-12 rounded-full border-2 transition-all duration-500 ${showFixedMode ? 'bg-emerald-500/40 border-emerald-400' : 'bg-rose-500/40 border-rose-400 -translate-x-3 scale-110'}`} />
                {/* Lumbar */}
                <div className={`w-3 h-8 rounded-full border-2 transition-all duration-500 ${showFixedMode ? 'bg-emerald-500/40 border-emerald-400' : 'bg-rose-500/40 border-rose-400 translate-x-2'}`} />
                {/* Pelvis base */}
                <div className={`w-12 h-5 rounded-lg border-2 transition-all duration-500 ${showFixedMode ? 'bg-emerald-500/20 border-emerald-400' : 'bg-rose-500/20 border-rose-400 rotate-12'}`} />
              </div>

              {/* Status explanation */}
              <div className="text-right max-w-sm space-y-1.5">
                <div className={`text-sm font-bold flex items-center gap-1.5 ${showFixedMode ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {showFixedMode ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{showFixedMode ? 'تراز ایده‌آل مهره‌ها و توزیع فشاری محوری' : 'استرس برشی و لهیدگی دیسک‌ها'}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {showFixedMode ? currentIssue.correctionProtocolFa : currentIssue.biomechProblemFa}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* بخش دوم: تحلیل بیومکانیکی و پروتکل رفع ناهنجاری‌ها */}
      <section className="bg-[#121520] border border-[#232a3d] rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-amber-400 font-semibold">بخش دوم (پروتکل اجرایی)</span>
            <h2 className="text-lg font-bold text-white">تمرین اختصاصی و نکات کلیدی اصلاحی</h2>
          </div>
        </div>

        <div className="bg-[#161a28] border border-[#2a334a] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242c40] pb-3">
            <div>
              <span className="text-xs text-[#ff5722] font-semibold">نام تمرین اصلاحی در اپ:</span>
              <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                {currentIssue.exerciseNameFa}
              </h3>
              <div className="text-xs text-neutral-400 font-mono">{currentIssue.exerciseNameEn}</div>
            </div>

            <div className="text-xs text-neutral-300 font-medium">
              حجم توصیه شده: <span className="text-amber-400 font-bold">{currentIssue.repsText}</span>
            </div>
          </div>

          <div className="bg-[#0e111a] p-4 rounded-xl border border-[#232a3e] space-y-2">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>نکته طلایی بیومکانیک در اجرای حرکت:</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
              «{currentIssue.keyCueFa}»
            </p>
          </div>

          {/* Quick Routine Timer (Big buttons for home/gym) */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-neutral-400">
              مدت زمان ست اصلاحی: <span className="font-athletic text-base font-bold text-white">{currentIssue.durationSec} ثانیه</span>
            </div>

            {timerRunning ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-athletic text-[#ff9800]">
                  {activeTimerSeconds}s
                </span>
                <button
                  onClick={() => setTimerRunning(false)}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  توقف
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleStartTimer(currentIssue.durationSec)}
                className="py-3 px-5 rounded-xl font-bold text-xs text-white bg-[#ff5722] hover:bg-[#ff6d00] active:scale-95 transition-all shadow-md shadow-[#ff5722]/20 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>شروع ست اصلاحی با تایمر صوتی</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* بخش سوم: سلامت مفاصل و پاداش تراز قامتی در PWA */}
      <section className="bg-gradient-to-t from-[#151826] to-[#101320] border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/20">
              بخش چهارم: گیمیفیکیشن تراز قامتی
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              شاخص سلامت مفاصل و نشان «ساختار پولادین»
            </h2>
          </div>

          {badgeClaimed && (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>نشان «ساختار پولادین» ثبت شد!</span>
            </div>
          )}
        </div>

        {/* Joint Health Index Meter */}
        <div className="bg-[#0c0e17] border border-[#242b3e] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-300">
            <span>شاخص هماهنگی اسکلت و سلامت مهره‌ها:</span>
            <span className="font-athletic text-lg font-bold text-emerald-400">{jointHealthScore}٪</span>
          </div>
          <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${jointHealthScore}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-[#ff5722] to-emerald-400 rounded-full transition-all duration-700"
            />
          </div>
          <div className="text-[11px] text-neutral-400 pt-1">
            با تکمیل ستهای اصلاحی روزانه، ریسک آسیب در حرکات چندمفصله تا ۸۵٪ کاهش می‌یابد.
          </div>
        </div>

        {/* Giant Confirm Button */}
        <button
          onClick={handleConfirmDailyRoutine}
          className="w-full py-5 px-6 rounded-2xl font-extrabold text-lg sm:text-xl text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 active:scale-98 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 border-2 border-emerald-300/40"
        >
          <CheckCircle2 className="w-7 h-7" />
          <span>تایید اجرای روتین اصلاحی و دریافت نشان «ساختار پولادین»</span>
          <ArrowLeft className="w-6 h-6 rotate-180" />
        </button>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  RotateCw, 
  ShieldCheck, 
  Compass, 
  Egg, 
  Flame, 
  Droplets, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Award,
  ArrowLeft,
  Activity,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SCRIPT_ONE_INTRO, calculateCleanNutrition } from '../data/nutritionData';
import { speakPersian, stopPersianSpeech } from '../utils/speechVoice';
import { playSuccessChime } from '../utils/soundEffects';

interface ScriptOneFoundationsProps {
  onCompleteAndProceed: () => void;
  isUnlocked: boolean;
}

export const ScriptOneFoundations: React.FC<ScriptOneFoundationsProps> = ({
  onCompleteAndProceed,
  isUnlocked,
}) => {
  // Nutrition calculator state
  const [weightKg, setWeightKg] = useState<number>(75);
  const [goal, setGoal] = useState<'hypertrophy' | 'fat_loss' | 'strength_health'>('hypertrophy');

  // Principle acknowledgment checkmarks
  const [acknowledged, setAcknowledged] = useState<{ [key: string]: boolean }>({
    torque: true,
    neutral_spine: true,
    balance_tripod: true,
  });

  // Audio narration state for mental prep
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Completed badge state
  const [badgeClaimed, setBadgeClaimed] = useState<boolean>(isUnlocked);

  const nutrition = calculateCleanNutrition(weightKg, goal);

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopPersianSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakPersian(SCRIPT_ONE_INTRO.mentalPrepText, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleConfirmPrinciples = () => {
    setBadgeClaimed(true);
    playSuccessChime();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ff5722', '#ff9800', '#ffeb3b', '#ffffff'],
      });
    } catch {
      // fallback if canvas not available
    }

    setTimeout(() => {
      onCompleteAndProceed();
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-4 pb-12">
      {/* Title & Metadata */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">اسکریپت شماره ۱</span>
          <span aria-hidden="true">·</span>
          <span>مخاطب: بزرگسالان</span>
          <span aria-hidden="true">·</span>
          <span>بستر: PWA موبایل (Redmi Note 8 / Acode / Termux)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          مبانی بیومکانیک، اهرم‌های حرکتی و پروتکل تغذیه پایه
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          تنظیم ذهنیت مهندسی پیش از شروع تمرین، مدیریت دقیق درشت‌مغذی‌ها و یادگیری ۳ اصل ضدآسیب مفاصل
        </p>
      </div>

      {/* بخش اول: مقدمه و پایش ذهنی ورزشکار */}
      <section className="bg-gradient-to-br from-[#161924] to-[#0f1118] border border-[#2d364d] rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#ff5722] via-[#ff9800] to-transparent" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5722]/15 border border-[#ff5722]/40 flex items-center justify-center text-[#ff5722]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#ff9800] font-semibold">بخش اول</span>
              <h2 className="text-lg font-bold text-white">مقدمه و پایش ذهنی ورزشکار</h2>
            </div>
          </div>

          {/* Quick Voice Readout button for gym / accessibility */}
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
                <span>توقف خوانش صوتی</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#ff5722]" />
                <span>پخش صوتی راهنما (فرمان صوتی)</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="bg-[#0b0c10]/80 border-r-4 border-[#ff5722] p-4 sm:p-5 rounded-xl text-neutral-200 text-base sm:text-lg leading-relaxed font-medium">
          «{SCRIPT_ONE_INTRO.mentalPrepText}»
        </blockquote>
      </section>

      {/* بخش دوم: پروتکل تغذیه پاک و روتین‌های بازسازی (بخش کلیدی توافق‌شده) */}
      <section className="bg-[#121520] border border-[#232a3d] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Egg className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-amber-400 font-semibold">بخش دوم (کلیدی توافق‌شده)</span>
            <h2 className="text-lg font-bold text-white">پروتکل تغذیه پاک و روتین‌های بازسازی سلولی</h2>
          </div>
        </div>

        {/* Interactive Weight & Goal Inputs (Accessibility: Big Touch Targets) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#171c2b] border border-[#2c344a] rounded-xl p-4">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              وزن کنونی بدن شما: <span className="text-[#ff9800] text-lg font-bold font-athletic px-1">{weightKg}</span> کیلوگرم
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setWeightKg(w => Math.max(45, w - 2))}
                className="w-12 h-12 bg-[#252d42] hover:bg-[#313b56] active:scale-95 rounded-xl text-white font-bold text-xl flex items-center justify-center border border-[#3b4763]"
                aria-label="کاهش وزن"
              >
                -
              </button>
              <input
                type="range"
                min="45"
                max="130"
                step="1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="flex-1 accent-[#ff5722] cursor-pointer h-2 bg-[#252d42] rounded-lg"
              />
              <button
                onClick={() => setWeightKg(w => Math.min(140, w + 2))}
                className="w-12 h-12 bg-[#252d42] hover:bg-[#313b56] active:scale-95 rounded-xl text-white font-bold text-xl flex items-center justify-center border border-[#3b4763]"
                aria-label="افزایش وزن"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-[#171c2b] border border-[#2c344a] rounded-xl p-4">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">هدف بیومکانیکی شما:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setGoal('hypertrophy')}
                className={`py-2.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                  goal === 'hypertrophy'
                    ? 'bg-[#ff5722] text-white shadow-md'
                    : 'bg-[#212739] text-neutral-300 hover:bg-[#2a3249]'
                }`}
              >
                عضله‌سازی پاک
              </button>
              <button
                onClick={() => setGoal('fat_loss')}
                className={`py-2.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                  goal === 'fat_loss'
                    ? 'bg-[#ff5722] text-white shadow-md'
                    : 'bg-[#212739] text-neutral-300 hover:bg-[#2a3249]'
                }`}
              >
                کات و چربی‌سوزی
              </button>
              <button
                onClick={() => setGoal('strength_health')}
                className={`py-2.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                  goal === 'strength_health'
                    ? 'bg-[#ff5722] text-white shadow-md'
                    : 'bg-[#212739] text-neutral-300 hover:bg-[#2a3249]'
                }`}
              >
                قدرت و سلامت مفاصل
              </button>
            </div>
          </div>
        </div>

        {/* Nutritional Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Egg Whites & Protein */}
          <div className="bg-[#161a27] border border-[#2d354a] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>سفیده تخم‌مرغ خالص</span>
                <Egg className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-athletic">
                {nutrition.dailyEggWhites} <span className="text-xs font-sans text-neutral-300 font-normal">عدد در روز</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-400 border-t border-[#262e42] pt-2">
              حذف زرده‌های مازاد: حداکثر <span className="text-amber-400 font-bold">{nutrition.yolksAllowed} زرده</span> روزانه بر اساس نیاز بیوشیمیایی.
            </div>
          </div>

          {/* Clean Carbs: Boiled Potatoes */}
          <div className="bg-[#161a27] border border-[#2d354a] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>سیب‌زمینی آب‌پز (کربوهیدرات پاک)</span>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-black text-white font-athletic">
                {nutrition.boiledPotatoesGrams} <span className="text-xs font-sans text-neutral-300 font-normal">گرم روزانه</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-400 border-t border-[#262e42] pt-2">
              تأمین انرژی پایدار گلیکوژن برای عضلات بالاتنه و پایین‌تنه بدون انباشت بافت چربی.
            </div>
          </div>

          {/* Cellular Hydration */}
          <div className="bg-[#161a27] border border-[#2d354a] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>آبرسانی سلولی</span>
                <Droplets className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white font-athletic">
                {nutrition.dailyWaterLiters} <span className="text-xs font-sans text-neutral-300 font-normal">لیتر آب</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-400 border-t border-[#262e42] pt-2">
              حفظ فشار اسمزی و انتقال بهینه یون‌های کلسیم در فیبرهای عضلانی.
            </div>
          </div>

          {/* Electrolytes */}
          <div className="bg-[#161a27] border border-[#2d354a] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>تعادل الکترولیت‌ها (ضدگرفتگی)</span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-xs text-neutral-200 space-y-1 mt-1">
                <div className="flex justify-between">
                  <span>سدیم:</span>
                  <span className="font-athletic font-bold text-white">{nutrition.sodiumMg} mg</span>
                </div>
                <div className="flex justify-between">
                  <span>پتاسیم:</span>
                  <span className="font-athletic font-bold text-white">{nutrition.potassiumMg} mg</span>
                </div>
                <div className="flex justify-between">
                  <span>منیزیم:</span>
                  <span className="font-athletic font-bold text-white">{nutrition.magnesiumMg} mg</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-emerald-400 border-t border-[#262e42] pt-1.5">
              جلوگیری از گرفتگی عضلات در ست‌های سنگین.
            </div>
          </div>
        </div>
      </section>

      {/* بخش سوم: بیومکانیک و اهرم‌های حرکتی مفصل */}
      <section className="bg-[#121520] border border-[#232a3d] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#ff5722] font-semibold">بخش سوم</span>
            <h2 className="text-lg font-bold text-white">بیومکانیک و اهرم‌های حرکتی مفصل</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCRIPT_ONE_INTRO.principles.map((pr) => {
            const isDone = acknowledged[pr.id];
            return (
              <div
                key={pr.id}
                onClick={() => setAcknowledged(prev => ({ ...prev, [pr.id]: !prev[pr.id] }))}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isDone
                    ? 'bg-[#181e2e] border-[#ff5722]/50 shadow-md'
                    : 'bg-[#141724] border-[#293144] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#ff5722]/20 text-[#ff7043]">
                      {pr.tagFa}
                    </span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isDone ? 'bg-[#ff5722] text-white' : 'border border-neutral-500'}`}>
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{pr.titleFa}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{pr.textFa}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#273044] text-[11px] font-mono text-amber-400/90 text-left dir-ltr">
                  {pr.formula}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* بخش چهارم: ابزار گیمیفیکیشن و ثبت در PWA (دکمه‌های لمسی بزرگ مخصوص موبایل) */}
      <section className="bg-gradient-to-t from-[#161a29] to-[#111420] border-2 border-[#ff5722]/60 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ff5722]/20 text-[#ff5722] border border-[#ff5722]/40 shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              نشان قدرت: «مهندس حرکت» (Movement Engineer)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              با تایید این اصول، نشان مهندس حرکت در پروفایل شما ثبت شده و اسکریپت شماره ۲ (مدل سه‌بعدی و بانک حرکات اصلاحی) آنلاک می‌گردد.
            </p>
          </div>

          {/* Giant Touch Button for Mobile Gym Use */}
          <div className="pt-2">
            <button
              onClick={handleConfirmPrinciples}
              className="w-full py-5 px-6 rounded-2xl font-extrabold text-lg sm:text-xl text-white bg-gradient-to-r from-[#ff5722] to-[#ff9100] hover:from-[#ff6b00] hover:to-[#ffa726] active:scale-[0.98] transition-all shadow-xl shadow-[#ff5722]/20 flex items-center justify-center gap-3 border-2 border-white/20"
            >
              <CheckCircle2 className="w-7 h-7" />
              <span>تایید و درک اصول بیومکانیک (ورود به اسکریپت ۲)</span>
              <ArrowLeft className="w-6 h-6 rotate-180" />
            </button>
          </div>

          <div className="text-[11px] text-neutral-400">
            طراحی بهینه برای نمایشگرهای لمسی بزرگ، دست‌های تعریق‌کرده و PWA موبایل
          </div>
        </div>
      </section>
    </div>
  );
};

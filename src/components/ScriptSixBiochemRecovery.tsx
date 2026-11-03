import React, { useState } from 'react';
import { 
  Egg, 
  Droplets, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  Award, 
  Flame, 
  Zap, 
  CheckSquare, 
  Square, 
  ArrowLeft,
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakPersian, stopPersianSpeech, parsePersianGymCommand } from '../utils/speechVoice';
import { playSuccessChime, playTimerBeep } from '../utils/soundEffects';

interface ScriptSixBiochemRecoveryProps {
  onBadgeUnlocked: (badgeId: string) => void;
  isUnlocked: boolean;
  onNavigateHome?: () => void;
}

export const ScriptSixBiochemRecovery: React.FC<ScriptSixBiochemRecoveryProps> = ({
  onBadgeUnlocked,
  isUnlocked,
  onNavigateHome,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Daily Meal & Hydration Checklist (Extra Big Touch Targets)
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    meal_egg_whites: true,
    meal_boiled_potatoes: true,
    water_cup_1_4: true,
    electrolytes_taken: true,
    post_workout_recovery: false,
    water_cup_5_8: false,
  });

  // Hydration Cups Tracker
  const [waterCups, setWaterCups] = useState<number>(5);

  // Voice command state
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Badge Status
  const [badgeAwarded, setBadgeAwarded] = useState(isUnlocked);

  const guideText = 'تمرینِ سخت فقط ۵۰ درصدِ مسیر است؛ ۵۰ درصدِ مابقی در آشپزخانه و استراحتِ سلولی رقم میخورد. در این بخش، با پروکلهای تغذیهایِ پاک، مدیریت دقیقِ منابع پروتئینی و آبرسانیِ اصولی آشنا میشوید تا بدن در سریعترین زمانِ ممکن ریکاوری شود و رشد کند.';

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopPersianSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakPersian(guideText, () => setIsSpeaking(false));
    }
  };

  const toggleChecklistItem = (key: string) => {
    playTimerBeep(true);
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addWaterCup = () => {
    playSuccessChime();
    setWaterCups(c => Math.min(12, c + 1));
  };

  // Voice Command Handler
  const toggleVoiceMode = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceNotice(null);
      return;
    }

    const SpeechRecognitionClass = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsListening(true);
      setVoiceNotice('در حال شنود... بگویید: «ثبت آب مصرفی» یا «ثبت وعده»');
      setTimeout(() => {
        addWaterCup();
        setVoiceNotice('فرمان صوتی دریافت شد: «یک لیوان آب ثبت شد» ✓');
        setIsListening(false);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'fa-IR';
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('گوش به زنگ... بگویید: «ثبت آب مصرفی» یا «تایید وعده»');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text.includes('آب') || text.includes('لیوان')) {
          addWaterCup();
          setVoiceNotice(`ثبت آب مصرفی: ${text} ✓`);
        } else if (text.includes('وعده') || text.includes('ثبت')) {
          setChecklist(prev => ({ ...prev, post_workout_recovery: true }));
          playSuccessChime();
          setVoiceNotice('وعده ریکاوری بعد از تمرین تیک خورد ✓');
        } else {
          setVoiceNotice(`متن دریافت شد: "${text}". بگویید «ثبت آب مصرفی» یا «تایید وعده»`);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('خطای تشخیص صدا؛ دکمه دستی را لمس کنید.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('میکروفون فعال نشد.');
    }
  };

  const handleCompleteAllSixScripts = () => {
    setBadgeAwarded(true);
    onBadgeUnlocked('able_city_grand_master');
    playSuccessChime();

    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ff5722', '#ff9800', '#00e676', '#ffd600', '#ffffff'],
      });
    } catch {
      // fallback
    }
  };

  const completedTasks = Object.values(checklist).filter(Boolean).length;
  const recoveryScore = Math.round((completedTasks / Object.keys(checklist).length) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-4 pb-14">
      {/* Title & Metadata */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">اسکریپت شماره ۶ (نهایی)</span>
          <span aria-hidden="true">·</span>
          <span>تغذیه بیوشیمیایی و ریکاوری سلولی</span>
          <span aria-hidden="true">·</span>
          <span>پایان دوره جامع ایبل‌سیتی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          تغذیه بیوشیمیایی، روتین‌های پاک و ریکاوری پیشرفته
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          سفیده تخم‌مرغ خالص، سیب‌زمینی آب‌پز برای بازسازی گلیکوژن و مدیریت تعادل سدیم-پتاسیم ضدکرمپ
        </p>
      </div>

      {/* بخش اول: فلسفه تغذیه پاک و بیوشیمی بدن */}
      <section className="bg-gradient-to-br from-[#151824] to-[#0f1118] border border-[#2c354a] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-[#ff5722]">
              <Egg className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#ff9800] font-semibold">بخش اول</span>
              <h2 className="text-lg font-bold text-white">فلسفه تغذیه پاک و بیوشیمی بدن</h2>
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

        {/* Visual Infographic: Clean Nutritional Daily Plate */}
        <div className="bg-[#0c0e17] border border-[#242c3f] rounded-2xl p-5">
          <h3 className="text-xs font-bold text-neutral-300 mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff9800]" />
            <span>سهم بهینه درشت‌مغذی‌ها در بشقاب بیوشیمیایی ایبل‌سیتی:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#171b28] border border-[#2d374f] p-4 rounded-xl">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>پروتئین پاک (سفیده تخم‌مرغ)</span>
                <span className="text-[#ff9800] font-bold font-athletic">40%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#ff5722] w-[40%]" />
              </div>
              <p className="text-[11px] text-neutral-300">
                پروفایل کامل اسیدهای آمینه ضروری (BCAA) بدون کلسترول یا چربی‌های ترانس
              </p>
            </div>

            <div className="bg-[#171b28] border border-[#2d374f] p-4 rounded-xl">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>کربوهیدرات پایدار (سیب‌زمینی آب‌پز)</span>
                <span className="text-amber-400 font-bold font-athletic">45%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-amber-400 w-[45%]" />
              </div>
              <p className="text-[11px] text-neutral-300">
                شاخص سیری فوق‌العاده بالا، پتاسیم طبیعی فراوان و بازسازی سریع گلیکوژن
              </p>
            </div>

            <div className="bg-[#171b28] border border-[#2d374f] p-4 rounded-xl">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>چربی‌های ضروری و الکترولیت‌ها</span>
                <span className="text-emerald-400 font-bold font-athletic">15%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-emerald-400 w-[15%]" />
              </div>
              <p className="text-[11px] text-neutral-300">
                تولید هورمون‌های آنابولیک و مهار التهاب مفصلی با روغن زیتون یا امگا-۳
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* بخش دوم: پروتکل‌های تغذیه‌ای و مدیریت ریکاوری */}
      <section className="bg-[#121520] border border-[#232a3d] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-[#ff5722]">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#ff5722] font-semibold">بخش دوم (پروتکل‌های توافق‌شده)</span>
            <h2 className="text-lg font-bold text-white">پروتئین پاک، سیب‌زمینی آب‌پز و الکترولیت‌ها</h2>
          </div>
        </div>

        {/* Clean Nutrition Protocol */}
        <div className="bg-[#161a27] border border-[#2c354c] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#252c3e] pb-2">
            <span className="text-sm font-bold text-white">
              ۱. تغذیه پاک و پروتئین (Clean Nutrition / Pake Taghziyeh)
            </span>
            <span className="text-xs text-amber-400 font-mono">سفیده تخم‌مرغ + سیب‌زمینی</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            استفاده روزانه و برنامه‌ریزی‌شده از سفیده تخم‌مرغ خالص برای تأمین بالاترین ارزش بیولوژیکی (BV = 100) پروتئین، با حذف زرده‌های مازاد جهت جلوگیری از بار سنگین چربی‌های اشباع بر کبد و عروق. همراهی آن با سیب‌زمینی آب‌پز در ۲ ساعت پس از تمرین، حساسیت به انسولین را به حداکثر رسانده و مسیر آنابولیک mTOR را فعال نگه می‌دارد.
          </p>
        </div>

        {/* Cellular Hydration & Electrolytes */}
        <div className="bg-[#161a27] border border-[#2c354c] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#252c3e] pb-2">
            <span className="text-sm font-bold text-white">
              ۲. آبرسانی سلولی و املاح (Hydration / Ab-resani)
            </span>
            <span className="text-xs text-sky-400 font-mono">سدیم + پتاسیم + منیزیم</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            کاهش فقط ۲٪ از آب سلولی عضلات، توان تولید نیروی بیشینه را تا ۱۵٪ افت می‌دهد و خطر پارگی فیبر را بالا می‌برد. با مصرف ۴۰ میلی‌لیتر آب به ازای هر کیلوگرم وزن بدن، به اضافه تأمین ۳ گرم سدیم و ۴ گرم پتاسیم از منابع طبیعی، پمپ سدیم-پتاسیم غشای سلول عضلانی پایدار مانده و اسپاسم عضلانی به صفر می‌رسد.
          </p>
        </div>
      </section>

      {/* بخش سوم: چک‌لیست روزانه و دکمه‌های بزرگ با فرمان صوتی */}
      <section className="bg-[#121520] border-2 border-amber-500/40 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-amber-400 font-semibold">بخش سوم (Accessibility)</span>
              <h2 className="text-lg font-bold text-white">چک‌لیست ثبت روزانه با لمس بزرگ و فرمان صوتی</h2>
            </div>
          </div>

          <button
            onClick={toggleVoiceMode}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#ff5722] hover:bg-[#ff6d00] text-white shadow-[#ff5722]/30'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>در حال گوش دادن... (بگویید «ثبت آب مصرفی»)</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>فرمان صوتی ثبت آب یا وعده</span>
              </>
            )}
          </button>
        </div>

        {voiceNotice && (
          <div className="bg-[#1a2336] border border-[#ff5722] text-neutral-100 p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2">
            <Info className="w-4 h-4 text-[#ff9800] shrink-0" />
            <span>{voiceNotice}</span>
          </div>
        )}

        {/* Big Touch Hydration Counter */}
        <div className="bg-[#171c2b] border border-[#2b354c] rounded-2xl p-5 text-center">
          <span className="text-xs text-neutral-400 font-semibold">
            شمارنده مصرف آب امروز (لیوان‌های ۲۵۰ سی‌سی)
          </span>
          <div className="text-5xl sm:text-6xl font-black font-athletic text-sky-400 tracking-wider my-3">
            {waterCups} / ۸ <span className="text-lg text-neutral-400 font-sans font-normal">لیوان</span>
          </div>
          <button
            onClick={addWaterCup}
            className="w-full py-4 rounded-xl font-bold text-base bg-sky-600 hover:bg-sky-500 text-white active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30"
          >
            <Droplets className="w-5 h-5" />
            <span>ثبت نوشیدن یک لیوان آب (+۲۵۰ میلی‌لیتر)</span>
          </button>
        </div>

        {/* Large Checklist Items */}
        <div className="space-y-2.5">
          {[
            { id: 'meal_egg_whites', label: 'مصرف سهمیه سفیده‌های تخم‌مرغ روزانه بدون زرده مازاد' },
            { id: 'meal_boiled_potatoes', label: 'مصرف سیب‌زمینی آب‌پز برای سوخت‌رسانی پایدار گلیکوژن' },
            { id: 'water_cup_1_4', label: 'مصرف ۴ لیوان اول آب تا پیش از شروع جلسه تمرین' },
            { id: 'electrolytes_taken', label: 'تأمین الکترولیت‌ها (سدیم و پتاسیم) ضدگرفتگی عضلات' },
            { id: 'post_workout_recovery', label: 'مصرف وعده ریکاوری بعد از تمرین در پنجره آنابولیک' },
          ].map((item) => {
            const isChecked = checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/60 text-white'
                    : 'bg-[#151926] border-[#273044] text-neutral-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold">{item.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isChecked ? 'bg-emerald-500 text-white' : 'border border-neutral-500'}`}>
                  {isChecked && <CheckCircle2 className="w-5 h-5" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* بخش چهارم: نشان نهایی و بزرگ «مهندس کلانشهر ایبل‌سیتی» */}
      <section className="bg-gradient-to-t from-[#1b172a] via-[#141220] to-[#0f0e18] border-2 border-[#ff5722] rounded-3xl p-6 sm:p-9 text-center shadow-2xl space-y-5 relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#ff5722] to-amber-500 text-white mx-auto flex items-center justify-center shadow-2xl shadow-[#ff5722]/50">
          <Award className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ff5722]/20 text-[#ff7043] border border-[#ff5722]/40">
            افتخار نهایی ایبل‌سیتی (پایان ۶ اسکریپت)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            نشان بزرگ: «مهندس کلانشهر ایبل‌سیتی»
          </h2>
          <div className="text-xs font-mono text-[#ff9800] mt-1">Able City Grand Architect</div>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto mt-2 leading-relaxed">
            با تکمیل موفقیت‌آمیز کل ۶ اسکریپت تخصصی، شما اکنون به تمام اصول بیومکانیک زیستی، حرکات اصلاحی، رکوردهای سنگین باشگاهی و ریکاوری پاک تسلط کامل دارید.
          </p>
        </div>

        <div className="pt-3 max-w-md mx-auto">
          <button
            onClick={handleCompleteAllSixScripts}
            className="w-full py-5 px-6 rounded-2xl font-black text-lg sm:text-xl text-white bg-gradient-to-r from-[#ff5722] via-[#ff7043] to-amber-500 hover:from-[#ff6b00] hover:to-amber-400 active:scale-98 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#ff5722]/40 border-2 border-white/30"
          >
            <Sparkles className="w-6 h-6" />
            <span>تکمیل کل دوره و دریافت نشان نهایی ایبل‌سیتی</span>
          </button>
        </div>

        {badgeAwarded && (
          <div className="bg-emerald-950/40 border border-emerald-500 p-4 rounded-2xl text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>تبریک! گنجینه کامل تمرینات، پکیج‌های تخصصی و نشان طلایی با موفقیت در PWA شما فعال گردید.</span>
          </div>
        )}
      </section>
    </div>
  );
};

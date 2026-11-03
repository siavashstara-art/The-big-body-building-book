import React, { useState } from 'react';
import { 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Flame, 
  ArrowLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakPersian, stopPersianSpeech, parsePersianGymCommand } from '../utils/speechVoice';
import { playSuccessChime, playWeightClang, playTimerBeep } from '../utils/soundEffects';

interface ScriptFiveOverloadProps {
  onBadgeUnlocked: (badgeId: string) => void;
  isUnlocked: boolean;
  onProceedNext?: () => void;
}

export const ScriptFiveOverload: React.FC<ScriptFiveOverloadProps> = ({
  onBadgeUnlocked,
  isUnlocked,
  onProceedNext,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTechnique, setActiveTechnique] = useState<'pyramid' | 'rest_pause'>('pyramid');

  // Rest-Pause 10s Timer Simulator
  const [restPauseTimer, setRestPauseTimer] = useState<number>(10);
  const [isRestPauseRunning, setIsRestPauseRunning] = useState<boolean>(false);

  // New Record Logger State (Wide Touch Buttons)
  const [exerciseName, setExerciseName] = useState<string>('پرس سینه بیومکانیک');
  const [currentWeight, setCurrentWeight] = useState<number>(95);
  const [currentReps, setCurrentReps] = useState<number>(6);
  const [prevRecord, setPrevRecord] = useState<number>(90);

  // Voice command state
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Badge Status
  const [badgeAwarded, setBadgeAwarded] = useState(isUnlocked);

  // Overload History
  const [overloadHistory, setOverloadHistory] = useState([
    { week: '۳ هفته قبل', weight: 85, reps: 8, tonnage: 680 },
    { week: '۲ هفته قبل', weight: 90, reps: 6, tonnage: 540 },
    { week: 'هفته گذشته', weight: 92.5, reps: 6, tonnage: 555 },
    { week: 'امروز (رکورد جدید)', weight: 95, reps: 6, tonnage: 570 },
  ]);

  const guideText = 'عضله با جابجاییِ وزنه ثابت رشد نمیکند؛ عضله به "سازگاریِ هوشمندانه" نیاز دارد. در این بخش یاد میگیرید که چطور بدون آسیب به تاندونها، وزنهها، تعداد تکرارها و زمان استراحت را به صورت سیستماتیک افزایش دهید تا بدن همیشه در مسیر رشد بماند.';

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopPersianSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakPersian(guideText, () => setIsSpeaking(false));
    }
  };

  // Start 10-second rest-pause countdown
  const startRestPause = () => {
    setRestPauseTimer(10);
    setIsRestPauseRunning(true);
    playTimerBeep(true);

    const intv = setInterval(() => {
      setRestPauseTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intv);
          setIsRestPauseRunning(false);
          playSuccessChime();
          return 0;
        }
        if (prev <= 4) {
          playTimerBeep(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Voice recognition for "ثبت وزنه جدید"
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
      setVoiceNotice('در حال شنود... بگویید: «ثبت وزنه جدید» یا «وزنه ۱۰۰»');
      setTimeout(() => {
        handleSaveNewRecord();
        setVoiceNotice('فرمان صوتی دریافت شد: «ثبت وزنه جدید ۱۰۰ کیلوگرم» ✓');
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
        setVoiceNotice('گوش به زنگ... بگویید: «ثبت وزنه جدید» یا «وزنه ۱۰۰»');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        const cmd = parsePersianGymCommand(text);

        if (cmd.action === 'LOG_SET' || text.includes('ثبت وزنه جدید') || text.includes('رکورد')) {
          handleSaveNewRecord();
          setVoiceNotice(`رکورد جدید ثبت شد: "${text}" ✓`);
        } else if (cmd.action === 'ADD_WEIGHT') {
          setCurrentWeight(w => w + (cmd.value || 5));
          playTimerBeep(true);
          setVoiceNotice(`افزایش وزنه: +${cmd.value || 5} کیلوگرم ✓`);
        } else if (cmd.action === 'SET_WEIGHT') {
          if (cmd.value) setCurrentWeight(cmd.value);
          playTimerBeep(true);
          setVoiceNotice(`تنظیم وزنه به ${cmd.value} کیلوگرم ✓`);
        } else {
          setVoiceNotice(`عبارت شنیده‌شده: "${text}" (جهت ثبت بگویید «ثبت وزنه جدید»)`);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('خطای تشخیص صدا؛ از دکمه بزرگ استفاده کنید.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('دسترسی به میکروفون میسر نشد.');
    }
  };

  const handleSaveNewRecord = () => {
    playWeightClang();
    playSuccessChime();

    const newRecordItem = {
      week: 'امروز (رکورد جدید)',
      weight: currentWeight,
      reps: currentReps,
      tonnage: currentWeight * currentReps,
    };

    setOverloadHistory(prev => [...prev.slice(0, 3), newRecordItem]);
    setPrevRecord(currentWeight);

    if (!badgeAwarded) {
      setBadgeAwarded(true);
      onBadgeUnlocked('overload_master');
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff9800', '#ff5722', '#ffeb3b', '#ffffff'],
        });
      } catch {
        // fallback
      }
    }
  };

  const improvementKg = Number((currentWeight - 85).toFixed(1));

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-4 pb-14">
      {/* Title & Metadata */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">اسکریپت شماره ۵</span>
          <span aria-hidden="true">·</span>
          <span>سیستم‌های ست‌بندی و بارگذاری تدریجی</span>
          <span aria-hidden="true">·</span>
          <span>رکوردهای پیشرفته</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          فلسفه بارگذاری تدریجی، ست‌های هرمی و تکنیک استراحت-توقف
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          شکستن فلات‌های رشد عضلانی، سازگاری هوشمندانه فیبرهای تندانقباض و ثبت رکوردهای پیشرفته
        </p>
      </div>

      {/* بخش اول: فلسفه بارگذاری تدریجی */}
      <section className="bg-gradient-to-br from-[#151824] to-[#0f1118] border border-[#2c354a] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-[#ff5722]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#ff9800] font-semibold">بخش اول</span>
              <h2 className="text-lg font-bold text-white">فلسفه بارگذاری تدریجی (Progressive Overload)</h2>
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

        {/* Overload Cycle Comparison Chart */}
        <div className="bg-[#0b0d14] border border-[#232a3e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-neutral-300">
              نمودار مقایسه روند رکوردشکنی هفته به هفته:
            </span>
            <span className="text-xs font-bold text-emerald-400">
              +{improvementKg} کیلوگرم ارتقای توان
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 h-44 px-2 pt-6">
            {overloadHistory.map((item, idx) => {
              const hPercent = Math.min(100, Math.max(30, (item.weight / 110) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-bold font-athletic text-[#ff9800]">
                    {item.weight}kg
                  </span>
                  <div
                    style={{ height: `${hPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-700 shadow-lg ${
                      idx === overloadHistory.length - 1
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-emerald-500/30'
                        : 'bg-gradient-to-t from-[#ff5722] to-amber-500 shadow-[#ff5722]/20'
                    }`}
                  />
                  <div className="text-center mt-1">
                    <div className="text-[11px] font-bold text-white truncate max-w-[80px]">
                      {item.week}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {item.reps} تکرار
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* بخش دوم: تکنیک‌های پیشرفته ست‌بندی */}
      <section className="bg-[#121520] border border-[#232a3d] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-[#ff5722]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#ff5722] font-semibold">بخش دوم (تکنیک‌های پیشرفته)</span>
            <h2 className="text-lg font-bold text-white">ست‌های هرمی و تکنیک استراحت-توقف</h2>
          </div>
        </div>

        {/* 1. Pyramid Sets (ست‌های هرمی صعودی) */}
        <div className="bg-[#161a27] border border-[#2c354c] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252c3e] pb-3">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                تکنیک ۱: ستهای هرمی صعودی
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                Pyramid Sets (Set-haye Herami)
              </h3>
            </div>
            <div className="text-xs text-neutral-400">
              خونرسانی اولیه + درگیری فیبرهای تندانقباض
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { set: 'ست ۱', pct: '۶۰٪ ۱RM', reps: '۱۲ تکرار', role: 'گرم‌کردن عصب و عضله' },
              { set: 'ست ۲', pct: '۷۵٪ ۱RM', reps: '۱۰ تکرار', role: 'خونرسانی و آمادگی' },
              { set: 'ست ۳', pct: '۸۵٪ ۱RM', reps: '۸ تکرار', role: 'ست کاری اصلی' },
              { set: 'ست ۴', pct: '۹۰٪ ۱RM', reps: '۶ تکرار', role: 'اوج تحریک تندانقباض' },
            ].map((p, idx) => (
              <div key={idx} className="bg-[#0d0f17] border border-[#23293a] p-3 rounded-xl text-center">
                <span className="text-xs font-bold text-[#ff9800]">{p.set}</span>
                <div className="text-sm font-black text-white font-athletic my-1">{p.reps}</div>
                <div className="text-[11px] text-neutral-300 font-mono">{p.pct}</div>
                <div className="text-[10px] text-neutral-500 mt-1">{p.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Rest-Pause Technique (استراحت-توقف) */}
        <div className="bg-[#161a27] border border-[#2c354c] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252c3e] pb-3">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                تکنیک ۲: استراحت-توقف
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                Rest-Pause Technique (Estrahat-Tavaqof)
              </h3>
            </div>
            <div className="text-xs text-neutral-400">
              شکستن فلات رشد با ۱۰ ثانیه استراحت
            </div>
          </div>

          <div className="bg-[#0d0f17] border border-[#23293a] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white mb-1">
                دستورالعمل اجرایی استراحت-توقف:
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-lg">
                اجرای ست تا رسیدن به ناتوانی موقت عضلانی، ۱۰ ثانیه استراحت کوتاه در همان پوزیشن، و سپس اجرای ۲ الی ۳ تکرار اضافه برای جذب حداکثری فیبرهای عضلانی سرسخت.
              </p>
            </div>

            {/* 10-Second Interactive Rest-Pause Countdown */}
            <div className="flex items-center gap-3 shrink-0">
              {isRestPauseRunning ? (
                <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-600 px-4 py-2.5 rounded-xl">
                  <Clock className="w-4 h-4 text-rose-400 animate-spin" />
                  <span className="text-2xl font-black font-athletic text-white">
                    {restPauseTimer}s
                  </span>
                </div>
              ) : (
                <button
                  onClick={startRestPause}
                  className="py-3 px-5 rounded-xl font-bold text-xs text-white bg-[#ff5722] hover:bg-[#ff6d00] active:scale-95 transition-all shadow-md shadow-[#ff5722]/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>تایمر ۱۰ ثانیه استراحت-توقف</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* بخش سوم: صفحه ثبت رکورد در باشگاه با دکمه‌های پهن و فرمان صوتی */}
      <section className="bg-[#121520] border-2 border-[#ff5722]/50 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-amber-400 font-semibold">بخش سوم (Accessibility)</span>
              <h2 className="text-lg font-bold text-white">صفحه ثبت رکورد جدید با فرمان صوتی</h2>
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
                <span>در حال گوش دادن... (بگویید «ثبت وزنه جدید»)</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>فرمان صوتی «ثبت وزنه جدید»</span>
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

        {/* Large Fields for Weight and Reps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#171c2b] border border-[#2b354c] rounded-2xl p-5 text-center">
            <span className="text-xs text-neutral-400 font-semibold">
              وزنه جدید برای ثبت رکورد (کیلوگرم)
            </span>
            <div className="text-5xl sm:text-6xl font-black font-athletic text-white tracking-wider my-3">
              {currentWeight} <span className="text-lg text-neutral-400 font-sans font-normal">KG</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setCurrentWeight(w => Math.max(10, w - 5))}
                className="py-3.5 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-lg border border-[#3b4763]"
              >
                -۵
              </button>
              <button
                onClick={() => setCurrentWeight(w => Math.max(10, w - 2.5))}
                className="py-3.5 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-sm border border-[#3b4763]"
              >
                -۲.۵
              </button>
              <button
                onClick={() => setCurrentWeight(w => w + 2.5)}
                className="py-3.5 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-sm border border-[#3b4763]"
              >
                +۲.۵
              </button>
              <button
                onClick={() => setCurrentWeight(w => w + 5)}
                className="py-3.5 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-lg border border-[#3b4763]"
              >
                +۵
              </button>
            </div>
          </div>

          <div className="bg-[#171c2b] border border-[#2b354c] rounded-2xl p-5 text-center">
            <span className="text-xs text-neutral-400 font-semibold">
              تعداد تکرارهای موفق
            </span>
            <div className="text-5xl sm:text-6xl font-black font-athletic text-white tracking-wider my-3">
              {currentReps} <span className="text-lg text-neutral-400 font-sans font-normal">تکرار</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentReps(r => Math.max(1, r - 1))}
                className="py-3.5 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-2xl border border-[#3b4763]"
              >
                -
              </button>
              <button
                onClick={() => setCurrentReps(r => r + 1)}
                className="py-3.5 bg-[#242b3d] hover:bg-[#2e374e] active:scale-95 rounded-xl text-white font-black text-2xl border border-[#3b4763]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* GIANT ACTION BUTTON FOR RECORD SAVING */}
        <button
          onClick={handleSaveNewRecord}
          className="w-full py-5 px-6 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-[#ff5722] via-[#ff9800] to-amber-500 hover:from-[#ff6b00] hover:to-amber-400 active:scale-98 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#ff5722]/30 border-2 border-amber-300/40"
        >
          <CheckCircle2 className="w-8 h-8" />
          <span>ثبت وزنه جدید: {currentWeight} کیلوگرم ({currentReps} تکرار)</span>
        </button>
      </section>

      {/* بخش چهارم: نشان استاد بارگذاری */}
      {badgeAwarded && (
        <section className="bg-gradient-to-t from-[#161a29] to-[#111420] border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-3 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            نشان قدرت: «استاد بارگذاری» (Overload Master)
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
            شما با درک ست‌های هرمی، تکنیک استراحت-توقف و ثبت رکورد افزایشی، این نشان افتخار را کسب کردید.
          </p>
        </section>
      )}
    </div>
  );
};

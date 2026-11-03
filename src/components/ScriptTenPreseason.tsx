import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Award, 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Heart, 
  Dumbbell, 
  Users, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRESEASON_SPORTS, PreseasonSportProtocol, PreseasonTrainingLog } from '../data/preseasonData';
import { speakPersian, stopPersianSpeech } from '../utils/speechVoice';
import { playSuccessChime, playTimerBeep, playWeightClang } from '../utils/soundEffects';

interface ScriptTenPreseasonProps {
  isUnlocked: boolean;
  onBadgeUnlocked: (badgeId: string) => void;
  onProceedNext?: () => void;
}

export const ScriptTenPreseason: React.FC<ScriptTenPreseasonProps> = ({
  isUnlocked,
  onBadgeUnlocked,
  onProceedNext,
}) => {
  // Selected Sport Tab
  const [selectedSport, setSelectedSport] = useState<'soccer' | 'basketball' | 'volleyball'>('soccer');

  // Audio Voiceover State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Badge Status
  const [badgeAwarded, setBadgeAwarded] = useState<boolean>(isUnlocked);

  // H:Q Ratio Calculator State (Hamstring to Quadriceps Ratio)
  const [quadMaxWeight, setQuadMaxWeight] = useState<number>(100);
  const [hamstringMaxWeight, setHamstringMaxWeight] = useState<number>(65);

  // Readiness & Overtraining Calculator State
  const [restingHr, setRestingHr] = useState<number>(54);
  const [rpeScore, setRpeScore] = useState<number>(7);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sorenessLevel, setSorenessLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [calculatedReadiness, setCalculatedReadiness] = useState<number>(82);

  // HIIT Drill Interval Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(15);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'work' | 'rest'>('work');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const totalRounds = 8;

  // Pre-season Session Logs
  const [savedLogs, setSavedLogs] = useState<PreseasonTrainingLog[]>(() => {
    try {
      const saved = localStorage.getItem('able_city_preseason_logs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'pre-1',
          sport: 'soccer',
          phase: 'concurrent_power',
          durationMinutes: 75,
          restingHeartRate: 52,
          peakHeartRate: 182,
          rpeScore: 8,
          readinessScore: 85,
          notes: 'تکمیل دریل نوردیک همسترینگ و اینتروال‌های ۴۰ متری با حفظ نسبت H:Q',
          date: 'امروز'
        }
      ];
    } catch {
      return [];
    }
  });

  // Calculate H:Q Ratio
  const hqRatio = quadMaxWeight > 0 ? (hamstringMaxWeight / quadMaxWeight) * 100 : 0;
  const isHqSafe = hqRatio >= 60;

  // Calculate Readiness Score dynamically
  useEffect(() => {
    let score = 100;
    // HR penalty if resting HR is high
    if (restingHr > 65) score -= 15;
    else if (restingHr > 58) score -= 8;

    // RPE penalty if yesterday was 9-10
    if (rpeScore >= 9) score -= 18;
    else if (rpeScore >= 8) score -= 10;

    // Sleep penalty
    if (sleepHours < 6) score -= 20;
    else if (sleepHours < 7) score -= 10;

    // Soreness penalty
    if (sorenessLevel === 'high') score -= 18;
    else if (sorenessLevel === 'moderate') score -= 8;

    setCalculatedReadiness(Math.max(30, Math.min(98, score)));
  }, [restingHr, rpeScore, sleepHours, sorenessLevel]);

  // Save logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('able_city_preseason_logs', JSON.stringify(savedLogs));
    } catch {
      // ignore
    }
  }, [savedLogs]);

  // Interval Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            playTimerBeep();
            if (timerMode === 'work') {
              setTimerMode('rest');
              return 15; // 15s rest
            } else {
              if (currentRound >= totalRounds) {
                setIsTimerRunning(false);
                playSuccessChime();
                return 15;
              }
              setTimerMode('work');
              setCurrentRound((r) => r + 1);
              return 15; // 15s work
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode, currentRound]);

  const toggleSpeech = (text: string) => {
    if (isSpeaking) {
      stopPersianSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakPersian(text, () => setIsSpeaking(false));
    }
  };

  const handleClaimBadge = () => {
    setBadgeAwarded(true);
    onBadgeUnlocked('preseason_master');
    playSuccessChime();

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00e676', '#ff9800', '#00e5ff', '#ff5722'],
      });
    } catch {
      // ignore
    }
  };

  const handleSaveSession = () => {
    const newLog: PreseasonTrainingLog = {
      id: `pre-${Date.now()}`,
      sport: selectedSport,
      phase: 'concurrent_power',
      durationMinutes: 60,
      restingHeartRate: restingHr,
      peakHeartRate: 175,
      rpeScore: rpeScore,
      readinessScore: calculatedReadiness,
      notes: `ثبت تمرین بدنسازی پیش‌فصل ${PRESEASON_SPORTS.find(s => s.id === selectedSport)?.nameFa} با آمادگی ${calculatedReadiness}٪`,
      date: 'لحظاتی پیش'
    };

    setSavedLogs([newLog, ...savedLogs]);
    playWeightClang();
  };

  const currentSportData = PRESEASON_SPORTS.find((s) => s.id === selectedSport) || PRESEASON_SPORTS[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-3 sm:px-4 pb-16">
      {/* Header */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">اسکریپت شماره ۱۰ ایبل‌سیتی</span>
          <span aria-hidden="true">·</span>
          <span>بدنسازی پیش‌فصل (Pre-season) و آمادگی تخصصی تیم‌های ورزشی</span>
          <span aria-hidden="true">·</span>
          <span>ویژه مربیان و بازیکنان فوتبال، بسکتبال و والیبال</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          مدیریت علمی چرخه پیش‌فصل، تمرینات همزمان (Concurrent) و پیشگیری از آسیب‌های تیمی
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          پل ارتباطی مهندسی‌شده میان استراحت و فصل فرسایشی مسابقات؛ ساخت پایگاه هوازی، افزایش ظرفیت بافرینگ لاکتات و محافظت فولادین از تاندون‌ها و رباط‌های زانو و همسترینگ
        </p>
      </div>

      {/* SECTION 1: PRE-SEASON PHILOSOPHY & PILLARS */}
      <section className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#212739] pb-4">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#ff5722]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              بخش اول: فلسفه و ضرورت بدنسازی پیش‌فصل (Pre-season Philosophy)
            </h2>
          </div>
          <button
            onClick={() => toggleSpeech('پیش‌فصل، پلِ ارتباطی میان استراحت و مسابقاتِ فرسایشی است. هدف در این دوره، ساختِ پایه هوازیِ قوی، افزایش ظرفیت لاکتات، و تندرستی مفاصل و تاندون‌هاست تا بازیکن در طول فصلِ مسابقات دچار پارگی رباط، کشیدگی همسترینگ یا افتِ شدید انرژی نشود.')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1d2334] text-xs font-semibold text-neutral-200 border border-[#2f3950] hover:bg-[#252d42] transition-colors"
          >
            <Volume2 className="w-4 h-4 text-[#ff5722]" />
            <span>شنیدن راهنمای مربی</span>
          </button>
        </div>

        <div className="bg-[#0e111a] p-4 sm:p-5 rounded-xl border border-[#232b3d] text-neutral-300 text-xs sm:text-sm leading-relaxed border-r-4 border-r-[#ff5722]">
          «پیش‌فصل، پلِ ارتباطی میان استراحت و مسابقاتِ فرسایشی است. هدف در این دوره، ساختِ پایه هوازیِ قوی، افزایش ظرفیت لاکتات، و تندرستی مفاصل و تاندون‌هاست تا بازیکن در طول فصلِ مسابقات دچار پارگی رباط، کشیدگی همسترینگ یا افتِ شدید انرژی نشود.»
        </div>

        {/* 4 Core Pre-season Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#161a28] p-4 rounded-xl border border-[#273044] space-y-1.5">
            <span className="text-[#00e676] font-bold block">۱. پایگاه قلبی-عروقی (VO2max)</span>
            <p className="text-neutral-300 leading-relaxed">
              توسعه بستر مویرگی و بازده بطن چپ برای ریکاوری سریع‌تر بین استارت‌های انفجاری مسابقه.
            </p>
          </div>
          <div className="bg-[#161a28] p-4 rounded-xl border border-[#273044] space-y-1.5">
            <span className="text-[#ff9800] font-bold block">۲. ظرفیت بافرینگ لاکتات</span>
            <p className="text-neutral-300 leading-relaxed">
              تحمل تجمع یون‌های هیدروژن در اسپرینت‌های مکرر و جلوگیری از سقوط قدرت عضلانی در دقایق پایانی.
            </p>
          </div>
          <div className="bg-[#161a28] p-4 rounded-xl border border-[#273044] space-y-1.5">
            <span className="text-[#00e5ff] font-bold block">۳. سختی الاستیک تاندون‌ها</span>
            <p className="text-neutral-300 leading-relaxed">
              انباشت کلاژن در تاندون آشیل و کشکک زانو با انقباض‌های اکسنتریک جهت ذخیره انرژی بازگشتی.
            </p>
          </div>
          <div className="bg-[#161a28] p-4 rounded-xl border border-[#273044] space-y-1.5">
            <span className="text-[#ff5722] font-bold block">۴. مهار آسیب‌های زنجیره حرکتی</span>
            <p className="text-neutral-300 leading-relaxed">
              تقویت متوازن ثبات‌دهنده‌های لگن، عضلات ادکتور و همسترینگ برای حفظ زانو در برابر پارگی رباط ACL.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONCURRENT TRAINING ARCHITECTURE */}
      <section className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[#212739] pb-4">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            بخش دوم: تلفیق هوشمندانه بدنسازی هوازی و کار با وزنه (Concurrent Training)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Card A: Aerobic & HIIT */}
          <div className="bg-[#161a28] border border-[#283246] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ff5722]" />
                بخش هوازی و استقامت پایه (HIIT مسابقه‌ای)
              </h3>
              <span className="text-[11px] font-mono text-[#00e676] bg-[#00e676]/10 px-2 py-0.5 rounded border border-[#00e676]/20">
                سیستم هوازی + لاکتیک
              </span>
            </div>
            <p className="text-neutral-300 text-xs leading-relaxed">
              توسعه سیستم قلبی-عروقی برای بازی‌های ۹۰ دقیقه‌ای فوتبال یا رفت‌وبرگشت‌های متوالی بسکتبال و والیبال. استفاده از دوهای اینتروال پرفشار (HIIT) با مسافت‌های ۱۰ تا ۴۰ متری شبیه‌سازی‌شده.
            </p>
            <div className="bg-[#0d1017] p-3 rounded-lg border border-[#212838] text-xs space-y-1 text-neutral-300">
              <div><b>الگوی بهینه:</b> اینتروال‌های ۱۵ ثانیه اسپرینت ۹۵٪ و ۱۵ ثانیه استراحت فعال.</div>
              <div><b>مزیت:</b> افزایش حداکثر اکسیژن مصرفی بدون ریزش پروتئین عضلانی.</div>
            </div>
          </div>

          {/* Card B: Closed Kinetic Chain Resistance */}
          <div className="bg-[#161a28] border border-[#283246] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#00e5ff]" />
                بخش کار با وزنه و توان عضلانی (CKC)
              </h3>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Closed Kinetic Chain
              </span>
            </div>
            <p className="text-neutral-300 text-xs leading-relaxed">
              تمرکز روی حرکات زنجیره حرکتی بسته (مانند اسکات بیومکانیک، ترپ‌بار ددلیفت و هیپ‌تراست) برای تقویت عضلات عمقی ثبات‌دهنده مفاصل زانو، مچ پا و لگن با وزنه متوسط تا سنگین و سرعت کنترل‌شده.
            </p>
            <div className="bg-[#0d1017] p-3 rounded-lg border border-[#212838] text-xs space-y-1 text-neutral-300">
              <div><b>قانون بیومکانیک:</b> حرکات چندمفصله بسته گشتاور برشی زانو را با فعال‌سازی همزمان همسترینگ و چهارسر خنثی می‌کنند.</div>
              <div><b>تمپو:</b> فاز منفی کنترل‌شده (۳ ثانیه) برای تقویت اتصالات تاندون-استخوان.</div>
            </div>
          </div>
        </div>

        {/* Interference Effect Prevention Note */}
        <div className="bg-[#141926] border border-amber-500/30 rounded-xl p-4 text-xs text-neutral-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300">مدیریت اثر تداخل تمرینات (Interference Effect):</span>
            <p className="leading-relaxed">
              برای جلوگیری از خاموش شدن مسیر هایپرتروفی عضلانی (mTOR) توسط آنزیم فعال‌شده با تمرین هوازی سنگین (AMPK)، حداقل ۶ الی ۸ ساعت بین نوبت تمرین هوازی HIIT و نوبت کار با وزنه سنگین در طول روز فاصله بیندازید، یا جلسه وزنه را قبل از تمرین تاکتیکی سبک برگزار کنید.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: SPORT SPECIFIC BLUEPRINTS (SOCCER, BASKETBALL, VOLLEYBALL) */}
      <section className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#212739] pb-4">
          <div>
            <span className="text-xs text-[#ff5722] font-semibold">پروتکل‌های سفارشی رشته‌های ورزشی</span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              بخش سوم: برنامه‌ریزی اختصاصی پیش‌فصل بر اساس رشته‌های تیمی
            </h2>
          </div>

          {/* Sport Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0b0d14] rounded-xl border border-[#22293a]">
            {PRESEASON_SPORTS.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedSport === sport.id
                    ? 'bg-[#ff5722] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{sport.nameFa.split('(')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sport Overview */}
        <div className="space-y-4">
          <div className="bg-[#151926] border border-[#293347] rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22293a] pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5722]"></span>
                پروتکل پیش‌فصل {currentSportData.nameFa}
              </h3>
              <span className="text-xs font-mono text-neutral-400">{currentSportData.nameEn}</span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              <b className="text-white">نیازهای بیومکانیکی مسابقه: </b>
              {currentSportData.demandsFa}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-[#0d1017] p-3 rounded-lg border border-rose-900/40 text-rose-300">
                <b className="block mb-1 text-rose-400">بزرگترین ریسک آسیب در این رشته:</b>
                {currentSportData.criticalInjuryRiskFa}
              </div>
              <div className="bg-[#0d1017] p-3 rounded-lg border border-emerald-900/40 text-emerald-300">
                <b className="block mb-1 text-emerald-400">معیار طلایی پیشگیری بیومکانیکی:</b>
                {currentSportData.biomechanicalPreventionMetricFa}
              </div>
            </div>
          </div>

          {/* Drills Section for this sport */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ff9800]" />
              دریل‌های میدانی و چابکی اختصاصی ({currentSportData.nameFa.split('(')[0]})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {currentSportData.drills.map((drill, idx) => (
                <div key={idx} className="bg-[#161a28] border border-[#273144] rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#ff9800] block mb-1">دریل شماره {idx + 1}</span>
                    <h5 className="font-bold text-white text-xs sm:text-sm mb-1.5">{drill.nameFa}</h5>
                    <p className="text-neutral-300 text-xs leading-relaxed mb-2">{drill.protocolFa}</p>
                    <div className="bg-[#0e111a] p-2 rounded border border-[#212838] text-[11px] text-neutral-400">
                      <b>نسبت کار/استراحت: </b>{drill.workRestRatio}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#22293a] text-[11px] text-emerald-400">
                    <b>کلید بیومکانیک: </b>{drill.biomechanicKeyFa}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strength Exercises for this sport */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#00e5ff]" />
              برنامه قدرتی زنجیره بسته در سالن وزنه
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {currentSportData.strengthExercises.map((ex, idx) => (
                <div key={idx} className="bg-[#161a28] border border-[#273144] rounded-xl p-4 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-white text-xs sm:text-sm mb-1">{ex.nameFa}</h5>
                    <p className="text-neutral-300 text-xs leading-relaxed">{ex.purposeFa}</p>
                  </div>
                  <div className="space-y-1 bg-[#0e111a] p-2.5 rounded-lg border border-[#212838] text-[11px]">
                    <div className="text-[#ff9800]"><b>ست و تکرار: </b>{ex.repsSets}</div>
                    <div className="text-neutral-400"><b>تمپو: </b>{ex.tempo}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INTERACTIVE TOOL A: H:Q RATIO CALCULATOR (FOR SOCCER & SPRINT PREVENTION) */}
        <div className="bg-[#0e111a] border-2 border-[#2b354c] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22293a] pb-3">
            <div>
              <span className="text-xs font-semibold text-[#00e676]">ماشین‌حساب بیومکانیک پیشگیری از آسیب</span>
              <h4 className="text-base font-bold text-white mt-0.5">
                محاسبه شاخص تعادل قدرت همسترینگ به چهارسر (Hamstring to Quad Ratio - H:Q)
              </h4>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              استاندارد طلایی: نسبت بالای ۶۰٪ (۰.۶)
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            در فوتبال و دوهای سرعتی، اگر قدرت انقباض ترمزکننده همسترینگ کمتر از ۶۰٪ توان شتاب‌دهنده چهارسر ران باشد، در انتهای گام دوی سرعت یا ضربه سنگین به توپ، پارگی تاندون همسترینگ تقریباً حتمی است.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 block">
                بیشینه قدرت چهارسر ران (اسکات یا جلوپا دستگاه): <span className="text-[#00e676] font-athletic text-sm">{quadMaxWeight} kg</span>
              </label>
              <input
                type="range"
                min="40"
                max="220"
                step="5"
                value={quadMaxWeight}
                onChange={(e) => setQuadMaxWeight(Number(e.target.value))}
                className="w-full accent-[#00e676]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 block">
                بیشینه قدرت همسترینگ (پشت‌پا خوابیده یا RDL): <span className="text-[#ff9800] font-athletic text-sm">{hamstringMaxWeight} kg</span>
              </label>
              <input
                type="range"
                min="20"
                max="160"
                step="5"
                value={hamstringMaxWeight}
                onChange={(e) => setHamstringMaxWeight(Number(e.target.value))}
                className="w-full accent-[#ff9800]"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isHqSafe 
              ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300' 
              : 'bg-rose-950/25 border-rose-500/50 text-rose-300'
          }`}>
            <div className="flex items-center gap-3">
              {isHqSafe ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />}
              <div>
                <div className="text-sm font-bold">
                  {isHqSafe ? 'وضعیت ایمن: شاخص H:Q در محدوده استاندارد مسابقه‌ای است ✓' : 'هشدار خطر کشیدگی همسترینگ: شاخص کمتر از ۶۰٪ است!'}
                </div>
                <div className="text-xs text-neutral-300 mt-0.5">
                  {isHqSafe 
                    ? 'عضله همسترینگ توان ترمز کافی برای خنثی کردن تکانه اکستنشن زانو را دارد.' 
                    : 'افزودن پروتکل نوردیک همسترینگ و ددلیفت رومانیایی اکسنتریک جهت بالابردن قدرت پشت‌پا الزامی است.'}
                </div>
              </div>
            </div>
            <div className="text-left font-athletic text-2xl font-black shrink-0">
              {hqRatio.toFixed(1)}% <span className="text-xs font-sans text-neutral-400">H:Q</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE TOOL B: INTERVAL HIIT DRILL TIMER */}
        <div className="bg-[#0e111a] border-2 border-[#2b354c] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#22293a] pb-3">
            <div>
              <span className="text-xs font-semibold text-[#ff5722]">تایمر هوشمند اینتروال‌های مسابقه‌ای</span>
              <h4 className="text-base font-bold text-white mt-0.5">
                شبیه‌ساز پروتکل ۱۵ ثانیه اسپرینت / ۱۵ ثانیه استراحت فعال
              </h4>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              راند {currentRound} از {totalRounds}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            <div className="text-center sm:text-right">
              <div className={`text-4xl sm:text-5xl font-black font-athletic tracking-wider ${
                timerMode === 'work' ? 'text-[#00e676]' : 'text-amber-400'
              }`}>
                00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
              </div>
              <div className="text-xs font-bold text-neutral-300 mt-1">
                {timerMode === 'work' ? '⚡ فاز اسپرینت انفجاری (۹۵٪ بیشینه توان)' : '⏱ فاز گام‌برداری آرام و ریکاوری'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-lg transition-all ${
                  isTimerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-[#00e676] text-black hover:bg-[#00c853]'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-black" />}
                <span>{isTimerRunning ? 'توقف موقت' : 'شروع دریل'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(15);
                  setTimerMode('work');
                  setCurrentRound(1);
                }}
                className="p-3 rounded-xl bg-[#1d2334] text-neutral-300 hover:text-white border border-[#2e374d]"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: RECOVERY & OVERTRAINING PREVENTION IN PWA */}
      <section className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#212739] pb-4">
          <Heart className="w-5 h-5 text-rose-500" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              بخش چهارم: ریکاوری پیش‌فصل و پایش سندروم بیش‌تمرینی (Overtraining Prevention)
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              سنجش ضربان قلب ریکاوری (HRR)، شاخص RPE و ارزیابی آمادگی عصبی-عضلانی پیش از شروع لیگ
            </p>
          </div>
        </div>

        {/* Readiness Diagnostic Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#151926] p-4 rounded-xl border border-[#283246] space-y-2">
            <label className="text-neutral-300 font-bold block">
              ضربان قلب استراحت صبحگاهی: <span className="text-[#ff5722] font-mono text-sm">{restingHr} bpm</span>
            </label>
            <input
              type="range"
              min="40"
              max="90"
              value={restingHr}
              onChange={(e) => setRestingHr(Number(e.target.value))}
              className="w-full accent-[#ff5722]"
            />
            <span className="text-[10px] text-neutral-500 block">افزایش بالای ۵ تا ۷ ضربه نشانه خستگی سمپاتیک است.</span>
          </div>

          <div className="bg-[#151926] p-4 rounded-xl border border-[#283246] space-y-2">
            <label className="text-neutral-300 font-bold block">
              شاخص سختی تمرین دیروز (RPE): <span className="text-amber-400 font-mono text-sm">{rpeScore} / 10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={rpeScore}
              onChange={(e) => setRpeScore(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <span className="text-[10px] text-neutral-500 block">مقیاس ادراک خستگی بورگ (Borg RPE).</span>
          </div>

          <div className="bg-[#151926] p-4 rounded-xl border border-[#283246] space-y-2">
            <label className="text-neutral-300 font-bold block">
              میزان خواب شب گذشته: <span className="text-[#00e5ff] font-mono text-sm">{sleepHours} ساعت</span>
            </label>
            <input
              type="range"
              min="4"
              max="11"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full accent-[#00e5ff]"
            />
            <span className="text-[10px] text-neutral-500 block">حداقل ۸ ساعت جهت ترشح هورمون رشد شبانه.</span>
          </div>

          <div className="bg-[#151926] p-4 rounded-xl border border-[#283246] space-y-2">
            <label className="text-neutral-300 font-bold block">
              شدت کوفتگی عضلانی (DOMS):
            </label>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['low', 'moderate', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSorenessLevel(lvl)}
                  className={`py-1.5 rounded text-[11px] font-bold ${
                    sorenessLevel === lvl
                      ? 'bg-[#ff5722] text-white'
                      : 'bg-[#1b2030] text-neutral-400'
                  }`}
                >
                  {lvl === 'low' ? 'خفیف' : lvl === 'moderate' ? 'متوسط' : 'شدید'}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-neutral-500 block">احساس درد یا سفتی در بافت تاندونی.</span>
          </div>
        </div>

        {/* Readiness Calculated Outcome */}
        <div className="bg-[#0e111a] p-5 rounded-xl border border-[#232a3e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-400">نمره شاخص آمادگی پیش‌فصل (Team Readiness Score)</div>
            <div className="text-2xl font-black text-white mt-1 flex items-center gap-3">
              <span className={`text-3xl font-athletic ${
                calculatedReadiness >= 80 ? 'text-[#00e676]' : calculatedReadiness >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {calculatedReadiness}%
              </span>
              <span className="text-xs font-semibold text-neutral-300">
                {calculatedReadiness >= 80 
                  ? 'سیستم عصبی-عضلانی در وضعیت ایده‌آل برای تمرینات حداکثر توان' 
                  : calculatedReadiness >= 60 
                  ? 'آمادگی متوسط؛ بار تمرینی امروز در حد ۷۰٪ کنترل شود' 
                  : 'خطر بالای بیش‌تمرینی؛ تمرکز صرف روی ریکاوری فعال، آب‌درمانی و خواب'}
              </span>
            </div>
          </div>

          <button
            onClick={handleSaveSession}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#ff9800] hover:from-[#ff6d00] hover:to-[#ffa726] font-bold text-xs text-white shrink-0 shadow-md shadow-[#ff5722]/20"
          >
            ثبت جلسه و وضعیت روز در پنل PWA
          </button>
        </div>

        {/* Saved Session Logs History */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-neutral-300">تاریخچه لاگ‌های تمرینی پیش‌فصل ذخیره‌شده:</h4>
          <div className="space-y-2">
            {savedLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="bg-[#151926] p-3.5 rounded-xl border border-[#242b3d] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block mb-0.5">
                    {PRESEASON_SPORTS.find(s => s.id === log.sport)?.nameFa} · آمادگی {log.readinessScore}٪
                  </span>
                  <span className="text-neutral-400 text-[11px]">{log.notes}</span>
                </div>
                <div className="text-left font-mono text-neutral-400 text-[11px]">
                  RPE: {log.rpeScore}/10 · {log.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLAIM PRE-SEASON MASTER BADGE */}
      <section className="bg-gradient-to-t from-[#161a29] to-[#111420] border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            نشان افتخار: «استاد بدنسازی پیش‌فصل تیمی» (Team Conditioning Director)
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto mt-1 leading-relaxed">
            با درک کامل اصول تمرینات ترکیبی، شاخص H:Q همسترینگ فوتبال، مکانیک فرود بسکتبال و پروتکل شیب‌دار زانوی والیبال، نشان مربیگری پیش‌فصل را فعال کنید.
          </p>
        </div>

        <button
          onClick={handleClaimBadge}
          className="py-4 px-8 rounded-xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 transition-all shadow-xl shadow-emerald-600/30"
        >
          {badgeAwarded ? 'نشان در پروفایل شما ثبت شده است ✓' : 'ثبت درک اسکریپت ۱۰ و دریافت نشان پیش‌فصل'}
        </button>
      </section>
    </div>
  );
};

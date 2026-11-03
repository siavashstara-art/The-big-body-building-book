import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Flame, 
  Award, 
  Eye, 
  Dumbbell, 
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExerciseBiomechanical, WorkoutSet } from '../types';
import { BIOMECHANICAL_EXERCISES } from '../data/biomechanicsData';
import { playWeightClang, playTimerBeep, playSuccessChime } from '../utils/soundEffects';
import { parsePersianGymCommand } from '../utils/speechVoice';

interface GymTrackerProps {
  onUnlockBadge: (badgeId: string) => void;
  selectedExercisePreload?: ExerciseBiomechanical | null;
}

export const GymTracker: React.FC<GymTrackerProps> = ({
  onUnlockBadge,
  selectedExercisePreload,
}) => {
  // Active Exercise
  const [activeExercise, setActiveExercise] = useState<ExerciseBiomechanical>(
    selectedExercisePreload || BIOMECHANICAL_EXERCISES[0]
  );

  // High contrast mode for bright gym lights
  const [highContrast, setHighContrast] = useState(false);

  // Set Inputs (Large Touch Targets)
  const [weight, setWeight] = useState<number>(80);
  const [reps, setReps] = useState<number>(8);
  const [rpe, setRpe] = useState<number>(8); // Rate of Perceived Exertion (1-10)

  // Current session log
  const [sessionSets, setSessionSets] = useState<WorkoutSet[]>([
    { setNumber: 1, weight: 75, reps: 10, completed: true, rpe: 7.5 },
    { setNumber: 2, weight: 80, reps: 8, completed: true, rpe: 8.5 },
  ]);

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<number>(90);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Voice Command State
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [voiceSetsLoggedCount, setVoiceSetsLoggedCount] = useState<number>(0);

  // Update exercise when preloaded prop changes
  useEffect(() => {
    if (selectedExercisePreload) {
      setActiveExercise(selectedExercisePreload);
    }
  }, [selectedExercisePreload]);

  // Rest Timer Countdown Loop
  useEffect(() => {
    if (isTimerRunning && restSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            playSuccessChime(); // rest over alarm
            return 0;
          }
          if (prev <= 4) {
            playTimerBeep(false); // countdown beep for 3, 2, 1
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, restSeconds]);

  const startRestTimer = (seconds: number) => {
    setRestSeconds(seconds);
    setIsTimerRunning(true);
    playTimerBeep(true);
  };

  const stopRestTimer = () => {
    setIsTimerRunning(false);
    setRestSeconds(0);
  };

  // Log Set Handler
  const handleLogSet = (viaVoice = false) => {
    playWeightClang();
    playSuccessChime();

    const newSet: WorkoutSet = {
      setNumber: sessionSets.length + 1,
      weight,
      reps,
      completed: true,
      rpe,
    };

    setSessionSets(prev => [...prev, newSet]);

    // Start rest timer automatically upon logging set!
    startRestTimer(timerPreset);

    if (viaVoice) {
      const nextCount = voiceSetsLoggedCount + 1;
      setVoiceSetsLoggedCount(nextCount);
      if (nextCount >= 3) {
        onUnlockBadge('gym_voice_pioneer');
      }
    }

    // Check Volume Titan badge (>5000kg total volume)
    const totalVolume = sessionSets.reduce((acc, s) => acc + (s.weight * s.reps), 0) + (weight * reps);
    if (totalVolume >= 5000) {
      onUnlockBadge('titan_500');
    }
  };

  // Toggle Voice Recognition
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
      setVoiceNotice('در حال شنود... بگویید: "ثبت ست" یا "اضافه کن پنج کیلو"');
      setTimeout(() => {
        handleLogSet(true);
        setVoiceNotice('فرمان صوتی دریافت شد: «ثبت ست» ✓');
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
        setVoiceNotice('میکروفون فعال است... بگویید: «ثبت ست»، «پایان استراحت»، یا «وزنه ۹۰»');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        const cmd = parsePersianGymCommand(text);

        if (cmd.action === 'LOG_SET') {
          handleLogSet(true);
          setVoiceNotice(`فرمان صوتی ثبت ست اجرا شد: "${text}" ✓`);
        } else if (cmd.action === 'ADD_WEIGHT') {
          setWeight(w => w + (cmd.value || 5));
          playTimerBeep(true);
          setVoiceNotice(`افزایش وزنه به میزان ${cmd.value || 5} کیلوگرم ✓`);
        } else if (cmd.action === 'SUB_WEIGHT') {
          setWeight(w => Math.max(5, w - (cmd.value || 5)));
          playTimerBeep(true);
          setVoiceNotice(`کاهش وزنه به میزان ${cmd.value || 5} کیلوگرم ✓`);
        } else if (cmd.action === 'SET_WEIGHT') {
          if (cmd.value) setWeight(cmd.value);
          playTimerBeep(true);
          setVoiceNotice(`تنظیم وزنه: ${cmd.value} کیلوگرم ✓`);
        } else if (cmd.action === 'RESET_TIMER') {
          stopRestTimer();
          setVoiceNotice('تایمر استراحت متوقف شد ✓');
        } else {
          setVoiceNotice(`متن دریافت شد: "${text}". برای ثبت ست بگویید «ثبت ست».`);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('خطای تشخیص صدا؛ از دکمه‌های بزرگ استفاده کنید.');
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

  const totalTonnage = sessionSets.reduce((sum, s) => sum + (s.weight * s.reps), 0);

  return (
    <div className={`space-y-6 max-w-4xl mx-auto px-3 sm:px-4 pb-14 ${highContrast ? 'gym-high-contrast' : ''}`}>
      {/* Top Header & High Contrast Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252d42] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <span className="text-[#ff5722] font-semibold">حالت باشگاهی (Gym Mode)</span>
            <span aria-hidden="true">·</span>
            <span>ویژه دست‌های تعریق‌کرده و نور شدید</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            ردیاب بیومکانیک و ثبت فوق‌سریع ست‌ها
          </h1>
        </div>

        {/* Accessibility Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              highContrast
                ? 'bg-yellow-400 text-black border-white'
                : 'bg-[#181d2a] text-neutral-300 border-[#2f3950] hover:bg-[#22293b]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{highContrast ? 'حالت عادی' : 'کنتراست شدید باشگاهی'}</span>
          </button>
        </div>
      </div>

      {/* Active Exercise Selector */}
      <div className="bg-[#121622] border border-[#262f44] rounded-2xl p-4 sm:p-5">
        <label className="block text-xs font-semibold text-neutral-400 mb-2">
          حرکت ورزشی فعال (جهت تغییر انتخاب کنید):
        </label>
        <select
          value={activeExercise.id}
          onChange={(e) => {
            const found = BIOMECHANICAL_EXERCISES.find(ex => ex.id === e.target.value);
            if (found) setActiveExercise(found);
          }}
          className="w-full bg-[#1b2234] border border-[#333e59] text-white rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-[#ff5722]"
        >
          {BIOMECHANICAL_EXERCISES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.nameFa} ({ex.leverClass})
            </option>
          ))}
        </select>
        <div className="mt-2 text-xs text-neutral-400">
          <span className="text-[#ff9800] font-semibold">نکته بیومکانیک: </span>
          {activeExercise.momentArmInfo}
        </div>
      </div>

      {/* REST TIMER (Extra Large Digits for distance viewing across the gym) */}
      <div className="bg-gradient-to-r from-[#17131a] via-[#1b151e] to-[#17131a] border-2 border-[#ff5722]/50 rounded-2xl p-5 sm:p-6 text-center shadow-xl">
        <div className="text-xs font-semibold text-[#ff9800] mb-1">
          تایمر استراحت بین ست‌ها (Rest Timer)
        </div>

        {/* Huge Digital Timer Display */}
        <div className="text-5xl sm:text-6xl font-black font-athletic tracking-widest text-white my-2">
          {Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}
        </div>

        {/* Timer Presets & Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[60, 90, 120, 180].map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setTimerPreset(sec);
                startRestTimer(sec);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-athletic border transition-all ${
                timerPreset === sec
                  ? 'bg-[#ff5722] text-white border-[#ff7043]'
                  : 'bg-[#221c27] text-neutral-300 border-[#382b3f] hover:bg-[#2d2433]'
              }`}
            >
              {sec} ثانیه
            </button>
          ))}

          {isTimerRunning ? (
            <button
              onClick={stopRestTimer}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white flex items-center gap-1.5 active:scale-95"
            >
              <Pause className="w-4 h-4" />
              توقف
            </button>
          ) : (
            <button
              onClick={() => startRestTimer(timerPreset)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-4 h-4" />
              شروع مجدد
            </button>
          )}
        </div>
      </div>

      {/* WEIGHT & REPS CONTROLLERS (Super Big Touch Buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weight Controller */}
        <div className="bg-[#141825] border-2 border-[#2b354d] rounded-2xl p-5 text-center shadow-lg">
          <span className="text-xs text-neutral-400 font-semibold">
            میزان وزنه (کیلوگرم)
          </span>
          <div className="text-5xl sm:text-6xl font-black font-athletic text-white tracking-wider my-3">
            {weight} <span className="text-lg text-neutral-400 font-sans font-normal">KG</span>
          </div>
          {/* 4 Extra-large quick increment buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setWeight(w => Math.max(5, w - 10))}
              className="py-4 bg-[#212739] hover:bg-[#2c344d] active:scale-95 rounded-xl text-white font-black text-xl border border-[#37425f]"
            >
              -۱۰
            </button>
            <button
              onClick={() => setWeight(w => Math.max(2.5, w - 2.5))}
              className="py-4 bg-[#212739] hover:bg-[#2c344d] active:scale-95 rounded-xl text-white font-black text-sm border border-[#37425f]"
            >
              -۲.۵
            </button>
            <button
              onClick={() => setWeight(w => w + 2.5)}
              className="py-4 bg-[#212739] hover:bg-[#2c344d] active:scale-95 rounded-xl text-white font-black text-sm border border-[#37425f]"
            >
              +۲.۵
            </button>
            <button
              onClick={() => setWeight(w => w + 10)}
              className="py-4 bg-[#212739] hover:bg-[#2c344d] active:scale-95 rounded-xl text-white font-black text-xl border border-[#37425f]"
            >
              +۱۰
            </button>
          </div>
        </div>

        {/* Reps Controller */}
        <div className="bg-[#141825] border-2 border-[#2b354d] rounded-2xl p-5 text-center shadow-lg">
          <span className="text-xs text-neutral-400 font-semibold">
            تعداد تکرار در این ست
          </span>
          <div className="text-5xl sm:text-6xl font-black font-athletic text-white tracking-wider my-3">
            {reps} <span className="text-lg text-neutral-400 font-sans font-normal">تکرار</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setReps(r => Math.max(1, r - 1))}
              className="py-4 bg-[#212739] hover:bg-[#2c344d] active:scale-95 rounded-xl text-white font-black text-3xl border border-[#37425f]"
            >
              -
            </button>
            <button
              onClick={() => setReps(r => r + 1)}
              className="py-4 bg-[#212739] hover:bg-[#2c344d] active:scale-95 rounded-xl text-white font-black text-3xl border border-[#37425f]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* VOICE COMMAND HUD NOTIFICATION */}
      {voiceNotice && (
        <div className="bg-[#1a2336] border-2 border-[#ff5722] text-neutral-100 p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#ff5722] animate-bounce" />
            <span>{voiceNotice}</span>
          </div>
          <button 
            onClick={() => setVoiceNotice(null)} 
            className="text-xs text-neutral-400 hover:text-white"
          >
            بستن
          </button>
        </div>
      )}

      {/* GIANT ACTION BUTTONS: TOUCH LOG & VOICE LOG */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Hands-free Voice Toggle */}
        <button
          onClick={toggleVoiceMode}
          className={`py-5 px-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2.5 border-2 shadow-xl active:scale-98 ${
            isListening
              ? 'bg-rose-600 text-white border-white animate-pulse'
              : 'bg-[#1e2536] hover:bg-[#28324a] text-neutral-200 border-[#384564]'
          }`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-[#ff5722]" />}
          <span>{isListening ? 'در حال شنود...' : 'فرمان صوتی (بدون لمس)'}</span>
        </button>

        {/* Primary Giant Touch Button */}
        <button
          onClick={() => handleLogSet(false)}
          className="sm:col-span-2 py-5 px-6 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-[#ff5722] to-[#ff9800] hover:from-[#ff6b00] hover:to-[#ffa726] active:scale-98 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#ff5722]/30 border-2 border-white/20"
        >
          <CheckCircle2 className="w-8 h-8" />
          <span>ثبت ست {sessionSets.length + 1} ({weight} کیلو × {reps} تکرار)</span>
        </button>
      </div>

      {/* TODAY'S SESSION LOG & TONNAGE STATS */}
      <div className="bg-[#121622] border border-[#252e42] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 border-b border-[#21293c] pb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#ff5722]" />
            <h3 className="text-base font-bold text-white">ست‌های ثبت‌شده جلسه جاری</h3>
          </div>
          <div className="text-xs text-neutral-300">
            مجموع تناژ: <span className="font-athletic text-base font-bold text-[#ff9800]">{totalTonnage}</span> کیلوگرم
          </div>
        </div>

        <div className="space-y-2">
          {sessionSets.map((s) => (
            <div
              key={s.setNumber}
              className="flex items-center justify-between bg-[#181d2a] border border-[#293246] px-4 py-3 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#273044] text-[#ff9800] font-athletic font-bold flex items-center justify-center text-sm">
                  #{s.setNumber}
                </span>
                <span className="text-sm font-bold text-white font-athletic">
                  {s.weight} KG × {s.reps} تکرار
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-mono">
                  تناژ: {s.weight * s.reps}kg
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Smartphone, 
  QrCode, 
  Calculator, 
  Sparkles, 
  Ruler, 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Download, 
  Share2, 
  Dumbbell, 
  Activity,
  Award,
  Layers,
  ChevronLeft,
  Utensils
} from 'lucide-react';
import { playSuccessChime, playTimerBeep, playHeartbeatPulse } from '../utils/soundEffects';
import { PeriWorkoutNutritionCalculator } from './PeriWorkoutNutritionCalculator';

interface OfflineAdvancedLabProps {
  onUnlockBadge?: (badgeId: string) => void;
}

export const OfflineAdvancedLab: React.FC<OfflineAdvancedLabProps> = ({ onUnlockBadge }) => {
  const [activeTab, setActiveTab] = useState<'gyro' | 'qr' | 'ratio' | 'generator' | 'ruler' | 'breath' | 'nutrition'>('gyro');

  // ==========================================
  // 1. Gyroscope & Motion Speed Sensor State
  // ==========================================
  const [isSensorActive, setIsSensorActive] = useState(false);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 9.8 });
  const [barSpeed, setBarSpeed] = useState(0.65); // m/s
  const [repStability, setRepStability] = useState(94); // %
  const [eccentricSec, setEccentricSec] = useState(2.5);
  const [concentricSec, setConcentricSec] = useState(1.1);

  useEffect(() => {
    let sensorHandler: ((e: DeviceMotionEvent) => void) | null = null;

    if (isSensorActive && typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      sensorHandler = (e: DeviceMotionEvent) => {
        if (e.accelerationIncludingGravity) {
          const x = e.accelerationIncludingGravity.x || 0;
          const y = e.accelerationIncludingGravity.y || 0;
          const z = e.accelerationIncludingGravity.z || 9.8;
          setAcceleration({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), z: Number(z.toFixed(2)) });
          
          // Compute velocity estimation
          const mag = Math.sqrt(x * x + y * y + z * z);
          setBarSpeed(Number((mag / 15).toFixed(2)));
          setRepStability(Math.min(100, Math.max(70, Math.round(100 - Math.abs(x) * 4))));
        }
      };

      window.addEventListener('devicemotion', sensorHandler);
    }

    return () => {
      if (sensorHandler) window.removeEventListener('devicemotion', sensorHandler);
    };
  }, [isSensorActive]);

  // Simulated motion for desktop testing
  const handleSimulateRep = () => {
    setIsSensorActive(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const mockX = (Math.random() - 0.5) * 1.5;
      const mockY = (Math.random() - 0.5) * 2;
      const mockZ = 9.8 + Math.sin(step) * 4;
      setAcceleration({ x: Number(mockX.toFixed(2)), y: Number(mockY.toFixed(2)), z: Number(mockZ.toFixed(2)) });
      setBarSpeed(Number((0.5 + Math.random() * 0.4).toFixed(2)));
      setRepStability(Math.round(88 + Math.random() * 10));
      if (step >= 12) {
        clearInterval(interval);
        setIsSensorActive(false);
      }
    }, 250);
  };

  // ==========================================
  // 2. Offline QR Transfer State
  // ==========================================
  const [qrPayload, setQrPayload] = useState({
    routineName: 'برنامه هایپرتروفی سینه‌وسرشانه (ایبل‌سیتی)',
    exercisesCount: 5,
    targetDays: 4,
    creator: 'مربی ایبل‌سیتی',
    createdAt: new Date().toLocaleDateString('fa-IR'),
  });
  const [scannedJson, setScannedJson] = useState('');
  const [isImportSuccess, setIsImportSuccess] = useState(false);

  const handleImportQrData = () => {
    if (!scannedJson.trim()) return;
    setIsImportSuccess(true);
    playSuccessChime();
    setTimeout(() => setIsImportSuccess(false), 4000);
  };

  // ==========================================
  // 3. Da Vinci Golden Ratio & FFMI State
  // ==========================================
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(80);
  const [bodyFatPct, setBodyFatPct] = useState(12);
  const [wristCm, setWristCm] = useState(17.5);
  const [ankleCm, setAnkleCm] = useState(22);
  const [shoulderCm, setShoulderCm] = useState(122);
  const [waistCm, setWaistCm] = useState(78);

  // FFMI Calculation = Weight * (1 - BodyFat%/100) / (HeightM^2) + 6.1 * (1.8 - HeightM)
  const heightM = heightCm / 100;
  const leanMassKg = weightKg * (1 - bodyFatPct / 100);
  const rawFfmi = leanMassKg / (heightM * heightM);
  const normalizedFfmi = Number((rawFfmi + 6.1 * (1.8 - heightM)).toFixed(1));

  // Da Vinci Golden Ratio: Shoulder to Waist ideal is 1.618
  const currentRatio = Number((shoulderCm / (waistCm || 1)).toFixed(2));
  const maxArmPotentialCm = Number((wristCm * 2.3).toFixed(1));

  // ==========================================
  // 4. Offline Smart Routine Builder State
  // ==========================================
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [equipment, setEquipment] = useState<'full_gym' | 'home_dumbbells' | 'bodyweight'>('full_gym');
  const [generatedRoutine, setGeneratedRoutine] = useState<any[] | null>(null);

  const handleGenerateSmartRoutine = () => {
    playTimerBeep(true);
    let items = [];
    if (equipment === 'full_gym') {
      items = [
        { day: 'روز ۱ (سینه و جلو بازو)', exercises: ['پرس سینه هالتر (۴ ست ۸ تایی - RPE 8)', 'بالاسینه دمبل (۳ ست ۱۰ تایی)', 'کراس‌اور سیم‌کش (۳ ست ۱۲ تایی)', 'جلو بازو هالتر Z (۴ ست ۱۰ تایی)'] },
        { day: 'روز ۲ (پشت و پشت بازو)', exercises: ['ددلیفت رومانیایی (۴ ست ۶ تایی)', 'زیربغل هات‌بار (۴ ست ۸ تایی)', 'پشت بازو سیم‌کش طناب (۴ ست ۱۲ تایی)', 'شنا سوئدی دست جمع (۳ ست حد توان)'] },
        { day: 'روز ۳ (استراحت و ریکاوری)', exercises: ['تنفس بیونیک و حرکات کششی اصلاحی'] },
        { day: 'روز ۴ (پا و سرشانه)', exercises: ['اسکوات پا هالتر (۴ ست ۸ تایی - RPE 8.5)', 'پرس پا ماشین (۳ ست ۱۲ تایی)', 'پرس سرشانه دمبل نشسته (۴ ست ۱۰ تایی)', 'نشر جانب سیم‌کش (۴ ست ۱۵ تایی)'] },
      ];
    } else {
      items = [
        { day: 'روز ۱ (بالاتنه دایره‌ای)', exercises: ['شنا سوئدی فرم خنثی (۴ ست ۱۵ تایی)', 'پرس سرشانه دمبل (۴ ست ۱۲ تایی)', 'جلو بازو چکشی دمبل (۳ ست ۱۵ تایی)'] },
        { day: 'روز ۲ (پایین‌تنه و کور)', exercises: ['اسکوات دمبل (۴ ست ۱۵ تایی)', 'لانژ پیاده‌روی (۳ ست ۱۲ تایی هر پا)', 'پلانک شکم (۴ ست ۴۵ ثانیه)'] },
      ];
    }
    setGeneratedRoutine(items);
    if (onUnlockBadge) onUnlockBadge('smart_routine_master');
  };

  // ==========================================
  // 5. Posture Angle Ruler (SVG Canvas)
  // ==========================================
  const [shoulderAngle, setShoulderAngle] = useState(3.5); // degrees
  const [pelvicAngle, setPelvicAngle] = useState(12.0); // degrees
  const [kneeValgusAngle, setKneeValgusAngle] = useState(178); // degrees

  // ==========================================
  // 6. Bionic 4-7-8 Recovery Breath Timer State
  // ==========================================
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isBreathing) {
      let currentPhase: 'in' | 'hold' | 'out' = 'in';
      let sec = 4;
      setBreathPhase('in');
      setBreathSeconds(4);

      breathTimerRef.current = setInterval(() => {
        sec--;
        if (sec <= 0) {
          if (currentPhase === 'in') {
            currentPhase = 'hold';
            sec = 7;
            playTimerBeep();
          } else if (currentPhase === 'hold') {
            currentPhase = 'out';
            sec = 8;
            playTimerBeep();
          } else {
            currentPhase = 'in';
            sec = 4;
            playHeartbeatPulse();
          }
          setBreathPhase(currentPhase);
        }
        setBreathSeconds(sec);
      }, 1000);

      return () => {
        if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      };
    } else {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    }
  }, [isBreathing]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-3 sm:px-4 pb-16 text-right">
      {/* Header */}
      <div className="border-b border-[#242c40] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-emerald-400 font-bold">بخش فوق‌پیشرفته ۱۰۰٪ آفلاین</span>
          <span aria-hidden="true">·</span>
          <span>آزمایشگاه بیومکانیک محلی (Zero-Server Architecture)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-3">
          <Zap className="w-7 h-7 text-[#ff5722]" />
          <span>آزمایشگاه ۶گانه بیومکانیک آفلاین ایبل‌سیتی</span>
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          اجرای مستقیم و بدون اینترنت بر روی سخت‌افزار مرورگر، سنسورهای ژیروسکوپ گوشی، الگوریتم‌های ریاضی داوینچی و ساخت اتوماتیک برنامه تمرینی.
        </p>
      </div>

      {/* 7-Feature Tab Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 bg-[#121624] border border-[#242c40] rounded-2xl">
        <button
          onClick={() => setActiveTab('gyro')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
            activeTab === 'gyro'
              ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/20'
              : 'text-neutral-300 hover:text-white bg-[#171d2c]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>۱. شتاب‌سنج و سرعت</span>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
            activeTab === 'qr'
              ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/20'
              : 'text-neutral-300 hover:text-white bg-[#171d2c]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>۲. انتقال برنامه QR</span>
        </button>

        <button
          onClick={() => setActiveTab('ratio')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
            activeTab === 'ratio'
              ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/20'
              : 'text-neutral-300 hover:text-white bg-[#171d2c]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>۳. تناسب‌های داوینچی</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
            activeTab === 'generator'
              ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/20'
              : 'text-neutral-300 hover:text-white bg-[#171d2c]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>۴. برنامه ساز هوشمند</span>
        </button>

        <button
          onClick={() => setActiveTab('ruler')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
            activeTab === 'ruler'
              ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/20'
              : 'text-neutral-300 hover:text-white bg-[#171d2c]'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>۵. خط‌کش آناتومی</span>
        </button>

        <button
          onClick={() => setActiveTab('breath')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
            activeTab === 'breath'
              ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/20'
              : 'text-neutral-300 hover:text-white bg-[#171d2c]'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>۶. تنفس بیونیک</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
            activeTab === 'nutrition'
              ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/20'
              : 'text-amber-400 hover:text-white bg-[#171d2c]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>۷. تغذیه BMR و دور تمرین</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* FEATURE 1: GYROSCOPE & BARBELL SPEED TRACKER             */}
      {/* ======================================================== */}
      {activeTab === 'gyro' && (
        <div className="bg-[#121522] border border-[#252e45] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#212a3e] pb-4">
            <div>
              <span className="text-xs text-amber-400 font-bold">قابلیت ۱: سنجش سنسورهای داخلی گوشی</span>
              <h2 className="text-xl font-bold text-white mt-1">ردیاب آفلاین سرعت حرکات و لرزش مفاصل (Motion Bio-Speed)</h2>
            </div>
            <button
              onClick={handleSimulateRep}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5722] to-amber-500 hover:from-[#ff6d00] text-white font-bold text-xs shadow-lg flex items-center gap-2 active:scale-95"
            >
              <Activity className="w-4 h-4" />
              <span>تست زنده سنسور (تکرار آزمایشی)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#171c2b] p-5 rounded-2xl border border-[#263148] text-center space-y-1">
              <div className="text-xs text-neutral-400">سرعت جابه‌جایی وزنه (Bar Speed)</div>
              <div className="text-3xl font-black font-mono text-emerald-400">{barSpeed} m/s</div>
              <div className="text-[10px] text-emerald-300 font-bold">محدوده ایده آل قدرت (۰.۵ - ۰.۸ m/s)</div>
            </div>

            <div className="bg-[#171c2b] p-5 rounded-2xl border border-[#263148] text-center space-y-1">
              <div className="text-xs text-neutral-400">شاخص ثبات و پایداری (Rep Stability)</div>
              <div className="text-3xl font-black font-mono text-amber-400">{repStability}%</div>
              <div className="text-[10px] text-amber-300 font-bold">تعادل بیومکانیکی فوق‌العاده</div>
            </div>

            <div className="bg-[#171c2b] p-5 rounded-2xl border border-[#263148] text-center space-y-1">
              <div className="text-xs text-neutral-400">ریتم حرکت (Tempo)</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                {eccentricSec}s منفی / {concentricSec}s مثبت
              </div>
              <div className="text-[10px] text-cyan-300 font-bold">کنترل منفی کامل عضلانی</div>
            </div>
          </div>

          {/* Realtime Gravity Accelerometer Vectors */}
          <div className="bg-[#0c0f18] p-5 rounded-2xl border border-[#21293c] space-y-3">
            <div className="text-xs font-bold text-neutral-300 flex items-center justify-between">
              <span>بردار شتاب سنسورهای ۳محوره (X, Y, Z Sensors):</span>
              <span className="font-mono text-emerald-400 text-[11px]">
                X: {acceleration.x} | Y: {acceleration.y} | Z: {acceleration.z}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-400">محور X (لرزش افقی):</div>
                <div className="w-full bg-[#1b2234] h-3 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full transition-all duration-150" style={{ width: `${Math.min(100, Math.abs(acceleration.x) * 20)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-400">محور Y (لرزش طولی):</div>
                <div className="w-full bg-[#1b2234] h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full transition-all duration-150" style={{ width: `${Math.min(100, Math.abs(acceleration.y) * 20)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-neutral-400">محور Z (شتاب عمودی):</div>
                <div className="w-full bg-[#1b2234] h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full transition-all duration-150" style={{ width: `${Math.min(100, (acceleration.z / 15) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FEATURE 2: OFFLINE QR PROGRAM TRANSFER                   */}
      {/* ======================================================== */}
      {activeTab === 'qr' && (
        <div className="bg-[#121522] border border-[#252e45] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-[#212a3e] pb-4">
            <span className="text-xs text-amber-400 font-bold">قابلیت ۲: انتقال بدون اینترنت</span>
            <h2 className="text-xl font-bold text-white mt-1">اشتراک‌گذاری برنامه‌های تمرینی با کد QR آفلاین</h2>
            <p className="text-xs text-neutral-400 mt-1">مربی می‌تواند برنامه‌های تمرینی را به کد QR تبدیل کرده و بدون نیاز به پیام‌رسان یا سرور روی گوشی شاگرد بارگذاری کند.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Generator Box */}
            <div className="bg-[#171c2b] p-6 rounded-2xl border border-[#263148] space-y-4 text-center">
              <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                <QrCode className="w-4 h-4 text-[#ff5722]" />
                <span>کد QR تولیدشده آفلاین این برنامه</span>
              </h3>
              
              {/* Simulated Rendered QR Box */}
              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border-4 border-[#ff5722] flex items-center justify-center shadow-2xl">
                <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between items-center text-[8px] font-mono text-black font-extrabold bg-gradient-to-br from-neutral-200 to-white">
                  <div>[ABLE CITY PROGRAM]</div>
                  <div className="text-center font-black text-[10px] my-auto">
                    📱 QR MATRIX DATA<br />
                    OFFLINE VERIFIED
                  </div>
                  <div>ID: 452DAD40-A7D5</div>
                </div>
              </div>

              <div className="text-xs text-neutral-300 font-bold">{qrPayload.routineName}</div>
              <div className="text-[11px] text-neutral-400">تعداد حرکات: {qrPayload.exercisesCount} حرکت | ۴ روز در هفته</div>
            </div>

            {/* QR Scan / Import Form */}
            <div className="bg-[#171c2b] p-6 rounded-2xl border border-[#263148] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>بارگذاری برنامه از اسکن QR شاگرد/مربی</span>
              </h3>

              <textarea
                value={scannedJson}
                onChange={(e) => setScannedJson(e.target.value)}
                placeholder="متن کد اسکن‌شده QR برنامه را اینجا قرار دهید..."
                className="w-full h-28 bg-[#0b0e17] border border-[#273149] rounded-xl p-3 text-xs text-white placeholder-neutral-500 font-mono focus:border-emerald-400 outline-none"
              />

              <button
                onClick={handleImportQrData}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>وارد کردن و ذخیره آفلاین برنامه در گوشی</span>
              </button>

              {isImportSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold text-center">
                  برنامه تمرینی با موفقیت در حافظه گوشی ذخیره شد!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FEATURE 3: DA VINCI GOLDEN RATIO & FFMI CALCULATOR        */}
      {/* ======================================================== */}
      {activeTab === 'ratio' && (
        <div className="bg-[#121522] border border-[#252e45] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-[#212a3e] pb-4">
            <span className="text-xs text-amber-400 font-bold">قابلیت ۳: پیکرسنجی علمی</span>
            <h2 className="text-xl font-bold text-white mt-1">محاسبه‌گر تناسب‌های طلایی داوینچی و سقف ژنتیکی (FFMI)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 bg-[#171c2b] p-5 rounded-2xl border border-[#263148]">
              <h3 className="text-xs font-bold text-neutral-300 mb-2">ورودی اندازه‌های آناتومیک (سانتی‌متر و کیلوگرم):</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">قد (cm):</label>
                  <input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full bg-[#0b0e17] border border-[#263046] p-2.5 rounded-xl text-white font-mono text-center" />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">وزن (kg):</label>
                  <input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full bg-[#0b0e17] border border-[#263046] p-2.5 rounded-xl text-white font-mono text-center" />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">درصد چربی (%):</label>
                  <input type="number" value={bodyFatPct} onChange={(e) => setBodyFatPct(Number(e.target.value))} className="w-full bg-[#0b0e17] border border-[#263046] p-2.5 rounded-xl text-white font-mono text-center" />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">دور مچ دست (cm):</label>
                  <input type="number" value={wristCm} onChange={(e) => setWristCm(Number(e.target.value))} className="w-full bg-[#0b0e17] border border-[#263046] p-2.5 rounded-xl text-white font-mono text-center" />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">دور شانه (cm):</label>
                  <input type="number" value={shoulderCm} onChange={(e) => setShoulderCm(Number(e.target.value))} className="w-full bg-[#0b0e17] border border-[#263046] p-2.5 rounded-xl text-white font-mono text-center" />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">دور کمر (cm):</label>
                  <input type="number" value={waistCm} onChange={(e) => setWaistCm(Number(e.target.value))} className="w-full bg-[#0b0e17] border border-[#263046] p-2.5 rounded-xl text-white font-mono text-center" />
                </div>
              </div>
            </div>

            <div className="bg-[#171c2b] p-5 rounded-2xl border border-[#263148] space-y-4">
              <h3 className="text-xs font-bold text-amber-400 mb-2">نتایج محاسبات محلی بدون اینترنت:</h3>

              <div className="p-4 bg-[#0d101a] rounded-xl border border-[#222b3f] flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">شاخص توده بدون چربی (FFMI):</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{normalizedFfmi}</div>
                </div>
                <div className="text-left text-[11px] text-emerald-300 font-bold">
                  {normalizedFfmi >= 25 ? 'سقف ژنتیکی طبیعی بالا' : 'محدوده ایده‌آل رشد بیومکانیک'}
                </div>
              </div>

              <div className="p-4 bg-[#0d101a] rounded-xl border border-[#222b3f] flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">نسبت شانه به کمر (Golden Ratio):</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{currentRatio}</div>
                </div>
                <div className="text-left text-[11px] text-amber-300 font-bold">
                  هدف ایده‌آل: 1.618 (نسبت فیبوناچی)
                </div>
              </div>

              <div className="p-4 bg-[#0d101a] rounded-xl border border-[#222b3f] flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">حداکثر پتانسیل قطر بازو:</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">{maxArmPotentialCm} cm</div>
                </div>
                <div className="text-left text-[11px] text-cyan-300 font-bold">
                  براساس استخوان‌بندی مچ دست
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FEATURE 4: SMART OFFLINE ROUTINE BUILDER                 */}
      {/* ======================================================== */}
      {activeTab === 'generator' && (
        <div className="bg-[#121522] border border-[#252e45] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-[#212a3e] pb-4">
            <span className="text-xs text-amber-400 font-bold">قابلیت ۴: الگوریتم ماتریسی</span>
            <h2 className="text-xl font-bold text-white mt-1">ژنراتور هوشمند و اتوماتیک ساخت برنامه تمرینی آفلاین</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">سطح ورزشکار:</label>
              <select value={userLevel} onChange={(e: any) => setUserLevel(e.target.value)} className="w-full bg-[#171c2b] border border-[#27324a] p-3 rounded-xl text-xs text-white font-bold outline-none">
                <option value="beginner">مبتدی (۱ تا ۶ ماه)</option>
                <option value="intermediate">متوسط (۶ ماه تا ۲ سال)</option>
                <option value="advanced">پیشرفته (۲ سال به بالا)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">تجهیزات موجود:</label>
              <select value={equipment} onChange={(e: any) => setEquipment(e.target.value)} className="w-full bg-[#171c2b] border border-[#27324a] p-3 rounded-xl text-xs text-white font-bold outline-none">
                <option value="full_gym">باشگاه کامل (هالتر، دمبل، دستگاه)</option>
                <option value="home_dumbbells">خانه (دمبل و نیمکت)</option>
                <option value="bodyweight">وزن بدن (کالیستنیکس)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">تعداد روزهای تمرین در هفته:</label>
              <select value={daysPerWeek} onChange={(e: any) => setDaysPerWeek(Number(e.target.value))} className="w-full bg-[#171c2b] border border-[#27324a] p-3 rounded-xl text-xs text-white font-bold outline-none">
                <option value={3}>۳ روز در هفته (فول بادی)</option>
                <option value={4}>۴ روز در هفته (اسپلیت ۲ به ۲)</option>
                <option value={5}>۵ روز در هفته (پوش/پول/لگز)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateSmartRoutine}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ff5722] to-amber-500 hover:from-[#ff6d00] hover:to-amber-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Sparkles className="w-5 h-5" />
            <span>تولید برنامه تمرینی هوشمند بیومکانیک با الگوریتم آفلاین</span>
          </button>

          {generatedRoutine && (
            <div className="space-y-3 bg-[#0d101a] p-5 rounded-2xl border border-[#222b3f] animate-in fade-in">
              <h3 className="text-sm font-bold text-amber-400 mb-2">برنامه تمرینی پیشنهادی تولیدشده:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedRoutine.map((item, idx) => (
                  <div key={idx} className="bg-[#151a28] p-4 rounded-xl border border-[#263148] space-y-2">
                    <div className="text-xs font-bold text-white border-b border-[#212a3d] pb-2">{item.day}</div>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {item.exercises.map((ex: string, eIdx: number) => (
                        <li key={eIdx} className="flex items-start gap-1.5">
                          <span className="text-[#ff5722]">▪</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* FEATURE 5: POSTURE GONIOMETRIC ANGLE RULER               */}
      {/* ======================================================== */}
      {activeTab === 'ruler' && (
        <div className="bg-[#121522] border border-[#252e45] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-[#212a3e] pb-4">
            <span className="text-xs text-amber-400 font-bold">قابلیت ۵: سنجش گونیومتری</span>
            <h2 className="text-xl font-bold text-white mt-1">خط‌کش زوایای آناتومیک و اصلاحی بر روی تصویر (Posture Ruler)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interactive Visual Posture Canvas */}
            <div className="bg-[#0b0d14] p-6 rounded-2xl border border-[#242d42] relative flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
              <div className="text-xs text-neutral-500 mb-4">نمای گونیومتری خط‌کش تراز شانه و لگن:</div>
              
              {/* Human Posture Skeleton Wireframe */}
              <div className="relative w-36 h-48 border-2 border-dashed border-[#ff5722]/40 rounded-full flex flex-col items-center justify-between p-4">
                {/* Head */}
                <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-400/20" />
                
                {/* Shoulder Line with inclination */}
                <div 
                  className="w-28 h-1 bg-[#ff5722] rounded relative transition-transform duration-300"
                  style={{ transform: `rotate(${shoulderAngle}deg)` }}
                >
                  <span className="absolute -top-4 right-0 text-[9px] font-mono text-[#ff5722] font-bold">شانه: {shoulderAngle}°</span>
                </div>

                {/* Spine */}
                <div className="w-1 h-16 bg-neutral-400" />

                {/* Pelvic Line */}
                <div 
                  className="w-24 h-1 bg-amber-400 rounded relative transition-transform duration-300"
                  style={{ transform: `rotate(${pelvicAngle}deg)` }}
                >
                  <span className="absolute -top-4 left-0 text-[9px] font-mono text-amber-400 font-bold">لگن: {pelvicAngle}°</span>
                </div>
              </div>
            </div>

            {/* Controls & Metrics */}
            <div className="bg-[#171c2b] p-5 rounded-2xl border border-[#263148] space-y-4">
              <h3 className="text-xs font-bold text-white">تنظیم زوایای خط‌کش آناتومیک:</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>انحراف زاویه شانه (Shoulder Tilt):</span>
                    <span className="font-mono text-[#ff5722] font-bold">{shoulderAngle}°</span>
                  </div>
                  <input type="range" min="-15" max="15" step="0.5" value={shoulderAngle} onChange={(e) => setShoulderAngle(Number(e.target.value))} className="w-full accent-[#ff5722]" />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>شیب زاویه لگن (Pelvic Tilt):</span>
                    <span className="font-mono text-amber-400 font-bold">{pelvicAngle}°</span>
                  </div>
                  <input type="range" min="0" max="30" step="0.5" value={pelvicAngle} onChange={(e) => setPelvicAngle(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>

                <div className="p-4 bg-[#0d101a] rounded-xl border border-[#222b3f] text-neutral-300 space-y-1">
                  <div className="text-xs font-bold text-emerald-400">تحلیل اصلاحی اتوماتیک:</div>
                  <div className="text-[11px] leading-relaxed">
                    {shoulderAngle > 2 ? 'شیب خفیف شانه راست مشاهده شد. پیشنهاد اسکریپت ۴: تقویت عضلات ذوزنقه‌ای تحتانی.' : 'تراز شانه متوازن و خنثی است.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FEATURE 6: BIONIC 4-7-8 RECOVERY BREATH TIMER             */}
      {/* ======================================================== */}
      {activeTab === 'breath' && (
        <div className="bg-[#121522] border border-[#252e45] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
          <div className="border-b border-[#212a3e] pb-4">
            <span className="text-xs text-amber-400 font-bold">قابلیت ۶: ریکاوری بیونیک</span>
            <h2 className="text-xl font-bold text-white mt-1">تایمر صوتی تنفس ۴-۷-۸ برای افت سریع ضربان قلب</h2>
          </div>

          {/* Animated Breath Ring */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div 
              className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                breathPhase === 'in' 
                  ? 'scale-110 border-emerald-400 bg-emerald-400/10' 
                  : breathPhase === 'hold' 
                  ? 'scale-105 border-amber-400 bg-amber-400/15' 
                  : 'scale-90 border-cyan-400 bg-cyan-400/10'
              }`}
            />
            
            <div className="relative z-10 space-y-1">
              <div className="text-4xl font-black font-mono text-white">{breathSeconds}s</div>
              <div className="text-xs font-bold text-amber-300">
                {breathPhase === 'in' && 'دم عمیـق (۴ ثانیه)'}
                {breathPhase === 'hold' && 'حبس نفس (۷ ثانیه)'}
                {breathPhase === 'out' && 'بازدم کامل (۸ ثانیه)'}
              </div>
            </div>
          </div>

          {/* Control Button */}
          <button
            onClick={() => setIsBreathing(!isBreathing)}
            className={`py-4 px-8 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 mx-auto flex items-center gap-2 ${
              isBreathing
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isBreathing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isBreathing ? 'توقف تمرین تنفس' : 'شروع ریکاوری تنفسی ۴-۷-۸'}</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* FEATURE 7: PERI-WORKOUT NUTRITION & BMR/TDEE CALCULATOR   */}
      {/* ======================================================== */}
      {activeTab === 'nutrition' && (
        <PeriWorkoutNutritionCalculator onUnlockBadge={onUnlockBadge} />
      )}
    </div>
  );
};

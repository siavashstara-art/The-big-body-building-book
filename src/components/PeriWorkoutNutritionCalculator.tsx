import React, { useState } from 'react';
import { 
  Utensils, 
  Flame, 
  Clock, 
  Apple, 
  Zap, 
  Scale, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  PieChart,
  Activity
} from 'lucide-react';
import { playSuccessChime, playTimerBeep } from '../utils/soundEffects';

interface PeriWorkoutNutritionCalculatorProps {
  onUnlockBadge?: (badgeId: string) => void;
}

export const PeriWorkoutNutritionCalculator: React.FC<PeriWorkoutNutritionCalculatorProps> = ({
  onUnlockBadge,
}) => {
  // Inputs for BMR & TDEE
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [weightKg, setWeightKg] = useState<number>(78);
  const [heightCm, setHeightCm] = useState<number>(176);
  const [activityLevel, setActivityLevel] = useState<number>(1.55); // Moderate 3-5 days
  const [fitnessGoal, setFitnessGoal] = useState<'deficit' | 'maintenance' | 'surplus'>('surplus');
  const [workoutDurationMins, setWorkoutDurationMins] = useState<number>(75);

  // Mifflin-St Jeor Formula
  // Male: BMR = (10 * weight) + (6.25 * height) - (5 * age) + 5
  // Female: BMR = (10 * weight) + (6.25 * height) - (5 * age) - 161
  const rawBmr = gender === 'male'
    ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
    : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  
  const bmr = Math.round(rawBmr);
  const rawTdee = bmr * activityLevel;
  
  // Caloric Target based on goal
  let caloricTarget = Math.round(rawTdee);
  if (fitnessGoal === 'deficit') {
    caloricTarget = Math.round(rawTdee * 0.82); // 18% Deficit
  } else if (fitnessGoal === 'surplus') {
    caloricTarget = Math.round(rawTdee * 1.12); // 12% Surplus
  }

  // Macronutrients Breakdown
  // Protein: 2.0g per kg
  const proteinGrams = Math.round(weightKg * 2.0);
  const proteinCalories = proteinGrams * 4;

  // Fat: 0.9g per kg
  const fatGrams = Math.round(weightKg * 0.9);
  const fatCalories = fatGrams * 9;

  // Carbs: Remaining calories / 4
  const remainingCarbCalories = Math.max(0, caloricTarget - (proteinCalories + fatCalories));
  const carbGrams = Math.round(remainingCarbCalories / 4);

  // Peri-Workout Nutrition Timing Calculations (Based on body weight and workout duration)
  // Pre-Workout (1.5h before)
  const preCarbsGrams = Math.round(weightKg * 0.6); // 0.6g/kg low GI
  const preProteinGrams = Math.round(weightKg * 0.3); // 0.3g/kg

  // Intra-Workout (During workout > 45m)
  const intraCarbsGrams = workoutDurationMins >= 45 ? 25 : 0; // Fast liquid carbs
  const intraElectrolytesMg = 500; // Sodium/Potassium

  // Post-Workout Anabolic Window (Within 45m after)
  const postCarbsGrams = Math.round(weightKg * 0.85); // 0.85g/kg High GI
  const postProteinGrams = Math.round(weightKg * 0.4); // 0.4g/kg Fast Whey/Egg

  const handleCalculateAndNotify = () => {
    playSuccessChime();
    if (onUnlockBadge) {
      onUnlockBadge('nutrition_master');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-3 sm:px-4 pb-16 text-right">
      {/* Header */}
      <div className="border-b border-[#242c40] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-amber-400 font-bold">ماژول تغذیه و زمان‌بندی۱۰۰٪ آفلاین</span>
          <span aria-hidden="true">·</span>
          <span>فرمول میفلین-سنت ژور (Mifflin-St Jeor & Peri-Workout Chrononutrition)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-3">
          <Utensils className="w-7 h-7 text-amber-400" />
          <span>محاسبه‌گر متابولیسم BMR/TDEE و تغذیه دور تمرین</span>
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          محاسبه آفلاین کالری پایه، درشت‌مغذی‌ها و زمان‌بندی کربوهیدرات/پروتئین در پنجره‌های آنابولیک قبل، حین و بعد از تمرین بدون نیاز به اینترنت.
        </p>
      </div>

      {/* Input Form & Metabolic Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-1 bg-[#121522] border border-[#252e45] p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white border-b border-[#212a3e] pb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#ff5722]" />
            <span>اطلاعات فردی و فعالیت بدنی</span>
          </h2>

          <div className="space-y-3 text-xs">
            {/* Gender Toggle */}
            <div>
              <label className="text-neutral-300 block mb-1 font-bold">جنسیت:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    gender === 'male' ? 'bg-[#ff5722] text-white shadow-md' : 'bg-[#181e2e] text-neutral-400'
                  }`}
                >
                  آقا
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    gender === 'female' ? 'bg-[#ff5722] text-white shadow-md' : 'bg-[#181e2e] text-neutral-400'
                  }`}
                >
                  خانم
                </button>
              </div>
            </div>

            {/* Age, Weight, Height Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-neutral-300 block mb-1">سن (سال):</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#0c0f18] border border-[#263148] p-2.5 rounded-xl text-white font-mono text-center outline-none focus:border-[#ff5722]"
                />
              </div>
              <div>
                <label className="text-neutral-300 block mb-1">وزن (kg):</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-[#0c0f18] border border-[#263148] p-2.5 rounded-xl text-white font-mono text-center outline-none focus:border-[#ff5722]"
                />
              </div>
              <div>
                <label className="text-neutral-300 block mb-1">قد (cm):</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-[#0c0f18] border border-[#263148] p-2.5 rounded-xl text-white font-mono text-center outline-none focus:border-[#ff5722]"
                />
              </div>
            </div>

            {/* Activity Level Dropdown */}
            <div>
              <label className="text-neutral-300 block mb-1 font-bold">سطح فعالیت روزانه (PAL):</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full bg-[#0c0f18] border border-[#263148] p-3 rounded-xl text-white font-bold outline-none"
              >
                <option value={1.2}>کم‌تحرک / پشت میز نشین (1.2)</option>
                <option value={1.375}>فعالیت سبک (۱ تا ۳ روز تمرین - 1.375)</option>
                <option value={1.55}>فعالیت متوسط (۳ تا ۵ روز تمرین سنگین - 1.55)</option>
                <option value={1.725}>فعالیت شدید (۶ تا ۷ روز تمرین - 1.725)</option>
                <option value={1.9}>ورزشکار حرفه‌ای / ۲ نوبت تمرین (1.9)</option>
              </select>
            </div>

            {/* Target Goal Toggle */}
            <div>
              <label className="text-neutral-300 block mb-1 font-bold">هدف تمرینی شما:</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFitnessGoal('deficit')}
                  className={`py-2 px-1 rounded-xl font-bold text-[11px] transition-all ${
                    fitnessGoal === 'deficit' ? 'bg-rose-600 text-white shadow-md' : 'bg-[#181e2e] text-neutral-400'
                  }`}
                >
                  چربی‌سوزی
                </button>
                <button
                  type="button"
                  onClick={() => setFitnessGoal('maintenance')}
                  className={`py-2 px-1 rounded-xl font-bold text-[11px] transition-all ${
                    fitnessGoal === 'maintenance' ? 'bg-amber-500 text-black shadow-md' : 'bg-[#181e2e] text-neutral-400'
                  }`}
                >
                  تثبیت
                </button>
                <button
                  type="button"
                  onClick={() => setFitnessGoal('surplus')}
                  className={`py-2 px-1 rounded-xl font-bold text-[11px] transition-all ${
                    fitnessGoal === 'surplus' ? 'bg-emerald-600 text-white shadow-md' : 'bg-[#181e2e] text-neutral-400'
                  }`}
                >
                  عضله‌سازی
                </button>
              </div>
            </div>

            {/* Workout Duration */}
            <div>
              <label className="text-neutral-300 block mb-1">مدت زمان جلسه تمرین (دقیقه):</label>
              <input
                type="number"
                value={workoutDurationMins}
                onChange={(e) => setWorkoutDurationMins(Number(e.target.value))}
                className="w-full bg-[#0c0f18] border border-[#263148] p-2.5 rounded-xl text-white font-mono text-center outline-none focus:border-[#ff5722]"
              />
            </div>

            <button
              onClick={handleCalculateAndNotify}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#ff5722] hover:from-amber-600 font-black text-white text-xs shadow-lg flex items-center justify-center gap-2 mt-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>محاسبه مجدد برنامه‌ریزی تغذیه</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Metabolic Results & Macronutrients Split */}
        <div className="lg:col-span-2 space-y-6">
          {/* BMR, TDEE, Caloric Target Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121522] border border-[#252e45] p-5 rounded-3xl text-center space-y-1">
              <div className="text-xs text-neutral-400">نرخ متابولیسم پایه (BMR)</div>
              <div className="text-2xl font-black font-mono text-amber-400">{bmr} kcal</div>
              <div className="text-[10px] text-neutral-400">انرژی مصرفی بدن در استراحت مطلق</div>
            </div>

            <div className="bg-[#121522] border border-[#252e45] p-5 rounded-3xl text-center space-y-1">
              <div className="text-xs text-neutral-400">مجموع کالری سوزانده‌شده (TDEE)</div>
              <div className="text-2xl font-black font-mono text-cyan-400">{Math.round(rawTdee)} kcal</div>
              <div className="text-[10px] text-neutral-400">با احتساب ضریب ضریب فعالیت روزانه</div>
            </div>

            <div className="bg-[#121522] border-2 border-[#ff5722] p-5 rounded-3xl text-center space-y-1 bg-gradient-to-b from-[#ff5722]/10 to-transparent">
              <div className="text-xs text-amber-300 font-bold">کالری هدف روزانه (Target)</div>
              <div className="text-3xl font-black font-mono text-white">{caloricTarget} kcal</div>
              <div className="text-[10px] text-emerald-300 font-bold">
                {fitnessGoal === 'surplus' ? 'مازاد ۱۲٪ برای هایپرتروفی عضلانی' : fitnessGoal === 'deficit' ? 'کاهش ۱۸٪ برای چربی‌سوزی خالص' : 'تثبیت وزن دقیق'}
              </div>
            </div>
          </div>

          {/* Daily Macronutrient Distribution */}
          <div className="bg-[#121522] border border-[#252e45] p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-[#212a3e] pb-3">
              <span className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>تفکیک درشت‌مغذی‌های روزانه (Macronutrient Split)</span>
              </span>
              <span className="text-xs text-neutral-400 font-mono">جمع کل: {caloricTarget} kcal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#171d2c] p-4 rounded-2xl border border-[#263148] space-y-1 text-center">
                <div className="text-xs text-rose-400 font-bold">پروتئین (Protein)</div>
                <div className="text-2xl font-black font-mono text-white">{proteinGrams} g</div>
                <div className="text-[10px] text-neutral-400">۲.۰ گرم به ازای هر کیلو وزن ({proteinCalories} kcal)</div>
              </div>

              <div className="bg-[#171d2c] p-4 rounded-2xl border border-[#263148] space-y-1 text-center">
                <div className="text-xs text-amber-400 font-bold">کربوهیدرات (Carbs)</div>
                <div className="text-2xl font-black font-mono text-white">{carbGrams} g</div>
                <div className="text-[10px] text-neutral-400">تأمین انرژی ست‌های سنگین ({remainingCarbCalories} kcal)</div>
              </div>

              <div className="bg-[#171d2c] p-4 rounded-2xl border border-[#263148] space-y-1 text-center">
                <div className="text-xs text-cyan-400 font-bold">چربی‌های مفید (Healthy Fats)</div>
                <div className="text-2xl font-black font-mono text-white">{fatGrams} g</div>
                <div className="text-[10px] text-neutral-400">۰.۹ گرم جهت بالانس هورمونی ({fatCalories} kcal)</div>
              </div>
            </div>
          </div>

          {/* Peri-Workout Chrononutrition Windows (Pre, Intra, Post) */}
          <div className="bg-[#121522] border border-[#252e45] p-6 rounded-3xl space-y-5">
            <div className="border-b border-[#212a3e] pb-3">
              <span className="text-xs text-amber-400 font-bold">اصل سوخت‌رسانی بیومکانیک</span>
              <h3 className="text-base font-bold text-white mt-0.5">زمان‌بندی تغذیه در پنجره‌های ۳گانه دور تمرین (Peri-Workout Windows)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Pre-Workout */}
              <div className="bg-[#161b29] p-5 rounded-2xl border border-[#27324b] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#ff9800]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>۱. قبل تمرین (Pre)</span>
                  </span>
                  <span className="text-[10px] bg-[#ff9800]/20 px-2 py-0.5 rounded font-mono">۱.۵ ساعت قبل</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-[#0c0f18] p-3 rounded-xl border border-[#212a3e]">
                    <div className="font-bold text-white mb-1">کربوهیدرات دیرجذب (GI پایین):</div>
                    <div className="text-emerald-400 font-black font-mono text-sm">{preCarbsGrams} گرم</div>
                    <div className="text-[10px] text-neutral-400 mt-1">مانند جو دوسر، نان جو یا سیب‌زمینی شیرین جهت آزادسازی تدریجی گلوکز.</div>
                  </div>

                  <div className="bg-[#0c0f18] p-3 rounded-xl border border-[#212a3e]">
                    <div className="font-bold text-white mb-1">پروتئین متوسط/کامل:</div>
                    <div className="text-amber-400 font-black font-mono text-sm">{preProteinGrams} گرم</div>
                    <div className="text-[10px] text-neutral-400 mt-1">سفیده تخم‌مرغ یا سینه مرغ جهت حفظ نیتروژن عضلانی حین تمرین.</div>
                  </div>
                </div>
              </div>

              {/* 2. Intra-Workout */}
              <div className="bg-[#161b29] p-5 rounded-2xl border border-[#27324b] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>۲. حین تمرین (Intra)</span>
                  </span>
                  <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded font-mono">حین ست‌ها</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-[#0c0f18] p-3 rounded-xl border border-[#212a3e]">
                    <div className="font-bold text-white mb-1">کربوهیدرات مایع زودجذب:</div>
                    <div className="text-cyan-400 font-black font-mono text-sm">{intraCarbsGrams} گرم</div>
                    <div className="text-[10px] text-neutral-400 mt-1">دکستروز یا آب‌میوه طبیعی (مخصوص جلسات بالای ۴۵ دقیقه).</div>
                  </div>

                  <div className="bg-[#0c0f18] p-3 rounded-xl border border-[#212a3e]">
                    <div className="font-bold text-white mb-1">الکترولیت‌ها و BCAA:</div>
                    <div className="text-emerald-400 font-black font-mono text-sm">{intraElectrolytesMg} mg سدیم/پتاسیم</div>
                    <div className="text-[10px] text-neutral-400 mt-1">جلوگیری از افت فشار و دهیدراتاسیون سلول‌های عضلانی.</div>
                  </div>
                </div>
              </div>

              {/* 3. Post-Workout */}
              <div className="bg-[#161b29] p-5 rounded-2xl border border-[#27324b] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    <span>۳. بعد تمرین (Post)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono">تا ۴۵ دقیقه بعد</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-[#0c0f18] p-3 rounded-xl border border-[#212a3e]">
                    <div className="font-bold text-white mb-1">کربوهیدرات تندجذب (GI بالا):</div>
                    <div className="text-emerald-400 font-black font-mono text-sm">{postCarbsGrams} گرم</div>
                    <div className="text-[10px] text-neutral-400 mt-1">جهت ترشح سریع انسولین و بارگیری مجدد گلیکوژن عضلات.</div>
                  </div>

                  <div className="bg-[#0c0f18] p-3 rounded-xl border border-[#212a3e]">
                    <div className="font-bold text-white mb-1">پروتئین زودهضم (Whey/Egg):</div>
                    <div className="text-amber-400 font-black font-mono text-sm">{postProteinGrams} گرم</div>
                    <div className="text-[10px] text-neutral-400 mt-1">تحریک آنی سنتز پروتئین عضلانی (MPS) از طریق مسیر mTOR.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { NutritionProfile } from '../types';

export const SCRIPT_ONE_INTRO = {
  titleFa: 'اسکریپت شماره ۱: مبانی بیومکانیک، اهرم‌های حرکتی و پروتکل تغذیه پایه',
  subtitleFa: 'ایبل‌سیتی | ویژه بزرگسالان، بهینه‌سازی متابولیک و درک اهرم‌های مفاصل',
  mentalPrepText: `بدن شما یک شاهکار مهندسی است. در ایبلسیتی، ما با فیزیولوژی و فیزیک حرکت کار داریم، نه با حدس و گمان. قبل از برداشتن هر وزنهای، باید اهرمهای بدن و نقطهی اتصال عضلات را بشناسید تا بدون آسیب، بیشترین نیرو را تولید کنید.`,
  principles: [
    {
      id: 'torque',
      titleFa: 'قانون گشتاور (Torque Law)',
      tagFa: 'کاهش استرس تاندون',
      textFa: 'هرچه وزنه‌ی در دست از محور مفصل دورتر باشد، فشار روی تاندون و مهره‌ها تصاعدی بالا می‌رود؛ پس فاصله وزنه با بدن در تمام حرکات باید به کمترین فاصله ممکن (نزدیک‌ترین بازوی گشتاور) بهینه‌سازی شود.',
      formula: 'Torque = F × d_perp',
      icon: 'RotateCw'
    },
    {
      id: 'neutral_spine',
      titleFa: 'محافظت از ستون فقرات (Neutral Spine)',
      tagFa: 'حفاظت دیسک‌های L4-L5',
      textFa: 'خنثی نگه داشتن قوس طبیعی کمر در تمام حرکات پرس، ددلیفت و اسکوات؛ جلوگیری از هرگونه فلکشن (خم شدن به جلو) یا هایپراکستنشن افراطی مهره‌ها تحت فشار بار مکانیکی.',
      formula: 'Axial Compression >> Shear Stress',
      icon: 'ShieldCheck'
    },
    {
      id: 'balance_tripod',
      titleFa: 'نقطه اتکای تعادل (Tripod Foot Base)',
      tagFa: 'پایداری عصبی-عضلانی',
      textFa: 'انتقال مرکز ثقل به ۳ نقطه کلیدی کف پا (پاشنه، برآمدگی شست و انگشت کوچک) برای توزیع یکنواخت بار گرانش و ایجاد حداکثر پایداری عصبی-عضلانی در سراسر اسکلت.',
      formula: 'Center of Gravity ⟂ Mid-foot',
      icon: 'Compass'
    }
  ]
};

export function calculateCleanNutrition(weightKg: number, goal: 'hypertrophy' | 'fat_loss' | 'strength_health'): NutritionProfile {
  const safeWeight = Math.max(45, Math.min(150, weightKg));
  
  let proteinFactor = 1.8; // grams per kg
  if (goal === 'hypertrophy') proteinFactor = 2.0;
  if (goal === 'fat_loss') proteinFactor = 2.2; // higher protein for muscle preservation

  const targetProteinGrams = Math.round(safeWeight * proteinFactor);
  
  // Each large egg white has ~3.6g to 4.0g pure protein with 0 fat and 0 cholesterol
  // Target ~40-50% of daily protein from clean liquid/boiled egg whites
  const eggWhiteProteinTarget = targetProteinGrams * 0.45;
  const dailyEggWhites = Math.round(eggWhiteProteinTarget / 3.8);

  // Biochemical limit for whole egg yolks (cholesterol & saturated fat control)
  const yolksAllowed = goal === 'fat_loss' ? 1 : 2;

  // Boiled potatoes (سیب‌زمینی آب‌پز): Clean, high satiety index, zero processed sugars
  // Approx 20g net clean carbs per 100g boiled potato
  let potatoCarbFactor = goal === 'fat_loss' ? 3.5 : 5.0; // grams per kg
  const boiledPotatoesGrams = Math.round(safeWeight * potatoCarbFactor);

  // Hydration: 40ml per kg + extra 500ml for workout loss
  const dailyWaterLiters = Number(((safeWeight * 0.04) + 0.6).toFixed(1));

  // Electrolyte baseline for heavy lifting to prevent muscle cramps & maintain intracellular osmolarity
  const sodiumMg = Math.round(safeWeight * 35); // Sodium in mg (approx 2.5 - 3.5g)
  const potassiumMg = Math.round(safeWeight * 45); // Potassium in mg (high from boiled potatoes!)
  const magnesiumMg = Math.round(safeWeight * 6); // Magnesium in mg (intracellular muscle relaxation)

  return {
    bodyWeightKg: safeWeight,
    goal,
    targetProteinGrams,
    dailyEggWhites,
    yolksAllowed,
    boiledPotatoesGrams,
    dailyWaterLiters,
    sodiumMg,
    potassiumMg,
    magnesiumMg,
  };
}

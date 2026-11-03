// اسکریپت شماره ۱۰: بدنسازی پیش‌فصل (Pre-season) و آمادگی تخصصی تیم‌های ورزشی (Able City)

export interface PreseasonSportProtocol {
  id: 'soccer' | 'basketball' | 'volleyball';
  nameFa: string;
  nameEn: string;
  icon: string;
  accentColor: string;
  demandsFa: string;
  criticalInjuryRiskFa: string;
  biomechanicalPreventionMetricFa: string;
  drills: {
    nameFa: string;
    targetSystem: string;
    workRestRatio: string;
    protocolFa: string;
    biomechanicKeyFa: string;
  }[];
  strengthExercises: {
    nameFa: string;
    purposeFa: string;
    repsSets: string;
    tempo: string;
  }[];
}

export const PRESEASON_SPORTS: PreseasonSportProtocol[] = [
  {
    id: 'soccer',
    nameFa: 'فوتبال (Soccer / Football)',
    nameEn: 'Football (Soccer)',
    icon: 'Activity',
    accentColor: '#00e676',
    demandsFa: 'پوشش مسافت ۱۰ الی ۱۳ کیلومتر با بیش از ۱۲۰۰ تغییر فعالیت حرکتی، استارت‌های انفجاری ۱۰ تا ۴۰ متری، ترمزهای ناگهانی (Deceleration) و درگیری‌های فیزیکی تن‌به‌تن.',
    criticalInjuryRiskFa: 'پارگی تاندون همسترینگ در فاز نهایی تاب خوردن پا در دوی سرعت، و آسیب‌های رباط صلیبی قدامی (ACL) در چرخش‌های ناگهانی.',
    biomechanicalPreventionMetricFa: 'شاخص طلایی نسبت همسترینگ به چهارسر (H:Q Ratio بالای ۶۰٪ تا ۷۰٪) با تمرکز بر توان گشتاور اکسنتریک همسترینگ برای کنترل نیروی کوآدری سپس در انتهای گام دویدن.',
    drills: [
      {
        nameFa: 'اینتروال سرعتی متناوب شبیه مسابقه (HIIT 15s/15s)',
        targetSystem: 'سیستم فسفاژن + توان هوازی بیشینه (VO2max)',
        workRestRatio: '۱۵ ثانیه دوی حداکثر (۹۵٪ سرعت) / ۱۵ ثانیه گام‌برداری آرام (۸ ست × ۲ بلوک)',
        protocolFa: 'دویدن رفت‌وبرگشت در مسافت‌های ۴۰ متری با تغییر جهت ۱۸۰ درجه در هر بازگشت.',
        biomechanicKeyFa: 'کاهش مرکز ثقل در گام ماقبل ترمز برای تقسیم فشار ترمز روی باسن به جای رباط کشکک زانو.'
      },
      {
        nameFa: 'پروتکل نوردیک همسترینگ (Nordic Hamstring Curls)',
        targetSystem: 'هیپرتروفی طولی و افزایش طول دسته عضلانی فاسیکل‌های همسترینگ',
        workRestRatio: '۳ ست × ۵ الی ۸ تکرار با ۳ دقیقه استراحت بین ست‌ها',
        protocolFa: 'زانو زدن روی زمین در حالی که مچ پا توسط یار مهار شده است، فرود آرام بالاتنه با حفظ زانو در امتداد تنه.',
        biomechanicKeyFa: 'تحمیل حداکثر تنش انقباض اکسنتریک بر عضله دو سر رانی و شیفت دادن زاویه اوج گشتاور به طول‌های کشیده‌تر عضلانی.'
      },
      {
        nameFa: 'دریل چابکی T-Drill با مهار گشتاور والگوس',
        targetSystem: 'هماهنگی عصب-عضله و تغییر جهت (COD)',
        workRestRatio: '۵ تکرار در هر جهت با ۹۰ ثانیه استراحت کامل',
        protocolFa: 'دویدن رو به جلو ۱۰ متر، گام پهلو ۵ متر به چپ، ۱۰ متر به راست، ۵ متر به مرکز و دویدن رو به عقب.',
        biomechanicKeyFa: 'ممنوعیت چرخش زانو به داخل؛ محور زانو همیشه باید در امتداد استخوان متاتارس دوم پا قرار گیرد.'
      }
    ],
    strengthExercises: [
      {
        nameFa: 'ترپ‌بار ددلیفت (Trap Bar Deadlift)',
        purposeFa: 'توسعه توان زنجیره خلفی و پاها با توزیع یکنواخت بار روی مهره‌های کمری و زانو',
        repsSets: '۴ ست × ۵ تکرار (با ۸۰٪ 1RM)',
        tempo: '2-1-X-0 (اکسنتریک کنترل‌شده و صعود انفجاری)'
      },
      {
        nameFa: 'اسپلیت اسکات پرتابی با دمبل (Bulgarian Split Squat)',
        purposeFa: 'خنثی‌سازی عدم تقارن قدرت پای تکیه‌گاه در شوت و افزایش ثبات عرضی لگن',
        repsSets: '۳ ست × ۶ الی ۸ تکرار برای هر پا',
        tempo: '3-1-1-0'
      },
      {
        nameFa: 'پلانک جانبی همراه با ابداکشن پا (Copenhagen Adductor Plank)',
        purposeFa: 'تقویت عضلات نزدیک‌کننده ران (Adductors) و پیشگیری قطعی از فتق ورزشی و آسیب‌های کشاله ران',
        repsSets: '۳ ست × ۲۰ ثانیه برای هر طرف',
        tempo: 'ایزومتریک پایدار'
      }
    ]
  },
  {
    id: 'basketball',
    nameFa: 'بسکتبال (Basketball)',
    nameEn: 'Basketball',
    icon: 'Zap',
    accentColor: '#ff9800',
    demandsFa: 'بیش از ۷۰ پرش عمودی در هر مسابقه، تغییر مسیرهای مکرر در مسافت‌های بسیار کوتاه (شتاب‌گیری و ترمز زیر ۳ تا ۶ متر)، نبردهای بدنی باکس‌اوت زیر حلقه و شوت‌های پرشی مداوم.',
    criticalInjuryRiskFa: 'پیچ‌خوردگی‌های مکرر مچ پا (Inversion Sprains) و پارگی حاد رباط صلیبی قدامی (ACL) ناشی از فرود با زانوی قفل و متمایل به داخل.',
    biomechanicalPreventionMetricFa: 'مکانیک فرود ایمن (Triple Flexion): جذب ضربه با خم شدن همزمان مچ، زانو (حداقل ۴۵ درجه) و لولای لگن به جای فرود سخت روی پاشنه.',
    drills: [
      {
        nameFa: 'فرود کنترل‌شده از جعبه (Depth Drop to Stick Landing)',
        targetSystem: 'مهار جذب نیروهای بازتابی زمین (Ground Reaction Force)',
        workRestRatio: '۴ ست × ۵ تکرار فرود بدون جهش ثانویه',
        protocolFa: 'گام برداشتن از روی جعبه ۳۰ سانتی‌متری و فرود آرام بدون صدا روی هر دو پا در حالت نیمه‌اسکات.',
        biomechanicKeyFa: 'کاهش صدای فرود به صفر؛ عضلات باید به عنوان فنرهای هیدرولیک ضربه را در مفاصل بزرگ مستهلک کنند.'
      },
      {
        nameFa: 'دریل چابکی خطوط زمین (Lane Agility Drill)',
        targetSystem: 'ظرفیت بی‌هوازی لاکتیک و سرعت واکنش جانبی',
        workRestRatio: '۶ دوره با نسبت کار به استراحت ۱ به ۳',
        protocolFa: 'حرکت در دور محوطه رنگی زمین (Key) با ترکیب دویدن جلو، گام‌های دفاعی و گام به عقب.',
        biomechanicKeyFa: 'حفظ مرکز ثقل در راستای پای میانی با گام‌های باز بدون روی هم افتادن پاها.'
      },
      {
        nameFa: 'پرش‌های واکنشی با لمس تخته (Repeated Max Vertical Jumps)',
        targetSystem: 'چرخه کشش-کوتاه‌شدگی (Stretch-Shortening Cycle)',
        workRestRatio: '۳ ست × ۶ پرش پشت سر هم با کمترین زمان توقف روی زمین',
        protocolFa: 'پرش انفجاری به سمت حلقه بسکتبال و تکرار بلافاصله به محض لمس زمین.',
        biomechanicKeyFa: 'بهره‌گیری از خاصیت الاستیک تاندون آشیل با نگه‌داشتن زمان اتصال کف پا به زمین زیر ۲۰۰ میلی‌ثانیه.'
      }
    ],
    strengthExercises: [
      {
        nameFa: 'پوش‌پرس با هالتر یا دمبل (Push Press)',
        purposeFa: 'انتقال نیروی انفجاری از پاها به بالا و تثبیت کتف برای ریباند و بلاک شات',
        repsSets: '۴ ست × ۴ الی ۶ تکرار',
        tempo: '1-0-X-1 (دیپ سریع و پرتاب انفجاری)'
      },
      {
        nameFa: 'هیپ‌تراست سنگین با هالتر (Barbell Hip Thrust)',
        purposeFa: 'تولید بیشینه گشتاور اکستنشن هیپ برای پرش‌های عمودی بدون فشار به دیسک‌های کمری',
        repsSets: '۴ ست × ۶ الی ۸ تکرار',
        tempo: '2-0-1-2'
      },
      {
        nameFa: 'تقویت ثبات مچ پا با بوسوبال و کش (Ankle Inversion/Eversion Iso)',
        purposeFa: 'مقاوم‌سازی کپسول مفصلی تالوس و تاندون پرونئال در برابر پیچ‌خوردگی‌های مکرر مچ پا',
        repsSets: '۳ ست × ۱۲ تکرار در هر جهت',
        tempo: '2-1-2-1'
      }
    ]
  },
  {
    id: 'volleyball',
    nameFa: 'والیبال (Volleyball)',
    nameEn: 'Volleyball',
    icon: 'Award',
    accentColor: '#00e5ff',
    demandsFa: 'پرش‌های اوج عمودی مکرر با شیوه Approach Spike، چرخش فوق‌سریع تنه و کمربند شانه‌ای در آسمان، ضربه با سرعت زاویه‌ای بالای دست (بالای ۱۰۰۰ درجه بر ثانیه) و فرودهای تک‌پایی ناگهانی.',
    criticalInjuryRiskFa: 'سندرم زانوی پرش‌کنندگان (Patellar Tendinopathy) به دلیل بارگذاری مفرط بر تاندون کشکک و پارگی‌های تاندون لابروم و روتاتور کاف شانه.',
    biomechanicalPreventionMetricFa: 'تقویت اکستنتریک تاندون کشکک روی تخته شیب‌دار ۲۵ درجه (Decline Squat) و بازسازی توازن چرخش خارجی به داخلی شانه (ER:IR بالای ۷۵٪).',
    drills: [
      {
        nameFa: 'اسکوات تک‌پا روی سطح شیب‌دار ۲۵ درجه (Decline Board Single-Leg Squat)',
        targetSystem: 'تحریک کلاژن‌سازی و ریلودینگ تاندون کشکک زانو',
        workRestRatio: '۳ ست × ۱۵ تکرار با تمپوی آرام',
        protocolFa: 'قرار گرفتن روی شیب با پاشنه بالاتر از پنجه، فرود ۶۰ درجه تک‌پا با ۳ ثانیه زمان منفی.',
        biomechanicKeyFa: 'کاهش درگیری عضلات سرینی و ایزوله کردن دقیق تاندون پاتلار در فاز اکسنتریک جهت درمان و پیشگیری از التهاب مزمن.'
      },
      {
        nameFa: 'دریل تقویتی روتاتور کاف Y-T-W-L با کش و دمبل',
        targetSystem: 'تثبیت کتف و ترمز کردن دست پس از ضربه آبشار (Deceleration Mechanics)',
        workRestRatio: '۲ ست × ۱۰ تکرار در هر ۴ زاویه',
        protocolFa: 'حرکت دادن بازوها در ۴ فرم Y, T, W, L روی میز شیب‌دار با انقباض لوزی‌ها و بخش پایینی ذوزنقه.',
        biomechanicKeyFa: 'پیشگیری از سندرم گیر افتادگی شانه (Impingement) از طریق سنتر کردن سر استخوان بازو در حفره گلنوئید.'
      },
      {
        nameFa: 'پرش سه گام شبیه‌ساز اسپایک (Approach Spike & Soft Landing)',
        targetSystem: 'انتقال شتاب خطی افقی به شتاب عمودی (Braking Force Transfer)',
        workRestRatio: '۵ ست × ۳ پرش با ۱ دقیقه استراحت',
        protocolFa: 'گام برداشتن چپ-راست-چپ (یا بالعکس)، کاشتن محکم پای ترمز، پرش حداکثری و فرود نرم روی دو پا.',
        biomechanicKeyFa: 'عدم اجازه دادن به پای فرود برای تحمل تمام وزن به تنهایی، جذب بار به طور مساوی توسط هر دو زانو.'
      }
    ],
    strengthExercises: [
      {
        nameFa: 'پاور کلین از بالای زانو (Hang Power Clean)',
        purposeFa: 'تولید نیروی انفجاری اکستنشن سه‌گانه (Triple Extension مچ، زانو، لگن) برای پرش عمودی',
        repsSets: '۴ ست × ۳ تکرار انفجاری',
        tempo: 'انفجاری حداکثری'
      },
      {
        nameFa: 'پرس سرشانه تک‌دست با دمبل در وضعیت نیمه‌زانو (Half-Kneeling Press)',
        purposeFa: 'تثبیت میان‌تنه در برابر نیروهای چرخشی همراه با تقویت سرشانه',
        repsSets: '۳ ست × ۸ تکرار برای هر دست',
        tempo: '2-1-1-1'
      },
      {
        nameFa: 'فیس‌پول با سیم‌کش با چرخش خارجی مچ (Cable Face Pull with External Rotation)',
        purposeFa: 'تقویت دلتوئید خلفی و تریس مینور برای ترمز کردن دست بعد از هر آبشار سنگین',
        repsSets: '۳ ست × ۱۲ الی ۱۵ تکرار',
        tempo: '2-0-1-2'
      }
    ]
  }
];

export interface PreseasonTrainingLog {
  id: string;
  sport: 'soccer' | 'basketball' | 'volleyball';
  phase: 'aerobic_base' | 'concurrent_power' | 'match_speed';
  durationMinutes: number;
  restingHeartRate: number; // e.g. 52 bpm
  peakHeartRate: number; // e.g. 185 bpm
  rpeScore: number; // 1 to 10
  readinessScore: number; // calculated 0 to 100
  notes: string;
  date: string;
}

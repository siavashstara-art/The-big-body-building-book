// دانشنامه جامع بیومکانیک، فیزیولوژی سلولی و سیستم‌های تمرینی ایبل‌سیتی

export interface SkeletalSection {
  id: string;
  titleFa: string;
  titleEn: string;
  summaryFa: string;
  bones: string[];
  biomechanicalFunctionFa: string;
  keySafetyTipFa: string;
}

export const SKELETON_DATA: SkeletalSection[] = [
  {
    id: 'axial',
    titleFa: 'اسکلت محوری (Axial Skeleton)',
    titleEn: 'Axial Skeleton',
    summaryFa: 'محور مرکزی بدن شامل جمجمه، ستون فقرات (مهره‌های گردنی، پشتی، کمری و خاجی) و قفسه سینه که از نخاع و ارگان‌های حیاتی محافظت می‌کند.',
    bones: [
      'جمجمه و مهره‌های گردنی (C1-C7)',
      'مهره‌های پشتی یا سینه‌ای (T1-T12)',
      'مهره‌های کمری (L1-L5) حامل بار سنگین',
      'استخوان خاجی (Sacrum) و دنبالچه',
      'قفسه سینه و استخوان جناغ (Sternum)'
    ],
    biomechanicalFunctionFa: 'انتقال فشارهای محوری (Axial Loading)، حفظ تراز بیومکانیکی ستون فقرات در حالت خنثی (Neutral Spine)، و ایجاد بستر تکیه‌گاهی صلب جهت اعمال نیروی عضلات اندام‌ها.',
    keySafetyTipFa: 'در تمام حرکات اسکات و ددلیفت، حفظ قوس طبیعی کمر مانع از ایجاد گشتاور برشی روی دیسک‌های کمری L4-L5 می‌شود.'
  },
  {
    id: 'appendicular',
    titleFa: 'اسکلت ضمیمه یا اقماری (Appendicular Skeleton)',
    titleEn: 'Appendicular Skeleton',
    summaryFa: 'شامل استخوان‌های کمربند شانه‌ای، دست‌ها، لگن خاصره و پاها که زنجیره‌های حرکتی و اهرم‌های تولید نیرو را شکل می‌دهند.',
    bones: [
      'کمربند شانه‌ای: کتف (Scapula) و ترقوه (Clavicle)',
      'اندام فوقانی: بازو (Humerus)، زند زبرین و زیرین (Radius & Ulna)',
      'کمربند لگنی: استخوان‌های ایلیاک و مفصل ران (Acetabulofemoral)',
      'اندام تحتانی: ران (Femur)، کشکک (Patella)، درشت‌نی و نازک‌نی (Tibia & Fibula)'
    ],
    biomechanicalFunctionFa: 'عملکرد به عنوان اهرم‌های کلاس ۱، ۲ و ۳ برای تولید گشتاور، انتقال شتاب به وزنه و جابجایی وزن بدن در فضا.',
    keySafetyTipFa: 'زاویه قرارگیری استخوان ران در لگن، پهنای ایستادن بهینه در اسکات را مشخص می‌کند و باید بر اساس آناتومی فردی تنظیم شود.'
  }
];

export interface MuscleFiberType {
  id: string;
  nameFa: string;
  nameEn: string;
  speed: string;
  fatigueResistance: string;
  metabolism: string;
  primarySports: string[];
  mitochondriaDensity: string;
  optimalTrainingFa: string;
  descriptionFa: string;
}

export const MUSCLE_FIBERS: MuscleFiberType[] = [
  {
    id: 'type_2',
    nameFa: 'فیبرهای تندانقباض یا سفید (Type II / Fast-Twitch)',
    nameEn: 'Type II Muscle Fibers (Fast-Twitch)',
    speed: 'سرعت انقباض بسیار بالا (۴۰ تا ۹۰ میلی‌ثانیه)',
    fatigueResistance: 'پایین؛ سریع خسته می‌شوند',
    metabolism: 'عمدتاً بی‌هوازی (فسفاژن و گلیکولیز سریع)',
    primarySports: ['پاورلیفتینگ', 'وزنه‌برداری المپیک', 'سرعت ۱۰۰ متر', 'کشتی و پرتاب‌ها'],
    mitochondriaDensity: 'کم، مویرگ‌های خونی محدود، ذخایر گلیکوژن بالا',
    optimalTrainingFa: 'تمرینات پرشدت با وزنه‌های سنگین (۱ تا ۶ تکرار با ۸۰ تا ۹۵ درصد ۱RM) و زمان‌های استراحت طولانی ۲ تا ۴ دقیقه.',
    descriptionFa: 'قطر فیبر بزرگ‌تر بوده و بالاترین پتانسیل هایپرتروفی (افزایش حجم عضلانی) را دارند. این فیبرها در هنگام نیاز به نیروی انفجاری یا بلند کردن وزنه‌های بسیار سنگین فراخوانده می‌شوند.'
  },
  {
    id: 'type_1',
    nameFa: 'فیبرهای کُندنقباض یا قرمز (Type I / Slow-Twitch)',
    nameEn: 'Type I Muscle Fibers (Slow-Twitch)',
    speed: 'سرعت انقباض ملایم (۱۰۰ تا ۱۴۰ میلی‌ثانیه)',
    fatigueResistance: 'فوق‌العاده بالا؛ مقاوم در برابر اسیدی شدن',
    metabolism: 'هوازی (فسفوریلاسیون اکسیداتیو در میتوکندری)',
    primarySports: ['دوهای ماراتن', 'دوچرخه‌سواری استقامت', 'شنای طولانی', 'تمرینات تثبیت‌کننده قامت'],
    mitochondriaDensity: 'بسیار متراکم، سرشار از میوگلوبین و مویرگ‌های خونی فراوان',
    optimalTrainingFa: 'تکرارهای بالاتر (۱۵ تا ۲۵ تکرار با ۵۰ تا ۶۵ درصد ۱RM) با استراحت‌های کوتاه‌تر (۴۵ تا ۶۰ ثانیه).',
    descriptionFa: 'رنگ قرمز آن‌ها ناشی از میوگلوبین حامل اکسیژن است. این فیبرها خستگی‌ناپذیرند و وظیفه اصلی نگه‌داشتن تراز قامتی در طول روز و فعالیت‌های مداوم را بر عهده دارند.'
  }
];

export interface Somatotype {
  id: string;
  nameFa: string;
  nameEn: string;
  appearanceFa: string;
  metabolicRateFa: string;
  trainingStrategyFa: string;
  nutritionStrategyFa: string;
  strengthsFa: string;
  cautionsFa: string;
}

export const SOMATOTYPES: Somatotype[] = [
  {
    id: 'ectomorph',
    nameFa: 'اکتومورف (Ectomorph - لاغراندام)',
    nameEn: 'Ectomorph',
    appearanceFa: 'استخوان‌بندی باریک، عرض شانه و لگن کم، مچ دست‌های ظریف و درصد چربی طبیعی بسیار پایین.',
    metabolicRateFa: 'متابولیسم فوق‌العاده سریع و فعالیت بالای سیستم عصبی سمپاتیک.',
    trainingStrategyFa: 'تمرکز بر حرکات چندمفصله سنگین با حجم کم و شدت بالا، استراحت‌های ۲ الی ۳ دقیقه‌ای و پرهیز از تمرینات بیش از ۴۵ الی ۵۰ دقیقه.',
    nutritionStrategyFa: 'مازاد کالری متراکم (Surplus)، کربوهیدرات‌های پایدار فراوان (سیب‌زمینی آب‌پز، برنج، جو دوسر) و وعده‌های مکرر غنی از پروتئین پاک.',
    strengthsFa: 'حفظ بسیار آسان فیزیک بدنی بدون چربی و کات طبیعی عضلات.',
    cautionsFa: 'مستعد تمرین‌زدگی سریع (Overtraining) در صورت عدم تأمین خواب و کالری کافی.'
  },
  {
    id: 'mesomorph',
    nameFa: 'مزومورف (Mesomorph - متناسب و عضلانی)',
    nameEn: 'Mesomorph',
    appearanceFa: 'استخوان‌بندی پهن، شانه قوی و عریض با کمر باریک (فرم V شکل کلاسیک)، توده عضلانی ذاتی بالا.',
    metabolicRateFa: 'متابولیسم متعادل و پاسخ‌پذیری سریع فیبرهای عضلانی به بار مکانیکی.',
    trainingStrategyFa: 'ترکیب سیستم‌های ست‌بندی هرمی، بارهای سنگین و تمرینات پرفشار ورزشی.',
    nutritionStrategyFa: 'توزیع یکنواخت ۴۰٪ کربوهیدرات، ۳۵٪ پروتئین و ۲۵٪ چربی‌های سالم با کالری در حد نگهداری یا مازاد ملایم.',
    strengthsFa: 'سرعت رشد عضلانی چشمگیر و ریکاوری باکیفیت پس از تمرینات سنگین.',
    cautionsFa: 'خطر غرور تمرینی و اضافه کردن شتاب‌زده وزنه‌ها که تاندون‌ها را در معرض خطر قرار می‌دهد.'
  },
  {
    id: 'endomorph',
    nameFa: 'اندومورف (Endomorph - مستعد ذخیره چربی)',
    nameEn: 'Endomorph',
    appearanceFa: 'استخوان‌بندی درشت، مفاصل ضخیم، بالاتنه گرد و لگن پهن‌تر، ذخیره‌سازی آسان بافت چربی.',
    metabolicRateFa: 'متابولیسم کندتر و حساسیت به کربوهیدرات که نیازمند مدیریت دقیق قند خون است.',
    trainingStrategyFa: 'ترکیب تمرینات مقاومتی هایپرتروفی با استراحت‌های کوتاه (۶۰ ثانیه) و افزودن تمرینات اینتروال (HIIT) یا کاردیوی هدفمند.',
    nutritionStrategyFa: 'کنترل سخت‌گیرانه کربوهیدرات‌های تصفیه‌شده، تمرکز بر سبزیجات فیبردار، پروتئین سفیده تخم‌مرغ و زمان‌بندی کربوهیدرات فقط در پنجره پیرامون تمرین.',
    strengthsFa: 'قدرت بدنی پایه بسیار بالا و توانایی جابجایی وزنه‌های فوق‌العاده سنگین.',
    cautionsFa: 'نیاز به مداومت بی‌وقفه در رژیم غذایی و پرهیز از کالری‌های پنهان.'
  }
];

export interface AtpStep {
  stepNumber: number;
  titleFa: string;
  biochemProcessFa: string;
  locationFa: string;
  energyYieldFa: string;
  cellularDetailsFa: string;
}

export const ATP_CYCLE_STEPS: AtpStep[] = [
  {
    stepNumber: 1,
    titleFa: 'هضم و گوارش به گلوکز (Digestion & Glucose Entry)',
    biochemProcessFa: 'شکسته شدن کربوهیدرات‌های پیچیده به مونوساکاریدهای گلوکز و جذب از دیواره روده به جریان خون.',
    locationFa: 'دستگاه گوارش و عروق خونی',
    energyYieldFa: 'آماده‌سازی سوبستراهای سوختی',
    cellularDetailsFa: 'هورمون انسولین، ناقل‌های GLUT4 را فعال کرده و گلوکز را به درون سیتوپلاسم سلول عضلانی هدایت می‌کند.'
  },
  {
    stepNumber: 2,
    titleFa: 'گلیکولیز در سیتوپلاسم (Cytoplasmic Glycolysis)',
    biochemProcessFa: 'شکسته شدن یک مولکول ۶ کربنه گلوکز به دو مولکول ۳ کربنه پیرووات بدون نیاز به اکسیژن.',
    locationFa: 'سیتوسول (Cytosol)',
    energyYieldFa: 'تولید خالص ۲ مولکول ATP + ۲ مولکول NADH',
    cellularDetailsFa: 'در تمرینات سرعتی بی‌هوازی، پیرووات به لاکتات تبدیل می‌شود و به عنوان سوخت اضطراری بازچرخانی می‌گردد.'
  },
  {
    stepNumber: 3,
    titleFa: 'چرخه کربس در میتوکندری (Krebs / Citric Acid Cycle)',
    biochemProcessFa: 'ورود استیل کوآنزیم A حاصل از پیرووات و اسیدهای چرب به ماتریکس میتوکندری و زنجیره اکسیداسیون.',
    locationFa: 'ماتریکس میتوکندری (نیروگاه سلول)',
    energyYieldFa: 'تولید ۲ مولکول ATP + الکترون‌های حامل (NADH & FADH2)',
    cellularDetailsFa: 'این مرحله نقطه اتصال سوختن همزمان کربوهیدرات‌ها و چربی‌ها با حضور اکسیژن است.'
  },
  {
    stepNumber: 4,
    titleFa: 'زنجیره انتقال الکترون و سنتز نهایی ATP (Oxidative Phosphorylation)',
    biochemProcessFa: 'انتقال الکترون‌ها در غشای داخلی میتوکندری و ایجاد گرادیان پروتونی که آنزیم ATP Synthase را به چرخش درمی‌آورد.',
    locationFa: 'غشای داخلی میتوکندری',
    energyYieldFa: 'تولید انبوه ۲۸ الی ۳۲ مولکول ATP به ازای هر گلوکز',
    cellularDetailsFa: 'پیوند فسفاتی پرانرژی ایجاد می‌شود. با انقباض عضله، آنزیم ATPase این پیوند را شکسته (ATP -> ADP + Pi) و انرژی مکانیکی انقباض فیلامان‌های اکتین و میوزین آزاد می‌شود.'
  }
];

export interface SupplementInfo {
  id: string;
  nameFa: string;
  nameEn: string;
  category: 'performance' | 'herbal' | 'recovery';
  biochemMechanismFa: string;
  optimalDosageFa: string;
  clinicalEvidenceGrade: 'A (شواهد بالینی قوی)' | 'B (شواهد متوسط)' | 'A+ (استاندارد طلایی)';
  synergyStackFa: string;
  safetyProfileFa: string;
}

export const SUPPLEMENT_ENCYCLOPEDIA: SupplementInfo[] = [
  {
    id: 'creatine',
    nameFa: 'کراتین مونوهیدرات (Creatine Monohydrate)',
    nameEn: 'Creatine Monohydrate',
    category: 'performance',
    biochemMechanismFa: 'افزایش ذخایر فسفوکراتین (PCr) در سارکوپلاسم، تسهیل بازتولید سریع ATP در ۵ الی ۱۰ ثانیه اول فعالیت انفجاری و افزایش هیدراتاسیون داخل‌سلولی عضلات.',
    optimalDosageFa: 'روزانه ۳ الی ۵ گرم به صورت مداوم همراه با کربوهیدرات یا آب فراوان. دوره بارگیری اختیاری است.',
    clinicalEvidenceGrade: 'A+ (استاندارد طلایی)',
    synergyStackFa: 'همراهی با پروتئین وی یا کربوهیدرات زودهضم جهت ترشح انسولین و جذب بالاتر.',
    safetyProfileFa: 'ایمن‌ترین و آزموده‌شده‌ترین مکمل ورزشی در تاریخ علم فیزیولوژی بدون عوارض کلیوی در افراد سالم.'
  },
  {
    id: 'glutamine',
    nameFa: 'ال-گلوتامین (L-Glutamine)',
    nameEn: 'L-Glutamine',
    category: 'recovery',
    biochemMechanismFa: 'فراوان‌ترین اسید آمینه آزاد در بافت عضلانی، سوخت اصلی انتروسیت‌های روده و لنفوسیت‌ها، کاهش کاتابولیسم پروتئینی پس از تمرینات فرسایشی.',
    optimalDosageFa: '۵ الی ۱۰ گرم پس از تمرین یا قبل از خواب.',
    clinicalEvidenceGrade: 'A (شواهد بالینی قوی)',
    synergyStackFa: 'ترکیب با الکترولیت‌ها و آب برای بهینه‌سازی ریکاوری مخاط دستگاه گوارش.',
    safetyProfileFa: 'فوق‌العاده ایمن با تحمل گوارشی بالا.'
  },
  {
    id: 'carnitine',
    nameFa: 'ال-کارنیتین / ال-تارترات (L-Carnitine L-Tartrate)',
    nameEn: 'L-Carnitine L-Tartrate',
    category: 'performance',
    biochemMechanismFa: 'انتقال اسیدهای چرب با زنجیره بلند از سیتوسول به درون ماتریکس میتوکندری جهت بتا-اکسیداسیون و تولید انرژی، به همراه تسریع ریکاوری بافت اندوتلیال عروق.',
    optimalDosageFa: '۱ الی ۲ گرم، ۳۰ تا ۴۵ دقیقه قبل از تمرین هوازی یا مقاومتی.',
    clinicalEvidenceGrade: 'A (شواهد بالینی قوی)',
    synergyStackFa: 'همراه با کافئین قبل از تمرین برای ارتقای راندمان اکسیداسیون چربی.',
    safetyProfileFa: 'ایمن و طبیعی؛ فرم تارترات جذب عضلانی بالاتری دارد.'
  },
  {
    id: 'arginine',
    nameFa: 'ال-آرژنین و سیترولین (L-Arginine / Citrulline Malate)',
    nameEn: 'L-Arginine & Citrulline Malate',
    category: 'performance',
    biochemMechanismFa: 'پیش‌ساز سنتز نیتریک اکساید (NO) توسط آنزیم eNOS، انبساط ماهیچه‌های صاف دیواره عروق (Vasodilation)، افزایش جریان خون، اکسیژن‌رسانی و پمپ عضلانی.',
    optimalDosageFa: 'سیترولین مالات ۶ الی ۸ گرم (یا آرژنین ۳ الی ۵ گرم) ۳۰ دقیقه پیش از تمرین.',
    clinicalEvidenceGrade: 'A+ (استاندارد طلایی)',
    synergyStackFa: 'سیترولین به دلیل دور زدن متابولیسم اولیه کبدی، سطح خونی آرژنین را موثرتر از خود آرژنین خوراکی افزایش می‌دهد.',
    safetyProfileFa: 'ایمن؛ ممکن است در دوزهای بسیار بالا احساس گرگرفتگی ملایم عروقی ایجاد کند.'
  },
  {
    id: 'caffeine',
    nameFa: 'کافئین بی‌آب (Caffeine Anhydrous)',
    nameEn: 'Caffeine Anhydrous',
    category: 'performance',
    biochemMechanismFa: 'آنتاگونیست رقابتی گیرنده‌های آدنوزین A1 و A2A در مغز، افزایش دوپامین، کاهش درک خستگی و افزایش به کارگیری واحدهای حرکتی عضلانی.',
    optimalDosageFa: '۳ الی ۶ میلی‌گرم به ازای هر کیلوگرم وزن بدن، ۴۵ دقیقه پیش از تمرین.',
    clinicalEvidenceGrade: 'A+ (استاندارد طلایی)',
    synergyStackFa: 'همراه با ال-تئانین برای ایجاد تمرکز زلال و جلوگیری از پرش عصبی (Jitters).',
    safetyProfileFa: 'بسیار مؤثر؛ باید از مصرف آن در ساعات پایانی عصر جهت حفظ کیفیت فاز عمیق خواب خودداری شود.'
  },
  {
    id: 'ashwagandha',
    nameFa: 'آشواگاندا / بوزیدان (Ashwagandha KSM-66)',
    nameEn: 'Withania Somnifera (Ashwagandha)',
    category: 'herbal',
    biochemMechanismFa: 'گیاه آداپتوژن قوی، تعدیل‌کننده محور HPA (هیپوتالاموس-هیپوفیز-فوق‌کلیه)، کاهش سطح کورتیزول سرم خون، افزایش مقاومت در برابر استرس تمرینی و بهبود کیفیت خواب عمیق.',
    optimalDosageFa: '۳۰۰ الی ۶۰۰ میلی‌گرم عصاره استاندارد شده ریشه روزانه همراه با وعده غذایی.',
    clinicalEvidenceGrade: 'A (شواهد بالینی قوی)',
    synergyStackFa: 'همراه با منیزیم بیزگلیسینات و روی (ZMA) در شب برای ریکاوری عصبی-عضلانی.',
    safetyProfileFa: 'گیاهی و ایمن با اثرات اثبات‌شده در کاهش اضطراب و تثبیت هورمونی.'
  },
  {
    id: 'tribulus',
    nameFa: 'تریبولوس ترپستریس / خارخاسک (Tribulus Terrestris)',
    nameEn: 'Tribulus Terrestris',
    category: 'herbal',
    biochemMechanismFa: 'حاوی ساپونین‌های استروئیدی طبیعی (به ویژه پروتودیوسین)، تقویت ترشح هورمون لوتئینیزان (LH) و حمایت از سطح فیزیولوژیک هورمون‌های آندروژنیک در مردان بزرگسال.',
    optimalDosageFa: '۵۰۰ الی ۱۰۰۰ میلی‌گرم عصاره استاندارد شده با حداقل ۴۵٪ ساپونین.',
    clinicalEvidenceGrade: 'B (شواهد متوسط)',
    synergyStackFa: 'همراه با روی، شنبلیله و ماکا برای پشتیبانی از سلامت غدد جنسی.',
    safetyProfileFa: 'سنتی و گیاهی؛ فاقد عوارض مخرب ترکیبات سنتتیک.'
  },
  {
    id: 'maca_ginseng',
    nameFa: 'ریشه ماکا و جنسینگ قرمز کره‌ای (Maca & Panax Ginseng)',
    nameEn: 'Maca Root & Korean Red Ginseng',
    category: 'herbal',
    biochemMechanismFa: 'ترکیب جینسنوزیدها و ماکامیدها برای تقویت راندمان اکسیژن سلولی، خون‌رسانی مویرگی، افزایش شادابی پایدار و تعادل هورمونی در مردان و زنان.',
    optimalDosageFa: 'ماکا ۱.۵ الی ۳ گرم، عصاره جنسینگ ۲۰۰ الی ۴۰۰ میلی‌گرم صبح‌ها.',
    clinicalEvidenceGrade: 'A (شواهد بالینی قوی)',
    synergyStackFa: 'استفاده دوره‌ای (Cycle) ۸ هفته مصرف و ۲ هفته استراحت جهت پیشگیری از سازگاری گیرنده‌ها.',
    safetyProfileFa: 'انرژی‌بخش طبیعی، بدون ایجاد افت قند خون یا افت ناگهانی انرژی.'
  }
];

// دیکشنری جامع ۸ زبانه، ۱۰۰٪ آفلاین و سبک ایبل‌سیتی (Able City i18n)

export type SupportedLanguage = 'fa' | 'en' | 'ar' | 'es' | 'fr' | 'hi' | 'zh' | 'ru';

export interface LanguageOption {
  code: SupportedLanguage;
  nameFa: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'fa', nameFa: 'فارسی', nativeName: 'فارسی', dir: 'rtl', flag: '🇮🇷' },
  { code: 'en', nameFa: 'انگلیسی', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'ar', nameFa: 'عربی', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'es', nameFa: 'اسپانیایی', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'fr', nameFa: 'فرانسوی', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'hi', nameFa: 'هندی', nativeName: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
  { code: 'zh', nameFa: 'چینی', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'ru', nameFa: 'روسی', nativeName: 'Русский', dir: 'ltr', flag: '🇷🇺' },
];

export const I18N_DICTIONARY: Record<SupportedLanguage, Record<string, string>> = {
  fa: {
    appTitle: "بدنسازی برای همه رشته‌ها (ایبل‌سیتی)",
    appSubTitle: "سامانه بیومکانیک زیستی و فیزیولوژی علمی تمرین",
    script1: "اسکریپت ۱: مبانی",
    script2: "اسکریپت ۲: بالاتنه",
    script3: "اسکریپت ۳: پایین‌تنه",
    script4: "اسکریپت ۴: اصلاحی",
    script5: "اسکریپت ۵: ست‌بندی",
    script6: "اسکریپت ۶: ریکاوری",
    script10: "اسکریپت ۱۰: پیش‌فصل",
    encyclopedia: "دانشنامه تخصصی",
    gymTracker: "ردیاب باشگاهی",
    bookAndLeitner: "کتاب و لایتنر",
    badges: "نشان‌ها",
    teaser: "تیزر ۴۵ ثانیه",
    startWorkout: "شروع تمرین",
    selectLanguage: "انتخاب زبان",
    safetyTip: "نکته ایمنی: راستای ستون فقرات خنثی رعایت شود.",
    pwaInstall: "نصب PWA روی موبایل",
    pdfExport: "خروجی PDF برنامه",
    movementEngineer: "مهندس حرکت",
    cellScholar: "پژوهشگر فیزیولوژی سلولی",
    teamDirector: "استاد بدنسازی پیش‌فصل تیمی"
  },
  en: {
    appTitle: "Bodybuilding for All Sports (Able City)",
    appSubTitle: "Biological Biomechanics & Physiology System",
    script1: "Script 1: Foundations",
    script2: "Script 2: Upper Body",
    script3: "Script 3: Lower Body",
    script4: "Script 4: Corrective",
    script5: "Script 5: Set Systems",
    script6: "Script 6: Biochem Recovery",
    script10: "Script 10: Pre-Season",
    encyclopedia: "Encyclopedia",
    gymTracker: "Gym Tracker",
    bookAndLeitner: "Book & Flashcards",
    badges: "Power Badges",
    teaser: "45s Motion Teaser",
    startWorkout: "Start Workout",
    selectLanguage: "Select Language",
    safetyTip: "Safety Tip: Maintain neutral spine alignment.",
    pwaInstall: "Install PWA App",
    pdfExport: "Coach PDF Export",
    movementEngineer: "Movement Engineer",
    cellScholar: "Cellular Physiology Scholar",
    teamDirector: "Team Conditioning Director"
  },
  ar: {
    appTitle: "كتب ومناهج ابل سيتي للتدريب والبيوميكانيك",
    appSubTitle: "نظام الميكانيكا الحيوية والفسيولوجيا",
    script1: "السيناريو ١: الأساسيات",
    script2: "السيناريو ٢: الجزء العلوي",
    script3: "السيناريو ٣: الجزء السفلي",
    script4: "السيناريو ٤: التمارين التصحيحية",
    script5: "السيناريو ٥: أنظمة التكرار",
    script6: "السيناريو ٦: التعافي الكيميائي",
    script10: "السيناريو ١٠: ما قبل الموسم",
    encyclopedia: "الموسوعة الشاملة",
    gymTracker: "متبع النادي",
    bookAndLeitner: "الكتب والبطاقات",
    badges: "أوسمة القوة",
    teaser: "الإعلان ٤٥ ثانية",
    startWorkout: "ابدأ التمرين",
    selectLanguage: "اختر اللغة",
    safetyTip: "نصيحة السلامة: حافظ على استقامة العمود الفقري المحايد.",
    pwaInstall: "تثبيت تطبيق PWA",
    pdfExport: "تصدير تقرير PDF",
    movementEngineer: "مهندس الحركة",
    cellScholar: "باحث الخلية والفسيولوجيا",
    teamDirector: "مدرب إعداد الفرق"
  },
  es: {
    appTitle: "Libros y Entrenamiento Biomecánico Able City",
    appSubTitle: "Sistema de Biomecánica y Fisiología",
    script1: "Guión 1: Fundamentos",
    script2: "Guión 2: Tren Superior",
    script3: "Guión 3: Tren Inferior",
    script4: "Guión 4: Correctivo",
    script5: "Guión 5: Series",
    script6: "Guión 6: Recuperación Bioquímica",
    script10: "Guión 10: Pretemporada",
    encyclopedia: "Enciclopedia",
    gymTracker: "Seguimiento de Gimnasio",
    bookAndLeitner: "Libro y Fichas",
    badges: "Insignias de Poder",
    teaser: "Tráiler 45s",
    startWorkout: "Iniciar Entreno",
    selectLanguage: "Seleccionar Idioma",
    safetyTip: "Consejo de seguridad: Mantenga la columna vertebral en posición neutra.",
    pwaInstall: "Instalar PWA Móvil",
    pdfExport: "Exportar PDF de Entrenador",
    movementEngineer: "Ingeniero del Movimiento",
    cellScholar: "Académico de Fisiología Celular",
    teamDirector: "Director de Acondicionamiento"
  },
  fr: {
    appTitle: "Livres et Entraînement Biomécanique Able City",
    appSubTitle: "Système de Biomécanique et Physiologie",
    script1: "Script 1 : Fondations",
    script2: "Script 2 : Haut du Corps",
    script3: "Script 3 : Bas du Corps",
    script4: "Script 4 : Correctif",
    script5: "Script 5 : Systèmes de Séries",
    script6: "Script 6 : Récupération Biochimique",
    script10: "Script 10 : Pré-saison",
    encyclopedia: "Encyclopédie",
    gymTracker: "Suivi de Salle",
    bookAndLeitner: "Livre & Cartes",
    badges: "Badges de Puissance",
    teaser: "Bande-annonce 45s",
    startWorkout: "Commencer l'entraînement",
    selectLanguage: "Choisir la langue",
    safetyTip: "Conseil de sécurité : Maintenez une colonne vertébrale neutre.",
    pwaInstall: "Installer l'application PWA",
    pdfExport: "Exporter PDF Entraîneur",
    movementEngineer: "Ingénieur du Mouvement",
    cellScholar: "Chercheur en Physiologie Cellulaire",
    teamDirector: "Directeur de Préparation"
  },
  hi: {
    appTitle: "एबल सिटी ट्रेनिंग और बायोमैकेनिक बुक्स",
    appSubTitle: "बायोलॉजिकल बायोमैकेनिक और फिजियोलॉजी सिस्टम",
    script1: "स्क्रिप्ट 1: नींव",
    script2: "स्क्रिप्ट 2: ऊपरी शरीर",
    script3: "स्क्रिप्ट 3: निचला शरीर",
    script4: "स्क्रिप्ट 4: सुधारात्मक",
    script5: "स्क्रिप्ट 5: सेट सिस्टम",
    script6: "स्क्रिप्ट 6: बायोकेम रिकवरी",
    script10: "स्क्रिप्ट 10: प्री-सीज़न",
    encyclopedia: "एनसाइक्लोपीडिया",
    gymTracker: "जिम ट्रैकर",
    bookAndLeitner: "किताब और फ्लैशकार्ड",
    badges: "पावर बैज",
    teaser: "45s टीज़र मोशन",
    startWorkout: "वर्कआउट शुरू करें",
    selectLanguage: "भाषा चुनें",
    safetyTip: "सुरक्षा टिप: रीढ़ की हड्डी को तटस्थ (Neutral) स्थिति में रखें।",
    pwaInstall: "PWA ऐप इंस्टॉल करें",
    pdfExport: "कोच PDF रिपोर्ट",
    movementEngineer: "मूवमेंट इंजीनियर",
    cellScholar: "कोशिकीय शरीर क्रिया वैज्ञानिक",
    teamDirector: "टीम कंडीशनिंग डायरेक्टर"
  },
  zh: {
    appTitle: "Able City 训练与生物力学丛书",
    appSubTitle: "生物力学与生理学系统",
    script1: "剧本 1: 基础概念",
    script2: "剧本 2: 上肢肌群",
    script3: "剧本 3: 下肢肌群",
    script4: "剧本 4: 矫正训练",
    script5: "剧本 5: 组数系统",
    script6: "剧本 6: 生化恢复",
    script10: "剧本 10: 季前备战",
    encyclopedia: "专业百科全书",
    gymTracker: "健身房追踪",
    bookAndLeitner: "书籍与卡片",
    badges: "力量徽章",
    teaser: "45秒 宣传特辑",
    startWorkout: "开始锻炼",
    selectLanguage: "选择语言",
    safetyTip: "安全提示：保持脊柱自然中立位。",
    pwaInstall: "安装 PWA 应用",
    pdfExport: "导出教练 PDF 报告",
    movementEngineer: "动作力学工程师",
    cellScholar: "细胞生理学学者",
    teamDirector: "团队体能总监"
  },
  ru: {
    appTitle: "Обучающие книги и биомеханика Able City",
    appSubTitle: "Система биомеханики и физиологии",
    script1: "Сценарий 1: Основы",
    script2: "Сценарий 2: Верх тела",
    script3: "Сценарий 3: Низ тела",
    script4: "Сценарий 4: Коррекция",
    script5: "Сценарий 5: Системы подходов",
    script6: "Сценарий 6: Биохим восстановление",
    script10: "Сценарий 10: Предсезонка",
    encyclopedia: "Энциклопедия",
    gymTracker: "Дневник в зале",
    bookAndLeitner: "Книга и карточки",
    badges: "Знаки силы",
    teaser: "45с Трейлер",
    startWorkout: "Начать тренировку",
    selectLanguage: "Выберите язык",
    safetyTip: "Совет по безопасности: сохраняйте нейтральное положение позвоночника.",
    pwaInstall: "Установить PWA",
    pdfExport: "Экспорт PDF отчета",
    movementEngineer: "Инженер движений",
    cellScholar: "Исследователь клеточной физиологии",
    teamDirector: "Директор по подготовке"
  }
};

/**
 * Switch language, save to localStorage, and update html dir/lang attributes
 */
export function setAppLanguage(langCode: SupportedLanguage) {
  try {
    localStorage.setItem('selected_lang', langCode);
    const option = LANGUAGE_OPTIONS.find(o => o.code === langCode) || LANGUAGE_OPTIONS[0];
    document.documentElement.dir = option.dir;
    document.documentElement.lang = langCode;
  } catch {
    // ignore
  }
}

/**
 * Get saved language from localStorage (defaults to 'fa')
 */
export function getSavedAppLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem('selected_lang') as SupportedLanguage;
    if (saved && I18N_DICTIONARY[saved]) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'fa';
}

/**
 * Get translated text by key for a specific language
 */
export function getI18nText(key: string, lang: SupportedLanguage = 'fa'): string {
  if (I18N_DICTIONARY[lang] && I18N_DICTIONARY[lang][key]) {
    return I18N_DICTIONARY[lang][key];
  }
  if (I18N_DICTIONARY['fa'] && I18N_DICTIONARY['fa'][key]) {
    return I18N_DICTIONARY['fa'][key];
  }
  return key;
}

import { TeaserScene } from '../types';

export const TEASER_META = {
  videoTitleFa: 'ایبلسیتی؛ مهندسی بیومکانیک بدن و بدنسازی علمی 🚀',
  totalDurationSeconds: 45,
  visualStyleFa: 'موشنگرافیک پیشرفته با فضای تاریک و نئونی، ریتم تند و انگیزشی',
  platforms: ['آپارات (Aparat)', 'کافه بازار (Cafe Bazaar)']
};

export const TEASER_SCENES: TeaserScene[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 5,
    visualTitle: 'انقباض عضلانی و اهرم‌ها',
    visualFa: 'نمای نزدیک از عضلات در حال انقباض با انیمیشن گرافیکی وکتور سه بعدی و خطوط برداری نیرو',
    speakerTextFa: 'وقتش رسیده بدنت رو مثل یک مهندسِ واقعی بسازی، نه با شانس و خطا!',
    soundFoleyFa: '[افکت: صدای برخورد وزنه سنگین فلزی + ضربان قلب بم]',
    posterKey: 'fibers',
    bgGradient: 'from-orange-950/80 via-black to-neutral-950',
  },
  {
    id: 2,
    startTime: 5,
    endTime: 15,
    visualTitle: 'سیستم جامع و مدل سه‌بعدی',
    visualFa: 'نمایش صفحه اپلیکیشن با تم تاریک، مدل سه بعدی عضلات و انیمیشنهای روان حرکات اصلاحی',
    speakerTextFa: '«ایبلسیتی»؛ سیستم جامع بیومکانیک، اصلاح حرکات و بدنسازی تخصصی بزرگسالان!',
    soundFoleyFa: '[افکت: صدای وووش دیجیتال فرکانس بالا + پاساژ درام ریتمیک]',
    posterKey: 'teaser',
    bgGradient: 'from-amber-950/80 via-black to-zinc-950',
  },
  {
    id: 3,
    startTime: 15,
    endTime: 25,
    visualTitle: 'تحلیل اهرم‌ها و جعبه لایتنر',
    visualFa: 'آیکونهای بزرگ ثبت رکورد، نمودارهای پیشرفت صعودی و فلشکارتهای آناتومی',
    speakerTextFa: 'با انیمیشنهای دقیق حرکتی، جعبه لایتنر اصول تمرین و تحلیل دقیقِ مفاصل و اهرمها.',
    soundFoleyFa: '[افکت: کلیک‌های مکانیکی سریع و صدای شارژ گشتاور]',
    posterKey: 'book',
    bgGradient: 'from-orange-900/60 via-black to-stone-950',
  },
  {
    id: 4,
    startTime: 25,
    endTime: 35,
    visualTitle: 'دسترس‌پذیری و فرامین صوتی باشگاه',
    visualFa: 'نمایش قابلیتهای Accessibility (دکمههای بزرگ، حالت باشگاهی و فرامین صوتی)',
    speakerTextFa: 'طراحیشده با استانداردهای حرفهای برای اوج تمرکز و بالاترین بهرهوری در باشگاه و خانه.',
    soundFoleyFa: '[افکت: صدای دینگ تایید صوتی و پالس انرژی]',
    posterKey: 'teaser',
    bgGradient: 'from-neutral-900 via-black to-orange-950/70',
  },
  {
    id: 5,
    startTime: 35,
    endTime: 45,
    visualTitle: 'فراخوان نصب در کافه بازار',
    visualFa: 'نمایش دکمه نصب از کافه بازار + پکیجهای کامل تخصصی',
    speakerTextFa: 'همین حالا ایبلسیتی رو از کافه بازار نصب کن و فرمِ بدنت رو متحول کن!',
    soundFoleyFa: '[افکت: اوج ملودی انگیزشی، باس قدرتمند و افکت ضربه پایانی]',
    posterKey: 'fibers',
    bgGradient: 'from-amber-900/80 via-black to-orange-950',
  }
];

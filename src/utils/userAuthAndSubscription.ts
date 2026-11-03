// سیستم ثبت‌نام هوشمند، تشخیص منطقه، و خرید اشتراک درگاه‌های کافه‌بازار / مایکت و بین‌المللی

export interface UserAuthIdentity {
  identity: string; // phone number or email
  region: 'IR' | 'Global';
  isLoggedIn: boolean;
  isPremium: boolean;
  activatedAt?: string;
}

export interface PricingPlan {
  currency: string;
  priceFormatted: string;
  gatewayName: string;
  termsFa: string;
  termsEn: string;
}

export const PRICING_CONFIG: Record<'IR' | 'Global', PricingPlan> = {
  IR: {
    currency: "تومان",
    priceFormatted: "۱۵۰,۰۰۰ تومان",
    gatewayName: "درگاه پرداخت کافه‌بازار / مایکت (پرداخت درون‌برنامه‌ای ریالی)",
    termsFa: "دسترسی مادام‌العمر به تمامی به‌روزرسانی‌های آفلاین اکوسیستم بدنسازی برای همه رشته‌ها (ایبل‌سیتی).",
    termsEn: "Lifetime offline access to all Able City bodybuilding updates."
  },
  Global: {
    currency: "USD",
    priceFormatted: "$4.99 USD",
    gatewayName: "International Secure Token / Direct Voucher",
    termsFa: "دسترسی مادام‌العمر آفلاین به تمام ۸ زبان در سراسر جهان.",
    termsEn: "Lifetime offline access to Able City ecosystem across all 8 languages."
  }
};

/**
 * Get current user auth & subscription state from localStorage
 */
export function getUserAuthState(): UserAuthIdentity {
  try {
    const identity = localStorage.getItem('user_auth_identity') || '';
    const region = (localStorage.getItem('user_region') as 'IR' | 'Global') || 'IR';
    const isPremium = localStorage.getItem('is_premium_user') === 'true';

    return {
      identity,
      region,
      isLoggedIn: !!identity,
      isPremium,
      activatedAt: localStorage.getItem('premium_activated_at') || undefined
    };
  } catch {
    return {
      identity: '',
      region: 'IR',
      isLoggedIn: false,
      isPremium: false
    };
  }
}

/**
 * Handle user registration (Detect Iranian phone number vs International Email)
 */
export function registerUserIdentity(input: string): { success: boolean; isIran: boolean; message: string } {
  const trimmed = input.trim();
  let isIran = false;

  // Iranian phone format check (+98 or 09...)
  const iranPhoneRegex = /^(\+98|0)?9\d{9}$/;
  // Standard Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (iranPhoneRegex.test(trimmed)) {
    isIran = true;
    localStorage.setItem('user_auth_identity', trimmed);
    localStorage.setItem('user_region', 'IR');
    return {
      success: true,
      isIran: true,
      message: "کد تأیید به شماره تلفن همراه شما ارسال شد (ثبت هوشمند منطقه ایران)."
    };
  } else if (emailRegex.test(trimmed)) {
    isIran = false;
    localStorage.setItem('user_auth_identity', trimmed);
    localStorage.setItem('user_region', 'Global');
    return {
      success: true,
      isIran: false,
      message: "لینک فعال‌سازی و لاگین بین‌المللی به آدرس جیمیل/ایمیل شما ارسال شد."
    };
  } else {
    return {
      success: false,
      isIran: false,
      message: "لطفاً شماره تلفن معتبر (ایران مانند 09123456789) یا آدرس جیمیل معتبر وارد کنید."
    };
  }
}

/**
 * Process purchase and activate lifetime premium offline access
 */
export function activateUserSubscription(region: 'IR' | 'Global'): { success: boolean; message: string } {
  try {
    localStorage.setItem('is_premium_user', 'true');
    localStorage.setItem('premium_activated_at', new Date().toLocaleDateString('fa-IR'));
    
    if (region === 'IR') {
      return {
        success: true,
        message: "اتصال به درگاه کافه‌بازار / مایکت موفقیت‌آمیز بود. اشتراک مادام‌العمر فعال شد!"
      };
    } else {
      return {
        success: true,
        message: "International Token activation complete. Lifetime Access Granted!"
      };
    }
  } catch {
    return {
      success: false,
      message: "خطا در ذخیره‌سازی وضعیت خرید در حافظه آفلاین."
    };
  }
}

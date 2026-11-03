import React, { useEffect } from 'react';
import { 
  X, 
  Dumbbell, 
  BookOpen, 
  User, 
  CreditCard, 
  Zap, 
  Trophy, 
  ShieldCheck, 
  FileText, 
  Activity, 
  Sparkles,
  Layers,
  Smartphone,
  Utensils
} from 'lucide-react';
import { ActiveView } from './TopNavbar';
import { UserAuthIdentity } from '../utils/userAuthAndSubscription';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ActiveView) => void;
  activeView: ActiveView;
  userAuth: UserAuthIdentity;
  onOpenAuthModal: (initialTab?: 'register' | 'purchase') => void;
  onOpenPdfModal: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  activeView,
  userAuth,
  onOpenAuthModal,
  onOpenPdfModal,
}) => {
  // Prevent duplicate menu initialization as specified in user script 10
  useEffect(() => {
    const existingMenu = document.getElementById('registered-main-menu');
    if (existingMenu && existingMenu !== document.getElementById('registered-main-menu-root')) {
      console.log('منوی برنامه از قبل ایجاد شده است. از ساخت مجدد جلوگیری شد.');
    }
  }, []);

  if (!isOpen) return null;

  const handleSelectNav = (view: ActiveView) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div 
      id="app-drawer-menu"
      className="fixed inset-0 z-50 flex justify-start bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div 
        id="registered-main-menu" 
        className="w-full max-w-xs bg-[#0e111a] border-l border-r border-[#22293a] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1c2233] bg-[#141926] flex items-center justify-between">
          <div className="flex items-center gap-3 text-right">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5722] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#ff5722]/30">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white leading-tight">شهر توانا (ایبل‌سیتی)</h3>
              <p className="text-[10px] text-[#ff9800] font-bold mt-0.5">بدنسازی برای همه رشته‌ها</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1e2536] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Account Quick Info Box */}
        <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-[#141824] border border-[#232b3f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ff5722]/15 text-[#ff5722] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white max-w-[130px] truncate">
                {userAuth.identity || 'کاربر مهمان'}
              </div>
              <div className="flex items-center gap-1 text-[10px] mt-0.5">
                {userAuth.isPremium ? (
                  <span className="text-amber-400 font-extrabold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> اشتراک ویژه مادام‌العمر
                  </span>
                ) : (
                  <span className="text-neutral-400">نسخه رایگان PWA</span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              onClose();
              onOpenAuthModal(userAuth.isPremium ? 'register' : 'purchase');
            }}
            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#ff5722] text-white hover:bg-[#ff6d00] transition-all"
          >
            {userAuth.isPremium ? 'مدیریت' : 'ارتقا'}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1.5 flex-1">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 mb-1 text-right">
            بخش‌های اصلی برنامه
          </div>

          <button
            onClick={() => handleSelectNav('lab')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView === 'lab'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-amber-300 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>آزمایشگاه ۷گانه بیومکانیک (۱۰۰٪ آفلاین)</span>
            </div>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-extrabold">ویژه</span>
          </button>

          <button
            onClick={() => handleSelectNav('nutrition')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView === 'nutrition'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-neutral-200 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>محاسبه‌گر BMR/TDEE و تغذیه دور تمرین</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold">جدید</span>
          </button>

          <button
            onClick={() => handleSelectNav('script_1')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView.startsWith('script_') && activeView !== 'script_10'
                ? 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30'
                : 'text-neutral-200 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#ff5722]" />
              <span>بدنسازی برای همه رشته‌ها (مبانی و فیزیولوژی)</span>
            </div>
          </button>

          <button
            onClick={() => handleSelectNav('script_10')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView === 'script_10'
                ? 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30'
                : 'text-neutral-200 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>آماده‌سازی پیش‌فصل تیم‌ها (فوتبال، بسکتبال، والیبال)</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold">جدید</span>
          </button>

          <button
            onClick={() => handleSelectNav('encyclopedia')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView === 'encyclopedia'
                ? 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30'
                : 'text-neutral-200 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>دایرةالمعارف مکمل‌ها و بیومکانیک (بدون سانسور)</span>
            </div>
          </button>

          <button
            onClick={() => handleSelectNav('gym')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView === 'gym'
                ? 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30'
                : 'text-neutral-200 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span>ردیاب هوشمند آنلاین/آفلاین باشگاه</span>
            </div>
          </button>

          <button
            onClick={() => handleSelectNav('book')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView === 'book'
                ? 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30'
                : 'text-neutral-200 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>قصه و کتاب‌های آموزشی کودکان و بدنسازی</span>
            </div>
          </button>

          <button
            onClick={() => handleSelectNav('progress')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView === 'progress'
                ? 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30'
                : 'text-neutral-200 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-[#ff9800]" />
              <span>گامیکاسیون و نشان‌های افتخار بیومکانیک</span>
            </div>
          </button>

          <button
            onClick={() => handleSelectNav('teaser')}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold transition-all ${
              activeView === 'teaser'
                ? 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30'
                : 'text-neutral-200 hover:bg-[#151a28]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>استودیو تیزر ۴۵ ثانیه‌ای موشن سینمایی</span>
            </div>
          </button>

          <div className="pt-3 border-t border-[#1a2030] my-2">
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 mb-1 text-right">
              حساب کاربری و خدمات PDF
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAuthModal('register');
              }}
              className="w-full p-3 rounded-xl flex items-center gap-2.5 text-right text-xs font-bold text-neutral-200 hover:bg-[#151a28] transition-all"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>ثبت‌نام / حساب کاربری (شماره همراه / جیمیل)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAuthModal('purchase');
              }}
              className="w-full p-3 rounded-xl flex items-center justify-between text-right text-xs font-bold text-amber-400 hover:bg-[#151a28] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>خرید اشتراک و فعال‌سازی (کافه‌بازار / مایکت)</span>
              </div>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-extrabold">۱۵۰,۰۰۰ تومان</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenPdfModal();
              }}
              className="w-full p-3 rounded-xl flex items-center gap-2.5 text-right text-xs font-bold text-emerald-400 hover:bg-[#151a28] transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>خروجی گرفتن از گزارش‌های PDF آنلاین/آفلاین</span>
            </button>
          </div>
        </div>

        {/* Footer info inside drawer */}
        <div className="p-4 bg-[#0a0c13] border-t border-[#181e2b] text-[10px] text-neutral-400 text-center space-y-1">
          <div>نسخه PWA ایبل‌سیتی: v3.5.0</div>
          <div className="text-neutral-500">مخصوص گوشی‌های Redmi Note 8 و اندروید</div>
        </div>
      </div>

      {/* Backdrop Click */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};

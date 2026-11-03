import React from 'react';
import { Dumbbell, Download, FileText, Globe, Menu, User, ShieldCheck, Zap, Utensils } from 'lucide-react';
import { SupportedLanguage, LANGUAGE_OPTIONS, getI18nText } from '../utils/i18n';
import { UserAuthIdentity } from '../utils/userAuthAndSubscription';

export type ActiveView = 
  | 'script_1' 
  | 'script_2' 
  | 'script_3' 
  | 'script_4' 
  | 'script_5' 
  | 'script_6' 
  | 'script_10'
  | 'gym' 
  | 'book' 
  | 'progress' 
  | 'teaser'
  | 'encyclopedia'
  | 'lab'
  | 'nutrition';

interface TopNavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onInstallPwa: () => void;
  onOpenPdfModal: () => void;
  onOpenDrawer: () => void;
  onOpenAuthModal: (tab?: 'register' | 'purchase') => void;
  pwaInstallable: boolean;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  userAuth: UserAuthIdentity;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeView,
  onNavigate,
  onInstallPwa,
  onOpenPdfModal,
  onOpenDrawer,
  onOpenAuthModal,
  pwaInstallable,
  currentLang,
  onLanguageChange,
  userAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#212638] px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Zone: Hamburger Drawer Menu & Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenDrawer}
            className="p-2 rounded-xl bg-[#181d2a] hover:bg-[#252c3f] border border-[#2d374e] text-white transition-all active:scale-95"
            title="منوی مستتر ایبل‌سیتی"
          >
            <Menu className="w-5 h-5 text-[#ff5722]" />
          </button>

          <button
            onClick={() => onNavigate('script_1')}
            className="flex items-center gap-2.5 text-base sm:text-lg font-black text-white tracking-tight whitespace-nowrap shrink-0 group text-right"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff5722] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#ff5722]/30 shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs sm:text-sm font-black text-white leading-none">بدنسازی برای همه رشته‌ها</span>
              <span className="text-[10px] font-bold text-[#ff9800] tracking-wider mt-0.5">ایبل‌سیتی (Able City)</span>
            </div>
          </button>
        </div>

        {/* Middle Zone: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-2.5 text-xs font-semibold text-neutral-300">
          <button
            onClick={() => onNavigate('script_1')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_1' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            مبانی
          </button>
          <button
            onClick={() => onNavigate('script_2')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_2' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            بالاتنه
          </button>
          <button
            onClick={() => onNavigate('script_3')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_3' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            پایین‌تنه
          </button>
          <button
            onClick={() => onNavigate('script_4')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_4' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            اصلاحی
          </button>
          <button
            onClick={() => onNavigate('script_5')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_5' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            ست‌بندی
          </button>
          <button
            onClick={() => onNavigate('script_6')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_6' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            ریکاوری
          </button>
          <button
            onClick={() => onNavigate('script_10')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_10' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400' : 'hover:text-white'
            }`}
          >
            پیش‌فصل
          </button>

          <button
            onClick={() => onNavigate('lab')}
            className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1 ${
              activeView === 'lab' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : 'hover:text-white text-amber-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>آزمایشگاه ۶گانه آفلاین</span>
          </button>

          <button
            onClick={() => onNavigate('nutrition')}
            className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1 ${
              activeView === 'nutrition' ? 'text-amber-400 font-extrabold border-b-2 border-amber-400' : 'hover:text-white text-neutral-300'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>تغذیه BMR</span>
          </button>

          <button
            onClick={() => onNavigate('encyclopedia')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'encyclopedia' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            دانشنامه
          </button>
          <button
            onClick={() => onNavigate('gym')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'gym' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            باشگاه
          </button>
          <button
            onClick={() => onNavigate('book')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'book' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            کتاب
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'progress' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            نشان‌ها
          </button>
        </nav>

        {/* Right Zone: Primary Actions (User Account VIP, Language, PDF, PWA) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenAuthModal(userAuth.isPremium ? 'register' : 'purchase')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              userAuth.isPremium
                ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 hover:bg-amber-900/50'
                : 'bg-[#181d2a] border-[#2d374e] text-neutral-200 hover:border-[#ff5722]'
            }`}
          >
            {userAuth.isPremium ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">اشتراک VIP</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">ثبت‌نام / خرید</span>
              </>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-[#181d2a] border border-[#2d374e] rounded-xl pr-7 pl-2 py-1.5 text-xs font-bold text-neutral-200 focus:outline-none focus:border-[#ff5722] cursor-pointer appearance-none"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code} className="bg-[#121522] text-white">
                  {opt.flag} {opt.nativeName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenPdfModal}
            className="hidden sm:flex px-3 py-1.5 text-xs font-bold text-[#ff9800] bg-[#1a2030] border border-[#ff9800]/40 hover:bg-[#252d42] active:scale-95 rounded-xl transition-all items-center gap-1.5 whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{getI18nText('pdfExport', currentLang)}</span>
          </button>

          <button
            onClick={onInstallPwa}
            className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#ff5722] to-[#ff9800] hover:from-[#ff6b00] hover:to-[#ffa726] active:scale-95 rounded-xl transition-all shadow-md shadow-[#ff5722]/20 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{getI18nText('pwaInstall', currentLang)}</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroller */}
      <div className="flex xl:hidden items-center gap-2 overflow-x-auto pt-2 pb-0.5 text-xs font-semibold text-neutral-300 no-scrollbar">
        <button
          onClick={() => onNavigate('lab')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 font-bold ${
            activeView === 'lab' ? 'bg-amber-500 text-black' : 'bg-[#181d2a] text-amber-400'
          }`}
        >
          <Zap className="w-3 h-3" />
          آز ۶گانه آفلاین
        </button>

        <button
          onClick={() => onNavigate('nutrition')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 font-bold ${
            activeView === 'nutrition' ? 'bg-amber-500 text-black' : 'bg-[#181d2a] text-amber-300'
          }`}
        >
          <Utensils className="w-3 h-3 text-amber-400" />
          تغذیه BMR
        </button>

        <button
          onClick={() => onNavigate('script_1')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_1' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          مبانی (۱)
        </button>
        <button
          onClick={() => onNavigate('script_2')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_2' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          بالاتنه (۲)
        </button>
        <button
          onClick={() => onNavigate('script_3')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_3' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          پایین‌تنه (۳)
        </button>
        <button
          onClick={() => onNavigate('script_4')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_4' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          اصلاحی (۴)
        </button>
        <button
          onClick={() => onNavigate('script_5')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_5' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          ست‌بندی (۵)
        </button>
        <button
          onClick={() => onNavigate('script_6')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_6' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          ریکاوری (۶)
        </button>
        <button
          onClick={() => onNavigate('script_10')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_10' ? 'bg-emerald-500 text-white font-bold' : 'bg-[#181d2a] text-[#81c784]'
          }`}
        >
          پیش‌فصل (۱۰)
        </button>
        <button
          onClick={() => onNavigate('encyclopedia')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'encyclopedia' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          دانشنامه
        </button>
        <button
          onClick={() => onNavigate('gym')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'gym' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          باشگاه
        </button>
        <button
          onClick={() => onNavigate('book')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'book' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          کتاب
        </button>
        <button
          onClick={() => onNavigate('progress')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'progress' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          نشان‌ها
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { Dumbbell, Download, Sparkles } from 'lucide-react';

export type ActiveView = 
  | 'script_1' 
  | 'script_2' 
  | 'script_3' 
  | 'script_4' 
  | 'script_5' 
  | 'script_6' 
  | 'gym' 
  | 'book' 
  | 'progress' 
  | 'teaser';

interface TopNavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onInstallPwa: () => void;
  pwaInstallable: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeView,
  onNavigate,
  onInstallPwa,
  pwaInstallable,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#212638] px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('script_1')}
          className="flex items-center gap-2 text-lg sm:text-xl font-black text-white tracking-tight whitespace-nowrap shrink-0 group text-right"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff5722] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#ff5722]/30">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span>ایبل‌سیتی</span>
          <span className="text-xs font-athletic text-[#ff9800] uppercase tracking-wider">Able City</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden xl:flex items-center gap-3 text-xs font-semibold text-neutral-300">
          <button
            onClick={() => onNavigate('script_1')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_1' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            اسکریپت ۱: مبانی
          </button>
          <button
            onClick={() => onNavigate('script_2')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_2' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            اسکریپت ۲: بالاتنه
          </button>
          <button
            onClick={() => onNavigate('script_3')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_3' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            اسکریپت ۳: پایین‌تنه
          </button>
          <button
            onClick={() => onNavigate('script_4')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_4' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            اسکریپت ۴: اصلاحی
          </button>
          <button
            onClick={() => onNavigate('script_5')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_5' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            اسکریپت ۵: ست‌بندی
          </button>
          <button
            onClick={() => onNavigate('script_6')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'script_6' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            اسکریپت ۶: ریکاوری
          </button>
          <button
            onClick={() => onNavigate('gym')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'gym' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            ردیاب باشگاهی
          </button>
          <button
            onClick={() => onNavigate('book')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'book' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            کتاب و لایتنر
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'progress' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            نشان‌ها
          </button>
          <button
            onClick={() => onNavigate('teaser')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'teaser' ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722]' : 'hover:text-white'
            }`}
          >
            تیزر ۴۵ ثانیه
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onInstallPwa}
            className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#ff5722] to-[#ff9800] hover:from-[#ff6b00] hover:to-[#ffa726] active:scale-95 rounded-xl transition-all shadow-md shadow-[#ff5722]/20 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>نصب PWA روی موبایل</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroller */}
      <div className="flex xl:hidden items-center gap-2 overflow-x-auto pt-2.5 pb-1 text-xs font-semibold text-neutral-300 no-scrollbar">
        <button
          onClick={() => onNavigate('script_1')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_1' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          اسکریپت ۱
        </button>
        <button
          onClick={() => onNavigate('script_2')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_2' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          اسکریپت ۲
        </button>
        <button
          onClick={() => onNavigate('script_3')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_3' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          اسکریپت ۳
        </button>
        <button
          onClick={() => onNavigate('script_4')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_4' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          اسکریپت ۴
        </button>
        <button
          onClick={() => onNavigate('script_5')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_5' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          اسکریپت ۵
        </button>
        <button
          onClick={() => onNavigate('script_6')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'script_6' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          اسکریپت ۶
        </button>
        <button
          onClick={() => onNavigate('gym')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'gym' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          باشگاه
        </button>
        <button
          onClick={() => onNavigate('book')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'book' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          کتاب
        </button>
        <button
          onClick={() => onNavigate('progress')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'progress' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          نشان‌ها
        </button>
        <button
          onClick={() => onNavigate('teaser')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeView === 'teaser' ? 'bg-[#ff5722] text-white' : 'bg-[#181d2a] text-neutral-300'
          }`}
        >
          تیزر
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { Eye, Type, Zap, RefreshCw, EyeOff, Brain } from 'lucide-react';
import { AccessibilitySettings } from '../utils/accessibilityState';

interface AccessibilityToolbarProps {
  settings: AccessibilitySettings;
  onChangeSettings: (newSettings: AccessibilitySettings) => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  settings,
  onChangeSettings,
}) => {
  const handleAdjustFontSize = (delta: number) => {
    let newSize = settings.fontSizePx + delta;
    if (newSize < 12) newSize = 12;
    if (newSize > 28) newSize = 28;

    const updated = { ...settings, fontSizePx: newSize };
    onChangeSettings(updated);
  };

  const handleToggleHighContrast = () => {
    const updated = { ...settings, isHighContrast: !settings.isHighContrast };
    onChangeSettings(updated);
  };

  const handleToggleAdhdFocus = () => {
    const updated = { ...settings, isAdhdFocusMode: !settings.isAdhdFocusMode };
    onChangeSettings(updated);
  };

  const handleReset = () => {
    onChangeSettings({
      fontSizePx: 16,
      isHighContrast: false,
      isAdhdFocusMode: false,
    });
  };

  return (
    <div className="accessibility-toolbar bg-[#1e2736] border-b-2 border-[#ff5722]/60 text-white px-3 sm:px-5 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Title / Icon */}
      <div className="flex items-center gap-2 font-bold text-amber-400 shrink-0">
        <span className="text-base" role="img" aria-label="accessibility">♿</span>
        <span>دسترس‌پذیری و حالت ADHD (مطالعه آسان)</span>
      </div>

      {/* Control Buttons Group */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {/* Font Increase A+ */}
        <button
          onClick={() => handleAdjustFontSize(2)}
          className="bg-[#2c374d] hover:bg-[#3a4863] active:scale-95 text-white border border-neutral-400 px-2.5 py-1 rounded-lg font-black font-mono transition-all flex items-center gap-1 shadow"
          title="بزرگ کردن متن (A+)"
        >
          <Type className="w-3.5 h-3.5 text-emerald-400" />
          <span>A+</span>
        </button>

        {/* Font Decrease A- */}
        <button
          onClick={() => handleAdjustFontSize(-2)}
          className="bg-[#2c374d] hover:bg-[#3a4863] active:scale-95 text-white border border-neutral-400 px-2.5 py-1 rounded-lg font-black font-mono transition-all flex items-center gap-1 shadow"
          title="کوچک کردن متن (A-)"
        >
          <Type className="w-3.5 h-3.5 text-rose-400" />
          <span>A-</span>
        </button>

        {/* Font size indicator */}
        <span className="text-[11px] font-mono bg-[#121622] px-2 py-1 rounded-md text-amber-300 font-bold border border-[#2b354c]">
          {settings.fontSizePx}px
        </span>

        {/* High Contrast Toggle */}
        <button
          onClick={handleToggleHighContrast}
          className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow active:scale-95 border ${
            settings.isHighContrast
              ? 'bg-[#e74c3c] text-white border-amber-300 ring-2 ring-amber-300/50'
              : 'bg-[#2c374d] text-neutral-200 border-neutral-500 hover:text-white'
          }`}
          title="حالت کنتراست بالا برای معلولین بینایی"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>کنتراست بالا {settings.isHighContrast ? '(فعال)' : ''}</span>
        </button>

        {/* ADHD Focus Mode Toggle */}
        <button
          onClick={handleToggleAdhdFocus}
          className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow active:scale-95 border ${
            settings.isAdhdFocusMode
              ? 'bg-[#f39c12] text-black font-black border-amber-200 ring-2 ring-amber-400/60'
              : 'bg-[#2c374d] text-neutral-200 border-neutral-500 hover:text-white'
          }`}
          title="حالت تمرکز ویژه ADHD (کاهش محرک‌های اضافی و افزایش فاصله خطوط)"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>حالت تمرکز (ADHD) {settings.isAdhdFocusMode ? '(فعال)' : ''}</span>
        </button>

        {/* Reset settings button */}
        {(settings.fontSizePx !== 16 || settings.isHighContrast || settings.isAdhdFocusMode) && (
          <button
            onClick={handleReset}
            className="bg-[#382228] hover:bg-[#4d2d35] text-rose-300 border border-rose-500/50 px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1"
            title="بازنشانی تنظیمات"
          >
            <RefreshCw className="w-3 h-3" />
            <span>ریست</span>
          </button>
        )}
      </div>
    </div>
  );
};

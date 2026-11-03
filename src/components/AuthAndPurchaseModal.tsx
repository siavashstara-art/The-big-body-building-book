import React, { useState } from 'react';
import { X, User, CreditCard, ShieldCheck, CheckCircle2, Phone, Mail, Sparkles, ShoppingBag, Globe, AlertCircle } from 'lucide-react';
import { 
  registerUserIdentity, 
  activateUserSubscription, 
  PRICING_CONFIG, 
  UserAuthIdentity 
} from '../utils/userAuthAndSubscription';

interface AuthAndPurchaseModalProps {
  isOpen: boolean;
  initialTab?: 'register' | 'purchase';
  onClose: () => void;
  userAuth: UserAuthIdentity;
  onRefreshAuthState: () => void;
}

export const AuthAndPurchaseModal: React.FC<AuthAndPurchaseModalProps> = ({
  isOpen,
  initialTab = 'register',
  onClose,
  userAuth,
  onRefreshAuthState,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'purchase'>(initialTab);
  
  // Registration State
  const [identityInput, setIdentityInput] = useState(userAuth.identity || '');
  const [regStatus, setRegStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Purchase State
  const [selectedRegion, setSelectedRegion] = useState<'IR' | 'Global'>(userAuth.region || 'IR');
  const [purchaseStatus, setPurchaseStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityInput.trim()) return;

    const result = registerUserIdentity(identityInput);
    setRegStatus(result);
    onRefreshAuthState();

    if (result.success) {
      if (result.isIran) {
        setSelectedRegion('IR');
      } else {
        setSelectedRegion('Global');
      }
    }
  };

  const handleActivateSubscription = () => {
    const result = activateUserSubscription(selectedRegion);
    setPurchaseStatus(result);
    onRefreshAuthState();
  };

  const currentPlan = PRICING_CONFIG[selectedRegion];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#101420] border-2 border-[#ff5722]/50 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#171c2b] border-b border-[#242c42] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5722] to-amber-500 flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-base font-black text-white">حساب کاربری و فعال‌سازی اشتراک</h3>
              <p className="text-[10px] text-[#ff9800] font-bold">سامانه هوشمند ایبل‌سیتی (Able City)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#22293b] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-[#212739] bg-[#0d101a]">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'register'
                ? 'border-[#ff5722] text-[#ff5722] bg-[#141824]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>ثبت‌نام و هویت‌سنجی</span>
          </button>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'purchase'
                ? 'border-[#ff5722] text-amber-400 bg-[#141824]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>خرید اشتراک و فعال‌سازی</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-right">
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="bg-[#161b29] p-4 rounded-2xl border border-[#232a3d] space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>ورود هوشمند با شماره موبایل (ایران) یا جیمیل (بین‌الملل)</span>
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  سیستم به صورت اتوماتیک فرمت شماره‌های همراه کشور ایران (+98 / 09) را تشخیص داده و الگوی ریالی کافه‌بازار/مایکت را تنظیم می‌کند.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-neutral-300">
                  شماره موبایل یا آدرس جیمیل:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identityInput}
                    onChange={(e) => setIdentityInput(e.target.value)}
                    placeholder="مثال: 09123456789 یا user@gmail.com"
                    dir="ltr"
                    className="w-full bg-[#0b0e17] border border-[#262e45] focus:border-[#ff5722] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all text-left font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#ff9800] hover:from-[#ff6d00] hover:to-[#ffa726] text-white font-bold text-xs shadow-lg shadow-[#ff5722]/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ثبت و ارسال کد / تایید هویت</span>
                </button>
              </form>

              {regStatus && (
                <div className={`p-4 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  regStatus.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  {regStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed">{regStatus.message}</div>
                </div>
              )}

              {userAuth.isLoggedIn && (
                <div className="p-4 rounded-2xl bg-[#141a27] border border-[#232b3e] text-xs space-y-1">
                  <div className="text-neutral-400">وضعیت فعلی حساب:</div>
                  <div className="font-mono text-white dir-ltr text-right">{userAuth.identity}</div>
                  <div className="text-amber-400 text-[11px] font-bold mt-1">
                    منطقه فعال: {userAuth.region === 'IR' ? 'ایران (ریالی)' : 'بین‌المللی (USD)'}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'purchase' && (
            <div className="space-y-4">
              {/* Region Selector */}
              <div className="flex items-center justify-between bg-[#141926] p-2 rounded-2xl border border-[#222a3d]">
                <button
                  type="button"
                  onClick={() => setSelectedRegion('IR')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRegion === 'IR'
                      ? 'bg-[#ff5722] text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>کافه‌بازار / مایکت (۱۵۰ هزار تومان)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRegion('Global')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRegion === 'Global'
                      ? 'bg-[#ff5722] text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>بین‌المللی ($4.99 USD)</span>
                </button>
              </div>

              {/* Pricing Card Details */}
              <div className="bg-gradient-to-br from-[#181f30] to-[#111522] p-5 rounded-2xl border-2 border-amber-500/40 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    اشتراک مادام‌العمر آفلاین PWA
                  </div>
                  <div className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-black">
                    VIP ACCESS
                  </div>
                </div>

                <div className="text-2xl font-black text-white font-mono">
                  {currentPlan.priceFormatted}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {currentPlan.termsFa}
                </p>

                <div className="text-[10px] text-neutral-400 bg-[#0d101a] p-2.5 rounded-xl border border-[#21293b]">
                  {currentPlan.gatewayName}
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>دسترسی کامل به تمام ۶ اسکریپت بیومکانیک و اسکریپت ۱۰ پیش‌فصل</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>دایرةالمعارف مکمل‌ها، فارماکولوژی و فیزیولوژی بدون سانسور</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تولید و دانلود گزارش‌های PDF تخصصی روی حافظه گوشی</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>پشتیبانی کامل از ۸ زبان زنده دنیا به همراه دیکشنری آفلاین</span>
                </div>
              </div>

              {/* Activation Button */}
              {userAuth.isPremium ? (
                <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-center space-y-1">
                  <ShieldCheck className="w-6 h-6 text-amber-400 mx-auto" />
                  <div className="text-xs font-black text-amber-300">اشتراک شما فعال است!</div>
                  <div className="text-[10px] text-neutral-400">تاریخ فعال‌سازی: {userAuth.activatedAt || 'مادام‌العمر'}</div>
                </div>
              ) : (
                <button
                  onClick={handleActivateSubscription}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>پرداخت و فعال‌سازی آنی اشتراک ({currentPlan.priceFormatted})</span>
                </button>
              )}

              {purchaseStatus && (
                <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
                  purchaseStatus.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{purchaseStatus.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0c0f18] border-t border-[#1d2436] flex items-center justify-between text-xs text-neutral-400">
          <div>قابلیت اجرا روی کلیه مرورگرها و پلتفرم PWA</div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1a2030] hover:bg-[#252d42] text-white font-bold transition-all"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

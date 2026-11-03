import React, { useState } from 'react';
import { 
  BookOpen, 
  Dna, 
  Zap, 
  Flame, 
  Activity, 
  ShieldCheck, 
  Search, 
  Volume2, 
  VolumeX, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowLeft,
  ChevronRight,
  Info,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SKELETON_DATA, 
  MUSCLE_FIBERS, 
  SOMATOTYPES, 
  ATP_CYCLE_STEPS, 
  SUPPLEMENT_ENCYCLOPEDIA, 
  SupplementInfo 
} from '../data/encyclopediaData';
import { speakPersian, stopPersianSpeech } from '../utils/speechVoice';
import { playSuccessChime, playTimerBeep } from '../utils/soundEffects';

interface EncyclopediaSectionProps {
  onUnlockBadge: (badgeId: string) => void;
  isUnlocked: boolean;
}

export const EncyclopediaSection: React.FC<EncyclopediaSectionProps> = ({
  onUnlockBadge,
  isUnlocked,
}) => {
  // Main Encyclopedia Tab
  const [activeTab, setActiveTab] = useState<'skeleton' | 'fibers' | 'somatotypes' | 'atp' | 'supplements'>('skeleton');

  // Search & Filter for Supplements
  const [supplementSearch, setSupplementSearch] = useState<string>('');
  const [supplementCategory, setSupplementCategory] = useState<'all' | 'performance' | 'herbal' | 'recovery' | 'pharmacology'>('all');

  // Somatotype Quick Diagnostic State
  const [wristSize, setWristSize] = useState<'thin' | 'medium' | 'thick'>('medium');
  const [metabolismSpeed, setMetabolismSpeed] = useState<'fast' | 'normal' | 'slow'>('normal');

  // ATP Cycle active step
  const [activeAtpStep, setActiveAtpStep] = useState<number>(1);

  // Audio voiceover state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Badge Status
  const [badgeAwarded, setBadgeAwarded] = useState<boolean>(isUnlocked);

  const toggleSpeech = (text: string) => {
    if (isSpeaking) {
      stopPersianSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakPersian(text, () => setIsSpeaking(false));
    }
  };

  const handleClaimBadge = () => {
    setBadgeAwarded(true);
    onUnlockBadge('biochem_scholar');
    playSuccessChime();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00e676', '#ff9800', '#ff5722', '#ffffff'],
      });
    } catch {
      // fallback
    }
  };

  // Filtered Supplements
  const filteredSupplements = SUPPLEMENT_ENCYCLOPEDIA.filter((item) => {
    const matchesSearch = item.nameFa.toLowerCase().includes(supplementSearch.toLowerCase()) ||
                          item.nameEn.toLowerCase().includes(supplementSearch.toLowerCase()) ||
                          item.biochemMechanismFa.toLowerCase().includes(supplementSearch.toLowerCase());
    const matchesCategory = supplementCategory === 'all' || item.category === supplementCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-3 sm:px-4 pb-16">
      {/* Header */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">دانشنامه جامع ایبل‌سیتی</span>
          <span aria-hidden="true">·</span>
          <span>فیزیولوژی سلولی و سیستم‌های تمرینی</span>
          <span aria-hidden="true">·</span>
          <span>ویژه پژوهشگران و ورزشکاران بزرگسال</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          دایرةالمعارف بیومکانیک اسکلتی، فیبرهای عضلانی، چرخه ATP و مکمل‌ها
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          کاوش در اعماق معماری اسکلت انسان، کینتیک فیبرهای تندانقباض و کندانقباض، تبدیل سلولی غذا به مولکول ATP و دایرةالمعارف علمی مکمل‌های ارتقای عملکرد
        </p>
      </div>

      {/* Main Encyclopedia Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121624] border border-[#242c40] rounded-2xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('skeleton')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'skeleton' ? 'bg-[#ff5722] text-white shadow-md' : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>۱. اسکلت محوری و ضمیمه</span>
        </button>

        <button
          onClick={() => setActiveTab('fibers')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'fibers' ? 'bg-[#ff5722] text-white shadow-md' : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Dna className="w-4 h-4" />
          <span>۲. فیبرهای تند و کندانقباض</span>
        </button>

        <button
          onClick={() => setActiveTab('somatotypes')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'somatotypes' ? 'bg-[#ff5722] text-white shadow-md' : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>۳. تیپ‌های بدنی (Somatotypes)</span>
        </button>

        <button
          onClick={() => setActiveTab('atp')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'atp' ? 'bg-[#ff5722] text-white shadow-md' : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>۴. راکتور سنتز ATP</span>
        </button>

        <button
          onClick={() => setActiveTab('supplements')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'supplements' ? 'bg-[#ff5722] text-white shadow-md' : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>۵. دایرةالمعارف مکمل‌ها</span>
        </button>
      </div>

      {/* TAB 1: SKELETAL ANATOMY (AXIAL VS APPENDICULAR) */}
      {activeTab === 'skeleton' && (
        <div className="space-y-6">
          <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#212739] pb-4">
              <div>
                <span className="text-xs text-[#ff5722] font-semibold">ساختار استخوانی و اهرم‌ها</span>
                <h2 className="text-xl font-bold text-white mt-0.5">اسکلت محوری در برابر اسکلت ضمیمه</h2>
              </div>
              <button
                onClick={() => toggleSpeech('ساختار اسکلتی انسان بستر اصلی انتقال نیرو و مفاصل است که به دو بخش اسکلت محوری و اسکلت ضمیمه تقسیم میشود.')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1d2334] text-xs font-semibold text-neutral-200 border border-[#2f3950]"
              >
                <Volume2 className="w-4 h-4 text-[#ff5722]" />
                <span>شنیدن توضیحات</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SKELETON_DATA.map((sk) => (
                <div key={sk.id} className="bg-[#161a28] border border-[#2a334a] rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{sk.titleFa}</h3>
                    <span className="text-xs font-mono text-neutral-400">{sk.titleEn}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {sk.summaryFa}
                  </p>

                  <div className="bg-[#0e111a] p-3.5 rounded-xl border border-[#232a3e]">
                    <span className="text-xs font-bold text-[#ff9800] block mb-2">استخوان‌های کلیدی:</span>
                    <ul className="text-xs text-neutral-300 space-y-1">
                      {sk.bones.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#ff5722]">▪</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-neutral-200 bg-[#121624] p-3 rounded-lg border border-[#202738]">
                    <span className="text-emerald-400 font-bold">عملکرد بیومکانیکی: </span>
                    {sk.biomechanicalFunctionFa}
                  </div>

                  <div className="text-xs text-amber-300 bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg">
                    <span className="font-bold">نکته ایمنی ستون فقرات: </span>
                    {sk.keySafetyTipFa}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MUSCLE FIBERS (FAST-TWITCH VS SLOW-TWITCH) */}
      {activeTab === 'fibers' && (
        <div className="space-y-6">
          <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">فیبرهای تندانقباض (سفید) در برابر کُندانقباض (قرمز)</h2>
            <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
              تفاوت فیزیولوژیک در سرعت انتقال پیام عصبی، چگالی میتوکندری، عروق خونی و پاسخ به مسیرهای سنتز پروتئین عضلانی
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MUSCLE_FIBERS.map((f) => (
                <div key={f.id} className="bg-[#161a28] border border-[#2a334a] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#252c3e] pb-3">
                    <h3 className="text-base font-bold text-white">{f.nameFa}</h3>
                    <span className="text-xs font-mono text-neutral-400">{f.nameEn}</span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {f.descriptionFa}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                      <span className="text-[11px] text-neutral-400 block">سرعت انقباض:</span>
                      <span className="font-athletic font-bold text-[#ff9800]">{f.speed}</span>
                    </div>
                    <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                      <span className="text-[11px] text-neutral-400 block">مقاومت در برابر خستگی:</span>
                      <span className="font-bold text-white">{f.fatigueResistance}</span>
                    </div>
                    <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                      <span className="text-[11px] text-neutral-400 block">مسیر متابولیک:</span>
                      <span className="font-bold text-emerald-400">{f.metabolism}</span>
                    </div>
                    <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                      <span className="text-[11px] text-neutral-400 block">تراکم میتوکندری:</span>
                      <span className="font-bold text-sky-400">{f.mitochondriaDensity}</span>
                    </div>
                  </div>

                  <div className="bg-[#121624] p-3.5 rounded-xl border border-[#222a3d]">
                    <span className="text-xs font-bold text-[#ff5722] block mb-1">استراتژی تمرینی بهینه:</span>
                    <span className="text-xs text-neutral-200 leading-relaxed">{f.optimalTrainingFa}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOMATOTYPES & NUTRITION BLUEPRINTS */}
      {activeTab === 'somatotypes' && (
        <div className="space-y-6">
          <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">تیپ‌های بدنی سه‌گانه (Somatotypes)</h2>
            <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
              تحلیل آناتومیک و متابولیک اکتومورف، مزومورف و اندومورف جهت تنظیم استراتژی کالری و بار تمرینی
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SOMATOTYPES.map((s) => (
                <div key={s.id} className="bg-[#161a28] border border-[#2a334a] rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{s.nameFa}</h3>
                    <div className="text-xs text-neutral-400 font-mono mb-2">{s.nameEn}</div>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                      {s.appearanceFa}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                        <span className="text-[#ff9800] font-bold block mb-0.5">نرخ متابولیسم:</span>
                        <span className="text-neutral-200">{s.metabolicRateFa}</span>
                      </div>

                      <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                        <span className="text-emerald-400 font-bold block mb-0.5">استراتژی تمرین:</span>
                        <span className="text-neutral-200">{s.trainingStrategyFa}</span>
                      </div>

                      <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                        <span className="text-sky-400 font-bold block mb-0.5">استراتژی تغذیه:</span>
                        <span className="text-neutral-200">{s.nutritionStrategyFa}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-amber-300 border-t border-[#232b3e]">
                    هشدار کلیدی: {s.cautionsFa}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ATP CELLULAR ENERGY ENGINE */}
      {activeTab === 'atp' && (
        <div className="space-y-6">
          <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs text-[#ff5722] font-semibold">بیوشیمی سلولی</span>
                <h2 className="text-xl font-bold text-white mt-0.5">چرخه تبدیل غذا به مولکول پرانرژی ATP</h2>
              </div>
              <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded-xl">
                ATP ➔ ADP + Phosphate + Mechanical Work
              </div>
            </div>

            {/* Interactive Step Navigator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {ATP_CYCLE_STEPS.map((step) => (
                <button
                  key={step.stepNumber}
                  onClick={() => setActiveAtpStep(step.stepNumber)}
                  className={`p-3 rounded-xl border text-right transition-all ${
                    activeAtpStep === step.stepNumber
                      ? 'bg-[#1e2538] border-[#ff5722] text-white shadow-lg shadow-[#ff5722]/20'
                      : 'bg-[#151926] border-[#293245] text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-[11px] text-[#ff9800] block">گام {step.stepNumber}</span>
                  <span className="text-xs font-bold truncate block">{step.titleFa.split('(')[0]}</span>
                </button>
              ))}
            </div>

            {/* Active Step Details */}
            {(() => {
              const step = ATP_CYCLE_STEPS.find(s => s.stepNumber === activeAtpStep) || ATP_CYCLE_STEPS[0];
              return (
                <div className="bg-[#0e111a] border-2 border-[#2b354c] rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#242b3d] pb-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {step.titleFa}
                    </h3>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800">
                      بازده انرژی: {step.energyYieldFa}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {step.biochemProcessFa}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#141825] p-3 rounded-xl border border-[#232a3d]">
                      <span className="text-[#ff9800] font-bold block mb-1">محل رخداد در سلول:</span>
                      <span className="text-neutral-300">{step.locationFa}</span>
                    </div>

                    <div className="bg-[#141825] p-3 rounded-xl border border-[#232a3d]">
                      <span className="text-sky-400 font-bold block mb-1">جزئیات انقباض عضلانی:</span>
                      <span className="text-neutral-300">{step.cellularDetailsFa}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 5: SUPPLEMENT ENCYCLOPEDIA (UNCENSORED & EVIDENCE-BASED) */}
      {activeTab === 'supplements' && (
        <div className="space-y-6">
          <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs text-[#ff5722] font-semibold">دایرةالمعارف علمی ترکیبات</span>
                <h2 className="text-xl font-bold text-white mt-0.5">مکمل‌ها و آداپتوژن‌های گیاهی ارتقای عملکرد</h2>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="جستجو در ترکیبات..."
                  value={supplementSearch}
                  onChange={(e) => setSupplementSearch(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2c364e] rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5722]"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'همه ترکیبات' },
                { id: 'performance', label: 'عملکرد و توان (Performance)' },
                { id: 'herbal', label: 'گیاهان آداپتوژن و هورمونی' },
                { id: 'recovery', label: 'ریکاوری و سیستم ایمنی' },
                { id: 'pharmacology', label: 'تحلیل بالینی مهار آسیب (HGH و استروئیدها)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSupplementCategory(c.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    supplementCategory === c.id
                      ? 'bg-[#ff5722] text-white'
                      : 'bg-[#181d2a] text-neutral-300 hover:bg-[#22293c]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Supplements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSupplements.map((item) => (
                <div key={item.id} className="bg-[#161a28] border border-[#2a334a] rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b border-[#252c3e] pb-2 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white">{item.nameFa}</h3>
                        <span className="text-xs font-mono text-neutral-400">{item.nameEn}</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                        {item.clinicalEvidenceGrade}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                      <span className="text-[#ff9800] font-semibold">مکانیسم بیوشیمیایی: </span>
                      {item.biochemMechanismFa}
                    </p>

                    <div className="space-y-1.5 text-xs">
                      <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                        <span className="text-sky-400 font-bold">دوز بهینه: </span>
                        <span className="text-neutral-200">{item.optimalDosageFa}</span>
                      </div>

                      <div className="bg-[#0e111a] p-2.5 rounded-lg border border-[#242b3e]">
                        <span className="text-emerald-400 font-bold">هم‌افزایی (Stack): </span>
                        <span className="text-neutral-200">{item.synergyStackFa}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-400 pt-2 border-t border-[#232b3e]">
                    ایمنی: {item.safetyProfileFa}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CLAIM SCHOLAR BADGE */}
      <section className="bg-gradient-to-t from-[#161a29] to-[#111420] border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            نشان قدرت: «پژوهشگر فیزیولوژی سلولی» (Cellular Physiology Scholar)
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto mt-1 leading-relaxed">
            با مطالعه و درک عمیق اسکلت محوری، انواع فیبرهای عضلانی، چرخه تولید ATP و مکمل‌های ورزشی، نشان افتخار علمی خود را ثبت کنید.
          </p>
        </div>

        <button
          onClick={handleClaimBadge}
          className="py-4 px-8 rounded-xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 transition-all shadow-xl shadow-emerald-600/30"
        >
          {badgeAwarded ? 'نشان در پروفایل شما ثبت شده است ✓' : 'ثبت درک دانشنامه و دریافت نشان افتخار'}
        </button>
      </section>
    </div>
  );
};

import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Dumbbell, 
  Compass, 
  Mic, 
  BookOpen, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { POWER_BADGES } from '../data/biomechanicsData';

interface ProgressGamificationProps {
  unlockedBadgeIds: string[];
}

export const ProgressGamification: React.FC<ProgressGamificationProps> = ({
  unlockedBadgeIds,
}) => {
  // Weekly progressive overload mock data reflecting continuous upward trend
  const weeklyVolume = [
    { week: 'هفته ۱', volume: 3800, intensity: '70%' },
    { week: 'هفته ۲', volume: 4400, intensity: '75%' },
    { week: 'هفته ۳', volume: 5100, intensity: '80%' },
    { week: 'هفته ۴', volume: 5850, intensity: '85%' },
  ];

  const personalRecords = [
    { exercise: 'پرس سینه بیومکانیک (زاویه ۷۵ درجه)', pr: '95 kg', reps: '6 reps', date: 'امروز' },
    { exercise: 'اسکات کامل با لولای لگن', pr: '135 kg', reps: '5 reps', date: 'دیروز' },
    { exercise: 'ددلیفت رومانیایی (RDL)', pr: '120 kg', reps: '8 reps', date: '۳ روز پیش' },
    { exercise: 'زیربغل لت با مچ خنثی', pr: '85 kg', reps: '10 reps', date: '۵ روز پیش' },
  ];

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-6 h-6" />;
      case 'Dumbbell': return <Dumbbell className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldCheck className="w-6 h-6" />;
      case 'Award': return <Award className="w-6 h-6" />;
      case 'Activity': return <TrendingUp className="w-6 h-6" />;
      case 'Mic': return <Mic className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const unlockedCount = unlockedBadgeIds.length;
  const totalBadges = Object.keys(POWER_BADGES).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-4 pb-14">
      {/* Title */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">گیمیفیکیشن و پیشرفت</span>
          <span aria-hidden="true">·</span>
          <span>افزایش بار فزاینده (Progressive Overload)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          سامانه رکوردهای وزنه و نشان‌های قدرت بیومکانیک
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          پایش علمی تناژ تمرینی، ثبت وزنه‌ها و ارزیابی بهره‌وری عضلانی بدون آسیب
        </p>
      </div>

      {/* OVERLOAD ASCENDING CHART */}
      <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-[#ff5722]" />
            <h2 className="text-lg font-bold text-white">روند صعودی حجم تمرینات (Weekly Tonnage)</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            روند صعودی +۵۳٪ از آغاز چرخه
          </span>
        </div>

        <div className="bg-[#0b0c12] border border-[#212739] rounded-xl p-5 mb-4">
          <div className="flex items-end justify-between gap-4 h-48 px-2 pt-8">
            {weeklyVolume.map((item, idx) => {
              const maxVol = 6500;
              const hPercent = (item.volume / maxVol) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-bold font-athletic text-[#ff9800]">
                    {item.volume.toLocaleString('fa-IR')} kg
                  </span>
                  <div
                    style={{ height: `${hPercent}%` }}
                    className="w-full max-w-[56px] bg-gradient-to-t from-[#ff5722] to-[#ff9800] rounded-t-xl transition-all duration-700 shadow-lg shadow-[#ff5722]/20"
                  />
                  <div className="text-center mt-1">
                    <div className="text-xs font-bold text-white">{item.week}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">شدت {item.intensity}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PERSONAL RECORDS (PRs) */}
      <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <Dumbbell className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">بیشینه رکوردهای بیومکانیک (PRs)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personalRecords.map((pr, idx) => (
            <div
              key={idx}
              className="bg-[#171c2b] border border-[#293246] rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{pr.exercise}</h4>
                <span className="text-[11px] text-neutral-400">آخرین ثبت: {pr.date}</span>
              </div>
              <div className="text-left dir-ltr">
                <div className="text-xl font-black font-athletic text-[#ff9800]">{pr.pr}</div>
                <div className="text-[11px] text-neutral-400 font-mono">{pr.reps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POWER BADGES (نشان‌های قدرت) */}
      <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#ff5722]" />
            <h2 className="text-lg font-bold text-white">کلکسیون نشان‌های قدرت (Badges)</h2>
          </div>
          <span className="text-xs font-bold text-neutral-300">
            {unlockedCount} از {totalBadges} باز شده
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.entries(POWER_BADGES).map(([id, badge]) => {
            const isUnlocked = unlockedBadgeIds.includes(id);
            return (
              <div
                key={id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-[#1a2030] to-[#141926] border-[#ff5722]/50 shadow-lg shadow-[#ff5722]/10'
                    : 'bg-[#10121a] border-[#222736] opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-[#ff5722]/20 border-[#ff5722] text-[#ff7043]'
                      : 'bg-[#1b1f2b] border-[#2b3346] text-neutral-600'
                  }`}
                >
                  {isUnlocked ? getBadgeIcon(badge.icon) : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{badge.titleFa}</h4>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">{badge.titleEn}</div>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    {badge.descFa}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

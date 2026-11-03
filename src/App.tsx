import React, { useState, useEffect } from 'react';
import { TopNavbar, ActiveView } from './components/TopNavbar';
import { ScriptOneFoundations } from './components/ScriptOneFoundations';
import { ScriptTwoUpperBody } from './components/ScriptTwoUpperBody';
import { ScriptThreeLowerBody } from './components/ScriptThreeLowerBody';
import { ScriptFourCorrective } from './components/ScriptFourCorrective';
import { ScriptFiveOverload } from './components/ScriptFiveOverload';
import { ScriptSixBiochemRecovery } from './components/ScriptSixBiochemRecovery';
import { GymTracker } from './components/GymTracker';
import { BookSection } from './components/BookSection';
import { ProgressGamification } from './components/ProgressGamification';
import { TeaserMotionStudio } from './components/TeaserMotionStudio';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { MuscleId, ExerciseBiomechanical } from './types';
import { BIOMECHANICAL_EXERCISES, MUSCLE_GROUPS } from './data/biomechanicsData';
import { playSuccessChime } from './utils/soundEffects';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('script_1');

  // Badge Storage in localStorage
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('able_city_badges');
      return saved ? JSON.parse(saved) : ['movement_engineer'];
    } catch {
      return ['movement_engineer'];
    }
  });

  // Modal for Exercise Detail Inspection
  const [inspectingExercise, setInspectingExercise] = useState<ExerciseBiomechanical | null>(null);

  // Exercise preloaded into Gym Tracker
  const [preloadedGymExercise, setPreloadedGymExercise] = useState<ExerciseBiomechanical | null>(null);

  // Newly Unlocked Toast
  const [unlockedToast, setUnlockedToast] = useState<string | null>(null);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('able_city_badges', JSON.stringify(unlockedBadges));
    } catch {
      // ignore
    }
  }, [unlockedBadges]);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleUnlockBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges(prev => [...prev, badgeId]);
      playSuccessChime();
      setUnlockedToast(`نشان جدید آنلاک شد: ${badgeId}`);
      setTimeout(() => setUnlockedToast(null), 4000);
    }
  };

  const handleSelectMuscleDetail = (muscleId: MuscleId) => {
    // Find representative biomechanical exercise for this muscle
    const ex = BIOMECHANICAL_EXERCISES.find(e => e.muscleId === muscleId) || BIOMECHANICAL_EXERCISES[0];
    setInspectingExercise(ex);
  };

  const handleLogExerciseInGym = (exercise: ExerciseBiomechanical) => {
    setPreloadedGymExercise(exercise);
    setActiveView('gym');
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowPwaModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e0e2ec] flex flex-col selection:bg-[#ff5722] selection:text-white biomech-grid">
      {/* Top Navbar */}
      <TopNavbar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onInstallPwa={handleInstallPwa}
        pwaInstallable={!!deferredPrompt}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto pt-6 px-3 sm:px-6">
        {/* Toast Notification */}
        {unlockedToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1e2536] border-2 border-emerald-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs sm:text-sm font-bold">{unlockedToast}</span>
          </div>
        )}

        {/* View Switcher */}
        {activeView === 'script_1' && (
          <ScriptOneFoundations
            isUnlocked={unlockedBadges.includes('movement_engineer')}
            onCompleteAndProceed={() => {
              handleUnlockBadge('movement_engineer');
              setActiveView('script_2');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'script_2' && (
          <ScriptTwoUpperBody
            isUnlocked={unlockedBadges.includes('upper_body_master')}
            onBadgeUnlocked={(bid) => handleUnlockBadge(bid)}
            onSelectMuscleDetail={handleSelectMuscleDetail}
          />
        )}

        {activeView === 'script_3' && (
          <ScriptThreeLowerBody
            isUnlocked={unlockedBadges.includes('iron_leg')}
            onBadgeUnlocked={(bid) => handleUnlockBadge(bid)}
            onSelectMuscleDetail={handleSelectMuscleDetail}
          />
        )}

        {activeView === 'script_4' && (
          <ScriptFourCorrective
            isUnlocked={unlockedBadges.includes('iron_structure')}
            onBadgeUnlocked={(bid) => handleUnlockBadge(bid)}
            onProceedNext={() => {
              handleUnlockBadge('iron_structure');
              setActiveView('script_5');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'script_5' && (
          <ScriptFiveOverload
            isUnlocked={unlockedBadges.includes('overload_master')}
            onBadgeUnlocked={(bid) => handleUnlockBadge(bid)}
            onProceedNext={() => {
              handleUnlockBadge('overload_master');
              setActiveView('script_6');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'script_6' && (
          <ScriptSixBiochemRecovery
            isUnlocked={unlockedBadges.includes('able_city_grand_master')}
            onBadgeUnlocked={(bid) => handleUnlockBadge(bid)}
            onNavigateHome={() => {
              setActiveView('progress');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'gym' && (
          <GymTracker
            selectedExercisePreload={preloadedGymExercise}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeView === 'book' && (
          <BookSection
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeView === 'progress' && (
          <ProgressGamification
            unlockedBadgeIds={unlockedBadges}
          />
        )}

        {activeView === 'teaser' && (
          <TeaserMotionStudio />
        )}
      </main>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={inspectingExercise}
        onClose={() => setInspectingExercise(null)}
        onLogExercise={handleLogExerciseInGym}
      />

      {/* PWA Install Guide Modal */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121522] border-2 border-[#ff5722]/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-xl font-black text-white">
              نصب برنامه ایبل‌سیتی روی موبایل (PWA)
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed text-right">
              برای اجرای روان روی گوشی‌های شیائومی (Redmi Note 8) و اندروید:
            </p>
            <div className="bg-[#0b0c10] p-4 rounded-xl text-xs text-neutral-300 space-y-2 text-right">
              <div>۱. در مرورگر کروم دکمه سه نقطه (منو) بالا را لمس کنید.</div>
              <div>۲. گزینه <b>«افزودن به صفحه اصلی» (Add to Home screen)</b> یا <b>«نصب برنامه» (Install app)</b> را انتخاب نمایید.</div>
              <div>۳. آیکون اختصاصی ایبل‌سیتی مانند یک اپلیکیشن بومی بدون نیاز به اینترنت پرسرعت اجرا خواهد شد.</div>
            </div>
            <button
              onClick={() => setShowPwaModal(false)}
              className="w-full py-3.5 rounded-xl bg-[#ff5722] hover:bg-[#ff6d00] font-bold text-white text-sm"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-[#1d2230] py-6 px-4 text-center text-xs text-neutral-500">
        <div>
          سامانه بیومکانیک زیستی و بدنسازی علمی ایبل‌سیتی (Able City) © تمامی حقوق محفوظ است.
        </div>
      </footer>
    </div>
  );
}

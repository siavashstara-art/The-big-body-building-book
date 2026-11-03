import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Sparkles, 
  Film, 
  Clock, 
  ExternalLink,
  CheckCircle2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TEASER_META, TEASER_SCENES } from '../data/teaserData';
import { speakPersian, stopPersianSpeech } from '../utils/speechVoice';
import { playWeightClang, playWhooshSweep, playSuccessChime, playHeartbeatPulse } from '../utils/soundEffects';

// Image paths from phase 1 generation
const IMAGE_FIBERS = '/src/assets/images/biomechanics_muscle_fibers_1793714682473.jpg';
const IMAGE_TEASER = '/src/assets/images/teaser_storyboard_poster_1793714682221.jpg';
const IMAGE_BOOK = '/src/assets/images/able_city_book_cover_1793714680771.jpg';

export const TeaserMotionStudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [showCafeBazaarModal, setShowCafeBazaarModal] = useState<boolean>(false);

  const prevSceneIdRef = useRef<number>(0);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Current Scene determined by current time
  const currentScene = TEASER_SCENES.find(
    s => currentTime >= s.startTime && currentTime < s.endTime
  ) || TEASER_SCENES[TEASER_SCENES.length - 1];

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TEASER_META.totalDurationSeconds - 0.2) {
            setIsPlaying(false);
            stopPersianSpeech();
            return TEASER_META.totalDurationSeconds;
          }
          return Number((prev + 0.2).toFixed(1));
        });
      }, 200);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      stopPersianSpeech();
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      stopPersianSpeech();
    };
  }, [isPlaying]);

  // Handle scene transition sounds & voiceover
  useEffect(() => {
    if (!isPlaying) return;

    if (currentScene.id !== prevSceneIdRef.current) {
      prevSceneIdRef.current = currentScene.id;

      // Sound Foley Effects
      if (currentScene.id === 1) {
        playWeightClang();
        playHeartbeatPulse();
      } else if (currentScene.id === 2) {
        playWhooshSweep();
      } else if (currentScene.id === 4) {
        playSuccessChime();
      } else if (currentScene.id === 5) {
        playWeightClang();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff5722', '#ff9800', '#ffffff'],
          });
        } catch {
          // fallback
        }
      }

      // Voiceover Speech
      if (voiceEnabled) {
        speakPersian(currentScene.speakerTextFa, undefined, 0.95);
      }
    }
  }, [currentScene.id, isPlaying, voiceEnabled, currentScene.speakerTextFa]);

  const togglePlay = () => {
    if (currentTime >= TEASER_META.totalDurationSeconds) {
      setCurrentTime(0);
      prevSceneIdRef.current = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    prevSceneIdRef.current = 0;
    setIsPlaying(true);
  };

  const getPosterSrc = (key: 'fibers' | 'teaser' | 'book') => {
    switch (key) {
      case 'fibers': return IMAGE_FIBERS;
      case 'teaser': return IMAGE_TEASER;
      case 'book': return IMAGE_BOOK;
      default: return IMAGE_TEASER;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-4 pb-14">
      {/* Title & Metadata */}
      <div className="border-b border-[#242b3d] pb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#ff5722] font-semibold">بخش ۳</span>
          <span aria-hidden="true">·</span>
          <span>تیزر تبلیغاتی رسمی</span>
          <span aria-hidden="true">·</span>
          <span>مدت زمان: ۴۵ ثانیه دقیق (آپارات و کافه بازار)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {TEASER_META.videoTitleFa}
        </h1>
        <p className="text-neutral-300 text-sm mt-1.5 leading-relaxed">
          شبیه‌ساز موشن‌گرافیک پیشرفته با فضای تاریک و نئونی، ریتم تند و انگیزشی همگام با صوت و جلوه‌های صوتی وزنه
        </p>
      </div>

      {/* MOTION GRAPHIC SCREEN / CINEMA CANVAS */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border-2 border-[#ff5722]/60 shadow-2xl flex flex-col justify-between select-none">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={getPosterSrc(currentScene.posterKey)}
            alt={currentScene.visualTitle}
            className="w-full h-full object-cover transition-all duration-700 filter brightness-75 contrast-115 scale-100"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${currentScene.bgGradient} opacity-85 transition-opacity duration-700`} />
        </div>

        {/* Top Overlay Bar */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 text-xs text-white">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
            <Film className="w-4 h-4 text-[#ff5722]" />
            <span className="font-bold">صحنه {currentScene.id} از ۵: {currentScene.visualTitle}</span>
          </div>

          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-athletic text-base font-bold text-[#ff9800]">
            <Clock className="w-4 h-4 text-white" />
            <span>00:{String(Math.floor(currentTime)).padStart(2, '0')} / 00:45</span>
          </div>
        </div>

        {/* Center Kinetic Visual Overlay */}
        <div className="relative z-10 px-6 sm:px-12 text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-block text-[11px] font-mono font-bold tracking-widest text-[#ff9800] bg-black/80 px-3 py-1 rounded-full border border-[#ff5722]/50 shadow-lg">
            {currentScene.soundFoleyFa}
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
            «{currentScene.speakerTextFa}»
          </h2>
          <div className="text-xs text-neutral-300 drop-shadow">
            {currentScene.visualFa}
          </div>
        </div>

        {/* Bottom Interactive Scrubber & Controls */}
        <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          {/* Timeline Track Slider */}
          <div className="relative w-full h-2.5 bg-neutral-800 rounded-full cursor-pointer mb-4 overflow-hidden">
            <div
              style={{ width: `${(currentTime / TEASER_META.totalDurationSeconds) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#ff5722] via-[#ff9800] to-amber-300 rounded-full transition-all duration-150"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-[#ff5722] hover:bg-[#ff6d00] active:scale-95 text-white flex items-center justify-center transition-all shadow-lg shadow-[#ff5722]/30"
                aria-label={isPlaying ? 'توقف' : 'پخش'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
              </button>

              <button
                onClick={handleRestart}
                className="w-10 h-10 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center transition-all border border-neutral-700"
                aria-label="پخش مجدد"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                  voiceEnabled
                    ? 'bg-neutral-800/80 text-[#ff9800] border-neutral-700'
                    : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                }`}
                aria-label="صدای گوینده"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Direct Cafe Bazaar CTA Button */}
            <button
              onClick={() => setShowCafeBazaarModal(true)}
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 border border-emerald-400/30"
            >
              <Download className="w-4 h-4" />
              <span>نصب از کافه بازار</span>
            </button>
          </div>
        </div>
      </div>

      {/* STORYBOARD SCRIPT TIMELINE TABLE (بخش ۳ از پرامپت اولیه) */}
      <div className="bg-[#121520] border border-[#252c3d] rounded-2xl p-5 sm:p-7 shadow-xl">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>جدول اسکریپت و زمان‌بندی تیزر تبلیغاتی (۴۵ ثانیه)</span>
        </h3>

        <div className="space-y-3">
          {TEASER_SCENES.map((scene) => {
            const isActive = currentScene.id === scene.id;
            return (
              <div
                key={scene.id}
                onClick={() => {
                  setCurrentTime(scene.startTime);
                  prevSceneIdRef.current = scene.id - 1;
                  setIsPlaying(true);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#1b2234] border-[#ff5722] shadow-lg shadow-[#ff5722]/10 ring-1 ring-[#ff5722]'
                    : 'bg-[#151926] border-[#293246] hover:bg-[#191f2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-16 text-center py-1.5 rounded-lg bg-[#242b3d] text-xs font-athletic font-bold text-[#ff9800]">
                    00:{String(scene.startTime).padStart(2, '0')} - 00:{String(scene.endTime).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{scene.visualTitle}</h4>
                    <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                      گوینده: «{scene.speakerTextFa}»
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 italic">
                  {scene.soundFoleyFa}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAFE BAZAAR SIMULATED INSTALL MODAL */}
      {showCafeBazaarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121522] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <Download className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                دریافت مستقیم از کافه بازار
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                دانلود اپلیکیشن و پکیج تخصصی ایبل‌سیتی
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                دسترسی کامل به مدل ۳بعدی آناتومی، جعبه لایتنر بیومکانیک و ردیاب باشگاهی با فرامین صوتی
              </p>
            </div>

            <div className="bg-[#0b0c12] p-4 rounded-xl border border-[#232a3d] text-xs text-neutral-300 space-y-2 text-right">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>سازگار با نسخه اندروید PWA و انواع گوشی‌های موبایل</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>حالت باشگاهی با فرامین صوتی برای دست‌های خیس</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>کتاب مرجع و جعبه لایتنر تکرار فاصله‌دار</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCafeBazaarModal(false);
                playSuccessChime();
              }}
              className="w-full py-4 rounded-2xl font-black text-base text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/30"
            >
              تایید و دانلود رایگان نسخه رسمی
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

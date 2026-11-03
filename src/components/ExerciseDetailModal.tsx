import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  RotateCw, 
  Dumbbell, 
  Maximize2,
  Clock
} from 'lucide-react';
import { ExerciseBiomechanical } from '../types';

interface ExerciseDetailModalProps {
  exercise: ExerciseBiomechanical | null;
  onClose: () => void;
  onLogExercise: (exercise: ExerciseBiomechanical) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onLogExercise,
}) => {
  const [activePhase, setActivePhase] = useState<'eccentric' | 'pause' | 'concentric'>('concentric');

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#10131d] border border-[#2b334a] rounded-2xl shadow-2xl text-neutral-200 p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#22293d] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#ff5722]/20 text-[#ff7043]">
                {exercise.leverClass}
              </span>
              <span className="text-xs text-neutral-400">
                مفاصل: {exercise.jointInvolved}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {exercise.nameFa}
            </h2>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">
              {exercise.nameEn}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#1b2030] hover:bg-[#252d42] active:scale-95 text-neutral-300 flex items-center justify-center transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Biomechanical Lever & Vector Force Schematic */}
        <div className="bg-[#0c0e17] border border-[#262f45] rounded-xl p-4 sm:p-5 mb-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
            <span className="font-semibold text-[#ff9800]">نمودار اهرم و فاز حرکتی بیومکانیک</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActivePhase('eccentric')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${activePhase === 'eccentric' ? 'bg-[#ff5722] text-white font-bold' : 'bg-[#1a2030] text-neutral-400'}`}
              >
                فاز منفی (Eccentric)
              </button>
              <button
                onClick={() => setActivePhase('pause')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${activePhase === 'pause' ? 'bg-[#ff5722] text-white font-bold' : 'bg-[#1a2030] text-neutral-400'}`}
              >
                مکث ایزومتریک
              </button>
              <button
                onClick={() => setActivePhase('concentric')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${activePhase === 'concentric' ? 'bg-[#ff5722] text-white font-bold' : 'bg-[#1a2030] text-neutral-400'}`}
              >
                فاز مثبت (Concentric)
              </button>
            </div>
          </div>

          {/* Dynamic Biomechanical Vector Schematic */}
          <div className="h-32 sm:h-36 bg-[#121522] rounded-lg relative flex items-center justify-around border border-[#23293b] px-4">
            {/* Fulcrum Point */}
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-sky-400 border-2 border-white shadow-lg shadow-sky-500/50" />
              <div className="w-0.5 h-10 bg-neutral-600" />
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-sky-400 mt-1" />
              <span className="text-[10px] text-sky-300 mt-1">تکیه‌گاه (Fulcrum)</span>
            </div>

            {/* Lever Arm Line with Torque Arc */}
            <div className="relative flex-1 mx-4 h-1.5 bg-gradient-to-r from-sky-400 via-[#ff5722] to-amber-400 rounded-full flex items-center justify-center">
              <span className="absolute -top-6 text-[11px] font-mono font-bold text-[#ff9800] bg-[#1a2030] px-2 py-0.5 rounded border border-[#2d3750]">
                بازوی گشتاور: {activePhase === 'eccentric' ? 'کشش حداکثری' : activePhase === 'pause' ? 'تنش ایزومتریک' : 'کوتاه‌ترین طول'}
              </span>
            </div>

            {/* Force / Load Vector */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#ff5722]/20 border border-[#ff5722] flex items-center justify-center text-[#ff5722] font-black font-athletic text-base">
                LOAD
              </div>
              <div className="w-0.5 h-8 bg-[#ff5722] animate-pulse" />
              <span className="text-[10px] text-[#ff7043] mt-1">بردار مقاومت (F)</span>
            </div>
          </div>

          <div className="text-xs text-neutral-300 mt-3 leading-relaxed">
            <span className="text-[#ff9800] font-semibold">تحلیل بازوی گشتاور: </span>
            {exercise.momentArmInfo}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-[#151926] border border-[#262e42] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-amber-400 mb-1.5 font-semibold">
              <Clock className="w-4 h-4" />
              <span>ریتم اجرای بهینه (Tempo)</span>
            </div>
            <div className="text-sm font-athletic font-bold text-white tracking-wide">
              {exercise.optimalRepTempo}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              کنترل فاز فرود برای تحریک هیپرتروفی باواسطه کشش مکانیکی
            </p>
          </div>

          <div className="bg-[#151926] border border-[#262e42] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-[#ff5722] mb-1.5 font-semibold">
              <RotateCw className="w-4 h-4" />
              <span>منحنی مقاومت (Resistance Curve)</span>
            </div>
            <div className="text-xs text-neutral-200 leading-relaxed">
              {exercise.resistanceCurve}
            </div>
          </div>
        </div>

        {/* Corrective Cues & Injury Traps */}
        <div className="space-y-4 mb-6">
          {/* Corrective Cues */}
          <div className="bg-[#121624] border border-[#232a3d] p-4 rounded-xl">
            <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>نکات اصلاحی بیومکانیک (اجرای استاندارد):</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              {exercise.correctiveCues.map((cue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes & Injury Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#17131a] border border-[#3d2424] p-3.5 rounded-xl">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>اشتباهات رایج باشگاهی:</span>
              </h4>
              <ul className="text-xs text-neutral-300 space-y-1 list-disc list-inside">
                {exercise.commonMistakes.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#17131a] border border-[#3d2424] p-3.5 rounded-xl">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ریسک‌های احتمالی آسیب مفصل:</span>
              </h4>
              <ul className="text-xs text-neutral-300 space-y-1 list-disc list-inside">
                {exercise.injuryRisks.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions (Big Buttons) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#22293d]">
          <button
            onClick={() => {
              onLogExercise(exercise);
              onClose();
            }}
            className="w-full sm:flex-1 py-4 px-5 rounded-xl font-bold text-base text-white bg-[#ff5722] hover:bg-[#ff6d00] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff5722]/20"
          >
            <Dumbbell className="w-5 h-5" />
            <span>ثبت این حرکت در ردیاب باشگاه (Gym Mode)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-semibold text-xs text-neutral-300 bg-[#1e2333] hover:bg-[#283045] transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Download, FileText, X, Check, Dumbbell, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { generateWorkoutPdfReport, PdfReportData } from '../utils/pdfExporter';
import { playSuccessChime } from '../utils/soundEffects';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAthleteName?: string;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  defaultAthleteName = '',
}) => {
  const [athleteName, setAthleteName] = useState<string>(defaultAthleteName || 'ورزشکار ایبل‌سیتی');
  const [coachName, setCoachName] = useState<string>('استاد ایبل‌سیتی (Able City Director)');
  const [reportType, setReportType] = useState<'workout' | 'preseason' | 'biomechanics'>('workout');
  const [notes, setNotes] = useState<string>('حفظ ستون فقرات خنثی، تمرکز بر فاز منفی اکسنتریک ۳ ثانیه‌ای و رعایت نسبت H:Q بالای ۶۰٪');

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    let reportData: PdfReportData;

    if (reportType === 'preseason') {
      reportData = {
        athleteName: athleteName || 'Athlete User',
        coachName: coachName,
        title: 'Pre-Season Team Conditioning & Readiness Blueprint',
        date: new Date().toLocaleDateString('en-US'),
        sportOrCategory: 'Soccer / Football Team Conditioning',
        notes: notes,
        metrics: [
          { label: 'Hamstring to Quad Ratio (H:Q)', value: '65.0% (SAFE)' },
          { label: 'Team Readiness Score', value: '88% (OPTIMAL)' },
          { label: 'Nordic Hamstring Protocol', value: '3 Sets x 6 Reps' },
          { label: 'HIIT Interval Ratio', value: '15s Sprint / 15s Active Rest' },
          { label: 'Resting Heart Rate', value: '52 bpm' },
          { label: 'Borg RPE Score', value: '7 / 10' }
        ],
        workoutSets: [
          { exercise: 'Trap Bar Deadlift (Explosive)', weight: '120 kg', reps: '5 reps', tempo: '2-1-X-0' },
          { exercise: 'Nordic Hamstring Curl', weight: 'Bodyweight', reps: '6 reps', tempo: '4-0-1-0' },
          { exercise: 'Bulgarian Split Squat', weight: '24 kg DBs', reps: '8 reps', tempo: '3-1-1-0' },
          { exercise: 'Copenhagen Adductor Plank', weight: 'Bodyweight', reps: '20 sec', tempo: 'Isometric' }
        ]
      };
    } else if (reportType === 'biomechanics') {
      reportData = {
        athleteName: athleteName || 'Athlete User',
        coachName: coachName,
        title: 'Comprehensive Biomechanical & Spine Alignment Certificate',
        date: new Date().toLocaleDateString('en-US'),
        sportOrCategory: 'Posture Correction & Joint Levers',
        notes: notes,
        metrics: [
          { label: 'Thoracic Spine Kyphosis', value: 'Corrected (Opening)' },
          { label: 'Lumbar Lordosis Tilt', value: 'Neutral Spine (PPT)' },
          { label: 'Scapular Retraction', value: 'Depressed & Retracted' },
          { label: 'Tripod Foot Stability', value: '3-Point Balance (100%)' },
          { label: 'Bench Press Path Angle', value: '75 Degree Safe Arc' },
          { label: 'Cellular ATP Engine', value: 'Glycolysis + Krebs' }
        ],
        workoutSets: [
          { exercise: 'Biomechanical Bench Press (75°)', weight: '90 kg', reps: '8 reps', tempo: '3-1-1-0' },
          { exercise: 'Neutral-Grip Lat Pulldown', weight: '80 kg', reps: '10 reps', tempo: '3-0-1-2' },
          { exercise: 'Romanian Deadlift (Hip Hinge)', weight: '110 kg', reps: '8 reps', tempo: '3-1-1-0' },
          { exercise: 'Pallof Press Anti-Rotation', weight: '25 kg Cable', reps: '8 reps', tempo: '3s Hold' }
        ]
      };
    } else {
      reportData = {
        athleteName: athleteName || 'Athlete User',
        coachName: coachName,
        title: 'Official Able City Workout Log & Power Report',
        date: new Date().toLocaleDateString('en-US'),
        sportOrCategory: 'Hypertrophy & Progressive Overload',
        notes: notes,
        metrics: [
          { label: 'Weekly Volume Tonnage', value: '5,850 kg (+15%)' },
          { label: 'Rest-Pause Technique', value: '10s Interval Applied' },
          { label: 'Personal Record (PR)', value: 'Bench Press 95 kg' },
          { label: 'Hydration Target', value: '3.5 Liters Clean Water' },
          { label: 'Clean Egg White Protocol', value: '10 Whites / Day' },
          { label: 'Leitner Science Cards', value: 'Box 5 Mastery' }
        ],
        workoutSets: [
          { exercise: 'High-Bar Biomechanical Squat', weight: '130 kg', reps: '6 reps', tempo: '3-1-1-0' },
          { exercise: 'Incline Dumbbell Press (30°)', weight: '36 kg DBs', reps: '8 reps', tempo: '2-1-1-0' },
          { exercise: 'Barbell Hip Thrust (Glutes)', weight: '140 kg', reps: '10 reps', tempo: '2-0-1-2' },
          { exercise: 'Overhead Cable Triceps Extension', weight: '45 kg', reps: '12 reps', tempo: '3-0-1-1' }
        ]
      };
    }

    generateWorkoutPdfReport(reportData);
    playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#121522] border-2 border-[#ff5722]/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 p-2 text-neutral-400 hover:text-white rounded-xl bg-[#1a2030] border border-[#2b354c]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-[#222a3d] pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff5722] to-[#ff9800] text-white flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              صدور کارنامه و برنامه تمرینی PDF (Coach PDF Generator)
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              تولید سند PDF استاندارد قابل ذخیره‌سازی رو حافظه گوشی جهت تحویل به مربی یا شاگرد
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-bold block mb-1">نام ورزشکار / بازیکن:</label>
            <input
              type="text"
              value={athleteName}
              onChange={(e) => setAthleteName(e.target.value)}
              placeholder="مثال: سیاوش امیری"
              className="w-full bg-[#181d2c] border border-[#2d374e] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff5722]"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">نام مربی / مدیر فنی:</label>
            <input
              type="text"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              placeholder="مثال: مربی ارشد ایبل‌سیتی"
              className="w-full bg-[#181d2c] border border-[#2d374e] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff5722]"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">نوع گزارش و کارنامه PDF:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReportType('workout')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                  reportType === 'workout'
                    ? 'bg-[#ff5722] text-white border-[#ff5722]'
                    : 'bg-[#181d2c] text-neutral-400 border-[#2b354c]'
                }`}
              >
                برنامه ورزشی
              </button>
              <button
                type="button"
                onClick={() => setReportType('preseason')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                  reportType === 'preseason'
                    ? 'bg-[#ff5722] text-white border-[#ff5722]'
                    : 'bg-[#181d2c] text-neutral-400 border-[#2b354c]'
                }`}
              >
                پیش‌فصل تیمی
              </button>
              <button
                type="button"
                onClick={() => setReportType('biomechanics')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                  reportType === 'biomechanics'
                    ? 'bg-[#ff5722] text-white border-[#ff5722]'
                    : 'bg-[#181d2c] text-neutral-400 border-[#2b354c]'
                }`}
              >
                بیومکانیک و قامت
              </button>
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-bold block mb-1">توصیه‌های مربی و ملاحظات بیومکانیک:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#181d2c] border border-[#2d374e] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff5722]"
            />
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#ff9800] hover:from-[#ff6d00] hover:to-[#ffa726] active:scale-95 text-white font-bold text-sm shadow-xl shadow-[#ff5722]/20 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>دانلود مستقیم فایل PDF روی موبایل</span>
        </button>
      </div>
    </div>
  );
};

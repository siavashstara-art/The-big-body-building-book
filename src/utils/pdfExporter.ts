import { jsPDF } from 'jspdf';

export interface PdfReportData {
  athleteName: string;
  coachName?: string;
  title: string;
  date: string;
  sportOrCategory: string;
  notes?: string;
  metrics: { label: string; value: string }[];
  workoutSets?: { exercise: string; weight: string; reps: string; tempo: string }[];
}

/**
 * Generate and download a PDF report for the athlete/coach
 */
export function generateWorkoutPdfReport(data: PdfReportData) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Dark Header Box
    doc.setFillColor(18, 22, 36);
    doc.rect(0, 0, pageWidth, 38, 'F');

    // Accent Stripe
    doc.setFillColor(255, 87, 34); // #ff5722
    doc.rect(0, 38, pageWidth, 3, 'F');

    // Title Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('ABLE CITY BIOMECHANICS & SPORTS PERFORMANCE', 14, 16);

    doc.setFontSize(11);
    doc.setTextColor(255, 152, 0); // #ff9800
    doc.text(`REPORT: ${data.title.toUpperCase()}`, 14, 26);

    doc.setFontSize(9);
    doc.setTextColor(180, 190, 210);
    doc.text(`DATE: ${data.date}`, pageWidth - 50, 26);

    // Athlete Info Section
    doc.setTextColor(20, 25, 40);
    doc.setFontSize(12);
    doc.text(`ATHLETE / PLAYER: ${data.athleteName || 'Athlete User'}`, 14, 52);
    
    if (data.coachName) {
      doc.setFontSize(10);
      doc.setTextColor(100, 110, 130);
      doc.text(`COACH / DIRECTOR: ${data.coachName}`, 14, 60);
    }

    doc.setFontSize(10);
    doc.setTextColor(100, 110, 130);
    doc.text(`CATEGORY: ${data.sportOrCategory}`, 14, 67);

    // Divider Line
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.5);
    doc.line(14, 72, pageWidth - 14, 72);

    // Metrics Grid
    let currentY = 82;
    doc.setFontSize(11);
    doc.setTextColor(255, 87, 34);
    doc.text('KEY BIOMECHANICAL & PERFORMANCE METRICS', 14, currentY);

    currentY += 8;
    data.metrics.forEach((m, idx) => {
      doc.setFillColor(245, 247, 250);
      doc.rect(14 + (idx % 2) * 92, currentY + Math.floor(idx / 2) * 14, 86, 11, 'F');

      doc.setFontSize(9);
      doc.setTextColor(80, 90, 110);
      doc.text(m.label, 17 + (idx % 2) * 92, currentY + Math.floor(idx / 2) * 14 + 7);

      doc.setFontSize(10);
      doc.setTextColor(20, 30, 50);
      doc.text(m.value, 60 + (idx % 2) * 92, currentY + Math.floor(idx / 2) * 14 + 7);
    });

    currentY += Math.ceil(data.metrics.length / 2) * 14 + 10;

    // Workout Exercises / Table
    if (data.workoutSets && data.workoutSets.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(255, 87, 34);
      doc.text('WORKOUT LOG & EXERCISE TEMPO DETAILS', 14, currentY);

      currentY += 6;
      // Table Header
      doc.setFillColor(33, 38, 56);
      doc.rect(14, currentY, pageWidth - 28, 8, 'F');

      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('EXERCISE', 18, currentY + 5.5);
      doc.text('WEIGHT (KG)', 100, currentY + 5.5);
      doc.text('REPS', 140, currentY + 5.5);
      doc.text('TEMPO', 168, currentY + 5.5);

      currentY += 8;

      data.workoutSets.forEach((set, i) => {
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, currentY, pageWidth - 28, 7, 'F');
        }

        doc.setFontSize(8);
        doc.setTextColor(40, 50, 70);
        doc.text(set.exercise.substring(0, 45), 18, currentY + 5);
        doc.text(set.weight, 100, currentY + 5);
        doc.text(set.reps, 140, currentY + 5);
        doc.text(set.tempo, 168, currentY + 5);

        currentY += 7.5;
      });
    }

    // Notes Section
    if (data.notes) {
      currentY += 6;
      doc.setFontSize(9);
      doc.setTextColor(255, 152, 0);
      doc.text('COACH NOTES & BIOMECHANICAL CUES:', 14, currentY);

      currentY += 6;
      doc.setFontSize(8.5);
      doc.setTextColor(60, 70, 90);
      const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 28);
      doc.text(splitNotes, 14, currentY);
    }

    // Footer Stamp
    doc.setFontSize(8);
    doc.setTextColor(150, 160, 180);
    doc.text('Able City Biomechanics Ecosystem (ایبل‌سیتی) — Verified Scientific Report', 14, 282);

    // Save PDF
    const filename = `AbleCity_${data.athleteName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error('Failed to generate PDF:', err);
  }
}

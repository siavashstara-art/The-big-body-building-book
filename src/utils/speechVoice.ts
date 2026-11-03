// Persian Speech Synthesis & Hands-free Recognition for Gym Mode

export function speakPersian(text: string, onEnd?: () => void, rate = 0.95): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) setTimeout(onEnd, 2000);
    return null;
  }

  window.speechSynthesis.cancel(); // Stop any previous speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fa-IR';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Try to find Persian voice if available on system
  const voices = window.speechSynthesis.getVoices();
  const faVoice = voices.find(v => v.lang.startsWith('fa') || v.lang.includes('Persian'));
  if (faVoice) {
    utterance.voice = faVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopPersianSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Voice Recognition Parser
export interface VoiceCommandResult {
  action: 'LOG_SET' | 'ADD_WEIGHT' | 'SUB_WEIGHT' | 'SET_WEIGHT' | 'SET_REPS' | 'RESET_TIMER' | 'UNKNOWN';
  value?: number;
  rawText: string;
}

export function parsePersianGymCommand(text: string): VoiceCommandResult {
  const clean = text.trim();

  // Check for log set
  if (clean.includes('ثبت ست') || clean.includes('ثبت') || clean.includes('تایید') || clean.includes('انجام شد') || clean.includes('done') || clean.includes('log')) {
    return { action: 'LOG_SET', rawText: clean };
  }

  // Check for reset / stop timer
  if (clean.includes('پایان استراحت') || clean.includes('تایمر') || clean.includes('استراحت') || clean.includes('شروع')) {
    return { action: 'RESET_TIMER', rawText: clean };
  }

  // Check for add weight
  if (clean.includes('اضافه') || clean.includes('بیشتر') || clean.includes('+') || clean.includes('add')) {
    const num = extractNumber(clean);
    return { action: 'ADD_WEIGHT', value: num || 5, rawText: clean };
  }

  // Check for subtract weight
  if (clean.includes('کم کن') || clean.includes('کمتر') || clean.includes('-') || clean.includes('sub')) {
    const num = extractNumber(clean);
    return { action: 'SUB_WEIGHT', value: num || 5, rawText: clean };
  }

  // Check for specific weight
  if (clean.includes('کیلو') || clean.includes('وزنه') || clean.includes('kg')) {
    const num = extractNumber(clean);
    if (num) {
      return { action: 'SET_WEIGHT', value: num, rawText: clean };
    }
  }

  // Check for specific reps
  if (clean.includes('تکرار') || clean.includes('تا') || clean.includes('rep')) {
    const num = extractNumber(clean);
    if (num) {
      return { action: 'SET_REPS', value: num, rawText: clean };
    }
  }

  return { action: 'UNKNOWN', rawText: clean };
}

function extractNumber(str: string): number | null {
  // Convert Persian numbers to English
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let normalized = str;
  persianDigits.forEach((p, idx) => {
    normalized = normalized.replaceAll(p, String(idx));
  });

  const match = normalized.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

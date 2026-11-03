// Web Audio procedural sound synthesizer (100% offline, zero external 404 files)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Heavy barbell weight clang sound
 */
export function playWeightClang() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Impact oscillator
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(140, now);
  osc1.frequency.exponentialRampToValueAtTime(35, now + 0.35);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(420, now);
  osc2.frequency.exponentialRampToValueAtTime(80, now + 0.45);

  gain.gain.setValueAtTime(0.7, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  // High metallic ringing resonance
  const metallicOsc = ctx.createOscillator();
  const metallicGain = ctx.createGain();
  metallicOsc.type = 'sine';
  metallicOsc.frequency.setValueAtTime(880, now);
  metallicOsc.frequency.exponentialRampToValueAtTime(650, now + 0.8);
  metallicGain.gain.setValueAtTime(0.25, now);
  metallicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  osc1.connect(gain);
  osc2.connect(gain);
  metallicOsc.connect(metallicGain);

  gain.connect(ctx.destination);
  metallicGain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  metallicOsc.start(now);

  osc1.stop(now + 0.7);
  osc2.stop(now + 0.7);
  metallicOsc.stop(now + 0.9);
}

/**
 * Short timer beep (for countdown seconds)
 */
export function playTimerBeep(highPitch = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(highPitch ? 880 : 440, now);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + (highPitch ? 0.3 : 0.12));

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + (highPitch ? 0.35 : 0.15));
}

/**
 * Success Ding for Set completion or voice command logged
 */
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0.18, now + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.4);
  });
}

/**
 * Motivational Heartbeat / Sub-bass pulse
 */
export function playHeartbeatPulse() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // First lub
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(75, now);
  osc1.frequency.exponentialRampToValueAtTime(40, now + 0.12);
  gain1.gain.setValueAtTime(0.4, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.15);

  // Second dub (slightly louder, 0.18s later)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(85, now + 0.18);
  osc2.frequency.exponentialRampToValueAtTime(45, now + 0.32);
  gain2.gain.setValueAtTime(0.5, now + 0.18);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.18);
  osc2.stop(now + 0.38);
}

/**
 * Energy whoosh for motion graphic transitions
 */
export function playWhooshSweep() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.18);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}

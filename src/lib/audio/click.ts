let audioCtx: AudioContext | null = null;
let initialized = false;

export function playClick(): void {
  if (!initialized && typeof window !== 'undefined') {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      // Web Audio not available — silent degrade
      return;
    }
    initialized = true;
  }

  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.04);
  } catch {
    // Silent error catch — no console noise
  }
}

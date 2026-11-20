let ctx: AudioContext | null = null;
let failed = false;

function ac(): AudioContext | null {
  if (failed || typeof window === "undefined") return null;
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    failed = true;
    return null;
  }
}

export function unlockAudio(): void {
  ac();
}

function env(freq: number, dur: number, type: OscillatorType, gain = 0.03, slide?: number): void {
  const c = ac();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    if (slide && slide > 0) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slide), c.currentTime + dur);
    amp.gain.setValueAtTime(gain, c.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    osc.connect(amp);
    amp.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur + 0.02);
  } catch {
    /* ignore autoplay and device quirks */
  }
}

export function playBuy(): void {
  env(220, 0.07, "square", 0.02);
  env(440, 0.1, "square", 0.02);
}

export function playCollect(): void {
  env(660, 0.06, "triangle", 0.03, 990);
}

export function playLaunch(): void {
  env(140, 0.22, "sawtooth", 0.02, 420);
}

export function playShot(): void {
  env(880, 0.04, "square", 0.012, 220);
}

export function playKill(): void {
  env(520, 0.08, "triangle", 0.028, 180);
}

export function playReforge(): void {
  env(90, 0.28, "sine", 0.04, 40);
  env(360, 0.18, "triangle", 0.02);
}

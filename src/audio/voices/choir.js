// Choir — ethereal vocal-like pad with noise + harmonic sines.
import { floor } from '../env.js';
import { createNoiseSource, initNoise } from '../noise.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const duration = params.duration ?? 0.5;
  initNoise(ctx);
  const releaseEnd = time + duration + 0.900;
  // Noise texture
  const noiseSrc = createNoiseSource(ctx, time);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 1000;
  const noiseGain = ctx.createGain();
  const noiseLevel = 0.05 * velocity;
  noiseGain.gain.setValueAtTime(0, time);
  noiseGain.gain.linearRampToValueAtTime(noiseLevel, time + 0.150);
  noiseGain.gain.setValueAtTime(noiseLevel * 0.6, time + duration);
  noiseGain.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  noiseGain.gain.setValueAtTime(0, releaseEnd);
  noiseSrc.connect(noiseFilter).connect(noiseGain).connect(destination);
  noiseSrc.stop(releaseEnd + 0.01);
  // Harmonic sines (formant-like)
  const freqs = [400, 800, 1200];
  const oscs = freqs.map(f => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    const l = 0.10 * velocity / 3;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(l, time + 0.150);
    g.gain.setValueAtTime(l * 0.6, time + duration);
    g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
    g.gain.setValueAtTime(0, releaseEnd);
    o.connect(g).connect(destination);
    o.start(time);
    o.stop(releaseEnd + 0.01);
    return { o, g };
  });
  noiseSrc.onended = () => { noiseSrc.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); };
  oscs[0].o.onended = () => { oscs.forEach(({ o, g }) => { o.disconnect(); g.disconnect(); }); };
}

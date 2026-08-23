// Vocal Glitch — processed/chopped vocal bursts (modern, experimental, rhythmic).
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;

  // Staccato bursts at multiple formant frequencies
  const bursts = [
    { freq: 500, delay: 0 },
    { freq: 900, delay: 0.030 },
    { freq: 1400, delay: 0.055 },
  ];

  bursts.forEach(({ freq, delay }) => {
    const t = time + delay;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = freq;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.060);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 6;

    const g = ctx.createGain();
    const level = 0.08 * velocity / 3;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + 0.002); // 2ms attack
    g.gain.exponentialRampToValueAtTime(floor(0), t + 0.080); // 80ms decay
    g.gain.setValueAtTime(0, t + 0.090);

    osc.connect(filter).connect(g).connect(destination);
    osc.start(t);
    osc.stop(t + 0.100);

    osc.onended = () => { osc.disconnect(); filter.disconnect(); g.disconnect(); };
  });
}

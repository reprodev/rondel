// Vocal Glitch — processed/chopped vocal bursts (modern, experimental, rhythmic).
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;

  // Staccato bursts — wider frequency spread, lower Q to avoid ringing
  const bursts = [
    { freq: 450, delay: 0 },
    { freq: 850, delay: 0.025 },
    { freq: 1300, delay: 0.050 },
  ];

  bursts.forEach(({ freq, delay }) => {
    const t = time + delay;
    const osc = ctx.createOscillator();
    osc.type = 'triangle'; // triangle instead of square (fewer harsh harmonics)
    osc.frequency.value = freq;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.050);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 3; // reduced from 6 to eliminate ringing

    const g = ctx.createGain();
    const level = 0.10 * velocity / 3;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + 0.003);
    g.gain.exponentialRampToValueAtTime(floor(0), t + 0.065); // shorter decay
    g.gain.setValueAtTime(0, t + 0.075);

    osc.connect(filter).connect(g).connect(destination);
    osc.start(t);
    osc.stop(t + 0.085);

    osc.onended = () => { osc.disconnect(); filter.disconnect(); g.disconnect(); };
  });
}

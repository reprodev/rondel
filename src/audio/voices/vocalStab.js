// Vocal Stab — short percussive vocal hit ("hey!" exclamation).
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;

  // Spread formants to avoid harmonic overlap; use sine only (no sawtooth harmonics)
  const formants = [600, 1100, 2200];
  const gains = [0.08, 0.05, 0.02];

  formants.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 2; // reduced from 4 to avoid ringing

    const g = ctx.createGain();
    const level = gains[i] * velocity;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(level, time + 0.005);
    g.gain.exponentialRampToValueAtTime(floor(0), time + 0.120); // shorter decay reduces ring
    g.gain.setValueAtTime(0, time + 0.130);

    osc.connect(filter).connect(g).connect(destination);
    osc.start(time);
    osc.stop(time + 0.140);

    if (i === 0) {
      osc.onended = () => { osc.disconnect(); filter.disconnect(); g.disconnect(); };
    }
  });
}

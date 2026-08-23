// Vocal Stab — short percussive vocal hit ("hey!" exclamation).
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;

  // Bright formant burst
  const formants = [700, 1200, 2800];
  const gains = [0.09, 0.06, 0.03];

  formants.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 0 ? 'sawtooth' : 'sine';
    osc.frequency.value = freq;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 4;

    const g = ctx.createGain();
    const level = gains[i] * velocity;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(level, time + 0.005); // 5ms attack
    g.gain.exponentialRampToValueAtTime(floor(0), time + 0.150); // 150ms decay
    g.gain.setValueAtTime(0, time + 0.160);

    osc.connect(filter).connect(g).connect(destination);
    osc.start(time);
    osc.stop(time + 0.170);

    if (i === 0) {
      osc.onended = () => { osc.disconnect(); filter.disconnect(); g.disconnect(); };
    }
  });
}

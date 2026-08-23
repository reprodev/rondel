// Vocal Pad — sustained "aah/ooh" texture with slow attack and warm sustain.
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const duration = params.duration ?? 0.6;
  const releaseEnd = time + duration + 1.2;

  // Warm formants only in low-mid range; no exposed high frequencies
  const formants = [280, 700, 1400];
  const gains = [0.055, 0.04, 0.015];

  // Damping lowpass to prevent brightness accumulation
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2200;
  lp.Q.value = 0.5;
  lp.connect(destination);

  formants.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const g = ctx.createGain();
    const level = gains[i] * velocity;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(level, time + 0.280);
    g.gain.setValueAtTime(level * 0.75, time + duration);
    g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
    g.gain.setValueAtTime(0, releaseEnd);

    osc.connect(g).connect(lp);
    osc.start(time);
    osc.stop(releaseEnd + 0.01);

    if (i === 0) {
      osc.onended = () => { osc.disconnect(); g.disconnect(); lp.disconnect(); };
    }
  });

  // Warm sub layer (no detuning that creates beats)
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = 180;
  const sg = ctx.createGain();
  const sl = 0.02 * velocity;
  sg.gain.setValueAtTime(0, time);
  sg.gain.linearRampToValueAtTime(sl, time + 0.350);
  sg.gain.setValueAtTime(sl * 0.6, time + duration);
  sg.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  sg.gain.setValueAtTime(0, releaseEnd);
  sub.connect(sg).connect(lp);
  sub.start(time);
  sub.stop(releaseEnd + 0.01);
}

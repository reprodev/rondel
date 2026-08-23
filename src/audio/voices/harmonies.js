// Harmonies — multi-part vocal stack (3-voice polyphonic texture).
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const duration = params.duration ?? 0.4;
  const releaseEnd = time + duration + 0.350;

  // Wider-spaced formants to eliminate beating; no detune
  const voices = [
    { freq: 280 },
    { freq: 420 },
    { freq: 580 },
  ];

  // Master lowpass to damp any brightness
  const masterLP = ctx.createBiquadFilter();
  masterLP.type = 'lowpass';
  masterLP.frequency.value = 3000;
  masterLP.Q.value = 0.5;
  masterLP.connect(destination);

  voices.forEach((v, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = v.freq;

    const g = ctx.createGain();
    const level = 0.08 * velocity / 3;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(level, time + 0.015);
    g.gain.setValueAtTime(level * 0.85, time + 0.180);
    g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
    g.gain.setValueAtTime(0, releaseEnd);

    osc.connect(g).connect(masterLP);
    osc.start(time);
    osc.stop(releaseEnd + 0.01);

    if (i === 0) {
      osc.onended = () => { osc.disconnect(); g.disconnect(); masterLP.disconnect(); };
    }
  });
}

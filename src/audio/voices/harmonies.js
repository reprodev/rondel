// Harmonies — multi-part vocal stack (3-voice polyphonic texture).
import { floor } from '../env.js';

export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const duration = params.duration ?? 0.4;
  const releaseEnd = time + duration + 0.400;

  // 3-part harmony: root, third, fifth (formant frequencies)
  const voices = [
    { freq: 350, detune: 0 },
    { freq: 440, detune: 5 },
    { freq: 525, detune: -3 },
  ];

  voices.forEach((v, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = v.freq;
    osc.detune.value = v.detune;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;

    const g = ctx.createGain();
    const level = 0.06 * velocity / 3;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(level, time + 0.010); // 10ms attack
    g.gain.setValueAtTime(level * 0.9, time + 0.200); // sustain
    g.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
    g.gain.setValueAtTime(0, releaseEnd);

    osc.connect(filter).connect(g).connect(destination);
    osc.start(time);
    osc.stop(releaseEnd + 0.01);

    if (i === 0) {
      osc.onended = () => { osc.disconnect(); filter.disconnect(); g.disconnect(); };
    }
  });

  // Breathy noise layer
  const noise = ctx.createOscillator();
  noise.type = 'sawtooth';
  noise.frequency.value = 150;
  const nf = ctx.createBiquadFilter();
  nf.type = 'highpass';
  nf.frequency.value = 3000;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0, time);
  ng.gain.linearRampToValueAtTime(0.008 * velocity, time + 0.020);
  ng.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  ng.gain.setValueAtTime(0, releaseEnd);
  noise.connect(nf).connect(ng).connect(destination);
  noise.start(time);
  noise.stop(releaseEnd + 0.01);
}

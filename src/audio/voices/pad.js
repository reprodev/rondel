// Pad — warm sustained wash with detuned sawtooths. Background texture.
import { floor } from '../env.js';
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.16;
  const freq = params.frequency ?? 220;
  const duration = params.duration ?? 0.5;
  const detunes = [-24, 0, 24];
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  filter.Q.value = 1;
  const gain = ctx.createGain();
  const peakGain = 0.06 * velocity;
  const sustainLevel = peakGain * 0.4;
  const attackEnd = time + 0.120;
  const releaseStart = time + duration;
  const releaseEnd = releaseStart + 0.800;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peakGain, attackEnd);
  gain.gain.setValueAtTime(sustainLevel, attackEnd + 0.001);
  gain.gain.setValueAtTime(sustainLevel, releaseStart);
  gain.gain.exponentialRampToValueAtTime(floor(0), releaseEnd);
  gain.gain.setValueAtTime(0, releaseEnd);
  const oscs = detunes.map(d => {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = freq;
    o.detune.value = d;
    o.connect(filter);
    o.start(time);
    o.stop(releaseEnd + 0.01);
    return o;
  });
  filter.connect(gain).connect(destination);
  oscs[0].onended = () => {
    oscs.forEach(o => o.disconnect());
    filter.disconnect(); gain.disconnect();
  };
}

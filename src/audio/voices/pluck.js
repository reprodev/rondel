// Pluck — sawtooth with fast filter envelope for a percussive string sound.
// The rapid filter decay gives the characteristic "pluck" transient while
// the body decays naturally into the delay/reverb tail.

import { floor } from '../env.js';

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 * @param {number} time
 * @param {object} params - { step, voice, velocity?, frequency? }
 */
export function play(ctx, destination, time, params) {
  const velocity = params.velocity ?? 0.8;
  const freq = params.frequency ?? 80;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = freq;

  // Lowpass filter with fast envelope — this is what makes it a pluck
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 1;

  // Filter envelope: open to 2800 Hz, fast decay to 600 Hz
  filter.frequency.setValueAtTime(2800, time);
  filter.frequency.exponentialRampToValueAtTime(floor(600), time + 0.100);

  // Amplitude envelope — fast attack, natural string decay
  const gain = ctx.createGain();
  const level = 0.10 * velocity;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(level, time + 0.002);               // 2ms attack
  gain.gain.exponentialRampToValueAtTime(floor(0), time + 0.002 + 0.180); // 180ms decay
  gain.gain.setValueAtTime(0, time + 0.002 + 0.180);                   // snap to zero

  // Routing
  osc.connect(filter).connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.25);

  // Cleanup
  osc.onended = () => {
    osc.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

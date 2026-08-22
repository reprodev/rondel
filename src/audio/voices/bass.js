// Bass — two detuned sawtooths through a resonant lowpass.
// Filter envelope gives the pluck; gated amplitude keeps it tight.

import { attack, decay, floor } from '../env.js';

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 * @param {number} time
 * @param {object} params - { step, voice, frequency?: Hz, duration?: sec, velocity? }
 */
export function play(ctx, destination, time, params) {
  const freq = params.frequency ?? 55;
  const velocity = params.velocity ?? 0.8;
  // Gate duration: 90% of step duration to stay tight in the pocket
  const duration = (params.duration ?? 0.125) * 0.9;
  
  // Two sawtooth oscillators at perfect unison (0 cents detune)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';
  osc1.frequency.value = freq;
  osc2.frequency.value = freq;
  osc1.detune.value = 0;
  osc2.detune.value = 0;
  
  // Lowpass filter with resonance
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 7;
  
  // Filter envelope: 220 Hz → 1400 Hz (attack 8ms) → 320 Hz (release 300ms)
  // The filter sweep is what gives the bass its "pluck" — fast open, slow close.
  filter.frequency.setValueAtTime(220, time);
  filter.frequency.linearRampToValueAtTime(1400, time + 0.008);
  filter.frequency.exponentialRampToValueAtTime(floor(320), time + 0.008 + 0.300);
  
  // Amplitude envelope — gated
  const gain = ctx.createGain();
  gain.gain.value = 0;
  // 0.25 output gain keeps bass under the kick in the mix.
  const level = 0.25 * velocity;
  attack(ctx, gain.gain, time, level, 0.002);             // 2ms attack
  decay(ctx, gain.gain, time + duration, 0, 0.030);       // 30ms release at gate end
  
  // Routing
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain).connect(destination);
  
  const stopTime = time + duration + 0.05;
  osc1.start(time);
  osc2.start(time);
  osc1.stop(stopTime);
  osc2.stop(stopTime);
  
  // Cleanup
  osc1.onended = () => {
    osc1.disconnect();
    osc2.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

// Poly pad — three detuned sawtooths through a gentle lowpass.
// ADSR envelope and a hard 6-voice cap keep it from consuming all CPU.
// This is the voice that makes the sequencer sound beautiful.

import { attack, decay, floor } from '../env.js';

// Voice pool — cap at 6 simultaneous instances to prevent runaway.
// Oldest voice is killed when the 7th fires.
const voicePool = [];
const MAX_VOICES = 6;

function killOldest() {
  if (voicePool.length >= MAX_VOICES) {
    const oldest = voicePool.shift();
    try {
      // Fast fade to prevent click
      oldest.gain.gain.cancelScheduledValues(0);
      oldest.gain.gain.setValueAtTime(oldest.gain.gain.value, oldest.ctx.currentTime);
      oldest.gain.gain.linearRampToValueAtTime(0, oldest.ctx.currentTime + 0.010);
      oldest.oscs.forEach(o => { try { o.stop(oldest.ctx.currentTime + 0.015); } catch(e) {} });
    } catch (e) { /* already stopped */ }
  }
}

function removeFromPool(entry) {
  const idx = voicePool.indexOf(entry);
  if (idx !== -1) voicePool.splice(idx, 1);
}

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 * @param {number} time
 * @param {object} params - { step, voice, frequency?: Hz, duration?: sec, velocity?, reverbSend?: AudioNode }
 */
export function play(ctx, destination, time, params) {
  const freq = params.frequency ?? 220;
  const velocity = params.velocity ?? 0.16;
  const duration = params.duration ?? 0.5;
  const reverbSend = params.reverbSend ?? null;
  
  // Kill oldest if pool is full
  killOldest();
  
  // Three sawtooths at -7, 0, +7 cents for lush detune spread
  const oscs = [];
  const detunes = [-7, 0, 7];
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2600;
  filter.Q.value = 1.5;
  
  for (const d of detunes) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc.detune.value = d;
    osc.connect(filter);
    oscs.push(osc);
  }
  
  // Amplitude ADSR
  // A=120ms (linear), D=250ms, S=0.45, R=900ms (exponential)
  const gain = ctx.createGain();
  gain.gain.value = 0;
  
  const peakGain = velocity; // peak at velocity (default 0.16, soft)
  const sustainLevel = peakGain * 0.45;
  const attackEnd = time + 0.120;
  const decayEnd = attackEnd + 0.250;
  const releaseStart = time + duration;
  const releaseEnd = releaseStart + 0.900;
  
  // Attack: 0 → peak over 120ms (linear)
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peakGain, attackEnd);
  // Decay: peak → sustain over 250ms (exponential)
  gain.gain.exponentialRampToValueAtTime(floor(sustainLevel), decayEnd);
  // Sustain: hold at sustain level until release
  gain.gain.setValueAtTime(sustainLevel, releaseStart);
  // Release: sustain → 0 over 900ms (exponential)
  gain.gain.exponentialRampToValueAtTime(0.0001, releaseEnd);
  gain.gain.setValueAtTime(0, releaseEnd);
  
  // Routing
  filter.connect(gain).connect(destination);
  
  // Reverb send (very wet — 0.5 mix)
  if (reverbSend) {
    const sendGain = ctx.createGain();
    sendGain.gain.value = 0.5;
    filter.connect(sendGain).connect(reverbSend);
    // sendGain cleanup handled by onended
  }
  
  const stopTime = releaseEnd + 0.01;
  oscs.forEach(o => { o.start(time); o.stop(stopTime); });
  
  // Track in voice pool
  const entry = { ctx, gain, oscs };
  voicePool.push(entry);
  
  // Cleanup on note end
  oscs[0].onended = () => {
    oscs.forEach(o => o.disconnect());
    filter.disconnect();
    gain.disconnect();
    removeFromPool(entry);
  };
}

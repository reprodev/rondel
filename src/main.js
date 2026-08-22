// Application bootstrap — wires audio context, scheduler, and voices together.
// Imported by index.html's module script.

import { getContext, ensureResumed } from './audio/context.js';
import {
  start as startScheduler,
  stop as stopScheduler,
  isPlaying,
  setActiveVoices as setSchedulerActiveVoices,
} from './audio/scheduler.js';
import { kick, snare, hat, bass, poly } from './audio/voices/index.js';
import { initNoise } from './audio/noise.js';

const voices = [kick, snare, hat, bass, poly];

/**
 * Start playback with the given patch data.
 * Ensures AudioContext is running, initializes noise buffer,
 * and starts the scheduler with all 5 voices.
 */
export async function start(patchData = {}) {
  const ctx = await ensureResumed();

  // Noise buffer must exist before snare/hat can play
  initNoise(ctx);

  startScheduler({
    bpm: patchData.bpm || 120,
    stepsPerLoop: 16,
    voices,
    dest: ctx.destination,
    activeVoices: patchData.activeVoices,
  });
}

/**
 * Stop playback and silence all voices.
 */
export function stop() {
  stopScheduler();
}

/**
 * Returns whether the sequencer is currently running.
 */
export function playing() {
  return isPlaying();
}

/**
 * Update which voices are active (0=kick, 1=snare, 2=hat, 3=bass, 4=poly).
 * Can be called while playing — takes effect on the next scheduled step.
 */
export function setActiveVoices(indices) {
  setSchedulerActiveVoices(indices);
}

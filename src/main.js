// Application bootstrap — wires audio context, scheduler, voices, and UI together.
// Imported by index.html's module script.

import { getContext, ensureResumed } from './audio/context.js';
import {
  start as startScheduler,
  stop as stopScheduler,
  isPlaying,
  setActiveVoices as setSchedulerActiveVoices,
  getNextNoteTime,
} from './audio/scheduler.js';
import { kick, snare, hat, bass, poly } from './audio/voices/index.js';
import { initNoise } from './audio/noise.js';
import { startDrawLoop, stopDrawLoop, pushEvent, syncTiming, setActiveVoices as setRadialActiveVoices } from './ui/radial.js';

const voices = [kick, snare, hat, bass, poly];

// Wrap each voice to also push a visual event
function wrapVoice(voiceFn, ringIndex) {
  return (ctx, destination, time, params) => {
    voiceFn(ctx, destination, time, params);
    pushEvent(ringIndex, params.step, time);
  };
}

const wrappedVoices = voices.map((v, i) => wrapVoice(v, i));

/**
 * Start playback with the given patch data.
 * Ensures AudioContext is running, initializes noise buffer,
 * starts the scheduler, and begins the draw loop.
 */
export async function start(patchData = {}) {
  const ctx = await ensureResumed();

  // Noise buffer must exist before snare/hat can play
  initNoise(ctx);

  const bpm = patchData.bpm || 120;
  const stepsPerLoop = 16;

  startScheduler({
    bpm,
    stepsPerLoop,
    voices: wrappedVoices,
    dest: ctx.destination,
    activeVoices: patchData.activeVoices,
  });

  // Start the visual loop synced to the audio clock
  const secondsPerStep = (60 / bpm) / (stepsPerLoop / 4);
  const secondsPerLoop = secondsPerStep * stepsPerLoop;

  startDrawLoop({
    bpm,
    stepsPerLoop,
    loopStartTime: performance.now() / 1000,
    seed: patchData.seed || 12345,
    activeVoices: patchData.activeVoices || [0, 1, 2, 3, 4],
  });

  syncTiming(performance.now() / 1000, secondsPerLoop, bpm);
}

/**
 * Stop playback and the draw loop.
 */
export function stop() {
  stopScheduler();
  stopDrawLoop();
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
  setRadialActiveVoices(indices);
}

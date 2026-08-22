// Application bootstrap — wires audio, scheduler, voices, UI, and interactions.
// This is the glue layer: no logic of its own, just plumbing between modules.

import { getContext, ensureResumed } from './audio/context.js';
import {
  start as startScheduler,
  stop as stopScheduler,
  isPlaying,
  setActiveVoices as setSchedulerActiveVoices,
  setBpm as setSchedulerBpm,
} from './audio/scheduler.js';
import { kick, snare, hat, bass, poly } from './audio/voices/index.js';
import { initNoise } from './audio/noise.js';
import { startDrawLoop, stopDrawLoop, pushEvent, syncTiming, setActiveVoices as setRadialActiveVoices, updateRings } from './ui/radial.js';
import { getCanvas } from './ui/canvas.js';
import { startInteraction, stopInteraction } from './ui/interact.js';
import * as Controls from './ui/controls.js';
import { createPatch } from './state/patch.js';
import { bjorklund, rotate } from './gen/euclid.js';

// --- Module state ---

let currentPatch = createPatch();
const voices = [kick, snare, hat, bass, poly];

// Wrap each voice to check the Euclidean pattern before playing.
// This is where rotation, pulses, and probability actually gate the audio.
function wrapVoice(voiceFn, ringIndex) {
  return (ctx, destination, time, params) => {
    const ring = currentPatch.rings[ringIndex];
    if (!ring) return;

    // Generate the rotated Euclidean pattern for this ring
    const pattern = rotate(bjorklund(ring.steps, ring.pulses), ring.rotation);

    // Gate: only play if this step is active in the pattern
    const stepInPattern = params.step % ring.steps;
    if (!pattern[stepInPattern]) return;

    // Probability gate: skip randomly based on ring probability
    if (ring.probability < 1.0 && Math.random() > ring.probability) return;

    voiceFn(ctx, destination, time, params);
    pushEvent(ringIndex, params.step, time);
  };
}

const wrappedVoices = voices.map((v, i) => wrapVoice(v, i));

// --- Interaction callbacks ---

function onStepToggle(ring, step) {
  console.log(`[main] onStepToggle(ring=${ring}, step=${step})`);
  const r = currentPatch.rings[ring];
  if (!r) return;
  const pattern = rotate(bjorklund(r.steps, r.pulses), r.rotation);
  if (pattern[step]) {
    r.pulses = Math.max(0, r.pulses - 1);
  } else {
    r.pulses = Math.min(r.steps, r.pulses + 1);
  }
  updateRings(currentPatch.rings);
  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
}

function onProbabilityDrag(ring, step, newProb) {
  console.log(`[main] onProbabilityDrag(ring=${ring}, step=${step}, prob=${newProb.toFixed(3)})`);
  const r = currentPatch.rings[ring];
  if (!r) return;
  r.probability = Math.max(0, Math.min(1, newProb));
  updateRings(currentPatch.rings);
  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
}

function onPulsesDrag(ring, newPulses) {
  console.log(`[main] onPulsesDrag(ring=${ring}, pulses=${newPulses})`);
  const r = currentPatch.rings[ring];
  if (!r) return;
  r.pulses = Math.max(0, Math.min(r.steps, newPulses));
  updateRings(currentPatch.rings);
  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
}

function onRotationDrag(ring, deltaRotation) {
  console.log(`[main] onRotationDrag(ring=${ring}, delta=${deltaRotation})`);
  const r = currentPatch.rings[ring];
  if (!r) return;
  r.rotation = ((r.rotation + deltaRotation) % r.steps + r.steps) % r.steps;
  updateRings(currentPatch.rings);
  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
}

function onTempoTap(deltaBPM) {
  console.log(`[main] onTempoTap(delta=${deltaBPM})`);
  currentPatch.bpm = Math.max(60, Math.min(200, currentPatch.bpm + deltaBPM));
  setSchedulerBpm(currentPatch.bpm);

  // Resync the visual loop timing
  const stepsPerLoop = 16;
  const secondsPerStep = (60 / currentPatch.bpm) / (stepsPerLoop / 4);
  const secondsPerLoop = secondsPerStep * stepsPerLoop;
  syncTiming(performance.now() / 1000, secondsPerLoop, currentPatch.bpm);

  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
}

function onPlayToggle() {
  console.log(`[main] onPlayToggle()`);
  if (isPlaying()) {
    stop();
  } else {
    start();
  }
}

// --- Public API ---

/**
 * Start playback with optional patch overrides.
 * Merges patchData into currentPatch rather than replacing it, so callers
 * can pass partial objects (e.g., { bpm, activeVoices }) without losing
 * the full patch structure (rings, arrangement, etc.).
 */
export async function start(patchData) {
  // Merge partial patchData into currentPatch
  if (patchData && patchData !== currentPatch) {
    if (patchData.bpm !== undefined) currentPatch.bpm = patchData.bpm;
    if (patchData.activeVoices !== undefined) currentPatch.activeVoices = patchData.activeVoices;
    if (patchData.seed !== undefined) currentPatch.seed = patchData.seed;
    if (patchData.rings) currentPatch.rings = patchData.rings;
  }

  const ctx = await ensureResumed();

  // Noise buffer must exist before snare/hat can play
  initNoise(ctx);

  const bpm = currentPatch.bpm || 120;
  const stepsPerLoop = 16;

  startScheduler({
    bpm,
    stepsPerLoop,
    voices: wrappedVoices,
    dest: ctx.destination,
    activeVoices: currentPatch.activeVoices,
  });

  // Start the visual loop synced to the audio clock
  const secondsPerStep = (60 / bpm) / (stepsPerLoop / 4);
  const secondsPerLoop = secondsPerStep * stepsPerLoop;

  startDrawLoop({
    bpm,
    stepsPerLoop,
    loopStartTime: performance.now() / 1000,
    seed: currentPatch.seed || 12345,
    activeVoices: currentPatch.activeVoices || [0, 1, 2, 3, 4],
  });

  syncTiming(performance.now() / 1000, secondsPerLoop, bpm);

  // Wire canvas interactions
  const { canvas } = getCanvas();
  startInteraction(canvas, {
    onStepToggle,
    onProbabilityDrag,
    onPulsesDrag,
    onRotationDrag,
    onTempoTap,
    onPlayToggle,
    ringSteps: currentPatch.rings.map(r => r.steps),
  });

  Controls.setPlayingState(true);
  Controls.updateStatus(currentPatch, true, bpm);
}

/**
 * Stop playback, the draw loop, and interactions.
 */
export function stop() {
  stopScheduler();
  stopDrawLoop();
  stopInteraction();
  Controls.setPlayingState(false);
  Controls.updateStatus(currentPatch, false, currentPatch.bpm);
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
  currentPatch.activeVoices = indices;
}

/**
 * Get the current live patch state.
 */
export function getPatch() {
  return currentPatch;
}

// --- Bootstrap ---
// Initialize controls DOM on module load. The controls root element
// gets inserted before the canvas in the page flow.

const { root } = Controls.initControls();

// Insert controls root into the page if not already there.
// Waits for DOMContentLoaded in case module loads before body is parsed.
function insertControls() {
  const container = document.querySelector('.controls');
  if (container) {
    container.replaceWith(root);
  } else {
    document.body.prepend(root);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', insertControls);
} else {
  insertControls();
}

// Wire the play button from controls.js
Controls.getPlayButton().addEventListener('click', onPlayToggle);

// Wire copy button placeholder
Controls.showCopyToast; // available for future codec wiring

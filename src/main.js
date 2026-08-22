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
import { createMaster } from './audio/master.js';
import { startDrawLoop, stopDrawLoop, pushEvent, syncTiming, setActiveVoices as setRadialActiveVoices, updateRings } from './ui/radial.js';
import { getCanvas } from './ui/canvas.js';
import { startInteraction, stopInteraction } from './ui/interact.js';
import * as Controls from './ui/controls.js';
import { createPatch } from './state/patch.js';
import { encodePatch, syncHashWithPatch, loadPatchFromHash, loadPatchFromStorage, savePatchToStorage } from './state/codec.js';
import { bjorklund, rotate } from './gen/euclid.js';

// --- Module state ---

// Load patch from URL hash, localStorage, or defaults (in priority order)
let currentPatch = loadPatchFromHash() || loadPatchFromStorage() || createPatch();
let master = null;

// Voice lookup by name — allows dynamic reassignment via ring.voice field.
const voiceMap = { kick, snare, hat, bass, poly };

// Each ring's play function resolves the voice at play-time from ring.voice,
// so reassigning ring.voice immediately changes what sound plays.
function playRing(ringIndex) {
  return (ctx, destination, time, params) => {
    const ring = currentPatch.rings[ringIndex];
    if (!ring) return;

    const pattern = rotate(bjorklund(ring.steps, ring.pulses), ring.rotation);
    const stepInPattern = params.step % ring.steps;
    if (!pattern[stepInPattern]) return;

    if (ring.probability < 1.0 && Math.random() > ring.probability) return;

    // Resolve voice function dynamically from ring.voice
    const voiceFn = voiceMap[ring.voice];
    if (!voiceFn) return;

    voiceFn(ctx, destination, time, { ...params, velocity: ring.gain });
    pushEvent(ringIndex, params.step, time);
  };
}

const wrappedVoices = [0, 1, 2, 3, 4].map(i => playRing(i));

// --- Patch persistence helper ---

function persistPatch() {
  syncHashWithPatch(currentPatch);
  savePatchToStorage(currentPatch);
}

// --- Interaction callbacks ---

function onStepToggle(ring, step) {
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
  persistPatch();
}

function onProbabilityDrag(ring, step, newProb) {
  const r = currentPatch.rings[ring];
  if (!r) return;
  r.probability = Math.max(0, Math.min(1, newProb));
  updateRings(currentPatch.rings);
  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
  persistPatch();
}

function onPulsesDrag(ring, newPulses) {
  const r = currentPatch.rings[ring];
  if (!r) return;
  r.pulses = Math.max(0, Math.min(r.steps, newPulses));
  updateRings(currentPatch.rings);
  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
  persistPatch();
}

function onRotationDrag(ring, deltaRotation) {
  const r = currentPatch.rings[ring];
  if (!r) return;
  r.rotation = ((r.rotation + deltaRotation) % r.steps + r.steps) % r.steps;
  updateRings(currentPatch.rings);
  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
  persistPatch();
}

function onTempoTap(deltaBPM) {
  currentPatch.bpm = Math.max(60, Math.min(200, currentPatch.bpm + deltaBPM));
  setSchedulerBpm(currentPatch.bpm);

  const stepsPerLoop = 16;
  const secondsPerStep = (60 / currentPatch.bpm) / (stepsPerLoop / 4);
  const secondsPerLoop = secondsPerStep * stepsPerLoop;
  syncTiming(performance.now() / 1000, secondsPerLoop, currentPatch.bpm);

  Controls.updateStatus(currentPatch, isPlaying(), currentPatch.bpm);
  persistPatch();
}

function onPlayToggle() {
  if (isPlaying()) {
    stop();
  } else {
    start();
  }
}

// --- Public API ---

export async function start(patchData) {
  if (patchData && patchData !== currentPatch) {
    if (patchData.bpm !== undefined) currentPatch.bpm = patchData.bpm;
    if (patchData.root !== undefined) currentPatch.root = patchData.root;
    if (patchData.scale !== undefined) currentPatch.scale = patchData.scale;
    if (patchData.seed !== undefined) currentPatch.seed = patchData.seed;
    if (patchData.masterGain !== undefined) currentPatch.masterGain = patchData.masterGain;
    if (patchData.activeVoices !== undefined) currentPatch.activeVoices = patchData.activeVoices;
    if (patchData.rings) currentPatch.rings = patchData.rings;
    if (patchData.arrangement) currentPatch.arrangement = patchData.arrangement;
  }

  const ctx = await ensureResumed();
  initNoise(ctx);

  // Create master bus: compressor + limiter + analyser
  if (master) master.disconnect();
  master = createMaster(ctx);
  master.gain.gain.value = currentPatch.masterGain ?? 0.45;
  master.connect(ctx.destination);

  const bpm = currentPatch.bpm || 120;
  const stepsPerLoop = 16;

  startScheduler({
    bpm,
    stepsPerLoop,
    voices: wrappedVoices,
    dest: master.input,  // voices route through master chain
    activeVoices: currentPatch.activeVoices,
  });

  const secondsPerStep = (60 / bpm) / (stepsPerLoop / 4);
  const secondsPerLoop = secondsPerStep * stepsPerLoop;

  startDrawLoop({
    bpm,
    stepsPerLoop,
    loopStartTime: performance.now() / 1000,
    seed: currentPatch.seed || 12345,
    activeVoices: currentPatch.activeVoices || [0, 1, 2, 3, 4],
    rings: currentPatch.rings,
  });

  syncTiming(performance.now() / 1000, secondsPerLoop, bpm);

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

export function stop() {
  stopScheduler();
  stopDrawLoop();
  stopInteraction();
  if (master) {
    master.disconnect();
    master = null;
  }
  Controls.setPlayingState(false);
  Controls.updateStatus(currentPatch, false, currentPatch.bpm);
}

export function playing() {
  return isPlaying();
}

export function setActiveVoices(indices) {
  setSchedulerActiveVoices(indices);
  setRadialActiveVoices(indices);
  currentPatch.activeVoices = indices;
}

export function getPatch() {
  return currentPatch;
}

// --- Copy link ---

function copyPatchLink() {
  const encoded = encodePatch(currentPatch);
  if (!encoded) return;
  const url = window.location.origin + window.location.pathname + '#' + encoded;
  navigator.clipboard.writeText(url).then(() => {
    Controls.showCopyToast('Link copied!');
  }).catch(() => {
    Controls.showCopyToast('Copy failed');
  });
}

// --- Bootstrap ---

const { root } = Controls.initControls();

function insertControls() {
  document.body.prepend(root);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', insertControls);
} else {
  insertControls();
}

// Wire play button
Controls.getPlayButton().addEventListener('click', onPlayToggle);

// Wire copy (double-click play button as copy shortcut for now)
Controls.getPlayButton().addEventListener('dblclick', (e) => {
  e.preventDefault();
  copyPatchLink();
});

// Initial status
Controls.updateStatus(currentPatch, false, currentPatch.bpm);

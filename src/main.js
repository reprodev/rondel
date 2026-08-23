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
import { kick, snare, hat, bass, poly, pluck, clap, tom, cowbell, rim, conga, bell, pad, kalimba, vibraphone, stringPad, gong, sitar, choir, vocalPad, vocalStab, harmonies, whisper, vocalGlitch, shaker, subBass, metallic, marimba, tape, organ } from './audio/voices/index.js';
import { initNoise } from './audio/noise.js';
import { createMaster } from './audio/master.js';
import { startDrawLoop, stopDrawLoop, pushEvent, syncTiming, setActiveVoices as setRadialActiveVoices, updateRings } from './ui/radial.js';
import { getCanvas } from './ui/canvas.js';
import { startInteraction, stopInteraction } from './ui/interact.js';
import * as Controls from './ui/controls.js';
import { createPatch } from './state/patch.js';
import { encodePatch, syncHashWithPatch, loadPatchFromHash, loadPatchFromStorage, savePatchToStorage } from './state/codec.js';
import { bjorklund, rotate } from './gen/euclid.js';
import { midiToFreq } from './gen/scales.js';

// --- Module state ---

// Load patch from URL hash, localStorage, or defaults (in priority order)
let currentPatch = loadPatchFromHash() || loadPatchFromStorage() || createPatch();
let master = null;

// Voice lookup by name — allows dynamic reassignment via ring.voice field.
const voiceMap = { kick, snare, hat, bass, poly, pluck, clap, tom, cowbell, rim, conga, bell, pad, kalimba, vibraphone, stringPad, gong, sitar, choir, vocalPad, vocalStab, harmonies, whisper, vocalGlitch, shaker, subBass, metallic, marimba, tape, organ };

// Percussive voices don't need a frequency parameter
const PERCUSSIVE_VOICES = new Set(['kick','snare','hat','clap','tom','cowbell','rim','conga','shaker']);

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

    voiceFn(ctx, destination, time, { ...params, velocity: ring.gain, frequency: PERCUSSIVE_VOICES.has(ring.voice) ? undefined : midiToFreq(currentPatch.root) });
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
  try {
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
  } catch (err) {
    Controls.showCopyToast('Audio failed to start — tap to retry');
    Controls.setPlayingState(false);
    console.error('[rondel] start() failed:', err);
  }
}

export function stop() {
  stopScheduler();
  stopDrawLoop();
  stopInteraction();
  if (master) {
    // Quick fade-out to avoid click/pop and silence any decaying tails
    const ctx = master.gain.context;
    const now = ctx.currentTime;
    master.gain.gain.cancelScheduledValues(now);
    master.gain.gain.setValueAtTime(master.gain.gain.value, now);
    master.gain.gain.linearRampToValueAtTime(0, now + 0.05);
    // Disconnect after fade completes
    const oldMaster = master;
    setTimeout(() => oldMaster.disconnect(), 80);
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

/**
 * Reassign the voice for a specific ring. Takes effect on the next step.
 * @param {number} ringIndex — 0-4
 * @param {string} voiceName — one of: kick, snare, hat, bass, poly, pluck, clap, tom
 */
export function setRingVoice(ringIndex, voiceName) {
  const ring = currentPatch.rings[ringIndex];
  if (!ring) return;
  ring.voice = voiceName;
  updateRings(currentPatch.rings);
  persistPatch();
}

/**
 * Export the current patch as a WAV file and trigger download.
 * @param {number} durationSeconds — how long to render
 */
export async function exportCurrentPatch(durationSeconds) {
  const { exportWAV, downloadWAV } = await import('./audio/export.js');
  const { wavBlob } = await exportWAV(currentPatch, durationSeconds);
  downloadWAV(wavBlob, `rondel-${Date.now()}.wav`);
}

/**
 * Export the current patch as a MIDI file and trigger download.
 * Converts Euclidean patterns to MIDI note events (4 bars).
 */
export async function exportCurrentPatchMidi() {
  const { encodeMidi } = await import('./audio/midi.js');
  const { bjorklund, rotate } = await import('./gen/euclid.js');

  const bpm = currentPatch.bpm || 120;
  const stepsPerLoop = 16;
  const bars = 4;
  const totalSteps = stepsPerLoop * bars;

  // Map ring voices to MIDI pitches (GM drum map for drums, pitched for melodic)
  const voiceMidiMap = {
    kick: 36, snare: 38, hat: 42, bass: 35, poly: 60,
    pluck: 62, clap: 39, tom: 45, cowbell: 56, rim: 37,
    conga: 63, bell: 67, pad: 64, kalimba: 69, vibraphone: 72,
    stringPad: 55, gong: 52, sitar: 71, choir: 74
  };

  const tracks = [];

  for (let ringIndex = 0; ringIndex < currentPatch.rings.length; ringIndex++) {
    const ring = currentPatch.rings[ringIndex];
    if (!ring) continue;

    const pattern = rotate(bjorklund(ring.steps, ring.pulses), ring.rotation);
    const pitch = voiceMidiMap[ring.voice] || 60;
    const velocity = Math.round((ring.gain || 0.7) * 127);
    const notes = [];

    for (let step = 0; step < totalSteps; step++) {
      const stepInPattern = step % ring.steps;
      if (!pattern[stepInPattern]) continue;
      if (ring.probability < 1.0 && Math.random() > ring.probability) continue;

      notes.push({
        pitch,
        start: step / (stepsPerLoop / 4), // in beats (quarter notes)
        duration: 0.25, // 16th note
        velocity
      });
    }

    tracks.push({ notes });
  }

  const midiBytes = encodeMidi({ bpm, tracks });
  const blob = new Blob([midiBytes], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);

  // iOS Safari fallback
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    window.open(url, '_blank');
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = `rondel-${Date.now()}.mid`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  Controls.showCopyToast('MIDI exported');
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
  const header = document.querySelector('.app-header');
  if (header) {
    header.appendChild(root);
  } else {
    document.body.prepend(root);
  }
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

// Wire volume control
Controls.onVolume((vol) => {
  if (master && master.gain) {
    master.gain.gain.setValueAtTime(vol * (currentPatch.masterGain ?? 0.45), master.gain.context.currentTime);
  }
});

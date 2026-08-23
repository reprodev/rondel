// Transport scheduler — connects the clock worker heartbeat to voice playback.
// Uses lookahead scheduling: on each tick, schedules all events that fall within
// the lookahead window. This decouples audio timing from JavaScript's event loop.

import { getContext } from './context.js';

let worker = null;
let fallbackIntervalId = null;
let isRunning = false;
let currentStep = 0;
let nextNoteTime = 0;
let secondsPerStep = 0;
let bpm = 120;
let stepsPerLoop = 16;
let lookahead = 0.1;
let voicePlayers = [];
let destination = null;
let ctx = null;

// Which voice indices are active — only these get scheduled.
let activeVoices = new Set([0, 1, 2, 3, 4]);

function onTick() {
  while (nextNoteTime < ctx.currentTime + lookahead) {
    scheduleStep();
    advance();
  }
}

function onVisibilityChange() {
  if (worker) {
    worker.postMessage({ command: 'visibility', hidden: document.hidden });
  }
}

export function scheduleStep() {
  for (let i = 0; i < voicePlayers.length; i++) {
    if (!activeVoices.has(i)) continue;
    const t = Math.max(nextNoteTime, ctx.currentTime + 0.01);
    voicePlayers[i](ctx, destination, t, { step: currentStep, voice: i });
  }
}

export function advance() {
  currentStep = (currentStep + 1) % stepsPerLoop;
  nextNoteTime += secondsPerStep;
}

export function start(options = {}) {
  if (isRunning) stop();

  ctx = getContext();
  bpm = options.bpm || 120;
  stepsPerLoop = options.stepsPerLoop || 16;
  voicePlayers = options.voices || [];
  destination = options.dest || ctx.destination;

  if (options.activeVoices !== undefined) {
    activeVoices = new Set(options.activeVoices);
  }

  secondsPerStep = (60 / bpm) / (stepsPerLoop / 4);
  nextNoteTime = ctx.currentTime + 0.1;
  currentStep = 0;

  try {
    worker = new Worker(new URL('./clock.worker.js', import.meta.url));
    worker.onmessage = (e) => {
      if (e.data.type === 'tick') {
        onTick();
      } else if (e.data.type === 'config') {
        lookahead = e.data.lookahead;
      }
    };
    worker.postMessage({ command: 'start' });
  } catch (e) {
    // Fallback for browsers that don't support module workers or import.meta in workers
    worker = null;
    fallbackIntervalId = setInterval(onTick, 25);
  }
  document.addEventListener('visibilitychange', onVisibilityChange);
  isRunning = true;
}

export function stop() {
  if (!isRunning) return;

  if (worker) {
    worker.postMessage({ command: 'stop' });
    worker.terminate();
    worker = null;
  }
  if (fallbackIntervalId !== null) {
    clearInterval(fallbackIntervalId);
    fallbackIntervalId = null;
  }

  document.removeEventListener('visibilitychange', onVisibilityChange);
  isRunning = false;
}

export function setActiveVoices(indices) {
  activeVoices = new Set(indices);
}

export function setBpm(newBpm) {
  bpm = newBpm;
  secondsPerStep = (60 / bpm) / (stepsPerLoop / 4);
}

export function getCurrentStep() {
  return currentStep;
}

export function getNextNoteTime() {
  return nextNoteTime;
}

export function isPlaying() {
  return isRunning;
}

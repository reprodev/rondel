// Transport scheduler — connects the clock worker heartbeat to voice playback.
// Uses lookahead scheduling: on each tick, schedules all events that fall within
// the lookahead window. This decouples audio timing from JavaScript's event loop.

import { getContext } from './context.js';

let worker = null;
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

function onTick() {
  // Schedule all events that fall within the lookahead window.
  // The while loop handles catch-up after tab switches or GC pauses.
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
    // Clamp to prevent scheduling in the past after long stalls.
    const t = Math.max(nextNoteTime, ctx.currentTime + 0.005);
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

  secondsPerStep = (60 / bpm) / (stepsPerLoop / 4);
  nextNoteTime = ctx.currentTime + 0.1;
  currentStep = 0;

  worker = new Worker(new URL('./clock.worker.js', import.meta.url));

  worker.onmessage = (e) => {
    if (e.data.type === 'tick') {
      onTick();
    } else if (e.data.type === 'config') {
      lookahead = e.data.lookahead;
    }
  };

  worker.postMessage({ command: 'start' });
  document.addEventListener('visibilitychange', onVisibilityChange);
  isRunning = true;
}

export function stop() {
  if (!isRunning) return;

  worker.postMessage({ command: 'stop' });
  worker.terminate();
  worker = null;

  document.removeEventListener('visibilitychange', onVisibilityChange);
  isRunning = false;
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

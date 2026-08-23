// AudioContext manager — handles browser autoplay policy by resuming on user gesture.

let ctx = null;
let listeners = [];
let gesturesBound = false;
let resumed = false;

/**
 * Lazy-create a shared AudioContext at 44100 Hz.
 * Does not resume — callers should use ensureResumed() or wait for a gesture.
 */
export function getContext() {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

/**
 * Ensure the AudioContext is running. Safe to call repeatedly —
 * only resumes if currently suspended.
 */
export async function ensureResumed() {
  const c = getContext();
  if (c.state === 'suspended') {
    await c.resume();
  }
  if (!resumed) {
    resumed = true;
    notifyListeners(c);
    teardownGestures();
  }
  return c;
}

/**
 * Register a callback for when the context reaches 'running' state.
 * If already running, fires synchronously. Returns an unsubscribe function.
 */
export function addResumeListener(callback) {
  if (ctx && ctx.state === 'running') {
    callback(ctx);
    return () => {};
  }
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(fn => fn !== callback);
  };
}

// --- Internal helpers ---

function notifyListeners(c) {
  for (const fn of listeners) {
    fn(c);
  }
  listeners = [];
}

function onGesture() {
  ensureResumed();
}

const gestureEvents = ['click', 'touchstart', 'keydown'];

function setupGestures() {
  if (gesturesBound) return;
  gesturesBound = true;
  for (const evt of gestureEvents) {
    document.addEventListener(evt, onGesture, { once: false, capture: true });
  }
}

function teardownGestures() {
  if (!gesturesBound) return;
  for (const evt of gestureEvents) {
    document.removeEventListener(evt, onGesture, { capture: true });
  }
  gesturesBound = false;
}

// Bind gesture listeners on module load so the first interaction resumes audio.
setupGestures();

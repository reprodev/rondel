// Interaction layer for the radial sequencer — translates pointer and
// keyboard events into semantic callbacks. Uses geometry.js for hit testing
// so interaction logic stays decoupled from rendering.

import { toPolar, snapToStep } from './geometry.js';
import { getMetrics } from './canvas.js';

let canvas = null;
let callbacks = {};
let cleanup = [];

// Ring layout must match radial.js exactly
const RING_COUNT = 5;
const RING_STEPS = [16, 16, 16, 16, 16]; // default, updated via options

// Drag state
let dragging = false;
let dragType = null;     // 'probability' | 'rotation' | null
let dragRing = -1;
let dragStep = -1;
let dragStartAngle = 0;
let dragStartRadius = 0;

/**
 * Compute ring layout metrics matching radial.js rendering.
 * Must stay in sync with radial.js constants.
 */
function getRingLayout() {
  const { size, cx, cy } = getMetrics();
  const ringSpacing = (size * 0.34) / 5;
  const innerRadius = size * 0.10;
  return { size, cx, cy, ringSpacing, innerRadius };
}

/**
 * Determine which ring (0-4) a given radius falls in, or -1 if none.
 * Uses a tolerance band around each ring's nominal radius.
 */
function hitRing(radius) {
  const { ringSpacing, innerRadius } = getRingLayout();
  const tolerance = ringSpacing * 0.4;

  for (let r = 0; r < RING_COUNT; r++) {
    const ringRadius = innerRadius + (r + 1) * ringSpacing;
    if (Math.abs(radius - ringRadius) < tolerance) return r;
  }
  return -1;
}

/**
 * Check if the radius is within the inner zone (center area for tempo/controls).
 */
function isInCenter(radius) {
  const { innerRadius } = getRingLayout();
  return radius < innerRadius;
}

/**
 * Get CSS-pixel coordinates from a pointer event relative to the canvas.
 */
function getCanvasXY(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// --- Pointer handlers ---

function onPointerDown(e) {
  const { x, y } = getCanvasXY(e);
  const { cx, cy, ringSpacing, innerRadius, size } = getRingLayout();
  const { radius, angle } = toPolar(cx, cy, x, y);

  const ring = hitRing(radius);

  if (ring >= 0) {
    const steps = RING_STEPS[ring] || 16;
    const step = snapToStep(angle, steps);

    // Start tracking for potential drag
    dragging = true;
    dragRing = ring;
    dragStep = step;
    dragStartAngle = angle;
    dragStartRadius = radius;
    dragType = null; // determined on first move

    canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
  } else if (isInCenter(radius)) {
    if (callbacks.onTempoTap) {
      const delta = x < cx ? -1 : 1;
      callbacks.onTempoTap(delta);
    }
    e.preventDefault();
  }
}

function onPointerMove(e) {
  if (!dragging) return;

  const { x, y } = getCanvasXY(e);
  const { cx, cy, ringSpacing, innerRadius } = getRingLayout();
  const { radius, angle } = toPolar(cx, cy, x, y);

  const ringRadius = innerRadius + (dragRing + 1) * ringSpacing;
  const radialDelta = Math.abs(radius - dragStartRadius);
  const angularDelta = Math.abs(angle - dragStartAngle);

  // Determine drag type on first significant movement
  if (!dragType) {
    if (radialDelta > 8) {
      dragType = 'probability';
    } else if (angularDelta > 10) {
      dragType = 'rotation';
    } else {
      return; // not enough movement yet
    }
  }

  if (dragType === 'probability') {
    const tolerance = ringSpacing * 0.4;
    const offset = radius - ringRadius;
    const normalized = (offset + tolerance) / (tolerance * 2);
    const prob = Math.max(0.1, Math.min(1.0, normalized));

    if (callbacks.onProbabilityDrag) {
      callbacks.onProbabilityDrag(dragRing, dragStep, prob);
    }
  } else if (dragType === 'rotation') {
    const steps = RING_STEPS[dragRing] || 16;
    const stepSize = 360 / steps;
    const deltaAngle = angle - dragStartAngle;
    const wrapped = ((deltaAngle + 180) % 360 + 360) % 360 - 180;
    const deltaSteps = Math.round(wrapped / stepSize);

    if (deltaSteps !== 0 && callbacks.onRotationDrag) {
      callbacks.onRotationDrag(dragRing, deltaSteps);
      dragStartAngle = angle;
    }
  }

  e.preventDefault();
}

function onPointerUp(e) {
  if (!dragging) {
    return;
  }

  // If no drag type was determined, this was a click (not a drag)
  if (!dragType) {
    // Use the step saved from pointerDown — re-snapping at the up position
    // can miss due to sub-pixel movement between down and up events.
    if (callbacks.onStepToggle) {
      callbacks.onStepToggle(dragRing, dragStep, undefined);
    }
  }

  dragging = false;
  dragType = null;
  dragRing = -1;
  dragStep = -1;

  canvas.releasePointerCapture(e.pointerId);
  e.preventDefault();
}

// --- Keyboard handler ---

function onKeyDown(e) {
  switch (e.code) {
    case 'Space':
      if (callbacks.onPlayToggle) callbacks.onPlayToggle();
      e.preventDefault();
      break;

    case 'ArrowLeft':
      if (callbacks.onRotationDrag) callbacks.onRotationDrag(0, -1);
      e.preventDefault();
      break;

    case 'ArrowRight':
      if (callbacks.onRotationDrag) callbacks.onRotationDrag(0, 1);
      e.preventDefault();
      break;

    case 'Equal':
    case 'NumpadAdd':
      if (callbacks.onTempoTap) callbacks.onTempoTap(1);
      e.preventDefault();
      break;

    case 'Minus':
    case 'NumpadSubtract':
      if (callbacks.onTempoTap) callbacks.onTempoTap(-1);
      e.preventDefault();
      break;
  }
}

// --- Touch prevention ---

function onTouchStart(e) {
  if (e.target === canvas) e.preventDefault();
}

/**
 * Attach interaction listeners to the canvas.
 * options.ringSteps can override the default step counts per ring.
 */
export function startInteraction(canvasEl, opts = {}) {
  canvas = canvasEl;
  callbacks = opts;

  if (opts.ringSteps) {
    for (let i = 0; i < opts.ringSteps.length && i < RING_COUNT; i++) {
      RING_STEPS[i] = opts.ringSteps[i];
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  document.addEventListener('keydown', onKeyDown);
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });

  cleanup = [
    () => canvas.removeEventListener('pointerdown', onPointerDown),
    () => canvas.removeEventListener('pointermove', onPointerMove),
    () => canvas.removeEventListener('pointerup', onPointerUp),
    () => canvas.removeEventListener('pointercancel', onPointerUp),
    () => document.removeEventListener('keydown', onKeyDown),
    () => canvas.removeEventListener('touchstart', onTouchStart),
  ];
}

/**
 * Remove all interaction listeners and reset state.
 */
export function stopInteraction() {
  for (const fn of cleanup) fn();
  cleanup = [];
  canvas = null;
  callbacks = {};
  dragging = false;
  dragType = null;
}

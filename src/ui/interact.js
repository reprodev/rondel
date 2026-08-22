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
  const ringSpacing = (size * 0.4) / 5;
  const innerRadius = size * 0.12;
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

  console.log(`[interact] pointerdown at (${x.toFixed(1)}, ${y.toFixed(1)}) | polar: r=${radius.toFixed(1)}, a=${angle.toFixed(1)} | center=(${cx.toFixed(0)},${cy.toFixed(0)}) size=${size}`);

  const ring = hitRing(radius);
  console.log(`[interact] hitRing(${radius.toFixed(1)}) = ${ring} | innerR=${innerRadius.toFixed(1)}, spacing=${ringSpacing.toFixed(1)}`);

  if (ring >= 0) {
    const steps = RING_STEPS[ring] || 16;
    const step = snapToStep(angle, steps);
    console.log(`[interact] Ring ${ring} hit! step=${step} (angle=${angle.toFixed(1)}, steps=${steps})`);

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
    console.log(`[interact] Center hit — tempo tap`);
    if (callbacks.onTempoTap) {
      const delta = x < cx ? -1 : 1;
      callbacks.onTempoTap(delta);
    }
    e.preventDefault();
  } else {
    console.log(`[interact] No hit — radius ${radius.toFixed(1)} doesn't match any ring or center`);
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
      console.log(`[interact] Drag type: PROBABILITY (radial delta=${radialDelta.toFixed(1)}px)`);
    } else if (angularDelta > 10) {
      dragType = 'rotation';
      console.log(`[interact] Drag type: ROTATION (angular delta=${angularDelta.toFixed(1)}deg)`);
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
      console.log(`[interact] Rotation: delta=${deltaSteps} steps`);
      callbacks.onRotationDrag(dragRing, deltaSteps);
      dragStartAngle = angle;
    }
  }

  e.preventDefault();
}

function onPointerUp(e) {
  if (!dragging) {
    console.log(`[interact] pointerup but not dragging — ignored`);
    return;
  }

  // If no drag type was determined, this was a click (not a drag)
  if (!dragType) {
    // Use the step saved from pointerDown — re-snapping at the up position
    // can miss due to sub-pixel movement between down and up events.
    console.log(`[interact] CLICK detected: ring=${dragRing}, step=${dragStep}`);
    if (callbacks.onStepToggle) {
      console.log(`[interact] Calling onStepToggle(${dragRing}, ${dragStep})`);
      callbacks.onStepToggle(dragRing, dragStep, undefined);
    } else {
      console.log(`[interact] WARNING: no onStepToggle callback registered!`);
    }
  } else {
    console.log(`[interact] Drag ended: type=${dragType}, ring=${dragRing}`);
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

  console.log(`[interact] startInteraction called — canvas=${canvas?.tagName}, size=${canvas?.width}x${canvas?.height}`);
  console.log(`[interact] Callbacks registered:`, Object.keys(callbacks).filter(k => typeof callbacks[k] === 'function'));

  if (opts.ringSteps) {
    for (let i = 0; i < opts.ringSteps.length && i < RING_COUNT; i++) {
      RING_STEPS[i] = opts.ringSteps[i];
    }
  }
  console.log(`[interact] Ring steps:`, [...RING_STEPS]);

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  document.addEventListener('keydown', onKeyDown);
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });

  console.log(`[interact] Listeners attached to canvas`);

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
  console.log(`[interact] stopInteraction called`);
  for (const fn of cleanup) fn();
  cleanup = [];
  canvas = null;
  callbacks = {};
  dragging = false;
  dragType = null;
}

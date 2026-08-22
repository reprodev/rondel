// Radial sequencer renderer — draws concentric rings, step markers,
// a playhead, and hit animations. Pure function of time + state.

import { getCanvas, getMetrics, resizeCanvas } from './canvas.js';
import { toCartesian } from './geometry.js';
import { oklchToHex } from './oklch.js';
import { add as addAnimation, update as updateAnimations, draw as drawAnimations } from './animations.js';

// --- State ---
let animFrameId = null;
let loopStartTime = 0;
let secondsPerLoop = 2;   // updated from scheduler state
let bpm = 120;
let rings = [
  { steps: 16, pulses: 8, rotation: 0, probability: 1.0 },
  { steps: 16, pulses: 8, rotation: 0, probability: 1.0 },
  { steps: 16, pulses: 8, rotation: 0, probability: 1.0 },
  { steps: 16, pulses: 8, rotation: 0, probability: 1.0 },
  { steps: 16, pulses: 8, rotation: 0, probability: 1.0 },
];
let activeVoices = new Set([0, 1, 2, 3, 4]);
let palette = [];
let pendingEvents = [];   // { ring, step, time } — drained each frame

// Golden angle for perceptually-spaced hues
const GOLDEN_ANGLE = 137.508;

/**
 * Generate a 5-color palette using OKLCH with golden angle hue spacing.
 * Each ring gets a distinct hue at consistent lightness and chroma.
 */
function generatePalette(seed) {
  const baseHue = (seed * 37) % 360;
  palette = [];
  for (let i = 0; i < 5; i++) {
    const hue = (baseHue + i * GOLDEN_ANGLE) % 360;
    palette.push(oklchToHex(0.72, 0.14, hue));
  }
}

/**
 * Queue a hit event for the animation system.
 * Called by the scheduler hook when a step triggers.
 */
export function pushEvent(ring, step, time) {
  pendingEvents.push({ ring, step, time });
}

/**
 * Start the rAF draw loop. Call after canvas is ready.
 */
export function startDrawLoop(options = {}) {
  const { canvas, ctx } = getCanvas();
  
  bpm = options.bpm || 120;
  const stepsPerLoop = options.stepsPerLoop || 16;
  secondsPerLoop = (60 / bpm) / (stepsPerLoop / 4) * stepsPerLoop;
  loopStartTime = options.loopStartTime || 0;
  
  if (options.rings) rings = options.rings;
  if (options.activeVoices) activeVoices = new Set(options.activeVoices);
  
  generatePalette(options.seed || 12345);
  
  if (animFrameId) cancelAnimationFrame(animFrameId);
  
  function frame() {
    animFrameId = requestAnimationFrame(frame);
    render(ctx);
  }
  animFrameId = requestAnimationFrame(frame);
}

/**
 * Stop the draw loop.
 */
export function stopDrawLoop() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

/**
 * Update loop timing (call when scheduler starts so playhead syncs).
 */
export function syncTiming(audioLoopStart, audioSecondsPerLoop, audioBpm) {
  loopStartTime = audioLoopStart;
  secondsPerLoop = audioSecondsPerLoop;
  bpm = audioBpm;
}

/**
 * Update active voices (for dimming inactive rings).
 */
export function setActiveVoices(indices) {
  activeVoices = new Set(indices);
}

// --- Render ---

function render(ctx) {
  const { size, cx, cy } = getMetrics();
  const now = performance.now();
  
  // Clear
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, size, size);
  
  // Compute playhead phase from AudioContext time if available
  let phase = 0;
  try {
    const audioCtx = document.querySelector('canvas')?._audioCtx;
    // Fallback: use performance.now-based phase
    if (loopStartTime > 0 && secondsPerLoop > 0) {
      // Convert performance.now to approximate audio time relationship
      phase = ((now / 1000 - loopStartTime) / secondsPerLoop) % 1;
      if (phase < 0) phase += 1;
    }
  } catch (e) {
    phase = 0;
  }
  
  const ringSpacing = (size * 0.4) / 5;
  const innerRadius = size * 0.12;
  
  // Draw rings and step markers
  for (let r = 0; r < 5; r++) {
    const radius = innerRadius + (r + 1) * ringSpacing;
    const ring = rings[r];
    const steps = ring.steps;
    const color = palette[r] || '#888';
    const isActive = activeVoices.has(r);
    const dimAlpha = isActive ? 1.0 : 0.3;
    
    // Ring circle (subtle guide)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.15 * dimAlpha;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Step markers
    for (let s = 0; s < steps; s++) {
      const angle = (s / steps) * 360;
      const { x, y } = toCartesian(cx, cy, radius, angle);
      const isActive_step = s < ring.pulses; // simplified: first N steps are active
      const markerRadius = isActive_step
        ? 3 + ring.probability * 3   // 3–6px for active
        : 2.5;                         // small for inactive
      
      ctx.beginPath();
      ctx.arc(x, y, markerRadius, 0, Math.PI * 2);
      
      if (isActive_step) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85 * dimAlpha;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.18 * dimAlpha;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }
  
  // Playhead — line from center to outer ring
  const outerRadius = innerRadius + 5 * ringSpacing + 10;
  const playheadAngle = phase * 360;
  const { x: phX, y: phY } = toCartesian(cx, cy, outerRadius, playheadAngle);
  
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(phX, phY);
  ctx.strokeStyle = '#ffffff';
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  // Playhead dot
  ctx.beginPath();
  ctx.arc(phX, phY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;
  
  // Process pending hit events → spawn animations
  while (pendingEvents.length > 0) {
    const evt = pendingEvents.shift();
    const radius = innerRadius + (evt.ring + 1) * ringSpacing;
    const angle = (evt.step / (rings[evt.ring]?.steps || 16)) * 360;
    const { x, y } = toCartesian(cx, cy, radius, angle);
    addAnimation({
      time: now,
      x, y,
      maxRadius: 30,
      ring: evt.ring,
      duration: 0.450,
    });
  }
  
  // Update and draw animations
  updateAnimations(now);
  drawAnimations(ctx, palette);
}

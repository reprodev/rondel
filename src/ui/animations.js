// Animation pool — pre-allocated slots avoid GC pressure during playback.
// Each animation is a simple struct updated per frame.

const POOL_SIZE = 96;
const EMPTY = 0;
const ACTIVE = 1;

// Pre-allocate flat arrays for cache-friendly iteration.
const state = new Uint8Array(POOL_SIZE);
const birth = new Float64Array(POOL_SIZE);
const duration = new Float32Array(POOL_SIZE);
const x = new Float32Array(POOL_SIZE);
const y = new Float32Array(POOL_SIZE);
const maxRadius = new Float32Array(POOL_SIZE);
const ringIndex = new Uint8Array(POOL_SIZE);  // which ring (0-4) for color
const progress = new Float32Array(POOL_SIZE);

let nextSlot = 0;

/**
 * easeOutCubic — fast start, gentle deceleration.
 * Feels natural for expanding hit rings.
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Add a new animation to the pool. Reuses the next slot regardless of
 * whether it's finished — old animations simply get overwritten.
 * This means the pool never allocates and never grows.
 */
export function add(opts) {
  const i = nextSlot;
  nextSlot = (nextSlot + 1) % POOL_SIZE;

  state[i] = ACTIVE;
  birth[i] = opts.time;
  duration[i] = opts.duration || 0.450;
  x[i] = opts.x;
  y[i] = opts.y;
  maxRadius[i] = opts.maxRadius || 30;
  ringIndex[i] = opts.ring || 0;
  progress[i] = 0;
}

/**
 * Update all active animations. Called once per frame before draw.
 * Sets progress and deactivates finished animations.
 */
export function update(now) {
  for (let i = 0; i < POOL_SIZE; i++) {
    if (state[i] !== ACTIVE) continue;
    const elapsed = now - birth[i];
    const p = Math.min(elapsed / (duration[i] * 1000), 1);
    progress[i] = p;
    if (p >= 1) state[i] = EMPTY;
  }
}

/**
 * Draw all active animations onto the given 2D context.
 * Uses easeOutCubic for radius expansion and linear alpha fade.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string[]} colors — palette indexed by ring
 */
export function draw(ctx, colors) {
  for (let i = 0; i < POOL_SIZE; i++) {
    if (state[i] !== ACTIVE) continue;

    const p = progress[i];
    const eased = easeOutCubic(p);
    const radius = eased * maxRadius[i];
    const alpha = 1 - p;

    ctx.beginPath();
    ctx.arc(x[i], y[i], radius, 0, Math.PI * 2);
    ctx.strokeStyle = colors[ringIndex[i]] || '#ffffff';
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

/**
 * Returns the number of currently active animations (for debugging).
 */
export function activeCount() {
  let count = 0;
  for (let i = 0; i < POOL_SIZE; i++) {
    if (state[i] === ACTIVE) count++;
  }
  return count;
}

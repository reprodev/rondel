// Canvas plumbing — DPR-aware backing store and responsive sizing.
// Handles the boring bits so radial.js can focus on drawing.

let canvas = null;
let ctx2d = null;
let size = 0;     // CSS pixels
let dpr = 1;

/**
 * Create or return the existing canvas element. Inserts into the DOM
 * at the #canvas-placeholder location, replacing the placeholder.
 */
export function getCanvas() {
  if (canvas) return { canvas, ctx: ctx2d, size, dpr };

  const placeholder = document.getElementById('canvas-placeholder');
  canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.borderRadius = '8px';

  if (placeholder) {
    placeholder.replaceWith(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  ctx2d = canvas.getContext('2d');
  resizeCanvas();
  setupResizeObserver();

  return { canvas, ctx: ctx2d, size, dpr };
}

/**
 * Recalculate canvas dimensions. Uses min(viewportWidth, viewportHeight) * 0.86
 * as the CSS size, then scales the backing store by DPR for crisp rendering.
 */
export function resizeCanvas() {
  if (!canvas) return { size: 0, dpr: 1 };

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cssPx = Math.floor(Math.min(vw, vh) * 0.86);

  // Cap DPR at 2 — higher values waste memory for no perceptible gain.
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  size = cssPx;
  canvas.style.width = cssPx + 'px';
  canvas.style.height = cssPx + 'px';
  canvas.width = Math.floor(cssPx * dpr);
  canvas.height = Math.floor(cssPx * dpr);

  // Scale the context so draw calls use CSS pixels, not backing pixels.
  ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { size, dpr };
}

/**
 * Returns the current canvas size in CSS pixels and the center point.
 */
export function getMetrics() {
  const half = size / 2;
  return { size, dpr, cx: half, cy: half };
}

// --- Internal ---

let resizeObserver = null;

function setupResizeObserver() {
  if (resizeObserver) return;

  // Debounce resize to avoid thrashing during drag-resize
  let timeout = null;
  const onResize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(resizeCanvas, 100);
  };

  // Use ResizeObserver on the canvas parent for robust detection
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);
  }

  // Also listen to window resize as fallback
  window.addEventListener('resize', onResize);
}

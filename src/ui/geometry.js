// Polar/Cartesian math and hit testing for the circular sequencer UI.

/**
 * Polar to cartesian with 0 degrees at 12 o'clock, clockwise.
 * The offset convention matches clock-face layout so step 0 sits at the top.
 */
export function toCartesian(cx, cy, radius, angleDeg) {
  const rad = angleDeg * Math.PI / 180;
  return {
    x: cx + radius * Math.sin(rad),
    y: cy - radius * Math.cos(rad)
  };
}

/**
 * Cartesian to polar relative to a center point. Returns angle in the
 * same 0-at-top clockwise convention used throughout the UI.
 */
export function toPolar(cx, cy, x, y) {
  const dx = x - cx;
  const dy = -(y - cy); // flip Y so up is positive
  const radius = Math.sqrt(dx * dx + dy * dy);
  // atan2 with flipped axes to get 0=top, clockwise
  let angle = Math.atan2(dx, dy) * 180 / Math.PI;
  if (angle < 0) angle += 360;
  return { radius, angle };
}

/**
 * Arc segment hit test. Needed for determining which ring segment the
 * user tapped. Handles the common case where the arc wraps past 360.
 */
export function hitTestArc(cx, cy, innerR, outerR, startAngle, endAngle, px, py) {
  const { radius, angle } = toPolar(cx, cy, px, py);

  // Radial bounds check
  if (radius < innerR || radius > outerR) return false;

  // Angular bounds — normalize to handle wrap-around
  const span = ((endAngle - startAngle) % 360 + 360) % 360;
  const offset = ((angle - startAngle) % 360 + 360) % 360;

  return offset <= span;
}

/**
 * Simple circle proximity test. Used for center-button and knob hit areas.
 */
export function hitTestCircle(cx, cy, radius, px, py) {
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= radius * radius;
}

/**
 * Quantize a free angle to the nearest discrete step. This gives the
 * ring its snapping behaviour when dragging onsets.
 */
export function snapToStep(angle, steps) {
  const stepSize = 360 / steps;
  return Math.round(angle / stepSize) % steps;
}

/**
 * Center angle for a step index. Inverse of snapToStep — used to place
 * visual elements at their correct radial position.
 */
export function stepAngle(step, steps) {
  return (step * 360) / steps;
}

/**
 * Compute the geometric parameters needed for an SVG arc command.
 * Returns start/end points plus the two boolean flags.
 */
export function arcPath(cx, cy, radius, startAngle, endAngle) {
  const start = toCartesian(cx, cy, radius, startAngle);
  const end = toCartesian(cx, cy, radius, endAngle);
  const span = ((endAngle - startAngle) % 360 + 360) % 360;

  return {
    startX: start.x,
    startY: start.y,
    endX: end.x,
    endY: end.y,
    largeArc: span > 180 ? 1 : 0,
    sweepFlag: 1
  };
}

// Euclidean rhythm generation — two independent algorithms for cross-validation.

/**
 * Bjorklund bucket-pairing algorithm.
 * Distributes pulses as evenly as possible across steps.
 */
export function bjorklund(steps, pulses) {
  if (steps === 0) return [];
  if (pulses <= 0) return Array(steps).fill(false);
  if (pulses >= steps) return Array(steps).fill(true);

  let left = Array.from({ length: pulses }, () => [true]);
  let right = Array.from({ length: steps - pulses }, () => [false]);

  while (right.length > 1) {
    const merged = [];
    const pairCount = Math.min(left.length, right.length);

    for (let i = 0; i < pairCount; i++) {
      merged.push(left[i].concat(right[i]));
    }

    // Leftovers from the longer group become the new "right"
    const leftover = left.length > right.length
      ? left.slice(pairCount)
      : right.slice(pairCount);

    left = merged;
    right = leftover;
  }

  return left.concat(right).flat();
}

/**
 * Bresenham line-drawing approach — a pulse lands on step i when the
 * accumulated remainder falls within the first "pulses" positions of
 * the modular cycle. This produces the same onset pattern as Bjorklund.
 */
export function bresenham(steps, pulses) {
  if (steps === 0) return [];
  if (pulses <= 0) return Array(steps).fill(false);
  if (pulses >= steps) return Array(steps).fill(true);

  const pattern = [];
  for (let i = 0; i < steps; i++) {
    pattern.push((i * pulses) % steps < pulses);
  }

  return pattern;
}

/**
 * Rotate a pattern array. Positive n shifts onset positions to the right,
 * which is equivalent to rotating the array contents to the left.
 */
export function rotate(pattern, n) {
  const len = pattern.length;
  if (len === 0) return [];
  const offset = ((n % len) + len) % len;
  return pattern.slice(offset).concat(pattern.slice(0, offset));
}

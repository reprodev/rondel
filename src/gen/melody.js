// Constrained random-walk melody generation — produces musically coherent
// sequences by limiting interval size and clamping to a register.

import { noteInScale } from './scales.js';

/**
 * Walk through a scale by small random steps, converting each degree to MIDI.
 * Constraints keep the line singable: maxInterval limits leaps, and
 * minDegree/maxDegree fence the register.
 */
export function walkMelody({ rng, scale, root, steps, minDegree, maxDegree, maxInterval }) {
  if (steps <= 0) return [];

  const melody = [];
  let degree = 0;

  for (let i = 0; i < steps; i++) {
    if (i > 0) {
      // Pick a random interval in [-maxInterval, +maxInterval]
      const range = maxInterval * 2 + 1;
      const interval = Math.floor(rng() * range) - maxInterval;
      degree = Math.max(minDegree, Math.min(maxDegree, degree + interval));
    }
    melody.push(noteInScale(scale, root, degree));
  }

  return melody;
}

/**
 * Overlay a repeat structure on a melody — each 4-note group may echo the
 * previous group with the given probability. Keeps phrases from wandering
 * too far without sounding mechanical.
 */
export function repeatStructure(rng, melody, repeatChance) {
  if (melody.length === 0) return [];

  const groupSize = 4;
  const result = [];
  let prevGroup = null;

  for (let i = 0; i < melody.length; i += groupSize) {
    const group = melody.slice(i, i + groupSize);

    if (prevGroup && rng() < repeatChance) {
      // Repeat previous group, trimmed if this group is shorter
      result.push(...prevGroup.slice(0, group.length));
    } else {
      result.push(...group);
      prevGroup = group;
    }
  }

  return result;
}

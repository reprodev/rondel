// Scale definitions and pitch arithmetic — kept separate from melody logic
// so the UI can display note names without importing the generator.

/**
 * Semitone offsets from root for each named scale. Every entry begins at 0
 * (the root) and stays within a single octave [0, 11].
 */
export const SCALES = {
  major:       [0, 2, 4, 5, 7, 9, 11],
  minor:       [0, 2, 3, 5, 7, 8, 10],
  dorian:      [0, 2, 3, 5, 7, 9, 10],
  phrygian:    [0, 1, 3, 5, 7, 8, 10],
  lydian:      [0, 2, 4, 6, 7, 9, 11],
  mixolydian:  [0, 2, 4, 5, 7, 9, 10],
  pentatonic:  [0, 2, 4, 7, 9],
  blues:       [0, 3, 5, 6, 7, 10],
  chromatic:   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

/**
 * Convert a scale degree to a MIDI note number, wrapping across octaves
 * so melodies can extend beyond a single register.
 */
export function noteInScale(scaleName, rootMidi, degree) {
  const intervals = SCALES[scaleName];
  const len = intervals.length;
  // Floor-divide so negative degrees wrap down correctly
  const octave = Math.floor(degree / len);
  const idx = ((degree % len) + len) % len;
  return rootMidi + octave * 12 + intervals[idx];
}

/**
 * How many scale degrees fit in one octave — useful for clamping UI knobs.
 */
export function degreesInOctave(scaleName) {
  return SCALES[scaleName].length;
}

/**
 * Equal-temperament frequency from MIDI note number (A4 = 69 = 440 Hz).
 * Rounded to 4 decimal places to keep serialised state compact.
 */
export function midiToFreq(midi) {
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  return Math.round(freq * 10000) / 10000;
}

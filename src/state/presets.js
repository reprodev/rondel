// Curated presets — first impressions that demonstrate the sequencer's range.
// Gain-staged for release-ready output (~-14 LUFS through the master chain).
// Pure ES module, no side effects, no DOM.

export const presets = [
  {
    name: 'Techno',
    bpm: 128,
    root: 48,
    scale: 'minor',
    seed: 77707,
    masterGain: 0.45,
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.8, delaySend: 0.0, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 2, rotation: 4, probability: 0.95, gain: 0.6, delaySend: 0.15, reverbSend: 0.2 },
      { voice: 'hat', steps: 16, pulses: 12, rotation: 0, probability: 0.85, gain: 0.45, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'bass', steps: 16, pulses: 5, rotation: 2, probability: 1.0, gain: 0.5, delaySend: 0.2, reverbSend: 0.1 },
      { voice: 'poly', steps: 16, pulses: 3, rotation: 0, probability: 0.9, gain: 0.45, delaySend: 0.3, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Ambient',
    bpm: 88,
    root: 60,
    scale: 'pentatonic',
    seed: 31415,
    masterGain: 0.45,
    rings: [
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 0.8, gain: 0.5, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'snare', steps: 16, pulses: 3, rotation: 5, probability: 0.6, gain: 0.35, delaySend: 0.4, reverbSend: 0.6 },
      { voice: 'hat', steps: 12, pulses: 5, rotation: 2, probability: 0.7, gain: 0.3, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'bass', steps: 16, pulses: 0, rotation: 0, probability: 1.0, gain: 0.0, delaySend: 0.0, reverbSend: 0.0 },
      { voice: 'poly', steps: 8, pulses: 5, rotation: 1, probability: 0.9, gain: 0.55, delaySend: 0.4, reverbSend: 0.8 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Polymetric',
    bpm: 115,
    root: 55,
    scale: 'dorian',
    seed: 27182,
    masterGain: 0.45,
    rings: [
      { voice: 'kick', steps: 7, pulses: 3, rotation: 0, probability: 1.0, gain: 0.75, delaySend: 0.1, reverbSend: 0.15 },
      { voice: 'snare', steps: 9, pulses: 4, rotation: 2, probability: 0.9, gain: 0.55, delaySend: 0.2, reverbSend: 0.25 },
      { voice: 'hat', steps: 11, pulses: 7, rotation: 3, probability: 0.85, gain: 0.4, delaySend: 0.15, reverbSend: 0.1 },
      { voice: 'bass', steps: 5, pulses: 3, rotation: 1, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'poly', steps: 13, pulses: 5, rotation: 4, probability: 0.8, gain: 0.4, delaySend: 0.35, reverbSend: 0.5 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Minimal',
    bpm: 122,
    root: 57,
    scale: 'minor',
    seed: 99999,
    masterGain: 0.45,
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 0.95, gain: 0.8, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 3, rotation: 6, probability: 0.8, gain: 0.5, delaySend: 0.25, reverbSend: 0.2 },
      { voice: 'hat', steps: 16, pulses: 4, rotation: 2, probability: 1.0, gain: 0.4, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'bass', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.15, reverbSend: 0.1 },
      { voice: 'poly', steps: 16, pulses: 0, rotation: 0, probability: 1.0, gain: 0.0, delaySend: 0.0, reverbSend: 0.0 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Afro',
    bpm: 110,
    root: 52,
    scale: 'mixolydian',
    seed: 42042,
    masterGain: 0.45,
    rings: [
      { voice: 'kick', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.75, delaySend: 0.1, reverbSend: 0.2 },
      { voice: 'snare', steps: 12, pulses: 5, rotation: 1, probability: 0.9, gain: 0.55, delaySend: 0.2, reverbSend: 0.25 },
      { voice: 'hat', steps: 12, pulses: 7, rotation: 0, probability: 0.9, gain: 0.4, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'bass', steps: 8, pulses: 5, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'poly', steps: 12, pulses: 3, rotation: 4, probability: 1.0, gain: 0.45, delaySend: 0.3, reverbSend: 0.5 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Glitch',
    bpm: 140,
    root: 64,
    scale: 'chromatic',
    seed: 66666,
    masterGain: 0.45,
    rings: [
      { voice: 'kick', steps: 16, pulses: 7, rotation: 3, probability: 0.7, gain: 0.7, delaySend: 0.2, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 9, rotation: 5, probability: 0.55, gain: 0.5, delaySend: 0.3, reverbSend: 0.15 },
      { voice: 'hat', steps: 16, pulses: 14, rotation: 1, probability: 0.6, gain: 0.35, delaySend: 0.25, reverbSend: 0.1 },
      { voice: 'bass', steps: 16, pulses: 5, rotation: 7, probability: 0.8, gain: 0.45, delaySend: 0.3, reverbSend: 0.2 },
      { voice: 'poly', steps: 7, pulses: 4, rotation: 2, probability: 0.75, gain: 0.4, delaySend: 0.5, reverbSend: 0.7 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
];

/**
 * Look up a preset by name. Case-insensitive for convenience.
 */
export function getPresetByName(name) {
  const lower = name.toLowerCase();
  return presets.find(p => p.name.toLowerCase() === lower) || null;
}

/**
 * Returns an array of preset names for UI display.
 */
export function getPresetNames() {
  return presets.map(p => p.name);
}

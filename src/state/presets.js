// Curated presets — first impressions that demonstrate the sequencer's range.
// Each is a complete patch matching the structure in patch.js.
// Pure ES module, no side effects, no DOM.

export const presets = [
  {
    name: 'Techno',
    bpm: 128,
    root: 48,
    scale: 'minor',
    seed: 77707,
    masterGain: 0.7,
    rings: [
      // 4-on-the-floor kick: E(4,16) with no rotation = beat 1,5,9,13
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.9, delaySend: 0.0, reverbSend: 0.1 },
      // Snare on 2 and 4: E(2,16) rotated to land on beats 5,13 → backbeat
      { voice: 'snare', steps: 16, pulses: 2, rotation: 4, probability: 0.95, gain: 0.75, delaySend: 0.15, reverbSend: 0.2 },
      // Driving 16th hats with some probability dropout for air
      { voice: 'hat', steps: 16, pulses: 12, rotation: 0, probability: 0.85, gain: 0.5, delaySend: 0.1, reverbSend: 0.05 },
      // Bassline: E(5,16) gives a syncopated acid feel
      { voice: 'bass', steps: 16, pulses: 5, rotation: 2, probability: 1.0, gain: 0.7, delaySend: 0.2, reverbSend: 0.1 },
      // Sparse pad stabs for atmosphere
      { voice: 'poly', steps: 16, pulses: 3, rotation: 0, probability: 0.9, gain: 0.6, delaySend: 0.3, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Ambient',
    bpm: 88,
    root: 60,
    scale: 'pentatonic',
    seed: 31415,
    masterGain: 0.65,
    rings: [
      // Very sparse kick: E(2,16) — just anchoring the downbeat
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 0.8, gain: 0.5, delaySend: 0.3, reverbSend: 0.5 },
      // Almost-silent snare as ghost notes
      { voice: 'snare', steps: 16, pulses: 3, rotation: 5, probability: 0.6, gain: 0.3, delaySend: 0.4, reverbSend: 0.6 },
      // Gentle hat taps on a 12-step cycle for subtle polymetric drift
      { voice: 'hat', steps: 12, pulses: 5, rotation: 2, probability: 0.7, gain: 0.35, delaySend: 0.2, reverbSend: 0.4 },
      // No bass — let the space breathe
      { voice: 'bass', steps: 16, pulses: 0, rotation: 0, probability: 1.0, gain: 0.0, delaySend: 0.0, reverbSend: 0.0 },
      // Lush pad — the star: E(5,8) on an 8-step ring, heavy reverb
      { voice: 'poly', steps: 8, pulses: 5, rotation: 1, probability: 0.9, gain: 0.8, delaySend: 0.4, reverbSend: 0.8 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Polymetric',
    bpm: 115,
    root: 55,
    scale: 'dorian',
    seed: 27182,
    masterGain: 0.7,
    rings: [
      // Kick on 7-step cycle: never lines up the same way twice for 112 steps
      { voice: 'kick', steps: 7, pulses: 3, rotation: 0, probability: 1.0, gain: 0.85, delaySend: 0.1, reverbSend: 0.15 },
      // Snare on 9-step: cross-rhythm with the kick
      { voice: 'snare', steps: 9, pulses: 4, rotation: 2, probability: 0.9, gain: 0.7, delaySend: 0.2, reverbSend: 0.25 },
      // Hat on 11-step: maximum prime-number drift
      { voice: 'hat', steps: 11, pulses: 7, rotation: 3, probability: 0.85, gain: 0.5, delaySend: 0.15, reverbSend: 0.1 },
      // Bass on 5-step: tight and percussive
      { voice: 'bass', steps: 5, pulses: 3, rotation: 1, probability: 1.0, gain: 0.75, delaySend: 0.1, reverbSend: 0.1 },
      // Poly on 13-step: long evolving cycle
      { voice: 'poly', steps: 13, pulses: 5, rotation: 4, probability: 0.8, gain: 0.55, delaySend: 0.35, reverbSend: 0.5 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Minimal',
    bpm: 122,
    root: 57,
    scale: 'minor',
    seed: 99999,
    masterGain: 0.7,
    rings: [
      // Classic minimal: kick every 4 with slight probability gap
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 0.95, gain: 0.85, delaySend: 0.05, reverbSend: 0.1 },
      // Rimshot-style snare: E(3,16) rotated for offbeat placement
      { voice: 'snare', steps: 16, pulses: 3, rotation: 6, probability: 0.8, gain: 0.6, delaySend: 0.25, reverbSend: 0.2 },
      // Closed hat offbeats: E(4,16) rotated by 2 (between kicks)
      { voice: 'hat', steps: 16, pulses: 4, rotation: 2, probability: 1.0, gain: 0.45, delaySend: 0.1, reverbSend: 0.05 },
      // Hypnotic bass: single note pulse E(3,8) — repeating motif
      { voice: 'bass', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.15, reverbSend: 0.1 },
      // No pad — raw and stripped
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
    masterGain: 0.7,
    rings: [
      // Djembe-style kick: E(3,8) = tresillo, the foundation of Afro-Cuban rhythm
      { voice: 'kick', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.85, delaySend: 0.1, reverbSend: 0.2 },
      // Cross-stick snare: E(5,12) — 12/8 feel
      { voice: 'snare', steps: 12, pulses: 5, rotation: 1, probability: 0.9, gain: 0.65, delaySend: 0.2, reverbSend: 0.25 },
      // Shaker-style hat: dense E(7,12) on 12-step
      { voice: 'hat', steps: 12, pulses: 7, rotation: 0, probability: 0.9, gain: 0.4, delaySend: 0.05, reverbSend: 0.1 },
      // Bassline: E(5,8) = cinquillo — classic Afro-Cuban bass
      { voice: 'bass', steps: 8, pulses: 5, rotation: 0, probability: 1.0, gain: 0.75, delaySend: 0.1, reverbSend: 0.1 },
      // Call-and-response pad: sparse, high probability
      { voice: 'poly', steps: 12, pulses: 3, rotation: 4, probability: 1.0, gain: 0.6, delaySend: 0.3, reverbSend: 0.5 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  {
    name: 'Glitch',
    bpm: 140,
    root: 64,
    scale: 'chromatic',
    seed: 66666,
    masterGain: 0.65,
    rings: [
      // Stuttery kick: E(7,16) with probability creating gaps
      { voice: 'kick', steps: 16, pulses: 7, rotation: 3, probability: 0.7, gain: 0.8, delaySend: 0.2, reverbSend: 0.1 },
      // Glitchy snare bursts: dense E(9,16) with heavy dropout
      { voice: 'snare', steps: 16, pulses: 9, rotation: 5, probability: 0.55, gain: 0.6, delaySend: 0.3, reverbSend: 0.15 },
      // Rapid hat: near-full with random dropout for broken feel
      { voice: 'hat', steps: 16, pulses: 14, rotation: 1, probability: 0.6, gain: 0.4, delaySend: 0.25, reverbSend: 0.1 },
      // Chromatic bass stabs: E(5,16) shifted, unpredictable
      { voice: 'bass', steps: 16, pulses: 5, rotation: 7, probability: 0.8, gain: 0.65, delaySend: 0.3, reverbSend: 0.2 },
      // Fractured pad: E(4,7) on odd meter, heavy effects
      { voice: 'poly', steps: 7, pulses: 4, rotation: 2, probability: 0.75, gain: 0.5, delaySend: 0.5, reverbSend: 0.7 },
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

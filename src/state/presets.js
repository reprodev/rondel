// 40 curated presets organized by category.
// All gain-staged for release-ready output (~-14 LUFS through the master chain).
// Pure ES module, no side effects, no DOM.

export const CATEGORIES = ['Dancefloor', 'World & Groove', 'Ambient & Study', 'Epic & Cinematic', 'Vocal & Chorus'];

export const presets = [
  // ═══ DANCEFLOOR (6) ═══
  {
    name: 'Techno Kick Drive', bpm: 128, root: 48, scale: 'minor', seed: 77707, masterGain: 0.45,
    category: 'Dancefloor', mood: ['driving', 'hypnotic', 'dark'],
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
    name: 'House Deep', bpm: 128, root: 50, scale: 'minor', seed: 80808, masterGain: 0.45,
    category: 'Dancefloor', mood: ['groovy', 'warm', 'rolling'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.8, delaySend: 0.0, reverbSend: 0.1 },
      { voice: 'clap', steps: 16, pulses: 2, rotation: 4, probability: 1.0, gain: 0.6, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'hat', steps: 16, pulses: 14, rotation: 0, probability: 0.9, gain: 0.4, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'poly', steps: 16, pulses: 3, rotation: 2, probability: 0.85, gain: 0.35, delaySend: 0.3, reverbSend: 0.5 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Jungle Breakbeat', bpm: 160, root: 48, scale: 'minor', seed: 17017, masterGain: 0.45,
    category: 'Dancefloor', mood: ['intense', 'complex', 'fast'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 5, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 6, rotation: 3, probability: 0.9, gain: 0.6, delaySend: 0.15, reverbSend: 0.15 },
      { voice: 'hat', steps: 16, pulses: 14, rotation: 0, probability: 0.85, gain: 0.4, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 1, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'tom', steps: 16, pulses: 5, rotation: 7, probability: 0.8, gain: 0.4, delaySend: 0.2, reverbSend: 0.2 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Acid Rave', bpm: 130, root: 45, scale: 'phrygian', seed: 30330, masterGain: 0.45,
    category: 'Dancefloor', mood: ['squelchy', 'hypnotic', 'acid'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.75, delaySend: 0.0, reverbSend: 0.1 },
      { voice: 'pluck', steps: 16, pulses: 8, rotation: 2, probability: 0.9, gain: 0.5, delaySend: 0.4, reverbSend: 0.3 },
      { voice: 'hat', steps: 16, pulses: 12, rotation: 0, probability: 0.8, gain: 0.35, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'bass', steps: 16, pulses: 5, rotation: 3, probability: 1.0, gain: 0.5, delaySend: 0.2, reverbSend: 0.1 },
      { voice: 'clap', steps: 16, pulses: 2, rotation: 4, probability: 0.95, gain: 0.55, delaySend: 0.2, reverbSend: 0.2 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Glitch IDM', bpm: 140, root: 64, scale: 'chromatic', seed: 66666, masterGain: 0.45,
    category: 'Dancefloor', mood: ['chaotic', 'glitchy', 'experimental'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 7, rotation: 3, probability: 0.7, gain: 0.7, delaySend: 0.2, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 9, rotation: 5, probability: 0.55, gain: 0.5, delaySend: 0.3, reverbSend: 0.15 },
      { voice: 'hat', steps: 16, pulses: 14, rotation: 1, probability: 0.6, gain: 0.35, delaySend: 0.25, reverbSend: 0.1 },
      { voice: 'bass', steps: 16, pulses: 5, rotation: 7, probability: 0.8, gain: 0.45, delaySend: 0.3, reverbSend: 0.2 },
      { voice: 'poly', steps: 7, pulses: 4, rotation: 2, probability: 0.75, gain: 0.4, delaySend: 0.5, reverbSend: 0.7 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Industrial Rigid', bpm: 110, root: 45, scale: 'chromatic', seed: 11111, masterGain: 0.45,
    category: 'Dancefloor', mood: ['mechanical', 'aggressive', 'rigid'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 8, rotation: 0, probability: 0.95, gain: 0.8, delaySend: 0.05, reverbSend: 0.05 },
      { voice: 'snare', steps: 16, pulses: 6, rotation: 2, probability: 0.9, gain: 0.6, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'hat', steps: 16, pulses: 16, rotation: 0, probability: 0.9, gain: 0.35, delaySend: 0.05, reverbSend: 0.05 },
      { voice: 'clap', steps: 16, pulses: 4, rotation: 4, probability: 0.9, gain: 0.5, delaySend: 0.15, reverbSend: 0.1 },
      { voice: 'bass', steps: 16, pulses: 3, rotation: 0, probability: 1.0, gain: 0.45, delaySend: 0.1, reverbSend: 0.05 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Tech House Peak', bpm: 128, root: 50, scale: 'minor', seed: 12812, masterGain: 0.45,
    category: 'Dancefloor', mood: ['peak-time', 'driving', 'groovy'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.8, delaySend: 0.0, reverbSend: 0.1 },
      { voice: 'hat', steps: 16, pulses: 14, rotation: 0, probability: 0.9, gain: 0.4, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'bass', steps: 16, pulses: 5, rotation: 1, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'pluck', steps: 16, pulses: 6, rotation: 3, probability: 0.85, gain: 0.45, delaySend: 0.4, reverbSend: 0.5 },
      { voice: 'clap', steps: 16, pulses: 2, rotation: 4, probability: 1.0, gain: 0.55, delaySend: 0.2, reverbSend: 0.25 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Drum & Bass Liquid', bpm: 170, root: 52, scale: 'minor', seed: 17017, masterGain: 0.45,
    category: 'Dancefloor', mood: ['liquid', 'fast', 'atmospheric'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.15 },
      { voice: 'snare', steps: 16, pulses: 4, rotation: 4, probability: 0.95, gain: 0.6, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'hat', steps: 16, pulses: 12, rotation: 1, probability: 0.8, gain: 0.35, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'pad', steps: 8, pulses: 3, rotation: 0, probability: 0.9, gain: 0.4, delaySend: 0.5, reverbSend: 0.7 },
      { voice: 'bell', steps: 16, pulses: 3, rotation: 5, probability: 0.75, gain: 0.35, delaySend: 0.4, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  // ═══ WORLD & GROOVE (8) ═══
  {
    name: 'Afro Polyrhythm', bpm: 110, root: 52, scale: 'mixolydian', seed: 42042, masterGain: 0.45,
    category: 'World & Groove', mood: ['rhythmic', 'warm', 'polymetric'],
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
    name: 'Krautrock Hypnotic', bpm: 120, root: 52, scale: 'mixolydian', seed: 19719, masterGain: 0.45,
    category: 'World & Groove', mood: ['hypnotic', 'repetitive', 'motorik'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 8, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.55, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'hat', steps: 16, pulses: 8, rotation: 2, probability: 0.95, gain: 0.35, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'poly', steps: 16, pulses: 2, rotation: 0, probability: 1.0, gain: 0.4, delaySend: 0.3, reverbSend: 0.4 },
      { voice: 'snare', steps: 16, pulses: 2, rotation: 8, probability: 0.7, gain: 0.35, delaySend: 0.2, reverbSend: 0.15 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Samba Carnival', bpm: 120, root: 55, scale: 'major', seed: 55555, masterGain: 0.45,
    category: 'World & Groove', mood: ['festive', 'polymetric', 'rhythmic'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.15 },
      { voice: 'cowbell', steps: 12, pulses: 6, rotation: 2, probability: 0.95, gain: 0.5, delaySend: 0.1, reverbSend: 0.15 },
      { voice: 'conga', steps: 16, pulses: 5, rotation: 1, probability: 0.9, gain: 0.45, delaySend: 0.15, reverbSend: 0.2 },
      { voice: 'rim', steps: 16, pulses: 12, rotation: 0, probability: 0.85, gain: 0.35, delaySend: 0.05, reverbSend: 0.05 },
      { voice: 'bass', steps: 8, pulses: 5, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Funk Pocket', bpm: 110, root: 50, scale: 'dorian', seed: 71071, masterGain: 0.45,
    category: 'World & Groove', mood: ['funky', 'tight', 'syncopated'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 5, rotation: 0, probability: 1.0, gain: 0.75, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 4, rotation: 4, probability: 0.95, gain: 0.6, delaySend: 0.15, reverbSend: 0.2 },
      { voice: 'hat', steps: 16, pulses: 10, rotation: 1, probability: 0.9, gain: 0.4, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'cowbell', steps: 16, pulses: 3, rotation: 6, probability: 0.85, gain: 0.45, delaySend: 0.2, reverbSend: 0.15 },
      { voice: 'bass', steps: 16, pulses: 6, rotation: 2, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Bossa Nova Chill', bpm: 90, root: 57, scale: 'major', seed: 62626, masterGain: 0.45,
    category: 'World & Groove', mood: ['mellow', 'jazzy', 'breezy'],
    rings: [
      { voice: 'conga', steps: 16, pulses: 5, rotation: 3, probability: 0.9, gain: 0.45, delaySend: 0.15, reverbSend: 0.25 },
      { voice: 'rim', steps: 16, pulses: 3, rotation: 2, probability: 0.85, gain: 0.4, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'vibraphone', steps: 8, pulses: 4, rotation: 1, probability: 0.9, gain: 0.45, delaySend: 0.35, reverbSend: 0.5 },
      { voice: 'hat', steps: 16, pulses: 8, rotation: 0, probability: 0.8, gain: 0.3, delaySend: 0.1, reverbSend: 0.15 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.15, reverbSend: 0.1 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Dub Reggae', bpm: 90, root: 50, scale: 'minor', seed: 70707, masterGain: 0.45,
    category: 'World & Groove', mood: ['spacious', 'heavy', 'dubbed'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 1.0, gain: 0.6, delaySend: 0.5, reverbSend: 0.4 },
      { voice: 'bass', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.55, delaySend: 0.6, reverbSend: 0.3 },
      { voice: 'poly', steps: 16, pulses: 2, rotation: 6, probability: 0.8, gain: 0.45, delaySend: 0.7, reverbSend: 0.7 },
      { voice: 'hat', steps: 16, pulses: 4, rotation: 2, probability: 0.7, gain: 0.25, delaySend: 0.4, reverbSend: 0.3 },
      { voice: 'pad', steps: 16, pulses: 3, rotation: 8, probability: 0.75, gain: 0.4, delaySend: 0.7, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Downtempo Swing', bpm: 90, root: 55, scale: 'dorian', seed: 54321, masterGain: 0.45,
    category: 'World & Groove', mood: ['swung', 'jazzy', 'warm'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 3, rotation: 2, probability: 0.9, gain: 0.6, delaySend: 0.15, reverbSend: 0.3 },
      { voice: 'snare', steps: 16, pulses: 3, rotation: 5, probability: 0.85, gain: 0.5, delaySend: 0.3, reverbSend: 0.4 },
      { voice: 'hat', steps: 12, pulses: 7, rotation: 1, probability: 0.8, gain: 0.35, delaySend: 0.2, reverbSend: 0.2 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 3, probability: 1.0, gain: 0.5, delaySend: 0.2, reverbSend: 0.15 },
      { voice: 'vibraphone', steps: 8, pulses: 4, rotation: 1, probability: 0.9, gain: 0.45, delaySend: 0.4, reverbSend: 0.5 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Dancehall Riddim', bpm: 95, root: 48, scale: 'minor', seed: 43434, masterGain: 0.45,
    category: 'World & Groove', mood: ['bouncy', 'rhythmic', 'bass-heavy'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 3, rotation: 0, probability: 1.0, gain: 0.75, delaySend: 0.1, reverbSend: 0.15 },
      { voice: 'snare', steps: 16, pulses: 4, rotation: 4, probability: 0.95, gain: 0.55, delaySend: 0.2, reverbSend: 0.2 },
      { voice: 'rim', steps: 16, pulses: 3, rotation: 6, probability: 0.9, gain: 0.45, delaySend: 0.15, reverbSend: 0.15 },
      { voice: 'bass', steps: 8, pulses: 5, rotation: 0, probability: 1.0, gain: 0.55, delaySend: 0.15, reverbSend: 0.1 },
      { voice: 'conga', steps: 16, pulses: 4, rotation: 2, probability: 0.8, gain: 0.4, delaySend: 0.2, reverbSend: 0.2 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Reggaeton Urbano', bpm: 92, root: 48, scale: 'minor', seed: 92092, masterGain: 0.45,
    category: 'World & Groove', mood: ['urban', 'bouncy', 'latin'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.75, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 6, rotation: 3, probability: 0.9, gain: 0.55, delaySend: 0.15, reverbSend: 0.2 },
      { voice: 'conga', steps: 16, pulses: 5, rotation: 2, probability: 0.85, gain: 0.4, delaySend: 0.2, reverbSend: 0.25 },
      { voice: 'bass', steps: 8, pulses: 4, rotation: 0, probability: 1.0, gain: 0.55, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'cowbell', steps: 16, pulses: 4, rotation: 6, probability: 0.8, gain: 0.35, delaySend: 0.15, reverbSend: 0.15 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Balkan Brass', bpm: 110, root: 50, scale: 'phrygian', seed: 11011, masterGain: 0.45,
    category: 'World & Groove', mood: ['frenetic', 'celebratory', 'bright'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 6, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 4, rotation: 2, probability: 0.95, gain: 0.6, delaySend: 0.15, reverbSend: 0.2 },
      { voice: 'rim', steps: 16, pulses: 8, rotation: 1, probability: 0.85, gain: 0.4, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'sitar', steps: 8, pulses: 5, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.3, reverbSend: 0.4 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  // ═══ AMBIENT & STUDY (10) ═══
  {
    name: 'Ambient Floating', bpm: 88, root: 60, scale: 'pentatonic', seed: 31415, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['ethereal', 'spacious', 'calm'],
    rings: [
      { voice: 'bell', steps: 16, pulses: 2, rotation: 0, probability: 0.8, gain: 0.5, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'pad', steps: 16, pulses: 3, rotation: 5, probability: 0.6, gain: 0.35, delaySend: 0.4, reverbSend: 0.6 },
      { voice: 'hat', steps: 12, pulses: 5, rotation: 2, probability: 0.7, gain: 0.3, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'bass', steps: 16, pulses: 1, rotation: 0, probability: 1.0, gain: 0.4, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'pad', steps: 8, pulses: 5, rotation: 1, probability: 0.9, gain: 0.55, delaySend: 0.4, reverbSend: 0.8 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Lo-Fi Chill', bpm: 85, root: 58, scale: 'pentatonic', seed: 22222, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['nostalgic', 'warm', 'lo-fi'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 3, rotation: 1, probability: 0.9, gain: 0.55, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'snare', steps: 16, pulses: 2, rotation: 5, probability: 0.8, gain: 0.4, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'hat', steps: 16, pulses: 8, rotation: 0, probability: 0.75, gain: 0.3, delaySend: 0.15, reverbSend: 0.3 },
      { voice: 'bass', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.55, delaySend: 0.2, reverbSend: 0.2 },
      { voice: 'kalimba', steps: 16, pulses: 3, rotation: 2, probability: 0.85, gain: 0.45, delaySend: 0.4, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Meditation Breath', bpm: 60, root: 62, scale: 'pentatonic', seed: 10101, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['meditative', 'serene', 'minimal'],
    rings: [
      { voice: 'bell', steps: 16, pulses: 2, rotation: 0, probability: 0.7, gain: 0.4, delaySend: 0.5, reverbSend: 0.8 },
      { voice: 'pad', steps: 8, pulses: 3, rotation: 1, probability: 0.8, gain: 0.5, delaySend: 0.4, reverbSend: 0.9 },
      { voice: 'bass', steps: 16, pulses: 1, rotation: 0, probability: 1.0, gain: 0.4, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'hat', steps: 16, pulses: 3, rotation: 4, probability: 0.5, gain: 0.2, delaySend: 0.3, reverbSend: 0.6 },
      { voice: 'bell', steps: 16, pulses: 1, rotation: 0, probability: 0.6, gain: 0.35, delaySend: 0.3, reverbSend: 0.5 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Warm Pad Ambient', bpm: 75, root: 60, scale: 'lydian', seed: 20202, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['warm', 'gentle', 'floating'],
    rings: [
      { voice: 'pad', steps: 8, pulses: 4, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.4, reverbSend: 0.8 },
      { voice: 'pluck', steps: 16, pulses: 3, rotation: 3, probability: 0.75, gain: 0.4, delaySend: 0.5, reverbSend: 0.6 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 0, probability: 1.0, gain: 0.45, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'hat', steps: 16, pulses: 4, rotation: 1, probability: 0.6, gain: 0.2, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'pad', steps: 16, pulses: 1, rotation: 0, probability: 0.7, gain: 0.4, delaySend: 0.2, reverbSend: 0.3 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Melancholic Lofi', bpm: 90, root: 55, scale: 'minor', seed: 33333, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['melancholic', 'introspective', 'lo-fi'],
    rings: [
      { voice: 'snare', steps: 16, pulses: 2, rotation: 4, probability: 0.85, gain: 0.4, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'hat', steps: 16, pulses: 6, rotation: 0, probability: 0.7, gain: 0.25, delaySend: 0.15, reverbSend: 0.3 },
      { voice: 'pluck', steps: 16, pulses: 4, rotation: 2, probability: 0.8, gain: 0.45, delaySend: 0.4, reverbSend: 0.5 },
      { voice: 'bass', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.2, reverbSend: 0.2 },
      { voice: 'stringPad', steps: 16, pulses: 2, rotation: 6, probability: 0.75, gain: 0.4, delaySend: 0.5, reverbSend: 0.7 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Glitch Ambient', bpm: 70, root: 62, scale: 'chromatic', seed: 44444, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['glitchy', 'sparse', 'textural'],
    rings: [
      { voice: 'clap', steps: 16, pulses: 2, rotation: 7, probability: 0.5, gain: 0.35, delaySend: 0.6, reverbSend: 0.7 },
      { voice: 'pluck', steps: 13, pulses: 3, rotation: 4, probability: 0.6, gain: 0.4, delaySend: 0.5, reverbSend: 0.6 },
      { voice: 'poly', steps: 16, pulses: 2, rotation: 0, probability: 0.7, gain: 0.45, delaySend: 0.4, reverbSend: 0.8 },
      { voice: 'hat', steps: 11, pulses: 4, rotation: 3, probability: 0.5, gain: 0.2, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'kick', steps: 16, pulses: 1, rotation: 0, probability: 0.4, gain: 0.3, delaySend: 0.4, reverbSend: 0.4 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Jazz Ambient', bpm: 85, root: 58, scale: 'dorian', seed: 88888, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['jazzy', 'smooth', 'late-night'],
    rings: [
      { voice: 'vibraphone', steps: 8, pulses: 5, rotation: 1, probability: 0.9, gain: 0.5, delaySend: 0.3, reverbSend: 0.6 },
      { voice: 'bass', steps: 16, pulses: 5, rotation: 2, probability: 1.0, gain: 0.5, delaySend: 0.2, reverbSend: 0.2 },
      { voice: 'pluck', steps: 16, pulses: 4, rotation: 5, probability: 0.8, gain: 0.4, delaySend: 0.4, reverbSend: 0.5 },
      { voice: 'hat', steps: 12, pulses: 7, rotation: 0, probability: 0.75, gain: 0.3, delaySend: 0.1, reverbSend: 0.2 },
      { voice: 'vibraphone', steps: 16, pulses: 2, rotation: 0, probability: 0.8, gain: 0.45, delaySend: 0.1, reverbSend: 0.2 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Hypnotic Minimal', bpm: 65, root: 55, scale: 'minor', seed: 12321, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['hypnotic', 'ultra-sparse', 'deep'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 1.0, gain: 0.6, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'bass', steps: 16, pulses: 2, rotation: 4, probability: 1.0, gain: 0.5, delaySend: 0.3, reverbSend: 0.2 },
      { voice: 'pad', steps: 16, pulses: 1, rotation: 0, probability: 0.8, gain: 0.45, delaySend: 0.5, reverbSend: 0.7 },
      { voice: 'hat', steps: 16, pulses: 3, rotation: 2, probability: 0.6, gain: 0.2, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'pluck', steps: 16, pulses: 1, rotation: 8, probability: 0.5, gain: 0.35, delaySend: 0.6, reverbSend: 0.7 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Cinematic Swell', bpm: 100, root: 50, scale: 'minor', seed: 90909, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['cinematic', 'building', 'emotional'],
    rings: [
      { voice: 'bell', steps: 16, pulses: 4, rotation: 0, probability: 0.9, gain: 0.45, delaySend: 0.4, reverbSend: 0.6 },
      { voice: 'stringPad', steps: 8, pulses: 5, rotation: 2, probability: 0.85, gain: 0.5, delaySend: 0.3, reverbSend: 0.7 },
      { voice: 'bass', steps: 16, pulses: 3, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'tom', steps: 16, pulses: 3, rotation: 5, probability: 0.7, gain: 0.4, delaySend: 0.3, reverbSend: 0.4 },
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 0.9, gain: 0.55, delaySend: 0.1, reverbSend: 0.3 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Tropical Ambient', bpm: 80, root: 60, scale: 'major', seed: 77077, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['tropical', 'breezy', 'bright'],
    rings: [
      { voice: 'conga', steps: 12, pulses: 5, rotation: 2, probability: 0.85, gain: 0.4, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'bell', steps: 16, pulses: 4, rotation: 3, probability: 0.8, gain: 0.45, delaySend: 0.4, reverbSend: 0.5 },
      { voice: 'pad', steps: 8, pulses: 3, rotation: 0, probability: 0.9, gain: 0.45, delaySend: 0.3, reverbSend: 0.7 },
      { voice: 'bass', steps: 16, pulses: 3, rotation: 0, probability: 1.0, gain: 0.45, delaySend: 0.15, reverbSend: 0.2 },
      { voice: 'kalimba', steps: 16, pulses: 6, rotation: 0, probability: 0.7, gain: 0.25, delaySend: 0.1, reverbSend: 0.3 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Musique Concrete', bpm: 75, root: 60, scale: 'chromatic', seed: 75075, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['experimental', 'sparse', 'textural'],
    rings: [
      { voice: 'gong', steps: 16, pulses: 2, rotation: 5, probability: 0.7, gain: 0.4, delaySend: 0.6, reverbSend: 0.9 },
      { voice: 'choir', steps: 16, pulses: 1, rotation: 0, probability: 0.8, gain: 0.45, delaySend: 0.5, reverbSend: 0.8 },
      { voice: 'hat', steps: 16, pulses: 3, rotation: 7, probability: 0.4, gain: 0.2, delaySend: 0.3, reverbSend: 0.6 },
      { voice: 'bass', steps: 16, pulses: 1, rotation: 0, probability: 1.0, gain: 0.35, delaySend: 0.4, reverbSend: 0.5 },
      { voice: 'bell', steps: 13, pulses: 2, rotation: 3, probability: 0.5, gain: 0.3, delaySend: 0.7, reverbSend: 0.8 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Morning Light', bpm: 80, root: 62, scale: 'pentatonic', seed: 80080, masterGain: 0.45,
    category: 'Ambient & Study', mood: ['peaceful', 'bright', 'gentle'],
    rings: [
      { voice: 'kalimba', steps: 16, pulses: 5, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.4, reverbSend: 0.6 },
      { voice: 'pad', steps: 8, pulses: 3, rotation: 0, probability: 0.85, gain: 0.45, delaySend: 0.3, reverbSend: 0.7 },
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 0.8, gain: 0.4, delaySend: 0.1, reverbSend: 0.2 },
      { voice: 'hat', steps: 16, pulses: 4, rotation: 2, probability: 0.6, gain: 0.2, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 5, probability: 0.7, gain: 0.35, delaySend: 0.5, reverbSend: 0.7 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  // ═══ EPIC & CINEMATIC (6) ═══
  {
    name: 'Synthwave Retro', bpm: 115, root: 53, scale: 'major', seed: 19851, masterGain: 0.45,
    category: 'Epic & Cinematic', mood: ['nostalgic', 'driving', '80s'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.15 },
      { voice: 'snare', steps: 16, pulses: 2, rotation: 4, probability: 1.0, gain: 0.55, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'stringPad', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 2, probability: 1.0, gain: 0.5, delaySend: 0.15, reverbSend: 0.1 },
      { voice: 'hat', steps: 16, pulses: 12, rotation: 0, probability: 0.9, gain: 0.35, delaySend: 0.1, reverbSend: 0.1 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Polymetric Drift', bpm: 115, root: 55, scale: 'dorian', seed: 27182, masterGain: 0.45,
    category: 'Epic & Cinematic', mood: ['evolving', 'complex', 'hypnotic'],
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
    name: 'Minimal Kick Bass', bpm: 122, root: 57, scale: 'minor', seed: 99999, masterGain: 0.45,
    category: 'Epic & Cinematic', mood: ['stripped', 'hypnotic', 'focused'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 0.95, gain: 0.8, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 3, rotation: 6, probability: 0.8, gain: 0.5, delaySend: 0.25, reverbSend: 0.2 },
      { voice: 'hat', steps: 16, pulses: 4, rotation: 2, probability: 1.0, gain: 0.4, delaySend: 0.1, reverbSend: 0.05 },
      { voice: 'bass', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.15, reverbSend: 0.1 },
      { voice: 'poly', steps: 16, pulses: 1, rotation: 0, probability: 1.0, gain: 0.3, delaySend: 0.3, reverbSend: 0.4 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Hyperpop Chaos', bpm: 145, root: 62, scale: 'chromatic', seed: 99199, masterGain: 0.45,
    category: 'Epic & Cinematic', mood: ['chaotic', 'energetic', 'maximalist'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 6, rotation: 1, probability: 0.8, gain: 0.7, delaySend: 0.2, reverbSend: 0.1 },
      { voice: 'clap', steps: 16, pulses: 5, rotation: 3, probability: 0.75, gain: 0.5, delaySend: 0.3, reverbSend: 0.2 },
      { voice: 'hat', steps: 16, pulses: 14, rotation: 0, probability: 0.7, gain: 0.4, delaySend: 0.2, reverbSend: 0.1 },
      { voice: 'pluck', steps: 16, pulses: 5, rotation: 5, probability: 0.8, gain: 0.45, delaySend: 0.5, reverbSend: 0.4 },
      { voice: 'tom', steps: 9, pulses: 4, rotation: 2, probability: 0.75, gain: 0.4, delaySend: 0.3, reverbSend: 0.3 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Space Journey', bpm: 90, root: 55, scale: 'lydian', seed: 50505, masterGain: 0.45,
    category: 'Epic & Cinematic', mood: ['cosmic', 'expansive', 'dreamy'],
    rings: [
      { voice: 'pluck', steps: 16, pulses: 4, rotation: 3, probability: 0.8, gain: 0.45, delaySend: 0.6, reverbSend: 0.7 },
      { voice: 'pad', steps: 8, pulses: 4, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.4, reverbSend: 0.8 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 0, probability: 1.0, gain: 0.45, delaySend: 0.3, reverbSend: 0.4 },
      { voice: 'hat', steps: 16, pulses: 5, rotation: 2, probability: 0.6, gain: 0.25, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'gong', steps: 13, pulses: 3, rotation: 5, probability: 0.65, gain: 0.35, delaySend: 0.5, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Cosmic Meditation', bpm: 70, root: 60, scale: 'pentatonic', seed: 60606, masterGain: 0.45,
    category: 'Epic & Cinematic', mood: ['transcendent', 'vast', 'serene'],
    rings: [
      { voice: 'sitar', steps: 8, pulses: 3, rotation: 0, probability: 0.85, gain: 0.5, delaySend: 0.5, reverbSend: 0.9 },
      { voice: 'pad', steps: 16, pulses: 2, rotation: 5, probability: 0.7, gain: 0.4, delaySend: 0.6, reverbSend: 0.8 },
      { voice: 'gong', steps: 16, pulses: 2, rotation: 8, probability: 0.6, gain: 0.35, delaySend: 0.4, reverbSend: 0.6 },
      { voice: 'choir', steps: 16, pulses: 1, rotation: 0, probability: 1.0, gain: 0.4, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 3, probability: 0.5, gain: 0.2, delaySend: 0.3, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Orchestral Swell', bpm: 95, root: 48, scale: 'minor', seed: 95095, masterGain: 0.45,
    category: 'Epic & Cinematic', mood: ['dramatic', 'building', 'orchestral'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 1.0, gain: 0.6, delaySend: 0.1, reverbSend: 0.3 },
      { voice: 'tom', steps: 16, pulses: 3, rotation: 4, probability: 0.85, gain: 0.5, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'stringPad', steps: 8, pulses: 5, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.4, reverbSend: 0.8 },
      { voice: 'choir', steps: 16, pulses: 2, rotation: 6, probability: 0.8, gain: 0.45, delaySend: 0.5, reverbSend: 0.7 },
      { voice: 'bell', steps: 16, pulses: 3, rotation: 0, probability: 0.7, gain: 0.35, delaySend: 0.4, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Deep Space Void', bpm: 60, root: 55, scale: 'lydian', seed: 60060, masterGain: 0.45,
    category: 'Epic & Cinematic', mood: ['meditative', 'vast', 'dark'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 1, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'sitar', steps: 8, pulses: 2, rotation: 0, probability: 0.8, gain: 0.45, delaySend: 0.6, reverbSend: 0.9 },
      { voice: 'pad', steps: 16, pulses: 2, rotation: 5, probability: 0.7, gain: 0.4, delaySend: 0.5, reverbSend: 0.8 },
      { voice: 'gong', steps: 16, pulses: 1, rotation: 8, probability: 0.6, gain: 0.35, delaySend: 0.7, reverbSend: 0.9 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 3, probability: 0.5, gain: 0.3, delaySend: 0.5, reverbSend: 0.7 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },

  // ═══ VOCAL & CHORUS (6) ═══
  {
    name: 'Gospel Choir Drive', bpm: 100, root: 55, scale: 'major', seed: 10010, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['uplifting', 'warm', 'soulful'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.15 },
      { voice: 'snare', steps: 16, pulses: 2, rotation: 4, probability: 1.0, gain: 0.55, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'choir', steps: 8, pulses: 5, rotation: 0, probability: 0.9, gain: 0.55, delaySend: 0.3, reverbSend: 0.6 },
      { voice: 'vibraphone', steps: 16, pulses: 4, rotation: 2, probability: 0.8, gain: 0.4, delaySend: 0.4, reverbSend: 0.5 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Vocal Lofi Hip Hop', bpm: 85, root: 58, scale: 'pentatonic', seed: 85085, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['nostalgic', 'groovy', 'lo-fi'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 3, rotation: 1, probability: 0.9, gain: 0.55, delaySend: 0.15, reverbSend: 0.3 },
      { voice: 'snare', steps: 16, pulses: 2, rotation: 5, probability: 0.85, gain: 0.4, delaySend: 0.25, reverbSend: 0.4 },
      { voice: 'choir', steps: 16, pulses: 4, rotation: 3, probability: 0.8, gain: 0.5, delaySend: 0.4, reverbSend: 0.6 },
      { voice: 'kalimba', steps: 16, pulses: 3, rotation: 0, probability: 0.75, gain: 0.4, delaySend: 0.5, reverbSend: 0.5 },
      { voice: 'bass', steps: 8, pulses: 3, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.15, reverbSend: 0.15 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Ethereal Voices', bpm: 88, root: 62, scale: 'lydian', seed: 88088, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['dreamy', 'spacious', 'ethereal'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 0.8, gain: 0.45, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'choir', steps: 8, pulses: 4, rotation: 0, probability: 0.9, gain: 0.55, delaySend: 0.5, reverbSend: 0.8 },
      { voice: 'pad', steps: 16, pulses: 3, rotation: 4, probability: 0.85, gain: 0.45, delaySend: 0.4, reverbSend: 0.7 },
      { voice: 'gong', steps: 16, pulses: 1, rotation: 8, probability: 0.6, gain: 0.3, delaySend: 0.6, reverbSend: 0.8 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 0, probability: 0.7, gain: 0.35, delaySend: 0.5, reverbSend: 0.7 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Choral Ambient Drift', bpm: 72, root: 60, scale: 'pentatonic', seed: 72072, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['meditative', 'choral', 'minimal'],
    rings: [
      { voice: 'choir', steps: 8, pulses: 4, rotation: 0, probability: 0.9, gain: 0.6, delaySend: 0.4, reverbSend: 0.9 },
      { voice: 'stringPad', steps: 16, pulses: 2, rotation: 5, probability: 0.8, gain: 0.45, delaySend: 0.5, reverbSend: 0.8 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 3, probability: 0.6, gain: 0.3, delaySend: 0.6, reverbSend: 0.7 },
      { voice: 'pad', steps: 16, pulses: 1, rotation: 0, probability: 0.7, gain: 0.4, delaySend: 0.5, reverbSend: 0.8 },
      { voice: 'kick', steps: 16, pulses: 1, rotation: 0, probability: 0.5, gain: 0.3, delaySend: 0.2, reverbSend: 0.4 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Soul & Strings', bpm: 110, root: 55, scale: 'dorian', seed: 11011, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['soulful', 'warm', 'funky'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 5, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 4, rotation: 4, probability: 0.95, gain: 0.55, delaySend: 0.2, reverbSend: 0.2 },
      { voice: 'choir', steps: 8, pulses: 5, rotation: 1, probability: 0.9, gain: 0.5, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'vibraphone', steps: 16, pulses: 3, rotation: 6, probability: 0.8, gain: 0.4, delaySend: 0.4, reverbSend: 0.4 },
      { voice: 'sitar', steps: 16, pulses: 2, rotation: 0, probability: 0.7, gain: 0.35, delaySend: 0.5, reverbSend: 0.6 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Vocal Glitch Texture', bpm: 130, root: 60, scale: 'chromatic', seed: 13013, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['experimental', 'modern', 'glitchy'],
    rings: [
      { voice: 'hat', steps: 16, pulses: 10, rotation: 1, probability: 0.7, gain: 0.35, delaySend: 0.3, reverbSend: 0.2 },
      { voice: 'choir', steps: 16, pulses: 5, rotation: 3, probability: 0.75, gain: 0.5, delaySend: 0.5, reverbSend: 0.6 },
      { voice: 'pad', steps: 8, pulses: 3, rotation: 0, probability: 0.8, gain: 0.4, delaySend: 0.4, reverbSend: 0.7 },
      { voice: 'bell', steps: 13, pulses: 4, rotation: 5, probability: 0.6, gain: 0.35, delaySend: 0.6, reverbSend: 0.5 },
      { voice: 'clap', steps: 16, pulses: 3, rotation: 7, probability: 0.5, gain: 0.4, delaySend: 0.4, reverbSend: 0.3 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Gospel Harmonies', bpm: 100, root: 55, scale: 'major', seed: 10100, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['uplifting', 'soulful', 'harmonic'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.15 },
      { voice: 'snare', steps: 16, pulses: 2, rotation: 4, probability: 1.0, gain: 0.55, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'vocalStab', steps: 8, pulses: 4, rotation: 0, probability: 0.85, gain: 0.5, delaySend: 0.2, reverbSend: 0.4 },
      { voice: 'harmonies', steps: 16, pulses: 3, rotation: 2, probability: 0.9, gain: 0.45, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'bass', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Intimate Whispers', bpm: 75, root: 62, scale: 'lydian', seed: 75075, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['ethereal', 'intimate', 'gentle'],
    rings: [
      { voice: 'whisper', steps: 16, pulses: 4, rotation: 0, probability: 0.8, gain: 0.5, delaySend: 0.4, reverbSend: 0.7 },
      { voice: 'vocalPad', steps: 8, pulses: 3, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.3, reverbSend: 0.8 },
      { voice: 'hat', steps: 16, pulses: 3, rotation: 5, probability: 0.5, gain: 0.2, delaySend: 0.2, reverbSend: 0.5 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 3, probability: 0.6, gain: 0.3, delaySend: 0.5, reverbSend: 0.6 },
      { voice: 'bass', steps: 16, pulses: 1, rotation: 0, probability: 1.0, gain: 0.35, delaySend: 0.3, reverbSend: 0.4 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Soul Vocal Drive', bpm: 110, root: 55, scale: 'dorian', seed: 11011, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['soulful', 'groovy', 'warm'],
    rings: [
      { voice: 'kick', steps: 16, pulses: 5, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.1 },
      { voice: 'vocalStab', steps: 16, pulses: 6, rotation: 2, probability: 0.85, gain: 0.45, delaySend: 0.15, reverbSend: 0.3 },
      { voice: 'choir', steps: 8, pulses: 4, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'bass', steps: 16, pulses: 5, rotation: 1, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'snare', steps: 16, pulses: 4, rotation: 4, probability: 0.95, gain: 0.55, delaySend: 0.2, reverbSend: 0.2 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Vocal Glitch Pop', bpm: 125, root: 60, scale: 'minor', seed: 12512, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['modern', 'electronic', 'rhythmic'],
    rings: [
      { voice: 'vocalGlitch', steps: 16, pulses: 8, rotation: 1, probability: 0.8, gain: 0.45, delaySend: 0.3, reverbSend: 0.2 },
      { voice: 'clap', steps: 16, pulses: 4, rotation: 4, probability: 0.9, gain: 0.5, delaySend: 0.2, reverbSend: 0.25 },
      { voice: 'bass', steps: 16, pulses: 5, rotation: 0, probability: 1.0, gain: 0.5, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'hat', steps: 16, pulses: 12, rotation: 0, probability: 0.75, gain: 0.35, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'poly', steps: 16, pulses: 3, rotation: 6, probability: 0.85, gain: 0.4, delaySend: 0.4, reverbSend: 0.5 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Ethereal Vocals', bpm: 80, root: 62, scale: 'pentatonic', seed: 80808, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['dreamy', 'spacious', 'meditative'],
    rings: [
      { voice: 'whisper', steps: 16, pulses: 3, rotation: 0, probability: 0.7, gain: 0.45, delaySend: 0.5, reverbSend: 0.8 },
      { voice: 'vocalPad', steps: 8, pulses: 4, rotation: 1, probability: 0.85, gain: 0.5, delaySend: 0.4, reverbSend: 0.7 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 5, probability: 0.6, gain: 0.35, delaySend: 0.6, reverbSend: 0.8 },
      { voice: 'kick', steps: 16, pulses: 1, rotation: 0, probability: 0.8, gain: 0.4, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'pad', steps: 16, pulses: 2, rotation: 8, probability: 0.7, gain: 0.4, delaySend: 0.5, reverbSend: 0.7 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Urban Vocal Loops', bpm: 95, root: 48, scale: 'minor', seed: 95095, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['urban', 'rhythmic', 'modern'],
    rings: [
      { voice: 'vocalGlitch', steps: 16, pulses: 6, rotation: 2, probability: 0.8, gain: 0.45, delaySend: 0.25, reverbSend: 0.2 },
      { voice: 'snare', steps: 16, pulses: 4, rotation: 4, probability: 0.9, gain: 0.55, delaySend: 0.15, reverbSend: 0.2 },
      { voice: 'bass', steps: 8, pulses: 5, rotation: 0, probability: 1.0, gain: 0.55, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'hat', steps: 16, pulses: 10, rotation: 0, probability: 0.8, gain: 0.35, delaySend: 0.1, reverbSend: 0.1 },
      { voice: 'kick', steps: 16, pulses: 4, rotation: 0, probability: 1.0, gain: 0.7, delaySend: 0.05, reverbSend: 0.1 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Choir Swell', bpm: 90, root: 60, scale: 'lydian', seed: 90090, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['cinematic', 'orchestral', 'building'],
    rings: [
      { voice: 'choir', steps: 8, pulses: 5, rotation: 0, probability: 0.9, gain: 0.55, delaySend: 0.3, reverbSend: 0.7 },
      { voice: 'vocalPad', steps: 16, pulses: 3, rotation: 4, probability: 0.85, gain: 0.45, delaySend: 0.4, reverbSend: 0.8 },
      { voice: 'stringPad', steps: 8, pulses: 4, rotation: 0, probability: 0.9, gain: 0.5, delaySend: 0.4, reverbSend: 0.7 },
      { voice: 'bell', steps: 16, pulses: 2, rotation: 0, probability: 0.7, gain: 0.35, delaySend: 0.5, reverbSend: 0.6 },
      { voice: 'kick', steps: 16, pulses: 2, rotation: 0, probability: 0.8, gain: 0.5, delaySend: 0.1, reverbSend: 0.3 },
    ],
    arrangement: { scenes: [{ name: 'A', rings: null }], currentScene: 0, loop: true },
  },
  {
    name: 'Vocal Minimalist', bpm: 70, root: 60, scale: 'pentatonic', seed: 70070, masterGain: 0.45,
    category: 'Vocal & Chorus', mood: ['meditative', 'sparse', 'calm'],
    rings: [
      { voice: 'vocalStab', steps: 16, pulses: 3, rotation: 0, probability: 0.7, gain: 0.4, delaySend: 0.4, reverbSend: 0.6 },
      { voice: 'pad', steps: 16, pulses: 2, rotation: 5, probability: 0.8, gain: 0.45, delaySend: 0.5, reverbSend: 0.8 },
      { voice: 'hat', steps: 16, pulses: 2, rotation: 8, probability: 0.4, gain: 0.2, delaySend: 0.3, reverbSend: 0.5 },
      { voice: 'bass', steps: 16, pulses: 1, rotation: 0, probability: 1.0, gain: 0.4, delaySend: 0.2, reverbSend: 0.3 },
      { voice: 'whisper', steps: 16, pulses: 2, rotation: 3, probability: 0.6, gain: 0.35, delaySend: 0.5, reverbSend: 0.7 },
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

/**
 * Returns presets filtered by category.
 */
export function getPresetsByCategory(category) {
  return presets.filter(p => p.category === category);
}

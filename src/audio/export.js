// Offline WAV export — renders a patch to an AudioBuffer using the same
// voice and master chain as live playback, then encodes to 16-bit PCM WAV.
// Uses OfflineAudioContext so rendering happens at maximum speed.

import { createMaster } from './master.js';
import { initNoise } from './noise.js';
import { encodeWav } from './wav.js';
import { kick, snare, hat, bass, poly, pluck, clap, tom, cowbell, rim, conga, bell, pad, kalimba, vibraphone, stringPad, gong, sitar, choir, vocalPad, vocalStab, harmonies, whisper, vocalGlitch, shaker, subBass, metallic, marimba, tape, organ } from './voices/index.js';
import { bjorklund, rotate } from '../gen/euclid.js';

const voiceMap = { kick, snare, hat, bass, poly, pluck, clap, tom, cowbell, rim, conga, bell, pad, kalimba, vibraphone, stringPad, gong, sitar, choir, vocalPad, vocalStab, harmonies, whisper, vocalGlitch, shaker, subBass, metallic, marimba, tape, organ };

/**
 * Export the current patch as a WAV file.
 *
 * @param {object} patch — full patch object (bpm, rings, masterGain, etc.)
 * @param {number} durationSeconds — how long to render
 * @param {number} [sampleRate=44100] — output sample rate
 * @returns {Promise<{ audioBuffer: AudioBuffer, wavBlob: Blob, duration: number }>}
 *
 * Known limitation: probability gating uses Math.random() so each export
 * of the same patch may differ slightly in which hits are skipped.
 */
export async function exportWAV(patch, durationSeconds, sampleRate = 44100) {
  const totalSamples = Math.ceil(sampleRate * durationSeconds);
  const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

  // Initialize noise buffer for this context (needed by snare, hat, clap)
  initNoise(offlineCtx);

  // Wire master chain: voices → compressor → limiter → destination
  const master = createMaster(offlineCtx);
  master.gain.gain.value = patch.masterGain ?? 0.45;
  master.connect(offlineCtx.destination);

  // Calculate timing
  const stepsPerLoop = 16;
  const secondsPerStep = (60 / (patch.bpm || 120)) / (stepsPerLoop / 4);
  const secondsPerLoop = secondsPerStep * stepsPerLoop;
  const totalSteps = Math.ceil(durationSeconds / secondsPerStep);

  // Schedule all voices for all steps
  for (let step = 0; step < totalSteps; step++) {
    const time = step * secondsPerStep;

    // Don't schedule events past the render duration
    if (time >= durationSeconds) break;

    for (let ringIndex = 0; ringIndex < patch.rings.length; ringIndex++) {
      const ring = patch.rings[ringIndex];
      if (!ring) continue;

      // Resolve voice function from ring.voice
      const voiceFn = voiceMap[ring.voice];
      if (!voiceFn) continue;

      // Check Euclidean pattern
      const pattern = rotate(bjorklund(ring.steps, ring.pulses), ring.rotation);
      const stepInPattern = step % ring.steps;
      if (!pattern[stepInPattern]) continue;

      // Probability gate
      if (ring.probability < 1.0 && Math.random() > ring.probability) continue;

      // Schedule the voice hit
      voiceFn(offlineCtx, master.input, time, {
        step,
        voice: ringIndex,
        velocity: ring.gain,
      });
    }
  }

  // Render the full duration
  const audioBuffer = await offlineCtx.startRendering();

  // Encode to 16-bit PCM WAV
  const channels = [];
  for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
    channels.push(audioBuffer.getChannelData(ch));
  }

  const wavData = encodeWav({ sampleRate, channels });
  const wavBlob = new Blob([wavData], { type: 'audio/wav' });

  return { audioBuffer, wavBlob, duration: durationSeconds };
}

/**
 * Trigger a browser download of the WAV blob.
 */
export function downloadWAV(wavBlob, filename = 'rondel-export.wav') {
  const url = URL.createObjectURL(wavBlob);

  // iOS Safari doesn't support programmatic downloads via <a>.click()
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    window.open(url, '_blank');
    return;
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

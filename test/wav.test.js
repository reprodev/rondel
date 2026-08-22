import { describe, it } from 'node:test';
import assert from 'node:assert';
import { encodeWav, wavDuration, wavSampleRate, wavChannelCount } from '../src/audio/wav.js';

describe('encodeWav header validation', () => {
  it('first 4 bytes are "RIFF"', () => {
    const wav = encodeWav({ sampleRate: 44100, channels: [new Float32Array(100)] });
    const riff = String.fromCharCode(...wav.slice(0, 4));
    assert.strictEqual(riff, 'RIFF');
  });

  it('bytes 8-11 are "WAVE"', () => {
    const wav = encodeWav({ sampleRate: 44100, channels: [new Float32Array(100)] });
    const wave = String.fromCharCode(...wav.slice(8, 12));
    assert.strictEqual(wave, 'WAVE');
  });
});

describe('encodeWav mono silence', () => {
  const silence = new Float32Array(100);
  const wav = encodeWav({ sampleRate: 44100, channels: [silence] });

  it('file size = 44 + numSamples * 2', () => {
    assert.strictEqual(wav.byteLength, 44 + 200);
  });

  it('header fields are correct', () => {
    const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
    assert.strictEqual(view.getUint32(4, true), wav.byteLength - 8);
    assert.strictEqual(view.getUint16(20, true), 1);   // PCM
    assert.strictEqual(view.getUint16(22, true), 1);   // mono
    assert.strictEqual(view.getUint32(24, true), 44100);
    assert.strictEqual(view.getUint32(28, true), 44100 * 2); // byte rate
    assert.strictEqual(view.getUint16(32, true), 2);   // block align
    assert.strictEqual(view.getUint16(34, true), 16);  // bits per sample
    assert.strictEqual(view.getUint32(40, true), 200); // data size
  });
});

describe('encodeWav stereo sine', () => {
  const sampleRate = 44100;
  const numSamples = 44100; // 1 second
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    left[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate);
    right[i] = Math.sin(2 * Math.PI * 880 * i / sampleRate);
  }
  const wav = encodeWav({ sampleRate, channels: [left, right] });

  it('correct interleaving — file size matches stereo layout', () => {
    assert.strictEqual(wav.byteLength, 44 + numSamples * 2 * 2);
  });

  it('duration reads back as 1.0 seconds', () => {
    assert.strictEqual(wavDuration(wav), 1.0);
  });

  it('channel count is 2', () => {
    assert.strictEqual(wavChannelCount(wav), 2);
  });
});

describe('wavDuration', () => {
  it('mono 44100 samples at 44100Hz = 1.0s', () => {
    const wav = encodeWav({ sampleRate: 44100, channels: [new Float32Array(44100)] });
    assert.strictEqual(wavDuration(wav), 1.0);
  });
});

describe('wavChannelCount', () => {
  it('mono = 1', () => {
    const wav = encodeWav({ sampleRate: 44100, channels: [new Float32Array(10)] });
    assert.strictEqual(wavChannelCount(wav), 1);
  });

  it('stereo = 2', () => {
    const wav = encodeWav({ sampleRate: 44100, channels: [new Float32Array(10), new Float32Array(10)] });
    assert.strictEqual(wavChannelCount(wav), 2);
  });
});

describe('wavSampleRate', () => {
  it('reads back correctly', () => {
    const wav = encodeWav({ sampleRate: 48000, channels: [new Float32Array(10)] });
    assert.strictEqual(wavSampleRate(wav), 48000);
  });
});

describe('sample accuracy', () => {
  it('encodes [1.0, -1.0, 0.0, 0.5] to expected int16 values', () => {
    const samples = new Float32Array([1.0, -1.0, 0.0, 0.5]);
    const wav = encodeWav({ sampleRate: 44100, channels: [samples] });
    const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);

    assert.strictEqual(view.getInt16(44, true), 32767);   // 1.0
    assert.strictEqual(view.getInt16(46, true), -32768);  // -1.0
    assert.strictEqual(view.getInt16(48, true), 0);       // 0.0
    // 0.5 * 0x7FFF = 16383.5, rounds to 16384
    assert.strictEqual(view.getInt16(50, true), 16384);
  });
});

describe('clipping', () => {
  it('values > 1.0 are clamped to 32767', () => {
    const samples = new Float32Array([2.5]);
    const wav = encodeWav({ sampleRate: 44100, channels: [samples] });
    const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
    assert.strictEqual(view.getInt16(44, true), 32767);
  });

  it('values < -1.0 are clamped to -32768', () => {
    const samples = new Float32Array([-3.0]);
    const wav = encodeWav({ sampleRate: 44100, channels: [samples] });
    const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
    assert.strictEqual(view.getInt16(44, true), -32768);
  });
});

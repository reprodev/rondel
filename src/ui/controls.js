// DOM overlay controls — status display, modals, tooltips, keyboard hints.
// These float above the canvas and are managed independently from the
// rAF draw loop so they don't cause layout thrashing every frame.

let root = null;
let statusEl = null;
let playBtn = null;
let keyboardHintEl = null;
let modalOverlay = null;
let toastEl = null;
let tooltipEl = null;

const STYLES = `
  .rondel-controls {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
  }
  .rondel-status {
    font-family: monospace;
    font-size: 0.85em;
    color: #aaa;
    text-align: center;
    padding: 0.5rem 0;
    letter-spacing: 0.02em;
  }
  .rondel-play-btn {
    display: block;
    margin: 0.8rem auto;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #666;
    background: #222;
    color: #e0e0e0;
    font-family: system-ui, sans-serif;
    font-size: 1.2rem;
    cursor: pointer;
    text-transform: uppercase;
    line-height: 44px;
    text-align: center;
    transition: border-color 0.15s, background 0.15s;
  }
  .rondel-play-btn:hover {
    border-color: #aaa;
    background: #2a2a2a;
  }
  .rondel-play-btn.playing {
    border-color: #4ec96e;
  }
  .rondel-keyboard-hint {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    font-family: monospace;
    font-size: 0.65em;
    color: #e0e0e0;
    opacity: 0.5;
    pointer-events: none;
    line-height: 1.6;
    text-align: right;
  }
  .rondel-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s;
  }
  .rondel-modal-overlay.visible {
    opacity: 1;
    pointer-events: all;
  }
  .rondel-modal {
    width: 300px;
    height: 200px;
    background: #222;
    border: 1px solid #555;
    border-radius: 8px;
    padding: 1.5rem;
    font-family: system-ui, sans-serif;
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .rondel-modal h3 {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    color: #ccc;
  }
  .rondel-modal input[type="range"] {
    width: 100%;
    margin: 0.5rem 0;
  }
  .rondel-modal .modal-value {
    font-family: monospace;
    font-size: 1.1rem;
    text-align: center;
    color: #fff;
  }
  .rondel-modal .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .rondel-modal button {
    font-family: system-ui, sans-serif;
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
    border: 1px solid #555;
    border-radius: 4px;
    background: #333;
    color: #e0e0e0;
    cursor: pointer;
  }
  .rondel-modal button:hover { background: #444; }
  .rondel-modal button.confirm {
    background: #2a5a3a;
    border-color: #4ec96e;
  }
  .rondel-modal button.confirm:hover { background: #3a7a4a; }
  .rondel-toast {
    position: fixed;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: system-ui, sans-serif;
    font-size: 0.85rem;
    color: #fff;
    background: #333;
    border: 1px solid #555;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 1001;
  }
  .rondel-toast.visible { opacity: 1; }
  .rondel-tooltip {
    position: absolute;
    font-family: monospace;
    font-size: 8px;
    color: #e0e0e0;
    background: rgba(30, 30, 30, 0.9);
    border: 1px solid #555;
    border-radius: 3px;
    padding: 2px 5px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s;
    z-index: 999;
    white-space: nowrap;
  }
  .rondel-tooltip.visible { opacity: 1; }
`;

/**
 * Inject scoped styles once. Uses a style element so we don't depend
 * on an external CSS file being loaded.
 */
function injectStyles() {
  if (document.getElementById('rondel-controls-styles')) return;
  const style = document.createElement('style');
  style.id = 'rondel-controls-styles';
  style.textContent = STYLES;
  document.head.appendChild(style);
}

/**
 * Create the full DOM structure for controls. Idempotent — calling
 * multiple times returns the same elements.
 */
export function initControls() {
  if (root) return { root, statusEl, playBtn };

  injectStyles();

  root = document.createElement('div');
  root.className = 'rondel-controls';

  // Status line
  statusEl = document.createElement('div');
  statusEl.className = 'rondel-status';
  statusEl.textContent = 'Ready';
  root.appendChild(statusEl);

  // Play/Stop button
  playBtn = document.createElement('button');
  playBtn.className = 'rondel-play-btn';
  playBtn.textContent = '\u25B6'; // ▶
  playBtn.setAttribute('aria-label', 'Play');
  root.appendChild(playBtn);

  // Keyboard hints (fixed position)
  keyboardHintEl = document.createElement('div');
  keyboardHintEl.className = 'rondel-keyboard-hint';
  keyboardHintEl.innerHTML = [
    'Space: play/stop',
    '\u2190\u2192: rotate',
    '+/\u2212: tempo',
  ].join('<br>');
  document.body.appendChild(keyboardHintEl);

  // Modal overlay (hidden)
  modalOverlay = document.createElement('div');
  modalOverlay.className = 'rondel-modal-overlay';
  document.body.appendChild(modalOverlay);

  // Toast (hidden)
  toastEl = document.createElement('div');
  toastEl.className = 'rondel-toast';
  document.body.appendChild(toastEl);

  // Tooltip (hidden)
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'rondel-tooltip';
  document.body.appendChild(tooltipEl);

  return { root, statusEl, playBtn };
}

/**
 * Refresh the status line with current patch info.
 */
export function updateStatus(patch, isPlaying, bpm) {
  if (!statusEl) return;
  const playing = isPlaying ? '\uD83C\uDFB5' : '\u23F8'; // 🎵 or ⏸
  const scene = patch?.arrangement?.scenes?.[patch?.arrangement?.currentScene]?.name || 'A';
  const seed = patch?.seed ?? '\u2014';
  statusEl.textContent = `${playing} ${bpm} BPM | Scene ${scene} | seed: ${seed}`;
}

/**
 * Update the play button appearance based on transport state.
 */
export function setPlayingState(isPlaying) {
  if (!playBtn) return;
  if (isPlaying) {
    playBtn.textContent = '\u25A0'; // ■
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Stop');
  } else {
    playBtn.textContent = '\u25B6'; // ▶
    playBtn.classList.remove('playing');
    playBtn.setAttribute('aria-label', 'Play');
  }
}

/**
 * Show a modal for editing pulses on a ring.
 * onConfirm receives the new pulse count when the user clicks OK.
 */
export function showPulseModal(ring, currentPulses, stepCount, onConfirm) {
  if (!modalOverlay) return;

  const modal = document.createElement('div');
  modal.className = 'rondel-modal';

  const voiceNames = ['Kick', 'Snare', 'Hat', 'Bass', 'Poly'];
  const name = voiceNames[ring] || `Ring ${ring}`;

  modal.innerHTML = `
    <h3>${name} \u2014 Pulses</h3>
    <div class="modal-value">${currentPulses} / ${stepCount}</div>
    <input type="range" min="0" max="${stepCount}" value="${currentPulses}" step="1">
    <div class="modal-actions">
      <button class="cancel">Cancel</button>
      <button class="confirm">OK</button>
    </div>
  `;

  const valueDisplay = modal.querySelector('.modal-value');
  const slider = modal.querySelector('input[type="range"]');
  const cancelBtn = modal.querySelector('.cancel');
  const confirmBtn = modal.querySelector('.confirm');

  slider.addEventListener('input', () => {
    valueDisplay.textContent = `${slider.value} / ${stepCount}`;
  });

  function close() {
    modalOverlay.classList.remove('visible');
    modalOverlay.innerHTML = '';
  }

  cancelBtn.addEventListener('click', close);
  confirmBtn.addEventListener('click', () => {
    const newPulses = Number(slider.value);
    close();
    if (onConfirm) onConfirm(newPulses);
  });

  modalOverlay.innerHTML = '';
  modalOverlay.appendChild(modal);
  modalOverlay.classList.add('visible');

  // Close on backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) close();
  }, { once: true });
}

/**
 * Show a floating tooltip at canvas-relative coordinates.
 * Auto-hides after duration (ms, default 1500).
 */
export function showTooltip(x, y, text, duration = 1500) {
  if (!tooltipEl) return;
  tooltipEl.textContent = text;
  tooltipEl.style.left = x + 'px';
  tooltipEl.style.top = y + 'px';
  tooltipEl.classList.add('visible');

  setTimeout(() => {
    tooltipEl.classList.remove('visible');
  }, duration);
}

/**
 * Show a brief toast notification (e.g., "Link copied!").
 * Auto-hides after 2 seconds.
 */
export function showCopyToast(message = 'Link copied!') {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('visible');

  setTimeout(() => {
    toastEl.classList.remove('visible');
  }, 2000);
}

/**
 * Returns the play button element for external event binding.
 */
export function getPlayButton() {
  return playBtn;
}

# Code Style and Naming

**Naming:**
- Voice modules: lowercase, export `play`.
- Pure modules: lowercase, export named functions and constants.
- State objects: camelCase.
- UI variables: `ctx` for canvas context, `audioCtx` for `AudioContext`, `now` for `AudioContext.currentTime`.

**OKLCH colour:**
- Voice hues spaced by the golden angle (137.5°) from a seed-derived base.
- `oklch.js` owns the OKLCH → linear sRGB → gamma conversion; no browser `oklch()` in canvas.
- CSS: safe to use `oklch()` in DOM elements.

**Comments:** Only explain *why*, never *what*. A line that adds two numbers doesn't need a comment. A line that clamps to `0.0001` instead of `0` needs one.

**No emoji in code or UI.** Emoji in filenames (e.g. `🎵-rondel.md` in docs) is fine; emoji in source code or rendered UI is not.

**No inline styles.** Styles in `<style>` blocks or external sheets. Canvas uses `fillStyle` and `strokeStyle`; DOM uses class bindings.

**No CSS frameworks.** Hand-written CSS grid/flexbox only. Shadow DOM only if unavoidable.
// OKLCH color space conversions — perceptually uniform color for the ring UI.

/**
 * Converts OKLCH to linear sRGB. Uses the OKLab intermediate representation
 * because it separates lightness from chromaticity, letting the UI animate
 * hue without perceptual brightness jumps.
 */
export function oklchToSrgb(L, C, H) {
  const hRad = H * Math.PI / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab to approximate LMS cone response (cube-root domain)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  // Undo cube root
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS to linear sRGB
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, bl))
  ];
}

/**
 * sRGB gamma compression. The piecewise function avoids the near-black
 * gradient banding that a plain power curve would introduce.
 */
export function linearToGamma(c) {
  if (c <= 0.0031308) return 12.92 * c;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/**
 * sRGB gamma decompression (inverse of linearToGamma). Needed when
 * reading hex colors back into linear space for mixing or blending.
 */
export function gammaToLinear(c) {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Full pipeline from perceptual OKLCH to a CSS-ready hex string.
 * Rounds after gamma to avoid sub-pixel dithering artefacts.
 */
export function oklchToHex(L, C, H) {
  const [r, g, b] = oklchToSrgb(L, C, H);
  const rr = Math.round(linearToGamma(r) * 255);
  const gg = Math.round(linearToGamma(g) * 255);
  const bb = Math.round(linearToGamma(b) * 255);
  return '#' + [rr, gg, bb].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Reverse path: hex string back to OKLCH. Useful for importing user-chosen
 * palette colors into the perceptual parameter space.
 */
export function hexToOklch(hex) {
  const raw = hex.replace('#', '');
  const ri = parseInt(raw.slice(0, 2), 16) / 255;
  const gi = parseInt(raw.slice(2, 4), 16) / 255;
  const bi = parseInt(raw.slice(4, 6), 16) / 255;

  // Gamma decompress to linear
  const r = gammaToLinear(ri);
  const g = gammaToLinear(gi);
  const b = gammaToLinear(bi);

  // Linear sRGB to LMS (inverse of the LMS→sRGB matrix)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  // Cube root for OKLab
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // LMS cube-root to OKLab
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + bLab * bLab);
  let H = Math.atan2(bLab, a) * 180 / Math.PI;
  if (H < 0) H += 360;

  // Round to 4 decimal places for reasonable precision
  return [
    Math.round(L * 10000) / 10000,
    Math.round(C * 10000) / 10000,
    Math.round(H * 10000) / 10000
  ];
}

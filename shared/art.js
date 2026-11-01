// Drawn pictures: SVG drawn in code on a 100 x 100 grid, sized by the font-size of the parent (1em square).
// If a picture is missing the emoji fallback is shown instead.
export const K = '#2b2250';
export const W = '#ffffff';
export const O = '#ff9f1c';
export const Y = '#ffd23f';
export const R = '#e63946';
export const B = '#2f9bff';
export const G = '#2ec27e';
export const DG = '#1b7f4b';
export const P = '#ff5fa2';
export const V = '#8e5cf6';
export const BR = '#8b5a2b';
export const LB = '#bfe6ff';
export const GR = '#a9a4c0';
export const DGR = '#6b6688';
export const SK = '#f5c9a0';
export const TAN = '#d9a36a';
export const eye = (x, y, r = 3.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/>`;
export const line = (d, w = 2.5, c = K) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

export function svgPic(inner) {
  const s = document.createElement('span');
  s.className = 'art';
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%">${inner}</svg>`;
  return s;
}

// A drawn picture from `table[key]`, or the fallback text (emoji) if there is none.
export function picture(table, key, fallback) {
  if (table[key]) return svgPic(table[key]);
  const s = document.createElement('span');
  s.textContent = fallback;
  return s;
}

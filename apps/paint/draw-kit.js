// Shared drawing helpers for the colouring pictures (120 x 90 grid). See pages.js for how the pictures are used.
export const K = '#2b2250';
export const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 120 90"><rect width="120" height="90" fill="#fff"/><g fill="#fff" stroke="${K}" stroke-width="0.95" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
export const circ = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
export const ell = (cx, cy, rx, ry, rot = 0) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
export const dot = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${K}"/>`;
export const open = (d) => `<path d="${d}" fill="none"/>`;
export const eye = (x, y, r = 4.5) => `${circ(x, y, r)}${dot(x + r * 0.15, y + r * 0.2, r * 0.5)}`;
export const blush = (x, y) => ell(x, y, 3.6, 2.4);
export const star = (cx, cy, r) => `<polygon points="${Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const rr = i % 2 ? r * 0.45 : r;
  return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
}).join(' ')}"/>`;
export const heart = (x, y, s) => `<path d="M${x} ${y + s} C${x - s * 1.6} ${y} ${x - s * 1.2} ${y - s * 1.1} ${x} ${y - s * 0.3} C${x + s * 1.2} ${y - s * 1.1} ${x + s * 1.6} ${y} ${x} ${y + s}Z"/>`;
export const cloud = (x, y) => `<path transform="translate(${x} ${y})" d="M0 8 Q-8 8 -6 1 Q-4 -5 3 -4 Q5 -12 14 -11 Q22 -11 23 -3 Q31 -3 30 3 Q30 8 24 8Z"/>`;
export const grass = (y = 82) => `<path d="M0 ${y} Q8 ${y - 5} 16 ${y} T32 ${y} T48 ${y} T64 ${y} T80 ${y} T96 ${y} T112 ${y} T128 ${y} V90 H0Z"/>`;
export const sun = (x, y, r) => `${Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return `<path d="M${(x + (r + 2) * Math.cos(a)).toFixed(1)} ${(y + (r + 2) * Math.sin(a)).toFixed(1)} L${(x + (r + 5.5) * Math.cos(a)).toFixed(1)} ${(y + (r + 5.5) * Math.sin(a)).toFixed(1)}" fill="none"/>`;
}).join('')}${circ(x, y, r)}`;
export const bird = (x, y) => `<path transform="translate(${x} ${y})" d="M0 0 Q3 -4 6 0 Q9 -4 12 0" fill="none"/>`;
export const flower = (x, y) => `${Array.from({ length: 5 }, (_, i) => circ((x + 3.3 * Math.cos((i * 2 * Math.PI) / 5 - 1.57)).toFixed(1), (y + 3.3 * Math.sin((i * 2 * Math.PI) / 5 - 1.57)).toFixed(1), 2.4)).join('')}${circ(x, y, 2)}`;

// Lines that must meet an outline exactly (so the paint-bucket cannot leak) are clipped to that shape.
export const clip = (id, shape, lines) => `<clipPath id="${id}">${shape.replace('<', '<')}</clipPath><g clip-path="url(#${id})">${lines}</g>`;

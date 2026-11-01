// Pictures for the home tiles, the games hub and the phonics menu (drawn mostly in white for coloured tiles).
import { W, Y, R, B, G, P, O, K, BR, V, LB, GR, line } from './art.js';

const FONT = 'font-family="Andika, Segoe UI, sans-serif" font-weight="800" text-anchor="middle"';
const die = (x, y, s, pips, rot) => `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})"><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.2}" fill="${W}"/>${pips
  .map(([px, py]) => `<circle cx="${x + px * s}" cy="${y + py * s}" r="${s * 0.075}" fill="${K}"/>`).join('')}</g>`;

export const TILES = {
  phonics: `<rect x="6" y="22" width="88" height="58" rx="14" fill="${W}"/><text x="50" y="64" font-size="36" fill="${P}" ${FONT}>abc</text>`,
  numbers: `<rect x="6" y="22" width="88" height="58" rx="14" fill="${W}"/><text x="50" y="64" font-size="36" fill="${B}" ${FONT}>123</text>`,
  'times-tables': `<rect x="6" y="12" width="88" height="76" rx="14" fill="${W}"/><text x="50" y="52" font-size="32" fill="${O}" ${FONT}>2 × 3</text><text x="50" y="80" font-size="26" fill="${O}" ${FONT}>= 6</text>`,
  'text-editor': `<rect x="12" y="8" width="58" height="82" rx="8" fill="${W}"/>${line('M24 28 H58 M24 44 H58 M24 60 H46', 5, G)}<g transform="rotate(40 76 56)"><rect x="70" y="18" width="12" height="52" rx="3" fill="${Y}"/><polygon points="70,70 82,70 76,86" fill="#f5c9a0"/><polygon points="73.5,80 78.5,80 76,86" fill="${K}"/><rect x="70" y="12" width="12" height="9" rx="3" fill="${P}"/></g>`,
  tracing: `<rect x="6" y="14" width="88" height="72" rx="14" fill="${W}"/><path d="M14 68 H86" stroke="#ffa6b3" stroke-width="2.5"/><text x="34" y="68" font-size="56" fill="none" stroke="#14a89a" stroke-width="2.6" stroke-dasharray="3 4" stroke-linecap="round" ${FONT}>a</text><g transform="rotate(40 74 52)"><rect x="68" y="16" width="11" height="46" rx="3" fill="${Y}" stroke="#d9a400" stroke-width="2"/><polygon points="68,62 79,62 73.5,76" fill="#f5c9a0"/><polygon points="71.5,71 75.5,71 73.5,76" fill="${K}"/><rect x="68" y="11" width="11" height="8" rx="3" fill="${P}"/></g>`,
  paint: `<path d="M50 10 Q94 10 94 48 Q94 72 72 72 Q58 72 62 82 Q64 94 48 92 Q6 88 6 50 Q6 10 50 10Z" fill="${W}"/><circle cx="28" cy="40" r="8" fill="${R}"/><circle cx="46" cy="26" r="8" fill="${Y}"/><circle cx="68" cy="32" r="8" fill="${G}"/><circle cx="78" cy="52" r="8" fill="${B}"/><circle cx="34" cy="62" r="7" fill="#e2dff2"/>`,
  games: `${die(12, 10, 52, [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], -12)}${die(52, 50, 40, [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 14)}`,
  // games hub
  noughts: `${line('M36 12 V88 M64 12 V88 M12 36 H88 M12 64 H88', 4, 'rgba(255,255,255,.55)')}${line('M16 16 L32 32 M32 16 L16 32', 8, W)}<circle cx="76" cy="76" r="11" fill="none" stroke="${Y}" stroke-width="8"/>`,
  connect4: `<rect x="8" y="14" width="84" height="72" rx="12" fill="#2f6bff"/>${[26, 50, 74].map((x, i) => [30, 50, 70].map((y, j) => `<circle cx="${x}" cy="${y}" r="9.5" fill="${(i + j) % 3 === 0 ? R : (i + j) % 3 === 1 ? Y : '#eef2ff'}"/>`).join('')).join('')}`,
  snakes: `${line('M18 92 C58 84 6 62 40 50 S76 30 62 12', 11, '#1b7f4b')}<circle cx="62" cy="14" r="9" fill="#1b7f4b"/><circle cx="59" cy="12" r="2.5" fill="${W}"/><circle cx="66" cy="12" r="2.5" fill="${W}"/><g stroke="${BR}" stroke-linecap="round"><path d="M80 90 L90 46 M96 92 L100 52" stroke-width="5"/><path d="M82 78 L96 80 M84 66 L97 68 M86 54 L98 56" stroke-width="4"/></g>`,
  shopping: `<path d="M24 40 Q24 12 50 12 Q76 12 76 40" fill="none" stroke="${W}" stroke-width="7" stroke-linecap="round"/><circle cx="38" cy="34" r="11" fill="${R}"/><path d="M56 20 L62 44 H48Z" fill="${O}"/><path d="M10 42 H90 L80 88 H20Z" fill="${W}"/>${line('M32 52 L36 80 M50 52 V80 M68 52 L64 80', 4, '#14a89a')}`,
  ludo: `<circle cx="30" cy="30" r="20" fill="${R}"/><circle cx="70" cy="30" r="20" fill="${G}"/><circle cx="30" cy="70" r="20" fill="${B}"/><circle cx="70" cy="70" r="20" fill="${Y}"/><circle cx="30" cy="30" r="9" fill="${W}"/><circle cx="70" cy="30" r="9" fill="${W}"/><circle cx="30" cy="70" r="9" fill="${W}"/><circle cx="70" cy="70" r="9" fill="${W}"/>`,
  // phonics menu
  first: `<rect x="14" y="14" width="72" height="72" rx="16" fill="${W}"/><text x="50" y="70" font-size="58" fill="${P}" ${FONT}>b</text>`,
  build: [[8, '#fff'], [38, '#fff'], [68, '#fff']].map(([x]) => `<rect x="${x}" y="30" width="26" height="40" rx="7" fill="${W}"/>`).join('') + `<text x="21" y="58" font-size="24" fill="${P}" ${FONT}>c</text><text x="51" y="58" font-size="24" fill="${P}" ${FONT}>a</text><text x="81" y="58" font-size="24" fill="${P}" ${FONT}>t</text>`,
  read: `<path d="M6 22 Q28 14 50 26 Q72 14 94 22 V76 Q72 68 50 80 Q28 68 6 76Z" fill="${W}"/><path d="M50 26 V80" stroke="${GR}" stroke-width="3"/>${line('M14 38 Q28 34 42 40 M14 50 Q28 46 42 52 M58 40 Q72 34 86 38 M58 52 Q72 46 86 50', 3, P)}`,
};

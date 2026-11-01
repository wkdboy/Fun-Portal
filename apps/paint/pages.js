// Colouring-in pictures, drawn in code (original line art, 120 x 90 grid). Shapes are filled white so later shapes
// hide earlier lines; the editor turns the dark lines into the outline layer and the white into "colour here".
const K = '#2b2250';
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 120 90"><rect width="120" height="90" fill="#fff"/><g fill="#fff" stroke="${K}" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
const circ = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
const dot = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${K}"/>`;
const open = (d) => `<path d="${d}" fill="none"/>`;
const eye = (x, y, r = 4.5) => `${circ(x, y, r)}${dot(x + 0.3, y + 0.8, r * 0.45)}`;
const star = (cx, cy, r) => `<polygon points="${Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const rr = i % 2 ? r * 0.45 : r;
  return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
}).join(' ')}"/>`;
const ground = open('M2 88 H118');

const cat = `<path d="M82 84 Q106 80 102 56 Q100 48 94 54 Q96 68 80 72Z"/><path d="M34 86 Q32 62 48 60 L72 60 Q88 62 86 86Z"/><ellipse cx="46" cy="85" rx="8" ry="4"/><ellipse cx="74" cy="85" rx="8" ry="4"/>
<path d="M34 36 L36 8 L54 22Z"/><path d="M86 36 L84 8 L66 22Z"/><path d="M38 28 L39 16 L48 22Z"/><path d="M82 28 L81 16 L72 22Z"/><ellipse cx="60" cy="42" rx="29" ry="25"/>
${open('M54 20 Q56 26 54 31 M60 18 V29 M66 20 Q64 26 66 31')}${eye(48, 40, 5)}${eye(72, 40, 5)}<path d="M56 49 L64 49 L60 54Z"/>${open('M60 54 Q56 60 50 57 M60 54 Q64 60 70 57')}${open('M30 46 L44 48 M30 54 L44 52 M90 46 L76 48 M90 54 L76 52')}${ground}`;

const dog = `<path d="M34 86 Q32 62 50 60 L70 60 Q88 62 86 86Z"/><ellipse cx="30" cy="40" rx="9" ry="18" transform="rotate(12 30 40)"/><ellipse cx="90" cy="40" rx="9" ry="18" transform="rotate(-12 90 40)"/><circle cx="60" cy="40" r="26"/>
<ellipse cx="72" cy="30" rx="7" ry="6"/><ellipse cx="60" cy="50" rx="13" ry="10"/><ellipse cx="60" cy="46" rx="5" ry="3.5" fill="${K}"/>${open('M60 49 V55 M52 56 Q60 62 68 56')}<path d="M57 58 Q60 68 63 58Z"/>${eye(48, 36)}${eye(70, 36)}
${open('M40 62 Q60 70 80 62')}${circ(60, 71, 3.2)}<ellipse cx="46" cy="86" rx="8" ry="3.5"/><ellipse cx="74" cy="86" rx="8" ry="3.5"/>${ground}`;

const fish = `<path d="M90 46 L116 26 Q111 46 116 66Z"/><path d="M44 28 Q58 6 70 30Z"/><path d="M50 62 Q56 80 70 64Z"/><path d="M18 46 Q40 16 76 30 Q92 36 100 46 Q92 56 76 62 Q40 76 18 46Z"/>
${eye(34, 42, 5.5)}${open('M44 33 Q39 46 44 59')}${open('M52 40 Q58 46 52 52 M62 37 Q68 46 62 55 M72 38 Q78 46 72 54')}${open('M20 48 Q24 51 28 48')}${circ(12, 26, 4)}${circ(22, 14, 3)}${circ(8, 12, 2.4)}
${open('M16 90 Q10 78 18 70 Q26 62 18 52')}${open('M108 90 Q102 80 108 74 Q114 68 108 60')}${ground}`;

const butterfly = `<path d="M60 40 Q40 4 18 12 Q4 28 28 44 Q44 48 60 44Z"/><path d="M60 40 Q80 4 102 12 Q116 28 92 44 Q76 48 60 44Z"/><path d="M60 46 Q36 48 24 66 Q26 84 46 76 Q58 68 60 52Z"/><path d="M60 46 Q84 48 96 66 Q94 84 74 76 Q62 68 60 52Z"/>
${circ(34, 26, 7)}${circ(86, 26, 7)}${circ(38, 64, 5)}${circ(82, 64, 5)}${circ(26, 40, 2.5)}${circ(94, 40, 2.5)}<ellipse cx="60" cy="50" rx="4" ry="22"/>${circ(60, 26, 5)}${open('M58 22 Q52 8 46 8 M62 22 Q68 8 74 8')}${circ(46, 8, 1.8)}${circ(74, 8, 1.8)}`;

const petals = Array.from({ length: 8 }, (_, i) => circ((60 + 17 * Math.cos((i * Math.PI) / 4)).toFixed(1), (28 + 17 * Math.sin((i * Math.PI) / 4)).toFixed(1), 10)).join('');
const flower = `<path d="M58 40 H62 V90 H58Z"/><path d="M62 70 Q86 56 96 64 Q86 82 62 76Z"/><path d="M58 64 Q34 50 24 58 Q34 76 58 70Z"/>${petals}${circ(60, 28, 11)}${eye(56, 26, 2.5)}${eye(64, 26, 2.5)}${open('M55 32 Q60 36 65 32')}
<path d="M42 90 L45 76 H75 L78 90Z"/><rect x="41" y="72" width="38" height="6" rx="2"/>`;

const house = `<rect x="78" y="14" width="10" height="20"/>${open('M80 8 Q84 4 82 0 M86 8 Q90 4 88 0')}<rect x="26" y="40" width="68" height="46"/><path d="M18 42 L60 10 L102 42Z"/>${circ(60, 28, 6)}${open('M60 22 V34 M54 28 H66')}
<path d="M52 86 V62 Q52 56 60 56 Q68 56 68 62 V86Z"/>${circ(65, 72, 1.4)}<rect x="31" y="50" width="14" height="14"/>${open('M38 50 V64 M31 57 H45')}<rect x="75" y="50" width="14" height="14"/>${open('M82 50 V64 M75 57 H89')}
<path d="M52 86 L46 90 H74 L68 86Z"/>${circ(12, 14, 7)}${open('M12 3 V5 M12 23 V25 M1 14 H3 M21 14 H23 M4 6 L5.5 7.5 M20 22 L18.5 20.5 M20 6 L18.5 7.5 M4 22 L5.5 20.5')}${ground}`;

const tree = `<path d="M54 90 L56 52 H64 L66 90Z"/>${open('M56 70 L48 62 M64 66 L72 58')}<path d="M40 62 Q22 62 26 46 Q18 32 38 28 Q40 8 62 12 Q82 8 86 28 Q102 32 94 46 Q100 62 80 62Z"/>
${circ(48, 36, 3.5)}${circ(70, 30, 3.5)}${circ(76, 48, 3.5)}${circ(54, 50, 3.5)}${circ(36, 50, 3.5)}${circ(12, 14, 7)}${open('M12 3 V5 M12 23 V25 M1 14 H3 M21 14 H23')}${circ(100, 12, 3)}${ground}${open('M6 84 Q10 78 14 84 M104 84 Q108 78 112 84')}`;

const rays = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  const p = (r, d) => `${(52 + r * Math.cos(a + d)).toFixed(1)},${(36 + r * Math.sin(a + d)).toFixed(1)}`;
  return `<polygon points="${p(21, -0.16)} ${p(31, 0)} ${p(21, 0.16)}"/>`;
}).join('');
const sun = `${rays}${circ(52, 36, 17)}${eye(46, 32, 3.5)}${eye(58, 32, 3.5)}${open('M44 41 Q52 48 60 41')}${circ(42, 38, 2.5)}${circ(62, 38, 2.5)}
<path d="M64 82 Q50 82 52 72 Q50 60 66 62 Q70 48 86 54 Q100 50 102 64 Q114 66 108 78 Q106 84 96 82Z"/>${open('M66 70 Q72 66 76 70 M82 64 Q88 60 92 66')}${open('M10 70 Q14 64 18 70 M22 78 Q26 72 30 78')}`;

const car = `<path d="M10 62 V52 Q10 46 18 44 L34 40 Q40 28 52 26 H74 Q86 28 94 42 L104 46 Q110 50 110 58 V62 Q110 66 104 66 H16 Q10 66 10 62Z"/><path d="M42 40 Q46 32 54 32 H60 V42Z"/><path d="M66 32 H74 Q82 34 86 42 H66Z"/>${open('M63 42 V62')}${open('M56 52 H60')}
${circ(105, 55, 3.2)}${circ(14, 55, 2.6)}${circ(34, 66, 10)}${circ(34, 66, 4)}${circ(88, 66, 10)}${circ(88, 66, 4)}${open('M2 80 H118')}${open('M10 85 H26 M40 85 H56 M70 85 H86 M100 85 H116')}${circ(20, 14, 6)}<path d="M80 22 Q76 22 77 18 Q77 13 83 14 Q85 8 92 11 Q98 10 99 16 Q104 17 101 22Z"/>`;

const rocket = `<path d="M38 50 L22 70 L22 84 L38 68Z"/><path d="M82 50 L98 70 L98 84 L82 68Z"/><path d="M48 68 Q60 92 72 68Z"/><path d="M54 68 Q60 80 66 68Z"/><path d="M60 4 Q84 24 84 54 L84 68 H36 V54 Q36 24 60 4Z"/>
${open('M36 56 H84')}${circ(60, 32, 10)}${circ(60, 32, 6)}${star(14, 14, 6)}${star(104, 20, 5)}${star(100, 52, 4)}${star(18, 44, 4)}${circ(110, 76, 7)}${open('M101 78 Q110 71 119 74')}`;

const iceCream = `<path d="M40 44 L60 88 L80 44Z"/>${open('M46 56 L74 56 M51 68 L69 68 M45 48 L68 82 M75 48 L52 82 M56 78 L64 78')}
<path d="M36 46 Q32 30 48 28 Q60 20 72 28 Q88 30 84 46 Q78 52 72 46 Q66 52 60 46 Q54 52 48 46 Q42 52 36 46Z"/><path d="M42 30 Q40 16 54 14 Q60 8 68 14 Q80 16 78 30Z"/>${circ(60, 6, 4)}${open('M60 2 Q64 -2 68 0')}
${open('M50 20 L53 24 M62 18 L60 23 M70 22 L73 26 M46 36 L49 40 M72 38 L75 41')}${star(14, 20, 6)}${star(106, 30, 5)}${circ(100, 70, 8)}${circ(20, 66, 6)}`;

const balloons = `${open('M36 56 Q28 70 40 86')}${open('M62 52 Q70 68 58 88')}${open('M88 54 Q82 70 92 86')}
<ellipse cx="36" cy="34" rx="15" ry="19"/><path d="M36 53 L32 58 H40Z"/>${open('M28 24 Q26 30 28 36')}<ellipse cx="62" cy="30" rx="15" ry="19"/><path d="M62 49 L58 54 H66Z"/>${open('M54 20 Q52 26 54 32')}<ellipse cx="88" cy="34" rx="15" ry="19"/><path d="M88 53 L84 58 H92Z"/>${open('M80 24 Q78 30 80 36')}
${star(36, 34, 6)}${circ(62, 30, 6)}${open('M82 34 H94 M88 28 V40')}${ground}<rect x="46" y="78" width="26" height="10"/>${open('M59 78 V88 M46 83 H72')}`;

const boat = `<path d="M30 14 L30 58 H78Z" transform="translate(-4 0)"/><path d="M62 24 V58 H92Z"/><rect x="57" y="10" width="3" height="52"/><path d="M60 10 L74 15 L60 20Z"/><path d="M22 60 H102 L92 78 H32Z"/>${circ(44, 69, 3.5)}${circ(62, 69, 3.5)}${circ(80, 69, 3.5)}
${open('M2 82 Q12 74 22 82 T42 82 T62 82 T82 82 T102 82 T122 82')}${open('M2 88 Q12 82 22 88 T42 88 T62 88 T82 88 T102 88 T122 88')}${circ(104, 16, 8)}${open('M90 30 Q94 24 98 30 Q102 24 106 30')}`;

const snail = `<path d="M10 76 Q10 66 22 66 H96 Q108 66 108 76 Q108 83 100 83 H18 Q10 83 10 76Z"/><path d="M92 70 Q96 50 100 44 Q106 38 108 48 Q109 60 108 70Z"/>${open('M99 44 Q96 32 92 30 M105 42 Q108 30 112 28')}${circ(92, 30, 2.5)}${circ(112, 28, 2.5)}${eye(103, 52, 2.5)}${open('M100 62 Q104 64 107 60')}
<circle cx="54" cy="46" r="27"/>${circ(54, 46, 19)}${open('M54 46 a4 4 0 1 1 6 4 a10 10 0 1 1 -14 -10 a15 15 0 1 1 21 15')}${open('M8 86 Q12 80 16 86 M100 88 Q104 82 108 88')}${circ(14, 16, 7)}`;

const band = (r) => `<path d="M${60 - r} 78 A${r} ${r} 0 0 1 ${60 + r} 78 L${60 + r - 8} 78 A${r - 8} ${r - 8} 0 0 0 ${68 - r} 78Z"/>`;
const rainbow = `${band(52)}${band(44)}${band(36)}${band(28)}${band(20)}<path d="M4 82 Q0 82 2 76 Q4 68 14 70 Q18 60 30 66 Q40 64 42 74 Q50 76 48 82Z"/><path d="M116 82 Q120 82 118 76 Q116 68 106 70 Q102 60 90 66 Q80 64 78 74 Q70 76 72 82Z"/>${circ(60, 12, 7)}${star(20, 22, 6)}${star(100, 24, 6)}${ground}`;

const robot = `${open('M60 8 V2')}${circ(60, 2.5, 2.5)}<rect x="32" y="16" width="6" height="14" rx="2"/><rect x="82" y="16" width="6" height="14" rx="2"/><rect x="38" y="8" width="44" height="30" rx="6"/>${eye(50, 22, 6)}${eye(70, 22, 6)}<rect x="48" y="30" width="24" height="5" rx="1"/>${open('M54 30 V35 M60 30 V35 M66 30 V35')}
<rect x="54" y="38" width="12" height="6"/><rect x="34" y="44" width="52" height="30" rx="4"/><rect x="42" y="50" width="22" height="14" rx="2"/>${circ(72, 54, 3)}${circ(80, 54, 3)}${circ(72, 64, 3)}${circ(80, 64, 3)}${open('M46 58 H60')}
<rect x="18" y="46" width="14" height="26" rx="6"/><rect x="88" y="46" width="14" height="26" rx="6"/>${circ(25, 76, 5)}${circ(95, 76, 5)}<rect x="42" y="74" width="12" height="12"/><rect x="66" y="74" width="12" height="12"/><rect x="38" y="84" width="20" height="5" rx="2"/><rect x="62" y="84" width="20" height="5" rx="2"/>${star(12, 14, 5)}${star(108, 14, 5)}`;

export const PAGES = [
  { id: 'cat', name: 'Cat', svg: svg(cat) },
  { id: 'dog', name: 'Dog', svg: svg(dog) },
  { id: 'fish', name: 'Fish', svg: svg(fish) },
  { id: 'butterfly', name: 'Butterfly', svg: svg(butterfly) },
  { id: 'flower', name: 'Flower', svg: svg(flower) },
  { id: 'house', name: 'House', svg: svg(house) },
  { id: 'tree', name: 'Tree', svg: svg(tree) },
  { id: 'sun', name: 'Sun', svg: svg(sun) },
  { id: 'car', name: 'Car', svg: svg(car) },
  { id: 'rocket', name: 'Rocket', svg: svg(rocket) },
  { id: 'icecream', name: 'Ice cream', svg: svg(iceCream) },
  { id: 'balloons', name: 'Balloons', svg: svg(balloons) },
  { id: 'boat', name: 'Boat', svg: svg(boat) },
  { id: 'snail', name: 'Snail', svg: svg(snail) },
  { id: 'rainbow', name: 'Rainbow', svg: svg(rainbow) },
  { id: 'robot', name: 'Robot', svg: svg(robot) },
];
export const pageById = (id) => PAGES.find((p) => p.id === id);

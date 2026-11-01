// Colouring-in pictures, drawn in code (original line art, 120 x 90 grid). Shapes are filled white so later shapes
// hide earlier lines; the editor turns the dark lines into the outline layer and the white into "colour here".
// Style: chunky lines, big round shapes, friendly faces, and a simple scene behind each picture.
const K = '#2b2250';
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 120 90"><rect width="120" height="90" fill="#fff"/><g fill="#fff" stroke="${K}" stroke-width="0.95" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
const circ = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
const ell = (cx, cy, rx, ry, rot = 0) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
const dot = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${K}"/>`;
const open = (d) => `<path d="${d}" fill="none"/>`;
const eye = (x, y, r = 4.5) => `${circ(x, y, r)}${dot(x + r * 0.15, y + r * 0.2, r * 0.5)}`;
const blush = (x, y) => ell(x, y, 3.6, 2.4);
const star = (cx, cy, r) => `<polygon points="${Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const rr = i % 2 ? r * 0.45 : r;
  return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
}).join(' ')}"/>`;
const heart = (x, y, s) => `<path d="M${x} ${y + s} C${x - s * 1.6} ${y} ${x - s * 1.2} ${y - s * 1.1} ${x} ${y - s * 0.3} C${x + s * 1.2} ${y - s * 1.1} ${x + s * 1.6} ${y} ${x} ${y + s}Z"/>`;
const cloud = (x, y) => `<path transform="translate(${x} ${y})" d="M0 8 Q-8 8 -6 1 Q-4 -5 3 -4 Q5 -12 14 -11 Q22 -11 23 -3 Q31 -3 30 3 Q30 8 24 8Z"/>`;
const grass = (y = 82) => `<path d="M0 ${y} Q8 ${y - 5} 16 ${y} T32 ${y} T48 ${y} T64 ${y} T80 ${y} T96 ${y} T112 ${y} T128 ${y} V90 H0Z"/>`;
const sun = (x, y, r) => `${Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return `<path d="M${(x + (r + 2) * Math.cos(a)).toFixed(1)} ${(y + (r + 2) * Math.sin(a)).toFixed(1)} L${(x + (r + 5.5) * Math.cos(a)).toFixed(1)} ${(y + (r + 5.5) * Math.sin(a)).toFixed(1)}" fill="none"/>`;
}).join('')}${circ(x, y, r)}`;
const bird = (x, y) => `<path transform="translate(${x} ${y})" d="M0 0 Q3 -4 6 0 Q9 -4 12 0" fill="none"/>`;
const flower = (x, y) => `${Array.from({ length: 5 }, (_, i) => circ((x + 3.3 * Math.cos((i * 2 * Math.PI) / 5 - 1.57)).toFixed(1), (y + 3.3 * Math.sin((i * 2 * Math.PI) / 5 - 1.57)).toFixed(1), 2.4)).join('')}${circ(x, y, 2)}`;

const cat = `${grass(82)}<path d="M82 84 Q106 80 102 56 Q100 48 94 54 Q96 68 80 72Z"/><path d="M34 86 Q32 62 48 60 L72 60 Q88 62 86 86Z"/><ellipse cx="46" cy="85" rx="8" ry="4"/><ellipse cx="74" cy="85" rx="8" ry="4"/>
<path d="M60 63 L50 57 V69Z"/><path d="M60 63 L70 57 V69Z"/>${circ(60, 63, 2.6)}
<path d="M34 38 L35 8 L55 22Z"/><path d="M86 38 L85 8 L65 22Z"/><path d="M38 29 L38.5 16 L48 22Z"/><path d="M82 29 L81.5 16 L72 22Z"/><ellipse cx="60" cy="42" rx="29" ry="25"/>
${open('M54 20 Q56 26 54 31 M60 18 V29 M66 20 Q64 26 66 31')}${eye(48, 40, 6)}${eye(72, 40, 6)}${blush(40, 50)}${blush(80, 50)}<path d="M56 49 L64 49 L60 54Z"/>${open('M60 54 Q56 60 50 57 M60 54 Q64 60 70 57')}${open('M28 46 L40 48 M28 54 L40 52 M92 46 L80 48 M92 54 L80 52')}
${circ(104, 74, 9)}${open('M97 68 Q104 64 111 70 M96 74 Q104 70 112 77 M99 81 Q105 77 111 81')}${open('M95 78 Q86 84 82 80')}${heart(16, 36, 5)}${heart(104, 22, 4)}${cloud(-4, 12)}`;

const dog = `${grass(82)}<path d="M34 86 Q32 62 50 60 L70 60 Q88 62 86 86Z"/><ellipse cx="30" cy="40" rx="10" ry="19" transform="rotate(12 30 40)"/><ellipse cx="90" cy="40" rx="10" ry="19" transform="rotate(-12 90 40)"/><circle cx="60" cy="40" r="26"/>
<ellipse cx="72" cy="30" rx="8" ry="7"/><ellipse cx="60" cy="50" rx="14" ry="11"/><ellipse cx="60" cy="46" rx="5.5" ry="4" fill="${K}"/>${open('M60 50 V55 M52 56 Q60 63 68 56')}<path d="M56.5 58.5 Q60 71 63.5 58.5Z"/>${eye(48, 36, 5.5)}${eye(70, 36, 5)}${blush(40, 47)}${blush(80, 47)}
${open('M40 62 Q60 71 80 62')}${circ(60, 72, 3.4)}<ellipse cx="46" cy="86" rx="8" ry="3.5"/><ellipse cx="74" cy="86" rx="8" ry="3.5"/>
${circ(102, 76, 9)}${open('M95 71 Q102 66 109 72 M94 77 Q102 73 110 80')}${heart(14, 20, 5)}${cloud(86, 12)}`;

const fish = `<path d="M0 82 Q10 76 20 82 T40 82 T60 82 T80 82 T100 82 T120 82 V90 H0Z"/>
<path d="M14 84 Q6 72 14 60 Q20 72 14 84Z"/><path d="M24 84 Q18 74 26 66 Q30 76 24 84Z"/><path d="M104 84 Q98 70 106 60 Q112 72 104 84Z"/>${star(88, 80, 6)}
<path d="M88 46 L114 24 Q108 46 114 68Z"/><path d="M44 28 Q58 4 72 30Z"/><path d="M48 62 Q54 82 72 64Z"/><path d="M16 46 Q38 14 76 28 Q92 34 100 46 Q92 58 76 64 Q38 78 16 46Z"/>
${eye(32, 40, 6.5)}${blush(42, 52)}${open('M44 32 Q39 46 44 60')}${open('M54 38 Q60 46 54 54 M64 36 Q70 46 64 56 M74 38 Q80 46 74 54')}${open('M18 49 Q24 53 30 49')}
${circ(10, 28, 4.5)}${circ(20, 14, 3.5)}${circ(8, 12, 2.6)}${circ(100, 12, 4)}${circ(108, 24, 3)}`;

const butterfly = `${grass(84)}${sun(112, 8, 4.5)}<path d="M60 40 Q40 4 18 12 Q4 28 28 44 Q44 48 60 44Z"/><path d="M60 40 Q80 4 102 12 Q116 28 92 44 Q76 48 60 44Z"/><path d="M60 46 Q36 48 24 66 Q26 84 46 76 Q58 68 60 52Z"/><path d="M60 46 Q84 48 96 66 Q94 84 74 76 Q62 68 60 52Z"/>
${circ(34, 26, 7.5)}${circ(86, 26, 7.5)}${circ(38, 64, 5.5)}${circ(82, 64, 5.5)}${circ(24, 38, 2.6)}${circ(96, 38, 2.6)}${circ(46, 36, 2.6)}${circ(74, 36, 2.6)}<ellipse cx="60" cy="50" rx="4.5" ry="22"/>${circ(60, 26, 6)}${eye(58, 25, 1.8)}${eye(62, 25, 1.8)}${open('M58 21 Q52 7 46 7 M62 21 Q68 7 74 7')}${circ(46, 7, 2)}${circ(74, 7, 2)}
${open('M10 84 V72')}${flower(10, 70)}${open('M110 84 V74')}${flower(110, 72)}${open('M22 84 V76')}${flower(22, 74)}${open('M98 84 V76')}${flower(98, 74)}`;

const petals = Array.from({ length: 8 }, (_, i) => circ((60 + 17 * Math.cos((i * Math.PI) / 4)).toFixed(1), (28 + 17 * Math.sin((i * Math.PI) / 4)).toFixed(1), 10)).join('');
const bigFlower = `${grass(84)}${sun(104, 12, 6)}${cloud(2, 12)}<path d="M58 40 H62 V90 H58Z"/><path d="M62 70 Q86 56 96 64 Q86 82 62 76Z"/><path d="M58 64 Q34 50 24 58 Q34 76 58 70Z"/>${petals}${circ(60, 28, 11)}${eye(55, 26, 3)}${eye(65, 26, 3)}${blush(51, 33)}${blush(69, 33)}${open('M56 33 Q60 37 64 33')}
<path d="M42 90 L45 76 H75 L78 90Z"/><rect x="41" y="72" width="38" height="6" rx="2"/>${bird(86, 30)}${bird(96, 38)}`;

const house = `${cloud(2, 12)}${sun(106, 34, 5)}<rect x="78" y="14" width="10" height="20"/>${open('M80 8 Q84 4 82 0 M86 8 Q90 4 88 0')}<rect x="26" y="40" width="68" height="46"/><path d="M18 42 L60 10 L102 42Z"/>${circ(60, 28, 6.5)}${open('M60 21.5 V34.5 M53.5 28 H66.5')}
<path d="M52 86 V62 Q52 56 60 56 Q68 56 68 62 V86Z"/>${circ(65, 72, 1.5)}<rect x="31" y="50" width="14" height="14"/>${open('M38 50 V64 M31 57 H45')}<rect x="75" y="50" width="14" height="14"/>${open('M82 50 V64 M75 57 H89')}
${grass(86)}<path d="M54 86 L48 90 H72 L66 86Z"/>${[2, 8, 14, 20].map((x) => `<path d="M${x} 86 V76 L${x + 2} 73 L${x + 4} 76 V86Z"/>`).join('')}${[100, 106, 112].map((x) => `<path d="M${x} 86 V76 L${x + 2} 73 L${x + 4} 76 V86Z"/>`).join('')}
${open('M38 85 V79')}${flower(38, 77)}${open('M82 85 V79')}${flower(82, 77)}`;

const tree = `${cloud(2, 12)}${sun(104, 14, 6)}${bird(60, 6)}<path d="M54 90 L56 52 H64 L66 90Z"/>${open('M56 72 L47 63 M64 68 L73 59')}<path d="M40 62 Q22 62 26 46 Q18 32 38 28 Q40 8 62 12 Q82 8 86 28 Q102 32 94 46 Q100 62 80 62Z"/>
${circ(48, 36, 4.5)}${circ(70, 30, 4.5)}${circ(76, 48, 4.5)}${circ(54, 50, 4.5)}${circ(35, 49, 4.5)}${grass(84)}${open('M14 84 V76')}${flower(14, 74)}${open('M104 84 V76')}${flower(104, 74)}${open('M26 84 V78')}${flower(26, 76)}${open('M92 84 V78')}${flower(92, 76)}`;

const rays = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  const p = (r, d) => `${(52 + r * Math.cos(a + d)).toFixed(1)},${(36 + r * Math.sin(a + d)).toFixed(1)}`;
  return `<polygon points="${p(21, -0.17)} ${p(31, 0)} ${p(21, 0.17)}"/>`;
}).join('');
const sunScene = `<path d="M0 90 Q30 66 60 80 T120 76 V90Z"/>${rays}${circ(52, 36, 17)}<rect x="38" y="30" width="12" height="9" rx="3.5" fill="${K}"/><rect x="54" y="30" width="12" height="9" rx="3.5" fill="${K}"/>${open('M50 34 H54')}${open('M44 44 Q52 51 60 44')}${blush(40, 42)}${blush(64, 42)}
<path d="M64 82 Q50 82 52 72 Q50 60 66 62 Q70 48 86 54 Q100 50 102 64 Q114 66 108 78 Q106 84 96 82Z"/>${open('M66 72 Q72 68 76 72 M82 66 Q88 62 92 68')}${bird(100, 18)}${bird(10, 50)}${heart(14, 20, 4)}`;

const car = `${cloud(80, 12)}${cloud(6, 28)}${sun(54, 12, 6)}<path d="M0 76 H120 V90 H0Z"/>${open('M6 83 H22 M36 83 H52 M66 83 H82 M96 83 H112')}
<path d="M10 62 V52 Q10 46 18 44 L34 40 Q40 28 52 26 H74 Q86 28 94 42 L104 46 Q110 50 110 58 V62 Q110 66 104 66 H16 Q10 66 10 62Z"/><path d="M42 40 Q46 32 54 32 H60 V42Z"/><path d="M66 32 H74 Q82 34 86 42 H66Z"/>${open('M63 42 V62')}${open('M56 52 H60')}
${circ(105, 55, 3.6)}${circ(14, 55, 3)}${circ(34, 66, 10.5)}${circ(34, 66, 4.5)}${circ(88, 66, 10.5)}${circ(88, 66, 4.5)}`;

const rocket = `${star(14, 14, 6.5)}${star(104, 18, 5.5)}${star(100, 50, 4.5)}${star(18, 44, 4.5)}${star(32, 8, 3.5)}<path d="M38 50 L22 70 L22 84 L38 68Z"/><path d="M82 50 L98 70 L98 84 L82 68Z"/><path d="M48 68 Q60 92 72 68Z"/><path d="M54 68 Q60 80 66 68Z"/>
<path d="M60 4 Q84 24 84 54 L84 68 H36 V54 Q36 24 60 4Z"/>${open('M36 56 H84')}${circ(60, 32, 10.5)}${circ(60, 32, 6.5)}${cloud(10, 78)}${cloud(80, 80)}${circ(106, 72, 8)}${open('M96 74 Q106 66 116 70')}${circ(14, 66, 5)}${circ(50, 46, 2.6)}${circ(70, 46, 2.6)}`;

const iceCream = `${cloud(2, 12)}${cloud(86, 12)}<path d="M40 44 L60 88 L80 44Z"/>${open('M46 56 L74 56 M51 68 L69 68 M45 48 L68 82 M75 48 L52 82')}
<path d="M34 46 Q30 28 48 27 Q60 20 72 27 Q90 28 86 46 Q80 53 74 46 Q67 54 60 46 Q53 54 46 46 Q40 53 34 46Z"/><path d="M42 30 Q40 14 54 12 Q60 6 68 12 Q80 14 78 30Z"/>${circ(60, 5, 5)}${open('M60 0 Q66 -3 70 0')}
${circ(50, 22, 1.8)}${circ(62, 18, 1.8)}${circ(70, 24, 1.8)}${circ(40, 38, 1.8)}${circ(80, 38, 1.8)}${eye(52, 40, 3.8)}${eye(68, 40, 3.8)}${open('M55 46 Q60 50 65 46')}${star(14, 36, 7)}${star(106, 36, 6)}${heart(100, 70, 5)}${heart(18, 66, 4)}`;

const balloons = `${open('M0 8 Q60 24 120 8')}${[0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.92].map((t) => {
  const x = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * 60 + t * t * 120;
  const y = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * 24 + t * t * 8;
  return `<path d="M${(x - 3.5).toFixed(1)} ${y.toFixed(1)} L${(x + 3.5).toFixed(1)} ${y.toFixed(1)} L${x.toFixed(1)} ${(y + 7).toFixed(1)}Z"/>`;
}).join('')}
${open('M36 62 Q28 74 40 82')}${open('M62 58 Q70 72 58 84')}${open('M88 60 Q82 74 92 84')}
<ellipse cx="36" cy="40" rx="15" ry="19"/><path d="M36 59 L32 64 H40Z"/>${ell(30, 32, 2.5, 5, 20)}<ellipse cx="62" cy="36" rx="15" ry="19"/><path d="M62 55 L58 60 H66Z"/>${ell(56, 28, 2.5, 5, 20)}<ellipse cx="88" cy="40" rx="15" ry="19"/><path d="M88 59 L84 64 H92Z"/>${ell(82, 32, 2.5, 5, 20)}
${star(36, 40, 6.5)}${heart(62, 36, 6)}${circ(88, 40, 6)}${grass(86)}<rect x="46" y="76" width="26" height="12"/>${open('M59 76 V88 M46 82 H72')}<path d="M59 76 Q52 68 56 72 Q59 74 59 76 Q62 74 62 72 Q66 68 59 76Z"/>${star(10, 34, 4)}${star(110, 32, 4)}${circ(14, 60, 2.4)}${circ(108, 58, 2.4)}`;

const boat = `${sun(104, 16, 7)}${cloud(2, 12)}${bird(76, 6)}${bird(88, 28)}<path d="M26 14 L26 58 H74Z"/><path d="M62 24 V58 H92Z"/><rect x="57" y="10" width="3.4" height="52"/><path d="M60 10 L74 15 L60 20Z"/><path d="M22 60 H102 L92 78 H32Z"/>${circ(44, 69, 3.8)}${circ(62, 69, 3.8)}${circ(80, 69, 3.8)}
<path d="M0 80 Q6 74 12 80 T24 80 T36 80 T48 80 T60 80 T72 80 T84 80 T96 80 T108 80 T120 80 V90 H0Z"/>`;

const snail = `${sun(104, 14, 6)}${cloud(4, 12)}<path d="M10 76 Q10 66 22 66 H96 Q108 66 108 76 Q108 83 100 83 H18 Q10 83 10 76Z"/><path d="M92 70 Q96 50 100 44 Q106 38 108 48 Q109 60 108 70Z"/>${open('M99 44 Q96 32 92 30 M105 42 Q108 30 112 28')}${circ(92, 30, 2.8)}${circ(112, 28, 2.8)}${eye(103, 52, 3.2)}${blush(105, 60)}${open('M99 63 Q103 66 107 62')}
${circ(54, 46, 27)}${circ(54, 46, 20)}${circ(54, 46, 13)}${circ(54, 46, 6)}${grass(86)}${flower(14, 80)}${flower(26, 82)}${flower(112, 80)}${flower(100, 82)}`;

const band = (r) => `<path d="M${60 - r} 78 A${r} ${r} 0 0 1 ${60 + r} 78 L${60 + r - 8} 78 A${r - 8} ${r - 8} 0 0 0 ${68 - r} 78Z"/>`;
const rainbow = `${sun(12, 14, 7)}${band(52)}${band(44)}${band(36)}${band(28)}${band(20)}<path d="M4 82 Q0 82 2 76 Q4 68 14 70 Q18 60 30 66 Q40 64 42 74 Q50 76 48 82Z"/><path d="M116 82 Q120 82 118 76 Q116 68 106 70 Q102 60 90 66 Q80 64 78 74 Q70 76 72 82Z"/>${eye(18, 74, 2.4)}${eye(28, 74, 2.4)}${open('M20 79 Q23 82 26 79')}${bird(86, 8)}${heart(100, 20, 5)}${grass(86)}${flower(60, 82)}${flower(70, 84)}`;

const robot = `${star(12, 14, 5)}${star(108, 14, 5)}${open('M60 8 V2')}${circ(60, 2.5, 2.6)}<rect x="32" y="16" width="6" height="14" rx="2"/><rect x="82" y="16" width="6" height="14" rx="2"/><rect x="38" y="8" width="44" height="30" rx="7"/>${eye(50, 22, 6.5)}${eye(70, 22, 6.5)}<rect x="48" y="30" width="24" height="5.5" rx="1"/>${open('M54 30 V35.5 M60 30 V35.5 M66 30 V35.5')}
<rect x="54" y="38" width="12" height="6"/><rect x="34" y="44" width="52" height="30" rx="5"/><rect x="42" y="50" width="22" height="14" rx="2"/>${heart(53, 56, 4)}${circ(72, 54, 3.2)}${circ(80, 54, 3.2)}${circ(72, 64, 3.2)}${circ(80, 64, 3.2)}
<rect x="18" y="46" width="14" height="26" rx="6"/><rect x="88" y="46" width="14" height="26" rx="6"/>${circ(25, 77, 5.5)}${circ(95, 77, 5.5)}<rect x="42" y="74" width="12" height="12"/><rect x="66" y="74" width="12" height="12"/><rect x="38" y="84" width="20" height="5.5" rx="2"/><rect x="62" y="84" width="20" height="5.5" rx="2"/>${circ(104, 30, 7)}${circ(104, 30, 3)}${circ(14, 36, 5)}${circ(14, 36, 2)}`;

const owl = `${circ(100, 14, 8)}${star(14, 12, 4)}${star(34, 6, 3)}${star(112, 40, 3.5)}${star(8, 36, 3)}<path d="M0 76 Q30 72 60 76 T120 74 V84 Q90 86 60 84 T0 84Z"/><path d="M96 70 Q108 60 118 64 Q108 72 96 70Z"/><path d="M2 70 Q12 60 24 64 Q14 72 2 70Z"/>
<path d="M30 28 L26 8 L44 20Z"/><path d="M90 28 L94 8 L76 20Z"/><ellipse cx="60" cy="48" rx="32" ry="36"/><ellipse cx="60" cy="58" rx="20" ry="24"/>${open('M48 56 Q52 60 56 56 M60 56 Q64 60 68 56 M52 66 Q56 70 60 66 M60 66 Q64 70 68 66 M56 76 Q60 80 64 76')}
<path d="M28 44 Q16 60 28 76 Q40 66 36 48Z"/><path d="M92 44 Q104 60 92 76 Q80 66 84 48Z"/><circle cx="44" cy="34" r="12"/><circle cx="76" cy="34" r="12"/>${eye(44, 34, 7)}${eye(76, 34, 7)}<path d="M54 42 L66 42 L60 52Z"/>${blush(34, 48)}${blush(86, 48)}
<ellipse cx="50" cy="84" rx="8" ry="3.5"/><ellipse cx="70" cy="84" rx="8" ry="3.5"/>`;

const castle = `${sun(104, 14, 6)}${cloud(4, 12)}${cloud(60, 12)}${grass(86)}<rect x="44" y="30" width="32" height="56"/><path d="M44 30 V24 H50 V28 H56 V24 H64 V28 H70 V24 H76 V30Z"/>
<rect x="14" y="40" width="22" height="46"/><path d="M10 42 L25 18 L40 42Z"/><rect x="84" y="40" width="22" height="46"/><path d="M80 42 L95 18 L110 42Z"/>${open('M25 18 V8')}<path d="M25 8 L35 11 L25 14Z"/>${open('M95 18 V8')}<path d="M95 8 L85 11 L95 14Z"/>
<path d="M52 86 V68 Q52 60 60 60 Q68 60 68 68 V86Z"/>${open('M60 60 V86 M52 70 H68 M52 78 H68')}<path d="M56 46 Q56 40 60 40 Q64 40 64 46 V52 H56Z"/><path d="M21 56 Q21 50 25 50 Q29 50 29 56 V62 H21Z"/><path d="M91 56 Q91 50 95 50 Q99 50 99 56 V62 H91Z"/>${open('M16 72 H34 M86 72 H104')}${flower(8, 82)}${flower(114, 82)}${bird(76, 8)}`;

const turtle = `${cloud(80, 12)}${sun(14, 14, 6)}<path d="M0 78 Q10 72 20 78 T40 78 T60 78 T80 78 T100 78 T120 78 V90 H0Z"/>${star(100, 82, 6)}${circ(14, 84, 3)}
<ellipse cx="38" cy="70" rx="7" ry="6"/><ellipse cx="82" cy="70" rx="7" ry="6"/><path d="M92 62 L106 68 L92 70Z"/><circle cx="24" cy="46" r="13"/>${eye(20, 44, 3.6)}${open('M17 52 Q22 56 28 52')}${blush(30, 50)}
<path d="M30 68 Q30 28 62 28 Q94 28 94 68Z"/><path d="M30 68 H94"/>${open('M62 28 V68')}<path d="M52 42 H72 L78 52 L72 62 H52 L46 52Z"/>${open('M46 52 L36 46 M78 52 L88 46 M52 62 L46 68 M72 62 L78 68 M52 42 L46 34 M72 42 L78 34')}${circ(62, 52, 3.5)}`;

const bear = `${heart(100, 20, 6)}${heart(18, 28, 4)}${cloud(4, 12)}${grass(86)}<circle cx="38" cy="26" r="9"/><circle cx="82" cy="26" r="9"/><circle cx="38" cy="26" r="4.5"/><circle cx="82" cy="26" r="4.5"/>
<ellipse cx="60" cy="66" rx="25" ry="22"/><ellipse cx="60" cy="68" rx="15" ry="15"/><ellipse cx="30" cy="62" rx="9" ry="14" transform="rotate(30 30 62)"/><ellipse cx="90" cy="62" rx="9" ry="14" transform="rotate(-30 90 62)"/>
<ellipse cx="42" cy="86" rx="11" ry="6"/><ellipse cx="78" cy="86" rx="11" ry="6"/>${circ(42, 86, 3.5)}${circ(78, 86, 3.5)}<circle cx="60" cy="38" r="24"/>
<ellipse cx="60" cy="46" rx="11" ry="8.5"/><ellipse cx="60" cy="42" rx="4.5" ry="3.2" fill="${K}"/>${open('M60 45 V49 M54 50 Q60 55 66 50')}${eye(49, 34, 4.5)}${eye(71, 34, 4.5)}${blush(42, 44)}${blush(78, 44)}
<path d="M60 60 L50 55 V65Z"/><path d="M60 60 L70 55 V65Z"/>${circ(60, 60, 2.6)}${circ(96, 40, 8)}${open('M96 48 Q92 62 84 66')}`;

// Lines that must meet an outline exactly (so the paint-bucket cannot leak) are clipped to that shape.
const clip = (id, shape, lines) => `<clipPath id="${id}">${shape.replace('<', '<')}</clipPath><g clip-path="url(#${id})">${lines}</g>`;

const bee = `${cloud(2, 12)}${sun(106, 14, 6)}${grass(86)}${open('M20 86 V72')}${flower(20, 70)}${open('M104 86 V68')}${flower(104, 66)}${open('M10 86 V78')}${flower(10, 76)}
<ellipse cx="38" cy="30" rx="12" ry="19" transform="rotate(-25 38 30)"/><ellipse cx="62" cy="28" rx="12" ry="19" transform="rotate(20 62 28)"/>
<path d="M20 56 L8 51 L8 61Z"/><ellipse cx="50" cy="56" rx="32" ry="22"/>${clip('beeb', '<ellipse cx="50" cy="56" rx="32" ry="22"/>', open('M34 20 V100 M45 20 V100 M57 20 V100 M68 20 V100'))}
<circle cx="86" cy="50" r="16"/>${eye(91, 46, 4)}${eye(80, 46, 4)}${blush(95, 56)}${blush(77, 56)}${open('M83 56 Q87 60 91 56')}${open('M80 35 Q75 24 69 23 M91 35 Q95 24 101 23')}${circ(69, 23, 2.6)}${circ(101, 23, 2.6)}`;

const ladybird = `${cloud(2, 12)}${sun(106, 14, 6)}${grass(86)}${ell(60, 78, 46, 9)}${open('M18 78 H102')}${flower(12, 80)}${flower(110, 82)}
<circle cx="60" cy="48" r="28"/>${clip('lbb', '<circle cx="60" cy="48" r="28"/>', open('M60 10 V100'))}${circ(45, 40, 5.5)}${circ(75, 40, 5.5)}${circ(44, 58, 5.5)}${circ(76, 58, 5.5)}${circ(60, 66, 4)}
${open('M34 38 L24 33 M33 50 L22 52 M36 62 L27 69 M86 38 L96 33 M87 50 L98 52 M84 62 L93 69')}<circle cx="60" cy="22" r="12"/>${eye(55, 21, 4)}${eye(65, 21, 4)}${blush(50, 27)}${blush(70, 27)}${open('M56 27 Q60 31 64 27')}${open('M54 12 Q50 3 44 3 M66 12 Q70 3 76 3')}${circ(44, 3, 2.4)}${circ(76, 3, 2.4)}`;

export const PAGES = [
  { id: 'cat', name: 'Cat', svg: svg(cat) },
  { id: 'dog', name: 'Dog', svg: svg(dog) },
  { id: 'fish', name: 'Fish', svg: svg(fish) },
  { id: 'butterfly', name: 'Butterfly', svg: svg(butterfly) },
  { id: 'flower', name: 'Flower', svg: svg(bigFlower) },
  { id: 'house', name: 'House', svg: svg(house) },
  { id: 'tree', name: 'Tree', svg: svg(tree) },
  { id: 'sun', name: 'Sun', svg: svg(sunScene) },
  { id: 'car', name: 'Car', svg: svg(car) },
  { id: 'rocket', name: 'Rocket', svg: svg(rocket) },
  { id: 'icecream', name: 'Ice cream', svg: svg(iceCream) },
  { id: 'balloons', name: 'Balloons', svg: svg(balloons) },
  { id: 'boat', name: 'Boat', svg: svg(boat) },
  { id: 'snail', name: 'Snail', svg: svg(snail) },
  { id: 'rainbow', name: 'Rainbow', svg: svg(rainbow) },
  { id: 'robot', name: 'Robot', svg: svg(robot) },
  { id: 'owl', name: 'Owl', svg: svg(owl) },
  { id: 'castle', name: 'Castle', svg: svg(castle) },
  { id: 'turtle', name: 'Turtle', svg: svg(turtle) },
  { id: 'bear', name: 'Teddy', svg: svg(bear) },
  { id: 'bee', name: 'Bee', svg: svg(bee) },
  { id: 'ladybird', name: 'Ladybird', svg: svg(ladybird) },
];
export const pageById = (id) => PAGES.find((p) => p.id === id);

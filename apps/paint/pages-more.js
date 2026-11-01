// More colouring-in pictures (same style as pages.js).
import { K, svg, circ, ell, dot, open, eye, blush, star, heart, cloud, grass, sun, bird, flower, clip } from './draw-kit.js';

const drop = (x, y) => `<path d="M${x} ${y} Q${x + 2.6} ${y + 4.4} ${x} ${y + 6} Q${x - 2.6} ${y + 4.4} ${x} ${y}Z"/>`;
const bat = (x, y) => `<path transform="translate(${x} ${y})" d="M0 0 Q4 -5 8 0 Q10 -3 12 0 Q14 -3 16 0 Q20 -5 24 0 Q18 7 12 3 Q6 7 0 0Z"/>`;

const penguin = `${star(14, 16, 4.5)}${star(104, 14, 5)}${star(100, 42, 3.5)}${star(16, 42, 3.5)}<path d="M0 78 Q15 70 30 78 T60 78 T90 78 T120 78 V90 H0Z"/>
<ellipse cx="33" cy="54" rx="7" ry="17" transform="rotate(14 33 54)"/><ellipse cx="87" cy="54" rx="7" ry="17" transform="rotate(-14 87 54)"/><ellipse cx="60" cy="50" rx="25" ry="33"/><ellipse cx="60" cy="58" rx="16" ry="23"/>
<path d="M36 46 Q60 58 84 46 L84 53 Q60 65 36 53Z"/><path d="M76 56 L84 74 L73 72 L71 58Z"/>${eye(51, 30, 4.8)}${eye(69, 30, 4.8)}<path d="M54 37 L66 37 L60 46Z"/>${blush(44, 38)}${blush(76, 38)}<ellipse cx="47" cy="84" rx="9" ry="3.8"/><ellipse cx="73" cy="84" rx="9" ry="3.8"/>`;

const frog = `${cloud(4, 12)}${sun(106, 14, 6)}<path d="M0 66 Q8 62 16 66 T32 66 T48 66 T64 66 T80 66 T96 66 T112 66 T128 66 V90 H0Z"/>${open('M0 74 Q8 70 16 74 T32 74 T48 74 T64 74 T80 74 T96 74 T112 74')}<ellipse cx="60" cy="76" rx="42" ry="10"/>${open('M60 76 L98 70')}
<ellipse cx="34" cy="66" rx="11" ry="7" transform="rotate(-20 34 66)"/><ellipse cx="86" cy="66" rx="11" ry="7" transform="rotate(20 86 66)"/><ellipse cx="60" cy="58" rx="24" ry="17"/><ellipse cx="60" cy="62" rx="15" ry="11"/><ellipse cx="44" cy="71" rx="8" ry="4"/><ellipse cx="76" cy="71" rx="8" ry="4"/>
${circ(46, 26, 9)}${circ(74, 26, 9)}<ellipse cx="60" cy="40" rx="25" ry="17"/>${eye(46, 26, 4.8)}${eye(74, 26, 4.8)}${open('M40 44 Q60 56 80 44')}${blush(41, 45)}${blush(79, 45)}${circ(57, 36, 1.2)}${circ(63, 36, 1.2)}${bird(88, 8)}`;

const duck = `${cloud(4, 12)}${cloud(84, 14)}${sun(60, 10, 5)}${open('M8 86 V62')}${ell(8, 58, 3, 7)}${open('M18 86 V68')}${ell(18, 64, 2.6, 6)}
<path d="M26 60 Q12 48 8 54 Q12 64 28 70Z"/>${ell(56, 66, 36, 20)}<circle cx="82" cy="36" r="17"/><path d="M96 32 Q114 33 110 42 Q104 47 95 42Z"/>${open('M97 38 Q104 38 109 38')}${eye(84, 30, 4.6)}${blush(76, 41)}
<path d="M34 66 Q50 54 70 68 Q54 80 34 66Z"/><path d="M0 80 Q6 74 12 80 T24 80 T36 80 T48 80 T60 80 T72 80 T84 80 T96 80 T108 80 T120 80 V90 H0Z"/>${circ(108, 68, 3)}${circ(112, 58, 2.2)}${circ(100, 72, 2)}`;

const pig = `${cloud(4, 12)}${sun(106, 14, 6)}${grass(84)}<path d="M34 86 Q30 62 50 60 L70 60 Q90 62 86 86Z"/>${open('M86 76 Q100 72 96 62 Q94 56 100 54 Q104 58 98 60')}<ellipse cx="46" cy="87" rx="8" ry="3.5"/><ellipse cx="74" cy="87" rx="8" ry="3.5"/>
<path d="M32 30 Q22 18 30 10 Q40 14 44 24Z"/><path d="M88 30 Q98 18 90 10 Q80 14 76 24Z"/><circle cx="60" cy="40" r="27"/><ellipse cx="60" cy="50" rx="13" ry="10"/><ellipse cx="55" cy="50" rx="2.4" ry="3.6" fill="${K}"/><ellipse cx="65" cy="50" rx="2.4" ry="3.6" fill="${K}"/>${eye(47, 34, 5)}${eye(73, 34, 5)}${blush(38, 46)}${blush(82, 46)}${open('M52 58 Q60 62 68 58')}${heart(100, 40, 4)}`;

const rabbit = `${cloud(4, 12)}${sun(106, 14, 6)}${grass(84)}${open('M14 84 V78')}${flower(14, 76)}${open('M106 84 V80')}${flower(106, 78)}
<ellipse cx="46" cy="22" rx="8" ry="20" transform="rotate(-10 46 22)"/><ellipse cx="74" cy="22" rx="8" ry="20" transform="rotate(10 74 22)"/><ellipse cx="46" cy="24" rx="4" ry="14" transform="rotate(-10 46 24)"/><ellipse cx="74" cy="24" rx="4" ry="14" transform="rotate(10 74 24)"/>
<ellipse cx="60" cy="70" rx="22" ry="17"/><ellipse cx="60" cy="74" rx="12" ry="11"/><circle cx="60" cy="46" r="20"/>${eye(52, 43, 4.2)}${eye(68, 43, 4.2)}<path d="M57 50 L63 50 L60 54Z"/>${open('M60 54 V57 M55 58 Q60 61 65 58')}${blush(46, 52)}${blush(74, 52)}${open('M36 50 L46 51 M36 55 L46 54 M84 50 L74 51 M84 55 L74 54')}<ellipse cx="46" cy="86" rx="8" ry="3.5"/><ellipse cx="74" cy="86" rx="8" ry="3.5"/>
<path d="M96 62 Q94 54 90 53 Q93 58 95 62Z"/><path d="M100 62 Q100 52 104 50 Q104 57 102 62Z"/><path d="M92 64 Q100 60 108 64 Q104 76 100 88 Q96 76 92 64Z"/>${open('M96 70 H102 M97 77 H101')}`;

const sheep = `${cloud(4, 12)}${sun(106, 14, 6)}${grass(84)}<rect x="30" y="64" width="6" height="20" rx="2"/><rect x="44" y="66" width="6" height="18" rx="2"/><rect x="66" y="66" width="6" height="18" rx="2"/><rect x="80" y="64" width="6" height="20" rx="2"/>
<path d="M24 52 Q14 50 18 40 Q20 30 30 34 Q32 24 44 28 Q52 20 62 28 Q74 24 78 36 Q90 36 88 48 Q94 58 82 62 Q80 72 68 68 Q58 76 48 68 Q36 74 30 64 Q20 66 24 52Z"/>
<path d="M82 38 Q78 28 88 28 Q94 24 100 32 Q106 36 102 42Z"/><ellipse cx="96" cy="54" rx="11" ry="14"/>${ell(86, 44, 6, 3, -25)}${ell(106, 44, 6, 3, 25)}${eye(92, 50, 3.4)}${eye(101, 50, 3.4)}<ellipse cx="96" cy="60" rx="4" ry="3" fill="${K}"/>${open('M92 64 Q96 67 100 64')}${blush(88, 58)}${blush(104, 58)}${heart(16, 24, 4)}`;

const mane = Array.from({ length: 14 }, (_, i) => {
  const a = (i * 2 * Math.PI) / 14;
  return circ((60 + 27 * Math.cos(a)).toFixed(1), (44 + 27 * Math.sin(a)).toFixed(1), 9);
}).join('');
const lion = `${cloud(4, 12)}${sun(108, 12, 5)}${grass(84)}<path d="M36 88 Q36 70 60 70 Q84 70 84 88Z"/>${mane}${circ(42, 28, 6)}${circ(78, 28, 6)}<circle cx="60" cy="44" r="22"/><ellipse cx="60" cy="52" rx="10" ry="7"/>
${eye(50, 40, 4.4)}${eye(70, 40, 4.4)}<path d="M56 48 L64 48 L60 53Z" fill="${K}"/>${open('M60 53 V56 M54 57 Q60 60 66 57')}${blush(44, 50)}${blush(76, 50)}${circ(54, 52, 0.9)}${circ(66, 52, 0.9)}<ellipse cx="46" cy="88" rx="8" ry="3.5"/><ellipse cx="74" cy="88" rx="8" ry="3.5"/>`;

const elephant = `${cloud(4, 12)}${sun(106, 14, 6)}${grass(84)}<ellipse cx="60" cy="66" rx="30" ry="20"/><rect x="36" y="74" width="12" height="12" rx="4"/><rect x="72" y="74" width="12" height="12" rx="4"/>${open('M90 62 Q100 64 100 72')}
<ellipse cx="30" cy="40" rx="14" ry="18"/><ellipse cx="90" cy="40" rx="14" ry="18"/><ellipse cx="30" cy="40" rx="8" ry="12"/><ellipse cx="90" cy="40" rx="8" ry="12"/><circle cx="60" cy="40" r="22"/>
<path d="M52 50 Q60 46 68 50 Q68 62 60 70 Q54 76 46 74 Q43 72 46 70 Q52 66 52 58Z"/>${eye(50, 34, 4.6)}${eye(70, 34, 4.6)}${blush(44, 44)}${blush(76, 44)}${heart(100, 20, 4)}`;

const dino = `${cloud(4, 12)}${sun(106, 14, 6)}${grass(84)}${[36, 46, 56, 66, 76].map((x, i) => `<path d="M${x - 5} ${48 - Math.abs(i - 2) * 2} L${x} ${26 + Math.abs(i - 2) * 3} L${x + 5} ${48 - Math.abs(i - 2) * 2}Z"/>`).join('')}
<path d="M30 60 Q14 56 6 72 Q22 68 30 68Z"/><ellipse cx="58" cy="60" rx="32" ry="17"/><ellipse cx="86" cy="52" rx="12" ry="8" transform="rotate(-40 86 52)"/><circle cx="96" cy="42" r="12"/>
<rect x="38" y="68" width="10" height="16" rx="4"/><rect x="50" y="70" width="10" height="14" rx="4"/><rect x="66" y="70" width="10" height="14" rx="4"/><rect x="78" y="68" width="10" height="16" rx="4"/>${eye(98, 39, 3.8)}${open('M92 47 Q98 51 104 46')}${blush(102, 46)}${circ(50, 58, 4)}${circ(66, 62, 3.4)}${open('M16 66 L10 60 M22 65 L18 58')}${flower(14, 80)}`;

const train = `${cloud(10, 10)}${cloud(34, 6)}${cloud(62, 14)}<path d="M0 80 H120 V90 H0Z"/>${open('M0 85 H120 M8 80 V90 M24 80 V90 M40 80 V90 M56 80 V90 M72 80 V90 M88 80 V90 M104 80 V90')}
<rect x="14" y="46" width="46" height="24" rx="6"/><path d="M20 46 V34 H32 V46Z"/><path d="M17 34 H35 L32 29 H20Z"/><path d="M40 46 Q45 37 50 46Z"/><rect x="60" y="36" width="28" height="34" rx="3"/><rect x="58" y="31" width="32" height="6" rx="2"/><rect x="66" y="42" width="14" height="12" rx="2"/><path d="M14 70 L4 78 H18Z"/>
<rect x="92" y="52" width="26" height="18" rx="3"/>${open('M88 62 H92')}${circ(26, 72, 8)}${circ(26, 72, 3)}${circ(46, 72, 8)}${circ(46, 72, 3)}${circ(76, 72, 9)}${circ(76, 72, 3.5)}${circ(100, 74, 6)}${circ(112, 74, 6)}${eye(24, 56, 4.4)}${open('M32 62 Q40 66 48 62')}${blush(20, 63)}`;

const plane = `${cloud(2, 14)}${cloud(86, 56)}${cloud(4, 66)}${sun(104, 14, 6)}<path d="M26 44 L12 22 L36 38Z"/><path d="M24 50 L10 56 L34 54Z"/><path d="M52 52 L36 78 L54 78 L74 54Z"/>
<ellipse cx="58" cy="50" rx="38" ry="12"/>${open('M22 50 H96')}<path d="M80 44 Q92 40 94 48 Q88 52 80 50Z"/>${circ(36, 47, 3)}${circ(46, 46, 3)}${circ(56, 46, 3)}${circ(66, 46, 3)}<ellipse cx="97" cy="50" rx="2.4" ry="11"/>${circ(97, 50, 3.4)}${open('M50 62 V70')}${circ(50, 73, 4.5)}${bird(34, 12)}`;

const balloon = `${cloud(4, 12)}${cloud(88, 50)}${sun(106, 12, 5)}${bird(8, 50)}${bird(20, 60)}${open('M42 62 L48 76 M78 62 L72 76')}
<path d="M60 4 Q92 4 92 34 Q92 50 76 62 H44 Q28 50 28 34 Q28 4 60 4Z"/>${clip('hab', '<path d="M60 4 Q92 4 92 34 Q92 50 76 62 H44 Q28 50 28 34 Q28 4 60 4Z"/>', open('M44 0 Q36 30 46 66 M60 0 V66 M76 0 Q84 30 74 66'))}${heart(60, 30, 6)}<rect x="46" y="76" width="28" height="14" rx="3"/>${open('M46 82 H74')}`;

const lighthouse = `${cloud(4, 12)}${bird(88, 28)}${bird(100, 36)}<path d="M50 20 L14 8 V32Z"/><path d="M70 20 L106 8 V32Z"/>
<path d="M0 78 Q10 72 20 78 T40 78 T60 78 T80 78 T100 78 T120 78 V90 H0Z"/><path d="M26 90 Q38 72 60 76 Q82 72 94 90Z"/><path d="M48 76 L52 30 H68 L72 76Z"/>${clip('lh', '<path d="M48 76 L52 30 H68 L72 76Z"/>', open('M40 40 H80 M40 52 H80 M40 64 H80'))}
<rect x="48" y="25" width="24" height="5"/><rect x="53" y="14" width="14" height="11"/><path d="M50 14 L60 4 L70 14Z"/><path d="M56 76 V68 Q60 63 64 68 V76Z"/><rect x="57" y="36" width="6" height="6"/>${circ(60, 20, 2.5)}${circ(112, 80, 2)}`;

const windmill = `${cloud(2, 12)}${sun(106, 12, 5)}<path d="M0 90 Q40 66 80 82 T120 78 V90Z"/>
${[20, 110, 200, 290].map((a) => `<g transform="rotate(${a} 60 34)"><rect x="57.5" y="2" width="5" height="30"/><rect x="62.5" y="4" width="9" height="22"/>${open('M62.5 10 H71.5 M62.5 16 H71.5 M62.5 22 H71.5')}</g>`).join('')}
<path d="M44 86 L50 38 H70 L76 86Z"/><path d="M46 38 Q60 22 74 38Z"/>${circ(60, 34, 4)}<path d="M54 86 V74 Q60 68 66 74 V86Z"/>${circ(60, 54, 4)}${open('M48 70 L72 70')}${flower(14, 80)}${flower(104, 82)}${flower(24, 84)}`;

const tent = `${star(14, 14, 4)}${star(100, 10, 4)}${star(66, 8, 3)}${circ(104, 26, 8)}${circ(101, 24, 1.6)}${grass(84)}
<path d="M8 84 L18 56 L28 84Z"/><path d="M8 70 L18 46 L28 70Z"/><path d="M12 56 L18 38 L24 56Z"/>
<path d="M20 84 L56 26 L92 84Z"/><path d="M56 40 L42 84 H70Z"/>${open('M56 26 V40')}<path d="M56 26 V16 L68 20 L56 24"/>
<path d="M84 84 L102 79 M84 79 L102 84" fill="none"/><rect x="82" y="80" width="22" height="5" rx="2" transform="rotate(-12 93 82)"/><rect x="82" y="80" width="22" height="5" rx="2" transform="rotate(12 93 82)"/>
<path d="M93 80 Q85 70 92 60 Q92 69 96 65 Q103 72 93 80Z"/><path d="M93 78 Q89 72 93 68 Q95 73 93 78Z"/>${star(110, 56, 2.5)}${star(86, 56, 2.5)}`;

const cupcake = `${heart(18, 30, 6)}${heart(102, 26, 5)}${star(104, 56, 5)}${star(16, 56, 4)}${cloud(2, 12)}<path d="M30 52 L36 86 H84 L90 52Z"/>${clip('cc', '<path d="M30 52 L36 86 H84 L90 52Z"/>', open('M46 48 L48 90 M74 48 L72 90'))}
${ell(60, 50, 34, 9)}${ell(60, 40, 26, 9)}${ell(60, 30, 18, 8)}<path d="M52 24 Q60 6 68 24Z"/>${circ(60, 8, 5)}${open('M60 3 Q64 -1 68 1')}${circ(44, 40, 1.8)}${circ(76, 40, 1.8)}${circ(52, 30, 1.6)}${circ(68, 30, 1.6)}
${eye(53, 66, 3.4)}${eye(67, 66, 3.4)}${open('M55 74 Q60 78 65 74')}${blush(46, 72)}${blush(74, 72)}`;

const snowman = `${star(14, 14, 4)}${star(104, 16, 5)}${star(108, 64, 3)}${star(12, 64, 3)}<path d="M0 80 Q20 72 40 80 T80 80 T120 80 V90 H0Z"/>${open('M40 56 L20 44 M20 44 L14 38 M20 44 L14 48 M80 56 L100 44 M100 44 L106 38 M100 44 L106 48')}
<circle cx="60" cy="68" r="20"/><circle cx="60" cy="40" r="14"/><rect x="48" y="14" width="24" height="12" rx="2"/><ellipse cx="60" cy="27" rx="16" ry="3.5"/><rect x="48" y="21" width="24" height="4"/>${dot(54, 37, 1.9)}${dot(66, 37, 1.9)}<path d="M60 41 L74 44 L60 46Z"/>${open('M52 47 Q60 53 68 47')}
<path d="M47 50 Q60 58 73 50 L73 56 Q60 64 47 56Z"/><path d="M68 58 L74 76 L63 74Z"/>${dot(60, 66, 2)}${dot(60, 73, 2)}${dot(60, 80, 2)}`;

const xmasTree = `${star(14, 14, 4)}${star(104, 18, 5)}${star(100, 46, 3)}${star(14, 44, 3)}<path d="M0 82 Q20 74 40 82 T80 82 T120 82 V90 H0Z"/><rect x="54" y="76" width="12" height="10"/>
<path d="M60 38 L28 76 H92Z"/><path d="M60 22 L34 54 H86Z"/><path d="M60 8 L40 34 H80Z"/>${star(60, 6, 6)}${circ(50, 62, 3.6)}${circ(72, 66, 3.6)}${circ(60, 50, 3.6)}${circ(44, 46, 3.6)}${circ(76, 46, 3.6)}${circ(60, 28, 3)}${circ(54, 70, 3)}
${open('M40 54 Q60 62 80 54 M34 72 Q60 82 86 72')}<rect x="10" y="70" width="22" height="16"/>${open('M21 70 V86 M10 78 H32')}<rect x="88" y="74" width="20" height="12"/>${open('M98 74 V86 M88 80 H108')}`;

const pumpkin = `${circ(104, 20, 9)}${circ(101, 17, 1.8)}${circ(107, 23, 1.4)}${bat(10, 14)}${bat(78, 8)}${star(40, 10, 3)}${star(20, 36, 3)}${grass(86)}
${ell(60, 60, 36, 26)}${clip('pk', '<ellipse cx="60" cy="60" rx="36" ry="26"/>', open('M60 30 Q8 60 60 94 M60 30 Q112 60 60 94'))}
<path d="M56 38 Q56 24 62 22 L67 24 Q62 28 64 38Z"/><path d="M66 28 Q82 20 86 32 Q74 34 66 28Z"/>${open('M84 32 Q92 38 88 44 Q84 42 86 38')}
<path d="M42 56 L54 56 L48 44Z"/><path d="M66 56 L78 56 L72 44Z"/><path d="M57 62 L63 62 L60 57Z"/><path d="M40 68 L47 76 L54 69 L60 76 L66 69 L73 76 L80 68 L76 80 Q60 86 44 80Z"/>`;

const umbrella = `${cloud(2, 8)}${cloud(86, 10)}${drop(16, 34)}${drop(28, 44)}${drop(10, 54)}${drop(104, 34)}${drop(92, 44)}${drop(110, 54)}${drop(20, 66)}${drop(100, 66)}
<path d="M12 46 Q12 12 60 12 Q108 12 108 46 Q99 40 90 46 Q80 40 70 46 Q60 40 50 46 Q40 40 30 46 Q21 40 12 46Z"/>${clip('umb', '<path d="M12 46 Q12 12 60 12 Q108 12 108 46 Q99 40 90 46 Q80 40 70 46 Q60 40 50 46 Q40 40 30 46 Q21 40 12 46Z"/>', open('M60 10 L30 50 M60 10 L50 50 M60 10 L70 50 M60 10 L90 50'))}
<path d="M58.5 46 H61.5 V70 Q61.5 78 52 78 Q46 77 46 72 H49 Q49 74 52 75 Q58.5 75 58.5 70Z"/>${circ(60, 9, 2.4)}<ellipse cx="60" cy="84" rx="34" ry="5"/>${open('M44 84 Q60 80 76 84')}${circ(40, 82, 2)}${circ(80, 82, 2)}`;

export const MORE = [
  { id: 'penguin', name: 'Penguin', svg: svg(penguin) },
  { id: 'frog', name: 'Frog', svg: svg(frog) },
  { id: 'duck', name: 'Duck', svg: svg(duck) },
  { id: 'pig', name: 'Pig', svg: svg(pig) },
  { id: 'rabbit', name: 'Rabbit', svg: svg(rabbit) },
  { id: 'sheep', name: 'Sheep', svg: svg(sheep) },
  { id: 'lion', name: 'Lion', svg: svg(lion) },
  { id: 'elephant', name: 'Elephant', svg: svg(elephant) },
  { id: 'dino', name: 'Dinosaur', svg: svg(dino) },
  { id: 'train', name: 'Train', svg: svg(train) },
  { id: 'plane', name: 'Aeroplane', svg: svg(plane) },
  { id: 'hotair', name: 'Hot air balloon', svg: svg(balloon) },
  { id: 'lighthouse', name: 'Lighthouse', svg: svg(lighthouse) },
  { id: 'windmill', name: 'Windmill', svg: svg(windmill) },
  { id: 'tent', name: 'Camping', svg: svg(tent) },
  { id: 'cupcake', name: 'Cupcake', svg: svg(cupcake) },
  { id: 'snowman', name: 'Snowman', svg: svg(snowman) },
  { id: 'xmastree', name: 'Christmas tree', svg: svg(xmasTree) },
  { id: 'pumpkin', name: 'Pumpkin', svg: svg(pumpkin) },
  { id: 'umbrella', name: 'Umbrella', svg: svg(umbrella) },
];

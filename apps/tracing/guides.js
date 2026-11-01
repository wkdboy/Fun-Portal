// Draws the tracing sheet behind the ink: handwriting lines, then the typed text getting fainter row by row.
// Row 1 is easiest to trace (shaded letters with a dashed edge); the last row is blank for writing it alone.
const FONT = 'Andika';

export async function drawGuides(canvas, text, rows, dpr) {
  await document.fonts.load(`100px ${FONT}`);
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.setLineDash([]);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  const rowH = H / rows;

  for (let r = 0; r < rows; r++) {
    const y0 = r * rowH;
    const top = y0 + rowH * 0.16;
    const base = y0 + rowH * 0.7;
    let size = (base - top) / 0.72; // capital/ascender height is about 0.72 of the font size
    const mid = base - size * 0.5; // x-height

    ctx.lineWidth = 2 * dpr;
    ctx.strokeStyle = '#a9d6ff';
    ctx.setLineDash([]);
    line(ctx, 0, top, W, top);
    ctx.setLineDash([10 * dpr, 8 * dpr]);
    line(ctx, 0, mid, W, mid);
    ctx.setLineDash([]);
    ctx.strokeStyle = '#ffa6b3';
    ctx.lineWidth = 3 * dpr;
    line(ctx, 0, base, W, base);

    if (!text || r === rows - 1) continue; // last row stays blank
    const margin = W * 0.04;
    ctx.font = `${size}px ${FONT}`;
    ctx.letterSpacing = `${size * 0.06}px`;
    const w = ctx.measureText(text).width;
    if (w > W - 2 * margin) {
      size *= (W - 2 * margin) / w;
      ctx.font = `${size}px ${FONT}`;
      ctx.letterSpacing = `${size * 0.06}px`;
    }
    ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Repeat the word along the row so there is plenty to trace.
    const w1 = ctx.measureText(text).width;
    const gap = size * 0.9;
    const copies = Math.max(1, Math.min(8, Math.floor((W - 2 * margin + gap) / (w1 + gap))));
    const xs = Array.from({ length: copies }, (_, k) => margin + k * (w1 + gap));
    if (r === 0) {
      ctx.fillStyle = '#e6e0ff';
      xs.forEach((x) => ctx.fillText(text, x, base));
      ctx.strokeStyle = '#6c4cf1';
      ctx.lineWidth = 2.5 * dpr;
      ctx.setLineDash([9 * dpr, 7 * dpr]);
    } else if (r === 1) {
      ctx.strokeStyle = '#8f7df5';
      ctx.lineWidth = 2.5 * dpr;
      ctx.setLineDash([9 * dpr, 7 * dpr]);
    } else {
      ctx.strokeStyle = '#c4baf0';
      ctx.lineWidth = 3 * dpr;
      ctx.setLineDash([1, 9 * dpr]);
    }
    xs.forEach((x) => ctx.strokeText(text, x, base));
    ctx.setLineDash([]);
  }
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

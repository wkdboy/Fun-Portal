// Paint by numbers: split a colouring page into regions, give each a number, and draw the numbers.
export const NUM_COLOURS = ['#e63946', '#ff9f1c', '#ffd23f', '#2ec27e', '#6fd3ff', '#2f6bff', '#8e5cf6', '#ff5fa2'];
const MIN_RADIUS = 12; // smaller areas are coloured in for her, as a number would not fit

// alpha = outline strength per pixel (>= 200 is a wall). Returns { labels, regions }.
export function analyse(alpha, W, H) {
  const N = W * H;
  const labels = new Int32Array(N);
  const regions = [null]; // index = label
  const queue = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (labels[s] || alpha[s] >= 200) continue;
    const id = regions.length;
    let head = 0;
    let tail = 0;
    queue[tail++] = s;
    labels[s] = id;
    let minX = W, maxX = 0, minY = H, maxY = 0;
    while (head < tail) {
      const i = queue[head++];
      const x = i % W;
      const y = (i - x) / W;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (x > 0 && !labels[i - 1] && alpha[i - 1] < 200) { labels[i - 1] = id; queue[tail++] = i - 1; }
      if (x < W - 1 && !labels[i + 1] && alpha[i + 1] < 200) { labels[i + 1] = id; queue[tail++] = i + 1; }
      if (y > 0 && !labels[i - W] && alpha[i - W] < 200) { labels[i - W] = id; queue[tail++] = i - W; }
      if (y < H - 1 && !labels[i + W] && alpha[i + W] < 200) { labels[i + W] = id; queue[tail++] = i + W; }
    }
    regions.push({ id, area: tail, minX, maxX, minY, maxY, x: 0, y: 0, r: 0, num: 0, auto: false, nb: new Set() });
  }

  // Distance from the nearest line (chamfer 3-4); the deepest point of a region is where its number goes.
  const dist = new Uint16Array(N);
  for (let i = 0; i < N; i++) dist[i] = labels[i] ? 9999 : 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (!dist[i]) continue;
      let d = (x === 0 || y === 0) ? 3 : 9999;
      if (y > 0) {
        d = Math.min(d, dist[i - W] + 3);
        if (x > 0) d = Math.min(d, dist[i - W - 1] + 4);
        if (x < W - 1) d = Math.min(d, dist[i - W + 1] + 4);
      }
      if (x > 0) d = Math.min(d, dist[i - 1] + 3);
      dist[i] = d;
    }
  }
  for (let y = H - 1; y >= 0; y--) {
    for (let x = W - 1; x >= 0; x--) {
      const i = y * W + x;
      if (!dist[i]) continue;
      let d = dist[i];
      if (y === H - 1 || x === W - 1) d = Math.min(d, 3);
      if (y < H - 1) {
        d = Math.min(d, dist[i + W] + 3);
        if (x > 0) d = Math.min(d, dist[i + W - 1] + 4);
        if (x < W - 1) d = Math.min(d, dist[i + W + 1] + 4);
      }
      if (x < W - 1) d = Math.min(d, dist[i + 1] + 3);
      dist[i] = d;
      const r = regions[labels[i]];
      if (d > r.r) { r.r = d; r.x = x; r.y = y; }
    }
  }
  for (const r of regions) if (r) { r.r /= 3; r.auto = r.r < MIN_RADIUS; }

  // Neighbours: look across a line (up to 16 px wide) for the next region.
  const link = (a, b) => { if (a !== b) { regions[a].nb.add(b); regions[b].nb.add(a); } };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W - 1; x++) {
      const i = y * W + x;
      const a = labels[i];
      if (!a || labels[i + 1]) continue;
      for (let k = 2; k <= 16 && x + k < W; k++) { const b = labels[i + k]; if (b) { link(a, b); break; } }
    }
  }
  for (let y = 0; y < H - 1; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const a = labels[i];
      if (!a || labels[i + W]) continue;
      for (let k = 2; k <= 16 && y + k < H; k++) { const b = labels[i + k * W]; if (b) { link(a, b); break; } }
    }
  }

  // Give neighbours different numbers (biggest areas first), spreading the numbers around.
  const K = NUM_COLOURS.length;
  [...regions.slice(1)].sort((p, q) => q.area - p.area).forEach((r, n) => {
    const used = new Set([...r.nb].map((b) => regions[b].num).filter(Boolean));
    let pick = (n * 3) % K;
    for (let t = 0; t < K; t++) {
      const c = (pick + t) % K;
      if (!used.has(c + 1)) { pick = c; break; }
    }
    r.num = pick + 1;
  });
  return { labels, regions: regions.slice(1) };
}

// Draws the numbers still to do. Areas of the chosen number get a soft colour glow so they are easy to find.
export function drawNumbers(ctx, regions, done, chosen) {
  const { width: W, height: H } = ctx.canvas;
  ctx.clearRect(0, 0, W, H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const r of regions) {
    if (r.auto || done.has(r.id)) continue;
    const size = Math.max(24, Math.min(r.r * 1.15, 56));
    if (r.num === chosen) {
      ctx.fillStyle = NUM_COLOURS[chosen - 1] + '55';
      ctx.beginPath();
      ctx.arc(r.x, r.y, Math.min(r.r * 0.95, 46), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = `800 ${size}px Andika, sans-serif`;
    ctx.lineWidth = size * 0.2;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#fff';
    ctx.strokeText(r.num, r.x, r.y + size * 0.04);
    ctx.fillStyle = '#2b2250';
    ctx.fillText(r.num, r.x, r.y + size * 0.04);
  }
}

// Paint editor. Free drawing fills the free space on screen. A colouring page is a fixed 4:3 canvas with an outline layer
// on top and a paint-bucket that fills whole areas. Pointer Events: mouse, finger and stylus all work.
import { el, add } from '../../shared/dom.js';
import { get, put } from '../../shared/storage.js';
import { confirmPicture } from '../../shared/confirm.js';
import { play } from '../../shared/audio.js';
import { pageById } from './pages.js';
import { NUM_COLOURS, analyse, drawNumbers } from './numbers.js';

const MAX_UNDO = 10;
const COLOURS = ['#2b2250', '#8d88a8', '#e63946', '#ff9f1c', '#ffd23f', '#2ec27e', '#1b7f4b', '#6fd3ff', '#2f6bff', '#8e5cf6', '#ff5fa2', '#8b5a2b', '#ffffff', '#f5c9a0'];
const SIZES = [8, 18, 36];
const PAGE_W = 1200;
const PAGE_H = 900;

const toBlob = (canvas) => new Promise((r) => canvas.toBlob(r, 'image/png'));
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

export async function renderEditor(root, nav, id, pageId, byNumbers = false) {
  const rec = id ? await get('drawings', id) : null;
  pageId = pageId || rec?.page || null;
  const numbers = !!(pageId && (byNumbers || rec?.numbers)); // paint by numbers: fill each area with its numbered colour
  const page = pageId ? pageById(pageId) : null;

  let picId = id;
  const PAL = numbers ? NUM_COLOURS : COLOURS;
  let colour = numbers ? PAL[0] : COLOURS[2];
  let size = SIZES[1];
  let erasing = false;
  let filling = !!page;
  let dirty = false;
  let last = null;
  const undoStack = [];

  const status = el('div', { class: 'pt-status' });
  const wrap = el('div', { class: 'pt-wrap' });
  let chosen = 1; // chosen number (paint by numbers)
  let regionData = null; // { labels, regions }
  const done = new Set();
  let numCanvas = null;
  const swatches = PAL.map((c, i) => el('button', {
    class: 'pt-sw',
    style: `background:${c}`,
    'aria-label': numbers ? 'Number ' + (i + 1) : 'Colour',
    onclick: () => { colour = c; erasing = false; chosen = i + 1; refresh(); },
  }, numbers ? String(i + 1) : null));
  const sizeBtns = SIZES.map((s) => el('button', {
    class: 'btn pt-tool',
    'aria-label': 'Brush size',
    onclick: () => { size = s; filling = false; refresh(); },
  }, el('span', { class: 'pt-dot', style: `width:${s * 0.9 + 6}px;height:${s * 0.9 + 6}px` })));
  const rubber = el('button', { class: 'btn pt-tool', 'aria-label': 'Rubber', onclick: () => { erasing = !erasing; if (erasing) filling = false; refresh(); } }, '🧽');
  const bucket = page && !numbers && el('button', { class: 'btn pt-tool', 'aria-label': 'Fill an area', onclick: () => { filling = true; erasing = false; refresh(); } }, '🪣');
  const tool = (label, aria, fn, cls = '') => el('button', { class: 'btn pt-tool ' + cls, 'aria-label': aria, onclick: fn }, label);

  let cursor; // ring that shows where (and how big) the brush is, visible on any colour
  function refresh() {
    swatches.forEach((b, i) => b.classList.toggle('on', !erasing && PAL[i] === colour));
    if (numbers && regionData) {
      swatches.forEach((b, i) => b.classList.toggle('fin', !regionData.regions.some((r) => r.num === i + 1 && !r.auto && !done.has(r.id))));
      drawNumbers(numCanvas.getContext('2d'), regionData.regions, done, chosen);
    }
    sizeBtns.forEach((b, i) => b.classList.toggle('sel', !filling && SIZES[i] === size));
    rubber.classList.toggle('sel', erasing);
    if (bucket) bucket.classList.toggle('sel', filling);
    if (cursor) {
      const d = filling ? 28 : Math.max(16, erasing ? size * 1.6 : size);
      cursor.style.width = cursor.style.height = d + 'px';
      cursor.style.background = erasing ? 'rgba(255,255,255,.35)' : colour + '99';
    }
  }

  let canvas;
  let ctx;
  let W;
  let H;
  let scale = 1;
  let outline = null; // { canvas, alpha } for colouring pages

  const tools = el('div', { class: 'pt-tools' },
    bucket,
    numbers ? null : sizeBtns,
    numbers ? null : rubber,
    tool('↩️', 'Undo', () => {
      const s = undoStack.pop();
      if (s) { ctx.putImageData(s, 0, 0); dirty = true; if (numbers) syncDone(); }
    }),
    tool('🗑️', 'Clear picture', async () => {
      if (await confirmPicture('🗑️', page ? 'Rub out all the colour?' : 'Clear the picture?')) {
        snapshot();
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, W, H);
        dirty = true;
        if (numbers) { autoFill(); syncDone(); }
      }
    }, 'pink'),
    tool('💾', 'Save', async () => { await save(); play('good'); status.textContent = 'Saved ✔'; }, 'green'),
    tool('🖼️', 'My pictures', async () => { if (dirty) await save(); nav.gallery(); }, 'orange'),
  );

  add(root, el('div', { class: 'pt-layout' },
    el('div', { class: 'pt-pal' }, swatches),
    wrap,
    el('div', {}, tools, status)));

  // Build the canvas after the layout exists, so it can match the space available.
  let cssW;
  let cssH;
  if (page) {
    W = PAGE_W;
    H = PAGE_H;
    const k = Math.min(wrap.clientWidth / W, wrap.clientHeight / H) || 0.7;
    cssW = Math.round(W * k);
    cssH = Math.round(H * k);
    scale = W / cssW;
  } else {
    scale = Math.min(window.devicePixelRatio || 1, 1.5);
    cssW = wrap.clientWidth || 1000;
    cssH = wrap.clientHeight || 700;
    W = Math.round(cssW * scale);
    H = Math.round(cssH * scale);
  }
  canvas = el('canvas', { class: 'pt-canvas', width: W, height: H, style: `width:${cssW}px;height:${cssH}px` });
  ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const stack = el('div', { class: 'pt-stack', style: `width:${cssW}px;height:${cssH}px` }, canvas);
  cursor = el('div', { class: 'pt-cursor', 'aria-hidden': 'true' });
  cursor.hidden = true;
  wrap.append(stack, cursor);
  refresh();

  if (page) {
    outline = await buildOutline();
    outline.canvas.className = 'pt-outline';
    outline.canvas.style.width = cssW + 'px';
    outline.canvas.style.height = cssH + 'px';
    stack.append(outline.canvas);
    if (rec?.layer) ctx.drawImage(await createImageBitmap(rec.layer), 0, 0, W, H);
    if (numbers) {
      regionData = analyse(outline.alpha, W, H);
      numCanvas = el('canvas', { class: 'pt-outline', width: W, height: H, style: `width:${cssW}px;height:${cssH}px` });
      stack.append(numCanvas);
      if (!rec?.layer) autoFill();
      syncDone();
    }
  } else if (rec) {
    // Saved pictures may have a different shape: fit them inside, keeping their proportions.
    const bmp = await createImageBitmap(rec.png);
    const k = Math.min(W / bmp.width, H / bmp.height);
    ctx.drawImage(bmp, (W - bmp.width * k) / 2, (H - bmp.height * k) / 2, bmp.width * k, bmp.height * k);
  }

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') { cursor.hidden = true; return; }
    const r = wrap.getBoundingClientRect();
    cursor.hidden = false;
    cursor.style.left = e.clientX - r.left + 'px';
    cursor.style.top = e.clientY - r.top + 'px';
  });
  canvas.addEventListener('pointerleave', () => { cursor.hidden = true; });

  // The page's dark lines become the outline layer (on top) and "walls" for the paint-bucket.
  async function buildOutline() {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#fff';
    x.fillRect(0, 0, W, H);
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(page.svg);
    await img.decode();
    x.drawImage(img, 0, 0, W, H);
    const data = x.getImageData(0, 0, W, H);
    const px = data.data;
    const alpha = new Uint8ClampedArray(W * H);
    for (let i = 0, j = 0; i < px.length; i += 4, j++) {
      const lum = px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11;
      const a = Math.max(0, Math.min(255, ((255 - lum) * 255) / 215));
      alpha[j] = a;
      px[i] = 43; px[i + 1] = 34; px[i + 2] = 80; px[i + 3] = a;
    }
    x.putImageData(data, 0, 0);
    return { canvas: c, alpha };
  }

  // Paint by numbers helpers. Tiny areas, where a number would not fit, are coloured in for her.
  function paintRegion(r, col) {
    const img = ctx.getImageData(r.minX, r.minY, r.maxX - r.minX + 1, r.maxY - r.minY + 1);
    const w = img.width;
    const [cr, cg, cb] = hexRgb(col);
    const labels = regionData.labels;
    for (let y = r.minY; y <= r.maxY; y++) {
      for (let x = r.minX; x <= r.maxX; x++) {
        if (labels[y * W + x] !== r.id) continue;
        const p = ((y - r.minY) * w + (x - r.minX)) * 4;
        img.data[p] = cr; img.data[p + 1] = cg; img.data[p + 2] = cb; img.data[p + 3] = 255;
      }
    }
    ctx.putImageData(img, r.minX, r.minY);
  }
  function autoFill() {
    for (const r of regionData.regions) if (r.auto) paintRegion(r, NUM_COLOURS[r.num - 1]);
  }
  function syncDone() { // work out which areas are coloured, from the picture itself
    const px = ctx.getImageData(0, 0, W, H).data;
    done.clear();
    for (const r of regionData.regions) {
      const p = (r.y * W + r.x) * 4;
      if (px[p] + px[p + 1] + px[p + 2] < 750) done.add(r.id);
    }
    refresh();
    finishCheck();
  }
  function finishCheck() {
    if (regionData.regions.every((r) => r.auto || done.has(r.id))) status.textContent = 'Well done! 🎉';
  }
  function numberTap(fx, fy) {
    const x0 = Math.round(fx);
    const y0 = Math.round(fy);
    const { labels, regions } = regionData;
    let id = 0;
    for (let r = 0; r <= 8 && !id; r++) {
      for (let dy = -r; dy <= r && !id; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const x = x0 + dx;
          const y = y0 + dy;
          if (x >= 0 && y >= 0 && x < W && y < H && labels[y * W + x]) { id = labels[y * W + x]; break; }
        }
      }
    }
    const r = regions[id - 1];
    if (!r || r.auto || done.has(r.id)) return;
    if (r.num !== chosen) { play('wrong'); chosen = r.num; colour = NUM_COLOURS[chosen - 1]; refresh(); return; }
    snapshot();
    paintRegion(r, colour);
    done.add(r.id);
    dirty = true;
    play('pop');
    if (!regions.some((q) => q.num === chosen && !q.auto && !done.has(q.id))) { // that number is finished: move on
      const next = regions.find((q) => !q.auto && !done.has(q.id));
      if (next) { chosen = next.num; colour = NUM_COLOURS[chosen - 1]; }
    }
    refresh();
    if (regions.every((q) => q.auto || done.has(q.id))) { play('win'); finishCheck(); }
  }

  // Fill the whole area around (fx, fy), stopping at the outline.
  function floodFill(fx, fy) {
    let x0 = Math.round(fx);
    let y0 = Math.round(fy);
    const wall = outline.alpha;
    const free = (i) => wall[i] < 200;
    if (x0 < 0 || y0 < 0 || x0 >= W || y0 >= H) return false;
    if (!free(y0 * W + x0)) { // landed on a line: use the nearest open spot
      let found = false;
      for (let r = 1; r <= 6 && !found; r++) {
        for (let dy = -r; dy <= r && !found; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const x = x0 + dx;
            const y = y0 + dy;
            if (x >= 0 && y >= 0 && x < W && y < H && free(y * W + x)) { x0 = x; y0 = y; found = true; break; }
          }
        }
      }
      if (!found) return false;
    }
    const img = ctx.getImageData(0, 0, W, H);
    const px = img.data;
    const [r, g, b] = hexRgb(colour);
    const seen = new Uint8Array(W * H);
    const ok = (i) => !seen[i] && free(i);
    const stack = [x0, y0];
    while (stack.length) {
      const y = stack.pop();
      const x = stack.pop();
      const row = y * W;
      if (!ok(row + x)) continue;
      let l = x;
      let rt = x;
      while (l > 0 && ok(row + l - 1)) l--;
      while (rt < W - 1 && ok(row + rt + 1)) rt++;
      for (let k = l; k <= rt; k++) {
        seen[row + k] = 1;
        const p = (row + k) * 4;
        px[p] = r; px[p + 1] = g; px[p + 2] = b; px[p + 3] = 255;
      }
      for (const ny of [y - 1, y + 1]) {
        if (ny < 0 || ny >= H) continue;
        let inSpan = false;
        for (let k = l; k <= rt; k++) {
          const o = ok(ny * W + k);
          if (o && !inSpan) { stack.push(k, ny); inSpan = true; } else if (!o) inSpan = false;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    return true;
  }

  const pen = () => {
    ctx.strokeStyle = ctx.fillStyle = erasing ? '#fff' : colour;
    ctx.lineWidth = (erasing ? size * 1.6 : size) * scale;
  };
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height];
  };
  function snapshot() {
    undoStack.push(ctx.getImageData(0, 0, W, H));
    if (undoStack.length > MAX_UNDO) undoStack.shift();
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || !e.isPrimary) return;
    e.preventDefault();
    status.textContent = '';
    if (numbers) { numberTap(...pos(e)); return; }
    if (filling && page) {
      snapshot();
      if (floodFill(...pos(e))) { dirty = true; play('pop'); } else undoStack.pop();
      return;
    }
    canvas.setPointerCapture(e.pointerId);
    snapshot();
    dirty = true;
    last = pos(e);
    pen();
    ctx.beginPath();
    ctx.arc(last[0], last[1], ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!last) return;
    const p = pos(e);
    pen();
    ctx.beginPath();
    ctx.moveTo(last[0], last[1]);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();
    last = p;
  });
  const end = () => { last = null; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  async function save() {
    picId ||= 'pic' + Date.now().toString(36);
    if (!page) {
      await put('drawings', { id: picId, png: await toBlob(canvas), modified: Date.now() });
    } else {
      const out = document.createElement('canvas');
      out.width = W;
      out.height = H;
      const o = out.getContext('2d');
      o.drawImage(canvas, 0, 0);
      o.drawImage(outline.canvas, 0, 0);
      if (numCanvas) o.drawImage(numCanvas, 0, 0);
      await put('drawings', { id: picId, png: await toBlob(out), layer: await toBlob(canvas), page: pageId, numbers, modified: Date.now() });
    }
    dirty = false;
  }

  return () => { if (dirty) save(); };
}

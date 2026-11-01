// Free-drawing editor. The canvas fills the free space on screen. Pointer Events: mouse, finger and stylus all work.
import { el, add } from '../../shared/dom.js';
import { get, put } from '../../shared/storage.js';
import { confirmPicture } from '../../shared/confirm.js';
import { play } from '../../shared/audio.js';

const MAX_UNDO = 10;
const COLOURS = ['#2b2250', '#8d88a8', '#e63946', '#ff9f1c', '#ffd23f', '#2ec27e', '#1b7f4b', '#6fd3ff', '#2f6bff', '#8e5cf6', '#ff5fa2', '#8b5a2b'];
const SIZES = [8, 18, 36];

export async function renderEditor(root, nav, id) {
  let picId = id;
  let colour = COLOURS[0];
  let size = SIZES[1];
  let erasing = false;
  let dirty = false;
  let last = null;
  const undoStack = [];

  const status = el('div', { class: 'pt-status' });
  const wrap = el('div', { class: 'pt-wrap' });
  const swatches = COLOURS.map((c) => el('button', {
    class: 'pt-sw' + (c === colour ? ' on' : ''),
    style: `background:${c}`,
    'aria-label': 'Colour',
    onclick: () => { colour = c; erasing = false; refresh(); },
  }));
  const sizeBtns = SIZES.map((s) => el('button', {
    class: 'btn pt-tool',
    'aria-label': 'Brush size',
    onclick: () => { size = s; refresh(); },
  }, el('span', { class: 'pt-dot', style: `width:${s * 0.9 + 6}px;height:${s * 0.9 + 6}px` })));
  const rubber = el('button', { class: 'btn pt-tool', 'aria-label': 'Rubber', onclick: () => { erasing = !erasing; refresh(); } }, '🧽');
  const tool = (label, aria, fn, cls = '') => el('button', { class: 'btn pt-tool ' + cls, 'aria-label': aria, onclick: fn }, label);

  let cursor; // ring that shows where (and how big) the brush is, visible on any colour
  function refresh() {
    swatches.forEach((b, i) => b.classList.toggle('on', !erasing && COLOURS[i] === colour));
    sizeBtns.forEach((b, i) => b.classList.toggle('sel', SIZES[i] === size));
    rubber.classList.toggle('sel', erasing);
    if (cursor) {
      const d = Math.max(16, erasing ? size * 1.6 : size);
      cursor.style.width = cursor.style.height = d + 'px';
      cursor.style.background = erasing ? 'rgba(255,255,255,.35)' : colour + '99';
    }
  }

  // Build the canvas after the layout exists, so it can match the space available.
  let canvas;
  let ctx;
  let W;
  let H;
  let scale = 1;

  const tools = el('div', { class: 'pt-tools' },
    sizeBtns,
    rubber,
    tool('↩️', 'Undo', () => {
      const s = undoStack.pop();
      if (s) { ctx.putImageData(s, 0, 0); dirty = true; }
    }),
    tool('🗑️', 'Clear picture', async () => {
      if (await confirmPicture('🗑️', 'Clear the picture?')) {
        snapshot();
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, W, H);
        dirty = true;
      }
    }, 'pink'),
    tool('💾', 'Save', async () => { await save(); play('good'); status.textContent = 'Saved ✔'; }, 'green'),
    tool('🖼️', 'My pictures', async () => { if (dirty) await save(); nav.gallery(); }, 'orange'),
  );

  add(root, el('div', { class: 'pt-layout' },
    el('div', { class: 'pt-pal' }, swatches),
    wrap,
    el('div', {}, tools, status)));
  refresh();

  scale = Math.min(window.devicePixelRatio || 1, 1.5);
  const cssW = wrap.clientWidth || 1000;
  const cssH = wrap.clientHeight || 700;
  W = Math.round(cssW * scale);
  H = Math.round(cssH * scale);
  canvas = el('canvas', { class: 'pt-canvas', width: W, height: H, style: `width:${cssW}px;height:${cssH}px` });
  ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  cursor = el('div', { class: 'pt-cursor', 'aria-hidden': 'true' });
  cursor.hidden = true;
  wrap.append(canvas, cursor);
  refresh();
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') { cursor.hidden = true; return; }
    const r = wrap.getBoundingClientRect();
    cursor.hidden = false;
    cursor.style.left = e.clientX - r.left + 'px';
    cursor.style.top = e.clientY - r.top + 'px';
  });
  canvas.addEventListener('pointerleave', () => { cursor.hidden = true; });

  if (id) {
    const rec = await get('drawings', id);
    if (rec) {
      // Saved pictures may have a different shape: fit them inside, keeping their proportions.
      const bmp = await createImageBitmap(rec.png);
      const k = Math.min(W / bmp.width, H / bmp.height);
      ctx.drawImage(bmp, (W - bmp.width * k) / 2, (H - bmp.height * k) / 2, bmp.width * k, bmp.height * k);
    }
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
    canvas.setPointerCapture(e.pointerId);
    snapshot();
    dirty = true;
    status.textContent = '';
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
    const png = await new Promise((r) => canvas.toBlob(r, 'image/png'));
    picId ||= 'pic' + Date.now().toString(36);
    await put('drawings', { id: picId, png, modified: Date.now() });
    dirty = false;
  }

  return () => { if (dirty) save(); };
}

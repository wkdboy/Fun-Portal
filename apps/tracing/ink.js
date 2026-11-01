// Drawing on a transparent canvas with mouse, finger or stylus.
// Stylus: pressure changes the line width, the pen's eraser end rubs out, and once a pen has been used
// the hand resting on the screen (touch) is ignored.
export function createInk(canvas, onChange = () => {}) {
  const ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  let colour = '#6c4cf1';
  let size = 7;
  let erasing = false;
  let last = null;
  let penSeen = false;
  let drawingWith = null;
  const undoStack = [];

  const scale = () => canvas.width / canvas.getBoundingClientRect().width;
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) * canvas.width) / r.width, ((e.clientY - r.top) * canvas.height) / r.height];
  };
  const snapshot = () => {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 12) undoStack.shift();
  };

  function stroke(from, to, e) {
    const eraser = erasing || (e.buttons & 32) === 32;
    const pressure = e.pointerType === 'pen' && e.pressure > 0 ? 0.4 + 1.2 * e.pressure : 1;
    ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = ctx.fillStyle = colour;
    ctx.lineWidth = size * scale() * pressure * (eraser ? 4 : 1);
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.stroke();
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen') penSeen = true;
    if (e.pointerType === 'touch' && penSeen) return; // palm
    if (drawingWith !== null || (e.pointerType === 'mouse' && e.button > 0)) return;
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    drawingWith = e.pointerId;
    snapshot();
    last = pos(e);
    stroke(last, last, e);
    onChange();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== drawingWith) return;
    const events = e.getCoalescedEvents?.().length ? e.getCoalescedEvents() : [e];
    for (const ev of events) {
      const p = pos(ev);
      stroke(last, p, ev);
      last = p;
    }
  });
  const end = (e) => {
    if (e.pointerId !== drawingWith) return;
    drawingWith = null;
    last = null;
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  return {
    setColour: (c) => { colour = c; erasing = false; },
    setSize: (s) => { size = s; },
    setErasing: (v) => { erasing = v; },
    get erasing() { return erasing; },
    undo() {
      const s = undoStack.pop();
      if (s) { ctx.putImageData(s, 0, 0); onChange(); }
    },
    clear() {
      undoStack.length = 0;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}

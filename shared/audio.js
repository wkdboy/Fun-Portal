// Sound effects generated in code (no audio files). One global on/off switch.
import { getSetting, setSetting } from './storage.js';

let ctx;
let on = true;
let button;

function audio() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (C) ctx = new C();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, delay, dur, type = 'sine', gain = 0.15) {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime + delay;
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const SOUNDS = {
  tap: () => tone(660, 0, 0.08, 'triangle'),
  pop: () => tone(880, 0, 0.1, 'sine'),
  dice: () => [0, 0.07, 0.14, 0.21, 0.28].forEach((t, i) => tone(300 + i * 70, t, 0.06, 'square', 0.07)),
  good: () => { tone(784, 0, 0.1, 'triangle'); tone(988, 0.1, 0.18, 'triangle'); },
  wrong: () => tone(220, 0, 0.25, 'sine', 0.12),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.28, 'triangle')),
};

export function play(name) {
  if (on) SOUNDS[name]?.();
}

function paint() {
  if (button) button.textContent = on ? '🔊' : '🔇';
}

export async function bindSoundButton(btn) {
  button = btn;
  on = await getSetting('soundOn');
  paint();
  btn.addEventListener('click', async () => {
    on = !on;
    paint();
    await setSetting('soundOn', on);
    play('pop');
  });
}

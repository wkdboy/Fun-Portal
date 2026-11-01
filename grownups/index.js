// Grown-ups area: behind the parent gate, a menu of small settings screens.
import { el } from '../shared/dom.js';
import { askGate } from '../shared/parent-gate.js';

const SCREENS = [
  { id: 'name', label: '👤 Her name and picture', file: './name.js', cls: '' },
  { id: 'phonics', label: '🔤 Phonics sounds learned', file: './phonics-setting.js', cls: 'pink' },
  { id: 'players', label: '👥 Game players', file: './players.js', cls: 'orange' },
  { id: 'backup', label: '💾 Backup and restore', file: './backup-screen.js', cls: 'green' },
  { id: 'offline', label: '✅ Offline check and version', file: './offline.js', cls: '' },
];

export async function render(root, goHome) {
  if (!(await askGate())) { goHome(); return; }

  const show = async (screen) => {
    root.replaceChildren();
    const mod = await import(screen.file);
    await mod.render(root, menu);
  };
  function menu() {
    root.replaceChildren(
      el('h1', {}, 'Grown-ups'),
      el('div', { class: 'grid menu' },
        SCREENS.map((s) => el('button', { class: `btn big ${s.cls}`, onclick: () => show(s) }, s.label))),
    );
    root.querySelector('button')?.focus();
  }
  menu();
}

export function backButton(back) {
  return el('button', { class: 'btn grey', onclick: back }, '← Back');
}

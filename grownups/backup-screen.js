import { el } from '../shared/dom.js';
import { exportBackup, importBackup } from '../shared/backup.js';
import { backButton } from './index.js';

export async function render(root, back) {
  const status = el('p', {});
  const file = el('input', { type: 'file', accept: '.json,application/json', hidden: true });
  file.addEventListener('change', async () => {
    const f = file.files[0];
    if (!f) return;
    if (!confirm('Restoring replaces everything on this device with the backup. Carry on?')) { file.value = ''; return; }
    try {
      await importBackup(f);
      status.textContent = 'Restored ✔ Reloading...';
      setTimeout(() => { location.hash = '#/'; location.reload(); }, 800);
    } catch (e) {
      status.textContent = e.message;
    }
    file.value = '';
  });

  root.append(
    el('h1', {}, 'Backup and restore'),
    el('div', { class: 'card' },
      el('p', {}, 'Saves her note, pictures, players and settings to a file in Downloads. Restore it after a reset or on a new device. Data is not synced between devices.'),
      el('div', { class: 'row' },
        el('button', {
          class: 'btn green',
          onclick: async () => {
            status.textContent = 'Saving...';
            try { await exportBackup(); status.textContent = 'Backup saved to Downloads ✔'; } catch (e) { status.textContent = 'Backup failed: ' + e.message; }
          },
        }, '💾 Save backup'),
        el('button', { class: 'btn orange', onclick: () => file.click() }, '📂 Restore backup'),
        file),
      status),
    el('div', { style: 'margin-top:28px' }, backButton(back)),
  );
}

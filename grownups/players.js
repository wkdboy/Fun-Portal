// Lists game players so a grown-up can delete them. (She creates players herself inside Games.)
import { el } from '../shared/dom.js';
import { listStoredPlayers, deletePlayer } from '../shared/players.js';
import { backButton } from './index.js';

export async function render(root, back) {
  const list = el('div', { class: 'card' });
  async function refresh() {
    const players = await listStoredPlayers();
    list.replaceChildren(
      players.length === 0 && el('p', { class: 'muted' }, 'No extra players yet. She can add them in Games.'),
      players.map((p) => el('div', { class: 'player-row' },
        el('span', { class: 'pic' }, p.emoji),
        el('span', { class: 'name' }, p.name, el('span', { class: 'muted' }, p.type === 'computer' ? `  (computer, level ${p.level})` : '  (person)')),
        el('button', {
          class: 'btn pink',
          onclick: async () => {
            if (confirm(`Delete ${p.name}?`)) { await deletePlayer(p.id); refresh(); }
          },
        }, 'Delete'))),
    );
  }
  root.append(el('h1', {}, 'Game players'), list, el('div', { style: 'margin-top:28px' }, backButton(back)));
  await refresh();
}

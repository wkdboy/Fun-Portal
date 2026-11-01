// Game players. Computer and extra human players are stored; her own profile is added automatically.
import { all, put, del, getSetting } from './storage.js';

export async function listStoredPlayers() {
  return (await all('players')).sort((a, b) => a.created - b.created);
}

// type: 'human' | 'computer'. level (1-10) only for computers and fixed at creation.
export async function addPlayer({ name, emoji, type, level }) {
  const player = {
    id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: String(name).trim().slice(0, 20),
    emoji,
    type: type === 'computer' ? 'computer' : 'human',
    created: Date.now(),
  };
  if (!player.name) throw new Error('Name needed');
  if (player.type === 'computer') {
    const n = Math.round(Number(level));
    if (!(n >= 1 && n <= 10)) throw new Error('Level must be 1 to 10');
    player.level = n;
  }
  await put('players', player);
  return player;
}

export const deletePlayer = (id) => del('players', id);

// Everyone who can be picked for a game: her first, then stored players.
export async function listGamePlayers() {
  const me = { id: 'me', name: (await getSetting('childName')) || 'Me', emoji: await getSetting('childEmoji'), type: 'human' };
  return [me, ...(await listStoredPlayers())];
}

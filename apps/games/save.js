// An unfinished game is remembered (per game) so she can carry on later. Stored with her other settings.
import { get, put, del, kvEntries } from '../../shared/storage.js';

const key = (id) => 'game:' + id;
export const loadSave = (id) => get('kv', key(id));
export const writeSave = (id, data) => put('kv', data, key(id));
export const clearSave = (id) => del('kv', key(id));

// Ids of the games that have an unfinished game saved.
export async function savedIds() {
  return new Set((await kvEntries()).filter(([k]) => String(k).startsWith('game:')).map(([k]) => k.slice(5)));
}

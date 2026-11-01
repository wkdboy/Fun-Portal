// Backup and restore: everything in IndexedDB (settings, players, notes, drawings) as one JSON file.
import { STORE_NAMES, all, put, clear, kvEntries } from './storage.js';

const APP = 'fun-portal';
const SCHEMA = 1;

const toDataUrl = (blob) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = () => reject(r.error);
  r.readAsDataURL(blob);
});

async function encode(v) {
  if (v instanceof Blob) return { __blob: await toDataUrl(v) };
  if (Array.isArray(v)) return Promise.all(v.map(encode));
  if (v && typeof v === 'object') {
    const out = {};
    for (const [k, x] of Object.entries(v)) out[k] = await encode(x);
    return out;
  }
  return v;
}

async function decode(v) {
  if (Array.isArray(v)) return Promise.all(v.map(decode));
  if (v && typeof v === 'object') {
    if (typeof v.__blob === 'string') return (await fetch(v.__blob)).blob();
    const out = {};
    for (const [k, x] of Object.entries(v)) out[k] = await decode(x);
    return out;
  }
  return v;
}

export async function exportBackup() {
  const stores = {};
  for (const s of STORE_NAMES) stores[s] = await encode(s === 'kv' ? await kvEntries() : await all(s));
  const data = { app: APP, schema: SCHEMA, exported: new Date().toISOString(), stores };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `fun-portal-backup-${data.exported.slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Replaces everything on this device with the file's contents. Throws if the file isn't a valid backup.
export async function importBackup(file) {
  let data;
  try { data = JSON.parse(await file.text()); } catch { throw new Error('That file is not a backup.'); }
  if (data?.app !== APP || typeof data.schema !== 'number' || !data.stores) throw new Error('That file is not a Fun Portal backup.');
  if (data.schema > SCHEMA) throw new Error('That backup is from a newer version.');
  const decoded = {};
  for (const s of STORE_NAMES) decoded[s] = await decode(data.stores[s] || []);
  for (const s of STORE_NAMES) {
    await clear(s);
    for (const rec of decoded[s]) await (s === 'kv' ? put('kv', rec[1], rec[0]) : put(s, rec));
  }
}

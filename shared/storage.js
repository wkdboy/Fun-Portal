// IndexedDB wrapper. Stores: kv (settings, key/value), players, documents, drawings (keyPath 'id').
import { PHONICS_DEFAULT_LEARNED } from './phonics-sounds.js';

const DB_NAME = 'fun-portal';
const DB_VERSION = 1;
export const STORE_NAMES = ['kv', 'players', 'documents', 'drawings'];

let dbPromise;
function open() {
  dbPromise ||= new Promise((resolve, reject) => {
    const r = indexedDB.open(DB_NAME, DB_VERSION);
    r.onupgradeneeded = () => {
      const db = r.result;
      for (const s of STORE_NAMES) {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, s === 'kv' ? undefined : { keyPath: 'id' });
      }
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
  return dbPromise;
}

async function tx(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    let out;
    const req = fn(t.objectStore(store));
    if (req) req.onsuccess = () => { out = req.result; };
    t.oncomplete = () => resolve(out);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export const get = (store, key) => tx(store, 'readonly', (s) => s.get(key));
export const put = (store, value, key) => tx(store, 'readwrite', (s) => (key === undefined ? s.put(value) : s.put(value, key)));
export const del = (store, key) => tx(store, 'readwrite', (s) => s.delete(key));
export const all = (store) => tx(store, 'readonly', (s) => s.getAll());
export const clear = (store) => tx(store, 'readwrite', (s) => s.clear());

// key/value pairs of the kv store as [[key, value], ...]
export async function kvEntries() {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction('kv', 'readonly');
    const s = t.objectStore('kv');
    const keys = s.getAllKeys();
    const vals = s.getAll();
    t.oncomplete = () => resolve(keys.result.map((k, i) => [k, vals.result[i]]));
    t.onerror = () => reject(t.error);
  });
}

export const requestPersistence = () => (navigator.storage?.persist ? navigator.storage.persist().catch(() => false) : false);

// Settings
const DEFAULTS = {
  childName: '',
  childEmoji: '🦄',
  soundOn: true,
  phonicsLearned: PHONICS_DEFAULT_LEARNED,
};
export async function getSetting(key) {
  const v = await get('kv', key);
  return v === undefined ? DEFAULTS[key] : v;
}
export const setSetting = (key, value) => put('kv', value, key);

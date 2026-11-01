// Are all the app's files saved on this device (so it works without the internet)?
export async function offlineStatus() {
  try {
    const manifest = await (await fetch('precache.json', { cache: 'no-store' })).json();
    let missing = 0;
    for (const f of manifest.files) {
      if (!(await caches.match(new URL(f, location.href), { ignoreSearch: true }))) missing++;
    }
    const reg = await navigator.serviceWorker?.getRegistration();
    return {
      total: manifest.files.length,
      missing,
      version: manifest.appVersion,
      running: !!navigator.serviceWorker?.controller,
      update: !!reg?.waiting,
    };
  } catch (e) {
    return { error: true };
  }
}

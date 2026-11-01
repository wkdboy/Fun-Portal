export const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = (arr) => arr[rand(0, arr.length - 1)];
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const sample = (arr, n) => shuffle(arr).slice(0, n);

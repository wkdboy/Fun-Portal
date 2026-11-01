// The apps shown on the home screen. Set `module` (path relative to portal/) when an app is built;
// until then the tile opens a "coming soon" page. An app module exports mount(root, { goHome }) and may return a cleanup function.
export const APPS = [
  { id: 'phonics', label: 'Phonics', pic: '🔤', color: '#ff5fa2', module: '../apps/phonics/main.js' },
  { id: 'numbers', label: 'Numbers', pic: '🔢', color: '#2f9bff', module: '../apps/numbers/main.js' },
  { id: 'times-tables', label: 'Times tables', pic: '✖️', color: '#ff9f1c', module: null },
  { id: 'text-editor', label: 'Write', pic: '📝', color: '#2ec27e', module: '../apps/text-editor/main.js' },
  { id: 'paint', label: 'Paint', pic: '🎨', color: '#8e5cf6', module: '../apps/paint/main.js' },
  { id: 'games', label: 'Games', pic: '🎲', color: '#ef476f', module: '../apps/games/main.js' },
];

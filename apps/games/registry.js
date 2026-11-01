// Games on the hub. `load` imports the game module (exports `game`); null = coming soon. `shell: 'dice'` = 2-4 player dice game (dice-shell.js), otherwise two-player (shell.js).
export const GAMES = [
  { id: 'noughts', label: 'Noughts and Crosses', pic: '❌⭕', color: '#2f9bff', load: () => import('./noughts/game.js') },
  { id: 'connect4', label: 'Connect 4', pic: '🔴🟡', color: '#ff9f1c', load: () => import('./connect4/game.js') },
  { id: 'snakes', label: 'Snakes and Ladders', pic: '🐍🪜', color: '#2ec27e', shell: 'dice', load: () => import('./snakes/game.js') },
  { id: 'ludo', label: 'Ludo', pic: '🎲', color: '#ef476f', shell: 'dice', load: () => import('./ludo/game.js') },
];

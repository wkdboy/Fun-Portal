import * as engine from './engine.js';
import { makeBoard } from './board.js';
import { STARTER_SPEC } from '../rules.js';

export const game = {
  id: 'noughts',
  symbols: ['X', 'O'],
  rulesSpec: [STARTER_SPEC],
  ...engine,
  makeBoard,
};

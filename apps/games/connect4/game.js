import * as engine from './engine.js';
import { makeBoard } from './board.js';
import { STARTER_SPEC } from '../rules.js';

export const game = {
  id: 'connect4',
  symbols: ['🔴', '🟡'],
  rulesSpec: [
    {
      id: 'size',
      label: 'Board size',
      default: 'standard',
      options: [
        { value: 'standard', label: 'Standard (7 × 6)' },
        { value: 'small', label: 'Small (6 × 5)' },
      ],
    },
    STARTER_SPEC,
  ],
  ...engine,
  makeBoard,
};

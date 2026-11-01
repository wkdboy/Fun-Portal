import * as engine from './engine.js';
import { makeBoard } from './board.js';
import { DICE_STARTER_SPEC } from '../rules.js';

export const game = {
  id: 'snakes',
  playerRange: [2, 4],
  rulesSpec: [
    {
      id: 'finish',
      label: 'Finishing on 100',
      default: 'bounce',
      options: [
        { value: 'bounce', label: 'Exact roll, bounce back' },
        { value: 'stay', label: 'Exact roll, stay put' },
        { value: 'any', label: 'Any roll past 100 wins' },
      ],
    },
    {
      id: 'extra',
      label: 'Rolling a 6',
      default: 'no',
      options: [
        { value: 'no', label: 'No extra turn' },
        { value: 'yes', label: 'Extra turn' },
      ],
    },
    DICE_STARTER_SPEC,
  ],
  ...engine,
  makeBoard,
};

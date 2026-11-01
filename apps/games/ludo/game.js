import * as engine from './engine.js';
import { makeBoard } from './board.js';
import { DICE_STARTER_SPEC } from '../rules.js';

const yesNo = (id, label, yes, no, def = 'yes') => ({
  id, label, default: def, options: [{ value: 'yes', label: yes }, { value: 'no', label: no }],
});

export const game = {
  id: 'ludo',
  playerRange: [2, 4],
  rulesSpec: [
    {
      id: 'leave',
      label: 'Leaving home',
      default: 'six',
      options: [
        { value: 'six', label: 'Need a 6' },
        { value: 'any', label: 'Any roll' },
        { value: 'out', label: 'One counter starts out' },
      ],
    },
    yesNo('extra', 'Rolling a 6', 'Extra turn', 'No extra turn'),
    yesNo('capture', 'Landing on another counter', 'Sends it home', 'Nothing happens'),
    yesNo('exact', 'Getting home', 'Exact roll needed', 'Any roll'),
    DICE_STARTER_SPEC,
  ],
  ...engine,
  seatColours: engine.displayColours,
  makeBoard,
};

// House rule shared by the games.
export const STARTER_SPEC = {
  id: 'starter',
  label: 'Who goes first?',
  default: 'alternate',
  options: [
    { value: 'alternate', label: 'Take turns' },
    { value: 'loser', label: 'Loser goes first' },
    { value: 'first', label: 'Player 1 always' },
  ],
};

// For games with 2-4 players ("loser" has no meaning there).
export const DICE_STARTER_SPEC = {
  ...STARTER_SPEC,
  options: [STARTER_SPEC.options[0], STARTER_SPEC.options[2]],
};

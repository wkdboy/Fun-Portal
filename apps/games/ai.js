// Computer player strength. Level 10 always plays a best move; level 1 plays any legal move at random;
// levels between mix the two (level 5 plays a best move about 4 times in 9).
export function chooseMove(level, best, legal) {
  const chanceOfBest = (level - 1) / 9;
  const pool = Math.random() < chanceOfBest ? best : legal;
  return pool[Math.floor(Math.random() * pool.length)];
}

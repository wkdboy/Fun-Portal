// Sounds (graphemes) a grown-up can mark as "learned so far". Groups are for display only,
// not a teaching order. Check against school's list (see questions.md).
export const PHONICS_GROUPS = [
  { id: 'early', title: 'Early sounds', sounds: 's a t p i n m d g o c k ck e u r h b f ff l ll ss'.split(' ') },
  { id: 'single', title: 'More single letters and pairs', sounds: 'j v w x y z zz qu ch sh th ng nk'.split(' ') },
  { id: 'vowels', title: 'Vowel sounds', sounds: 'ai ee igh oa oo ar or ur ow oi ear air ure er'.split(' ') },
];
export const PHONICS_DEFAULT_LEARNED = PHONICS_GROUPS[0].sounds.slice();

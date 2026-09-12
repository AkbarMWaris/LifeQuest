export const DIFFICULTY_REWARDS = {
  easy: { xp: 10, gold: 5 },
  medium: { xp: 25, gold: 12 },
  hard: { xp: 50, gold: 25 },
  boss: { xp: 200, gold: 100 },
};

export const QUEST_TYPES = ['one_off', 'daily', 'weekly', 'boss'];
export const DIFFICULTIES = ['easy', 'medium', 'hard', 'boss'];
export const ATTRIBUTES = ['strength', 'focus', 'creativity', 'social', 'discipline'];

export function rewardForDifficulty(difficulty) {
  const r = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.easy;
  return { xp: r.xp, gold: r.gold };
}
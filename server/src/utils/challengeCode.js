import { User } from '../models/User.js';

export function randomChallengeCode() {
  const digits = String(Math.floor(100000 + Math.random() * 900000));
  return `LQ-${digits}`;
}

export async function assignChallengeCode(user) {
  if (user.challengeCode) return user.challengeCode;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = randomChallengeCode();
    const dup = await User.exists({ challengeCode: code });
    if (!dup) {
      user.challengeCode = code;
      await user.save();
      return code;
    }
  }
  throw new Error('Could not assign a unique challenge code.');
}

export async function ensureChallengeCodes() {
  const missing = await User.find({
    $or: [{ challengeCode: { $exists: false } }, { challengeCode: null }, { challengeCode: '' }],
  });
  for (const user of missing) {
    await assignChallengeCode(user);
  }
  if (missing.length > 0) {
    console.log(`[LifeQuest] Backfilled challenge codes for ${missing.length} user(s).`);
  }
}

export function normalizeChallengeCode(input) {
  return `LQ-${String(input || '').replace(/[^0-9]/g, '').slice(0, 6)}`;
}
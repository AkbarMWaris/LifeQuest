import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { UserItem } from '../models/UserItem.js';
import { levelProgress } from './xp.js';

export async function buildProfilePayload(userId) {
  const [profile, user] = await Promise.all([
    Profile.findOne({ userId }).lean(),
    User.findById(userId).select('-passwordHash').lean(),
  ]);
  const equipped = await UserItem.find({ userId, isEquipped: true }).populate('itemId').lean();
  const equippedItems = equipped.map((e) => ({
    id: String(e._id),
    itemId: String(e.itemId._id),
    name: e.itemId.name,
    type: e.itemId.type,
    rarity: e.itemId.rarity,
    icon: e.itemId.icon,
    effectJson: e.itemId.effectJson || {},
  }));

  const progress = levelProgress(profile.totalXp);
  const nowMs = Date.now();
  const activeBuffs = Array.isArray(profile.activeBuffs)
    ? profile.activeBuffs
        .filter((b) => new Date(b.expiresAt).getTime() > nowMs)
        .map((b) => ({ name: b.name, multiplier: b.multiplier, goldMultiplier: b.goldMultiplier, expiresAt: b.expiresAt }))
    : [];

  return {
    user: {
      id: String(user._id),
      email: user.email,
      displayName: user.displayName,
      challengeCode: user.challengeCode,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
    },
    profile: {
      id: String(profile._id),
      currentLevel: profile.currentLevel,
      totalXp: profile.totalXp,
      gold: profile.gold,
      streak: profile.streak,
      longestStreak: profile.longestStreak,
      totalCompletions: profile.totalCompletions,
      streakFreezeActive: profile.streakFreezeActive,
      activeBuffs,
      lastActiveDate: profile.lastActiveDate,
      attributes: profile.attributes,
      progress,
    },
    equippedItems,
  };
}
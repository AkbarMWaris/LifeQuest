import { ShopItem } from '../models/ShopItem.js';
import { UserItem } from '../models/UserItem.js';
import { GoldLog } from '../models/GoldLog.js';
import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';

export const RARITY_WEIGHTS = ['common', 'common', 'common', 'common', 'common', 'common', 'common', 'rare', 'rare', 'rare', 'legendary'];

export function rollRarity() {
  const idx = Math.floor(Math.random() * RARITY_WEIGHTS.length);
  return RARITY_WEIGHTS[idx];
}

export async function rollLoot(userId, profile) {
  const rarity = rollRarity();
  const pool = await ShopItem.find({ type: { $in: ['cosmetic', 'title'] }, rarity, isActive: true }).lean();
  if (pool.length === 0) return null;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const existing = await UserItem.findOne({ userId, itemId: item._id });
  if (existing) return null;
  const userItem = await UserItem.create({ userId, itemId: item._id, acquiredAt: new Date() });
  await GoldLog.create({
    userId,
    delta: 0,
    balanceAfter: profile.gold,
    reason: 'loot_drop',
    timestamp: new Date(),
  });
  return {
    id: String(userItem._id),
    itemId: String(item._id),
    name: item.name,
    type: item.type,
    rarity: item.rarity,
    icon: item.icon,
    description: item.description,
  };
}

function meetsRequirement(key, profile, quest) {
  switch (key) {
    case 'first_blood':
      return profile.totalCompletions >= 1;
    case 'century':
      return profile.totalCompletions >= 100;
    case 'seasoned':
      return profile.totalCompletions >= 25;
    case 'level_5':
      return profile.currentLevel >= 5;
    case 'level_10':
      return profile.currentLevel >= 10;
    case 'level_20':
      return profile.currentLevel >= 20;
    case 'streak_7':
      return profile.longestStreak >= 7 || profile.streak >= 7;
    case 'streak_30':
      return profile.longestStreak >= 30 || profile.streak >= 30;
    case 'gold_500':
      return profile.gold >= 500;
    case 'gold_1500':
      return profile.gold >= 1500;
    case 'gold_5000':
      return profile.gold >= 5000;
    case 'boss_slayer':
      return Boolean(quest && quest.difficulty === 'boss');
    case 'attribute_5':
      return Object.values(profile.attributes).some((a) => (a?.level || 1) >= 5);
    case 'attribute_10':
      return Object.values(profile.attributes).some((a) => (a?.level || 1) >= 10);
    case 'balanced_soul':
      return Object.values(profile.attributes).filter((a) => (a?.level || 1) >= 3).length >= 5;
    case 'habit_rune':
      return Boolean(quest && quest.type === 'daily' && profile.totalCompletions >= 3);
    default:
      return false;
  }
}

export async function applyAchievements(userId, profile, quest) {
  const defs = await Achievement.find({}).lean();
  const unlocked = await UserAchievement.find({ userId }).select('achievementId').lean();
  const unlockedIds = new Set(unlocked.map((u) => String(u.achievementId)));
  const newly = [];
  for (const def of defs) {
    if (unlockedIds.has(String(def._id))) continue;
    if (meetsRequirement(def.key, profile, quest)) {
      await UserAchievement.create({ userId, achievementId: def._id });
      newly.push({ id: String(def._id), key: def.key, name: def.name, description: def.description, icon: def.icon, tier: def.tier });
    }
  }
  return newly;
}
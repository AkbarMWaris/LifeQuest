import { ShopItem } from './models/ShopItem.js';
import { Achievement } from './models/Achievement.js';

export const SHOP_BLUEPRINTS = [
  // Buffs
  {
    name: 'Elixir of Focus',
    type: 'buff',
    costGold: 60,
    rarity: 'common',
    icon: '🧪',
    description: 'A shimmering tonic. Gain 1.5× XP for the next 60 minutes.',
    effectJson: { multiplier: 1.5, durationMinutes: 60 },
  },
  {
    name: 'Grand Elixir of Ascension',
    type: 'buff',
    costGold: 180,
    rarity: 'rare',
    icon: '⚗️',
    description: 'A potent brew. Gain 2× XP for the next 45 minutes.',
    effectJson: { multiplier: 2, durationMinutes: 45 },
  },
  {
    name: 'Golden Hourglass',
    type: 'buff',
    costGold: 300,
    rarity: 'rare',
    icon: '⏳',
    description: 'A gilded hourglass of the merchants. Doubles gold earned from quests for 45 minutes.',
    effectJson: { goldMultiplier: 2, durationMinutes: 45 },
  },
  {
    name: 'Heartstone of Memory',
    type: 'streak_freeze',
    costGold: 90,
    rarity: 'rare',
    icon: '🧿',
    description: 'Protects your streak from one missed day.',
    effectJson: {},
  },

  // Cosmetic frames
  {
    name: 'Ember Guard Frame',
    type: 'cosmetic',
    costGold: 120,
    rarity: 'common',
    icon: '🔶',
    description: 'A frame of forged embers that frames your banner.',
    effectJson: { frame: 'ember' },
  },
  {
    name: 'Arcane Sigil Frame',
    type: 'cosmetic',
    costGold: 320,
    rarity: 'rare',
    icon: '🔮',
    description: 'Runes of the old court glow around your banner.',
    effectJson: { frame: 'arcane' },
  },
  {
    name: 'Void Dragon Frame',
    type: 'cosmetic',
    costGold: 900,
    rarity: 'legendary',
    icon: '🐉',
    description: 'Forged from the scales of a void dragon. A masterpiece.',
    effectJson: { frame: 'void' },
  },

  // Titles
  {
    name: 'Title: Dawnwalker',
    type: 'title',
    costGold: 150,
    rarity: 'common',
    icon: '🌅',
    description: 'Stands before you as Dawnwalker — master of the morning.',
    effectJson: { title: 'Dawnwalker' },
  },
  {
    name: 'Title: Stormforged',
    type: 'title',
    costGold: 400,
    rarity: 'rare',
    icon: '⚡',
    description: 'The Stormforged — tempered by relentless discipline.',
    effectJson: { title: 'Stormforged' },
  },
  {
    name: 'Title: Godslayer of Habits',
    type: 'title',
    costGold: 1200,
    rarity: 'legendary',
    icon: '👑',
    description: 'Few bear this title. Fewer deserve it.',
    effectJson: { title: 'Godslayer of Habits' },
  },
];

export const ACHIEVEMENT_BLUEPRINTS = [
  { key: 'first_blood', name: 'First Blood', description: 'Complete your very first quest.', icon: '🗡️', tier: 'bronze' },
  { key: 'habit_rune', name: 'Habit Rune', description: 'Complete your first daily habit.', icon: '📿', tier: 'bronze' },
  { key: 'seasoned', name: 'Seasoned', description: 'Complete 25 quests.', icon: '⚔️', tier: 'silver' },
  { key: 'century', name: 'Century', description: 'Complete 100 quests.', icon: '🏺', tier: 'silver' },
  { key: 'level_5', name: 'Path of the Adept', description: 'Reach level 5.', icon: '🌟', tier: 'bronze' },
  { key: 'level_10', name: 'Path of the Veteran', description: 'Reach level 10.', icon: '🔥', tier: 'silver' },
  { key: 'level_20', name: 'Path of the Legend', description: 'Reach level 20.', icon: '💠', tier: 'gold' },
  { key: 'streak_7', name: 'Week of Will', description: 'Hold a 7-day streak.', icon: '🕯️', tier: 'bronze' },
  { key: 'streak_30', name: 'Lunar Discipline', description: 'Hold a 30-day streak.', icon: '🌙', tier: 'gold' },
  { key: 'gold_500', name: 'Purse of Iron', description: 'Amass 500 gold.', icon: '🪙', tier: 'bronze' },
  { key: 'gold_1500', name: 'Purse of Silver', description: 'Amass 1,500 gold.', icon: '💰', tier: 'silver' },
  { key: 'gold_5000', name: 'Dragon Hoard', description: 'Amass 5,000 gold.', icon: '🏆', tier: 'legendary' },
  { key: 'boss_slayer', name: 'Boss Slayer', description: 'Defeat a Boss quest.', icon: '⚡', tier: 'silver' },
  { key: 'attribute_5', name: 'Cultivate a Spark', description: 'Raise any attribute to level 5.', icon: '🌱', tier: 'bronze' },
  { key: 'attribute_10', name: 'Ascended Aspect', description: 'Raise any attribute to level 10.', icon: '🌌', tier: 'gold' },
  { key: 'balanced_soul', name: 'Balanced Soul', description: 'Reach level 3 in every attribute.', icon: '✨', tier: 'legendary' },
];

export async function ensureSeedData() {
  const shopCount = await ShopItem.countDocuments();
  const achCount = await Achievement.countDocuments();

  if (shopCount === 0) {
    await ShopItem.insertMany(SHOP_BLUEPRINTS);
    console.log(`[LifeQuest] Seeded ${SHOP_BLUEPRINTS.length} shop items.`);
  } else {
    const existingNames = new Set((await ShopItem.find({}).select('name').lean()).map((i) => i.name));
    const missing = SHOP_BLUEPRINTS.filter((b) => !existingNames.has(b.name));
    if (missing.length > 0) {
      await ShopItem.insertMany(missing);
      console.log(`[LifeQuest] Shop synced — added ${missing.length} new item(s).`);
    } else {
      console.log(`[LifeQuest] Shop already seeded (${shopCount} items).`);
    }
  }

  if (achCount === 0) {
    await Achievement.insertMany(ACHIEVEMENT_BLUEPRINTS);
    console.log(`[LifeQuest] Seeded ${ACHIEVEMENT_BLUEPRINTS.length} achievements.`);
  } else {
    console.log(`[LifeQuest] Achievements already seeded (${achCount}).`);
  }
}
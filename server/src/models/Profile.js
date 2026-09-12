import mongoose from 'mongoose';

const attributeSchema = new mongoose.Schema(
  {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  { _id: false }
);

const buffSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserItem' },
    name: { type: String, default: 'Elixir' },
    multiplier: { type: Number, default: 1 },
    goldMultiplier: { type: Number, default: 1 },
    expiresAt: { type: Date, required: true },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    currentLevel: { type: Number, default: 1 },
    totalXp: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null },
    totalCompletions: { type: Number, default: 0 },
    activeBuffs: { type: [buffSchema], default: [] },
    streakFreezeActive: { type: Boolean, default: false },
    attributes: {
      strength: { type: attributeSchema, default: () => ({}) },
      focus: { type: attributeSchema, default: () => ({}) },
      creativity: { type: attributeSchema, default: () => ({}) },
      social: { type: attributeSchema, default: () => ({}) },
      discipline: { type: attributeSchema, default: () => ({}) },
    },
    equippedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserItem' }],
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);

export function emptyAttributes() {
  return {
    strength: { xp: 0, level: 1 },
    focus: { xp: 0, level: 1 },
    creativity: { xp: 0, level: 1 },
    social: { xp: 0, level: 1 },
    discipline: { xp: 0, level: 1 },
  };
}
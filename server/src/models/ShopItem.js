import mongoose from 'mongoose';

const shopItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['cosmetic', 'buff', 'title', 'streak_freeze'], required: true },
    costGold: { type: Number, required: true, min: 0 },
    effectJson: { type: mongoose.Schema.Types.Mixed, default: {} },
    description: { type: String, default: '' },
    details: { type: String, default: '' },
    rarity: { type: String, enum: ['common', 'rare', 'legendary'], default: 'common' },
    icon: { type: String, default: '✨' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ShopItem = mongoose.model('ShopItem', shopItemSchema);
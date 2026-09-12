import mongoose from 'mongoose';

const userItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem', required: true },
    acquiredAt: { type: Date, default: Date.now },
    isEquipped: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    used: { type: Boolean, default: false },
  },
  { timestamps: false }
);

export const UserItem = mongoose.model('UserItem', userItemSchema);
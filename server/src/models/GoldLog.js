import mongoose from 'mongoose';

const goldLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    delta: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: { type: String, enum: ['quest_completion', 'streak_bonus', 'shop_purchase', 'loot_drop', 'admin_adjustment'], default: 'quest_completion' },
    completionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Completion', default: null },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const GoldLog = mongoose.model('GoldLog', goldLogSchema);
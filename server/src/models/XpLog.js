import mongoose from 'mongoose';

const xpLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    attribute: { type: String, default: null },
    delta: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: { type: String, enum: ['quest_completion', 'streak_bonus', 'shop_purchase', 'loot_drop', 'admin_adjustment', 'challenge_win'], default: 'quest_completion' },
    completionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Completion', default: null },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const XpLog = mongoose.model('XpLog', xpLogSchema);
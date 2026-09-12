import mongoose from 'mongoose';

const completionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest', required: true, index: true },
    questTitle: { type: String, default: '' },
    completedAt: { type: Date, required: true, index: true },
    xpAwarded: { type: Number, required: true },
    goldAwarded: { type: Number, required: true },
    streakBonus: { type: Number, default: 0 },
    source: { type: String, enum: ['manual', 'auto'], default: 'manual' },
    clientMeta: {
      ipAddress: { type: String, default: '' },
      userAgent: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

completionSchema.index({ userId: 1, completedAt: -1 });

export const Completion = mongoose.model('Completion', completionSchema);
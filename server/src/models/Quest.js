import mongoose from 'mongoose';

const questSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 500 },
    type: { type: String, enum: ['one_off', 'daily', 'weekly', 'boss'], default: 'one_off' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'boss'], default: 'easy' },
    xpReward: { type: Number, required: true, min: 1 },
    goldReward: { type: Number, required: true, min: 0 },
    attribute: { type: String, enum: ['strength', 'focus', 'creativity', 'social', 'discipline'], default: 'focus' },
    scheduleRule: { type: String, default: '' },
    deadline: { type: Date, default: null },
    lastCompletedAt: { type: Date, default: null },
    lastCompletedDate: { type: String, default: null },
    completedCount: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

questSchema.index({ userId: 1, type: 1 });
questSchema.index({ userId: 1, isArchived: 1 });

export const Quest = mongoose.model('Quest', questSchema);
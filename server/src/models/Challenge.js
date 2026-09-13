import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengerName: { type: String, required: true, trim: true, maxlength: 40 },
    opponentName: { type: String, required: true, trim: true, maxlength: 40 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    attribute: {
      type: String,
      enum: ['strength', 'focus', 'creativity', 'social', 'discipline'],
      default: 'focus',
    },
    stakes: {
      xp: { type: Number, default: 10, min: 1, max: 1000 },
      gold: { type: Number, default: 5, min: 0, max: 100000 },
      durationMinutes: { type: Number, default: 5, min: 1, max: 60 },
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'expired', 'declined'],
      default: 'pending',
      index: true,
    },
    startsAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    loser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    xpAwarded: { type: Number, default: 0 },
    goldAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

challengeSchema.index({ challenger: 1, status: 1 });
challengeSchema.index({ opponent: 1, status: 1 });

export const Challenge = mongoose.model('Challenge', challengeSchema);
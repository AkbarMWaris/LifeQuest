import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🏆' },
    tier: { type: String, enum: ['bronze', 'silver', 'gold', 'legendary'], default: 'bronze' },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
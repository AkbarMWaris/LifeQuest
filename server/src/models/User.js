import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true, trim: true, maxlength: 40 },
    challengeCode: { type: String, unique: true, sparse: true, trim: true },
    avatarUrl: { type: String, default: '' },
    theme: { type: String, default: 'void' },
    timezone: { type: String, default: 'UTC' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
import { Router } from 'express';
import { Profile } from '../models/Profile.js';
import { GoldLog } from '../models/GoldLog.js';
import { auth, asyncHandler } from '../middleware/auth.js';

const router = Router();
router.use(auth);

const NORMALIZED_FIELD = {
  totalXp: [0, 30],
  streak: [0, 30],
  goldEarned: [0, 20],
  completions: [0, 20],
};

function normalize(values, value, weight) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return weight / 2;
  return ((value - min) / (max - min)) * weight;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const goldAgg = await GoldLog.aggregate([
      { $match: { delta: { $gt: 0 } } },
      { $group: { _id: '$userId', goldEarned: { $sum: '$delta' } } },
    ]);
    const goldByUser = new Map(goldAgg.map((g) => [String(g._id), g.goldEarned]));

    const profiles = await Profile.find({})
      .select('userId totalXp streak totalCompletions')
      .populate({ path: 'userId', select: 'displayName createdAt' })
      .lean();

    const raw = profiles
      .filter((p) => p.userId)
      .map((p) => ({
        userId: String(p.userId._id),
        name: p.userId.displayName || 'Unnamed hero',
        joined: p.userId.createdAt,
        streak: p.streak || 0,
        totalXp: p.totalXp || 0,
        goldEarned: goldByUser.get(String(p.userId._id)) || 0,
        completions: p.totalCompletions || 0,
      }));

    const xpAll = raw.map((r) => r.totalXp);
    const streakAll = raw.map((r) => r.streak);
    const goldAll = raw.map((r) => r.goldEarned);
    const compAll = raw.map((r) => r.completions);

    const entries = raw
      .map((r) => {
        const overallScore =
          normalize(xpAll, r.totalXp, NORMALIZED_FIELD.totalXp[1]) +
          normalize(streakAll, r.streak, NORMALIZED_FIELD.streak[1]) +
          normalize(goldAll, r.goldEarned, NORMALIZED_FIELD.goldEarned[1]) +
          normalize(compAll, r.completions, NORMALIZED_FIELD.completions[1]);
        return { ...r, overallScore: Math.round(overallScore * 100) / 100 };
      })
      .sort((a, b) => b.overallScore - a.overallScore)
      .map((e, i) => ({ ...e, rank: i + 1, me: e.userId === req.userId }));

    res.json({ entries });
  })
);

export default router;
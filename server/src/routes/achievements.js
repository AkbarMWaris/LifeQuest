import { Router } from 'express';
import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { auth, asyncHandler } from '../middleware/auth.js';
import { buildProfilePayload } from '../utils/profilePayload.js';

const router = Router();
router.use(auth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [defs, unlocked, payload] = await Promise.all([
      Achievement.find({}).sort({ createdAt: 1 }).lean(),
      UserAchievement.find({ userId: req.userId }).lean(),
      buildProfilePayload(req.userId),
    ]);
    const unlockedIds = new Set(unlocked.map((u) => String(u.achievementId)));
    const items = defs.map((d) => ({
      id: String(d._id),
      key: d.key,
      name: d.name,
      description: d.description,
      icon: d.icon,
      tier: d.tier,
      unlocked: unlockedIds.has(String(d._id)),
    }));
    const unlockedCount = items.filter((i) => i.unlocked).length;
    res.json({ items, unlockedCount, total: items.length, profile: payload.profile });
  })
);

export default router;
import { Router } from 'express';
import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';
import { auth, asyncHandler } from '../middleware/auth.js';
import { buildProfilePayload } from '../utils/profilePayload.js';

const router = Router();
router.use(auth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const payload = await buildProfilePayload(req.userId);
    res.json(payload);
  })
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const { displayName, avatarUrl, theme } = req.body || {};
    const update = {};
    if (displayName !== undefined) update.displayName = String(displayName).trim().slice(0, 40);
    if (avatarUrl !== undefined) update.avatarUrl = String(avatarUrl).slice(0, 500);
    if (theme !== undefined) update.theme = String(theme).slice(0, 40);

    if (Object.keys(update).length > 0) {
      await User.updateOne({ _id: req.userId }, { $set: update });
    }
    const payload = await buildProfilePayload(req.userId);
    res.json(payload);
  })
);

export default router;
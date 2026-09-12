import { Router } from 'express';
import { ShopItem } from '../models/ShopItem.js';
import { UserItem } from '../models/UserItem.js';
import { Profile } from '../models/Profile.js';
import { auth, asyncHandler } from '../middleware/auth.js';

const router = Router();
router.use(auth);

function serializeItem(item) {
  return {
    id: String(item.itemId._id),
    ownedId: String(item._id),
    name: item.itemId.name,
    type: item.itemId.type,
    rarity: item.itemId.rarity,
    icon: item.itemId.icon,
    description: item.itemId.description,
    effectJson: item.itemId.effectJson || {},
    isEquipped: item.isEquipped,
    used: item.used,
    expiresAt: item.expiresAt,
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await UserItem.find({ userId: req.userId, used: { $ne: true } })
      .populate('itemId')
      .sort({ acquiredAt: -1 })
      .lean();
    res.json(items.map(serializeItem));
  })
);

router.post(
  '/equip',
  asyncHandler(async (req, res) => {
    const { ownedId, equip } = req.body || {};
    const userItem = await UserItem.findOne({ _id: ownedId, userId: req.userId }).populate('itemId');
    if (!userItem) return res.status(404).json({ error: 'Item not found in your satchel.' });

    const profile = await Profile.findOne({ userId: req.userId });
    const cosmeticTypes = ['cosmetic', 'title'];

    if (equip === false) {
      userItem.isEquipped = false;
      await userItem.save();
      profile.equippedItems = profile.equippedItems.filter((id) => String(id) !== String(userItem._id));
      await profile.save();
      return res.json({ ok: true });
    }

    if (!cosmeticTypes.includes(userItem.itemId.type)) {
      return res.status(400).json({ error: 'Only cosmetics and titles can be equipped.' });
    }
    const equippedSameType = await UserItem.find({ userId: req.userId, isEquipped: true }).populate('itemId');
    for (const other of equippedSameType) {
      if (other.itemId.type === userItem.itemId.type) {
        other.isEquipped = false;
        await other.save();
        profile.equippedItems = profile.equippedItems.filter((id) => String(id) !== String(other._id));
      }
    }
    userItem.isEquipped = true;
    await userItem.save();
    profile.equippedItems.push(userItem._id);
    await profile.save();
    res.json({ ok: true });
  })
);

router.post(
  '/use',
  asyncHandler(async (req, res) => {
    const { ownedId } = req.body || {};
    const userItem = await UserItem.findOne({ _id: ownedId, userId: req.userId }).populate('itemId');
    if (!userItem || userItem.used) return res.status(404).json({ error: 'Item not found or already consumed.' });

    const profile = await Profile.findOne({ userId: req.userId });
    const { type, effectJson } = userItem.itemId;

    if (type === 'buff') {
      const expiresAt = new Date(Date.now() + (Number(effectJson.durationMinutes) || 60) * 60 * 1000);
      profile.activeBuffs.push({
        itemId: userItem._id,
        name: userItem.itemId.name,
        multiplier: Number(effectJson.multiplier) || 1,
        goldMultiplier: Number(effectJson.goldMultiplier) || 1,
        expiresAt,
      });
    } else if (type === 'streak_freeze') {
      profile.streakFreezeActive = true;
    } else {
      return res.status(400).json({ error: 'This item cannot be consumed.' });
    }

    userItem.used = true;
    await userItem.save();
    await profile.save();
    res.json({ ok: true });
  })
);

export default router;
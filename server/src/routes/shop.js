import { Router } from 'express';
import { ShopItem } from '../models/ShopItem.js';
import { Profile } from '../models/Profile.js';
import { UserItem } from '../models/UserItem.js';
import { GoldLog } from '../models/GoldLog.js';
import { auth, asyncHandler } from '../middleware/auth.js';

const router = Router();
router.use(auth);

function serialize(item) {
  return { id: String(item._id), name: item.name, type: item.type, costGold: item.costGold, description: item.description, details: item.details || item.description, rarity: item.rarity, icon: item.icon, effectJson: item.effectJson };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await ShopItem.find({ isActive: true }).sort({ costGold: 1 }).lean();
    res.json(items.map(serialize));
  })
);

router.post(
  '/purchase',
  asyncHandler(async (req, res) => {
    const { itemId } = req.body || {};
    const item = await ShopItem.findOne({ _id: itemId, isActive: true });
    if (!item) return res.status(404).json({ error: 'That item does not exist in the bazaar.' });

    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    if (profile.gold < item.costGold) {
      return res.status(400).json({ error: `Not enough gold. You need ${item.costGold - profile.gold} more.` });
    }

    profile.gold -= item.costGold;
    await profile.save();
    await GoldLog.create({ userId: req.userId, delta: -item.costGold, balanceAfter: profile.gold, reason: 'shop_purchase' });

    const userItem = await UserItem.create({
      userId: req.userId,
      itemId: item._id,
      acquiredAt: new Date(),
      isEquipped: false,
    });

    res.status(201).json({ item: { ...serialize(item), ownedId: String(userItem._id) }, gold: profile.gold });
  })
);

export default router;
import { Router } from 'express';
import { Quest } from '../models/Quest.js';
import { Profile } from '../models/Profile.js';
import { Completion } from '../models/Completion.js';
import { XpLog } from '../models/XpLog.js';
import { GoldLog } from '../models/GoldLog.js';
import { auth, asyncHandler } from '../middleware/auth.js';
import { levelFromXp } from '../utils/xp.js';
import { dateKey, weekStartKey, daysBetween, milestoneBonusFor } from '../utils/streaks.js';
import { buildProfilePayload } from '../utils/profilePayload.js';
import { rollLoot, applyAchievements } from '../utils/loot.js';

const router = Router();
router.use(auth);

const COMPLETIONS_PER_HOUR = 40;
const QUEST_COOLDOWN_MS = 15000;

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const before = req.query.before ? new Date(req.query.before) : new Date();
    const completions = await Completion.find({ userId: req.userId, completedAt: { $lt: before } })
      .sort({ completedAt: -1 })
      .limit(limit)
      .lean();
    res.json(completions);
  })
);

router.post(
  '/quests/:id/complete',
  asyncHandler(async (req, res) => {
    const quest = await Quest.findOne({ _id: req.params.id, userId: req.userId });
    if (!quest || quest.isArchived) return res.status(404).json({ error: 'Quest not found.' });

    const today = dateKey();
    const now = new Date();

    if (quest.type === 'one_off' && quest.completedCount > 0) {
      return res.status(409).json({ error: 'This quest may only be completed once, hero.' });
    }
    if (quest.type === 'daily' && quest.lastCompletedDate === today) {
      return res.status(409).json({ error: 'Already completed today. The quest renews at dawn.' });
    }
    if (quest.type === 'weekly' && quest.lastCompletedDate === weekStartKey()) {
      return res.status(409).json({ error: 'Already completed this week. The boss returns next week.' });
    }
    if (quest.lastCompletedAt && now.getTime() - new Date(quest.lastCompletedAt).getTime() < QUEST_COOLDOWN_MS) {
      return res.status(429).json({ error: 'Easy, hero — catch your breath before striking again.' });
    }

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await Completion.countDocuments({ userId: req.userId, completedAt: { $gt: hourAgo } });
    if (recentCount >= COMPLETIONS_PER_HOUR) {
      return res.status(429).json({ error: 'You move too fast for the realm. Rest, then return.' });
    }

    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    let streak = profile.streak || 0;
    if (profile.lastActiveDate !== today) {
      const yesterday = dateKey(new Date(Date.now() - 86400000));
      if (profile.lastActiveDate === yesterday) {
        streak += 1;
      } else if (profile.lastActiveDate !== null) {
        if (profile.streakFreezeActive) {
          profile.streakFreezeActive = false;
        } else {
          streak = 1;
        }
      } else {
        streak = 1;
      }
    }
    profile.lastActiveDate = today;
    profile.streak = streak;
    if (streak > profile.longestStreak) profile.longestStreak = streak;

    const bonus = milestoneBonusFor(streak);

    const nowMs = Date.now();
    if (Array.isArray(profile.activeBuffs)) {
      profile.activeBuffs = profile.activeBuffs.filter((b) => new Date(b.expiresAt).getTime() > nowMs);
    }
    const multiplier = Array.isArray(profile.activeBuffs) && profile.activeBuffs.length > 0
      ? Math.max(...profile.activeBuffs.map((b) => Number(b.multiplier) || 1))
      : 1;

    const xpAwarded = Math.round(quest.xpReward * multiplier);
    const totalXpAwarded = xpAwarded + bonus.xp;
    const goldAwarded = quest.goldReward + bonus.gold;

    const attr = quest.attribute;
    profile.attributes[attr].xp += totalXpAwarded;
    const attrLevel = levelFromXp(profile.attributes[attr].xp);
    const attrLeveledUp = attrLevel > profile.attributes[attr].level;
    profile.attributes[attr].level = attrLevel;

    const prevLevel = profile.currentLevel;
    profile.totalXp += totalXpAwarded;
    profile.currentLevel = levelFromXp(profile.totalXp);
    const levelUps = Math.max(0, profile.currentLevel - prevLevel);
    profile.gold += goldAwarded;
    profile.totalCompletions += 1;

    quest.lastCompletedAt = now;
    quest.lastCompletedDate = quest.type === 'weekly' ? weekStartKey() : today;
    quest.completedCount += 1;
    await quest.save();

    const completion = await Completion.create({
      userId: req.userId,
      questId: quest._id,
      questTitle: quest.title,
      completedAt: now,
      xpAwarded: totalXpAwarded,
      goldAwarded,
      streakBonus: bonus.xp,
      source: 'manual',
      clientMeta: {
        ipAddress: String(req.ip || ''),
        userAgent: String(req.headers['user-agent'] || '').slice(0, 250),
      },
    });

    if (xpAwarded > 0) {
      await XpLog.create({ userId: req.userId, attribute: attr, delta: xpAwarded, balanceAfter: profile.totalXp, reason: 'quest_completion', completionId: completion._id });
    }
    if (bonus.xp > 0) {
      await XpLog.create({ userId: req.userId, attribute: attr, delta: bonus.xp, balanceAfter: profile.totalXp, reason: 'streak_bonus', completionId: completion._id });
    }
    await GoldLog.create({ userId: req.userId, delta: goldAwarded, balanceAfter: profile.gold, reason: 'quest_completion', completionId: completion._id });

    const loot = quest.difficulty === 'boss' ? await rollLoot(req.userId, profile) : null;
    const unlockedAchievements = await applyAchievements(req.userId, profile, quest);

    await profile.save();
    const payload = await buildProfilePayload(req.userId);

    res.json({
      message: 'Quest complete!',
      rewards: { xp: totalXpAwarded, gold: goldAwarded, streakBonus: bonus.xp, streak, multiplier },
      levelUps,
      attrLeveledUp,
      attr,
      loot,
      unlockedAchievements,
      payload,
    });
  })
);

export default router;
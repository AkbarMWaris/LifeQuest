import { Router } from 'express';
import { Challenge } from '../models/Challenge.js';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { XpLog } from '../models/XpLog.js';
import { GoldLog } from '../models/GoldLog.js';
import { auth, asyncHandler } from '../middleware/auth.js';
import { levelFromXp } from '../utils/xp.js';
import { buildProfilePayload } from '../utils/profilePayload.js';
import { normalizeChallengeCode } from '../utils/challengeCode.js';
import { ATTRIBUTES } from '../utils/rewards.js';

const router = Router();
router.use(auth);

const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
const LIMITS = { xp: [1, 1000], gold: [0, 100000], durationMinutes: [1, 60] };
const DEFAULT_STAKES = { xp: 15, gold: 10, durationMinutes: 5 };

function clamp(value, [min, max], fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function mapChallenge(c, meId) {
  const challengerId = String(c.challenger?._id || c.challenger);
  const isChallenger = challengerId === String(meId);
  return {
    ...c,
    id: String(c._id),
    challenger: challengerId,
    opponent: String(c.opponent?._id || c.opponent),
    challengerName: c.challengerName,
    opponentName: c.opponentName,
    winnerName: c.winner
      ? String(c.winner) === challengerId
        ? c.challengerName
        : c.opponentName
      : null,
    loserName: c.winner
      ? String(c.winner) === challengerId
        ? c.opponentName
        : c.challengerName
      : null,
    role: isChallenger ? 'challenger' : 'opponent',
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const now = new Date();
    // Sweep: pending past the 24h window, or active past its timer.
    await Challenge.updateMany(
      { $or: [{ challenger: req.userId }, { opponent: req.userId }], status: 'pending', expiresAt: { $lt: now } },
      { $set: { status: 'expired' } }
    );
    await Challenge.updateMany(
      { $or: [{ challenger: req.userId }, { opponent: req.userId }], status: 'active', expiresAt: { $lt: now } },
      { $set: { status: 'expired' } }
    );

    const mine = await Challenge.find({ $or: [{ challenger: req.userId }, { opponent: req.userId }] })
      .sort({ createdAt: -1 })
      .lean();
    res.json(mine.map((c) => mapChallenge(c, req.userId)));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { opponentCode, title, attribute, xp, gold, durationMinutes } = req.body || {};

    const code = normalizeChallengeCode(opponentCode);
    if (!/^LQ-\d{6}$/.test(code)) return res.status(400).json({ error: 'Enter a valid challenge code (e.g. LQ-482913).' });

    const me = await User.findById(req.userId);
    if (!me || me.challengeCode === code) return res.status(400).json({ error: "You can't challenge yourself, hero." });

    const opponent = await User.findOne({ challengeCode: code });
    if (!opponent) return res.status(404).json({ error: 'No adventurer found with that code.' });

    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) return res.status(400).json({ error: 'Give your challenge a name.' });

    const stakes = {
      xp: clamp(xp, LIMITS.xp, DEFAULT_STAKES.xp),
      gold: clamp(gold, LIMITS.gold, DEFAULT_STAKES.gold),
      durationMinutes: clamp(durationMinutes, LIMITS.durationMinutes, DEFAULT_STAKES.durationMinutes),
    };
    const cleanAttr = ATTRIBUTES.includes(attribute) ? attribute : 'focus';

    const challenge = await Challenge.create({
      challenger: req.userId,
      opponent: opponent._id,
      challengerName: me.displayName,
      opponentName: opponent.displayName,
      title: cleanTitle.slice(0, 120),
      attribute: cleanAttr,
      stakes,
      expiresAt: new Date(Date.now() + PENDING_TTL_MS),
    });

    res.status(201).json(mapChallenge(challenge.toObject(), req.userId));
  })
);

router.post(
  '/:id/accept',
  asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });
    if (String(challenge.opponent) !== String(req.userId)) {
      return res.status(403).json({ error: 'Only the challenged hero can accept.' });
    }
    if (challenge.status !== 'pending') return res.status(409).json({ error: 'This challenge is no longer waiting.' });
    if (challenge.expiresAt < new Date()) {
      challenge.status = 'expired';
      await challenge.save();
      return res.status(409).json({ error: 'This challenge expired before it was accepted.' });
    }

    const startsAt = new Date();
    challenge.status = 'active';
    challenge.startsAt = startsAt;
    challenge.expiresAt = new Date(startsAt.getTime() + challenge.stakes.durationMinutes * 60 * 1000);
    await challenge.save();
    res.json(mapChallenge(challenge.toObject(), req.userId));
  })
);

router.post(
  '/:id/decline',
  asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });
    if (String(challenge.opponent) !== String(req.userId)) {
      return res.status(403).json({ error: 'Only the challenged hero can decline.' });
    }
    if (challenge.status !== 'pending') return res.status(409).json({ error: 'This challenge is no longer waiting.' });
    challenge.status = 'declined';
    await challenge.save();
    res.json(mapChallenge(challenge.toObject(), req.userId));
  })
);

router.post(
  '/:id/complete',
  asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });
    if (String(challenge.challenger) !== String(req.userId) && String(challenge.opponent) !== String(req.userId)) {
      return res.status(403).json({ error: 'This challenge is not yours.' });
    }
    if (challenge.status !== 'active') return res.status(409).json({ error: 'This challenge is not running.' });

    const now = new Date();
    const otherId =
      String(challenge.challenger) === String(req.userId) ? challenge.opponent : challenge.challenger;

    // Atomic claim: only the first caller can mark this challenge complete.
    const updated = await Challenge.findOneAndUpdate(
      { _id: challenge._id, status: 'active', expiresAt: { $gte: now } },
      {
        $set: {
          status: 'completed',
          completedAt: now,
          winner: req.userId,
          loser: otherId,
          xpAwarded: challenge.stakes.xp * 2,
          goldAwarded: challenge.stakes.gold * 2,
        },
      },
      { new: true }
    );
    if (!updated) {
      return res.status(409).json({ error: 'The challenge already finished or the timer ran out.' });
    }

    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const xpAwarded = updated.xpAwarded;
    const goldAwarded = updated.goldAwarded;
    const attr = updated.attribute;

    profile.attributes[attr].xp += xpAwarded;
    const attrLevel = levelFromXp(profile.attributes[attr].xp);
    const attrLeveledUp = attrLevel > profile.attributes[attr].level;
    profile.attributes[attr].level = attrLevel;

    const prevLevel = profile.currentLevel;
    profile.totalXp += xpAwarded;
    profile.currentLevel = levelFromXp(profile.totalXp);
    const levelUps = Math.max(0, profile.currentLevel - prevLevel);
    profile.gold += goldAwarded;
    await profile.save();

    if (xpAwarded > 0) {
      await XpLog.create({ userId: req.userId, attribute: attr, delta: xpAwarded, balanceAfter: profile.totalXp, reason: 'challenge_win' });
    }
    if (goldAwarded > 0) {
      await GoldLog.create({ userId: req.userId, delta: goldAwarded, balanceAfter: profile.gold, reason: 'challenge_win' });
    }

    const payload = await buildProfilePayload(req.userId);
    res.json({
      message: 'You win the challenge!',
      rewards: { xp: xpAwarded, gold: goldAwarded },
      levelUps,
      attrLeveledUp,
      attr,
      payload,
    });
  })
);

export default router;
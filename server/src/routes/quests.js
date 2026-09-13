import { Router } from 'express';
import { Quest } from '../models/Quest.js';
import { auth, asyncHandler } from '../middleware/auth.js';
import { rewardForDifficulty, QUEST_TYPES, DIFFICULTIES, ATTRIBUTES } from '../utils/rewards.js';

const router = Router();
router.use(auth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { type, difficulty, attribute, archived } = req.query;
    const filter = { userId: req.userId, isArchived: archived === 'true' };
    if (QUEST_TYPES.includes(type)) filter.type = type;
    if (DIFFICULTIES.includes(difficulty)) filter.difficulty = difficulty;
    if (ATTRIBUTES.includes(attribute)) filter.attribute = attribute;
    const quests = await Quest.find(filter).sort({ createdAt: -1 }).lean();
    res.json(quests.map((q) => ({ ...q, id: String(q._id) })));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, description, type, difficulty, attribute, scheduleRule, deadline } = req.body || {};
    if (!title || !String(title).trim()) return res.status(400).json({ error: 'Give your quest a name.' });

    const qType = QUEST_TYPES.includes(type) ? type : 'one_off';
    const qDiff = DIFFICULTIES.includes(difficulty) ? difficulty : 'easy';
    const qAttr = ATTRIBUTES.includes(attribute) ? attribute : 'focus';
    const rewards = rewardForDifficulty(qDiff);

    const quest = await Quest.create({
      userId: req.userId,
      title: String(title).trim(),
      description: String(description || '').trim(),
      type: qType,
      difficulty: qDiff,
      attribute: qAttr,
      xpReward: rewards.xp,
      goldReward: rewards.gold,
      scheduleRule: String(scheduleRule || ''),
      deadline: deadline ? new Date(deadline) : null,
    });
    res.status(201).json({ ...quest.toObject(), id: String(quest._id) });
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const quest = await Quest.findOne({ _id: req.params.id, userId: req.userId });
    if (!quest) return res.status(404).json({ error: 'Quest not found.' });

    const { title, description, deadline, scheduleRule } = req.body || {};
    if (title !== undefined) quest.title = String(title).trim();
    if (description !== undefined) quest.description = String(description).trim();
    if (scheduleRule !== undefined) quest.scheduleRule = String(scheduleRule);
    if (deadline !== undefined) quest.deadline = deadline ? new Date(deadline) : null;
    await quest.save();
    res.json({ ...quest.toObject(), id: String(quest._id) });
  })
);

router.patch(
  '/:id/archive',
  asyncHandler(async (req, res) => {
    const quest = await Quest.findOne({ _id: req.params.id, userId: req.userId });
    if (!quest) return res.status(404).json({ error: 'Quest not found.' });
    quest.isArchived = true;
    await quest.save();
    res.json({ ...quest.toObject(), id: String(quest._id) });
  })
);

router.patch(
  '/:id/unarchive',
  asyncHandler(async (req, res) => {
    const quest = await Quest.findOne({ _id: req.params.id, userId: req.userId });
    if (!quest) return res.status(404).json({ error: 'Quest not found.' });
    quest.isArchived = false;
    await quest.save();
    res.json({ ...quest.toObject(), id: String(quest._id) });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const quest = await Quest.findOne({ _id: req.params.id, userId: req.userId });
    if (!quest) return res.status(404).json({ error: 'Quest not found.' });
    await quest.deleteOne();
    res.json({ ok: true });
  })
);

export default router;
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Profile, emptyAttributes } from '../models/Profile.js';
import { Session } from '../models/Session.js';
import { auth, asyncHandler } from '../middleware/auth.js';
import { signTokens, hashRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { buildProfilePayload } from '../utils/profilePayload.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createSession(userId, refreshToken) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return Session.create({ userId, refreshHash: hashRefreshToken(refreshToken), expiresAt });
}

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { email, password, displayName } = req.body || {};
    if (!EMAIL_RE.test(String(email || ''))) return res.status(400).json({ error: 'Send a valid email.' });
    if (!password || String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    if (!displayName || !String(displayName).trim()) return res.status(400).json({ error: 'Choose a hero name.' });

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(409).json({ error: 'An adventurer with that email already exists.' });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      email: String(email).toLowerCase(),
      passwordHash,
      displayName: String(displayName).trim(),
    });
    await Profile.create({ userId: user._id, attributes: emptyAttributes() });

    const { accessToken, refreshToken } = signTokens(user._id);
    await createSession(user._id, refreshToken);
    const payload = await buildProfilePayload(user._id);
    res.status(201).json({ accessToken, refreshToken, ...payload });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Unknown adventurer. Check your email.' });
    const ok = await bcrypt.compare(String(password || ''), user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Wrong password, hero. The lock refuses you.' });

    const { accessToken, refreshToken } = signTokens(user._id);
    await createSession(user._id, refreshToken);
    const payload = await buildProfilePayload(user._id);
    res.json({ accessToken, refreshToken, ...payload });
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required.' });
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ error: 'Refresh token expired. Log in again.' });
    }
    const session = await Session.findOne({ refreshHash: hashRefreshToken(refreshToken), userId: payload.uid });
    if (!session) return res.status(401).json({ error: 'Session revoked. Log in again.' });
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({ error: 'Session expired. Log in again.' });
    }
    await Session.deleteOne({ _id: session._id });
    const { accessToken, refreshToken: nextRefresh } = signTokens(payload.uid);
    await createSession(payload.uid, nextRefresh);
    res.json({ accessToken, refreshToken: nextRefresh });
  })
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body || {};
    if (refreshToken) await Session.deleteOne({ refreshHash: hashRefreshToken(refreshToken) });
    res.json({ ok: true });
  })
);

router.get(
  '/me',
  auth,
  asyncHandler(async (req, res) => {
    const payload = await buildProfilePayload(req.userId);
    if (!payload.profile) return res.status(404).json({ error: 'Profile not found.' });
    res.json(payload);
  })
);

export default router;
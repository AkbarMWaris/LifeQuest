import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useQuestActions } from '../hooks/useQuestActions.js';
import { XPBar } from '../components/stats/XPBar.jsx';
import { GoldCounter } from '../components/stats/GoldCounter.jsx';
import { StreakFlame } from '../components/stats/StreakFlame.jsx';
import { AttributeRadar } from '../components/stats/AttributeRadar.jsx';
import { AttributeBars } from '../components/stats/AttributeBars.jsx';
import { QuestCard } from '../components/quests/QuestCard.jsx';
import { LevelUpOverlay } from '../components/effects/LevelUpOverlay.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import { DIFFICULTIES } from '../lib/constants.js';

const frameTitle = {
  ember: 'border-amber-500/60 shadow-[0_0_20px_-6px_rgba(245,158,11,0.7)]',
  arcane: 'border-arcane-400/60 shadow-glow',
  void: 'border-violet-300/60 shadow-[0_0_28px_-6px_rgba(139,92,246,0.9)]',
};

export function Dashboard() {
  const { user, profile, equippedItems } = useAuth();
  const toast = useToast();
  const { completeQuest, levelUp, closeLevelUp } = useQuestActions();
  const [quests, setQuests] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const frame = equippedItems.find((i) => i.type === 'cosmetic');
  const frameClass = frame ? frameTitle[frame.effectJson?.frame] || frameTitle.arcane : 'border-arcane-400/30';

  useEffect(() => {
    (async () => {
      try {
        const [q, c] = await Promise.all([
          api.get('/quests?archived=false'),
          api.get('/completions?limit=6'),
        ]);
        setQuests(q.data);
        setRecent(c.data);
      } catch (err) {
        toast.error(errorMessage(err, 'Could not load the realm.'));
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const focusQuests = useMemo(() => quests.slice(0, 4), [quests]);
  const activeToday = profile?.lastActiveDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black text-white">
            Welcome back, <span className="text-arcane-300">{user?.displayName?.split(' ')[0]}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">The realm awaits its champion. Claim your XP today.</p>
        </div>
        <Link
          to="/quests"
          className="rounded-lg bg-gradient-to-b from-arcane-400 to-arcane-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          Open Quest Log →
        </Link>
      </div>

      {/* Hero stat strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel p-5"
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 bg-gradient-to-br from-arcane-500/30 to-void-800 text-xl ${frameClass}`}
            >
              {user?.avatarUrl ? <img src={user.avatarUrl} className="h-full w-full object-cover" alt="" /> : '🧙'}
            </motion.div>
            <div className="min-w-0">
              <p className="truncate font-display font-bold text-white">
                {equippedItems.find((i) => i.type === 'title')?.name.replace('Title: ', '') || 'Adventurer'}{' '}
                {user?.displayName}
              </p>
              <p className="text-xs text-arcane-300">Level {profile?.currentLevel || 1}</p>
              <p className="truncate text-xs text-slate-500">{profile?.totalCompletions || 0} quests cleared</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="panel p-5">
          <XPBar progress={profile?.progress} />
          <p className="mt-3 text-xs text-slate-500">Total lifetime XP</p>
          <p className="font-mono text-xl font-bold text-white">{profile?.totalXp?.toLocaleString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="panel p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Gold Vault</p>
          <div className="mt-2"><GoldCounter value={profile?.gold || 0} size="lg" /></div>
          <div className="mt-3"><StreakFlame streak={profile?.streak || 0} active={activeToday} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="panel p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Active Buffs</p>
          {profile?.activeBuffs?.length ? (
            <div className="mt-2 space-y-2">
              {profile.activeBuffs.map((b, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-arcane-500/10 px-3 py-2 text-sm">
                  <span className="text-arcane-200">🧪 {b.name}</span>
                  <span className="font-mono text-xs text-gold-300">
                    {b.goldMultiplier > 1 ? `🪙 ${b.goldMultiplier}×` : `${b.multiplier}×`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No elixirs active. Visit the bazaar, hero.</p>
          )}
          {profile?.streakFreezeActive && (
            <p className="mt-2 text-xs text-sky-300">🧿 Streak freeze protecting you.</p>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Focus quests */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">⚡ Focus Quests</h2>
            <Link to="/quests" className="text-xs font-semibold text-arcane-300 hover:text-arcane-200">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : focusQuests.length === 0 ? (
            <div className="panel flex flex-col items-center gap-3 p-10 text-center">
              <span className="animate-float text-4xl">🗺️</span>
              <p className="font-display font-bold text-white">Your quest log is empty</p>
              <p className="max-w-xs text-sm text-slate-400">
                Forge your first quest and begin earning XP today.
              </p>
              <Link to="/quests" className="mt-1 rounded-lg bg-gradient-to-b from-arcane-400 to-arcane-600 px-4 py-2 text-sm font-semibold text-white">
                Forge a Quest
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {focusQuests.map((q) => (
                <QuestCard key={q.id} quest={q} onComplete={completeQuest} onArchive={() => {}} />
              ))}
            </div>
          )}

          {/* Recent completions */}
          <div>
            <h2 className="mb-3 font-display text-lg font-bold text-white">📜 Recent Victories</h2>
            {loading ? (
              <SkeletonCard className="h-32" />
            ) : recent.length === 0 ? (
              <p className="text-sm text-slate-500">No victories yet. Forge your first quest above, hero.</p>
            ) : (
              <div className="panel divide-y divide-white/5">
                {recent.map((c) => (
                  <div key={c._id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg">🗡️</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-200">{c.questTitle}</p>
                        <p className="text-xs text-slate-500">{new Date(c.completedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 font-mono text-xs">
                      <span className="text-arcane-300">+{c.xpAwarded} XP</span>
                      <span className="text-gold-400">+{c.goldAwarded} 🪙</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attributes sidebar */}
        <div className="space-y-6">
          <div className="panel p-5">
            <h2 className="mb-1 font-display text-lg font-bold text-white">✨ Attributes</h2>
            <AttributeRadar attributes={profile?.attributes} />
          </div>
          <div className="panel p-5">
            <AttributeBars attributes={profile?.attributes} />
            <Link to="/profile" className="mt-4 block text-center text-xs font-semibold text-arcane-300 hover:text-arcane-200">
              View hero details →
            </Link>
          </div>
        </div>
      </div>

      <LevelUpOverlay
        open={Boolean(levelUp)}
        level={levelUp?.level}
        attrLeveledUp={levelUp?.attrLeveledUp}
        attribute={levelUp?.attribute}
        onClose={closeLevelUp}
      />
    </div>
  );
}
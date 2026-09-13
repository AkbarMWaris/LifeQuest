import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { AttributeRadar } from '../components/stats/AttributeRadar.jsx';
import { AttributeBars } from '../components/stats/AttributeBars.jsx';
import { AchievementCard } from '../components/achievements/AchievementCard.jsx';
import { GoldCounter } from '../components/stats/GoldCounter.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import { Button } from '../components/ui/Button.jsx';
import { IconUser, IconSpark, IconChart, IconTrophy } from '../components/ui/icons.jsx';

const inputCls =
  'w-full rounded-xl border border-slate-50/10 bg-void-900/80 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-arcane-400/50';

function StatTile({ label, value, suffix, accent }) {
  return (
    <div className="panel p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-bold ${accent || 'text-white'}`}>
        {value.toLocaleString()}
        {suffix && <span className="text-base opacity-70"> {suffix}</span>}
      </p>
    </div>
  );
}

export function Profile() {
  const { user, profile, refreshProfile, logout } = useAuth();
  const toast = useToast();
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState('coffee');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const themeMap = { void: 'coffee', astral: 'meadow', dungeon: 'midnight' };
    setDisplayName(user?.displayName || '');
    const t = user?.theme;
    setTheme((t && themeMap[t]) || (['coffee', 'meadow', 'midnight'].includes(t) ? t : 'coffee'));
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/achievements');
        setAchievements(data);
      } catch (err) {
        toast.error(errorMessage(err, 'Could not load achievements.'));
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/profile', { displayName, theme });
      await refreshProfile();
      toast.success('Hero details updated.');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SkeletonCard className="h-80 lg:col-span-1" />
        <SkeletonCard className="h-80 lg:col-span-2" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-white">The Chronicle</h1>
        <p className="mt-1 text-sm text-slate-400">Your page in the journal — stats, keepsakes and progress.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel relative overflow-hidden p-6 text-center"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-arcane-500/15 to-transparent" />
            <div className="relative">
              <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-arcane-400/50 bg-gradient-to-br from-arcane-500/30 to-void-800 text-2xl shadow-glow">
                {user?.avatarUrl ? <img src={user.avatarUrl} className="h-full w-full object-cover" alt="" /> : <IconUser size={34} className="text-arcane-300/80" />}
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-white">{user?.displayName}</h2>
              <p className="text-sm text-arcane-300">Level {profile?.currentLevel} · hero</p>
              <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
              <p className="mt-4 font-mono text-sm text-slate-300">
                <span className="text-arcane-300">{profile?.totalXp.toLocaleString()}</span> lifetime XP
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Gold" value={profile?.gold || 0} accent="text-gold-400" />
            <StatTile label="Streak" value={profile?.streak || 0} suffix="days" accent="text-amber-300" />
            <StatTile label="Best Streak" value={profile?.longestStreak || 0} suffix="days" />
            <StatTile label="Quests" value={profile?.totalCompletions || 0} />
          </div>

          <form onSubmit={save} className="panel space-y-3 p-6">
            <h3 className="font-display font-bold text-white">Edit profile</h3>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Hero name</label>
              <input className={inputCls} value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={40} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Theme</label>
              <select className={inputCls} value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="coffee">Coffee</option>
                <option value="meadow">Meadow</option>
                <option value="midnight">Midnight</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Saving…' : 'Save'}
              </Button>
              <Button type="button" variant="ghost" onClick={logout}>
                Log out
              </Button>
            </div>
          </form>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="panel p-5">
              <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-white"><IconSpark size={16} className="text-arcane-300/80" /> Attribute Talents</h3>
              <AttributeRadar attributes={profile?.attributes} />
            </div>
            <div className="panel p-5">
              <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-white"><IconChart size={16} className="text-arcane-300/80" /> Attribute XP</h3>
              <AttributeBars attributes={profile?.attributes} />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white"><IconTrophy size={18} className="text-arcane-300/80" /> Achievements</h3>
              <span className="font-mono text-sm text-arcane-300">
                {achievements?.unlockedCount ?? 0} / {achievements?.total ?? 0}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {achievements?.items.map((a, i) => (
                <AchievementCard key={a.id} achievement={a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}
import React, { useEffect, useMemo, useState } from 'react';
import { api, errorMessage } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { IconTrophy, IconChart, IconFlame, IconCoin, IconDumbbell, IconTarget } from '../components/ui/icons.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';

const SORTS = [
  { key: 'overall', label: 'Overall', icon: IconTrophy },
  { key: 'streak', label: 'Streak', icon: IconFlame },
  { key: 'goldEarned', label: 'Gold earned', icon: IconCoin },
  { key: 'totalXp', label: 'XP', icon: IconDumbbell },
  { key: 'completions', label: 'Tasks done', icon: IconTarget },
];

const RANK_BADGE = ['text-amber-300', 'text-slate-300', 'text-orange-400/80'];

function joined(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

export function Leaderboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [entries, setEntries] = useState(null);
  const [sort, setSort] = useState('overall');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/leaderboard');
        setEntries(res.data.entries);
      } catch (err) {
        toast.error(errorMessage(err, 'Could not summon the Hall.'));
        setEntries([]);
      }
    })();
  }, [toast]);

  const ordered = useMemo(() => {
    if (!entries) return null;
    const sorted = [...entries].sort((a, b) => (sort === 'overall' ? b.overallScore - a.overallScore : b[sort] - a[sort]));
    return sorted.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [entries, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-white">The Hall</h1>
        <p className="mt-1 text-sm text-slate-400">Where your streak, gold earned, XP and completed quests decide the standings.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {SORTS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSort(key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              sort === key ? 'bg-arcane-500/20 text-arcane-200 ring-1 ring-arcane-400/30' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {!ordered ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="h-14" />
          ))}
        </div>
      ) : ordered.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 p-10 text-center">
          <IconChart size={28} className="text-slate-600" />
          <p className="text-sm text-slate-400">No heroes yet. Be the first to make the wall of legends.</p>
        </div>
      ) : (
        <div className="panel divide-y divide-white/5 overflow-hidden">
          <div className="grid grid-cols-[3rem_1fr_5rem_6rem_5rem_5rem] items-center gap-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 sm:grid-cols-[3rem_1fr_5rem_6rem_5rem_5rem_8rem]">
            <span>#</span>
            <span>Hero</span>
            <span className="text-right">Streak</span>
            <span className="text-right">Gold</span>
            <span className="text-right">XP</span>
            <span className="hidden text-right sm:block">Tasks</span>
            <span className="hidden text-right sm:block">Joined</span>
          </div>
          {ordered.map((e) => (
            <div
              key={e.userId}
              className={`grid grid-cols-[3rem_1fr_5rem_6rem_5rem_5rem] items-center gap-2 px-4 py-3 text-sm sm:grid-cols-[3rem_1fr_5rem_6rem_5rem_5rem_8rem] ${
                e.me ? 'bg-arcane-500/10 ring-1 ring-inset ring-arcane-400/30' : ''
              }`}
            >
              <span className={`font-mono font-bold ${RANK_BADGE[e.rank - 1] || 'text-slate-400'}`}>
                {e.rank <= 3 ? (
                  <span className="flex items-center gap-1">
                    <IconTrophy size={14} className={e.rank === 1 ? 'text-amber-300' : 'text-slate-400'} />
                    {e.rank}
                  </span>
                ) : (
                  e.rank
                )}
              </span>
              <span className={`flex items-center gap-2 font-medium ${e.me ? 'text-arcane-200' : 'text-white'}`}>
                {e.name}
                {e.me && <span className="rounded bg-arcane-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-arcane-200">you</span>}
              </span>
              <span className="text-right font-mono text-amber-300">{e.streak}</span>
              <span className="text-right font-mono text-gold-400">{e.goldEarned.toLocaleString()}</span>
              <span className="text-right font-mono text-slate-200">{e.totalXp.toLocaleString()}</span>
              <span className="hidden text-right font-mono text-slate-400 sm:block">{e.completions}</span>
              <span className="hidden text-right text-xs text-slate-500 sm:block">{joined(e.joined)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
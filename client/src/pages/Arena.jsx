import React, { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import { IconSword, IconCoin, IconSpark, IconClock, IconBolt, IconCrown } from '../components/ui/icons.jsx';
import { ATTRIBUTES } from '../lib/constants.js';

const inputCls =
  'w-full rounded-xl border border-slate-50/10 bg-void-900/80 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-arcane-400/50';

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function fmtCountdown(ms) {
  if (ms <= 0) return '00:00';
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function fmtDate(d) {
  return new Date(d).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function stakeMeta(c) {
  return `${c.stakes.xp} XP + ${c.stakes.gold} gold each · winner takes both (2×)`;
}

export function Arena() {
  const { user, applyRewards } = useAuth();
  const toast = useToast();
  const now = useNow();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opponentCode, setOpponentCode] = useState('');
  const [title, setTitle] = useState('');
  const [xp, setXp] = useState(15);
  const [gold, setGold] = useState(10);
  const [duration, setDuration] = useState(5);
  const [attribute, setAttribute] = useState('focus');
  const [creating, setCreating] = useState(false);

  const load = useCallback(
    async (silent = false) => {
      try {
        const { data } = await api.get('/challenges');
        setChallenges(data);
      } catch (err) {
        if (!silent) toast.error(errorMessage(err, 'Could not load the arena.'));
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => load(true), 5000);
    return () => clearInterval(t);
  }, [load]);

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/challenges', {
        opponentCode,
        title,
        xp: Number(xp),
        gold: Number(gold),
        durationMinutes: Number(duration),
        attribute,
      });
      toast.success(`Challenge sent to ${data.opponentName}. The gauntlet is down!`);
      setOpponentCode('');
      setTitle('');
      await load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const accept = async (c) => {
    try {
      await api.post(`/challenges/${c.id}/accept`);
      toast.success('Challenge accepted — the timer has started!');
      await load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const decline = async (c) => {
    try {
      await api.post(`/challenges/${c.id}/decline`);
      toast.info('Challenge declined.');
      await load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const claimWin = async (c) => {
    try {
      const { data } = await api.post(`/challenges/${c.id}/complete`);
      if (data?.payload) applyRewards(data);
      const other = c.role === 'opponent' ? c.challengerName : c.opponentName;
      toast.success(`You beat ${other} — won the stakes! +${data.rewards?.xp} XP, +${data.rewards?.gold} gold`);
      if (data?.levelUps > 0) toast.info(`You leveled up — now Level ${data.payload?.profile?.currentLevel}!`);
      await load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(user?.challengeCode);
      toast.success('Code copied — share it with a friend.');
    } catch {
      toast.info(`Your code: ${user?.challengeCode}`);
    }
  };

  const incoming = challenges.filter((c) => c.status === 'pending' && c.role === 'opponent');
  const sent = challenges.filter((c) => c.status === 'pending' && c.role === 'challenger');
  const active = challenges.filter((c) => c.status === 'active');
  const history = challenges.filter((c) => ['completed', 'expired', 'declined'].includes(c.status));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-medium text-white">
            <IconSword size={26} className="text-arcane-300/80" /> The Arena
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Challenge a hero by their code. Timer starts when they accept — first to finish takes both stakes.
          </p>
        </div>
        <button
          onClick={copyCode}
          className="rounded-xl border border-gold-500/30 bg-void-800/60 px-4 py-2 text-left transition-colors hover:border-gold-400/50"
          title="Copy your code"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Your challenge code</p>
          <p className="font-mono text-lg font-bold text-gold-300">{user?.challengeCode || 'LQ-??????'}</p>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* New challenge */}
        <div className="lg:col-span-1">
          <form onSubmit={create} className="panel space-y-3 p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <IconBolt size={17} className="text-arcane-300/80" /> Lay down a challenge
            </h2>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Opponent's code
              </label>
              <input
                className={inputCls}
                value={opponentCode}
                onChange={(e) => setOpponentCode(e.target.value)}
                placeholder="LQ-482913"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                The task
              </label>
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 push-ups this evening"
                maxLength={120}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">XP each</label>
                <input className={inputCls} type="number" min={1} max={1000} value={xp} onChange={(e) => setXp(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Gold each</label>
                <input className={inputCls} type="number" min={0} max={100000} value={gold} onChange={(e) => setGold(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Timer <span className="text-slate-500">(min)</span>
                </label>
                <input className={inputCls} type="number" min={1} max={60} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Attribute</label>
                <select className={inputCls} value={attribute} onChange={(e) => setAttribute(e.target.value)}>
                  {Object.entries(ATTRIBUTES).map(([key, a]) => (
                    <option key={key} value={key}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="rounded-lg bg-arcane-500/10 px-3 py-2 text-xs text-arcane-200">
              Winner takes <span className="font-bold">both</span> stakes: +{Number(xp) * 2 || 0} XP, +{Number(gold) * 2 || 0} gold.
              If nobody finishes in {duration || 5} min, it expires — no winner.
            </p>
            <Button type="submit" variant="gold" className="w-full" disabled={creating}>
              {creating ? 'Sending…' : 'Send the challenge'}
            </Button>
          </form>
        </div>

        {/* Live stuff */}
        <div className="space-y-6 lg:col-span-2">
          {loading ? (
            <SkeletonCard className="h-64" />
          ) : (
            <>
              {incoming.length > 0 && (
                <section>
                  <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
                    <IconCrown size={17} className="text-arcane-300/80" /> Incoming challenges
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {incoming.map((c) => {
                      const remaining = new Date(c.expiresAt).getTime() - now;
                      return (
                        <div key={c.id} className="panel p-5">
                          <p className="text-[11px] uppercase tracking-wide text-arcane-300">{c.challengerName} challenged you</p>
                          <h3 className="mt-1 font-display text-lg font-bold text-white">{c.title}</h3>
                          <p className="mt-1 text-xs text-slate-400">
                            {ATTRIBUTES[c.attribute]?.label} · {stakeMeta(c)}
                          </p>
                          <p className={`mt-2 text-xs ${remaining > 0 ? 'text-slate-500' : 'text-rose-400'}`}>
                            {remaining > 0 ? `Accept by ${fmtDate(c.expiresAt)} — else it expires.` : 'This one has already expired.'}
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Button onClick={() => accept(c)} className="flex-1">
                              <IconBolt size={15} /> Accept & start the timer
                            </Button>
                            <Button variant="ghost" onClick={() => decline(c)}>Decline</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {active.length > 0 && (
                <section>
                  <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
                    <IconSword size={17} className="text-arcane-300/80" /> Live duels
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {active.map((c) => {
                      const remaining = new Date(c.expiresAt).getTime() - now;
                      const other = c.role === 'opponent' ? c.challengerName : c.opponentName;
                      const live = remaining > 0;
                      return (
                        <div key={c.id} className="panel overflow-hidden border-arcane-400/30 bg-gradient-to-br from-arcane-500/10 to-void-800/70 p-5">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">vs {other}</p>
                            <div className="flex items-center gap-2">
                              <IconClock size={14} className={live ? 'text-arcane-300' : 'text-rose-400'} />
                              <span className={`font-mono text-2xl font-bold ${live ? 'text-arcane-200' : 'text-rose-400'}`}>
                                {fmtCountdown(remaining)}
                              </span>
                            </div>
                          </div>
                          <h3 className="mt-2 font-display text-lg font-bold text-white">{c.title}</h3>
                          <p className="mt-1 text-xs text-slate-400">{stakeMeta(c)}</p>
                          <Button
                            variant="gold"
                            className="mt-4 w-full"
                            disabled={!live}
                            onClick={() => claimWin(c)}
                          >
                            <IconCrown size={15} /> I did it — claim the win
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {incoming.length === 0 && active.length === 0 && sent.length === 0 && (
                <div className="panel flex flex-col items-center gap-3 p-12 text-center">
                  <span className="animate-float text-arcane-300/90"><IconSword size={40} /></span>
                  <p className="font-display text-lg font-bold text-white">The arena is quiet… for now</p>
                  <p className="max-w-sm text-sm text-slate-400">
                    Send your code to a friend, or challenge them straight from the form. First to finish wins.
                  </p>
                </div>
              )}

              {sent.length > 0 && (
                <section>
                  <h2 className="mb-3 font-display text-lg font-bold text-white">Waiting on them</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {sent.map((c) => (
                      <div key={c.id} className="panel p-5 opacity-80">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">Waiting on {c.opponentName}</p>
                        <h3 className="mt-1 font-display text-lg font-bold text-white">{c.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">
                          {ATTRIBUTES[c.attribute]?.label} · {stakeMeta(c)}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(c.expiresAt).getTime() > now
                            ? `Expires ${fmtDate(c.expiresAt)} if they don't accept.`
                            : 'Expired — no winner.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {history.length > 0 && (
                <section>
                  <h2 className="mb-3 font-display text-lg font-bold text-white">Duel history</h2>
                  <div className="panel divide-y divide-slate-50/5">
                    {history.map((c) => {
                      const won = c.status === 'completed' && String(c.winner) === String(user?.id);
                      const lost = c.status === 'completed' && !won;
                      return (
                        <div key={c.id} className="flex items-center justify-between gap-3 px-5 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${
                                won
                                  ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
                                  : lost
                                    ? 'border-rose-400/40 bg-rose-500/10 text-rose-300'
                                    : 'border-slate-50/10 bg-void-800 text-slate-400'
                              }`}
                            >
                              {won ? <IconCrown size={16} /> : lost ? <IconSword size={16} /> : <IconClock size={16} />}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-200">{c.title}</p>
                              <p className="text-xs text-slate-500">
                                {won
                                  ? `You beat ${c.loserName}`
                                  : lost
                                    ? `You lost to ${c.winnerName}`
                                    : c.status === 'declined'
                                      ? 'Declined'
                                      : 'Expired — no winner'}
                                {' · '}
                                {new Date(c.completedAt || c.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {won && (
                            <div className="flex shrink-0 flex-col items-end font-mono text-xs">
                              <span className="text-emerald-300">+{c.xpAwarded} XP</span>
                              <span className="flex items-center gap-1 text-gold-400">
                                +{c.goldAwarded} <IconCoin size={12} />
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
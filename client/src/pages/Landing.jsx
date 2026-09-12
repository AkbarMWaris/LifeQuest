import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingRunes } from '../components/effects/FloatingRunes.jsx';

const features = [
  { icon: '✒️', title: 'Quests, not chores', text: 'Every real task becomes an entry in your journal. Post it, do it, cross it off.' },
  { icon: '📈', title: 'Progress that breathes', text: 'XP banks quietly into five attributes. No pop-ups, no badge spam — the page just fills.' },
  { icon: '🔥', title: 'Streaks that forgive', text: 'Daily rhythms warm up slowly, forgive one missed night, and keep your ember lit.' },
  { icon: '🪙', title: 'Gold for the shelf', text: 'Spend earned gold on titles, cosmetics and little elixirs that make tomorrow nicer.' },
  { icon: '🏆', title: 'Achievements to find', text: 'Small milestones, quietly unlocked. From first cross-off to the hundredth.' },
  { icon: '🛡️', title: 'Earned, never faked', text: 'The server keeps the ledger. Your progress is real, and it knows it.' },
];

const sampleQuests = [
  { icon: '🏋️', title: 'Gym · 30 minutes', attr: 'Strength', xp: '+25 XP', gold: '+12 🪙', diff: 'medium', tape: 'left-[-10px] -rotate-6' },
  { icon: '📚', title: 'Read 20 pages', attr: 'Focus', xp: '+50 XP', gold: '+25 🪙', diff: 'hard', tape: 'left-1/2 -translate-x-1/2 -rotate-2' },
  { icon: '💼', title: 'Apply to 5 jobs', attr: 'Discipline', xp: '+200 XP', gold: '+100 🪙', diff: 'boss', tape: 'right-[-10px] rotate-6' },
];

const diffChip = {
  easy: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300',
  medium: 'border-arcane-400/25 bg-arcane-500/10 text-arcane-300',
  hard: 'border-amber-400/25 bg-amber-500/10 text-amber-300',
  boss: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
};

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-void-radial" />
      <FloatingRunes count={16} />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="h-9 w-9 rounded-xl border border-gold-500/30 shadow-gold" />
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Life<span className="text-arcane-300">Quest</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-slate-500 sm:block">est. when you start</span>
          <Link
            to="/login"
            className="rounded-xl border border-slate-50/10 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-arcane-400/40 hover:text-white"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-4 py-2 text-sm font-semibold text-void-950 shadow-gold transition-transform hover:-translate-y-0.5"
          >
            Join the loft
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-8 lg:grid-cols-2 lg:px-8 lg:pt-4">
        <motion.div initial="hidden" animate="show">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow"
          >
            a life-quest journal for the slow hours
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-4xl font-medium leading-[1.08] text-white sm:text-5xl lg:text-6xl"
          >
            Turn the ordinary into a{' '}
            <em className="italic text-arcane-300">slow-burning</em> quest log.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-400"
          >
            Habit trackers feel like homework. LifeQuest wraps real tasks in a quiet sense of progress —
            XP that banks, streaks that warm up, and a journal that is actually pleasant to look at.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/signup"
              className="rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-6 py-3 text-sm font-semibold text-void-950 shadow-gold transition-transform hover:-translate-y-0.5"
            >
              Open the quest log →
            </Link>
            <a
              href="#how"
              className="rounded-xl border border-slate-50/10 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-arcane-400/40 hover:text-white"
            >
              How it works
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            <span className="tag text-arcane-300">✒️ xp for the small stuff</span>
            <span className="tag text-amber-300">🔥 streaks that forgive</span>
            <span className="tag text-emerald-300">🪙 gold for the shelf</span>
          </motion.div>
        </motion.div>

        {/* Quest-board mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-10 rounded-[30px] bg-gold-400/10 blur-3xl" aria-hidden="true" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="relative rotate-1 rounded-3xl border border-slate-50/10 bg-void-800/80 p-6 shadow-panel backdrop-blur">
              <div className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] rounded-sm washi" />
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="handnote text-xl text-arcane-300">today's board</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">week 3 · kept warm</p>
                </div>
                <div className="font-mono text-base font-bold text-gold-400">🪙 1,240</div>
              </div>

              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Level 7 · Ranger</span>
                <span className="font-mono">2,140 / 3,780 XP</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-arcane-500/20 bg-void-600/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-arcane-700 via-arcane-400 to-arcane-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '57%' }}
                  transition={{ delay: 0.8, duration: 1.2, type: 'spring', stiffness: 60, damping: 18 }}
                />
              </div>

              <div className="mt-6 space-y-3">
                {sampleQuests.map((q, i) => (
                  <motion.div
                    key={q.title}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.15 }}
                    className="relative flex items-center gap-3 rounded-2xl border border-slate-50/6 bg-void-900/70 p-3"
                  >
                    <span className={`absolute h-4 w-10 rounded-sm ${q.tape} washi opacity-70`} />
                    <span className="text-xl">{q.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-200">{q.title}</p>
                      <p className="text-xs text-slate-500">{q.attr}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-arcane-300">{q.xp}</p>
                      <p className="font-mono text-xs text-gold-400">{q.gold}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="handnote mt-5 text-right text-lg text-slate-500">no neon. just progress.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Marginalia strip */}
      <section className="relative z-10 border-y border-slate-50/10 bg-void-900/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 font-mono text-[11px] text-slate-500">
          <span className="flex items-center gap-2">✒️ post · do · cross off</span>
          <span className="flex items-center gap-2">🪙 gold for the shelf</span>
          <span className="flex items-center gap-2">🔥 ember streaks</span>
          <span className="handnote hidden text-lg text-slate-500 md:block">steeped, not spammed</span>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="eyebrow">the gentle gamification</p>
        <h2 className="mt-2 max-w-xl font-display text-3xl leading-tight text-white">
          Quietly ambitious. <em className="italic text-arcane-300">Nice to look at too.</em>
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 240, damping: 22, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -5 }}
              className="panel group relative p-6"
            >
              <span className="absolute right-4 top-4 handnote text-lg text-slate-500 opacity-60">{i + 1}</span>
              <div className="mb-3 inline-grid h-12 w-12 place-items-center rounded-xl border border-arcane-500/25 bg-arcane-500/10 text-2xl transition-transform group-hover:rotate-6">
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
            </motion.div>
          ))}
        </div>

        <div id="how" className="relative mt-12 rounded-3xl border border-arcane-500/20 bg-arcane-500/5 p-6 sm:p-8">
          <p className="handnote absolute -top-4 left-6 rounded-xl bg-void-950 px-3 text-lg text-arcane-300">how it works</p>
          <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
            <div>
              <p className="font-mono text-xs text-gold-400">01</p>
              <h3 className="mt-1 font-display text-lg text-white">Post a quest</h3>
              <p className="mt-1 text-sm text-slate-400">Write a real task, pick a weight — from a light sip to a weekly boss. It lands on the board.</p>
            </div>
            <div>
              <p className="font-mono text-xs text-gold-400">02</p>
              <h3 className="mt-1 font-display text-lg text-white">Just do the thing</h3>
              <p className="mt-1 text-sm text-slate-400">Cross it off. XP banks quietly into five attributes. No fanfare unless you want it.</p>
            </div>
            <div>
              <p className="font-mono text-xs text-gold-400">03</p>
              <h3 className="mt-1 font-display text-lg text-white">Keep the ember</h3>
              <p className="mt-1 text-sm text-slate-400">Streaks warm up slowly, forgive one missed night, and light the shelf with gold.</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-slate-50/10 pt-6 text-center">
            <div>
              <p className="font-display text-4xl text-arcane-300">5</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">attributes</p>
            </div>
            <div>
              <p className="font-display text-4xl text-arcane-300">4</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">quest weights</p>
            </div>
            <div>
              <p className="font-display text-4xl text-arcane-300">∞</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">refills of coffee</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-gold-500/25 bg-void-800/80 p-10 text-center shadow-panel"
        >
          <div className="pointer-events-none absolute -inset-8 bg-[radial-gradient(60%_50%_at_30%_30%,rgb(var(--glow-gold)_/_0.1),transparent_70%)]" />
          <span className="animate-float text-5xl">☕</span>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl leading-tight text-white">
            Your story starts with one entry,<br />
            <em className="italic text-arcane-300">crossed off.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">
            Make a hero, post one small quest, and watch the page fill. Free forever, friend.
          </p>
          <Link
            to="/signup"
            className="mt-7 inline-block rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-8 py-3.5 font-semibold text-void-950 shadow-gold transition-transform hover:-translate-y-0.5"
          >
            Create my hero
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-slate-50/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6">
          <p className="font-mono text-[11px] text-slate-600">LifeQuest · a cozily gamified quest journal</p>
          <p className="handnote text-lg text-slate-500">small wins, kept warm</p>
        </div>
      </footer>
    </div>
  );
}
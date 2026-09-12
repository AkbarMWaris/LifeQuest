import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingRunes } from '../components/effects/FloatingRunes.jsx';

const features = [
  { icon: '🗡️', title: 'Turn tasks into quests', text: 'Every chore, habit and goal becomes a quest with XP and gold rewards.' },
  { icon: '📈', title: 'Real progression systems', text: 'Level up with a satisfying XP curve. Watch attributes like Strength and Focus grow.' },
  { icon: '🔥', title: 'Streaks that matter', text: 'Daily habits build fiery streaks with milestone bonuses at 7, 30 and 100 days.' },
  { icon: '🛒', title: 'A living economy', text: 'Spend gold on cosmetics, power elixirs, titles and even your own real-life rewards.' },
  { icon: '🏆', title: 'Achievements to chase', text: 'Unlock badges for milestones — from First Blood to Dragon Hoard.' },
  { icon: '🛡️', title: 'Anti-cheat, always', text: 'The server is the source of truth. No local stat hacks. Your progress is earned.' },
];

const sampleQuests = [
  { icon: '🏋️', title: 'Gym · 30 minutes', attr: 'Strength', xp: '+25 XP', gold: '+12 🪙', diff: 'medium' },
  { icon: '📚', title: 'Read 20 pages', attr: 'Focus', xp: '+50 XP', gold: '+25 🪙', diff: 'hard' },
  { icon: '💼', title: 'Apply to 5 jobs', attr: 'Discipline', xp: '+200 XP', gold: '+100 🪙', diff: 'boss' },
];

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-void-radial" />
      <FloatingRunes count={20} />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          <span className="font-display text-xl font-black text-white">
            Life<span className="text-arcane-300">Quest</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-gradient-to-b from-arcane-400 to-arcane-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Join the Realm
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-300"
          >
            ✦ Life, but with XP
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-glow mt-4 font-display text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Brake the boredom of <span className="text-arcane-300">productivity.</span>
            <br />
            Level <span className="text-gold">your life.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-md text-lg leading-relaxed text-slate-400"
          >
            Habit trackers feel like chores. LifeQuest wraps real tasks in the dopamine of RPGs —
            instant feedback, clear progression, tangible rewards. Mundane checkmarks become satisfying level-ups.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to="/signup"
              className="rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-7 py-3.5 font-display font-bold text-void-950 shadow-gold transition-transform hover:-translate-y-0.5"
            >
              Begin Your Quest →
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/15 px-7 py-3.5 font-semibold text-slate-200 transition-colors hover:border-arcane-400/40 hover:text-white"
            >
              Continue Adventure
            </Link>
          </motion.div>
        </div>

        {/* Hero card mock */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 120, damping: 18 }}
          className="relative"
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="panel relative p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-arcane-400 to-arcane-700 text-2xl shadow-glow">
                    🧙
                  </div>
                  <div>
                    <p className="font-display font-bold text-white">Level 7 Ranger</p>
                    <p className="text-xs text-slate-400">Discipline +2 · Focus +1</p>
                  </div>
                </div>
                <div className="font-mono text-gold-400">🪙 1,240</div>
              </div>

              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Quest Log</span>
                <span className="font-mono">2,140 / 3,780 XP</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-void-600/70">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-arcane-600 to-arcane-400 shadow-glow"
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
                    transition={{ delay: 0.6 + i * 0.15 }}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-void-900/70 p-3"
                  >
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
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <h2 className="text-center font-display text-3xl font-black text-white">
          Built like a game. <span className="text-arcane-300">Powered by your life.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
          A full-stack world where the server is the referee — so your stats are earned, never faked.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 240, damping: 22, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -5 }}
              className="panel group p-6"
            >
              <div className="mb-3 inline-grid h-12 w-12 place-items-center rounded-xl border border-arcane-500/25 bg-arcane-500/10 text-2xl transition-transform group-hover:scale-110">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="panel flex flex-col items-center gap-6 border-gold/20 bg-gradient-to-br from-arcane-500/10 via-void-800/80 to-gold/5 p-10 text-center"
        >
          <span className="animate-float text-5xl">🗺️</span>
          <h2 className="max-w-xl font-display text-3xl font-black text-white">
            Your story starts with a single completed quest.
          </h2>
          <p className="max-w-md text-slate-400">
            Create an adventurer, forge your first daily quest, and watch your XP climb. Free forever, hero.
          </p>
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-8 py-3.5 font-display font-bold text-void-950 shadow-gold transition-transform hover:-translate-y-0.5"
          >
            Create My Hero
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
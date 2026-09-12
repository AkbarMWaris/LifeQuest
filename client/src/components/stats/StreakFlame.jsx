import React from 'react';
import { motion } from 'framer-motion';

export function StreakFlame({ streak, active }) {
  const burning = active && streak > 0;
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-void-800/80 px-3 py-1.5">
      <motion.span
        animate={burning ? { scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] } : { scale: 1, opacity: 0.5 }}
        transition={{ duration: 1.4, repeat: burning ? Infinity : 0, ease: 'easeInOut' }}
        className="inline-block text-lg"
      >
        {burning ? '🔥' : '🌫️'}
      </motion.span>
      <span className={`font-mono text-lg font-bold ${burning ? 'text-amber-300 text-glow-gold' : 'text-slate-500'}`}>
        {streak}
        <span className="ml-1 text-xs font-medium text-slate-400">day streak</span>
      </span>
    </div>
  );
}
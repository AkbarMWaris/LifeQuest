import React from 'react';
import { motion } from 'framer-motion';
import { TIER_STYLES } from '../../lib/constants.js';

export function AchievementCard({ achievement, index }) {
  const tier = TIER_STYLES[achievement.tier] || TIER_STYLES.bronze;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: (index % 8) * 0.04 }}
      className={`panel flex items-center gap-4 p-4 transition-opacity ${achievement.unlocked ? '' : 'opacity-55 grayscale'}`}
    >
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-void-900/70 text-2xl ${achievement.unlocked ? tier.glow : ''}`}
      >
        <span className={achievement.unlocked ? '' : 'opacity-60'}>{achievement.icon}</span>
      </div>
      <div className="min-w-0">
        <p className={`font-display text-sm font-bold ${achievement.unlocked ? `text-white ${tier.text}` : 'text-slate-400'}`}>
          {achievement.name}
          {achievement.unlocked && <span className="ml-2 text-green-400">✓</span>}
        </p>
        <p className="truncate text-xs text-slate-400">{achievement.description}</p>
      </div>
    </motion.div>
  );
}
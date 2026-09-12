import React from 'react';
import { motion } from 'framer-motion';
import { TIER_STYLES } from '../../lib/constants.js';
import { IconSword, IconAmulet, IconPotion, IconSpark, IconFlame, IconCrown, IconEmber, IconCoin, IconTrophy, IconBolt, IconTarget, IconTrendup } from '../ui/icons.jsx';

const ICON_MAP = {
  '🗡': IconSword,
  '⚔': IconSword,
  '📿': IconAmulet,
  '🏺': IconPotion,
  '🌟': IconSpark,
  '✨': IconSpark,
  '🔥': IconFlame,
  '🕯': IconFlame,
  '💠': IconCrown,
  '👑': IconCrown,
  '🌙': IconEmber,
  '🪙': IconCoin,
  '💰': IconCoin,
  '🏆': IconTrophy,
  '⚡': IconBolt,
  '🌱': IconTarget,
  '🌌': IconTrendup,
};

const normalize = (s) => String(s).replace(/[\uFE0F\u200D]/g, '');

export function AchievementCard({ achievement, index }) {
  const tier = TIER_STYLES[achievement.tier] || TIER_STYLES.bronze;
  const Icon = ICON_MAP[normalize(achievement.icon)] || IconTrophy;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: (index % 8) * 0.04 }}
      className={`panel flex items-center gap-4 p-4 transition-opacity ${achievement.unlocked ? '' : 'opacity-55 grayscale'}`}
    >
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${achievement.unlocked ? `${tier.tile} ${tier.glow}` : 'border-white/10 bg-void-900/70'}`}
      >
        <Icon size={22} className={`${achievement.unlocked ? tier.text : 'text-slate-500'}`} />
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
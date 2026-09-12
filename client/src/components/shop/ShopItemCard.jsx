import React from 'react';
import { motion } from 'framer-motion';
import { RARITY_STYLES } from '../../lib/constants.js';
import { Button } from '../ui/Button.jsx';
import { IconCoin, SHOP_ICON_MAP, emojiIcon, IconSpark } from '../ui/icons.jsx';

const typeLabel = {
  cosmetic: 'Cosmetic',
  buff: 'Buff',
  title: 'Title',
  streak_freeze: 'Streak Freeze',
};

export function ShopItemCard({ item, canAfford, owned, onBuy, buying }) {
  const rarity = RARITY_STYLES[item.rarity] || RARITY_STYLES.common;
  const Icon = emojiIcon(item.icon, SHOP_ICON_MAP, IconSpark);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -4 }}
      className={`group panel relative flex flex-col gap-3 p-5 ring-1 ${rarity.ring}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-widest ${rarity.text}`}>{rarity.label}</span>
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {typeLabel[item.type]}
        </span>
      </div>

      <motion.div
        className="grid h-16 w-16 place-items-center self-center rounded-2xl border border-white/10 bg-void-900/70"
        whileHover={{ scale: 1.12, rotate: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Icon size={28} className={rarity.text} />
      </motion.div>

      <div className="text-center">
        <h3 className="font-display text-sm font-bold text-white">{item.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.description}</p>
      </div>

      <div className="mt-auto flex items-center justify-center gap-2 pt-2">
        {owned ? (
          <span className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            ✓ Owned
          </span>
        ) : (
          <Button
            variant={canAfford ? 'gold' : 'ghost'}
            size="sm"
            disabled={!canAfford || buying}
            onClick={() => onBuy(item)}
            className="min-w-[120px]"
          >
            {buying
              ? 'Trading…'
              : (
                  <span className="flex items-center gap-1 font-mono">
                    <IconCoin size={13} /> {item.costGold.toLocaleString()}
                  </span>
                )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
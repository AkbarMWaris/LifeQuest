import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RARITY_STYLES } from '../../lib/constants.js';
import { Button } from '../ui/Button.jsx';
import { IconCoin, IconRefresh, SHOP_ICON_MAP, emojiIcon, IconSpark } from '../ui/icons.jsx';

const typeLabel = {
  cosmetic: 'Cosmetic',
  buff: 'Buff',
  title: 'Title',
  streak_freeze: 'Streak Freeze',
};

export function ShopItemCard({ item, canAfford, owned, onBuy, buying }) {
  const [flipped, setFlipped] = useState(false);
  const rarity = RARITY_STYLES[item.rarity] || RARITY_STYLES.common;
  const Icon = emojiIcon(item.icon, SHOP_ICON_MAP, IconSpark);
  const toggle = () => setFlipped((f) => !f);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -4 }}
      className="[perspective:1200px]"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <motion.div
          className={`panel flex h-full flex-col gap-3 p-5 ring-1 ${rarity.ring}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <button
            type="button"
            onClick={toggle}
            className="flex items-center justify-between text-left"
            aria-label="Flip card for details"
          >
            <span className={`text-[11px] font-bold uppercase tracking-widest ${rarity.text}`}>{rarity.label}</span>
            <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {typeLabel[item.type]}
            </span>
          </button>

          <button
            type="button"
            onClick={toggle}
            className="grid h-16 w-16 place-items-center self-center rounded-2xl border border-white/10 bg-void-900/70"
            aria-label="Flip card for details"
          >
            <Icon size={28} className={rarity.text} />
          </button>

          <button type="button" onClick={toggle} className="text-center" aria-label="Flip card for details">
            <h3 className="font-display text-sm font-bold text-white">{item.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.description}</p>
          </button>

          <button
            type="button"
            onClick={toggle}
            className="mx-auto mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-slate-500 transition-colors hover:text-arcane-300"
            aria-label="Flip card for details"
          >
            <IconRefresh size={11} className={`transition-transform duration-500 ${flipped ? 'rotate-180' : ''}`} />
            tap for details
          </button>

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

        {/* Back */}
        <motion.div
          onClick={toggle}
          className={`panel absolute inset-0 flex flex-col gap-3 p-5 ring-1 ${rarity.ring}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-widest ${rarity.text}`}>{rarity.label}</span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {typeLabel[item.type]}
            </span>
          </div>

          <div className="grid h-12 w-12 place-items-center self-center rounded-2xl border border-white/10 bg-void-900/70">
            <Icon size={22} className={rarity.text} />
          </div>

          <div className="text-center">
            <h3 className="font-display text-sm font-bold text-white">{item.name}</h3>
          </div>

          <div className="h-px w-full bg-white/5" />

          <p className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-300">{item.details}</p>

          <div className="mt-auto flex items-center justify-center gap-1 pt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
            <IconRefresh size={11} />
            tap to flip back
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
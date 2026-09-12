import React from 'react';
import { motion } from 'framer-motion';
import { RARITY_STYLES } from '../../lib/constants.js';
import { Button } from '../ui/Button.jsx';

const typeLabel = {
  cosmetic: 'Cosmetic',
  buff: 'Buff',
  title: 'Title',
  streak_freeze: 'Streak Freeze',
};

export function InventoryCard({ item, onEquip, onUse, busy }) {
  const rarity = RARITY_STYLES[item.rarity] || RARITY_STYLES.common;
  const isEquippable = item.type === 'cosmetic' || item.type === 'title';
  const isConsumable = item.type === 'buff' || item.type === 'streak_freeze';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`panel relative flex flex-col gap-3 p-5 ring-1 ${rarity.ring} ${item.isEquipped ? 'bg-arcane-500/10' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-widest ${rarity.text}`}>{rarity.label}</span>
        {item.isEquipped && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="rounded-md bg-arcane-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-arcane-200"
          >
            ⚔ Equipped
          </motion.span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-void-900/70 text-2xl">
          {item.icon}
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-white">{item.name}</h3>
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{typeLabel[item.type]}</span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-400">{item.description}</p>

      <div className="mt-auto flex gap-2 pt-1">
        {isEquippable && (
          <Button
            variant={item.isEquipped ? 'ghost' : 'primary'}
            size="xs"
            disabled={busy}
            onClick={() => onEquip(item, !item.isEquipped)}
          >
            {item.isEquipped ? 'Unequip' : 'Equip'}
          </Button>
        )}
        {isConsumable && !item.used && (
          <Button variant="gold" size="xs" disabled={busy} onClick={() => onUse(item)}>
            Use
          </Button>
        )}
        {isConsumable && item.used && (
          <span className="self-center text-xs text-slate-500">Consumed</span>
        )}
      </div>
    </motion.div>
  );
}
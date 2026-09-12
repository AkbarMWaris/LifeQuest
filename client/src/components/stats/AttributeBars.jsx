import React from 'react';
import { motion } from 'framer-motion';
import { ATTRIBUTES } from '../../lib/constants.js';
import { ATTR_ICONS } from '../ui/icons.jsx';

export function AttributeBars({ attributes }) {
  return (
    <div className="space-y-4">
      {Object.entries(ATTRIBUTES).map(([key, meta], idx) => {
        const attr = attributes?.[key] || { level: 1, xp: 0 };
        const pct = Math.min(100, Math.round(((attr.xp / 1000) % 1) * 100));
        const Icon = ATTR_ICONS[meta.icon];
        return (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-300">
                {Icon && <span style={{ color: meta.color }}><Icon size={15} /></span>} {meta.label}
              </span>
              <span className="font-mono text-xs text-slate-400">
                Lv <span style={{ color: meta.color }} className="font-bold">{attr.level}</span>
                <span className="ml-2">{attr.xp.toLocaleString()} XP</span>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-void-600/60">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, pct)}%` }}
                transition={{ delay: 0.05 * idx, type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export function FloatingRunes({ count = 14 }) {
  const runes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 11 + Math.random() * 14,
        duration: 10 + Math.random() * 14,
        delay: -Math.random() * 20,
        charr: ['✦', '·', '☁', '∘', '❋', '⋆', '·'][i % 7],
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {runes.map((r) => (
        <motion.span
          key={r.id}
          className="absolute select-none text-arcane-400/10"
          style={{ left: `${r.left}%`, top: `${r.top}%`, fontSize: r.size }}
          animate={{ y: [0, -60, 0], opacity: [0.2, 0.6, 0.2], rotate: [0, 25, 0] }}
          transition={{ duration: r.duration, repeat: Infinity, delay: r.delay, ease: 'easeInOut' }}
        >
          {r.charr}
        </motion.span>
      ))}
    </div>
  );
}
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export function FloatingRunes({ count = 14 }) {
  const runes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 12 + Math.random() * 18,
        duration: 9 + Math.random() * 12,
        delay: -Math.random() * 20,
        charr: ['✦', '✧', '⬡', '❖', '✳', '⋆', '◆'][i % 7],
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {runes.map((r) => (
        <motion.span
          key={r.id}
          className="absolute select-none text-arcane-400/15"
          style={{ left: `${r.left}%`, top: `${r.top}%`, fontSize: r.size }}
          animate={{ y: [0, -40, 0], opacity: [0.4, 0.9, 0.4], rotate: [0, 40, 0] }}
          transition={{ duration: r.duration, repeat: Infinity, delay: r.delay, ease: 'easeInOut' }}
        >
          {r.charr}
        </motion.span>
      ))}
    </div>
  );
}
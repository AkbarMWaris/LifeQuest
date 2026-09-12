import React from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#e2a032', '#e3b23c', '#8fa86e', '#e2805c', '#a695c6', '#f5d58a'];

export function ConfettiBurst({ count = 60 }) {
  const pieces = Array.from({ length: count }).map((_, idx) => {
    const angle = (idx / count) * Math.PI * 2;
    const dist = 120 + (idx % 5) * 55;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist - 30;
    return {
      id: idx,
      x,
      y,
      rotate: Math.random() * 720 - 360,
      scale: 0.5 + Math.random() * 0.9,
      color: COLORS[idx % COLORS.length],
      rounded: idx % 3 === 0,
      dur: 1.4 + (idx % 4) * 0.18,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 block"
          style={{ width: 8, height: 8, backgroundColor: p.color, borderRadius: p.rounded ? '50%' : '2px' }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: [1, 1, 0], scale: p.scale, rotate: p.rotate }}
          transition={{ duration: p.dur, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
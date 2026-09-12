import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { IconCoin } from '../ui/icons.jsx';

export function GoldCounter({ value, size = 'md', highlight = false }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(display, value, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <motion.div
      key={highlight ? `${value}-pop` : 'static'}
      initial={highlight ? { scale: 1.25, rotate: -6 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 14 }}
      className="inline-flex items-center gap-1.5 font-mono"
    >
      <motion.span
        animate={highlight ? { rotate: [0, 15, -12, 6, 0] } : undefined}
        transition={{ duration: 0.6 }}
        className={`inline-block ${size === 'lg' ? 'text-xl' : size === 'xs' ? 'text-sm' : 'text-base'}`}
      >
        <span className="inline-grid place-items-center"><IconCoin className="text-gold-500/70" /></span>
      </motion.span>
      <span
        className={`font-bold text-gold-400 ${size === 'lg' ? 'text-2xl' : size === 'xs' ? 'text-xs' : 'text-base'} ${highlight ? 'text-glow-gold' : ''}`}
      >
        {display.toLocaleString()}
      </span>
    </motion.div>
  );
}
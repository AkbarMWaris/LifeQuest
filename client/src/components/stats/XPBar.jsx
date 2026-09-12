import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

function useAnimatedNumber(target, duration = 0.9) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    const controls = animate(value, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return value;
}

export function XPBar({ progress, displayXp, className = '' }) {
  const level = progress?.level ?? 1;
  const into = progress?.xpIntoLevel ?? 0;
  const needed = progress?.xpNeeded ?? 1;
  const pct = progress?.progressPct ?? 0;

  const animatedPct = useAnimatedNumber(pct);
  const showNumber = displayXp !== undefined ? displayXp : into;

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs font-medium text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="text-glow font-semibold text-arcane-300">Level {level}</span>
        </span>
        <span className="font-mono">
          {showNumber} / {needed} XP
        </span>
      </div>
      <div className="relative mt-1.5 h-3 overflow-hidden rounded-full border border-arcane-500/20 bg-void-600/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-arcane-700 via-arcane-400 to-arcane-500 shadow-glow"
          initial={{ width: 0 }}
          animate={{ width: `${animatedPct}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(90deg, transparent 0 12px, rgba(255,255,255,0.05) 12px 24px)',
          }}
        />
      </div>
    </div>
  );
}
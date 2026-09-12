import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-gradient-to-b from-arcane-400 to-arcane-600 text-white border border-arcane-300/40 shadow-glow hover:from-arcane-300 hover:to-arcane-500',
  gold: 'bg-gradient-to-b from-gold-300 to-gold-600 text-void-950 border border-gold-300/50 shadow-gold hover:from-gold-200 hover:to-gold-500',
  ghost: 'bg-transparent text-slate-300 border border-white/10 hover:border-arcane-400/40 hover:text-white hover:bg-arcane-500/10',
  danger: 'bg-gradient-to-b from-rose-500 to-rose-700 text-white border border-rose-300/30 hover:from-rose-400 hover:to-rose-600',
  emerald: 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-void-950 border border-emerald-300/50 hover:from-emerald-300 hover:to-emerald-500',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  whileTapScale = 0.96,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: whileTapScale }}
      whileHover={disabled ? undefined : { y: -1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
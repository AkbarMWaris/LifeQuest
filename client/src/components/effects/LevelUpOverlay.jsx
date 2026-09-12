import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ConfettiBurst } from './ConfettiBurst.jsx';

export function LevelUpOverlay({ open, level, attr, attrLeveledUp, attribute, onClose }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-void-950/85 backdrop-blur-sm" onClick={onClose} />
          <ConfettiBurst />
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-gold/40 bg-gradient-to-b from-void-800 to-void-950 p-8 text-center shadow-gold"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-4 inline-block animate-float text-7xl"
            >
              👑
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-sm uppercase tracking-[0.3em] text-gold-400"
            >
              Level Up
            </motion.p>
            <motion.h2
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 12 }}
              className="text-glow-gold mt-1 font-display text-5xl font-bold text-gold"
            >
              Level {level}
            </motion.h2>
            {attrLeveledUp && attribute && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 text-arcane-200"
              >
                🎯 Your <span className="font-bold text-arcane-300">{attribute}</span> has also grown.
              </motion.p>
            )}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onClose}
              className="mt-7 rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-6 py-2.5 font-display font-bold text-void-950 shadow-gold"
            >
              Back to it
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
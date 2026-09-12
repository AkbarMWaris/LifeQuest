import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIFFICULTIES, QUEST_TYPES, ATTRIBUTES } from '../../lib/constants.js';
import { Button } from '../ui/Button.jsx';

const diffStyles = {
  easy: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300',
  medium: 'border-arcane-400/25 bg-arcane-500/10 text-arcane-300',
  hard: 'border-amber-400/25 bg-amber-500/10 text-amber-300',
  boss: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
};

const typeColor = {
  one_off: 'text-slate-400',
  daily: 'text-emerald-300',
  weekly: 'text-arcane-300',
  boss: 'text-rose-300',
};

function Checkmark({ active }) {
  return (
    <svg viewBox="0 0 52 52" className="h-7 w-7">
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke={active ? '#34d399' : 'rgba(139,92,246,0.5)'}
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
      {active && (
        <motion.path
          d="M14 27 L22 35 L38 19"
          fill="none"
          stroke="#34d399"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
        />
      )}
    </svg>
  );
}

export function QuestCard({ quest, onComplete, onArchive, disabled }) {
  const [completing, setCompleting] = useState(false);
  const [optimistic, setOptimistic] = useState(false);
  const diff = DIFFICULTIES[quest.difficulty] || DIFFICULTIES.easy;
  const type = QUEST_TYPES[quest.type] || QUEST_TYPES.one_off;
  const attr = ATTRIBUTES[quest.attribute] || ATTRIBUTES.focus;
  const isCompleted = (quest.type === 'one_off' && quest.completedCount > 0);

  const handleComplete = async () => {
    if (disabled || completing || isCompleted) return;
    setCompleting(true);
    setOptimistic(true);
    try {
      await onComplete(quest);
    } catch (e) {
      setOptimistic(false);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -3 }}
      className="group panel relative flex flex-col gap-3 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${diffStyles[quest.difficulty]}`}>
            {diff.label}
          </span>
          <span className={`text-[11px] font-medium uppercase tracking-wide ${typeColor[quest.type]}`}>
            {type.label}
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onArchive}
          className="text-slate-500 opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100"
          title="Archive quest"
        >
          ✕
        </motion.button>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white">{quest.title}</h3>
        {quest.description && <p className="mt-1 text-sm text-slate-400">{quest.description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
        <span>
          <span style={{ color: attr.color }}>{attr.icon}</span> {attr.label}
        </span>
        <span className="font-mono text-arcane-300">+{quest.xpReward} XP</span>
        <span className="font-mono text-gold-400">+{quest.goldReward} 🪙</span>
        {quest.deadline && (
          <span className="text-slate-500">⏳ {new Date(quest.deadline).toLocaleDateString()}</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <span className="font-mono text-[11px] text-slate-500">
          ×{quest.completedCount || 0} completed
        </span>
        {isCompleted ? (
          <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-300">
            <Checkmark active /> Vanquished
          </span>
        ) : (
          <Button
            variant={quest.difficulty === 'boss' ? 'gold' : 'primary'}
            size="sm"
            disabled={disabled || completing}
            onClick={handleComplete}
            className="relative min-w-[104px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {optimistic ? (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <Checkmark active /> <span className="animate-pulse">Rewarding…</span>
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Complete
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        )}
      </div>
    </motion.article>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIFFICULTIES, QUEST_TYPES, ATTRIBUTES } from '../../lib/constants.js';
import { ATTR_ICONS, IconCoin, IconClock, IconTrash, IconArchive, IconRefresh } from '../ui/icons.jsx';
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
        stroke={active ? '#90aa6e' : 'rgba(226,160,50,0.5)'}
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
      {active && (
        <motion.path
          d="M14 27 L22 35 L38 19"
          fill="none"
          stroke="#90aa6e"
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

const iconBtn =
  'grid h-7 w-7 place-items-center rounded-lg border border-slate-50/10 bg-void-800/60 text-slate-400 transition-colors hover:text-white';

export function QuestCard({ quest, onComplete, onArchive, onDelete, onRestore, disabled }) {
  const [completing, setCompleting] = useState(false);
  const [optimistic, setOptimistic] = useState(false);
  const [done, setDone] = useState(false);
  const diff = DIFFICULTIES[quest.difficulty] || DIFFICULTIES.easy;
  const type = QUEST_TYPES[quest.type] || QUEST_TYPES.one_off;
  const attr = ATTRIBUTES[quest.attribute] || ATTRIBUTES.focus;
  const attrIcon = ATTR_ICONS[attr.icon] || ATTR_ICONS.target;
  const isArchived = quest.isArchived === true;
  const isCompleted = quest.type === 'one_off' && quest.completedCount > 0;
  const isVanquished = done || isCompleted;
  const completedCount = quest.completedCount + (done && !isCompleted ? 1 : 0);

  const handleComplete = async () => {
    if (disabled || completing || isVanquished) return;
    setCompleting(true);
    setOptimistic(true);
    try {
      await onComplete(quest);
      setDone(true);
    } catch (e) {
      setOptimistic(false);
    } finally {
      setCompleting(false);
    }
  };

  const topControls = isArchived ? null : onArchive || onDelete ? (
  <div className="flex items-center gap-1">
    {onArchive && (
      <button onClick={onArchive} title="Archive quest" className={`${iconBtn} hover:border-arcane-400/40 hover:bg-arcane-500/10 hover:text-arcane-300`}>
        <IconArchive size={15} />
      </button>
    )}
    {onDelete && (
      <button onClick={onDelete} title="Delete forever" className={`${iconBtn} hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300`}>
        <IconTrash size={15} />
      </button>
    )}
  </div>
) : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -3 }}
      className={`group panel relative flex flex-col gap-3 p-5 ${isArchived ? 'opacity-75' : ''}`}
    >
      <span className="absolute -top-2 left-6 z-10 h-3 w-16 -rotate-3 rounded-sm washi opacity-70" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${diffStyles[quest.difficulty]}`}>
            {diff.label}
          </span>
          <span className={`text-[11px] font-medium uppercase tracking-wide ${typeColor[quest.type]}`}>
            {type.label}
          </span>
        </div>
        {topControls}
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white">{quest.title}</h3>
        {quest.description && <p className="mt-1 text-sm text-slate-400">{quest.description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
        <span>
          <span style={{ color: attr.color }}>{attrIcon}</span> {attr.label}
        </span>
        <span className="font-mono text-arcane-300">+{quest.xpReward} XP</span>
        <span className="flex items-center gap-1 font-mono text-gold-400">+{quest.goldReward} <IconCoin size={12} /></span>
        {quest.deadline && (
          <span className="flex items-center gap-1 text-slate-500"><IconClock size={12} /> {new Date(quest.deadline).toLocaleDateString()}</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <span className="font-mono text-[11px] text-slate-500">×{completedCount} completed</span>
        {isArchived ? (
          <div className="flex items-center gap-2">
            {onRestore && (
              <Button variant="ghost" size="sm" onClick={onRestore} className="text-arcane-300">
                <IconRefresh size={14} /> Restore
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200">
                <IconTrash size={14} /> Delete
              </Button>
            )}
          </div>
        ) : isVanquished ? (
          <span className="inline-flex -rotate-2 items-center gap-2 rounded-xl border-2 border-dashed border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 font-hand text-lg text-emerald-300">
            <Checkmark active /> Done
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
                  <Checkmark active /> <span>Complete</span>
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
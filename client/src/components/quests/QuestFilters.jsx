import React from 'react';
import { QUEST_TYPES, DIFFICULTIES } from '../../lib/constants.js';

const chip = (active) =>
  `rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
    active
      ? 'border-arcane-400/60 bg-arcane-500/20 text-arcane-200 shadow-glow'
      : 'border-white/10 bg-void-800/60 text-slate-400 hover:border-arcane-400/30 hover:text-slate-200'
  }`;

export function QuestFilters({ typeFilter, setTypeFilter, difficultyFilter, setDifficultyFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={chip(typeFilter === 'all')} onClick={() => setTypeFilter('all')}>
        All
      </button>
      {Object.entries(QUEST_TYPES).map(([k, v]) => (
        <button key={k} className={chip(typeFilter === k)} onClick={() => setTypeFilter(k)}>
          {v.label}
        </button>
      ))}

      <span className="mx-2 h-5 w-px bg-white/10" />

      {Object.entries(DIFFICULTIES).map(([k, v]) => (
        <button key={k} className={chip(difficultyFilter === k)} onClick={() => setDifficultyFilter(k)}>
          {v.label}
        </button>
      ))}
      <button className={chip(difficultyFilter === 'all')} onClick={() => setDifficultyFilter('all')}>
        Any difficulty
      </button>
    </div>
  );
}
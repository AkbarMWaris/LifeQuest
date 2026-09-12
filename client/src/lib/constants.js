export const DIFFICULTIES = {
  easy: { label: 'Easy', xp: 10, gold: 5, color: 'emerald' },
  medium: { label: 'Medium', xp: 25, gold: 12, color: 'arcane' },
  hard: { label: 'Hard', xp: 50, gold: 25, color: 'amber' },
  boss: { label: 'Boss', xp: 200, gold: 100, color: 'rose' },
};

export const QUEST_TYPES = {
  one_off: { label: 'One-time', color: 'slate' },
  daily: { label: 'Daily', color: 'emerald' },
  weekly: { label: 'Weekly', color: 'arcane' },
  boss: { label: 'Boss', color: 'rose' },
};

export const ATTRIBUTES = {
  strength: { label: 'Strength', icon: '🏋️', color: '#e2805c' },
  focus: { label: 'Focus', icon: '🎯', color: '#d9862f' },
  creativity: { label: 'Creativity', icon: '🎨', color: '#a695c6' },
  social: { label: 'Social', icon: '🤝', color: '#8fa86e' },
  discipline: { label: 'Discipline', icon: '⚔️', color: '#e3b23c' },
};

export const RARITY_STYLES = {
  common: { ring: 'ring-slate-400/30', text: 'text-slate-300', label: 'Common' },
  rare: { ring: 'ring-sky-400/40', text: 'text-sky-300', label: 'Rare' },
  legendary: { ring: 'ring-amber-400/50', text: 'text-amber-300', label: 'Legendary' },
};

export const TIER_STYLES = {
  bronze: { text: 'text-amber-600', glow: 'shadow-[0_0_12px_-4px_rgba(219,156,58,0.5)]' },
  silver: { text: 'text-slate-300', glow: 'shadow-[0_0_12px_-4px_rgba(212,201,173,0.5)]' },
  gold: { text: 'text-gold', glow: 'shadow-[0_0_12px_-4px_rgb(var(--c-gold-500)_/_0.6)]' },
  legendary: { text: 'text-arcane-300', glow: 'shadow-[0_0_14px_-4px_rgb(var(--c-arcane-300)_/_0.7)]' },
};

export function xpToNextLevel(progress) {
  return progress?.xpNeeded ?? 0;
}
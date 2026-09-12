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
  strength: { label: 'Strength', icon: '🏋️', color: '#fb7185' },
  focus: { label: 'Focus', icon: '🎯', color: '#8b5cf6' },
  creativity: { label: 'Creativity', icon: '🎨', color: '#38bdf8' },
  social: { label: 'Social', icon: '🤝', color: '#34d399' },
  discipline: { label: 'Discipline', icon: '⚔️', color: '#f5c542' },
};

export const RARITY_STYLES = {
  common: { ring: 'ring-slate-400/30', text: 'text-slate-300', label: 'Common' },
  rare: { ring: 'ring-sky-400/40', text: 'text-sky-300', label: 'Rare' },
  legendary: { ring: 'ring-amber-400/50', text: 'text-amber-300', label: 'Legendary' },
};

export const TIER_STYLES = {
  bronze: { text: 'text-amber-600', glow: 'shadow-[0_0_12px_-4px_rgba(245,158,11,0.5)]' },
  silver: { text: 'text-slate-300', glow: 'shadow-[0_0_12px_-4px_rgba(203,213,225,0.5)]' },
  gold: { text: 'text-gold', glow: 'shadow-[0_0_12px_-4px_rgba(245,197,66,0.6)]' },
  legendary: { text: 'text-arcane-300', glow: 'shadow-[0_0_14px_-4px_rgba(139,92,246,0.7)]' },
};

export function xpToNextLevel(progress) {
  return progress?.xpNeeded ?? 0;
}
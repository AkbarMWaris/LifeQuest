export const BASE_XP = 100;
export const XP_EXPONENT = 2.5;

export function totalXpForLevel(level) {
  if (level <= 1) return 0;
  return Math.floor(BASE_XP * Math.pow(level - 1, XP_EXPONENT));
}

export function levelFromXp(xp) {
  let level = 1;
  while (totalXpForLevel(level + 1) <= xp) level += 1;
  return level;
}

export function levelProgress(xp) {
  const level = levelFromXp(xp);
  const current = totalXpForLevel(level);
  const next = totalXpForLevel(level + 1);
  const into = xp - current;
  const span = Math.max(1, next - current);
  return {
    level,
    xpIntoLevel: into,
    xpNeeded: span,
    progressPct: Math.min(100, Math.round((into / span) * 100)),
  };
}
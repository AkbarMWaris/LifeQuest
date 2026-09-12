export const STREAK_MILESTONE_BONUSES = [
  { day: 7, xp: 50, gold: 25 },
  { day: 30, xp: 250, gold: 100 },
  { day: 100, xp: 1000, gold: 400 },
];

export function dateKey(d = new Date()) {
  const x = new Date(d);
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${x.getFullYear()}-${m}-${day}`;
}

export function weekStartKey(d = new Date()) {
  const x = new Date(d);
  const offset = (x.getDay() + 6) % 7; // Monday start
  x.setDate(x.getDate() - offset);
  return dateKey(x);
}

export function daysBetween(aKey, bKey) {
  const a = new Date(`${aKey}T00:00:00`);
  const b = new Date(`${bKey}T00:00:00`);
  return Math.round((b - a) / 86400000);
}

export function milestoneBonusFor(streak) {
  const m = STREAK_MILESTONE_BONUSES.find((x) => x.day === streak);
  return m ? { xp: m.xp, gold: m.gold } : { xp: 0, gold: 0 };
}
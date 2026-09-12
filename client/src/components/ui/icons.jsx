import React from 'react';

const S = ({ d, children, size, className, strokeWidth = 1.8 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size || 20}
    height={size || 20}
    className={className}
    aria-hidden="true"
  >
    {children || (d ? <path d={d} /> : null)}
  </svg>
);

export const IconHome = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
    <path d="M9.5 20v-6h5v6" />
  </S>
);

export const IconPen = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M21 12 3 3 7 12 3 21Z" />
    <path d="M7 12h14" />
  </S>
);

export const IconBag = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M5.5 8h13l-1.5 12h-10Z" />
    <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
  </S>
);

export const IconBackpack = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M6 9h12v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z" />
    <path d="M6 9l6-2.5L18 9" />
    <path d="M10 13h4" />
  </S>
);

export const IconUser = ({ size, className }) => (
  <S size={size} className={className}>
    <circle cx="12" cy="7.5" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </S>
);

export const IconCoffee = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M7 9h9.5v6a3.5 3.5 0 0 1-3.5 3.5H10.5A3.5 3.5 0 0 1 7 15Z" />
    <path d="M16.5 10.5h1.5a2 2 0 0 1 0 4h-1.5" />
    <path d="M9.5 6.5c0-1.2 1-1.2 1-2.4M13.5 6.5c0-1.2 1-1.2 1-2.4" />
  </S>
);

export const IconCoin = ({ size, className }) => (
  <S size={size} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4" />
  </S>
);

export const IconFlame = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </S>
);

export const IconEmber = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M5 17.5C3.5 15.5 4 13 5.5 12c-1 2 .5 3 .5 3 0 0-.7-1 .8-2.2 1.3-.7 3-1.9 3-3.3C6.5 14 12 18 12 12" />
  </S>
);

export const IconDocument = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M7 3h7.5L18 6.5V20H7Z" />
    <path d="M14.5 3v3.5H18" />
    <path d="M10 12h5M10 15.5h5" />
  </S>
);

export const IconSpark = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M12 3 14 10l7 2-7 2-2 7-2-7-7-2 7-2Z" />
  </S>
);

export const IconTrophy = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M8 3h8v6a4 4 0 0 1-8 0Z" />
    <path d="M7 4H4.5a2.5 2.5 0 0 0 0 5H7" />
    <path d="M17 4h2.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M12 13v5" />
    <path d="M8.5 20h7M10 16.5v-1.5M14 16.5v-1.5" />
  </S>
);

export const IconChart = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M4 20h16" />
    <path d="M5 20v-7M10 20V6M15 20v-9M20 20v-12" />
  </S>
);

export const IconBook = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5Z" />
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
  </S>
);

export const IconSword = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
    <path d="M13 18.5 18.5 13M16 18.5 21 13.5M19 21l.5-2.5" />
  </S>
);

export const IconDumbbell = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18.7 21.5a2 2 0 1 1-2.8-2.8l-1.8 1.8a2 2 0 1 1-2.8-2.8l6.3-6.4a2 2 0 1 1 2.8 2.8l-1.7 1.8a2 2 0 1 1 2.8 2.8Z" />
    <path d="m21.5 21.5-1.4-1.4M3.9 3.9 2.5 2.5" />
    <path d="M6.4 12.8a2 2 0 1 1-2.8-2.8l1.8-1.8a2 2 0 1 1-2.8-2.8l2.8-2.8a2 2 0 1 1 2.8 2.8l1.8-1.8a2 2 0 1 1 2.8 2.8Z" />
  </S>
);

export const IconTarget = ({ size, className }) => (
  <S size={size} className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </S>
);

export const IconBrush = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M14.6 17.9 3.9 15" />
    <path d="M18.4 2.6a1 1 0 1 1 3 3L17.4 9.6a.5.5 0 0 0 0 .7l.9.9a2.4 2.4 0 0 1 0 3.4l-.9.9a.5.5 0 0 1-.7 0L8.3 7.3a.5.5 0 0 1 0-.7l.9-.9a2.4 2.4 0 0 1 3.4 0l.9.9a.5.5 0 0 0 .7 0Z" />
    <path d="m9 8-6.6 6.6a.5.5 0 0 0 .3.8c2.8.5 5.1.9 6.6 2.4" />
  </S>
);

export const IconUsers = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </S>
);

export const IconClock = ({ size, className }) => (
  <S size={size} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </S>
);

export const IconAmulet = ({ size, className }) => (
  <S size={size} className={className}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2.5" />
  </S>
);

export const IconShield = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M12 3 5 5.5V11a8 8 0 0 0 7 8 8 8 0 0 0 7-8V5.5Z" />
  </S>
);

export const IconBolt = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
  </S>
);

export const IconTrendup = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M22 7 13.5 15.5l-5-5L2 17" />
    <path d="M16 7h6v6" />
  </S>
);

export const IconBriefcase = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M6 7V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
    <path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M3 13h7a2 2 0 0 0 4 0h7" />
  </S>
);

export const IconRefresh = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M21 12a9 9 0 1 1-2.6-6.4" />
    <path d="M21 4v5h-5" />
  </S>
);

export const IconCrown = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M4 8.5 8 12l4-6 4 6 4-3.5V18H4Z" />
  </S>
);

export const IconDawn = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M6 20a6 6 0 0 1 12 0" />
    <path d="M3.5 20h17" />
    <path d="M12 4V2M5.5 7 4 5.5M18.5 7 20 5.5" />
  </S>
);

export const IconPotion = ({ size, className }) => (
  <S size={size} className={className}>
    <path d="M10 2v6.3a7 7 0 1 0 4 0V2" />
    <path d="M8.5 2h7" />
    <path d="M7 16h10" />
  </S>
);

export const ATTR_ICONS = {
  dumbbell: IconDumbbell,
  target: IconTarget,
  brush: IconBrush,
  users: IconUsers,
  sword: IconSword,
};

export const SHOP_ICON_MAP = {
  '🧪': IconPotion,
  '⚗': IconPotion,
  '⏳': IconClock,
  '🧿': IconAmulet,
  '🔶': IconSpark,
  '🔮': IconTarget,
  '🐉': IconFlame,
  '🌅': IconDawn,
  '⚡': IconBolt,
  '👑': IconCrown,
  '✨': IconSpark,
};

export function emojiIcon(icon, map, fallback) {
  const key = String(icon || '').replace(/[\uFE0F\u200D]/g, '');
  return (map && map[key]) || fallback;
}
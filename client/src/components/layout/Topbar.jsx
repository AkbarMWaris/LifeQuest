import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { GoldCounter } from '../stats/GoldCounter.jsx';
import { StreakFlame } from '../stats/StreakFlame.jsx';
import { motion } from 'framer-motion';

export function Topbar() {
  const { user, profile, equippedItems } = useAuth();
  const title = equippedItems.find((i) => i.type === 'title');
  const frame = equippedItems.find((i) => i.type === 'cosmetic');

  const active = Boolean(profile?.lastActiveDate === new Date().toISOString().slice(0, 10));

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-void-950/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link to="/dashboard" className="hidden items-center gap-2 lg:flex">
          <span className="font-display text-lg font-black text-white">
            Life<span className="text-arcane-300">Quest</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <StreakFlame streak={profile?.streak || 0} active={active} />
          <GoldCounter value={profile?.gold || 0} size="xs" />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-white">
              {title ? `${title.name.replace('Title: ', '')} ` : ''}
              {user?.displayName}
            </p>
            <p className="text-xs text-arcane-300">Level {profile?.currentLevel || 1}</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 text-base ${
              frame ? 'border-gold shadow-gold' : 'border-arcane-400/40'
            }`}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{user?.displayName?.[0]?.toUpperCase() || '🗡'}</span>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
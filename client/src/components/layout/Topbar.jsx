import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { GoldCounter } from '../stats/GoldCounter.jsx';
import { StreakFlame } from '../stats/StreakFlame.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconCoffee,
  IconArchive,
  IconLogout,
  IconCoin,
  IconFlame,
  IconSpark,
} from '../ui/icons.jsx';

export function Topbar() {
  const { user, profile, equippedItems, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const title = equippedItems.find((i) => i.type === 'title');
  const frame = equippedItems.find((i) => i.type === 'cosmetic');

  const active = Boolean(profile?.lastActiveDate === new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-50/10 bg-void-950/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link to="/dashboard" className="hidden items-center gap-2 lg:flex">
          <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg border border-gold-500/30" />
          <span className="font-display text-lg font-bold text-white">
            Life<span className="text-arcane-300">Quest</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <StreakFlame streak={profile?.streak || 0} active={active} />
          <GoldCounter value={profile?.gold || 0} size="xs" />
        </div>

        <div ref={ref} className="relative flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-white">
              {title ? `${title.name.replace('Title: ', '')} ` : ''}
              {user?.displayName}
            </p>
            <p className="text-xs text-arcane-300">Level {profile?.currentLevel || 1}</p>
          </div>

          <motion.button
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            title="Open menu"
            className={`grid h-10 w-10 cursor-pointer place-items-center overflow-hidden rounded-full border-2 text-base transition-transform ${
              open ? 'scale-95' : ''
            } ${frame ? 'border-gold shadow-gold' : 'border-arcane-400/40'}`}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <IconCoffee size={20} className="text-arcane-300" />
            )}
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="absolute right-0 top-full z-40 mt-2 w-64 rounded-2xl border border-slate-50/10 bg-void-900/95 p-2 shadow-panel backdrop-blur-lg"
              >
                <div className="mb-2 flex items-center gap-3 border-b border-slate-50/10 px-2 pb-3 pt-1">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 text-base ${frame ? 'border-gold' : 'border-arcane-400/40'}`}>
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <IconCoffee size={18} className="text-arcane-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {title ? `${title.name.replace('Title: ', '')} ` : ''}
                      {user?.displayName}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-3 gap-2 rounded-xl bg-void-800/60 p-2.5 text-center">
                  <div>
                    <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                      <IconCoin size={11} className="text-gold-400/80" /> Gold
                    </p>
                    <p className="font-mono text-sm font-bold text-gold-400">{profile?.gold || 0}</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                      <IconSpark size={11} className="text-arcane-300/80" /> XP
                    </p>
                    <p className="font-mono text-sm font-bold text-arcane-300">
                      {profile?.totalXp?.toLocaleString() ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                      <IconFlame size={11} className="text-amber-300/80" /> Streak
                    </p>
                    <p className="font-mono text-sm font-bold text-amber-300">{profile?.streak || 0}</p>
                  </div>
                </div>

                <NavLink
                  to="/quests/archived"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-50/5 hover:text-white"
                >
                  <IconArchive size={16} className="text-arcane-300/80" />
                  The Archive
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
                >
                  <IconLogout size={16} />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
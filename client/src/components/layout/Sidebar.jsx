import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconHome, IconPen, IconBag, IconBackpack, IconUser } from '../ui/icons.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconHome },
  { to: '/quests', label: 'Journal', Icon: IconPen },
  { to: '/shop', label: 'The Stall', Icon: IconBag },
  { to: '/inventory', label: 'Satchel', Icon: IconBackpack },
  { to: '/profile', label: 'Hero', Icon: IconUser },
];

export function Sidebar() {
  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-50/10 bg-void-900/90 px-5 py-6 backdrop-blur lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt=""
            className="h-11 w-11 rounded-2xl border border-gold-500/30 shadow-gold"
          />
          <div>
            <p className="font-display text-xl font-bold tracking-wide text-white">
              Life<span className="text-arcane-300">Quest</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">cozy quest journal</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'}>
              {({ isActive }) => (
                <span
                  className={`relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-slate-50/5 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl border border-arcane-400/30 bg-gradient-to-r from-arcane-500/25 to-transparent"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="z-10"><l.Icon size={17} className="text-arcane-300/80" /></span>
                  <span className="z-10">{l.label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-gold-500/20 bg-gradient-to-b from-void-800/80 to-void-900/80 p-4">
          <p className="handnote text-lg text-gold-300">margin note ~</p>
          <p className="mt-1 text-xs italic leading-relaxed text-slate-400">
            "Small quests, done daily, warm the whole house."
          </p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-50/10 bg-void-900/95 px-2 py-2 backdrop-blur lg:hidden">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'}>
            {({ isActive }) => (
              <span
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-arcane-300' : 'text-slate-500'
                }`}
              >
                <span className={`grid place-items-center ${isActive ? 'text-arcane-200 drop-shadow-[0_0_6px_rgb(var(--c-arcane-500)_/_0.8)]' : 'text-slate-500'}`}>
                  <l.Icon size={19} />
                </span>
                {l.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
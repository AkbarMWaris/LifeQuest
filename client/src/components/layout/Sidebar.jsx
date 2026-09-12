import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏰' },
  { to: '/quests', label: 'Quests', icon: '🗡️' },
  { to: '/shop', label: 'Bazaar', icon: '🛒' },
  { to: '/inventory', label: 'Inventory', icon: '🎒' },
  { to: '/profile', label: 'Hero', icon: '🧙' },
];

export function Sidebar() {
  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-arcane-500/10 bg-void-900/90 px-5 py-6 backdrop-blur lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-arcane-400 to-arcane-700 text-xl shadow-glow">
            ⚔️
          </div>
          <div>
            <p className="font-display text-xl font-black tracking-wide text-white">
              Life<span className="text-arcane-300">Quest</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">real life · rpg</p>
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
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl border border-arcane-400/30 bg-gradient-to-r from-arcane-500/25 to-transparent"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="z-10">{l.icon}</span>
                  <span className="z-10">{l.label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-gold/20 bg-gradient-to-b from-[#1a1507]/80 to-void-900/80 p-4">
          <p className="text-xs font-semibold text-gold-400">Proverb of the Realm</p>
          <p className="mt-1 text-xs italic leading-relaxed text-slate-400">
            "Small quests, done daily, topple the mightiest of mountains."
          </p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-arcane-500/10 bg-void-900/95 px-2 py-2 backdrop-blur lg:hidden">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'}>
            {({ isActive }) => (
              <span
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-arcane-300' : 'text-slate-500'
                }`}
              >
                <span className={`text-lg ${isActive ? 'drop-shadow-[0_0_6px_rgba(139,92,246,0.9)]' : ''}`}>
                  {l.icon}
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
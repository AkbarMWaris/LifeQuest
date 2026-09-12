import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { FloatingRunes } from '../effects/FloatingRunes.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';

export function AppShell() {
  const { loading } = useAuth();

  return (
    <div className="relative min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <FloatingRunes />
      <Sidebar />
      <div className="relative z-10 flex min-h-screen flex-col lg:pl-60">
        <Topbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/3" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Skeleton className="h-72 lg:col-span-2" />
                <Skeleton className="h-72" />
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-20 pt-4 text-center text-xs text-slate-600 lg:px-8 lg:pb-6">
          <span className="handnote text-sm text-slate-500">LifeQuest · small quests, done daily, kept warm.</span>
        </footer>
      </div>
    </div>
  );
}
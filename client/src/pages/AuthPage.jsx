import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { errorMessage } from '../api/client.js';
import { FloatingRunes } from '../components/effects/FloatingRunes.jsx';
import { Button } from '../components/ui/Button.jsx';

const inputCls =
  'w-full rounded-lg border border-white/10 bg-void-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-arcane-400/50';

export function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const { user, login, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isSignup) {
        await signup(email, password, displayName);
        toast.success(`Welcome to the realm, ${displayName.split(' ')[0]}! ⚔️`);
      } else {
        await login(email, password);
        toast.success('Welcome back, hero!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-void-radial" />
      <FloatingRunes />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <span className="font-display text-2xl font-black text-white">
              Life<span className="text-arcane-300">Quest</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400">
            {isSignup ? 'Forge your hero and begin the adventure.' : 'Continue your legend.'}
          </p>
        </div>

        <form onSubmit={submit} className="panel space-y-4 p-8">
          {isSignup && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Hero name
              </label>
              <input
                className={inputCls}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Sir Disciplined"
                maxLength={40}
                required
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Email</label>
            <input
              className={inputCls}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@realm.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Password
            </label>
            <input
              className={inputCls}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
              minLength={8}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
            {busy ? 'Crossing the gate…' : isSignup ? 'Forge My Hero' : 'Enter the Realm'}
          </Button>

          <p className="pt-2 text-center text-sm text-slate-400">
            {isSignup ? (
              <>
                Already an adventurer?{' '}
                <Link to="/login" className="font-semibold text-arcane-300 hover:text-arcane-200">
                  Log in
                </Link>
              </>
            ) : (
              <>
                New to the realm?{' '}
                <Link to="/signup" className="font-semibold text-arcane-300 hover:text-arcane-200">
                  Create a hero
                </Link>
              </>
            )}
          </p>
        </form>

        <Link to="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-300">
          ← Back to the tavern
        </Link>
      </motion.div>
    </div>
  );
}
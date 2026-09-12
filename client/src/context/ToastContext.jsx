import React, { createContext, useContext, useCallback, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = useMemo(
    () => ({
      success: (m) => push(m, 'success'),
      error: (m) => push(m, 'error'),
      info: (m) => push(m, 'info'),
      gold: (m) => push(m, 'gold'),
    }),
    [push]
  );

  const styles = {
    success: 'border-emerald-400/40 bg-void-800/95 text-emerald-300',
    error: 'border-rose-400/40 bg-void-800/95 text-rose-300',
    info: 'border-arcane-400/40 bg-void-800/95 text-slate-200',
    gold: 'border-gold/50 bg-void-800/95 text-gold-300',
  };

  const icons = { success: '✓', error: '✕', info: 'ℹ', gold: '◆' };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`w-full rounded-xl border px-4 py-3 text-sm font-medium shadow-panel backdrop-blur ${styles[t.type]}`}
            >
              <span className="mr-2 font-bold">{icons[t.type]}</span>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
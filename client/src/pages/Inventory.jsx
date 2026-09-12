import React, { useEffect, useState, useMemo } from 'react';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { InventoryCard } from '../components/inventory/InventoryCard.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import { Button } from '../components/ui/Button.jsx';

export function Inventory() {
  const { refreshProfile } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    try {
      const { data } = await api.get('/inventory');
      setItems(data);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not open your satchel.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const equip = async (item, equip) => {
    setBusyId(item.ownedId);
    try {
      await api.post('/inventory/equip', { ownedId: item.ownedId, equip });
      await Promise.all([load(), refreshProfile()]);
      toast.info(equip ? `⚔️ Equipped "${item.name}".` : `Unequipped "${item.name}".`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const useItem = async (item) => {
    setBusyId(item.ownedId);
    try {
      await api.post('/inventory/use', { ownedId: item.ownedId });
      await Promise.all([load(), refreshProfile()]);
      toast.success(
        item.type === 'buff'
          ? `🧪 "${item.name}" consumed. ${item.effectJson?.multiplier || 1}× XP for ${item.effectJson?.durationMinutes || 60} minutes!`
          : `🧿 "Heartstone" glows. Your streak is protected.`
      );
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.type === filter)),
    [items, filter]
  );

  const chips = [
    { key: 'all', label: 'All' },
    { key: 'cosmetic', label: 'Cosmetics' },
    { key: 'title', label: 'Titles' },
    { key: 'buff', label: 'Buffs' },
    { key: 'streak_freeze', label: 'Streak Freeze' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black text-white">Inventory</h1>
        <p className="mt-1 text-sm text-slate-400">Everything you've earned, equipped, and saved.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filter === c.key
                ? 'border-arcane-400/60 bg-arcane-500/20 text-arcane-200'
                : 'border-white/10 bg-void-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
        <Button variant="ghost" size="xs" onClick={() => { load(); refreshProfile(); }} className="ml-auto">
          ↻ Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 p-14 text-center">
          <span className="animate-float text-5xl">🎒</span>
          <p className="font-display text-lg font-bold text-white">Your satchel is empty</p>
          <p className="max-w-sm text-sm text-slate-400">
            Complete quests for gold, then visit the bazaar to claim your first treasure.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <InventoryCard
              key={item.ownedId}
              item={item}
              onEquip={equip}
              onUse={useItem}
              busy={busyId === item.ownedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
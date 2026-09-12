import React, { useEffect, useState } from 'react';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ShopItemCard } from '../components/shop/ShopItemCard.jsx';
import { GoldCounter } from '../components/stats/GoldCounter.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';

export function Shop() {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [owned, setOwned] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [shopRes, invRes] = await Promise.all([api.get('/shop'), api.get('/inventory')]);
        setItems(shopRes.data);
        setOwned(new Set(invRes.data.map((i) => i.id)));
      } catch (err) {
        toast.error(errorMessage(err, 'Could not open the bazaar.'));
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const buy = async (item) => {
    setBuyingId(item.id);
    try {
      await api.post('/shop/purchase', { itemId: item.id });
      await refreshProfile();
      setOwned((prev) => new Set([...prev, item.id]));
      toast.gold(`🛒 Purchased "${item.name}"! It glimmers in your inventory.`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-white">The Bazaar</h1>
          <p className="mt-1 text-sm text-slate-400">Spend your hard-earned gold on glory and gear.</p>
        </div>
        <div className="panel flex items-center gap-3 px-5 py-3">
          <span className="text-xs uppercase tracking-wide text-slate-500">Your gold</span>
          <GoldCounter value={profile?.gold || 0} size="lg" highlight />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} className="h-56" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              canAfford={(profile?.gold || 0) >= item.costGold}
              owned={owned.has(item.id)}
              onBuy={buy}
              buying={buyingId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
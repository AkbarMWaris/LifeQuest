import { useEffect, useRef } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function useChallengePoller() {
  const toast = useToast();
  const { user } = useAuth();
  const seen = useRef(new Set());
  const seeded = useRef(false);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    let timer;

    const poll = async () => {
      try {
        const { data } = await api.get('/challenges');
        if (cancelled) return;
        const me = user.id;

        for (const c of data) {
          const key = `${c.id}:${c.status}:${c.winner || ''}`;

          if (c.status === 'completed' || c.status === 'declined' || c.status === 'expired') {
            if (!seeded.current) {
              seen.current.add(key);
              continue;
            }
            if (seen.current.has(key)) continue;
            seen.current.add(key);

            if (c.status === 'completed') {
              const won = String(c.winner) === String(me);
              if (won) {
                toast.success(`You beat ${c.loserName} on "${c.title}"! +${c.xpAwarded} XP, +${c.goldAwarded} gold`);
              } else {
                toast.info(`You lost to ${c.winnerName} on "${c.title}". The stakes go to them.`);
              }
            } else if (c.status === 'declined') {
              if (String(c.challenger) === String(me)) {
                toast.info(`${c.opponentName} declined your challenge "${c.title}".`);
              }
            } else {
              toast.info(`Your challenge "${c.title}" expired with no winner.`);
            }
          } else if (c.status === 'pending' && String(c.opponent) === String(me)) {
            if (!seeded.current) {
              seen.current.add(key);
              continue;
            }
            if (seen.current.has(key)) continue;
            seen.current.add(key);
            toast.info(`${c.challengerName} challenged you: "${c.title}" — head to the Arena.`);
          }
        }
        seeded.current = true;
      } catch {
        /* network hiccup — try again next tick */
      }
    };

    poll();
    timer = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [user?.id, toast]);

  return null;
}
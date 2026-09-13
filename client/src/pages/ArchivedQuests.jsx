import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { api, errorMessage } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { useQuestActions } from '../hooks/useQuestActions.js';
import { QuestCard } from '../components/quests/QuestCard.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import { IconArchive, IconCoffee } from '../components/ui/icons.jsx';

export function ArchivedQuests() {
  const toast = useToast();
  const { unarchiveQuest, deleteQuest } = useQuestActions();
  const [quests, setQuests] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/quests?archived=true');
      setQuests(data);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (quest) => {
    if (!window.confirm(`Permanently remove "${quest.title}"? This cannot be undone.`)) return;
    await deleteQuest(quest, load);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-medium text-white">
            <IconArchive size={26} className="text-arcane-300/80" /> The Archive
          </h1>
          <p className="mt-1 text-sm text-slate-400">Kept ones — finished quests tucked away. Restore or let them go.</p>
        </div>
        <Link
          to="/quests"
          className="rounded-xl border border-slate-50/10 bg-void-800/60 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-arcane-400/40 hover:text-white"
        >
          ← Back to the journal
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="h-48" />
          ))}
        </div>
      ) : quests.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 p-14 text-center">
          <span className="animate-float text-arcane-300/90"><IconCoffee size={44} /></span>
          <p className="font-display text-lg font-bold text-white">The archive is dust-free</p>
          <p className="max-w-sm text-sm text-slate-400">
            Finish a quest and hit the archive button on it — it'll wait for you here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {quests.map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onRestore={() => unarchiveQuest(q, load)}
                onDelete={() => remove(q)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
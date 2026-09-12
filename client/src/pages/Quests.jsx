import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api, errorMessage } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { useQuestActions } from '../hooks/useQuestActions.js';
import { QuestCard } from '../components/quests/QuestCard.jsx';
import { QuestFormModal } from '../components/quests/QuestFormModal.jsx';
import { QuestFilters } from '../components/quests/QuestFilters.jsx';
import { LevelUpOverlay } from '../components/effects/LevelUpOverlay.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import { Button } from '../components/ui/Button.jsx';

export function Quests() {
  const toast = useToast();
  const { completeQuest, archiveQuest, levelUp, closeLevelUp } = useQuestActions();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const load = async () => {
    try {
      const { data } = await api.get('/quests?archived=false');
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

  const createQuest = async (payload) => {
    setCreating(true);
    try {
      await api.post('/quests', payload);
      toast.success('✒️ Added to the journal. Now go do it.');
      await load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const filtered = useMemo(
    () =>
      quests.filter(
        (q) =>
          (typeFilter === 'all' || q.type === typeFilter) &&
          (difficultyFilter === 'all' || q.difficulty === difficultyFilter)
      ),
    [quests, typeFilter, difficultyFilter]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-white">The Journal</h1>
          <p className="mt-1 text-sm text-slate-400">Post small quests, cross them off, watch the XP bank.</p>
        </div>
        <Button variant="gold" onClick={() => setModalOpen(true)} className="px-6">
          + Post a quest
        </Button>
      </div>

      <QuestFilters
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 p-14 text-center">
          <span className="animate-float text-5xl">☕</span>
          <p className="font-display text-lg font-bold text-white">Nothing on this page yet</p>
          <p className="max-w-sm text-sm text-slate-400">
            {quests.length === 0
              ? 'The journal is blank. Post a quest to start banking XP and gold.'
              : 'Try a different filter, or post something new.'}
          </p>
          {quests.length === 0 && (
            <Button onClick={() => setModalOpen(true)} className="mt-2">
              Post my first quest
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onComplete={completeQuest}
                onArchive={() => archiveQuest(q, load)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <QuestFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createQuest}
        creating={creating}
      />

      <LevelUpOverlay
        open={Boolean(levelUp)}
        level={levelUp?.level}
        attrLeveledUp={levelUp?.attrLeveledUp}
        attribute={levelUp?.attribute}
        onClose={closeLevelUp}
      />
    </div>
  );
}
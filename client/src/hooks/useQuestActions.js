import { useCallback, useState } from 'react';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ATTRIBUTES } from '../lib/constants.js';

export function useQuestActions() {
  const { applyRewards } = useAuth();
  const toast = useToast();
  const [levelUp, setLevelUp] = useState(false);

  const completeQuest = useCallback(
    async (quest) => {
      const { data } = await api.post(`/completions/quests/${quest.id}/complete`);

      if (data?.payload) {
        applyRewards(data);
      }

      const rewards = data?.rewards || {};
      const levelUps = data?.levelUps || 0;
      const attrLeveledUp = data?.attrLeveledUp || false;
      const attr = data?.attr || null;
      const loot = data?.loot || null;
      const unlockedAchievements = data?.unlockedAchievements || [];

      if (rewards.streakBonus > 0) {
        toast.gold(`🔥 ${rewards.streak} day streak! +${rewards.streakBonus} streak bonus XP`);
      }
      toast.success(`✒️ "${quest.title}" — crossed off! +${rewards.xp || 0} XP, +${rewards.gold || 0} 🪙`);

      if (rewards.multiplier && rewards.multiplier > 1) {
        toast.info(`🧪 ${rewards.multiplier}× multiplier active!`);
      }

      if (unlockedAchievements.length) {
        unlockedAchievements.forEach((a) => toast.info(`🏆 Achievement: ${a.name}`));
      }
      if (loot) {
        toast.gold(`💎 Loot drop! You found "${loot.name}"`);
      }
      if (levelUps > 0) {
        const newLevel = data?.payload?.profile?.currentLevel;
        setLevelUp({
          level: newLevel || 0,
          attrLeveledUp,
          attribute: attr ? (ATTRIBUTES[attr]?.label || attr) : null,
        });
      }
      return data;
    },
    [applyRewards, toast]
  );

  const archiveQuest = useCallback(async (quest, reload) => {
    try {
      await api.delete(`/quests/${quest.id}`);
      toast.info(`🕯️ "${quest.title}" archived.`);
      reload?.();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }, [toast]);

  const closeLevelUp = useCallback(() => setLevelUp(false), []);

  return { completeQuest, archiveQuest, levelUp, closeLevelUp };
}
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
      applyRewards(data);

      const { rewards, levelUps, attrLeveledUp, attr, loot, unlockedAchievements } = data;
      if (rewards.streakBonus > 0) {
        toast.gold(`🔥 ${rewards.streak} day streak! +${rewards.streakBonus} streak bonus XP`);
      }
      toast.success(`⚔️ "${quest.title}" complete! +${rewards.xp} XP, +${rewards.gold} 🪙`);

      if (unlockedAchievements?.length) {
        unlockedAchievements.forEach((a) => toast.info(`🏆 Achievement: ${a.name}`));
      }
      if (loot) {
        toast.gold(`💎 Loot drop! You found "${loot.name}"`);
      }
      if (levelUps > 0) {
        setLevelUp({ level: data.payload.profile.currentLevel, attrLeveledUp, attribute: attr ? ATTRIBUTES[attr]?.label : null });
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
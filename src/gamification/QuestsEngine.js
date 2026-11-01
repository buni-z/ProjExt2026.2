/**
 * QuestsEngine.js
 * 
 * Gerencia as Missões Diárias (Daily Quests) e Desafios do Duolingo.
 * Concede micro-metas realizáveis que ativam o ciclo de dopamina e recompensam
 * o usuário com Gemas (economia virtual) e XP extra.
 */

class QuestsEngine {
  constructor() {
    this.defaultQuestTemplates = [
      {
        id: 'xp_target',
        title: 'Ganhe 30 de XP Banana hoje',
        target: 30,
        rewardGems: 10,
        rewardXp: 5,
        type: 'XP'
      },
      {
        id: 'lessons_completed',
        title: 'Complete 2 Missões do Esquadrão',
        target: 2,
        rewardGems: 15,
        rewardXp: 10,
        type: 'LESSON_COUNT'
      },
      {
        id: 'perfect_combo',
        title: 'Acerte 5 perguntas seguidas sem explodir',
        target: 5,
        rewardGems: 20,
        rewardXp: 15,
        type: 'COMBO'
      }
    ];
  }

  /**
   * Inicializa as missões diárias para o usuário para o dia especificado.
   */
  generateDailyQuests(dateStr = new Date().toISOString().slice(0, 10)) {
    return this.defaultQuestTemplates.map(template => ({
      questId: `${template.id}_${dateStr}`,
      title: template.title,
      type: template.type,
      target: template.target,
      currentProgress: 0,
      isCompleted: false,
      claimed: false,
      rewardGems: template.rewardGems,
      rewardXp: template.rewardXp
    }));
  }

  /**
   * Atualiza o progresso das missões diárias com base no resultado de uma lição concluída.
   * 
   * @param {Array<Object>} quests - Lista de missões do usuário
   * @param {Object} eventData - Dados do evento
   * @param {number} eventData.xpEarned - XP obtido
   * @param {number} eventData.maxCombo - Maior combo de acertos consecutivos
   * @param {boolean} eventData.isLessonComplete - Se a lição foi finalizada com sucesso
   * @returns {Object} { quests, newlyCompletedQuests, totalRewards: { gems, xp } }
   */
  updateProgress(quests, eventData) {
    const updatedQuests = [];
    const newlyCompletedQuests = [];
    let totalGems = 0;
    let totalXp = 0;

    for (const q of quests) {
      const quest = { ...q };

      if (!quest.isCompleted) {
        if (quest.type === 'XP' && eventData.xpEarned) {
          quest.currentProgress = Math.min(quest.target, quest.currentProgress + eventData.xpEarned);
        } else if (quest.type === 'LESSON_COUNT' && eventData.isLessonComplete) {
          quest.currentProgress = Math.min(quest.target, quest.currentProgress + 1);
        } else if (quest.type === 'COMBO' && eventData.maxCombo) {
          quest.currentProgress = Math.min(quest.target, Math.max(quest.currentProgress, eventData.maxCombo));
        }

        if (quest.currentProgress >= quest.target) {
          quest.isCompleted = true;
          totalGems += quest.rewardGems;
          totalXp += quest.rewardXp;
          newlyCompletedQuests.push({ ...quest });
        }
      }

      updatedQuests.push(quest);
    }

    return {
      quests: updatedQuests,
      newlyCompletedQuests,
      rewardsGranted: {
        gems: totalGems,
        xp: totalXp
      }
    };
  }
}

module.exports = QuestsEngine;

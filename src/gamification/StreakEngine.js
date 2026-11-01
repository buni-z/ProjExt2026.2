/**
 * StreakEngine.js
 * 
 * Implementação inspirada no motor de Ofensiva (Streaks) do Duolingo.
 * Gerencia dias consecutivos de atividade, proteção de ofensiva (Streak Freeze)
 * e cálculo de bônus baseado em hábitos contínuos.
 */

class StreakEngine {
  constructor(options = {}) {
    // Horas de tolerância para fuso horário / período de graça (Duolingo usa janela até a meia-noite local)
    this.graceHours = options.graceHours || 24;
  }

  /**
   * Avalia e atualiza o estado da ofensiva do usuário com base em uma nova atividade realizada.
   * 
   * @param {Object} currentStreakState - Estado atual da ofensiva do usuário
   * @param {number} currentStreakState.currentStreak - Contagem atual de dias
   * @param {number} currentStreakState.maxStreak - Recorde de dias
   * @param {string|null} currentStreakState.lastActiveDate - Data ISO (YYYY-MM-DD) da última atividade
   * @param {number} currentStreakState.streakFreezesAvailable - Quantidade de bloqueios de ofensiva disponíveis
   * @param {Date} [activityDate=new Date()] - Data e hora da atividade atual
   * @returns {Object} Novo estado atualizado e evento gerado
   */
  recordActivity(currentStreakState, activityDate = new Date()) {
    const todayStr = this._toDateString(activityDate);
    const lastActive = currentStreakState.lastActiveDate;

    // Se já praticou hoje, a ofensiva se mantém sem alteração
    if (lastActive === todayStr) {
      return {
        state: { ...currentStreakState },
        event: 'ALREADY_ACTIVE_TODAY',
        message: 'Atividade de hoje já registrada. Ofensiva mantida!'
      };
    }

    // Se é a primeira atividade na história do usuário
    if (!lastActive) {
      const newState = {
        ...currentStreakState,
        currentStreak: 1,
        maxStreak: Math.max(1, currentStreakState.maxStreak || 0),
        lastActiveDate: todayStr,
        streakFreezesUsed: currentStreakState.streakFreezesUsed || 0
      };

      return {
        state: newState,
        event: 'STREAK_STARTED',
        streakCount: 1,
        message: 'Ofensiva iniciada! 1 dia consecutivo.'
      };
    }

    const diffDays = this._daysBetween(lastActive, todayStr);

    // Atividade realizada no dia seguinte consecutivo
    if (diffDays === 1) {
      const newStreak = currentStreakState.currentStreak + 1;
      const newState = {
        ...currentStreakState,
        currentStreak: newStreak,
        maxStreak: Math.max(newStreak, currentStreakState.maxStreak || 0),
        lastActiveDate: todayStr
      };

      return {
        state: newState,
        event: 'STREAK_INCREASED',
        streakCount: newStreak,
        multiplier: this.calculateStreakMultiplier(newStreak),
        message: `Incrível! Ofensiva aumentada para ${newStreak} dias!`
      };
    }

    // Passou 1 dia sem atividade (diffDays === 2): Usuário pulou ontem!
    if (diffDays === 2) {
      // Verifica se o usuário tem Bloqueio de Ofensiva (Streak Freeze) disponível
      if (currentStreakState.streakFreezesAvailable > 0) {
        const newStreak = currentStreakState.currentStreak + 1;
        const newState = {
          ...currentStreakState,
          currentStreak: newStreak,
          maxStreak: Math.max(newStreak, currentStreakState.maxStreak || 0),
          lastActiveDate: todayStr,
          streakFreezesAvailable: currentStreakState.streakFreezesAvailable - 1,
          streakFreezesUsed: (currentStreakState.streakFreezesUsed || 0) + 1
        };

        return {
          state: newState,
          event: 'STREAK_FROZEN_SAVED',
          streakCount: newStreak,
          message: 'Seu Bloqueio de Ofensiva salvou sua sequência de dias!'
        };
      }
    }

    // Perda da ofensiva: mais de 1 dia de inatividade sem proteção
    const newState = {
      ...currentStreakState,
      currentStreak: 1,
      lastActiveDate: todayStr
    };

    return {
      state: newState,
      event: 'STREAK_RESET',
      previousStreak: currentStreakState.currentStreak,
      streakCount: 1,
      message: `Sua ofensiva anterior de ${currentStreakState.currentStreak} dias foi reiniciada. Não desanime!`
    };
  }

  /**
   * Calcula um multiplicador de XP baseado na consistência da ofensiva
   * (Gamification mechanic do Duolingo: bônus de consistência)
   */
  calculateStreakMultiplier(streak) {
    if (streak >= 30) return 1.5; // +50% bônus de XP após 30 dias
    if (streak >= 14) return 1.3; // +30% bônus após 2 semanas
    if (streak >= 7)  return 1.2; // +20% bônus após 1 semana
    if (streak >= 3)  return 1.1; // +10% bônus após 3 dias
    return 1.0;
  }

  _toDateString(date) {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  _daysBetween(dateStr1, dateStr2) {
    const d1 = new Date(dateStr1 + 'T00:00:00Z');
    const d2 = new Date(dateStr2 + 'T00:00:00Z');
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }
}

module.exports = StreakEngine;

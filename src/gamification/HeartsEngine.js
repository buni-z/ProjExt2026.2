/**
 * HeartsEngine.js
 * 
 * Implementação do sistema de Vidas/Corações (Hearts) do Duolingo.
 * Utiliza o princípio de 'Aversão à Perda' para aumentar o foco do usuário
 * e oferece a mecânica de 'Prática para Recuperar Vidas'.
 */

class HeartsEngine {
  constructor(options = {}) {
    this.maxHearts = options.maxHearts || 5;
    // Tempo para regenerar 1 vida passivamente (em minutos) - padrão 4 horas (240 min)
    this.refillTimeMinutesPerHeart = options.refillTimeMinutesPerHeart || 240;
  }

  /**
   * Inicializa ou normaliza o estado dos corações do usuário considerando o tempo decorrido.
   * 
   * @param {Object} state - Estado atual
   * @param {number} state.currentHearts - Corações atuais
   * @param {string|null} state.lastDepletedAt - Timestamp ISO de quando perdeu o último coração
   * @param {Date} [now=new Date()]
   * @returns {Object} Estado atualizado com regeneração passiva aplicada
   */
  getRefreshedState(state, now = new Date()) {
    const currentHearts = state.currentHearts ?? this.maxHearts;
    if (currentHearts >= this.maxHearts) {
      return {
        currentHearts: this.maxHearts,
        maxHearts: this.maxHearts,
        lastDepletedAt: null,
        minutesUntilNextHeart: null
      };
    }

    if (!state.lastDepletedAt) {
      return {
        currentHearts,
        maxHearts: this.maxHearts,
        lastDepletedAt: now.toISOString(),
        minutesUntilNextHeart: this.refillTimeMinutesPerHeart
      };
    }

    const elapsedMs = now.getTime() - new Date(state.lastDepletedAt).getTime();
    const elapsedMinutes = Math.max(0, elapsedMs / (1000 * 60));
    const heartsRegenerated = Math.floor(elapsedMinutes / this.refillTimeMinutesPerHeart);

    if (heartsRegenerated > 0) {
      const updatedHearts = Math.min(this.maxHearts, currentHearts + heartsRegenerated);
      const remainingMinutesInCycle = elapsedMinutes % this.refillTimeMinutesPerHeart;
      const minutesUntilNext = updatedHearts >= this.maxHearts 
        ? null 
        : Math.round(this.refillTimeMinutesPerHeart - remainingMinutesInCycle);

      return {
        currentHearts: updatedHearts,
        maxHearts: this.maxHearts,
        lastDepletedAt: updatedHearts >= this.maxHearts ? null : new Date(now.getTime() - (remainingMinutesInCycle * 60 * 1000)).toISOString(),
        minutesUntilNextHeart: minutesUntilNext
      };
    }

    const minutesUntilNext = Math.round(this.refillTimeMinutesPerHeart - elapsedMinutes);
    return {
      currentHearts,
      maxHearts: this.maxHearts,
      lastDepletedAt: state.lastDepletedAt,
      minutesUntilNextHeart: minutesUntilNext
    };
  }

  /**
   * Consome 1 coração após um erro em lição.
   */
  consumeHeart(state, now = new Date()) {
    const refreshed = this.getRefreshedState(state, now);
    if (refreshed.currentHearts <= 0) {
      return {
        state: refreshed,
        consumed: false,
        isDepleted: true,
        message: 'Você está sem vidas! Pratique para recuperar corações ou aguarde a regeneração.'
      };
    }

    const newHearts = refreshed.currentHearts - 1;
    const newState = {
      currentHearts: newHearts,
      maxHearts: this.maxHearts,
      lastDepletedAt: (refreshed.lastDepletedAt || now.toISOString()),
      minutesUntilNextHeart: refreshed.minutesUntilNextHeart || this.refillTimeMinutesPerHeart
    };

    return {
      state: newState,
      consumed: true,
      currentHearts: newHearts,
      isDepleted: newHearts === 0,
      message: newHearts > 0 
        ? `Você errou e perdeu 1 coração. Restam ${newHearts}/${this.maxHearts} vidas.`
        : 'Atenção! Suas vidas acabaram. Faça um treino de revisão para ganhar +1 coração!'
    };
  }

  /**
   * Concede 1 coração através de sessão de prática ('Practice to Refill')
   */
  practiceRefill(state, heartsEarned = 1) {
    const refreshed = this.getRefreshedState(state);
    const newHearts = Math.min(this.maxHearts, refreshed.currentHearts + heartsEarned);

    return {
      state: {
        currentHearts: newHearts,
        maxHearts: this.maxHearts,
        lastDepletedAt: newHearts >= this.maxHearts ? null : refreshed.lastDepletedAt,
        minutesUntilNextHeart: newHearts >= this.maxHearts ? null : refreshed.minutesUntilNextHeart
      },
      heartsEarned,
      currentHearts: newHearts,
      message: `Excelente treino! Você recuperou +${heartsEarned} coração(ões)!`
    };
  }
}

module.exports = HeartsEngine;

/**
 * SpacedRepetitionHLR.js
 * 
 * Implementação do algoritmo de Repetição Espaçada inspirado no Half-Life Regression (HLR) do Duolingo
 * (Referência: Settles & Meeder, ACL 2016 - "A Trainable Spaced Repetition Model for Language Learning").
 * 
 * Modela o decaimento exponencial da memória humana:
 * p = 2^(-delta_t / h)
 * Onde:
 *   - p: probabilidade estimada de recordar o item com sucesso
 *   - delta_t: tempo transcorrido desde a última revisão (em horas ou dias)
 *   - h: meia-vida (half-life) da memória do conceito para aquele usuário
 */

class SpacedRepetitionHLR {
  constructor(options = {}) {
    this.defaultHalfLifeHours = options.defaultHalfLifeHours || 24; // 1 dia inicial
    this.minHalfLifeHours = options.minHalfLifeHours || 4; // mínimo 4 horas
    this.recallThreshold = options.recallThreshold || 0.75; // revisar quando p < 75%
  }

  /**
   * Calcula a probabilidade estimada de recordar um item após delta_t horas.
   * 
   * @param {number} deltaHours - Tempo transcorrido desde a última revisão em horas
   * @param {number} halfLifeHours - Meia-vida atual da memória em horas
   * @returns {number} Probabilidade de retenção (0.0 a 1.0)
   */
  calculateRecallProbability(deltaHours, halfLifeHours) {
    if (deltaHours <= 0) return 1.0;
    const h = Math.max(this.minHalfLifeHours, halfLifeHours);
    // Fórmula Duolingo HLR: p = 2^(-delta_t / h)
    return Math.pow(2, -deltaHours / h);
  }

  /**
   * Atualiza a meia-vida do item após o usuário responder a um exercício.
   * 
   * @param {Object} itemState - Estado atual do item
   * @param {number} itemState.halfLifeHours - Meia-vida anterior
   * @param {number} itemState.consecutiveCorrect - Sequência de acertos
   * @param {number} itemState.totalAttempts - Total de respostas dadas
   * @param {boolean} isCorrect - Se o usuário acertou
   * @param {number} [difficulty=1.0] - Dificuldade intrínseca do item (1.0 = normal)
   * @returns {Object} Novo estado atualizado do item
   */
  updateItemMemory(itemState, isCorrect, difficulty = 1.0) {
    const currentHalfLife = itemState.halfLifeHours || this.defaultHalfLifeHours;
    const totalAttempts = (itemState.totalAttempts || 0) + 1;
    let consecutiveCorrect = itemState.consecutiveCorrect || 0;
    let newHalfLife = currentHalfLife;

    if (isCorrect) {
      consecutiveCorrect += 1;
      // Fator multiplicador de expansão da memória: cresce com a estabilidade
      const expansionFactor = 1.5 + (0.3 * Math.min(consecutiveCorrect, 5)) / Math.max(0.5, difficulty);
      newHalfLife = currentHalfLife * expansionFactor;
    } else {
      consecutiveCorrect = 0;
      // Em caso de erro, a meia-vida colapsa (penalidade de retenção)
      newHalfLife = Math.max(this.minHalfLifeHours, currentHalfLife * 0.4);
    }

    // Calcula quando deve ser a próxima revisão ideal (quando p atinge recallThreshold)
    // p = 2^(-t / h) => log2(p) = -t / h => t = -h * log2(p)
    const optimalReviewDelayHours = -newHalfLife * Math.log2(this.recallThreshold);

    return {
      halfLifeHours: Math.round(newHalfLife * 10) / 10,
      consecutiveCorrect,
      totalAttempts,
      lastReviewedAt: new Date().toISOString(),
      optimalReviewDelayHours: Math.round(optimalReviewDelayHours * 10) / 10,
      nextReviewDate: new Date(Date.now() + optimalReviewDelayHours * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Avalia uma lista de conteúdos/conceitos do usuário e prioriza os que mais precisam de revisão.
   * 
   * @param {Array<Object>} items - Lista de itens com { id, title, halfLifeHours, lastReviewedAt }
   * @param {Date} [currentTime=new Date()]
   * @returns {Array<Object>} Itens ordenados pelo nível de urgência de revisão (menor probabilidade primeiro)
   */
  getReviewQueue(items, currentTime = new Date()) {
    const nowMs = currentTime.getTime();

    const evaluated = items.map(item => {
      const lastReviewedMs = item.lastReviewedAt ? new Date(item.lastReviewedAt).getTime() : 0;
      const deltaHours = lastReviewedMs > 0 ? Math.max(0, (nowMs - lastReviewedMs) / (1000 * 60 * 60)) : 9999;
      const halfLife = item.halfLifeHours || this.defaultHalfLifeHours;
      const recallProb = this.calculateRecallProbability(deltaHours, halfLife);

      return {
        ...item,
        currentRecallProbability: Math.round(recallProb * 100) / 100,
        hoursSinceReview: Math.round(deltaHours * 10) / 10,
        needsReview: recallProb < this.recallThreshold
      };
    });

    // Ordena do menor índice de probabilidade (mais urgente) para o maior
    return evaluated.sort((a, b) => a.currentRecallProbability - b.currentRecallProbability);
  }
}

module.exports = SpacedRepetitionHLR;

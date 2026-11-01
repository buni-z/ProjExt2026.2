/**
 * SessionGenerator.js
 * 
 * Inspirado no famoso 'Session Generator' do Duolingo (motor de microsserviço
 * reescrito em Scala para alta performance).
 * 
 * Responsabilidades:
 * 1. Curar uma sessão personalizada de exercícios misturando conceitos novos e
 *    itens com menor retenção de memória predita pelo HLR (Spaced Repetition).
 * 2. Calcular XP com bônus de combo (acertos seguidos) e precisão.
 */

class SessionGenerator {
  constructor(options = {}) {
    this.baseXpPerLesson = options.baseXpPerLesson || 10;
    this.bonusPerPerfect = options.bonusPerPerfect || 5;
  }

  /**
   * Monta uma sessão de estudos personalizada combinando itens prioritários de revisão e novos desafios.
   * 
   * @param {Array<Object>} contentCatalog - Banco de exercícios / desafios disponíveis
   * @param {Array<Object>} reviewPriorityItems - Itens ordenados pelo HLR com menor probabilidade de recall
   * @param {number} [sessionLength=5] - Quantidade de exercícios na sessão
   */
  generateSession(contentCatalog, reviewPriorityItems = [], sessionLength = 5) {
    const sessionItems = [];
    const usedIds = new Set();

    // 1. Prioriza itens que precisam de reforço imediato (Spaced Repetition)
    for (const item of reviewPriorityItems) {
      if (sessionItems.length >= Math.ceil(sessionLength * 0.6)) break; // Até 60% de revisão
      const fullItem = contentCatalog.find(c => c.id === item.id);
      if (fullItem && !usedIds.has(fullItem.id)) {
        sessionItems.push({
          ...fullItem,
          isReview: true,
          previousRecallProbability: item.currentRecallProbability
        });
        usedIds.add(fullItem.id);
      }
    }

    // 2. Preenche o restante com novos tópicos ou itens do catálogo
    for (const item of contentCatalog) {
      if (sessionItems.length >= sessionLength) break;
      if (!usedIds.has(item.id)) {
        sessionItems.push({
          ...item,
          isReview: false
        });
        usedIds.add(item.id);
      }
    }

    return {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      totalQuestions: sessionItems.length,
      exercises: sessionItems
    };
  }

  /**
   * Avalia a submissão de uma sessão completa e calcula o ganho de XP detalhado.
   * 
   * @param {Object} results
   * @param {number} results.totalQuestions
   * @param {number} results.correctCount
   * @param {number} results.maxCombo - Maior sequência de acertos seguidos
   * @param {number} [streakMultiplier=1.0] - Multiplicador de ofensiva vindo do StreakEngine
   */
  evaluateSession(results, streakMultiplier = 1.0) {
    const { totalQuestions, correctCount, maxCombo } = results;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) : 0;
    const isPerfect = correctCount === totalQuestions && totalQuestions > 0;

    // Cálculo do XP
    let xp = this.baseXpPerLesson;

    // Bônus por precisão perfeita (duolingo reward sound)
    if (isPerfect) {
      xp += this.bonusPerPerfect;
    } else if (accuracy >= 0.8) {
      xp += 2;
    }

    // Bônus de Combo (foco contínuo)
    if (maxCombo >= 5) {
      xp += 3;
    }

    // Aplica o multiplicador de consistência da Ofensiva
    const finalXp = Math.round(xp * streakMultiplier);

    return {
      baseXp: this.baseXpPerLesson,
      comboBonus: maxCombo >= 5 ? 3 : 0,
      perfectBonus: isPerfect ? this.bonusPerPerfect : 0,
      streakMultiplier,
      totalXpEarned: finalXp,
      accuracy: Math.round(accuracy * 100),
      isPerfect,
      isLessonComplete: accuracy >= 0.6 // Critério de aprovação (mínimo 60% de acerto)
    };
  }
}

module.exports = SessionGenerator;

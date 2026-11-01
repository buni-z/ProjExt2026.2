/**
 * GamificationService.js
 * 
 * Fachada principal de gamificação que integra:
 * - Ofensivas diárias (Streaks) com bloqueio (Streak Freeze)
 * - Repetição espaçada Half-Life Regression (HLR)
 * - Vidas/Corações (Hearts) com aversão à perda e recarga por prática
 * - Ligas competitivas de 30 pessoas (Cohorts)
 * - Missões diárias e XP com combos
 */

const StreakEngine = require('./StreakEngine');
const SpacedRepetitionHLR = require('./SpacedRepetitionHLR');
const HeartsEngine = require('./HeartsEngine');
const LeagueManager = require('./LeagueManager');
const QuestsEngine = require('./QuestsEngine');
const SessionGenerator = require('./SessionGenerator');

class GamificationService {
  constructor(options = {}) {
    this.streakEngine = new StreakEngine(options.streak);
    this.hlrEngine = new SpacedRepetitionHLR(options.hlr);
    this.heartsEngine = new HeartsEngine(options.hearts);
    this.leagueManager = new LeagueManager(options.league);
    this.questsEngine = new QuestsEngine();
    this.sessionGenerator = new SessionGenerator(options.session);
  }

  /**
   * Processa a conclusão de uma lição ou exercício com todas as mecânicas integradas.
   * 
   * @param {Object} params
   * @param {string} params.userId - Identificador do estudante
   * @param {string} params.username - Nome do estudante
   * @param {number} params.userTierIndex - Divisão atual na liga (0=Bronze, 9=Diamante)
   * @param {Object} params.streakState - Estado da ofensiva
   * @param {Object} params.heartsState - Estado dos corações
   * @param {Array<Object>} params.dailyQuests - Missões diárias atuais
   * @param {Array<Object>} params.itemMemoryStates - Estados dos itens no HLR [{ id, halfLifeHours, ... }]
   * @param {Array<Object>} params.answers - Respostas dadas [{ itemId, isCorrect, difficulty }]
   * @param {number} [params.weekNumber=1] - Semana competitiva atual
   * @param {Date} [params.timestamp=new Date()]
   */
  processLessonCompletion(params) {
    const {
      userId,
      username,
      userTierIndex = 0,
      streakState,
      heartsState,
      dailyQuests = [],
      itemMemoryStates = [],
      answers = [],
      weekNumber = 1,
      timestamp = new Date()
    } = params;

    // 1. Processa erros e corações
    let currentHearts = { ...heartsState };
    let mistakes = 0;
    let combo = 0;
    let maxCombo = 0;

    for (const ans of answers) {
      if (ans.isCorrect) {
        combo += 1;
        if (combo > maxCombo) maxCombo = combo;
      } else {
        combo = 0;
        mistakes += 1;
        const heartResult = this.heartsEngine.consumeHeart(currentHearts, timestamp);
        currentHearts = heartResult.state;
      }
    }

    const totalQuestions = answers.length;
    const correctCount = totalQuestions - mistakes;

    // 2. Atualiza Ofensiva (Streak)
    const streakResult = this.streakEngine.recordActivity(streakState, timestamp);
    const streakMultiplier = this.streakEngine.calculateStreakMultiplier(streakResult.state.currentStreak);

    // 3. Avalia Pontuação e XP
    const evaluation = this.sessionGenerator.evaluateSession({
      totalQuestions,
      correctCount,
      maxCombo
    }, streakMultiplier);

    // 4. Atualiza Memória no HLR para cada item respondido
    const updatedMemory = answers.map(ans => {
      const existingState = itemMemoryStates.find(m => m.id === ans.itemId) || {
        id: ans.itemId,
        halfLifeHours: 24,
        consecutiveCorrect: 0,
        totalAttempts: 0
      };
      const updated = this.hlrEngine.updateItemMemory(existingState, ans.isCorrect, ans.difficulty || 1.0);
      return {
        id: ans.itemId,
        ...updated
      };
    });

    // 5. Atualiza Ligas e Placares (Cohorts de 30 usuários)
    let leagueStanding = null;
    if (evaluation.totalXpEarned > 0) {
      leagueStanding = this.leagueManager.addXpAndSync(
        userId,
        username,
        userTierIndex,
        evaluation.totalXpEarned,
        weekNumber
      );
    }

    // 6. Atualiza Missões Diárias
    const questsResult = this.questsEngine.updateProgress(dailyQuests, {
      xpEarned: evaluation.totalXpEarned,
      maxCombo,
      isLessonComplete: evaluation.isLessonComplete
    });

    return {
      sessionSummary: {
        totalQuestions,
        correctCount,
        mistakes,
        maxCombo,
        accuracy: evaluation.accuracy,
        xpEarned: evaluation.totalXpEarned,
        streakMultiplier: evaluation.streakMultiplier,
        isPerfect: evaluation.isPerfect,
        isLessonComplete: evaluation.isLessonComplete
      },
      streak: streakResult,
      hearts: {
        state: currentHearts,
        lostInSession: mistakes,
        isDepleted: currentHearts.currentHearts <= 0
      },
      league: leagueStanding,
      memoryUpdates: updatedMemory,
      quests: questsResult
    };
  }
}

module.exports = GamificationService;

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  GamificationService,
  StreakEngine,
  SpacedRepetitionHLR,
  HeartsEngine,
  LeagueManager,
  QuestsEngine,
  SessionGenerator
} = require('../src/index');

describe('🎮 Duolingo-like Gamification Engine for REA', () => {

  describe('🔥 StreakEngine (Ofensiva)', () => {
    const streakEngine = new StreakEngine();

    test('deve iniciar uma ofensiva de 1 dia na primeira atividade', () => {
      const state = { currentStreak: 0, maxStreak: 0, lastActiveDate: null, streakFreezesAvailable: 1 };
      const res = streakEngine.recordActivity(state, new Date('2026-10-01T10:00:00Z'));

      assert.equal(res.event, 'STREAK_STARTED');
      assert.equal(res.state.currentStreak, 1);
      assert.equal(res.state.maxStreak, 1);
      assert.equal(res.state.lastActiveDate, '2026-10-01');
    });

    test('deve incrementar a ofensiva em dias consecutivos', () => {
      const state = { currentStreak: 1, maxStreak: 1, lastActiveDate: '2026-10-01', streakFreezesAvailable: 1 };
      const res = streakEngine.recordActivity(state, new Date('2026-10-02T14:00:00Z'));

      assert.equal(res.event, 'STREAK_INCREASED');
      assert.equal(res.state.currentStreak, 2);
    });

    test('não deve alterar a ofensiva se o usuário já praticou no mesmo dia', () => {
      const state = { currentStreak: 5, maxStreak: 5, lastActiveDate: '2026-10-02', streakFreezesAvailable: 1 };
      const res = streakEngine.recordActivity(state, new Date('2026-10-02T20:00:00Z'));

      assert.equal(res.event, 'ALREADY_ACTIVE_TODAY');
      assert.equal(res.state.currentStreak, 5);
    });

    test('deve consumir Bloqueio de Ofensiva (Streak Freeze) ao pular 1 dia', () => {
      const state = { currentStreak: 10, maxStreak: 10, lastActiveDate: '2026-10-01', streakFreezesAvailable: 2 };
      // Pulou dia 02 e praticou no dia 03
      const res = streakEngine.recordActivity(state, new Date('2026-10-03T10:00:00Z'));

      assert.equal(res.event, 'STREAK_FROZEN_SAVED');
      assert.equal(res.state.currentStreak, 11);
      assert.equal(res.state.streakFreezesAvailable, 1);
    });

    test('deve reiniciar ofensiva se pulou dias sem ter Bloqueio de Ofensiva', () => {
      const state = { currentStreak: 15, maxStreak: 15, lastActiveDate: '2026-10-01', streakFreezesAvailable: 0 };
      const res = streakEngine.recordActivity(state, new Date('2026-10-04T10:00:00Z'));

      assert.equal(res.event, 'STREAK_RESET');
      assert.equal(res.state.currentStreak, 1);
      assert.equal(res.previousStreak, 15);
    });
  });

  describe('🧠 SpacedRepetitionHLR (Half-Life Regression)', () => {
    const hlr = new SpacedRepetitionHLR({ defaultHalfLifeHours: 24, recallThreshold: 0.75 });

    test('deve calcular probabilidade de recall decaindo com o tempo (p = 2^(-dt / h))', () => {
      // delta = 0 => p = 1.0
      assert.equal(hlr.calculateRecallProbability(0, 24), 1.0);
      // delta = 24h e h = 24h => p = 2^(-1) = 0.5
      assert.equal(hlr.calculateRecallProbability(24, 24), 0.5);
    });

    test('deve aumentar a meia-vida ao acertar e diminuir ao errar', () => {
      const initialItem = { halfLifeHours: 24, consecutiveCorrect: 0, totalAttempts: 1 };
      
      const success = hlr.updateItemMemory(initialItem, true);
      assert.ok(success.halfLifeHours > 24, 'Meia-vida deve aumentar após sucesso');
      assert.equal(success.consecutiveCorrect, 1);

      const fail = hlr.updateItemMemory(initialItem, false);
      assert.ok(fail.halfLifeHours < 24, 'Meia-vida deve cair após erro');
      assert.equal(fail.consecutiveCorrect, 0);
    });

    test('deve priorizar na fila de revisão os itens com menor recall', () => {
      const now = new Date('2026-10-20T12:00:00Z');
      const items = [
        { id: 'item_recente', halfLifeHours: 48, lastReviewedAt: '2026-10-20T10:00:00Z' }, // 2h atrás
        { id: 'item_esquecido', halfLifeHours: 24, lastReviewedAt: '2026-10-17T12:00:00Z' }  // 72h atrás
      ];

      const queue = hlr.getReviewQueue(items, now);
      assert.equal(queue[0].id, 'item_esquecido', 'Item mais esquecido deve vir primeiro');
      assert.equal(queue[0].needsReview, true);
    });
  });

  describe('❤️ HeartsEngine (Sistema de Vidas)', () => {
    const hearts = new HeartsEngine({ maxHearts: 5, refillTimeMinutesPerHeart: 240 });

    test('deve consumir 1 vida ao errar e alertar esgotamento em 0', () => {
      let state = { currentHearts: 2 };
      let res = hearts.consumeHeart(state);
      assert.equal(res.currentHearts, 1);
      assert.equal(res.isDepleted, false);

      res = hearts.consumeHeart(res.state);
      assert.equal(res.currentHearts, 0);
      assert.equal(res.isDepleted, true);
    });

    test('deve recuperar vida através de treino de prática', () => {
      const state = { currentHearts: 2 };
      const res = hearts.practiceRefill(state, 1);
      assert.equal(res.currentHearts, 3);
    });
  });

  describe('🏆 LeagueManager (Cohorts de 30 usuários e Ligas)', () => {
    test('deve alocar usuários em cohort e calcular rankings e promoções', () => {
      const lm = new LeagueManager({ cohortSize: 30, promotionCount: 3, demotionCount: 2 });

      lm.addXpAndSync('user_1', 'Alice', 0, 100, 1);
      lm.addXpAndSync('user_2', 'Bob', 0, 150, 1);
      const res3 = lm.addXpAndSync('user_3', 'Charlie', 0, 50, 1);

      assert.equal(res3.leaderboard[0].username, 'Bob');
      assert.equal(res3.leaderboard[0].rank, 1);
      assert.equal(res3.leaderboard[1].username, 'Alice');
      assert.equal(res3.leaderboard[2].username, 'Charlie');

      // Verifica rollover semanal
      const rollover = lm.resolveWeeklyRollover(res3.leagueId);
      const bob = rollover.find(r => r.userId === 'user_2');
      assert.equal(bob.outcome, 'PROMOTED');
      assert.equal(bob.nextTier, 'Prata');
    });
  });

  describe('🎯 QuestsEngine (Missões Diárias)', () => {
    test('deve atualizar o progresso das missões diárias e premiar gemas', () => {
      const qe = new QuestsEngine();
      const dailyQuests = qe.generateDailyQuests('2026-10-19');

      const result = qe.updateProgress(dailyQuests, {
        xpEarned: 35,
        maxCombo: 6,
        isLessonComplete: true
      });

      // Missão de 30 XP e missão de combo 5 devem estar completas
      const xpQuest = result.quests.find(q => q.type === 'XP');
      assert.equal(xpQuest.isCompleted, true);
      assert.ok(result.rewardsGranted.gems > 0);
    });
  });

  describe('🚀 GamificationService (Integração Completa)', () => {
    test('deve orquestrar sessão com sucesso, ofensiva, XP, HLR e ranking', () => {
      const service = new GamificationService();

      const result = service.processLessonCompletion({
        userId: 'student_123',
        username: 'Lucas Dev',
        userTierIndex: 0,
        streakState: { currentStreak: 3, maxStreak: 3, lastActiveDate: '2026-10-18', streakFreezesAvailable: 1 },
        heartsState: { currentHearts: 5 },
        dailyQuests: service.questsEngine.generateDailyQuests('2026-10-19'),
        answers: [
          { itemId: 'concept_loops', isCorrect: true, difficulty: 1.0 },
          { itemId: 'concept_arrays', isCorrect: true, difficulty: 1.2 },
          { itemId: 'concept_async', isCorrect: false, difficulty: 1.5 }
        ],
        timestamp: new Date('2026-10-19T20:00:00Z')
      });

      assert.equal(result.sessionSummary.totalQuestions, 3);
      assert.equal(result.sessionSummary.correctCount, 2);
      assert.equal(result.sessionSummary.mistakes, 1);
      assert.equal(result.hearts.state.currentHearts, 4, 'Deveria ter perdido 1 coração');
      assert.equal(result.streak.state.currentStreak, 4, 'Ofensiva deveria ter subido para 4');
      assert.ok(result.league.userXp > 0, 'Deveria ter pontuado na liga');
      assert.equal(result.memoryUpdates.length, 3, 'Deveria ter atualizado 3 itens no HLR');
    });
  });

});

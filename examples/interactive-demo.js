/**
 * interactive-demo.js
 * 
 * Demonstração interativa e visual do Motor de Gamificação Duolingo para o projeto REA.
 * Execute com: node examples/interactive-demo.js
 */

const {
  GamificationService,
  StreakEngine,
  SpacedRepetitionHLR,
  HeartsEngine,
  LeagueManager,
  QuestsEngine,
  SessionGenerator
} = require('../src/index');

const service = new GamificationService();

console.log('='.repeat(70));
console.log('🦉 DEMONSTRAÇÃO DO MOTOR DE GAMIFICAÇÃO DUOLINGO PARA O REA');
console.log('='.repeat(70));

// Estado inicial do estudante
let student = {
  id: 'usr_eduardo_42',
  name: 'Eduardo Silva',
  tierIndex: 0, // 0 = Bronze
  streak: {
    currentStreak: 0,
    maxStreak: 0,
    lastActiveDate: null,
    streakFreezesAvailable: 1
  },
  hearts: {
    currentHearts: 5,
    maxHearts: 5
  },
  gems: 50,
  dailyQuests: service.questsEngine.generateDailyQuests('2026-10-19'),
  memoryItems: [
    { id: 'algoritmos_ordenacao', title: 'Algoritmos de Ordenação', halfLifeHours: 12, lastReviewedAt: '2026-10-17T10:00:00Z' },
    { id: 'estruturas_arvores', title: 'Árvores Binárias', halfLifeHours: 48, lastReviewedAt: '2026-10-19T08:00:00Z' },
    { id: 'recursos_abertos', title: 'Licenciamento Creative Commons', halfLifeHours: 8, lastReviewedAt: '2026-10-16T12:00:00Z' }
  ]
};

console.log(`\n👤 Estudante Conectado: ${student.name}`);
console.log(`💎 Gemas: ${student.gems} | ❤️ Vidas: ${student.hearts.currentHearts}/5 | 🔥 Ofensiva: ${student.streak.currentStreak} dias | 🧊 Bloqueios: ${student.streak.streakFreezesAvailable}`);

// ----------------------------------------------------
// DIA 1: Primeira Lição (Perfeita!)
// ----------------------------------------------------
console.log('\n' + '-'.repeat(70));
console.log('📅 DIA 1 (19/10): Eduardo completa sua 1ª lição no REA (100% de acertos)');
console.log('-'.repeat(70));

const day1Result = service.processLessonCompletion({
  userId: student.id,
  username: student.name,
  userTierIndex: student.tierIndex,
  streakState: student.streak,
  heartsState: student.hearts,
  dailyQuests: student.dailyQuests,
  itemMemoryStates: student.memoryItems,
  answers: [
    { itemId: 'recursos_abertos', isCorrect: true, difficulty: 1.0 },
    { itemId: 'estruturas_arvores', isCorrect: true, difficulty: 1.2 },
    { itemId: 'algoritmos_ordenacao', isCorrect: true, difficulty: 1.5 }
  ],
  weekNumber: 1,
  timestamp: new Date('2026-10-19T10:00:00Z')
});

student.streak = day1Result.streak.state;
student.hearts = day1Result.hearts.state;
student.dailyQuests = day1Result.quests.quests;

console.log(`✨ Status da Sessão: ${day1Result.sessionSummary.correctCount}/${day1Result.sessionSummary.totalQuestions} acertos (Precisão: ${day1Result.sessionSummary.accuracy}%)`);
console.log(`⭐ XP Ganho: +${day1Result.sessionSummary.xpEarned} XP (Combo Perfeito!)`);
console.log(`🔥 Ofensiva: ${day1Result.streak.message}`);
console.log(`🏆 Inserido na Liga: ${day1Result.league.tier} (Bucket: ${day1Result.league.leagueId})`);
console.log(`   Posição no Placar de 30 usuários: #${day1Result.league.userRank} | Zona: ${day1Result.league.statusZone}`);

// ----------------------------------------------------
// DIA 2: Sequência Consecutiva (Ofensiva Sobe)
// ----------------------------------------------------
console.log('\n' + '-'.repeat(70));
console.log('📅 DIA 2 (20/10): Eduardo retorna no dia seguinte consecutivo');
console.log('-'.repeat(70));

const day2Result = service.processLessonCompletion({
  userId: student.id,
  username: student.name,
  userTierIndex: student.tierIndex,
  streakState: student.streak,
  heartsState: student.hearts,
  dailyQuests: student.dailyQuests,
  itemMemoryStates: student.memoryItems,
  answers: [
    { itemId: 'recursos_abertos', isCorrect: true },
    { itemId: 'estruturas_arvores', isCorrect: false } // 1 erro!
  ],
  weekNumber: 1,
  timestamp: new Date('2026-10-20T11:00:00Z')
});

student.streak = day2Result.streak.state;
student.hearts = day2Result.hearts.state;

console.log(`🔥 Ofensiva: ${day2Result.streak.message}`);
console.log(`❤️ Vidas: Errou 1 questão! Restam ${student.hearts.currentHearts}/5 corações.`);
console.log(`🏆 Placar Atualizado: #${day2Result.league.userRank} com ${day2Result.league.userXp} XP acumulado.`);

// ----------------------------------------------------
// DIA 4: O Aluno Pulou o Dia 21/10! (Streak Freeze Acionado)
// ----------------------------------------------------
console.log('\n' + '-'.repeat(70));
console.log('📅 DIA 4 (22/10): Eduardo não acessou no dia 21! Mecânica de Streak Freeze');
console.log('-'.repeat(70));

const day4Result = service.processLessonCompletion({
  userId: student.id,
  username: student.name,
  userTierIndex: student.tierIndex,
  streakState: student.streak,
  heartsState: student.hearts,
  dailyQuests: student.dailyQuests,
  itemMemoryStates: student.memoryItems,
  answers: [
    { itemId: 'recursos_abertos', isCorrect: true },
    { itemId: 'estruturas_arvores', isCorrect: true }
  ],
  weekNumber: 1,
  timestamp: new Date('2026-10-22T09:00:00Z')
});

student.streak = day4Result.streak.state;
console.log(`🧊 Alerta de Proteção: ${day4Result.streak.message}`);
console.log(`🔥 Ofensiva Preservada: ${student.streak.currentStreak} dias! (Bloqueios restantes: ${student.streak.streakFreezesAvailable})`);

// ----------------------------------------------------
// PSICOMETRIA: Spaced Repetition (Half-Life Regression)
// ----------------------------------------------------
console.log('\n' + '-'.repeat(70));
console.log('🧠 PSICOMETRIA: Algoritmo HLR avalia a curva de esquecimento da memória');
console.log('-'.repeat(70));

const queue = service.hlrEngine.getReviewQueue(student.memoryItems, new Date('2026-10-22T09:00:00Z'));
queue.forEach((item, idx) => {
  const percent = Math.round(item.currentRecallProbability * 100);
  const status = item.needsReview ? '⚠️ PRECISA DE REVISÃO URGENTE' : '✅ MEMÓRIA ESTÁVEL';
  console.log(`  ${idx + 1}. [${item.title}] -> Probabilidade de Lembrar: ${percent}% (Decorrido: ${item.hoursSinceReview}h) | ${status}`);
});

// ----------------------------------------------------
// ENCERRAMENTO DA SEMANA: Promoção de Liga
// ----------------------------------------------------
console.log('\n' + '-'.repeat(70));
console.log('🏁 ENCERRAMENTO DA SEMANA: Rollover das Ligas de 30 Usuários');
console.log('-'.repeat(70));

// Simula outros participantes competindo no mesmo bucket
const cohortId = day4Result.league.leagueId;
service.leagueManager.addXpAndSync('usr_lucas', 'Lucas M.', 0, 180, 1);
service.leagueManager.addXpAndSync('usr_marina', 'Marina Costa', 0, 140, 1);
service.leagueManager.addXpAndSync('usr_rodrigo', 'Rodrigo B.', 0, 10, 1);

const rolloverResults = service.leagueManager.resolveWeeklyRollover(cohortId);
const studentOutcome = rolloverResults.find(r => r.userId === student.id);

console.log(`🎉 Resultado de ${student.name}:`);
console.log(`   Posição Final: #${studentOutcome.finalRank} com ${studentOutcome.finalXp} XP`);
console.log(`   Resultado: ${studentOutcome.outcome === 'PROMOTED' ? '🚀 PROMOVIDO PARA A LIGA ' + studentOutcome.nextTier : 'PERMANECEU NA LIGA'}`);

console.log('\n' + '='.repeat(70));
console.log('✅ DEMO CONCLUÍDA COM SUCESSO! Todas as mecânicas estão prontas para o REA.');
console.log('='.repeat(70));

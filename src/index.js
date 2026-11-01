/**
 * REA - Módulo de Gamificação Educacional
 * Inspirado na arquitetura do Duolingo
 */

const GamificationService = require('./gamification/GamificationService');
const StreakEngine = require('./gamification/StreakEngine');
const SpacedRepetitionHLR = require('./gamification/SpacedRepetitionHLR');
const HeartsEngine = require('./gamification/HeartsEngine');
const LeagueManager = require('./gamification/LeagueManager');
const QuestsEngine = require('./gamification/QuestsEngine');
const SessionGenerator = require('./gamification/SessionGenerator');

module.exports = {
  GamificationService,
  StreakEngine,
  SpacedRepetitionHLR,
  HeartsEngine,
  LeagueManager,
  QuestsEngine,
  SessionGenerator
};

/**
 * LeagueManager.js
 * 
 * Implementação da arquitetura de Ligas e Placares do Duolingo.
 * Ao invés de um placar global monolítico com milhões de usuários, o Duolingo
 * divide os usuários em 'Cohorts' (grupos fechados) de no máximo 30 participantes.
 * 
 * Mecânica:
 * 1. 10 Divisões: Bronze, Prata, Ouro, Safira, Rubi, Esmeralda, Ametista, Pérola, Obsidiana, Diamante.
 * 2. Alocação Just-In-Time: O usuário só entra em uma liga ao completar a primeira lição da semana.
 * 3. Fechamento do Bucket em 30 participantes.
 * 4. Promoção (Top 7) e Rebaixamento (Últimos 5) no fim da semana.
 */

const LEAGUE_TIERS = [
  'Bronze',
  'Prata',
  'Ouro',
  'Safira',
  'Rubi',
  'Esmeralda',
  'Ametista',
  'Pérola',
  'Obsidiana',
  'Diamante'
];

class LeagueManager {
  constructor(options = {}) {
    this.cohortSize = options.cohortSize || 30;
    this.promotionCount = options.promotionCount || 7;
    this.demotionCount = options.demotionCount || 5;

    // Repositório em memória simulando as estruturas Redis (Sorted Sets: ZSET)
    // Map<leagueId, { id, tier, weekNumber, isClosed, members: Map<userId, { username, xp, joinedAt }> }>
    this.leagues = new Map();
    this.userLeagueIndex = new Map(); // userId -> leagueId
    this.nextCohortId = 1;
  }

  getTiers() {
    return [...LEAGUE_TIERS];
  }

  /**
   * Adiciona XP a um usuário e o matricula automaticamente na liga aberta do seu tier, caso ainda não esteja.
   * 
   * @param {string} userId - Identificador do usuário
   * @param {string} username - Nome público do usuário
   * @param {number} userTierIndex - Índice da divisão (0 = Bronze, 9 = Diamante)
   * @param {number} xpDelta - XP ganho na lição
   * @param {number} [weekNumber=1] - Número da semana corrente
   * @returns {Object} Estado atualizado da posição do usuário na liga de 30 pessoas
   */
  addXpAndSync(userId, username, userTierIndex, xpDelta, weekNumber = 1) {
    const tierName = LEAGUE_TIERS[userTierIndex] || LEAGUE_TIERS[0];
    let leagueId = this.userLeagueIndex.get(userId);
    let league = leagueId ? this.leagues.get(leagueId) : null;

    // Se o usuário ainda não está em nenhuma liga desta semana, busca ou cria um bucket aberto
    if (!league || league.weekNumber !== weekNumber) {
      league = this._findOrCreateOpenCohort(tierName, weekNumber);
      leagueId = league.id;
      this.userLeagueIndex.set(userId, leagueId);

      if (!league.members.has(userId)) {
        league.members.set(userId, {
          userId,
          username,
          xp: 0,
          joinedAt: new Date().toISOString()
        });

        // Se atingiu o limite de 30 usuários, fecha o bucket para novos integrantes
        if (league.members.size >= this.cohortSize) {
          league.isClosed = true;
        }
      }
    }

    // Incrementa o XP (equivalente ao comando Redis: ZINCRBY league:{id} xpDelta userId)
    const member = league.members.get(userId);
    member.xp += xpDelta;

    const standings = this.getLeaderboard(leagueId);
    const userStanding = standings.find(s => s.userId === userId);

    return {
      leagueId,
      tier: league.tier,
      weekNumber: league.weekNumber,
      totalParticipants: league.members.size,
      userRank: userStanding.rank,
      userXp: userStanding.xp,
      statusZone: this._calculateZone(userStanding.rank, league.members.size),
      leaderboard: standings
    };
  }

  /**
   * Retorna a classificação do cohort ordenada por XP decrescente (com desempate por entrada).
   */
  getLeaderboard(leagueId) {
    const league = this.leagues.get(leagueId);
    if (!league) return [];

    const membersArray = Array.from(league.members.values());
    membersArray.sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
    });

    return membersArray.map((m, index) => {
      const rank = index + 1;
      return {
        rank,
        userId: m.userId,
        username: m.username,
        xp: m.xp,
        zone: this._calculateZone(rank, membersArray.length)
      };
    });
  }

  /**
   * Processa o encerramento da semana, determinando promoções e rebaixamentos para a próxima semana.
   */
  resolveWeeklyRollover(leagueId) {
    const league = this.leagues.get(leagueId);
    if (!league) throw new Error(`Liga ${leagueId} não encontrada.`);

    const standings = this.getLeaderboard(leagueId);
    const tierIndex = LEAGUE_TIERS.indexOf(league.tier);
    const results = [];

    for (const standing of standings) {
      let nextTierIndex = tierIndex;
      let outcome = 'RETAINED'; // permaneceu na mesma divisão

      if (standing.rank <= this.promotionCount && tierIndex < LEAGUE_TIERS.length - 1) {
        nextTierIndex = tierIndex + 1;
        outcome = 'PROMOTED';
      } else if (standing.rank > (standings.length - this.demotionCount) && tierIndex > 0) {
        nextTierIndex = tierIndex - 1;
        outcome = 'DEMOTED';
      }

      results.push({
        userId: standing.userId,
        username: standing.username,
        previousTier: league.tier,
        nextTier: LEAGUE_TIERS[nextTierIndex],
        nextTierIndex,
        finalRank: standing.rank,
        finalXp: standing.xp,
        outcome
      });
    }

    return results;
  }

  _findOrCreateOpenCohort(tierName, weekNumber) {
    // Procura uma liga existente do mesmo tier e semana que não esteja cheia
    for (const league of this.leagues.values()) {
      if (league.tier === tierName && league.weekNumber === weekNumber && !league.isClosed) {
        return league;
      }
    }

    // Cria um novo cohort bucket de 30 pessoas
    const newLeague = {
      id: `cohort_${tierName.toLowerCase()}_w${weekNumber}_${this.nextCohortId++}`,
      tier: tierName,
      weekNumber,
      isClosed: false,
      members: new Map(),
      createdAt: new Date().toISOString()
    };

    this.leagues.set(newLeague.id, newLeague);
    return newLeague;
  }

  _calculateZone(rank, totalMembers) {
    if (rank <= this.promotionCount) return 'PROMOTION_ZONE'; // Zona de promoção (verde)
    if (rank > Math.max(this.promotionCount, totalMembers - this.demotionCount)) return 'DEMOTION_ZONE'; // Zona de perigo (vermelha)
    return 'SAFE_ZONE'; // Zona intermediária segura
  }
}

module.exports = LeagueManager;

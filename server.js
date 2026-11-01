/**
 * server.js
 * 
 * Servidor HTTP leve e sem dependências externas (zero dependencies) para o REA.
 * Serve a interface web estilizada como Duolingo / Bombananas e fornece APIs REST conectadas
 * diretamente ao GamificationService.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { GamificationService } = require('./src/index');
const { LESSON_QUESTIONS, INITIAL_MEMORY_ITEMS } = require('./src/data/questions');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const service = new GamificationService();

// Estado inicial persistido em memória da sessão
let appState = {
  user: {
    id: 'user_duo_student',
    name: 'Joaninha Agente',
    tierIndex: 0 // Liga Joaninha Bronze
  },
  streak: {
    currentStreak: 4,
    maxStreak: 7,
    lastActiveDate: '2026-10-18', // Ontem em relação ao teste
    streakFreezesAvailable: 1
  },
  hearts: {
    currentHearts: 5,
    maxHearts: 5,
    lastDepletedAt: null
  },
  gems: 180, // Bananas Douradas
  dailyQuests: service.questsEngine.generateDailyQuests('2026-10-19'),
  memoryItems: INITIAL_MEMORY_ITEMS
};

// Banco de questões carregado de src/data/questions.js (50 questões / 10 missões)


// Inicializa concorrentes insetinhos na liga do usuário para criar competição divertida
service.leagueManager.addXpAndSync('user_pedro', '🐞 Joaninha Faísca', 0, 110, 1);
service.leagueManager.addXpAndSync('user_carol', '🐝 Abelhinha Zumbidora', 0, 95, 1);
service.leagueManager.addXpAndSync('user_gabriel', '🪲 Besourinho Bombástico', 0, 80, 1);
service.leagueManager.addXpAndSync('user_julia', '🦋 Borboleta Ninja', 0, 45, 1);
service.leagueManager.addXpAndSync('user_rafa', '🐜 Formiguinha Valente', 0, 70, 1);
service.leagueManager.addXpAndSync('user_duda', '🐛 Lagartinha Curiosa', 0, 55, 1);
service.leagueManager.addXpAndSync('user_leo', '🦗 Grilo Saltador', 0, 35, 1);
service.leagueManager.addXpAndSync(appState.user.id, appState.user.name, 0, 60, 1);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Roteamento de APIs REST
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // GET /api/state
    if (pathname === '/api/state' && req.method === 'GET') {
      const refreshedHearts = service.heartsEngine.getRefreshedState(appState.hearts);
      appState.hearts = refreshedHearts;

      const reviewQueue = service.hlrEngine.getReviewQueue(appState.memoryItems);
      const userLeagueId = service.leagueManager.userLeagueIndex.get(appState.user.id);
      const leaderboard = userLeagueId ? service.leagueManager.getLeaderboard(userLeagueId) : [];
      const userStanding = leaderboard.find(s => s.userId === appState.user.id) || null;

      res.writeHead(200);
      res.end(JSON.stringify({
        user: appState.user,
        streak: appState.streak,
        hearts: appState.hearts,
        gems: appState.gems,
        dailyQuests: appState.dailyQuests,
        reviewQueue,
        leaderboard,
        userStanding
      }));
      return;
    }

    // GET /api/questions
    if (pathname === '/api/questions' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ questions: LESSON_QUESTIONS }));
      return;
    }

    // POST /api/lesson/submit
    if (pathname === '/api/lesson/submit' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const answers = payload.answers || []; // [{ itemId, isCorrect, difficulty }]

          const result = service.processLessonCompletion({
            userId: appState.user.id,
            username: appState.user.name,
            userTierIndex: appState.user.tierIndex,
            streakState: appState.streak,
            heartsState: appState.hearts,
            dailyQuests: appState.dailyQuests,
            itemMemoryStates: appState.memoryItems,
            answers,
            weekNumber: 1,
            timestamp: new Date()
          });

          // Atualiza o estado
          appState.streak = result.streak.state;
          appState.hearts = result.hearts.state;
          appState.dailyQuests = result.quests.quests;
          appState.gems += (result.quests.rewardsGranted?.gems || 0) + (result.sessionSummary.isPerfect ? 10 : 2);

          // Atualiza itens de memória
          for (const upd of result.memoryUpdates) {
            const idx = appState.memoryItems.findIndex(m => m.id === upd.id);
            if (idx >= 0) {
              appState.memoryItems[idx] = { ...appState.memoryItems[idx], ...upd };
            }
          }

          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            result,
            updatedGems: appState.gems
          }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // POST /api/practice/refill
    if (pathname === '/api/practice/refill' && req.method === 'POST') {
      const refillRes = service.heartsEngine.practiceRefill(appState.hearts, 1);
      appState.hearts = refillRes.state;
      appState.gems += 5; // Recompensa por praticar

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        hearts: appState.hearts,
        gems: appState.gems,
        message: refillRes.message
      }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
    return;
  }

  // Arquivos estáticos da pasta public/
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback SPA para index.html
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, fallbackContent) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 - Arquivo não encontrado');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallbackContent);
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Erro no servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🐞 Servidor REA Joaninhas rodando com sucesso!`);
  console.log(`🌐 Acesse no seu navegador: http://localhost:${PORT}`);
  console.log(`⚡ Zero dependências externas | Pronto para deploy no Render, Railway, Vercel ou VPS\n`);
});

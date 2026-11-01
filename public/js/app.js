/**
 * app.js - BOMBANANA! REA Joaninhas Squad Frontend
 * Estética lúdica com joaninhas e insetinhos, sons de videogame e efeitos comemorativos para crianças de 10 anos
 */

// Sistema de Áudio Sintético Web Audio API (zero dependências)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;

    if (type === 'pop') {
      // Estalo fofo estilo bolha de sabão
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);

    } else if (type === 'correct') {
      // Arpeggio alegre de videogame (C5 - E5 - G5 - C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        const start = now + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.25);
        osc.start(start);
        osc.stop(start + 0.25);
      });

    } else if (type === 'wrong') {
      // Boing cômico de desenho animado (sem ser punitivo)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.32);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.32);

    } else if (type === 'win') {
      // Fanfarra triunfante de conclusão de fase
      const chords = [
        { f: 523.25, t: 0.0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.50, t: 0.38 },
        { f: 1318.51, t: 0.54 }
      ];
      chords.forEach(({ f, t }) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        const start = now + t;
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.45);
        osc.start(start);
        osc.stop(start + 0.45);
      });

    } else if (type === 'refill') {
      // Som clássico de 1-UP / Powerup
      const notes = [330, 440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        const start = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
        osc.start(start);
        osc.stop(start + 0.15);
      });
    }
  } catch (e) {
    // Silencia se o áudio não foi desbloqueado
  }
}

// Canhão de Confetes e Partículas (Joaninhas, Flores, Folhas e Estrelas)
const canvas = document.getElementById('confetti-canvas');
let particles = [];
let isAnimatingParticles = false;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti(count = 35) {
  if (!canvas) return;
  const emojis = ['🐞', '🌸', '🐝', '⭐', '✨', '🍌', '💣', '🍃'];
  const colors = ['#FFD000', '#FF5722', '#22C55E', '#00D2D3', '#6C5CE7', '#FF6B81'];

  for (let i = 0; i < count; i++) {
    const isEmoji = Math.random() > 0.45;
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 260,
      y: window.innerHeight * 0.65 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 16 - 6,
      size: isEmoji ? 26 : Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      isEmoji,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.55
    });
  }

  if (!isAnimatingParticles) {
    isAnimatingParticles = true;
    requestAnimationFrame(updateParticles);
  }
}

function updateParticles() {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.vRot;
    p.opacity -= 0.012;

    if (p.opacity <= 0 || p.y > canvas.height + 50) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);

    if (p.isEmoji) {
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  if (particles.length > 0) {
    requestAnimationFrame(updateParticles);
  } else {
    isAnimatingParticles = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Alteração de Expressão do Mascote Joaninha
function setMascotMood(mood) {
  const mouth = document.getElementById('mascot-mouth');
  if (!mouth) return;
  if (mood === 'happy') {
    mouth.setAttribute('d', 'M44 38 Q50 45 56 38');
    mouth.setAttribute('stroke-width', '2.8');
  } else if (mood === 'surprised') {
    mouth.setAttribute('d', 'M48 39 A2.5 2.5 0 1 0 52 39 A2.5 2.5 0 1 0 48 39');
    mouth.setAttribute('stroke-width', '2.2');
  } else {
    mouth.setAttribute('d', 'M46 38 Q50 42 54 38');
    mouth.setAttribute('stroke-width', '2.2');
  }
}

let state = null;
let questions = [];
let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let currentSessionAnswers = [];
let maxComboInSession = 0;
let currentCombo = 0;

// Inicializa a aplicação
async function initApp() {
  await fetchState();
  await fetchQuestions();
  setupNavigation();
  setupKeyboardShortcuts();
}

// Carrega o estado do servidor
async function fetchState() {
  try {
    const res = await fetch('/api/state');
    state = await res.json();
    renderStats();
    renderQuests();
    renderLeaderboard();
    renderReviewQueue();
  } catch (err) {
    console.error('Erro ao buscar estado da API:', err);
  }
}

// Carrega as questões da lição
async function fetchQuestions() {
  try {
    const res = await fetch('/api/questions');
    const data = await res.json();
    questions = data.questions || [];
  } catch (err) {
    console.error('Erro ao carregar questões:', err);
  }
}

// Renderiza a barra superior com estatísticas
function renderStats() {
  if (!state) return;

  const streakEl = document.getElementById('streak-count');
  if (streakEl) streakEl.textContent = state.streak?.currentStreak || 0;

  const gemsEl = document.getElementById('gems-count');
  if (gemsEl) gemsEl.textContent = state.gems || 0;
  
  const heartsEl = document.getElementById('hearts-count');
  if (heartsEl) heartsEl.textContent = state.hearts?.currentHearts ?? 5;

  const leagueTierEl = document.getElementById('user-league-tier');
  if (leagueTierEl && state.userStanding) {
    leagueTierEl.textContent = `Liga Joaninha Bronze • #${state.userStanding.rank}`;
  }
}

// Renderiza as missões diárias
function renderQuests() {
  const container = document.getElementById('quests-list');
  const fullContainer = document.getElementById('quests-list-full');
  if (!state?.dailyQuests) return;

  const renderItem = (q) => {
    const pct = Math.min(100, Math.round((q.currentProgress / q.target) * 100));
    const icon = q.type === 'XP' ? '⚡' : q.type === 'COMBO' ? '🎯' : '🐞';
    return `
      <div class="quest-item">
        <div class="quest-icon">${icon}</div>
        <div class="quest-details">
          <div class="quest-title">${q.title}</div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
        <div style="font-weight: 900; font-size: 13px; color: var(--banana-dark);">${q.currentProgress}/${q.target}</div>
      </div>
    `;
  };

  const html = state.dailyQuests.map(renderItem).join('');
  if (container) container.innerHTML = html;
  if (fullContainer) fullContainer.innerHTML = html;
}

// Renderiza o Placar do Torneio das Joaninhas (Cohorts de 30)
function renderLeaderboard() {
  const container = document.getElementById('leaderboard-list');
  if (!container || !state?.leaderboard) return;

  let html = '';
  state.leaderboard.forEach((member) => {
    const isUser = member.userId === state.user.id;
    const isPromo = member.rank <= 7;

    html += `
      <div class="league-row ${isUser ? 'current-user' : ''} ${isPromo ? 'promoted' : ''}">
        <div class="league-rank">${member.rank === 1 ? '👑' : `#${member.rank}`}</div>
        <div class="league-avatar">${member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : '🐞'}</div>
        <div class="league-name">
          ${member.username} ${isUser ? '<span style="font-size: 12px; color: var(--banana-dark); font-weight: 900;">(Você 🐞)</span>' : ''}
        </div>
        <div class="league-xp">${member.xp} XP</div>
      </div>
    `;

    // Divisória de Promoção para a Liga de Prata
    if (member.rank === 7) {
      html += `<div class="zone-divider promo">🚀 ZONA DE PROMOÇÃO (TOP 7 JOANINHAS SOBEM PARA A PRATA!)</div>`;
    }
  });

  container.innerHTML = html;
}

// Renderiza a fila de Repetição Espaçada HLR (Folhas do Jardim)
function renderReviewQueue() {
  const container = document.getElementById('review-queue-list');
  if (!container || !state?.reviewQueue) return;

  container.innerHTML = state.reviewQueue.map(item => {
    const pct = Math.round(item.currentRecallProbability * 100);
    const badgeColor = pct >= 75 ? 'var(--jungle-green)' : pct >= 40 ? 'var(--banana-dark)' : 'var(--bomb-orange)';
    const statusText = pct >= 75 ? '🐞 Folhinha Fresca' : pct >= 40 ? '🍃 Folhinha Madura' : '⚠️ Revise antes de murchar!';

    return `
      <div class="card-box" style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <div>
          <div style="font-weight: 900; font-size: 16px; color: var(--text-dark);">${item.title}</div>
          <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px; font-weight: 600;">
            Status: <strong style="color: ${badgeColor};">${statusText} (${pct}%)</strong> • Praticado há ${item.hoursSinceReview}h
          </div>
        </div>
        <button class="btn-duo blue" style="padding: 10px 20px; font-size: 13px;" onclick="startReviewLesson('${item.id}')">
          REVISAR 🐞
        </button>
      </div>
    `;
  }).join('');
}

// Navegação entre abas
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      playSound('pop');
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const page = document.getElementById(targetId);
      if (page) page.classList.add('active');
    });
  });
}

// Atalhos de teclado (1, 2, 3, 4 e Enter)
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lesson-modal');
    if (!modal.classList.contains('active')) return;

    if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      selectOption(idx);
    } else if (e.key === 'Enter') {
      const actionBtn = document.getElementById('lesson-action-btn');
      if (actionBtn && !actionBtn.classList.contains('disabled')) {
        actionBtn.click();
      }
    }
  });
}

let activeLessonQuestions = [];

// Inicia uma lição (pode filtrar por missão/tema)
window.startLesson = function(missionId) {
  if (state?.hearts?.currentHearts <= 0) {
    showNoHeartsModal();
    return;
  }

  if (typeof missionId === 'number') {
    activeLessonQuestions = questions.filter(q => q.missionId === missionId);
  } else if (!activeLessonQuestions || activeLessonQuestions.length === 0) {
    activeLessonQuestions = [...questions];
  }

  currentQuestionIndex = 0;
  selectedOptionIndex = null;
  currentSessionAnswers = [];
  currentCombo = 0;
  maxComboInSession = 0;

  playSound('pop');
  document.getElementById('lesson-modal').classList.add('active');
  renderCurrentQuestion();
};

// Inicia uma lição de revisão específica do HLR
window.startReviewLesson = function(itemId) {
  if (itemId) {
    activeLessonQuestions = questions.filter(q => q.id === itemId);
  } else {
    activeLessonQuestions = [];
  }
  window.startLesson(null);
};

// Renderiza a questão atual
function renderCurrentQuestion() {
  const list = (activeLessonQuestions && activeLessonQuestions.length > 0) ? activeLessonQuestions : questions;
  const q = list[currentQuestionIndex];
  if (!q) {
    finishLesson();
    return;
  }

  setMascotMood('neutral');

  // Atualiza número da pergunta
  const qNumEl = document.getElementById('current-q-num');
  if (qNumEl) qNumEl.textContent = `${currentQuestionIndex + 1} de ${list.length}`;

  // Atualiza barra de progresso (pavio)
  const progressPct = (currentQuestionIndex / list.length) * 100;
  document.getElementById('lesson-progress').style.width = `${progressPct}%`;
  document.getElementById('lesson-hearts-count').textContent = state.hearts.currentHearts;

  // Atualiza enunciado
  document.getElementById('question-text').textContent = q.question;

  // Atualiza opções em estilo botões de fliperama
  const optionsContainer = document.getElementById('options-list');
  optionsContainer.innerHTML = q.options.map((opt, idx) => `
    <div class="option-card" id="opt-${idx}" onclick="selectOption(${idx})">
      <span class="option-key">${idx + 1}</span>
      <span>${opt}</span>
    </div>
  `).join('');

  // Reseta rodapé de feedback
  const footer = document.getElementById('lesson-footer');
  footer.className = 'lesson-footer';
  footer.innerHTML = `
    <div class="footer-content">
      <div class="feedback-msg" id="feedback-content"></div>
      <button id="lesson-action-btn" class="btn-duo disabled" onclick="verifyAnswer()">VERIFICAR RESPOSTA</button>
    </div>
  `;
  selectedOptionIndex = null;
}

// Seleciona uma opção
window.selectOption = function(idx) {
  const footer = document.getElementById('lesson-footer');
  if (footer.classList.contains('correct') || footer.classList.contains('wrong')) {
    return; // Já verificado
  }

  playSound('pop');
  selectedOptionIndex = idx;
  document.querySelectorAll('.option-card').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });

  const btn = document.getElementById('lesson-action-btn');
  btn.className = 'btn-duo green';
  btn.textContent = 'VERIFICAR RESPOSTA 🚀';
};

// Verifica a resposta
window.verifyAnswer = function() {
  if (selectedOptionIndex === null) return;

  const list = (activeLessonQuestions && activeLessonQuestions.length > 0) ? activeLessonQuestions : questions;
  const q = list[currentQuestionIndex];
  const isCorrect = selectedOptionIndex === q.correctIndex;
  const footer = document.getElementById('lesson-footer');
  const feedbackContent = document.getElementById('feedback-content');
  const btn = document.getElementById('lesson-action-btn');

  if (isCorrect) {
    playSound('correct');
    launchConfetti(35);
    setMascotMood('happy');

    currentCombo += 1;
    if (currentCombo > maxComboInSession) maxComboInSession = currentCombo;

    footer.className = 'lesson-footer correct';
    feedbackContent.innerHTML = `
      <div class="feedback-icon">🎉✨</div>
      <div>
        <div class="feedback-title correct">MUITO BEM! Resposta Correta!</div>
        <div class="feedback-sub">${q.explanation || 'Você acertou o desafio de matemática com precisão!'}</div>
      </div>
    `;
    btn.className = 'btn-duo green';
    btn.textContent = 'CONTINUAR 🚀';
    btn.onclick = nextQuestion;
  } else {
    playSound('wrong');
    setMascotMood('surprised');

    currentCombo = 0;
    state.hearts.currentHearts = Math.max(0, state.hearts.currentHearts - 1);
    document.getElementById('lesson-hearts-count').textContent = state.hearts.currentHearts;
    renderStats();

    footer.className = 'lesson-footer wrong';
    feedbackContent.innerHTML = `
      <div class="feedback-icon">💡</div>
      <div>
        <div class="feedback-title wrong">QUASE LÁ! O certo era:</div>
        <div class="feedback-sub">${q.options[q.correctIndex]}<br><small style="margin-top:4px; display:inline-block; opacity:0.9;">${q.explanation || ''}</small></div>
      </div>
    `;
    btn.className = 'btn-duo red';
    btn.textContent = 'ENTENDI! VAMOS EM FRENTE';
    btn.onclick = nextQuestion;
  }

  currentSessionAnswers.push({
    itemId: q.id,
    isCorrect,
    difficulty: 1.0
  });
};

// Avança para a próxima questão
function nextQuestion() {
  playSound('pop');
  currentQuestionIndex += 1;
  const list = (activeLessonQuestions && activeLessonQuestions.length > 0) ? activeLessonQuestions : questions;
  if (currentQuestionIndex < list.length) {
    renderCurrentQuestion();
  } else {
    finishLesson();
  }
}

// Finaliza a lição e submete para a API
async function finishLesson() {
  document.getElementById('lesson-progress').style.width = '100%';
  playSound('win');
  launchConfetti(80);

  try {
    const res = await fetch('/api/lesson/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: currentSessionAnswers })
    });
    const data = await res.json();
    
    // Atualiza estado local
    await fetchState();

    // Mostra tela de celebração das joaninhas
    const results = data.result?.sessionSummary;
    document.getElementById('lesson-body').innerHTML = `
      <div style="text-align: center; padding: 30px 10px;">
        <div style="font-size: 70px; margin-bottom: 12px; animation: wiggle 1s infinite alternate;">🐞🌸🐝🏆</div>
        <h2 style="font-size: 30px; font-weight: 900; color: var(--jungle-green-shadow);">MISSÃO CUMPRIDA! 🏆</h2>
        <p style="font-size: 16px; color: var(--text-dark); margin: 8px 0 24px 0; font-weight: 700;">
          Você concluiu os desafios com sucesso e exercitou seu raciocínio matemático!
        </p>

        <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 28px;">
          <div class="card-box" style="padding: 16px 24px; text-align: center; background: var(--banana-light); border-color: var(--banana-dark);">
            <div style="font-size: 13px; font-weight: 900; color: var(--banana-dark);">XP DO JARDIM</div>
            <div style="font-size: 28px; font-weight: 900; color: var(--bomb-orange);">+${results?.xpEarned || 20} XP</div>
          </div>
          <div class="card-box" style="padding: 16px 24px; text-align: center; background: var(--jungle-green-light); border-color: #86EFAC;">
            <div style="font-size: 13px; font-weight: 900; color: #15803D;">PRECISÃO</div>
            <div style="font-size: 28px; font-weight: 900; color: #15803D;">${results?.accuracy || 100}%</div>
          </div>
        </div>

        <button class="btn-duo green" style="width: 100%; max-width: 320px; font-size: 18px;" onclick="closeLessonModal()">
          VOLTAR AO JARDIM! 🌿✨
        </button>
      </div>
    `;

    document.getElementById('lesson-footer').style.display = 'none';

  } catch (err) {
    console.error('Erro ao finalizar lição:', err);
    closeLessonModal();
  }
}

// Fecha o modal de lição
window.closeLessonModal = function() {
  playSound('pop');
  document.getElementById('lesson-modal').classList.remove('active');
  document.getElementById('lesson-footer').style.display = 'block';
  location.reload();
};

// Prática para recuperar corações (Descanso na Folhinha Mágica)
window.practiceRefill = async function() {
  try {
    const res = await fetch('/api/practice/refill', { method: 'POST' });
    const data = await res.json();
    playSound('refill');
    launchConfetti(40);
    alert(`Você descansou em uma folhinha mágica e recuperou seus corações! ❤️`);
    await fetchState();
  } catch (err) {
    console.error('Erro ao recarregar corações:', err);
  }
};

function showNoHeartsModal() {
  if (confirm('Seus corações acabaram! Deseja fazer um treino rápido no jardim para recuperar corações agora?')) {
    window.practiceRefill();
  }
}

// Inicialização
window.addEventListener('DOMContentLoaded', initApp);

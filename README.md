# REA - Gamificação Educacional (Arquitetura Inspirada no Duolingo)

Módulo completo de gamificação para o projeto REA, projetado com base nas mecânicas comportamentais, psicométricas e arquiteturais comprovadas do Duolingo.

---

## 🏗️ Módulos Implementados

| Módulo | Base Teórica / Duolingo | Descrição |
| :--- | :--- | :--- |
| **`StreakEngine`** | *Habit Loop & Loss Aversion* | Gestão de ofensivas diárias, bônus de consistência e proteção com *Streak Freeze*. |
| **`SpacedRepetitionHLR`** | *Half-Life Regression (Settles & Meeder, ACL 2016)* | Modela o decaimento exponencial da memória humana ($p = 2^{-\Delta t / h}$) para priorizar revisões antes do esquecimento. |
| **`HeartsEngine`** | *Loss Aversion & Practice Sessions* | Sistema de vidas (5 corações), penalidade por erros e recarga via temporizador ou sessões de treino. |
| **`LeagueManager`** | *30-User Cohorts & Redis Sorted Sets* | Divisões (Bronze a Diamante) particionadas em turmas fechadas de 30 alunos com matchmaking sob demanda. |
| **`QuestsEngine`** | *Dopamine Micro-Goals* | Missões diárias dinâmicas (XP, lições concluídas, combos) com recompensa de Gemas. |
| **`SessionGenerator`** | *Duolingo Session Generator (Scala rewrite)* | Curadoria de sessões com foco em revisão prioritária + cálculo de XP com precisão e combos. |
| **`GamificationService`** | *Unified Facade* | Ponto de entrada único que orquestra todas as mecânicas ao enviar o resultado de uma lição. |

---

## 🚀 Como Executar

### Executar a Demonstração Interativa
```bash
node examples/interactive-demo.js
```

### Executar os Testes Automatizados
```bash
node --test tests/gamification.test.js
```

---

## 💻 Exemplo Rápido de Uso

```javascript
const { GamificationService } = require('./src/index');
const service = new GamificationService();

// Ao concluir uma lição:
const result = service.processLessonCompletion({
  userId: 'aluno_1',
  username: 'Maria',
  userTierIndex: 0, // Bronze
  streakState: { currentStreak: 3, lastActiveDate: '2026-10-18', streakFreezesAvailable: 1 },
  heartsState: { currentHearts: 5 },
  answers: [
    { itemId: 'modulo_1_intro', isCorrect: true, difficulty: 1.0 },
    { itemId: 'modulo_1_exercicio', isCorrect: true, difficulty: 1.2 }
  ]
});

console.log(result.sessionSummary);
console.log(result.streak);
console.log(result.league);
```
"# jardim-aberto" 

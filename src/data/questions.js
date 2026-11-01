/**
 * src/data/questions.js
 * 
 * Banco de Questões de Matemática para estudantes de ~10 anos (BNCC - 4º e 5º Ano)
 * Inspirado nas mecânicas de gamificação do Duolingo e no currículo de matemática do REA.
 * 
 * Eixos da BNCC contemplados:
 * 1. Sistema Monetário Nacional (Educação Financeira)
 * 2. Espaço e Forma (Geometria 2D, 3D, Polígonos e Simetria)
 * 3. Grandezas e Medidas (Tempo, Comprimento, Massa e Capacidade)
 * 4. Números e Operações (Frações, Divisão com Resto, Multiplicação e Múltiplos)
 * 5. Tratamento da Informação (Tabelas, Gráficos de Colunas, Média e Probabilidade)
 */

const LESSON_QUESTIONS = [
  // =========================================================================
  // --- MISSÃO 1: SISTEMA MONETÁRIO NACIONAL (MOEDAS & TROCO) ---
  // =========================================================================
  {
    id: 'item_monetario_1',
    missionId: 1,
    topic: 'Sistema Monetário Nacional',
    type: 'multiple_choice',
    bncc: 'EF04MA10',
    question: 'Você comprou um lanche que custou R$ 12,50 e pagou com uma nota de R$ 20,00. Quanto você deve receber de troco?',
    options: [
      'R$ 8,50',
      'R$ 7,50',
      'R$ 6,50',
      'R$ 8,00'
    ],
    correctIndex: 1,
    explanation: 'Muito bem! R$ 20,00 - R$ 12,50 = R$ 7,50 de troco!'
  },
  {
    id: 'item_monetario_2',
    missionId: 1,
    topic: 'Sistema Monetário Nacional',
    type: 'multiple_choice',
    bncc: 'EF04MA10',
    question: 'Se você juntar duas moedas de 50 centavos e quatro moedas de 25 centavos, qual será o valor total em reais?',
    options: [
      'R$ 1,50',
      'R$ 2,00',
      'R$ 2,50',
      'R$ 3,00'
    ],
    correctIndex: 1,
    explanation: 'Certinho! 2 x R$ 0,50 = R$ 1,00 e 4 x R$ 0,25 = R$ 1,00. Somando tudo: R$ 2,00!'
  },
  {
    id: 'item_monetario_3',
    missionId: 1,
    topic: 'Sistema Monetário Nacional',
    type: 'multiple_choice',
    bncc: 'EF04MA10',
    question: 'Ana quer comprar um livro de R$ 35,00. Ela tem uma nota de R$ 20,00 e duas notas de R$ 5,00. Quanto ainda falta para ela comprar o livro?',
    options: [
      'Faltam R$ 5,00',
      'Faltam R$ 10,00',
      'Faltam R$ 15,00',
      'Não falta nada'
    ],
    correctIndex: 0,
    explanation: 'Mandou bem! Ana tem R$ 20 + R$ 5 + R$ 5 = R$ 30,00. Para R$ 35,00 faltam R$ 5,00!'
  },
  {
    id: 'item_monetario_4',
    missionId: 1,
    topic: 'Sistema Monetário Nacional',
    type: 'multiple_choice',
    bncc: 'EF04MA10',
    question: 'Gabriel guardou 8 moedas de 50 centavos no seu cofre. Qual o valor total que ele tem guardado?',
    options: [
      'R$ 2,00',
      'R$ 4,00',
      'R$ 8,00',
      'R$ 5,00'
    ],
    correctIndex: 1,
    explanation: 'Perfeito! Cada 2 moedas de 50 centavos dão R$ 1,00. Então 8 moedas equivalem a R$ 4,00!'
  },
  {
    id: 'item_monetario_5',
    missionId: 1,
    topic: 'Sistema Monetário Nacional',
    type: 'multiple_choice',
    bncc: 'EF05MA07',
    question: 'Você tem uma nota de R$ 50,00. Comprou um caderno por R$ 18,00 e um estojo por R$ 12,00. Quanto dinheiro sobrou na sua carteira?',
    options: [
      'R$ 15,00',
      'R$ 20,00',
      'R$ 25,00',
      'R$ 30,00'
    ],
    correctIndex: 1,
    explanation: 'Sensacional! 18 + 12 = R$ 30,00 gastos no total. Com a nota de R$ 50,00: 50 - 30 = R$ 20,00 de troco!'
  },
  {
    id: 'item_monetario_6',
    missionId: 1,
    topic: 'Sistema Monetário Nacional',
    type: 'fill_in_blank',
    bncc: 'EF04MA10',
    question: 'Uma barra de cereal saudável custa R$ 1,75. Se você pagar com duas moedas de R$ 1,00 (totalizando R$ 2,00), qual deve ser o seu troco em centavos?',
    options: [
      '15 centavos (R$ 0,15)',
      '25 centavos (R$ 0,25)',
      '35 centavos (R$ 0,35)',
      '50 centavos (R$ 0,50)'
    ],
    correctIndex: 1,
    explanation: 'Na mosca! R$ 2,00 - R$ 1,75 = R$ 0,25 (25 centavos) de troco!'
  },

  // =========================================================================
  // --- MISSÃO 2: ESPAÇO E FORMA (GEOMETRIA 2D E 3D) ---
  // =========================================================================
  {
    id: 'item_espaco_1',
    missionId: 2,
    topic: 'Espaço e Forma',
    type: 'image_selection',
    bncc: 'EF04MA17',
    question: 'Qual das opções abaixo representa a planificação de uma pirâmide de base quadrada?',
    options: [
      '6 quadrados formando uma cruz',
      '1 quadrado central com 4 triângulos conectados às arestas',
      '2 círculos e 1 retângulo',
      '4 retângulos compridos e 2 quadrados pequenos'
    ],
    correctIndex: 1,
    explanation: 'Excelente! Ao dobrar os 4 triângulos sobre a base quadrada, as pontas se unem formando uma pirâmide!'
  },
  {
    id: 'item_espaco_2',
    missionId: 2,
    topic: 'Espaço e Forma',
    type: 'fill_in_blank',
    bncc: 'EF04MA17',
    question: 'A planificação geométrica composta exclusivamente por 6 quadrados idênticos forma qual sólido geométrico?',
    options: [
      'Cubo',
      'Cilindro',
      'Cone',
      'Esfera'
    ],
    correctIndex: 0,
    explanation: 'Na mosca! 6 quadrados idênticos dobrados formam um cubo, como um dado de jogo!'
  },
  {
    id: 'item_espaco_3',
    missionId: 2,
    topic: 'Espaço e Forma',
    type: 'image_selection',
    bncc: 'EF05MA16',
    question: 'Entre as figuras abaixo, qual representa um retângulo no meio de outros quadriláteros?',
    options: [
      'Um losango com 4 lados iguais e ângulos inclinados',
      'Um trapézio com apenas dois lados paralelos',
      'Um quadrilátero com 4 ângulos retos de 90° e lados opostos iguais',
      'Um papagaio (pipa) sem lados paralelos'
    ],
    correctIndex: 2,
    explanation: 'Sensacional! O retângulo possui 4 ângulos retos de 90° e lados opostos paralelos e congruentes!'
  },
  {
    id: 'item_espaco_4',
    missionId: 2,
    topic: 'Espaço e Forma',
    type: 'image_selection',
    bncc: 'EF04MA17',
    question: 'Se você abrir e planificar uma lata cilíndrica de suco, quais figuras geométricas você obterá?',
    options: [
      '2 círculos e 1 retângulo',
      '1 triângulo e 1 círculo',
      '6 retângulos iguais',
      '3 círculos'
    ],
    correctIndex: 0,
    explanation: 'Muito bem! A lateral do cilindro vira um retângulo e as duas tampas são círculos!'
  },
  {
    id: 'item_espaco_5',
    missionId: 2,
    topic: 'Espaço e Forma',
    type: 'multiple_choice',
    bncc: 'EF04MA17',
    question: 'Qual dos sólidos geométricos tridimensionais abaixo é perfeitamente redondo e NÃO possui faces planas, arestas nem vértices?',
    options: [
      'Cubo',
      'Pirâmide',
      'Esfera',
      'Prisma triangular'
    ],
    correctIndex: 2,
    explanation: 'Perfeito! A esfera é um corpo redondo sem faces planas, vértices ou arestas retas!'
  },
  {
    id: 'item_espaco_6',
    missionId: 2,
    topic: 'Espaço e Forma',
    type: 'multiple_choice',
    bncc: 'EF04MA18',
    question: 'Ao dobrar uma folha com desenho de joaninha exatamente ao meio e as duas metades se encaixarem perfeitamente, essa dobra é um eixo de:',
    options: [
      'Simetria',
      'Perímetro',
      'Diâmetro',
      'Volume'
    ],
    correctIndex: 0,
    explanation: 'Excelente! O eixo de simetria funciona como um espelho imaginário que divide a figura em metades idênticas!'
  },

  // =========================================================================
  // --- MISSÃO 3: GRANDEZAS E MEDIDAS (TEMPO E COMPRIMENTO) ---
  // =========================================================================
  {
    id: 'item_medidas_1',
    missionId: 3,
    topic: 'Grandezas e Medidas',
    type: 'fill_in_blank',
    bncc: 'EF04MA22',
    question: 'Se o treino de futebol de João começou às 14:00 e teve a duração de 90 minutos, a que horas ele terminou?',
    options: [
      '15:00',
      '15:30',
      '16:00',
      '15:45'
    ],
    correctIndex: 1,
    explanation: 'Correto! 90 minutos correspondem a 1 hora e 30 minutos. 14:00 + 1h30min = 15:30!'
  },
  {
    id: 'item_medidas_2',
    missionId: 3,
    topic: 'Grandezas e Medidas',
    type: 'fill_in_blank',
    bncc: 'EF04MA22',
    question: 'Para converter o tempo no cotidiano, sabemos que 1 hora equivale exatamente a quantos minutos?',
    options: [
      '50 minutos',
      '60 minutos',
      '100 minutos',
      '24 minutos'
    ],
    correctIndex: 1,
    explanation: 'Isso aí! 1 hora completa tem exatamente 60 minutos!'
  },
  {
    id: 'item_medidas_3',
    missionId: 3,
    topic: 'Grandezas e Medidas',
    type: 'multiple_choice',
    bncc: 'EF04MA20',
    question: 'A professora mediu a fita para enfeitar a sala e descobriu que ela tem 2 metros. Quantos centímetros mede essa fita?',
    options: [
      '20 centímetros',
      '200 centímetros',
      '2.000 centímetros',
      '50 centímetros'
    ],
    correctIndex: 1,
    explanation: 'Perfeito! Cada 1 metro possui 100 centímetros. Logo, 2 metros = 200 centímetros!'
  },
  {
    id: 'item_medidas_4',
    missionId: 3,
    topic: 'Grandezas e Medidas',
    type: 'multiple_choice',
    bncc: 'EF04MA22',
    question: 'Um desenho animado especial na TV tem 120 minutos de duração. A quantas horas esse tempo corresponde?',
    options: [
      '1 hora',
      '2 horas',
      '3 horas',
      '2 horas e meia'
    ],
    correctIndex: 1,
    explanation: 'Boa! 120 dividido por 60 minutos = 2 horas completas de desenho animado!'
  },
  {
    id: 'item_medidas_5',
    missionId: 3,
    topic: 'Grandezas e Medidas',
    type: 'multiple_choice',
    bncc: 'EF04MA22',
    question: 'Uma corrida de revezamento no colégio durou 45 segundos. Quantos segundos faltaram para completar 1 minuto exato de prova?',
    options: [
      '10 segundos',
      '15 segundos',
      '20 segundos',
      '25 segundos'
    ],
    correctIndex: 1,
    explanation: 'Mandou ver! 1 minuto possui 60 segundos. 60 - 45 = 15 segundos restantes!'
  },
  {
    id: 'item_medidas_6',
    missionId: 3,
    topic: 'Grandezas e Medidas',
    type: 'fill_in_blank',
    bncc: 'EF04MA20',
    question: 'Uma régua escolar comum de plástico tem 30 centímetros de comprimento. Quantos milímetros (mm) possui essa régua?',
    options: [
      '30 mm',
      '300 mm',
      '3.000 mm',
      '150 mm'
    ],
    correctIndex: 1,
    explanation: 'Show de bola! Cada 1 centímetro equivale a 10 milímetros. Logo, 30 x 10 = 300 mm!'
  },

  // =========================================================================
  // --- MISSÃO 4: NÚMEROS E OPERAÇÕES (FRAÇÕES E DIVISÃO) ---
  // =========================================================================
  {
    id: 'item_operacoes_1',
    missionId: 4,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF04MA09',
    question: 'Qual das frações abaixo representa a parte comida de uma pizza que foi dividida em 4 pedaços iguais e teve 1 pedaço comido?',
    options: [
      '1/2',
      '1/3',
      '1/4',
      '4/1'
    ],
    correctIndex: 2,
    explanation: 'Na mosca! 1 pedaço de um total de 4 é representado pela fração 1/4!'
  },
  {
    id: 'item_operacoes_2',
    missionId: 4,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF04MA04',
    question: 'O professor tem 26 blocos lógicos para dividir igualmente por 4 grupos de alunos. Quantos blocos sobram no final?',
    options: [
      '0 blocos',
      '1 bloco',
      '2 blocos',
      '3 blocos'
    ],
    correctIndex: 2,
    explanation: 'Certíssimo! 26 dividido por 4 dá 6 blocos para cada grupo, e sobram 2 blocos (resto 2)!'
  },
  {
    id: 'item_operacoes_3',
    missionId: 4,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF05MA03',
    question: 'Uma barra de chocolate tem 8 pedaços iguais. Lucas comeu 4 pedaços. Qual fração simplificada representa o que Lucas comeu?',
    options: [
      '1/4 da barra',
      '1/2 da barra (metade)',
      '3/4 da barra',
      'A barra inteira'
    ],
    correctIndex: 1,
    explanation: 'Muito bem! 4 de 8 pedaços é exatamente a metade da barra de chocolate (1/2)!'
  },
  {
    id: 'item_operacoes_4',
    missionId: 4,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF04MA04',
    question: 'Uma caixa possui 25 lápis de cor para serem divididos igualmente entre 3 alunos. Quantos lápis cada um receberá e quantos sobram?',
    options: [
      'Cada um recebe 8 e sobra 1',
      'Cada um recebe 7 e sobram 4',
      'Cada um recebe 8 e não sobra nenhum',
      'Cada um recebe 6 e sobram 7'
    ],
    correctIndex: 0,
    explanation: 'Sensacional! 3 x 8 = 24 lápis distribuídos, sobrando 1 lápis na caixa!'
  },
  {
    id: 'item_operacoes_5',
    missionId: 4,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF05MA03',
    question: 'Uma torta de maçã foi cortada em 6 fatias iguais. Se foram comidas 4 fatias, qual fração simplificada representa o que SOBROU?',
    options: [
      '1/3 da torta (2/6)',
      '2/3 da torta (4/6)',
      '1/6 da torta',
      '1/2 da torta'
    ],
    correctIndex: 0,
    explanation: 'Certíssimo! Restaram 2 de 6 fatias. Simplificando por 2, temos 1/3 da torta de maçã restante!'
  },
  {
    id: 'item_operacoes_6',
    missionId: 4,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF04MA04',
    question: 'Em uma gincana de matemática, 35 alunos foram organizados em equipes iguais de 5 participantes. Quantas equipes foram formadas?',
    options: [
      '6 equipes',
      '7 equipes',
      '8 equipes',
      '5 equipes'
    ],
    correctIndex: 1,
    explanation: 'Perfeito! 35 dividido por 5 é igual a 7 equipes completas, sem sobrar ninguém!'
  },

  // =========================================================================
  // --- MISSÃO 5: TRATAMENTO DA INFORMAÇÃO & DESAFIOS FINAIS ---
  // =========================================================================
  {
    id: 'item_tabelas_1',
    missionId: 5,
    topic: 'Tratamento de Informações',
    type: 'multiple_choice',
    bncc: 'EF04MA27',
    question: 'Numa tabela que registra as pontuações anuais de um jogo (João: 145.000, Maria: 1.250.000, Pedro: 980.500), quem obteve a maior pontuação?',
    options: [
      'João',
      'Maria',
      'Pedro',
      'Todos empataram'
    ],
    correctIndex: 1,
    explanation: 'Show de bola! 1.250.000 (um milhão e duzentos e cinquenta mil) é a maior pontuação da tabela!'
  },
  {
    id: 'item_tabelas_2',
    missionId: 5,
    topic: 'Tratamento de Informações',
    type: 'multiple_choice',
    bncc: 'EF04MA27',
    question: 'Na gincana escolar, a Turma Amarela fez 415 pontos e a Turma Azul fez 390 pontos. Qual a diferença de pontos entre elas?',
    options: [
      '15 pontos',
      '25 pontos',
      '35 pontos',
      '10 pontos'
    ],
    correctIndex: 1,
    explanation: 'Excelente! 415 - 390 = 25 pontos de vantagem para a Turma Amarela!'
  },
  {
    id: 'item_desafio_1',
    missionId: 5,
    topic: 'Espaço e Forma',
    type: 'multiple_choice',
    bncc: 'EF05MA16',
    question: 'Um dado cúbico clássico de jogos de tabuleiro possui quantas faces (lados) e quantos vértices (pontas)?',
    options: [
      '6 faces e 8 vértices',
      '4 faces e 6 vértices',
      '8 faces e 6 vértices',
      '6 faces e 12 vértices'
    ],
    correctIndex: 0,
    explanation: 'Perfeito! O cubo tem 6 faces quadradas, 12 arestas e 8 vértices (pontas)!'
  },
  {
    id: 'item_desafio_2',
    missionId: 5,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF04MA06',
    question: 'Em um jogo de dardos, você acertou duas vezes o alvo de 15 pontos e uma vez o alvo de 20 pontos. Quantos pontos fez ao todo?',
    options: [
      '35 pontos',
      '45 pontos',
      '50 pontos',
      '40 pontos'
    ],
    correctIndex: 2,
    explanation: 'Mandou ver! (2 x 15) + 20 = 30 + 20 = 50 pontos no total!'
  },
  {
    id: 'item_tabelas_3',
    missionId: 5,
    topic: 'Tratamento de Informações',
    type: 'multiple_choice',
    bncc: 'EF05MA24',
    question: 'Em um gráfico de colunas sobre a venda de picolés (Morango: 35, Chocolate: 50, Limão: 20), qual sabor foi mais vendido e com quantas unidades a mais que o de morango?',
    options: [
      'Chocolate, com 15 a mais',
      'Chocolate, com 20 a mais',
      'Morango, com 10 a mais',
      'Limão, com 30 a mais'
    ],
    correctIndex: 0,
    explanation: 'Show de bola! O sabor mais vendido foi Chocolate (50) e 50 - 35 = 15 unidades a mais que o de Morango!'
  },
  {
    id: 'item_desafio_3',
    missionId: 5,
    topic: 'Sistema Monetário Nacional',
    type: 'multiple_choice',
    bncc: 'EF04MA10',
    question: 'Se você tem 4 notas de R$ 10,00 e 6 moedas de 50 centavos, qual o valor total em dinheiro na sua carteira?',
    options: [
      'R$ 42,00',
      'R$ 43,00',
      'R$ 46,00',
      'R$ 40,00'
    ],
    correctIndex: 1,
    explanation: 'Muito bem! 4 x R$ 10 = R$ 40,00. 6 x R$ 0,50 = R$ 3,00. Somando tudo: R$ 43,00!'
  },

  // =========================================================================
  // --- MISSÃO 6: MEDIDAS DE MASSA E CAPACIDADE (KG, G, LITROS E ML) ---
  // =========================================================================
  {
    id: 'item_capacidade_1',
    missionId: 6,
    topic: 'Grandezas e Medidas',
    type: 'multiple_choice',
    bncc: 'EF04MA20',
    question: 'Quantos copos de 250 mL são necessários para encher completamente uma garrafa térmica de 1 Litro de suco?',
    options: [
      '2 copos',
      '4 copos',
      '5 copos',
      '10 copos'
    ],
    correctIndex: 1,
    explanation: 'Sensacional! 1 Litro tem 1.000 mL. Como 4 x 250 = 1.000, precisamos de exatamente 4 copos!'
  },
  {
    id: 'item_capacidade_2',
    missionId: 6,
    topic: 'Grandezas e Medidas',
    type: 'fill_in_blank',
    bncc: 'EF05MA19',
    question: 'Um pacote fechado de farinha tem 1 kg (1.000 gramas). Para fazer um bolo, a vovó usou 250 gramas. Quantos gramas de farinha restaram no pacote?',
    options: [
      '750 gramas',
      '800 gramas',
      '650 gramas',
      '500 gramas'
    ],
    correctIndex: 0,
    explanation: 'Mandou bem! 1.000 g - 250 g = 750 g restantes no pacote de farinha!'
  },
  {
    id: 'item_capacidade_3',
    missionId: 6,
    topic: 'Grandezas e Medidas',
    type: 'image_selection',
    bncc: 'EF04MA20',
    question: 'Qual dos itens abaixo costuma ter sua massa medida em gramas (g) por ser muito leve, em vez de quilogramas (kg)?',
    options: [
      'Um morango fresco',
      'Um automóvel',
      'Um sofá da sala',
      'Um saco de arroz de 5 kg'
    ],
    correctIndex: 0,
    explanation: 'Perfeito! O morango é bem levinho (~20 a 30 gramas), por isso é medido em gramas!'
  },
  {
    id: 'item_capacidade_4',
    missionId: 6,
    topic: 'Grandezas e Medidas',
    type: 'fill_in_blank',
    bncc: 'EF04MA20',
    question: 'Para preparar um refresco no piquenique, misturamos 600 mL de água gelada e 400 mL de suco de maracujá. Qual o volume total da mistura?',
    options: [
      '1.000 mL (exatamente 1 Litro)',
      '800 mL',
      '1.200 mL',
      '900 mL'
    ],
    correctIndex: 0,
    explanation: 'Excelente! 600 mL + 400 mL = 1.000 mL, o que forma exatamente 1 Litro de suco!'
  },

  // =========================================================================
  // --- MISSÃO 7: MULTIPLICAÇÃO, DOBRO, TRIPLO E PADRÕES NUMÉRICOS ---
  // =========================================================================
  {
    id: 'item_multiplicacao_1',
    missionId: 7,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF04MA04',
    question: 'No fliperama do parque, cada ficha dá direito a uma rodada. Se um grupo de 4 amigos quer jogar 6 rodadas cada um, quantas fichas eles precisam comprar?',
    options: [
      '20 fichas',
      '24 fichas',
      '28 fichas',
      '18 fichas'
    ],
    correctIndex: 1,
    explanation: 'Show! 4 amigos x 6 rodadas cada = 24 fichas no total!'
  },
  {
    id: 'item_multiplicacao_2',
    missionId: 7,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF04MA06',
    question: 'Uma joaninha no jardim tem 6 patinhas. Se contarmos as patinhas de 8 joaninhas juntas na mesma folha, quantas patinhas teremos no total?',
    options: [
      '42 patinhas',
      '48 patinhas',
      '54 patinhas',
      '36 patinhas'
    ],
    correctIndex: 1,
    explanation: 'Certinho! 8 joaninhas x 6 patinhas cada = 48 patinhas no total!'
  },
  {
    id: 'item_multiplicacao_3',
    missionId: 7,
    topic: 'Números e Operações',
    type: 'fill_in_blank',
    bncc: 'EF04MA06',
    question: 'Mateus tinha 15 pontos no jogo. Ao passar de nível, ele ganhou o TRIPLO dos seus pontos. Quantos pontos ele ganhou?',
    options: [
      '30 pontos',
      '45 pontos',
      '60 pontos',
      '35 pontos'
    ],
    correctIndex: 1,
    explanation: 'Na mosca! O triplo de uma quantidade é obtido multiplicando por 3. 15 x 3 = 45 pontos!'
  },
  {
    id: 'item_multiplicacao_4',
    missionId: 7,
    topic: 'Números e Operações',
    type: 'multiple_choice',
    bncc: 'EF04MA11',
    question: 'Observe a trilha dos insetos numerada: 4, 11, 18, 25, ___. Qual é o próximo número da sequência?',
    options: [
      '30',
      '32',
      '35',
      '31'
    ],
    correctIndex: 1,
    explanation: 'Genial! A sequência avança somando 7 a cada passo (4+7=11, 11+7=18, 18+7=25). Logo, 25 + 7 = 32!'
  },

  // =========================================================================
  // --- MISSÃO 8: QUADRILÁTEROS, FACES, VÉRTICES E POLÍGONOS ---
  // =========================================================================
  {
    id: 'item_poligonos_1',
    missionId: 8,
    topic: 'Espaço e Forma',
    type: 'multiple_choice',
    bncc: 'EF05MA16',
    question: 'Quantos lados e quantos vértices possui a figura geométrica plana conhecida como PENTÁGONO?',
    options: [
      '4 lados e 4 vértices',
      '5 lados e 5 vértices',
      '6 lados e 6 vértices',
      '8 lados e 8 vértices'
    ],
    correctIndex: 1,
    explanation: 'Isso aí! O prefixo "penta" significa cinco, logo o pentágono possui 5 lados e 5 vértices!'
  },
  {
    id: 'item_poligonos_2',
    missionId: 8,
    topic: 'Espaço e Forma',
    type: 'multiple_choice',
    bncc: 'EF05MA16',
    question: 'Uma caixa de sapatos comum tem o formato de um paralelepípedo (prisma retangular). Quantas faces planas ela possui ao todo?',
    options: [
      '4 faces',
      '6 faces',
      '8 faces',
      '12 faces'
    ],
    correctIndex: 1,
    explanation: 'Muito bem! O paralelepípedo possui 6 faces retangulares (tampa, fundo e 4 paredes laterais)!'
  },
  {
    id: 'item_poligonos_3',
    missionId: 8,
    topic: 'Espaço e Forma',
    type: 'image_selection',
    bncc: 'EF05MA17',
    question: 'Qual das opções abaixo descreve uma pirâmide de base triangular (tetraedro)?',
    options: [
      '1 base triangular e 3 faces laterais triangulares (4 faces no total)',
      '2 bases triangulares e 3 retângulos',
      '6 triângulos formando uma estrela',
      '1 círculo e 1 cone'
    ],
    correctIndex: 0,
    explanation: 'Sensacional! Uma pirâmide triangular tem 1 triângulo na base e 3 nas laterais, totalizando 4 faces triangulares!'
  },
  {
    id: 'item_poligonos_4',
    missionId: 8,
    topic: 'Espaço e Forma',
    type: 'fill_in_blank',
    bncc: 'EF04MA17',
    question: 'Qual sólido geométrico possui apenas 1 base plana circular e afunila até um único ponto no topo (como uma casquinha de sorvete)?',
    options: [
      'Cilindro',
      'Cone',
      'Esfera',
      'Prisma'
    ],
    correctIndex: 1,
    explanation: 'Perfeito! O cone possui uma base circular e um único vértice pontiagudo no topo!'
  },

  // =========================================================================
  // --- MISSÃO 9: PERÍMETRO, CONTORNO E ÁREAS NO JARDIM ---
  // =========================================================================
  {
    id: 'item_perimetro_1',
    missionId: 9,
    topic: 'Grandezas e Medidas',
    type: 'multiple_choice',
    bncc: 'EF04MA20',
    question: 'Um canteiro quadrado de flores no jardim tem lados medindo 5 metros. Para dar uma volta completa no seu contorno (perímetro), quantos metros percorremos?',
    options: [
      '10 metros',
      '15 metros',
      '20 metros',
      '25 metros'
    ],
    correctIndex: 2,
    explanation: 'Na mosca! O perímetro é a soma de todos os lados do contorno. No quadrado: 5 + 5 + 5 + 5 = 20 metros!'
  },
  {
    id: 'item_perimetro_2',
    missionId: 9,
    topic: 'Grandezas e Medidas',
    type: 'multiple_choice',
    bncc: 'EF04MA20',
    question: 'Uma quadra poliesportiva retangular tem 10 metros de comprimento por 6 metros de largura. Qual é o perímetro dessa quadra?',
    options: [
      '16 metros',
      '32 metros',
      '60 metros',
      '26 metros'
    ],
    correctIndex: 1,
    explanation: 'Excelente! Perímetro retangular: 10 + 6 + 10 + 6 = 32 metros de contorno total!'
  },
  {
    id: 'item_perimetro_3',
    missionId: 9,
    topic: 'Grandezas e Medidas',
    type: 'multiple_choice',
    bncc: 'EF05MA20',
    question: 'Um canteiro triangular possui lados medindo 4 metros, 5 metros e 6 metros. Qual é o perímetro total desse canteiro?',
    options: [
      '15 metros',
      '14 metros',
      '16 metros',
      '12 metros'
    ],
    correctIndex: 0,
    explanation: 'Mandou bem! Somando os 3 lados do triângulo: 4 + 5 + 6 = 15 metros!'
  },
  {
    id: 'item_perimetro_4',
    missionId: 9,
    topic: 'Grandezas e Medidas',
    type: 'fill_in_blank',
    bncc: 'EF04MA20',
    question: 'Dona Laura vai colocar uma cerca em volta de uma horta retangular de 8 metros de comprimento por 4 metros de largura. Quantos metros de cerca ela precisa comprar?',
    options: [
      '12 metros',
      '24 metros',
      '32 metros',
      '20 metros'
    ],
    correctIndex: 1,
    explanation: 'Show! Os 4 lados da horta medem 8m, 4m, 8m e 4m. Somando tudo: 8 + 4 + 8 + 4 = 24 metros de cerca!'
  },

  // =========================================================================
  // --- MISSÃO 10: PROBABILIDADE, SORTE E ESTATÍSTICA DO ESQUADRÃO ---
  // =========================================================================
  {
    id: 'item_probabilidade_1',
    missionId: 10,
    topic: 'Tratamento de Informações',
    type: 'multiple_choice',
    bncc: 'EF04MA26',
    question: 'Em uma roleta dividida em 8 fatias iguais, 6 são amarelas e 2 são roxas. Ao girar a roleta, qual cor tem a MAIOR chance de ser sorteada?',
    options: [
      'Amarela',
      'Roxa',
      'As duas têm exatamente a mesma chance',
      'Nenhuma das duas'
    ],
    correctIndex: 0,
    explanation: 'Muito bem! Há 6 fatias amarelas contra apenas 2 roxas, logo a probabilidade de parar no amarelo é muito maior!'
  },
  {
    id: 'item_probabilidade_2',
    missionId: 10,
    topic: 'Tratamento de Informações',
    type: 'multiple_choice',
    bncc: 'EF05MA22',
    question: 'Dentro de uma sacola escura há 10 bolinhas azuis e nenhuma bolinha vermelha. Ao retirar uma bolinha sem olhar, tirar uma bolinha vermelha é um evento:',
    options: [
      'Provável',
      'Impossível',
      'Certo',
      'Pouco provável'
    ],
    correctIndex: 1,
    explanation: 'Exato! Como não existe nenhuma bolinha vermelha na sacola, esse resultado é totalmente impossível!'
  },
  {
    id: 'item_probabilidade_3',
    missionId: 10,
    topic: 'Tratamento de Informações',
    type: 'multiple_choice',
    bncc: 'EF04MA27',
    question: 'Na votação de mascote da turma, o Grilo recebeu 15 votos, a Joaninha 25 votos e a Borboleta 10 votos. Quantos alunos votaram ao todo?',
    options: [
      '40 alunos',
      '45 alunos',
      '50 alunos',
      '55 alunos'
    ],
    correctIndex: 2,
    explanation: 'Perfeito! 15 + 25 + 10 = 50 alunos participaram da votação!'
  },
  {
    id: 'item_probabilidade_4',
    missionId: 10,
    topic: 'Tratamento de Informações',
    type: 'multiple_choice',
    bncc: 'EF05MA23',
    question: 'Ao lançar um dado comum de 6 faces (com números de 1 a 6), qual a chance de sair um número par (2, 4 ou 6)?',
    options: [
      'Metade das chances (3 em 6)',
      'Apenas uma chance em 6',
      'Quase impossível',
      'Certeza absoluta'
    ],
    correctIndex: 0,
    explanation: 'Sensacional! Os números pares são 2, 4 e 6 (3 números entre 6 possíveis), o que corresponde a exatamente metade das chances (50%)!'
  }
];

const INITIAL_MEMORY_ITEMS = [
  { id: 'item_monetario_1', title: 'Sistema Monetário (Troco e Cédulas)', halfLifeHours: 36, lastReviewedAt: '2026-10-18T10:00:00Z', totalAttempts: 4, consecutiveCorrect: 3 },
  { id: 'item_espaco_1', title: 'Espaço e Forma (Planificação de Sólidos)', halfLifeHours: 14, lastReviewedAt: '2026-10-17T08:00:00Z', totalAttempts: 2, consecutiveCorrect: 1 },
  { id: 'item_medidas_1', title: 'Grandezas e Medidas (Horas e Minutos)', halfLifeHours: 8, lastReviewedAt: '2026-10-16T12:00:00Z', totalAttempts: 1, consecutiveCorrect: 0 },
  { id: 'item_operacoes_1', title: 'Números e Operações (Frações e Divisão)', halfLifeHours: 48, lastReviewedAt: '2026-10-19T06:00:00Z', totalAttempts: 5, consecutiveCorrect: 4 },
  { id: 'item_tabelas_1', title: 'Tratamento da Informação (Tabelas e Gráficos)', halfLifeHours: 24, lastReviewedAt: '2026-10-18T14:00:00Z', totalAttempts: 3, consecutiveCorrect: 2 },
  { id: 'item_capacidade_1', title: 'Massa e Capacidade (Quilos e Litros)', halfLifeHours: 18, lastReviewedAt: '2026-10-18T16:00:00Z', totalAttempts: 2, consecutiveCorrect: 1 },
  { id: 'item_multiplicacao_1', title: 'Multiplicação e Dobro (Fliperama)', halfLifeHours: 30, lastReviewedAt: '2026-10-18T12:00:00Z', totalAttempts: 3, consecutiveCorrect: 2 },
  { id: 'item_poligonos_1', title: 'Polígonos e Sólidos (Faces e Vértices)', halfLifeHours: 12, lastReviewedAt: '2026-10-17T14:00:00Z', totalAttempts: 1, consecutiveCorrect: 0 },
  { id: 'item_perimetro_1', title: 'Perímetro e Contorno do Jardim', halfLifeHours: 20, lastReviewedAt: '2026-10-18T09:00:00Z', totalAttempts: 2, consecutiveCorrect: 1 },
  { id: 'item_probabilidade_1', title: 'Probabilidade e Gráficos do Jardim', halfLifeHours: 16, lastReviewedAt: '2026-10-17T18:00:00Z', totalAttempts: 2, consecutiveCorrect: 1 }
];

module.exports = {
  LESSON_QUESTIONS,
  INITIAL_MEMORY_ITEMS
};

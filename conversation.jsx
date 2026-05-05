// conversation.jsx — script of 10 messages + playback engine
// All texts are pt-BR, faithful to the spec the user provided.

const USER_NAME_DEFAULT = 'Rafael';
const CLIENT_NAME_DEFAULT = 'João Marcelo';

// Build the script given dynamic names.
// Each step has a `type` controlling how the playback engine renders it:
//  - phase: inserts a phase marker (FASE N · LABEL)
//  - typing: shows typing indicator for `duration` ms (from = 'in' | 'out')
//  - bubble: renders a message bubble; options: action[], quickReplies[]
//  - media: media bubble (screenshot / image mock) — pass `render` function
//  - menu: product menu (custom component)
//  - system: system notice (centered bg)
//  - userText: simulates user typing in the input bar + sends an "out" bubble
//  - headerSwap: toggles chat header between Anova and "Grupo · Seguro de Vida"
//  - pause: empty wait for N ms
function buildScript({ user = USER_NAME_DEFAULT, client = CLIENT_NAME_DEFAULT } = {}) {
  return [
    // ─── FASE 1 · ACESSO ────────────────────────────
    { type: 'phase', phase: 1, label: 'ACESSO' },

    // MSG 1 — apresentação + link de cadastro
    { type: 'typing', from: 'in', duration: 900 },
    { type: 'bubble', from: 'in', time: '10:30', msgId: 1,
      content: { lines: [
        'Olá! Seja bem-vindo à Anova. 👋',
        '',
        'Somos uma plataforma de distribuição financeira que conecta profissionais do mercado a produtos de crédito, seguros e investimentos — com toda a infraestrutura pronta para você operar.',
        '',
        'Para começar, precisamos criar o seu cadastro. É rápido e leva menos de 2 minutos.',
      ], action: { icon: '📋', label: 'Fazer meu cadastro' } } },

    { type: 'pause', duration: 1400 },
    { type: 'system', children: 'Cadastro concluído via link externo' },

    // MSG 2 — boas-vindas pós-cadastro
    { type: 'typing', from: 'in', duration: 800 },
    { type: 'bubble', from: 'in', time: '10:31', msgId: 2,
      content: { lines: [
        'Cadastro realizado com sucesso! ✅',
        '',
        `Bem-vindo à Anova, ${user}.`,
        '',
        'Estamos prontos para começar. Para acessar a plataforma, digite a palavra:',
        '',
        '👉 *acesso*',
      ] } },

    // user types "acesso"
    { type: 'userText', text: 'acesso', time: '10:31', msgId: 'u-acesso' },

    // MSG 3 — apresentação do painel
    { type: 'typing', from: 'in', duration: 900 },
    { type: 'bubble', from: 'in', time: '10:31', msgId: 3,
      content: { lines: [
        'Acesso confirmado. 🔓',
        '',
        'O que você está vendo agora é o seu *painel de comissões*.',
        '',
        'Aqui você acompanha em tempo real todas as comissões a receber após o fechamento de cada negociação — por produto, por cliente e por status.',
        '',
        'Para ver os produtos disponíveis para distribuição, clique em *Menu* abaixo. 👇',
      ], action: { icon: '☰', label: 'Menu' } } },

    // ─── FASE 2 · PRODUTO ───────────────────────────
    { type: 'phase', phase: 2, label: 'PRODUTO · SEGURO DE VIDA' },

    // MSG 4 — seleção de produto
    { type: 'typing', from: 'in', duration: 700 },
    { type: 'bubble', from: 'in', time: '10:32', msgId: 4,
      content: { lines: [
        'Ótimo! Aqui estão os produtos disponíveis na plataforma.',
        '',
        'Para esta demonstração, selecione *Seguro de Vida* e veja como funciona o fluxo completo de uma originação.',
      ] } },
    { type: 'menu' },
    { type: 'userText', text: 'Seguro de Vida', time: '10:33', msgId: 'u-produto' },

    // MSG 5 — explicação do flow
    { type: 'typing', from: 'in', duration: 1100 },
    { type: 'bubble', from: 'in', time: '10:33', msgId: 5,
      content: { lines: [
        'Perfeito. Ao iniciar uma originação de Seguro de Vida, a plataforma gera automaticamente um formulário de coleta de dados.',
        '',
        'Você tem duas opções:',
        '',
        '1️⃣ *Preencher você mesmo* — ideal quando está com o cliente pessoalmente.',
        '',
        `2️⃣ *Enviar para o cliente* — a Anova envia o formulário diretamente para o WhatsApp do cliente, com o número do orquestrador. Ele preenche no próprio celular, sem precisar da sua intermediação.`,
        '',
        'Como prefere fazer nesta demonstração?',
      ], quickReplies: [
        { label: 'Preencher eu mesmo' },
        { label: 'Enviar para o cliente' },
      ] } },
    { type: 'userText', text: 'Enviar para o cliente', time: '10:34', msgId: 'u-opt' },

    // MSG 6 — prévia + imagens (print cliente + form preenchido)
    { type: 'typing', from: 'in', duration: 1000 },
    { type: 'bubble', from: 'in', time: '10:34', msgId: 6,
      content: { lines: [
        'Formulário enviado para o cliente. ✅',
        '',
        'Veja abaixo como a mensagem chegou no WhatsApp dele 👇',
      ] } },
    { type: 'media', mock: 'received', time: '10:34', msgId: '6-img1' },
    { type: 'pause', duration: 1200 },
    { type: 'bubble', from: 'in', time: '10:41', msgId: '6b',
      content: { lines: [
        'E este é o formulário que ele preencheu 👇',
      ] } },
    { type: 'media', mock: 'filled', time: '10:41', msgId: '6-img2' },

    // ─── FASE 3 · GRUPO ─────────────────────────────
    { type: 'phase', phase: 3, label: 'GRUPO DE NEGOCIAÇÃO' },

    // MSG 7 — confirmação + criação do grupo
    { type: 'typing', from: 'in', duration: 900 },
    { type: 'bubble', from: 'in', time: '10:42', msgId: 7,
      content: { lines: [
        'O seu cliente finalizou o preenchimento dos dados. ✅',
        '',
        'A Anova acabou de criar um grupo de negociação com os três envolvidos:',
        '',
        `👤 Você (originador)`,
        `👤 ${client} (cliente)`,
        '👤 Parceiro Especialista Anova',
        '',
        'Este grupo é o ambiente onde toda a negociação vai acontecer — proposta, dúvidas e fechamento.',
        '',
        'Acesse o grupo agora para continuar. 👇',
      ], action: { icon: '👥', label: 'Entrar no grupo' } } },

    // header swap → group view
    { type: 'headerSwap', to: 'group' },
    { type: 'system', children: `Você entrou no grupo "Anova · Seguro de Vida · ${client}"` },

    // MSG 8 — orientação no grupo
    { type: 'typing', from: 'in', duration: 800 },
    { type: 'bubble', from: 'in', time: '10:42', msgId: 8,
      content: { lines: [
        'Ótimo, você está no grupo. 👍',
        '',
        'A partir daqui, toda a negociação acontece aqui — proposta, esclarecimentos e fechamento com o Parceiro Especialista.',
        '',
        'Seu cliente também precisa entrar. O link do grupo já foi enviado para o WhatsApp dele automaticamente.',
      ] } },
    { type: 'pause', duration: 800 },
    { type: 'system', children: `${client} entrou no grupo` },
    { type: 'pause', duration: 400 },
    { type: 'system', children: 'Parceiro Especialista entrou no grupo' },

    // ─── FASE 4 · ENCERRAMENTO ──────────────────────
    { type: 'phase', phase: 4, label: 'ENCERRAMENTO' },

    // MSG 9 (referred as MSG 10 in spec but numbered as 9 here — final)
    { type: 'typing', from: 'in', duration: 1100 },
    { type: 'bubble', from: 'in', time: '10:43', msgId: 9,
      content: { lines: [
        'Você concluiu o fluxo completo de uma originação na Anova. 🎉',
        '',
        'Veja o que acontece a partir daqui:',
        '',
        '✅ O Parceiro Especialista conduz a negociação no grupo.',
        '✅ Você acompanha tudo em tempo real, sem precisar intermediar.',
        '✅ Quando o negócio fechar, o status é atualizado automaticamente no seu card — e a comissão é registrada no seu painel.',
        '',
        'É assim que a Anova funciona em produção.',
        '',
        'Qualquer dúvida operacional, estamos aqui. 👋',
      ] } },
  ];
}

// Design notes per msgId (shown in right rail)
const DESIGN_NOTES = [
  { msgId: 1, phase: 1, title: 'Apresentação + cadastro', trigger: 'Número não encontrado na base (Fase 0).',
    body: 'A Fase 0 (verificação do número) roteia usuários ativos para um fluxo diferente. Esta mensagem só aparece para quem ainda não é cadastrado — evita ruído em quem já opera.' },
  { msgId: 2, phase: 1, title: 'Boas-vindas pós-cadastro', trigger: 'Webhook do cadastro concluído.',
    body: 'Uso do primeiro nome personaliza o tom. A instrução prepara o micro-ritual da MSG 3.' },
  { msgId: 3, phase: 1, title: 'Palavra-chave "acesso"', trigger: 'Usuário envia a palavra exata.',
    body: 'O "acesso" funciona como micro-ritual de ativação: o usuário faz uma ação intencional antes de entrar na plataforma. Diminui fricção cognitiva sem abrir mão da intencionalidade.' },
  { msgId: 4, phase: 2, title: 'Seleção de produto', trigger: 'Clique em Menu.',
    body: 'Três produtos expostos, um destacado para o roteiro guiado. Em produção, os botões seriam quick-replies nativos do WhatsApp Business API.' },
  { msgId: 5, phase: 2, title: 'Duas opções operacionais', trigger: 'Escolha de Seguro de Vida.',
    body: 'As duas opções (preencher vs. enviar) ensinam o modelo operacional real da plataforma. Qualquer que seja a escolha, o MSG 6 mostra a jornada completa — inclusive o lado do cliente.' },
  { msgId: 6, phase: 2, title: 'Prévia dos prints', trigger: 'Escolha "Enviar para o cliente".',
    body: 'Duas imagens: print da mensagem recebida pelo cliente (via número do orquestrador) + print do formulário preenchido. Confirma para o originador que o orquestrador funciona e transparenta o que o cliente vê.' },
  { msgId: 7, phase: 3, title: 'Trio no grupo', trigger: 'Webhook do formulário concluído.',
    body: 'O grupo com três partes (originador + cliente + especialista) é o diferencial da Anova. A MSG nomeia os três explicitamente para o originador entender o papel de cada um.' },
  { msgId: 8, phase: 3, title: 'Orientação dentro do grupo', trigger: 'Entrada no grupo.',
    body: 'Reforça que, daqui em diante, a negociação fica com o Parceiro Especialista. O originador continua presente, mas não intermedia.' },
  { msgId: 9, phase: 4, title: 'O que acontece depois', trigger: 'Fim automático após MSG 8.',
    body: 'Não é só encerramento: explica o que acontece depois do fechamento e onde aparece a comissão — fechando o ciclo que começou com o painel na MSG 3.' },
];

Object.assign(window, { buildScript, DESIGN_NOTES, USER_NAME_DEFAULT, CLIENT_NAME_DEFAULT });

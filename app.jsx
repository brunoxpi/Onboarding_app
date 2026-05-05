// app.jsx — Interactive onboarding (v4)
// Phone-only canvas. Signup modal on CTA. After group is created, a chat-list
// appears so the user can switch between Anova individual chat and the new group.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "userName": "Rafael",
  "clientName": "João Marcelo",
  "speed": 1.0
}/*EDITMODE-END*/;

const scale = (ms, speed) => Math.max(60, Math.round(ms / Math.max(.3, speed)));

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function BubbleContent({ content, onAction }) {
  const lines = content.lines || [];
  const body = lines.join('\n');
  return (
    <>
      <WAText text={body} />
      {content.action && (
        <ActionLink
          icon={content.action.icon}
          label={content.action.label}
          href={content.action.href}
          onClick={() => onAction && onAction('cta', content.action)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// SCRIPT
// Each scene belongs to a chat (anova | group). Scenes for the
// group only fire after the user enters it.
// ─────────────────────────────────────────────────────────────
function buildScenes({ user, client }) {
  return [
    { id: 'welcome', chat: 'anova', phaseMarker: { phase: 1, label: 'ACESSO' },
      items: [
        { kind: 'typing', from: 'in', duration: 900 },
        { kind: 'explain', from: 'in', time: '10:30', msgId: 1, content: { lines: [
          'Olá! Seja bem-vindo à Anova. 👋',
          '',
          'Antes de começar, vamos fazer o seu *cadastro*. Ele é o que te habilita a originar demandas e distribuir produtos pela nossa plataforma — crédito, seguros, consórcio e investimentos.',
          '',
          'Nas próximas mensagens você vai ver, na prática, como funciona o fluxo de ponta a ponta: do cadastro até o fechamento da originação com o cliente.',
        ] } },
        { kind: 'pause', duration: 4200 },
        { kind: 'typing', from: 'in', duration: 700 },
        { kind: 'bubble', from: 'in', time: '10:30', msgId: '1b', content: { lines: [
          'Quando estiver pronto, é só tocar abaixo. Leva menos de 2 minutos.',
        ], action: { icon: '📋', label: 'Fazer meu cadastro' } } },
      ],
      gate: { type: 'signup', hint: 'Toque em "Fazer meu cadastro"' } },

    { id: 'post-cadastro', chat: 'anova',
      items: [
        { kind: 'system', children: 'Cadastro concluído ✓' },
        { kind: 'typing', from: 'in', duration: 900 },
        { kind: 'explain', from: 'in', time: '10:31', msgId: 2, content: { lines: [
          'Tudo certo, {{USER}}. ✅',
          '',
          'Para liberar o seu painel, digite a palavra abaixo:',
          '',
          '👉 *acesso*',
        ] } },
      ],
      gate: { type: 'typed', expected: 'acesso', hint: 'Digite *acesso* abaixo' } },

    { id: 'confirmar-acesso', chat: 'anova',
      items: [
        { kind: 'typing', from: 'in', duration: 700 },
        { kind: 'bubble', from: 'in', time: '10:31', msgId: '2b', content: {
          lines: [
            '*Confirmar acesso*',
            'Para segurança dos dados, confirme sua identidade.',
          ],
          action: { icon: '🔒', label: 'Confirmar acesso' },
        } },
      ],
      gate: { type: 'identity', hint: 'Toque em "Confirmar acesso"' } },

    { id: 'painel', chat: 'anova',
      items: [
        { kind: 'typing', from: 'in', duration: 900 },
        { kind: 'explain', from: 'in', time: '10:31', msgId: 3, content: { lines: [
          'Acesso confirmado. 🔓',
          '',
          'O que você está vendo agora é o seu *painel de comissões*. Aqui você acompanha em tempo real todas as comissões a receber após o fechamento de cada negociação — por produto, por cliente e por status.',
        ] } },
      ],
      gate: { type: 'none', delay: 600 } },

    { id: 'produtos', chat: 'anova',
      items: [
        { kind: 'typing', from: 'in', duration: 800 },
        { kind: 'explain', from: 'in', time: '10:32', msgId: 4, content: { lines: [
          'Ótimo! Aqui estão os produtos disponíveis na plataforma.',
          '',
          'Para esta demonstração, selecione *Proteção/Benefício* e veja como funciona o fluxo completo de uma originação de Seguro de Vida.',
        ] } },
        { kind: 'typing', from: 'in', duration: 600 },
        { kind: 'carousel' },
      ],
      gate: { type: 'choice', expected: 'protecao', hint: 'Escolha Proteção/Benefício' } },

    { id: 'flow-options', chat: 'anova',
      items: [
        { kind: 'typing', from: 'in', duration: 1100 },
        { kind: 'explain', from: 'in', time: '10:33', msgId: 5, content: { lines: [
          'Perfeito. Ao iniciar uma originação de Seguro de Vida, a plataforma gera automaticamente um formulário de coleta de dados.',
          '',
          'Você tem duas opções:',
          '',
          '1️⃣ *Preencher você mesmo* — ideal quando está com o cliente pessoalmente.',
          '',
          '2️⃣ *Enviar para o cliente* — a Anova envia o formulário diretamente para o WhatsApp do cliente, com o número do orquestrador.',
        ] } },
        { kind: 'typing', from: 'in', duration: 600 },
        { kind: 'bubble', from: 'in', time: '10:33', msgId: '5b', content: { lines: [
          'Como prefere fazer nesta demonstração?',
        ] } },
        { kind: 'replies', options: [
          { id: 'self', label: 'Preencher eu mesmo' },
          { id: 'send', label: 'Enviar para o cliente' },
        ] },
      ],
      gate: { type: 'choice', expected: ['self', 'send'], hint: 'Escolha uma opção' } },

    { id: 'enviado', chat: 'anova',
      items: [
        { kind: 'typing', from: 'in', duration: 1000 },
        { kind: 'explain', from: 'in', time: '10:34', msgId: 6, content: { lines: [
          'Formulário enviado para o cliente. ✅',
          '',
          'Veja abaixo como a mensagem chegou no WhatsApp dele 👇',
        ] } },
        { kind: 'explainMedia', mock: 'received', time: '10:34' },
        { kind: 'pause', duration: 1400 },
        { kind: 'explainSystem', children: `${client} está preenchendo o formulário…` },
        { kind: 'pause', duration: 1500 },
        { kind: 'typing', from: 'in', duration: 800 },
        { kind: 'explain', from: 'in', time: '10:41', msgId: '6b', content: { lines: [
          'E este é o formulário que ele preencheu 👇',
        ] } },
        { kind: 'explainMedia', mock: 'filled', time: '10:41' },
      ],
      gate: { type: 'none', delay: 1000 } },

    { id: 'grupo-criado', chat: 'anova', phaseMarker: { phase: 2, label: 'GRUPO DE NEGOCIAÇÃO' },
      items: [
        { kind: 'typing', from: 'in', duration: 900 },
        { kind: 'explain', from: 'in', time: '10:42', msgId: 7, content: { lines: [
          'O seu cliente finalizou o preenchimento dos dados. ✅',
          '',
          'A Anova acabou de criar um grupo de negociação com os três envolvidos:',
          '',
          '👤 Você (originador)',
          `👤 ${client} (cliente)`,
          '👤 Parceiro Especialista Anova',
          '',
          'Este grupo é o ambiente onde toda a negociação vai acontecer — proposta, dúvidas e fechamento.',
        ] } },
        { kind: 'typing', from: 'in', duration: 600 },
        { kind: 'bubble', from: 'in', time: '10:42', msgId: '7b', content: { lines: [
          'Acesse o grupo agora para continuar. 👇',
        ], action: { icon: '👥', label: 'Entrar no grupo' } } },
      ],
      gate: { type: 'group-join', hint: 'Toque em "Entrar no grupo"' } },

    // Group scenes — fire only after entering group
    { id: 'no-grupo', chat: 'group', createsGroup: true,
      items: [
        { kind: 'system', children: `Você criou o grupo "Anova · Seguro de Vida · ${client}"` },
        { kind: 'typing', from: 'in', duration: 800 },
        { kind: 'explain', from: 'in', time: '10:42', msgId: 8, content: { lines: [
          'Ótimo, você está no grupo. 👍',
          '',
          'A partir daqui, toda a negociação acontece aqui — proposta, esclarecimentos e fechamento com o Parceiro Especialista.',
          '',
          'Seu cliente também precisa entrar. O link do grupo já foi enviado para o WhatsApp dele automaticamente.',
        ] } },
        { kind: 'pause', duration: 900 },
        { kind: 'system', children: `${client} entrou no grupo` },
        { kind: 'pause', duration: 500 },
        { kind: 'system', children: 'Parceiro Especialista entrou no grupo' },
      ],
      gate: { type: 'none', delay: 800 } },

    { id: 'fim', chat: 'group', phaseMarker: { phase: 3, label: 'ENCERRAMENTO' },
      items: [
        { kind: 'typing', from: 'in', duration: 1200 },
        { kind: 'explain', from: 'in', time: '10:43', msgId: 9, content: { lines: [
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
      ],
      gate: { type: 'none', delay: 800 } },

    { id: 'habilitado', chat: 'group',
      items: [
        { kind: 'typing', from: 'in', duration: 1000 },
        { kind: 'bubble', from: 'in', time: '10:44', msgId: 10, content: { lines: [
          'Você já está habilitado a utilizar a Anova, {{USER}}. ✅',
          '',
          'Para começar a interagir e originar demandas de verdade, envie a palavra *acesso* para o nosso número oficial. A partir daí, é só seguir o fluxo que você acabou de ver.',
        ], action: {
          icon: '💬',
          label: 'Enviar "acesso" no WhatsApp',
          href: 'https://wa.me/551150431533?text=acesso',
        } } },
        { kind: 'pause', duration: 800 },
        { kind: 'typing', from: 'in', duration: 700 },
        { kind: 'bubble', from: 'in', time: '10:44', msgId: '10b', content: { lines: [
          'Quer praticar o fluxo de novo, agora *sem as explicações*? Você passa pelas mesmas etapas, mas só com as mensagens reais.',
        ], action: {
          icon: '🔁',
          label: 'Refazer sem explicações',
          kind: 'restart-skip',
        } } },
      ],
      gate: { type: 'done' } },
  ];
}

// ─────────────────────────────────────────────────────────────
// Stream
// ─────────────────────────────────────────────────────────────
function ChatStream({ items, onCTA, onChoice, userName }) {
  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [items.length]);

  const resolve = (text) => (text || '').replace(/\{\{USER\}\}/g, userName || '');
  const resolveLines = (lines) => (lines || []).map(resolve);
  const resolveContent = (content) => content ? { ...content, lines: resolveLines(content.lines) } : content;
  const resolveChildren = (children) => typeof children === 'string' ? resolve(children) : children;

  return (
    <div ref={listRef} style={{
      flex: 1,
      overflowY: 'auto', overflowX: 'hidden',
      background: `url("${WA_BG_URL}")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '220px 220px',
      backgroundColor: '#EFE7DE',
      paddingTop: 8, paddingBottom: 6,
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      {items.map((s, i) => {
        const key = `${i}-${s.kind}-${s.msgId || ''}`;
        switch (s.kind) {
          case 'phase': return <PhaseMarker key={key} phase={s.phase} label={s.label} />;
          case 'system': return <SystemNotice key={key}>{resolveChildren(s.children)}</SystemNotice>;
          case 'explainSystem': return <ExplainSystem key={key}>{resolveChildren(s.children)}</ExplainSystem>;
          case 'typing': return <TypingBubble key={key} />;
          case 'explain': {
            const c = resolveContent(s.content);
            return <ExplainBubble key={key} time={s.time} action={c?.action} onAction={() => onCTA && onCTA({ ...s, content: c })}>
              <WAText text={(c?.lines || []).join('\n')} />
            </ExplainBubble>;
          }
          case 'explainMedia': {
            const inner = s.mock === 'received' ? <ClientReceivedMock /> : <FilledFormMock />;
            return <ExplainMedia key={key} time={s.time} caption={s.caption}>{inner}</ExplainMedia>;
          }
          case 'carousel':
            return <CommissionCarousel key={key} onPick={(p) => onChoice && onChoice(p.k, p.label)} />;
          case 'bubble': {
            const c = resolveContent(s.content);
            return <Bubble key={key} from={s.from} time={s.time} showStatus={s.from === 'out'}>
              <BubbleContent content={c} onAction={() => onCTA && onCTA({ ...s, content: c })} />
            </Bubble>;
          }
          case 'userBubble':
            return <Bubble key={key} from="out" time={s.time} showStatus>{resolve(s.text)}</Bubble>;
          case 'menu':
            return <ProductMenuMock key={key} onPick={(p) => onChoice && onChoice(p.k)} />;
          case 'replies':
            return <QuickReplies key={key} options={s.options} onPick={(o) => onChoice && onChoice(o.id, o.label)} />;
          case 'media': {
            const inner = s.mock === 'received' ? <ClientReceivedMock /> : <FilledFormMock />;
            return <MediaBubble key={key} from="in" time={s.time}>{inner}</MediaBubble>;
          }
          default: return null;
        }
      })}
    </div>
  );
}

// Stack of floating glass CTAs (bottom-of-screen). Multiple actions stack vertically.
function FloatingCTAStack({ actions, onAction, bottom = 70 }) {
  if (!actions || actions.length === 0) return null;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: bottom,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      pointerEvents: 'none', zIndex: 25,
      padding: '0 16px',
    }}>
      {actions.map((a, i) => (
        <FloatingCTA key={a._id || i} action={a} onClick={() => onAction(a)} bottom={null} />
      ))}
    </div>
  );
}

function HintPill({ text }) {
  if (!text) return null;
  return (
    <div style={{
      position: 'absolute', left: 8, right: 8, bottom: 60,
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 20,
    }}>
      <div style={{
        background: 'rgba(10,10,10,.92)', color: '#fff',
        padding: '7px 12px', borderRadius: 999,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: .1, textTransform: 'uppercase',
        boxShadow: '0 4px 16px rgba(0,0,0,.25)',
        animation: 'hintIn 320ms cubic-bezier(.34,1.56,.64,1) both',
        maxWidth: '90%', textAlign: 'center',
      }}>{text}</div>
    </div>
  );
}

// Floating glassmorphism CTA — sits above the input bar.
// When set, shows a pill with the action's icon/label. Tap to fire onClick or follow href.
function FloatingCTA({ action, onClick, bottom = 70 }) {
  if (!action) return null;
  const inner = (
    <>
      {action.icon && <span style={{ fontSize: 17 }}>{action.icon}</span>}
      <span>{action.label}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: .8 }}>
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </>
  );
  const baseStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '13px 20px',
    background: 'linear-gradient(160deg, rgba(245,232,210,.86) 0%, rgba(232,213,180,.78) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(180,140,80,.34)',
    borderRadius: 999,
    color: '#5a3a08',
    fontSize: 14.5, fontWeight: 600,
    fontFamily: '-apple-system, system-ui',
    letterSpacing: -.1,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(120,80,20,.22), 0 2px 6px rgba(120,80,20,.14), inset 0 1px 0 rgba(255,255,255,.5)',
    textDecoration: 'none',
    transition: 'transform 140ms ease, box-shadow 140ms ease',
    animation: 'floatCTAIn 380ms cubic-bezier(.34,1.56,.64,1) both',
  };
  const onEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = '0 12px 30px rgba(120,80,20,.28), 0 3px 8px rgba(120,80,20,.18), inset 0 1px 0 rgba(255,255,255,.6)';
  };
  const onLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(120,80,20,.22), 0 2px 6px rgba(120,80,20,.14), inset 0 1px 0 rgba(255,255,255,.5)';
  };
  return bottom == null ? (
    action.href ? (
      <a href={action.href} target="_blank" rel="noopener noreferrer"
         onClick={onClick}
         style={{ ...baseStyle, pointerEvents: 'auto' }}
         onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</a>
    ) : (
      <button onClick={onClick}
              style={{ ...baseStyle, pointerEvents: 'auto' }}
              onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</button>
    )
  ) : (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: bottom,
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 25,
      padding: '0 16px',
    }}>
      {action.href ? (
        <a href={action.href} target="_blank" rel="noopener noreferrer"
           onClick={onClick}
           style={{ ...baseStyle, pointerEvents: 'auto' }}
           onMouseEnter={onEnter} onMouseLeave={onLeave}>
          {inner}
        </a>
      ) : (
        <button onClick={onClick}
                style={{ ...baseStyle, pointerEvents: 'auto', border: baseStyle.border }}
                onMouseEnter={onEnter} onMouseLeave={onLeave}>
          {inner}
        </button>
      )}
    </div>
  );
}

function InteractiveInput({ active, expected, onSubmit }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (active && inputRef.current) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [active]);

  const send = () => {
    const v = value.trim();
    if (!v) return;
    onSubmit(v);
    setValue('');
  };
  const matches = expected && value.trim().toLowerCase() === expected.toLowerCase();
  const muted = '#54656F';

  return (
    <div style={{
      background: 'rgba(244,244,244,.96)',
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      padding: '8px 8px 10px',
      display: 'flex', alignItems: 'flex-end', gap: 8,
      flexShrink: 0,
      borderTop: '0.5px solid rgba(17,27,33,.08)',
    }}>
      {/* + (attach) */}
      <button disabled={!active} style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'transparent', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: active ? 'pointer' : 'not-allowed',
        flexShrink: 0,
        opacity: active ? 1 : .4,
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#008069" strokeWidth="1.6"/>
          <path d="M12 8v8M8 12h8" stroke="#008069" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
      <div style={{
        flex: 1, background: '#fff', borderRadius: 20,
        padding: '6px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        minHeight: 36, boxSizing: 'border-box',
        outline: active && matches ? '2px solid #008069' : 'none',
        outlineOffset: -1,
        transition: 'outline 160ms ease, box-shadow 160ms ease',
        boxShadow: active && matches ? '0 0 0 4px rgba(0,128,105,.12)' : 'none',
        border: '0.5px solid rgba(17,27,33,.10)',
      }}>
        <input
          ref={inputRef} type="text"
          disabled={!active}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder={active ? (expected ? `Digite "${expected}"…` : 'iMessage') : 'Mensagem'}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 15, fontFamily: '-apple-system, system-ui',
            color: '#111B21', background: 'transparent', minWidth: 0,
            cursor: active ? 'text' : 'not-allowed',
            padding: '4px 0',
          }}
        />
        <button disabled={!active} style={{
          background: 'transparent', border: 'none', padding: 0,
          width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: active ? 'pointer' : 'not-allowed', opacity: active ? 1 : .4,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={muted} strokeWidth="1.6"/>
            <circle cx="9.5" cy="10" r="1" fill={muted}/>
            <circle cx="14.5" cy="10" r="1" fill={muted}/>
            <path d="M9 14.5s1 1.5 3 1.5 3-1.5 3-1.5" stroke={muted} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <button onClick={send} disabled={!active || !value.trim()} style={{
        width: 36, height: 36, borderRadius: '50%',
        background: value.trim() && active ? '#008069' : 'transparent',
        border: 'none',
        cursor: value.trim() && active ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'background 160ms ease, transform 160ms ease',
        transform: value.trim() && active ? 'scale(1)' : 'scale(.92)',
      }}>
        {value.trim() ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
            <path d="M3 11.5L21 3l-8.5 18-2-8L3 11.5z"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="3" width="6" height="12" rx="3" fill="#008069"/>
            <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="#008069" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  const { userName, clientName, speed } = tweaks;
  const [signupName, setSignupName] = useState(null); // first name captured from signup form
  const [hideExplanations, setHideExplanations] = useState(false);
  const userRef = useRef(userName);
  useEffect(() => { userRef.current = signupName || userName; }, [signupName, userName]);

  // Scenes built with a placeholder; we resolve {{USER}} at render time so updating
  // the captured name doesn't reset the flow.
  const rawScenes = useMemo(() => buildScenes({ user: '{{USER}}', client: clientName }), [clientName]);
  const scenes = useMemo(() => {
    if (!hideExplanations) return rawScenes;
    return rawScenes.map(s => ({
      ...s,
      items: s.items.filter(it => it.kind !== 'explain' && it.kind !== 'explainMedia' && it.kind !== 'explainSystem'),
    }));
  }, [rawScenes, hideExplanations]);

  const [sceneIdx, setSceneIdx] = useState(0);
  const [streams, setStreams] = useState({ anova: [], group: [] });
  const [view, setView] = useState('chat');           // chat | list
  const [activeChat, setActiveChat] = useState('anova'); // anova | group
  const [groupExists, setGroupExists] = useState(false);
  const [waitingGate, setWaitingGate] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [hintPulse, setHintPulse] = useState(0);

  const timerRef = useRef([]);
  const sceneTokenRef = useRef(0);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
  const tset = (fn, ms) => { const t = setTimeout(fn, ms); timerRef.current.push(t); return t; };

  const pushTo = (chat, item) => {
    setStreams(prev => ({ ...prev, [chat]: [...prev[chat], item] }));
  };
  const removeFrom = (chat, item) => {
    setStreams(prev => ({ ...prev, [chat]: prev[chat].filter(x => x !== item) }));
  };

  // Reset
  useEffect(() => {
    clearTimers();
    sceneTokenRef.current++;
    setSceneIdx(0);
    setStreams({ anova: [], group: [] });
    setView('chat');
    setActiveChat('anova');
    setGroupExists(false);
    setWaitingGate(null);
    setShowSignup(false);
    setShowIdentity(false);
  }, [scenes]);

  // Drive scenes
  useEffect(() => {
    if (sceneIdx >= scenes.length) return;
    const scene = scenes[sceneIdx];
    const myToken = ++sceneTokenRef.current;
    const myScene = sceneIdx;
    const targetChat = scene.chat;

    if (scene.createsGroup) setGroupExists(true);

    if (scene.phaseMarker) {
      pushTo(targetChat, { kind: 'phase', ...scene.phaseMarker });
    }

    let cursor = scene.phaseMarker ? 60 : 0;

    for (const item of scene.items) {
      const at = cursor;
      tset(() => {
        if (sceneTokenRef.current !== myToken) return;
        if (item.kind === 'typing') {
          const obj = { ...item, _sceneIdx: myScene };
          pushTo(targetChat, obj);
          tset(() => {
            if (sceneTokenRef.current !== myToken) return;
            removeFrom(targetChat, obj);
          }, scale(item.duration || 900, speed));
        } else if (item.kind === 'pause') {
          // no-op visible
        } else {
          pushTo(targetChat, { ...item, _sceneIdx: myScene });
        }
      }, at);

      if (item.kind === 'typing') cursor += scale(item.duration || 900, speed) + 80;
      else if (item.kind === 'pause') cursor += scale(item.duration || 500, speed);
      else if (item.kind === 'explain') cursor += scale(2200, speed);
      else if (item.kind === 'bubble') cursor += scale(900, speed);
      else if (item.kind === 'media' || item.kind === 'carousel' || item.kind === 'explainMedia') cursor += scale(1400, speed);
      else if (item.kind === 'menu' || item.kind === 'replies') cursor += scale(700, speed);
      else if (item.kind === 'system' || item.kind === 'explainSystem') cursor += scale(700, speed);
      else cursor += 300;
    }

    tset(() => {
      if (sceneTokenRef.current !== myToken) return;
      const g = scene.gate;
      if (g.type === 'none') {
        tset(() => {
          if (sceneTokenRef.current !== myToken) return;
          setSceneIdx(i => i + 1);
        }, scale(g.delay || 600, speed));
      } else {
        setWaitingGate(g);
      }
    }, cursor);

    return () => { clearTimers(); };
  }, [sceneIdx, scenes, speed]);

  // ── Gate handlers ──
  const advance = (delay = 400) => {
    setWaitingGate(null);
    tset(() => setSceneIdx(i => i + 1), scale(delay, speed));
  };

  const onBubbleCTA = (bubble) => {
    const action = bubble?.content?.action;
    // Special-case: meta actions on the final bubble.
    if (action?.kind === 'restart-skip') {
      restart({ skipExplanations: true });
      return;
    }
    if (action?.kind === 'restart') {
      restart({ skipExplanations: false });
      return;
    }
    if (!waitingGate) return;
    if (waitingGate.type === 'signup') {
      setShowSignup(true);
      return;
    }
    if (waitingGate.type === 'identity') {
      setShowIdentity(true);
      return;
    }
    if (waitingGate.type === 'cta') {
      const label = bubble.content?.action?.label || 'OK';
      pushTo(activeChat, { kind: 'userBubble', text: `▸ ${label}`, time: nowTime() });
      advance();
    } else if (waitingGate.type === 'group-join') {
      pushTo(activeChat, { kind: 'userBubble', text: '▸ Entrar no grupo', time: nowTime() });
      // Open group tab
      setActiveChat('group');
      setView('chat');
      advance(500);
    }
  };

  const onSignupSubmit = (data) => {
    setShowSignup(false);
    const first = (data.nome_partner || '').trim().split(/\s+/)[0] || '';
    if (first) setSignupName(first);

    const telefoneIntl = '55' + data.telefone;

    Promise.all([
      fetch('https://api.anovainvestimentos.com.br/api/hubs-credenciados/assessores', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_partner: data.nome_partner,
          email: data.email,
          ...(data.cpf_responsavel ? { cpf_responsavel: data.cpf_responsavel } : { cnpj: data.cnpj }),
          telefone: data.telefone,
          codigo_pais: '+55',
          documento_identidade: data.documento_identidade,
          documento_residencia: data.documento_residencia,
          percent_repasse: 80,
          percent_repasse_banking: 80,
          tipo_acesso: 'BANKING',
          tipo: 'AP',
          id_partner: 10,
        }),
      }),
      fetch('https://graph.facebook.com/v25.0/835788782947993/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer EAAX5fPZArohoBPvKlDoDS44p2JZBWgMjpkomB4ZBin1mcixDJGCpcqveA5uCl3jBZCrLOcaRIpiKAFQgqkYsghZCVPy2lVQZBnkJSEnUhysCR8QQENxb7FZC6mj5HZAshLAqjpXzAuN0Q3kg2ktY76vrneKNR9ZBcZBNWl1dlkz50n3nU7PysycpxHc0fEpt3sLQZDZD',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: telefoneIntl,
          type: 'template',
          template: {
            name: 'boas_vindas_parceiro_anova',
            language: { code: 'pt_BR' },
          },
        }),
      }),
    ]).catch(() => {});

    pushTo('anova', { kind: 'userBubble', text: `▸ Cadastro enviado · ${data.nome_partner}`, time: nowTime() });
    advance(400);
  };

  const onIdentitySubmit = (data) => {
    setShowIdentity(false);
    pushTo('anova', { kind: 'userBubble', text: `▸ Identidade confirmada`, time: nowTime() });
    advance(400);
  };

  const handleChoice = (id, label) => {
    if (!waitingGate || waitingGate.type !== 'choice') return;
    const expected = waitingGate.expected;
    const ok = Array.isArray(expected) ? expected.includes(id) : id === expected;
    if (!ok) { setHintPulse(p => p + 1); return; }
    pushTo(activeChat, { kind: 'userBubble', text: label || id, time: nowTime() });
    advance(450);
  };

  const handleTyped = (text) => {
    if (!waitingGate || waitingGate.type !== 'typed') return;
    if (text.toLowerCase() !== waitingGate.expected.toLowerCase()) {
      pushTo(activeChat, { kind: 'userBubble', text, time: nowTime() });
      setHintPulse(p => p + 1);
      return;
    }
    pushTo(activeChat, { kind: 'userBubble', text, time: nowTime() });
    advance(500);
  };

  const restart = (opts = {}) => {
    clearTimers();
    sceneTokenRef.current++;
    setSceneIdx(0);
    setStreams({ anova: [], group: [] });
    setView('chat');
    setActiveChat('anova');
    setGroupExists(false);
    setWaitingGate(null);
    setShowSignup(false);
    setShowIdentity(false);
    if (opts.skipExplanations !== undefined) setHideExplanations(opts.skipExplanations);
  };

  // ── Header derived from activeChat ──
  const inputActive = waitingGate && waitingGate.type === 'typed' && view === 'chat';
  const inputExpected = inputActive ? waitingGate.expected : null;
  // Hint only when chat view shows the chat the gate belongs to
  const gateChatExpected = scenes[sceneIdx]?.chat;
  const showHint = waitingGate && waitingGate.hint && view === 'chat' && activeChat === gateChatExpected && !showSignup && !showIdentity;
  const hintText = showHint ? waitingGate.hint : null;

  // Last preview lines for chat list
  const lastPreview = (chat) => {
    const arr = streams[chat];
    for (let i = arr.length - 1; i >= 0; i--) {
      const s = arr[i];
      if (s.kind === 'bubble' || s.kind === 'explain') {
        const txt = (s.content?.lines || []).filter(l => l.trim()).slice(-1)[0] || 'Mensagem';
        return { text: txt.replace(/\*/g, '').slice(0, 50), fromMe: false };
      }
      if (s.kind === 'userBubble') return { text: s.text.replace(/^▸\s*/, ''), fromMe: true };
      if (s.kind === 'media' || s.kind === 'explainMedia') return { text: '📷 Foto', fromMe: false };
    }
    return { text: chat === 'anova' ? 'Bem-vindo à Anova' : 'Grupo criado', fromMe: false };
  };

  // Pending CTAs: actions from the *current* scene's items still in the active stream.
  // (When a scene advances, its actions are no longer pending.)
  // Special case: the final scene stays pending forever, so its actions remain visible.
  const isFinal = sceneIdx >= scenes.length - 1;
  const visibleSceneIdx = sceneIdx;
  const pendingActions = (streams[activeChat] || []).reduce((acc, item, idx) => {
    const a = item?.content?.action;
    if (!a) return acc;
    // Only include actions from the current scene (or any scene if we're past the end / on final).
    if (item._sceneIdx !== visibleSceneIdx && !isFinal) return acc;
    acc.push({ ...a, _id: `${activeChat}-${item.msgId || idx}-${a.label}` });
    return acc;
  }, []);

  const chats = [
    {
      id: 'group',
      kind: 'group',
      name: `Anova · Seguro · ${clientName}`,
      ...lastPreview('group'),
      preview: lastPreview('group').text,
      time: 'agora',
      unread: activeChat !== 'group' && groupExists ? 2 : 0,
      isNew: groupExists && activeChat !== 'group',
    },
    {
      id: 'anova',
      kind: 'single',
      name: 'Anova',
      ...lastPreview('anova'),
      preview: lastPreview('anova').text,
      time: '10:43',
      unread: 0,
    },
  ].filter(c => c.id === 'anova' || groupExists);

  const onBack = groupExists ? () => setView('list') : null;

  const header = activeChat === 'group'
    ? <ChatHeader
        name={`Anova · Seguro · ${clientName}`}
        members={`Você, ${clientName}, Especialista`}
        avatars={3}
        onBack={onBack}
      />
    : <ChatHeader name="Anova" subtitle="online" avatars={1} onBack={onBack} />;

  // Mobile-first: chat fills viewport. On desktop, wrapped in a phone shell via CSS.
  return (
    <div className="stage">
      <div className="device-shell">
       <div className="device-screen">
        <div style={{
          flex: 1, minHeight: 0,
          display: 'flex', flexDirection: 'column',
          background: '#EFE7DE',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 480,
          width: '100%',
          margin: '0 auto',
          boxShadow: '0 0 40px rgba(0,0,0,.04)',
        }}>
        {/* Mobile status bar — minimal, iOS-style on header bg */}
        <MobileStatusBar />
        {view === 'list' ? (
          <ChatListView
            chats={chats}
            activeId={activeChat}
            onPick={(id) => { setActiveChat(id); setView('chat'); }}
          />
        ) : (
          <>
            {header}
            <ChatStream
              items={streams[activeChat]}
              onCTA={onBubbleCTA}
              onChoice={handleChoice}
              userName={signupName || userName}
            />
            <HintPill key={hintPulse} text={hintText} />
            <InteractiveInput
              active={inputActive}
              expected={inputExpected}
              onSubmit={handleTyped}
            />
          </>
        )}

        <SignupModal
          open={showSignup}
          defaultName=""
          onSubmit={onSignupSubmit}
          onClose={() => setShowSignup(false)}
        />

        <IdentityModal
          open={showIdentity}
          onSubmit={onIdentitySubmit}
          onClose={() => setShowIdentity(false)}
        />
      </div>
       </div>
      </div>

      <button className="reset-btn" onClick={restart}>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Reiniciar
      </button>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Personagens">
          <TweakText label="Originador" value={userName} onChange={(v) => setTweak('userName', v || 'Rafael')} />
          <TweakText label="Cliente" value={clientName} onChange={(v) => setTweak('clientName', v || 'João Marcelo')} />
        </TweakSection>
        <TweakSection label="Reprodução">
          <TweakSlider label="Velocidade" min={0.5} max={3} step={0.1} value={speed} unit="×" onChange={(v) => setTweak('speed', v)} />
        </TweakSection>
        <TweakSection label="Ações">
          <TweakButton label="Reiniciar do início" onClick={restart} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Mobile status bar — time + signal/wifi/battery, sits inside the chat container
function MobileStatusBar() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`);
    }, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 44,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px',
      fontFamily: '-apple-system, system-ui',
      color: '#111B21',
      fontSize: 15, fontWeight: 600,
      letterSpacing: -.2,
      pointerEvents: 'none',
      zIndex: 20,
    }}>
      <span>{time}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#111B21">
          <rect x="0" y="7" width="3" height="4" rx="1"/>
          <rect x="4.5" y="5" width="3" height="6" rx="1"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="1"/>
          <rect x="13.5" y="0" width="3" height="11" rx="1"/>
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="#111B21">
          <path d="M8 11l-2-2.5a3 3 0 014 0L8 11z"/>
          <path d="M2.5 5.5a8 8 0 0111 0l-1.4 1.4a6 6 0 00-8.2 0L2.5 5.5z" opacity=".7"/>
          <path d="M0 3a11.5 11.5 0 0116 0l-1.4 1.4a9.5 9.5 0 00-13.2 0L0 3z" opacity=".4"/>
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="#111B21" strokeOpacity=".4"/>
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="#111B21"/>
          <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="#111B21" fillOpacity=".4"/>
        </svg>
      </span>
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('app-keyframes')) {
  const s = document.createElement('style');
  s.id = 'app-keyframes';
  s.textContent = `
    @keyframes hintIn {
      from { opacity: 0; transform: translateY(8px) scale(.92); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes floatCTAIn {
      from { opacity: 0; transform: translateY(14px) scale(.94); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(s);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

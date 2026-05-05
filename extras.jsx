// extras.jsx — Explanatory bubble (glass) + product carousel for menu

const { useState: useStateEX } = React;

// Explanatory message — glass card, distinct color, "EXPLICAÇÃO" tag
function ExplainBubble({ children, time = '', action, onAction }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start',
      padding: '4px 8px',
      animation: 'bubbleIn 260ms cubic-bezier(.34,1.56,.64,1) both',
    }}>
      <div style={{
        maxWidth: '84%',
        background: 'linear-gradient(160deg, rgba(245,232,210,.72) 0%, rgba(232,213,180,.62) 100%)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border: '1px solid rgba(180,140,80,.28)',
        borderRadius: 14,
        padding: '10px 12px 10px',
        boxShadow: '0 2px 10px rgba(120,80,20,.10), inset 0 1px 0 rgba(255,255,255,.5)',
        position: 'relative',
        fontFamily: '-apple-system, system-ui',
        fontSize: 14,
        lineHeight: 1.45,
        color: '#3a2a10',
      }}>
        {/* tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '2px 8px',
          marginBottom: 6,
          background: 'rgba(120,80,20,.14)',
          border: '0.5px solid rgba(120,80,20,.22)',
          borderRadius: 999,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          letterSpacing: .14,
          textTransform: 'uppercase',
          color: '#8a5a14',
          fontWeight: 600,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" stroke="#8a5a14" strokeWidth="1.6"/>
            <path d="M12 8v5M12 16v.5" stroke="#8a5a14" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span>Explicação</span>
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {typeof children === 'string' ? <WAText text={children}/> : children}
        </div>
        {action && (
          (action.href ? (
            <a href={action.href} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: 'calc(100% + 24px)',
              margin: '10px -12px -10px',
              padding: '10px 12px',
              background: 'transparent',
              border: 'none',
              borderTop: '1px solid rgba(120,80,20,.22)',
              color: '#8a5a14',
              fontSize: 14, fontWeight: 600,
              fontFamily: '-apple-system, system-ui',
              cursor: 'pointer',
              letterSpacing: -.1,
              textDecoration: 'none',
            }}>
              {action.icon && <span>{action.icon}</span>}
              <span>{action.label}</span>
            </a>
          ) : (
            <button onClick={() => onAction && onAction('cta', action)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: 'calc(100% + 24px)',
              margin: '10px -12px -10px',
              padding: '10px 12px',
              background: 'transparent',
              border: 'none',
              borderTop: '1px solid rgba(120,80,20,.22)',
              color: '#8a5a14',
              fontSize: 14, fontWeight: 600,
              fontFamily: '-apple-system, system-ui',
              cursor: 'pointer',
              letterSpacing: -.1,
            }}>
              {action.icon && <span>{action.icon}</span>}
              <span>{action.label}</span>
            </button>
          ))
        )}
        {time && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end',
            fontSize: 10.5, color: '#8a5a14',
            marginTop: 4, opacity: .7,
            fontFamily: '-apple-system, system-ui',
          }}>{time}</div>
        )}
      </div>
    </div>
  );
}

// Product carousel — image card with title and CTA, scrolls horizontally
const PRODUCTS = [
  {
    k: 'protecao', label: 'Proteção/Benefício',
    desc: 'Proteção financeira e seguros para você e sua família.',
    art: 'heart',
  },
  {
    k: 'credito', label: 'Crédito Pessoal',
    desc: 'Crédito rápido alinhado ao seu momento.',
    art: 'coins',
  },
  {
    k: 'imobiliario', label: 'Imobiliário',
    desc: 'Soluções para financiamento imobiliário.',
    art: 'blocks',
  },
  {
    k: 'veiculos', label: 'Veículos',
    desc: 'Financiamento para veículos.',
    art: 'car',
  },
  {
    k: 'consorcio', label: 'Consórcio',
    desc: 'Consórcio para planejamento de conquistas de médio e longo prazo.',
    art: 'stack',
  },
  {
    k: 'humano', label: 'Falar com Humano',
    desc: 'Suporte direto dos especialistas do nosso time.',
    art: 'human',
  },
];

function ProductArt({ kind }) {
  // Stylized monochrome placeholders inspired by the references
  const common = {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff',
  };
  if (kind === 'heart') return (
    <div style={{ ...common, background: 'linear-gradient(180deg,#f5f5f5,#dcdcdc)' }}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M32 54 C8 38 12 18 24 18 c4 0 7 2 8 5 c1 -3 4 -5 8 -5 c12 0 16 20 -8 36 z"
              fill="#fff" stroke="#bdbdbd" strokeWidth="1"/>
        <path d="M32 28 v8 M28 32 h8" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
  if (kind === 'coins') return (
    <div style={{ ...common, background: 'linear-gradient(180deg,#1a1a1a,#0a0a0a)' }}>
      <svg width="84" height="60" viewBox="0 0 84 60" fill="none">
        <ellipse cx="20" cy="50" rx="10" ry="2.6" fill="#d8d8d8"/>
        <rect x="10" y="34" width="20" height="16" fill="#e8e8e8"/>
        <ellipse cx="20" cy="34" rx="10" ry="2.6" fill="#fff"/>
        <ellipse cx="42" cy="50" rx="12" ry="3" fill="#d8d8d8"/>
        <rect x="30" y="22" width="24" height="28" fill="#ececec"/>
        <ellipse cx="42" cy="22" rx="12" ry="3" fill="#fff"/>
        <ellipse cx="64" cy="50" rx="10" ry="2.6" fill="#d8d8d8"/>
        <rect x="54" y="38" width="20" height="12" fill="#e2e2e2"/>
        <ellipse cx="64" cy="38" rx="10" ry="2.6" fill="#fff"/>
      </svg>
    </div>
  );
  if (kind === 'blocks') return (
    <div style={{ ...common, background: 'linear-gradient(180deg,#e8e6e2,#cfccc6)' }}>
      <svg width="90" height="62" viewBox="0 0 90 62" fill="none">
        <rect x="6" y="34" width="22" height="22" fill="#d8d4cd" stroke="#b6b1a8"/>
        <rect x="28" y="22" width="20" height="34" fill="#e6e3dc" stroke="#b6b1a8"/>
        <rect x="48" y="14" width="18" height="42" fill="#cfcbc2" stroke="#a8a399"/>
        <rect x="66" y="30" width="18" height="26" fill="#dad6cd" stroke="#b6b1a8"/>
      </svg>
    </div>
  );
  if (kind === 'car') return (
    <div style={{ ...common, background: 'linear-gradient(180deg,#2a2a2a,#0f0f0f)' }}>
      <svg width="90" height="46" viewBox="0 0 90 46" fill="none">
        <path d="M8 32 L20 18 Q26 12 38 12 H58 Q68 12 74 20 L82 32 Q84 34 82 36 H10 Q6 36 8 32 Z"
              fill="#1a1a1a" stroke="#444" strokeWidth=".6"/>
        <path d="M22 22 L28 16 H40 V22 Z M44 22 V16 H58 L64 22 Z" fill="#3a3a3a"/>
        <circle cx="24" cy="36" r="5" fill="#0a0a0a" stroke="#666"/>
        <circle cx="66" cy="36" r="5" fill="#0a0a0a" stroke="#666"/>
      </svg>
    </div>
  );
  if (kind === 'stack') return (
    <div style={{ ...common, background: 'linear-gradient(180deg,#1c1c1c,#0a0a0a)' }}>
      <svg width="60" height="76" viewBox="0 0 60 76" fill="none">
        <ellipse cx="30" cy="68" rx="20" ry="3" fill="#000" opacity=".5"/>
        <rect x="14" y="50" width="32" height="14" fill="#bdbdbd"/>
        <rect x="18" y="36" width="24" height="14" fill="#9a9a9a"/>
        <rect x="22" y="22" width="16" height="14" fill="#7d7d7d"/>
        <rect x="26" y="10" width="8" height="12" fill="#5a5a5a"/>
      </svg>
    </div>
  );
  if (kind === 'human') return (
    <div style={{
      ...common,
      background: 'linear-gradient(135deg,#1a3850 0%,#2a5575 60%,#4a85a8 100%)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 6, left: 8,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 8, color: '#fff',
        letterSpacing: .14, textTransform: 'uppercase',
        opacity: .75,
      }}>*Falar com Humano</div>
      <svg width="80" height="62" viewBox="0 0 80 62" fill="none">
        <circle cx="40" cy="22" r="11" fill="#e8c4a8"/>
        <path d="M40 14 q-7 0 -8 6 q-1 3 1 6 q2 -3 7 -3 q5 0 7 3 q2 -3 1 -6 q-1 -6 -8 -6 z" fill="#3a2a1a"/>
        <path d="M20 60 Q20 38 40 38 Q60 38 60 60 Z" fill="#2a4a60"/>
        <path d="M34 38 q6 4 12 0 l-2 6 q-4 2 -8 0 z" fill="#fff"/>
      </svg>
    </div>
  );
  return null;
}

function ProductCard({ product, onPick }) {
  return (
    <div style={{
      flex: '0 0 168px',
      background: '#fff',
      borderRadius: 6,
      overflow: 'hidden',
      boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
      display: 'flex', flexDirection: 'column',
      scrollSnapAlign: 'start',
    }}>
      <div style={{ width: '100%', height: 110, overflow: 'hidden' }}>
        <ProductArt kind={product.art} />
      </div>
      <div style={{
        padding: '8px 10px 6px',
        fontSize: 12.5,
        lineHeight: 1.35,
        color: '#111B21',
        fontFamily: '-apple-system, system-ui',
        minHeight: 50,
      }}>{product.desc}</div>
      <button
        onClick={() => onPick && onPick(product)}
        style={{
          margin: '0',
          padding: '10px 10px',
          background: 'transparent',
          border: 'none',
          borderTop: '0.5px solid rgba(17,27,33,.10)',
          color: '#008069',
          fontSize: 13.5,
          fontWeight: 600,
          fontFamily: '-apple-system, system-ui',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
        <span style={{ fontSize: 14 }}>↩</span>
        <span>{product.label}</span>
      </button>
    </div>
  );
}

function CommissionCarousel({ onPick }) {
  const totals = [
    ['Proteção e Benefícios', 'R$ 4.820'],
    ['Crédito Pessoal', 'R$ 2.150'],
    ['Imobiliário', 'R$ 7.300'],
    ['Consórcio', 'R$ 1.640'],
    ['Veículos', 'R$ 3.420'],
  ];
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start',
      padding: '2px 8px',
      animation: 'bubbleIn 280ms cubic-bezier(.34,1.56,.64,1) both',
    }}>
      <div style={{
        maxWidth: '92%',
        background: '#FFFFFF',
        borderRadius: 12, borderTopLeftRadius: 2,
        padding: '10px 10px 6px',
        boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
        position: 'relative',
        fontFamily: '-apple-system, system-ui',
        color: '#111B21',
        width: '100%',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: -7,
          width: 0, height: 0, borderStyle: 'solid',
          borderWidth: '0 10px 10px 0',
          borderColor: 'transparent #fff transparent transparent',
        }} />
        <div style={{
          fontSize: 15, fontWeight: 700, letterSpacing: -.1,
          marginBottom: 2,
        }}>Painel de comissões</div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9.5, color: '#54656F',
          letterSpacing: .12, textTransform: 'uppercase',
          marginBottom: 8,
        }}>Comissões por produto</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
          {totals.map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, lineHeight: 1.3,
            }}>
              <span style={{ color: '#54656F' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#111B21', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '7px 10px',
          background: '#F0F2F5',
          borderRadius: 6,
          fontSize: 12,
          marginBottom: 12,
        }}>
          <span style={{ color: '#54656F' }}>Mês anterior</span>
          <span style={{ fontWeight: 600, color: '#111B21', fontVariantNumeric: 'tabular-nums' }}>R$ 16.840</span>
        </div>

        <div style={{
          fontSize: 13, fontWeight: 600,
          marginBottom: 8,
          color: '#111B21',
        }}>Escolha um produto para iniciar:</div>

        {/* Carousel */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          margin: '0 -10px',
          padding: '2px 10px 8px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
        }}>
          {PRODUCTS.map(p => (
            <ProductCard key={p.k} product={p} onPick={onPick} />
          ))}
        </div>

        <div style={{
          textAlign: 'right',
          fontSize: 10.5, color: '#667781',
          marginTop: 2,
          fontFamily: '-apple-system, system-ui',
        }}>10:32</div>
      </div>
    </div>
  );
}

// Explanatory media — same glass styling, but for image/screenshot content
function ExplainMedia({ children, time = '', caption }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start',
      padding: '4px 8px',
      animation: 'bubbleIn 280ms cubic-bezier(.34,1.56,.64,1) both',
    }}>
      <div style={{
        maxWidth: '84%',
        background: 'linear-gradient(160deg, rgba(245,232,210,.72) 0%, rgba(232,213,180,.62) 100%)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border: '1px solid rgba(180,140,80,.28)',
        borderRadius: 14,
        padding: '10px',
        boxShadow: '0 2px 10px rgba(120,80,20,.10), inset 0 1px 0 rgba(255,255,255,.5)',
        position: 'relative',
      }}>
        {/* tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '2px 8px',
          marginBottom: 8,
          background: 'rgba(120,80,20,.14)',
          border: '0.5px solid rgba(120,80,20,.22)',
          borderRadius: 999,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          letterSpacing: .14,
          textTransform: 'uppercase',
          color: '#8a5a14',
          fontWeight: 600,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" stroke="#8a5a14" strokeWidth="1.6"/>
            <path d="M12 8v5M12 16v.5" stroke="#8a5a14" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span>Explicação</span>
        </div>
        <div style={{
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid rgba(120,80,20,.18)',
        }}>{children}</div>
        {caption && (
          <div style={{
            padding: '6px 2px 0',
            fontSize: 13,
            fontFamily: '-apple-system, system-ui',
            color: '#3a2a10',
            lineHeight: 1.4,
          }}><WAText text={caption}/></div>
        )}
        {time && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end',
            fontSize: 10.5, color: '#8a5a14',
            marginTop: 4, opacity: .7,
            fontFamily: '-apple-system, system-ui',
          }}>{time}</div>
        )}
      </div>
    </div>
  );
}

// Explanatory system notice — pill-shaped glass with tag
function ExplainSystem({ children }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      padding: '8px 12px',
      animation: 'bubbleIn 220ms ease both',
    }}>
      <div style={{
        background: 'linear-gradient(160deg, rgba(245,232,210,.78) 0%, rgba(232,213,180,.66) 100%)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border: '1px solid rgba(180,140,80,.28)',
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 12.5,
        color: '#3a2a10',
        fontFamily: '-apple-system, system-ui',
        fontWeight: 500,
        textAlign: 'center',
        maxWidth: '85%',
        lineHeight: 1.45,
        boxShadow: '0 1px 6px rgba(120,80,20,.10)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          padding: '1px 6px',
          background: 'rgba(120,80,20,.14)',
          border: '0.5px solid rgba(120,80,20,.22)',
          borderRadius: 999,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 8.5,
          letterSpacing: .14,
          textTransform: 'uppercase',
          color: '#8a5a14',
          fontWeight: 600,
        }}>Explicação</span>
        <span>{children}</span>
      </div>
    </div>
  );
}

Object.assign(window, { ExplainBubble, ExplainMedia, ExplainSystem, CommissionCarousel });

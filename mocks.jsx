// mocks.jsx — MSG 6 mocks (form received + filled form)
// Styled in ANOVA blueprint — mono labels, hairlines, flat cards.

// Screenshot of what the client received on WhatsApp
function ClientReceivedMock() {
  return (
    <div style={{
      width: '100%',
      aspectRatio: '9/16',
      background: '#E5DDD5',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      overflow: 'hidden',
    }}>
      {/* mini WA header */}
      <div style={{
        background: '#075E54', color: '#fff',
        padding: '8px 10px 6px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{
          width: 22, height: 22, borderRadius: '22%',
          background: '#0A0A0A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 5.5, fontWeight: 700, letterSpacing: -.02,
        }}>ANOVA</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600 }}>Anova · Orquestrador</div>
          <div style={{ fontSize: 8, opacity: .8 }}>online</div>
        </div>
      </div>
      {/* message */}
      <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          alignSelf: 'flex-start', maxWidth: '85%',
          background: '#fff',
          borderRadius: 6, borderTopLeftRadius: 0,
          padding: '6px 8px 6px',
          fontSize: 9, lineHeight: 1.4,
          color: '#111B21',
          boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: -4,
            width: 0, height: 0, borderStyle: 'solid',
            borderWidth: '0 4px 4px 0',
            borderColor: 'transparent #fff transparent transparent',
          }} />
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Olá, João. 👋</div>
          <div>Sou o orquestrador da Anova. Seu consultor Rafael Souza está iniciando uma cotação de Seguro de Vida com você.</div>
          <div style={{ marginTop: 4 }}>Preencha o formulário abaixo em 2 minutos:</div>
          <div style={{
            marginTop: 5, padding: '5px 6px',
            border: '1px solid rgba(0,0,0,.08)',
            borderRadius: 4,
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(2,126,181,.06)',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="#027EB5" strokeWidth="2"/>
              <path d="M8 8h8M8 12h8M8 16h5" stroke="#027EB5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ color: '#027EB5', fontSize: 8, fontWeight: 500 }}>Formulário · Seguro de Vida</span>
          </div>
          <div style={{ textAlign: 'right', fontSize: 6.5, color: '#667781', marginTop: 2 }}>10:34 ✓✓</div>
        </div>
        {/* client reply */}
        <div style={{
          alignSelf: 'flex-end', maxWidth: '72%',
          background: '#DCF8C6',
          borderRadius: 6, borderTopRightRadius: 0,
          padding: '5px 7px',
          fontSize: 9, lineHeight: 1.4,
          color: '#111B21',
          boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
          marginTop: 2,
        }}>
          Beleza, vou preencher agora
          <div style={{ textAlign: 'right', fontSize: 6.5, color: '#667781', marginTop: 1 }}>10:35 ✓✓</div>
        </div>
      </div>

      {/* overlay corner marker (blueprint style) */}
      <div style={{
        position: 'absolute', top: 4, right: 4,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 6,
        color: 'rgba(10,10,10,.5)',
        letterSpacing: .08,
        textTransform: 'uppercase',
        background: 'rgba(255,255,255,.7)',
        padding: '1px 4px',
        borderRadius: 2,
      }}>PRINT · 01</div>
    </div>
  );
}

// Screenshot of the filled form the client submitted
function FilledFormMock() {
  return (
    <div style={{
      width: '100%',
      aspectRatio: '9/16',
      background: '#F4F4F4',
      padding: '10px 10px 8px',
      boxSizing: 'border-box',
      fontFamily: 'DM Sans, system-ui',
      position: 'relative',
      color: '#0A0A0A',
      overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        paddingBottom: 6,
        borderBottom: '1px solid rgba(0,0,0,.08)',
        marginBottom: 8,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: '22%',
          background: '#0A0A0A', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 4, fontWeight: 700, letterSpacing: -.02,
        }}>ANOVA</div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 6.5,
          color: '#767676',
          letterSpacing: .08,
          textTransform: 'uppercase',
        }}>FORM · SEGURO DE VIDA</div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 6,
          color: '#fff',
          background: '#0A0A0A',
          padding: '1px 4px',
          borderRadius: 2,
        }}>CONCLUÍDO</div>
      </div>

      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: -.02,
        marginBottom: 8, lineHeight: 1.1,
      }}>Dados do titular</div>

      {[
        ['NOME COMPLETO', 'João Marcelo Silva'],
        ['CPF', '123.456.789-00'],
        ['DATA DE NASC.', '14/03/1982'],
        ['E-MAIL', 'joao.silva@email.com'],
        ['TELEFONE', '(11) 98765-4321'],
      ].map(([label, value], i) => (
        <div key={i} style={{
          marginBottom: 6,
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 5.5,
            color: '#767676',
            letterSpacing: .1,
            textTransform: 'uppercase',
            marginBottom: 1,
          }}>{label}</div>
          <div style={{
            fontSize: 8.5,
            padding: '3px 5px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,.08)',
            borderRadius: 3,
            color: '#0A0A0A',
          }}>{value}</div>
        </div>
      ))}

      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: -.02,
        marginTop: 8, marginBottom: 6, lineHeight: 1.1,
      }}>Cobertura desejada</div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {['R$ 250k', 'R$ 500k', 'R$ 1M'].map((v, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            padding: '3px 2px',
            fontSize: 7.5, fontWeight: i === 1 ? 600 : 400,
            background: i === 1 ? '#0A0A0A' : '#fff',
            color: i === 1 ? '#fff' : '#0A0A0A',
            border: '1px solid rgba(0,0,0,.08)',
            borderRadius: 3,
          }}>{v}</div>
        ))}
      </div>

      {/* footer */}
      <div style={{
        position: 'absolute', bottom: 6, left: 10, right: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 5,
        borderTop: '1px solid rgba(0,0,0,.08)',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 5.5, color: '#767676',
          letterSpacing: .1, textTransform: 'uppercase',
        }}>ENVIADO 10:41</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 5.5, color: '#0A0A0A', fontWeight: 600,
            letterSpacing: .1, textTransform: 'uppercase',
          }}>RECEBIDO</span>
        </div>
      </div>

      {/* corner tag */}
      <div style={{
        position: 'absolute', top: 4, right: 4,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 6, color: 'rgba(10,10,10,.5)',
        letterSpacing: .08, textTransform: 'uppercase',
        background: 'rgba(255,255,255,.7)',
        padding: '1px 4px', borderRadius: 2,
      }}>PRINT · 02</div>
    </div>
  );
}

// Menu of products mock (used in MSG 4)
function ProductMenuMock({ onPick }) {
  const products = [
    { k: 'vida', label: 'Seguro de Vida', icon: '🛡', accent: true },
    { k: 'credito', label: 'Crédito', icon: '💳' },
    { k: 'invest', label: 'Investimentos', icon: '📈' },
  ];
  return (
    <div style={{
      padding: '8px 8px',
      display: 'flex', flexDirection: 'column', gap: 4,
      width: '100%',
      animation: 'bubbleIn 260ms ease both',
    }}>
      {products.map(p => (
        <button key={p.k} onClick={() => onPick && onPick(p)} style={{
          padding: '10px 14px',
          background: '#fff',
          border: 'none',
          borderRadius: 8,
          boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
          color: '#027EB5',
          fontSize: 14, fontWeight: 500,
          fontFamily: '-apple-system, system-ui',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8,
          maxWidth: '78%',
          minWidth: 200,
          alignSelf: 'flex-start',
        }}>
          <span style={{ fontSize: 16 }}>{p.icon}</span>
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { ClientReceivedMock, FilledFormMock, ProductMenuMock });

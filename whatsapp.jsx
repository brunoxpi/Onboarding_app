// whatsapp.jsx — WhatsApp chat UI (header, messages, bubbles, input)
// All sizing tuned to the iPhone frame (402px wide).

// Modern WhatsApp on iOS palette (2024+)
const WA = {
  bg: '#EFE7DE',                    // warmer wallpaper base
  bgPattern: '#D9D3CA',
  headerBg: '#FFFFFF',              // iOS-style: white header (light mode)
  headerText: '#111B21',
  bubbleIn: '#FFFFFF',
  bubbleOut: '#D9FDD3',             // refreshed light green (modern WA)
  bubbleShadow: '0 1px 0.5px rgba(11,20,26,.13)',
  textDark: '#111B21',
  textMeta: '#667781',
  link: '#027EB5',
  accent: '#008069',                // modern WA teal-green (CTAs, send)
  accentLight: '#1DAA61',
  inputBg: '#F0F2F5',
  divider: 'rgba(17,27,33,.08)',
  hairline: 'rgba(17,27,33,.10)',
};

// Modern WhatsApp wallpaper — soft cream with subtle geometric doodles
const WA_BG_URL = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'>
    <rect width='180' height='180' fill='#EFE7DE'/>
    <g opacity='.07' fill='none' stroke='#0A0A0A' stroke-width='.7' stroke-linecap='round'>
      <path d='M20 30 q8 -10 16 0 t16 0'/>
      <circle cx='100' cy='40' r='6'/>
      <path d='M140 25 l8 8 m0 -8 l-8 8'/>
      <path d='M30 90 q10 -8 20 0'/>
      <circle cx='80' cy='110' r='4'/>
      <path d='M120 95 l6 -6 l6 6 l-6 6 z'/>
      <path d='M150 130 q-8 8 0 16'/>
      <circle cx='40' cy='150' r='5'/>
      <path d='M90 160 l4 -8 l4 8'/>
      <path d='M130 150 q6 -6 12 0'/>
    </g>
  </svg>`
);

// ─────────────────────────────────────────────────────────────
// Chat header — name, avatar, back, actions
// ─────────────────────────────────────────────────────────────
function ChatHeader({ name = 'Anova', subtitle = 'online', avatars = 1, members, onBack, online = true }) {
  const stroke = '#008069';
  return (
    <div style={{
      background: WA.headerBg,
      color: WA.headerText,
      paddingTop: 54,
      paddingLeft: 4,
      paddingRight: 8,
      paddingBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
      borderBottom: `0.5px solid ${WA.hairline}`,
      backdropFilter: 'saturate(180%) blur(8px)',
    }}>
      {/* back arrow (iOS chevron + small unread count) */}
      <button onClick={onBack} style={{
        background: 'transparent', border: 'none', color: stroke,
        height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: onBack ? 'pointer' : 'default', padding: '0 4px 0 8px',
        gap: 2,
      }}>
        <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
          <path d="M10 2L2 11l8 9" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* avatar(s) — wrapped with online dot for 1:1 */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {avatars === 1 ? <AnovaAvatar size={38} /> : <GroupAvatarStack size={38} />}
        {avatars === 1 && online && (
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 11, height: 11, borderRadius: '50%',
            background: WA.accent,
            border: '2px solid #fff',
          }}/>
        )}
      </div>
      {/* name + status */}
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 8 }}>
        <div style={{
          fontFamily: '-apple-system, system-ui',
          fontSize: 16, fontWeight: 600,
          color: WA.textDark,
          letterSpacing: -.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
          {avatars === 1 && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#1DAA61" style={{ flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#1DAA61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M9 11l3 3L22 4" stroke="#1DAA61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          )}
        </div>
        <div style={{
          fontSize: 12, color: WA.textMeta,
          fontFamily: '-apple-system, system-ui',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginTop: 1,
        }}>{members ? members : subtitle}</div>
      </div>
      {/* icons (iOS-style: video, call, ellipsis) */}
      <button style={iconBtn} title="Vídeo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="14" height="12" rx="3" stroke={stroke} strokeWidth="1.8"/>
          <path d="M16 10l5-3v10l-5-3" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>
      <button style={iconBtn} title="Chamada">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0122 16.92z" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

const iconBtn = {
  background: 'transparent', border: 'none',
  width: 36, height: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', padding: 0,
  borderRadius: 8,
  transition: 'background 120ms ease',
};

// ANOVA monogram avatar — circular (matches WA chat avatars), bold A mark
function AnovaAvatar({ size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 25%, #2a2a2a 0%, #0A0A0A 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff',
      fontFamily: 'DM Sans, system-ui',
      fontWeight: 800,
      fontSize: size * 0.46,
      letterSpacing: -.04,
      flexShrink: 0,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06)',
      lineHeight: 1,
    }}>A</div>
  );
}

// Client avatar (initials)
function ClientAvatar({ size = 40, name = 'JM', tone = '#767676' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: tone,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff',
      fontFamily: '-apple-system, system-ui',
      fontWeight: 600,
      fontSize: size * 0.38,
      flexShrink: 0,
    }}>{name}</div>
  );
}

// Group avatar — clean WA-style: large back avatar + small front avatar overlap
function GroupAvatarStack({ size = 40 }) {
  const back = size * 0.78;
  const front = size * 0.58;
  return (
    <div style={{
      width: size, height: size, position: 'relative', flexShrink: 0,
    }}>
      {/* back: client */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: back, height: back, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6B7E8C 0%, #4A5965 100%)',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '-apple-system, system-ui',
        fontWeight: 600, fontSize: back * 0.4,
        boxShadow: '0 1px 2px rgba(0,0,0,.12)',
      }}>JM</div>
      {/* front: anova */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: front, height: front, borderRadius: '50%',
        background: '#0A0A0A',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'DM Sans, system-ui',
        fontWeight: 800, fontSize: front * 0.5,
        letterSpacing: -.04,
        border: '2px solid #fff',
        boxShadow: '0 1px 2px rgba(0,0,0,.18)',
      }}>A</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Message bubble
// ─────────────────────────────────────────────────────────────
function Bubble({ from = 'in', children, time = '10:32', showTail = true, showStatus = false }) {
  const isOut = from === 'out';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isOut ? 'flex-end' : 'flex-start',
      padding: '1.5px 8px',
      animation: 'bubbleIn 240ms cubic-bezier(.34,1.56,.64,1) both',
    }}>
      <div style={{
        maxWidth: '78%',
        background: isOut ? WA.bubbleOut : WA.bubbleIn,
        borderRadius: 12,
        borderTopLeftRadius: !isOut && showTail ? 2 : 12,
        borderTopRightRadius: isOut && showTail ? 2 : 12,
        padding: '6px 10px 8px',
        boxShadow: WA.bubbleShadow,
        position: 'relative',
        fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif',
        fontSize: 14.5,
        lineHeight: 1.42,
        color: WA.textDark,
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }}>
        {/* tail */}
        {showTail && (
          <div style={{
            position: 'absolute',
            top: 0,
            [isOut ? 'right' : 'left']: -7,
            width: 0, height: 0,
            borderStyle: 'solid',
            borderWidth: isOut ? '0 0 10px 10px' : '0 10px 10px 0',
            borderColor: isOut
              ? `transparent transparent transparent ${WA.bubbleOut}`
              : `transparent ${WA.bubbleIn} transparent transparent`,
            filter: 'drop-shadow(0 0.5px 0 rgba(11,20,26,.06))',
          }} />
        )}
        <div>{children}</div>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 3,
          marginTop: 3,
          fontSize: 10.5,
          color: WA.textMeta,
          lineHeight: 1,
          fontFamily: '-apple-system, system-ui',
        }}>
          <span>{time}</span>
          {isOut && showStatus && (
            <svg width="15" height="10" viewBox="0 0 16 11" fill="none" style={{ marginLeft: 2 }}>
              <path d="M11.07.348a.5.5 0 01.086.686l-6 8a.5.5 0 01-.696.1l-4-3a.5.5 0 01.6-.8l3.6 2.7 5.614-7.514a.5.5 0 01.786-.172z" fill="#53BDEB"/>
              <path d="M15.07.348a.5.5 0 01.086.686l-6 8a.5.5 0 01-.696.1l-1-.75a.5.5 0 01.6-.8l.6.45 5.614-7.514a.5.5 0 01.786-.172z" fill="#53BDEB"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// Text with WhatsApp-style formatting (*bold*, emojis preserved, line breaks)
function WAText({ text }) {
  // split by *...* for bold
  const parts = [];
  const regex = /\*([^*]+)\*/g;
  let lastIdx = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    parts.push(<strong key={m.index} style={{ fontWeight: 600 }}>{m[1]}</strong>);
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return <>{parts}</>;
}

// In-bubble action button (CTA link — e.g. "Fazer meu cadastro")
function ActionLink({ icon, label, onClick, href }) {
  const styleProps = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8,
    width: 'calc(100% + 20px)',
    margin: '8px -10px -8px',
    padding: '11px 12px',
    background: 'transparent',
    border: 'none',
    borderTop: `1px solid ${WA.divider}`,
    color: WA.link,
    fontSize: 14.5,
    fontWeight: 500,
    fontFamily: '-apple-system, system-ui',
    cursor: 'pointer',
    textAlign: 'center',
    letterSpacing: -.1,
    transition: 'background 120ms ease',
    textDecoration: 'none',
  };
  const onEnter = (e) => e.currentTarget.style.background = 'rgba(2,126,181,.06)';
  const onLeave = (e) => e.currentTarget.style.background = 'transparent';
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
         onMouseEnter={onEnter} onMouseLeave={onLeave}
         style={styleProps}>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <span>{label}</span>
      </a>
    );
  }
  return (
    <button onClick={onClick}
      onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={styleProps}>
      {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

// Quick-reply button row (below message)
function QuickReplies({ options = [], onPick }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      padding: '4px 8px 6px 8px',
      alignItems: 'flex-start',
      width: '100%',
      animation: 'bubbleIn 240ms cubic-bezier(.34,1.56,.64,1) both',
    }}>
      {options.map((opt, i) => (
        <button key={i} onClick={() => onPick && onPick(opt)} style={{
          maxWidth: '78%',
          minWidth: 160,
          padding: '10px 16px',
          background: WA.bubbleIn,
          border: 'none',
          borderRadius: 12,
          boxShadow: WA.bubbleShadow,
          color: WA.link,
          fontSize: 14.5,
          fontWeight: 500,
          fontFamily: '-apple-system, system-ui',
          cursor: 'pointer',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          letterSpacing: -.1,
          transition: 'transform 120ms ease, box-shadow 120ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = WA.bubbleShadow; }}>
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Date / phase separator
// ─────────────────────────────────────────────────────────────
function DateSeparator({ label }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      padding: '10px 12px',
    }}>
      <div style={{
        background: 'rgba(225,245,254,.92)',
        padding: '5px 12px',
        borderRadius: 8,
        fontSize: 12,
        color: '#54656F',
        fontFamily: '-apple-system, system-ui',
        fontWeight: 500,
        boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
        letterSpacing: .1,
      }}>{label}</div>
    </div>
  );
}

// ANOVA-style phase marker (more distinctive, uses blueprint language)
function PhaseMarker({ phase, label }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      padding: '16px 12px 8px',
      animation: 'bubbleIn 320ms ease both',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: 'linear-gradient(135deg, #0A0A0A 0%, #2a2a2a 100%)',
        padding: '6px 14px 6px 8px',
        borderRadius: 999,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        color: '#fff',
        letterSpacing: .14,
        textTransform: 'uppercase',
        boxShadow: '0 2px 8px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.08)',
      }}>
        <span style={{
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', color: '#0A0A0A',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 10, letterSpacing: 0,
          fontFamily: 'DM Sans, system-ui',
        }}>{phase}</span>
        <span style={{ fontWeight: 500 }}>{label}</span>
      </div>
    </div>
  );
}

// System notice (e.g. "Você foi adicionado ao grupo")
function SystemNotice({ children, icon }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      padding: '8px 12px',
      animation: 'bubbleIn 220ms ease both',
    }}>
      <div style={{
        background: 'rgba(255,255,255,.85)',
        padding: '6px 14px',
        borderRadius: 999,
        fontSize: 12.5,
        color: '#54656F',
        fontFamily: '-apple-system, system-ui',
        fontWeight: 500,
        textAlign: 'center',
        maxWidth: '85%',
        lineHeight: 1.45,
        boxShadow: '0 1px 0.5px rgba(11,20,26,.10)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        backdropFilter: 'blur(4px)',
      }}>
        {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        <span>{children}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Typing indicator (3 dots)
// ─────────────────────────────────────────────────────────────
function TypingBubble() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start',
      padding: '1.5px 8px',
      animation: 'bubbleIn 180ms ease both',
    }}>
      <div style={{
        background: WA.bubbleIn,
        borderRadius: 12, borderTopLeftRadius: 2,
        padding: '12px 14px',
        boxShadow: WA.bubbleShadow,
        display: 'flex', alignItems: 'center', gap: 5,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: -7,
          width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '0 10px 10px 0',
          borderColor: `transparent ${WA.bubbleIn} transparent transparent`,
        }} />
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#9DA5AD',
            animation: `typingDot 1.2s ${i*0.15}s infinite ease-in-out`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Input bar at bottom
// ─────────────────────────────────────────────────────────────
function ChatInput({ value = '', placeholder = 'Mensagem', typing = false }) {
  return (
    <div style={{
      background: WA.inputBg,
      padding: '6px 6px 8px',
      display: 'flex', alignItems: 'center', gap: 6,
      flexShrink: 0,
    }}>
      <div style={{
        flex: 1,
        background: '#fff',
        borderRadius: 22,
        padding: '8px 10px',
        display: 'flex', alignItems: 'center', gap: 8,
        minHeight: 40,
        boxSizing: 'border-box',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#54656F" strokeWidth="1.8"/>
          <circle cx="9" cy="10" r="1.2" fill="#54656F"/>
          <circle cx="15" cy="10" r="1.2" fill="#54656F"/>
          <path d="M8.5 14.5s1.5 2 3.5 2 3.5-2 3.5-2" stroke="#54656F" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <div style={{
          flex: 1,
          fontSize: 15,
          fontFamily: '-apple-system, system-ui',
          color: value ? WA.textDark : '#8696A0',
          minHeight: 20,
          display: 'flex', alignItems: 'center',
        }}>
          {value || placeholder}
          {typing && <span style={{
            display: 'inline-block', width: 1.5, height: 18,
            background: WA.accent, marginLeft: 1,
            animation: 'caret 1s infinite',
          }} />}
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(-35deg)' }}>
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#54656F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke="#54656F" strokeWidth="1.8"/>
          <circle cx="12" cy="10" r="3" stroke="#54656F" strokeWidth="1.8"/>
          <path d="M9 16.5h6" stroke="#54656F" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <button style={{
        width: 40, height: 40, borderRadius: '50%',
        background: WA.accent,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {value ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
            <path d="M19 12a7 7 0 01-14 0M12 19v3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          </svg>
        )}
      </button>
    </div>
  );
}

// Image inside a bubble (for MSG 6 mocks)
function MediaBubble({ from = 'in', caption, children, time = '10:40', showTail = true }) {
  const isOut = from === 'out';
  return (
    <div style={{
      display: 'flex', justifyContent: isOut ? 'flex-end' : 'flex-start',
      padding: '2px 8px',
      animation: 'bubbleIn 280ms cubic-bezier(.34,1.56,.64,1) both',
    }}>
      <div style={{
        maxWidth: '82%',
        background: isOut ? WA.bubbleOut : WA.bubbleIn,
        borderRadius: 12,
        borderTopLeftRadius: !isOut && showTail ? 2 : 12,
        padding: 4,
        paddingBottom: 6,
        boxShadow: WA.bubbleShadow,
        position: 'relative',
      }}>
        {showTail && !isOut && (
          <div style={{
            position: 'absolute', top: 0, left: -7,
            width: 0, height: 0,
            borderStyle: 'solid',
            borderWidth: '0 10px 10px 0',
            borderColor: `transparent ${WA.bubbleIn} transparent transparent`,
          }} />
        )}
        <div style={{ borderRadius: 8, overflow: 'hidden' }}>{children}</div>
        {caption && (
          <div style={{
            padding: '6px 6px 0',
            fontSize: 14,
            fontFamily: '-apple-system, system-ui',
            color: WA.textDark,
            lineHeight: 1.4,
          }}><WAText text={caption}/></div>
        )}
        <div style={{
          textAlign: 'right',
          fontSize: 10.5,
          color: WA.textMeta,
          fontFamily: '-apple-system, system-ui',
          paddingRight: 6,
          paddingTop: 2,
        }}>{time}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Keyframes injected once
// ─────────────────────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('wa-keyframes')) {
  const s = document.createElement('style');
  s.id = 'wa-keyframes';
  s.textContent = `
    @keyframes bubbleIn {
      from { opacity: 0; transform: translateY(6px) scale(.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes typingDot {
      0%, 60%, 100% { transform: translateY(0); opacity: .4; }
      30% { transform: translateY(-3px); opacity: 1; }
    }
    @keyframes caret {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  WA, WA_BG_URL,
  ChatHeader, AnovaAvatar, ClientAvatar, GroupAvatarStack,
  Bubble, WAText, ActionLink, QuickReplies,
  DateSeparator, PhaseMarker, SystemNotice,
  TypingBubble, ChatInput, MediaBubble,
});

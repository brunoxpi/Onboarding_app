// chatlist.jsx — WhatsApp "Conversas" tab (chat list view)
// Used after the group is created so the user can switch between the
// Anova individual chat and the group chat.

function ChatListView({ chats, activeId, onPick }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column',
      background: '#fff',
      overflow: 'hidden',
    }}>
      {/* WA-style header — modern light */}
      <div style={{
        background: '#FFFFFF',
        color: '#111B21',
        paddingTop: 54,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 12,
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '0.5px solid rgba(17,27,33,.08)',
      }}>
        <div style={{
          fontFamily: '-apple-system, system-ui',
          fontSize: 26, fontWeight: 700, flex: 1,
          letterSpacing: -.4,
          color: '#111B21',
        }}>Conversas</div>
        <button style={iconBtnDark}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#008069" strokeWidth="2"/>
            <path d="M21 21l-4.5-4.5" stroke="#008069" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button style={iconBtnDark}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#008069" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="10" stroke="#008069" strokeWidth="1.6"/>
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <div style={{ padding: '8px 12px', background: '#fff' }}>
        <div style={{
          background: '#F0F2F5',
          borderRadius: 22,
          padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 14, color: '#54656F',
          fontFamily: '-apple-system, system-ui',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#54656F" strokeWidth="1.8"/>
            <path d="M21 21l-4.5-4.5" stroke="#54656F" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Pesquisar
        </div>
      </div>

      {/* List */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: '#fff',
      }}>
        {chats.map((c) => (
          <ChatRow
            key={c.id}
            chat={c}
            active={c.id === activeId}
            onClick={() => onPick(c.id)}
          />
        ))}
      </div>
    </div>
  );
}

const iconBtnDark = {
  background: 'transparent', border: 'none',
  width: 32, height: 32,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', padding: 0,
};

function ChatRow({ chat, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
        background: active ? '#F0F2F5' : 'transparent',
        borderBottom: '0.5px solid rgba(17,27,33,.06)',
        transition: 'background 120ms ease',
        animation: chat.isNew ? 'rowFlash 1500ms ease' : undefined,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F8F9FB'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* avatar */}
      {chat.kind === 'group' ? <GroupAvatarStack size={50} /> : <AnovaAvatar size={50} />}
      {/* center */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontFamily: '-apple-system, system-ui',
            fontSize: 16, fontWeight: 500,
            color: '#111B21',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{chat.name}</div>
          <div style={{
            fontSize: 12,
            color: chat.unread ? '#00A884' : '#667781',
            fontWeight: chat.unread ? 600 : 400,
            flexShrink: 0,
            fontFamily: '-apple-system, system-ui',
          }}>{chat.time}</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, marginTop: 2,
        }}>
          <div style={{
            fontFamily: '-apple-system, system-ui',
            fontSize: 14, color: '#667781', lineHeight: 1.3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {chat.fromMe && (
              <svg width="14" height="10" viewBox="0 0 16 11" fill="none" style={{ flexShrink: 0 }}>
                <path d="M11.07.348a.5.5 0 01.086.686l-6 8a.5.5 0 01-.696.1l-4-3a.5.5 0 01.6-.8l3.6 2.7 5.614-7.514a.5.5 0 01.786-.172z" fill="#667781"/>
                <path d="M15.07.348a.5.5 0 01.086.686l-6 8a.5.5 0 01-.696.1l-1-.75a.5.5 0 01.6-.8l.6.45 5.614-7.514a.5.5 0 01.786-.172z" fill="#667781"/>
              </svg>
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.preview}</span>
          </div>
          {chat.unread > 0 && (
            <div style={{
              minWidth: 20, height: 20, padding: '0 6px',
              borderRadius: 10,
              background: '#00A884', color: '#fff',
              fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              fontFamily: '-apple-system, system-ui',
            }}>{chat.unread}</div>
          )}
        </div>
      </div>
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('chatlist-keyframes')) {
  const s = document.createElement('style');
  s.id = 'chatlist-keyframes';
  s.textContent = `
    @keyframes rowFlash {
      0%, 100% { background: transparent; }
      20% { background: rgba(0,168,132,.16); }
    }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { ChatListView });

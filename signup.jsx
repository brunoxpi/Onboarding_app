// signup.jsx — modal cadastro assessor (campos da API de credenciamento)

const { useState: useStateSU, useEffect: useEffectSU } = React;

function maskCPFCNPJ(v) {
  const d = (v || '').replace(/\D/g, '').slice(0, 14);
  // CPF while length <= 11, CNPJ beyond that
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  if (d.length <= 11) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  // CNPJ territory
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`;
}

function maskPhone(v) {
  const d = (v || '').replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function SignupModal({ open, defaultName, onSubmit, onClose }) {
  const [nome, setNome] = useStateSU('');
  const [email, setEmail] = useStateSU('');
  const [cpfCnpj, setCpfCnpj] = useStateSU('');
  const [telefone, setTelefone] = useStateSU('');
  const [fileIdentidade, setFileIdentidade] = useStateSU(null);
  const [fileResidencia, setFileResidencia] = useStateSU(null);
  const [submitting, setSubmitting] = useStateSU(false);

  useEffectSU(() => {
    if (open) {
      setNome(defaultName || '');
      setEmail('');
      setCpfCnpj('');
      setTelefone('');
      setFileIdentidade(null);
      setFileResidencia(null);
      setSubmitting(false);
    }
  }, [open, defaultName]);

  if (!open) return null;

  const digits = cpfCnpj.replace(/\D/g, '');
  const isCPF = digits.length === 11;
  const isCNPJ = digits.length === 14;
  const cpfCnpjValid = isCPF || isCNPJ;

  const valid =
    nome.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    cpfCnpjValid &&
    telefone.replace(/\D/g, '').length >= 10 &&
    fileIdentidade !== null &&
    fileResidencia !== null;

  const handleSubmit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    const [b64Identidade, b64Residencia] = await Promise.all([
      toBase64(fileIdentidade),
      toBase64(fileResidencia),
    ]);
    onSubmit({
      nome_partner: nome.trim(),
      email: email.trim(),
      cpf_responsavel: isCPF ? digits : '',
      cnpj: isCNPJ ? digits : '',
      telefone: telefone.replace(/\D/g, ''),
      documento_identidade: b64Identidade,
      documento_residencia: b64Residencia,
    });
  };

  const cpfCnpjLabel = digits.length > 11 ? 'CNPJ' : 'CPF / CNPJ';
  const cpfCnpjPlaceholder = digits.length > 11 ? '00.000.000/0001-00' : '000.000.000-00';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      animation: 'fadeIn 220ms ease both',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
      <div style={{
        position: 'relative',
        width: '100%',
        background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: '0 -10px 40px rgba(0,0,0,.2)',
        padding: '14px 20px 28px',
        animation: 'sheetUp 320ms cubic-bezier(.34,1.4,.64,1) both',
        fontFamily: 'DM Sans, system-ui',
        color: '#0A0A0A',
        maxHeight: '92%',
        overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 4, background: 'rgba(0,0,0,.18)', margin: '0 auto 14px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '22%',
              background: '#0A0A0A', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 10, letterSpacing: -.04,
            }}>A</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, letterSpacing: .12, textTransform: 'uppercase', color: '#767676',
            }}>ANOVA · CADASTRO</div>
          </div>
          <button onClick={onClose} style={{
            appearance: 'none', border: 'none', background: 'transparent',
            width: 28, height: 28, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#767676',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -.025, lineHeight: 1.15, marginTop: 12, marginBottom: 6 }}>
          Crie seu cadastro
        </h2>
        <p style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 1.5, marginBottom: 20 }}>
          Leva menos de 2 minutos. Seus dados são usados apenas para validação na CVM.
        </p>

        <Field label="NOME COMPLETO" value={nome} onChange={setNome} placeholder="Como aparece no seu RG" autoFocus />
        <Field label="E-MAIL" value={email} onChange={setEmail} placeholder="seu@email.com.br" inputMode="email" />
        <Field
          label={cpfCnpjLabel}
          value={cpfCnpj}
          onChange={(v) => setCpfCnpj(maskCPFCNPJ(v))}
          placeholder={cpfCnpjPlaceholder}
          inputMode="numeric"
        />
        <Field label="WHATSAPP" value={telefone} onChange={(v) => setTelefone(maskPhone(v))} placeholder="(11) 99999-9999" inputMode="tel" />
        <FileField label="DOCUMENTO DE IDENTIDADE" file={fileIdentidade} onChange={setFileIdentidade} hint="RG, CNH, passaporte · PDF ou imagem" />
        <FileField label="DOCUMENTO DE RESIDÊNCIA" file={fileResidencia} onChange={setFileResidencia} hint="Conta de luz, água, telefone · PDF ou imagem" />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginTop: 8, marginBottom: 16,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9.5, color: '#767676',
          letterSpacing: .08, textTransform: 'uppercase', lineHeight: 1.5,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
          <span>Dados criptografados · LGPD compliant</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!valid || submitting}
          style={{
            width: '100%',
            padding: '14px 18px',
            background: valid ? '#0A0A0A' : 'rgba(10,10,10,.3)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontFamily: 'DM Sans, system-ui',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: -.01,
            cursor: valid && !submitting ? 'pointer' : 'not-allowed',
            transition: 'background 160ms ease, opacity 160ms',
            opacity: submitting ? .7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {submitting ? (
            <>
              <span style={{
                width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 700ms linear infinite',
                display: 'inline-block',
              }} />
              Enviando…
            </>
          ) : (
            <>Concluir cadastro</>
          )}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, disabled, hint, inputMode, autoFocus }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9.5, letterSpacing: .12,
        textTransform: 'uppercase', color: '#767676', marginBottom: 5,
      }}>{label}</label>
      <input
        autoFocus={autoFocus}
        type="text"
        inputMode={inputMode}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 13px',
          fontFamily: 'DM Sans, system-ui',
          fontSize: 15, color: '#0A0A0A',
          background: disabled ? '#F4F4F4' : '#fff',
          border: '1px solid rgba(0,0,0,.12)',
          borderRadius: 10, outline: 'none',
          transition: 'border-color 160ms ease',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => !disabled && (e.target.style.borderColor = '#0A0A0A')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,.12)')}
      />
      {hint && <div style={{ marginTop: 4, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: '#767676' }}>{hint}</div>}
    </div>
  );
}

function FileField({ label, file, onChange, hint }) {
  const ref = React.useRef(null);

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9.5, letterSpacing: .12,
        textTransform: 'uppercase', color: '#767676', marginBottom: 5,
      }}>{label}</label>
      <input
        ref={ref}
        type="file"
        accept="image/*,.pdf"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) onChange(f); }}
      />
      <button
        type="button"
        onClick={() => ref.current && ref.current.click()}
        style={{
          width: '100%',
          padding: '11px 13px',
          fontFamily: 'DM Sans, system-ui',
          fontSize: 14,
          color: file ? '#0A0A0A' : '#A0A0A0',
          background: '#fff',
          border: `1px solid ${file ? '#0A0A0A' : 'rgba(0,0,0,.12)'}`,
          borderRadius: 10, cursor: 'pointer',
          textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 10,
          boxSizing: 'border-box',
          transition: 'border-color 160ms ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: file ? '#0A0A0A' : '#A0A0A0' }}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file ? file.name : 'Selecionar arquivo'}
        </span>
        {file && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: '#008069' }}>
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      {hint && <div style={{ marginTop: 4, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: '#767676' }}>{hint}</div>}
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('signup-keyframes')) {
  const s = document.createElement('style');
  s.id = 'signup-keyframes';
  s.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { SignupModal });

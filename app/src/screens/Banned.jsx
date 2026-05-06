import { useAuth } from '../context/AuthContext'

export default function Banned() {
  const { signOut } = useAuth()

  return (
    <div style={s.wrap}>
      <div style={s.bg} />

      <div style={s.content}>
        <div style={s.iconWrap}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" />
            <path d="M12 12L28 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 style={s.title}>
          Account<br />
          <span style={{ color: 'var(--red)' }}>suspended.</span>
        </h1>

        <p style={s.body}>
          Your account has been suspended and you no longer have access to FitnessPod. If you believe this is a mistake, please contact us directly.
        </p>

        <div style={s.contactCard}>
          <p style={s.contactLabel}>Get in touch</p>
          <a href="mailto:hello@fitnesspod.im" style={s.contactLink}>hello@fitnesspod.im</a>
        </div>

        <button style={s.signOutBtn} onClick={signOut}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

const s = {
  wrap: {
    height: '100%',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 28px',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,32,40,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(27,58,140,0.12) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center',
    zIndex: 1,
    maxWidth: '320px',
    width: '100%',
  },
  iconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(212,32,40,0.1)',
    border: '2px solid rgba(212,32,40,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--red)',
    marginBottom: '4px',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.8rem',
    lineHeight: 1,
    letterSpacing: '0.02em',
  },
  body: {
    fontSize: '0.88rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
  },
  contactCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '16px 24px',
    width: '100%',
  },
  contactLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--w30)',
    marginBottom: '6px',
  },
  contactLink: {
    color: 'var(--red)',
    fontSize: '0.9rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
  signOutBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'var(--w60)',
    fontSize: '0.85rem',
    padding: '12px 28px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    marginTop: '4px',
  },
}

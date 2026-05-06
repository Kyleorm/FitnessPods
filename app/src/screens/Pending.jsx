import { useAuth } from '../context/AuthContext'

export default function Pending() {
  const { profile, signOut } = useAuth()
  const name = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div style={s.wrap}>
      <div style={s.bg} />

      <div style={s.content}>
        <div style={s.iconWrap}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M20 12v9l5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 style={s.title}>
          Hey {name},<br />
          <span style={{ color: 'var(--amber)' }}>you're on the list.</span>
        </h1>

        <p style={s.body}>
          Your account is pending approval. The FitnessPod team will review your request and approve you shortly — usually within a few hours.
        </p>

        <div style={s.infoCard}>
          <div style={s.infoRow}>
            <span style={s.infoIcon}>✓</span>
            <span style={s.infoText}>Account created successfully</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.infoIcon}>✓</span>
            <span style={s.infoText}>1.5 free Pod Points reserved for you</span>
          </div>
          <div style={s.infoRow}>
            <span style={{ ...s.infoIcon, color: 'var(--amber)' }}>○</span>
            <span style={s.infoText}>Awaiting owner approval</span>
          </div>
        </div>

        <p style={s.hint}>
          You'll be able to log in and book your first free session as soon as you're approved. No action needed from you right now.
        </p>

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
    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(27,58,140,0.18) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center',
    zIndex: 1,
    maxWidth: '340px',
    width: '100%',
  },
  iconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(245,158,11,0.1)',
    border: '2px solid rgba(245,158,11,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f59e0b',
    marginBottom: '4px',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.8rem',
    lineHeight: 1,
    letterSpacing: '0.02em',
  },
  body: {
    fontSize: '0.9rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
  },
  infoCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '16px 20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  infoIcon: {
    fontSize: '1rem',
    color: '#22c55e',
    width: '20px',
    flexShrink: 0,
    textAlign: 'center',
  },
  infoText: {
    fontSize: '0.85rem',
    color: 'var(--w70)',
    lineHeight: 1.4,
  },
  hint: {
    fontSize: '0.78rem',
    color: 'var(--w30)',
    lineHeight: 1.5,
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

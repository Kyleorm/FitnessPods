import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div style={s.wrap}>
      <div style={s.bg} />
      <div style={s.glow} />

      <div style={s.content}>
        <div style={s.logoWrap}>
          <div style={s.logoBox}>
            <span style={s.fp}>FP</span>
          </div>
          <div style={s.logoText}>
            <span style={s.fitness}>FITNESS</span>
            <span style={s.pod}>POD</span>
          </div>
        </div>
        <p style={s.isle}>Isle of Man</p>

        <div style={s.taglineWrap}>
          <p style={s.tagline}>Your private gym.<br />No crowds. No waiting.</p>
        </div>

        <div style={s.freePointBadge}>
          <span style={s.freePointIcon}>🎁</span>
          <span style={s.freePointText}>Create an account and get <strong>1.5 free Pod Points</strong> — enough for any session, day or evening.</span>
        </div>
      </div>

      <div style={s.actions}>
        <button
          className="btn btn--primary btn--block"
          style={s.createBtn}
          onClick={() => navigate('/signup')}
        >
          Create Account
        </button>
        <button
          className="btn btn--ghost btn--block"
          style={s.loginBtn}
          onClick={() => navigate('/login')}
        >
          Log In
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
    justifyContent: 'space-between',
    padding: '60px 24px 48px',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(27,58,140,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(212,32,40,0.14) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  glow: {
    position: 'absolute',
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    background: 'rgba(27,58,140,0.07)',
    filter: 'blur(80px)',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    zIndex: 1,
    flex: 1,
    justifyContent: 'center',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '8px',
  },
  logoBox: {
    width: '72px',
    height: '72px',
    background: 'linear-gradient(135deg, var(--navy) 50%, var(--red) 50%)',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(27,58,140,0.5)',
  },
  fp: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.2rem',
    color: '#fff',
    letterSpacing: '0.02em',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  },
  fitness: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.4rem',
    color: 'var(--white)',
    letterSpacing: '0.08em',
  },
  pod: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.4rem',
    color: 'var(--red)',
    letterSpacing: '0.08em',
  },
  isle: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--w30)',
    marginTop: '-8px',
  },
  taglineWrap: {
    marginTop: '24px',
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'var(--font-head)',
    fontSize: '2rem',
    lineHeight: 1.1,
    letterSpacing: '0.04em',
    color: 'var(--white)',
    textAlign: 'center',
  },
  freePointBadge: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'rgba(245,200,66,0.08)',
    border: '1px solid rgba(245,200,66,0.25)',
    borderRadius: '12px',
    padding: '12px 16px',
    marginTop: '8px',
    maxWidth: '320px',
  },
  freePointIcon: {
    fontSize: '1.1rem',
    flexShrink: 0,
    marginTop: '1px',
  },
  freePointText: {
    fontSize: '0.82rem',
    color: 'var(--w60)',
    lineHeight: 1.5,
  },
  actions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 1,
  },
  createBtn: {
    fontSize: '1rem',
    padding: '16px',
  },
  loginBtn: {
    fontSize: '1rem',
    padding: '16px',
  },
}

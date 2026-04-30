import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setError('')

    if (fullName.trim().split(' ').length < 2) {
      setError('Please enter your full name (first and last).')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await signUp({ email: email.trim(), password, fullName: fullName.trim(), phone: phone.trim() })
      setSuccess(true)
      setTimeout(() => navigate('/home', { replace: true }), 3000)
    } catch (err) {
      if (err.message?.toLowerCase().includes('already registered') || err.message?.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Please log in instead.')
      } else {
        setError(err.message || 'Could not create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={s.successWrap}>
        <div style={s.bg} />
        <div style={s.successContent}>
          <div style={s.successIconWrap}>
            <div style={s.successIconBox}>
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <path d="M8 20L16 28L32 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 style={s.successTitle}>Welcome to<br /><span style={{ color: 'var(--red)' }}>FitnessPod!</span></h1>
          <p style={s.successMsg}>Your free session has been added to your account. Book any pod to get started.</p>
          <div style={s.podPointBadge}>
            <img src="/podpoint.png" alt="Pod Point" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            <div>
              <p style={s.podPointLabel}>Pod Points Balance</p>
              <p style={s.podPointNum}>1.5 <span style={{ fontSize: '1rem', fontFamily: 'var(--font-body)', color: 'var(--w60)' }}>points</span></p>
            </div>
          </div>
          <p style={s.redirectNote}>Taking you to the app…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={s.wrap}>
      <div style={s.bg} />

      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/welcome')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 5L8 10L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={s.logoMark}>
          <span style={s.logoFP}>FP</span>
        </div>
      </div>

      <div style={s.body}>
        <h1 style={s.title}>Create<br /><span style={{ color: 'var(--red)' }}>account.</span></h1>
        <p style={s.sub}>Get started — your first session is on us</p>

        <div style={s.freeBadge}>
          <span>🎁</span>
          <span style={s.freeBadgeText}>1.5 free Pod Points added instantly — covers any session</span>
        </div>

        <form onSubmit={handleSignup} style={s.form}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="John Smith"
              required
              autoComplete="name"
              style={s.input}
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={s.input}
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+44 7700 000000"
              required
              autoComplete="tel"
              style={s.input}
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
              style={s.input}
            />
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button
            type="submit"
            className="btn btn--primary btn--block"
            style={{ marginTop: '8px', opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>

      <div style={s.footer}>
        <p style={s.footerText}>
          Already have an account?{' '}
          <button style={s.footerLink} onClick={() => navigate('/login')}>
            Log In
          </button>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '14px 16px',
  fontSize: '0.95rem',
  color: 'var(--white)',
  width: '100%',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  WebkitAppearance: 'none',
  boxSizing: 'border-box',
}

const s = {
  wrap: {
    height: '100%',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  successWrap: {
    height: '100%',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 50% at 100% 0%, rgba(212,32,40,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(27,58,140,0.18) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  successContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'center',
    zIndex: 1,
  },
  successIconWrap: {
    marginBottom: '8px',
  },
  successIconBox: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(34,197,94,0.12)',
    border: '2px solid rgba(34,197,94,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#22c55e',
  },
  successTitle: {
    fontFamily: 'var(--font-head)',
    fontSize: '3rem',
    lineHeight: 0.95,
    letterSpacing: '0.03em',
  },
  successMsg: {
    fontSize: '0.88rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
    maxWidth: '280px',
  },
  podPointBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'rgba(245,200,66,0.08)',
    border: '1px solid rgba(245,200,66,0.25)',
    borderRadius: '14px',
    padding: '14px 20px',
    marginTop: '4px',
  },
  podPointLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(245,200,66,0.7)',
    marginBottom: '2px',
  },
  podPointNum: {
    fontFamily: 'var(--font-head)',
    fontSize: '2rem',
    color: '#f5c842',
    lineHeight: 1,
  },
  redirectNote: {
    fontSize: '0.75rem',
    color: 'var(--w30)',
    marginTop: '8px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '52px 20px 0',
    position: 'relative',
    zIndex: 1,
  },
  backBtn: {
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'var(--white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  logoMark: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, var(--navy) 50%, var(--red) 50%)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFP: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.1rem',
    color: '#fff',
  },
  body: {
    flex: 1,
    padding: '24px 24px 16px',
    position: 'relative',
    zIndex: 1,
    overflowY: 'auto',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '3.2rem',
    lineHeight: 0.95,
    letterSpacing: '0.02em',
    marginBottom: '8px',
  },
  sub: {
    fontSize: '0.85rem',
    color: 'var(--w40)',
    marginBottom: '16px',
  },
  freeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(245,200,66,0.07)',
    border: '1px solid rgba(245,200,66,0.2)',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '20px',
    fontSize: '0.78rem',
    color: '#f5c842',
    fontWeight: 600,
  },
  freeBadgeText: {
    color: '#f5c842',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
  },
  input: inputStyle,
  error: {
    fontSize: '0.82rem',
    color: 'var(--red)',
    background: 'rgba(212,32,40,0.1)',
    border: '1px solid rgba(212,32,40,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    lineHeight: 1.4,
  },
  footer: {
    padding: '16px 24px 40px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  footerText: {
    fontSize: '0.82rem',
    color: 'var(--w40)',
  },
  footerLink: {
    color: 'var(--red)',
    fontWeight: 700,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontFamily: 'var(--font-body)',
    padding: 0,
  },
}

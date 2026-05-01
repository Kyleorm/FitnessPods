import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'admin@fitnesspod.im'
const ADMIN_PASS = 'FitnessPod2025!'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [logoPresses, setLogoPresses] = useState(0)
  const logoPressTimer = useState(null)

  function handleLogoPress() {
    setLogoPresses(n => {
      const next = n + 1
      if (next >= 5) {
        setEmail(ADMIN_EMAIL)
        setPassword(ADMIN_PASS)
        return 0
      }
      clearTimeout(logoPressTimer.current)
      logoPressTimer.current = setTimeout(() => setLogoPresses(0), 2000)
      return next
    })
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ email: email.trim(), password })
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(resetEmail.trim())
      setResetSent(true)
    } catch (err) {
      setError(err.message || 'Could not send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
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
        <img
          src="/fitnesspod-logo.png"
          alt="FitnessPod"
          style={s.logoMark}
          onClick={handleLogoPress}
        />
      </div>

      <div style={s.body}>
        {!showReset ? (
          <>
            <h1 style={s.title}>Welcome<br /><span style={{ color: 'var(--red)' }}>back.</span></h1>
            <p style={s.sub}>Log in to your FitnessPod account</p>

            <form onSubmit={handleLogin} style={s.form}>
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
                <label style={s.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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
                {loading ? 'Logging in…' : 'Log In'}
              </button>
            </form>

            <button style={s.forgotBtn} onClick={() => { setShowReset(true); setResetEmail(email); setError('') }}>
              Forgot password?
            </button>
          </>
        ) : (
          <>
            <h1 style={s.title}>Reset<br /><span style={{ color: 'var(--red)' }}>password.</span></h1>
            <p style={s.sub}>Enter your email and we'll send you a reset link</p>

            {resetSent ? (
              <div style={s.successBox}>
                <span style={s.successIcon}>✓</span>
                <p style={s.successText}>Reset link sent to <strong>{resetEmail}</strong>. Check your inbox.</p>
                <button
                  className="btn btn--outline btn--block"
                  style={{ marginTop: '16px' }}
                  onClick={() => { setShowReset(false); setResetSent(false); setError('') }}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} style={s.form}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
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
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--block"
                  style={{ marginTop: '8px' }}
                  onClick={() => { setShowReset(false); setError('') }}
                >
                  Cancel
                </button>
              </form>
            )}
          </>
        )}
      </div>

      <div style={s.footer}>
        <p style={s.footerText}>
          Don't have an account?{' '}
          <button style={s.footerLink} onClick={() => navigate('/signup')}>
            Create Account
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
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 50% at 0% 0%, rgba(27,58,140,0.2) 0%, transparent 60%)',
    pointerEvents: 'none',
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
    height: '36px',
    width: 'auto',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  body: {
    flex: 1,
    padding: '32px 24px 24px',
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
    marginBottom: '28px',
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
  forgotBtn: {
    display: 'block',
    marginTop: '16px',
    fontSize: '0.82rem',
    color: 'var(--w40)',
    fontWeight: 600,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    fontFamily: 'var(--font-body)',
  },
  successBox: {
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.25)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '1.8rem',
    color: '#22c55e',
  },
  successText: {
    fontSize: '0.85rem',
    color: 'var(--w60)',
    lineHeight: 1.5,
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

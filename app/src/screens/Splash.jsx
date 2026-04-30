import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!waited || loading) return;
    navigate(user ? '/home' : '/welcome', { replace: true });
  }, [waited, loading, user, navigate]);

  return (
    <div style={styles.wrap}>
      <div style={styles.bg} />
      <div style={styles.glow} />
      <div style={styles.content}>
        <div style={styles.logoWrap}>
          <div style={styles.logoBox}>
            <span style={styles.fp}>FP</span>
          </div>
          <div style={styles.logoText}>
            <span style={styles.fitness}>FITNESS</span>
            <span style={styles.pod}>POD</span>
          </div>
        </div>
        <p style={styles.sub}>Isle of Man</p>
      </div>
      <div style={styles.bar}>
        <div style={styles.barFill} />
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    height: '100%',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 30% 60%, rgba(27,58,140,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 40%, rgba(212,32,40,0.12) 0%, transparent 60%)',
  },
  glow: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(27,58,140,0.08)',
    filter: 'blur(80px)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    animation: 'fadeUp 0.6s ease both',
    zIndex: 1,
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logoBox: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, var(--navy) 50%, var(--red) 50%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(27,58,140,0.45)',
  },
  fp: {
    fontFamily: 'var(--font-head)',
    fontSize: '2rem',
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
    fontSize: '2.2rem',
    color: 'var(--white)',
    letterSpacing: '0.08em',
  },
  pod: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.2rem',
    color: 'var(--red)',
    letterSpacing: '0.08em',
  },
  sub: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
  },
  bar: {
    position: 'absolute',
    bottom: '48px',
    width: '120px',
    height: '3px',
    background: 'var(--w10)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    background: 'var(--red)',
    borderRadius: '2px',
    animation: 'loadBar 2s ease forwards',
  },
};

// inject keyframes
const sheet = document.createElement('style');
sheet.textContent = `
@keyframes loadBar { from { width: 0 } to { width: 100% } }
`;
document.head.appendChild(sheet);

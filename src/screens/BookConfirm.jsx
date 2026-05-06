import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function BookConfirm() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={s.wrap}>
      <div style={s.glow} />

      <div style={{ ...s.content, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s ease' }}>
        <div style={s.iconWrap}>
          <div style={s.iconRing} />
          <div style={s.iconInner}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <p style={s.eyebrow}>Booking confirmed</p>
        <h1 style={s.title}>You're all<br /><span style={{ color: 'var(--red)' }}>booked in.</span></h1>
        <p style={s.sub}>Your door code has been sent to your email and phone number. You're good to go.</p>

        <div style={s.codeCard} className="card">
          <p style={s.codeLabel}>Your door code</p>
          <p style={s.code}>4829</p>
          <p style={s.codeSub}>Valid for your session only · Do not share</p>
        </div>

        <div style={s.details}>
          <div style={s.detailRow}>
            <span style={s.detailLabel}>Pod</span>
            <span style={s.detailValue}>FitnessPod 1</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.detailLabel}>Date</span>
            <span style={s.detailValue}>Today</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.detailLabel}>Time</span>
            <span style={s.detailValue}>18:00 – 19:00</span>
          </div>
        </div>

        <button className="btn btn--primary btn--block" onClick={() => navigate('/')}>
          Back to Home
        </button>
        <button className="btn btn--ghost btn--block" style={{ marginTop: '10px' }} onClick={() => navigate('/sessions')}>
          View My Sessions
        </button>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    height: '100%',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
  },
  glow: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(232,24,26,0.12) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
    width: '100%',
    maxWidth: '360px',
    position: 'relative',
  },
  iconWrap: {
    position: 'relative',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  iconRing: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '2px solid rgba(232,24,26,0.3)',
    animation: 'ping 1.5s ease-out 0.3s both',
  },
  iconInner: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'var(--red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(232,24,26,0.4)',
  },
  eyebrow: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--red)',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '3rem',
    lineHeight: 1,
    letterSpacing: '0.02em',
  },
  sub: {
    fontSize: '0.85rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
  },
  codeCard: {
    width: '100%',
    padding: '20px',
    background: 'rgba(232,24,26,0.06)',
    border: '1px solid rgba(232,24,26,0.2)',
  },
  codeLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--red)',
    marginBottom: '6px',
  },
  code: {
    fontFamily: 'var(--font-head)',
    fontSize: '4rem',
    lineHeight: 1,
    letterSpacing: '0.3em',
    color: 'var(--white)',
    marginBottom: '6px',
  },
  codeSub: {
    fontSize: '0.7rem',
    color: 'var(--w40)',
  },
  details: {
    width: '100%',
    background: 'var(--bg2)',
    borderRadius: '12px',
    border: '1px solid var(--w06)',
    overflow: 'hidden',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid var(--w06)',
  },
  detailLabel: { fontSize: '0.82rem', color: 'var(--w60)' },
  detailValue: { fontSize: '0.82rem', fontWeight: 700 },
};

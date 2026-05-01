import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const upcoming = [
  { id: 1, pod: 'FitnessPod 1', date: 'Today', time: '18:00 – 19:00', code: '4829', price: '£10' },
  { id: 2, pod: 'PowerPod',     date: 'Thu 24 Apr', time: '07:00 – 08:00', code: null, price: '£7' },
];

const past = [
  { id: 3, pod: 'HIITPod',      date: 'Mon 21 Apr', time: '17:00 – 18:00', price: '£7' },
  { id: 4, pod: 'FitnessPod 2', date: 'Sat 19 Apr', time: '10:00 – 11:00', price: '£7' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const fullName = profile?.full_name || 'FitnessPod User';
  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const email = user?.email || '';
  const podPoints = profile?.pod_points ?? 0;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : '—';

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/welcome', { replace: true });
    } catch {
      // sign out failed silently
    }
  }

  return (
    <div className="screen">
      <div style={s.header}>
        <div style={s.headerBg} />
        <div style={s.avatar}>
          <span style={s.avatarText}>{initials}</span>
        </div>
        <h1 style={s.name}>{fullName}</h1>
        <p style={s.email}>{email}</p>
        <div style={s.statRow}>
          <div style={s.stat}>
            <span style={s.statNum}>—</span>
            <span style={s.statLabel}>Sessions</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <span style={s.statNum}>{podPoints}</span>
            <span style={s.statLabel}>Pod Points</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <span style={s.statNum}>{memberSince}</span>
            <span style={s.statLabel}>Member since</span>
          </div>
        </div>
      </div>

      <div style={s.body}>

        {/* Pod Points balance — quick view, taps through to Shop */}
        <div className="fade-up">
          <p style={s.sectionLabel}>Pod Points</p>
          <div style={s.pointsBalance} className="card" onClick={() => navigate('/shop')}>
            <div style={s.pointsBg} />
            <div style={s.pointsLeft}>
              <p style={s.pointsBalLabel}>Current balance</p>
              <p style={s.pointsBalNum}>{podPoints} <span style={s.pointsBalUnit}>points</span></p>
              <p style={s.pointsBalSub}>≈ {podPoints} daytime session{podPoints !== 1 ? 's' : ''} remaining</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', position: 'relative' }}>
              <span style={s.topUpLink}>Top up →</span>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="fade-up fade-up-1">
          <p style={s.sectionLabel}>Upcoming Sessions</p>
          {upcoming.length === 0 ? (
            <div style={s.empty} className="card">
              <p style={s.emptyText}>No upcoming sessions</p>
              <button className="btn btn--primary btn--sm" onClick={() => navigate('/book')}>Book Now</button>
            </div>
          ) : (
            <div style={s.sessionList}>
              {upcoming.map(session => (
                <div key={session.id} style={s.sessionCard} className="card">
                  <div style={s.sessionLeft}>
                    <p style={s.sessionPod}>{session.pod}</p>
                    <p style={s.sessionTime}>{session.date} · {session.time}</p>
                    {session.code && (
                      <div style={s.codeRow}>
                        <span style={s.codeTag}>Door code</span>
                        <span style={s.codeVal}>{session.code}</span>
                      </div>
                    )}
                    {!session.code && (
                      <div style={s.pendingRow}>
                        <div style={s.pendingDot} />
                        <span style={s.pendingText}>Code pending</span>
                      </div>
                    )}
                  </div>
                  <div style={s.sessionRight}>
                    <span style={s.sessionPrice}>{session.price}</span>
                    <div style={s.upcomingBadge}>Upcoming</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p style={{ ...s.sectionLabel, marginTop: '16px' }}>Past Sessions</p>
          <div style={s.sessionList}>
            {past.map(session => (
              <div key={session.id} style={{ ...s.sessionCard, opacity: 0.65 }} className="card">
                <div style={s.sessionLeft}>
                  <p style={s.sessionPod}>{session.pod}</p>
                  <p style={s.sessionTime}>{session.date} · {session.time}</p>
                </div>
                <div style={s.sessionRight}>
                  <span style={s.sessionPrice}>{session.price}</span>
                  <div style={s.pastBadge}>Completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account settings */}
        <div className="fade-up fade-up-2">
          <p style={s.sectionLabel}>Account</p>
          <div style={s.menuList} className="card">
            {[
              { icon: '👤', label: 'Personal details' },
              { icon: '🔔', label: 'Notifications' },
              { icon: '💳', label: 'Payment methods' },
              { icon: '🔒', label: 'Change password' },
            ].map((item, i) => (
              <div key={i}>
                <div style={s.menuItem}>
                  <span style={s.menuIcon}>{item.icon}</span>
                  <span style={s.menuLabel}>{item.label}</span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--w20)' }}>
                    <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                {i < 3 && <div style={s.menuDivider} />}
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn--ghost btn--block fade-up fade-up-3" style={{ borderColor: 'rgba(232,24,26,0.3)', color: 'var(--red)' }} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

const s = {
  header: {
    padding: '56px 20px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: '1px solid var(--w06)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerBg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 30% 0%, rgba(27,58,140,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 0%, rgba(212,32,40,0.1) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--navy) 50%, var(--red) 50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    boxShadow: '0 4px 24px rgba(27,58,140,0.4)',
    position: 'relative',
  },
  avatarText: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.6rem',
    color: '#fff',
  },
  name: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.8rem',
    letterSpacing: '0.04em',
    marginBottom: '3px',
    position: 'relative',
  },
  email: {
    fontSize: '0.8rem',
    color: 'var(--w40)',
    marginBottom: '20px',
    position: 'relative',
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    width: '100%',
    background: 'var(--bg2)',
    borderRadius: '12px',
    border: '1px solid var(--w06)',
    overflow: 'hidden',
    position: 'relative',
  },
  stat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 8px',
    gap: '3px',
  },
  statNum: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.3rem',
    color: 'var(--white)',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '0.65rem',
    color: 'var(--w40)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  statDivider: {
    width: '1px',
    height: '36px',
    background: 'var(--w06)',
  },
  body: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    marginBottom: '10px',
  },
  pointsBalance: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px',
    position: 'relative',
    overflow: 'hidden',
  },
  pointsBg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(232,24,26,0.1) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  pointsLeft: { position: 'relative' },
  pointsBalLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--red)',
    marginBottom: '4px',
  },
  pointsBalNum: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.4rem',
    lineHeight: 1,
    marginBottom: '4px',
  },
  pointsBalUnit: {
    fontSize: '1.2rem',
    color: 'var(--w60)',
  },
  pointsBalSub: {
    fontSize: '0.75rem',
    color: 'var(--w40)',
  },

  /* Explainer */
  explainer: {
    padding: '18px',
    marginTop: '12px',
  },
  explainerTitle: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.1rem',
    color: 'var(--white)',
    marginBottom: '8px',
    letterSpacing: '0.02em',
  },
  explainerBody: {
    fontSize: '0.82rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
    marginBottom: '14px',
  },
  explainerRules: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '14px',
  },
  explainerRule: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.82rem',
    color: 'var(--w70)',
    lineHeight: 1.5,
  },
  explainerIcon: {
    fontSize: '1rem',
    flexShrink: 0,
    marginTop: '1px',
  },
  explainerFooter: {
    fontSize: '0.8rem',
    color: '#f5c842',
    fontWeight: 600,
    borderTop: '1px solid var(--w06)',
    paddingTop: '12px',
  },
  topUpLink: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--red)',
    position: 'relative',
  },
  sessionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sessionCard: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '16px',
    gap: '12px',
  },
  sessionLeft: { flex: 1 },
  sessionPod: { fontSize: '0.92rem', fontWeight: 700, marginBottom: '3px' },
  sessionTime: { fontSize: '0.78rem', color: 'var(--w60)', marginBottom: '8px' },
  codeRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  codeTag: {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--red)',
    background: 'rgba(232,24,26,0.1)',
    padding: '2px 7px',
    borderRadius: '4px',
  },
  codeVal: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.3rem',
    color: 'var(--white)',
    letterSpacing: '0.15em',
  },
  pendingRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  pendingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#f59e0b',
  },
  pendingText: { fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 },
  sessionRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
    flexShrink: 0,
  },
  sessionPrice: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.2rem',
    color: 'var(--white)',
  },
  upcomingBadge: {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#22c55e',
    background: 'rgba(34,197,94,0.1)',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid rgba(34,197,94,0.2)',
  },
  pastBadge: {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    background: 'var(--w06)',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '32px',
  },
  emptyText: { fontSize: '0.88rem', color: 'var(--w40)' },
  menuList: {},
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    cursor: 'pointer',
  },
  menuIcon: { fontSize: '1rem', width: '20px', textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: '0.88rem', fontWeight: 500 },
  menuDivider: {
    height: '1px',
    background: 'var(--w06)',
    margin: '0 16px',
  },
};

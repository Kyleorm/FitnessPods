import { useNavigate } from 'react-router-dom';

const bundles = [
  { pts: 5,  bonus: 1, price: 30,  saving: '£6.50',  tag: null },
  { pts: 9,  bonus: 2, price: 55,  saving: '£13',    tag: 'Most Popular' },
  { pts: 20, bonus: 5, price: 100, saving: '£32.50', tag: 'Best Value' },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div style={s.header}>
        <div style={s.headerBg} />
        <div style={s.avatar}>
          <span style={s.avatarText}>JD</span>
        </div>
        <h1 style={s.name}>John Doe</h1>
        <p style={s.email}>john@example.com</p>
        <div style={s.statRow}>
          <div style={s.stat}>
            <span style={s.statNum}>12</span>
            <span style={s.statLabel}>Sessions</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <span style={s.statNum}>3</span>
            <span style={s.statLabel}>Pod Points</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <span style={s.statNum}>Apr '25</span>
            <span style={s.statLabel}>Member since</span>
          </div>
        </div>
      </div>

      <div style={s.body}>
        {/* Pod Points */}
        <div className="fade-up">
          <p style={s.sectionLabel}>Pod Points</p>
          <div style={s.pointsBalance} className="card">
            <div style={s.pointsBg} />
            <div style={s.pointsLeft}>
              <p style={s.pointsBalLabel}>Current balance</p>
              <p style={s.pointsBalNum}>3 <span style={s.pointsBalUnit}>points</span></p>
              <p style={s.pointsBalSub}>≈ 3 daytime sessions remaining</p>
            </div>
            <div style={s.pointsIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="var(--red)" strokeWidth="1.5"/>
                <path d="M12 6v6l4 2" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <p style={{ ...s.sectionLabel, marginTop: '16px' }}>Top up your points</p>
          <div style={s.bundleList}>
            {bundles.map(b => (
              <div key={b.pts} style={{ ...s.bundle, borderColor: b.tag ? 'var(--red)' : 'var(--w06)' }} className="card">
                {b.tag && <div style={s.bundleTag}>{b.tag}</div>}
                <div style={s.bundleLeft}>
                  <p style={s.bundlePts}>{b.pts + b.bonus} <span style={s.bundlePtsUnit}>points</span></p>
                  <p style={s.bundleBreak}>{b.pts} bought + {b.bonus} free · saving {b.saving}</p>
                </div>
                <div style={s.bundleRight}>
                  <p style={s.bundlePrice}>£{b.price}</p>
                  <button className="btn btn--primary btn--sm">Buy</button>
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

        <button className="btn btn--ghost btn--block fade-up fade-up-3" style={{ borderColor: 'rgba(232,24,26,0.3)', color: 'var(--red)' }}>
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
  pointsIcon: {
    position: 'relative',
    opacity: 0.6,
  },
  bundleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  bundle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    position: 'relative',
  },
  bundleTag: {
    position: 'absolute',
    top: '-1px',
    right: '12px',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'var(--red)',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '0 0 6px 6px',
  },
  bundleLeft: { flex: 1 },
  bundlePts: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.6rem',
    lineHeight: 1,
    marginBottom: '3px',
  },
  bundlePtsUnit: {
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    color: 'var(--w60)',
    fontWeight: 400,
  },
  bundleBreak: {
    fontSize: '0.72rem',
    color: 'var(--w40)',
  },
  bundleRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  bundlePrice: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.4rem',
    color: 'var(--white)',
  },
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

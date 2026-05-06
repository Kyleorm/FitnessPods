import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const [sessionCount, setSessionCount]   = useState(null);
  const [transactions, setTransactions]   = useState([]);
  const [txLoading, setTxLoading]         = useState(true);

  const fullName    = profile?.full_name || 'FitnessPod User';
  const initials    = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const email       = user?.email || '';
  const podPoints   = profile?.pod_points ?? 0;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : '—';

  useEffect(() => {
    if (!user?.id) return;

    async function fetchData() {
      const [countRes, txRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .is('deleted_at', null),
        supabase
          .from('pod_points_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      setSessionCount(countRes.count ?? 0);
      setTransactions(txRes.data ?? []);
      setTxLoading(false);
    }

    fetchData();
  }, [user?.id]);

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
            <span style={s.statNum}>{sessionCount ?? '—'}</span>
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

        {/* Pod Points balance */}
        <div className="fade-up">
          <p style={s.sectionLabel}>Pod Points</p>
          <div style={s.pointsBalance} className="card" onClick={() => navigate('/shop')}>
            <div style={s.pointsBg} />
            <div style={s.pointsLeft}>
              <p style={s.pointsBalLabel}>Current balance</p>
              <p style={s.pointsBalNum}>{podPoints} <span style={s.pointsBalUnit}>points</span></p>
              <p style={s.pointsBalSub}>≈ {podPoints} daytime session{podPoints !== 1 ? 's' : ''} remaining</p>
            </div>
            <span style={s.topUpLink}>Top up →</span>
          </div>
        </div>

        {/* Points transaction history */}
        <div className="fade-up fade-up-1">
          <p style={s.sectionLabel}>Points History</p>
          {txLoading ? (
            <div style={s.txLoading} className="card">
              <div style={s.spinner} />
            </div>
          ) : transactions.length === 0 ? (
            <div style={s.empty} className="card">
              <p style={s.emptyText}>No transactions yet</p>
            </div>
          ) : (
            <div style={s.txList} className="card">
              {transactions.map((tx, i) => {
                const isSpend  = tx.points < 0;
                const pts      = Math.abs(tx.points);
                const date     = new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                return (
                  <div key={tx.id}>
                    <div style={s.txRow}>
                      <div style={{ ...s.txDot, background: isSpend ? 'rgba(212,32,40,0.15)' : 'rgba(34,197,94,0.15)', border: `1px solid ${isSpend ? 'rgba(212,32,40,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
                        <span style={{ fontSize: '0.7rem' }}>{isSpend ? '−' : '+'}</span>
                      </div>
                      <div style={s.txInfo}>
                        <p style={s.txDesc}>{tx.description || (isSpend ? 'Session booked' : 'Points purchased')}</p>
                        <p style={s.txDate}>{date}</p>
                      </div>
                      <span style={{ ...s.txPts, color: isSpend ? 'var(--red)' : '#22c55e' }}>
                        {isSpend ? '−' : '+'}{pts} pt{pts !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {i < transactions.length - 1 && <div style={s.txDivider} />}
                  </div>
                );
              })}
            </div>
          )}
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
    cursor: 'pointer',
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
  topUpLink: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--red)',
    position: 'relative',
  },
  txList: { overflow: 'hidden', padding: 0 },
  txLoading: { display: 'flex', justifyContent: 'center', padding: '24px' },
  spinner: { width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--w10)', borderTopColor: 'var(--red)', animation: 'spin 0.8s linear infinite' },
  txRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' },
  txDot: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 },
  txInfo: { flex: 1, minWidth: 0 },
  txDesc: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  txDate: { fontSize: '0.72rem', color: 'var(--w40)' },
  txPts: { fontSize: '0.88rem', fontWeight: 700, flexShrink: 0 },
  txDivider: { height: '1px', background: 'var(--w06)', margin: '0 16px' },
  empty: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  emptyText: { fontSize: '0.85rem', color: 'var(--w40)' },
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

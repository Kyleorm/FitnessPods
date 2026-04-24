import { useNavigate } from 'react-router-dom';

const upcoming = [
  { id: 1, pod: 'FitnessPod 1', date: 'Today', time: '18:00 – 19:00', code: '4829', price: '£10.00' },
  { id: 2, pod: 'PowerPod',     date: 'Thu 24 Apr', time: '07:00 – 08:00', code: null,   price: '£6.50' },
];

const past = [
  { id: 3, pod: 'HIITPod',      date: 'Mon 21 Apr', time: '17:00 – 18:00', price: '£6.50' },
  { id: 4, pod: 'FitnessPod 2', date: 'Sat 19 Apr', time: '10:00 – 11:00', price: '£6.50' },
  { id: 5, pod: 'PowerPod',     date: 'Thu 17 Apr', time: '07:00 – 08:00', price: '£6.50' },
];

export default function Sessions() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div style={s.header}>
        <p className="eyebrow fade-up">My Sessions</p>
        <h1 style={s.title} className="fade-up fade-up-1">Training<br /><span style={{ color: 'var(--red)' }}>History.</span></h1>
      </div>

      <div style={s.body}>
        {/* Upcoming */}
        <div className="fade-up fade-up-2">
          <p style={s.sectionLabel}>Upcoming</p>
          {upcoming.length === 0 ? (
            <div style={s.empty}>
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
        </div>

        {/* Past */}
        <div className="fade-up fade-up-3">
          <p style={s.sectionLabel}>Past sessions</p>
          <div style={s.sessionList}>
            {past.map(session => (
              <div key={session.id} style={{ ...s.sessionCard, opacity: 0.7 }} className="card">
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

        <button className="btn btn--primary btn--block fade-up fade-up-4" onClick={() => navigate('/book')}>
          Book Another Session
        </button>
      </div>
    </div>
  );
}

const s = {
  header: {
    padding: '56px 20px 20px',
    borderBottom: '1px solid var(--w06)',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.8rem',
    lineHeight: 1,
    marginTop: '6px',
    letterSpacing: '0.02em',
  },
  body: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    marginBottom: '10px',
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
  codeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
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
  pendingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  pendingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#f59e0b',
    animation: 'pulse 2s infinite',
  },
  pendingText: {
    fontSize: '0.75rem',
    color: '#f59e0b',
    fontWeight: 600,
  },
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
    background: 'var(--bg2)',
    borderRadius: '14px',
    border: '1px solid var(--w06)',
  },
  emptyText: {
    fontSize: '0.88rem',
    color: 'var(--w40)',
  },
};

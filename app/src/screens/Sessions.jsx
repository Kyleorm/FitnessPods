import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const PODS = [
  { name: 'FitnessPod 1', offset: 0  },
  { name: 'FitnessPod 2', offset: 15 },
  { name: 'FitnessPod 3', offset: 30 },
  { name: 'FitnessPod 4', offset: 45 },
  { name: 'HIITPod',      offset: 0  },
  { name: 'PowerPod',     offset: 30 },
];

function fmtSlot(hour, offset) {
  const pad = n => String(n).padStart(2, '0');
  const startMins = hour * 60 + offset;
  const endMins   = startMins + 60;
  const sh = Math.floor(startMins / 60) % 24, sm = startMins % 60;
  const eh = Math.floor(endMins   / 60) % 24, em = endMins   % 60;
  return `${pad(sh)}:${pad(sm)} – ${pad(eh)}:${pad(em)}`;
}

function fmtDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  if (iso === today) return 'Today';
  if (iso === tomorrow) return 'Tomorrow';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getPrice(hour, offset) {
  return (hour * 60 + offset) < 990 ? '£7.00' : '£10.50';
}

export default function Sessions() {
  const navigate = useNavigate();
  const [upcoming, setUpcoming]   = useState([]);
  const [past, setPast]           = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function load() {
      const todayISO   = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'confirmed')
        .is('deleted_at', null)
        .order('booking_date', { ascending: false })
        .order('booking_hour',  { ascending: false });

      if (error || !data) { setLoading(false); return; }

      const up = [], done = [];
      data.forEach(b => {
        const isUpcoming =
          b.booking_date > todayISO ||
          (b.booking_date === todayISO && b.booking_hour >= currentHour);
        isUpcoming ? up.unshift(b) : done.push(b);
      });

      setUpcoming(up);
      setPast(done);
      setLoading(false);
    }
    load();
  }, []);

  function SessionCard({ b, isPast }) {
    const pod    = PODS[b.pod_index] ?? { name: `Pod ${b.pod_index}`, offset: 0 };
    const price  = getPrice(b.booking_hour, pod.offset);
    const slotStr = fmtSlot(b.booking_hour, pod.offset);
    const dateStr = fmtDate(b.booking_date);

    return (
      <div style={{ ...s.sessionCard, opacity: isPast ? 0.7 : 1 }} className="card">
        <div style={s.sessionLeft}>
          <p style={s.sessionPod}>{pod.name}</p>
          <p style={s.sessionTime}>{dateStr} · {slotStr}</p>
          {!isPast && b.door_code && (
            <div style={s.codeRow}>
              <span style={s.codeTag}>Door code</span>
              <span style={s.codeVal}>{b.door_code}</span>
            </div>
          )}
          {!isPast && !b.door_code && (
            <div style={s.pendingRow}>
              <div style={s.pendingDot} />
              <span style={s.pendingText}>Code pending</span>
            </div>
          )}
        </div>
        <div style={s.sessionRight}>
          <span style={s.sessionPrice}>{price}</span>
          <div style={isPast ? s.pastBadge : s.upcomingBadge}>
            {isPast ? 'Completed' : 'Upcoming'}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--w10)', borderTopColor: 'var(--red)', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="screen">
      <div style={s.header}>
        <p className="eyebrow fade-up">My Sessions</p>
        <h1 style={s.title} className="fade-up fade-up-1">Training<br /><span style={{ color: 'var(--red)' }}>History.</span></h1>
      </div>

      <div style={s.body}>
        <div className="fade-up fade-up-2">
          <p style={s.sectionLabel}>Upcoming</p>
          {upcoming.length === 0 ? (
            <div style={s.empty}>
              <p style={s.emptyText}>No upcoming sessions</p>
              <button className="btn btn--primary btn--sm" onClick={() => navigate('/book')}>Book Now</button>
            </div>
          ) : (
            <div style={s.sessionList}>
              {upcoming.map(b => <SessionCard key={b.id} b={b} isPast={false} />)}
            </div>
          )}
        </div>

        <div className="fade-up fade-up-3">
          <p style={s.sectionLabel}>Past sessions</p>
          {past.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--w40)', padding: '8px 0' }}>No past sessions yet</p>
          ) : (
            <div style={s.sessionList}>
              {past.map(b => <SessionCard key={b.id} b={b} isPast={true} />)}
            </div>
          )}
        </div>

        <button className="btn btn--primary btn--block fade-up fade-up-4" onClick={() => navigate('/book')}>
          Book Another Session
        </button>
      </div>
    </div>
  );
}

const s = {
  header: { padding: '56px 20px 20px', borderBottom: '1px solid var(--w06)' },
  title: { fontFamily: 'var(--font-head)', fontSize: '2.8rem', lineHeight: 1, marginTop: '6px', letterSpacing: '0.02em' },
  body: { padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '24px' },
  sectionLabel: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--w40)', marginBottom: '10px' },
  sessionList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  sessionCard: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px', gap: '12px' },
  sessionLeft: { flex: 1 },
  sessionPod: { fontSize: '0.92rem', fontWeight: 700, marginBottom: '3px' },
  sessionTime: { fontSize: '0.78rem', color: 'var(--w60)', marginBottom: '8px' },
  codeRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  codeTag: { fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red)', background: 'rgba(232,24,26,0.1)', padding: '2px 7px', borderRadius: '4px' },
  codeVal: { fontFamily: 'var(--font-head)', fontSize: '1.3rem', color: 'var(--white)', letterSpacing: '0.15em' },
  pendingRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  pendingDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' },
  pendingText: { fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 },
  sessionRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 },
  sessionPrice: { fontFamily: 'var(--font-head)', fontSize: '1.2rem', color: 'var(--white)' },
  upcomingBadge: { fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.2)' },
  pastBadge: { fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--w40)', background: 'var(--w06)', padding: '3px 8px', borderRadius: '4px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px', background: 'var(--bg2)', borderRadius: '14px', border: '1px solid var(--w06)' },
  emptyText: { fontSize: '0.88rem', color: 'var(--w40)' },
};

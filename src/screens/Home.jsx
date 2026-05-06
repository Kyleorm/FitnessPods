import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const pods = [
  { id: 1, name: 'FitnessPod 1', free: true  },
  { id: 2, name: 'FitnessPod 2', free: true  },
  { id: 3, name: 'FitnessPod 3', free: false },
  { id: 4, name: 'FitnessPod 4', free: true  },
  { id: 5, name: 'HIITPod',      free: false },
  { id: 6, name: 'PowerPod',     free: true  },
];

const freePods = pods.filter(p => p.free).length;

const now = new Date();
const calYear  = now.getFullYear();
const calMonth = now.getMonth();
const today    = 28; // demo date — shows a full month of activity
const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
// Monday-first offset (Sun=0 → 6, Mon=1 → 0, etc.)
const startOffset = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
// Dummy seeded activity — past days only
const activity = Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1;
  if (day > today) return 'future';
  if (day === today) return 'today';
  const restDays = [2, 5, 8, 9, 12, 15, 16, 19, 20, 23, 24, 27];
  return restDays.includes(day) ? 'rest' : 'trained';
});
const sessionsThisMonth = activity.filter(a => a === 'trained' || a === 'today').length;

function AnimatedCoin() {
  return (
    <div style={coin.wrap}>
      <div style={coin.glow} />
      <img src="/podpoint.png" alt="Pod Point" style={coin.img} />
    </div>
  );
}

function CountUp({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return val;
}

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const quotes = [
    "Own the hour.",
    "No crowd. No excuses.",
    "Your pod. Your rules.",
    "Show up. Every time.",
    "The work doesn't lie.",
    "Private gym. Public results.",
    "One session changes everything.",
    "Train like it matters.",
    "Your only competition is yesterday.",
    "No witnesses. Just results.",
    "Earn your rest.",
    "The pod is waiting.",
    "Discipline beats motivation.",
    "Start before you're ready.",
    "Make today count.",
    "Push past the voice in your head.",
    "No one's watching. Go harder.",
    "Small steps. Big results.",
    "You showed up. That's already winning.",
    "Built in private. Proven in life.",
    "Your hour. Your power.",
    "Consistency is the cheat code.",
    "Do it for future you.",
    "The grind is private. The results aren't.",
    "One more rep. Always.",
    "Pain is temporary. Progress isn't.",
    "Lock in.",
    "Nobody remembers easy workouts.",
    "Your potential has no postcode.",
    "The best sessions start with showing up.",
  ];
  const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
  const motivational = quotes[weekOfYear % quotes.length];

  const hasUpcomingSession = true;
  const pointsBalance = profile?.pod_points ?? 0;
  const daytimeSessions = Math.floor(pointsBalance);
  const eveningSessions = Math.floor(pointsBalance / 1.5);
  const pointsValue = pointsBalance * 7;
  const [valueVisible, setValueVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setValueVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="screen">

      {/* ── HERO HEADER ── */}
      <div style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroNoise} />

        <div style={s.heroTop}>
          <div style={s.heroTopLeft}>
            <p style={s.greetingText} className="fade-up">{greeting},</p>
            <h1 style={s.heroName} className="fade-up fade-up-1">{firstName}.</h1>
          </div>
          <div style={s.logoMark} className="fade-up fade-up-1" onClick={() => navigate('/profile')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </div>
        <div style={s.motivationalBanner} className="fade-up fade-up-2">
          <span style={s.motivationalIcon}>⚡</span>
          <p style={s.motivational}>{motivational}</p>
        </div>

        {/* Session stats strip */}
        <div style={s.statsStrip} className="fade-up fade-up-3">
          <div style={s.statItem}>
            <span style={s.statNum}><CountUp target={sessionsThisMonth} /></span>
            <span style={s.statLabel}>Sessions<br/>this month</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <span style={s.statNum}><CountUp target={84} /></span>
            <span style={s.statLabel}>Total<br/>sessions</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <span style={s.statNum}><CountUp target={9} /></span>
            <span style={s.statLabel}>Week<br/>streak</span>
          </div>
        </div>
      </div>

      <div style={s.body}>

        {/* ── NEXT SESSION CARD ── */}
        <div className="fade-up fade-up-2">
          <p style={s.sectionLabel}>Next session</p>
          {hasUpcomingSession ? (
            <div style={s.nextCard} className="card">
              <div style={s.nextBg} />
              <div style={s.shimmer} />
              <div style={s.nextLeft}>
                <div style={s.nextBadge}>Today · 18:00</div>
                <h3 style={s.nextPod}>PowerPod</h3>
                <p style={s.nextTime}>18:30 – 19:30 · 1 hour</p>
              </div>
              <div style={s.nextRight}>
                <p style={s.codeLabel}>Door code</p>
                <p style={s.codeNum}>7241</p>
                <p style={s.codeSub}>Tap to copy</p>
              </div>
            </div>
          ) : (
            <div style={s.emptyCard} className="card">
              <div style={s.emptyIcon}>🏋️</div>
              <div style={s.emptyText}>
                <p style={s.emptyTitle}>No sessions booked</p>
                <p style={s.emptySub}>Pick a pod and lock in your next session</p>
              </div>
              <button
                className="btn btn--primary btn--sm"
                style={{ flexShrink: 0 }}
                onClick={() => navigate('/book')}
              >
                Book Now
              </button>
            </div>
          )}
        </div>

        {/* ── POD POINTS ── */}
        <div className="fade-up fade-up-3">
          <p style={s.sectionLabel}>Pod Points</p>
          <div style={s.pointsCard} className="card">
            <div style={s.pointsBg} />

            <div style={s.pointsTop}>
              <div style={s.pointsLeft}>
                <p style={s.pointsEyebrow}>Your balance</p>
                <p style={s.pointsBal}>
                  {pointsBalance}
                  <span style={s.pointsBalUnit}> pts</span>
                </p>
                <p style={s.pointsNextFree}>
                  Worth <span style={{ color: '#f5c842' }}>£{pointsValue}</span> · {daytimeSessions} daytime or {eveningSessions} evening sessions
                </p>
              </div>
              <AnimatedCoin />
            </div>

            {/* Value strip */}
            <div style={s.progressWrap}>
              <div style={{
                ...s.valueStrip,
                opacity: valueVisible ? 1 : 0,
                transform: valueVisible ? 'translateY(0)' : 'translateY(6px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}>
                <div style={s.valueItem}>
                  <span style={s.valueNum}>£{pointsValue}</span>
                  <span style={s.valueLabel}>credit value</span>
                </div>
                <div style={s.valueDivider} />
                <div style={s.valueItem}>
                  <span style={s.valueNum}>{daytimeSessions}</span>
                  <span style={s.valueLabel}>daytime sessions</span>
                </div>
                <div style={s.valueDivider} />
                <div style={s.valueItem}>
                  <span style={s.valueNum}>{eveningSessions}</span>
                  <span style={s.valueLabel}>evening sessions</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 16px 16px' }}>
              <button
                className="btn btn--primary btn--sm"
                onClick={() => { navigate('/shop'); setTimeout(() => document.getElementById('top-up')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              >
                Top up points →
              </button>
              <button
                className="btn btn--outline btn--sm"
                style={{ color: '#f5c842', borderColor: 'rgba(245,200,66,0.4)' }}
                onClick={() => { navigate('/shop'); setTimeout(() => document.getElementById('what-are-pod-points')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              >
                What are Pod Points?
              </button>
            </div>
          </div>
        </div>

        {/* ── ACTIVITY GRID ── */}
        <div className="fade-up fade-up-4">
          <div style={s.sectionRow}>
            <p style={s.sectionLabel}>Activity this month</p>
            <span style={s.sectionSub}>{sessionsThisMonth} sessions</span>
          </div>
          {/* Day headers */}
          <div style={s.calHeaders}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} style={s.calHeader}>{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div style={s.activityGrid}>
            {/* Offset empty cells */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`offset-${i}`} style={s.calEmpty} />
            ))}
            {/* Day cells */}
            {activity.map((status, i) => {
              const dayNum = i + 1;
              const isToday = status === 'today';
              const isTrained = status === 'trained';
              const isFuture = status === 'future';
              return (
                <div key={dayNum} style={{
                  ...s.activityDot,
                  background: isToday ? 'var(--red)' : isTrained ? 'var(--navy-light)' : isFuture ? 'rgba(255,255,255,0.02)' : 'var(--w06)',
                  boxShadow: isToday ? '0 0 10px rgba(212,32,40,0.6)' : isTrained ? '0 0 6px rgba(27,58,140,0.4)' : 'none',
                  border: isToday ? '1.5px solid rgba(212,32,40,0.8)' : 'none',
                  animation: 'dotPop 0.3s ease both',
                  animationDelay: `${i * 0.02}s`,
                }}>
                  <span style={{
                    fontSize: '0.58rem',
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? 'var(--white)' : isTrained ? 'rgba(255,255,255,0.9)' : isFuture ? 'var(--w20)' : 'var(--w30)',
                  }}>{dayNum}</span>
                </div>
              );
            })}
          </div>
          <div style={s.activityLegend}>
            <div style={s.legendItem}><div style={{ ...s.legendDot, background: 'var(--navy-light)' }} /><span>Trained</span></div>
            <div style={s.legendItem}><div style={{ ...s.legendDot, background: 'var(--red)' }} /><span>Today</span></div>
            <div style={s.legendItem}><div style={{ ...s.legendDot, background: 'var(--w06)' }} /><span>Rest</span></div>
          </div>
        </div>

        {/* ── LIVE POD STATUS ── */}
        <div className="fade-up fade-up-5">
          <div style={s.sectionRow}>
            <p style={s.sectionLabel}>Live pod status</p>
            <span style={{ ...s.sectionSub, color: '#22c55e' }}>● {freePods} available</span>
          </div>
          <div style={s.podOrbs}>
            {pods.map((pod, i) => (
              <div key={pod.id} style={{ ...s.podOrbWrap, animation: `orbFadeIn 0.4s ease both`, animationDelay: `${0.1 + i * 0.07}s` }} onClick={() => navigate('/pods')}>
                <div style={{
                  ...s.podOrb,
                  background: pod.free ? 'radial-gradient(circle at 35% 35%, rgba(34,197,94,0.3), rgba(34,197,94,0.05))' : 'radial-gradient(circle at 35% 35%, rgba(212,32,40,0.25), rgba(212,32,40,0.05))',
                  borderColor: pod.free ? 'rgba(34,197,94,0.35)' : 'rgba(212,32,40,0.3)',
                  boxShadow: pod.free ? '0 0 16px rgba(34,197,94,0.15)' : '0 0 12px rgba(212,32,40,0.1)',
                }}>
                  <div style={{
                    ...s.podOrbDot,
                    background: pod.free ? '#22c55e' : 'var(--red)',
                    boxShadow: pod.free ? '0 0 8px #22c55e' : '0 0 8px var(--red)',
                    animation: pod.free ? 'pulse 2s infinite' : 'none',
                  }} />
                </div>
                <p style={{ ...s.podOrbName, color: pod.free ? 'var(--w60)' : 'var(--w40)' }}>{pod.name}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── COIN STYLES ── */
const coin = {
  wrap: {
    width: '88px',
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    inset: '-10px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,200,66,0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  img: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    position: 'relative',
    zIndex: 1,
    filter: 'drop-shadow(0 4px 16px rgba(212,160,23,0.4))',
  },
};

/* ── SCREEN STYLES ── */
const s = {
  hero: {
    position: 'relative',
    padding: '52px 20px 20px',
    overflow: 'hidden',
    borderBottom: '1px solid var(--w06)',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 140% 100% at 0% 0%, rgba(27,58,140,0.3) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(212,32,40,0.12) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  heroNoise: {
    position: 'absolute',
    inset: 0,
    opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    pointerEvents: 'none',
  },
  heroTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  heroTopLeft: {},
  greetingText: {
    fontSize: '0.85rem',
    color: 'var(--w40)',
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
  heroName: {
    fontFamily: 'var(--font-head)',
    fontSize: '4rem',
    lineHeight: 0.9,
    letterSpacing: '0.02em',
    color: 'var(--white)',
  },
  motivationalBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(27,58,140,0.15)',
    border: '1px solid rgba(27,58,140,0.3)',
    borderRadius: '10px',
    padding: '10px 14px',
    marginBottom: '16px',
  },
  motivationalIcon: {
    fontSize: '1rem',
    flexShrink: 0,
  },
  motivational: {
    fontSize: '0.85rem',
    color: 'var(--w80)',
    fontWeight: 600,
  },
  logoMark: {
    width: '44px',
    height: '44px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(27,58,140,0.4)',
    flexShrink: 0,
  },
  logoMarkText: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.1rem',
    color: '#fff',
  },
  statsStrip: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--w06)',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
  },
  statNum: {
    fontFamily: 'var(--font-head)',
    fontSize: '2rem',
    lineHeight: 1,
    color: 'var(--white)',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '0.65rem',
    color: 'var(--w40)',
    fontWeight: 600,
    lineHeight: 1.3,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statDivider: {
    width: '1px',
    height: '36px',
    background: 'var(--w06)',
    flexShrink: 0,
  },
  body: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionLabel: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--white)',
    marginBottom: '10px',
    letterSpacing: '0.01em',
  },
  sectionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  sectionSub: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--w40)',
  },

  /* Next session */
  nextCard: {
    display: 'flex',
    alignItems: 'stretch',
    overflow: 'hidden',
    position: 'relative',
  },
  nextBg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(27,58,140,0.2) 0%, rgba(212,32,40,0.08) 100%)',
    pointerEvents: 'none',
  },
  shimmer: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2.5s ease 0.8s 1 forwards',
    pointerEvents: 'none',
    zIndex: 2,
  },
  nextLeft: {
    flex: 1,
    padding: '18px',
    position: 'relative',
  },
  nextBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--navy-light)',
    background: 'rgba(27,58,140,0.15)',
    border: '1px solid rgba(27,58,140,0.3)',
    borderRadius: '20px',
    padding: '3px 10px',
    marginBottom: '8px',
  },
  nextPod: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.6rem',
    lineHeight: 1,
    marginBottom: '4px',
    letterSpacing: '0.02em',
  },
  nextTime: {
    fontSize: '0.78rem',
    color: 'var(--w60)',
  },
  nextRight: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeft: '1px solid var(--w06)',
    background: 'rgba(255,255,255,0.02)',
    minWidth: '90px',
    position: 'relative',
    cursor: 'pointer',
  },
  codeLabel: {
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--red)',
    marginBottom: '4px',
  },
  codeNum: {
    fontFamily: 'var(--font-head)',
    fontSize: '2rem',
    lineHeight: 1,
    letterSpacing: '0.2em',
    color: 'var(--white)',
  },
  codeSub: {
    fontSize: '0.58rem',
    color: 'var(--w30)',
    marginTop: '3px',
  },

  /* Empty state */
  emptyCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '18px',
  },
  emptyIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  emptyText: {
    flex: 1,
  },
  emptyTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'var(--white)',
    marginBottom: '3px',
  },
  emptySub: {
    fontSize: '0.75rem',
    color: 'var(--w40)',
    lineHeight: 1.4,
  },

  /* Activity */
  calHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '4px',
  },
  calHeader: {
    textAlign: 'center',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--w30)',
    padding: '2px 0',
  },
  calEmpty: {
    aspectRatio: '1',
  },
  activityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  activityDot: {
    aspectRatio: '1',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
  },
  activityLegend: {
    display: 'flex',
    gap: '16px',
    marginTop: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.68rem',
    color: 'var(--w40)',
    fontWeight: 500,
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
  },

  /* Pod orbs */
  podOrbs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  podOrbWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  podOrb: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
  },
  podOrbDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  podOrbName: {
    fontSize: '0.62rem',
    fontWeight: 600,
    textAlign: 'center',
    letterSpacing: '0.02em',
    lineHeight: 1.2,
  },

  /* Pod Points */
  pointsCard: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  pointsBg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(27,58,140,0.15) 0%, rgba(212,160,23,0.05) 100%)',
    pointerEvents: 'none',
  },
  pointsTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 20px 12px',
    position: 'relative',
  },
  pointsLeft: {},
  pointsEyebrow: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    marginBottom: '4px',
  },
  pointsBal: {
    fontFamily: 'var(--font-head)',
    fontSize: '3.5rem',
    lineHeight: 1,
    color: 'var(--white)',
    marginBottom: '4px',
  },
  pointsBalUnit: {
    fontSize: '1.5rem',
    color: 'var(--w40)',
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
  },
  pointsNextFree: {
    fontSize: '0.78rem',
    color: 'var(--w60)',
  },
  progressWrap: {
    padding: '0 16px 16px',
    position: 'relative',
  },
  valueStrip: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '10px',
    padding: '12px 16px',
    gap: '0',
  },
  valueItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  valueNum: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.4rem',
    color: '#f5c842',
    lineHeight: 1,
  },
  valueLabel: {
    fontSize: '0.6rem',
    color: 'var(--w40)',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  valueDivider: {
    width: '1px',
    height: '32px',
    background: 'var(--w06)',
  },
};

// Inject coin animation keyframes once
if (!document.getElementById('home-keyframes')) {
  const style = document.createElement('style');
  style.id = 'home-keyframes';
  style.textContent = `
    @keyframes dotPop {
      from { opacity: 0; transform: scale(0.4); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes orbFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }
    @keyframes coinSpin {
      0%   { transform: rotateY(0deg);    box-shadow: 0 4px 20px rgba(212,160,23,0.5), inset 0 2px 4px rgba(255,255,255,0.3); }
      25%  { transform: rotateY(20deg);   box-shadow: 6px 4px 24px rgba(212,160,23,0.6), inset 0 2px 4px rgba(255,255,255,0.3); }
      50%  { transform: rotateY(0deg);    box-shadow: 0 4px 20px rgba(212,160,23,0.5), inset 0 2px 4px rgba(255,255,255,0.3); }
      75%  { transform: rotateY(-20deg);  box-shadow: -6px 4px 24px rgba(212,160,23,0.6), inset 0 2px 4px rgba(255,255,255,0.3); }
      100% { transform: rotateY(0deg);    box-shadow: 0 4px 20px rgba(212,160,23,0.5), inset 0 2px 4px rgba(255,255,255,0.3); }
    }
    @keyframes coinPulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.6; transform: scale(0.85); }
    }
  `;
  document.head.appendChild(style);
}

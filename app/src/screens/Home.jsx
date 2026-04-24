import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const pods = [
  { id: 1, name: 'FitnessPod 1', free: true  },
  { id: 2, name: 'FitnessPod 2', free: true  },
  { id: 3, name: 'FitnessPod 3', free: false },
  { id: 4, name: 'FitnessPod 4', free: true  },
  { id: 5, name: 'HIITPod',      free: false },
  { id: 6, name: 'PowerPod',     free: true  },
];

const freePods = pods.filter(p => p.free).length;

// 30 days of activity — 1 = trained, 0 = rest
const activity = [0,1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,1,0,1,0,0,1,1,0,0,1,0,1];
const sessionsThisMonth = activity.filter(Boolean).length;

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
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const motivational = hour < 12
    ? 'Start strong. The pod is waiting.'
    : hour < 17
    ? 'Midday grind. You\'ve got this.'
    : 'Evening session? Let\'s go.';

  const pointsBalance = 3;
  const pointsToNext = 6;
  const pointsProgress = (pointsBalance / pointsToNext) * 100;

  // Animated progress bar
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(pointsProgress), 400);
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
            <h1 style={s.heroName} className="fade-up fade-up-1">John.</h1>
          </div>
          <div style={s.logoMark} className="fade-up fade-up-1">
            <span style={s.logoMarkText}>FP</span>
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
            <span style={s.statNum}><CountUp target={47} /></span>
            <span style={s.statLabel}>Total<br/>sessions</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <span style={s.statNum}><CountUp target={3} /></span>
            <span style={s.statLabel}>Week<br/>streak</span>
          </div>
        </div>
      </div>

      <div style={s.body}>

        {/* ── NEXT SESSION CARD ── */}
        <div className="fade-up fade-up-2">
          <p style={s.sectionLabel}>Next session</p>
          <div style={s.nextCard} className="card">
            <div style={s.nextBg} />
            <div style={s.shimmer} />
            <div style={s.nextLeft}>
              <div style={s.nextBadge}>Today · 18:00</div>
              <h3 style={s.nextPod}>FitnessPod 1</h3>
              <p style={s.nextTime}>18:00 – 19:00 · 1 hour</p>
            </div>
            <div style={s.nextRight}>
              <p style={s.codeLabel}>Door code</p>
              <p style={s.codeNum}>4829</p>
              <p style={s.codeSub}>Tap to copy</p>
            </div>
          </div>
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
                  <span style={{ color: 'var(--red)' }}>{pointsToNext - pointsBalance} more</span> points until a free session
                </p>
              </div>
              <AnimatedCoin />
            </div>

            {/* Progress bar */}
            <div style={s.progressWrap}>
              <div style={s.progressTrack}>
                <div style={{ ...s.progressFill, width: `${barWidth}%` }} />
              </div>
              <div style={s.progressLabels}>
                <span style={s.progressLabel}>0</span>
                <span style={{ ...s.progressLabel, color: 'var(--red)', fontWeight: 700 }}>FREE SESSION</span>
                <span style={s.progressLabel}>{pointsToNext}</span>
              </div>
            </div>

            <button
              className="btn btn--primary btn--sm"
              style={{ margin: '0 16px 16px', alignSelf: 'flex-start' }}
              onClick={() => navigate('/profile')}
            >
              Top up points →
            </button>
          </div>
        </div>

        {/* ── ACTIVITY GRID ── */}
        <div className="fade-up fade-up-4">
          <div style={s.sectionRow}>
            <p style={s.sectionLabel}>Activity this month</p>
            <span style={s.sectionSub}>{sessionsThisMonth} sessions</span>
          </div>
          <div style={s.activityGrid}>
            {activity.map((active, i) => (
              <div key={i} style={{
                ...s.activityDot,
                background: active ? (i === activity.length - 1 ? 'var(--red)' : 'var(--navy-light)') : 'var(--w06)',
                boxShadow: active ? (i === activity.length - 1 ? '0 0 8px rgba(212,32,40,0.6)' : '0 0 6px rgba(27,58,140,0.5)') : 'none',
                transform: i === activity.length - 1 ? 'scale(1.2)' : 'scale(1)',
                animation: `dotPop 0.3s ease both`,
                animationDelay: `${i * 0.04}s`,
              }} />
            ))}
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
    background: 'linear-gradient(135deg, var(--navy) 50%, var(--red) 50%)',
    borderRadius: '12px',
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

  /* Activity */
  activityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    gap: '6px',
  },
  activityDot: {
    aspectRatio: '1',
    borderRadius: '4px',
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
    padding: '0 16px 8px',
    position: 'relative',
  },
  progressTrack: {
    height: '6px',
    background: 'var(--w06)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--navy-light), #f5c842)',
    borderRadius: '3px',
    transition: 'width 1s ease',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: '0.62rem',
    color: 'var(--w30)',
    fontWeight: 600,
    letterSpacing: '0.06em',
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

import { useNavigate } from 'react-router-dom';

const pods = [
  {
    id: 1, img: '/pod1.jpg', name: 'FitnessPod 1', tag: 'Cardio & Conditioning', free: true,
    desc: 'Treadmill, elliptical, spin bike, rower, dumbbells and more. A complete cardio and conditioning session.',
    equipment: ['Treadmill', 'Elliptical', 'Spin Bike', 'Rowing Machine', 'Dumbbells', 'Resistance Bands'],
    accent: '#22c55e',
  },
  {
    id: 2, img: '/pod2.jpg', name: 'FitnessPod 2', tag: 'Cardio & Conditioning', free: true,
    desc: 'Mirror setup of Pod 1. Perfect for training with a partner on matching cardio and conditioning equipment.',
    equipment: ['Treadmill', 'Elliptical', 'Spin Bike', 'Rowing Machine', 'Dumbbells', 'Kettlebells'],
    accent: '#22c55e',
  },
  {
    id: 3, img: '/pod3.jpg', name: 'FitnessPod 3', tag: 'Strength & Cardio', free: false,
    desc: 'A versatile mix of strength and cardio equipment. Great for full-body training sessions.',
    equipment: ['Barbell & Rack', 'Dumbbells', 'Cable Machine', 'Treadmill', 'Pull-up Bar', 'Bench'],
    accent: '#3b82f6',
  },
  {
    id: 4, img: '/pod4.jpg', name: 'FitnessPod 4', tag: 'Upgraded Equipment', free: true,
    desc: 'Our premium pod. Top-of-the-range equipment for the serious trainer who wants the best.',
    equipment: ['Premium Rack', 'Olympic Barbell', 'Assault Bike', 'GHD Machine', 'Dumbbells to 50kg', 'Cable Stack'],
    accent: '#3b82f6',
  },
  {
    id: 5, img: '/pod5.jpg', name: 'HIITPod', tag: 'High Intensity', free: false,
    desc: 'Built for sweat. Plyometric boxes, battle ropes, sleds and everything you need for high intensity work.',
    equipment: ['Plyo Boxes', 'Battle Ropes', 'Sled Push', 'Assault Bike', 'Kettlebells', 'TRX Suspension'],
    accent: '#f97316',
  },
  {
    id: 6, img: '/pod6.jpg', name: 'PowerPod', tag: 'Strength & Power', free: true,
    desc: 'For those who lift heavy. Power rack, platform, multiple barbells and a serious dumbbell selection.',
    equipment: ['Power Rack', 'Deadlift Platform', 'Multiple Barbells', 'Dumbbells to 60kg', 'Bands & Chains', 'Dip Station'],
    accent: '#e8181a',
  },
];

export default function Pods() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div style={s.header}>
        <p className="eyebrow fade-up">Our Pods</p>
        <h1 style={s.title} className="fade-up fade-up-1">6 Private<br /><span style={{ color: 'var(--red)' }}>Training Pods.</span></h1>
        <p style={s.sub} className="fade-up fade-up-2">Each pod is fully private. Up to 3 people. One flat price — not per person.</p>
      </div>

      <div style={s.list}>
        {pods.map((pod, i) => (
          <div key={pod.id} style={{ ...s.podCard, animationDelay: `${i * 0.06}s` }} className="card fade-up">
            <div style={{ ...s.podAccent, background: pod.accent }} />

            {/* Full width image top */}
            <div style={s.podImgWrap}>
              <img src={pod.img} alt={pod.name} style={s.podImg} />
              <div style={{ ...s.podImgOverlay, background: `linear-gradient(to top, rgba(8,12,24,0.7) 0%, transparent 50%)` }} />
              <div style={s.podImgTags}>
                <span style={{ ...s.tagPill, borderColor: `${pod.accent}50`, color: pod.accent, background: 'rgba(8,12,24,0.7)' }}>
                  {pod.tag}
                </span>
                <span style={{ ...s.statusPill, background: 'rgba(8,12,24,0.7)', color: pod.free ? '#22c55e' : 'var(--red)', borderColor: pod.free ? 'rgba(34,197,94,0.4)' : 'rgba(232,24,26,0.35)' }}>
                  <span style={{ ...s.statusDot, background: pod.free ? '#22c55e' : 'var(--red)' }} />
                  {pod.free ? 'Available' : 'Occupied'}
                </span>
              </div>
            </div>

            {/* Text body */}
            <div style={s.podBody}>
              <h2 style={s.podName}>{pod.name}</h2>
              <p style={s.podDesc}>{pod.desc}</p>
              <div style={s.equipGrid}>
                {pod.equipment.map(e => (
                  <div key={e} style={s.equipItem}>
                    <div style={{ ...s.equipDot, background: pod.accent }} />
                    <span style={s.equipName}>{e}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer: full width */}
            <div style={s.podFooter}>
              <div style={s.priceInfo}>
                <span style={s.priceFrom}>From</span>
                <span style={s.priceAmt}>£6.50<span style={s.priceUnit}>/hr</span></span>
                {!pod.free && (
                  <span style={s.availSoon}>· Free in ~3 hrs</span>
                )}
              </div>
              <button
                className="btn btn--primary btn--sm"
                onClick={() => navigate('/book', { state: { podId: pod.id } })}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
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
    fontSize: '3rem',
    lineHeight: 1,
    margin: '6px 0 10px',
    letterSpacing: '0.02em',
  },
  sub: {
    fontSize: '0.88rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
  },
  list: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  podCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  podAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
    opacity: 0.7,
    zIndex: 1,
  },
  podImgWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
  },
  podImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
  podImgOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  podImgTags: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  podBody: {
    padding: '16px 18px 4px 22px',
  },
  podTags: {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  tagPill: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '3px 8px',
    borderRadius: '20px',
    border: '1px solid',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '3px 8px',
    borderRadius: '20px',
    border: '1px solid',
  },
  statusDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
  },
  podName: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.8rem',
    lineHeight: 1,
    marginBottom: '6px',
    letterSpacing: '0.02em',
  },
  podDesc: {
    fontSize: '0.83rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
  },
  equipGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
    padding: '0 18px 0 22px',
    marginBottom: '16px',
  },
  equipItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  equipDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    flexShrink: 0,
    opacity: 0.7,
  },
  equipName: {
    fontSize: '0.77rem',
    color: 'var(--w60)',
  },
  podFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px 18px 22px',
    borderTop: '1px solid var(--w06)',
  },
  priceInfo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  priceFrom: {
    fontSize: '0.72rem',
    color: 'var(--w40)',
  },
  priceAmt: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.4rem',
    color: 'var(--white)',
    lineHeight: 1,
  },
  priceUnit: {
    fontSize: '0.8rem',
    fontFamily: 'var(--font-body)',
    color: 'var(--w40)',
    fontWeight: 400,
  },
  priceCap: {
    fontSize: '0.72rem',
    color: 'var(--w40)',
  },
  availSoon: {
    fontSize: '0.72rem',
    color: '#f59e0b',
    fontWeight: 600,
  },
};

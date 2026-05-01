import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const bundles = [
  { pts: 3,  bonus: 0, price: 21,  tag: null,           giftFriendly: true  },
  { pts: 5,  bonus: 1, price: 35,  tag: null,           giftFriendly: false },
  { pts: 9,  bonus: 2, price: 63,  tag: 'Most Popular', giftFriendly: false },
  { pts: 20, bonus: 5, price: 140, tag: 'Best Value',   giftFriendly: false },
];

export default function Shop() {
  const [mode, setMode] = useState('me');
  const [selected, setSelected] = useState(1);
  const [gift, setGift] = useState({ name: '', email: '', message: '' });

  const bundle = bundles[selected];

  return (
    <div className="screen">
      <div style={s.header}>
        <div style={s.headerBg} />
        <p className="eyebrow fade-up" style={{ position: 'relative' }}>Pod Points</p>
        <h1 style={s.title} className="fade-up fade-up-1">
          Load Up.<br /><span style={{ color: 'var(--red)' }}>Save More.</span>
        </h1>
        <p style={s.headerSub} className="fade-up fade-up-1">
          Buy points upfront, use them to book any session. Points never expire.
        </p>
      </div>

      <div style={s.body}>

        {/* For Me / For a Gift toggle */}
        <div style={s.toggle} className="fade-up">
          <button
            style={{ ...s.toggleBtn, ...(mode === 'me' ? s.toggleBtnActive : {}) }}
            onClick={() => setMode('me')}
          >
            For Me
          </button>
          <button
            style={{ ...s.toggleBtn, ...(mode === 'gift' ? s.toggleBtnActiveGift : {}) }}
            onClick={() => setMode('gift')}
          >
            🎁 For a Gift
          </button>
        </div>

        {/* Gift intro */}
        {mode === 'gift' && (
          <div style={s.giftIntro} className="card fade-up">
            <p style={s.giftIntroTitle}>Sending a Gift?</p>
            <p style={s.giftIntroText}>
              The £21 Starter is perfect for a gift — great value without overspending. Choose any bundle below, personalise it, and we'll send it straight to them.
            </p>
          </div>
        )}

        {/* Bundles */}
        <div id="top-up" className="fade-up fade-up-1">
          <p style={s.sectionLabel}>
            {mode === 'me' ? 'Choose your bundle' : 'Choose a bundle to gift'}
          </p>
          <div style={s.bundleList}>
            {bundles.map((b, i) => (
              <div
                key={i}
                style={{
                  ...s.bundle,
                  ...(selected === i ? (mode === 'gift' ? s.bundleSelectedGift : s.bundleSelected) : {}),
                  ...(mode === 'gift' && b.giftFriendly ? s.bundleGiftHighlight : {}),
                }}
                className="card"
                onClick={() => setSelected(i)}
              >
                <div style={s.bundleBg} />
                {b.tag && <div style={s.bundleTag}>{b.tag}</div>}
                {mode === 'gift' && b.giftFriendly && (
                  <div style={s.giftTag}>Gift Friendly</div>
                )}

                {/* Check */}
                <div style={{ ...s.check, ...(selected === i ? (mode === 'gift' ? s.checkActiveGift : s.checkActive) : {}) }}>
                  {selected === i && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                <div style={s.bundleLeft}>
                  <div style={s.bundlePtsRow}>
                    <span style={s.bundlePts}>{b.pts + b.bonus}</span>
                    <span style={s.bundlePtsUnit}>pts</span>
                  </div>
                  {b.bonus > 0 ? (
                    <div style={s.bundleOfferRow}>
                      <span style={s.bundleOfferBought}>{b.pts} bought</span>
                      <span style={s.bundleOfferPlus}>+</span>
                      <span style={s.bundleOfferFree}>{b.bonus} FREE</span>
                    </div>
                  ) : (
                    <p style={s.bundleNoBonus}>No bonus — just points</p>
                  )}
                </div>
                <div style={s.bundleRight}>
                  <p style={s.bundlePrice}>£{b.price}</p>
                  {b.bonus > 0 && (
                    <p style={s.bundleSaving}>Save £{b.bonus * 7}</p>
                  )}
                  <p style={s.bundlePerPt}>£{(b.price / (b.pts + b.bonus)).toFixed(2)}/pt</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gift personalisation */}
        {mode === 'gift' && (
          <div className="fade-up fade-up-2">
            <p style={s.sectionLabel}>Personalise your gift</p>
            <div style={s.giftForm} className="card">
              <div style={s.field}>
                <label style={s.fieldLabel}>Recipient's Name</label>
                <input
                  style={s.fieldInput}
                  placeholder="e.g. Sarah"
                  value={gift.name}
                  onChange={e => setGift({ ...gift, name: e.target.value })}
                />
              </div>
              <div style={s.fieldDivider} />
              <div style={s.field}>
                <label style={s.fieldLabel}>Recipient's Email</label>
                <input
                  style={s.fieldInput}
                  type="email"
                  placeholder="sarah@example.com"
                  value={gift.email}
                  onChange={e => setGift({ ...gift, email: e.target.value })}
                />
              </div>
              <div style={s.fieldDivider} />
              <div style={s.field}>
                <label style={s.fieldLabel}>Personal Message (optional)</label>
                <textarea
                  style={{ ...s.fieldInput, ...s.fieldTextarea }}
                  placeholder="Happy birthday — go smash it! 💪"
                  value={gift.message}
                  onChange={e => setGift({ ...gift, message: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={s.ctaBar} className="fade-up fade-up-2">
          <div>
            <p style={s.ctaLabel}>{mode === 'me' ? 'You get' : 'They get'}</p>
            <p style={s.ctaPoints}>{bundle.pts + bundle.bonus} <span style={s.ctaPointsUnit}>points</span></p>
          </div>
          <div style={s.ctaRight}>
            <p style={s.ctaPrice}>£{bundle.price}</p>
            <button className="btn btn--primary" style={s.ctaBtn}>
              {mode === 'me' ? 'Buy Now' : 'Send Gift →'}
            </button>
          </div>
        </div>

        {/* What are Pod Points */}
        <div id="what-are-pod-points" style={s.explainer} className="card fade-up fade-up-3">
          <p style={s.explainerTitle}>What are Pod Points?</p>
          <p style={s.explainerBody}>
            Instead of paying each time you book, you buy points upfront in bundles — and use them whenever you want. The more you buy at once, the more you save. Simple as that.
          </p>
          <p style={s.explainerTitle}>How points work</p>
          <div style={s.explainerRules}>
            <div style={s.explainerRule}>
              <span style={s.explainerIcon}>☀️</span>
              <span><strong>1 point</strong> = 1 daytime session (before 4:30pm)</span>
            </div>
            <div style={s.explainerRule}>
              <span style={s.explainerIcon}>🌙</span>
              <span><strong>1.5 points</strong> = 1 evening session (after 4:30pm)</span>
            </div>
            <div style={s.explainerRule}>
              <span style={s.explainerIcon}>♾️</span>
              <span>Points <strong>never expire</strong></span>
            </div>
          </div>
          <p style={s.explainerFooter}>Your points are always there when you are.</p>
        </div>

        {/* Coming Soon shop */}
        <div className="fade-up fade-up-3">
          <p style={s.sectionLabel}>Shop — Coming Soon</p>
          <div style={s.comingSoon} className="card">
            <p style={s.comingSoonText}>Branded gear, water bottles and more dropping soon.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

const s = {
  header: {
    padding: '56px 20px 24px',
    borderBottom: '1px solid var(--w06)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerBg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(27,58,140,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, rgba(212,32,40,0.1) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.8rem',
    lineHeight: 1,
    marginTop: '6px',
    letterSpacing: '0.02em',
    position: 'relative',
  },
  headerSub: {
    fontSize: '0.82rem',
    color: 'var(--w40)',
    marginTop: '10px',
    lineHeight: 1.5,
    position: 'relative',
  },
  body: {
    padding: '20px 16px 120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  toggle: {
    display: 'flex',
    background: 'var(--bg2)',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid var(--w06)',
    gap: '4px',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '9px',
    border: 'none',
    background: 'none',
    color: 'var(--w40)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  toggleBtnActive: {
    background: 'var(--red)',
    color: '#fff',
  },
  toggleBtnActiveGift: {
    background: 'var(--navy)',
    color: '#fff',
  },
  bundleSelectedGift: {
    border: '1.5px solid var(--navy-light)',
  },
  checkActiveGift: {
    background: 'var(--navy)',
    border: '1.5px solid var(--navy-light)',
  },
  giftIntro: {
    padding: '16px',
    background: 'rgba(27,58,140,0.08)',
    border: '1px solid rgba(27,58,140,0.2)',
  },
  giftIntroTitle: {
    fontFamily: 'var(--font-head)',
    fontSize: '1rem',
    letterSpacing: '0.03em',
    marginBottom: '6px',
  },
  giftIntroText: {
    fontSize: '0.8rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
  },
  sectionLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    marginBottom: '10px',
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
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1.5px solid var(--w06)',
    transition: 'border-color 0.2s',
  },
  bundleSelected: {
    border: '1.5px solid var(--red)',
  },
  bundleGiftHighlight: {
    border: '1.5px solid rgba(27,58,140,0.5)',
  },
  bundleBg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(212,160,23,0.06) 0%, transparent 60%)',
    pointerEvents: 'none',
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
  giftTag: {
    position: 'absolute',
    top: '-1px',
    left: '12px',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'var(--navy)',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '0 0 6px 6px',
  },
  check: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1.5px solid var(--w20)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: '12px',
    transition: 'all 0.2s',
  },
  checkActive: {
    background: 'var(--red)',
    border: '1.5px solid var(--red)',
  },
  bundleLeft: { flex: 1, position: 'relative' },
  bundlePtsRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '4px',
  },
  bundlePts: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.4rem',
    lineHeight: 1,
    color: '#f5c842',
  },
  bundlePtsUnit: {
    fontSize: '0.9rem',
    color: 'rgba(245,200,66,0.7)',
    fontWeight: 600,
  },
  bundleOfferRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  bundleOfferBought: {
    fontSize: '0.75rem',
    color: 'var(--w60)',
  },
  bundleOfferPlus: {
    fontSize: '0.75rem',
    color: 'var(--w30)',
  },
  bundleOfferFree: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#22c55e',
    letterSpacing: '0.04em',
  },
  bundleNoBonus: {
    fontSize: '0.72rem',
    color: 'var(--w30)',
  },
  bundleRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
    position: 'relative',
  },
  bundlePrice: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.6rem',
    color: 'var(--white)',
    lineHeight: 1,
  },
  bundleSaving: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#22c55e',
  },
  bundlePerPt: {
    fontSize: '0.65rem',
    color: 'var(--w30)',
  },
  giftForm: {
    padding: '0',
    overflow: 'hidden',
  },
  field: {
    padding: '14px 16px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    marginBottom: '7px',
  },
  fieldInput: {
    width: '100%',
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--white)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.92rem',
    padding: 0,
  },
  fieldTextarea: {
    resize: 'none',
    height: '70px',
    lineHeight: 1.6,
  },
  fieldDivider: {
    height: '1px',
    background: 'var(--w06)',
    margin: '0 16px',
  },
  explainer: {
    padding: '16px',
  },
  explainerTitle: {
    fontFamily: 'var(--font-head)',
    fontSize: '1rem',
    letterSpacing: '0.02em',
    marginBottom: '8px',
  },
  explainerBody: {
    fontSize: '0.82rem',
    color: 'var(--w60)',
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  explainerFooter: {
    fontSize: '0.8rem',
    color: '#f5c842',
    fontWeight: 600,
    borderTop: '1px solid var(--w06)',
    paddingTop: '12px',
    marginTop: '14px',
  },
  explainerRules: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  explainerRule: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.82rem',
    color: 'var(--w60)',
    lineHeight: 1.5,
  },
  explainerIcon: {
    fontSize: '1rem',
    flexShrink: 0,
  },
  ctaBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg2)',
    border: '1px solid var(--w06)',
    borderRadius: '16px',
    padding: '16px 20px',
  },
  ctaLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    marginBottom: '3px',
  },
  ctaPoints: {
    fontFamily: 'var(--font-head)',
    fontSize: '2rem',
    lineHeight: 1,
    color: '#f5c842',
  },
  ctaPointsUnit: {
    fontSize: '1rem',
    color: 'rgba(245,200,66,0.7)',
  },
  ctaRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  ctaPrice: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.6rem',
    color: 'var(--white)',
    lineHeight: 1,
  },
  ctaBtn: {
    padding: '10px 24px',
    fontSize: '0.9rem',
  },
  comingSoon: {
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '64px',
  },
  comingSoonText: {
    fontSize: '0.82rem',
    color: 'var(--w30)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};

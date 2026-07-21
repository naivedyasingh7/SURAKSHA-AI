import React, { useRef, useEffect } from 'react';

export default function Hero() {
  const graphicRef = useRef(null);

  useEffect(() => {
    const el = graphicRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.06}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stats = [
    { n: '99.4%',  l: 'Detection Accuracy' },
    { n: '$14.2M+',l: 'Citizen Wealth Saved' },
    { n: '<2.4s',  l: 'Alert Latency' },
    { n: '65+',    l: 'Syndicates Mapped' },
  ];

  const pingDots = [
    { top: '22%', left: '74%', delay: '0s' },
    { top: '68%', left: '12%', delay: '0.7s' },
    { top: '80%', left: '66%', delay: '1.3s' },
  ];

  return (
    <section className="hero-section" id="hero" aria-label="Hero section">
      {/* Background grid */}
      <div className="hero-bg-grid" aria-hidden="true" />

      {/* Ambient glow */}
      <div className="hero-glow" aria-hidden="true" />

      {/* Gradient fade bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '240px',
        background: 'linear-gradient(to bottom, transparent, var(--c-bg))',
        zIndex: 1, pointerEvents: 'none',
      }} aria-hidden="true" />

      <div className="wrap" style={{ position: 'relative', zIndex: 2, paddingBlock: '80px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '80px',
          alignItems: 'center',
        }}>
          {/* Left — text content */}
          <div style={{ animation: 'fadeUp 0.9s 0.1s ease both', opacity: 0 }}>

            {/* Badge */}
            <div className="hero-badge" role="status">
              <span className="hero-badge-dot" aria-hidden="true" />
              AI-Powered Public Safety Platform
            </div>

            {/* Headline */}
            <h1 className="hero-title">
              Predict.<br />
              Detect.<br />
              <span className="accent-word">Prevent.</span>
            </h1>

            {/* Body */}
            <p className="hero-body">
              AI-powered fraud intelligence that scans scams, flags counterfeits,
              and maps organized crime networks — before financial damage reaches citizens.
            </p>

            {/* CTAs */}
            <div className="hero-ctas">
              <a href="#console" className="btn-primary btn-primary-lg" id="hero-scan-cta">
                Scan Now
                <svg className="btn-arrow-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6.667 4L5.727 4.94 8.78 8l-3.053 3.06L6.667 12 10.667 8z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#about" className="btn-ghost" id="hero-arch-cta">
                View Architecture
              </a>
            </div>

            {/* Stats strip */}
            <div className="hero-stats">
              {stats.map((s, i) => (
                <div key={i} className="hero-stat">
                  <div className="hero-stat-number">{s.n}</div>
                  <div className="hero-stat-label">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — animated graphic */}
          <div ref={graphicRef} className="hero-graphic anim-float" aria-hidden="true">
            {/* Outer rings */}
            <div className="hero-orb-outer" />
            <div className="hero-orb-mid" />
            <div className="hero-orb-inner" />

            {/* Radar sweep */}
            <div className="hero-radar" />

            {/* Center glow orb */}
            <div className="hero-center-orb" />

            {/* Ping dots */}
            {pingDots.map((d, i) => (
              <span key={i} className="hero-ping" style={{
                top: d.top, left: d.left,
                animationDelay: d.delay,
              }} />
            ))}

            {/* HUD labels */}
            <span style={{
              position: 'absolute', top: '12px', left: '16px',
              fontFamily: 'var(--ff-mono)',
              fontSize: '11px',
              color: 'rgba(154,253,13,0.5)',
              letterSpacing: '0.08em',
            }}>IDX:SCAN</span>
            <span style={{
              position: 'absolute', bottom: '12px', right: '16px',
              fontFamily: 'var(--ff-mono)',
              fontSize: '11px',
              color: 'rgba(154,253,13,0.5)',
              letterSpacing: '0.08em',
            }}>IPS:14.2M</span>

            {/* Corner decorations */}
            {[
              { top: 0, left: 0, borderTop: '2px solid', borderLeft: '2px solid' },
              { top: 0, right: 0, borderTop: '2px solid', borderRight: '2px solid' },
              { bottom: 0, left: 0, borderBottom: '2px solid', borderLeft: '2px solid' },
              { bottom: 0, right: 0, borderBottom: '2px solid', borderRight: '2px solid' },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '16px', height: '16px',
                borderColor: 'rgba(154,253,13,0.3)',
                ...c,
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

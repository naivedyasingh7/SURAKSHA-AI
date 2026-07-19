import React, { useRef, useEffect } from 'react';

export default function Hero() {
  const graphicRef = useRef(null);

  useEffect(() => {
    const el = graphicRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.08}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section style={{
      position: 'relative',
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '6.4rem',
      overflow: 'hidden',
      background: 'var(--c-bg)',
    }}>

      {/* Very subtle full-page bg video */}
      <video autoPlay loop muted playsInline style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        opacity: 0.04,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <source src="https://cdn.prod.website-files.com/69f1c9530d79cd8950e607b9/69f1c9530d79cd8950e607db_41625c0e89b8e8ccccfdbc014541de6c_mp4.mp4" type="video/mp4" />
      </video>

      {/* Subtle bottom gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '24rem',
        background: 'linear-gradient(to bottom, transparent, var(--c-bg))',
        zIndex: 1, pointerEvents: 'none',
      }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 2, paddingBlock: '10rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8rem', alignItems: 'center' }}>

          {/* Left — text */}
          <div style={{ animation: 'fadeUp 0.9s 0.1s ease both', opacity: 0 }}>

            {/* Overline */}
            <p className="t-label" style={{ marginBottom: '3.2rem' }}>
              AI-Powered Public Safety Platform
            </p>

            {/* Headline */}
            <h1 className="t-display" style={{ marginBottom: '3.2rem', color: 'var(--c-text)' }}>
              Predict.<br />
              Detect.<br />
              Prevent.
            </h1>

            {/* Body */}
            <p className="t-body" style={{ maxWidth: '46rem', marginBottom: '4.8rem' }}>
              AI-powered fraud intelligence that scans scams, flags counterfeits,
              and maps organized crime networks — before financial damage reaches citizens.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1.4rem', flexWrap: 'wrap' }}>
              <a href="#console" className="btn-primary">
                Scan Now
                <svg className="btn-arrow-icon" viewBox="0 0 16 16" fill="none">
                  <path d="M6.667 4L5.727 4.94 8.78 8l-3.053 3.06L6.667 12 10.667 8z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#about" className="btn-ghost">
                View Architecture
              </a>
            </div>

          </div>

          {/* Right — minimal graphic */}
          <div ref={graphicRef} style={{
            position: 'relative',
            width: '38rem',
            height: '38rem',
            flexShrink: 0,
          }}>

            {/* Outer slow-rotating ring */}
            <div className="anim-rotate" style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.06)',
            }} />
            {/* Second ring */}
            <div className="anim-rotate-rev" style={{
              position: 'absolute', inset: '12%',
              borderRadius: '50%',
              border: '1px dashed rgba(221,64,34,0.12)',
            }} />
            {/* Inner ring */}
            <div className="anim-rotate" style={{
              position: 'absolute', inset: '26%',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.04)',
            }} />

            {/* Radar conic sweep */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(221,64,34,0.05) 0deg, transparent 80deg)',
              animation: 'rotation 6s linear infinite',
            }} />

            {/* Center orb with video */}
            <div style={{
              position: 'absolute',
              inset: '30%',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#1a1a1a',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle, transparent 40%, var(--c-bg) 100%)',
                zIndex: 2,
              }} />
              <video autoPlay loop muted playsInline style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: 0.6,
                mixBlendMode: 'screen',
              }}>
                <source src="https://cdn.prod.website-files.com/69f1c9530d79cd8950e607b9/69f1c9530d79cd8950e607db_41625c0e89b8e8ccccfdbc014541de6c_mp4.mp4" type="video/mp4" />
              </video>
            </div>

            {/* 3 ping dots */}
            {[
              { top: '18%', left: '72%', c: 'var(--c-accent)' },
              { top: '66%', left: '10%', c: 'var(--c-accent-2)' },
              { top: '78%', left: '68%', c: 'var(--c-accent)' },
            ].map((d, i) => (
              <span key={i} className="anim-pulse-dot" style={{
                position: 'absolute',
                top: d.top, left: d.left,
                width: '0.5rem', height: '0.5rem',
                borderRadius: '50%',
                background: d.c,
                animationDelay: `${i * 0.6}s`,
              }} />
            ))}

            {/* HUD mono labels */}
            {[
              { pos: { top: '1rem', left: '1.6rem' }, text: 'IDX:SCAN', color: 'var(--c-muted)' },
              { pos: { bottom: '1rem', right: '1.6rem' }, text: 'IPS:14.2M', color: 'var(--c-accent)' },
            ].map((h, i) => (
              <span key={i} style={{
                position: 'absolute', ...h.pos,
                fontFamily: 'var(--ff-mono)',
                fontSize: '0.9rem',
                color: h.color,
                opacity: 0.5,
                letterSpacing: '0.06em',
              }}>{h.text}</span>
            ))}
          </div>

        </div>

        {/* Stats strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: '0',
          marginTop: '8rem',
          borderTop: '1px solid var(--c-border)',
        }}>
          {[
            { n: '99.4%',  l: 'Detection Accuracy' },
            { n: '$14.2M+',l: 'Citizen Wealth Saved' },
            { n: '<2.4s',  l: 'Average Alert Latency' },
            { n: '65+',    l: 'Syndicates Mapped' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '3.2rem 0 3.2rem',
              borderRight: i < 3 ? '1px solid var(--c-border)' : 'none',
              paddingLeft: i > 0 ? '3.2rem' : 0,
            }}>
              <div style={{
                fontFamily: 'var(--ff-display)',
                fontSize: '3.6rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--c-text)',
                lineHeight: 1,
                marginBottom: '0.8rem',
              }}>{s.n}</div>
              <div className="t-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

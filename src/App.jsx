import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';

import Header from './components/Header';
import Hero from './components/Hero';
import ScamShield from './components/ScamShield';
import CurrencyGuard from './components/CurrencyGuard';
import FraudMatrix from './components/FraudMatrix';
import CitizenBot from './components/CitizenBot';
import Footer from './components/Footer';

/* ── Loading screen words ─────────────────────────────── */
const LOAD_WORDS = ['Secure', 'सुरक्षित', 'सेफ़', 'ভদ্র', 'Safe', 'ਸੁਰੱਖਿਅਤ'];

export default function App() {
  const [loading, setLoading]       = useState(true);
  const [loadWordIdx, setWordIdx]   = useState(0);
  const [activeTab, setActiveTab]   = useState('scam');
  const [sent, setSent]             = useState(false);
  const [org, setOrg]               = useState('');
  const [email, setEmail]           = useState('');
  const [scope, setScope]           = useState('');

  /* ── Loading screen ─── */
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < LOAD_WORDS.length) {
        setWordIdx(i);
      } else {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 300);
      }
    }, 320);
    return () => clearInterval(interval);
  }, []);

  /* ── Lenis smooth scroll ─── */
  useEffect(() => {
    if (loading) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [loading]);

  /* ── Fade-up on scroll ─── */
  useEffect(() => {
    if (loading) return;
    const els = document.querySelectorAll('[data-fade]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animationDelay = e.target.dataset.delay || '0s';
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [loading]);

  /* ── Stat ring reveal ─── */
  useEffect(() => {
    if (loading) return;
    const rings = document.querySelectorAll('.stat-ring');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.4 });
    rings.forEach(r => io.observe(r));
    return () => io.disconnect();
  }, [loading]);

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setOrg(''); setEmail(''); setScope(''); }, 4000);
  };

  const tabs = [
    { id: 'scam',     label: 'Scam Shield' },
    { id: 'currency', label: 'Currency Guard' },
    { id: 'network',  label: 'Fraud Matrix' },
    { id: 'citizen',  label: 'Citizen Bot' },
  ];

  const tickerItems = [
    { city: 'MUMBAI',    event: 'UPI Mule Blocked',             val: '₹45,000',    accent: true  },
    { city: 'DELHI',     event: 'Fake CBI Officer Intercepted', val: '1 Alert',    accent: false },
    { city: 'BANGALORE', event: 'Deepfake Call Flagged',        val: 'HIGH RISK',  accent: true  },
    { city: 'HYDERABAD', event: 'Crypto Mule Wallet Frozen',    val: '42 Accounts',accent: false },
    { city: 'CHENNAI',   event: 'Electricity Scam Blocked',     val: '1,280 SMS',  accent: true  },
    { city: 'KOLKATA',   event: 'Fake ₹500 Note Detected',      val: 'COUNTERFEIT',accent: false },
  ];

  return (
    <>
      {/* ── Loading screen ─────────────────────── */}
      <div
        className={`loading-screen${loading ? '' : ' hidden'}`}
        role="status"
        aria-live="polite"
        aria-label="Loading Suraksha AI"
      >
        <div style={{ position: 'relative', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {LOAD_WORDS.map((word, i) => (
            <span
              key={i}
              className={`loading-word${i === loadWordIdx ? ' active' : ''}`}
            >
              {word}<span className="loading-dot" />
            </span>
          ))}
        </div>
        <div className="loading-bar" />
      </div>

      {/* ── Main app ───────────────────────────── */}
      <div style={{ background: 'var(--c-bg)', color: 'var(--c-text)', minHeight: '100vh', opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease 0.2s' }}>
        <Header />
        <main id="main-content">
          <Hero />

          {/* ── Ticker ─────────────────────────── */}
          <div className="ticker-wrap" role="marquee" aria-label="Live threat feed">
            <div className="marquee-wrap">
              <div className="marquee-inner anim-marquee" style={{ display: 'flex' }}>
                {[...Array(3)].map((_, d) => (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {tickerItems.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 32px', flexShrink: 0 }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em',
                          color: item.accent ? 'var(--c-accent)' : 'var(--c-teal)',
                        }}>{item.city}</span>
                        <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--c-muted)' }}>{item.event}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'white', fontFamily: 'var(--ff-mono)' }}>{item.val}</span>
                        <span style={{ width: 1, height: '14px', background: 'var(--c-border)', flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── About / Intelligence Matrix ────── */}
          <section id="about" className="section" aria-labelledby="about-heading">
            <div className="wrap">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
                <div data-fade>
                  <span className="t-overline">The Intelligence Matrix</span>
                  <h2 id="about-heading" className="t-h2">
                    Suraksha AI operates at the intersection of machine intelligence and public safety.
                  </h2>
                </div>
                <div data-fade data-delay="0.15s">
                  <p className="t-body" style={{ marginBottom: '32px' }}>
                    We don't wait for fraud reports. Our system detects scam patterns, counterfeit currency, and organized fraud networks in real time — issuing instant citizen alerts and feeding verified threat data into law enforcement registries.
                  </p>
                  <a href="#console" className="btn-primary btn-primary-lg" id="about-explore-cta">
                    Explore Platform
                    <svg className="btn-arrow-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M6.667 4L5.727 4.94 8.78 8l-3.053 3.06L6.667 12 10.667 8z" fill="currentColor"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Capabilities list */}
              <div style={{ marginTop: '80px' }}>
                {[
                  { n: '01', title: 'Scam Detection',          desc: 'Detects fake authority threats, urgency manipulation, and phishing in audio and text.' },
                  { n: '02', title: 'Fake Currency Detection', desc: 'Computer vision checks watermarks, thread patterns, and print accuracy against RBI specs.' },
                  { n: '03', title: 'Fraud Network Mapping',   desc: 'Graph clustering connects phone numbers, UPI handles, and mule accounts.' },
                  { n: '04', title: 'Citizen Protection',      desc: 'Instant chatbot risk scoring and protective action guidance for users under active threat.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="capability-row"
                    data-fade
                    data-delay={`${i * 0.1}s`}
                    style={{ borderTop: '1px solid var(--c-border)' }}
                  >
                    <span className="t-mono" style={{ letterSpacing: '0.06em' }}>{item.n}</span>
                    <span className="t-h3" style={{ fontSize: '20px' }}>{item.title}</span>
                    <span className="t-body" style={{ fontSize: '15px' }}>{item.desc}</span>
                  </div>
                ))}
                <div className="divider" />
              </div>
            </div>
          </section>

          {/* ── Console ─────────────────────────── */}
          <section
            id="console"
            style={{
              borderTop: '1px solid var(--c-border)',
              background: 'var(--c-bg-2)',
              padding: '120px 0',
            }}
            aria-labelledby="console-heading"
          >
            <div className="wrap">
              <div style={{ marginBottom: '48px' }} data-fade>
                <span className="t-overline">Interactive Console</span>
                <h2 id="console-heading" className="t-h2">Suraksha Intel Platform</h2>
              </div>

              <div className="tab-bar" role="tablist" aria-label="Platform features">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    id={`tab-${t.id}`}
                    role="tab"
                    aria-selected={activeTab === t.id}
                    aria-controls={`panel-${t.id}`}
                    className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                className="panel"
              >
                {activeTab === 'scam'     && <ScamShield />}
                {activeTab === 'currency' && <CurrencyGuard />}
                {activeTab === 'network'  && <FraudMatrix />}
                {activeTab === 'citizen'  && <CitizenBot />}
              </div>
            </div>
          </section>

          {/* ── Methodology ─────────────────────── */}
          <section
            id="methodology"
            className="section"
            style={{ borderTop: '1px solid var(--c-border)' }}
            aria-labelledby="methodology-heading"
          >
            <div className="wrap">
              <div style={{ marginBottom: '60px' }} data-fade>
                <span className="t-overline">System Operations</span>
                <h2 id="methodology-heading" className="t-h2">How It Works</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
                {[
                  { n: '01', title: 'Ingest & Monitor',   desc: 'Passive telemetry captures suspicious payloads — messages, audio calls, and scan images from device endpoints.' },
                  { n: '02', title: 'Neural Assessment',  desc: 'Semantic, visual, and behavioral models analyze all parameters for high-probability threat signatures.' },
                  { n: '03', title: 'Syndicate Linking',  desc: 'Identified threats map into a global graph connecting mule accounts, UPI handles, and phone rings.' },
                  { n: '04', title: 'Neutralize & Alert', desc: 'Instant citizen warnings blast while threat data feeds cyber-crime registries to freeze accounts.' },
                ].map((s, i) => (
                  <div key={i} className="card" data-fade data-delay={`${i * 0.12}s`}>
                    <span className="card-number">{s.n}</span>
                    <h3 className="t-h3" style={{ fontSize: '18px', marginBottom: '14px' }}>{s.title}</h3>
                    <p className="t-body" style={{ fontSize: '14px', lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Contact ──────────────────────────── */}
          <section
            id="contact"
            style={{
              borderTop: '1px solid var(--c-border)',
              background: 'var(--c-bg-2)',
              padding: '120px 0',
            }}
            aria-labelledby="contact-heading"
          >
            <div className="wrap">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'start' }}>

                <div data-fade>
                  <span className="t-overline">Threat Integration</span>
                  <h2 id="contact-heading" className="t-h2" style={{ marginBottom: '28px' }}>
                    Sync With The Threat Database
                  </h2>
                  <p className="t-body">
                    For financial institutions, telecom operators, or law enforcement agencies looking to interface with Suraksha AI's predictive threat API and real-time alert registry.
                  </p>

                  {/* Trust signals */}
                  <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      '🔒 End-to-end encrypted API',
                      '⚡ <100ms average response time',
                      '📊 Real-time threat registry sync',
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        fontSize: '14px', color: 'var(--c-muted)',
                      }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div data-fade data-delay="0.15s">
                  {sent ? (
                    <div style={{
                      background: 'rgba(154,253,13,0.06)',
                      border: '1px solid rgba(154,253,13,0.2)',
                      borderRadius: '20px',
                      padding: '48px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '40px', marginBottom: '20px' }}>✓</div>
                      <h3 className="t-h3" style={{ marginBottom: '14px' }}>Request Received</h3>
                      <p className="t-body">API specifications will be dispatched within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} noValidate>
                      {[
                        { label: 'Organization',   value: org,   set: setOrg,   type: 'text',  ph: 'Cyber Crime Division', id: 'contact-org'   },
                        { label: 'Official Email', value: email, set: setEmail, type: 'email', ph: 'officer@org.gov.in',   id: 'contact-email' },
                      ].map((f) => (
                        <div key={f.id}>
                          <label htmlFor={f.id} className="form-label">{f.label}</label>
                          <input
                            id={f.id}
                            type={f.type}
                            required
                            value={f.value}
                            placeholder={f.ph}
                            onChange={e => f.set(e.target.value)}
                            className="form-input"
                          />
                        </div>
                      ))}
                      <div>
                        <label htmlFor="contact-scope" className="form-label">Integration Scope</label>
                        <textarea
                          id="contact-scope"
                          required
                          rows={4}
                          value={scope}
                          placeholder="Context, timing, or telemetry requirements..."
                          onChange={e => setScope(e.target.value)}
                          className="form-input"
                          style={{ resize: 'none' }}
                        />
                      </div>
                      <div>
                        <button type="submit" className="btn-primary btn-primary-lg" id="contact-submit">
                          Request API Access
                          <svg className="btn-arrow-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M6.667 4L5.727 4.94 8.78 8l-3.053 3.06L6.667 12 10.667 8z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

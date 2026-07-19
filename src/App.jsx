import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';

import Header from './components/Header';
import Hero from './components/Hero';
import ScamShield from './components/ScamShield';
import CurrencyGuard from './components/CurrencyGuard';
import FraudMatrix from './components/FraudMatrix';
import CitizenBot from './components/CitizenBot';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('scam');
  const [sent, setSent] = useState(false);
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('');

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Fade-up on scroll
  useEffect(() => {
    const els = document.querySelectorAll('[data-fade]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.delay || '0s';
          e.target.style.animationDelay = delay;
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Stat ring reveal
  useEffect(() => {
    const rings = document.querySelectorAll('.stat-ring');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.4 });
    rings.forEach(r => io.observe(r));
    return () => io.disconnect();
  }, []);

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

  const inputStyle = {
    display: 'block',
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--c-border)',
    color: 'var(--c-text)',
    fontFamily: 'var(--ff-sans)',
    fontSize: '1.4rem',
    fontWeight: 500,
    padding: '1.2rem 0',
    outline: 'none',
    transition: 'border-color .25s',
  };
  const labelStyle = {
    display: 'block',
    marginBottom: '0.8rem',
    fontFamily: 'var(--ff-sans)',
  };

  return (
    <div style={{ background: 'var(--c-bg)', color: 'var(--c-text)', minHeight: '100vh' }}>
      <Header />
      <Hero />

      {/* ── Ticker ───────────────────────────── */}
      <div style={{
        borderTop: '1px solid var(--c-border)',
        borderBottom: '1px solid var(--c-border)',
        padding: '1.2rem 0',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.3)',
      }}>
        <div className="marquee-wrap">
          <div className="marquee-inner anim-marquee" style={{ display: 'flex' }}>
            {[...Array(3)].map((_, d) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {[
                  { city: 'MUMBAI',    event: 'UPI Mule Blocked',               val: '₹45,000',    accent: true },
                  { city: 'DELHI',     event: 'Fake CBI Officer Intercepted',   val: '1 Alert',    accent: false },
                  { city: 'BANGALORE', event: 'Deepfake Call Flagged',          val: 'HIGH RISK',  accent: true },
                  { city: 'HYDERABAD', event: 'Crypto Mule Wallet Frozen',      val: '42 Accounts',accent: false },
                  { city: 'CHENNAI',   event: 'Electricity Scam Blocked',       val: '1,280 SMS',  accent: true },
                  { city: 'KOLKATA',   event: 'Fake ₹500 Note Detected',        val: 'COUNTERFEIT',accent: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '0 3.2rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.14em', color: item.accent ? 'var(--c-accent)' : 'var(--c-accent-2)', fontFamily: 'var(--ff-sans)' }}>
                      {item.city}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--c-muted)', fontFamily: 'var(--ff-sans)' }}>
                      {item.event}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c-text)', fontFamily: 'var(--ff-mono)' }}>
                      {item.val}
                    </span>
                    <span style={{ width: 1, height: '1rem', background: 'var(--c-border)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Intro ───────────────────────────── */}
      <section id="about" className="section">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'start' }}>

            <div data-fade>
              <p className="t-label" style={{ marginBottom: '2.4rem' }}>The Intelligence Matrix</p>
              <h2 className="t-h2" style={{ color: 'var(--c-text)' }}>
                Suraksha AI operates at the intersection of machine intelligence and public safety.
              </h2>
            </div>

            <div data-fade data-delay="0.15s">
              <p className="t-body" style={{ marginBottom: '3.2rem' }}>
                We don't wait for fraud reports. Our system detects scam patterns, counterfeit currency, and organized fraud networks in real time — issuing instant citizen alerts and feeding verified threat data into law enforcement registries.
              </p>
              <a href="#console" className="btn-primary">
                Explore Platform
                <svg className="btn-arrow-icon" viewBox="0 0 16 16" fill="none">
                  <path d="M6.667 4L5.727 4.94 8.78 8l-3.053 3.06L6.667 12 10.667 8z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Capabilities list */}
          <div style={{ marginTop: '8rem' }}>
            {[
              { n: '01', title: 'Scam Detection',          desc: 'Detects fake authority threats, urgency manipulation, and phishing in audio and text.' },
              { n: '02', title: 'Fake Currency Detection', desc: 'Computer vision checks watermarks, thread patterns, and print accuracy against RBI specs.' },
              { n: '03', title: 'Fraud Network Mapping',   desc: 'Graph clustering connects phone numbers, UPI handles, and mule accounts.' },
              { n: '04', title: 'Citizen Protection',      desc: 'Instant chatbot risk scoring and protective action guidance for users under active threat.' },
            ].map((item, i) => (
              <div key={i} data-fade data-delay={`${i * 0.1}s`} style={{
                display: 'grid',
                gridTemplateColumns: '4rem 1fr 1fr',
                gap: '4rem',
                alignItems: 'center',
                padding: '2.8rem 0',
                borderTop: '1px solid var(--c-border)',
              }}>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '1.1rem', color: 'var(--c-sub)', letterSpacing: '0.06em' }}>{item.n}</span>
                <span className="t-h3" style={{ color: 'var(--c-text)' }}>{item.title}</span>
                <span className="t-body" style={{ fontSize: '1.4rem' }}>{item.desc}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--c-border)' }} />
          </div>
        </div>
      </section>

      {/* ── Console ──────────────────────────── */}
      <section id="console" style={{
        borderTop: '1px solid var(--c-border)',
        background: 'var(--c-bg-2)',
        padding: '12rem 0',
      }}>
        <div className="wrap">
          <div style={{ marginBottom: '5rem' }} data-fade>
            <p className="t-label" style={{ marginBottom: '2rem' }}>Interactive Console</p>
            <h2 className="t-h2">Suraksha Intel Platform</h2>
          </div>

          <div className="tab-bar" style={{ marginBottom: '3.2rem' }}>
            {tabs.map(t => (
              <button key={t.id} className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}>{t.label}</button>
            ))}
          </div>

          <div className="panel">
            {activeTab === 'scam'     && <ScamShield />}
            {activeTab === 'currency' && <CurrencyGuard />}
            {activeTab === 'network'  && <FraudMatrix />}
            {activeTab === 'citizen'  && <CitizenBot />}
          </div>
        </div>
      </section>

      {/* ── Methodology ──────────────────────── */}
      <section id="methodology" className="section" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="wrap">
          <div style={{ marginBottom: '6rem' }} data-fade>
            <p className="t-label" style={{ marginBottom: '2rem' }}>System Operations</p>
            <h2 className="t-h2">How It Works</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '3.2rem' }}>
            {[
              { n: '01', title: 'Ingest & Monitor',   desc: 'Passive telemetry captures suspicious payloads — messages, audio calls, and scan images from device endpoints.' },
              { n: '02', title: 'Neural Assessment',  desc: 'Semantic, visual, and behavioral models analyze all parameters for high-probability threat signatures.' },
              { n: '03', title: 'Syndicate Linking',  desc: 'Identified threats map into a global graph connecting mule accounts, UPI handles, and phone rings.' },
              { n: '04', title: 'Neutralize & Alert', desc: 'Instant citizen warnings blast while threat data feeds cyber-crime registries to freeze accounts.' },
            ].map((s, i) => (
              <div key={i} className="card" data-fade data-delay={`${i * 0.12}s`}>
                <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '1rem', color: 'var(--c-sub)', letterSpacing: '0.1em', marginBottom: '2rem' }}>{s.n}</div>
                <h4 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '1.4rem', color: 'var(--c-text)' }}>{s.title}</h4>
                <p className="t-body" style={{ fontSize: '1.3rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────── */}
      <section id="contact" style={{
        borderTop: '1px solid var(--c-border)',
        background: 'var(--c-bg-2)',
        padding: '12rem 0',
      }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'start' }}>

            <div data-fade>
              <p className="t-label" style={{ marginBottom: '2.4rem' }}>Threat Integration</p>
              <h2 className="t-h2" style={{ marginBottom: '2.8rem' }}>Sync With The Threat Database</h2>
              <p className="t-body">
                For financial institutions, telecom operators, or law enforcement agencies looking to interface with Suraksha AI's predictive threat API and real-time alert registry.
              </p>
            </div>

            <div data-fade data-delay="0.15s">
              {sent ? (
                <div>
                  <h3 className="t-h3" style={{ marginBottom: '1.4rem' }}>Thank you.</h3>
                  <p className="t-body">Your request is registered. API specifications will be dispatched within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3.2rem' }}>
                  {[
                    { label: 'Organization', value: org, set: setOrg, type: 'text', ph: 'Cyber Crime Division' },
                    { label: 'Official Email', value: email, set: setEmail, type: 'email', ph: 'officer@org.gov.in' },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="t-label" style={labelStyle}>{f.label}</label>
                      <input type={f.type} required value={f.value} placeholder={f.ph}
                        onChange={e => f.set(e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderBottomColor = 'var(--c-accent-2)'}
                        onBlur={e => e.target.style.borderBottomColor = 'var(--c-border)'}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="t-label" style={labelStyle}>Integration Scope</label>
                    <textarea required rows={3} value={scope} placeholder="Context, timing, or telemetry requirements"
                      onChange={e => setScope(e.target.value)}
                      style={{ ...inputStyle, resize: 'none' }}
                      onFocus={e => e.target.style.borderBottomColor = 'var(--c-accent-2)'}
                      onBlur={e => e.target.style.borderBottomColor = 'var(--c-border)'}
                    />
                  </div>
                  <div>
                    <button type="submit" className="btn-primary">
                      Request API Access
                      <svg className="btn-arrow-icon" viewBox="0 0 16 16" fill="none">
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

      <Footer />
    </div>
  );
}

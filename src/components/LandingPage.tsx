'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const WORKFLOW_STEPS = [
  { num: '01', title: 'Idea Intake', desc: 'Share the rough version. No polish required.' },
  { num: '02', title: 'Brand DNA', desc: 'The AI extracts the strategic substrate from your answers.' },
  { num: '03', title: 'Brand Worlds', desc: 'Three substantially different strategic directions.' },
  { num: '04', title: 'Brand Battle', desc: 'Five AI agents interrogate each direction.' },
  { num: '05', title: 'Anti-Generic', desc: 'Catch clichés and weak positioning before launch.' },
  { num: '06', title: 'Brand System', desc: 'A coherent system built from the selected direction.' },
  { num: '07', title: 'Guardian', desc: 'Check future content against the established brand.' },
  { num: '08', title: 'Launch Kit', desc: 'Launch-ready copy, voice, and visual guidelines.' },
];

const FEATURES = [
  {
    tag: 'BRAND BATTLE',
    title: 'Five agents. One verdict.',
    desc: 'Strategist, Audience Agent, Skeptic, Creative Director, and Naming Analyst each interrogate your brand direction from a distinct angle. Not consensus — clarity.',
  },
  {
    tag: 'ANTI-GENERIC ENGINE',
    title: 'Catch the default answer before it ships.',
    desc: 'The engine identifies clichés, vague positioning, overused phrases, and weak value propositions — then generates stronger alternatives grounded in your Brand DNA.',
  },
  {
    tag: 'CONSISTENCY GUARDIAN',
    title: 'Every piece of copy, checked.',
    desc: 'Paste any new content. The Guardian compares it to your Brand System and returns a consistency score, violations, and a suggested rewrite.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Nav */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          height: '52px',
          background: scrolled ? 'rgba(244, 243, 239, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', background: 'var(--bg-dark)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="var(--accent)"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="var(--accent)" opacity="0.4"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            BRANDMIND<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            AI strategy laboratory
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            v0.1 / DEMO MODE
          </span>
          <button
            onClick={() => router.push('/workspace')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Load demo ↗
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '1px solid rgba(217, 83, 30, 0.12)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            border: '1px solid rgba(217, 83, 30, 0.08)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '24px' }}>
              ── Brand Strategy / 001
            </p>
            <h1 style={{ fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '24px', maxWidth: '600px' }}>
              Your idea{' '}
              <span style={{ color: 'var(--accent)' }}>isn't</span>{' '}
              a brand yet.
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '460px' }}>
              Turn a rough idea into a brand system that can survive scrutiny. Interview, stress-test, and ship — in one connected workflow.
            </p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => router.push('/workspace')}
                style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 600 }}
              >
                Build My Brand
                <ArrowRight size={16} />
              </button>
              <button
                className="btn-outline"
                onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ padding: '14px 24px' }}
              >
                See the process
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Right: preview card */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              minWidth: '300px',
              maxWidth: '360px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                BRANDMIND / LIVE STUDY
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)' }}>ACTIVE</span>
              </div>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '12px' }}>
              03 / BRAND DNA
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Make the right team{' '}
              <span style={{ color: 'var(--accent)' }}>inevitable.</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              A point of view assembled from evidence, not vibes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Target User', 'Core Problem', 'Differentiator'].map(label => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</span>
                  <div style={{ height: '10px', width: '80px', borderRadius: '2px' }} className="skeleton" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <ChevronDown size={18} color="var(--text-muted)" style={{ animation: 'fadeIn 1s ease infinite alternate' }} />
        </div>
      </section>

      {/* Process */}
      <section id="process" style={{ padding: '100px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              The Process
            </p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Eight stages.<br />One connected signal.
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.6 }}>
            Every stage receives structured information from the previous one. This is not a collection of disconnected tools.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {WORKFLOW_STEPS.map((step, i) => (
            <div
              key={i}
              className="stage-card"
              style={{ transition: 'all 0.2s ease' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
                (e.currentTarget as HTMLDivElement).style.background = 'var(--accent-light)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-card)';
              }}
            >
              <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600, marginBottom: '12px' }}>
                {step.num}
              </p>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 40px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Key Features
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '48px' }}>
          Not a text generator.<br />A strategy laboratory.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              style={{
                padding: '32px 40px',
                border: '1px solid var(--border)',
                borderRadius: i === 0 ? '12px 12px 2px 2px' : i === FEATURES.length - 1 ? '2px 2px 12px 12px' : '2px',
                background: 'var(--bg-card)',
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '40px',
                alignItems: 'start',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
              }}
            >
              <span className="badge badge-accent">{feature.tag}</span>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 40px 100px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              background: 'var(--bg-dark)',
              borderRadius: '20px',
              padding: '64px',
              color: '#FFFFFF',
            }}
          >
            <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Ready to stress-test?
            </p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Don't generate a brand.{' '}
              <span style={{ color: 'var(--accent)' }}>Stress-test it.</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px', lineHeight: 1.6 }}>
              Enter your rough idea. BRANDMIND will interview you, extract the tension, generate strategic directions, and put them through a five-agent debate.
            </p>
            <button
              className="btn-accent"
              onClick={() => router.push('/workspace')}
              style={{ padding: '16px 36px', fontSize: '16px', fontWeight: 700 }}
            >
              Build My Brand
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          BRANDMIND<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          AI strategy laboratory · v0.1 · MVP
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Don't generate a brand. Stress-test it.
        </span>
      </footer>
    </div>
  );
}

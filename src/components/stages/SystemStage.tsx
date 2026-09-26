'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import StageEmptyState from '@/components/StageEmptyState';

function SystemSection({ label, content }: { label: string; content: string | string[] }) {
  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
        {label}
      </p>
      {Array.isArray(content) ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {content.map((item, i) => (
            <p key={i} style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              • {item}
            </p>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{content}</p>
      )}
    </div>
  );
}

export default function SystemStage() {
  const { project, setGuardian, markStageComplete } = useStore();
  const system = project.brandSystem;
  const [loading, setLoading] = useState(false);

  if (!system) {
    return <StageEmptyState stage="system" prerequisiteStage="stress" />;
  }

  const handleNext = async () => {
    markStageComplete('system');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07 / BRAND SYSTEM
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Make the direction usable.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>Direction Accepted</span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '600px' }}>
        A coherent system is more than a name. It is a set of repeatable choices your team can make without asking what the brand would do.
      </p>

      <div className="divider" />

      {/* Dark hero */}
      <div className="dark-hero" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>
              Positioning / {system.brandName.toUpperCase()}
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.02em' }}>
              {system.positioningStatement.split('.')[0]}.
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: '500px' }}>
              {system.positioningStatement.split('.').slice(1).join('.').trim()}
            </p>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
              Tagline
            </p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3, maxWidth: '200px' }}>
              {system.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* System grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
        {[
          { label: 'Brand Name', content: system.brandName },
          { label: 'Naming Direction', content: system.namingDirection.split('.')[0] + '.' },
          { label: 'Brand Promise', content: system.brandPromise },
        ].map(({ label, content }) => (
          <div key={label} className="stage-card">
            <SystemSection label={label} content={content} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
        {[
          { label: 'Personality', content: system.personality },
          { label: 'Brand Principles', content: system.principles },
        ].map(({ label, content }) => (
          <div key={label} className="stage-card">
            <SystemSection label={label} content={content} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="stage-card">
          <SystemSection label="Voice" content={system.voice} />
        </div>
        <div className="stage-card" style={{ gridColumn: 'span 2' }}>
          <SystemSection label="Messaging Pillars" content={system.messagingPillars} />
        </div>
      </div>

      {/* Visual direction */}
      <div className="stage-card" style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Visual Direction
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Color', content: system.visualDirection.color },
            { label: 'Typography', content: system.visualDirection.typography },
            { label: 'Imagery', content: system.visualDirection.imagery },
          ].map(({ label, content }) => (
            <div key={label}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Do / Don't */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div className="stage-card">
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16A34A', marginBottom: '12px' }}>
            ✓ Do
          </p>
          {system.doExamples.map((ex, i) => (
            <p key={i} style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '6px', paddingLeft: '12px', borderLeft: '2px solid #16A34A' }}>
              {ex}
            </p>
          ))}
        </div>
        <div className="stage-card">
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#DC2626', marginBottom: '12px' }}>
            × Don't
          </p>
          {system.dontExamples.map((ex, i) => (
            <p key={i} style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '6px', paddingLeft: '12px', borderLeft: '2px solid #DC2626' }}>
              {ex}
            </p>
          ))}
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={handleNext}
        style={{ minWidth: '220px' }}
      >
        Activate Consistency Guardian
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import DNACanvas from '@/components/DNACanvas';
import BrandRadar from '@/components/BrandRadar';
import StageEmptyState from '@/components/StageEmptyState';

function DNACard({ label, content, accent }: { label: string; content: string | string[]; accent?: boolean }) {
  return (
    <div
      className="stage-card"
      style={{ borderColor: accent ? 'var(--accent)' : undefined, background: accent ? 'var(--accent-light)' : undefined }}
    >
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '10px' }}>
        {label}
      </p>
      {Array.isArray(content) ? (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {content.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>•</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '15px', lineHeight: 1.5, color: 'var(--text-primary)', fontWeight: 400 }}>
          {content}
        </p>
      )}
    </div>
  );
}

export default function DNAStage() {
  const { project, setWorlds, markStageComplete } = useStore();
  const dna = project.brandDNA;
  const [loading, setLoading] = useState(false);

  if (!dna) {
    return <StageEmptyState stage="dna" prerequisiteStage="blindSpots" />;
  }

  const handleNext = async () => {
    if (!project.idea) return;
    setLoading(true);
    try {
      const worlds = await aiProvider.generateBrandWorlds(dna, project.idea);
      setWorlds(worlds);
      markStageComplete('dna');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 03 / BRAND DNA
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Name the force underneath.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>
          {dna.confidence}% Confidence
        </span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
        Brand DNA is the strategic substrate: the audience tension, emotional job, and line you refuse to cross.
      </p>

      <div className="divider" />

      {/* Key cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
        <DNACard label="Target User" content={dna.targetUser} />
        <DNACard label="Core Problem" content={dna.coreProblem} />
        <DNACard label="Value Proposition" content={dna.valueProposition} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
        <DNACard label="Motivations" content={dna.motivations} />
        <DNACard label="Pain Points" content={dna.painPoints} />
        <DNACard label="Differentiator" content={dna.differentiator} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
          Brand Personality Constellation
        </h3>
        <DNACanvas dna={dna} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
          Brand Dimension Radar
        </h3>
        <BrandRadar dna={dna} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
        <DNACard label="Brand Principles" content={dna.principles} />
        <DNACard label="Emotional Territory" content={dna.emotionalTerritory} accent />
        <DNACard label="Voice Characteristics" content={dna.voiceCharacteristics} />
      </div>

      {/* Positioning statement */}
      <div className="stage-card" style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Positioning
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-primary)', fontStyle: 'italic' }}>
          {dna.positioning}
        </p>
      </div>

      {/* Insight */}
      <div className="quote-block" style={{ marginBottom: '32px' }}>
        <strong>Strategic Insight:</strong> {dna.insight}
      </div>

      <button
        className="btn-primary"
        onClick={handleNext}
        disabled={loading}
        style={{ minWidth: '200px' }}
      >
        {loading ? (
          <>
            <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
            Generating Brand Worlds...
          </>
        ) : (
          <>
            Generate Brand Worlds
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}

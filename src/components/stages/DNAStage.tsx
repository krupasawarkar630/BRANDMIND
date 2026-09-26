'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Copy, Check, Sparkles, Shield, Compass } from 'lucide-react';
import DNACanvas from '@/components/DNACanvas';
import BrandRadar from '@/components/BrandRadar';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

function DNACard({
  label,
  content,
  accent,
  copyable,
}: {
  label: string;
  content: string | string[];
  accent?: boolean;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = Array.isArray(content) ? content.join('\n') : content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`Copied "${label}" to clipboard.`, 'Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="stage-card"
      style={{
        borderColor: accent ? 'var(--accent)' : undefined,
        background: accent ? 'var(--accent-light)' : undefined,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: accent ? 'var(--accent)' : 'var(--text-muted)',
          }}
        >
          {label}
        </p>
        {copyable && (
          <button
            onClick={handleCopy}
            aria-label={`Copy ${label}`}
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? '#16a34a' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        )}
      </div>

      {Array.isArray(content) ? (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {content.map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-primary)', fontWeight: 450, flex: 1 }}>
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
  const [error, setError] = useState<string | null>(null);

  if (!dna) {
    return <StageEmptyState stage="dna" prerequisiteStage="blindSpots" />;
  }

  const handleNext = async () => {
    if (!project.idea) return;
    setError(null);
    setLoading(true);
    try {
      const worlds = await aiProvider.generateBrandWorlds(dna, project.idea);
      setWorlds(worlds);
      toast.success('Generated 3 distinct strategic Brand Worlds.', 'Worlds Created');
      markStageComplete('dna');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to generate Brand Worlds. Please try again.');
      toast.error('Brand Worlds generation failed.', 'Generation Error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Deconstructing DNA Substrate', detail: 'Extracting narrative tension and emotional anchors' },
    { label: 'Designing 3 Distinct Worlds', detail: 'Creating divergent strategic, visual, and tone archetypes' },
    { label: 'Simulating Positioning Contrast', detail: 'Calibrating competitive distinction against industry defaults' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '920px' }}>
      <div style={{ marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 03 / BRAND DNA
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '12px',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          Name the force underneath.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>
          {dna.confidence}% Evidence Score
        </span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
        Brand DNA is the immutable strategic substrate: the audience tension, emotional job, and lines you refuse to cross.
      </p>

      {/* Positioning Highlight Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(217, 83, 30, 0.08) 0%, rgba(0, 0, 0, 0.02) 100%)',
          border: '1px solid rgba(217, 83, 30, 0.25)',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '28px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--accent)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Compass size={14} /> Core Positioning Statement
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(dna.positioning);
              toast.success('Copied positioning statement to clipboard.', 'Copied');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Copy size={12} /> Copy
          </button>
        </div>
        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontStyle: 'italic',
          }}
        >
          "{dna.positioning}"
        </p>
      </div>

      {/* Async Loading & Error State */}
      <AsyncProgressState
        isLoading={loading}
        error={error}
        onRetry={handleNext}
        steps={steps}
        title="Generating 3 Distinct Brand Worlds"
      />

      {/* Key cards row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
        <DNACard label="Target User" content={dna.targetUser} copyable />
        <DNACard label="Core Problem" content={dna.coreProblem} copyable />
        <DNACard label="Value Proposition" content={dna.valueProposition} copyable />
      </div>

      {/* Key cards row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <DNACard label="Motivations" content={dna.motivations} />
        <DNACard label="Pain Points" content={dna.painPoints} />
        <DNACard label="Differentiator" content={dna.differentiator} accent copyable />
      </div>

      {/* Personality Constellation */}
      <div style={{ marginBottom: '32px' }}>
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}
        >
          Brand Personality Constellation
        </h3>
        <DNACanvas dna={dna} />
      </div>

      {/* Dimension Radar */}
      <div style={{ marginBottom: '32px' }}>
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}
        >
          Brand Dimension Radar
        </h3>
        <BrandRadar dna={dna} />
      </div>

      {/* Principles & Voice */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <DNACard label="Brand Principles" content={dna.principles} />
        <DNACard label="Emotional Territory" content={dna.emotionalTerritory} accent />
        <DNACard label="Voice Characteristics" content={dna.voiceCharacteristics} />
      </div>

      {/* Strategic Insight */}
      <div
        className="quote-block"
        style={{
          marginBottom: '32px',
          background: 'var(--bg-card)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: '0 12px 12px 0',
          padding: '18px 24px',
        }}
      >
        <strong style={{ color: 'var(--accent)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
          Strategic AI Insight:
        </strong>
        <p style={{ marginTop: '6px', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {dna.insight}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={loading}
          style={{ minWidth: '240px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {loading ? (
            <span>Generating Brand Worlds...</span>
          ) : (
            <>
              Generate Brand Worlds
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle, Save, XCircle } from 'lucide-react';

const TRANSFORMATIONS = [
  'BOLDER', 'PREMIUM', 'HUMAN', 'PLAYFUL', 'TECHNICAL', 'MINIMAL', 'EMOTIONAL', 'CULTURAL'
];

import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import WhatIfVisualizer from '@/components/WhatIfVisualizer';
import StageEmptyState from '@/components/StageEmptyState';

export default function WhatIfMachineStage() {
  const { project, setWhatIfResult, applyWhatIf, saveWhatIfAsVariant, discardWhatIf, markStageComplete } = useStore();
  const [loading, setLoading] = useState<string | null>(null);

  const { brandSystem, brandDNA, whatIfResult, brandVariants = [] } = project;
  if (!brandSystem || !brandDNA) {
    return <StageEmptyState stage="whatIfMachine" prerequisiteStage="system" />;
  }

  const handleTransform = async (transformation: string) => {
    setLoading(transformation);
    try {
      const result = await aiProvider.runWhatIfMachine(brandSystem, brandDNA, transformation);
      setWhatIfResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleComplete = () => {
    markStageComplete('whatIfMachine');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07d / WHAT-IF BRAND MACHINE
        </span>
        <span className="badge badge-accent">EXPLORATION</span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Explore alternate strategic expressions.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '800px' }}>
        See how your brand system adapts to different tonal and strategic shifts without losing the underlying Brand DNA.
      </p>

      {!whatIfResult || whatIfResult.status !== 'pending' ? (
        <div className="stage-card" style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Make the brand feel...
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {TRANSFORMATIONS.map(t => (
              <button
                key={t}
                className="btn-outline"
                onClick={() => handleTransform(t)}
                disabled={loading !== null}
                style={{ position: 'relative' }}
              >
                {loading === t ? (
                  <>
                    <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> {t}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '40px' }}>
          <WhatIfVisualizer
            result={whatIfResult}
            onApply={applyWhatIf}
            onSaveVariant={saveWhatIfAsVariant}
            onDiscard={discardWhatIf}
          />
        </div>
      )}

      {(brandVariants || []).length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Saved Variants</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {(brandVariants || []).map((v, i) => (
              <div key={i} className="stage-card" style={{ padding: '16px' }}>
                <span className="badge badge-muted" style={{ marginBottom: '8px', display: 'inline-block' }}>Variant {i + 1}</span>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {v.brandName}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {v.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="divider" />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to Guardian <ArrowRight size={14} />
      </button>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle, Save, XCircle, RefreshCw } from 'lucide-react';

const TRANSFORMATIONS = [
  'BOLDER', 'PREMIUM', 'HUMAN', 'PLAYFUL', 'TECHNICAL', 'MINIMAL', 'EMOTIONAL', 'CULTURAL'
];

import WhatIfVisualizer from '@/components/WhatIfVisualizer';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

export default function WhatIfMachineStage() {
  const { project, setWhatIfResult, applyWhatIf, saveWhatIfAsVariant, discardWhatIf, markStageComplete } = useStore();
  const [loadingTransformation, setLoadingTransformation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { brandSystem, brandDNA, whatIfResult, brandVariants = [] } = project;
  if (!brandSystem || !brandDNA) {
    return <StageEmptyState stage="whatIfMachine" prerequisiteStage="system" />;
  }

  const handleTransform = async (transformation: string) => {
    setError(null);
    setLoadingTransformation(transformation);
    try {
      const result = await aiProvider.runWhatIfMachine(brandSystem, brandDNA, transformation);
      setWhatIfResult(result);
      toast.success(`Generated "${transformation}" simulation scenario with branching paths.`, 'Scenario Ready');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || `Failed to run "${transformation}" scenario.`);
      toast.error('Simulation scenario failed.', 'Execution Error');
    } finally {
      setLoadingTransformation(null);
    }
  };

  const handleApply = (id: string) => {
    applyWhatIf(id);
    toast.success('Applied What-If transformation to active Brand System.', 'System Updated');
  };

  const handleSaveVariant = (id: string) => {
    saveWhatIfAsVariant(id);
    toast.success('Saved scenario as alternative brand variant.', 'Variant Saved');
  };

  const handleDiscard = (id: string) => {
    discardWhatIf(id);
    toast.info('Discarded simulation scenario.', 'Scenario Discarded');
  };

  const handleComplete = () => {
    markStageComplete('whatIfMachine');
  };

  const steps = [
    { label: 'Injecting Market Shock Vector', detail: `Applying ${loadingTransformation || 'strategic'} transformation hypothesis` },
    { label: 'Calculating Affected DNA Pillars', detail: 'Cross-checking constraints against locked foundation' },
    { label: 'Generating Branching Decision Paths', detail: 'Mapping Low-Risk Conservative vs High-Upside Radical avenues' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 07d / WHAT-IF BRAND MACHINE
        </span>
        <span className="badge badge-accent">Strategic Scenario Modeling</span>
      </div>

      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '16px',
        }}
      >
        Explore alternate strategic expressions.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '800px' }}>
        Test how your brand system behaves under market shocks and tone shifts without losing core Brand DNA. Visualize affected pillars, audience reactions, and branching strategic paths.
      </p>

      <AsyncProgressState
        isLoading={loadingTransformation !== null}
        error={error}
        onRetry={() => loadingTransformation && handleTransform(loadingTransformation)}
        steps={steps}
        title={`Simulating ${loadingTransformation || ''} Strategic Scenario`}
      />

      {!whatIfResult || whatIfResult.status !== 'pending' ? (
        <div className="stage-card" style={{ marginBottom: '40px', padding: '28px' }}>
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: '16px',
              letterSpacing: '0.08em',
            }}
          >
            Select a Strategic Shock or Expression:
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {TRANSFORMATIONS.map((t) => (
              <button
                key={t}
                className="btn-outline"
                onClick={() => handleTransform(t)}
                disabled={loadingTransformation !== null}
                style={{
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={14} color="var(--accent)" /> {t}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '40px' }}>
          <WhatIfVisualizer
            result={whatIfResult}
            onApply={handleApply}
            onSaveVariant={handleSaveVariant}
            onDiscard={handleDiscard}
          />
        </div>
      )}

      {(brandVariants || []).length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Saved Strategic Variants ({brandVariants.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {brandVariants.map((v, i) => (
              <div key={i} className="stage-card" style={{ padding: '20px' }}>
                <span className="badge badge-muted" style={{ marginBottom: '10px', display: 'inline-block' }}>
                  Variant {i + 1}
                </span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {v.brandName}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  "{v.tagline}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="divider" />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-primary"
          onClick={handleComplete}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          Continue to Decision Timeline <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

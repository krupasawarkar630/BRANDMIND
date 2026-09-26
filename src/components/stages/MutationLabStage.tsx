'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, TestTube, CheckCircle, XCircle, Sparkles, RefreshCw } from 'lucide-react';

const INTENSITY_COLORS = {
  low: '#16A34A',
  moderate: '#D97706',
  major: '#DC2626',
};

import MutationSlider from '@/components/MutationSlider';
import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

export default function MutationLabStage() {
  const { project, addMutation, applyMutation, discardMutation, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliders, setSliders] = useState({ tone: 50, price: 50, feel: 50 });

  const { brandSystem, brandDNA, mutations = [] } = project;
  const currentMutation = mutations.find((m) => m.status === 'pending');

  if (!brandSystem || !brandDNA) {
    return <StageEmptyState stage="mutationLab" prerequisiteStage="system" />;
  }

  const handleMutate = async () => {
    const changes = [];
    if (sliders.tone < 40) changes.push('much friendlier and casual tone');
    if (sliders.tone > 60) changes.push('much bolder and assertive tone');
    if (sliders.price < 40) changes.push('more accessible and mass-market positioning');
    if (sliders.price > 60) changes.push('more premium and luxury positioning');
    if (sliders.feel < 40) changes.push('more human, warm and empathetic');
    if (sliders.feel > 60) changes.push('more technical, rigorous and precise');

    const instruction = changes.length > 0 ? changes.join(', ') : 'make it slightly different';

    setError(null);
    setLoading(true);
    try {
      const result = await aiProvider.runBrandMutation(brandSystem, brandDNA, 'Multiple Strategic Attributes', instruction);
      addMutation(result);
      toast.success('Mutation synthesized with before/after diff.', 'Mutation Generated');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to simulate brand mutation. Please try again.');
      toast.error('Mutation simulation failed.', 'Execution Error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (mutationId: string) => {
    applyMutation(mutationId);
    toast.success('Applied mutation. Brand system version updated.', 'Version Created');
  };

  const handleDiscard = (mutationId: string) => {
    discardMutation(mutationId);
    toast.info('Discarded mutation candidate.', 'Mutation Discarded');
  };

  const handleComplete = () => {
    markStageComplete('mutationLab');
  };

  const steps = [
    { label: 'Isolating Targeted Variables', detail: 'Mapping slider parameters to voice and positioning tokens' },
    { label: 'Computing Downstream Ripple Effects', detail: 'Calculating impact across tagline, pillars, and guidelines' },
    { label: 'Generating Token-Level Diff Highlights', detail: 'Creating word-level before/after comparison' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 07c / BRAND MUTATION LAB
        </span>
        <span className="badge badge-accent">Strategic Version Control</span>
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
        Change one variable. Watch the brand evolve.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
        Do not regenerate blindly. Adjust strategic dials, preview ripple effects with word-level diffs, and branch your brand system with full auditability.
      </p>

      <AsyncProgressState
        isLoading={loading}
        error={error}
        onRetry={handleMutate}
        steps={steps}
        title="Simulating Brand Mutation Ripple Effects"
      />

      {!currentMutation ? (
        <div className="stage-card" style={{ marginBottom: '40px', padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
            <MutationSlider
              labelLeft="Friendly / Casual"
              labelRight="Bold / Assertive"
              value={sliders.tone}
              onChange={(val) => setSliders({ ...sliders, tone: val })}
            />
            <MutationSlider
              labelLeft="Accessible / Mass-Market"
              labelRight="Premium / High-End"
              value={sliders.price}
              onChange={(val) => setSliders({ ...sliders, price: val })}
            />
            <MutationSlider
              labelLeft="Human / Empathetic"
              labelRight="Technical / Precise"
              value={sliders.feel}
              onChange={(val) => setSliders({ ...sliders, feel: val })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              onClick={handleMutate}
              disabled={loading}
              style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {loading ? (
                <span>Running Mutation...</span>
              ) : (
                <>
                  <TestTube size={15} /> Preview Strategic Mutation
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
            {currentMutation.changedElements.map((c, i) => (
              <BeforeAfterComparison
                key={i}
                title={c.element}
                beforeText={c.original}
                afterText={c.newValue}
                intensity={c.intensity}
                reasoning={currentMutation.reasoning}
              />
            ))}
          </div>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: '16px',
              }}
            >
              Mutation Impact Summary
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {currentMutation.changedElements.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: `${INTENSITY_COLORS[c.intensity]}15`,
                    border: `1px solid ${INTENSITY_COLORS[c.intensity]}40`,
                    padding: '6px 14px',
                    borderRadius: '100px',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.element}
                  </span>
                  <ArrowRight size={12} color={INTENSITY_COLORS[c.intensity]} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: INTENSITY_COLORS[c.intensity],
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.intensity}
                  </span>
                </div>
              ))}
              {currentMutation.unchangedElements.map((u, i) => (
                <div
                  key={'u' + i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid var(--border)',
                    padding: '6px 14px',
                    borderRadius: '100px',
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {u}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Stable
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 500 }}>
                "{currentMutation.reasoning}"
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn-primary"
              onClick={() => handleApply(currentMutation.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
            >
              <CheckCircle size={15} /> Apply Mutation to System
            </button>
            <button
              className="btn-outline"
              onClick={() => handleDiscard(currentMutation.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
            >
              <XCircle size={15} /> Discard Candidate
            </button>
          </div>
        </div>
      )}

      {(mutations || []).length > 0 && !currentMutation && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Version History
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div className="badge badge-accent">Active v{(project.brandSystemHistory || []).length + 1}</div>
            {(project.brandSystemHistory || []).map((_, i) => (
              <div key={i} className="badge badge-muted">
                v{i + 1} (Archived)
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
          Continue to What-If Machine <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

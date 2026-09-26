'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, TestTube, CheckCircle, XCircle } from 'lucide-react';

const INTENSITY_COLORS = {
  low: '#16A34A',
  moderate: '#D97706',
  major: '#DC2626',
};

import MutationSlider from '@/components/MutationSlider';
import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import StageEmptyState from '@/components/StageEmptyState';

export default function MutationLabStage() {
  const { project, addMutation, applyMutation, discardMutation, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [sliders, setSliders] = useState({ tone: 50, price: 50, feel: 50 });

  const { brandSystem, brandDNA, mutations = [] } = project;
  const currentMutation = mutations.find(m => m.status === 'pending');

  if (!brandSystem || !brandDNA) {
    return <StageEmptyState stage="mutationLab" prerequisiteStage="system" />;
  }

  const handleMutate = async () => {
    // Generate a mutation string based on sliders
    const changes = [];
    if (sliders.tone < 40) changes.push('much friendlier tone');
    if (sliders.tone > 60) changes.push('much bolder tone');
    if (sliders.price < 40) changes.push('more accessible and mass-market');
    if (sliders.price > 60) changes.push('more premium and exclusive');
    if (sliders.feel < 40) changes.push('more human and warm');
    if (sliders.feel > 60) changes.push('more technical and precise');

    const instruction = changes.length > 0 ? changes.join(', ') : 'make it slightly different';
    
    setLoading(true);
    try {
      const result = await aiProvider.runBrandMutation(brandSystem, brandDNA, 'Multiple attributes', instruction);
      addMutation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    markStageComplete('mutationLab');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07c / BRAND MUTATION LAB
        </span>
        <span className="badge badge-accent">VERSION CONTROL</span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Change one variable. Watch the brand evolve.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
        Do not regenerate blindly. Pick a strategic variable, change it, and see how the ripple effects alter the rest of your brand system. 
        Your original Brand DNA remains intact.
      </p>

      {!currentMutation ? (
        <div className="stage-card" style={{ marginBottom: '40px' }}>
          <MutationSlider 
            labelLeft="Friendly" labelRight="Bold" 
            value={sliders.tone} onChange={(val) => setSliders({ ...sliders, tone: val })}
          />
          <MutationSlider 
            labelLeft="Accessible" labelRight="Premium" 
            value={sliders.price} onChange={(val) => setSliders({ ...sliders, price: val })}
          />
          <MutationSlider 
            labelLeft="Human" labelRight="Technical" 
            value={sliders.feel} onChange={(val) => setSliders({ ...sliders, feel: val })}
          />
          
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handleMutate} disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  Running Mutation...
                </>
              ) : (
                <>
                  <TestTube size={14} /> Preview Mutation
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {currentMutation.changedElements.map((c, i) => (
              <BeforeAfterComparison
                key={i}
                title={c.element}
                beforeText={c.original}
                afterText={c.newValue}
                intensity={c.intensity}
              />
            ))}
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>
              What Changed?
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {currentMutation.changedElements.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${INTENSITY_COLORS[c.intensity]}15`, border: `1px solid ${INTENSITY_COLORS[c.intensity]}40`, padding: '6px 14px', borderRadius: '100px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.element}</span>
                  <ArrowRight size={12} color={INTENSITY_COLORS[c.intensity]} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: INTENSITY_COLORS[c.intensity], textTransform: 'uppercase' }}>
                    {c.intensity}
                  </span>
                </div>
              ))}
              {currentMutation.unchangedElements.map((u, i) => (
                <div key={'u'+i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: '100px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{u}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Unchanged</span>
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
            <button className="btn-primary" onClick={() => applyMutation(currentMutation.id)}>
              <CheckCircle size={16} /> Apply Mutation
            </button>
            <button className="btn-outline" onClick={() => discardMutation(currentMutation.id)}>
              <XCircle size={16} /> Discard
            </button>
          </div>
        </div>
      )}

      {(mutations || []).length > 0 && !currentMutation && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Version History</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div className="badge badge-accent">Current v{(project.brandSystemHistory || []).length + 1}</div>
            {(project.brandSystemHistory || []).map((_, i) => (
              <div key={i} className="badge badge-muted">v{i + 1} (Archived)</div>
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

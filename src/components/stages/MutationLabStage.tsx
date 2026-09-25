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

export default function MutationLabStage() {
  const { project, addMutation, applyMutation, discardMutation, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [variable, setVariable] = useState('Audience');
  const [newValue, setNewValue] = useState('');

  const { brandSystem, brandDNA, mutations = [] } = project;
  if (!brandSystem || !brandDNA) return null;

  const currentMutation = mutations.find(m => m.status === 'pending');

  const handleMutate = async () => {
    if (!newValue.trim()) return;
    setLoading(true);
    try {
      const result = await aiProvider.runBrandMutation(brandSystem, brandDNA, variable, newValue);
      addMutation(result);
      setNewValue('');
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Mutation Variable
              </label>
              <select
                className="input-field"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="Audience">Audience</option>
                <option value="Positioning">Positioning</option>
                <option value="Personality">Personality</option>
                <option value="Tone">Tone</option>
                <option value="Price perception">Price perception</option>
                <option value="Market">Market</option>
                <option value="Brand ambition">Brand ambition</option>
                <option value="Emotional direction">Emotional direction</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                New Value
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Startup Founders"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMutate()}
                />
                <button className="btn-primary" onClick={handleMutate} disabled={loading || !newValue.trim()}>
                  {loading ? (
                    <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  ) : (
                    <>
                      <TestTube size={14} /> Mutate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Original */}
            <div className="stage-card" style={{ opacity: 0.8 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                Original Brand
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentMutation.changedElements.map((c, i) => (
                  <div key={i}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{c.element}</span>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{c.original}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mutated */}
            <div className="stage-card" style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '16px' }}>
                Mutated Brand
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentMutation.changedElements.map((c, i) => (
                  <div key={i}>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase' }}>{c.element}</span>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{c.newValue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dark-hero" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#E5E5E3', marginBottom: '16px' }}>
              What Changed?
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {currentMutation.changedElements.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '100px' }}>
                  <span style={{ fontSize: '13px', color: '#FFF' }}>{c.element}</span>
                  <ArrowRight size={12} color={INTENSITY_COLORS[c.intensity]} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: INTENSITY_COLORS[c.intensity], textTransform: 'uppercase' }}>
                    {c.intensity}
                  </span>
                </div>
              ))}
              {currentMutation.unchangedElements.map((u, i) => (
                <div key={'u'+i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '100px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{u}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unchanged</span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: '14px', color: '#E5E5E3', lineHeight: 1.6, fontStyle: 'italic' }}>
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
            <div className="badge badge-accent">Current v{project.brandSystemHistory.length + 1}</div>
            {project.brandSystemHistory.map((_, i) => (
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

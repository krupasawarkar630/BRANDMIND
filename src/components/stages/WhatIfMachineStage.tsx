'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle, Save, XCircle } from 'lucide-react';

const TRANSFORMATIONS = [
  'BOLDER', 'PREMIUM', 'HUMAN', 'PLAYFUL', 'TECHNICAL', 'MINIMAL', 'EMOTIONAL', 'CULTURAL'
];

export default function WhatIfMachineStage() {
  const { project, setWhatIfResult, applyWhatIf, saveWhatIfAsVariant, discardWhatIf, markStageComplete } = useStore();
  const [loading, setLoading] = useState<string | null>(null);

  const { brandSystem, brandDNA, whatIfResult, brandVariants = [] } = project;
  if (!brandSystem || !brandDNA) return null;

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
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Transformation: <span style={{ color: 'var(--accent)' }}>{whatIfResult.transformation}</span>
            </h2>
            <button className="btn-outline" onClick={() => discardWhatIf(whatIfResult.id)}>
              <XCircle size={14} /> Close
            </button>
          </div>

          <div className="dark-hero" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#E5E5E3', marginBottom: '24px' }}>
              What Changed?
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {Object.entries(whatIfResult.changes).map(([key, change]) => (
                <div key={key} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
                    {change.element}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '13px', color: '#A3A3A3', textDecoration: 'line-through' }}>
                      {change.original}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <ArrowRight size={14} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.4 }}>
                        {change.newValue}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => applyWhatIf(whatIfResult.id)}>
              <CheckCircle size={16} /> Apply Transformation
            </button>
            <button className="btn-outline" onClick={() => saveWhatIfAsVariant(whatIfResult.id)}>
              <Save size={16} /> Save as Variant
            </button>
            <button className="btn-outline" onClick={() => discardWhatIf(whatIfResult.id)} style={{ marginLeft: 'auto' }}>
              <XCircle size={16} /> Discard
            </button>
          </div>
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

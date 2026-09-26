'use client';

import React from 'react';
import { ArrowRight, AlertTriangle, Zap, CheckCircle, BrainCircuit } from 'lucide-react';
import type { ABExperimentOption, ABExperiment } from '@/lib/types';

export default function ExperimentBoard({
  experiment,
  onResolve
}: {
  experiment: ABExperiment;
  onResolve: (id: string, decision: 'chose_a' | 'chose_b' | 'kept_both') => void;
}) {
  const { optionA, optionB } = experiment;

  const renderMetric = (label: string, valA: number, valB: number) => {
    const isABetter = valA >= valB;
    return (
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: isABetter ? 'var(--text-primary)' : 'var(--text-muted)', width: '36px', textAlign: 'right' }}>{valA}%</span>
            <div style={{ height: '6px', flex: 1, background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${valA}%`, height: '100%', background: isABetter ? 'var(--accent)' : 'rgba(0,0,0,0.2)' }} />
            </div>
          </div>
          <div style={{ color: 'var(--border)' }}>|</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row-reverse' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: !isABetter ? 'var(--text-primary)' : 'var(--text-muted)', width: '36px', textAlign: 'left' }}>{valB}%</span>
            <div style={{ height: '6px', flex: 1, background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${valB}%`, height: '100%', background: !isABetter ? '#16A34A' : 'rgba(0,0,0,0.2)', float: 'right' }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderColumn = (opt: ABExperimentOption, label: string, color: string, onSelect: () => void) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label}
        </span>
        <BrainCircuit size={16} color="var(--text-muted)" />
      </div>
      
      <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px', fontStyle: 'italic', lineHeight: 1.4 }}>
        "{opt.value}"
      </p>

      <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', marginBottom: '20px', flex: 1 }}>
        <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 700 }}>Trade-off Analysis</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
          {opt.reasoning}
        </p>
      </div>

      {opt.risks.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '20px', padding: '12px', border: '1px solid rgba(217, 119, 6, 0.3)', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '6px' }}>
          <AlertTriangle size={14} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#D97706', textTransform: 'uppercase', fontWeight: 700 }}>Identified Risk</span>
            <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{opt.risks[0]}</p>
          </div>
        </div>
      )}

      {experiment.status === 'pending' && (
        <button 
          onClick={onSelect}
          className="btn-primary"
          style={{ width: '100%', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <CheckCircle size={14} /> USE {label}
        </button>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* COMPARISON METRICS */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '32px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '28px' }}>
          Head-to-Head Simulation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>VERSION A</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#16A34A' }}>VERSION B</span>
          </div>
          {renderMetric('Clarity', optionA.clarity, optionB.clarity)}
          {renderMetric('Distinctiveness', optionA.distinctiveness, optionB.distinctiveness)}
          {renderMetric('Audience Fit', optionA.audienceFit, optionB.audienceFit)}
          {renderMetric('Brand Personality', optionA.brandAlignment, optionB.brandAlignment)}
          {renderMetric('Memorability', optionA.memorability, optionB.memorability)}
        </div>
      </div>

      {/* BOARDS */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {renderColumn(optionA, 'Version A', 'var(--accent)', () => onResolve(experiment.id, 'chose_a'))}
        {renderColumn(optionB, 'Version B', '#16A34A', () => onResolve(experiment.id, 'chose_b'))}
      </div>

      {/* KEEP BOTH OPTION */}
      {experiment.status === 'pending' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button 
            onClick={() => onResolve(experiment.id, 'kept_both')}
            className="btn-outline"
            style={{ padding: '10px 24px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }}
          >
            Too close to call (Keep Both)
          </button>
        </div>
      )}

      {/* RESOLVED STATE */}
      {experiment.status !== 'pending' && (
        <div style={{ textAlign: 'center', padding: '16px', background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Decision Locked: {experiment.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      )}

    </div>
  );
}

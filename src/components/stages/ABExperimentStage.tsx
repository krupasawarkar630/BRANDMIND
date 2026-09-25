'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Beaker, Check, Zap, AlertTriangle } from 'lucide-react';
import type { ABExperimentOption } from '@/lib/types';

const EXPERIMENT_TYPES = [
  'Tagline A vs B',
  'Name A vs B',
  'Positioning A vs B',
  'Landing headline A vs B',
  'Voice A vs B'
];

export default function ABExperimentStage() {
  const { project, addABExperiment, resolveABExperiment, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [experimentType, setExperimentType] = useState(EXPERIMENT_TYPES[0]);
  const [valA, setValA] = useState('');
  const [valB, setValB] = useState('');

  const { brandSystem, abExperiments = [] } = project;
  if (!brandSystem) return null;

  const pendingExperiment = abExperiments.find(e => e.status === 'pending');

  const handleComplete = () => {
    markStageComplete('abExperiment');
  };

  const handleRun = async () => {
    if (!valA.trim() || !valB.trim()) return;
    setLoading(true);
    try {
      const result = await aiProvider.runABExperiment(brandSystem, experimentType, valA, valB);
      addABExperiment(result);
      setValA('');
      setValB('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderBar = (val: number) => {
    return (
      <div className="score-bar" style={{ background: 'rgba(255,255,255,0.1)', height: '6px', marginTop: '4px' }}>
        <div className="score-bar-fill" style={{ width: `${val}%`, background: 'var(--accent)' }} />
      </div>
    );
  };

  const renderOptionStats = (opt: ABExperimentOption, label: string) => (
    <div className="stage-card" style={{ flex: 1 }}>
      <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '16px' }}>
        {label}
      </h3>
      <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', fontStyle: 'italic' }}>
        "{opt.value}"
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Clarity</span>
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{opt.clarity}%</span>
          </div>
          {renderBar(opt.clarity)}
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memorability</span>
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{opt.memorability}%</span>
          </div>
          {renderBar(opt.memorability)}
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Distinctiveness</span>
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{opt.distinctiveness}%</span>
          </div>
          {renderBar(opt.distinctiveness)}
        </div>
      </div>

      <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {opt.reasoning}
        </p>
      </div>

      {opt.risks.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <AlertTriangle size={14} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{opt.risks[0]}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07f / BRAND A/B EXPERIMENTS
        </span>
        <span className="badge badge-accent">AI COMPARATIVE ANALYSIS</span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Compare two strategic choices.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '800px' }}>
        Input two variations of a brand element and let the AI simulate how they perform against your core Brand DNA.
        <br /><br />
        <strong>AI SIMULATION — not real-world A/B testing.</strong>
      </p>

      {!pendingExperiment ? (
        <div className="stage-card" style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Experiment Type
            </label>
            <select
              className="input-field"
              value={experimentType}
              onChange={(e) => setExperimentType(e.target.value)}
              style={{ maxWidth: '300px', cursor: 'pointer' }}
            >
              {EXPERIMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Option A
              </label>
              <textarea
                className="input-field"
                placeholder="e.g. Work smarter with AI."
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Option B
              </label>
              <textarea
                className="input-field"
                placeholder="e.g. Your second brain for unfinished work."
                value={valB}
                onChange={(e) => setValB(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <button className="btn-primary" onClick={handleRun} disabled={loading || !valA.trim() || !valB.trim()}>
            {loading ? (
              <>
                <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                Running Analysis...
              </>
            ) : (
              <>
                <Beaker size={14} /> Run Experiment
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Analysis: {pendingExperiment.experimentType}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            {renderOptionStats(pendingExperiment.optionA, 'Option A')}
            {renderOptionStats(pendingExperiment.optionB, 'Option B')}
          </div>

          <div className="dark-hero" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#E5E5E3', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="var(--accent)" /> Key Difference
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Option A</span>
                <p style={{ fontSize: '14px', color: '#FFF', fontWeight: 500 }}>{pendingExperiment.optionA.summary}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Option B</span>
                <p style={{ fontSize: '14px', color: '#FFF', fontWeight: 500 }}>{pendingExperiment.optionB.summary}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => resolveABExperiment(pendingExperiment.id, 'chose_a')}>
              <Check size={16} /> Choose A
            </button>
            <button className="btn-primary" onClick={() => resolveABExperiment(pendingExperiment.id, 'chose_b')}>
              <Check size={16} /> Choose B
            </button>
            <button className="btn-outline" onClick={() => resolveABExperiment(pendingExperiment.id, 'kept_both')} style={{ marginLeft: 'auto' }}>
              Keep Both
            </button>
          </div>
        </div>
      )}

      {abExperiments.filter(e => e.status !== 'pending').length > 0 && !pendingExperiment && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Past Decisions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {abExperiments.filter(e => e.status !== 'pending').map(e => (
              <div key={e.id} className="stage-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {e.experimentType}
                  </span>
                  <span className="badge badge-accent">
                    {e.status === 'chose_a' ? 'Chose A' : e.status === 'chose_b' ? 'Chose B' : 'Kept Both'}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {e.status === 'chose_a' ? `"${e.optionA.value}"` : e.status === 'chose_b' ? `"${e.optionB.value}"` : `Both variants tracked`}
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

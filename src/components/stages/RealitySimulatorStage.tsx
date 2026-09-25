'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Play, ShieldAlert, CheckCircle, XCircle, Shield } from 'lucide-react';

const RISK_COLORS = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#DC2626',
};

export default function RealitySimulatorStage() {
  const { project, setRealitySimulator, updateSimulatorScenarioStatus, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);

  const { brandSystem, brandDNA, realitySimulator } = project;
  if (!brandSystem || !brandDNA) return null;

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await aiProvider.runRealitySimulator(project);
      setRealitySimulator(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (id: string, action: 'accepted_fix' | 'ignored' | 'sent_to_guardian') => {
    updateSimulatorScenarioStatus(id, action);
  };

  const handleComplete = () => {
    markStageComplete('realitySimulator');
  };

  const renderBar = (value: number) => {
    const filled = Math.round(value / 10);
    const empty = 10 - filled;
    return (
      <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '2px', color: 'var(--accent)' }}>
        {'█'.repeat(filled)}
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>{'░'.repeat(empty)}</span>
      </span>
    );
  };

  if (!realitySimulator || realitySimulator.status !== 'complete') {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
            / 07e / BRAND REALITY SIMULATOR
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Don't just build the brand. Put it under pressure.
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
          We will take your finalized Brand System and simulate realistic, high-pressure scenarios before you launch.
          See how your positioning, tone, and visual direction hold up to competitor challenges, customer confusion, and negative social comments.
          <br /><br />
          <strong>AI SIMULATION — not real-world measurements.</strong>
        </p>

        <button className="btn-primary" onClick={handleRun} disabled={loading}>
          {loading ? (
            <>
              <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
              Running simulations...
            </>
          ) : (
            <>
              <Play size={14} /> Run Simulator
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07e / BRAND REALITY SIMULATOR
        </span>
        <span className="badge badge-accent">AI SIMULATION</span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Reality Check Results
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="stage-card">
          <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Scenarios tested:</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{realitySimulator.scenariosTested}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Potential conflicts:</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>{realitySimulator.potentialConflicts}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Strong areas:</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#16A34A' }}>{realitySimulator.strongAreas}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Needs attention:</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#DC2626' }}>{realitySimulator.needsAttention}</span>
            </div>
          </div>
        </div>

        <div className="dark-hero" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', color: '#E5E5E3', textTransform: 'uppercase', marginBottom: '16px' }}>
            Brand Survival Map
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#A3A3A3', width: '120px' }}>Clarity</span>
              {renderBar(realitySimulator.survivalMap.clarity)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#A3A3A3', width: '120px' }}>Consistency</span>
              {renderBar(realitySimulator.survivalMap.consistency)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#A3A3A3', width: '120px' }}>Differentiation</span>
              {renderBar(realitySimulator.survivalMap.differentiation)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#A3A3A3', width: '120px' }}>Audience Fit</span>
              {renderBar(realitySimulator.survivalMap.audienceFit)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#A3A3A3', width: '120px' }}>Voice Stability</span>
              {renderBar(realitySimulator.survivalMap.voiceStability)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
        {realitySimulator.scenarios.map(sc => (
          <div key={sc.id} className="stage-card" style={{ borderColor: sc.status !== 'pending' ? 'var(--border)' : RISK_COLORS[sc.riskLevel] + '40', opacity: sc.status !== 'pending' ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} color={RISK_COLORS[sc.riskLevel]} />
                SCENARIO: {sc.title}
              </h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Level</span>
                <span className="badge" style={{ background: RISK_COLORS[sc.riskLevel] + '20', color: RISK_COLORS[sc.riskLevel], borderColor: RISK_COLORS[sc.riskLevel] }}>
                  {sc.riskLevel}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Situation</span>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{sc.situation}</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Audience Reaction</span>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>"{sc.audienceReaction}"</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>AI Evaluation</span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                <strong>WHY:</strong> {sc.why}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                <strong>BRAND ALIGNMENT:</strong> {sc.brandAlignment}
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Recommended Action</span>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{sc.recommendedAction}</p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                {sc.affectedElements.map(el => (
                  <span key={el} style={{ fontSize: '10px', background: 'var(--bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    {el}
                  </span>
                ))}
              </div>
            </div>

            {sc.status === 'pending' ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={() => handleAction(sc.id, 'accepted_fix')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <CheckCircle size={14} /> Accept Fix
                </button>
                <button className="btn-outline" onClick={() => handleAction(sc.id, 'sent_to_guardian')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <Shield size={14} /> Send to Guardian
                </button>
                <button className="btn-outline" onClick={() => handleAction(sc.id, 'ignored')} style={{ padding: '6px 12px', fontSize: '12px', marginLeft: 'auto' }}>
                  <XCircle size={14} /> Ignore
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {sc.status.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="divider" />
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button className="btn-primary" onClick={handleComplete}>
          Continue to Guardian <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

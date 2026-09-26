'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import RealitySimulator from '@/components/RealitySimulator';
import StageEmptyState from '@/components/StageEmptyState';

const RISK_COLORS = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#DC2626',
};

export default function RealitySimulatorStage() {
  const { project, setRealitySimulator, updateSimulatorScenarioStatus, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);

  const { brandSystem, brandDNA, realitySimulator } = project;
  if (!brandSystem || !brandDNA) {
    return <StageEmptyState stage="realitySimulator" prerequisiteStage="system" />;
  }

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

      <RealitySimulator 
        survivalMap={realitySimulator.survivalMap} 
        scenarios={realitySimulator.scenarios} 
        onAction={handleAction} 
      />

      <div className="divider" />
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button className="btn-primary" onClick={handleComplete}>
          Continue to Guardian <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState, useEffect } from 'react';
import type { AgentResult } from '@/lib/types';
import { Check, ArrowRight } from 'lucide-react';

import BattleArena from '@/components/BattleArena';
import StageEmptyState from '@/components/StageEmptyState';

export default function BattleStage() {
  const { project, setStressTest, markStageComplete } = useStore();
  const battle = project.battle;
  const [loading, setLoading] = useState(false);

  if (!battle || !project.worlds || !project.brandDNA || !project.selectedWorldId) {
    return <StageEmptyState stage="battle" prerequisiteStage="worlds" />;
  }

  const selectedWorld = project.worlds.find(w => w.id === project.selectedWorldId)!;

  const handleNext = async () => {
    if (!selectedWorld || !project.brandDNA) return;
    setLoading(true);
    try {
      const st = await aiProvider.runStressTest(selectedWorld, project.brandDNA);
      setStressTest(st);
      markStageComplete('battle');
    } finally {
      setLoading(false);
    }
  };

  const completeAgents = battle.agents.filter(a => a.status === 'complete').length;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 05 / BRAND BATTLE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Put the direction on trial.
        </h1>
        <span className="badge badge-muted" style={{ flexShrink: 0, marginTop: '8px' }}>5 Agents / Sequential</span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '600px' }}>
        Five distinct lenses. One strategic conclusion. The goal is not consensus — it is a sharper decision.
      </p>

      <div className="divider" />

      <BattleArena 
        agents={battle.agents} 
        world={selectedWorld} 
        onNext={handleNext}
        loadingNext={loading}
      />
      
      {/* Collective synthesis (optional, keeping it here for context if complete) */}
      {battle.status === 'complete' && (
        <div
          className="animate-fade-in"
          style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '28px 32px',
            marginTop: '24px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Collective Synthesis
            </p>
          </div>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 500 }}>
            {battle.collectiveInsight}
          </p>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Recommendation
            </p>
            <p style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 700 }}>
              {battle.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

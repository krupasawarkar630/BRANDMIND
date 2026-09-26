'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import type { AgentResult } from '@/lib/types';
import { Check, ArrowRight, Shield, RefreshCw } from 'lucide-react';

import BattleArena from '@/components/BattleArena';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

export default function BattleStage() {
  const { project, setStressTest, markStageComplete } = useStore();
  const battle = project.battle;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!battle || !project.worlds || !project.brandDNA || !project.selectedWorldId) {
    return <StageEmptyState stage="battle" prerequisiteStage="worlds" />;
  }

  const selectedWorld = project.worlds.find((w) => w.id === project.selectedWorldId)!;

  const handleNext = async () => {
    if (!selectedWorld || !project.brandDNA) return;
    setError(null);
    setLoading(true);
    try {
      const st = await aiProvider.runStressTest(selectedWorld, project.brandDNA);
      setStressTest(st);
      toast.success('Completed anti-generic stress scan.', 'Stress Test Ready');
      markStageComplete('battle');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to complete stress test. Please try again.');
      toast.error('Stress test analysis failed.', 'Execution Error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Subjecting Direction to Cliche Scanner', detail: 'Scanning value propositions against 1,000+ generic startup tropes' },
    { label: 'Detecting Positioning Blind Spots', detail: 'Identifying jargon, over-promising, and weak differentiation' },
    { label: 'Formulating Actionable Antidotes', detail: 'Generating concrete improvements for each identified risk' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 05 / BRAND BATTLE
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '12px',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          Put the direction on trial.
        </h1>
        <span className="badge badge-muted" style={{ flexShrink: 0, marginTop: '8px' }}>
          5 Agents / Multi-Perspective
        </span>
      </div>

      <p
        style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '28px',
          lineHeight: 1.6,
          maxWidth: '680px',
        }}
      >
        Five distinct lenses cross-examine your chosen direction. The goal is not consensus — it is a sharper, battle-tested decision.
      </p>

      <AsyncProgressState
        isLoading={loading}
        error={error}
        onRetry={handleNext}
        steps={steps}
        title="Executing Anti-Generic Stress Testing Pipeline"
      />

      <BattleArena
        agents={battle.agents}
        world={selectedWorld}
        onNext={handleNext}
        loadingNext={loading}
      />

      {/* Collective synthesis */}
      {battle.status === 'complete' && (
        <div
          className="animate-fade-in"
          style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '28px 32px',
            marginTop: '24px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent)',
                animation: 'pulse-dot 1.5s ease-in-out infinite',
              }}
            />
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              Collective Synthesis & Hardening Directive
            </p>
          </div>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              marginBottom: '16px',
              fontWeight: 500,
            }}
          >
            {battle.collectiveInsight}
          </p>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}
            >
              Strategic Recommendation
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

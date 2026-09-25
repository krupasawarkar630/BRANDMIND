'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState, useEffect } from 'react';
import type { AgentResult } from '@/lib/types';
import { Check, ArrowRight } from 'lucide-react';

const AGENT_META: Record<string, { emoji: string; role: string; color: string }> = {
  strategist: { emoji: '⚡', role: 'Strategic positioning', color: '#2563EB' },
  audience: { emoji: '👥', role: 'Audience response', color: '#16A34A' },
  skeptic: { emoji: '🔍', role: 'Risk analysis', color: '#DC2626' },
  creative: { emoji: '✦', role: 'Creative distinctiveness', color: '#9333EA' },
  naming: { emoji: '⌘', role: 'Language ownership', color: '#D97706' },
};

function AgentCard({ agent }: { agent: AgentResult }) {
  const meta = AGENT_META[agent.agentId] || { emoji: '◎', role: agent.role, color: 'var(--accent)' };

  return (
    <div
      className={`agent-card animate-fade-in`}
      style={{
        borderColor: agent.status === 'complete' ? 'var(--border)' : undefined,
        opacity: agent.status === 'pending' ? 0.4 : 1,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {agent.status === 'complete' ? (
              <span className="badge badge-accent">Complete</span>
            ) : agent.status === 'running' ? (
              <span className="badge" style={{ background: '#FEF9C3', color: '#92400E', border: '1px solid #FDE68A' }}>Running</span>
            ) : (
              <span className="badge badge-muted">Pending</span>
            )}
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {agent.score}% confidence
            </span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em', marginTop: '4px' }}>
            {agent.agentName}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {meta.role}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Recommendation
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, maxWidth: '200px', textAlign: 'right', lineHeight: 1.4 }}>
            {agent.recommendation}
          </p>
        </div>
      </div>

      {/* Finding */}
      {agent.status === 'complete' && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Finding
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {agent.finding}
            </p>
          </div>

          <div className="quote-block" style={{ marginBottom: '12px' }}>
            {agent.evidence}
          </div>

          {agent.concern && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '10px 12px', background: '#FFF7F5', borderRadius: '6px', border: '1px solid #FDDDD5' }}>
              <span style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '1px' }}>!</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {agent.concern}
              </p>
            </div>
          )}
        </>
      )}

      {agent.status === 'running' && (
        <div style={{ display: 'flex', gap: '6px', padding: '12px 0' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                animation: `pulse-dot 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BattleStage() {
  const { project, setStressTest, markStageComplete } = useStore();
  const battle = project.battle;
  const [loading, setLoading] = useState(false);

  if (!battle || !project.worlds || !project.brandDNA || !project.selectedWorldId) return null;

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

      {/* Agent status row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {battle.agents.map((agent, i) => (
          <div
            key={agent.agentId}
            style={{
              padding: '14px 16px',
              background: 'var(--bg-card)',
              border: `1px solid ${agent.status === 'complete' ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '10px',
              opacity: agent.status === 'pending' ? 0.4 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>0{i + 1}</span>
              {agent.status === 'complete' && <Check size={12} color="var(--accent)" />}
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{agent.agentName}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{agent.status}</p>
          </div>
        ))}
      </div>

      {/* Agent results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {battle.agents.map(agent => (
          <AgentCard key={agent.agentId} agent={agent} />
        ))}
      </div>

      {/* Collective synthesis */}
      {battle.status === 'complete' && (
        <div
          className="animate-fade-in"
          style={{
            background: 'var(--bg-dark)',
            borderRadius: '12px',
            padding: '28px 32px',
            marginBottom: '32px',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              Collective Synthesis
            </p>
          </div>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>
            {battle.collectiveInsight}
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Recommendation
            </p>
            <p style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600 }}>
              {battle.recommendation}
            </p>
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={handleNext}
        disabled={loading}
        style={{ minWidth: '220px' }}
      >
        {loading ? (
          <>
            <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
            Running Stress Test...
          </>
        ) : (
          <>
            Run Anti-Generic Engine
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}

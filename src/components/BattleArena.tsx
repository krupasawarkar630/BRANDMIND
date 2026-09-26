'use client';

import React, { useState } from 'react';
import type { AgentResult, BrandWorld } from '@/lib/types';
import { Shield, Target, AlertTriangle, PenTool, Hash, ArrowRight, Zap, RefreshCw, GitCompare } from 'lucide-react';

const AGENT_ICONS: Record<string, React.ElementType> = {
  strategist: Target,
  audience: Shield,
  skeptic: AlertTriangle,
  creative: PenTool,
  naming: Hash,
};

function AgentNode({ 
  agent, 
  index, 
  total, 
  isActive, 
  onClick 
}: { 
  agent: AgentResult; 
  index: number; 
  total: number;
  isActive: boolean;
  onClick: () => void;
}) {
  // Distribute around a circle
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 160;
  const cx = 200 + radius * Math.cos(angle);
  const cy = 200 + radius * Math.sin(angle);
  
  const Icon = AGENT_ICONS[agent.agentId] || Target;
  const isComplete = agent.status === 'complete';

  return (
    <g 
      transform={`translate(${cx}, ${cy})`} 
      onClick={isComplete ? onClick : undefined}
      style={{ cursor: isComplete ? 'pointer' : 'default', transition: 'all 0.3s ease' }}
    >
      {/* Connecting line to center */}
      <line x1={-radius * Math.cos(angle)} y1={-radius * Math.sin(angle)} x2={0} y2={0} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
      
      {/* Node Background */}
      <circle 
        r={isActive ? 32 : 24} 
        fill={isActive ? 'rgba(217, 83, 30, 0.15)' : 'rgba(26, 26, 26, 1)'}
        stroke={isActive ? '#D9531E' : isComplete ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}
        strokeWidth="2"
      />
      
      {/* Running animation */}
      {agent.status === 'running' && (
        <circle r={28} fill="none" stroke="#D9531E" strokeWidth="1" strokeDasharray="4 4">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Icon */}
      <g transform="translate(-10, -10)" opacity={isComplete ? 1 : 0.4} color={isActive ? '#D9531E' : '#A1A1AA'}>
        <Icon size={20} />
      </g>

      {/* Label */}
      <text 
        y={isActive ? 45 : 35} 
        textAnchor="middle" 
        fill={isActive ? '#F4F3EF' : '#71717A'}
        fontSize="10px"
        fontWeight="700"
        letterSpacing="0.05em"
        style={{ textTransform: 'uppercase' }}
      >
        {agent.agentId}
      </text>
    </g>
  );
}

export default function BattleArena({ 
  agents, 
  world,
  onNext,
  loadingNext
}: { 
  agents: AgentResult[];
  world: BrandWorld;
  onNext: () => void;
  loadingNext: boolean;
}) {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(
    agents.find(a => a.status === 'complete')?.agentId || null
  );

  const activeAgent = agents.find(a => a.agentId === activeAgentId);

  // If new agents complete and none is selected, auto-select the latest complete one
  React.useEffect(() => {
    if (!activeAgentId) {
      const completeAgents = agents.filter(a => a.status === 'complete');
      if (completeAgents.length > 0) {
        setActiveAgentId(completeAgents[completeAgents.length - 1].agentId);
      }
    }
  }, [agents, activeAgentId]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      
      {/* Arena Canvas */}
      <div style={{ position: 'relative', height: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border)', background: 'rgba(0,0,0,0.01)' }}>
        
        {/* Opposing Forces Header */}
        <div style={{ position: 'absolute', top: 24, width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 40px', alignItems: 'center' }}>
          <div style={{ opacity: 0.5, textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>ALTERNATIVE</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>WORLD A</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--accent)', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em' }}>
            <span>←</span>
            BRAND BATTLE
            <span>→</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.1em', fontWeight: 700 }}>TRIAL SUBJECT</span>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>{world.name}</div>
          </div>
        </div>

        {/* SVG Graph */}
        <svg width="400" height="400" style={{ overflow: 'visible', marginTop: '20px' }}>
          {/* Center Brand Node */}
          <g transform="translate(200, 200)">
            <circle r="48" fill="rgba(217, 83, 30, 0.08)" stroke="var(--accent)" strokeWidth="1.5" />
            <circle r="40" fill="rgba(217, 83, 30, 0.15)" />
            <text y="-4" textAnchor="middle" fill="var(--text-primary)" fontSize="12px" fontWeight="800" letterSpacing="0.05em">THE</text>
            <text y="12" textAnchor="middle" fill="var(--text-primary)" fontSize="12px" fontWeight="800" letterSpacing="0.05em">BRAND</text>
          </g>

          {/* Agents */}
          {agents.map((agent, i) => (
            <AgentNode 
              key={agent.agentId} 
              agent={agent} 
              index={i} 
              total={agents.length} 
              isActive={activeAgentId === agent.agentId}
              onClick={() => setActiveAgentId(agent.agentId)}
            />
          ))}
        </svg>

        {/* Action Bar */}
        <div style={{ position: 'absolute', bottom: 24, display: 'flex', gap: '12px' }}>
          <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={12} /> Challenge this world
          </button>
          <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={12} /> Defend this world
          </button>
          <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitCompare size={12} /> Compare worlds
          </button>
        </div>
      </div>

      {/* Active Agent Inspector */}
      <div style={{ padding: '32px 24px', background: 'rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
        {activeAgent ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-accent">AGENT DATA</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>CONFIDENCE: {activeAgent.score}%</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {activeAgent.agentName}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {activeAgent.role}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              
              {/* Key Argument */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>KEY ARGUMENT</div>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>{activeAgent.finding}</p>
              </div>

              {/* Evidence */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>EVIDENCE & FACTORS</div>
                <div style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>"{activeAgent.evidence}"</p>
                </div>
              </div>

              {/* Concern */}
              {activeAgent.concern && (
                <div>
                  <div style={{ fontSize: '11px', color: '#DC2626', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                    <AlertTriangle size={12} /> CRITICAL CONCERN
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(220,38,38,0.08)', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.2)' }}>
                    <p style={{ fontSize: '13px', color: '#B91C1C', lineHeight: 1.5, fontWeight: 500 }}>{activeAgent.concern}</p>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div>
                <div style={{ fontSize: '11px', color: '#16A34A', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>RECOMMENDATION</div>
                <div style={{ padding: '12px', background: 'rgba(22, 163, 74, 0.08)', borderRadius: '8px', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
                  <p style={{ fontSize: '13px', color: '#15803D', lineHeight: 1.5, fontWeight: 600 }}>{activeAgent.recommendation}</p>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
            Battle in progress...<br/>Select a completed agent node to inspect reasoning.
          </div>
        )}

        {/* Proceed Button */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button
            className="btn-primary"
            onClick={onNext}
            disabled={loadingNext || agents.some(a => a.status !== 'complete')}
            style={{ width: '100%', justifyContent: 'space-between', padding: '14px 20px', fontSize: '13px' }}
          >
            {loadingNext ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                PREPARING STRESS TEST...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: agents.some(a => a.status !== 'complete') ? 0.5 : 1 }}>
                SEND TO STRESS TEST
                <ArrowRight size={16} />
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

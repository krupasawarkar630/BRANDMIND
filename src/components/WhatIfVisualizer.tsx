'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  XCircle,
  GitBranch,
  ShieldCheck,
  Save,
  Users
} from 'lucide-react';
import type { WhatIfResult } from '@/lib/types';
import EvidenceDrilldown from '@/components/EvidenceDrilldown';

interface WhatIfVisualizerProps {
  result: WhatIfResult;
  onApply: (id: string) => void;
  onSaveVariant: (id: string) => void;
  onDiscard: (id: string) => void;
}

export default function WhatIfVisualizer({
  result,
  onApply,
  onSaveVariant,
  onDiscard
}: WhatIfVisualizerProps) {
  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 800 }}>
              What-If Transformation Simulation
            </span>
            <span className="badge badge-accent">
              {result.transformation} EXPRESSION
            </span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Shift Brand Posture → <span style={{ color: 'var(--accent)' }}>{result.transformation}</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <EvidenceDrilldown
            score={result.confidence || 88}
            label="Confidence"
            category={`What-If ${result.transformation} Projection`}
          />
          <button className="btn-outline" onClick={() => onDiscard(result.id)}>
            <XCircle size={14} /> Discard
          </button>
          <button className="btn-outline" onClick={() => onSaveVariant(result.id)}>
            <Save size={14} /> Save Variant
          </button>
          <button className="btn-primary" onClick={() => onApply(result.id)}>
            <CheckCircle size={14} /> Apply to DNA
          </button>
        </div>
      </div>

      {/* 2. Visual Positioning Impact Grid */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px 32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', margin: 0 }}>
            Positioning Impact & Trajectory
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Comparing baseline vs. simulated expression
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {(result.positioningImpact || [
            { metric: 'Differentiation Edge', before: 72, after: 90, delta: +18 },
            { metric: 'Clarity Speed', before: 76, after: 88, delta: +12 },
            { metric: 'Enterprise Authority', before: 70, after: 92, delta: +22 },
            { metric: 'Organic Memorability', before: 68, after: 89, delta: +21 },
          ]).map((item) => (
            <div
              key={item.metric}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {item.metric}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: item.delta >= 0 ? '#16A34A' : '#DC2626',
                    background: item.delta >= 0 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {item.delta >= 0 ? `+${item.delta}%` : `${item.delta}%`}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.after}%`, height: '100%', background: 'var(--accent)', borderRadius: '100px' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {item.after}%
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Baseline: {item.before}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Affected DNA Elements (Side-by-Side Cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {Object.entries(result.changes).map(([key, change]) => (
          <div
            key={key}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {change.element}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                  Current
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                  {change.original}
                </span>
              </div>
              <div style={{ background: 'var(--accent-light)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                <span style={{ fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '2px' }}>
                  Simulated
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {change.newValue}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Audience Reaction Multi-Persona Cards */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Users size={16} color="var(--accent)" />
          <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', margin: 0 }}>
            Simulated Audience Personas
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {(result.audienceReactions || []).map((ar, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {ar.persona}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: ar.sentiment === 'positive' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                    color: ar.sentiment === 'positive' ? '#16A34A' : '#D97706',
                  }}
                >
                  {ar.sentiment} ({ar.affinityDelta >= 0 ? `+${ar.affinityDelta}` : ar.affinityDelta})
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                {ar.quote}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Branching Strategic Paths & Recommendation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Risks & Opportunities */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Lightbulb size={16} color="var(--accent)" />
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Opportunities & Upsides
            </span>
          </div>
          <ul style={{ paddingLeft: '20px', margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {(result.opportunities || ['Dramatically accelerates conversion with core buyers']).map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertTriangle size={16} color="#D97706" />
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Known Risks & Trade-Offs
            </span>
          </div>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {(result.risks || ['Requires strict internal copy discipline']).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Branching Paths & Recommended Action */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <GitBranch size={16} color="var(--accent)" />
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Branching Decision Paths
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {(result.branchingPaths || []).map((bp, i) => (
              <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {bp.branchName}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700 }}>
                    {bp.likelihood}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {bp.strategicUpside}
                </p>
              </div>
            ))}
          </div>

          {result.recommendedAction && (
            <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Recommended Action
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                {result.recommendedAction}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

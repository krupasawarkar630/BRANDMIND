'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import type { GenericIssue } from '@/lib/types';
import { ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  high: '#DC2626',
  medium: '#D97706',
  low: '#16A34A',
};

const RISK_BG: Record<string, string> = {
  high: '#FEF2F2',
  medium: '#FFFBEB',
  low: '#F0FDF4',
};

function IssueCard({ issue, index, active, onSelect }: {
  issue: GenericIssue;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '14px 16px',
        background: active ? 'var(--accent-light)' : 'var(--bg-card)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: active ? 600 : 400, color: active ? 'var(--accent)' : 'var(--text-primary)' }}>
        {issue.element}
      </span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: 'rotate(45deg)', opacity: active ? 1 : 0.4 }}>
        <path d="M1 6H11M6 1L11 6L6 11" stroke={active ? 'var(--accent)' : 'var(--text-primary)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function IssueDetail({ issue }: { issue: GenericIssue }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Original */}
      <div style={{ padding: '16px', background: '#F9F9F8', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Original
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6 }}>
          "{issue.original}"
        </p>
      </div>

      {/* Problem */}
      <div style={{ padding: '16px', background: RISK_BG[issue.riskLevel], borderRadius: '8px', border: `1px solid ${RISK_COLORS[issue.riskLevel]}22` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <AlertTriangle size={13} color={RISK_COLORS[issue.riskLevel]} />
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: RISK_COLORS[issue.riskLevel] }}>
            {issue.riskLevel.toUpperCase()} RISK — Problem
          </p>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '8px' }}>
          {issue.problem}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {issue.whyGeneric}
        </p>
      </div>

      {/* How to improve */}
      <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Lightbulb size={13} color="var(--accent)" />
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            How to improve
          </p>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '16px' }}>
          {issue.improvement}
        </p>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Stronger alternatives
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {issue.alternatives.map((alt, i) => (
            <div
              key={i}
              style={{
                padding: '10px 14px',
                background: 'var(--bg)',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              "{alt}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StressTestStage() {
  const { project, setBrandSystem, markStageComplete } = useStore();
  const stressTest = project.stressTest;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!stressTest || !project.worlds || !project.brandDNA || !project.selectedWorldId || !project.battle) return null;

  const selectedWorld = project.worlds.find(w => w.id === project.selectedWorldId)!;

  const handleNext = async () => {
    if (!selectedWorld || !project.brandDNA || !project.battle) return;
    setLoading(true);
    try {
      const system = await aiProvider.generateBrandSystem(selectedWorld, project.brandDNA, project.battle);
      setBrandSystem(system);
      markStageComplete('stress');
    } finally {
      setLoading(false);
    }
  };

  const activeIssue = stressTest.issues[selectedIndex];

  const riskCounts = {
    high: stressTest.issues.filter(i => i.riskLevel === 'high').length,
    medium: stressTest.issues.filter(i => i.riskLevel === 'medium').length,
    low: stressTest.issues.filter(i => i.riskLevel === 'low').length,
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 06 / ANTI-GENERIC TEST
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Catch the default answer.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>AI Assessment</span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '600px' }}>
        Genericity is not a scientific score. It is a useful provocation: where could this brand be mistaken for everything else?
      </p>

      <div className="divider" />

      {/* Summary row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {Object.entries(riskCounts).map(([level, count]) => count > 0 && (
          <div
            key={level}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '100px',
              background: RISK_BG[level],
              border: `1px solid ${RISK_COLORS[level]}33`,
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: RISK_COLORS[level] }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: RISK_COLORS[level] }}>
              {count} {level} risk
            </span>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px', marginBottom: '32px' }}>
        {/* Left: issue selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {stressTest.issues.map((issue, i) => (
            <IssueCard
              key={i}
              issue={issue}
              index={i}
              active={i === selectedIndex}
              onSelect={() => setSelectedIndex(i)}
            />
          ))}
        </div>

        {/* Right: detail */}
        <div>
          {activeIssue && <IssueDetail issue={activeIssue} />}
        </div>
      </div>

      {/* Summary */}
      <div className="quote-block" style={{ marginBottom: '32px', fontSize: '14px' }}>
        <strong>Overall assessment:</strong> {stressTest.summary}
      </div>

      <button
        className="btn-primary"
        onClick={handleNext}
        disabled={loading}
        style={{ minWidth: '220px' }}
      >
        {loading ? (
          <>
            <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
            Building Brand System...
          </>
        ) : (
          <>
            Generate Brand System
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}

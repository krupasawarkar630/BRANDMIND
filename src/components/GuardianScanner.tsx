'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ChevronRight, Wand2, CheckCircle } from 'lucide-react';
import type { GuardianResult, GuardianViolation } from '@/lib/types';

function ScoreRing({ value, label, color }: { value: number; label: string; color?: string }) {
  const ringColor = color || (value >= 80 ? '#16A34A' : value >= 60 ? '#D97706' : '#DC2626');
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 8px' }}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
          <circle
            cx="36" cy="36" r="30"
            fill="none"
            stroke={ringColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 30}`}
            strokeDashoffset={`${2 * Math.PI * 30 * (1 - value / 100)}`}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</span>
        </div>
      </div>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
        {label}
      </p>
    </div>
  );
}

function ViolationCard({ violation, onFix }: { violation: GuardianViolation; onFix: (id: string, fixed: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(220, 38, 38, 0.25)',
      boxShadow: '0 2px 8px rgba(220, 38, 38, 0.05)',
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'all 0.2s'
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
          cursor: 'pointer', userSelect: 'none'
        }}
      >
        <ShieldX size={16} color="#DC2626" />
        <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {violation.violation}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', padding: '3px 8px', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '100px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
          BREAKS RULE
        </span>
        {expanded ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(22, 163, 74, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>Expected (Brand DNA)</span>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{violation.expected}</p>
            </div>
            <div style={{ background: 'rgba(220, 38, 38, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>Found in Content</span>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{violation.generated}</p>
            </div>
          </div>
          <button
            onClick={() => onFix(violation.id, violation.fixedContent)}
            className="btn-primary"
            style={{
              width: '100%', padding: '10px',
              borderRadius: '6px', cursor: 'pointer',
              fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <Wand2 size={14} /> Auto-Fix This Violation
          </button>
        </div>
      )}
    </div>
  );
}

export default function GuardianScanner({
  result,
  onFix
}: {
  result: GuardianResult;
  onFix: (violationId: string, fixedContent: string) => void;
}) {
  const pendingViolations = result.violations.filter(v => v.status === 'pending');
  const fixedViolations = result.violations.filter(v => v.status === 'fixed');
  const allFixed = result.violations.length > 0 && pendingViolations.length === 0;

  const overallStatus = result.consistencyScore >= 85
    ? { label: '✓ ALIGNED', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.08)', border: 'rgba(22, 163, 74, 0.3)' }
    : result.consistencyScore >= 60
    ? { label: '⚠ NEEDS REVIEW', color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.3)' }
    : { label: '✕ BREAKS BRAND RULE', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)', border: 'rgba(220, 38, 38, 0.3)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* OVERALL STATUS */}
      <div style={{
        background: overallStatus.bg,
        border: `1px solid ${overallStatus.border}`,
        borderRadius: '16px',
        padding: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '32px'
      }}>
        {/* Score */}
        <div style={{ textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: overallStatus.color, lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
            {result.consistencyScore}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>alignment</span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '100px',
            border: `1px solid ${overallStatus.color}`,
            background: 'var(--bg-card)',
            color: overallStatus.color,
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
            marginBottom: '12px'
          }}>
            {result.consistencyScore >= 85 ? <ShieldCheck size={14} /> : result.consistencyScore >= 60 ? <ShieldAlert size={14} /> : <ShieldX size={14} />}
            {overallStatus.label}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
            {result.summary}
          </p>
        </div>
      </div>

      {/* DIMENSION SCORES */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <ScoreRing value={result.voiceMatch} label="Voice" />
        <ScoreRing value={result.personalityMatch} label="Personality" />
        <ScoreRing value={result.positioningMatch} label="Positioning" />
      </div>

      {/* VIOLATIONS */}
      {pendingViolations.length > 0 && (
        <div>
          <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Issues Detected ({pendingViolations.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingViolations.map(v => (
              <ViolationCard key={v.id} violation={v} onFix={onFix} />
            ))}
          </div>
        </div>
      )}

      {/* ALL CLEAR */}
      {(result.violations.length === 0 || allFixed) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px', background: 'rgba(22, 163, 74, 0.08)',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          borderRadius: '10px'
        }}>
          <CheckCircle size={18} color="#16A34A" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A' }}>
            {allFixed ? 'All violations fixed.' : 'No violations detected — content aligns with Brand DNA.'}
          </span>
        </div>
      )}

      {/* SUGGESTED REWRITE */}
      {result.suggestedRewrite && (
        <div style={{
          background: 'var(--accent-light)',
          border: '1px solid var(--accent)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
            AI-Suggested Rewrite
          </span>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 500 }}>
            "{result.suggestedRewrite}"
          </p>
        </div>
      )}
    </div>
  );
}

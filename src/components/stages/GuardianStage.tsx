'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, AlertTriangle, CheckCircle, Wand2 } from 'lucide-react';
import GuardianScanner from '@/components/GuardianScanner';
import StageEmptyState from '@/components/StageEmptyState';

function ScoreRing({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 8px' }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - value / 100)}`}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
        </div>
      </div>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
        {label}
      </p>
    </div>
  );
}

export default function GuardianStage() {
  const { project, setGuardian, fixGuardianViolation, setLaunchKit, markStageComplete } = useStore();
  const system = project.brandSystem;
  const dna = project.brandDNA;
  const [content, setContent] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(project.guardian || null);
  const [nextLoading, setNextLoading] = useState(false);

  if (!system || !dna) {
    return <StageEmptyState stage="guardian" prerequisiteStage="system" />;
  }

  const handleCheck = async () => {
    if (!content.trim()) return;
    setChecking(true);
    try {
      const r = await aiProvider.checkConsistency(content, system, dna, project.brandDnaLocked);
      setResult(r);
      setGuardian(r);
    } finally {
      setChecking(false);
    }
  };

  const handleFix = (violationId: string, fixedContent: string) => {
    fixGuardianViolation(violationId);
    setContent(fixedContent);
    // Locally update the result to hide the fixed violation
    if (result) {
      setResult({
        ...result,
        violations: result.violations.map(v => v.id === violationId ? { ...v, status: 'fixed' as const } : v)
      });
    }
  };

  const handleNext = async () => {
    if (!project.worlds || !project.selectedWorldId) return;
    const world = project.worlds.find(w => w.id === project.selectedWorldId)!;
    setNextLoading(true);
    try {
      const lk = await aiProvider.generateLaunchKit(system, world, dna);
      setLaunchKit(lk);
      markStageComplete('guardian');
    } finally {
      setNextLoading(false);
    }
  };

  const LABEL_COLORS: Record<string, string> = {
    'STRONG SIGNAL': '#16A34A',
    'ON TRACK': '#16A34A',
    'NEEDS A NUDGE': '#D97706',
    'NEEDS A REWRITE': '#DC2626',
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 08 / CONSISTENCY GUARDIAN
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Give the brand a second brain.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>Alignment Check</span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '600px' }}>
        Paste any new piece of content. The guardian compares it to the DNA, world, and system — then offers a rewrite you can actually use.
      </p>

      <div className="divider" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Input */}
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-primary)' }}>
            New content to check
          </p>
          <textarea
            className="input-field"
            rows={8}
            placeholder={`Paste a caption, headline, bio, or any copy...\n\nExample: "We help everyone unlock their full potential."`}
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ marginBottom: '12px' }}
          />
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={checking || !content.trim()}
            style={{ width: '100%' }}
          >
            {checking ? (
              <>
                <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                Checking consistency...
              </>
            ) : (
              <>
                Check consistency
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Result */}
        <div>
          {result ? (
            <GuardianScanner result={result} onFix={handleFix} />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px dashed var(--border)', borderRadius: '12px', minHeight: '260px' }}>
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="var(--text-muted)" strokeWidth="1.5"/>
                    <path d="M7 10l2 2 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Paste content and check alignment.<br />Results appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={handleNext}
        disabled={nextLoading}
        style={{ minWidth: '220px' }}
      >
        {nextLoading ? (
          <>
            <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
            Generating Launch Kit...
          </>
        ) : (
          <>
            Generate Launch Kit
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, AlertTriangle, CheckCircle, Wand2, Shield, Sparkles, FileText } from 'lucide-react';
import GuardianScanner from '@/components/GuardianScanner';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

const EXAMPLE_SNIPPETS = [
  {
    name: 'Generic SaaS Pitch',
    text: 'We leverage cutting-edge AI synergy to empower modern teams to unlock frictionless hyper-growth seamlessly.',
  },
  {
    name: 'Off-Brand Casual Copy',
    text: 'Yo check this out! Build cool stuff fast without any stress or boring setup. Guaranteed 10x results!',
  },
  {
    name: 'Aligned Direct Copy',
    text: 'Stop stitching together chaotic group chats. Find high-intent teammates ready to ship at the next hackathon.',
  },
];

export default function GuardianStage() {
  const { project, setGuardian, fixGuardianViolation, setLaunchKit, markStageComplete } = useStore();
  const system = project.brandSystem;
  const dna = project.brandDNA;
  const [content, setContent] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(project.guardian || null);
  const [nextLoading, setNextLoading] = useState(false);

  if (!system || !dna) {
    return <StageEmptyState stage="guardian" prerequisiteStage="system" />;
  }

  const handleCheck = async () => {
    if (!content.trim()) return;
    setError(null);
    setChecking(true);
    try {
      const r = await aiProvider.checkConsistency(content, system, dna, project.brandDnaLocked);
      setResult(r);
      setGuardian(r);
      if (r.violations.length === 0) {
        toast.success('Copy is 100% compliant with locked Brand DNA.', 'Scan Passed');
      } else {
        toast.warning(`Detected ${r.violations.length} rule deviations.`, 'Violations Found');
      }
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to scan copy against guardian rules.');
      toast.error('Guardian scan failed.', 'Scan Error');
    } finally {
      setChecking(false);
    }
  };

  const handleFix = (violationId: string, fixedContent: string) => {
    fixGuardianViolation(violationId);
    setContent(fixedContent);
    toast.success('Applied AI fix. Content aligned with Brand DNA.', 'Violation Fixed');
    if (result) {
      setResult({
        ...result,
        violations: result.violations.map((v) =>
          v.id === violationId ? { ...v, status: 'fixed' as const } : v
        ),
      });
    }
  };

  const handleNext = async () => {
    if (!project.worlds || !project.selectedWorldId) return;
    const world = project.worlds.find((w) => w.id === project.selectedWorldId)!;
    setError(null);
    setNextLoading(true);
    try {
      const lk = await aiProvider.generateLaunchKit(system, world, dna);
      setLaunchKit(lk);
      toast.success('Generated full Launch Kit constrained by Brand Constitution.', 'Launch Kit Ready');
      markStageComplete('guardian');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to generate Launch Kit.');
      toast.error('Launch kit generation failed.', 'Generation Error');
    } finally {
      setNextLoading(false);
    }
  };

  const steps = [
    { label: 'Ingesting Copy & Context', detail: 'Parsing linguistic tone, claims, and vocabulary choices' },
    { label: 'Scanning Locked Brand DNA & Memory', detail: 'Checking inviolable rules and past decision records' },
    { label: 'Formulating Inline Fixes & Diff', detail: 'Generating real-time token corrections' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 08 / CONSISTENCY GUARDIAN
        </span>
        {project.brandDnaLocked && (
          <span className="badge badge-accent">Enforcing Locked DNA</span>
        )}
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
          Give the brand an inviolable shield.
        </h1>
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
        Paste marketing copy, landing page headlines, or social drafts. The Guardian checks alignment against your locked Brand DNA, flags forbidden tropes, and generates instant token-level fixes.
      </p>

      {/* Example Presets */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          padding: '12px 16px',
          background: 'rgba(0, 0, 0, 0.02)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Test with Presets:
        </span>
        {EXAMPLE_SNIPPETS.map((snip) => (
          <button
            key={snip.name}
            type="button"
            onClick={() => setContent(snip.text)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {snip.name}
          </button>
        ))}
      </div>

      <AsyncProgressState
        isLoading={checking || nextLoading}
        error={error}
        onRetry={checking ? handleCheck : handleNext}
        steps={steps}
        title={checking ? 'Auditing Copy Alignment' : 'Generating Constrained Launch Kit'}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Input */}
        <div>
          <label
            htmlFor="guardian-input"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '10px',
              color: 'var(--text-primary)',
            }}
          >
            Content to Validate
          </label>
          <textarea
            id="guardian-input"
            className="input-field"
            rows={9}
            placeholder={`Paste a caption, headline, bio, or draft copy...\n\nExample: "We help everyone unlock their full potential with seamless AI synergy."`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ marginBottom: '14px', resize: 'vertical' }}
          />
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={checking || !content.trim()}
            style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {checking ? (
              <span>Auditing Copy...</span>
            ) : (
              <>
                <Shield size={15} /> Run Guardian Compliance Scan
              </>
            )}
          </button>
        </div>

        {/* Result */}
        <div>
          {result ? (
            <GuardianScanner result={result} onFix={handleFix} />
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px dashed var(--border)',
                borderRadius: '14px',
                minHeight: '280px',
                background: 'rgba(0, 0, 0, 0.01)',
              }}
            >
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Shield size={22} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Guardian Scanner Idle
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Paste content or pick an example preset on the left to verify consistency against Brand DNA.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="divider" />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={nextLoading}
          style={{ minWidth: '240px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {nextLoading ? (
            <span>Generating Launch Kit...</span>
          ) : (
            <>
              Generate Constrained Launch Kit
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

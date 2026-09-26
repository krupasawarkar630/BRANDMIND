'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import type { GenericIssue } from '@/lib/types';
import { ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react';

import GenericityScanner from '@/components/GenericityScanner';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

export default function StressTestStage() {
  const { project, setBrandSystem, markStageComplete } = useStore();
  const stressTest = project.stressTest;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!stressTest || !project.worlds || !project.brandDNA || !project.selectedWorldId || !project.battle) {
    return <StageEmptyState stage="stress" prerequisiteStage="battle" />;
  }

  const selectedWorld = project.worlds.find((w) => w.id === project.selectedWorldId)!;

  const handleNext = async () => {
    if (!selectedWorld || !project.brandDNA || !project.battle) return;
    setError(null);
    setLoading(true);
    try {
      const system = await aiProvider.generateBrandSystem(selectedWorld, project.brandDNA, project.battle);
      setBrandSystem(system);
      toast.success('Generated full operational Brand System.', 'System Assembled');
      markStageComplete('stress');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to generate Brand System. Please try again.');
      toast.error('Brand System generation failed.', 'Generation Error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Hardening Positioning Architecture', detail: 'Applying Battle and Stress Test improvements to brand foundations' },
    { label: 'Crafting Voice Guidelines & Do/Don’t Rules', detail: 'Formulating actionable editorial boundaries and messaging pillars' },
    { label: 'Defining Visual & Identity Tokens', detail: 'Generating harmonious typography, palette tokens, and aesthetic guides' },
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
          / 06 / ANTI-GENERIC TEST
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
          Catch the default answer.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>
          Anti-Generic Interrogation
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
        Genericity is a silent brand killer. Inspect detected generic tropes and examine concrete improvements before synthesizing your full Brand System.
      </p>

      <AsyncProgressState
        isLoading={loading}
        error={error}
        onRetry={handleNext}
        steps={steps}
        title="Synthesizing Full Operational Brand System"
      />

      <GenericityScanner
        stressTest={stressTest}
        onNext={handleNext}
        loadingNext={loading}
      />
    </div>
  );
}

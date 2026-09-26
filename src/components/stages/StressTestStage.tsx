'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import type { GenericIssue } from '@/lib/types';
import { ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react';

import GenericityScanner from '@/components/GenericityScanner';
import StageEmptyState from '@/components/StageEmptyState';

export default function StressTestStage() {
  const { project, setBrandSystem, markStageComplete } = useStore();
  const stressTest = project.stressTest;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!stressTest || !project.worlds || !project.brandDNA || !project.selectedWorldId || !project.battle) {
    return <StageEmptyState stage="stress" prerequisiteStage="battle" />;
  }

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

      <GenericityScanner 
        stressTest={stressTest} 
        onNext={handleNext} 
        loadingNext={loading} 
      />
    </div>
  );
}

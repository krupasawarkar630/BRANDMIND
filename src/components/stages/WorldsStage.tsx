'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import type { BrandWorld } from '@/lib/types';
import { ArrowRight, Check, Compass, Sparkles, RefreshCw, Layers } from 'lucide-react';

import BrandWorldCard from '@/components/BrandWorldCard';
import StageEmptyState from '@/components/StageEmptyState';
import CompetitorGapMap from '@/components/CompetitorGapMap';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

export default function WorldsStage() {
  const { project, selectWorld, setBattle, markStageComplete } = useStore();
  const [activeTab, setActiveTab] = useState<'worlds' | 'gapmap'>('worlds');
  const worlds = project.worlds;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedId = project.selectedWorldId;

  if (!worlds || !project.brandDNA) {
    return <StageEmptyState stage="worlds" prerequisiteStage="dna" />;
  }

  const handleSelectWorld = (worldId: string) => {
    selectWorld(worldId);
    const world = worlds.find((w) => w.id === worldId);
    if (world) {
      toast.info(`Selected "${world.name}" as trial candidate.`, 'World Selected');
    }
  };

  const handleNext = async () => {
    if (!selectedId || !project.brandDNA) return;
    setError(null);
    setLoading(true);
    try {
      const battle = await aiProvider.runBrandBattle(worlds, project.brandDNA, selectedId);
      setBattle(battle);
      toast.success('Completed 5-agent deliberation trial.', 'Trial Complete');
      markStageComplete('worlds');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to execute multi-agent trial. Please try again.');
      toast.error('Agent trial encountered an issue.', 'Trial Failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Dispatching 5 Specialized Evaluators', detail: 'Strategist, Audience Advocate, Skeptic, Creative Director, Naming Lead' },
    { label: 'Executing Cross-Examination', detail: 'Probing strategic upside, defensibility, and market vulnerability' },
    { label: 'Synthesizing Collective Recommendation', detail: 'Formulating hardening directives for the stress test' },
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
          / 04 / BRAND WORLDS & COMPETITOR GAP MAP
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
          Three ways to be remembered.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>
          3 Strategic Pathways
        </span>
      </div>

      <p
        style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          lineHeight: 1.6,
          maxWidth: '720px',
        }}
      >
        Compare three divergent brand narratives or plot your position against live competitors on the interactive Whitespace Gap Map.
      </p>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('worlds')}
          style={{
            padding: '8px 18px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'worlds' ? 'var(--text-primary)' : 'var(--bg-card)',
            color: activeTab === 'worlds' ? 'var(--bg)' : 'var(--text-secondary)',
            border: `1px solid ${activeTab === 'worlds' ? 'var(--text-primary)' : 'var(--border)'}`,
            transition: 'all 0.15s ease',
          }}
        >
          <Sparkles size={15} /> 3 Brand Worlds
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gapmap')}
          style={{
            padding: '8px 18px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'gapmap' ? 'var(--text-primary)' : 'var(--bg-card)',
            color: activeTab === 'gapmap' ? 'var(--bg)' : 'var(--text-secondary)',
            border: `1px solid ${activeTab === 'gapmap' ? 'var(--text-primary)' : 'var(--border)'}`,
            transition: 'all 0.15s ease',
          }}
        >
          <Compass size={15} /> Competitor Gap Map & Whitespace
        </button>
      </div>

      {activeTab === 'gapmap' ? (
        <div style={{ marginBottom: '32px' }}>
          <CompetitorGapMap />
        </div>
      ) : (
        <>
          <AsyncProgressState
            isLoading={loading}
            error={error}
            onRetry={handleNext}
            steps={steps}
            title="Multi-Agent Interrogation & Deliberation Trial"
          />

          {!selectedId ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              {worlds.map((world, i) => (
                <BrandWorldCard
                  key={world.id}
                  world={world}
                  index={i}
                  isSelected={false}
                  onEnter={() => handleSelectWorld(world.id)}
                />
              ))}
            </div>
          ) : (
            <div
              className="animate-fade-in"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              {worlds
                .filter((w) => w.id === selectedId)
                .map((world) => (
                  <div key={world.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => selectWorld(null as any)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent)',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 0',
                        }}
                      >
                        ← Compare all 3 Brand Worlds
                      </button>
                      <span className="badge badge-accent">Trial Candidate Locked</span>
                    </div>
                    <BrandWorldCard
                      world={world}
                      index={worlds.findIndex((w) => w.id === world.id)}
                      isSelected={true}
                      onEnter={() => {}}
                    />
                  </div>
                ))}
            </div>
          )}

          {selectedId && (
            <div
              className="animate-fade-in"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Ready for 5-Agent Interrogation Trial
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Strategist, Audience Advocate, Skeptic, Creative Director, and Naming Lead will critique this world.
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={loading}
                style={{
                  minWidth: '220px',
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {loading ? (
                  <span>Running Brand Battle...</span>
                ) : (
                  <>
                    Put It on Trial
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          )}

          {!selectedId && (
            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(217, 83, 30, 0.06)',
                border: '1px dashed rgba(217, 83, 30, 0.3)',
                borderRadius: '12px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '13px',
              }}
            >
              Select any Brand World above to lock your trial candidate and proceed to multi-agent interrogation.
            </div>
          )}
        </>
      )}
    </div>
  );
}

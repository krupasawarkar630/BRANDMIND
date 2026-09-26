'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import type { BrandWorld } from '@/lib/types';
import { ArrowRight, Check } from 'lucide-react';

import BrandWorldCard from '@/components/BrandWorldCard';
import StageEmptyState from '@/components/StageEmptyState';

export default function WorldsStage() {
  const { project, selectWorld, setBattle, markStageComplete } = useStore();
  const worlds = project.worlds;
  const [loading, setLoading] = useState(false);
  const selectedId = project.selectedWorldId;

  if (!worlds || !project.brandDNA) {
    return <StageEmptyState stage="worlds" prerequisiteStage="dna" />;
  }

  const handleNext = async () => {
    if (!selectedId || !project.brandDNA) return;
    setLoading(true);
    try {
      const battle = await aiProvider.runBrandBattle(worlds, project.brandDNA, selectedId);
      setBattle(battle);
      markStageComplete('worlds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 04 / BRAND WORLDS
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Three ways to be remembered.
        </h1>
        <span className="badge badge-muted" style={{ flexShrink: 0, marginTop: '8px' }}>3 Directions</span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '600px' }}>
        These are not moodboards. They are strategic worlds with different behaviors, language, and trade-offs.
        Choose the one you are willing to defend.
      </p>

      <div className="divider" />

      {!selectedId ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {worlds.map((world, i) => (
            <BrandWorldCard
              key={world.id}
              world={world}
              index={i}
              isSelected={false}
              onEnter={() => selectWorld(world.id)}
            />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>
          {worlds.filter(w => w.id === selectedId).map((world) => (
            <div key={world.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={() => selectWorld(null as any)}
                style={{ 
                  background: 'none', border: 'none', color: '#A1A1AA', fontSize: '12px', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: 0, width: 'fit-content' 
                }}
              >
                ← Explore other directions
              </button>
              <BrandWorldCard
                world={world}
                index={worlds.findIndex(w => w.id === world.id)}
                isSelected={true}
                onEnter={() => {}}
              />
            </div>
          ))}
        </div>
      )}

      {selectedId && (
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={loading}
            style={{ minWidth: '220px' }}
          >
            {loading ? (
              <>
                <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                Running Brand Battle...
              </>
            ) : (
              <>
                Put it on trial
                <ArrowRight size={14} />
              </>
            )}
          </button>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            5 agents will interrogate this direction
          </p>
        </div>
      )}

      {!selectedId && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Select a direction to proceed →
        </p>
      )}
    </div>
  );
}

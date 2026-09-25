'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import type { BrandWorld } from '@/lib/types';
import { ArrowRight, Check } from 'lucide-react';

function WorldCard({
  world,
  index,
  selected,
  onSelect,
}: {
  world: BrandWorld;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`stage-card${selected ? ' world-card-selected' : ''}`}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        borderColor: selected ? 'var(--accent)' : undefined,
        boxShadow: selected ? '0 0 0 2px rgba(217,83,30,0.1)' : undefined,
      }}
      onClick={onSelect}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600 }}>
          0{index + 1}
        </span>
        <div
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            border: selected ? '6px solid var(--accent)' : '1.5px solid var(--border)',
            background: selected ? 'var(--accent)' : 'transparent',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected && <Check size={10} color="white" strokeWidth={3} />}
        </div>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '6px', textTransform: 'uppercase' }}>
        {world.name}
      </h3>
      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', marginBottom: '12px' }}>
        {world.tagline}
      </p>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
        {world.strategicIdea}
      </p>

      <div className="divider" style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'SIGNAL', value: world.signalScore },
          { label: 'DIFFERENTIATION', value: world.differentiationScore },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                {label}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {value}
              </span>
            </div>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="divider" style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { label: 'Visual', value: world.visualDirection.split('.')[0] },
          { label: 'Voice', value: world.voiceDirection.split('.')[0] },
          { label: 'Risk', value: world.risks.split('.')[0] },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, paddingTop: '2px', minWidth: '44px' }}>
              {label}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{value}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: '16px', padding: '10px 12px', background: 'var(--accent-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={12} color="var(--accent)" />
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>Selected direction</span>
        </div>
      )}
    </div>
  );
}

export default function WorldsStage() {
  const { project, selectWorld, setBattle, markStageComplete } = useStore();
  const worlds = project.worlds;
  const [loading, setLoading] = useState(false);
  const selectedId = project.selectedWorldId;

  if (!worlds || !project.brandDNA) return null;

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {worlds.map((world, i) => (
          <WorldCard
            key={world.id}
            world={world}
            index={i}
            selected={selectedId === world.id}
            onSelect={() => selectWorld(world.id)}
          />
        ))}
      </div>

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

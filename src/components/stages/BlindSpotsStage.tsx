'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState, useEffect } from 'react';
import type { BlindSpot } from '@/lib/types';
import { ArrowRight, AlertTriangle } from 'lucide-react';

const SEVERITY_COLORS: Record<string, string> = {
  high: '#DC2626',
  medium: '#D97706',
  low: '#16A34A',
};

const SEVERITY_BG: Record<string, string> = {
  high: '#FEF2F2',
  medium: '#FFFBEB',
  low: '#F0FDF4',
};

function BlindSpotCard({ spot, onUpdate }: { spot: BlindSpot; onUpdate: (status: 'accepted' | 'rejected' | 'explored') => void }) {
  return (
    <div
      className="stage-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderColor: spot.status !== 'pending' ? 'var(--border)' : undefined,
        opacity: spot.status !== 'pending' ? 0.6 : 1,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color={SEVERITY_COLORS[spot.severity]} />
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: SEVERITY_COLORS[spot.severity] }}>
            {spot.severity} SEVERITY — {spot.category}
          </p>
        </div>
        {spot.status !== 'pending' && (
          <span className="badge badge-muted" style={{ fontSize: '10px' }}>
            {spot.status}
          </span>
        )}
      </div>

      <div style={{ padding: '16px', background: '#F9F9F8', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: '8px' }}>
          "{spot.statement}"
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong>Why BRANDMIND flagged it:</strong> {spot.evidence}
        </p>
      </div>

      <div>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '8px' }}>
          {spot.whyItMatters}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          <strong>Affected decisions:</strong> {spot.affectedBrandDecisions.join(', ')}
        </p>
      </div>

      <div className="quote-block" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
        <strong>BRANDMIND QUESTION:</strong> {spot.suggestedQuestion}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button
          className="btn-outline"
          onClick={() => onUpdate('accepted')}
          style={{ flex: 1, borderColor: spot.status === 'accepted' ? 'var(--accent)' : undefined, color: spot.status === 'accepted' ? 'var(--accent)' : undefined }}
        >
          Accept
        </button>
        <button
          className="btn-outline"
          onClick={() => onUpdate('rejected')}
          style={{ flex: 1, borderColor: spot.status === 'rejected' ? 'var(--text-primary)' : undefined, color: spot.status === 'rejected' ? 'var(--text-primary)' : undefined }}
        >
          Reject
        </button>
        <button
          className="btn-outline"
          onClick={() => onUpdate('explored')}
          style={{ flex: 1, borderColor: spot.status === 'explored' ? '#2563EB' : undefined, color: spot.status === 'explored' ? '#2563EB' : undefined }}
        >
          Explore
        </button>
      </div>
    </div>
  );
}

export default function BlindSpotsStage() {
  const { project, updateBlindSpotStatus, setBrandDNA, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);

  const blindSpots = project.blindSpots;
  
  useEffect(() => {
    async function fetchPersistedSpots() {
      if (!blindSpots || !project.id) return;
      try {
        const res = await fetch(`/api/blind-spots?projectId=${project.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.blindSpots && data.blindSpots.length > 0) {
            // Reconcile DB spots with local spots
            const updatedSpots = blindSpots.spots.map((s: any) => {
              const persisted = data.blindSpots.find((p: any) => p.id === s.id);
              return persisted ? { ...s, status: persisted.status } : s;
            });
            useStore.getState().setBlindSpots({ ...blindSpots, spots: updatedSpots });
          }
        }
      } catch (e) {
        console.error('Failed to fetch persisted spots', e);
      }
    }
    fetchPersistedSpots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  if (!blindSpots || !project.idea) return null;

  const allProcessed = blindSpots.spots.every(spot => spot.status !== 'pending');

  const handleUpdateSpot = async (spotId: string, status: 'accepted' | 'rejected' | 'explored') => {
    // Optimistic UI update via Zustand
    updateBlindSpotStatus(spotId, status);

    // Persist to Neon Postgres
    try {
      const spot = blindSpots.spots.find(s => s.id === spotId);
      if (spot) {
        await fetch('/api/blind-spots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project.id,
            blindSpot: { ...spot, status }
          })
        });
      }
    } catch (e) {
      console.error('Failed to persist blind spot to DB:', e);
    }
  };

  const handleNext = async () => {
    if (!project.idea) return;
    setLoading(true);
    try {
      const dna = await aiProvider.synthesizeBrandDNA(project.idea, blindSpots.spots);
      setBrandDNA(dna);
      markStageComplete('blindSpots');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 02 / BLIND-SPOT DETECTOR
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Don't build on weak assumptions.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>Validation Required</span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
        {blindSpots.summary} Address each assumption below to strengthen the strategic foundation.
      </p>

      <div className="divider" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        {blindSpots.spots.map(spot => (
          <BlindSpotCard
            key={spot.id}
            spot={spot}
            onUpdate={(status) => handleUpdateSpot(spot.id, status)}
          />
        ))}
      </div>

      <button
        className="btn-primary"
        onClick={handleNext}
        disabled={loading || !allProcessed}
        style={{ minWidth: '220px' }}
      >
        {loading ? (
          <>
            <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
            Synthesizing DNA...
          </>
        ) : (
          <>
            Generate Brand DNA
            <ArrowRight size={14} />
          </>
        )}
      </button>
      {!allProcessed && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
          Please accept, reject, or explore all potential blind spots to continue.
        </p>
      )}
    </div>
  );
}

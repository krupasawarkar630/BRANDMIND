'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState, useEffect } from 'react';
import type { BlindSpot } from '@/lib/types';
import { ArrowRight, AlertTriangle } from 'lucide-react';

import BlindSpotSignal from '@/components/BlindSpotSignal';
import StageEmptyState from '@/components/StageEmptyState';

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
            const updatedSpots = (blindSpots.spots || []).map((s: any) => {
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

  if (!blindSpots || !project.idea) {
    return <StageEmptyState stage="blindSpots" prerequisiteStage="idea" />;
  }

  const allProcessed = (blindSpots.spots || []).every(spot => spot.status !== 'pending');

  const handleUpdateSpot = async (spotId: string, status: 'accepted' | 'rejected' | 'explored') => {
    // Optimistic UI update via Zustand
    updateBlindSpotStatus(spotId, status);

    // Persist to Neon Postgres
    try {
      const spot = (blindSpots.spots || []).find(s => s.id === spotId);
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

      {/* AI Context — helps judges understand what happens next */}
      <div
        role="note"
        aria-label="AI process description"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '14px 16px',
          background: 'rgba(217,83,30,0.06)',
          border: '1px solid rgba(217,83,30,0.18)',
          borderRadius: '10px',
          marginBottom: '24px',
        }}
      >
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }} aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v4m0 2v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>
            What the AI is doing
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The AI analyzes the initial idea against common startup failures to extract blind spots, risky assumptions, and unverified claims. Accepting or rejecting these shapes the core Brand DNA.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        {(blindSpots.spots || []).map(spot => (
          <BlindSpotSignal
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

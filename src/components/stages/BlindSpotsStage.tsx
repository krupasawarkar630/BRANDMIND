'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState, useEffect } from 'react';
import type { BlindSpot } from '@/lib/types';
import { ArrowRight, AlertTriangle, CheckCircle2, XCircle, Filter, Sparkles } from 'lucide-react';
import BlindSpotSignal from '@/components/BlindSpotSignal';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

export default function BlindSpotsStage() {
  const { project, updateBlindSpotStatus, setBrandDNA, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const blindSpots = project.blindSpots;

  useEffect(() => {
    async function fetchPersistedSpots() {
      if (!blindSpots || !project.id) return;
      try {
        const res = await fetch(`/api/blind-spots?projectId=${project.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.blindSpots && data.blindSpots.length > 0) {
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

  const allProcessed = (blindSpots.spots || []).every((spot) => spot.status !== 'pending');
  const spots = blindSpots.spots || [];
  const filteredSpots = spots.filter((spot) => {
    if (statusFilter === 'all') return true;
    return spot.status === statusFilter;
  });

  const counts = {
    all: spots.length,
    pending: spots.filter((s) => s.status === 'pending').length,
    accepted: spots.filter((s) => s.status === 'accepted').length,
    rejected: spots.filter((s) => s.status === 'rejected').length,
  };

  const handleUpdateSpot = async (spotId: string, status: 'accepted' | 'rejected' | 'explored') => {
    updateBlindSpotStatus(spotId, status);
    toast.info(`Assumption marked as ${status}.`, 'Hypothesis Updated');

    try {
      const spot = spots.find((s) => s.id === spotId);
      if (spot) {
        await fetch('/api/blind-spots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project.id,
            blindSpot: { ...spot, status },
          }),
        });
      }
    } catch (e) {
      console.error('Failed to persist blind spot to DB:', e);
    }
  };

  const handleNext = async () => {
    if (!project.idea) return;
    setError(null);
    setLoading(true);
    try {
      const dna = await aiProvider.synthesizeBrandDNA(project.idea, blindSpots.spots);
      setBrandDNA(dna);
      toast.success('Brand DNA synthesized from validated assumptions.', 'DNA Crystallized');
      markStageComplete('blindSpots');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to synthesize Brand DNA. Please try again.');
      toast.error('DNA synthesis encountered an error.', 'Synthesis Failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Aggregating Validated Hypotheses', detail: 'Incorporating accepted premises and filtering out rejected assumptions' },
    { label: 'Synthesizing Strategic Substrate', detail: 'Formulating core problem, emotional territory, and differentiator' },
    { label: 'Calculating Substrate Confidence', detail: 'Cross-verifying internal logic against positioning principles' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '880px' }}>
      <div style={{ marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 02 / BLIND-SPOT DETECTOR
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
          Don't build on weak assumptions.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>
          {counts.pending === 0 ? 'All Validated' : `${counts.pending} Decisions Pending`}
        </span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
        {blindSpots.summary} Address each assumption below to strengthen the strategic foundation.
      </p>

      {/* Filter Tabs & Quick Processing Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          padding: '12px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>
            Filter:
          </span>
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              style={{
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                background: statusFilter === filterKey ? 'var(--accent)' : 'transparent',
                color: statusFilter === filterKey ? '#FFFFFF' : 'var(--text-secondary)',
                border: `1px solid ${statusFilter === filterKey ? 'var(--accent)' : 'var(--border)'}`,
                transition: 'all 0.15s ease',
              }}
            >
              {filterKey} ({counts[filterKey]})
            </button>
          ))}
        </div>

        {counts.pending > 0 && (
          <button
            onClick={() => {
              spots.forEach((s) => {
                if (s.status === 'pending') handleUpdateSpot(s.id, 'accepted');
              });
              toast.success('Accepted all remaining assumptions for this run.', 'Batch Accepted');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle2 size={14} /> Accept All Pending
          </button>
        )}
      </div>

      <AsyncProgressState
        isLoading={loading}
        error={error}
        onRetry={handleNext}
        steps={steps}
        title="Synthesizing Immutable Brand DNA"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {filteredSpots.map((spot) => (
          <BlindSpotSignal
            key={spot.id}
            spot={spot}
            onUpdate={(status) => handleUpdateSpot(spot.id, status)}
          />
        ))}
      </div>

      <div
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
            {allProcessed
              ? 'All assumptions validated & ready for DNA crystallization'
              : 'Please accept or reject all assumptions before advancing'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Accepted assumptions are integrated into your brand's core positioning principles.
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={loading || !allProcessed}
          style={{ minWidth: '220px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {loading ? (
            <span>Synthesizing DNA...</span>
          ) : (
            <>
              Generate Brand DNA
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

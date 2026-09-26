'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Play, Users, Sparkles } from 'lucide-react';
import AudienceRoomVisualizer from '@/components/AudiencePersona';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

export default function AudienceRoomStage() {
  const { project, setAudienceRoom, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const room = project.audienceRoom;
  const { brandSystem, brandDNA } = project;

  if (!brandSystem || !brandDNA) {
    return <StageEmptyState stage="audienceRoom" prerequisiteStage="system" />;
  }

  const handleRun = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await aiProvider.runAudienceRoom(brandSystem, brandDNA);
      setAudienceRoom(result);
      toast.success('Simulated reactions across 4 buyer personas.', 'Simulation Ready');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to simulate audience room. Please try again.');
      toast.error('Audience simulation failed.', 'Execution Error');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    toast.success('Audience simulation recorded to project state.', 'Insights Saved');
    markStageComplete('audienceRoom');
  };

  const steps = [
    { label: 'Initializing Persona Cognitive Models', detail: 'Calibrating expectations for Tech Skeptic, Enterprise Buyer, and Early Adopter' },
    { label: 'Simulating First Impressions & Objections', detail: 'Evaluating clarity, distinctiveness, and perceived value' },
    { label: 'Synthesizing Consensus & Strategic Tension', detail: 'Extracting universal resonance points and polarizing vectors' },
  ];

  if (!room) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent)',
              letterSpacing: '0.05em',
            }}
          >
            / 07b / AUDIENCE REACTION ROOM
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}
        >
          Put your brand in front of different minds.
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
          Instead of asking AI a generic "will they like this?", we simulate structured reactions from multiple audience perspectives grounded in your Brand DNA and locked principles.
        </p>

        <AsyncProgressState
          isLoading={loading}
          error={error}
          onRetry={handleRun}
          steps={steps}
          title="Simulating Multi-Persona Audience Room"
        />

        {!loading && (
          <button
            className="btn-primary"
            onClick={handleRun}
            disabled={loading}
            style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Play size={15} /> Simulate Audience Reactions
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', maxWidth: '980px' }}>
      <AudienceRoomVisualizer
        room={room}
        brandName={brandSystem.brandName || 'THE BRAND'}
        onNext={handleComplete}
      />
    </div>
  );
}

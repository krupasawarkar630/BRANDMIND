'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import AudienceRoomVisualizer from '@/components/AudiencePersona';
import StageEmptyState from '@/components/StageEmptyState';

export default function AudienceRoomStage() {
  const { project, setAudienceRoom, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const room = project.audienceRoom;
  const { brandSystem, brandDNA } = project;

  if (!brandSystem || !brandDNA) {
    return <StageEmptyState stage="audienceRoom" prerequisiteStage="system" />;
  }

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await aiProvider.runAudienceRoom(brandSystem, brandDNA);
      setAudienceRoom(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToBattle = () => {
    if (!room) return;
    setAudienceRoom({ ...room, sentToBattle: true });
    alert('Insight sent to Brand Battle context (Phase 2).');
  };

  const handleSendToMutation = () => {
    alert('Insight sent to Brand Mutation Lab (Future Phase).');
  };

  const handleComplete = () => {
    markStageComplete('audienceRoom');
  };

  if (!room) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
            / 07b / AUDIENCE REACTION ROOM
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Put your brand in front of different minds.
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
          Instead of asking AI "will they like this?", we simulate structured reactions from multiple audience perspectives based on your Brand DNA and System. 
          <br /><br />
          <strong>AI SIMULATION — not real user research.</strong>
        </p>

        <button className="btn-primary" onClick={handleRun} disabled={loading}>
          {loading ? (
            <>
              <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
              Gathering audience reactions...
            </>
          ) : (
            <>
              <Play size={14} /> Simulate Reactions
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <AudienceRoomVisualizer 
        room={room} 
        brandName={brandSystem.brandName || 'THE BRAND'}
        onNext={handleComplete} 
      />
    </div>
  );
}

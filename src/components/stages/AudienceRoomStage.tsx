'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Users, Play, BarChart2 } from 'lucide-react';

export default function AudienceRoomStage() {
  const { project, setAudienceRoom, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const room = project.audienceRoom;
  const { brandSystem, brandDNA } = project;

  if (!brandSystem || !brandDNA) return null;

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
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07b / AUDIENCE REACTION ROOM
        </span>
        <span className="badge badge-muted">AI SIMULATION — not real user research</span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Audience Reactions
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {room.reactions.map(r => (
          <div key={r.id} className="stage-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Users size={16} color="var(--accent)" />
              <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                {r.persona}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>First Impression</span>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>"{r.firstImpression}"</p>
              </div>
              
              <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '6px' }}>
                <span style={{ fontSize: '11px', color: '#16A34A', textTransform: 'uppercase', fontWeight: 600 }}>Appeal</span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>"{r.appeal}"</p>
              </div>

              <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '6px' }}>
                <span style={{ fontSize: '11px', color: '#DC2626', textTransform: 'uppercase', fontWeight: 600 }}>Objection / Confusion</span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>"{r.objection}" {r.confusion}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Trust</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.trustLevel}</span>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Clarity</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.clarityScore}/100</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dark-hero" style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={16} /> Audience Consensus
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px' }}>
          {[
            { label: 'Clarity', val: room.consensus.clarity },
            { label: 'Memorability', val: room.consensus.memorability },
            { label: 'Distinctiveness', val: room.consensus.distinctiveness },
            { label: 'Trust', val: room.consensus.trust },
            { label: 'Audience Fit', val: room.consensus.audienceFit },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#E5E5E3' }}>{stat.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{stat.val}%</span>
              </div>
              <div className="score-bar" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="score-bar-fill" style={{ width: `${stat.val}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {!showComparison ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <button className="btn-outline" onClick={() => setShowComparison(true)}>
            Compare Reactions
          </button>
        </div>
      ) : (
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Comparison & Insights
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div style={{ background: '#F0FDF4', padding: '20px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Agreement
              </span>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {room.agreement}
              </p>
            </div>
            
            <div style={{ background: '#FEF2F2', padding: '20px', borderRadius: '8px', border: '1px solid #FECACA' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Disagreement
              </span>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {room.disagreement}
              </p>
            </div>
          </div>

          <div className="quote-block" style={{ marginBottom: '24px' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>AI INSIGHT:</strong>
            {room.insight}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-outline" onClick={handleSendToBattle} disabled={room.sentToBattle}>
              {room.sentToBattle ? 'Sent to Brand Battle' : 'Send Insight to Brand Battle'}
            </button>
            <button className="btn-outline" onClick={handleSendToMutation}>
              Send Insight to Brand Mutation
            </button>
          </div>
        </div>
      )}

      <div className="divider" />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to Guardian <ArrowRight size={14} />
      </button>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Palette, Type, Layout, MousePointerClick, Send, Lock } from 'lucide-react';
import VisualDNABoard from '@/components/VisualDNA';
import StageEmptyState from '@/components/StageEmptyState';

export default function VisualDnaStage() {
  const { project, setVisualDNA, sendVisualDnaToBrandSystem, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);

  const { brandDNA, brandSystem, worlds, selectedWorldId, visualDNA } = project;
  if (!brandDNA || !brandSystem || !worlds || !selectedWorldId) {
    return <StageEmptyState stage="visualDna" prerequisiteStage="system" />;
  }
  const world = worlds.find(w => w.id === selectedWorldId)!;

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await aiProvider.generateVisualDNA(brandSystem, brandDNA, world);
      setVisualDNA(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    sendVisualDnaToBrandSystem();
  };

  const handleComplete = () => {
    markStageComplete('visualDna');
  };

  const renderColorSwatch = (color: string, label: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ width: '100%', height: '48px', background: color, borderRadius: '6px', border: '1px solid var(--border)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{color}</span>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07i / VISUAL DNA
        </span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Turn strategy into a visual system.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '800px' }}>
        We take your Brand Personality, Positioning, and selected Brand World, and generate a structured Visual DNA outlining the colors, typography, shapes, and rules.
      </p>

      {!visualDNA || visualDNA.status !== 'complete' ? (
        <button className="btn-primary" onClick={handleRun} disabled={loading} style={{ marginBottom: '40px' }}>
          {loading ? (
            <>
              <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
              Generating Visual DNA...
            </>
          ) : (
            <>
              <Palette size={14} /> Generate Visual System
            </>
          )}
        </button>
      ) : (
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          
          <VisualDNABoard visualDNA={visualDNA} brandSystem={brandSystem} />

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button className="btn-outline" onClick={handleRun} disabled={loading}>
              Regenerate Visual Direction
            </button>
            <button className="btn-primary" onClick={handleSend} disabled={visualDNA.isLocked}>
              <Send size={14} /> Send to Brand System
            </button>
          </div>
        </div>
      )}

      <div className="divider" />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to DNA Lock <ArrowRight size={14} />
      </button>
    </div>
  );
}

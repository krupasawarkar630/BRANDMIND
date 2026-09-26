'use client';

import { useStore } from '@/lib/store';
import { ArrowRight, GitCommit, Search, GitBranch } from 'lucide-react';
import DecisionTimeline from '@/components/DecisionTimeline';
import BrandExperimentReplay from '@/components/BrandExperimentReplay';
import StageEmptyState from '@/components/StageEmptyState';

export default function TimelineStage() {
  const { project, markStageComplete } = useStore();
  
  const { timeline = [], brandSystem } = project;
  if (!brandSystem) {
    return <StageEmptyState stage="timeline" prerequisiteStage="system" />;
  }

  const handleComplete = () => {
    markStageComplete('timeline');
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07g / BRAND DECISION TIMELINE
        </span>
        <span className="badge badge-accent">HISTORY</span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        How your brand evolved.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
        Every strategic pivot, mutation, and A/B choice is logged here. This creates a transparent record of why your brand is the way it is, preventing future stakeholders from reversing critical decisions blindly.
      </p>

      {timeline.length === 0 ? (
        <div className="stage-card" style={{ textAlign: 'center', padding: '40px' }}>
          <GitBranch size={24} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No decisions logged yet
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Use the Brand Mutation Lab or A/B Experiments to modify your brand system and start building your timeline.
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: '40px' }}>
          <BrandExperimentReplay events={timeline} />
          <DecisionTimeline events={timeline} />
        </div>
      )}

      <div className="divider" />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to Guardian <ArrowRight size={14} />
      </button>
    </div>
  );
}

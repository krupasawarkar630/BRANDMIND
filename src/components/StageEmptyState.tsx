'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Stage, STAGE_LABELS } from '@/lib/types';
import { Sparkles, ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';

interface StageEmptyStateProps {
  stage: Stage;
  title?: string;
  description?: string;
  prerequisiteStage?: Stage;
}

export default function StageEmptyState({
  stage,
  title,
  description,
  prerequisiteStage = 'idea',
}: StageEmptyStateProps) {
  const { loadDemoUpToStage, loadFullDemoProject, setCurrentStage } = useStore();
  const [seeding, setSeeding] = useState(false);

  const stageName = STAGE_LABELS[stage] || stage;
  const prereqName = STAGE_LABELS[prerequisiteStage] || prerequisiteStage;

  const handleSeedStage = () => {
    setSeeding(true);
    setTimeout(() => {
      loadDemoUpToStage(stage);
      setSeeding(false);
    }, 250);
  };

  const handleSeedAll = () => {
    setSeeding(true);
    setTimeout(() => {
      loadFullDemoProject(stage);
      setSeeding(false);
    }, 250);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        maxWidth: '720px',
        margin: '32px auto',
        padding: '40px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Icon Badge */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: 'rgba(217, 83, 30, 0.12)',
          border: '1px solid rgba(217, 83, 30, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'var(--accent)',
        }}
      >
        <Sparkles size={28} />
      </div>

      <span
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        STAGE INPUT REQUIRED
      </span>

      <h2
        style={{
          fontSize: '28px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: '12px 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        {title || `${stageName} is ready for data`}
      </h2>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '520px',
          margin: '0 auto 28px',
        }}
      >
        {description ||
          `This stage builds on data from ${prereqName}. You can start from the beginning, or instantly generate realistic demo data to explore and stress-test this stage right now.`}
      </p>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          onClick={handleSeedStage}
          disabled={seeding}
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <Zap size={16} />
          {seeding ? 'Generating stage data...' : `Generate Data for ${stageName}`}
        </button>

        <button
          onClick={handleSeedAll}
          disabled={seeding}
          className="btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            fontSize: '14px',
          }}
        >
          <CheckCircle2 size={16} />
          Unlock Full Demo Project
        </button>

        <button
          onClick={() => setCurrentStage('idea')}
          className="btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            fontSize: '14px',
            color: 'var(--text-muted)',
          }}
        >
          <ArrowLeft size={16} />
          Start from Idea Stage
        </button>
      </div>
    </div>
  );
}

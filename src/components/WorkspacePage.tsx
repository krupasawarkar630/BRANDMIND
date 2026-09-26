'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store';
import BrandEvolutionMap from '@/components/BrandEvolutionMap';
import Header from '@/components/Header';
import ToastContainer from '@/components/ToastContainer';
import { STAGE_LABELS } from '@/lib/types';

function StageSkeleton() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '880px', padding: '20px 0' }}>
      <div style={{ width: '140px', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '16px' }} />
      <div style={{ width: '380px', height: '36px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', marginBottom: '16px' }} />
      <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '32px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ height: '140px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
        <div style={{ height: '140px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
        <div style={{ height: '140px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
      </div>
    </div>
  );
}

// Lazy loaded stage modules with dynamic code splitting
const IdeaStage = dynamic(() => import('@/components/stages/IdeaStage'), { loading: () => <StageSkeleton /> });
const BlindSpotsStage = dynamic(() => import('@/components/stages/BlindSpotsStage'), { loading: () => <StageSkeleton /> });
const DNAStage = dynamic(() => import('@/components/stages/DNAStage'), { loading: () => <StageSkeleton /> });
const WorldsStage = dynamic(() => import('@/components/stages/WorldsStage'), { loading: () => <StageSkeleton /> });
const BattleStage = dynamic(() => import('@/components/stages/BattleStage'), { loading: () => <StageSkeleton /> });
const StressTestStage = dynamic(() => import('@/components/stages/StressTestStage'), { loading: () => <StageSkeleton /> });
const SystemStage = dynamic(() => import('@/components/stages/SystemStage'), { loading: () => <StageSkeleton /> });
const AudienceRoomStage = dynamic(() => import('@/components/stages/AudienceRoomStage'), { loading: () => <StageSkeleton /> });
const MutationLabStage = dynamic(() => import('@/components/stages/MutationLabStage'), { loading: () => <StageSkeleton /> });
const WhatIfMachineStage = dynamic(() => import('@/components/stages/WhatIfMachineStage'), { loading: () => <StageSkeleton /> });
const RealitySimulatorStage = dynamic(() => import('@/components/stages/RealitySimulatorStage'), { loading: () => <StageSkeleton /> });
const ABExperimentStage = dynamic(() => import('@/components/stages/ABExperimentStage'), { loading: () => <StageSkeleton /> });
const TimelineStage = dynamic(() => import('@/components/stages/TimelineStage'), { loading: () => <StageSkeleton /> });
const VisualDnaStage = dynamic(() => import('@/components/stages/VisualDnaStage'), { loading: () => <StageSkeleton /> });
const CultureAdaptationStage = dynamic(() => import('@/components/stages/CultureAdaptationStage'), { loading: () => <StageSkeleton /> });
const DnaLockStage = dynamic(() => import('@/components/stages/DnaLockStage'), { loading: () => <StageSkeleton /> });
const CrisisRoomStage = dynamic(() => import('@/components/stages/CrisisRoomStage'), { loading: () => <StageSkeleton /> });
const GuardianStage = dynamic(() => import('@/components/stages/GuardianStage'), { loading: () => <StageSkeleton /> });
const LaunchStage = dynamic(() => import('@/components/stages/LaunchStage'), { loading: () => <StageSkeleton /> });

export default function WorkspacePage() {
  const { project } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stage = mounted ? project.currentStage : 'idea';
  const stageLabel = STAGE_LABELS[stage] ?? 'Stage';

  const renderStage = () => {
    switch (stage) {
      case 'idea': return <IdeaStage />;
      case 'blindSpots': return <BlindSpotsStage />;
      case 'dna': return <DNAStage />;
      case 'worlds': return <WorldsStage />;
      case 'battle': return <BattleStage />;
      case 'stress': return <StressTestStage />;
      case 'system': return <SystemStage />;
      case 'audienceRoom': return <AudienceRoomStage />;
      case 'mutationLab': return <MutationLabStage />;
      case 'whatIfMachine': return <WhatIfMachineStage />;
      case 'realitySimulator': return <RealitySimulatorStage />;
      case 'abExperiment': return <ABExperimentStage />;
      case 'timeline': return <TimelineStage />;
      case 'visualDna': return <VisualDnaStage />;
      case 'cultureAdaptation': return <CultureAdaptationStage />;
      case 'dnaLock': return <DnaLockStage />;
      case 'crisisRoom': return <CrisisRoomStage />;
      case 'guardian': return <GuardianStage />;
      case 'launch': return <LaunchStage />;
      default: return <IdeaStage />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Header />
      <BrandEvolutionMap />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {mounted ? `Now viewing: ${stageLabel}` : ''}
        </div>
        <main
          id="main-content"
          role="main"
          aria-label={`${stageLabel} — BRANDMIND workspace`}
          style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '40px 48px 80px', background: 'var(--bg)' }}
        >
          {renderStage()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

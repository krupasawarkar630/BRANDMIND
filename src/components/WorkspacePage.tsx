'use client';

import { useStore } from '@/lib/store';
import BrandEvolutionMap from '@/components/BrandEvolutionMap';
import Header from '@/components/Header';
import IdeaStage from '@/components/stages/IdeaStage';
import BlindSpotsStage from '@/components/stages/BlindSpotsStage';
import DNAStage from '@/components/stages/DNAStage';
import WorldsStage from '@/components/stages/WorldsStage';
import BattleStage from '@/components/stages/BattleStage';
import StressTestStage from '@/components/stages/StressTestStage';
import SystemStage from '@/components/stages/SystemStage';
import AudienceRoomStage from '@/components/stages/AudienceRoomStage';
import MutationLabStage from '@/components/stages/MutationLabStage';
import WhatIfMachineStage from '@/components/stages/WhatIfMachineStage';
import RealitySimulatorStage from '@/components/stages/RealitySimulatorStage';
import ABExperimentStage from '@/components/stages/ABExperimentStage';
import TimelineStage from '@/components/stages/TimelineStage';
import VisualDnaStage from '@/components/stages/VisualDnaStage';
import CultureAdaptationStage from '@/components/stages/CultureAdaptationStage';
import DnaLockStage from '@/components/stages/DnaLockStage';
import CrisisRoomStage from '@/components/stages/CrisisRoomStage';
import GuardianStage from '@/components/stages/GuardianStage';
import LaunchStage from '@/components/stages/LaunchStage';
import { STAGE_LABELS } from '@/lib/types';
import { useState, useEffect } from 'react';

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
    </div>
  );
}

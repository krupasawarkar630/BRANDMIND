'use client';

import { useStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
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

import { useState, useEffect } from 'react';

export default function WorkspacePage() {
  const { project } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stage = mounted ? project.currentStage : 'idea';

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
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '40px 48px 80px',
            background: 'var(--bg)',
          }}
        >
          {renderStage()}
        </main>
      </div>
    </div>
  );
}

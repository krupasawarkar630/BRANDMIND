'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Stage } from '@/lib/types';
import { 
  Lightbulb, Search, Dna, Globe, Swords, 
  Activity, GitMerge, Lock, Rocket, CheckCircle2 
} from 'lucide-react';

type MapNode = {
  id: string;
  label: string;
  stages: Stage[];
  icon: React.ElementType;
};

const MAP_NODES: MapNode[] = [
  { id: 'idea', label: 'IDEA', stages: ['idea'], icon: Lightbulb },
  { id: 'discover', label: 'DISCOVER', stages: ['blindSpots'], icon: Search },
  { id: 'dna', label: 'DNA', stages: ['dna'], icon: Dna },
  { id: 'worlds', label: 'WORLDS', stages: ['worlds'], icon: Globe },
  { id: 'battle', label: 'BATTLE', stages: ['battle'], icon: Swords },
  { id: 'stress', label: 'STRESS TEST', stages: ['stress', 'system', 'audienceRoom', 'mutationLab', 'whatIfMachine', 'realitySimulator', 'abExperiment'], icon: Activity },
  { id: 'decision', label: 'DECISION', stages: ['timeline', 'visualDna', 'cultureAdaptation'], icon: GitMerge },
  { id: 'lock', label: 'LOCK', stages: ['dnaLock', 'guardian', 'crisisRoom'], icon: Lock },
  { id: 'launch', label: 'LAUNCH', stages: ['launch'], icon: Rocket },
];

export default function BrandEvolutionMap() {
  const { project, setCurrentStage, canAccessStage } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleNodeClick = (node: MapNode) => {
    // Find either the active stage if already in this node, or the latest completed stage, or the first stage of the node
    const activeInNode = node.stages.find(s => s === project.currentStage);
    if (activeInNode) return;

    let targetStage = node.stages[0];
    for (let i = node.stages.length - 1; i >= 0; i--) {
      if (project.completedStages.includes(node.stages[i])) {
        targetStage = node.stages[i];
        break;
      }
    }
    
    setCurrentStage(targetStage);
  };

  return (
    <nav
      className="brand-evolution-map"
      aria-label="Brand development stages"
      role="navigation"
    >
      <div className="map-container" role="list">
        {MAP_NODES.map((node, index) => {
          const isActive = node.stages.includes(project.currentStage);
          const isCompleted = node.stages.every(s => project.completedStages.includes(s));
          const isUnlocked = true;
            
          const Icon = node.icon;
          
          // Calculate progress if it's a multi-stage node
          let progress = 0;
          if (node.stages.length > 1) {
            const completedInNode = node.stages.filter(s => project.completedStages.includes(s)).length;
            progress = (completedInNode / node.stages.length) * 100;
          } else if (isCompleted) {
            progress = 100;
          }

          const statusLabel = isActive ? 'current' : isCompleted ? 'completed' : 'available';

          return (
            <React.Fragment key={node.id}>
              {/* The Node */}
              <div
                role="listitem"
              >
                <div
                  className={`map-node ${isActive ? 'active' : ''} unlocked ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleNodeClick(node)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNodeClick(node);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label} stage — ${statusLabel}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="node-icon-wrapper" aria-hidden="true">
                    {isCompleted && !isActive ? (
                      <CheckCircle2 size={18} className="icon completed-icon" />
                    ) : (
                      <Icon size={18} className="icon" />
                    )}
                    {isActive && <div className="glow-ring" aria-hidden="true"></div>}
                  </div>
                  
                  <div className="node-info">
                    <span className="node-label">{node.label}</span>
                    {node.stages.length > 1 && isUnlocked && (
                      <div className="progress-bar-bg" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`${node.label} progress: ${Math.round(progress)}%`}>
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* The Connector Line — decorative, hidden from AT */}
              {index < MAP_NODES.length - 1 && (
                <div className={`map-connector ${isCompleted ? 'completed' : 'locked'}`} aria-hidden="true">
                  <div className="connector-line"></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );

}

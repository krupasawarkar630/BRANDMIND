'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from './store';

export function useAutoSync() {
  const { project } = useStore();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!project || !project.id) return;

    // Serialize key aspects of project to avoid redundant saves
    const projectFingerprint = JSON.stringify({
      id: project.id,
      stage: project.currentStage,
      updatedAt: project.updatedAt,
      completed: project.completedStages,
      idea: project.idea,
      dna: project.brandDNA,
      worldsCount: project.worlds?.length || 0,
      locked: project.brandDnaLocked,
      timelineCount: project.timeline?.length || 0
    });

    if (lastSavedRef.current === projectFingerprint) return;

    const timer = setTimeout(async () => {
      try {
        setSyncStatus('saving');
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: project.id,
            name: project.idea?.idea ? project.idea.idea.slice(0, 50) : 'Brand Study',
            tagline: project.brandDNA?.positioning || null,
            currentStage: project.currentStage,
            ideaInput: project.idea,
            completedStages: project.completedStages,
            brandDnaLocked: project.brandDnaLocked,
            dna: project.brandDNA,
            worlds: project.worlds,
            battle: project.battle,
            stressTest: project.stressTest,
            audienceRoom: project.audienceRoom,
            mutationsList: project.mutations,
            whatIf: project.whatIfResult,
            decisionLogs: project.timeline,
            guardian: project.guardian,
            launchKit: project.launchKit,
            brandSystem: project.brandSystem,
          }),
        });

        if (res.ok) {
          lastSavedRef.current = projectFingerprint;
          setSyncStatus('saved');
        } else {
          setSyncStatus('error');
        }
      } catch (err) {
        console.warn('Auto-sync to DB notice (using local cache):', err);
        setSyncStatus('error');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [project]);

  return { syncStatus };
}

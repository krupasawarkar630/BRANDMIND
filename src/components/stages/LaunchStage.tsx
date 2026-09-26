'use client';

import LaunchCommandCenter from '@/components/LaunchCommandCenter';
import StageEmptyState from '@/components/StageEmptyState';
import { useStore } from '@/lib/store';

export default function LaunchStage() {
  const { project } = useStore();

  if (!project.launchKit || !project.brandSystem || !project.brandDNA) {
    return <StageEmptyState stage="launch" prerequisiteStage="system" />;
  }

  return <LaunchCommandCenter />;
}

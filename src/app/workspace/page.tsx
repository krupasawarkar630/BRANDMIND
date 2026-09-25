import type { Metadata } from 'next';
import WorkspacePageClient from '@/components/WorkspacePage';

export const metadata: Metadata = {
  title: 'BRANDMIND — Brand Strategy Workspace',
  description: 'Build and stress-test your brand system in one connected AI workflow.',
};

export default function WorkspacePage() {
  return <WorkspacePageClient />;
}

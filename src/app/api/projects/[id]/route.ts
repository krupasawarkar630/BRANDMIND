import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  projects,
  brandDna,
  brandWorlds,
  battleSessions,
  stressTests,
  audienceSimulations,
  mutations,
  whatIfScenarios,
  decisions,
  brandLocks,
  guardianScans,
  launchAssets,
  brandVersions
} from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/projects/[id] - Fetch project and all associated relational records
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });
    }

    const projectResult = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (projectResult.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const project = projectResult[0];

    // Fetch related records in parallel
    const [
      dnaList,
      worldsList,
      battleList,
      stressList,
      audienceList,
      mutationsList,
      whatIfList,
      decisionsList,
      locksList,
      scansList,
      assetsList,
      versionsList
    ] = await Promise.all([
      db.select().from(brandDna).where(eq(brandDna.projectId, id)).limit(1),
      db.select().from(brandWorlds).where(eq(brandWorlds.projectId, id)),
      db.select().from(battleSessions).where(eq(battleSessions.projectId, id)).orderBy(desc(battleSessions.createdAt)).limit(1),
      db.select().from(stressTests).where(eq(stressTests.projectId, id)).orderBy(desc(stressTests.createdAt)).limit(1),
      db.select().from(audienceSimulations).where(eq(audienceSimulations.projectId, id)).orderBy(desc(audienceSimulations.createdAt)).limit(1),
      db.select().from(mutations).where(eq(mutations.projectId, id)),
      db.select().from(whatIfScenarios).where(eq(whatIfScenarios.projectId, id)),
      db.select().from(decisions).where(eq(decisions.projectId, id)).orderBy(desc(decisions.timestamp)),
      db.select().from(brandLocks).where(eq(brandLocks.projectId, id)).orderBy(desc(brandLocks.lockedAt)).limit(1),
      db.select().from(guardianScans).where(eq(guardianScans.projectId, id)).orderBy(desc(guardianScans.createdAt)).limit(1),
      db.select().from(launchAssets).where(eq(launchAssets.projectId, id)),
      db.select().from(brandVersions).where(eq(brandVersions.projectId, id)).orderBy(desc(brandVersions.createdAt))
    ]);

    return NextResponse.json({
      success: true,
      project,
      brandDna: dnaList[0] || null,
      worlds: worldsList,
      battle: battleList[0] || null,
      stressTest: stressList[0] || null,
      audienceSimulation: audienceList[0] || null,
      mutations: mutationsList,
      whatIfScenarios: whatIfList,
      decisions: decisionsList,
      brandLock: locksList[0] || null,
      guardianScan: scansList[0] || null,
      launchAssets: assetsList,
      brandVersions: versionsList
    });
  } catch (error: any) {
    console.error('Error fetching project details:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Cascade delete a project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}

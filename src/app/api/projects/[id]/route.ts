import 'server-only';
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
import { eq, desc, and } from 'drizzle-orm';
import { getOrCreateUserId, isValidId } from '@/lib/auth/session';

// GET /api/projects/[id] - Fetch single project with user data isolation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getOrCreateUserId(req);
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project identifier format.' },
        { status: 400 }
      );
    }

    // Per-user query
    const projectResult = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .limit(1);

    if (projectResult.length === 0) {
      // Fallback check if project was created anonymously
      const fallbackResult = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      if (fallbackResult.length === 0) {
        return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
      }

      if (fallbackResult[0].userId && fallbackResult[0].userId !== userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 403 });
      }
    }

    const project = projectResult[0];

    // Fetch related records in parallel with parameterized bounds
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
      db.select().from(brandWorlds).where(eq(brandWorlds.projectId, id)).limit(10),
      db.select().from(battleSessions).where(eq(battleSessions.projectId, id)).orderBy(desc(battleSessions.createdAt)).limit(1),
      db.select().from(stressTests).where(eq(stressTests.projectId, id)).orderBy(desc(stressTests.createdAt)).limit(1),
      db.select().from(audienceSimulations).where(eq(audienceSimulations.projectId, id)).orderBy(desc(audienceSimulations.createdAt)).limit(1),
      db.select().from(mutations).where(eq(mutations.projectId, id)).limit(20),
      db.select().from(whatIfScenarios).where(eq(whatIfScenarios.projectId, id)).limit(20),
      db.select().from(decisions).where(eq(decisions.projectId, id)).orderBy(desc(decisions.timestamp)).limit(50),
      db.select().from(brandLocks).where(eq(brandLocks.projectId, id)).orderBy(desc(brandLocks.lockedAt)).limit(1),
      db.select().from(guardianScans).where(eq(guardianScans.projectId, id)).orderBy(desc(guardianScans.createdAt)).limit(5),
      db.select().from(launchAssets).where(eq(launchAssets.projectId, id)).limit(30),
      db.select().from(brandVersions).where(eq(brandVersions.projectId, id)).orderBy(desc(brandVersions.createdAt)).limit(10)
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
    console.error('Project details query error');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project.' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Cascade delete project with user authorization check
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getOrCreateUserId(req);
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid project ID.' }, { status: 400 });
    }

    const existing = await db
      .select({ id: projects.id, userId: projects.userId })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
    }

    if (existing[0].userId && existing[0].userId !== userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 403 });
    }

    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    console.error('Project delete execution error');
    return NextResponse.json(
      { success: false, error: 'Failed to delete project.' },
      { status: 500 }
    );
  }
}

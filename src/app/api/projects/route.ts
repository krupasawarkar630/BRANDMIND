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
  auditLogs,
  brandVersions
} from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/projects - list all projects or return the latest project
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latestOnly = searchParams.get('latest') === 'true';

    if (latestOnly) {
      const latest = await db.select().from(projects).orderBy(desc(projects.updatedAt)).limit(1);
      if (latest.length === 0) {
        return NextResponse.json({ success: true, project: null });
      }
      return NextResponse.json({ success: true, project: latest[0] });
    }

    const allProjects = await db.select().from(projects).orderBy(desc(projects.updatedAt));
    return NextResponse.json({ success: true, projects: allProjects });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Upsert project and state to ensure user can leave and return without losing work
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      tagline,
      currentStage,
      ideaInput,
      completedStages,
      brandDnaLocked,
      dna,
      worlds,
      battle,
      stressTest,
      audienceRoom,
      mutationsList,
      whatIf,
      decisionLogs,
      guardian,
      launchKit,
      brandSystem
    } = body;

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: 'Project ID and name are required' },
        { status: 400 }
      );
    }

    // 1. Upsert Project record
    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (existing.length === 0) {
      await db.insert(projects).values({
        id,
        name,
        tagline: tagline || null,
        currentStage: currentStage || 'idea',
        ideaInput: ideaInput || null,
        completedStages: completedStages || [],
        brandDnaLocked: !!brandDnaLocked,
        updatedAt: new Date(),
      });
    } else {
      await db.update(projects).set({
        name,
        tagline: tagline || null,
        currentStage: currentStage || existing[0].currentStage,
        ideaInput: ideaInput !== undefined ? ideaInput : existing[0].ideaInput,
        completedStages: completedStages !== undefined ? completedStages : existing[0].completedStages,
        brandDnaLocked: brandDnaLocked !== undefined ? !!brandDnaLocked : existing[0].brandDnaLocked,
        updatedAt: new Date(),
      }).where(eq(projects.id, id));
    }

    // 2. Sync Brand DNA if provided
    if (dna) {
      const existingDna = await db.select().from(brandDna).where(eq(brandDna.projectId, id)).limit(1);
      if (existingDna.length === 0) {
        await db.insert(brandDna).values({
          projectId: id,
          coreProblem: dna.coreProblem || null,
          targetUser: dna.targetUser || null,
          valueProposition: dna.valueProposition || null,
          differentiator: dna.differentiator || null,
          personality: dna.personality || [],
          radarScores: dna.radarScores || null,
          visualDna: dna.visualDna || null,
          rawDna: dna,
          updatedAt: new Date(),
        });
      } else {
        await db.update(brandDna).set({
          coreProblem: dna.coreProblem || null,
          targetUser: dna.targetUser || null,
          valueProposition: dna.valueProposition || null,
          differentiator: dna.differentiator || null,
          personality: dna.personality || [],
          radarScores: dna.radarScores || null,
          visualDna: dna.visualDna || null,
          rawDna: dna,
          updatedAt: new Date(),
        }).where(eq(brandDna.projectId, id));
      }
    }

    // 3. Sync Brand Worlds if provided
    if (Array.isArray(worlds) && worlds.length > 0) {
      for (const w of worlds) {
        if (!w.id) continue;
        const existingW = await db.select().from(brandWorlds).where(eq(brandWorlds.id, w.id)).limit(1);
        if (existingW.length === 0) {
          await db.insert(brandWorlds).values({
            id: w.id,
            projectId: id,
            name: w.name || 'World',
            tagline: w.tagline || null,
            strategicIdea: w.strategicIdea || null,
            isSelected: !!w.isSelected,
            data: w,
          });
        } else {
          await db.update(brandWorlds).set({
            name: w.name || 'World',
            tagline: w.tagline || null,
            strategicIdea: w.strategicIdea || null,
            isSelected: !!w.isSelected,
            data: w,
          }).where(eq(brandWorlds.id, w.id));
        }
      }
    }

    // 4. Record Decisions if provided
    if (Array.isArray(decisionLogs) && decisionLogs.length > 0) {
      for (const d of decisionLogs) {
        if (d.decision && d.stage) {
          await db.insert(decisions).values({
            projectId: id,
            stage: d.stage,
            decision: d.decision,
            reason: d.reason || 'User decision',
            source: d.source || 'USER',
            metadata: d.metadata || null,
            timestamp: d.timestamp ? new Date(d.timestamp) : new Date(),
          });
        }
      }
    }

    // 5. Sync Brand System / Version if provided
    if (brandSystem) {
      await db.insert(brandVersions).values({
        projectId: id,
        brandSystem: brandSystem,
        changeSummary: 'Snapshot saved',
      });
    }

    // 6. Sync Guardian scan if provided
    if (guardian) {
      await db.insert(guardianScans).values({
        projectId: id,
        contentScanned: guardian.contentScanned || 'Brand scan',
        consistencyScore: guardian.consistencyScore || 90,
        summary: guardian.summary || null,
        violations: guardian.violations || [],
        suggestedRewrite: guardian.suggestedRewrite || null,
      });
    }

    // 7. Sync Audit Log
    await db.insert(auditLogs).values({
      projectId: id,
      action: 'PROJECT_STATE_SAVED',
      actor: 'system',
      details: { stage: currentStage, timestamp: new Date().toISOString() },
    });

    return NextResponse.json({
      success: true,
      message: 'Project state persisted successfully',
      projectId: id,
    });
  } catch (error: any) {
    console.error('Error saving project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save project' },
      { status: 500 }
    );
  }
}

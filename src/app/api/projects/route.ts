import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  projects,
  brandDna,
  brandWorlds,
  decisions,
  guardianScans,
  auditLogs,
  brandVersions
} from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getOrCreateUserId, isValidId, sanitizeText } from '@/lib/auth/session';

// GET /api/projects - list user's projects with safe pagination and projection
export async function GET(req: NextRequest) {
  try {
    const userId = await getOrCreateUserId(req);
    const { searchParams } = new URL(req.url);
    const latestOnly = searchParams.get('latest') === 'true';

    // Per-user query with parameterized filter
    const query = db
      .select({
        id: projects.id,
        name: projects.name,
        tagline: projects.tagline,
        currentStage: projects.currentStage,
        brandDnaLocked: projects.brandDnaLocked,
        completedStages: projects.completedStages,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));

    if (latestOnly) {
      const latest = await query.limit(1);
      return NextResponse.json({
        success: true,
        project: latest[0] || null,
      });
    }

    // Limit to max 30 projects to avoid excessive payload transfer
    const userProjects = await query.limit(30);

    return NextResponse.json({
      success: true,
      projects: userProjects,
    });
  } catch (error: any) {
    // Avoid logging sensitive credentials
    console.error('Projects query execution error');
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve projects.' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Securely upsert project with validated inputs and user isolation
export async function POST(req: NextRequest) {
  try {
    const userId = await getOrCreateUserId(req);
    const body = await req.json();

    // 1. Strict Input Validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }

    const id = sanitizeText(body.id, 128);
    const name = sanitizeText(body.name || 'Brand Study', 200);
    const tagline = sanitizeText(body.tagline, 500);
    const currentStage = sanitizeText(body.currentStage || 'idea', 50);

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing project identifier.' },
        { status: 400 }
      );
    }

    const {
      ideaInput,
      completedStages,
      brandDnaLocked,
      dna,
      worlds,
      decisionLogs,
      guardian,
      brandSystem
    } = body;

    // 2. Check existing project with per-user ownership verification
    const existing = await db
      .select({ id: projects.id, userId: projects.userId })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (existing.length === 0) {
      // Create new project owned by current user
      await db.insert(projects).values({
        id,
        userId,
        name,
        tagline: tagline || null,
        currentStage,
        ideaInput: ideaInput || null,
        completedStages: Array.isArray(completedStages) ? completedStages : [],
        brandDnaLocked: Boolean(brandDnaLocked),
        updatedAt: new Date(),
      });
    } else {
      // If project exists, verify user ownership
      if (existing[0].userId && existing[0].userId !== userId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized to modify this project.' },
          { status: 403 }
        );
      }

      await db
        .update(projects)
        .set({
          name,
          tagline: tagline || null,
          currentStage,
          ideaInput: ideaInput !== undefined ? ideaInput : undefined,
          completedStages: Array.isArray(completedStages) ? completedStages : undefined,
          brandDnaLocked: brandDnaLocked !== undefined ? Boolean(brandDnaLocked) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id));
    }

    // 3. Parameterized upsert of Brand DNA
    if (dna && typeof dna === 'object') {
      const existingDna = await db
        .select({ id: brandDna.id })
        .from(brandDna)
        .where(eq(brandDna.projectId, id))
        .limit(1);

      const dnaValues = {
        projectId: id,
        coreProblem: sanitizeText(dna.coreProblem, 2000),
        targetUser: sanitizeText(dna.targetUser, 2000),
        valueProposition: sanitizeText(dna.valueProposition, 2000),
        differentiator: sanitizeText(dna.differentiator, 2000),
        personality: Array.isArray(dna.personality) ? dna.personality : [],
        rawDna: dna,
        updatedAt: new Date(),
      };

      if (existingDna.length === 0) {
        await db.insert(brandDna).values(dnaValues);
      } else {
        await db.update(brandDna).set(dnaValues).where(eq(brandDna.projectId, id));
      }
    }

    // 4. Parameterized upsert of Brand Worlds
    if (Array.isArray(worlds) && worlds.length > 0) {
      for (const w of worlds) {
        if (!w || !w.id || !isValidId(w.id)) continue;
        const existingW = await db
          .select({ id: brandWorlds.id })
          .from(brandWorlds)
          .where(eq(brandWorlds.id, w.id))
          .limit(1);

        const worldValues = {
          id: w.id,
          projectId: id,
          name: sanitizeText(w.name || 'World', 200),
          tagline: sanitizeText(w.tagline, 500),
          strategicIdea: sanitizeText(w.strategicIdea, 2000),
          isSelected: Boolean(w.isSelected),
          data: w,
        };

        if (existingW.length === 0) {
          await db.insert(brandWorlds).values(worldValues);
        } else {
          await db.update(brandWorlds).set(worldValues).where(eq(brandWorlds.id, w.id));
        }
      }
    }

    // 5. Parameterized batch insert of Decision Timeline entries
    if (Array.isArray(decisionLogs) && decisionLogs.length > 0) {
      for (const d of decisionLogs) {
        if (d && d.decision && d.stage) {
          await db.insert(decisions).values({
            projectId: id,
            stage: sanitizeText(d.stage, 100),
            decision: sanitizeText(d.decision, 2000),
            reason: sanitizeText(d.reason || 'User action', 2000),
            source: sanitizeText(d.source || 'USER', 50),
            metadata: d.metadata || null,
            timestamp: d.timestamp ? new Date(d.timestamp) : new Date(),
          });
        }
      }
    }

    // 6. Parameterized save for Brand Version snapshot
    if (brandSystem && typeof brandSystem === 'object') {
      await db.insert(brandVersions).values({
        projectId: id,
        brandSystem,
        changeSummary: 'Auto-saved version checkpoint',
      });
    }

    // 7. Parameterized save for Guardian scan
    if (guardian && typeof guardian === 'object') {
      await db.insert(guardianScans).values({
        projectId: id,
        contentScanned: sanitizeText(guardian.contentScanned || 'Copy scan', 5000),
        consistencyScore: typeof guardian.consistencyScore === 'number' ? guardian.consistencyScore : 90,
        summary: sanitizeText(guardian.summary, 2000),
        violations: Array.isArray(guardian.violations) ? guardian.violations : [],
        suggestedRewrite: sanitizeText(guardian.suggestedRewrite, 5000),
      });
    }

    // 8. Audit log for compliance
    await db.insert(auditLogs).values({
      projectId: id,
      action: 'PROJECT_STATE_PERSISTED',
      actor: userId,
      details: { stage: currentStage, timestamp: new Date().toISOString() },
    });

    return NextResponse.json({
      success: true,
      projectId: id,
    });
  } catch (error: any) {
    console.error('Project persistence error');
    return NextResponse.json(
      { success: false, error: 'Failed to persist project state.' },
      { status: 500 }
    );
  }
}

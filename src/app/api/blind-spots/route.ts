import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { decisions, projects } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getOrCreateUserId, isValidId, sanitizeText } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const userId = await getOrCreateUserId(req);
    const body = await req.json();
    const { projectId, blindSpot } = body;

    if (!projectId || !isValidId(projectId)) {
      return NextResponse.json({ error: 'Valid projectId is required.' }, { status: 400 });
    }

    if (!blindSpot || !blindSpot.id || !isValidId(blindSpot.id)) {
      return NextResponse.json({ error: 'Valid blindSpot data is required.' }, { status: 400 });
    }

    // Parameterized insert of blind spot decision/status into decisions table
    await db.insert(decisions).values({
      projectId,
      stage: 'blindSpots',
      decision: sanitizeText(`Blind spot [${blindSpot.id}]: ${blindSpot.statement || 'Signal'} -> ${blindSpot.status}`, 1000),
      reason: sanitizeText(blindSpot.whyItMatters || 'User validation of startup hypothesis', 1000),
      source: 'USER',
      metadata: blindSpot,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blind spot persistence error');
    return NextResponse.json({ error: 'Failed to persist blind spot.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId || !isValidId(projectId)) {
      return NextResponse.json({ error: 'Valid projectId required.' }, { status: 400 });
    }

    // Parameterized select query
    const rows = await db
      .select({ metadata: decisions.metadata, timestamp: decisions.timestamp })
      .from(decisions)
      .where(and(eq(decisions.projectId, projectId), eq(decisions.stage, 'blindSpots')))
      .orderBy(desc(decisions.timestamp))
      .limit(50);

    const latestSpots = new Map<string, any>();
    for (const row of rows) {
      if (row.metadata && typeof row.metadata === 'object' && 'id' in row.metadata) {
        const spot = row.metadata as { id: string };
        if (!latestSpots.has(spot.id)) {
          latestSpots.set(spot.id, row.metadata);
        }
      }
    }

    return NextResponse.json({ blindSpots: Array.from(latestSpots.values()) });
  } catch (error) {
    console.error('Blind spot query error');
    return NextResponse.json({ error: 'Failed to retrieve blind spots.' }, { status: 500 });
  }
}

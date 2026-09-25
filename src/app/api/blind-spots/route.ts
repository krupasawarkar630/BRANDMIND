import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, blindSpot } = body;

    if (!projectId || !blindSpot || !blindSpot.id) {
      return NextResponse.json({ error: 'Missing projectId or blindSpot data' }, { status: 400 });
    }

    // Upsert the blind spot to the DB
    // We check if it exists by checking the JSONB data (since our DB schema just has an auto-uuid for primary key, we might need to handle uniqueness, or just insert)
    // Actually, we can just insert a new record for the decision or update.
    // The table schema has: id (UUID), project_id (VARCHAR), created_at (TIMESTAMP), data (JSONB)
    
    await sql`
      INSERT INTO blind_spots (project_id, data)
      VALUES (${projectId}, ${JSON.stringify(blindSpot)})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving blind spot:', error);
    return NextResponse.json({ error: 'Failed to persist blind spot' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    const rows = await sql`
      SELECT data 
      FROM blind_spots 
      WHERE project_id = ${projectId}
      ORDER BY created_at ASC
    `;
    const latestSpots = new Map();
    for (const row of rows) {
      latestSpots.set(row.data.id, row.data);
    }
    
    return NextResponse.json({ blindSpots: Array.from(latestSpots.values()) });
  } catch (error) {
    console.error('Error fetching blind spots:', error);
    return NextResponse.json({ error: 'Failed to fetch blind spots' }, { status: 500 });
  }
}

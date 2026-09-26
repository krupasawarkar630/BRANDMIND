import 'server-only';
import { NextResponse } from 'next/server';
import { db, sql } from '@/lib/db';
import { projects } from '@/lib/db/schema';

export async function GET() {
  try {
    const rawResult = await sql`SELECT 1 as test_connection`;
    
    // Parameterized limited count
    const projectsSample = await db
      .select({ id: projects.id, name: projects.name })
      .from(projects)
      .limit(3);

    return NextResponse.json({
      success: true,
      message: 'Postgres and Drizzle ORM connection verified.',
      data: {
        connectionOk: Boolean(rawResult),
        projectsCount: projectsSample.length,
        status: 'OPERATIONAL',
      },
    });
  } catch (error) {
    console.error('Database probe check');
    return NextResponse.json(
      {
        success: false,
        message: 'Database check failed. Operating in client-side resilient mode.',
        status: 'OFFLINE_RESILIENT',
      },
      { status: 500 }
    );
  }
}

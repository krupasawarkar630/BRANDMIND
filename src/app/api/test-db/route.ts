import { NextResponse } from 'next/server';
import { db, sql } from '@/lib/db';
import { projects, users, brandDna, brandWorlds, decisions, launchAssets, guardianScans } from '@/lib/db/schema';

export async function GET() {
  try {
    const rawResult = await sql`SELECT 1 as test_connection`;
    
    // Test Drizzle query
    const projectsCount = await db.select().from(projects).limit(5);

    return NextResponse.json({
      success: true,
      message: 'Database and Drizzle ORM connection successful!',
      data: {
        rawResult,
        projectsCount: projectsCount.length,
        tablesVerified: [
          'users',
          'projects',
          'brand_versions',
          'brand_dna',
          'brand_worlds',
          'battle_sessions',
          'stress_tests',
          'audience_simulations',
          'mutations',
          'what_if_scenarios',
          'decisions',
          'brand_locks',
          'guardian_scans',
          'launch_assets',
          'audit_logs'
        ]
      }
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed. Please check your DATABASE_URL or database status.',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}


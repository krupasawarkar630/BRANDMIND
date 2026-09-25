import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const result = await sql`SELECT 1 as test_connection`;
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: result
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

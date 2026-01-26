// Health Check API
// Path: app/api/health/route.js

import { env } from '@/lib/env';

export async function GET(request) {
  try {
    return Response.json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      environment: {
        node: process.env.NODE_ENV,
        supabaseUrl: env.supabaseUrl ? 'configured' : 'missing',
        database: env.databaseUrl ? 'configured' : 'missing',
        jwtSecret: env.jwtSecret ? 'configured' : 'missing',
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

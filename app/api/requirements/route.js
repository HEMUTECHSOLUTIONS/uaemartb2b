// API Route: Requirements (Buyer Requests)
// Path: /api/requirements/route.js

import { requirementDb } from '@/lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const status = searchParams.get('status') || 'open';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await requirementDb.getAll({
      page,
      limit,
      status,
      categoryId,
    });
    
    return Response.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.user_id || !body.title || !body.description) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const requirement = await requirementDb.create(body);
    
    return Response.json(
      {
        success: true,
        data: requirement,
        message: 'Requirement posted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating requirement:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

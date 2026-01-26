// API Route: Get Companies
// Path: /api/companies/route.js

import { companyDb } from '@/lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let result;
    
    // If no search params provided, return all companies
    if (!search && !categoryId) {
      result = await companyDb.getAll({ page, limit, city });
    } else if (search) {
      result = await companyDb.search(search, { page, limit, city });
    } else if (categoryId) {
      result = await companyDb.getByCategory(categoryId, { page, limit });
    }
    
    return Response.json({
      success: true,
      data: result?.data || [],
      pagination: {
        page: result?.page || page,
        limit: result?.limit || limit,
        total: result?.total || 0,
        totalPages: Math.ceil((result?.total || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to fetch companies',
        data: [],
      },
      { status: 200 } // Return 200 to prevent errors on frontend
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.user_id || !body.company_name) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const company = await companyDb.create(body);
    
    return Response.json(
      {
        success: true,
        data: company,
        message: 'Company created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

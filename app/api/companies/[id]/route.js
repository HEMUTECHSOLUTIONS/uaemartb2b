// API Route: Get Company by ID
// Path: /api/companies/[id]/route.js

import { companyDb } from '@/lib/database';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const company = await companyDb.getById(id);
    
    // Increment views
    await companyDb.incrementViews(id);
    
    return Response.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updatedCompany = await companyDb.update(id, body);
    
    return Response.json({
      success: true,
      data: updatedCompany,
      message: 'Company updated successfully',
    });
  } catch (error) {
    console.error('Error updating company:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

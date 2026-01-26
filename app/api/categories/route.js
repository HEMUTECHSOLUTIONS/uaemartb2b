// Mark this route as dynamic for Next.js 14 (Vercel)
export const dynamic = "force-dynamic";
// API Route: Get All Categories
// Path: /api/categories/route.js

import { categoryDb } from '@/lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';
    
    const categories = await categoryDb.getAll(includeInactive);
    
    return Response.json({
      success: true,
      data: categories || [],
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Return mock categories on error instead of 500
    const mockCategories = [
      { id: '1', name: 'Food & Hospitality', slug: 'food-hospitality', is_active: true },
      { id: '2', name: 'Education', slug: 'education', is_active: true },
      { id: '3', name: 'Healthcare', slug: 'healthcare', is_active: true },
      { id: '4', name: 'Industries', slug: 'industries', is_active: true },
      { id: '5', name: 'IT & Technology', slug: 'it-technology', is_active: true },
      { id: '6', name: 'Media & Entertainment', slug: 'media-entertainment', is_active: true },
      { id: '7', name: 'Real Estate', slug: 'real-estate', is_active: true },
      { id: '8', name: 'Travel & Tourism', slug: 'travel-tourism', is_active: true },
      { id: '9', name: 'Miscellaneous', slug: 'miscellaneous', is_active: true },
    ];
    
    return Response.json({
      success: true,
      data: mockCategories,
      note: 'Using fallback categories due to database error',
    });
  }
}

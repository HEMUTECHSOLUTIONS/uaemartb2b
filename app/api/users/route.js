// API Route: Get Users (Buyers)
// Path: /api/users/route.js

import { userDb } from '@/lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    let query = {};
    if (type) query.user_type = type;
    // Fetch all users or by type
    const users = await userDb.getAll(query);
    return Response.json({ success: true, data: users });
  } catch (error) {
    return Response.json({ success: false, error: error.message, data: [] }, { status: 200 });
  }
}

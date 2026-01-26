// Protected API Route - Get User Profile
// Path: app/api/profile/route.js

import { userDb } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth-utils';
import { NotFoundError, handleError } from '@/lib/error-handler';
import { ApiResponse } from '@/lib/response';

export async function GET(request) {
  try {
    const user = getCurrentUser(request);
    
    if (!user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userData = await userDb.getById(user.id);
    
    if (!userData) {
      throw new NotFoundError('User not found');
    }

    // Remove sensitive data
    const { password_hash, ...safeUser } = userData;

    return Response.json(
      ApiResponse.success(safeUser, 'Profile retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    const response = handleError(error);
    return Response.json(response, { status: response.statusCode });
  }
}

export async function PUT(request) {
  try {
    const user = getCurrentUser(request);
    
    if (!user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Only allow certain fields to be updated
    const allowedUpdates = {
      full_name: body.full_name,
      phone: body.phone,
      profile_image_url: body.profile_image_url,
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach((key) =>
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const updatedUser = await userDb.update(user.id, allowedUpdates);
    
    const { password_hash, ...safeUser } = updatedUser;

    return Response.json(
      ApiResponse.success(safeUser, 'Profile updated successfully'),
      { status: 200 }
    );
  } catch (error) {
    const response = handleError(error);
    return Response.json(response, { status: response.statusCode });
  }
}

// Protected API Route Example - Create Company
// Path: app/api/companies/create/route.js

import { companyDb } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth-utils';
import { Validators } from '@/lib/validators';
import { handleError, ValidationError, NotFoundError } from '@/lib/error-handler';
import { ApiResponse } from '@/lib/response';

export async function POST(request) {
  try {
    const user = getCurrentUser(request);
    
    if (!user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.userType !== 'seller') {
      return Response.json(
        { success: false, error: 'Only sellers can create companies' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!Validators.isValidCompanyName(body.company_name)) {
      throw new ValidationError('Invalid company name');
    }

    if (body.email && !Validators.isValidEmail(body.email)) {
      throw new ValidationError('Invalid email');
    }

    if (body.phone && !Validators.isValidPhone(body.phone)) {
      throw new ValidationError('Invalid phone number');
    }

    // Create company
    const company = await companyDb.create({
      user_id: user.id,
      company_name: body.company_name,
      business_type: body.business_type,
      category_id: body.category_id,
      description: body.description,
      email: body.email,
      phone: body.phone,
      city: body.city,
      address: body.address,
      website_url: body.website_url,
    });

    return Response.json(
      ApiResponse.success(company, 'Company created successfully'),
      { status: 201 }
    );
  } catch (error) {
    const response = handleError(error);
    return Response.json(response, { status: response.statusCode });
  }
}

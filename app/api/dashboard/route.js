// Dashboard Statistics API
// Path: app/api/dashboard/route.js

import { supabaseAdmin } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth-utils';
import { handleError } from '@/lib/error-handler';
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

    let stats = {};

    if (user.userType === 'seller') {
      // Get seller dashboard stats
      const { data: company } = await supabaseAdmin
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (company) {
        const { data: result } = await supabaseAdmin.rpc(
          'get_company_stats',
          { company_id: company.id }
        );
        stats = result;
      }
    } else if (user.userType === 'buyer') {
      // Get buyer dashboard stats
      const { count: totalRequirements } = await supabaseAdmin
        .from('requirements')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      const { count: activeRequirements } = await supabaseAdmin
        .from('requirements')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('status', 'open');

      const { count: totalResponses } = await supabaseAdmin
        .from('requirement_responses')
        .select('r_id', { count: 'exact' })
        .filter('requirements.user_id', 'eq', user.id);

      stats = {
        totalRequirements,
        activeRequirements,
        totalResponses,
      };
    }

    return Response.json(
      ApiResponse.success(stats, 'Dashboard stats retrieved'),
      { status: 200 }
    );
  } catch (error) {
    const response = handleError(error);
    return Response.json(response, { status: response.statusCode });
  }
}

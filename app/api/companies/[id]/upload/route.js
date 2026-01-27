// API Route: Upload file for seller/company
// Path: /api/companies/[id]/upload/route.js

import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth-utils';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const user = getCurrentUser(request);
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return Response.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }
    // Upload to Supabase Storage (bucket: 'company-files')
    const fileName = `${id}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('company-files').upload(fileName, file);
    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }
    // Optionally: Save file URL to company profile in DB
    const fileUrl = data?.path ? supabase.storage.from('company-files').getPublicUrl(data.path).publicURL : null;
    return Response.json({ success: true, fileUrl });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

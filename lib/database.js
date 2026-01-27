  // Get all users (optionally by type)
  async getAll(query = {}) {
    let supa = supabase.from('users').select('*');
    if (query.user_type) {
      supa = supa.eq('user_type', query.user_type);
    }
    const { data, error } = await supa.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
// Database Helper Functions for UAEMart
import { supabase, supabaseAdmin } from './supabase';

// ============================================
// USER OPERATIONS
// ============================================

export const userDb = {
  // Create new user
  async create(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get user by ID
  async getById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  // Get user by email
  async getByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error) throw error;
    return data;
  },

  // Update user
  async update(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update last login
  async updateLastLogin(userId) {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },
};

// ============================================
// CATEGORY OPERATIONS
// ============================================

export const categoryDb = {
  // Get all categories
  async getAll(includeInactive = false) {
    let query = supabase
      .from('categories')
      .select('*')
      .order('display_order');
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get main categories (no parent)
  async getMainCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    return data;
  },

  // Get subcategories by parent ID
  async getSubcategories(parentId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    return data;
  },

  // Get category by slug
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// COMPANY OPERATIONS
// ============================================

export const companyDb = {
  // Create company
  async create(companyData) {
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get company by ID with related data
  async getById(companyId, includeRelations = true) {
    let query = supabase
      .from('companies')
      .select(includeRelations ? `
        *,
        user:users(*),
        category:categories(*),
        products(count)
      ` : '*')
      .eq('id', companyId)
      .single();
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get companies by category
  async getByCategory(categoryId, options = {}) {
    const { page = 1, limit = 20, status = 'approved' } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('companies')
      .select('*, category:categories(*)', { count: 'exact' })
      .eq('category_id', categoryId)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return { data, total: count, page, limit };
  },

  // Search companies
  async search(searchTerm, options = {}) {
    const { page = 1, limit = 20, city = null } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('companies')
      .select('*, category:categories(*)', { count: 'exact' })
      .eq('status', 'approved')
      .or(`company_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    
    if (city) {
      query = query.eq('city', city);
    }

    const { data, error, count } = await query
      .order('views_count', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return { data, total: count, page, limit };
  },

  // Update company
  async update(companyId, updates) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Increment views
  async incrementViews(companyId) {
    const { error } = await supabase.rpc('increment_company_views', {
      company_id: companyId,
    });
    if (error) throw error;
  },

  // Get company by user ID
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// PRODUCT OPERATIONS
// ============================================

export const productDb = {
  // Create product
  async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get products by company
  async getByCompany(companyId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return { data, total: count, page, limit };
  },

  // Get product by slug
  async getBySlug(companyId, slug) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        company:companies(*),
        category:categories(*),
        images:product_images(*)
      `)
      .eq('company_id', companyId)
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  // Update product
  async update(productId, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Delete product
  async delete(productId) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    if (error) throw error;
  },
};

// ============================================
// REQUIREMENT OPERATIONS
// ============================================

export const requirementDb = {
  // Create requirement
  async create(requirementData) {
    const { data, error } = await supabase
      .from('requirements')
      .insert(requirementData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get all requirements
  async getAll(options = {}) {
    const { page = 1, limit = 20, status = 'open', categoryId = null } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('requirements')
      .select('*, category:categories(*), user:users(full_name, email)', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error, count } = await query.range(from, to);
    
    if (error) throw error;
    return { data, total: count, page, limit };
  },

  // Get requirement by ID
  async getById(requirementId) {
    const { data, error } = await supabase
      .from('requirements')
      .select(`
        *,
        category:categories(*),
        user:users(full_name, email),
        responses:requirement_responses(
          *,
          company:companies(company_name, logo_url, phone, email)
        )
      `)
      .eq('id', requirementId)
      .single();
    if (error) throw error;
    return data;
  },

  // Create response
  async createResponse(responseData) {
    const { data, error } = await supabase
      .from('requirement_responses')
      .insert(responseData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// REVIEW OPERATIONS
// ============================================

export const reviewDb = {
  // Create review
  async create(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get reviews by company
  async getByCompany(companyId, options = {}) {
    const { page = 1, limit = 10, approved = true } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('reviews')
      .select('*, user:users(full_name, profile_image_url)', { count: 'exact' })
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (approved) {
      query = query.eq('is_approved', true);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;
    return { data, total: count, page, limit };
  },
};

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export const notificationDb = {
  // Create notification
  async create(notificationData) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get user notifications
  async getByUser(userId, options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;
    return { data, total: count, page, limit };
  },

  // Mark as read
  async markAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;
  },
};

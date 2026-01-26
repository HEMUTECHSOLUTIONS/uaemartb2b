-- UAEMart Seed Data
-- Sample categories and initial data

-- ============================================
-- CATEGORIES SEED DATA
-- ============================================

-- Main Categories
INSERT INTO categories (id, name, slug, parent_id, description, display_order, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Education', 'education', NULL, 'Educational institutions and training centers', 1, TRUE),
('22222222-2222-2222-2222-222222222222', 'Food, Accommodation & Apparels', 'food-accommodation-apparels', NULL, 'Restaurants, hotels, and clothing businesses', 2, TRUE),
('33333333-3333-3333-3333-333333333333', 'Health', 'health', NULL, 'Healthcare services and facilities', 3, TRUE),
('44444444-4444-4444-4444-444444444444', 'Industries', 'industries', NULL, 'Manufacturing and construction companies', 4, TRUE),
('55555555-5555-5555-5555-555555555555', 'IT', 'it', NULL, 'Information technology and software services', 5, TRUE),
('66666666-6666-6666-6666-666666666666', 'Media & Entertainment', 'media-entertainment', NULL, 'Media production and advertising agencies', 6, TRUE),
('77777777-7777-7777-7777-777777777777', 'Miscellaneous', 'miscellaneous', NULL, 'Various other services', 7, TRUE),
('88888888-8888-8888-8888-888888888888', 'Real Estate', 'real-estate', NULL, 'Property and real estate services', 8, TRUE),
('99999999-9999-9999-9999-999999999999', 'Travel', 'travel', NULL, 'Travel agencies and tourism services', 9, TRUE);

-- Education Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Schools', 'schools', '11111111-1111-1111-1111-111111111111', 1, TRUE),
('Training Centers', 'training', '11111111-1111-1111-1111-111111111111', 2, TRUE),
('Universities', 'universities', '11111111-1111-1111-1111-111111111111', 3, TRUE),
('E-Learning', 'e-learning', '11111111-1111-1111-1111-111111111111', 4, TRUE);

-- Food, Accommodation & Apparels Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Restaurants', 'restaurants', '22222222-2222-2222-2222-222222222222', 1, TRUE),
('Hotels', 'hotels', '22222222-2222-2222-2222-222222222222', 2, TRUE),
('Clothing', 'clothing', '22222222-2222-2222-2222-222222222222', 3, TRUE),
('Catering', 'catering', '22222222-2222-2222-2222-222222222222', 4, TRUE),
('Fashion Accessories', 'fashion-accessories', '22222222-2222-2222-2222-222222222222', 5, TRUE);

-- Health Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Hospitals', 'hospitals', '33333333-3333-3333-3333-333333333333', 1, TRUE),
('Pharmacies', 'pharmacies', '33333333-3333-3333-3333-333333333333', 2, TRUE),
('Clinics', 'clinics', '33333333-3333-3333-3333-333333333333', 3, TRUE),
('Medical Equipment', 'medical-equipment', '33333333-3333-3333-3333-333333333333', 4, TRUE);

-- Industries Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Construction', 'construction', '44444444-4444-4444-4444-444444444444', 1, TRUE),
('Manufacturing', 'manufacturing', '44444444-4444-4444-4444-444444444444', 2, TRUE),
('Engineering', 'engineering', '44444444-4444-4444-4444-444444444444', 3, TRUE),
('Industrial Equipment', 'industrial-equipment', '44444444-4444-4444-4444-444444444444', 4, TRUE);

-- IT Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Software Development', 'software', '55555555-5555-5555-5555-555555555555', 1, TRUE),
('Cloud Services', 'cloud-services', '55555555-5555-5555-5555-555555555555', 2, TRUE),
('Web Development', 'web-development', '55555555-5555-5555-5555-555555555555', 3, TRUE),
('IT Consulting', 'it-consulting', '55555555-5555-5555-5555-555555555555', 4, TRUE),
('Cybersecurity', 'cybersecurity', '55555555-5555-5555-5555-555555555555', 5, TRUE);

-- Media & Entertainment Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Advertising', 'advertising', '66666666-6666-6666-6666-666666666666', 1, TRUE),
('Production', 'production', '66666666-6666-6666-6666-666666666666', 2, TRUE),
('Event Management', 'event-management', '66666666-6666-6666-6666-666666666666', 3, TRUE),
('Digital Marketing', 'digital-marketing', '66666666-6666-6666-6666-666666666666', 4, TRUE);

-- Miscellaneous Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Cleaning Services', 'cleaning', '77777777-7777-7777-7777-777777777777', 1, TRUE),
('Logistics', 'logistics', '77777777-7777-7777-7777-777777777777', 2, TRUE),
('Security Services', 'security-services', '77777777-7777-7777-7777-777777777777', 3, TRUE),
('Maintenance', 'maintenance', '77777777-7777-7777-7777-777777777777', 4, TRUE);

-- Real Estate Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Commercial', 'commercial', '88888888-8888-8888-8888-888888888888', 1, TRUE),
('Residential', 'residential', '88888888-8888-8888-8888-888888888888', 2, TRUE),
('Property Management', 'property-management', '88888888-8888-8888-8888-888888888888', 3, TRUE),
('Real Estate Investment', 'real-estate-investment', '88888888-8888-8888-8888-888888888888', 4, TRUE);

-- Travel Subcategories
INSERT INTO categories (name, slug, parent_id, display_order, is_active) VALUES
('Travel Agencies', 'tours', '99999999-9999-9999-9999-999999999999', 1, TRUE),
('Tour Operators', 'tour-operators', '99999999-9999-9999-9999-999999999999', 2, TRUE),
('Visa Services', 'visa-services', '99999999-9999-9999-9999-999999999999', 3, TRUE),
('Travel Insurance', 'travel-insurance', '99999999-9999-9999-9999-999999999999', 4, TRUE);

-- ============================================
-- SAMPLE ADMIN USER
-- ============================================
-- Password: Admin@123 (bcrypt hashed)
INSERT INTO users (id, email, password_hash, full_name, phone, user_type, is_verified) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@uaemart.com', '$2b$10$rPxLhEZxQBGQ8FQxLhEZxOE1G8FQxLhEZxQBGQ8FQxLhEZxQBGQ8F', 'UAEMart Admin', '+971501234567', 'admin', TRUE);

-- ============================================
-- UAE CITIES DATA
-- ============================================
INSERT INTO cities (name, emirate, is_active) VALUES
('Dubai', 'Dubai', TRUE),
('Abu Dhabi', 'Abu Dhabi', TRUE),
('Sharjah', 'Sharjah', TRUE),
('Ajman', 'Ajman', TRUE),
('Fujairah', 'Fujairah', TRUE),
('Ras Al Khaimah', 'Ras Al Khaimah', TRUE),
('Umm Al Quwain', 'Umm Al Quwain', TRUE),
('Al Ain', 'Abu Dhabi', TRUE),
('Khor Fakkan', 'Sharjah', TRUE),
('Dibba', 'Fujairah', TRUE);

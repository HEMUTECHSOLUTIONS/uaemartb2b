-- Database Helper Functions for PostgreSQL

-- Function to increment company views
CREATE OR REPLACE FUNCTION increment_company_views(company_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE companies
    SET views_count = views_count + 1
    WHERE id = company_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET views_count = views_count + 1
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment requirement views
CREATE OR REPLACE FUNCTION increment_requirement_views(requirement_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE requirements
    SET views_count = views_count + 1
    WHERE id = requirement_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update company rating based on reviews
CREATE OR REPLACE FUNCTION update_company_rating(company_id UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL(3,2);
BEGIN
    SELECT COALESCE(AVG(rating), 0)
    INTO avg_rating
    FROM reviews
    WHERE company_id = company_id AND is_approved = TRUE;
    
    UPDATE companies
    SET rating = avg_rating
    WHERE id = company_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update company rating after review insert/update
CREATE OR REPLACE FUNCTION trigger_update_company_rating()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_company_rating(NEW.company_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert_update
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_company_rating();

-- Function to increment requirement responses count
CREATE OR REPLACE FUNCTION increment_requirement_responses()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE requirements
    SET responses_count = responses_count + 1
    WHERE id = NEW.requirement_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_requirement_response_insert
AFTER INSERT ON requirement_responses
FOR EACH ROW
EXECUTE FUNCTION increment_requirement_responses();

-- Function to get category hierarchy
CREATE OR REPLACE FUNCTION get_category_hierarchy(category_id UUID)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    slug VARCHAR,
    level INT
) AS $$
WITH RECURSIVE category_tree AS (
    -- Base case: the target category
    SELECT c.id, c.name, c.slug, c.parent_id, 0 AS level
    FROM categories c
    WHERE c.id = category_id
    
    UNION ALL
    
    -- Recursive case: parent categories
    SELECT c.id, c.name, c.slug, c.parent_id, ct.level + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.id = ct.parent_id
)
SELECT ct.id, ct.name, ct.slug, ct.level
FROM category_tree ct
ORDER BY ct.level DESC;
$$ LANGUAGE sql;

-- Function to search companies with full-text search
CREATE OR REPLACE FUNCTION search_companies_fulltext(search_query TEXT)
RETURNS TABLE (
    id UUID,
    company_name VARCHAR,
    description TEXT,
    city VARCHAR,
    rating DECIMAL,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.company_name,
        c.description,
        c.city,
        c.rating,
        ts_rank(
            to_tsvector('english', c.company_name || ' ' || COALESCE(c.description, '')),
            plainto_tsquery('english', search_query)
        ) AS relevance
    FROM companies c
    WHERE 
        c.status = 'approved'
        AND to_tsvector('english', c.company_name || ' ' || COALESCE(c.description, '')) @@ plainto_tsquery('english', search_query)
    ORDER BY relevance DESC, c.views_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get featured companies
CREATE OR REPLACE FUNCTION get_featured_companies(limit_count INT DEFAULT 10)
RETURNS TABLE (
    id UUID,
    company_name VARCHAR,
    logo_url TEXT,
    city VARCHAR,
    rating DECIMAL,
    category_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.company_name,
        c.logo_url,
        c.city,
        c.rating,
        cat.name AS category_name
    FROM companies c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE 
        c.status = 'approved'
        AND c.is_verified = TRUE
    ORDER BY c.rating DESC, c.views_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to expire old requirements
CREATE OR REPLACE FUNCTION expire_old_requirements()
RETURNS VOID AS $$
BEGIN
    UPDATE requirements
    SET status = 'expired'
    WHERE status = 'open'
    AND expires_at IS NOT NULL
    AND expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to get company statistics
CREATE OR REPLACE FUNCTION get_company_stats(company_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_products', (SELECT COUNT(*) FROM products WHERE company_id = $1 AND is_active = TRUE),
        'total_reviews', (SELECT COUNT(*) FROM reviews WHERE company_id = $1 AND is_approved = TRUE),
        'average_rating', (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE company_id = $1 AND is_approved = TRUE),
        'total_views', (SELECT views_count FROM companies WHERE id = $1),
        'total_inquiries', (SELECT COUNT(*) FROM inquiries WHERE company_id = $1),
        'pending_responses', (SELECT COUNT(*) FROM requirement_responses WHERE company_id = $1 AND status = 'pending')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

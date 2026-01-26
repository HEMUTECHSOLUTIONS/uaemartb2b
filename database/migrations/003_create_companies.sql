-- Migration 003: Create Companies Table
-- Date: 2026-01-25

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    trade_license VARCHAR(100) UNIQUE,
    business_type VARCHAR(100),
    category_id UUID REFERENCES categories(id),
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    website_url TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'UAE',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    year_established INT,
    employee_count VARCHAR(50),
    annual_turnover VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    views_count INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_category_id ON companies(category_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_city ON companies(city);

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

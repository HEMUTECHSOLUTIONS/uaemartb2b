-- Migration 005: Create Requirements and Responses Tables
-- Date: 2026-01-25

CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    quantity VARCHAR(100),
    budget_range VARCHAR(100),
    location VARCHAR(255),
    delivery_timeline VARCHAR(100),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'expired')),
    expires_at TIMESTAMP,
    views_count INT DEFAULT 0,
    responses_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requirement_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    quoted_price DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'AED',
    delivery_time VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_requirements_user_id ON requirements(user_id);
CREATE INDEX idx_requirements_category_id ON requirements(category_id);
CREATE INDEX idx_requirements_status ON requirements(status);

CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requirement_responses_updated_at BEFORE UPDATE ON requirement_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

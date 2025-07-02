-- Create owners table for Owner Dashboard authentication
CREATE TABLE IF NOT EXISTS owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'owner',
    status VARCHAR(20) DEFAULT 'active',
    
    -- Profile information
    phone VARCHAR(20),
    company_name VARCHAR(255),
    company_address TEXT,
    
    -- Security fields
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    email_verified_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_owners_email ON owners(email);
CREATE INDEX IF NOT EXISTS idx_owners_status ON owners(status);
CREATE INDEX IF NOT EXISTS idx_owners_reset_token ON owners(reset_token);

-- Insert default owner account
INSERT INTO owners (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role, 
    status,
    company_name,
    email_verified_at
) VALUES (
    'owner@leadestate.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', -- password123
    'Owner',
    'Admin',
    'owner',
    'active',
    'LeadEstate',
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_owners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_owners_updated_at
    BEFORE UPDATE ON owners
    FOR EACH ROW
    EXECUTE FUNCTION update_owners_updated_at();

-- Add comments for documentation
COMMENT ON TABLE owners IS 'Owner Dashboard users with administrative access to the multi-tenant system';
COMMENT ON COLUMN owners.email IS 'Unique email address for owner login';
COMMENT ON COLUMN owners.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN owners.role IS 'User role - typically "owner" for dashboard access';
COMMENT ON COLUMN owners.status IS 'Account status: active, inactive, suspended';
COMMENT ON COLUMN owners.reset_token IS 'Password reset token for forgot password flow';
COMMENT ON COLUMN owners.reset_token_expires IS 'Expiration time for reset token';

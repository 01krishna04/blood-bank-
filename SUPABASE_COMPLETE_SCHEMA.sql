-- BloodBank Database Schema - Complete Setup
-- Copy and paste ALL of this into Supabase SQL Editor and click "Run"

-- ============================================================
-- 1. Create Donors Table
-- ============================================================
CREATE TABLE IF NOT EXISTS donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_location ON donors(location);

-- ============================================================
-- 2. Create Pending Donors Table
-- ============================================================
CREATE TABLE IF NOT EXISTS pending_donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pending_donors_email ON pending_donors(email);

-- ============================================================
-- 3. Create Requests Table
-- ============================================================
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units INTEGER NOT NULL CHECK (units > 0),
    location TEXT NOT NULL,
    contact TEXT NOT NULL,
    is_emergency BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_blood_type ON requests(blood_type);
CREATE INDEX idx_requests_date ON requests(date);

-- ============================================================
-- 4. Create Inventory Table
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    expiry_date DATE NOT NULL,
    added_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_blood_type ON inventory(blood_type);
CREATE INDEX idx_inventory_expiry_date ON inventory(expiry_date);

-- ============================================================
-- Setup Complete!
-- ============================================================
-- All tables created successfully
-- Verify tables in Table Editor

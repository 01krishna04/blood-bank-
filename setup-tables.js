/**
 * Supabase Table Setup Script
 * Creates all necessary tables for Blood Bank System
 */

require('dotenv').config();

async function setupTables() {
    console.log('🔧 Setting up Blood Bank Database...\n');
    
    console.log('📝 Copy this SQL and run it in your Supabase SQL Editor:\n');
    console.log('🔗 Go to: https://app.supabase.com/project/*/sql/new\n');
    console.log('━'.repeat(70));

    const sql = `-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    blood_type text NOT NULL CHECK (blood_type IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
    email text UNIQUE NOT NULL,
    phone text NOT NULL,
    location text NOT NULL,
    available boolean DEFAULT true,
    created_at timestamp DEFAULT now()
);

-- Create pending_donors table (registration queue)
CREATE TABLE IF NOT EXISTS pending_donors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    blood_type text NOT NULL CHECK (blood_type IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
    email text UNIQUE NOT NULL,
    phone text NOT NULL,
    location text NOT NULL,
    created_at timestamp DEFAULT now()
);

-- Create requests table (blood requests)
CREATE TABLE IF NOT EXISTS requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name text NOT NULL,
    blood_type text NOT NULL CHECK (blood_type IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
    units integer NOT NULL CHECK (units > 0),
    location text NOT NULL,
    contact text NOT NULL,
    is_emergency boolean DEFAULT false,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    date timestamp DEFAULT now()
);

-- Create inventory table (blood stock)
CREATE TABLE IF NOT EXISTS inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    blood_type text NOT NULL CHECK (blood_type IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
    quantity integer NOT NULL CHECK (quantity > 0),
    expiry_date date NOT NULL,
    added_at timestamp DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);
CREATE INDEX IF NOT EXISTS idx_pending_donors_blood_type ON pending_donors(blood_type);
CREATE INDEX IF NOT EXISTS idx_requests_blood_type ON requests(blood_type);
CREATE INDEX IF NOT EXISTS idx_inventory_blood_type ON inventory(blood_type);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry ON inventory(expiry_date);

-- Disable Row Level Security for development
ALTER TABLE donors DISABLE ROW LEVEL SECURITY;
ALTER TABLE pending_donors DISABLE ROW LEVEL SECURITY;
ALTER TABLE requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;`;

    console.log(sql);
    console.log('\n' + '━'.repeat(70));
    console.log('\n✅ After running this SQL in Supabase:');
    console.log('   1. Paste the SQL above into Supabase SQL Editor');
    console.log('   2. Click "RUN" to execute');
    console.log('   3. Wait for "Success" message');
    console.log('   4. Then run: npm start\n');
}

setupTables();


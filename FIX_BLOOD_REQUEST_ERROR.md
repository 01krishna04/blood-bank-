# 🔍 How to Fix Blood Request Error - Diagnostic Guide

## The Problem
When you submit a blood request, you get: ❌ "Error: Failed to submit request"

## Root Cause
The requests table columns might not match what the code is sending.

---

## Step 1: Check Your Database Schema

1. **Go to Supabase Console:**
   - https://app.supabase.com
   - Select your `bloodbank1` project

2. **Go to SQL Editor**

3. **Run this query:**
   ```sql
   -- Check what columns exist in requests table
   SELECT column_name, data_type FROM information_schema.columns 
   WHERE table_name='requests'
   ORDER BY ordinal_position;
   ```

4. **You'll see output like:**
   ```
   column_name      | data_type
   ─────────────────────────────
   id               | uuid
   patient_name     | text         ← SHOULD BE THIS (not patientName)
   blood_type       | text         ← SHOULD BE THIS (not bloodType)
   units            | integer
   location         | text
   contact          | text
   is_emergency     | boolean      ← SHOULD BE THIS (not isEmergency)
   status           | text
   date             | timestamp without time zone
   ```

---

## Step 2: If Columns Are WRONG (camelCase instead of snake_case)

If you see:
- `patientName` (WRONG - should be `patient_name`)
- `bloodType` (WRONG - should be `blood_type`)
- `isEmergency` (WRONG - should be `is_emergency`)

**THEN:** You need to DELETE and RECREATE the table.

### Delete Old Table:
```sql
--Drop the old requests table
DROP TABLE IF EXISTS requests CASCADE;
```

### Create New Correct Table:
Copy and paste the SQL from setup-tables.js into SQL Editor:

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_requests_blood_type ON requests(blood_type);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Disable Row Level Security for development
ALTER TABLE requests DISABLE ROW LEVEL SECURITY;
```

---

## Step 3: Verify the Fix

1. **Run the query again:**
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name='requests'
   ORDER BY ordinal_position;
   ```

2. **Confirm you see:**
   - ✅ `patient_name` (lowercase with underscore)
   - ✅ `blood_type` (lowercase with underscore)
   - ✅ `is_emergency` (lowercase with underscore)
   - ✅ `status` with values: 'pending', 'fulfilled', 'cancelled'

---

## Step 4: Test the Blood Request Feature

1. **Refresh your browser** (Ctrl+F5)

2. **Try submitting a blood request again:**
   - Patient Name: Test Patient
   - Blood Type: A+
   - Units: 2
   - Hospital: Test Hospital
   - Contact: 1234567890
   - Emergency: (optional)

3. **Expected Result:**
   - ✅ "Blood request submitted successfully!"
   - ✅ Automatically goes to "My Request History"
   - ✅ Your request appears in the list

---

## Step 5: Open Browser Console for Details

If you still get an error:

1. **Press F12** to open Developer Tools
2. **Click "Console" tab**
3. **Submit a request again**
4. **Look for logs:**
   - `Submitting request:` ← Shows what data is being sent
   - `Response:` ← Shows what the server returned
   - Error messages if any

**Share the Console output and I'll help debug!**

---

## Summary

The issue is likely old camelCase column names in your requests table.

**Solution:**
1. Check your table schema (SELECT query above)
2. If wrong, delete and recreate with correct schema
3. Test blood request feature again

✅ Should work!

# Supabase Setup Guide for BloodBank

Supabase is an open-source Firebase alternative with PostgreSQL database, Real-time capabilities, and easy-to-use RESTful APIs.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Creation](#database-schema-creation)
4. [Environment Configuration](#environment-configuration)
5. [Start Application](#start-application)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# 1. Create Supabase account at https://supabase.com
# 2. Create new project
# 3. Create tables using SQL provided below
# 4. Copy project URL and API key
# 5. Create .env file with credentials
# 6. Install dependencies
npm install

# 7. Start server
npm start

# 8. Open index.html in browser
```

---

## Supabase Project Setup

### Step 1: Create Supabase Account

1. Visit [Supabase](https://supabase.com)
2. Click "Sign Up" or "Sign In"
3. Use GitHub, Google, or email to authenticate
4. Create or select an organization

### Step 2: Create New Project

1. In your Supabase dashboard, click "New project"
2. Fill in project details:
   - **Project Name**: `bloodbank` (or your preference)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Select closest to your location
   - **Pricing Plan**: Choose "Free" for development
3. Click "Create new project"
4. Wait for provisioning (usually 1-2 minutes)

### Step 3: Copy Project Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Public Key** (starts with `eyJhbG...`)
3. Keep these safe - you'll need them in the next step

### Step 4: Create Environment File

Create a `.env` file in your project root:


```bash
cd c:\Users\madha\OneDrive\Desktop\blood
```

Create `.env` with your credentials:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
PORT=3000
```

**Example:**
```
SUPABASE_URL=https://abc123def456.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
```

---

## Database Schema Creation

### Step 1: Access Supabase SQL Editor

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"** or **"New SQL query"**

### Step 2: Create Donors Table

Copy and paste this SQL:

```sql
-- Create Donors Table
CREATE TABLE IF NOT EXISTS donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bloodType TEXT NOT NULL CHECK (bloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster searches
CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donors_bloodType ON donors(bloodType);
CREATE INDEX idx_donors_location ON donors(location);
```

Click **Run** to execute.

### Step 3: Create Pending Donors Table

```sql
-- Create Pending Donors Table
CREATE TABLE IF NOT EXISTS pending_donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bloodType TEXT NOT NULL CHECK (bloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_pending_donors_email ON pending_donors(email);
```

Click **Run**.

### Step 4: Create Requests Table

```sql
-- Create Requests Table
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patientName TEXT NOT NULL,
    bloodType TEXT NOT NULL CHECK (bloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units INTEGER NOT NULL CHECK (units > 0),
    location TEXT NOT NULL,
    contact TEXT NOT NULL,
    isEmergency BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Fulfilled', 'Cancelled')),
    date TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_bloodType ON requests(bloodType);
CREATE INDEX idx_requests_date ON requests(date);
```

Click **Run**.

### Step 5: Create Inventory Table

```sql
-- Create Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bloodType TEXT NOT NULL CHECK (bloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    expiryDate DATE NOT NULL,
    addedAt TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_inventory_bloodType ON inventory(bloodType);
CREATE INDEX idx_inventory_expiryDate ON inventory(expiryDate);
```

Click **Run**.

### Step 6: Verify Tables Created

1. Go to **Table Editor** in Supabase
2. You should see:
   - **donors**
   - **pending_donors**
   - **requests**
   - **inventory**

---

## Enable Realtime (Optional)

For real-time updates when data changes:

1. In **SQL Editor**, run:

```sql
-- Enable realtime for donors table
ALTER PUBLICATION supabase_realtime ADD TABLE donors;
ALTER PUBLICATION supabase_realtime ADD TABLE pending_donors;
ALTER PUBLICATION supabase_realtime ADD TABLE requests;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
```

---

## Environment Configuration

### Option 1: Create .env File

Create `.env` in `c:\Users\madha\OneDrive\Desktop\blood`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
PORT=3000
```

### Option 2: Set Environment Variables (Windows)

**PowerShell:**
```powershell
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_KEY = "your-anon-key"
npm start
```

**Command Prompt:**
```cmd
set SUPABASE_URL=https://your-project.supabase.co
set SUPABASE_KEY=your-anon-key
npm start
```

---

## Update Server Configuration

### Step 1: Update package.json

```json
"scripts": {
  "start": "node server-supabase.js",
  "start:memory": "node server.js",
  "start:mongodb": "node server-mongodb.js",
  "dev": "nodemon server-supabase.js"
}
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase client library
- `pg` - PostgreSQL driver for Node.js
- Other required packages

---

## Start Application

### Step 1: Start Backend Server

```bash
cd c:\Users\madha\OneDrive\Desktop\blood
npm start
```

**Expected Output:**
```
✅ Supabase Connected Successfully!

🚀 Backend server running at http://localhost:3000
📊 Database: Supabase PostgreSQL
🔐 Ready to accept requests!
```

### Step 2: Open Application

```bash
start index.html
```

Or open `index.html` directly in your browser.

### Step 3: Test the Application

1. Click **"Register as Donor"**
2. Fill in details and submit
3. Go to **Admin** → **Approve Donors**
4. Approve the donor
5. Click **"Find Donor"** - your new donor should appear!

---

## Supabase Dashboard Features

### View/Edit Data

1. Go to **Table Editor**
2. Select a table (donors, requests, inventory, etc.)
3. View, edit, or delete records directly

### Monitor Queries

1. Go to **SQL Editor**
2. Run custom queries
3. See real-time data

### Enable Row Level Security (RLS)

For production, enable RLS:

1. Go to **Authentication** → **Policies**
2. Create policies for each table
3. Restrict access based on user roles

---

## Troubleshooting

### Issue: "Cannot connect to Supabase"

**Solution:**
1. Verify `.env` file has correct credentials
2. Check SUPABASE_URL format: `https://xxxxx.supabase.co`
3. Ensure SUPABASE_KEY is the **anon public key**, not secret key
4. Test connection:

```bash
node test-supabase.js
```

---

### Issue: "Table does not exist"

**Solution:**
1. Go to Supabase **SQL Editor**
2. Run the SQL scripts from [Database Schema Creation](#database-schema-creation)
3. Verify tables exist in **Table Editor**

---

### Issue: "CORS error in browser"

**Solution:**
1. Supabase CORS is automatically configured
2. If still having issues, check browser console (F12)
3. Verify API is running: `http://localhost:3000/api/health`

---

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution:**
```bash
npm install
```

---

### Issue: "Port 3000 already in use"

**Solution:**
1. Stop other applications using port 3000
2. Or change port in `server-supabase.js`:

```javascript
const port = 3001; // Change to different port
```

---

## Database Schema Reference

### Donors Table
```
id (UUID, Primary Key)
name (TEXT)
bloodType (TEXT)
email (TEXT, UNIQUE)
phone (TEXT)
location (TEXT)
available (BOOLEAN)
createdAt (TIMESTAMP)
```

### Pending Donors Table
```
id (UUID, Primary Key)
name (TEXT)
bloodType (TEXT)
email (TEXT)
phone (TEXT)
location (TEXT)
createdAt (TIMESTAMP)
```

### Requests Table
```
id (UUID, Primary Key)
patientName (TEXT)
bloodType (TEXT)
units (INTEGER)
location (TEXT)
contact (TEXT)
isEmergency (BOOLEAN)
status (TEXT)
date (TIMESTAMP)
```

### Inventory Table
```
id (UUID, Primary Key)
bloodType (TEXT)
quantity (INTEGER)
expiryDate (DATE)
addedAt (TIMESTAMP)
```

---

## API Endpoints

All endpoints work the same as before. Examples:

```bash
# Get all donors
GET http://localhost:3000/api/donors

# Create new donor registration
POST http://localhost:3000/api/donors/register

# Get all requests
GET http://localhost:3000/api/requests

# Get inventory
GET http://localhost:3000/api/inventory
```

---

## Backup Your Data

### Export from Supabase

1. Go to **Settings** → **Database**
2. Click **"Backup"**
3. Download backup file

### Restore from Backup

1. Go to **Settings** → **Restoration**
2. Upload backup file
3. Confirm restoration

---

## Upgrade to Paid Plan (Optional)

Supabase Free tier includes:
- 500 MB database storage
- 1 GB bandwidth
- Unlimited API requests
- 2 concurrent connections

For production, upgrade to **Pro**:
1. Go to **Billing**
2. Click **"Upgrade to Pro"**
3. Follow payment steps
4. Automatic scaling up

---

## Helpful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/quickstarts/react)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Discord Community](https://discord.supabase.io)

---

## Security Best Practices

1. **Never share your credentials** in code or public repositories
2. **Use .env file** to store sensitive data
3. **Add .env to .gitignore** before pushing to GitHub
4. **Enable Row Level Security (RLS)** for production
5. **Use secret key** for backend, **anon key** for frontend
6. **Rotate API keys** regularly in Supabase dashboard

---

## Next Steps

1. ✅ Create Supabase account
2. ✅ Create project
3. ✅ Create database tables using SQL
4. ✅ Copy credentials to .env file
5. ✅ Update package.json to use server-supabase.js
6. ✅ Run `npm start`
7. ✅ Open index.html
8. ✅ Start using BloodBank!

---

**Last Updated:** March 9, 2026
**Status:** Ready for Production

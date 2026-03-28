# 🎯 Supabase Setup Checklist

Complete this checklist to get your BloodBank application running with Supabase.

---

## ✅ Pre-Setup (5 minutes)

- [ ] You have a GitHub, Google, or email account
- [ ] You have an internet connection
- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] You're in the correct directory: `c:\Users\madha\OneDrive\Desktop\blood`

---

## ✅ Step 1: Create Supabase Account (2 minutes)

- [ ] Visit https://supabase.com
- [ ] Click "Sign Up"
- [ ] Choose authentication method (GitHub, Google, or email)
- [ ] Complete sign-up
- [ ] Verify email (if using email)
- [ ] You should be in the Supabase dashboard

---

## ✅ Step 2: Create Supabase Project (5 minutes)

- [ ] In dashboard, click "New project"
- [ ] Enter project name: `bloodbank`
- [ ] Create a strong database password (save it!)
- [ ] Select region (choose closest to you)
- [ ] Select "Free" plan
- [ ] Click "Create new project"
- [ ] Wait for provisioning (1-2 minutes)
- [ ] You see "Your project is ready" message

---

## ✅ Step 3: Get API Credentials (3 minutes)

- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
  - Paste here (for reference): `_________________`
- [ ] Copy **Anon Public Key** (starts with `eyJhbG...`)
  - Paste here (for reference): `_________________`
- [ ] Keep these safe!

---

## ✅ Step 4: Create Supabase Tables (5 minutes)

- [ ] In Supabase, go to **SQL Editor**
- [ ] Click **"New Query"** or **"New SQL query"**

### Table 1: Donors
- [ ] Copy SQL for donors table from [SUPABASE_SETUP.md](SUPABASE_SETUP.md#step-2-create-donors-table)
- [ ] Paste into query editor
- [ ] Click **"Run"**
- [ ] See "Success" message

### Table 2: Pending Donors
- [ ] Click **"New Query"**
- [ ] Copy SQL for pending_donors table from [SUPABASE_SETUP.md](SUPABASE_SETUP.md#step-3-create-pending-donors-table)
- [ ] Paste into query editor
- [ ] Click **"Run"**
- [ ] See "Success" message

### Table 3: Requests
- [ ] Click **"New Query"**
- [ ] Copy SQL for requests table from [SUPABASE_SETUP.md](SUPABASE_SETUP.md#step-4-create-requests-table)
- [ ] Paste into query editor
- [ ] Click **"Run"**
- [ ] See "Success" message

### Table 4: Inventory
- [ ] Click **"New Query"**
- [ ] Copy SQL for inventory table from [SUPABASE_SETUP.md](SUPABASE_SETUP.md#step-5-create-inventory-table)
- [ ] Paste into query editor
- [ ] Click **"Run"**
- [ ] See "Success" message

### Verify Tables
- [ ] Go to **Table Editor**
- [ ] See these tables:
  - [ ] donors
  - [ ] pending_donors
  - [ ] requests
  - [ ] inventory

---

## ✅ Step 5: Create .env File (2 minutes)

- [ ] Open notepad or your text editor
- [ ] Create a new file named `.env`
- [ ] Save it in: `c:\Users\madha\OneDrive\Desktop\blood`

**Contents of .env file:**
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
PORT=3000
```

Replace with actual values:
- [ ] Replace `your-project-id` with your project ID from step 3
- [ ] Replace `your-anon-public-key` with your Anon Public Key from step 3
- [ ] Save the file

**Example (do this):**
```
SUPABASE_URL=https://abc123def456.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
```

---

## ✅ Step 6: Install Dependencies (3 minutes)

- [ ] Open PowerShell or Command Prompt
- [ ] Navigate to: `c:\Users\madha\OneDrive\Desktop\blood`
- [ ] Run: `npm install`
- [ ] Wait for completion
- [ ] No errors shown (OK if warnings appear)

---

## ✅ Step 7: Test Connection (2 minutes)

- [ ] Run: `npm run test:supabase`
- [ ] You should see:
  - [ ] "Connection Successful!"
  - [ ] "All tables are set up correctly!"
  - [ ] "Your Supabase setup is ready to use"

If you see errors:
- [ ] Check .env file is correct
- [ ] Verify API key is ANON key, not SECRET key
- [ ] Make sure all 4 tables were created

---

## ✅ Step 8: Start Server (2 minutes)

- [ ] Run: `npm start`
- [ ] You should see:
  - [ ] "✅ Supabase Connected Successfully!"
  - [ ] "🚀 Backend server running at http://localhost:3000"
  - [ ] "📊 Database: Supabase PostgreSQL"

**Leave this terminal window open!**

---

## ✅ Step 9: Open Application (1 minute)

- [ ] Open `index.html` in your web browser
- [ ] You should see the BloodBank interface
- [ ] Try clicking "Register as Donor"

---

## ✅ Step 10: Test Functionality (5 minutes)

- [ ] Click **"Register as Donor"**
- [ ] Fill in the form:
  - [ ] Name: Enter any name
  - [ ] Blood Type: Select a type
  - [ ] Email: Enter an email
  - [ ] Phone: Enter a phone number
  - [ ] Location: Enter a location
- [ ] Click **"Register"**
- [ ] See: "Donor registration submitted for approval!"

### Approve the Donor
- [ ] Click **"Admin"** in navigation
- [ ] Click **"Approve Donors"** in sidebar
- [ ] See your registered donor in the list
- [ ] Click **"Approve"** button
- [ ] See: "Donor approved!"

### Find the Donor
- [ ] Click **"Find a Donor"**
- [ ] You should see your newly approved donor
- [ ] All details should be correct

✅ **Success! Your Supabase setup is complete!**

---

## ✅ Troubleshooting Checklist

### Connection Fails
- [ ] Verify .env file exists in correct directory
- [ ] Check SUPABASE_URL is correct format: `https://xxxxx.supabase.co`
- [ ] Verify SUPABASE_KEY starts with `eyJhbG...`
- [ ] Ensure you're using ANON key, not SECRET key
- [ ] Check internet connection
- [ ] Run `npm run test:supabase` again

### Tables Not Found
- [ ] Go back to Supabase SQL Editor
- [ ] Verify all 4 SQL queries were run successfully
- [ ] Check Table Editor shows all 4 tables
- [ ] Re-run the SQL if needed

### Port 3000 Already in Use
- [ ] Close other applications using port 3000
- [ ] Or edit `server-supabase.js` and change:
  ```javascript
  const port = 3001; // Change to different port
  ```

### npm install Fails
- [ ] Check internet connection
- [ ] Try: `npm cache clean --force`
- [ ] Try: `npm install` again
- [ ] Check if npm is installed: `npm --version`

---

## ✅ Optional: Enable Realtime (Advanced)

For live updates when data changes:

- [ ] Go to Supabase SQL Editor
- [ ] Click "New Query"
- [ ] Copy code from [SUPABASE_SETUP.md](SUPABASE_SETUP.md#enable-realtime-optional)
- [ ] Click "Run"

---

## ✅ Daily Usage

**To start the application each day:**

```bash
# Terminal 1: Start server
cd c:\Users\madha\OneDrive\Desktop\blood
npm start

# Terminal 2: Open browser
# Open index.html
```

**To test connection:**
```bash
npm run test:supabase
```

**To switch to another database (if needed):**
```bash
npm start:memory      # In-memory (testing)
npm start:mongodb     # MongoDB (if installed)
```

---

## ✅ Success! 🎉

You have successfully:
- ✅ Created Supabase account
- ✅ Created project
- ✅ Created database tables
- ✅ Configured environment
- ✅ Installed dependencies
- ✅ Started server
- ✅ Opened application
- ✅ Tested functionality

**Your BloodBank application is ready to use!**

---

## 📚 Next Steps

### Learn More
- [ ] Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- [ ] Explore Supabase dashboard
- [ ] View your data in Table Editor
- [ ] Write custom SQL queries in SQL Editor

### Customize
- [ ] Add Supabase authentication
- [ ] Set up Row Level Security (RLS)
- [ ] Create backups
- [ ] Monitor your usage

### Deployment
- [ ] Deploy to Heroku, Vercel, or Netlify
- [ ] Use Supabase dashboard for scaling
- [ ] Set up automated backups
- [ ] Monitor performance

---

## 📞 Help & Support

- **Supabase Docs**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.io
- **Project Documentation**: [README.md](README.md)
- **Quick Reference**: [DATABASE_QUICK_SWITCH.md](DATABASE_QUICK_SWITCH.md)

---

## ✅ Completion

Date completed: _______________

Was setup successful? ☐ YES ☐ NO

If no, error was: _________________________________

Would you like to switch to MongoDB or In-Memory?
- [ ] Stay with Supabase
- [ ] Try MongoDB (see MONGODB_SETUP.md)
- [ ] Use In-Memory (see README.md)

---

**Congratulations on setting up BloodBank with Supabase!** 🚀

**Status**: ✅ Ready for Development
**Database**: ✅ Supabase PostgreSQL
**Connection**: ✅ Verified
**Application**: ✅ Running

---

Last Updated: March 9, 2026

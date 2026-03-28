# Database Quick Switch Guide

Quick commands to switch between Supabase, MongoDB, and In-Memory databases.

---

## 🚀 Use Supabase (Cloud - Recommended)

**Setup (First time only):**
```bash
# 1. Create account at https://supabase.com
# 2. Create project
# 3. Run SQL from SUPABASE_SETUP.md
# 4. Copy credentials to .env file:
#    SUPABASE_URL=https://your-project.supabase.co
#    SUPABASE_KEY=your-anon-key

# 5. Install dependencies
npm install

# 6. Start server
npm start

# 7. Test connection
npm run test:supabase
```

**Daily Usage:**
```bash
npm start
```

---

## 🗄️ Use MongoDB (Local)

**Setup (First time only):**
```bash
# 1. Download from https://www.mongodb.com/try/download/community
# 2. Run installer
# 3. Start MongoDB service (admin PowerShell):
net start MongoDB

# 4. Create database
mongosh
use bloodbank
db.createCollection("donors")
db.createCollection("pendingdonors")
db.createCollection("requests")
db.createCollection("inventories")
exit()

# 5. Update package.json:
#    "start": "node server-mongodb.js"

# 6. Install dependencies
npm install

# 7. Start server
npm start

# 8. Test connection
npm run test:mongodb
```

**Daily Usage:**
```bash
# Start MongoDB (Admin PowerShell)
net start MongoDB

# Start server
npm start
```

---

## 💾 Use In-Memory (No Setup)

**Setup (Already configured):**
```bash
# Update package.json:
# "start": "node server.js"

# That's it!
```

**Daily Usage:**
```bash
npm install
npm start

# Data resets on restart (that's normal!)
```

---

## 📝 How to Switch

### Switch FROM Any Database TO Supabase

**Option 1: Edit package.json**
```json
"scripts": {
  "start": "node server-supabase.js"
}
```

**Option 2: Edit .env file**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

**Then:**
```bash
npm install
npm start
npm run test:supabase
```

---

### Switch FROM Any Database TO MongoDB

**Option 1: Edit package.json**
```json
"scripts": {
  "start": "node server-mongodb.js"
}
```

**Option 2: Start MongoDB service**
```bash
net start MongoDB  # Windows Admin PowerShell
# OR
brew services start mongodb-community@7.0  # macOS
# OR
sudo systemctl start mongod  # Linux
```

**Then:**
```bash
npm install
npm start
npm run test:mongodb
```

---

### Switch FROM Any Database TO In-Memory

**Option 1: Edit package.json**
```json
"scripts": {
  "start": "node server.js"
}
```

**That's it!**
```bash
npm start
```

---

## 🔍 Verify Which Database You're Using

### Check Running Server
```bash
# Visit in browser
http://localhost:3000/api/health

# Or in terminal
curl http://localhost:3000/api/health
```

### Check Server Type
```bash
# Look at console output when npm start runs

# Supabase shows:
# ✅ Supabase Connected Successfully!
# 🚀 Backend server running...

# MongoDB shows:
# Connected to MongoDB successfully!
# Backend server running...

# In-Memory shows:
# 🌐 Backend server running...
```

### Check package.json
```bash
# Open package.json and look for:
"start": "node server-supabase.js"  # Supabase
"start": "node server-mongodb.js"   # MongoDB
"start": "node server.js"            # In-Memory
```

---

## 🆘 Troubleshooting Quick Fixes

### "Cannot connect to Supabase"
```bash
# Check .env file:
cat .env

# Should show:
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_KEY=eyJhbG...

# Test connection:
npm run test:supabase
```

### "Cannot connect to MongoDB"
```bash
# Check if running:
mongosh

# If not running, start it:
net start MongoDB  # Windows Admin

# Test connection:
npm run test:mongodb
```

### "Port 3000 already in use"
```bash
# Kill process using port 3000
# Or change port in server file:
# const port = 3001;
```

### "Cannot find module"
```bash
npm install
npm start
```

---

## 📊 Available Commands

```bash
npm start                    # Start default server (Supabase)
npm start:memory             # Start in-memory server
npm start:mongodb            # Start MongoDB server
npm run test:supabase        # Test Supabase connection
npm run test:mongodb         # Test MongoDB connection
npm run dev                  # Start with auto-reload (needs nodemon)
```

---

## 🎯 Recommended Setup by Goal

### Goal: Quick Demo/Testing
```bash
npm start:memory
open index.html
```

### Goal: Small Project
```bash
# Use Supabase (no installation needed)
# See SUPABASE_SETUP.md
npm start
```

### Goal: Local Development
```bash
# Use MongoDB
# See MONGODB_SETUP.md
npm start:mongodb
```

### Goal: Production App
```bash
# Use Supabase (scales automatically)
npm start
```

---

## 🔄 Data Migration

### Export from Supabase
1. Go to Supabase dashboard
2. Settings → Backups → Download

### Export from MongoDB
```bash
# Export to JSON
mongodump --db bloodbank --out ./backup
```

### Import to MongoDB
```bash
# Restore from backup
mongorestore --db bloodbank ./backup/bloodbank
```

---

## 📱 Environment File (.env)

**Create `.env` file in project root:**

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# MongoDB (optional)
MONGODB_URI=mongodb://localhost:27017/bloodbank

# Server
PORT=3000
```

**Don't commit .env to GitHub!**
```bash
# Add to .gitignore
echo ".env" >> .gitignore
```

---

## ✅ Checklist

Before starting, ensure:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Project directory correct
- [ ] `npm install` completed
- [ ] .env file created (if using Supabase/MongoDB)
- [ ] Database credentials correct
- [ ] Service running (MongoDB/Supabase)
- [ ] Port 3000 not in use

---

## 📞 Need Help?

- **Supabase Issues**: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- **MongoDB Issues**: See [MONGODB_SETUP.md](MONGODB_SETUP.md)
- **General Help**: See [README.md](README.md)
- **Database Comparison**: See [DATABASE_COMPARISON.md](DATABASE_COMPARISON.md)

---

**Last Updated:** March 9, 2026
**Status:** Ready to Use

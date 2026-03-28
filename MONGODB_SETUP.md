# MongoDB Setup Quick Start Guide

## For Windows Users

### 1. Download MongoDB Community Edition

1. Visit: https://www.mongodb.com/try/download/community
2. Select "Windows"
3. Choose the latest version (e.g., 7.0.1)
4. Click "Download" (this downloads the MSI installer)

### 2. Install MongoDB

1. Double-click the downloaded MSI file
2. Click "Next" in the setup wizard
3. Accept the license agreement
4. Choose "Complete" installation
5. On the "Service Configuration" screen:
   - Check "Install MongoDB as a Service"
   - Leave the account as "Run the service with the following account" → "Local System"
6. Click "Install"
7. Click "Finish"

### 3. Verify MongoDB Installation

Open PowerShell and run:

```powershell
mongosh --version
```

You should see the version number. If not, MongoDB isn't in your PATH.

### 4. Start MongoDB Service

**Option A - Automatic (Default):**
MongoDB should start automatically after installation.

**Option B - Manual Start:**

#### Via PowerShell (Admin Required):
```powershell
# Right-click PowerShell → "Run as Administrator"
net start MongoDB
```

#### Via Services GUI:
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "MongoDB Server" in the list
4. Right-click → "Start"
5. (Optional) Set "Startup type" to "Automatic" to start on boot

### 5. Create Database and Collections

```powershell
# Open MongoDB shell
mongosh

# Run these commands in the shell:
use bloodbank

db.createCollection("donors")
db.createCollection("pendingdonors")
db.createCollection("requests")
db.createCollection("inventories")

# Verify
show collections

# Exit
exit()
```

### 6. Update Server Configuration

Edit `package.json` and ensure the start script uses MongoDB:

```json
"scripts": {
  "start": "node server-mongodb.js"
}
```

### 7. Start the BloodBank Application

```powershell
cd "c:\Users\madha\OneDrive\Desktop\blood"
npm install
npm start
```

Expected output:
```
Connected to MongoDB successfully!
Backend server running at http://localhost:3000
MongoDB URI: mongodb://localhost:27017/bloodbank
```

### 8. Open the Application

Open `index.html` in your web browser or use:

```powershell
start index.html
```

---

## For macOS Users

### 1. Install MongoDB via Homebrew

```bash
# First ensure Homebrew is installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community@7.0
```

### 2. Start MongoDB Service

```bash
brew services start mongodb-community@7.0
```

### 3. Create Database and Collections

```bash
# Open MongoDB shell
mongosh

# Run these commands:
use bloodbank
db.createCollection("donors")
db.createCollection("pendingdonors")
db.createCollection("requests")
db.createCollection("inventories")
exit()
```

### 4. Start the Application

```bash
cd ~/Desktop/blood
npm install
npm start
```

### 5. Open Application

```bash
open index.html
```

---

## For Linux Users (Ubuntu/Debian)

### 1. Import MongoDB GPG Key and Repository

```bash
# Import GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update
```

### 2. Install MongoDB

```bash
sudo apt-get install -y mongodb-org
```

### 3. Start MongoDB Service

```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Enable on boot
```

### 4. Create Database and Collections

```bash
mongosh

use bloodbank
db.createCollection("donors")
db.createCollection("pendingdonors")
db.createCollection("requests")
db.createCollection("inventories")
exit()
```

### 5. Start the Application

```bash
cd ~/Desktop/blood
npm install
npm start
```

### 6. Open Application

Open index.html in your browser.

---

## Troubleshooting Common Issues

### Issue: "MongoDB service is not running"

**Windows:**
```powershell
# Start the service
net start MongoDB

# If that doesn't work, start via Services:
# 1. Press Win + R
# 2. Type: services.msc
# 3. Find MongoDB Server
# 4. Right-click → Start
```

**macOS:**
```bash
brew services start mongodb-community@7.0
```

---

### Issue: "Cannot connect to MongoDB on localhost:27017"

**Check if MongoDB is running:**

```bash
# All platforms
mongosh
```

If this fails, MongoDB isn't running. Use the commands above to start it.

---

### Issue: "Database does not exist" or "Collections not found"

Collections are created automatically when you first insert data. But you can manually create them:

```bash
mongosh

use bloodbank
db.createCollection("donors")
db.createCollection("pendingdonors")
db.createCollection("requests")
db.createCollection("inventories")

exit()
```

---

### Issue: "Port 3000 already in use"

Another application is using port 3000. Either:

1. Stop the other application
2. Change the port in `server-mongodb.js`

```javascript
const port = 3001; // Change from 3000 to 3001
```

---

### Issue: "npm ERR! Cannot find module 'mongoose'"

Run:
```bash
npm install
```

This installs all dependencies including mongoose.

---

## Verify Everything Works

### 1. Check MongoDB Connection

```bash
mongosh
# If you see the MongoDB prompt (>), it's working
exit()
```

### 2. Check Server

```bash
npm start
# Should show:
# Connected to MongoDB successfully!
# Backend server running at http://localhost:3000
```

### 3. Check API Health

```bash
# In another terminal/PowerShell:
curl http://localhost:3000/api/health
# or visit in browser: http://localhost:3000/api/health
```

---

## Switch Between In-Memory and MongoDB

### Use MongoDB (Recommended):
```bash
# Edit package.json
"start": "node server-mongodb.js"

npm start
```

### Use In-Memory (No MongoDB needed):
```bash
# Edit package.json
"start": "node server.js"

npm start
```

---

## MongoDB Shell Commands Reference

```bash
# Connect to MongoDB
mongosh

# List all databases
show dbs

# Switch to a database
use bloodbank

# List collections
show collections

# View a collection
db.donors.find()
db.donors.find().pretty()

# Count documents
db.donors.count()

# Delete all documents in a collection
db.donors.deleteMany({})

# Exit MongoDB shell
exit()
```

---

## Need More Help?

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Community: https://community.mongodb.com/
- Node.js Mongoose Docs: https://mongoosejs.com/

---

Last Updated: March 9, 2026

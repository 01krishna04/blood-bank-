# BloodBank Management System

A comprehensive web application for managing blood donation, donor registration, blood requests, and inventory management.

---

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Supabase Setup](#supabase-setup)
6. [MongoDB Setup](#mongodb-setup)
7. [Usage](#usage)
8. [API Endpoints](#api-endpoints)
9. [Technologies Used](#technologies-used)

---

## Features

- **Donor Registration**: Register as a blood donor with approval system
- **Find Donors**: Search for available donors by blood type and location
- **Blood Requests**: Submit blood requests with emergency option
- **Inventory Management**: Manage blood stock with expiry tracking
- **Admin Dashboard**: Approve/reject donor registrations, view reports
- **Notifications**: Send alerts and notifications to donors
- **Reports & Analytics**: View donation statistics and inventory status
- **Eligibility Check**: Determine if someone is eligible to donate blood

---

## Project Structure

```
blood/
├── index.html           # Main HTML file with UI components
├── script.js           # Frontend JavaScript with event handlers
├── style.css           # Styling for the application
├── server.js           # Backend server (In-memory database version)
├── server-mongodb.js   # Backend server (MongoDB version)
├── package.json        # Node.js dependencies
└── README.md          # Documentation
```

---

## Requirements

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (v4.4 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## Installation

### 1. Clone or Download the Project

```bash
cd c:\Users\madha\OneDrive\Desktop\blood
```

### 2. Install Dependencies

```bash
npm install
```

This will install the required packages:
- `express` (v4.22.1) - Web framework
- `cors` (v2.8.5) - Cross-Origin Resource Sharing
- `mongoose` (v7.5.0) - MongoDB Object Modeling

---

## Supabase Setup

### Quick Start with Supabase (Recommended for Cloud Deployment)

Supabase is a Firebase alternative that uses PostgreSQL. Perfect for production applications.

#### Step 1: Create Supabase Account
- Visit [Supabase](https://supabase.com)
- Sign up with GitHub, Google, or email
- Create a new organization

#### Step 2: Create New Project
1. Click "New project"
2. Enter project name: `bloodbank`
3. Create a strong database password
4. Choose region closest to you
5. Select "Free" plan (includes 500MB storage)
6. Click "Create new project"

#### Step 3: Copy API Credentials
1. Go to **Settings → API**
2. Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy **Anon Public Key** (starts with `eyJhbG...`)

#### Step 4: Create `.env` File

Create a file named `.env` in your project directory:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
PORT=3000
```

#### Step 5: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the SQL from [SUPABASE_SETUP.md](SUPABASE_SETUP.md#database-schema-creation)
4. Click **Run**
5. Repeat for all 4 tables (donors, pending_donors, requests, inventory)

#### Step 6: Install Dependencies

```bash
npm install
```

#### Step 7: Start Server

```bash
npm start
```

Expected output:
```
✅ Supabase Connected Successfully!
🚀 Backend server running at http://localhost:3000
```

#### Step 8: Test Connection

```bash
npm run test:supabase
```

#### Step 9: Open Application

Open `index.html` in your browser

**For detailed setup instructions, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

---

## MongoDB Setup

### Prerequisites

Before connecting to MongoDB, ensure you have:
- MongoDB installed on your local system
- MongoDB running in the background
- Basic understanding of MongoDB concepts

---

### Step-by-Step MongoDB Setup Guide

#### **Step 1: Download and Install MongoDB**

**For Windows:**

1. Visit [MongoDB Community Download](https://www.mongodb.com/try/download/community)
2. Select your OS (Windows)
3. Choose the latest stable version (e.g., 7.0.x)
4. Click "Download"
5. Extract and run the MSI installer
6. Follow the installation wizard:
   - Accept the license agreement
   - Choose "Complete" setup
   - Select "Install as a Service" (Recommended)
   - In "Run MongoDB as a Service" → Select "Run MongoDB as a Service"
   - Click Install

**For macOS:**

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

**For Linux (Ubuntu):**

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org
```

---

#### **Step 2: Start MongoDB Service**

**For Windows (if installed as Service):**

MongoDB should start automatically. If not:

```bash
# Open PowerShell as Administrator and run:
net start MongoDB
```

Or manually start via Services:
1. Press `Win + R`
2. Type `services.msc`
3. Find "MongoDB Server"
4. Right-click and select "Start"

**For macOS:**

```bash
brew services start mongodb-community@7.0
```

**For Linux:**

```bash
sudo systemctl start mongod
```

**Verify MongoDB is Running:**

```bash
mongo --version
```

Or test connection:

```bash
mongosh
```

If you see the MongoDB prompt (like `>` or `test>`), it's running correctly!

---

#### **Step 3: Create Database and Collections**

When MongoDB starts, it can automatically create databases and collections when you first insert data. However, you can manually create them:

**Using MongoDB Shell (mongosh):**

```bash
# Open MongoDB shell
mongosh

# Switch to bloodbank database (creates if not exists)
use bloodbank

# Create collections
db.createCollection("donors")
db.createCollection("pendingdonors")
db.createCollection("requests")
db.createCollection("inventories")

# Verify collections created
show collections

# Exit
exit()
```

**Collections will have the following structure:**

- **donors**: Stores approved donors
- **pendingdonors**: Stores pending donor registrations
- **requests**: Stores blood requests
- **inventories**: Stores blood inventory/stock

---

#### **Step 4: Configure MongoDB URI**

The MongoDB connection is configured in `server-mongodb.js`

**Default Connection String:**
```javascript
mongodb://localhost:27017/bloodbank
```

**To use custom MongoDB URI, set environment variable:**

**Windows (PowerShell):**
```powershell
$env:MONGODB_URI = "mongodb://localhost:27017/bloodbank"
npm start
```

**Windows (Command Prompt):**
```cmd
set MONGODB_URI=mongodb://localhost:27017/bloodbank
npm start
```

**macOS/Linux:**
```bash
export MONGODB_URI=mongodb://localhost:27017/bloodbank
npm start
```

---

#### **Step 5: Switch Server to MongoDB Version**

Update `package.json` scripts to use the MongoDB version:

**Current package.json:**
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

**Change to:**
```json
"scripts": {
  "start": "node server-mongodb.js",
  "dev": "nodemon server-mongodb.js"
}
```

---

#### **Step 6: Start the Backend Server**

```bash
npm start
```

**Expected Output:**
```
Connected to MongoDB successfully!
Backend server running at http://localhost:3000
MongoDB URI: mongodb://localhost:27017/bloodbank
```

If you see errors like `Error: connect ECONNREFUSED`, ensure MongoDB service is running.

---

### MongoDB Connection Troubleshooting

| Error | Solution |
|-------|----------|
| `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB service is not running. Start the MongoDB service. |
| `MongoError: getaddrinfo ENOTFOUND` | Invalid host/connection string. Verify the URI. |
| `MongoNetworkError: cannot authenticate` | Username/password incorrect (if auth enabled). Update credentials. |
| `Database not found` | Database is created automatically on first insert. No action needed. |

---

### MongoDB Database Schemas

**Donor Schema:**
```javascript
{
  _id: ObjectId,
  name: String,
  bloodType: String (A+, A-, B+, B-, AB+, AB-, O+, O-),
  email: String (unique),
  phone: String,
  location: String,
  available: Boolean (default: true),
  createdAt: Date (auto)
}
```

**Pending Donor Schema:**
```javascript
{
  _id: ObjectId,
  name: String,
  bloodType: String,
  email: String,
  phone: String,
  location: String,
  createdAt: Date (auto)
}
```

**Blood Request Schema:**
```javascript
{
  _id: ObjectId,
  patientName: String,
  bloodType: String,
  units: Number (min: 1),
  location: String,
  contact: String,
  isEmergency: Boolean (default: false),
  status: String (Pending, Fulfilled, Cancelled),
  date: Date (auto)
}
```

**Inventory Schema:**
```javascript
{
  _id: ObjectId,
  bloodType: String,
  quantity: Number (min: 1),
  expiryDate: Date,
  addedAt: Date (auto)
}
```

---

## Usage

### 1. Start MongoDB Service

**Windows:**
```bash
net start MongoDB
# or use Services UI
```

**macOS:**
```bash
brew services start mongodb-community@7.0
```

### 2. Start the Backend Server

```bash
npm start
```

Server runs at: `http://localhost:3000`

### 3. Open Frontend

Open `index.html` in your web browser:

```bash
start index.html
```

Or navigate to it using your browser's file open dialog.

### 4. Use the Application

- **Home**: View welcome screen
- **Register as Donor**: Submit donor registration (pending admin approval)
- **Find Donor**: Search and view available donors
- **Request Blood**: Submit blood requests
- **Request History**: View your blood requests
- **Eligibility Check**: Check donation eligibility
- **Inventory (Admin)**: Manage blood stock
- **Admin**: Approve/reject donor registrations
- **Reports**: View statistics and charts
- **Notifications**: Send alerts to donors
- **About**: Learn about the organization

---

## API Endpoints

### Donors API

```
GET    /api/donors                 # Get all donors
GET    /api/donors/:id             # Get specific donor
POST   /api/donors                 # Create new donor
PUT    /api/donors/:id             # Update donor
DELETE /api/donors/:id             # Delete donor
```

### Pending Donors API

```
GET    /api/pending-donors                    # Get pending registrations
POST   /api/donors/register                   # Submit new registration
POST   /api/pending-donors/approve/:id        # Approve registration
POST   /api/pending-donors/reject/:id         # Reject registration
```

### Blood Requests API

```
GET    /api/requests               # Get all requests
POST   /api/requests               # Create new request
PUT    /api/requests/:id           # Update request status
DELETE /api/requests/:id           # Delete request
```

### Inventory API

```
GET    /api/inventory              # Get all inventory
POST   /api/inventory              # Add new stock
PUT    /api/inventory/:id          # Update stock quantity
DELETE /api/inventory/:id          # Remove stock batch
POST   /api/inventory/remove-expired # Remove expired blood units
```

### Reports API

```
GET    /api/reports/summary        # Get statistics dashboard
```

### Health Check

```
GET    /api/health                 # Server health status
```

---

## Technologies Used

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling with animations and gradients
- **JavaScript (ES6+)**: Interactivity and DOM manipulation
- **Bootstrap 5.3**: Responsive UI components
- **Chart.js**: Data visualization for reports

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM (Object Document Mapper)
- **CORS**: Cross-origin requests handling

### Development Tools
- **npm**: Package manager
- **nodemon**: Auto-reload on file changes (dev dependency)

---

## Quick Start Summary

```bash
# 1. Install MongoDB (one-time)
# Visit: https://www.mongodb.com/try/download/community

# 2. Start MongoDB
net start MongoDB  # Windows
# or
brew services start mongodb-community@7.0  # macOS

# 3. Navigate to project
cd c:\Users\madha\OneDrive\Desktop\blood

# 4. Install dependencies
npm install

# 5. Update server version (use MongoDB)
# Edit package.json: change "start": "node server-mongodb.js"

# 6. Start server
npm start

# 7. Open application
# Open index.html in your browser
```

---

## Support

For issues or questions:
1. Check MongoDB is running: `mongosh`
2. Verify server is running: `http://localhost:3000/api/health`
3. Check browser console for errors (F12)
4. Review server logs for error messages

---

## License

ISC License

---

## Version

**Current Version:** 2.0.0 (MongoDB Edition)
**Last Updated:** March 9, 2026
#   b l o o d - b a n k -  
 #   b l o o d - b a n k -  
 #   b l o o d - b a n k -  
 #   b l o o d - b a n k -  
 
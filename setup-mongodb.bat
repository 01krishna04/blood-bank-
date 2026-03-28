@echo off
REM MongoDB BloodBank Setup Script for Windows
REM This script helps set up the MongoDB connection and start the application

echo ========================================
echo BloodBank MongoDB Setup Script
echo ========================================
echo.

REM Check if MongoDB is installed
echo Checking MongoDB installation...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MongoDB is not installed or not in PATH
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)
echo [OK] MongoDB found

echo.
echo Checking MongoDB Service Status...
sc query MongoDB | findstr "RUNNING" >nul
if errorlevel 1 (
    echo [WARNING] MongoDB service is not running
    echo Attempting to start MongoDB service...
    net start MongoDB >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to start MongoDB service
        echo Run PowerShell as Administrator and execute: net start MongoDB
        echo.
        pause
        exit /b 1
    )
    echo [OK] MongoDB service started
) else (
    echo [OK] MongoDB service is running
)

echo.
echo Verifying MongoDB connection...
mongosh --eval "print('Connection OK')" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Cannot connect to MongoDB
    echo Ensure MongoDB is running on localhost:27017
    echo.
    pause
    exit /b 1
)
echo [OK] MongoDB connection verified

echo.
echo Creating database and collections...
mongosh << EOF
use bloodbank
db.createCollection("donors")
db.createCollection("pendingdonors")
db.createCollection("requests")
db.createCollection("inventories")
print("Collections created successfully!")
quit()
EOF

echo.
echo Installing npm dependencies...
call npm install

echo.
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Run: npm start
echo 2. Open: index.html in your browser
echo.
pause

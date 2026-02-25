@echo off
REM E-Commerce Marketplace Installation Script for Windows
REM This script automates the setup process

echo ================================================================
echo      E-Commerce Marketplace - Installation Script (Windows)
echo ================================================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

REM Install admin frontend dependencies
echo Installing admin frontend dependencies...
cd ..\admin-frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install admin frontend dependencies
    pause
    exit /b 1
)
echo [OK] Admin frontend dependencies installed
echo.

REM Setup environment files
echo Setting up environment files...
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo [OK] Backend .env file created
    echo [WARNING] Please edit backend\.env with your configuration
) else (
    echo [WARNING] Backend .env file already exists
)

cd ..\frontend
if not exist .env (
    echo VITE_API_URL=http://localhost:5000/api > .env
    echo [OK] Frontend .env file created
) else (
    echo [WARNING] Frontend .env file already exists
)

cd ..\admin-frontend
if not exist .env (
    echo VITE_API_URL=http://localhost:5000/api > .env
    echo [OK] Admin frontend .env file created
) else (
    echo [WARNING] Admin frontend .env file already exists
)
echo.

REM Create upload directories
echo Creating upload directories...
cd ..\backend
if not exist uploads\products mkdir uploads\products
if not exist uploads\categories mkdir uploads\categories
if not exist uploads\profile-images mkdir uploads\profile-images
if not exist uploads\returns mkdir uploads\returns
echo [OK] Upload directories created
echo.

REM Installation complete
echo ================================================================
echo              Installation Complete!
echo ================================================================
echo.
echo Next Steps:
echo.
echo 1. Configure your environment:
echo    - Edit backend\.env with your database credentials
echo    - Configure SMTP settings for email notifications
echo    - Add Chapa payment gateway credentials
echo.
echo 2. Setup database:
echo    - Create MySQL database: ecommerce_marketplace
echo    - Run: cd backend ^&^& npm run setup-features
echo.
echo 3. Start the services (open 3 command prompts):
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: cd frontend ^&^& npm run dev
echo    Terminal 3: cd admin-frontend ^&^& npm run dev
echo.
echo 4. Access the application:
echo    - Customer Frontend: http://localhost:3000
echo    - Admin Dashboard: http://localhost:3001
echo    - API: http://localhost:5000/api
echo.
echo 5. Create admin user:
echo    cd backend ^&^& node scripts\createAdmin.js
echo.
echo Documentation:
echo    - Quick Start: QUICK_START.md
echo    - Full Guide: IMPLEMENTATION_GUIDE.md
echo    - Testing: TESTING_GUIDE.md
echo.
echo ================================================================
echo Happy coding!
echo ================================================================
echo.
pause

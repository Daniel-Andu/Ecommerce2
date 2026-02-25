#!/bin/bash

# E-Commerce Marketplace Installation Script
# This script automates the setup process

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     E-Commerce Marketplace - Installation Script          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "🔍 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v14 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠️  MySQL command not found. Make sure MySQL is installed and running.${NC}"
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

# Install admin frontend dependencies
echo ""
echo "📦 Installing admin frontend dependencies..."
cd ../admin-frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Admin frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install admin frontend dependencies${NC}"
    exit 1
fi

# Setup environment files
echo ""
echo "⚙️  Setting up environment files..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Backend .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env file already exists${NC}"
fi

cd ../frontend
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✅ Frontend .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env file already exists${NC}"
fi

cd ../admin-frontend
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✅ Admin frontend .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  Admin frontend .env file already exists${NC}"
fi

# Database setup prompt
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 Database Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""
read -p "Do you want to setup the database now? (y/n): " setup_db

if [ "$setup_db" = "y" ] || [ "$setup_db" = "Y" ]; then
    echo ""
    read -p "Enter MySQL username (default: root): " db_user
    db_user=${db_user:-root}
    
    read -sp "Enter MySQL password: " db_pass
    echo ""
    
    read -p "Enter database name (default: ecommerce_marketplace): " db_name
    db_name=${db_name:-ecommerce_marketplace}
    
    echo ""
    echo "Creating database..."
    mysql -u "$db_user" -p"$db_pass" -e "CREATE DATABASE IF NOT EXISTS $db_name;"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database created${NC}"
        
        echo "Running migrations..."
        cd ../backend
        node scripts/setup-new-features.js
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Migrations completed${NC}"
        else
            echo -e "${RED}❌ Migration failed${NC}"
        fi
    else
        echo -e "${RED}❌ Failed to create database${NC}"
    fi
fi

# Create upload directories
echo ""
echo "📁 Creating upload directories..."
cd ../backend
mkdir -p uploads/products
mkdir -p uploads/categories
mkdir -p uploads/profile-images
mkdir -p uploads/returns
echo -e "${GREEN}✅ Upload directories created${NC}"

# Installation complete
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              Installation Complete! 🎉                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure your environment:"
echo "   - Edit backend/.env with your database credentials"
echo "   - Configure SMTP settings for email notifications"
echo "   - Add Chapa payment gateway credentials"
echo ""
echo "2. Start the services:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo "   Terminal 3: cd admin-frontend && npm run dev"
echo ""
echo "3. Access the application:"
echo "   - Customer Frontend: http://localhost:3000"
echo "   - Admin Dashboard: http://localhost:3001"
echo "   - API: http://localhost:5000/api"
echo ""
echo "4. Create admin user:"
echo "   cd backend && node scripts/createAdmin.js"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICK_START.md"
echo "   - Full Guide: IMPLEMENTATION_GUIDE.md"
echo "   - Testing: TESTING_GUIDE.md"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Happy coding! 🚀"
echo "═══════════════════════════════════════════════════════════"

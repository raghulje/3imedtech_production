#!/bin/bash

# Production Deployment Script for Linux/Mac
# Usage: ./deploy.sh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Starting deployment...${NC}"

# Step 1: Backup config files
echo -e "${YELLOW}📦 Backing up configuration files...${NC}"
cp server/config/config.json server/config/config.json.backup
[ -f docker-compose.yml ] && cp docker-compose.yml docker-compose.yml.backup
[ -f server/.env ] && cp server/.env server/.env.backup
[ -f client/.env.production ] && cp client/.env.production client/.env.production.backup

# Step 2: Pull changes
echo -e "${YELLOW}⬇️  Pulling latest changes from GitHub...${NC}"
git pull origin master

# Step 3: Restore config files
echo -e "${YELLOW}🔧 Restoring production configuration...${NC}"
cp server/config/config.json.backup server/config/config.json
[ -f docker-compose.yml.backup ] && cp docker-compose.yml.backup docker-compose.yml
[ -f server/.env.backup ] && cp server/.env.backup server/.env
[ -f client/.env.production.backup ] && cp client/.env.production.backup client/.env.production

# Step 4: Install dependencies (if needed)
echo -e "${YELLOW}📥 Checking dependencies...${NC}"
cd client
npm install
cd ../server
npm install
cd ..

# Step 5: Build frontend
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
cd client
npm run build
cd ..

# Step 6: Restart services
echo -e "${YELLOW}🐳 Restarting Docker services...${NC}"
docker-compose down
docker-compose up -d --build

echo -e "${GREEN}✅ Deployment complete!${NC}"


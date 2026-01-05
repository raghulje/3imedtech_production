# Production Server Deployment Guide

## Quick Deploy Commands

### Step 1: Backup Your Configuration Files

```bash
# Backup your production configuration files
cp server/config/config.json server/config/config.json.backup
cp docker-compose.yml docker-compose.yml.backup 2>/dev/null || true
cp server/.env server/.env.backup 2>/dev/null || true
cp client/.env.production client/.env.production.backup 2>/dev/null || true
```

### Step 2: Pull Latest Changes

```bash
# Pull the latest changes from GitHub
git pull origin master
```

### Step 3: Restore Your Configuration Files

```bash
# Restore your production configuration (if they were overwritten)
cp server/config/config.json.backup server/config/config.json
cp docker-compose.yml.backup docker-compose.yml 2>/dev/null || true
cp server/.env.backup server/.env 2>/dev/null || true
cp client/.env.production.backup client/.env.production 2>/dev/null || true
```

### Step 4: Build Frontend

```bash
# Navigate to client directory and build
cd client
npm install  # Only if package.json changed
npm run build
cd ..
```

### Step 5: Restart Docker Services

```bash
# Restart your docker containers
docker-compose down
docker-compose up -d --build
```

## One-Line Script (Recommended)

Create a file `deploy.sh` on your production server:

```bash
#!/bin/bash

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
npm install --production=false
cd ../server
npm install --production=false
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
```

Make it executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Alternative: Using Git Stash (If Config Files Are Tracked)

If `config.json` gets overwritten, you can use git stash:

```bash
# Stash your local config changes
git stash push -m "Production config backup" server/config/config.json

# Pull changes
git pull origin master

# Restore your config
git stash pop
```

## Protecting Files from Git Updates

To permanently protect files from being overwritten by git pull:

```bash
# Tell git to ignore changes to these files
git update-index --assume-unchanged server/config/config.json
git update-index --assume-unchanged docker-compose.yml
git update-index --assume-unchanged server/.env
git update-index --assume-unchanged client/.env.production
```

To undo this protection later:

```bash
git update-index --no-assume-unchanged server/config/config.json
git update-index --no-assume-unchanged docker-compose.yml
git update-index --no-assume-unchanged server/.env
git update-index --no-assume-unchanged client/.env.production
```

## Manual Step-by-Step (If Script Fails)

```bash
# 1. Backup
cp server/config/config.json server/config/config.json.backup

# 2. Pull
git pull origin master

# 3. Restore
cp server/config/config.json.backup server/config/config.json

# 4. Build
cd client
npm run build
cd ..

# 5. Restart Docker
docker-compose restart
# OR
docker-compose down && docker-compose up -d
```

## Verify Deployment

After deployment, check:

```bash
# Check if containers are running
docker-compose ps

# Check logs
docker-compose logs -f

# Test the application
curl http://localhost:5000/api/health  # or your configured port
```

## Troubleshooting

### If config.json gets overwritten:
```bash
git checkout HEAD -- server/config/config.json
# Then restore your backup
cp server/config/config.json.backup server/config/config.json
```

### If build fails:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

### If Docker build fails:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```


# Fix for "config.json would be overwritten" Error

## Problem
When pulling updates, git tries to update `config.json` because it was previously tracked. Your production config needs to be preserved.

## Solution - Run These Commands on Production Server

### Step 1: Remove config.json from Git Tracking (Keep Your Local File)

```bash
# Remove from git index but keep your local file
git rm --cached server/config/config.json

# Commit this removal locally
git commit -m "Remove config.json from tracking on production"
```

### Step 2: Now Pull Will Work

```bash
# Pull the updates
git pull origin master
```

### Step 3: Verify Your Config is Still Intact

```bash
# Check that your config.json still has your production settings
cat server/config/config.json | grep -i "your_production_username"
```

### Step 4: Build and Restart

```bash
# Build frontend
cd client
npm run build
cd ..

# Restart Docker
docker-compose restart
```

## Alternative: Quick One-Line Fix

If you want to keep your local version and force the pull:

```bash
# Keep your local config.json and pull
git checkout --ours server/config/config.json
git add server/config/config.json
git pull origin master --no-edit
```

## After This One-Time Fix

Once you've removed `config.json` from git tracking on your production server, future pulls will work smoothly because:
- The file is now in `.gitignore` in the repository
- It's no longer tracked on your production server
- Git will never try to update it again

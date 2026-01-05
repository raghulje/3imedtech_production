# Fix for "config.json would be overwritten" Error

## Problem
When pulling updates, git tries to update `config.json` because it was previously tracked. Your production config needs to be preserved.

## Solution

### Step 1: Backup and Remove from Git Tracking

```bash
# Backup your production config.json
cp server/config/config.json server/config/config.json.production

# Remove the file from git's index (but keep your local file)
git rm --cached server/config/config.json

# Commit this removal
git commit -m "Remove config.json from tracking - keep production config"

# Now pull should work
git pull origin master

# Restore your production config
cp server/config/config.json.production server/config/config.json
```

### Alternative: Quick Fix (Recommended)

```bash
# Method 1: Stash your local changes, pull, then restore
git stash push -m "Production config backup" server/config/config.json
git pull origin master
git stash pop

# Method 2: Force keep your local version
git checkout --ours server/config/config.json
git pull origin master
```

### Method 3: Tell Git to Ignore Local Changes (Permanent Fix)

```bash
# This tells git to always ignore changes to this file
git update-index --assume-unchanged server/config/config.json

# Now pull will work without issues
git pull origin master
```

## Recommended One-Time Setup

Run these commands once on your production server:

```bash
# 1. Backup your config
cp server/config/config.json server/config/config.json.backup

# 2. Tell git to ignore this file permanently
git update-index --assume-unchanged server/config/config.json

# 3. Now pull will work
git pull origin master

# 4. Verify your config is still intact
diff server/config/config.json server/config/config.json.backup
# (Should show no differences if everything is good)
```

After this one-time setup, `git pull` will work smoothly without touching your `config.json`.


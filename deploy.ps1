# Production Deployment Script for Windows/PowerShell
# Usage: .\deploy.ps1

Write-Host "🔄 Starting deployment..." -ForegroundColor Yellow

# Step 1: Backup config files (optional - these files are now in .gitignore)
Write-Host "📦 Backing up configuration files (if they exist)..." -ForegroundColor Yellow
if (Test-Path "server\config\config.json") { Copy-Item -Path "server\config\config.json" -Destination "server\config\config.json.backup" -Force }
if (Test-Path "docker-compose.yml") { Copy-Item -Path "docker-compose.yml" -Destination "docker-compose.yml.backup" -Force }
if (Test-Path "server\.env") { Copy-Item -Path "server\.env" -Destination "server\.env.backup" -Force }
if (Test-Path "client\.env.production") { Copy-Item -Path "client\.env.production" -Destination "client\.env.production.backup" -Force }

# Step 2: Pull changes
Write-Host "⬇️  Pulling latest changes from GitHub..." -ForegroundColor Yellow
git pull origin master

# Step 3: Restore config files (if they were accidentally overwritten)
Write-Host "🔧 Restoring production configuration (if needed)..." -ForegroundColor Yellow
if (Test-Path "server\config\config.json.backup") { Copy-Item -Path "server\config\config.json.backup" -Destination "server\config\config.json" -Force }
if (Test-Path "docker-compose.yml.backup") { Copy-Item -Path "docker-compose.yml.backup" -Destination "docker-compose.yml" -Force }
if (Test-Path "server\.env.backup") { Copy-Item -Path "server\.env.backup" -Destination "server\.env" -Force }
if (Test-Path "client\.env.production.backup") { Copy-Item -Path "client\.env.production.backup" -Destination "client\.env.production" -Force }

# Step 3b: Create config.json from example if it doesn't exist (first time setup)
if (-not (Test-Path "server\config\config.json") -and (Test-Path "server\config\config.json.example")) {
    Write-Host "📝 Creating config.json from example (first time setup)..." -ForegroundColor Yellow
    Copy-Item -Path "server\config\config.json.example" -Destination "server\config\config.json"
    Write-Host "⚠️  Please update server\config\config.json with your production database credentials!" -ForegroundColor Yellow
}

# Step 4: Install dependencies (if needed)
Write-Host "📥 Checking dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..\server
npm install
Set-Location ..

# Step 5: Build frontend
Write-Host "🏗️  Building frontend..." -ForegroundColor Yellow
Set-Location client
npm run build
Set-Location ..

# Step 6: Restart services
Write-Host "🐳 Restarting Docker services..." -ForegroundColor Yellow
docker-compose down
docker-compose up -d --build

Write-Host "✅ Deployment complete!" -ForegroundColor Green


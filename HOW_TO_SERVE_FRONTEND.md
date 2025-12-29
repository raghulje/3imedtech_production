# How to Serve Frontend on Port 5000

## Overview

The server is configured to serve **both the API and the built React frontend** on a **single port** (default: 5000). This means you only need to run the server, and it will automatically serve your frontend from the `client/out` folder.

## How It Works

1. **Port Configuration**: The server uses port 5000 by default, but can be configured via environment variables
2. **Automatic Detection**: The server automatically detects the `client/out` folder at startup
3. **Single Port**: Both API (`/api/*`) and frontend are served on the same port
4. **React Router**: All frontend routes are handled correctly via history API fallback

## Step-by-Step Instructions

### Step 1: Build the Frontend (if not already done)

```bash
cd client
npm run build
```

This creates the `client/out` folder with all the built frontend files.

### Step 2: Configure Port (Optional)

The port is determined in this order:
1. `process.env.PORT` (environment variable)
2. `process.env.APP_PORT` (environment variable)
3. `5000` (default fallback)

#### Option A: Use Default Port 5000
Just run the server - it will use port 5000 by default.

#### Option B: Set Port via Environment Variable

Create a `.env` file in the `server` directory:

```bash
cd server
```

Create `.env` file:
```env
PORT=5000
# OR
APP_PORT=5000
```

Or set it when running:
```bash
# Windows PowerShell
$env:PORT=5000; npm start

# Windows CMD
set PORT=5000 && npm start

# Linux/Mac
PORT=5000 npm start
```

### Step 3: Run the Server

```bash
cd server
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### Step 4: Access Your Application

Once the server starts, you'll see output like:

```
============================================================
🚀 SERVER STARTED SUCCESSFULLY
============================================================
📍 Server running on: http://localhost:5000
📍 API endpoints: http://localhost:5000/api/*
📍 Frontend served from: C:\Users\...\client\out
📍 Frontend accessible at: http://localhost:5000
📍 React Router configured: All routes will serve index.html
============================================================
```

**Access your application:**
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api/*
- **Health Check**: http://localhost:5000/api/health

## How Routes Are Handled

The server uses intelligent routing:

1. **API Routes** (`/api/*`): Handled by Express API routes
2. **Upload Routes** (`/uploads/*`): Served as static files
3. **Frontend Routes** (everything else): Served from `client/out` folder
   - Static assets (JS, CSS, images) are served directly
   - React Router routes serve `index.html` for client-side routing

## Example: Complete Workflow

```bash
# 1. Build the frontend
cd client
npm run build

# 2. Go to server directory
cd ../server

# 3. Start the server (uses port 5000 by default)
npm start

# 4. Open browser
# Visit: http://localhost:5000
```

## Changing the Port

### Method 1: Environment Variable (Recommended)

Create `server/.env`:
```env
PORT=3000
```

### Method 2: Modify Code (Not Recommended)

Edit `server/index.js` line 259:
```javascript
const PORT = process.env.PORT || process.env.APP_PORT || 3000; // Changed from 5000
```

## Troubleshooting

### Frontend Not Loading?

1. **Check if build exists:**
   ```bash
   ls client/out  # Linux/Mac
   dir client\out  # Windows
   ```

2. **Rebuild the frontend:**
   ```bash
   cd client
   npm run build
   ```

3. **Check server logs** - it will show if the build was detected:
   ```
   ✅ Client build detected successfully!
   ```

### Port Already in Use?

If port 5000 is already in use, change it:

```bash
# Set different port
PORT=3000 npm start
```

Or update `server/.env`:
```env
PORT=3000
```

### API Routes Not Working?

Make sure API routes start with `/api/`:
- ✅ `http://localhost:5000/api/health`
- ❌ `http://localhost:5000/health` (will serve frontend)

## Summary

- **Default Port**: 5000
- **Frontend**: Automatically served from `client/out`
- **API**: Available at `/api/*`
- **Single Command**: Just run `npm start` in the server directory
- **No Separate Frontend Server**: Everything runs on one port!


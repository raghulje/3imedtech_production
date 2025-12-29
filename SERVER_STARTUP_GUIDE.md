# Server Startup Guide

## Quick Start

1. **Stop the current server** (if running):
   - Press `Ctrl+C` in the terminal

2. **Restart the server**:
   ```bash
   cd server
   npm start
   ```

## Expected Output

When the server starts successfully, you should see:

```
============================================================
📦 FRONTEND BUILD DETECTION
============================================================
Checking for client build at: C:\Users\...\client\out
✅ Client build detected successfully!
   Path: C:\Users\...\client\out
   Index file: C:\Users\...\client\out\index.html
   Serving static files with caching enabled
   React Router configured with history API fallback
============================================================

============================================================
🔌 DATABASE CONNECTION
============================================================
Connecting to database...
✅ Database synced successfully
✅ Email service initialized

============================================================
🚀 SERVER STARTED SUCCESSFULLY
============================================================
📍 Server running on: http://localhost:5000
📍 API endpoints: http://localhost:5000/api/*
📍 Frontend served from: C:\Users\...\client\out
📍 Frontend accessible at: http://localhost:5000
📍 React Router configured: All routes will serve index.html
============================================================

✅ Ready to accept connections on port 5000
```

## Troubleshooting

### If Server Stops After "Serving static files from..."

The server is likely waiting for the database connection. Check:

1. **Is MySQL running?**
   ```bash
   # Check MySQL service (Windows)
   Get-Service MySQL*
   
   # Or check if port 3306 is listening
   netstat -an | findstr 3306
   ```

2. **Database credentials** in `server/config/config.json`:
   - Username: `raghul`
   - Password: `RefexAdmin@123`
   - Database: `3imedtech_production`
   - Host: `localhost`
   - Port: `3306`

3. **Database exists?**
   - Make sure the database `3imedtech_production` exists in MySQL

### If You See Database Connection Error

The server will now show detailed error messages:
- Check MySQL service status
- Verify credentials in `config.json`
- Ensure database exists
- Check network connectivity

### Port Already in Use?

If port 5000 is already in use:

```bash
# Use a different port
PORT=3000 npm start
```

Or create `server/.env`:
```env
PORT=3000
```

## What Happens During Startup

1. ✅ **Frontend Detection** - Checks for `client/out` folder
2. ✅ **Database Connection** - Connects to MySQL
3. ✅ **Database Sync** - Syncs Sequelize models
4. ✅ **Email Service** - Initializes email service
5. ✅ **Server Listen** - Starts listening on port 5000

All steps must complete successfully for the server to start.


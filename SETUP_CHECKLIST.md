# Production Setup Checklist

Use this checklist to ensure everything is configured correctly for production deployment.

## ✅ Pre-Installation

- [ ] Node.js v16+ installed
- [ ] MySQL v5.7+ installed and running
- [ ] Git installed (if cloning from repository)
- [ ] Server has required ports available (default: 5000)

## ✅ Installation Steps

- [ ] Repository cloned/downloaded
- [ ] Server dependencies installed (`cd server && npm install`)
- [ ] Client dependencies installed (`cd client && npm install`)

## ✅ Database Setup

- [ ] MySQL service is running
- [ ] Database `3imedtech_production` created
- [ ] Database user created (or using existing user)
- [ ] SQL file imported: `mysql -u raghul -p 3imedtech_production < 3imedtechcmsproduction.sql`
- [ ] Database credentials updated in `server/config/config.json`
- [ ] Database connection tested: `cd server && node check-database.js`

## ✅ Port Configuration

- [ ] Decided on port number (default: 5000, or custom: 3004, 3005, etc.)
- [ ] `server/.env` created with `PORT=XXXX` or `APP_PORT=XXXX`
- [ ] `client/.env.production` created with `VITE_API_URL=http://localhost:XXXX`
- [ ] If using custom domain, updated `FRONT_END_URL` in `server/.env`

## ✅ Environment Variables

- [ ] `server/.env` file created (copy from `server/serverenv.sample`)
- [ ] `NODE_ENV=production` set
- [ ] `PORT` or `APP_PORT` configured
- [ ] `APP_KEY` changed to secure random string
- [ ] `API_KEY` changed to secure random string
- [ ] `FRONT_END_URL` matches actual frontend URL
- [ ] Database credentials verified
- [ ] `client/.env.production` created with correct `VITE_API_URL`

## ✅ Frontend Build

- [ ] Frontend built: `cd client && npm run build`
- [ ] `client/out` folder exists
- [ ] `client/out/index.html` exists
- [ ] If port changed, frontend rebuilt after updating `.env.production`

## ✅ Server Configuration

- [ ] `server/config/config.json` has correct database credentials
- [ ] Database connection timeout configured (already in config.json)
- [ ] Upload directories exist (`server/uploads/images`, `server/uploads/documents`)

## ✅ Testing

- [ ] Server starts without errors: `cd server && npm start`
- [ ] Server logs show "✅ Client build detected successfully!"
- [ ] Server logs show "✅ Database synced successfully"
- [ ] Server accessible at configured port
- [ ] Frontend loads at http://localhost:PORT
- [ ] API endpoints accessible at http://localhost:PORT/api/*
- [ ] Health check works: http://localhost:PORT/api/health

## ✅ Production Deployment

- [ ] Firewall configured to allow traffic on server port
- [ ] Process manager configured (PM2, systemd, etc.)
- [ ] Server set to auto-restart on failure
- [ ] Logs configured for monitoring
- [ ] Backup strategy in place for database
- [ ] SSL/HTTPS configured (if using domain)

## ✅ Security Checklist

- [ ] JWT keys (`APP_KEY`, `API_KEY`) changed from defaults
- [ ] Database passwords are strong and secure
- [ ] `.env` files are in `.gitignore` (not committed to repository)
- [ ] Admin passwords changed from defaults
- [ ] CORS configured correctly for production domain
- [ ] File upload limits configured appropriately

## ✅ Final Verification

- [ ] Application accessible via browser
- [ ] Admin login works
- [ ] API endpoints respond correctly
- [ ] File uploads work
- [ ] Database operations work
- [ ] No errors in server logs
- [ ] No errors in browser console

---

## 🚨 Common Issues

### Port Already in Use
- **Solution**: Change port in `server/.env` and update `client/.env.production`, then rebuild

### Database Connection Fails
- **Solution**: Run `node server/check-database.js` to diagnose, verify MySQL is running

### Frontend Not Loading
- **Solution**: Verify `client/out` exists, rebuild frontend if needed

### API Calls Failing
- **Solution**: Check `VITE_API_URL` in `client/.env.production` matches server port

---

## 📞 Need Help?

1. Check `README.md` for detailed instructions
2. Check `PORT_CONFIGURATION.md` for port setup
3. Run `node server/check-database.js` to test database
4. Check server logs for error messages

---

**Once all items are checked, your application should be ready for production! 🎉**


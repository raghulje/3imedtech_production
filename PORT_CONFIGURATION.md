# Port Configuration Quick Reference

Quick guide for changing the application port from default (5000) to any other port (e.g., 3004, 3005).

## 🎯 Quick Steps

### Step 1: Set Server Port

Create/Update `server/.env`:
```env
PORT=3004
```

**OR** use `APP_PORT`:
```env
APP_PORT=3004
```

### Step 2: Set Client API URL

Create/Update `client/.env.production`:
```env
VITE_API_URL=http://localhost:3004
```

**Important**: Replace `localhost:3004` with your actual server URL if deploying to a server.

### Step 3: Rebuild Frontend

```bash
cd client
npm run build
```

### Step 4: Start Server

```bash
cd server
npm start
```

---

## 📍 All Port Configuration Locations

### Server Side

| File | Line | What to Change |
|------|------|---------------|
| `server/.env` | - | `PORT=3004` or `APP_PORT=3004` |
| `server/index.js` | 263 | Only if not using .env (fallback) |

### Client Side (Production Build)

| File | Line | What to Change |
|------|------|---------------|
| `client/.env.production` | - | `VITE_API_URL=http://localhost:3004` |
| `client/src/services/api.ts` | 3 | Uses `import.meta.env.VITE_API_URL` |
| `client/src/services/adminApi.ts` | 9 | Uses `import.meta.env.VITE_ADMIN_API_URL` |
| `client/src/pages/admin/shared/utils.ts` | 3, 8 | Uses `import.meta.env.VITE_API_URL` |

**Note**: Client files use environment variables, so you only need to update `.env.production`.

### Client Side (Development)

| File | Line | What to Change |
|------|------|---------------|
| `client/.env` | - | `VITE_API_URL=http://localhost:3004` |
| `client/vite.config.ts` | 83, 96 | Fallback only (uses env var) |

---

## 🔄 Complete Example: Port 3004

### 1. Server Configuration

**File**: `server/.env`
```env
PORT=3004
NODE_ENV=production
```

### 2. Client Configuration

**File**: `client/.env.production`
```env
VITE_API_URL=http://localhost:3004
```

### 3. Rebuild and Start

```bash
# Build frontend
cd client
npm run build

# Start server
cd ../server
npm start
```

### 4. Access Application

- Frontend: http://localhost:3004
- API: http://localhost:3004/api/*

---

## 🌐 Production Server Example

If deploying to a server with domain `example.com`:

**File**: `client/.env.production`
```env
VITE_API_URL=https://example.com
```

**File**: `server/.env`
```env
PORT=5000
FRONT_END_URL=https://example.com
```

---

## ⚠️ Important Notes

1. **Always rebuild frontend** after changing `VITE_API_URL`
2. **Update `FRONT_END_URL`** in `server/.env` to match your frontend URL
3. **Check firewall** allows traffic on the new port
4. **Update CORS settings** if using a different domain

---

## 🧪 Testing Port Configuration

After changing ports:

1. **Test server**:
   ```bash
   curl http://localhost:3004/api/health
   ```

2. **Test frontend**:
   - Open browser: http://localhost:3004
   - Check browser console for API errors

3. **Test database connection**:
   ```bash
   cd server
   node check-database.js
   ```

---

## 📋 Port Configuration Checklist

- [ ] `server/.env` has `PORT=XXXX`
- [ ] `client/.env.production` has `VITE_API_URL=http://localhost:XXXX`
- [ ] Frontend rebuilt (`npm run build` in client directory)
- [ ] Server restarted
- [ ] Firewall allows port XXXX
- [ ] Application accessible at http://localhost:XXXX

---

**Default Port**: 5000  
**Common Alternatives**: 3000, 3004, 3005, 8000, 8080


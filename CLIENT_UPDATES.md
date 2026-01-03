# Client Updates for Production

## Updates Made

### 1. ✅ Fixed API URL Configuration
**File**: `client/src/services/adminApi.ts`
- **Before**: Used `VITE_ADMIN_API_URL` (inconsistent)
- **After**: Uses `VITE_API_URL` (consistent with other services)
- **Impact**: All API calls now use the same environment variable

### 2. ✅ Created Environment Variable Example
**File**: `client/env.example`
- Created example file showing how to configure `VITE_API_URL`
- Can be copied to `.env` for development or `.env.production` for production builds

### 3. ✅ Updated TypeScript Definitions
**File**: `client/src/vite-env.d.ts`
- Added optional `VITE_ADMIN_API_URL` for backward compatibility
- Maintains type safety for environment variables

## What You Need to Do

### For Development:
1. Copy `client/env.example` to `client/.env`
2. Update `VITE_API_URL` if your server runs on a different port

### For Production:
1. Copy `client/env.example` to `client/.env.production`
2. Update `VITE_API_URL` with your production server URL:
   ```env
   # Example for port 5000
   VITE_API_URL=http://localhost:5000/api
   
   # Example for port 3004
   VITE_API_URL=http://localhost:3004/api
   
   # Example for production domain
   VITE_API_URL=https://yourdomain.com/api
   ```
3. Rebuild the frontend:
   ```bash
   cd client
   npm run build
   ```

## Important Notes

- **Environment variables** must be set **before** building
- After changing `VITE_API_URL`, you **must rebuild** the frontend
- The `.env` files are gitignored (not committed) for security
- Use `env.example` as a template

## Files Changed

1. `client/src/services/adminApi.ts` - Fixed API URL
2. `client/src/vite-env.d.ts` - Updated type definitions
3. `client/env.example` - Created example file (NEW)

## Testing

After updates, verify:
- ✅ Admin API calls work correctly
- ✅ Regular API calls work correctly
- ✅ Image uploads work correctly
- ✅ All API endpoints are accessible


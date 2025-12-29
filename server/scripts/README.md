# Database Reset and Seed Scripts

This directory contains scripts to reset and seed the CMS database with fresh data.

## Scripts Overview

1. **`delete_old_seeds.js`** - Deletes all old seed files (keeps admin user seed)
2. **`reset_database.js`** - Truncates all tables in the database
3. **`seed_admin_user.js`** - Seeds the admin user (raghul.je@refex.co.in / Admin@123)
4. **`seed_all_data.js`** - Seeds all CMS data (header, footer, pages, products, etc.)
5. **`reset_and_seed.js`** - Master script that runs all steps in order

## Quick Start

### Option 1: Run Everything at Once (Recommended)

```bash
cd server
node scripts/reset_and_seed.js
```

This will:
1. Delete old seed files
2. Reset the database (truncate all tables)
3. Seed admin user
4. Seed all CMS data

### Option 2: Run Steps Individually

```bash
cd server

# Step 1: Delete old seed files
node scripts/delete_old_seeds.js

# Step 2: Reset database
node scripts/reset_database.js

# Step 3: Seed admin user
node scripts/seed_admin_user.js

# Step 4: Seed all data
node scripts/seed_all_data.js
```

## What Gets Seeded

The `seed_all_data.js` script seeds the following:

### 1. Admin User
- Email: `raghul.je@refex.co.in`
- Password: `Admin@123`

### 2. Header & Footer
- Header navigation links
- Footer social links
- Footer navigation columns
- Contact information

### 3. Home Page
- Hero section
- About section
- Image boxes (3 items)
- Commitment section with cards

### 4. About Page
- Hero section
- Redefining Healthcare section
- Refex Group section

### 5. Mission & Vision Page
- Hero section
- Mission content
- Vision content

### 6. Why Choose Us Page
- Hero section
- Offerings section
- Advantages section with cards

### 7. Contact Page
- Hero section
- Contact info cards (4 items)
- Map section
- Contact form section

### 8. Product Pages
- **Radiography Systems**: Hero + Sample Product
- **Flat Panel Detectors**: Hero + Sample Product
- **Mammography Systems**: Hero + Sample Product
- **Refurbished MRI Systems**: Hero + Sample Product
- **Imaging Accessories**: Hero + Sample Product
- **FPD C-ARM**: Hero + Content section
- **Portable X-Ray**: Hero + Overview + Features + Specifications + Sample Product

### 9. Search Results
- Sample search results (2 items)

## Important Notes

⚠️ **WARNING**: Running `reset_database.js` will **DELETE ALL DATA** from all tables. Make sure you have backups if needed.

✅ The seed scripts use `findOrCreate`, so running them multiple times is safe - they won't create duplicates.

📝 All seeded data has default values that you can edit through the CMS interface after logging in.

## Troubleshooting

### Database Connection Error
- Make sure your database is running
- Check `server/config/config.json` for correct database credentials
- Ensure `.env` file is configured if using environment variables

### Model Import Errors
- Make sure all models are properly defined in `server/models/`
- Run `npm install` to ensure all dependencies are installed

### Foreign Key Errors
- The reset script disables foreign key checks temporarily
- If you encounter issues, try running the reset script again

## After Seeding

1. Start your server: `npm start` (in server directory)
2. Start your client: `npm run dev` (in client directory)
3. Navigate to the CMS login page
4. Login with:
   - Email: `raghul.je@refex.co.in`
   - Password: `Admin@123`
5. Edit any content through the CMS interface

## Customizing Seed Data

To customize the seed data, edit `server/scripts/seed_all_data.js` and modify the default values for each section.


"use strict";

require("dotenv").config();
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

async function migrateUserRoles() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");
    
    console.log("🔄 Migrating user roles...\n");

    // First, check what users exist with old roles using raw SQL
    const usersWithOldRoles = await sequelize.query(
      "SELECT id, email, user_type FROM users WHERE user_type IN ('CHRO', 'HR') AND deleted_at IS NULL",
      { type: QueryTypes.SELECT }
    );

    console.log(`📋 Found ${usersWithOldRoles.length} users with old roles (CHRO/HR)`);
    
    if (usersWithOldRoles.length > 0) {
      console.log("\n🔄 Step 1: Adding 'Regular User' to ENUM...");
      
      // First, alter the ENUM to include 'Regular User' (MySQL requires this)
      try {
        await sequelize.query(
          "ALTER TABLE users MODIFY COLUMN user_type ENUM('Admin', 'CHRO', 'HR', 'Regular User')",
          { type: QueryTypes.RAW }
        );
        console.log("   ✅ Added 'Regular User' to ENUM");
      } catch (error) {
        // ENUM might already have 'Regular User', that's okay
        if (error.message && error.message.includes('Duplicate')) {
          console.log("   ⚠️  'Regular User' already exists in ENUM, continuing...");
        } else {
          throw error;
        }
      }
      
      console.log("\n🔄 Step 2: Converting old roles to 'Regular User'...");
      
      // Now update users with old roles
      await sequelize.query(
        "UPDATE users SET user_type = 'Regular User', modified_at = NOW() WHERE user_type IN ('CHRO', 'HR') AND deleted_at IS NULL",
        { type: QueryTypes.UPDATE }
      );
      
      console.log(`   ✅ Updated ${usersWithOldRoles.length} user(s) to 'Regular User'`);
      
      // Show which users were updated
      usersWithOldRoles.forEach(user => {
        console.log(`      - ${user.email} (${user.user_type} → Regular User)`);
      });
      
      console.log("\n🔄 Step 3: Removing old role values from ENUM...");
      
      // Finally, remove old values from ENUM
      await sequelize.query(
        "ALTER TABLE users MODIFY COLUMN user_type ENUM('Admin', 'Regular User')",
        { type: QueryTypes.RAW }
      );
      
      console.log("   ✅ Removed old role values from ENUM");
      console.log("\n✅ All users migrated to new role system!");
    } else {
      console.log("✅ No users with old roles found. Migration not needed.");
      
      // Still need to update the ENUM if it has old values
      console.log("\n🔄 Updating ENUM to remove old values...");
      try {
        await sequelize.query(
          "ALTER TABLE users MODIFY COLUMN user_type ENUM('Admin', 'Regular User')",
          { type: QueryTypes.RAW }
        );
        console.log("   ✅ ENUM updated successfully");
      } catch (error) {
        if (error.message && error.message.includes('Data truncated')) {
          console.log("   ⚠️  Cannot update ENUM - there may be users with old values. Please check manually.");
        } else {
          throw error;
        }
      }
    }

    // Verify the migration using raw SQL
    const allUsers = await sequelize.query(
      "SELECT user_type FROM users WHERE deleted_at IS NULL",
      { type: QueryTypes.SELECT }
    );

    console.log("\n📊 Current user roles:");
    const roleCounts = {};
    allUsers.forEach((user) => {
      const role = user.user_type || 'Unknown';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} user(s)`);
    });

    console.log("\n✅ User role migration completed successfully!\n");
  } catch (error) {
    console.error("❌ Error migrating user roles:", error);
    throw error;
  }
}

if (require.main === module) {
  migrateUserRoles()
    .then(() => {
      console.log("✅ Migration script completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration script failed:", error);
      process.exit(1);
    });
}

module.exports = migrateUserRoles;


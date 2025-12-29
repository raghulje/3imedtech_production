"use strict";

require("dotenv").config();
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

async function updateAllAdmins() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");
    
    // Admin emails that should have Admin role
    const adminEmails = [
      "raghul.je@refex.co.in",
      "murugesh.k@refex.co.in"
    ];
    
    console.log("🔍 Finding and updating admin users...\n");
    
    // All available CMS pages
    const allCmsPages = [
      'home-page',
      'header-footer',
      'about-page',
      'mission-vision-page',
      'why-choose-us-page',
      'contact-page',
      'portable-xray-page',
      'radiography-page',
      'flat-panel-page',
      'mammography-page',
      'mri-page',
      'imaging-accessories-page',
      'fpd-carm-page'
    ];

    const allowedPagesJson = JSON.stringify(allCmsPages);

    // Update each admin user
    for (const email of adminEmails) {
      console.log(`\n📝 Processing: ${email}`);
      
      // Check if user exists
      const [users] = await sequelize.query(
        "SELECT id, email, user_type, allowed_cms_pages FROM users WHERE email = ? AND deleted_at IS NULL",
        {
          replacements: [email],
          type: QueryTypes.SELECT
        }
      );

      if (!users || (Array.isArray(users) && users.length === 0)) {
        console.log(`   ⚠️  User not found, skipping...`);
        continue;
      }

      const user = Array.isArray(users) ? users[0] : users;
      
      console.log(`   Current role: ${user.user_type}`);
      console.log(`   Current permissions: ${user.allowed_cms_pages ? JSON.parse(user.allowed_cms_pages).length + ' page(s)' : 'None'}`);
      
      // Update to Admin role and grant all permissions
      await sequelize.query(
        "UPDATE users SET user_type = 'Admin', allowed_cms_pages = ?, modified_at = NOW() WHERE email = ? AND deleted_at IS NULL",
        {
          replacements: [allowedPagesJson, email],
          type: QueryTypes.UPDATE
        }
      );

      console.log(`   ✅ Updated to Admin role`);
      console.log(`   ✅ Granted all ${allCmsPages.length} CMS page permissions`);
    }

    console.log(`\n📋 All CMS Pages Granted:`);
    allCmsPages.forEach((page, index) => {
      console.log(`   ${index + 1}. ${page}`);
    });

    // Verify the updates
    const updatedUsers = await sequelize.query(
      "SELECT email, user_type, allowed_cms_pages FROM users WHERE user_type = 'Admin' AND deleted_at IS NULL",
      {
        type: QueryTypes.SELECT
      }
    );

    console.log(`\n✅ All admin users updated successfully!`);
    console.log(`   Total admin users: ${updatedUsers.length}`);
    updatedUsers.forEach(user => {
      const pageCount = user.allowed_cms_pages ? JSON.parse(user.allowed_cms_pages).length : 0;
      console.log(`   - ${user.email}: ${pageCount} page(s)`);
    });
    
    console.log("\n✅ All admin permissions granted successfully!\n");
  } catch (error) {
    console.error("❌ Error updating admin users:", error);
    throw error;
  }
}

if (require.main === module) {
  updateAllAdmins()
    .then(() => {
      console.log("✅ Script completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

module.exports = updateAllAdmins;


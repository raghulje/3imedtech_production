"use strict";

require("dotenv").config();
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

async function grantAdminPermissions() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");
    
    // Find all admin users
    console.log("🔍 Finding all admin users...\n");
    
    const adminUsers = await sequelize.query(
      "SELECT id, email, user_type, allowed_cms_pages FROM users WHERE user_type = 'Admin' AND deleted_at IS NULL",
      {
        type: QueryTypes.SELECT
      }
    );

    if (!adminUsers || adminUsers.length === 0) {
      console.log("❌ No admin users found!");
      process.exit(1);
    }

    console.log(`✅ Found ${adminUsers.length} admin user(s)\n`);
    
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

    // Update all admin users with all permissions
    for (const user of adminUsers) {
      console.log(`\n📝 Processing: ${user.email}`);
      console.log(`   Current role: ${user.user_type}`);
      console.log(`   Current permissions: ${user.allowed_cms_pages ? JSON.parse(user.allowed_cms_pages).length + ' page(s)' : 'None'}`);
      
      await sequelize.query(
        "UPDATE users SET allowed_cms_pages = ?, modified_at = NOW() WHERE id = ? AND deleted_at IS NULL",
        {
          replacements: [allowedPagesJson, user.id],
          type: QueryTypes.UPDATE
        }
      );

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

    console.log(`\n✅ Permissions updated successfully for ${updatedUsers.length} admin user(s)!`);
    updatedUsers.forEach(user => {
      const pageCount = user.allowed_cms_pages ? JSON.parse(user.allowed_cms_pages).length : 0;
      console.log(`   - ${user.email}: ${pageCount} page(s)`);
    });
    
    console.log("\n✅ All admin permissions granted successfully!\n");
  } catch (error) {
    console.error("❌ Error granting admin permissions:", error);
    throw error;
  }
}

if (require.main === module) {
  grantAdminPermissions()
    .then(() => {
      console.log("✅ Script completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

module.exports = grantAdminPermissions;


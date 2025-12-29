"use strict";

require("dotenv").config();
const { sequelize, EmailSettings } = require("../models");

async function seedEmailSettings() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");
    
    console.log("📧 Seeding Email Settings...\n");

    // Check if email settings already exist
    const existing = await EmailSettings.findOne({ where: { isActive: true } });
    
    if (existing) {
      console.log("⚠️  Email settings already exist. Updating with new configuration...");
      
      await existing.update({
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpSecure: false, // false for TLS (port 587), true for SSL (port 465)
        smtpUser: "sivagami.n@refex.co.in",
        smtpPassword: "iwxzlygzarwaqzlc",
        fromEmail: "sivagami.n@refex.co.in",
        fromName: "3i MedTech",
        toEmail: "sivagami.n@refex.co.in", // Where contact form submissions will be sent
        isActive: true,
      });
      
      console.log("✅ Email settings updated successfully!");
    } else {
      await EmailSettings.create({
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpSecure: false, // false for TLS (port 587), true for SSL (port 465)
        smtpUser: "sivagami.n@refex.co.in",
        smtpPassword: "iwxzlygzarwaqzlc",
        fromEmail: "sivagami.n@refex.co.in",
        fromName: "3i MedTech",
        toEmail: "sivagami.n@refex.co.in", // Where contact form submissions will be sent
        isActive: true,
      });
      
      console.log("✅ Email settings created successfully!");
    }

    console.log("\n📋 Email Configuration:");
    console.log("   SMTP Host: smtp.gmail.com");
    console.log("   SMTP Port: 587 (TLS)");
    console.log("   SMTP User: sivagami.n@refex.co.in");
    console.log("   From Email: sivagami.n@refex.co.in");
    console.log("   To Email: sivagami.n@refex.co.in");
    console.log("\n✅ Email settings seeded successfully!\n");
  } catch (error) {
    console.error("❌ Error seeding email settings:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedEmailSettings()
    .then(() => {
      console.log("✅ Email settings seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Email settings seeding failed:", error);
      process.exit(1);
    });
}

module.exports = seedEmailSettings;


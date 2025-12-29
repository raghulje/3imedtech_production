require("dotenv").config();
const { sequelize, User } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    await sequelize.sync();
    console.log("✅ Database synced");

    const email = "raghul.je@refex.co.in";
    const password = "Admin@123";
    const firstName = "Raghul";
    const lastName = ""; // Empty last name
    const userType = "Admin"; // Use "Admin" as per the enum in user model

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists. Updating password...`);
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await existingUser.update({
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
        is_active: true,
      });
      console.log(`✅ Updated existing user: ${email}`);
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create new user
      const user = await User.create({
        email: email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
        is_active: true,
      });
      
      console.log(`✅ Created admin user: ${email}`);
      console.log(`   Name: ${firstName} ${lastName}`.trim());
      console.log(`   User Type: ${userType}`);
      console.log(`   ID: ${user.id}`);
    }

    await sequelize.close();
    console.log("✅ Seed completed successfully");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    try {
      await sequelize.close();
    } catch (_) {}
    process.exit(1);
  }
}

main();


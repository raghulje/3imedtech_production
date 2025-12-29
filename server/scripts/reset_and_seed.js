require("dotenv").config();
const { exec } = require("child_process");
const path = require("path");
const util = require("util");

const execPromise = util.promisify(exec);

async function resetAndSeed() {
  try {
    console.log("=".repeat(60));
    console.log("🔄 DATABASE RESET AND SEED PROCESS");
    console.log("=".repeat(60));
    console.log("");

    // Step 1: Delete old seed files
    console.log("Step 1: Deleting old seed files...");
    try {
      const scriptPath = path.join(__dirname, "delete_old_seeds.js");
      const { stdout, stderr } = await execPromise(
        `node "${scriptPath}"`,
        { cwd: __dirname, shell: true }
      );
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (error) {
      console.error("Error deleting old seeds:", error.message);
    }
    console.log("");

    // Step 2: Reset database (truncate all tables)
    console.log("Step 2: Resetting database (truncating all tables)...");
    try {
      const scriptPath = path.join(__dirname, "reset_database.js");
      const { stdout, stderr } = await execPromise(
        `node "${scriptPath}"`,
        { cwd: __dirname, shell: true }
      );
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (error) {
      console.error("Error resetting database:", error.message);
      throw error;
    }
    console.log("");

    // Step 3: Seed admin user
    console.log("Step 3: Seeding admin user...");
    try {
      const scriptPath = path.join(__dirname, "seed_admin_user.js");
      const { stdout, stderr } = await execPromise(
        `node "${scriptPath}"`,
        { cwd: __dirname, shell: true }
      );
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (error) {
      console.error("Error seeding admin user:", error.message);
      throw error;
    }
    console.log("");

    // Step 4: Seed all data
    console.log("Step 4: Seeding all CMS data...");
    try {
      const scriptPath = path.join(__dirname, "seed_all_data.js");
      const { stdout, stderr } = await execPromise(
        `node "${scriptPath}"`,
        { cwd: __dirname, shell: true }
      );
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (error) {
      console.error("Error seeding data:", error.message);
      throw error;
    }
    console.log("");

    console.log("=".repeat(60));
    console.log("✅ DATABASE RESET AND SEED COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("");
    console.log("📝 Next Steps:");
    console.log("   1. Start your server: npm start (in server directory)");
    console.log("   2. Start your client: npm run dev (in client directory)");
    console.log("   3. Login to CMS with:");
    console.log("      Email: raghul.je@refex.co.in");
    console.log("      Password: Admin@123");
    console.log("");

  } catch (error) {
    console.error("❌ Process failed:", error);
    process.exit(1);
  }
}

resetAndSeed();


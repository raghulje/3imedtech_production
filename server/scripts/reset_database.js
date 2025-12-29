require("dotenv").config();
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

async function resetDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Get all table names
    const tables = await sequelize.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'",
      { type: QueryTypes.SELECT }
    );

    console.log(`\n🗑️  Truncating ${tables.length} tables...\n`);

    // Disable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { type: QueryTypes.RAW });

    // Truncate each table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      try {
        await sequelize.query(`TRUNCATE TABLE \`${tableName}\``, { type: QueryTypes.RAW });
        console.log(`✅ Truncated: ${tableName}`);
      } catch (error) {
        // Some tables might not support TRUNCATE, try DELETE instead
        try {
          await sequelize.query(`DELETE FROM \`${tableName}\``, { type: QueryTypes.RAW });
          console.log(`✅ Cleared: ${tableName} (using DELETE)`);
        } catch (deleteError) {
          console.error(`❌ Error clearing ${tableName}:`, deleteError.message);
        }
      }
    }

    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { type: QueryTypes.RAW });

    console.log(`\n✅ Database reset completed successfully!`);
    console.log(`   All ${tables.length} tables have been cleared.`);

    await sequelize.close();
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    try {
      await sequelize.close();
    } catch (_) {}
    process.exit(1);
  }
}

resetDatabase();


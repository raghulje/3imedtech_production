/**
 * Database Connection Diagnostic Script
 * Run this to test your database connection before starting the server
 * 
 * Usage: node check-database.js
 */

require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("./config/config.json");
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

console.log("\n" + "=".repeat(60));
console.log("🔍 DATABASE CONNECTION DIAGNOSTIC");
console.log("=".repeat(60));
console.log("Configuration:");
console.log(`   Environment: ${env}`);
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   Username: ${dbConfig.username}`);
console.log("=".repeat(60) + "\n");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 5000
    },
    dialectOptions: {
      connectTimeout: 10000
    }
  }
);

console.log("⏳ Attempting to connect (10 second timeout)...\n");

const startTime = Date.now();

sequelize
  .authenticate()
  .then(() => {
    const duration = Date.now() - startTime;
    console.log(`✅ Connection successful! (${duration}ms)`);
    console.log("\n📊 Testing database operations...");
    
    return sequelize.query("SELECT 1 as test");
  })
  .then(([results]) => {
    console.log("✅ Query test successful");
    console.log("\n📋 Checking database...");
    
    return sequelize.query(`SHOW DATABASES LIKE '${dbConfig.database}'`);
  })
  .then(([results]) => {
    if (results.length > 0) {
      console.log(`✅ Database '${dbConfig.database}' exists`);
    } else {
      console.log(`⚠️  Database '${dbConfig.database}' not found`);
      console.log(`   You may need to create it: CREATE DATABASE ${dbConfig.database};`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL CHECKS PASSED");
    console.log("=".repeat(60));
    console.log("Your database connection is working correctly!");
    console.log("You can now start the server with: npm start");
    console.log("=".repeat(60) + "\n");
    
    process.exit(0);
  })
  .catch((err) => {
    const duration = Date.now() - startTime;
    console.error(`\n❌ Connection failed after ${duration}ms`);
    console.error("\n" + "=".repeat(60));
    console.error("ERROR DETAILS");
    console.error("=".repeat(60));
    console.error(`Error Type: ${err.name}`);
    console.error(`Error Message: ${err.message}`);
    
    if (err.original) {
      console.error(`Original Error: ${err.original.message}`);
      console.error(`Error Code: ${err.original.code}`);
    }
    
    console.error("\n" + "=".repeat(60));
    console.error("TROUBLESHOOTING STEPS");
    console.error("=".repeat(60));
    
    if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
      console.error("\n🔴 MySQL Service Issue:");
      console.error("   1. Check if MySQL is running:");
      console.error("      PowerShell: Get-Service MySQL*");
      console.error("      CMD: sc query MySQL*");
      console.error("   2. Start MySQL service:");
      console.error("      PowerShell: Start-Service MySQL*");
      console.error("      CMD: net start MySQL*");
      console.error("   3. Check if port 3306 is listening:");
      console.error("      netstat -an | findstr 3306");
    } else if (err.name === 'SequelizeAccessDeniedError') {
      console.error("\n🔴 Authentication Issue:");
      console.error("   1. Verify username and password in config/config.json");
      console.error(`   2. Test login manually:`);
      console.error(`      mysql -u ${dbConfig.username} -p -h ${dbConfig.host}`);
      console.error("   3. Check user permissions:");
      console.error(`      mysql -u ${dbConfig.username} -p -e "SHOW GRANTS;"`);
    } else if (err.name === 'SequelizeDatabaseError' && err.message.includes("Unknown database")) {
      console.error("\n🔴 Database Missing:");
      console.error(`   1. Create the database:`);
      console.error(`      mysql -u ${dbConfig.username} -p -e "CREATE DATABASE ${dbConfig.database};"`);
      console.error(`   2. Or verify the database name in config/config.json`);
    } else {
      console.error("\n🔴 General Connection Issue:");
      console.error("   1. Verify MySQL is installed and running");
      console.error("   2. Check firewall settings");
      console.error("   3. Verify network connectivity");
      console.error("   4. Check MySQL error logs");
    }
    
    console.error("\n" + "=".repeat(60) + "\n");
    process.exit(1);
  });


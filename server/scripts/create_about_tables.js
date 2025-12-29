const db = require('../models');

async function createTables() {
  try {
    console.log('🔄 Syncing database to create missing tables...');
    
    // Force sync to create tables
    await db.sequelize.sync({ alter: true, force: false });
    
    console.log('✅ Database sync completed!');
    console.log('   Tables should now be created.');
    console.log('');
    console.log('📋 Verifying tables exist...');
    
    // Verify tables exist
    const [results] = await db.sequelize.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME IN ('about_hero', 'about_redefining_healthcare', 'about_refex_group')
    `);
    
    const tableNames = results.map((r) => r.TABLE_NAME);
    console.log('   Found tables:', tableNames.join(', '));
    
    if (tableNames.length === 3) {
      console.log('✅ All About page tables exist!');
    } else {
      console.log('⚠️  Some tables may be missing. Please restart the server.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}

createTables();


const db = require('../models');

async function createTables() {
  try {
    console.log('🔄 Syncing database to create missing product page tables...');
    
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
      AND TABLE_NAME IN (
        'portable_xray_hero', 
        'portable_xray_products',
        'radiography_hero',
        'radiography_products',
        'flat_panel_hero',
        'flat_panel_products',
        'mammography_hero',
        'mammography_products',
        'refurbished_mri_hero',
        'refurbished_mri_products'
      )
    `);
    
    const tableNames = results.map((r) => r.TABLE_NAME);
    console.log('   Found tables:', tableNames.join(', '));
    
    const expectedTables = [
      'portable_xray_hero', 
      'portable_xray_products',
      'radiography_hero',
      'radiography_products',
      'flat_panel_hero',
      'flat_panel_products',
      'mammography_hero',
      'mammography_products',
      'refurbished_mri_hero',
      'refurbished_mri_products'
    ];
    
    const missingTables = expectedTables.filter(t => !tableNames.includes(t));
    
    if (missingTables.length === 0) {
      console.log('✅ All product page tables exist!');
    } else {
      console.log('⚠️  Missing tables:', missingTables.join(', '));
      console.log('   Please restart the server to create them.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}

createTables();


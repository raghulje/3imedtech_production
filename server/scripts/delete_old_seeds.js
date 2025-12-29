const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname);
const files = fs.readdirSync(scriptsDir);

// Files to keep (admin user seed)
const keepFiles = ['seed_admin_user.js', 'delete_old_seeds.js', 'reset_database.js', 'seed_all_data.js'];

console.log('🗑️  Deleting old seed files...\n');

let deletedCount = 0;
files.forEach(file => {
  if (file.startsWith('seed_') && !keepFiles.includes(file)) {
    const filePath = path.join(scriptsDir, file);
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${file}`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Error deleting ${file}:`, error.message);
    }
  }
});

console.log(`\n✅ Deleted ${deletedCount} old seed files.`);
console.log('✅ Kept: seed_admin_user.js');


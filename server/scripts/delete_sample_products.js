require("dotenv").config();
const { sequelize } = require("../models");
const { Op } = require('sequelize');
const { 
  FlatPanelProduct, 
  MammographyProduct, 
  RefurbishedMRIProduct,
  ImagingAccessoriesProduct,
  PortableXRayProduct,
  RadiographyProduct
} = require("../models");

async function deleteSampleProducts() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    console.log("🗑️  Deleting sample products...");

    // Delete sample products from all product tables
    const sampleTitles = [
      "Sample Flat Panel Product",
      "Sample Mammography Product",
      "Sample Refurbished MRI Product",
      "Sample Product"
    ];

    let deletedCount = 0;

    // Flat Panel Products
    for (const title of sampleTitles) {
      const deleted = await FlatPanelProduct.destroy({
        where: { title: { [Op.like]: `%${title}%` } }
      });
      if (deleted > 0) {
        console.log(`  ✅ Deleted ${deleted} Flat Panel Product(s) matching "${title}"`);
        deletedCount += deleted;
      }
    }

    // Mammography Products
    for (const title of sampleTitles) {
      const deleted = await MammographyProduct.destroy({
        where: { title: { [Op.like]: `%${title}%` } }
      });
      if (deleted > 0) {
        console.log(`  ✅ Deleted ${deleted} Mammography Product(s) matching "${title}"`);
        deletedCount += deleted;
      }
    }

    // Refurbished MRI Products
    for (const title of sampleTitles) {
      const deleted = await RefurbishedMRIProduct.destroy({
        where: { title: { [Op.like]: `%${title}%` } }
      });
      if (deleted > 0) {
        console.log(`  ✅ Deleted ${deleted} Refurbished MRI Product(s) matching "${title}"`);
        deletedCount += deleted;
      }
    }

    // Imaging Accessories Products
    for (const title of sampleTitles) {
      const deleted = await ImagingAccessoriesProduct.destroy({
        where: { title: { [Op.like]: `%${title}%` } }
      });
      if (deleted > 0) {
        console.log(`  ✅ Deleted ${deleted} Imaging Accessories Product(s) matching "${title}"`);
        deletedCount += deleted;
      }
    }

    // Portable X-Ray Products
    for (const title of sampleTitles) {
      const deleted = await PortableXRayProduct.destroy({
        where: { title: { [Op.like]: `%${title}%` } }
      });
      if (deleted > 0) {
        console.log(`  ✅ Deleted ${deleted} Portable X-Ray Product(s) matching "${title}"`);
        deletedCount += deleted;
      }
    }

    // Radiography Products
    for (const title of sampleTitles) {
      const deleted = await RadiographyProduct.destroy({
        where: { title: { [Op.like]: `%${title}%` } }
      });
      if (deleted > 0) {
        console.log(`  ✅ Deleted ${deleted} Radiography Product(s) matching "${title}"`);
        deletedCount += deleted;
      }
    }

    if (deletedCount === 0) {
      console.log("  ℹ️  No sample products found to delete.");
    } else {
      console.log(`\n✅ Total ${deletedCount} sample product(s) deleted successfully\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting sample products:", error);
    process.exit(1);
  }
}

deleteSampleProducts();


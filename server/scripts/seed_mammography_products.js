require("dotenv").config();
const { sequelize } = require("../models");
const { MammographyProduct } = require("../models");

async function seedMammographyProducts() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    console.log("📝 Seeding Mammography Systems Products...");

    const products = [
      {
        title: "PINKVIEW DR PLUS (Digital Mammography)",
        overview: "The PINKVIEW DR PLUS system is designed for best-in-class breast cancer detection with advanced high-resolution mammography detectors.",
        features: JSON.stringify([
          "75-micron pixel size for high-quality images",
          "Convenient digital pressure control using a microcomputer",
          "Soft compression force control for patient comfort",
          "Automatic standard positioning with single-touch shooting"
        ]),
        benefits: "Offers superior imaging quality with patient comfort, making it an ideal choice for early breast cancer detection.",
        image: "",
        sectionId: "pinkviewdrplus",
        imagePosition: "left",
        backgroundColor: "from-gray-50 to-white",
        order: 1,
        isActive: true
      },
      {
        title: "PINKVIEW RT (Analog Mammography)",
        overview: "The PINKVIEW RT system provides a cost-effective analog mammography solution with easy operation and installation.",
        features: JSON.stringify([
          "18×24 cm and 24×30 cm film sizes for digitization",
          "High DQE/low noise",
          "Built-in generator in a slim body",
          "Easy movement with 4 wheels"
        ]),
        benefits: "Delivers reliable analog mammography with easy operability, ideal for facilities looking for cost-effective solutions.",
        image: "",
        sectionId: "pinkviewrt",
        imagePosition: "right",
        backgroundColor: "from-white to-gray-50",
        order: 2,
        isActive: true
      }
    ];

    for (const product of products) {
      await MammographyProduct.findOrCreate({
        where: { title: product.title },
        defaults: product
      });
    }

    console.log("✅ Mammography Systems Products seeded\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding mammography products:", error);
    process.exit(1);
  }
}

seedMammographyProducts();


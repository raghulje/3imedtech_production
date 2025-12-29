require("dotenv").config();
const { sequelize } = require("../models");
const { RefurbishedMRIProduct } = require("../models");

async function seedRefurbishedMRIProducts() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    console.log("📝 Seeding Refurbished MRI Systems Products...");

    const products = [
      {
        title: "GE Signa HDxt 1.5Tesla",
        overview: "The GE Signa HDxt 1.5T delivers superior imaging results, equipped with advanced gradient systems and optimized for high-performance image generation across all applications.",
        features: JSON.stringify([
          "48 cm field of view (FOV)",
          "High accuracy gradients and real-time image processing",
          "Enhanced contrast and reduced blurring for small FOV",
          "Advanced applications including Propeller 3.0, Lavaflex, DTI"
        ]),
        benefits: "Provides high-definition imaging for a wide range of clinical applications, ensuring top-quality diagnostic performance.",
        image: "",
        sectionId: "gesignahdxt15tesla",
        imagePosition: "left",
        backgroundColor: "from-gray-50 to-white",
        order: 1,
        isActive: true
      },
      {
        title: "Philips Achieva 3.0Tesla X-Series",
        overview: "The Philips Achieva 3.0T X-series offers comprehensive MRI capabilities, featuring advanced imaging technology for a broad range of clinical needs.",
        features: JSON.stringify([
          "Exclusive quaser gradient systems for superb performance",
          "SENSE for reduced scan times and enhanced resolution",
          "Smart Exams for consistent MRI examination results",
          "Powerful Transmit Technology for optimal RF uniformity"
        ]),
        benefits: "Delivers exceptional image quality and operational efficiency, making it a preferred choice for advanced MRI imaging.",
        image: "",
        sectionId: "philipsachieva30teslaxseries",
        imagePosition: "right",
        backgroundColor: "from-white to-gray-50",
        order: 2,
        isActive: true
      }
    ];

    for (const product of products) {
      await RefurbishedMRIProduct.findOrCreate({
        where: { title: product.title },
        defaults: product
      });
    }

    console.log("✅ Refurbished MRI Systems Products seeded\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding refurbished MRI products:", error);
    process.exit(1);
  }
}

seedRefurbishedMRIProducts();


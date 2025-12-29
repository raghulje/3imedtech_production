require("dotenv").config();
const { sequelize } = require("../models");
const { FlatPanelProduct } = require("../models");

async function seedFlatPanelProducts() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    console.log("📝 Seeding Flat Panel Detectors Products...");

    const products = [
      {
        title: "Glass-Free Flat Panel Detector",
        overview: "The new generation glass-free flat panel detector offers high DQE for excellent image quality with robust construction designed to handle up to 150 kg.",
        features: JSON.stringify([
          "17″×17″ and 14″×17″ sizes available",
          "Wired and wireless CSI Technology",
          "Unprecedented weight of 3 kg",
          "Advanced software technology for easy deployment"
        ]),
        benefits: "Provides unmatched image quality and durability, ideal for a wide range of clinical applications.",
        image: "",
        sectionId: "glassfreeflatpaneldetector",
        imagePosition: "left",
        backgroundColor: "from-gray-50 to-white",
        order: 1,
        isActive: true
      },
      {
        title: "Retrofit Mammography Panel",
        overview: "This slim cassette-type digital mammography upgrade solution is designed by radiologists to provide an optimal user experience.",
        features: JSON.stringify([
          "18×24 cm and 24×30 cm sizes available",
          "76-micron pixel size for excellent image quality",
          "High DQE/low noise",
          "Mobile application for easy use"
        ]),
        benefits: "Offers a cost-effective solution for upgrading existing mammography systems to digital without the need for a complete overhaul.",
        image: "",
        sectionId: "retrofitmammographypanel",
        imagePosition: "right",
        backgroundColor: "from-white to-gray-50",
        order: 2,
        isActive: true
      }
    ];

    for (const product of products) {
      await FlatPanelProduct.findOrCreate({
        where: { title: product.title },
        defaults: product
      });
    }

    console.log("✅ Flat Panel Detectors Products seeded\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding flat panel products:", error);
    process.exit(1);
  }
}

seedFlatPanelProducts();


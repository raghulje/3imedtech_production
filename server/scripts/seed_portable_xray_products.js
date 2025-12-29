require("dotenv").config();
const { sequelize } = require("../models");
const { PortableXRayProduct } = require("../models");

async function seedPortableXRayProducts() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    console.log("📝 Seeding Portable X-Ray Products...");

    const products = [
      {
        title: "Mini 90 Point-of-Care X-Ray",
        overview: "The Mini 90 is a lightweight, compact, portable X-Ray unit designed for point-of-care emergencies, homecare, accident sites, and smaller clinics.",
        features: JSON.stringify([
          "High penetration with selectable kV range from 40 kV to 90 kV",
          "Programmable exposure settings",
          "Small focal spot of 0.8mm",
          "Built-in Lithium-polymer batteries for up to 150 exposures per charge"
        ]),
        benefits: "Offers exceptional portability with high-quality imaging in critical and remote care situations.",
        image: "",
        sectionId: "mini90pointofcarexray",
        imagePosition: "left",
        backgroundColor: "from-gray-50 to-white",
        order: 1,
        isActive: true
      },
      {
        title: "ADONIS HF Mobile DR",
        overview: "The ADONIS HF Mobile DR system is a compact and lightweight digital radiography solution that ensures productivity and flexibility in ICUs, ERs, and operating rooms.",
        features: JSON.stringify([
          "Featherweight design",
          "Actuator-based motorized vertical movement",
          "Dual battery system",
          "Soft touch keypad with auto-programmable features"
        ]),
        benefits: "Ensures ease of use and mobility for high-demand environments where space and flexibility are crucial.",
        image: "",
        sectionId: "adonishfmobiledr",
        imagePosition: "right",
        backgroundColor: "from-white to-gray-50",
        order: 2,
        isActive: true
      }
    ];

    for (const product of products) {
      await PortableXRayProduct.findOrCreate({
        where: { title: product.title },
        defaults: product
      });
    }

    console.log("✅ Portable X-Ray Products seeded\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding portable xray products:", error);
    process.exit(1);
  }
}

seedPortableXRayProducts();


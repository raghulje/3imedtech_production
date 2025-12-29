require("dotenv").config();
const { sequelize } = require("../models");
const { ImagingAccessoriesProduct } = require("../models");

async function seedImagingAccessoriesProducts() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    console.log("📝 Seeding Imaging Accessories Products...");

    const products = [
      {
        title: "DMD D 2000, X-Ray Film Digitizer",
        overview: "The DMD D 2000 is a medical-grade X-ray film digitizer designed to convert conventional radiographic films into digital formats for easy comparison and storage.",
        features: JSON.stringify([
          "High brightness for enhanced images",
          "Slim data size for efficient storage",
          "Support for various data formats",
          "Auto-sizing and brightness control"
        ]),
        benefits: "Facilitates easy digitization of X-ray films, ensuring high-quality digital storage and comparison.",
        image: "",
        sectionId: "dmdd2000xrayfilmdigitizer",
        order: 1,
        isActive: true
      },
      {
        title: "Image Display Monitors",
        overview: "USFDA/CE-certified display monitors support accurate display of monochrome and color images, ensuring reliable diagnostic quality.",
        features: JSON.stringify([
          "Multi-monitor configuration",
          "Backlight stabilization and ambient sensor",
          "Maintains image quality over time",
          "High brightness for performance standards"
        ]),
        benefits: "Provides reliable and accurate image display, crucial for diagnostic confidence.",
        image: "",
        sectionId: "imagedisplaymonitors",
        order: 2,
        isActive: true
      },
      {
        title: "CT/MR/Mammograph Multi-Modality Workstations",
        overview: "These workstations provide vendor-neutral access to a large set of dedicated tools for viewing and analyzing CT, MR, and mammography images.",
        features: JSON.stringify([
          "Access to current and prior studies for direct comparison",
          "Customized hanging protocols",
          "2D/3D CAD support",
          "Images can be viewed on a single station"
        ]),
        benefits: "Enhances workflow efficiency and diagnostic accuracy with comprehensive imaging tools.",
        image: "",
        sectionId: "ctmrmammographmultimodalityworkstations",
        order: 3,
        isActive: true
      },
      {
        title: "CD/DVD Publishers",
        overview: "DICOM calibrated publishers designed for auto-labelling, printing, and storage of DICOM images, suitable for hospital and center use.",
        features: JSON.stringify([
          "Easy integration with PACS",
          "Auto-pick of CD or DVD based on file size",
          "DICOM calibrated for accuracy",
          "High reliability for long-term storage"
        ]),
        benefits: "Ensures seamless and accurate storage and distribution of DICOM images, supporting efficient data management.",
        image: "",
        sectionId: "cddvdpublishers",
        order: 4,
        isActive: true
      },
      {
        title: "MedE Drive for Patient Data Storage",
        overview: "MedE Drive is a chip-based digital health card designed for storing all types of health records, offering a convenient way to carry patient data.",
        features: JSON.stringify([
          "32 GB storage capacity",
          "Write protection to avoid data tampering",
          "Personalized card with patient details",
          "Compatible with various devices"
        ]),
        benefits: "Ensures secure and portable storage of patient data, making it accessible anytime, anywhere.",
        image: "",
        sectionId: "mededrive",
        order: 5,
        isActive: true
      }
    ];

    for (const product of products) {
      await ImagingAccessoriesProduct.findOrCreate({
        where: { title: product.title },
        defaults: product
      });
    }

    console.log("✅ Imaging Accessories Products seeded\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding imaging accessories products:", error);
    process.exit(1);
  }
}

seedImagingAccessoriesProducts();


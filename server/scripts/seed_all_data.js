require("dotenv").config();
const { sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

// Import all models
const {
  User,
  HeaderFooter,
  HomeHero,
  HomeAboutSection,
  HomeImageBox,
  HomeCommitment,
  AboutHero,
  AboutRedefiningHealthcare,
  AboutRefexGroup,
  MissionVisionHero,
  MissionVisionContent,
  WhyChooseUsHero,
  WhyChooseUsOfferings,
  WhyChooseUsAdvantages,
  ContactHero,
  ContactInfoCard,
  ContactMap,
  ContactForm,
  RadiographyHero,
  RadiographyProduct,
  FlatPanelHero,
  FlatPanelProduct,
  MammographyHero,
  MammographyProduct,
  RefurbishedMRIHero,
  RefurbishedMRIProduct,
  ImagingAccessoriesHero,
  ImagingAccessoriesProduct,
  FPDCArmHero,
  FPDCArmContent,
  PortableXRayHero,
  PortableXRayOverview,
  PortableXRayFeature,
  PortableXRaySpecification,
  PortableXRayProduct,
  SearchResult
} = require("../models");

async function seedAllData() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    // Sync database
    await sequelize.sync({ alter: false });
    console.log("✅ Database synced\n");

    // ============================================
    // 1. ADMIN USER
    // ============================================
    console.log("📝 Seeding Admin User...");
    const email = "raghul.je@refex.co.in";
    const password = "Admin@123";
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const [adminUser] = await User.findOrCreate({
      where: { email },
      defaults: {
        email,
        password: hashedPassword,
        first_name: "Raghul",
        last_name: "",
        user_type: "Admin",
        is_active: true
      }
    });
    
    if (!adminUser.isNewRecord) {
      await adminUser.update({
        password: hashedPassword,
        first_name: "Raghul",
        last_name: "",
        user_type: "Admin",
        is_active: true
      });
    }
    console.log("✅ Admin user seeded\n");

    // ============================================
    // 2. HEADER & FOOTER
    // ============================================
    console.log("📝 Seeding Header & Footer...");
    
    // Header
    await HeaderFooter.findOrCreate({
      where: { componentType: "header" },
      defaults: {
        componentType: "header",
        logo: "/assets/images/logos/logo.png",
        phone: "+91 94440 26307",
        phoneIcon: "/assets/images/icons/phone-icon.png",
        email: "info@3imedtech.com",
        navigationLinks: JSON.stringify([
          { label: "Home", link: "/", order: 1, external: false },
          { label: "About", link: "/about", order: 2, external: false },
          { label: "Products", link: "/products", order: 3, external: false },
          { label: "Why Choose Us", link: "/why-choose-us", order: 4, external: false },
          { label: "Contact", link: "/contact", order: 5, external: false }
        ]),
        isActive: true
      }
    });

    // Footer
    await HeaderFooter.findOrCreate({
      where: { componentType: "footer" },
      defaults: {
        componentType: "footer",
        logo: "/assets/images/logos/logo-footer.png",
        tagline: "IMAGING • INFORMATION • INSIGHTS",
        companyText: "a refex group company",
        registeredOffice: "Second Floor, Refex Towers, Sterling Road Signal, 313, Valluvar Kottam High Road, Nungambakkam, Chennai – 600034, Tamil Nadu",
        corporateOffice: "Refex Building, 67, Bazullah Road, Parthasarathy Puram, T Nagar, Chennai – 600017",
        phone: "+91 94440 26307",
        email: "info@3imedtech.com",
        socialLinks: JSON.stringify([
          { platform: "LinkedIn", url: "https://www.linkedin.com/company/refex-group/", icon: "fa-linkedin", order: 1 },
          { platform: "Facebook", url: "https://www.facebook.com/refexindustrieslimited/", icon: "fa-facebook", order: 2 },
          { platform: "Twitter", url: "https://x.com/GroupRefex", icon: "fa-twitter", order: 3 },
          { platform: "YouTube", url: "https://www.youtube.com/@refexgroup", icon: "fa-youtube", order: 4 },
          { platform: "Instagram", url: "https://www.instagram.com/refexgroup/", icon: "fa-instagram", order: 5 }
        ]),
        copyright: "Copyright © 2024 3i Medical Technologies",
        navigationColumns: JSON.stringify([
          {
            title: "About 3i MedTech",
            links: [
              { label: "About", link: "/about", order: 1, external: false },
              { label: "Mission & Vision", link: "/mission-vision-and-values", order: 2, external: false },
              { label: "Why Choose Us", link: "/why-choose-us", order: 3, external: false }
            ],
            order: 1
          },
          {
            title: "Know More",
            links: [
              { label: "Radiography Systems", link: "/radiography-systems", order: 1, external: false },
              { label: "Portable X-Ray Solutions", link: "/portable-x-ray-solutions", order: 2, external: false },
              { label: "Mammography Systems", link: "/mammography-systems", order: 3, external: false },
              { label: "Flat Panel Detectors", link: "/flat-panel-detectors", order: 4, external: false },
              { label: "Imaging Accessories", link: "/imaging-accessories", order: 5, external: false },
              { label: "Refurbished MRI Systems", link: "/refurbished-mri-systems", order: 6, external: false },
              { label: "Anamaya", link: "https://anamaya.3imedtech.com/", order: 7, external: true }
            ],
            order: 2
          }
        ]),
        isActive: true
      }
    });
    console.log("✅ Header & Footer seeded\n");

    // ============================================
    // 3. HOME PAGE
    // ============================================
    console.log("📝 Seeding Home Page...");
    
    // Home Hero
    await HomeHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Affordable Diagnostic Imaging Solutions",
        backgroundImage: "",
        badgeImage: "",
        badgeLink: "https://anamaya.3imedtech.com/",
        badgeAltText: "New Product",
        gradientOverlay: JSON.stringify({ from: "#0066A1", to: "#7AB730" }),
        height: JSON.stringify({ mobile: 600, desktop: 700 }),
        isActive: true
      }
    });

    // Home About Section
    await HomeAboutSection.findOrCreate({
      where: { id: 1 },
      defaults: {
        label: "About Us",
        title: "Your Partner for Clinically Relevant and Viable Imaging Technologies",
        description: "3i Med Tech is an esteemed player in the medical devices industry, specializing in diagnostic imaging solutions. We are committed to providing high-quality, affordable medical imaging equipment that empowers healthcare professionals to deliver better patient care.",
        backgroundColor: "#1E4C84",
        isActive: true
      }
    });

    // Home Image Boxes
    const imageBoxes = [
      {
        label: "Radiography Systems",
        title: "Advanced Radiography Solutions",
        description: "State-of-the-art radiography systems for superior diagnostic imaging",
        image: "",
        link: "/radiography-systems",
        linkText: "Discover Now",
        order: 1,
        isActive: true
      },
      {
        label: "Portable X-Ray",
        title: "Portable X-Ray Solutions",
        description: "Mobile and flexible X-ray systems for point-of-care imaging",
        image: "",
        link: "/portable-x-ray-solutions",
        linkText: "Discover Now",
        order: 2,
        isActive: true
      },
      {
        label: "Mammography",
        title: "Mammography Systems",
        description: "Advanced mammography solutions for breast cancer screening",
        image: "",
        link: "/mammography-systems",
        linkText: "Discover Now",
        order: 3,
        isActive: true
      }
    ];
    
    for (const box of imageBoxes) {
      await HomeImageBox.findOrCreate({
        where: { label: box.label, title: box.title },
        defaults: box
      });
    }

    // Home Commitment
    await HomeCommitment.findOrCreate({
      where: { id: 1 },
      defaults: {
        label: "Our Commitment",
        title: "Excellence in Medical Imaging",
        backgroundColor: "#F5F5F5",
        cards: JSON.stringify([
          {
            title: "Quality",
            icon: "ri-award-line",
            description: "Premium quality medical imaging equipment",
            link: "/about",
            linkText: "Learn More",
            order: 1,
            isActive: true
          },
          {
            title: "Innovation",
            icon: "ri-lightbulb-line",
            description: "Cutting-edge technology solutions",
            link: "/products",
            linkText: "Explore",
            order: 2,
            isActive: true
          },
          {
            title: "Support",
            icon: "ri-customer-service-line",
            description: "Comprehensive customer support",
            link: "/contact",
            linkText: "Contact Us",
            order: 3,
            isActive: true
          }
        ]),
        footerText: "Learn more about our commitment",
        footerLink: "/about",
        footerLinkText: "About Us",
        isActive: true
      }
    });
    console.log("✅ Home Page seeded\n");

    // ============================================
    // 4. ABOUT PAGE
    // ============================================
    console.log("📝 Seeding About Page...");
    
    await AboutHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "About 3i Medical Technologies",
        description: "3i Med Tech is an esteemed player in the medical devices industry, specializing in diagnostic imaging solutions.",
        backgroundImage: "",
        isActive: true
      }
    });

    await AboutRedefiningHealthcare.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Redefining Healthcare",
        description: "We are committed to transforming healthcare through innovative imaging technologies.",
        buttonText: "Learn More",
        buttonLink: "/mission-vision-and-values",
        buttonIcon: "ri-arrow-right-line",
        isActive: true
      }
    });

    await AboutRefexGroup.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Explore Refex Group",
        descriptionParagraph1: "3i Medical Technologies is part of the Refex Group, a diversified business conglomerate.",
        descriptionParagraph2: "Our commitment to excellence and innovation drives us to deliver the best in medical imaging solutions.",
        buttonText: "Visit Refex Group",
        buttonLink: "https://www.refex.co.in",
        isActive: true
      }
    });
    console.log("✅ About Page seeded\n");

    // ============================================
    // 5. MISSION & VISION PAGE
    // ============================================
    console.log("📝 Seeding Mission & Vision Page...");
    
    await MissionVisionHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Mission & Vision",
        description: "Our mission and vision guide everything we do at 3i Medical Technologies.",
        backgroundImage: "",
        isActive: true
      }
    });

    await MissionVisionContent.findOrCreate({
      where: { sectionType: "mission" },
      defaults: {
        sectionType: "mission",
        icon: "ri-target-line",
        title: "Our Mission",
        description: "To provide affordable, high-quality diagnostic imaging solutions that improve healthcare outcomes and make advanced medical imaging accessible to all.",
        isActive: true
      }
    });

    await MissionVisionContent.findOrCreate({
      where: { sectionType: "vision" },
      defaults: {
        sectionType: "vision",
        icon: "ri-eye-line",
        title: "Our Vision",
        description: "To be a leading provider of innovative medical imaging technologies, recognized for excellence, reliability, and commitment to improving global healthcare.",
        isActive: true
      }
    });
    console.log("✅ Mission & Vision Page seeded\n");

    // ============================================
    // 6. WHY CHOOSE US PAGE
    // ============================================
    console.log("📝 Seeding Why Choose Us Page...");
    
    await WhyChooseUsHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Why Choose Us",
        description: "Discover what makes 3i Medical Technologies your trusted partner in medical imaging.",
        backgroundImage: "",
        buttonText: "Get in Touch",
        buttonLink: "/contact",
        isActive: true
      }
    });

    await WhyChooseUsOfferings.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Our Offerings",
        image: "",
        listItems: JSON.stringify([
          "Comprehensive product range",
          "Expert technical support",
          "Competitive pricing",
          "Reliable after-sales service"
        ]),
        isActive: true
      }
    });

    await WhyChooseUsAdvantages.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Our Advantages",
        subtitle: "What Sets Us Apart",
        cards: JSON.stringify([
          {
            title: "Quality Assurance",
            description: "Rigorous quality control processes",
            icon: "ri-checkbox-circle-line",
            order: 1,
            isActive: true
          },
          {
            title: "Expert Team",
            description: "Experienced professionals",
            icon: "ri-team-line",
            order: 2,
            isActive: true
          },
          {
            title: "Customer Focus",
            description: "Dedicated to your success",
            icon: "ri-heart-line",
            order: 3,
            isActive: true
          }
        ]),
        isActive: true
      }
    });
    console.log("✅ Why Choose Us Page seeded\n");

    // ============================================
    // 7. CONTACT PAGE
    // ============================================
    console.log("📝 Seeding Contact Page...");
    
    await ContactHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Contact Us",
        isActive: true
      }
    });

    const contactInfoCards = [
      {
        cardType: "registered-office",
        icon: "ri-map-pin-line",
        title: "Registered Office",
        content: "Second Floor, Refex Towers, Sterling Road Signal, 313, Valluvar Kottam High Road, Nungambakkam, Chennai – 600034, Tamil Nadu",
        link: "https://maps.google.com",
        order: 1,
        isActive: true
      },
      {
        cardType: "corporate-office",
        icon: "ri-building-line",
        title: "Corporate Office",
        content: "Refex Building, 67, Bazullah Road, Parthasarathy Puram, T Nagar, Chennai – 600017",
        link: "https://maps.google.com",
        order: 2,
        isActive: true
      },
      {
        cardType: "phone",
        icon: "ri-phone-line",
        title: "Phone",
        content: "+91 94440 26307",
        link: "tel:+919444026307",
        order: 3,
        isActive: true
      },
      {
        cardType: "email",
        icon: "ri-mail-line",
        title: "Email",
        content: "info@3imedtech.com",
        link: "mailto:info@3imedtech.com",
        order: 4,
        isActive: true
      }
    ];

    for (const card of contactInfoCards) {
      await ContactInfoCard.findOrCreate({
        where: { cardType: card.cardType },
        defaults: card
      });
    }

    await ContactMap.findOrCreate({
      where: { id: 1 },
      defaults: {
        mapUrl: "https://www.google.com/maps/embed?pb=...",
        isActive: true
      }
    });

    await ContactForm.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Get in Touch",
        description: "Fill out the form below and we'll get back to you as soon as possible.",
        isActive: true
      }
    });
    console.log("✅ Contact Page seeded\n");

    // ============================================
    // 8. PRODUCT PAGES - RADIOGRAPHY SYSTEMS
    // ============================================
    console.log("📝 Seeding Radiography Systems...");
    
    await RadiographyHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Radiography Systems",
        isActive: true
      }
    });

    // Radiography Products
    const radiographyProducts = [
      {
        title: "DReam CMT-Dual (Ceiling Type, Dual Detector)",
        overview: "The DReam CMT-Dual system is designed to enhance patient throughput and optimize performance. Its dual detector system allows for rapid, high-quality image acquisition, coupled with ergonomic design for easy operation.",
        features: JSON.stringify([
          "Synchronized detector stand and tube movement (optional)",
          "Automatic positioning for versatile applications",
          "Elevating horizontal table",
          "Bucky tilt for upper extremity studies"
        ]),
        benefits: "This system translates into higher performance, reduces non-essential work steps, and is ideal for high-demand environments.",
        image: "",
        sectionId: "dream-cmt-dual",
        imagePosition: "left",
        backgroundColor: "from-gray-50 to-white",
        order: 1,
        isActive: true
      },
      {
        title: "DReam CMT-Single (Ceiling Type, Single Detector)",
        overview: "The DReam CMT-Single system is designed for smaller rooms and moderate patient throughput, offering flexibility and extended freedom of movement for challenging clinical examinations.",
        features: JSON.stringify([
          "Tube mounted auto tracking and positioning",
          "High spatial resolution for best image quality",
          "Auto exposure and pre-set programs for faster throughput",
          "Optimized image processing software"
        ]),
        benefits: "Ideal for stand-alone diagnostic centers, emergency care, and specialty hospitals where space is limited but high-quality imaging is required.",
        image: "",
        sectionId: "dream-cmt-single",
        imagePosition: "right",
        backgroundColor: "from-gray-50 to-white",
        order: 2,
        isActive: true
      },
      {
        title: "DReam Floor Mounted DR",
        overview: "The DReam Floor Mounted DR system provides a cost-effective and high-performance radiography solution with advanced features and easy operability.",
        features: JSON.stringify([
          "Digital display for kV/mA/mAs selection",
          "APR-based control for all body parts",
          "Microprocessor control tube for overload protection",
          "Automatic voltage compensation"
        ]),
        benefits: "This system ensures high reliability and accuracy, making it suitable for various radiological needs.",
        image: "",
        sectionId: "dream-floor-mounted-dr",
        imagePosition: "left",
        backgroundColor: "from-gray-50 to-white",
        order: 3,
        isActive: true
      },
      {
        title: "ADONIS 100HF/150HF Mobile X-Ray",
        overview: "The ADONIS Mobile X-Ray system is compact and lightweight, designed for easy mobility in all directions with effective braking, making it ideal for bedside X-Ray needs.",
        features: JSON.stringify([
          "Actuator-based motorized vertical movement",
          "Soft-touch keypad with auto-programmable features",
          "Detachable exposure release switch",
          "Horizontal table/semi-motorized table/vertical bucky (optional)"
        ]),
        benefits: "Offers portability and flexibility for on-the-go radiography, particularly in hospital wards or remote locations.",
        image: "",
        sectionId: "adonis-100hf-150hf-mobile-xray",
        imagePosition: "right",
        backgroundColor: "from-gray-50 to-white",
        order: 4,
        isActive: true
      }
    ];

    for (const product of radiographyProducts) {
      await RadiographyProduct.findOrCreate({
        where: { title: product.title },
        defaults: product
      });
    }
    console.log("✅ Radiography Systems seeded\n");

    // ============================================
    // 9. FLAT PANEL DETECTORS
    // ============================================
    console.log("📝 Seeding Flat Panel Detectors...");
    
    await FlatPanelHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Flat Panel Detectors",
        isActive: true
      }
    });

    console.log("✅ Flat Panel Detectors seeded\n");

    // ============================================
    // 10. MAMMOGRAPHY SYSTEMS
    // ============================================
    console.log("📝 Seeding Mammography Systems...");
    
    await MammographyHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Mammography Systems",
        isActive: true
      }
    });

    console.log("✅ Mammography Systems seeded\n");

    // ============================================
    // 11. REFURBISHED MRI SYSTEMS
    // ============================================
    console.log("📝 Seeding Refurbished MRI Systems...");
    
    await RefurbishedMRIHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Refurbished MRI Systems",
        isActive: true
      }
    });

    console.log("✅ Refurbished MRI Systems seeded\n");

    // ============================================
    // 12. IMAGING ACCESSORIES
    // ============================================
    console.log("📝 Seeding Imaging Accessories...");
    
    await ImagingAccessoriesHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Imaging Accessories",
        subtitle: "Essential Accessories for Medical Imaging",
        description: "Complete range of imaging accessories to complement your medical imaging equipment",
        backgroundImage: "",
        isActive: true
      }
    });

    await ImagingAccessoriesProduct.findOrCreate({
      where: { title: "Sample Imaging Accessory" },
      defaults: {
        title: "Sample Imaging Accessory",
        overview: "Essential imaging accessory",
        features: JSON.stringify(["Compatible", "Durable", "Affordable"]),
        benefits: "Enhanced imaging capabilities",
        image: "",
        sectionId: "sample-accessory",
        order: 1,
        isActive: true
      }
    });
    console.log("✅ Imaging Accessories seeded\n");

    // ============================================
    // 13. FPD C-ARM
    // ============================================
    console.log("📝 Seeding FPD C-ARM...");
    
    await FPDCArmHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "FPD C-ARM",
        subtitle: "Advanced C-Arm Imaging Solutions",
        description: "High-quality FPD C-Arm systems for superior medical imaging",
        backgroundImage: "",
        isActive: true
      }
    });

    await FPDCArmContent.findOrCreate({
      where: { id: 1 },
      defaults: {
        overview: "FPD C-ARM systems provide exceptional image quality and performance for various medical imaging applications.",
        features: JSON.stringify([
          "CsI Flat Panel Detector",
          "Large Field of View",
          "ADONIS TIALIC low-dose technology"
        ]),
        benefits: JSON.stringify([
          "Clear, detailed images",
          "Reduced radiation exposure",
          "Faster, smoother workflow"
        ]),
        productImage: "",
        isActive: true
      }
    });
    console.log("✅ FPD C-ARM seeded\n");

    // ============================================
    // 14. PORTABLE X-RAY
    // ============================================
    console.log("📝 Seeding Portable X-Ray...");
    
    await PortableXRayHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Portable X-Ray Systems",
        subtitle: "Mobile Imaging Solutions",
        description: "Portable X-Ray systems for point-of-care imaging",
        backgroundImage: "",
        isActive: true
      }
    });

    await PortableXRayOverview.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Portable X-Ray Overview",
        description: "Our portable X-Ray systems offer flexibility and convenience for various medical imaging needs.",
        isActive: true
      }
    });

    const portableXRayFeatures = [
      { title: "Portability", description: "Lightweight and easy to transport", icon: "ri-luggage-cart-line", order: 1, isActive: true },
      { title: "High Quality", description: "Superior image quality", icon: "ri-image-line", order: 2, isActive: true },
      { title: "Easy to Use", description: "User-friendly interface", icon: "ri-user-friendly-line", order: 3, isActive: true }
    ];

    for (const feature of portableXRayFeatures) {
      await PortableXRayFeature.findOrCreate({
        where: { title: feature.title },
        defaults: feature
      });
    }

    const portableXRaySpecs = [
      { name: "Power", value: "High power output", order: 1, isActive: true },
      { name: "Weight", value: "Lightweight design", order: 2, isActive: true },
      { name: "Battery", value: "Long battery life", order: 3, isActive: true }
    ];

    for (const spec of portableXRaySpecs) {
      await PortableXRaySpecification.findOrCreate({
        where: { name: spec.name },
        defaults: spec
      });
    }

    await PortableXRayProduct.findOrCreate({
      where: { title: "Sample Portable X-Ray Product" },
      defaults: {
        title: "Sample Portable X-Ray Product",
        overview: "Advanced portable X-Ray system",
        features: JSON.stringify(["Portable", "High quality", "Easy to use"]),
        benefits: "Convenient point-of-care imaging",
        image: "",
        sectionId: "sample-portable",
        imagePosition: "left",
        backgroundColor: "from-gray-50 to-white",
        order: 1,
        isActive: true
      }
    });
    console.log("✅ Portable X-Ray seeded\n");

    // ============================================
    // 15. SEARCH RESULTS
    // ============================================
    console.log("📝 Seeding Search Results...");
    
    const searchResults = [
      {
        title: "Sample Search Result 1",
        date: "2024-01-15",
        url: "/products/sample-1",
        pageNumber: 1,
        displayOrder: 1,
        isActive: true
      },
      {
        title: "Sample Search Result 2",
        date: "2024-01-20",
        url: "/products/sample-2",
        pageNumber: 1,
        displayOrder: 2,
        isActive: true
      }
    ];

    for (const result of searchResults) {
      await SearchResult.findOrCreate({
        where: { title: result.title, url: result.url },
        defaults: result
      });
    }
    console.log("✅ Search Results seeded\n");

    console.log("=".repeat(50));
    console.log("✅ ALL DATA SEEDED SUCCESSFULLY!");
    console.log("=".repeat(50));

    await sequelize.close();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    try {
      await sequelize.close();
    } catch (_) {}
    process.exit(1);
  }
}

seedAllData();


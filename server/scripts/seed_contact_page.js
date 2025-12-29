require("dotenv").config();
const { sequelize } = require("../models");
const { ContactHero, ContactInfoCard, ContactMap, ContactForm } = require("../models");

async function seedContactPage() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    console.log("📝 Seeding Contact Page...");

    // Contact Hero
    await ContactHero.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Contact Us",
        isActive: true
      }
    });

    // Contact Info Cards
    const infoCards = [
      {
        cardType: "registered-office",
        icon: "fas fa-map-marked-alt",
        title: "Registered Office",
        content: "Second Floor, Refex Towers, Sterling Road Signal, 313, Valluvar Kottam High Road, Nungambakkam, Chennai – 600034, Tamil Nadu",
        link: "https://maps.app.goo.gl/MheuF5TBoDraFrgD8",
        order: 1,
        isActive: true
      },
      {
        cardType: "corporate-office",
        icon: "fas fa-map-marked-alt",
        title: "Corporate Office",
        content: "Refex Building, 67, Bazullah Road, Parthasarathy Puram, T Nagar, Chennai – 600017",
        link: "https://maps.app.goo.gl/Kifm5u8hDDXqoT898",
        order: 2,
        isActive: true
      },
      {
        cardType: "phone",
        icon: "fas fa-phone-volume",
        title: "Phone",
        content: "+91 94440 26307",
        link: "tel:+919444026307",
        order: 3,
        isActive: true
      },
      {
        cardType: "email",
        icon: "fas fa-envelope-open-text",
        title: "Email",
        content: "info@3imedtech.com",
        link: "mailto:info@3imedtech.com",
        order: 4,
        isActive: true
      }
    ];

    for (const card of infoCards) {
      await ContactInfoCard.findOrCreate({
        where: { cardType: card.cardType },
        defaults: card
      });
    }

    // Contact Map
    await ContactMap.findOrCreate({
      where: { id: 1 },
      defaults: {
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2748.1873197906534!2d80.24098097527796!3d13.06595648541996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267b450aa54e9%3A0xf906e87011428643!2sRefex%20Towers!5e0!3m2!1sen!2sin!4v1733296964599!5m2!1sen!2sin",
        isActive: true
      }
    });

    // Contact Form
    await ContactForm.findOrCreate({
      where: { id: 1 },
      defaults: {
        title: "Get in Touch",
        description: "Fill out the form below and we'll get back to you as soon as possible.",
        isActive: true
      }
    });

    console.log("✅ Contact Page seeded\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding contact page:", error);
    process.exit(1);
  }
}

seedContactPage();


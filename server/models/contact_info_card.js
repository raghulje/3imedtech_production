"use strict";
module.exports = (sequelize, DataTypes) => {
  const ContactInfoCard = sequelize.define(
    "ContactInfoCard",
    {
      cardType: { type: DataTypes.STRING, allowNull: false }, // 'registered-office', 'corporate-office', 'phone', 'email'
      icon: { type: DataTypes.STRING, allowNull: true }, // Icon class (e.g., 'fas fa-map-marked-alt')
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true }, // Address or phone/email
      link: { type: DataTypes.STRING, allowNull: true }, // Google Maps link or tel: or mailto:
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "contact_info_card", underscored: true, paranoid: false }
  );
  return ContactInfoCard;
};


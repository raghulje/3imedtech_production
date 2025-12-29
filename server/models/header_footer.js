"use strict";
module.exports = (sequelize, DataTypes) => {
  const HeaderFooter = sequelize.define(
    "HeaderFooter",
    {
      componentType: { type: DataTypes.STRING, allowNull: false }, // 'header' or 'footer'
      logo: { type: DataTypes.STRING, allowNull: true },
      tagline: { type: DataTypes.STRING, allowNull: true }, // "IMAGING • INFORMATION • INSIGHTS"
      companyText: { type: DataTypes.STRING, allowNull: true }, // "a refex group company"
      phone: { type: DataTypes.STRING, allowNull: true },
      phoneIcon: { type: DataTypes.STRING, allowNull: true }, // Phone icon URL for header
      email: { type: DataTypes.STRING, allowNull: true },
      registeredOffice: { type: DataTypes.TEXT, allowNull: true },
      corporateOffice: { type: DataTypes.TEXT, allowNull: true },
      socialLinks: { type: DataTypes.TEXT, allowNull: true }, // JSON string for footer social links
      copyright: { type: DataTypes.STRING, allowNull: true },
      navigationLinks: { type: DataTypes.TEXT, allowNull: true }, // JSON string for header navigation menu
      navigationColumns: { type: DataTypes.TEXT, allowNull: true }, // JSON string for footer navigation columns
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "header_footer", underscored: true, paranoid: false }
  );
  return HeaderFooter;
};


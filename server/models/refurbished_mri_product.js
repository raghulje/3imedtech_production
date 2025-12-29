"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefurbishedMRIProduct = sequelize.define(
    "RefurbishedMRIProduct",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      overview: { type: DataTypes.TEXT, allowNull: true },
      features: { type: DataTypes.TEXT, allowNull: true }, // JSON string array
      benefits: { type: DataTypes.TEXT, allowNull: true },
      image: { type: DataTypes.STRING, allowNull: true },
      sectionId: { type: DataTypes.STRING, allowNull: true }, // For hash navigation (e.g., "gesignahdxt15tesla")
      imagePosition: { type: DataTypes.STRING, allowNull: true, defaultValue: 'left' }, // 'left' or 'right'
      backgroundColor: { type: DataTypes.STRING, allowNull: true, defaultValue: 'from-gray-50 to-white' }, // Tailwind gradient classes
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "refurbished_mri_products", underscored: true, paranoid: false }
  );

  return RefurbishedMRIProduct;
};


"use strict";

module.exports = (sequelize, DataTypes) => {
  const ImagingAccessoriesHero = sequelize.define(
    "ImagingAccessoriesHero",
    {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "Imaging Accessories" },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "imaging_accessories_hero", underscored: true, paranoid: false }
  );

  return ImagingAccessoriesHero;
};


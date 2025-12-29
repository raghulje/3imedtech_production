"use strict";
module.exports = (sequelize, DataTypes) => {
  const RadiographyHero = sequelize.define(
    "RadiographyHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "radiography_hero", underscored: true, paranoid: false }
  );
  return RadiographyHero;
};


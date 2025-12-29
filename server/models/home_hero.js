"use strict";
module.exports = (sequelize, DataTypes) => {
  const HomeHero = sequelize.define(
    "HomeHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      backgroundImage: { type: DataTypes.STRING, allowNull: true },
      badgeImage: { type: DataTypes.STRING, allowNull: true },
      badgeLink: { type: DataTypes.STRING, allowNull: true },
      badgeAltText: { type: DataTypes.STRING, allowNull: true },
      gradientOverlay: { type: DataTypes.TEXT, allowNull: true }, // JSON string
      height: { type: DataTypes.TEXT, allowNull: true }, // JSON string: {mobile: 600, desktop: 700}
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: "home_hero", underscored: true }
  );
  return HomeHero;
};


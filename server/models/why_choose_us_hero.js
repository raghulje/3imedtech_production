"use strict";
module.exports = (sequelize, DataTypes) => {
  const WhyChooseUsHero = sequelize.define(
    "WhyChooseUsHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.STRING, allowNull: true },
      buttonText: { type: DataTypes.STRING, allowNull: true },
      buttonLink: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "why_choose_us_hero", underscored: true, paranoid: false }
  );
  return WhyChooseUsHero;
};


"use strict";
module.exports = (sequelize, DataTypes) => {
  const WhyChooseUsAdvantages = sequelize.define(
    "WhyChooseUsAdvantages",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      cards: { type: DataTypes.TEXT, allowNull: true }, // JSON string for advantage cards
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "why_choose_us_advantages", underscored: true, paranoid: false }
  );
  return WhyChooseUsAdvantages;
};


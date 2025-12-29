"use strict";
module.exports = (sequelize, DataTypes) => {
  const WhyChooseUsOfferings = sequelize.define(
    "WhyChooseUsOfferings",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: true },
      listItems: { type: DataTypes.TEXT, allowNull: true }, // JSON string for list items
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "why_choose_us_offerings", underscored: true, paranoid: false }
  );
  return WhyChooseUsOfferings;
};


"use strict";
module.exports = (sequelize, DataTypes) => {
  const HomeAboutSection = sequelize.define(
    "HomeAboutSection",
    {
      label: { type: DataTypes.STRING, allowNull: true },
      title: { type: DataTypes.TEXT, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundColor: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: "home_about_section", underscored: true }
  );
  return HomeAboutSection;
};


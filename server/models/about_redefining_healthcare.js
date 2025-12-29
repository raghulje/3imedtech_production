"use strict";
module.exports = (sequelize, DataTypes) => {
  const AboutRedefiningHealthcare = sequelize.define(
    "AboutRedefiningHealthcare",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      buttonText: { type: DataTypes.STRING, allowNull: true },
      buttonLink: { type: DataTypes.STRING, allowNull: true },
      buttonIcon: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "about_redefining_healthcare", underscored: true, paranoid: false }
  );
  return AboutRedefiningHealthcare;
};


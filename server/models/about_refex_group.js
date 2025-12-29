"use strict";
module.exports = (sequelize, DataTypes) => {
  const AboutRefexGroup = sequelize.define(
    "AboutRefexGroup",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      descriptionParagraph1: { type: DataTypes.TEXT, allowNull: true },
      descriptionParagraph2: { type: DataTypes.TEXT, allowNull: true },
      buttonText: { type: DataTypes.STRING, allowNull: true },
      buttonLink: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "about_refex_group", underscored: true, paranoid: false }
  );
  return AboutRefexGroup;
};


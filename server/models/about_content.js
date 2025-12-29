"use strict";
module.exports = (sequelize, DataTypes) => {
  const AboutContent = sequelize.define(
    "AboutContent",
    {
      sectionType: { type: DataTypes.STRING, allowNull: false }, // 'redefining' or 'refex-group'
      title: { type: DataTypes.TEXT, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      buttonText: { type: DataTypes.STRING, allowNull: true },
      buttonLink: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "about_content", underscored: true, paranoid: false }
  );
  return AboutContent;
};


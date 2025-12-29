"use strict";
module.exports = (sequelize, DataTypes) => {
  const HomeCommitment = sequelize.define(
    "HomeCommitment",
    {
      label: { type: DataTypes.STRING, allowNull: true },
      title: { type: DataTypes.TEXT, allowNull: false },
      backgroundColor: { type: DataTypes.STRING, allowNull: true },
      cards: { type: DataTypes.TEXT, allowNull: true }, // JSON string: [{title, icon, description, link, linkText, order, isActive}]
      footerText: { type: DataTypes.TEXT, allowNull: true },
      footerLink: { type: DataTypes.STRING, allowNull: true },
      footerLinkText: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: "home_commitment", underscored: true }
  );
  return HomeCommitment;
};


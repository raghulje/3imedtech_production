"use strict";
module.exports = (sequelize, DataTypes) => {
  const ContactHero = sequelize.define(
    "ContactHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "contact_hero", underscored: true, paranoid: false }
  );
  return ContactHero;
};


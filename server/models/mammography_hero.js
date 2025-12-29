"use strict";
module.exports = (sequelize, DataTypes) => {
  const MammographyHero = sequelize.define(
    "MammographyHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "mammography_hero", underscored: true, paranoid: false }
  );
  return MammographyHero;
};


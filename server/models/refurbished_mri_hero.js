"use strict";
module.exports = (sequelize, DataTypes) => {
  const RefurbishedMRIHero = sequelize.define(
    "RefurbishedMRIHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "refurbished_mri_hero", underscored: true, paranoid: false }
  );
  return RefurbishedMRIHero;
};


"use strict";
module.exports = (sequelize, DataTypes) => {
  const FPDCArmHero = sequelize.define(
    "FPDCArmHero",
    {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "FPD C-ARM" },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "fpd_carm_hero", underscored: true, paranoid: false }
  );
  return FPDCArmHero;
};


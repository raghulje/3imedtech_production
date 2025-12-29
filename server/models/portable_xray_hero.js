"use strict";
module.exports = (sequelize, DataTypes) => {
  const PortableXRayHero = sequelize.define(
    "PortableXRayHero",
    {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "Portable X-Ray Systems" },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "portable_xray_hero", underscored: true, paranoid: false }
  );
  return PortableXRayHero;
};


"use strict";
module.exports = (sequelize, DataTypes) => {
  const PortableXRayOverview = sequelize.define(
    "PortableXRayOverview",
    {
      title: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "portable_xray_overview", underscored: true, paranoid: false }
  );
  return PortableXRayOverview;
};


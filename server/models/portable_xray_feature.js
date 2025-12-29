"use strict";
module.exports = (sequelize, DataTypes) => {
  const PortableXRayFeature = sequelize.define(
    "PortableXRayFeature",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      icon: { type: DataTypes.STRING, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "portable_xray_features", underscored: true, paranoid: false }
  );
  return PortableXRayFeature;
};


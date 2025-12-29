"use strict";
module.exports = (sequelize, DataTypes) => {
  const PortableXRaySpecification = sequelize.define(
    "PortableXRaySpecification",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "portable_xray_specifications", underscored: true, paranoid: false }
  );
  return PortableXRaySpecification;
};


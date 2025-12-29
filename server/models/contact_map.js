"use strict";
module.exports = (sequelize, DataTypes) => {
  const ContactMap = sequelize.define(
    "ContactMap",
    {
      mapUrl: { type: DataTypes.TEXT, allowNull: true }, // Google Maps embed URL
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "contact_map", underscored: true, paranoid: false }
  );
  return ContactMap;
};


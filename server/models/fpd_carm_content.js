"use strict";
module.exports = (sequelize, DataTypes) => {
  const FPDCArmContent = sequelize.define(
    "FPDCArmContent",
    {
      overview: { type: DataTypes.TEXT, allowNull: true },
      features: { type: DataTypes.TEXT, allowNull: true }, // JSON string or newline-separated
      benefits: { type: DataTypes.TEXT, allowNull: true }, // JSON string or newline-separated
      productImage: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "fpd_carm_content", underscored: true, paranoid: false }
  );
  return FPDCArmContent;
};


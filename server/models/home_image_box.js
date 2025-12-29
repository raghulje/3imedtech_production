"use strict";
module.exports = (sequelize, DataTypes) => {
  const HomeImageBox = sequelize.define(
    "HomeImageBox",
    {
      label: { type: DataTypes.STRING, allowNull: true },
      title: { type: DataTypes.TEXT, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      image: { type: DataTypes.STRING, allowNull: true },
      link: { type: DataTypes.STRING, allowNull: true },
      linkText: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Discover Now' },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: "home_image_boxes", underscored: true }
  );
  return HomeImageBox;
};


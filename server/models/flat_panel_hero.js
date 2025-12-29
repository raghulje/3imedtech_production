"use strict";
module.exports = (sequelize, DataTypes) => {
  const FlatPanelHero = sequelize.define(
    "FlatPanelHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "flat_panel_hero", underscored: true, paranoid: false }
  );
  return FlatPanelHero;
};


"use strict";
module.exports = (sequelize, DataTypes) => {
  const MissionVisionHero = sequelize.define(
    "MissionVisionHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "mission_vision_hero", underscored: true, paranoid: false }
  );
  return MissionVisionHero;
};


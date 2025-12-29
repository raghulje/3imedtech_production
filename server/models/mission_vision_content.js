"use strict";
module.exports = (sequelize, DataTypes) => {
  const MissionVisionContent = sequelize.define(
    "MissionVisionContent",
    {
      sectionType: { type: DataTypes.STRING, allowNull: false }, // 'mission' or 'vision'
      icon: { type: DataTypes.STRING, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "mission_vision_content", underscored: true, paranoid: false }
  );
  return MissionVisionContent;
};


"use strict";
module.exports = (sequelize, DataTypes) => {
  const VersionControl = sequelize.define(
    "VersionControl",
    {
      sectionType: { 
        type: DataTypes.STRING, 
        allowNull: false,
        comment: "Type of section: home-hero, home-about-section, home-image-box, home-commitment"
      },
      sectionId: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        comment: "ID of the specific item (null for single-instance sections like hero)"
      },
      versionNumber: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 1 
      },
      data: { 
        type: DataTypes.TEXT, 
        allowNull: false,
        comment: "JSON string of the section data at this version"
      },
      userId: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        comment: "User who created this version"
      },
      changeDescription: { 
        type: DataTypes.TEXT, 
        allowNull: true,
        comment: "Optional description of what changed"
      },
      isActive: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: true 
      },
    },
    { 
      tableName: "version_control", 
      underscored: true,
      indexes: [
        { fields: ['section_type', 'section_id'] },
        { fields: ['section_type', 'section_id', 'version_number'] }
      ]
    }
  );
  return VersionControl;
};


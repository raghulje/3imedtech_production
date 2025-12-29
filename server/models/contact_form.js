"use strict";
module.exports = (sequelize, DataTypes) => {
  const ContactForm = sequelize.define(
    "ContactForm",
    {
      title: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "contact_form", underscored: true, paranoid: false }
  );
  return ContactForm;
};


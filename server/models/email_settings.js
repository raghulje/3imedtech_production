"use strict";
module.exports = (sequelize, DataTypes) => {
  const EmailSettings = sequelize.define(
    "EmailSettings",
    {
      smtpHost: { type: DataTypes.STRING, allowNull: true },
      smtpPort: { type: DataTypes.INTEGER, allowNull: true },
      smtpSecure: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // true for 465, false for other ports
      smtpUser: { type: DataTypes.STRING, allowNull: true },
      smtpPassword: { type: DataTypes.STRING, allowNull: true }, // Encrypted in production
      fromEmail: { type: DataTypes.STRING, allowNull: true },
      fromName: { type: DataTypes.STRING, allowNull: true },
      toEmail: { type: DataTypes.STRING, allowNull: true }, // Where contact form submissions go
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "email_settings", underscored: true, paranoid: false }
  );
  return EmailSettings;
};


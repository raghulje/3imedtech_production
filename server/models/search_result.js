"use strict";
module.exports = (sequelize, DataTypes) => {
  const SearchResult = sequelize.define(
    "SearchResult",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.STRING, allowNull: true },
      url: { type: DataTypes.STRING, allowNull: false },
      pageNumber: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // Which page (1, 2, 3, etc.)
      displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // Order within the page
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "search_results", underscored: true, paranoid: false }
  );
  return SearchResult;
};


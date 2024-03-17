'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Tag, { foreignKey: 'categoryId' });
      Category.belongsTo(models.Case, { foreignKey: 'caseId', as: 'case' });
    }
  }
  Category.init({
    name: DataTypes.STRING,
    threshold: DataTypes.FLOAT,
    description: DataTypes.STRING,
    caseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Category',
    paranoid: true,
  });
  return Category;
};
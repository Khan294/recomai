'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Case extends Model {
    static associate(models) {
      Case.hasMany(models.Category, { foreignKey: 'caseId' });
      Case.hasMany(models.Information, { foreignKey: 'caseId' });
    }
  }
  Case.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Case',
    paranoid: true,
  });
  return Case;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Information extends Model {
    static associate(models) {
      Information.hasMany(models.InformationTag, { foreignKey: 'informationId' });
      Information.belongsTo(models.Case, {foreignKey: 'caseId', as: 'case'});
      Information.belongsToMany(models.Tag, { through: models.InformationTag, foreignKey: 'informationId', otherKey: 'tagId', as: 'Tags' });
    }
  }
  Information.init({
    text: DataTypes.INTEGER,
    status: DataTypes.STRING,
    caseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Information',
    paranoid: true,
  });
  return Information;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InformationTag extends Model {
    static associate(models) {
      InformationTag.belongsTo(models.Information, {foreignKey: 'informationId', as: 'information'});
      InformationTag.belongsTo(models.Tag, {foreignKey: 'tagId', as: 'tag'});
    }
  }
  InformationTag.init({
    informationId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InformationTag',
    paranoid: true,
  });
  return InformationTag;
};

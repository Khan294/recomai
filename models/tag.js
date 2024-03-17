'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.hasMany(models.InformationTag, { foreignKey: 'tagId' });
      Tag.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      Tag.belongsToMany(models.Information, { through: models.InformationTag, foreignKey: 'tagId', otherKey: 'informationId', as: 'Tags' });
    }
  }
  Tag.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tag',
    paranoid: true,
  });
  return Tag;
};
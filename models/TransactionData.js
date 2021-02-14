const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class TransactionData extends Model {}

TransactionData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: 0,
      allowNull: false,
    },
    total_cost: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    total_units: {
      type: DataTypes.DECIMAL(20, 2),
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'TransactionData',
  }
);

module.exports = TransactionData;

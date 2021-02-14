const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class MasterSecurity extends Model {}

MasterSecurity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    as_of_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    current_unit_cost: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    original_unit_cost: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
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
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'MasterSecurity',
  }
);

module.exports = MasterSecurity;

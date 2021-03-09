const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class AccountData extends Model {
  calculate_cash_balance() {
    // Check to see if pending deposit has posted add to cash bal then clear pend deps
    if(this.date_pending_deposit != null){
      // Pending Deposit Found
      var hours = 
        (this.date_pending_deposit.getTime() - Date.now().getTime()) / 1000;
        hours /= (60 * 60);
        hours = Math.abs(Math.round(hours));

      if(hours >=48){
        // Pending Deposit has been there more than 48 hours and needs to be added to cash balance 
        this.cash_balance += this.amount_pending_deposit;
        this.amount_pending_deposit = null;
        this.date_pending_deposit = null;
      }
    }
    return this.cash_balance;
  }
}

AccountData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    cash_balance: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 10000,
    },
    amount_pending_deposit: {
      type: DataTypes.DECIMAL(20, 2),
    },
    date_pending_deposit: {
      type: DataTypes.DATE,
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
    modelName: 'AccountData',
  }
);

module.exports = AccountData;

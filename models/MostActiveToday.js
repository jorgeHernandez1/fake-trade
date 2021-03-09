const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const { iex, fincal } = require('../app/services/iex')

// Examples
class MostActiveToday extends Model {
}

MostActiveToday.refresh = async () => {
  // Drop Table and refill with newest Data
  MostActiveToday.destroy({ truncate: true });

  const mostActive = await iex.collection('list', 'mostactive');

  mostActive.forEach((stock) => {
    const { symbol, companyName, volume } = stock;
    MostActiveToday.create({ symbol, companyName, volume });
  });
}

MostActiveToday.init(
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
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volume: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'MostActiveToday',
  }
);

// Run every hour
setInterval(() => {
  // Create calendar to see if markets are open
  const calendar = fincal.calendar("new_york") = fincal["new_york"] = fincal.new_york;
  // Refresh every hour if markets are open 
  if(calendar.areMarketsOpenNow()) {
    this.refresh();
  }
}, 3600000)


module.exports = MostActiveToday;

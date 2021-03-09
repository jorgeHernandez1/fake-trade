const User = require('./User');
const AccountData = require('./AccountData');
const MasterSecurity = require('./MasterSecurity');
const TransactionData = require('./TransactionData');
const MostActiveToday = require('./MostActiveToday');

// User to Account Data Relationship
User.hasOne(AccountData, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

AccountData.belongsTo(User, {
  foreignKey: 'user_id'
})
// User to Transaction Data Relationship
User.hasMany(MasterSecurity, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

MasterSecurity.belongsTo(User, {
  foreignKey: 'user_id'
})

// User to Master Security Data Relationship
User.hasMany(TransactionData, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

TransactionData.belongsTo(User, {
  foreignKey: 'user_id'
})

module.exports = 
  { 
    User, 
    AccountData, 
    MasterSecurity, 
    TransactionData,
    MostActiveToday 
  };

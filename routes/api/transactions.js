const router = require('express').Router();
const { getToken, decode } = require('../../app/services/token');
const { withAuth } = require('../../app/middleware/auth');
const { iex } = require('../../app/services/iex');
const {
  AccountData,
  MasterSecurity,
  TransactionData,
  User,
} = require('../../models');
const { Op } = require('sequelize');

router.post('/add-stock', withAuth, async function (req, res) {
  try {
    var token = decode(getToken(req.headers));
    if (token) {
      const updateBalance = await AccountData.decrement('cash_balance', {
        by: req.body.calculated_total,
        where: {
          user_id: req.user.id,
        },
      });
      const addTransaction = await TransactionData.create({
        description: 'Stock Purchase',
        total_cost: req.body.calculated_total,
        total_units: req.body.quantity,
        user_id: req.user.id,
      });
      const addMastersecurity = await MasterSecurity.findOne({
        where: {
          [Op.and]: [
            {
              user_id: req.user.id,
            },
            {
              symbol: req.body.symbol,
            },
          ],
        },
      });
      if (addMastersecurity) {
        const updateCurrentSecurity = addMastersecurity.update(
          {
            asOfDate: req.body.asOfDate,
            quantity: req.body.quantity + quantity,
            current_unit_cost: (
              (req.body.stock_price + current_unit_cost) /
              2
            ).toFixed(2),
          },
          {
            where: {
              [Op.and]: [
                {
                  user_id: req.user.id,
                },
                {
                  symbol: req.body.symbol,
                },
              ],
            },
          }
        );
      } else {
        const addNewsecurity = await MasterSecurity.create({
          symbol: req.body.symbol,
          as_of_date: req.body.asOfDate,
          quantity: req.body.quantity,
          current_unit_cost: req.body.stock_price,
          original_unit_cost: req.body.stock_price,
          user_id: req.user.id,
        });
      }

      const userData = await User.findOne({
        where: {
          id: req.user.id,
        },
        include: [AccountData, MasterSecurity],
      });

      return res.json(userData);
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

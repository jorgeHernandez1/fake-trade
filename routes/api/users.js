const router = require('express').Router();
const passport = require('passport');
const { MostActiveToday } = require('../../models');
const { getToken, decode } = require('../../app/services/token');
const { withAuth } = require('../../app/middleware/auth');

router.get('/dashboard', withAuth, async function (req, res) {
  try {
    var token = decode(getToken(req.headers));
    if (token) {
      // Get Most Active
      const getActiveData = await MostActiveToday.findAll();
      // Decostruct and plainify data
      getActiveData.map(async (itm) => await itm.get({ plain: true }));
      // Add Data to User response as new field
      req.user.dataValues['mostActiveToday'] = getActiveData;

      return res.json(req.user);
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

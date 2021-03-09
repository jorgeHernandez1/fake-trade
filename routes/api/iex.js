const router = require('express').Router();
const passport = require('passport');
const { getToken, decode } = require('../../app/services/token');
const { withAuth } = require('../../app/middleware/auth');
const { iex } = require('../../app/services/iex');

router.get('/symbols', withAuth, async function (req, res) {
  try {
    var token = decode(getToken(req.headers));
    if (token) {
      const symbolSearch = await iex.iexSymbols();
      return res.json(symbolSearch);
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/price', withAuth, async function (req, res) {
  try {
    var token = decode(getToken(req.headers));
    if (token) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const userDate = new Date(req.body.asOfDate);
      userDate.setHours(0, 0, 0, 0);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const _resultDate = new Intl.DateTimeFormat(
        'ko-KR',
        options
      ).formatToParts(userDate);

      const formattedDate = `${_resultDate[0].value}${_resultDate[2].value}${_resultDate[4].value}`;

      let compInfo;
      try {
        compInfo = await iex.company(req.body.symbol);
      } catch (err) {
        return res.json(err);
      }

      if (userDate.getTime() === today.getTime()) {
        try {
          const iexRes = await iex.quote(req.body.symbol);
          iexRes['companyInfo'] = compInfo;
          return res.json(iexRes);
        } catch (err) {
          return res.json(err);
        }
      } else {
        try {
          const iexRes = await iex.history(req.body.symbol, {
            date: formattedDate,
            chartByDay: true,
            includeToday: true,
          });
          iexRes[0]['companyInfo'] = compInfo;
          return res.json(iexRes);
        } catch (err) {
          return res.json(err);
        }
      }
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

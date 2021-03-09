const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const { User } = require('../../models');

genToken = (user) => {
  return jwt.sign(
    {
      id: user.email,
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.JWT_SECRET
  );
};

router.post('/register', async function (req, res, next) {
  try {
    if (!req.body.email || !req.body.password) {
      res
        .status(400)
        .json({ success: false, msg: 'Please pass email and password.' });
    } else {
      const newUserData = {
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName,
      };
      // Create user in db
      User.create(newUserData)
        .then((user) => {
          let token = genToken(user.toJSON());

          res.json({ success: true, token: token });
        })
        .catch((e) => {
          return res
            .status(400)
            .json({ success: false, msg: 'email already exists.', e });
        });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    var token = genToken(userData.toJSON());
    res.json({ success: true, token: token });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

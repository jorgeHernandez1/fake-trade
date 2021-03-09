const { AccountData, TransactionData, MasterSecurity } = require('../models');
const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

module.exports = function (User) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET;
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        const userData = await User.findOne({
            where: { 
              id: jwt_payload.sub 
            },
            include: [
              AccountData,
              MasterSecurity
            ] 
          });

          if (!userData) {
            return done(null, false);
          } else {
            return done(null, userData);
          }
          
      } catch(err) {
        return done(err, false);
      }
    })
  );
};

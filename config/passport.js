const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwtSecret = 'your_jwt_secret'; // Replace with your secret
const Owner = require('../models/OwnerSchema'); // Your Owner model

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(new Strategy(opts, async (jwt_payload, done) => {
  try {
    const owner = await Owner.findById(jwt_payload.id);
    if (owner) {
      return done(null, owner);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;

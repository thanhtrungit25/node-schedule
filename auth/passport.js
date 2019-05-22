const config = require('config');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const User = require('../database/Schema').User;

passport.use(
  new Strategy(
    {
      clientID: config.get('appId'),
      clientSecret: config.get('appSecret'),
      callbackURL: config.get('callbackURL'),
      profileFields: ['id', 'displayName', 'link', 'email']
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      let query = { facebookID: profile.id };
      let update = {
        name: profile.displayName,
        email: profile.emails[0].value,
        accessToken: accessToken
      };
      let options = { upsert: true, new: true, setDefaultsOnInsert: true };
      User.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;
        return cb(null, profile);
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;

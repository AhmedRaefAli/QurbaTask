const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const keys = require('../configs/configs');

const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback', 
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      proxy: true                           
    },
    async (accessToken, refreshToken, profile, done) => { 
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) { 
          return done(null, existingUser);
        }
        const user = await new User({
          googleId: profile.id,
          name: profile.displayName,
          email:profile.emails[0].value,
          password:profile.displayName,
        }).save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

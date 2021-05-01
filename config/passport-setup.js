const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/user.model");

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, (err, user) => {
    cb(err, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/facebook/callback`,
      profileFields: [
        "id",
        "displayName",
        "name",
        "picture.type(large)",
        "email",
      ],
    },
    function (accessToken, refreshToken, profile, cb) {
      process.nextTick(function () {
        User.findOne({ uid: profile.id }, function (err, user) {
          if (err) return cb(err);

          if (user) {
            return cb(null, user);
          } else {
            var newUser = new User();

            newUser.name =
              profile.name.givenName + " " + profile.name.familyName;
            newUser.email = profile.emails[0].value;
            newUser.profilePic = profile.photos[0].value;

            newUser.save(function (err) {
              if (err) throw err;
              return cb(null, newUser);
            });
          }
        });
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleId: profile.id }, function (err, user) {
        if (err) return cb(err);

        if (user) {
          return cb(null, user);
        } else {
          var newUser = new User();

          newUser.name = profile.name.givenName + " " + profile.name.familyName;
          newUser.email = profile.emails[0].value;
          newUser.profilePic = profile.photos[0].value;

          newUser.save(function (err) {
            if (err) throw err;
            return cb(null, newUser);
          });
        }
      });
    }
  )
);
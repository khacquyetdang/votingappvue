const passport = require('passport');
const request = require('request');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const TwitterTokenStrategy = require('passport-twitter-token');

const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//const OAuthStrategy = require('passport-oauth').OAuthStrategy;
//const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const HttpStatus = require('http-status-codes');
const utils = require('../utils/index');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
* Sign in with Facebook Token.
*/
/**
* Sign in with Facebook Token.
*/
passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET
}, function (accessToken, refreshToken, profile, done) {
  console.log("FacebookTokenStrategy");
  console.log("profile", profile);
  User.findOne({ facebook: profile.id }, (err, existingUser) => {
    console.log("err", err);
    //console.log("existing user", existingUser);


    if (err) { return done(err); }
    if (existingUser) {

      var access_token = utils.createAccessToken(existingUser.email, existingUser._id);
      var id_token = utils.createIdToken({
        email: existingUser.email
      });
      var info = { access_token: access_token };
      var jwtToken = {
        id_token: id_token,
        access_token: access_token,
        enabled: true
      };

      existingUser.jwttokens.push(jwtToken);
      return existingUser.save((err) => {
        done(err, existingUser, info);
      });
    }
    User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
      if (err) { return done(err); }
      if (existingEmailUser) {
        //req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
        console.log("existingEmailUser ");

        var access_token = utils.createAccessToken(existingEmailUser.email, existingEmailUser._id);
        var id_token = utils.createIdToken({
          email: existingUser.email
        });
        var info = { access_token: access_token };
        var jwtToken = {
          id_token: id_token,
          access_token: access_token,
          enabled: true
        };

        existingEmailUser.facebook = profile.id;

        existingEmailUser.tokens.push({ kind: 'facebook', accessToken });
        existingEmailUser.jwttokens.push(jwtToken);
        existingEmailUser.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
        existingEmailUser.profile.gender = profile._json.gender;
        existingEmailUser.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        existingEmailUser.profile.location = (profile._json.location) ? profile._json.location.name : '';
        existingEmailUser.save((err) => {
          done(err, existingEmailUser, info);
        });

      } else {
        const user = new User();

        var access_token = utils.createAccessToken(profile._json.email, user._id);
        var id_token = utils.createIdToken({
          email: profile._json.email
        });
        var info = { access_token: access_token };
        var jwtToken = {
          id_token: id_token,
          access_token: access_token,
          enabled: true
        };


        user.email = profile._json.email;
        user.facebook = profile.id;
        user.tokens.push({ kind: 'facebook', accessToken });
        user.jwttokens.push(jwtToken);
        user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
        user.profile.gender = profile._json.gender;
        user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        user.profile.location = (profile._json.location) ? profile._json.location.name : '';
        user.save((err) => {
          done(err, user, info);
        });
      }
    });
  });
}
));


/**
* Sign in with Facebook Token.
*/
/**
* Sign in with Facebook Token.
*/
passport.use(new TwitterTokenStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET
}, function (token, tokenSecret, profile, done) {
  console.log("TwitterTokenStrategy");
  console.log("twitter profile", profile);
  User.findOne({ twitter: profile.id }, (err, existingUser) => {
    console.log("err", err);
    //console.log("existing user", existingUser);
    if (err) { return done(err); }
    var twitterToken = { kind: 'twitter', accessToken : token, tokenSecret : tokenSecret };
    return createTwitterUser(existingUser, profile, twitterToken, done);
  });
}
));


/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        //req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.save((err) => {
            //req.flash('info', { msg: 'Facebook account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
          done(err);
        } else {
          const user = new User();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.gender = profile._json.gender;
          user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.profile.location = (profile._json.location) ? profile._json.location.name : '';
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));

/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: '/auth/github/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ github: profile.id }, (err, existingUser) => {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile._json.avatar_url;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.website = user.profile.website || profile._json.blog;
          user.save((err) => {
            req.flash('info', { msg: 'GitHub account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ github: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
          done(err);
        } else {
          const user = new User();
          user.email = profile._json.email;
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken });
          user.profile.name = profile.displayName;
          user.profile.picture = profile._json.avatar_url;
          user.profile.location = profile._json.location;
          user.profile.website = profile._json.blog;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));


function createTwitterUser(user, profile, twitterToken, done) {
  if (!user) {
    user = new User();
    // Twitter will not provide an email address.  Period.
    // But a person’s twitter username is guaranteed to be unique
    // so we can "fake" a twitter email address as follows:
    user.email = `${profile.username}@twitter.com`;
    user.twitter = profile.id;
    user.profile.name = profile.displayName;
    user.profile.location = profile._json.location;
    user.profile.picture = profile._json.profile_image_url_https;
  }

  user.tokens.push(twitterToken);
  var jwt_access_token = utils.createAccessToken(user.email, user._id);
  var id_jwt_token = utils.createIdToken({
    email: user.email
  });
  var info = { access_token: jwt_access_token };
  var jwtToken = {
    id_token: id_jwt_token,
    access_token: jwt_access_token,
    enabled: true
  };
  user.jwttokens.push(jwtToken);

  user.save((err) => {
    done(err, user, info);
  });
}
// Sign in with Twitter.

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: '/auth/twitter/callback',
  passReqToCallback: true
}, (req, accessToken, tokenSecret, profile, done) => {
  if (req.user) {
    User.findOne({ twitter: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.twitter = profile.id;
          user.tokens.push({ kind: 'twitter', accessToken, tokenSecret });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
          user.save((err) => {
            if (err) { return done(err); }
            req.flash('info', { msg: 'Twitter account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ twitter: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      return createTwitterUser(null, profile, done);
    });
  }
}));

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || profile._json.image.url;
          user.save((err) => {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
          done(err);
        } else {
          const user = new User();
          user.email = profile.emails[0].value;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.name = profile.displayName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = profile._json.image.url;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));


function handlerUnauthorized(res) {
  return res.status(HttpStatus.UNAUTHORIZED)
    .send({
      error: {
        msg: __("Authentication needed, please login to access to this page")
      }
    });

}
/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  console.log("req: ", req);
  console.log("passport ", req._passport.instance._userProperty);
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    handlerUnauthorized(res);
  }
}

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  console.log("isAuthorized");
  console.log("token ", token);
  if (token) {
    next();
  } else {
    handlerUnauthorized(res);
  }
};

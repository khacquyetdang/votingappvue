const HttpStatus = require('http-status-codes');
const request = require('request');
var i18n = require('i18n');
const userController = require('./controllers/user');
const photoController = require('./controllers/photo');
const jwtconfig = require('./config/config.json');
const passport = require('passport');
var jwt = require('express-jwt');
const utils = require('./utils/index');
const User = require('./models/User');

var jwtCheck = jwt({
  secret: jwtconfig.secret,
  audience: jwtconfig.audience,
  issuer: jwtconfig.issuer,
  errorOnFailedAuth: false,
});

module.exports = app => {
  app.post(
    '/api/auth/twitter/token',
    function(req, res, next) {
      request.post(
        {
          url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
          oauth: {
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_SECRET,
            token: req.query.oauth_token,
          },
          form: {
            oauth_verifier: req.query.oauth_verifier,
          },
        },
        function(err, r, body) {
          if (err) {
            return res.send(HttpStatus.INTERNAL_SERVER_ERROR, {
              msg: err.message,
            });
          }

          const bodyString =
            '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
          const parsedBody = JSON.parse(bodyString);

          req.body['oauth_token'] = parsedBody.oauth_token;
          req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
          req.body['user_id'] = parsedBody.user_id;

          next();
        },
      );
    },
    function(req, res) {
      passport.authenticate('twitter-token', function(err, user, info) {
        console.log('inside twitter-token endpoint');
        console.log('user', user);
        console.log('err ', err);
        console.log('info ', info);
        if (err) {
          return res.status(HttpStatus.CONFLICT).send({
            error: {
              msg: err,
            },
          });
        }
        if (!user) {
          return res.status(HttpStatus.UNAUTHORIZED).send({
            error: {
              msg: i18n.__(
                'Authentication needed, please login to access to this page',
              ),
            },
          });
        } else {
          return res.status(HttpStatus.OK).send({
            msg: i18n.__('Authentication Ok'),
            user_id: user.id,
            access_token: info.access_token,
          });
        }
      })(req, res);
    },
  );

  // this route is for request token on server side
  app.post('/api/auth/twitter/reverse', function(req, res) {
    request.post(
      {
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: 'http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback',
          consumer_key: process.env.TWITTER_KEY,
          consumer_secret: process.env.TWITTER_SECRET,
        },
      },
      function(err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }

        var jsonStr =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      },
    );
  });

  app.get('/api/auth/facebook/token', (req, res) => {
    passport.authenticate('facebook-token', function(err, user, info) {
      // do something with req.user
      console.log('insde endpoint');
      console.log('user', user);
      console.log('err ', err);
      console.log('info ', info);

      if (err) {
        return res.status(HttpStatus.CONFLICT).send({
          error: {
            msg: err,
          },
        });
      }
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).send({
          error: {
            msg: i18n.__(
              'Authentication needed, please login to access to this page',
            ),
          },
        });
      } else {
        return res.status(HttpStatus.OK).send({
          msg: i18n.__('Authentication Ok'),
          user_id: user.id,
          access_token: info.access_token,
        });
      }
    })(req, res);
  });

  /**
   * custome middle where to check jwt
   */
  const isAuthenticatedWithJwtToken = (req, res, next) => {
    console.log('isAuthenticatedWithJwtToken');
    var userid = req.user.userid;
    var accesstoken = utils.getTokenFromReq(req);
    User.findOne(
      {
        _id: userid,
      },
      {
        jwttokens: {
          $elemMatch: {
            access_token: accesstoken,
            enabled: true,
          },
        },
      },
      function(err, existingUser) {
        console.log('check jwt token with db');

        if (err) {
          utils.handleError(res, err, HttpStatus.CONFLICT);
          return;
        }

        if (!existingUser) {
          utils.handleError(
            res,
            i18n.__(
              'Authentication needed, please login to access to this page',
            ),
            HttpStatus.CONFLICT,
          );
          return;
        }

        if (existingUser.jwttokens.length >= 1) {
          next();
        } else {
          utils.handleError(
            res,
            i18n.__(
              'Authentication needed, please login to access to this page',
            ),
            HttpStatus.CONFLICT,
          );
        }
      },
    );
  };

  // app.post('/api/photo', jwtCheck); app.post('/api/photo', requireScope);

  app.post('/api/signup', userController.postSignup);
  app.post('/api/login', userController.postLogin);

  // app.post('/api/photo', jwtCheck, requireScope('full_access'),
  // photoController.add); app.post('/api/photo', photoController.add);
  app.post(
    '/api/photo',
    [jwtCheck, isAuthenticatedWithJwtToken],
    photoController.add,
  );

  app.delete(
    '/api/photo/:photoId',
    [jwtCheck, isAuthenticatedWithJwtToken],
    photoController.delete,
  );

  app.post(
    '/api/photo/vote/:photoId',
    [jwtCheck, isAuthenticatedWithJwtToken],
    photoController.vote,
  );
  app.get(
    '/api/myphoto',
    [jwtCheck, isAuthenticatedWithJwtToken],
    photoController.myphoto,
  );

  app.get('/api/photo', photoController.get);

  app.get(
    '/api/logout',
    [jwtCheck, isAuthenticatedWithJwtToken],
    userController.logout,
  );
  /* app.post('/api/signup', function (req, res, next) {
    res.send('hello postvcefd');
  }); */

  app.use(function(err, req, res, next) {
    console.log('app use');
    if (err) {
      console.log('app err: ', err);
    }
    if (
      err.name.startsWith('UnauthorizedError') ||
      err.name.startsWith('Malformed access token')
    ) {
      // utils.errorHandler
      return res.status(HttpStatus.UNAUTHORIZED).send({
        error: {
          msg: i18n.__(
            'Authentication needed, please login to access to this page',
          ),
        },
      });
    }
  });
};

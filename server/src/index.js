/*  eslint consistent-return:0  */

const express = require('express');
var cors = require('cors');
var i18n = require('i18n');
const logger = require('./logger');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
// const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const configCors = require('./config/cors');
const path = require('path');
const morgan = require('morgan');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
console.log('node env : ', process.env.NODE_ENV);
dotenv.load({
  path: '.env.' + process.env.NODE_ENV,
});
console.log('api base url', process.env.API_BASE_URL);

/**
 * API keys and Passport configuration.
 */
require('./config/passport');

const argv = require('./argv');
const port = require('./port');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
console.log('env MONGODB_URI', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', err => {
  console.error(err);
  var aerror =
    '%s MongoDB connection error. Please make sure MongoDB is running.';
  console.log(aerror, chalk.red('✗'));
  process.exit();
});

// minimal config
i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(__dirname, '/locales'),
  defaultLocale: 'fr',
  autoReload: true,
  queryParameter: 'lang',
  register: global,
});

// app.use(expressStatusMonitor());
app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cors());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
      autoReconnect: true,
      clear_interval: 3600,
    }),
  }),
);

if (process.env.NODE_ENV === 'development') {
  // app.use(logger('dev')); app.use(errorHandler())
}

app.use(passport.initialize());
app.use(passport.session());
app.use(cors(configCors.corsOptions));

// routing
app.use(i18n.init);

require('./routes')(app);
// get the intended host and port number, use localhost and port 3000 if not
// provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// Start your app.
app.listen(port, host, err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});

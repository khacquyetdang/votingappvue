'use strict';

const dotenv = require('dotenv');

const resultDotenv = dotenv.load({ path: '.env.production' });

module.exports = {
  NODE_ENV: '"production"',
  baseURL: JSON.stringify(process.env.baseURL),
  gaTrackingId: JSON.stringify(process.env.gaTrackingId)
};

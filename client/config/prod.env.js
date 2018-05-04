'use strict';

const merge = require('webpack-merge');
const dotenv = require('dotenv');

const resultDotenv = dotenv.load({ path: '.env.production' });

module.exports = {
  NODE_ENV: '"production"',
  baseURL: JSON.stringify(process.env.baseURL),
};

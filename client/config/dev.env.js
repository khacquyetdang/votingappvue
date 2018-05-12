'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');
const dotenv = require('dotenv');

const resultDotenv = dotenv.load({ path: '.env.development' });

console.log('resultDotenv', resultDotenv);
console.log('process.env.baseURL', JSON.stringify(process.env.baseURL));
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseURL: JSON.stringify(process.env.baseURL),
  gaTrackingId: JSON.stringify(process.env.gaTrackingId)
});

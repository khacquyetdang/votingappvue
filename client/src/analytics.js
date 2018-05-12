import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAnalytics from 'vue-analytics'

import router from './router';
Vue.use(VueAnalytics, {
  id: process.env.gaTrackingId,
  router
});
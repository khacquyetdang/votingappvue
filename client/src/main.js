// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';
import {
  sync
} from 'vuex-router-sync';
import 'vuetify/dist/vuetify.min.css';
import store from '@/store/store';

import App from './App';
import router from './router';
import './analytics';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VeeValidate);
sync(store, router);


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log("store", store);
  const isAuthenthicated = store.state.isUserLoggedIn;
  if (requiresAuth && !isAuthenthicated) {
    next('/login');
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>',
});
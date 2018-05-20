//require('babel-polyfill'); 
import Vue from 'vue';
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';
import {
  sync
} from 'vuex-router-sync';
import VueRouter from 'vue-router'
import _ from 'lodash';
import Vuex from 'vuex';
import Header from '@/components/Header';
import store, { options } from '@/store/store';
import router from '@/router';
Vue.use(Vuetify);
Vue.use(VeeValidate);
sync(store, router);
Vue.use(VueRouter);


describe('Header component', () => {
  let testOptions;
  beforeEach(() => {
    testOptions = _.cloneDeep(options);
  });
  
  it('It should content about menu', () => {    
    Vue.use(VueRouter);

    const Constructor = Vue.extend({ ...Header, router: router, store: store});
    const vm = new Constructor().$mount();
    console.log("header all ", vm.$el);
    console.log("about menu", vm.$el.querySelectorAll('a[href*="#/about"]'));
    expect(vm.$el.querySelectorAll('a[href*="#/about"]'))
      .to.not.equal(null);
  });
  it('It should content login, signup route when not authenticated', () => {    
    testOptions.isUserLoggedIn = false;
    const stubbedStore = new Vuex.Store(testOptions);
    const Constructor = Vue.extend({ ...Header, router: router, store: stubbedStore});
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelectorAll('a[href*="#/register"]'))
      .to.not.equal(null);
    expect(vm.$el.querySelectorAll('a[href*="#/login"]'))
      .to.not.equal(null);
  });

  it('It should content /poll/create, poll/my route when authenticated. It should not contains register neither login ', () => {    
    testOptions.isUserLoggedIn = true;
    const stubbedStore = new Vuex.Store(testOptions);
    const Constructor = Vue.extend({ ...Header, router: router, store: stubbedStore});
    const vm = new Constructor().$mount();

    console.log("menu Header", vm.$el);
    expect(vm.$el.querySelectorAll('a[href*="#/poll/create"]'))
      .to.not.equal(null);
    expect(vm.$el.querySelectorAll('a[href*="#/poll/my"]'))
      .to.not.equal(null);
      expect(vm.$el.querySelectorAll('a[href*="#/register"]'))
      .to.equal(null);
    expect(vm.$el.querySelectorAll('a[href*="#/login"]'))
      .to.equal(null);
  });

});

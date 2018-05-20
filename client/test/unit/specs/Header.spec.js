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
    expect(vm.$el.querySelectorAll('a[href*="#/about"]'))
    .to.have.property('length', 1);  
  });
  it('It should content login, signup route when not authenticated and ' +
  'It should not content /poll/create, poll/my route', () => {    
    testOptions.state.isUserLoggedIn = false;
    const stubbedStore = new Vuex.Store(testOptions);
    const Constructor = Vue.extend({ ...Header, router: router, store: stubbedStore});
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelectorAll('a[href*="#/register"]'))
    .to.have.property('length', 1);
    expect(vm.$el.querySelectorAll('a[href*="#/login"]'))
    .to.have.property('length', 1);
  
      expect(vm.$el.querySelectorAll('a[href*="#/poll/create"]'))
      .to.have.property('length', 0);
    expect(vm.$el.querySelectorAll('a[href*="#/poll/my"]'))
    .to.have.property('length', 0);
  });

  it('It should content /poll/create, poll/my route when authenticated. It should not contains register neither login ', () => {    
    testOptions.state.isUserLoggedIn = true;
    const stubbedStore = new Vuex.Store(testOptions);
    const Constructor = Vue.extend({ ...Header, router: router, store: stubbedStore});
    const vm = new Constructor().$mount();

    expect(vm.$el.querySelectorAll('a[href*="#/poll/create"]'))
    .to.have.property('length', 1);
    expect(vm.$el.querySelectorAll('a[href*="#/poll/my"]'))
    .to.have.property('length', 1);
      expect(vm.$el.querySelectorAll('a[href*="#/register"]'))
      .to.have.property('length', 0);
    expect(vm.$el.querySelectorAll('a[href*="#/login"]'))
    .to.have.property('length', 0);
  });

  it('It should update store when logout', () => {    
    testOptions.state.isUserLoggedIn = true;
    const stubbedStore = new Vuex.Store(testOptions);
    const Constructor = Vue.extend({ ...Header, router: router, store: stubbedStore});
    const vm = new Constructor().$mount();

    //const logoutElement = vm.$el.querySelectorAll('v-list-tile v-list-tile-content v-list-tile-title h3[text()="Sign out"]');
    console.log("el", vm.$el);
    //const allMenuElement = vm.$el.querySelectorAll('a:has(div:has(div:has(h3)))');

    const allMenuElement = vm.$el.querySelectorAll('a:has(div)');

    console.log("allMenuElement", allMenuElement);
    const logoutElement = vm.$el.querySelectorAll('h3[text*="Sign out"]');

  });
  

});

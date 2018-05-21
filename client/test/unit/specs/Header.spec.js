//require('babel-polyfill'); 
import Vue from 'vue';
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';
import {
  sync
} from 'vuex-router-sync';
import VueRouter from 'vue-router';
import {
  shallowMount,
  mount
} from '@vue/test-utils';
import sinon from 'sinon';
import _ from 'lodash';
import Vuex from 'vuex';
import Header from '@/components/Header';
import store, {
  options
} from '@/store/store';
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

    const Constructor = Vue.extend({ ...Header,
      router: router,
      store: store
    });
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelectorAll('a[href*="#/about"]'))
      .to.have.property('length', 1);
  });
  it('It should content login, signup route when not authenticated and ' +
    'It should not content /poll/create, poll/my route', () => {
      testOptions.state.isUserLoggedIn = false;
      const stubbedStore = new Vuex.Store(testOptions);
      const Constructor = Vue.extend({ ...Header,
        router: router,
        store: stubbedStore
      });
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
    const Constructor = Vue.extend({ ...Header,
      router: router,
      store: stubbedStore
    });
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
    const logoutHandler = sinon.stub();

    const spy = sinon.spy(Header.methods, 'logout')

    const wrapper = shallowMount(Header, {
      router: router,
      store: stubbedStore,
      /*methods: { 
         logout : logoutHandler
      }*/
    });


    const menuLogout = wrapper.find('.logoutMenu');
    //console.log("instance of allMenuElement", (allMenuElement instanceof WrapperArray));
    /*const menuLogout = allMenuElement.filter(element => {
      console.log("single menu item h3 ", element.find("h3").text() === "Sign out");
      return element.find("h3").text() === "Sign out";
    }).at(0);*/

    let itemsAuthenticated = [{
        title: 'Create poll',
        path: '/poll/create',
        items: []
      },
      {
        title: 'My polls',
        path: '/poll/my',
        items: []
      },
      {
        title: 'About',
        path: '/about',
        items: []
      }

    ];

    expect(_.isEqual(itemsAuthenticated, wrapper.vm.items)).to.be.true;
 
 
    menuLogout.trigger('click');

    expect(spy).to.have.been.called;
    
    var itemsLogout = [{
      title: 'Sign In',
      path: '/login',
      items: []
    }, {
      title: 'Sign Up',
      path: '/register',
      items: []
    }, {
      title: 'About',
      path: '/about',
      items: []
    }];
    var isTheSameItems = _.isEqual(itemsLogout, wrapper.vm.items);
    expect(isTheSameItems).to.be.true;
  });


});
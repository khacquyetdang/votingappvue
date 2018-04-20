import Vue from 'vue';
import Vuex from 'vuex';
import { loadTokenStorage } from '../localStorage';
Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    token: loadTokenStorage(),
    drawer: null,
    // user: null,
    isUserLoggedIn: loadTokenStorage() !== null,
  },

  mutations: {
    setToken(state, token) {
      state.token = token;
      if (token) {
        state.isUserLoggedIn = true;
      } else {
        state.isUserLoggedIn = false;
      }
    },
    toggleDrawer(state, drawer) {
      state.drawer = drawer;
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token);
    },
    toggleDrawer({commit }, drawer) {
      commit('toggleDrawer', drawer);      
    }
  },
});

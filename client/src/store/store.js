import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    drawer: null,
    // user: null,
    isUserLoggedIn: false,
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

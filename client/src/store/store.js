import Vue from 'vue';
import Vuex from 'vuex';
import { loadTokenStorage } from '../localStorage';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    token: loadTokenStorage(),
    drawer: null,
    polls: null,
    pollsbyId: new Map(),
    // user: null,
    isUserLoggedIn: loadTokenStorage() !== null,
  },

  getters: {
    getPolls(state) {
      return state.polls;
    },
  },
  mutations: {
    setToken: function(state, token) {
      state.token = token;
      if (token) {
        state.isUserLoggedIn = true;
      } else {
        state.isUserLoggedIn = false;
      }
    },
    setPolls: function(state, polls) {
      state.polls = polls;
      polls.forEach(poll => {
        state.pollsbyId.set(poll._id, poll);
      });
    },
    toggleDrawer: function(state, drawer) {
      state.drawer = drawer;
    },
  },
  actions: {
    setPolls: function({ commit }, polls) {
      commit('setPolls', polls);
    },
    setToken: function({ commit }, token) {
      commit('setToken', token);
    },
    toggleDrawer: function({ commit }, drawer) {
      commit('toggleDrawer', drawer);
    },
  },
});

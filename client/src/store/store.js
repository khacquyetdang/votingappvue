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
    mypolls: null,
    pollsbyId: new Map(),
    // user: null,
    isUserLoggedIn: loadTokenStorage() !== null,
  },

  getters: {
    getPolls(state) {
      return state.polls;
    },
    getMyPolls(state) {
      return state.mypolls;
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
    setMyPolls: function(state, polls) {
      state.mypolls = polls;
    },
    toggleDrawer: function(state, drawer) {
      state.drawer = drawer;
    },
  },
  actions: {
    setMyPolls: function({ commit }, polls) {
      commit('setMyPolls', polls);
    },
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

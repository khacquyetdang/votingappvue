import Vue from 'vue';
import Vuex from 'vuex';
import {
  loadUserStorage
} from '../localStorage';

Vue.use(Vuex);

const options = {
  strict: true,
  state: {
    user: {
      token: loadUserStorage() ? loadUserStorage().access_token : null,
      id_user: loadUserStorage() ? loadUserStorage().id_user : null,
    },
    drawer: null,
    polls: null,
    mypolls: null,
    pollsbyId: new Map(),
    // user: null,
    isUserLoggedIn: loadUserStorage() !== null,
  },

  getters: {
    getPolls(state) {
      return state.polls;
    },
    getMyPolls(state) {
      return state.mypolls;
    },
    getToken(state) {
      return state.user.token;
    },
    getIdUser(state) {
      return state.user.id_user;
    },

  },
  mutations: {
    setUser: function(state, user) {
      if (user) {
        state.user.token = user.access_token;
        state.user.id_user = user.id_user;
        state.isUserLoggedIn = true;
      } else {
        state.user.token = null;
        state.user.id_user = null;
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
    setMyPolls: function({
      commit
    }, polls) {
      commit('setMyPolls', polls);
    },
    setPolls: function({
      commit
    }, polls) {
      commit('setPolls', polls);
    },
    setUser: function({
      commit
    }, user) {
      commit('setUser', user);
    },
    toggleDrawer: function({
      commit
    }, drawer) {
      commit('toggleDrawer', drawer);
    },
  },
};

export default new Vuex.Store(options);
export {
  options
};
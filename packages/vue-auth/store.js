import axios from 'axios';
import _get from 'lodash/get';

function getCookie(name) {
  function escape(s) { return s.replace(/([.*+?^$(){}|[\]/\\])/g, '\\$1'); }
  const match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

// initial state
const state = {
  error: null, // this.$store.state.auth.error (or) ...mapState({error: state => state.auth.error})
  data: null,
  user: null, // this.$store.state.auth.user (or) ...mapState({user: state => state.auth.user})
  tenant: null, // this.$store.state.auth.tenant (or) ...mapState({tenant: state => state.auth.tenant})
  loggedIn: false, // this.$store.state.auth.loggedIn (or) ...mapState({loggedIn: state => state.auth.loggedIn})
};

// getters
const getters = {
  getToken: state => {
    return state.data ? state.data.access_token : null;
  },
  hasScope: state => scope => {
    if(state.user !== null && state.user.hasOwnProperty('permissions') && Array.isArray(state.user.permissions)) {
      return state.user.permissions.includes(scope);
    }
    return false;
  },
};

// actions
const actions = {
  login({ commit, state, dispatch }, { loginUrl, params, fetchUserUrl }) {
    commit('setError', null);
    commit('setLoading', true);
    return axios.post(loginUrl, params, {errorHandle: false, skipAuthRefresh: true})
      .then(response => {
        if(response.data.access_token.length > 0) {
          commit('setData', response.data);
          return dispatch('fetchUser', { url: fetchUserUrl });
        }
        return response;
      })
      .then(response => {
        if(!state.loggedIn) {
          throw new Error('Could not retrieve the logged in user.');
        }
        return response;
      })
      .catch(error => {
        let message = _get(error, 'response.data.message', error.message);
        if(message === 'Incorrect user credentials.') {
          message = 'Wrong username or password';
        }
        commit('setError', message);
        throw new Error(message); // throw to break the promise chain
      })
      .finally(() => commit('setLoading', false));
  },
  bootLogin({ commit }) {
    commit('setError', null);
    commit('setLoading', null);
  },
  setData({ commit }, payload) {
    commit('setData', payload);
    if(payload === null) {
      commit('setUser', null);
    }
  },
  logout({ commit, getters }, { logoutUrl }) {
    const token = getters.getToken ?? getCookie('accessToken');
    if(logoutUrl && getters.getToken) {
      return axios.post(logoutUrl).then(response => {
        commit('setData', null);
        commit('setUser', null);
        return response;
      });
    } else {
      commit('setData', null);
      commit('setUser', null);
    }
  },
  fetchUser({ commit, state }, { url }) {
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${state.data.access_token}`
      }
    }).then(response => {
      commit('setUser', response.data);
      return response;
    });
  }
};

// mutations
const mutations = {
  setError(state, message) {
    state.error = message;
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
  setData(state, payload) {
    state.data = payload;
  },
  setUser(state, payload) {
    state.user = payload;
    state.tenant = payload !== null ? payload?.customers[0]?.uuid : null;
    state.loggedIn = payload !== null;
  },
  setTenant(state, uuid) {
    state.tenant = uuid;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

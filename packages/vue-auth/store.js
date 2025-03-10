import axios from 'axios';
import _get from 'lodash/get';
import { defineStore } from 'pinia';

// Helper function to get cookie value
export const getCookie = (name) => {
  const escape = s => s.replace(/([.*+?^$(){}|[\]/\\])/g, '\\$1');
  const match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
};

export const useAuthStore = defineStore('auth', {
  persist: { debug: true }, // Persist the store in localStorage

  state: () => ({
    loading: false,
    error: null,
    data: null,
    user: null,
    tenant: null,
    loggedIn: false,
  }),

  getters: {
    getToken: state => {
      return state.data ? state.data.access_token : null;
    },
    hasScope: state => scope => {
      if (state.user !== null && state.user.hasOwnProperty('permissions') && Array.isArray(state.user.permissions)) {
        return state.user.permissions.includes(scope);
      }
      return false;
    },
  },

  actions: {
    login({ loginUrl, params, fetchUserUrl, config = {}}) {
      this._setError(null);
      this._setLoading(true);
      return axios.post(loginUrl, params, { errorHandle: false, skipAuthRefresh: true, ...config })
        .then(response => {
          if (response.data.access_token.length > 0) {
            this._setData(response.data);
            return this.fetchUser({ url: fetchUserUrl });
          }
          return response;
        })
        .then(response => {
          if (!this.loggedIn) {
            throw new Error('Could not retrieve the logged-in user.');
          }
          return response;
        })
        .catch(error => {
          let message = _get(error, 'response.data.message', error.message);
          if (message === 'Incorrect user credentials.') {
            message = 'Wrong username or password';
          }
          this._setError(message);
          throw new Error(message, { cause: error });
        })
        .finally(() => this._setLoading(false));
    },

    bootLogin() {
      this._setError(null);
      this._setLoading(null);
    },

    setData(payload) {
      this._setData(payload);
      if (payload === null) {
        this._setUser(null);
      }
    },

    logout({ logoutUrl }) {
      const token = this.getToken ?? getCookie('accessToken');
      if (logoutUrl && this.getToken) {
        return axios.post(logoutUrl).then(response => {
          this._setData(null);
          this._setUser(null);
          return response;
        });
      } else {
        this._setData(null);
        this._setUser(null);
      }
    },

    fetchUser({ url }) {
      return axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.data.access_token}`
        }
      }).then(response => {
        this._setUser(response.data);
        return response;
      });
    },

    _setError(message) {
      this.error = message;
    },

    _setLoading(payload) {
      this.loading = payload;
    },

    _setData(payload) {
      this.data = payload;
    },

    _setUser(payload) {
      this.user = payload;
      this.tenant = payload !== null ? payload?.customers?.[0]?.uuid : null;
      this.loggedIn = payload !== null;
    },

    setTenant(uuid) {
      this.tenant = uuid;
    },
  },
});

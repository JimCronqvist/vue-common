import Vue from 'vue'
import axios from 'axios';

import Snackbar from '../../packages/error-handler/Snackbar.vue';
import snackbarStore from '../../packages/error-handler/store';

import setupAuth from '../../packages/vue-auth';

export default async function ({ app, store }) {
  // Initialize axios

  // Attach axios to the Vue instance, to avoid having to import it everywhere
  Vue.prototype.$http = axios;

  // Apply global error handler for axios
  await import('../../packages/error-handler/axios');
  Vue.component('Snackbar', Snackbar);
  store.registerModule('snackbar', snackbarStore);

  // Attach a bearer token and apply the interceptor to handle refreshing of tokens
  // Make sure that this is added after the global error handler has been configured
  setupAuth('/api/auth/refresh', '/auth/login');

  // Apply global loading handler for axios
  await import('../../packages/loading-handler/axios');
}

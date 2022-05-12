import Snackbar from '../../packages/error-handler/Snackbar.vue';
import snackbarStore from '../../packages/error-handler/store';
import setupAxiosErrorHandler from "../../packages/error-handler";
import axios from 'axios';

export default async function ({ app, store }) {

  // Apply global error handler for axios
  app.component('Snackbar', Snackbar);
  store.registerModule('snackbar', snackbarStore);
  setupAxiosErrorHandler(axios);
}

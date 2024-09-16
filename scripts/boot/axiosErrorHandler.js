import Snackbar from '../../packages/error-handler/Snackbar.vue';
import setupAxiosErrorHandler from '../../packages/error-handler';
import axios from 'axios';

export default function ({ app }) {

  // Apply global error handler for axios
  app.component('Snackbar', Snackbar);
  setupAxiosErrorHandler(axios);
}

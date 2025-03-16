import Snackbar from '../../packages/error-handler/Snackbar.vue';
import setupAxiosErrorHandler from '../../packages/error-handler';

export default function (app, { $http }) {
  // Apply global error handler for axios
  app.component('Snackbar', Snackbar);
  setupAxiosErrorHandler($http);
}

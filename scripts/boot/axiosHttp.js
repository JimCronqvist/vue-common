import axios from 'axios';

export default function (app) {

  // Attach axios to the Vue instance, to avoid having to import it everywhere, and avoid singleton pattern.
  app.config.globalProperties.$http = axios;
}

import axios from 'axios';

export default function ({ app }) {

  // Attach axios to the Vue instance, to avoid having to import it everywhere
  app.prototype.$http = axios;

}

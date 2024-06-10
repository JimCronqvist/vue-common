import axios from 'axios';

export default function ({ app }) {

  // Attach axios to the Vue instance, to avoid having to import it everywhere
  if(parseFloat(app.version) < 3) {
    app.prototype.$http = axios;
  } else {
    app.config.globalProperties.$http = axios;
  }

}

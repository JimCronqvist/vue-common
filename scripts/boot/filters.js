import axios from 'axios';
import * as filters from '../../packages/filters/index';

export default function ({ app }) {

  // Attach all filters to the Vue instance, please note that native 'filters' are deprecated in Vue3, and recommended
  // to be set as a global property instead of the vue2 mustache interpolation syntax for filters, therefore we apply
  // it as a property already now.

  if(parseFloat(app.version) < 3) {
    app.prototype.$filters = filters;
  } else {
    app.config.globalProperties.$filters = filters;
  }

}

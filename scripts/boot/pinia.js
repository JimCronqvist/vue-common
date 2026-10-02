import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export function createPiniaInstance() {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  return pinia;
}

export function createAxiosPiniaPlugin(axios) {
  return ({ store }) => {
    store.$http = axios;
  }
}

export function boot(app, { $http }) {
  const pinia = createPiniaInstance();
  pinia.use(createAxiosPiniaPlugin($http));

  app.use(pinia);
  app.config.globalProperties.$pinia = pinia;
}

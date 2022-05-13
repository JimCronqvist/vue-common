import app from 'vue';
import store from '@/store';
import router from '@/router';

export default async function boot(imports) {
  if(!Array.isArray(imports)) {
    console.warn('Boot scripts needs to be provided as an array of imports');
    return null;
  }
  const vueOptions = {};
  for(const imp of imports) {
    const script = imp instanceof Function ? { boot: await imp } : await imp;
    let triggered = false;
    for(const key of ['boot', 'default']) {
      if(script[key] instanceof Function) {
        const option = await script[key]({ app, store, router });
        //console.log(script, key, option);
        Object.assign(vueOptions, option);
        triggered = true;
      }
    }
    if(!triggered) {
      console.warn('The boot script does not have a default exported function', script);
    }
  }
  return vueOptions;
}

// Code splitting is not possible to disable per dynamic import in vite/rollup.
// Recommended to not use dynamic imports for now, and instead do normal static imports and pass in the function
export const bootList = () => [
  import('./axiosHttp'),
  import('./axiosErrorHandler'),
  import('./axiosLoadingHandler'),
  import('./axiosAuth'),
  import('./i18n'),
  import('./dayjs'),
  import('./vuetify2'),
];

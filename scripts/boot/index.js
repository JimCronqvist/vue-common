
export default async function boot(app, imports) {
  if(!Array.isArray(imports)) {
    console.warn('Boot scripts needs to be provided as an array of imports');
    return null;
  }
  for(const imp of imports) {
    const script = imp instanceof Function ? { boot: await imp } : await imp;
    let triggered = false;
    for(const key of ['boot', 'default']) {
      if(script[key] instanceof Function) {
        await script[key](app, app.config.globalProperties);
        //console.log(script, key);
        triggered = true;
      }
    }
    if(!triggered) {
      console.warn('The boot script does not have a default exported function', script);
    }
  }
}

// Code splitting is not possible to disable per dynamic import in vite/rollup.
// Recommended to not use dynamic imports for now, and instead do normal static imports and pass in the function
export const bootList = () => [
  //import('./axiosHttp'),            // Keep this as the first one, all others will use the same axios instance
  //import('./pinia'),                // Keep this as the second one, will inject axios as well to .$http
  //import('./axiosAuth'),            // Auth should come before the error handler
  //import('./axiosTenant'),
  //import('./axiosLoadingHandler'),
  //import('./axiosErrorHandler'),
  //import('./i18n'),
  //import('./dayjs'),
  //import('./filters'),
  //import('./vee-validate'),
  //import('@/plugins/vuetify'),
];

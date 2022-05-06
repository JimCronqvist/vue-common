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
    const script = await imp;
    let triggered = false;
    for(const key of ['boot', 'default']) {
      if(script[key] instanceof Function) {
        Object.assign(vueOptions, script[key]({ app, store, router }));
        triggered = true;
      }
    }
    if(!triggered) {
      console.warn('The boot script does not have a default exported function', script);
    }
  }
  return vueOptions;
}

export const bootList = () => [
  //import('./http'),
  //import('./i18n'),
  //import('./dayjs'),
  //import('./vuetify2'),
];

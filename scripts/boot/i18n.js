import { createI18n, useI18n } from 'vue-i18n';
import { useLocaleStore } from '../../stores/locale';
import { markRaw } from 'vue';
import { changeI18nLocale } from '../../packages/i18n';


// Create a global i18n to be able to export the global properties
let i18nSingletonUsed = false;
const i18nSingleton = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  fallbackLocale: import.meta.env.VITE_I18N_LOCALE || 'en-US',
});

// If we want to add different dateTimeFormats per locale in the future:
// See: https://github.com/preetishhs/vue-localization-techniques/blob/master/src/locales/formats/dataTimeFormats.js

export function createI18nPiniaPlugin(i18n) {
  return ({ store }) => {
    // Attach the i18n instance to the store as a non-reactive property. markRaw() prevents Pinia from trying to proxy
    // i18n again, which would otherwise unwrap or overwrite its internal refs (like i18n.global.locale).
    store.$i18n = markRaw(i18n);
  }
}

export async function boot(app, { $pinia, $http }) {
  // The first time we boot, we will use the global i18n instance. The other times, create a local instance.
  let i18n;
  if(!i18nSingletonUsed) {
    i18n = i18nSingleton;
    i18nSingletonUsed = true;
  }
  if(!i18n) {
    i18n = createI18n({
      legacy: false, // Vuetify does not support the legacy mode of vue-i18n
      fallbackLocale: import.meta.env.VITE_I18N_LOCALE || 'en-US',
    });
  }

  app.use(i18n);
  $pinia.use(createI18nPiniaPlugin(i18n));

  app.config.globalProperties.$i18n = i18n; // Set by the vue-i18n plugin
  app.config.globalProperties.useI18n = useI18n;

  const localeStore = useLocaleStore($pinia);
  await localeStore.registerChangeLocaleCallback(true, async (locale) => await changeI18nLocale(i18n, locale, $http));
  console.log('boot i18n');
}

export const { t, te, tc, d, n } = i18nSingleton.global;
export default i18nSingleton;

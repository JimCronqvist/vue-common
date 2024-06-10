import { createI18n } from 'vue-i18n';
import axios from 'axios';

function loadLocaleMessages() {
  //console.log('start load locale message');
  const locales = import.meta.glob('/src/locales/*.json'); // Absolute path is relative to the project root
  const messages = {};
  Object.keys(locales).forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales[key];
    }
  });
  //console.log('finish load locale message', messages);
  return messages;
}

function checkDefaultLanguage(storeLocale) {
  let matched = null;
  const supportedLanguages = Object.getOwnPropertyNames(loadLocaleMessages());

  matched = supportedLanguages.find(lang => lang === storeLocale);
  if(!matched) {
    matched = supportedLanguages.find(lang => lang === navigator.language);
  }
  if(!matched) {
    const navigatorLanguagePartials = navigator.language.split('-')[0];
    matched = supportedLanguages.find(lang => lang === navigatorLanguagePartials);
  }
  if(!matched) {
    const navigatorLanguagePartials = navigator.language.split('-')[0];
    matched = supportedLanguages.find(lang => lang.split('-')[0] === navigatorLanguagePartials);
  }
  return matched;
}

// If we want to add different dateTimeFormats per locale in the future:
// See: https://github.com/preetishhs/vue-localization-techniques/blob/master/src/locales/formats/dataTimeFormats.js

export async function setI18nLanguage(lang) {
  console.log('Set i18n language to '+lang);
  if(!languages.includes(lang)) return Promise.reject('setI18nLanguage: i18n language does not exist');

  return loadLocaleMessages()[lang]().then(messages => {
    i18n.global.mergeLocaleMessage(lang, messages.default);
    if (i18n.mode === 'legacy') {
      i18n.global.locale = lang;
    } else {
      i18n.global.locale.value = lang;
    }
    axios.defaults.headers.common['Accept-Language'] = lang;
    document.querySelector('html').setAttribute('lang', lang);
  });
}

export const languages = Object.getOwnPropertyNames(loadLocaleMessages());
export const selectedLocale = storeLocale => checkDefaultLanguage(storeLocale) || import.meta.env.VITE_I18N_LOCALE || 'en-US';
export const selectedLanguage = selectedLocale => selectedLocale.split('-')[0];

const i18n = createI18n({
  fallbackLocale: import.meta.env.VITE_I18N_LOCALE || 'en-US',
});

export async function boot({ app, store }) {
  app.use(i18n);

  const locale = selectedLocale(store.state.locale);
  //const language = selectedLanguage(locale);

  // Load the default language
  await setI18nLanguage(locale);

  return { i18n };
}

export default i18n;

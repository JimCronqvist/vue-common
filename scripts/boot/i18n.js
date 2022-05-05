import Vue from 'vue';
import VueI18n from 'vue-i18n'
import axios from 'axios';
//import en from "vee-validate/dist/locale/en.json";
//import sv from "vee-validate/dist/locale/sv.json";
import { merge } from 'lodash';

Vue.use(VueI18n);

export function boot({ app }) {
  // Load the default language
  setI18nLanguage(selectedLocale);

  return {i18n};
}

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

function checkDefaultLanguage () {
  let matched = null;
  const supportedLanguages = Object.getOwnPropertyNames(loadLocaleMessages());
  matched = supportedLanguages.find(lang => lang === navigator.language);
  if (!matched) {
    const navigatorLanguagePartials = navigator.language.split('-')[0];
    matched = supportedLanguages.find(lang => lang === navigatorLanguagePartials);
  }
  if (!matched) {
    const navigatorLanguagePartials = navigator.language.split('-')[0];
    matched = supportedLanguages.find(lang => lang.split('-')[0] === navigatorLanguagePartials);
  }
  return matched;
}

export const languages = Object.getOwnPropertyNames(loadLocaleMessages());
export const selectedLocale = checkDefaultLanguage() || import.meta.env.VITE_I18N_LOCALE || 'en-US';
export const selectedLanguage = selectedLocale.split('-')[0];

// Temporary print out i18n info.
/*
console.log(selectedLocale, languages, merge(loadLocaleMessages(), {
  'sv-SE': {
    validations: sv.messages
  },
  'en-US': {
    validations: en.messages
  }
}));
*/

// If we want to add different dateTimeFormats per locale in the future:
// See: https://github.com/preetishhs/vue-localization-techniques/blob/master/src/locales/formats/dataTimeFormats.js

export function setI18nLanguage(lang) {
  console.log('Set i18n language to '+lang);
  if(!languages.includes(lang)) return Promise.reject('setI18nLanguage: i18n language does not exist');

  return loadLocaleMessages()[lang]().then(messages => {
    i18n.setLocaleMessage(lang, messages.default);
    i18n.locale = lang;
    axios.defaults.headers.common['Accept-Language'] = lang;
    document.querySelector('html').setAttribute('lang', lang);
  });
}

const i18n = new VueI18n({
  locale: selectedLocale,
  fallbackLocale: import.meta.env.VITE_I18N_LOCALE || 'en-US',
  /*
  messages: merge(loadLocaleMessages(), {
    'sv-SE': {
      validations: sv.messages
    },
    'en-US': {
      validations: en.messages
    }
  }),
  */
});

export default i18n;

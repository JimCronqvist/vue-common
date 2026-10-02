import { defineStore } from 'pinia';
import { getBaseLocale, getLanguageFromLocale } from '../packages/i18n/index.js';

export const useLocaleStore = defineStore('locale', {
  // Persist the store in localStorage
  persist: {
    pick: [
      'locale',
      'language',
    ],
    debug: true
  },

  state: () => ({
    locale: getBaseLocale(),                          // en-US | sv-SE
    language: getLanguageFromLocale(getBaseLocale()), // en | sv
    _callbacks: [], // Warning: Never persist this property.
  }),

  actions: {
    _setLocale(locale) {
      this.locale = locale;
      this.language = locale.split('-')[0];
    },

    async registerChangeLocaleCallback(triggerImmediately, callback) {
      this._callbacks.push(callback);
      if(triggerImmediately) {
        // Call the callback immediately with the current locale
        await callback(this.locale, this.language, this);
      }
    },

    async changeLocale(newLocale) {
      await this._setLocale(newLocale);

      for (const callback of this._callbacks) {
        try {
          // Pass the new locale and the store to each callback
          await callback(this.locale, this.language, this);
        } catch (err) {
          console.error('Locale: Error in one of the changeLocale callbacks:', err);
        }
      }
    },
  },

  getters: {

  }
});

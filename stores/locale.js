import { defineStore } from 'pinia';
import { selectedLocale, selectedLanguage, setI18nLanguage } from '../scripts/boot/i18n';
import { dayjsUpdateLocale } from '../scripts/boot/dayjs';

export const useLocaleStore = defineStore('locale', {
  persist: { debug: true }, // Persist the store in localStorage

  state: () => ({
    locale: selectedLocale(null),                     // en-US | sv-SE
    language: selectedLanguage(selectedLocale(null)), // en | sv
  }),

  actions: {
    _setLocale(locale) {
      this.locale = locale;
      this.language = locale.split('-')[0];
    },

    async changeLocale(newLocale) {
      await dayjsUpdateLocale(newLocale);
      await setI18nLanguage(newLocale);
      await this._setLocale(newLocale);
    },
  },

  getters: {

  }
});

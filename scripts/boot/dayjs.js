import dayjs from 'dayjs';
import { selectedLocale, selectedLanguage } from './i18n';
import { useLocaleStore } from '../../stores/locale';

const locales = {
  en: () => import('dayjs/locale/en'),
  sv: () => import('dayjs/locale/sv'),
};

export const dayjsUpdateLocale = (language) => {
  language = language.toLowerCase().split('-', 1)[0];
  language = locales.hasOwnProperty(language) ? language : 'en';
  return locales[language]().then(() => {
    dayjs.locale(language);
  });
};

export function boot(app, { $pinia }) {
  const localeStore = useLocaleStore($pinia);
  const locale = selectedLanguage(selectedLocale(localeStore.locale));
  dayjsUpdateLocale(locale);
  app.config.globalProperties.$dayjs = dayjs;
}

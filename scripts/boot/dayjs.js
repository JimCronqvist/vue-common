import dayjs from 'dayjs';

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

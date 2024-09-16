import { useLocaleStore } from '../../../stores/locale';

export default function getLocale() {
  const localeStore = useLocaleStore();
  return localeStore.locale;
};

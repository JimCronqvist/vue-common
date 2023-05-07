import store from '@/store';

export default function getLocale() {
  return store.state.locale;
};

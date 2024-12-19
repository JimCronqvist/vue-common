import { computed } from 'vue';

export function usePlatform() {

  const platform = computed(() => {
    if (window.Capacitor?.getPlatform) {
      return window.Capacitor.getPlatform();
    }
    return 'web';
  });

  const phoneApp = computed(() => platform.value === 'android' || platform.value === 'ios');

  const desktopApp = computed(() => platform.value === 'electron');

  const web = computed(() => platform.value === 'web');

  return {
    platform,
    phoneApp,
    desktopApp,
    web,
  };
}

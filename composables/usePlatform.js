import { computed } from 'vue';

export function usePlatform() {

  const platform = computed(() => {
    if (window.Capacitor?.getPlatform) {
      return window.Capacitor.getPlatform();
    }
    return 'web';
  });

  const isPhoneApp = computed(() => platform.value === 'android' || platform.value === 'ios');

  const isDesktopApp = computed(() => platform.value === 'electron');

  const isWeb = computed(() => platform.value === 'web');

  return {
    platform,
    isPhoneApp,
    isDesktopApp,
    isWeb,
  };
}

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNetworkStore = defineStore('network', () => {
  const isOnline = ref(true);

  function init() {
    if(typeof window === 'undefined') return; // (SSR, Capacitor, etc.)

    // Set the initial online status
    isOnline.value = window.navigator.onLine;

    // Add event listeners
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
  }

  function setOnline() {
    isOnline.value = true;
  }

  function setOffline() {
    isOnline.value = false;
  }

  function destroy() {
    if(typeof window !== 'undefined') {
      // Remove event listeners
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    }
  }

  return {
    isOnline,
    init,
    destroy,
  };
});

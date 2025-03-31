import { defineStore } from 'pinia';

const isSupported = () => typeof document?.visibilityState !== 'undefined';
const getVisibilityState = () => isSupported() ? document.visibilityState : undefined;

export const useVisibilityStore = defineStore('visibility', {
  state: () => ({
    visible: false,
    state: null,
    listener: null,
  }),

  actions: {
    setVisibility() {
      const visibilityState = getVisibilityState();
      this.visible = visibilityState === 'visible';
      this.state = visibilityState;
    },

    init() {
      if (this.listener === null) {
        this.setVisibility();
        this.listener = () => this.setVisibility();
        document.addEventListener('visibilitychange', this.listener);
      }
    },

    destroy() {
      if (this.listener !== null) {
        document.removeEventListener('visibilitychange', this.listener);
        this.listener = null;
      }
    }
  }
});

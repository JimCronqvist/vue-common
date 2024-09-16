import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: 0, // Track loading calls
  }),

  actions: {
    startLoading() {
      this.loading += 1;
    },
    stopLoading() {
      if(this.loading > 0) {
        this.loading -= 1;
      }
    }
  },

  getters: {
    isLoading: (state) => state.loading > 0, // True if any loading calls are active
  }
});

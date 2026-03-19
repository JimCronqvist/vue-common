import { defineStore } from 'pinia';

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    visibility: false,
    message: "An error has occurred",
    color: "error",
    timeout: 6000,
    x: null,
    y: "bottom",
    closable: true,
  }),

  actions: {
    setVisibility(visibility) {
      this.visibility = visibility;
    },

    _updateSettings(settings) {
      Object.assign(this.$state, settings);
    },

    /**
     * Set the message and type and show the snackbar
     * @param payload
     */
    showMessage(payload) {
      this.setVisibility(false);
      this.$reset(); // Reset to default state
      this._updateSettings(payload); // Apply new settings from payload
      this.setVisibility(true);
    }
  }
});

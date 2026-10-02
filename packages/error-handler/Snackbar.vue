<template>
  <v-snackbar
    :model-value="snackbarStore.visibility"
    :color="snackbarStore.color"
    :timeout="snackbarStore.timeout"
    :location="locationFromStore"
    :style="locationFromStore.indexOf('bottom') > -1 ? '--v-layout-bottom: 5px;' : (locationFromStore.indexOf('top') > -1 ? '--v-layout-top: 20px;' : '')"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-html="textFromStore" class="ma-0" />
    <v-btn v-if="snackbarStore.closable" variant="text" @click="close">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { useSnackbarStore } from './store';
import { watch } from 'vue';

export default {
  name: "Snackbar",
  setup() {
    const snackbarStore = useSnackbarStore();

    // Automatically close snackbar after timeout ends
    watch(
      () => snackbarStore.visibility,
      (visible) => {
        if (visible && snackbarStore.timeout) {
          setTimeout(() => {
            snackbarStore.setVisibility(false);
          }, snackbarStore.timeout);
        }
      }
    );

    return { snackbarStore };
  },
  computed: {
    textFromStore: function() {
      return this.snackbarStore.message.replace(/\n/g, '<br>');
    },
    locationFromStore: function () {
      const x = this.snackbarStore.x;
      const y = this.snackbarStore.y;
      if (x === 'left' && y === 'top') return 'top-left';
      if (x === 'right' && y === 'top') return 'top-right';
      if (x === 'left' && y === 'bottom') return 'bottom-left';
      if (x === 'right' && y === 'bottom') return 'bottom-right';
      if (x === 'left' && !x) return 'left';
      if (x === 'right' && !x) return 'right';
      if (y === 'top' && !x) return 'top';
      return 'bottom';
    },
  },
  methods: {
    close() {
      this.snackbarStore.setVisibility(false);
    }
  }
};
</script>

<style scoped></style>

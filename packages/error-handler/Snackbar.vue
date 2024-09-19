<template>
  <v-snackbar
    :model-value="snackbarStore.visibility"
    :color="snackbarStore.color"
    :timeout="snackbarStore.timeout"
    :location="snackbarStore.location"
    style="--v-layout-bottom: 0;"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-html="text" class="ma-0" />
    <v-btn variant="text" @click="close">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { useSnackbarStore } from './store';

export default {
  name: "Snackbar",
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
  },
  computed: {
    text: function() {
      return this.snackbarStore.message.replace(/\n/g, '<br>');
    },
    location: function () {
      const x = this.snackbarStore.x;
      const y = this.snackbarStore.y;
      if (this.x === 'left' && this.y === 'top') return 'top-left';
      if (this.x === 'right' && this.y === 'top') return 'top-right';
      if (this.x === 'left' && this.y === 'bottom') return 'bottom-left';
      if (this.x === 'right' && this.y === 'bottom') return 'bottom-right';
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

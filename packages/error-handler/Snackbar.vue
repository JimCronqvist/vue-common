<template>
  <v-snackbar
    :model-value="visibility"
    :color="color"
    :timeout="timeout"
    :location="location"
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
import { mapState } from 'vuex';

export default {
  name: "Snackbar",
  computed: {
    ...mapState({
      visibility: state => state.snackbar.visibility,
      text: state => state.snackbar.message.replace(/\n/g, '<br>'),
      color: state => state.snackbar.color,
      timeout: state => state.snackbar.timeout,
      x: state => state.snackbar.x,
      y: state => state.snackbar.y
    }),
    location: function () {
      if (this.x === 'left' && this.y === 'top') return 'top-left';
      if (this.x === 'right' && this.y === 'top') return 'top-right';
      if (this.x === 'left' && this.y === 'bottom') return 'bottom-left';
      if (this.x === 'right' && this.y === 'bottom') return 'bottom-right';
      return 'bottom';
    },
  },
  methods: {
    close() {
      this.$store.commit("snackbar/setVisibility", false);
    }
  }
};
</script>

<style scoped></style>

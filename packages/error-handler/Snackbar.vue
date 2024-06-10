<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    :timeout="timeout"
    :bottom="y === 'bottom'"
    :left="x === 'left'"
    :right="x === 'right'"
    :top="y === 'top'"
    :app="false"
  >
    <p v-html="text" class="ma-0"></p>
    <v-btn dark text @click="snackbar = false">
        Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "snackbar",
  computed: {
    ...mapState({
      text: state => state.snackbar.message.replace(/\n/g, '<br>'),
      color: state => state.snackbar.color,
      timeout: state => state.snackbar.timeout,
      x: state => state.snackbar.x,
      y: state => state.snackbar.y
    }),
    snackbar: {
      get() {
        return this.$store.state.snackbar.visibility;
      },
      set() {
        this.$store.commit("snackbar/setVisibility", false);
      }
    }
  }
};
</script>

<style scoped></style>

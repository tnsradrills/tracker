<script setup>
import { computed, watch } from "vue";
import { useSnackbarStore } from "../stores/snackbar.js";
import { useRoute } from "vue-router";
const route = useRoute();
const store = useSnackbarStore();
const fullPath = computed(() => route.fullPath);
watch(fullPath, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    store.clearSnackbars();
  }
});
</script>

<template>
  <div class="snackbar-container d-flex flex-xolum flex-column-reverse">
    <v-snackbar
      v-for="snackbar in store.snackbars"
      :key="snackbar.id"
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      absolute
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn
          v-for="button in snackbar.buttons"
          :key="button.id"
          @click.stop="button.action"
          :color="button.color"
          variant="text"
        >
          {{ button.text }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.snackbar-container {
  position: fixed;
  z-index: 99999;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 0);
}
.snackbar-container > .v-snack {
  position: relative;
}
</style>

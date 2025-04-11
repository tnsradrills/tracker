import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const snackbars = ref([]);
  const snackbarCounter = ref(0);
  const addSnackbar = (message = "message", color = "red", timeout = -1) => {
    const id = snackbarCounter.value++;

    let snackbar = {
      id: id,
      message: message,
      color: color,
      timeout: timeout,
      show: true,
      buttons: [],
    };
    snackbars.value.push(snackbar);

    if (timeout === -1) {
      snackbar.buttons.push({
        id: 1,
        text: "Dismiss",
        action: () => {
          dismissPersistentSnackbar(id);
        },
        color: "white",
      });
    }

    if (timeout && timeout > 0) {
      setTimeout(() => {
        removeSnackbar(id);
      }, timeout);
    }

    console.log(snackbar.buttons);
  };

  const clearSnackbars = () => {
    snackbars.value = [];
  };

  const dismissPersistentSnackbar = (i) => {
    snackbars.value = snackbars.value.map(function (snackbar) {
      if (snackbar.id === i) {
        snackbar.show = false;
      }
      return snackbar;
    });
    snackbars.value = snackbars.value.filter(function (snackbar) {
      return snackbar.id != i;
    });
  };

  const removeSnackbar = (id) => {
    snackbars.value = snackbars.value.filter((snack) => snack.id !== id);
  };

  return {
    snackbars,
    addSnackbar,
    clearSnackbars,
    dismissPersistentSnackbar,
    removeSnackbar,
  };
});

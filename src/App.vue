<script setup>
import { onMounted } from "vue";
import SnackbarComp from "./components/SnackbarComp.vue";
import NavBar from "./components/NavBar.vue";
import { useUserStore } from "./stores/userData.js";
import { useRoute } from "vue-router";
const route = useRoute();
const userStore = useUserStore();

onMounted(() => {
  userStore.initAuth();
});
</script>

<template>
  <v-app>
    <NavBar v-if="userStore.userData?.id && route.fullPath !== ''" />
    <v-main>
      <v-slide-y-transition mode="out-in" v-if="userStore.userData?.id">
        <router-view :key="route.fullPath" />
      </v-slide-y-transition>
      <router-view v-else :key="route.fullPath" />
    </v-main>

    <SnackbarComp />
  </v-app>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>

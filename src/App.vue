<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <SnackbarComp />
  </v-app>
</template>

<script setup>
import SnackbarComp from "./components/SnackbarComp.vue";
</script>

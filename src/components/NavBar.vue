<script setup>
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userData.js";
import Logo from "@/assets/images/chapter_logo.png";
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const navItems = [
  {
    title: "Dashboard",
    name: "Dashboard",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Record New Run",
    name: "Record New",
    icon: "mdi-plus",
  },
  {
    title: "Leaderboards",
    name: "Leaderboard",
    icon: "mdi-trophy",
  },
];
const logout = async () => {
  await userStore.signOut();
  router.push("/");
};
</script>

<template>
  <v-app-bar app class="app-bar-gradient">
    <v-app-bar-title class="text-white">
      <v-img
        style="display: inline-block; margin-top: 3px"
        :src="Logo"
        width="3.5rem"
      ></v-img>
      <div
        class="ml-4"
        style="display: inline-block; margin-top: 22px; position: absolute"
      >
        Progress Tracker
      </div>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn class="text-white" icon v-bind="props">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="router.push({ name: 'Edit Account' })">
          <div>
            <v-avatar color="grey-darken-1" class="mr-2">
              <span class="text-h5">{{
                userStore.userData.display_name
                  ? userStore.userData.display_name[0].toUpperCase()
                  : ""
              }}</span>
            </v-avatar>
            <span>Update Account</span>
          </div>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, i) in navItems"
          :key="i"
          :to="item.path"
          @click="router.push({ name: item.name })"
          :active="route.path == item.path"
          :disabled="route.path == item.path"
          active-color="blue-darken-4"
        >
          <v-list-item-title>
            <v-icon>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <v-divider class="my-1" />

        <v-list-item @click="logout">
          <v-list-item-title>
            <v-icon>mdi mdi-logout</v-icon>
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.app-bar-gradient {
  background: linear-gradient(136deg, #d80000, #2264b9);
}
.text-white {
  color: #eaeaea;
}
</style>

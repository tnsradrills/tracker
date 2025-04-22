<script setup>
import { ref, onMounted } from "vue";
import ChapterLogo from "@/assets/images/chapter_logo.png";
import LoginPage from "@/components/LoginPage.vue";
import SignupPage from "@/components/SignupPage.vue";
import { useRegionStore } from "@/stores/regionData.js";
import { useUserStore } from "@/stores/userData.js";
const showLogin = ref(false);
const showSignup = ref(false);
const regionStore = useRegionStore();
const userStore = useUserStore();
onMounted(() => {
  regionStore.retrieveRegionList();
});
</script>

<template>
  <div
    class="landing-background fill-height d-flex align-center justify-center"
  >
    <v-container v-if="!userStore.userData.id">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-img :src="ChapterLogo" contain height="150px" class="mb-4" />
          <h1 class="text-h4 font-weight-bold">
            Welcome to the TNSRA Progress Tracker
          </h1>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="mx-auto" elevation="8" rounded="xl">
            <v-card-text>
              <v-slide-x-transition mode="out-in">
                <v-row v-if="!showLogin && !showSignup" :key="0">
                  <v-col cols="12" class="text-center text-h6">
                    Returning User?
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center pt-1">
                    <v-btn
                      size="large"
                      color="primary"
                      @click="showLogin = true"
                      class="mx-2"
                    >
                      <v-icon start>mdi-login</v-icon>
                      Login
                    </v-btn>
                  </v-col>

                  <v-divider class="my-4"></v-divider>

                  <v-col cols="12" class="text-center text-h6 pt-1 pb-2"
                    >New User?</v-col
                  >
                  <v-col cols="12" class="d-flex justify-center">
                    <v-btn
                      color="secondary"
                      size="large"
                      @click="showSignup = true"
                      class="mx-2"
                    >
                      <v-icon start>mdi-account-plus</v-icon>
                      Sign Up
                    </v-btn>
                  </v-col>
                </v-row>
                <LoginPage
                  v-if="showLogin"
                  @backToMain="showLogin = false"
                  :key="1"
                />
                <SignupPage
                  v-if="showSignup"
                  @backToMain="showSignup = false"
                  :key="2"
                />
              </v-slide-x-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.landing-background {
  background: linear-gradient(135deg, #ffb0b0, #b6e0f8);
  min-height: 100vh; /* ⬅ ensures full height even if parent doesn't stretch */
  display: flex;
  flex-direction: column;
}
</style>

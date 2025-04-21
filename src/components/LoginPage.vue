<script setup>
import { ref, reactive, defineEmits } from "vue";
import { useUserStore } from "../stores/userData.js";
import { useSnackbarStore } from "../stores/snackbar.js";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const snackbarStore = useSnackbarStore();
const discordName = ref(null);
const password = ref(null);
const loginForm = ref(null);
const loading = ref(false);
const emit = defineEmits(["backToMain"]);
const rules = reactive({
  username: [(v) => !!v || "Your username is required."],
  pass: [(v) => !!v || "Your password is required."],
});

const revealPass = ref(false);

const tryLogin = async () => {
  const { valid } = await loginForm.value.validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const result = await userStore.loginUser(discordName.value, password.value);

  if (!result.success) {
    snackbarStore.addSnackbar(result.message, "red-lighten-1", -1);
  } else {
    router.push({ name: "Dashboard" });
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-form ref="loginForm">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="discordName"
                label="Discord Name"
                persistent-hint
                hint="What you provided when you first signed up, real or not."
                :rules="rules.username"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                label="Password"
                :type="revealPass ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :rules="rules.pass"
                :append-inner-icon="
                  revealPass ? 'mdi mdi-eye-closed' : 'mdi mdi-eye-outline'
                "
                @click:append-inner="revealPass = !revealPass"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-btn size="large" @click="emit('backToMain')"> Back </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          size="large"
          color="primary"
          @click="tryLogin"
          :disabled="loading"
          :loading="loading"
        >
          Login
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

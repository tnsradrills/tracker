<script setup>
import { ref, reactive, computed, defineEmits } from "vue";
import { useUserStore } from "../stores/userData.js";
import { useRegionStore } from "../stores/regionData.js";
import { useSnackbarStore } from "../stores/snackbar.js";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const regionStore = useRegionStore();
const snackbarStore = useSnackbarStore();
const discordName = ref(null);
const displayName = ref(null);
const region = ref(null);
const password = ref(null);
const signupForm = ref(null);

const emit = defineEmits(["backToMain"]);
const hasCapitalLetter = computed(() => /[A-Z]/.test(password.value));
const hasNumber = computed(() => /\d/.test(password.value));
const atLeastEightChar = computed(() => {
  if (password.value) {
    if (password.value.length >= 8) {
      return true;
    }
  }
  return false;
});
const rules = reactive({
  username: [
    (v) => !!v || "Your discord name or some manner of username is required.",
  ],
  display: [
    (v) =>
      !!v ||
      "A display name is required (so we can celebrate progress with you!)",
  ],
  region: [(v) => !!v || "Your region is required."],
  pass: [
    (v) => !!v || "A password is required.",
    () => hasCapitalLetter.value || "A bit stronger...",
    () => hasNumber.value || "A bit stronger...",
    () => atLeastEightChar.value || "A bit stronger...",
  ],
});

const revealPass = ref(false);

const trySignup = async () => {
  const { valid } = await signupForm.value.validate();
  if (!valid) {
    return;
  }
  const result = await userStore.signupUser(
    discordName.value,
    displayName.value,
    password.value,
    region.value
  );

  if (!result.success) {
    snackbarStore.addSnackbar(result.message, "red-lighten-1", -1);
  } else {
    router.push({ name: "Dashboard" });
  }
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-form ref="signupForm">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="discordName"
                label="Discord Name"
                persistent-hint
                hint="Your real one or not, this is what will act as your username to log in with going forward, so remember it!"
                :rules="rules.username"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="displayName"
                label="Display Name"
                persistent-hint
                hint="How you'd like to be seen on leaderboards."
                :rules="rules.display"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                label="Region"
                v-model="region"
                :items="regionStore.regionListData.list"
                item-title="name"
                item-value="id"
                persistent-hint
                hint="Whereabouts you are in the state."
                :loading="regionStore.regionListData.loading"
                :rules="rules.region"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                label="Password"
                :type="revealPass ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :rules="rules.pass"
                persistent-hint
                :hint="
                  hasCapitalLetter && hasNumber && atLeastEightChar
                    ? 'That got it!'
                    : 'No fancy authentication on this site, so make it strong-ish.'
                "
                :append-inner-icon="
                  revealPass ? 'mdi mdi-eye-closed' : 'mdi mdi-eye-outline'
                "
                @click:append-inner="revealPass = !revealPass"
              >
              </v-text-field>
              <div class="text-caption mt-1 pl-4">
                <div :class="hasCapitalLetter ? 'text-success' : 'text-error'">
                  At least one capital letter
                </div>
                <div :class="hasNumber ? 'text-success' : 'text-error'">
                  At least one number
                </div>
                <div :class="atLeastEightChar ? 'text-success' : 'text-error'">
                  At least 8 characters long
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row justify="space-around">
            <v-col cols="auto">
              <v-btn size="large" @click="emit('backToMain')"> Back </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn size="large" color="primary" @click="trySignup">
                Submit
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

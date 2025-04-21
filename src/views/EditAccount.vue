<script setup>
import { ref, reactive, computed } from "vue";
import { useUserStore } from "@/stores/userData";
import { useSnackbarStore } from "@/stores/snackbar";

const userStore = useUserStore();
const snackbar = useSnackbarStore();
const newDisplayForm = ref(null);
const newPassForm = ref(null);
const displayName = ref(userStore.userData.display_name);
const displayNameUpdating = ref(false);
const currentPassword = ref(null);
const newPassword = ref(null);
const confirmPassword = ref(null);
const passwordUpdating = ref(false);
const revealPass = ref(false);
const hasCapitalLetter = computed(() => /[A-Z]/.test(newPassword.value));
const hasNumber = computed(() => /\d/.test(newPassword.value));
const atLeastEightChar = computed(() => {
  if (newPassword.value) {
    if (newPassword.value.length >= 8) {
      return true;
    }
  }
  return false;
});
const passwordsMatch = computed(() => {
  if (confirmPassword.value != null) {
    return newPassword.value === confirmPassword.value;
  }
  return false;
});
const rules = reactive({
  display_name: [(v) => !!v || "A display name of some sort is required."],
  pass: [
    (v) => !!v || "A password is required.",
    () => hasCapitalLetter.value || "A bit stronger...",
    () => hasNumber.value || "A bit stronger...",
    () => atLeastEightChar.value || "A bit stronger...",
  ],
  confirm_pass: [() => passwordsMatch.value || "Passwords do not match."],
  current_pass: [(v) => !!v || "This field is required."],
});

const updateDisplayName = async () => {
  const { valid } = await newDisplayForm.value.validate();
  if (!valid) {
    return;
  }
  displayNameUpdating.value = true;
  let success = await userStore.updateDisplayName(displayName.value);
  if (success.success) {
    snackbar.addSnackbar("Display name updated successfully!", "green", 5000);
  } else {
    snackbar.addSnackbar(
      "There was a problem updating your display name. Please try again.",
      "red",
      -1
    );
  }
  displayNameUpdating.value = false;
};
const updatePassword = async () => {
  const { valid } = await newPassForm.value.validate();
  if (!valid) {
    return;
  }
  passwordUpdating.value = true;
  let success = await userStore.updatePassword(
    newPassword.value,
    currentPassword.value
  );
  if (success.success) {
    snackbar.addSnackbar("Password updated!", "green", 5000);
  } else {
    snackbar.addSnackbar(success.message, "red", -1);
  }
  passwordUpdating.value = false;
};
</script>

<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title>Edit Account</v-card-title>
      <v-card-text>
        <v-form ref="newDisplayForm">
          <v-row justify="center">
            <v-col cols="12" md="8" class="pb-2">
              <v-text-field
                v-model="displayName"
                label="Display Name"
                variant="outlined"
                :disabled="displayNameUpdating"
                :rules="rules.display_name"
                persistent-hint
                :hint="
                  'Current display name: ' + userStore.userData.display_name
                "
              />
            </v-col>
            <v-col cols="12" class="pt-0 text-center">
              <v-btn
                color="primary"
                @click="updateDisplayName"
                variant="outlined"
                :loading="displayNameUpdating"
                :disabled="displayNameUpdating"
                >Change Display Name</v-btn
              >
            </v-col>
          </v-row></v-form
        >
      </v-card-text>
      <v-divider class="my-4" />
      <v-card-text>
        <v-form ref="newPassForm">
          <v-row justify="center">
            <v-col cols="12" md="8" class="py-0">
              <v-text-field
                v-model="currentPassword"
                label="Current Password"
                variant="outlined"
                :disabled="passwordUpdating"
                :append-inner-icon="
                  revealPass ? 'mdi mdi-eye-closed' : 'mdi mdi-eye-outline'
                "
                :type="revealPass ? 'text' : 'password'"
                @click:append-inner="revealPass = !revealPass"
              />
            </v-col>
            <v-col cols="12" md="8" class="pt-0">
              <v-text-field
                v-model="newPassword"
                label="New Password"
                variant="outlined"
                :disabled="passwordUpdating"
                hide-details
                :rules="rules.pass"
                :append-inner-icon="
                  revealPass ? 'mdi mdi-eye-closed' : 'mdi mdi-eye-outline'
                "
                :type="revealPass ? 'text' : 'password'"
                @click:append-inner="revealPass = !revealPass"
              />
              <div class="text-caption mt-1 pl-1">
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
            <v-col cols="12" md="8" class="py-0">
              <v-text-field
                v-model="confirmPassword"
                type="password"
                label="Confirm New Password"
                variant="outlined"
                :disabled="passwordUpdating"
                :rules="rules.confirm_pass"
            /></v-col>
            <v-col cols="12" class="pt-0 text-center"
              ><v-btn
                color="primary"
                variant="outlined"
                @click="updatePassword"
                :loading="passwordUpdating"
                :disabled="passwordUpdating"
              >
                Change Password
              </v-btn>
            </v-col>
          </v-row></v-form
        >
      </v-card-text>

      <v-card-actions>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

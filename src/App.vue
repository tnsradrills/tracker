<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
// import { ref, onMounted } from "vue";
// import { supabase } from "../src/supabase";
// const users = ref([]);
// const loading = ref(true);
// const discordName = ref(null);
// const displayName = ref(null);
// const password = ref(null);
// const fetchUsers = async () => {
//   const { data, error } = await supabase.from("users").select("*").order("id");
//   if (error) {
//     console.error(error);
//   } else {
//     users.value = data;
//     loading.value = false;
//   }
// };

// const pushNewUser = async () => {
//   const fakeEmail = `${discordName.value}@placeholder.xyz`;

//   const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//     email: fakeEmail,
//     password: password.value,
//   });

//   if (signUpError) {
//     console.log("uwu it made a fucky");
//   }

//   const userId = signUpData.user?.id;
//   if (!userId) {
//     console.log("No user ID");
//   }

//   const { error: insertError } = await supabase.from("users").insert([
//     {
//       id: userId,
//       discord_username: discordName.value,
//       display_name: displayName.value,
//     },
//   ]);

//   if (insertError) {
//     console.log("uwu it made a fucky in the second half");
//   }
//   console.log("yay");
//   fetchUsers();
// };

// const loginUser = async () => {
//   const fakeEmail = `${discordName.value}@placeholder.xyz`;

//   const { data: signInData, error: signInError } =
//     await supabase.auth.signInWithPassword({
//       email: fakeEmail,
//       password: password.value,
//     });

//   if (signInError) {
//     console.log("Login failed:", signInError.message);
//   }

//   console.log("User logged in:", signInData.user);
// };

// onMounted(fetchUsers);
</script>

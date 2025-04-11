import { defineStore } from "pinia";
import { reactive } from "vue";
import { supabase } from "./supabase.js";
export const useUserStore = defineStore("user", () => {
  const userData = reactive({
    id: null,
    display_name: null,
    discord_username: null,
    region_id: null,
    qual_runs: [],
  });

  const loginUser = async (discordName, password) => {
    const fakeEmail = `${discordName}@placeholder.xyz`;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password: password,
    });

    if (signInError) {
      if (signInError.code == "invalid_credentials") {
        return {
          success: false,
          message: "That name / password combination was not found.",
        };
      } else {
        return {
          success: false,
          message: signInError.message,
        };
      }
    }
    return { success: true };
  };

  const signupUser = async (discordName, displayName, password, regionId) => {
    const fakeEmail = `${discordName}@placeholder.xyz`;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: fakeEmail,
        password: password,
      }
    );

    if (signUpError) {
      if (signUpError.code == "user_already_exists") {
        return {
          success: false,
          message: "That discord name is already in use.",
        };
      } else {
        return {
          success: false,
          message: "There was a problem with user creation.",
        };
      }
    }

    const userId = signUpData.user?.id;
    if (!userId)
      return {
        success: false,
        message:
          "No user ID returned from database; unable to continue with creation.",
      };

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        discord_username: discordName,
        display_name: displayName,
        region: regionId,
      },
    ]);

    if (insertError) {
      return {
        success: false,
        message: "There was a problem with user creation.",
      };
    }

    userData.id = userId;
    userData.display_name = displayName;
    userData.discord_username = discordName;
    userData.region_id = regionId;
    userData.qual_runs = [];

    return { success: true };
  };

  const retrieveUserData = () => {};

  return {
    userData,
    //functions
    loginUser,
    signupUser,
    retrieveUserData,
  };
});

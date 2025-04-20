import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { supabase } from "./supabase.js";
import CryptoJS from "crypto-js";
export const useUserStore = defineStore("user", () => {
  const userData = reactive({
    id: null,
    alt: null,
    username: null,
    display_name: null,
    region_id: null,
    runs: [],
  });

  const hashValue = (value) => {
    const hash = CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
    return `${hash.slice(0, 20)}`;
  };

  const loginUser = async (discordName, password) => {
    const hashed = hashValue(discordName);
    const fakeEmail = `${hashed}@placeholder.xyz`;

    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
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

    userData.id = authData.user.id;
    userData.username = hashed;
    await fetchProfile();

    return { success: true };
  };

  const signupUser = async (discordName, displayName, password, regionId) => {
    const hashed = hashValue(discordName);
    const fakeEmail = `${hashed}@placeholder.xyz`;

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
    userData.region_id = regionId;
    userData.username = hashed;
    userData.runs = [];

    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    userData.id = null;
    userData.display_name = null;
    userData.region_id = null;
    userData.runs = [];
    return { success: true };
  };

  const initAuth = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (session && session.user) {
      userData.id = session.user.id;
      await fetchProfile();
    }
    const email = session.user.email;
    if (email && email.endsWith("@placeholder.xyz")) {
      userData.username = email.replace("@placeholder.xyz", "");
    }
  };

  const fetchRuns = async () => {
    const { data: runsData, error: runsError } = await supabase
      .from("user_runs")
      .select(
        `
        id,
        exercise_group_id,
        created_at,
        notes,
        exercise_groups (
          name
        ),
        run_results (
          id,
          score,
          time_taken,
          exercise_id,
          exercises (
            name,
            ordering,
            max_points,
            par_time
          )
        )`
      )
      .eq("alt_user_id", userData.alt)
      .order("created_at", { ascending: false });

    if (runsError) {
      console.error("Error fetching runs:", runsError.message);
      return;
    }
    userData.runs = runsData;
  };

  const fetchProfile = async () => {
    const { data: profile, error } = await supabase
      .from("users")
      .select("display_name, region, alt_id")
      .eq("id", userData.id)
      .single();

    if (!error && profile) {
      userData.display_name = profile.display_name;
      userData.region_id = profile.region;
      userData.alt = profile.alt_id;
    }
    fetchRuns();
  };

  const retrieveUserData = () => {};

  const allUserRuns = computed(() => userData.runs ?? []);

  const updateDisplayName = async (changedDisplayName) => {
    if (changedDisplayName !== userData.display_name) {
      const { error } = await supabase
        .from("users")
        .update({ display_name: changedDisplayName })
        .eq("id", userData.id);
      if (error) {
        return { success: false };
      } else {
        userData.display_name = changedDisplayName;
        return { success: true };
      }
    }
  };

  const updatePassword = async (newPassword, currentPassword) => {
    const session = await supabase.auth.getSession();
    const email = session.data.session?.user?.email;
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (authError) {
      return { success: false, message: "Current password is incorrect." };
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value,
    });
    if (error) {
      return { success: false };
    } else {
      return {
        success: true,
        message: "Failed to update password. Please try again.",
      };
    }
  };

  return {
    userData,
    loginUser,
    signupUser,
    signOut,
    initAuth,
    retrieveUserData,
    allUserRuns,
    fetchProfile,
    fetchRuns,
    updateDisplayName,
    updatePassword,
  };
});

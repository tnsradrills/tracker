import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { supabase } from "./supabase.js";

export const useUserStore = defineStore("user", () => {
  const userData = reactive({
    id: null,
    alt: null,
    display_name: null,
    region_id: null,
    runs: [],
  });

  const loginUser = async (discordName, password) => {
    const fakeEmail = `${discordName}@placeholder.xyz`;

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
    await fetchProfile();

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
    userData.region_id = regionId;
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

    const { data: runsData, error: runsError } = await supabase
      .from("user_runs")
      .select(
        `
        id,
        exercise_group_id,
        created_at,
        notes,
        exercise_groups ( name ),
        run_results (
          id,
          score,
          time_taken,
          hit_zone,
          exercise_id,
          exercises (
            name,
            "order",
            max_points,
            par_time
          )
        )
      `
      )
      .eq("alt_user_id", userData.alt)
      .order("created_at", { ascending: false });

    if (runsError) {
      console.error("Error fetching runs:", runsError.message);
      return;
    }
    userData.runs = runsData;
  };

  const retrieveUserData = () => {};

  const allUserRuns = computed(() => userData.runs ?? []);

  return {
    userData,
    loginUser,
    signupUser,
    signOut,
    initAuth,
    retrieveUserData,
    allUserRuns,
  };
});

import { defineStore } from "pinia";
import { supabase } from "@/stores/supabase";
import { ref } from "vue";
export const useLeaderboardStore = defineStore("leaderboard", () => {
  const leaderboard = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const fetchLeaderboard = async (
    groupId,
    region = null,
    sort = "match_percentage"
  ) => {
    loading.value = true;
    error.value = null;

    let query = supabase
      .from("leaderboard_scores")
      .select("*")
      .eq("exercise_group_id", groupId);

    if (region && region !== "All") {
      query = query.eq("region", region);
    }

    if (["total_score", "average_score", "match_percentage"].includes(sort)) {
      query = query.order(sort, { ascending: false });
    }

    const { data, error: err } = await query;

    if (err) {
      error.value = err.message;
    } else {
      leaderboard.value = data;
    }

    loading.value = false;
  };

  return {
    leaderboard,
    loading,
    fetchLeaderboard,
  };
});

import { defineStore } from "pinia";
import { reactive } from "vue";
import { supabase } from "./supabase.js";
export const useExerciseStore = defineStore("exercise", () => {
  const exerciseGroupData = reactive({
    list: [
      {
        name: "All",
        id: 0,
      },
    ],
    loading: true,
  });

  const getExerciseGroups = async () => {
    const { data: groupData } = await supabase
      .from("exercise_groups")
      .select("*");

    if (groupData) {
      // Add the "All" option
      const allOption = { id: 0, name: "All" };

      // Combine and sort
      const sorted = [allOption, ...groupData].sort((a, b) => a.id - b.id);

      exerciseGroupData.list = sorted;
      exerciseGroupData.loading = false;
    }
  };

  return {
    exerciseGroupData,
    //functions
    getExerciseGroups,
  };
});

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
    const { data: groupData } = await supabase.from("exercise_groups").select();
    if (groupData) {
      const prependedData = [
        {
          name: "All",
          id: 0,
        },
        ...groupData,
      ];
      exerciseGroupData.list = prependedData;
      exerciseGroupData.loading = false;
    }
  };
  return {
    exerciseGroupData,
    //functions
    getExerciseGroups,
  };
});

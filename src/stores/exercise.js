import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
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

  const allExercises = ref([]);

  const newRunRecording = reactive({
    group_id: null,
    exercises: [],
  });

  const getExerciseGroups = async () => {
    const { data: groupData } = await supabase
      .from("exercise_groups")
      .select("*");

    if (groupData) {
      const allOption = { id: 0, name: "All" };

      const sorted = [allOption, ...groupData].sort((a, b) => a.id - b.id);

      exerciseGroupData.list = sorted;
      exerciseGroupData.loading = false;
    }
  };

  const createSelectableGroupsForNewRun = computed(() => {
    return exerciseGroupData.list.filter((l) => {
      return l.id != 0;
    });
  });

  const getAllExercises = async () => {
    const { data } = await supabase
      .from("exercises")
      .select("*")
      .order("group_id")
      .order("order");
    if (data) {
      allExercises.value = data;
    }
  };

  return {
    exerciseGroupData,
    createSelectableGroupsForNewRun,
    allExercises,
    newRunRecording,
    //functions
    getExerciseGroups,
    getAllExercises,
  };
});

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useExerciseStore } from "./exercise";
import { supabase } from "./supabase";
import { useUserStore } from "./userData";

export const useRunRecorderStore = defineStore("runRecorder", () => {
  const exerciseStore = useExerciseStore();

  const groupId = ref(null);
  const currentIndex = ref(0);
  const results = ref([]);

  const exercises = computed(() =>
    exerciseStore.allExercises.filter((e) => e.group_id === groupId.value)
  );

  const currentExercise = computed(() => exercises.value[currentIndex.value]);

  const setGroupId = (id) => {
    groupId.value = id;
    currentIndex.value = 0;
    results.value = [];
  };

  const saveResult = (score, time_taken) => {
    results.value[currentIndex.value] = {
      exercise_id: currentExercise.value.id,
      score: parseFloat(score),
      time_taken: parseFloat(time_taken),
    };
  };

  const goNext = () => {
    if (currentIndex.value < exercises.value.length - 1) {
      currentIndex.value++;
    }
  };

  const goBack = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };

  const cancelRun = () => {
    groupId.value = null;
    currentIndex.value = 0;
    results.value = [];
  };

  const submitRun = async () => {
    const userStore = useUserStore();
    if (
      !userStore.userData.alt ||
      !groupId.value ||
      results.value.length === 0
    ) {
      throw new Error("Missing required data to submit run.");
    }

    const { error } = await supabase.rpc("submit_run_transaction", {
      p_alt_user_id: userStore.userData.alt,
      p_group_id: groupId.value,
      p_results: results.value,
    });

    if (error) {
      throw new Error("Failed to submit run transactionally.");
    }

    groupId.value = null;
    currentIndex.value = 0;
    results.value = [];

    userStore.fetchRuns();

    return true;
  };

  return {
    groupId,
    currentIndex,
    results,
    exercises,
    currentExercise,
    setGroupId,
    saveResult,
    goNext,
    goBack,
    cancelRun,
    submitRun,
  };
});

// stores/runRecorder.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useExerciseStore } from "./exercise";

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
  };
});

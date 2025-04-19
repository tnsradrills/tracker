<script setup>
import { ref, computed } from "vue";
import { useSnackbarStore } from "@/stores/snackbar.js";
import { useRunRecorderStore } from "@/stores/runRecorder";
const runRecorderStore = useRunRecorderStore();
const snackbarStore = useSnackbarStore();
const props = defineProps({
  results: {
    type: Array,
    required: true,
  },
  exercises: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["submit", "edit", "cancel"]);

const editedResults = ref([...props.results]);

const getDistance = (id) => {
  return props.exercises.find((e) => e.id === id)?.distance_yards || "Unknown";
};

const getExerciseName = (id) => {
  return props.exercises.find((e) => e.id === id)?.name || "Unknown";
};

const getMaxScore = (id) => {
  return props.exercises.find((e) => e.id === id)?.max_points || "Unknown";
};

const hasParTime = (id) => {
  if (props.exercises.find((e) => e.id === id)?.par_time > 0) {
    return false;
  }
  return true;
};

const isScoreInvalid = (result) => {
  const max = getMaxScore(result.exercise_id);
  return typeof max === "number" && result.score > max;
};

const hasInvalidScores = computed(() =>
  editedResults.value.some((r) => isScoreInvalid(r))
);

const confirm = async () => {
  if (hasInvalidScores.value == true) {
    snackbarStore.addSnackbar(
      "One or more of the entered scores exceeds the maximum possible points for that exercise. Please update the score(s) accordingly.",
      "red-lighten-1",
      -1
    );
    return;
  }
  try {
    // Overwrite results in the store
    runRecorderStore.results = [...editedResults.value];
    await runRecorderStore.submitRun();
    emit("submitted");
  } catch (error) {
    console.error("Error submitting run:", error.message);
    alert("There was an error submitting your run. Please try again.");
  }
};

const edit = () => {
  emit("edit");
};

const cancel = () => {
  emit("cancel");
  runRecorderStore.cancelRun();
};
</script>

<template>
  <v-card class="mt-4" elevation="2">
    <v-card-title class="text-h6 font-weight-bold d-flex"
      ><div>Review Your Results</div>
      <v-spacer></v-spacer>
      <v-btn color="red" variant="outlined" @click="cancel">Cancel Run</v-btn>
    </v-card-title>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Distance</th>
            <th>Score</th>
            <th>Max Score</th>
            <th>Time (s)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in editedResults" :key="index">
            <td>{{ getExerciseName(result.exercise_id) }}</td>
            <td>{{ getDistance(result.exercise_id) }} yards</td>
            <td>
              <v-text-field
                v-model="editedResults[index].score"
                type="number"
                density="compact"
                hide-details
                :error="isScoreInvalid(result)"
              />
            </td>
            <td>{{ getMaxScore(result.exercise_id) }}</td>
            <td>
              <v-text-field
                v-model="editedResults[index].time_taken"
                type="number"
                density="compact"
                hide-details
                :disabled="hasParTime(result.exercise_id)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="edit" variant="outlined">Back to exercises</v-btn>
      <v-spacer />
      <v-btn @click="confirm" variant="outlined" color="primary">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

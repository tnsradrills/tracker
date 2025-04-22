<script setup>
import { ref, watch, computed } from "vue";
import { useRunRecorderStore } from "@/stores/runRecorder.js";
const emit = defineEmits(["complete"]);
const runRecorder = useRunRecorderStore();
const score = ref(null);
const timeTaken = ref(null);
const scoreForm = ref(null);
const scoreRules = computed(() => [
  (v) => (v !== null && v !== "") || "Score cannot be empty.",
  (v) =>
    parseFloat(v) <= runRecorder.currentExercise?.max_points ||
    `Score cannot exceed ${runRecorder.currentExercise?.max_points} points.`,
]);
const timeRules = [
  (v) => (v !== null && v !== "") || "Time cannot be empty.",
  (v) => !isNaN(parseFloat(v)) || "Time must be a number.",
];
watch(
  () => runRecorder.currentIndex,
  () => {
    const existing = runRecorder.results[runRecorder.currentIndex];
    score.value = existing?.score ?? null;
    timeTaken.value = existing?.time_taken ?? null;
  },
  { immediate: true }
);

const handleNext = async () => {
  const { valid } = await scoreForm.value.validate();
  if (!valid) return;
  runRecorder.saveResult(score.value, timeTaken.value);
  if (runRecorder.currentIndex < runRecorder.exercises.length - 1) {
    runRecorder.goNext();
  } else {
    emit("complete");
  }
};

const handleBack = () => {
  runRecorder.goBack();
};

const cancel = () => {
  runRecorder.cancelRun();
};
</script>

<template>
  <div>
    <v-slide-x-transition mode="out-in">
      <v-card
        v-if="runRecorder.currentExercise"
        :key="runRecorder.currentIndex"
        class="mt-4"
        elevation="2"
      >
        <v-card-title class="text-h6 font-weight-bold">
          {{ runRecorder.currentExercise.name }}
        </v-card-title>
        <v-card-subtitle class="text-caption">
          Exercise {{ runRecorder.currentIndex + 1 }} of
          {{ runRecorder.exercises.length }}
        </v-card-subtitle>
        <v-card-text>
          <div class="text-subtitle-1">
            <strong>Round Count:</strong>
            {{ runRecorder.currentExercise.rounds }}
          </div>
          <div class="text-subtitle-1">
            <strong>Distance:</strong>
            {{ runRecorder.currentExercise.distance_yards }} yards
          </div>
          <div class="text-subtitle-1">
            <strong>Par Time:</strong>
            {{ runRecorder.currentExercise.par_time ?? "N/A" }} seconds
          </div>
          <div class="text-subtitle-1">
            <strong>Start Position:</strong>
            {{
              runRecorder.currentExercise?.options?.start_position ??
              "Not specified"
            }}
          </div>
          <div
            v-if="runRecorder.currentExercise?.options?.hand_usage"
            class="text-subtitle-1"
          >
            <strong>Hand Usage:</strong>
            {{ runRecorder.currentExercise?.options?.hand_usage }}
          </div>
          <div v-if="runRecorder.currentExercise.options != null">
            <div
              v-if="runRecorder.currentExercise.options.modified_scoring"
              class="text-subtitle-1"
            >
              <strong>Modified Scoring Rules:</strong>
              {{ runRecorder.currentExercise.options.modified_scoring_desc }}
            </div>
          </div>
          <div class="text-subtitle-1 mt-2"><strong>Instructions:</strong></div>
          <div class="text-subtitle-1" style="white-space: pre-line">
            {{ runRecorder.currentExercise.instructions }}
          </div>
        </v-card-text>

        <v-card-text>
          <v-form ref="scoreForm"
            ><v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="score"
                  label="Score"
                  type="number"
                  variant="outlined"
                  step="0.01"
                  :rules="scoreRules"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="timeTaken"
                  label="Time (seconds)"
                  type="number"
                  variant="outlined"
                  step="0.01"
                  :rules="timeRules"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="cancel" variant="outlined" color="red"
            >Cancel Run</v-btn
          >
          <v-spacer />
          <v-btn
            @click="handleBack"
            variant="outlined"
            :disabled="runRecorder.currentIndex === 0"
            class="mr-3"
            >Back</v-btn
          >
          <v-btn @click="handleNext" color="primary" variant="outlined"
            >Next</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-slide-x-transition>
  </div>
</template>

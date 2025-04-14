<script setup>
import { ref, computed, watch } from "vue";
import { useExerciseStore } from "@/stores/exercise.js";

const props = defineProps({
  exerciseGroup: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["completed", "cancelled"]);

const exerciseStore = useExerciseStore();

const exercises = computed(() =>
  exerciseStore.allExercises.filter((e) => e.group_id === props.exerciseGroup)
);

const currentIndex = ref(0);
const recordedResults = ref([]);

const currentExercise = computed(() => exercises.value[currentIndex.value]);

const score = ref(null);
const timeTaken = ref(null);

// Load prior answers if they exist
const loadInputs = () => {
  const previous = recordedResults.value[currentIndex.value];
  score.value = previous?.score ?? null;
  timeTaken.value = previous?.time_taken ?? null;
};

// On component mount or when exercises load
watch(currentExercise, () => {
  loadInputs();
});

// Next
const nextExercise = () => {
  if (score.value != null && timeTaken.value != null) {
    recordedResults.value[currentIndex.value] = {
      exercise_id: currentExercise.value.id,
      score: parseFloat(score.value),
      time_taken: parseFloat(timeTaken.value),
    };

    if (currentIndex.value < exercises.value.length - 1) {
      currentIndex.value++;
    } else {
      emit("completed", recordedResults.value);
    }
  }
};

// Back
const previousExercise = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    loadInputs(); // restore saved values
  }
};

const cancelRun = () => {
  recordedResults.value = [];
  currentIndex.value = 0;
  score.value = null;
  timeTaken.value = null;
  emit("cancelled");
};
</script>

<template>
  <div>
    <v-alert v-if="exercises.length === 0" type="warning" class="my-4">
      No exercises found for this group.
    </v-alert>

    <v-row>
      <v-col cols="12" class="text-end">
        <v-btn size="small" @click="cancelRun">Cancel Run</v-btn>
      </v-col>
    </v-row>

    <v-slide-x-transition mode="out-in">
      <v-card
        v-if="currentExercise"
        :key="currentExercise.id"
        class="mt-4"
        elevation="2"
      >
        <v-card-title class="text-h6 font-weight-bold">
          {{ currentExercise.name }}
        </v-card-title>
        <v-card-subtitle class="text-caption text-right">
          Exercise {{ currentIndex + 1 }} of {{ exercises.length }}
        </v-card-subtitle>
        <v-card-text>
          <div class="text-subtitle-1">
            <strong>Distance:</strong>
            {{ currentExercise.distance_yards }} yards
          </div>
          <div class="text-subtitle-1">
            <strong>Par Time:</strong>
            {{ currentExercise.par_time ?? "No Par Time" }} seconds
          </div>
          <div class="text-subtitle-1">
            <strong>Start Position:</strong>
            {{ currentExercise.start_position }}
          </div>
          <div v-if="currentExercise.hand_usage" class="text-subtitle-1">
            <strong>Hand Limitation:</strong>
            {{ currentExercise.hand_usage }}
          </div>
          <div class="mt-2 text-subtitle-1" style="white-space: pre-line">
            {{ currentExercise.instructions }}
          </div>
        </v-card-text>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="auto">
              <v-text-field
                v-model="score"
                type="number"
                label="Score"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="auto">
              <v-text-field
                v-model="timeTaken"
                type="number"
                label="Time Taken (seconds)"
                variant="outlined"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            variant="outlined"
            :disabled="currentIndex === 0"
            @click="previousExercise"
          >
            Back
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn variant="tonal" @click="nextExercise" color="primary">
            {{ currentIndex === exercises.length - 1 ? "Finish" : "Next" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-slide-x-transition>
  </div>
</template>

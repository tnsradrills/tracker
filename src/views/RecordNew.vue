<script setup>
import { ref, computed, onMounted } from "vue";
import { useExerciseStore } from "@/stores/exercise.js";
import RunRecorder from "@/components/record-new/RunRecorder.vue";
const exerciseStore = useExerciseStore();
const selectedGroupId = ref(null);

const selectedGroup = computed(() => {
  return exerciseStore.exerciseGroupData.list.find(
    (group) => group.id === selectedGroupId.value
  );
});

const recordingRun = ref(false);

const startNewRun = () => {
  exerciseStore.newRunRecording.group_id = selectedGroupId.value;
  exerciseStore.newRunRecording.exercises = [];
  recordingRun.value = true;
};
onMounted(async () => {
  await exerciseStore.getExerciseGroups();
  await exerciseStore.getAllExercises();
});
</script>

<template>
  <v-container>
    <v-slide-x-transition mode="out-in">
      <div v-if="!recordingRun">
        <v-row class="mt-10">
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-select
                  v-model="selectedGroupId"
                  :items="exerciseStore.createSelectableGroupsForNewRun"
                  item-title="name"
                  item-value="id"
                  label="Select an Exercise Group"
                  :loading="exerciseStore.exerciseGroupData.loading"
                  variant="outlined"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="selectedGroup">
          <v-col cols="12">
            <v-card class="pa-4" elevation="2">
              <v-card-title class="text-h5 font-weight-bold">
                {{ selectedGroup.name }}
              </v-card-title>
              <v-card-text
                class="text-subtitle-1"
                style="white-space: pre-line"
              >
                {{ selectedGroup.description }}
              </v-card-text>
              <v-card-text class="text-h6 pb-0">Scoring:</v-card-text>
              <v-card-text
                class="text-subtitle-1"
                style="white-space: pre-line"
              >
                {{ selectedGroup.scoring_rules }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="center" class="pb-5" v-if="selectedGroup">
          <v-btn @click="startNewRun">Start</v-btn>
        </v-row>
      </div>

      <v-row v-if="recordingRun">
        <v-col cols="12">
          <RunRecorder
            :exercise-group="selectedGroupId"
            @completed="handleRunComplete"
            @cancelled="recordingRun = false"
          />
        </v-col>
      </v-row>
    </v-slide-x-transition>
  </v-container>
</template>
